# 🗄️ README - Backend: Estructura y Componentes

## 🎯 Descripción General

Este documento explica la estructura del backend de la aplicación Hotel Tropical, desarrollado con **ASP.NET Core Web API**, **Dapper** y **SQL Server**.

---

## 📊 Tablas de la Base de Datos

### 1. **Users** (Usuarios)

**Propósito**: Almacena información de usuarios del sistema

**Columnas**:
- `Id` (INT, PK, Identity): Identificador único
- `Nombre` (NVARCHAR(100)): Nombre completo del usuario
- `NombreUsuario` (NVARCHAR(50), UNIQUE): Nombre de usuario para login
- `Email` (NVARCHAR(100), UNIQUE): Correo electrónico
- `Password` (NVARCHAR(255)): Contraseña (en texto plano por ahora)
- `Rol` (NVARCHAR(20)): Rol del usuario (`Cliente` o `Administrador`)
- `FechaCreacion` (DATETIME): Fecha de creación del registro

**Datos de Prueba**:
- `admin` / `admin123` (Administrador)
- `juanperez` / `cliente123` (Cliente)
- `mariag` / `cliente123` (Cliente)

### 2. **Habitaciones** (Habitaciones)

**Propósito**: Almacena información de las habitaciones disponibles

**Columnas**:
- `Id` (INT, PK, Identity): Identificador único
- `Nombre` (NVARCHAR(100)): Nombre de la habitación
- `Descripcion` (NVARCHAR(500)): Descripción detallada
- `Tipo` (NVARCHAR(50)): Tipo de habitación (Doble, Suite, Individual)
- `Precio` (DECIMAL(10,2)): Precio por noche
- `Capacidad` (INT): Número máximo de personas
- `Disponible` (BIT): Si está disponible (1) o no (0)
- `ImagenUrl` (NVARCHAR(500)): URL de imagen (opcional)

**Datos de Prueba**:
- Habitación Doble: $150/noche, 4 personas
- Suite: $300/noche, 2 personas
- Habitación Individual: $80/noche, 1 persona

### 3. **Reservas** (Reservas)

**Propósito**: Almacena las reservas realizadas por los clientes

**Columnas**:
- `Id` (INT, PK, Identity): Identificador único
- `UserId` (INT, FK → Users.Id): Usuario que hizo la reserva
- `HabitacionId` (INT, FK → Habitaciones.Id): Habitación reservada
- `NombreCompleto` (NVARCHAR(100)): Nombre del cliente
- `Email` (NVARCHAR(100)): Email del cliente
- `Telefono` (NVARCHAR(20)): Teléfono de contacto
- `FechaEntrada` (DATE): Fecha de check-in
- `FechaSalida` (DATE): Fecha de check-out
- `MetodoPago` (NVARCHAR(50)): Método de pago (Visa, MasterCard, PayPal, Efecty)
- `Estado` (NVARCHAR(20)): Estado de la reserva (`Pendiente`, `Confirmada`, `Cancelada`)
- `Total` (DECIMAL(10,2)): Total calculado (precio × días)
- `FechaReserva` (DATETIME): Fecha en que se creó la reserva

**Relaciones**:
- `FK_Reservas_Users`: Foreign key a `Users(Id)`
- `FK_Reservas_Habitaciones`: Foreign key a `Habitaciones(Id)`

---

## 🏗️ Estructura del Proyecto Backend

```
Hotelbackend/
├── Controllers/          # Controladores API
│   ├── UsersController.cs
│   ├── HabitacionesController.cs
│   └── ReservasController.cs
├── Models/               # Modelos de datos
│   ├── User.cs
│   ├── Habitacion.cs
│   └── Reserva.cs
├── Repositories/         # Repositorios con Dapper
│   ├── UserRepository.cs
│   ├── HabitacionRepository.cs
│   └── ReservaRepository.cs
├── Data/                 # (Opcional, no usado en este proyecto)
├── Properties/           # Configuración del proyecto
├── appsettings.json      # Configuración (cadena de conexión)
└── Program.cs            # Configuración principal
```

---

## 🎮 Controladores (API Endpoints)

### **UsersController** (`Controllers/UsersController.cs`)

**Ruta base**: `/api/Users`

**Endpoints**:

#### `POST /api/Users/Login`
- **Propósito**: Autenticar usuario
- **Request Body**:
  ```json
  {
    "nombreUsuario": "admin",
    "password": "admin123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login exitoso",
    "id": 1,
    "nombre": "Admin Principal",
    "nombreUsuario": "admin",
    "email": "admin@hotel.com",
    "rol": "Administrador"
  }
  ```
- **Lógica**: 
  - Llama a `UserRepository.LoginAsync()`
  - Valida credenciales en SQL Server
  - Retorna datos del usuario si es válido

#### `POST /api/Users/Register`
- **Propósito**: Registrar nuevo usuario
- **Request Body**:
  ```json
  {
    "nombre": "Juan Pérez",
    "nombreUsuario": "juanperez",
    "email": "juan@email.com",
    "password": "cliente123"
  }
  ```
- **Response**: Usuario creado con ID generado
- **Lógica**:
  - Valida que el email y nombreUsuario no existan
  - Crea usuario con rol `Cliente` por defecto
  - Llama a `UserRepository.RegisterAsync()`

#### `GET /api/Users`
- **Propósito**: Obtener todos los usuarios (para admin)
- **Response**: Lista de usuarios

### **HabitacionesController** (`Controllers/HabitacionesController.cs`)

**Ruta base**: `/api/Habitaciones`

**Endpoints**:

#### `GET /api/Habitaciones`
- **Propósito**: Obtener todas las habitaciones disponibles
- **Response**: Lista de habitaciones con `Disponible = true`
- **Lógica**: Llama a `HabitacionRepository.GetAllAsync()`

#### `GET /api/Habitaciones/{id}`
- **Propósito**: Obtener una habitación por ID
- **Response**: Objeto habitación completo
- **Lógica**: Llama a `HabitacionRepository.GetByIdAsync(id)`

### **ReservasController** (`Controllers/ReservasController.cs`)

**Ruta base**: `/api/Reservas`

**Endpoints**:

#### `GET /api/Reservas`
- **Propósito**: Obtener todas las reservas (admin)
- **Response**: Lista completa de reservas
- **Lógica**: Llama a `ReservaRepository.GetAllAsync()`

#### `GET /api/Reservas/User/{userId}`
- **Propósito**: Obtener reservas de un usuario específico
- **Response**: Lista de reservas del usuario
- **Lógica**: Llama a `ReservaRepository.GetByUserAsync(userId)`

#### `POST /api/Reservas`
- **Propósito**: Crear una nueva reserva
- **Request Body**:
  ```json
  {
    "userId": 2,
    "habitacionId": 1,
    "nombreCompleto": "Juan Pérez",
    "email": "juan@email.com",
    "telefono": "123456789",
    "fechaEntrada": "2025-11-25",
    "fechaSalida": "2025-11-27",
    "metodoPago": "Visa"
  }
  ```
- **Lógica**:
  1. Obtiene la habitación para calcular el precio
  2. Calcula días: `(fechaSalida - fechaEntrada).Days`
  3. Calcula total: `precio × días`
  4. Crea reserva con estado `Pendiente`
  5. Llama a `ReservaRepository.CreateAsync()`
- **Response**: Reserva creada con ID generado

#### `PUT /api/Reservas/{id}`
- **Propósito**: Actualizar una reserva (principalmente el estado)
- **Request Body**: Objeto reserva completo
- **Lógica**: Llama a `ReservaRepository.UpdateAsync()`

#### `DELETE /api/Reservas/{id}`
- **Propósito**: Eliminar una reserva
- **Lógica**: Llama a `ReservaRepository.DeleteAsync(id)`

---

## 🔄 Repositorios (Capa de Acceso a Datos)

### **UserRepository** (`Repositories/UserRepository.cs`)

**Propósito**: Acceso a datos de usuarios usando Dapper

**Métodos**:

- `LoginAsync(nombreUsuario, password)`: 
  - SQL: `SELECT * FROM Users WHERE NombreUsuario = @NombreUsuario AND Password = @Password`
  - Retorna `User` o `null`

- `GetAllAsync()`: 
  - SQL: `SELECT * FROM Users`
  - Retorna lista de usuarios

- `RegisterAsync(user)`: 
  - SQL: `INSERT INTO Users (...) VALUES (...); SELECT CAST(SCOPE_IDENTITY() as int)`
  - Retorna ID del usuario creado

### **HabitacionRepository** (`Repositories/HabitacionRepository.cs`)

**Métodos**:

- `GetAllAsync()`: 
  - SQL: `SELECT * FROM Habitaciones WHERE Disponible = 1`
  - Retorna habitaciones disponibles

- `GetByIdAsync(id)`: 
  - SQL: `SELECT * FROM Habitaciones WHERE Id = @Id`
  - Retorna habitación específica

### **ReservaRepository** (`Repositories/ReservaRepository.cs`)

**Métodos**:

- `GetAllAsync()`: 
  - SQL: `SELECT r.*, u.Nombre, h.Nombre FROM Reservas r INNER JOIN Users u ON r.UserId = u.Id INNER JOIN Habitaciones h ON r.HabitacionId = h.Id`
  - Retorna reservas con información relacionada

- `GetByUserAsync(userId)`: 
  - SQL: `SELECT * FROM Reservas WHERE UserId = @UserId`
  - Retorna reservas de un usuario

- `CreateAsync(reserva)`: 
  - SQL: `INSERT INTO Reservas (...) VALUES (...); SELECT CAST(SCOPE_IDENTITY() as int)`
  - Retorna ID de la reserva creada

- `UpdateAsync(reserva)`: 
  - SQL: `UPDATE Reservas SET Estado = @Estado WHERE Id = @Id`
  - Retorna `true` si se actualizó

- `DeleteAsync(id)`: 
  - SQL: `DELETE FROM Reservas WHERE Id = @Id`
  - Retorna `true` si se eliminó

---

## 🔌 Comunicación entre Componentes

### Flujo de una Petición HTTP

```
Cliente (Angular) → HTTP Request
    ↓
ASP.NET Core Middleware
    ↓
Routing → Identifica controlador y método
    ↓
Controller recibe request
    ↓
Controller inyecta Repository (Dependency Injection)
    ↓
Repository ejecuta SQL con Dapper
    ↓
SQL Server procesa query
    ↓
Repository mapea resultados a Model
    ↓
Controller retorna Model como JSON
    ↓
Middleware → CORS → Response
    ↓
Cliente recibe JSON
```

### Dependency Injection

**Program.cs** registra servicios:
```csharp
// Conexión a BD
builder.Services.AddScoped<IDbConnection>(sp =>
    new SqlConnection(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositorios
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<HabitacionRepository>();
builder.Services.AddScoped<ReservaRepository>();
```

**Controladores** reciben repositorios en el constructor:
```csharp
public UsersController(UserRepository userRepository)
{
    _userRepository = userRepository;
}
```

### Dapper: Micro ORM

**Ventajas**:
- Más rápido que Entity Framework
- SQL directo (más control)
- Mapeo automático a objetos C#
- Ligero y simple

**Ejemplo de uso**:
```csharp
var sql = "SELECT * FROM Users WHERE NombreUsuario = @NombreUsuario";
var user = await _db.QueryFirstOrDefaultAsync<User>(sql, new { NombreUsuario = nombreUsuario });
```

---

## ⚙️ Configuración

### **appsettings.json**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=HotelTropicalDB;User Id=sa;Password=TU_PASSWORD;TrustServerCertificate=True;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

**⚠️ IMPORTANTE**: 
- Cambia `TU_PASSWORD` por la contraseña real de `sa`
- O usa `Trusted_Connection=True` si usas autenticación de Windows

### **Program.cs** (Configuración Principal)

Ver `README_BACKEND_DETALLADO.md` para explicación completa.

---

## 🔐 Seguridad

### Autenticación Actual

- **Simple**: Usuario y contraseña en texto plano
- **No hay JWT**: Cada petición requiere credenciales (o se valida en frontend)

### Recomendaciones para Producción

1. **Hashing de contraseñas**: Usar BCrypt o similar
2. **JWT Tokens**: Implementar tokens para autenticación stateless
3. **HTTPS obligatorio**: Ya configurado
4. **Validación de entrada**: Agregar validaciones en controladores
5. **Rate limiting**: Limitar peticiones por IP

---

## 🧪 Pruebas con Swagger

1. Ejecuta el backend (F5 en Visual Studio)
2. Abre: `https://localhost:7265/swagger`
3. Prueba endpoints:
   - `POST /api/Users/Login` con `admin/admin123`
   - `GET /api/Habitaciones`
   - `POST /api/Reservas` con datos de prueba

---

## 📝 Notas Importantes

1. **Dapper vs Entity Framework**: Este proyecto usa Dapper por requerimiento del profesor
2. **SQL directo**: Todos los queries están en los repositorios
3. **Sin migraciones**: Las tablas se crean manualmente con scripts SQL
4. **CORS**: Configurado para `http://localhost:4200` (frontend Angular)
5. **Puerto**: Por defecto `7265` (puede variar según Visual Studio)

---

## 🔗 Archivos Clave

- `Program.cs`: Configuración principal (CORS, DI, middleware)
- `appsettings.json`: Cadena de conexión a SQL Server
- `Controllers/*.cs`: Endpoints de la API
- `Repositories/*.cs`: Acceso a datos con Dapper
- `Models/*.cs`: Modelos de datos (DTOs)

