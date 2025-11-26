# 📚 Documentación de la API Backend - Sistema de Gestión Hotelera

## Descripción General

La API Backend está desarrollada con **ASP.NET Core Web API** y utiliza **Dapper** como micro-ORM para interactuar con **SQL Server**. La arquitectura sigue el patrón **Repository** para separar la lógica de acceso a datos de los controladores.

### Estructura del Proyecto Backend

```
Hotelbackend/
├── Controllers/          # Controladores API (endpoints HTTP)
│   ├── UsersController.cs
│   ├── HabitacionesController.cs
│   └── ReservasController.cs
│
├── Repositories/         # Repositorios (acceso a datos con Dapper)
│   ├── UserRepository.cs
│   ├── HabitacionRepository.cs
│   └── ReservaRepository.cs
│
├── Models/              # Modelos de datos (DTOs y entidades)
│   ├── User.cs
│   ├── Habitacion.cs
│   └── Reserva.cs
│
├── Program.cs           # Configuración de la aplicación
└── appsettings.json     # Configuración (cadena de conexión)
```

---

## Configuración Base: Program.cs

### Propósito
`Program.cs` es el punto de entrada y configuración principal de la aplicación ASP.NET Core. Aquí se registran todos los servicios, se configura CORS, y se establece el pipeline HTTP.

### Funcionalidades Principales

```csharp
// 1. Registro de Controladores API
builder.Services.AddControllers();

// 2. Swagger para documentación y pruebas
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. Conexión a SQL Server usando Dapper
builder.Services.AddScoped<IDbConnection>(sp => 
    new SqlConnection(builder.Configuration.GetConnectionString("DefaultConnection")));

// 4. Registro de Repositorios (inyección de dependencias)
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<HabitacionRepository>();
builder.Services.AddScoped<ReservaRepository>();

// 5. CORS para permitir llamadas desde Angular (localhost:4200)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngular", policy => {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

### Pipeline HTTP

```csharp
// Desarrollo: Habilitar Swagger
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngular");  // Aplicar política CORS
app.UseAuthorization();
app.MapControllers();          // Mapear rutas de controladores
```

---

## Controllers (Controladores API)

Los controladores son los puntos de entrada HTTP de la API. Reciben peticiones del frontend, validan datos, llaman a los repositorios, y devuelven respuestas JSON.

---

### 1. UsersController.cs

**Ruta base:** `api/Users`

#### Propósito
Gestiona la autenticación y registro de usuarios.

#### Dependencias
- `UserRepository`: Para operaciones de base de datos relacionadas con usuarios

#### Endpoints

##### POST `/api/Users/Login`
**Descripción:** Autentica un usuario con nombre de usuario y contraseña.

**Request Body:**
```json
{
  "nombreUsuario": "juanperez",
  "password": "password123"
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "id": 1,
  "nombre": "Juan Pérez",
  "nombreUsuario": "juanperez",
  "email": "juan@example.com",
  "rol": "Cliente"
}
```

**Respuesta de Error (200 OK con success: false):**
```json
{
  "success": false,
  "message": "Usuario o contraseña incorrectos"
}
```

**Flujo:**
1. Recibe `LoginRequest` con `nombreUsuario` y `password`
2. Llama a `_userRepository.LoginAsync()` para buscar el usuario
3. Si el usuario existe y la contraseña coincide, devuelve `LoginResponse` con datos del usuario
4. Si no existe o la contraseña es incorrecta, devuelve error

**Código Clave:**
```csharp
[HttpPost("Login")]
public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
{
    var user = await _userRepository.LoginAsync(request.NombreUsuario, request.Password);
    if (user == null) {
        return Ok(new LoginResponse { 
            Success = false, 
            Message = "Usuario o contraseña incorrectos" 
        });
    }
    return Ok(new LoginResponse { 
        Success = true, 
        Message = "Login exitoso",
        Id = user.Id,
        Nombre = user.Nombre,
        // ... más campos
    });
}
```

---

##### POST `/api/Users/Register`
**Descripción:** Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "nombre": "María García",
  "nombreUsuario": "mariagarcia",
  "email": "maria@example.com",
  "password": "password123"
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "id": 5,
  "nombre": "María García",
  "nombreUsuario": "mariagarcia",
  "email": "maria@example.com",
  "rol": "Cliente"
}
```

**Validaciones:**
- Todos los campos son requeridos
- El nombre de usuario no debe existir previamente
- El email no debe estar registrado
- El rol se asigna automáticamente como "Cliente"

**Flujo:**
1. Valida que todos los campos estén presentes
2. Verifica si el nombre de usuario ya existe (llamando a `LoginAsync`)
3. Verifica si el email ya existe (llamando a `GetByEmailAsync`)
4. Si todo es válido, crea el usuario con `RegisterAsync`
5. Devuelve los datos del usuario creado

**Código Clave:**
```csharp
[HttpPost("Register")]
public async Task<ActionResult> Register([FromBody] RegisterRequest request)
{
    // Validaciones
    if (string.IsNullOrWhiteSpace(request.NombreUsuario)) {
        return BadRequest(new { success = false, message = "El nombre de usuario es requerido" });
    }
    
    // Verificar duplicados
    var usuarioExistente = await _userRepository.LoginAsync(request.NombreUsuario, request.Password);
    if (usuarioExistente != null) {
        return BadRequest(new { success = false, message = "El nombre de usuario ya está en uso" });
    }
    
    // Crear usuario
    var nuevoUsuario = new User {
        Nombre = request.Nombre,
        NombreUsuario = request.NombreUsuario,
        Email = request.Email,
        Password = request.Password,
        Rol = "Cliente",
        FechaCreacion = DateTime.Now
    };
    
    var id = await _userRepository.RegisterAsync(nuevoUsuario);
    return Ok(new { success = true, message = "Usuario registrado exitosamente", id = id });
}
```

---

##### GET `/api/Users`
**Descripción:** Obtiene la lista de todos los usuarios (útil para administración).

**Respuesta (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "nombreUsuario": "juanperez",
    "email": "juan@example.com",
    "rol": "Cliente",
    "fechaCreacion": "2024-01-15T10:30:00"
  },
  // ... más usuarios
]
```

---

### 2. HabitacionesController.cs

**Ruta base:** `api/Habitaciones`

#### Propósito
Gestiona las habitaciones del hotel (CRUD completo).

#### Dependencias
- `HabitacionRepository`: Para operaciones de base de datos relacionadas con habitaciones

#### Endpoints

##### GET `/api/Habitaciones`
**Descripción:** Obtiene todas las habitaciones disponibles.

**Respuesta (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Habitación Doble",
    "descripcion": "Hasta 4 personas, cama doble, escritorio y balcón",
    "tipo": "Doble",
    "precio": 150.00,
    "capacidad": 4,
    "disponible": true,
    "imagenUrl": "https://example.com/imagen.jpg"
  },
  // ... más habitaciones
]
```

**Flujo:**
1. Llama a `_habitacionRepository.GetAllAsync()`
2. El repositorio ejecuta: `SELECT * FROM Habitaciones WHERE Disponible = 1`
3. Devuelve la lista de habitaciones disponibles

---

##### GET `/api/Habitaciones/{id}`
**Descripción:** Obtiene una habitación específica por su ID.

**Parámetros:**
- `id` (int): ID de la habitación

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "nombre": "Habitación Doble",
  "descripcion": "Hasta 4 personas, cama doble, escritorio y balcón",
  "tipo": "Doble",
  "precio": 150.00,
  "capacidad": 4,
  "disponible": true,
  "imagenUrl": "https://example.com/imagen.jpg"
}
```

**Respuesta de Error (404 Not Found):**
Si la habitación no existe.

**Flujo:**
1. Llama a `_habitacionRepository.GetByIdAsync(id)`
2. Si existe, devuelve la habitación
3. Si no existe, devuelve 404

---

##### POST `/api/Habitaciones`
**Descripción:** Crea una nueva habitación (solo administradores).

**Request Body:**
```json
{
  "nombre": "Suite Presidencial",
  "descripcion": "Suite de lujo con jacuzzi",
  "tipo": "Suite",
  "precio": 500.00,
  "capacidad": 2,
  "disponible": true,
  "imagenUrl": "https://example.com/suite.jpg"
}
```

**Validaciones:**
- `nombre` es requerido
- `tipo` es requerido
- `precio` debe ser mayor a 0
- `capacidad` debe ser mayor a 0
- `disponible` se establece en `true` por defecto

**Respuesta Exitosa (201 Created):**
```json
{
  "id": 5,
  "nombre": "Suite Presidencial",
  // ... resto de campos
}
```

**Flujo:**
1. Valida los campos requeridos
2. Establece `disponible = true` por defecto
3. Llama a `_habitacionRepository.CreateAsync(habitacion)`
4. El repositorio ejecuta un `INSERT` y devuelve el ID generado
5. Devuelve la habitación creada con código 201

**Código Clave:**
```csharp
[HttpPost]
public async Task<ActionResult<Habitacion>> CreateHabitacion([FromBody] Habitacion habitacion)
{
    if (string.IsNullOrWhiteSpace(habitacion.Nombre)) {
        return BadRequest("El nombre de la habitación es requerido");
    }
    if (habitacion.Precio <= 0) {
        return BadRequest("El precio debe ser mayor a cero");
    }
    
    habitacion.Disponible = true;
    var id = await _habitacionRepository.CreateAsync(habitacion);
    habitacion.Id = id;
    
    return CreatedAtAction(nameof(GetHabitacion), new { id = habitacion.Id }, habitacion);
}
```

---

##### PUT `/api/Habitaciones/{id}`
**Descripción:** Actualiza una habitación existente.

**Parámetros:**
- `id` (int): ID de la habitación en la URL

**Request Body:**
```json
{
  "id": 1,
  "nombre": "Habitación Doble Actualizada",
  "precio": 180.00,
  // ... resto de campos
}
```

**Validaciones:**
- El `id` en la URL debe coincidir con el `id` en el body
- La habitación debe existir

**Respuesta Exitosa (204 No Content):**
Sin contenido en el body.

**Respuesta de Error (404 Not Found):**
Si la habitación no existe.

**Flujo:**
1. Verifica que el ID de la URL coincida con el del body
2. Verifica que la habitación exista
3. Llama a `_habitacionRepository.UpdateAsync(habitacion)`
4. Devuelve 204 si se actualizó correctamente

---

##### DELETE `/api/Habitaciones/{id}`
**Descripción:** Elimina una habitación (eliminación física de la base de datos).

**Parámetros:**
- `id` (int): ID de la habitación

**Respuesta Exitosa (204 No Content):**
Sin contenido en el body.

**Respuesta de Error (404 Not Found):**
Si la habitación no existe.

**Flujo:**
1. Llama a `_habitacionRepository.DeleteAsync(id)`
2. El repositorio ejecuta: `DELETE FROM Habitaciones WHERE Id = @Id`
3. Devuelve 204 si se eliminó correctamente

---

### 3. ReservasController.cs

**Ruta base:** `api/Reservas`

#### Propósito
Gestiona las reservas de habitaciones (CRUD completo y validación de disponibilidad).

#### Dependencias
- `ReservaRepository`: Para operaciones de base de datos relacionadas con reservas
- `HabitacionRepository`: Para obtener información de la habitación y calcular el total

#### Endpoints

##### GET `/api/Reservas`
**Descripción:** Obtiene todas las reservas del sistema (con información de usuario y habitación).

**Respuesta (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "habitacionId": 1,
    "nombreCompleto": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "123456789",
    "fechaEntrada": "2024-12-01T00:00:00",
    "fechaSalida": "2024-12-05T00:00:00",
    "metodoPago": "Tarjeta de crédito",
    "estado": "Confirmada",
    "total": 600.00,
    "fechaReserva": "2024-11-20T10:30:00"
  },
  // ... más reservas
]
```

**Flujo:**
1. Llama a `_reservaRepository.GetAllAsync()`
2. El repositorio ejecuta un `SELECT` con `JOIN` a `Users` y `Habitaciones`
3. Devuelve todas las reservas ordenadas por fecha de reserva descendente

---

##### GET `/api/Reservas/User/{userId}`
**Descripción:** Obtiene todas las reservas de un usuario específico.

**Parámetros:**
- `userId` (int): ID del usuario

**Respuesta (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    // ... resto de campos
  }
]
```

**Uso:** Útil para que los clientes vean solo sus propias reservas.

---

##### POST `/api/Reservas`
**Descripción:** Crea una nueva reserva.

**Request Body:**
```json
{
  "userId": 1,
  "habitacionId": 1,
  "nombreCompleto": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "123456789",
  "fechaEntrada": "2024-12-01",
  "fechaSalida": "2024-12-05",
  "metodoPago": "Tarjeta de crédito"
}
```

**Validaciones:**
- La habitación debe existir
- Las fechas deben ser válidas (fecha de salida > fecha de entrada)
- El total se calcula automáticamente: `precio * días`

**Respuesta Exitosa (201 Created):**
```json
{
  "id": 5,
  "userId": 1,
  "habitacionId": 1,
  "nombreCompleto": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "123456789",
  "fechaEntrada": "2024-12-01T00:00:00",
  "fechaSalida": "2024-12-05T00:00:00",
  "metodoPago": "Tarjeta de crédito",
  "estado": "Pendiente",
  "total": 600.00,
  "fechaReserva": "2024-11-20T10:30:00"
}
```

**Flujo:**
1. Obtiene la habitación con `_habitacionRepository.GetByIdAsync(request.HabitacionId)`
2. Calcula los días: `(fechaSalida - fechaEntrada).Days`
3. Calcula el total: `habitacion.Precio * dias`
4. Crea el objeto `Reserva` con estado "Pendiente"
5. Llama a `_reservaRepository.CreateAsync(reserva)`
6. Devuelve la reserva creada con código 201

**Código Clave:**
```csharp
[HttpPost]
public async Task<ActionResult> CreateReserva([FromBody] ReservaRequest request)
{
    var habitacion = await _habitacionRepository.GetByIdAsync(request.HabitacionId);
    if (habitacion == null) return BadRequest("Habitación no encontrada");
    
    var dias = (request.FechaSalida - request.FechaEntrada).Days;
    if (dias <= 0) return BadRequest("Las fechas no son válidas");
    
    var total = habitacion.Precio * dias;
    
    var reserva = new Reserva {
        UserId = request.UserId,
        HabitacionId = request.HabitacionId,
        NombreCompleto = request.NombreCompleto,
        Email = request.Email,
        Telefono = request.Telefono,
        FechaEntrada = request.FechaEntrada,
        FechaSalida = request.FechaSalida,
        MetodoPago = request.MetodoPago,
        Estado = "Pendiente",
        Total = total
    };
    
    var id = await _reservaRepository.CreateAsync(reserva);
    reserva.Id = id;
    
    return CreatedAtAction(nameof(GetReservas), new { id = reserva.Id }, reserva);
}
```

---

##### PUT `/api/Reservas/{id}`
**Descripción:** Actualiza el estado de una reserva (principalmente usado por administradores).

**Parámetros:**
- `id` (int): ID de la reserva

**Request Body:**
```json
{
  "id": 1,
  "estado": "Confirmada",
  // ... resto de campos (solo se actualiza el estado)
}
```

**Respuesta Exitosa (204 No Content):**
Sin contenido en el body.

**Uso:** Los administradores cambian el estado de "Pendiente" a "Confirmada" o "Cancelada".

---

##### DELETE `/api/Reservas/{id}`
**Descripción:** Elimina una reserva.

**Parámetros:**
- `id` (int): ID de la reserva

**Respuesta Exitosa (204 No Content):**
Sin contenido en el body.

---

##### GET `/api/Reservas/VerificarDisponibilidad`
**Descripción:** Verifica si una habitación está disponible para un rango de fechas específico.

**Query Parameters:**
- `habitacionId` (int): ID de la habitación
- `fechaEntrada` (string): Fecha de entrada (formato: "YYYY-MM-DD")
- `fechaSalida` (string): Fecha de salida (formato: "YYYY-MM-DD")

**Ejemplo de Request:**
```
GET /api/Reservas/VerificarDisponibilidad?habitacionId=1&fechaEntrada=2024-12-01&fechaSalida=2024-12-05
```

**Respuesta Disponible (200 OK):**
```json
{
  "disponible": true,
  "mensaje": "La habitación está disponible para esas fechas"
}
```

**Respuesta No Disponible (200 OK):**
```json
{
  "disponible": false,
  "mensaje": "La habitación ya está reservada para esas fechas. Por favor, selecciona otras fechas."
}
```

**Validaciones:**
- Las fechas deben ser válidas
- La fecha de salida debe ser posterior a la fecha de entrada
- Verifica que no haya reservas que se solapen con las fechas solicitadas

**Lógica de Solapamiento:**
Una reserva se solapa si:
- Su fecha de entrada está entre las fechas solicitadas, O
- Su fecha de salida está entre las fechas solicitadas, O
- Las fechas solicitadas están completamente dentro de una reserva existente

**Flujo:**
1. Convierte los strings de fecha a `DateTime`
2. Valida que la fecha de salida sea posterior a la de entrada
3. Llama a `_reservaRepository.VerificarDisponibilidadAsync()`
4. El repositorio ejecuta un `SELECT COUNT(*)` con condiciones de solapamiento
5. Si `count > 0`, la habitación NO está disponible
6. Devuelve el resultado con un mensaje descriptivo

**Código Clave:**
```csharp
[HttpGet("VerificarDisponibilidad")]
public async Task<ActionResult> VerificarDisponibilidad(
    [FromQuery] int habitacionId,
    [FromQuery] string fechaEntrada,
    [FromQuery] string fechaSalida)
{
    if (!DateTime.TryParse(fechaEntrada, out DateTime fechaEntradaDate)) {
        return BadRequest(new { disponible = false, mensaje = "Fecha de entrada inválida" });
    }
    
    if (fechaSalidaDate <= fechaEntradaDate) {
        return BadRequest(new { disponible = false, mensaje = "La fecha de salida debe ser posterior a la fecha de entrada" });
    }
    
    var count = await _reservaRepository.VerificarDisponibilidadAsync(
        habitacionId, fechaEntradaDate, fechaSalidaDate);
    
    if (count > 0) {
        return Ok(new { disponible = false, mensaje = "La habitación ya está reservada para esas fechas." });
    }
    
    return Ok(new { disponible = true, mensaje = "La habitación está disponible para esas fechas" });
}
```

---

## Repositories (Repositorios)

Los repositorios encapsulan toda la lógica de acceso a datos usando **Dapper**. Cada repositorio se encarga de una entidad específica (Users, Habitaciones, Reservas).

### Patrón Repository

**Ventajas:**
- Separación de responsabilidades (controladores no conocen SQL)
- Reutilización de código
- Facilita testing (se pueden mockear los repositorios)
- Centraliza la lógica de acceso a datos

**Inyección de Dependencias:**
Cada repositorio recibe `IDbConnection` en el constructor, que se configura en `Program.cs`.

---

### 1. UserRepository.cs

#### Propósito
Gestiona todas las operaciones de base de datos relacionadas con usuarios.

#### Métodos

##### `GetAllAsync()`
**Descripción:** Obtiene todos los usuarios de la base de datos.

**SQL Ejecutado:**
```sql
SELECT * FROM Users
```

**Retorna:** `Task<IEnumerable<User>>`

---

##### `GetByIdAsync(int id)`
**Descripción:** Obtiene un usuario por su ID.

**SQL Ejecutado:**
```sql
SELECT * FROM Users WHERE Id = @Id
```

**Parámetros:**
- `id` (int): ID del usuario

**Retorna:** `Task<User?>`

---

##### `LoginAsync(string nombreUsuario, string password)`
**Descripción:** Autentica un usuario verificando nombre de usuario y contraseña.

**SQL Ejecutado:**
```sql
SELECT * FROM Users 
WHERE NombreUsuario = @NombreUsuario AND Password = @Password
```

**Parámetros:**
- `nombreUsuario` (string): Nombre de usuario
- `password` (string): Contraseña (sin encriptar, en producción debería estar hasheada)

**Retorna:** `Task<User?>` (null si no encuentra coincidencia)

**Código:**
```csharp
public async Task<User?> LoginAsync(string nombreUsuario, string password)
{
    var sql = "SELECT * FROM Users WHERE NombreUsuario = @NombreUsuario AND Password = @Password";
    return await _db.QueryFirstOrDefaultAsync<User>(sql, new { NombreUsuario = nombreUsuario, Password = password });
}
```

---

##### `RegisterAsync(User user)`
**Descripción:** Inserta un nuevo usuario en la base de datos.

**SQL Ejecutado:**
```sql
INSERT INTO Users (Nombre, NombreUsuario, Email, Password, Rol, FechaCreacion)
VALUES (@Nombre, @NombreUsuario, @Email, @Password, @Rol, @FechaCreacion);
SELECT CAST(SCOPE_IDENTITY() as int);
```

**Parámetros:**
- `user` (User): Objeto con los datos del usuario

**Retorna:** `Task<int>` (ID del usuario creado)

**Código:**
```csharp
public async Task<int> RegisterAsync(User user)
{
    var sql = @"INSERT INTO Users (Nombre, NombreUsuario, Email, Password, Rol, FechaCreacion)
                VALUES (@Nombre, @NombreUsuario, @Email, @Password, @Rol, @FechaCreacion);
                SELECT CAST(SCOPE_IDENTITY() as int);";
    var id = await _db.ExecuteScalarAsync<int>(sql, user);
    return id;
}
```

**Explicación:**
- `SCOPE_IDENTITY()` devuelve el último ID auto-generado en la misma sesión
- `ExecuteScalarAsync<int>` ejecuta el SQL y devuelve el primer valor (el ID)

---

##### `GetByEmailAsync(string email)`
**Descripción:** Busca un usuario por su email (útil para verificar duplicados).

**SQL Ejecutado:**
```sql
SELECT * FROM Users WHERE Email = @Email
```

**Parámetros:**
- `email` (string): Email del usuario

**Retorna:** `Task<User?>`

---

### 2. HabitacionRepository.cs

#### Propósito
Gestiona todas las operaciones de base de datos relacionadas con habitaciones.

#### Métodos

##### `GetAllAsync()`
**Descripción:** Obtiene todas las habitaciones disponibles.

**SQL Ejecutado:**
```sql
SELECT * FROM Habitaciones WHERE Disponible = 1
```

**Retorna:** `Task<IEnumerable<Habitacion>>`

**Nota:** Solo devuelve habitaciones con `Disponible = 1` (true).

---

##### `GetByIdAsync(int id)`
**Descripción:** Obtiene una habitación por su ID.

**SQL Ejecutado:**
```sql
SELECT * FROM Habitaciones WHERE Id = @Id
```

**Parámetros:**
- `id` (int): ID de la habitación

**Retorna:** `Task<Habitacion?>`

---

##### `CreateAsync(Habitacion habitacion)`
**Descripción:** Inserta una nueva habitación.

**SQL Ejecutado:**
```sql
INSERT INTO Habitaciones (Nombre, Descripcion, Tipo, Precio, Capacidad, Disponible, ImagenUrl)
VALUES (@Nombre, @Descripcion, @Tipo, @Precio, @Capacidad, @Disponible, @ImagenUrl);
SELECT CAST(SCOPE_IDENTITY() as int);
```

**Parámetros:**
- `habitacion` (Habitacion): Objeto con los datos de la habitación

**Retorna:** `Task<int>` (ID de la habitación creada)

**Código:**
```csharp
public async Task<int> CreateAsync(Habitacion habitacion)
{
    var sql = @"INSERT INTO Habitaciones (Nombre, Descripcion, Tipo, Precio, Capacidad, Disponible, ImagenUrl)
                VALUES (@Nombre, @Descripcion, @Tipo, @Precio, @Capacidad, @Disponible, @ImagenUrl);
                SELECT CAST(SCOPE_IDENTITY() as int);";
    var id = await _db.ExecuteScalarAsync<int>(sql, habitacion);
    return id;
}
```

**Explicación de Dapper:**
- Dapper mapea automáticamente las propiedades del objeto `habitacion` a los parámetros `@Nombre`, `@Descripcion`, etc.
- No es necesario especificar cada parámetro manualmente si los nombres coinciden.

---

##### `UpdateAsync(Habitacion habitacion)`
**Descripción:** Actualiza una habitación existente.

**SQL Ejecutado:**
```sql
UPDATE Habitaciones 
SET Nombre = @Nombre, Descripcion = @Descripcion, Tipo = @Tipo, 
    Precio = @Precio, Capacidad = @Capacidad, Disponible = @Disponible, ImagenUrl = @ImagenUrl
WHERE Id = @Id
```

**Parámetros:**
- `habitacion` (Habitacion): Objeto con los datos actualizados (debe incluir `Id`)

**Retorna:** `Task<bool>` (true si se actualizó al menos una fila)

**Código:**
```csharp
public async Task<bool> UpdateAsync(Habitacion habitacion)
{
    var sql = @"UPDATE Habitaciones 
                SET Nombre = @Nombre, Descripcion = @Descripcion, Tipo = @Tipo, 
                    Precio = @Precio, Capacidad = @Capacidad, Disponible = @Disponible, ImagenUrl = @ImagenUrl
                WHERE Id = @Id";
    var rows = await _db.ExecuteAsync(sql, habitacion);
    return rows > 0;
}
```

**Explicación:**
- `ExecuteAsync` ejecuta el SQL y devuelve el número de filas afectadas
- Si `rows > 0`, significa que se actualizó al menos una fila (éxito)

---

##### `DeleteAsync(int id)`
**Descripción:** Elimina una habitación de la base de datos.

**SQL Ejecutado:**
```sql
DELETE FROM Habitaciones WHERE Id = @Id
```

**Parámetros:**
- `id` (int): ID de la habitación a eliminar

**Retorna:** `Task<bool>` (true si se eliminó al menos una fila)

**Código:**
```csharp
public async Task<bool> DeleteAsync(int id)
{
    var sql = "DELETE FROM Habitaciones WHERE Id = @Id";
    var rows = await _db.ExecuteAsync(sql, new { Id = id });
    return rows > 0;
}
```

---

### 3. ReservaRepository.cs

#### Propósito
Gestiona todas las operaciones de base de datos relacionadas con reservas.

#### Métodos

##### `GetAllAsync()`
**Descripción:** Obtiene todas las reservas con información de usuario y habitación.

**SQL Ejecutado:**
```sql
SELECT r.*, u.Nombre as NombreUsuario, h.Nombre as NombreHabitacion
FROM Reservas r
INNER JOIN Users u ON r.UserId = u.Id
INNER JOIN Habitaciones h ON r.HabitacionId = h.Id
ORDER BY r.FechaReserva DESC
```

**Retorna:** `Task<IEnumerable<Reserva>>`

**Explicación:**
- Usa `JOIN` para traer información relacionada de `Users` y `Habitaciones`
- Ordena por fecha de reserva descendente (más recientes primero)

---

##### `GetByUserAsync(int userId)`
**Descripción:** Obtiene todas las reservas de un usuario específico.

**SQL Ejecutado:**
```sql
SELECT * FROM Reservas WHERE UserId = @UserId
```

**Parámetros:**
- `userId` (int): ID del usuario

**Retorna:** `Task<IEnumerable<Reserva>>`

---

##### `CreateAsync(Reserva reserva)`
**Descripción:** Inserta una nueva reserva.

**SQL Ejecutado:**
```sql
INSERT INTO Reservas (UserId, HabitacionId, NombreCompleto, Email, Telefono, 
                      FechaEntrada, FechaSalida, MetodoPago, Estado, Total, FechaReserva)
VALUES (@UserId, @HabitacionId, @NombreCompleto, @Email, @Telefono, 
        @FechaEntrada, @FechaSalida, @MetodoPago, @Estado, @Total, GETDATE());
SELECT CAST(SCOPE_IDENTITY() as int);
```

**Parámetros:**
- `reserva` (Reserva): Objeto con los datos de la reserva

**Retorna:** `Task<int>` (ID de la reserva creada)

**Nota:** `GETDATE()` es una función de SQL Server que devuelve la fecha y hora actual del servidor.

---

##### `UpdateAsync(Reserva reserva)`
**Descripción:** Actualiza el estado de una reserva (principalmente usado para cambiar el estado).

**SQL Ejecutado:**
```sql
UPDATE Reservas SET Estado = @Estado WHERE Id = @Id
```

**Parámetros:**
- `reserva` (Reserva): Objeto con `Id` y `Estado` actualizados

**Retorna:** `Task<bool>`

**Nota:** En este caso, solo se actualiza el campo `Estado`. Si necesitas actualizar más campos, modifica el SQL.

---

##### `DeleteAsync(int id)`
**Descripción:** Elimina una reserva.

**SQL Ejecutado:**
```sql
DELETE FROM Reservas WHERE Id = @Id
```

**Parámetros:**
- `id` (int): ID de la reserva

**Retorna:** `Task<bool>`

---

##### `VerificarDisponibilidadAsync(int habitacionId, DateTime fechaEntrada, DateTime fechaSalida)`
**Descripción:** Verifica si hay reservas que se solapen con un rango de fechas específico.

**SQL Ejecutado:**
```sql
SELECT COUNT(*) 
FROM Reservas 
WHERE HabitacionId = @HabitacionId 
  AND Estado != 'Cancelada'
  AND (
    (FechaEntrada <= @FechaEntrada AND FechaSalida > @FechaEntrada) OR
    (FechaEntrada < @FechaSalida AND FechaSalida >= @FechaSalida) OR
    (FechaEntrada >= @FechaEntrada AND FechaSalida <= @FechaSalida)
  )
```

**Parámetros:**
- `habitacionId` (int): ID de la habitación
- `fechaEntrada` (DateTime): Fecha de entrada solicitada
- `fechaSalida` (DateTime): Fecha de salida solicitada

**Retorna:** `Task<int>` (número de reservas que se solapan)

**Lógica de Solapamiento:**
1. **Primera condición:** `(FechaEntrada <= @FechaEntrada AND FechaSalida > @FechaEntrada)`
   - La reserva existente comienza antes o en la fecha de entrada solicitada
   - Y termina después de la fecha de entrada solicitada
   - Ejemplo: Reserva existente: 01/12 - 10/12, Solicitud: 05/12 - 08/12 → Se solapa

2. **Segunda condición:** `(FechaEntrada < @FechaSalida AND FechaSalida >= @FechaSalida)`
   - La reserva existente comienza antes de la fecha de salida solicitada
   - Y termina en o después de la fecha de salida solicitada
   - Ejemplo: Reserva existente: 08/12 - 15/12, Solicitud: 05/12 - 10/12 → Se solapa

3. **Tercera condición:** `(FechaEntrada >= @FechaEntrada AND FechaSalida <= @FechaSalida)`
   - La reserva existente está completamente dentro del rango solicitado
   - Ejemplo: Reserva existente: 06/12 - 07/12, Solicitud: 05/12 - 10/12 → Se solapa

**Código:**
```csharp
public async Task<int> VerificarDisponibilidadAsync(int habitacionId, DateTime fechaEntrada, DateTime fechaSalida)
{
    var sql = @"SELECT COUNT(*) 
                FROM Reservas 
                WHERE HabitacionId = @HabitacionId 
                  AND Estado != 'Cancelada'
                  AND (
                    (FechaEntrada <= @FechaEntrada AND FechaSalida > @FechaEntrada) OR
                    (FechaEntrada < @FechaSalida AND FechaSalida >= @FechaSalida) OR
                    (FechaEntrada >= @FechaEntrada AND FechaSalida <= @FechaSalida)
                  )";
    var count = await _db.ExecuteScalarAsync<int>(sql, new { 
        HabitacionId = habitacionId, 
        FechaEntrada = fechaEntrada, 
        FechaSalida = fechaSalida 
    });
    return count;
}
```

**Explicación:**
- `ExecuteScalarAsync<int>` ejecuta el `SELECT COUNT(*)` y devuelve el número
- Si `count > 0`, significa que hay al menos una reserva que se solapa (habitación NO disponible)
- Si `count == 0`, la habitación está disponible

---

## Models (Modelos de Datos)

Los modelos representan las entidades de la base de datos y los DTOs (Data Transfer Objects) usados para recibir/enviar datos.

### User.cs

```csharp
public class User {
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string NombreUsuario { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Rol { get; set; } = "Cliente";
    public DateTime FechaCreacion { get; set; }
}

public class LoginRequest {
    public string NombreUsuario { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse {
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string NombreUsuario { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
}

public class RegisterRequest {
    public string Nombre { get; set; } = string.Empty;
    public string NombreUsuario { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

### Habitacion.cs

```csharp
public class Habitacion {
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public int Capacidad { get; set; }
    public bool Disponible { get; set; }
    public string? ImagenUrl { get; set; }
}
```

### Reserva.cs

```csharp
public class Reserva {
    public int Id { get; set; }
    public int UserId { get; set; }
    public int HabitacionId { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public DateTime FechaEntrada { get; set; }
    public DateTime FechaSalida { get; set; }
    public string? MetodoPago { get; set; }
    public string Estado { get; set; } = "Pendiente";
    public decimal? Total { get; set; }
    public DateTime FechaReserva { get; set; }
}

public class ReservaRequest {
    public int UserId { get; set; }
    public int HabitacionId { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public DateTime FechaEntrada { get; set; }
    public DateTime FechaSalida { get; set; }
    public string? MetodoPago { get; set; }
}
```

---

## Flujo de Datos Completo: Ejemplo de Crear Reserva

1. **Frontend (Angular):**
   - Usuario completa formulario de reserva
   - `ReservaComponent` llama a `ApiService.createReserva()`
   - `ApiService` hace `POST` a `https://localhost:7265/api/Reservas`

2. **Backend - Controller:**
   - `ReservasController.CreateReserva()` recibe el `ReservaRequest`
   - Valida que la habitación exista llamando a `HabitacionRepository.GetByIdAsync()`
   - Calcula el total

3. **Backend - Repository:**
   - `ReservaRepository.CreateAsync()` ejecuta el `INSERT` SQL
   - Devuelve el ID de la reserva creada

4. **Backend - Controller:**
   - Devuelve `201 Created` con la reserva creada

5. **Frontend:**
   - Recibe la respuesta y muestra mensaje de éxito
   - Redirige al usuario a la página de confirmación

---

## Consideraciones de Seguridad

### ⚠️ Notas Importantes para Producción

1. **Contraseñas:**
   - Actualmente las contraseñas se almacenan en texto plano
   - **En producción:** Deben estar hasheadas (usar `BCrypt` o `Identity`)

2. **Autenticación:**
   - No hay tokens JWT implementados
   - **En producción:** Implementar autenticación con tokens

3. **Validación de Roles:**
   - Los endpoints de administración no validan el rol del usuario
   - **En producción:** Implementar `[Authorize(Roles = "Administrador")]`

4. **SQL Injection:**
   - Dapper previene SQL Injection usando parámetros
   - ✅ **Seguro:** `WHERE Id = @Id`
   - ❌ **Inseguro:** `WHERE Id = " + id` (nunca hacer esto)

5. **CORS:**
   - Actualmente permite `http://localhost:4200`
   - **En producción:** Restringir a dominios específicos

---

## Conclusión

Esta API proporciona una base sólida para un sistema de gestión hotelera, con separación clara de responsabilidades entre controladores y repositorios. El uso de Dapper permite un control fino sobre las consultas SQL mientras mantiene el código limpio y mantenible.

