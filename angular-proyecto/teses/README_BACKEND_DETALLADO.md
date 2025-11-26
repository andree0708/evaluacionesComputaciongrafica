# 🔧 README - Backend: Detalle Técnico

## 🎯 Descripción General

Este documento explica en detalle la estructura interna del backend, incluyendo modelos, repositorios, configuración de `Program.cs` y cómo se conecta todo.

---

## 📁 Estructura de Carpetas Detallada

### **Models/** (Modelos de Datos)

Los modelos representan las entidades de la base de datos y se usan para:
- Mapear resultados de Dapper a objetos C#
- Serializar/deserializar JSON en las peticiones HTTP
- Validar datos de entrada

#### **User.cs**

```csharp
namespace Hotelbackend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string NombreUsuario { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Rol { get; set; } = "Cliente";
        public DateTime FechaCreacion { get; set; }
    }

    // DTOs (Data Transfer Objects) para peticiones
    public class LoginRequest
    {
        public string NombreUsuario { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string NombreUsuario { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Nombre { get; set; } = string.Empty;
        public string NombreUsuario { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
```

**Propósito**:
- `User`: Representa un registro de la tabla `Users`
- `LoginRequest`: Datos que envía el frontend para login
- `LoginResponse`: Datos que retorna el backend después del login
- `RegisterRequest`: Datos que envía el frontend para registro

#### **Habitacion.cs**

```csharp
namespace Hotelbackend.Models
{
    public class Habitacion
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public int Capacidad { get; set; }
        public bool Disponible { get; set; }
        public string? ImagenUrl { get; set; }
    }
}
```

**Propósito**: Representa un registro de la tabla `Habitaciones`

#### **Reserva.cs**

```csharp
namespace Hotelbackend.Models
{
    public class Reserva
    {
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

    public class ReservaRequest
    {
        public int UserId { get; set; }
        public int HabitacionId { get; set; }
        public string NombreCompleto { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public DateTime FechaEntrada { get; set; }
        public DateTime FechaSalida { get; set; }
        public string? MetodoPago { get; set; }
    }
}
```

**Propósito**:
- `Reserva`: Representa un registro de la tabla `Reservas`
- `ReservaRequest`: Datos que envía el frontend para crear una reserva

---

### **Repositories/** (Repositorios con Dapper)

Los repositorios encapsulan toda la lógica de acceso a datos usando Dapper.

#### **UserRepository.cs**

```csharp
using Dapper;
using System.Data;
using Hotelbackend.Models;

namespace Hotelbackend.Repositories
{
    public class UserRepository
    {
        private readonly IDbConnection _db;

        public UserRepository(IDbConnection db)
        {
            _db = db;  // Inyectado desde Program.cs
        }

        public async Task<User?> LoginAsync(string nombreUsuario, string password)
        {
            var sql = @"SELECT * FROM Users 
                        WHERE NombreUsuario = @NombreUsuario AND Password = @Password";

            return await _db.QueryFirstOrDefaultAsync<User>(sql, new
            {
                NombreUsuario = nombreUsuario,
                Password = password
            });
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            var sql = "SELECT * FROM Users";
            return await _db.QueryAsync<User>(sql);
        }

        public async Task<int> RegisterAsync(User user)
        {
            var sql = @"INSERT INTO Users (Nombre, NombreUsuario, Email, Password, Rol)
                        VALUES (@Nombre, @NombreUsuario, @Email, @Password, @Rol);
                        SELECT CAST(SCOPE_IDENTITY() as int);";

            var id = await _db.ExecuteScalarAsync<int>(sql, user);
            return id;
        }
    }
}
```

**Explicación**:
- `IDbConnection _db`: Conexión a SQL Server inyectada
- `QueryFirstOrDefaultAsync<T>()`: Ejecuta SELECT y mapea a objeto `T`
- `QueryAsync<T>()`: Ejecuta SELECT y mapea a lista de `T`
- `ExecuteScalarAsync<int>()`: Ejecuta INSERT y retorna el ID generado
- Parámetros con `@NombreUsuario`: Dapper previene SQL injection automáticamente

#### **HabitacionRepository.cs**

```csharp
public class HabitacionRepository
{
    private readonly IDbConnection _db;

    public HabitacionRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Habitacion>> GetAllAsync()
    {
        var sql = "SELECT * FROM Habitaciones WHERE Disponible = 1";
        return await _db.QueryAsync<Habitacion>(sql);
    }

    public async Task<Habitacion?> GetByIdAsync(int id)
    {
        var sql = "SELECT * FROM Habitaciones WHERE Id = @Id";
        return await _db.QueryFirstOrDefaultAsync<Habitacion>(sql, new { Id = id });
    }
}
```

#### **ReservaRepository.cs**

```csharp
public class ReservaRepository
{
    private readonly IDbConnection _db;

    public ReservaRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Reserva>> GetAllAsync()
    {
        var sql = @"SELECT r.*, u.Nombre as NombreUsuario, h.Nombre as NombreHabitacion
                    FROM Reservas r
                    INNER JOIN Users u ON r.UserId = u.Id
                    INNER JOIN Habitaciones h ON r.HabitacionId = h.Id
                    ORDER BY r.FechaReserva DESC";

        return await _db.QueryAsync<Reserva>(sql);
    }

    public async Task<int> CreateAsync(Reserva reserva)
    {
        var sql = @"INSERT INTO Reservas 
                    (UserId, HabitacionId, NombreCompleto, Email, Telefono, 
                     FechaEntrada, FechaSalida, MetodoPago, Estado, Total, FechaReserva)
                    VALUES (@UserId, @HabitacionId, @NombreCompleto, @Email, @Telefono, 
                            @FechaEntrada, @FechaSalida, @MetodoPago, @Estado, @Total, GETDATE());
                    SELECT CAST(SCOPE_IDENTITY() as int);";

        var id = await _db.ExecuteScalarAsync<int>(sql, reserva);
        return id;
    }

    public async Task<bool> UpdateAsync(Reserva reserva)
    {
        var sql = @"UPDATE Reservas
                    SET Estado = @Estado
                    WHERE Id = @Id";

        var rows = await _db.ExecuteAsync(sql, reserva);
        return rows > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var sql = "DELETE FROM Reservas WHERE Id = @Id";
        var rows = await _db.ExecuteAsync(sql, new { Id = id });
        return rows > 0;
    }
}
```

**Explicación**:
- `ExecuteAsync()`: Ejecuta UPDATE/DELETE y retorna número de filas afectadas
- `SCOPE_IDENTITY()`: Obtiene el ID generado por IDENTITY después de INSERT
- JOINs: Permiten obtener datos relacionados en una sola query

---

### **Controllers/** (Controladores API)

Los controladores manejan las peticiones HTTP y orquestan la lógica de negocio.

#### **UsersController.cs** (Ejemplo completo)

```csharp
using Microsoft.AspNetCore.Mvc;
using Hotelbackend.Repositories;
using Hotelbackend.Models;

namespace Hotelbackend.Controllers
{
    [ApiController]  // Marca como controlador API
    [Route("api/[controller]")]  // Ruta base: /api/Users
    public class UsersController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        // Dependency Injection: ASP.NET inyecta UserRepository
        public UsersController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost("Login")]  // POST /api/Users/Login
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            var user = await _userRepository.LoginAsync(
                request.NombreUsuario, 
                request.Password
            );

            if (user == null)
            {
                return Ok(new LoginResponse
                {
                    Success = false,
                    Message = "Usuario o contraseña incorrectos"
                });
            }

            return Ok(new LoginResponse
            {
                Success = true,
                Message = "Login exitoso",
                Id = user.Id,
                Nombre = user.Nombre,
                NombreUsuario = user.NombreUsuario,
                Email = user.Email,
                Rol = user.Rol
            });
        }

        [HttpPost("Register")]  // POST /api/Users/Register
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            // Validar que no exista el usuario
            var existingUser = await _userRepository.LoginAsync(
                request.NombreUsuario, 
                request.Password
            );
            
            if (existingUser != null)
            {
                return BadRequest("El usuario ya existe");
            }

            var user = new User
            {
                Nombre = request.Nombre,
                NombreUsuario = request.NombreUsuario,
                Email = request.Email,
                Password = request.Password,
                Rol = "Cliente"  // Por defecto
            };

            var id = await _userRepository.RegisterAsync(user);
            user.Id = id;

            return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
        }
    }
}
```

**Explicación**:
- `[ApiController]`: Habilita validación automática y binding de JSON
- `[Route("api/[controller]")]`: `[controller]` se reemplaza por `Users`
- `[FromBody]`: Indica que los datos vienen en el body de la petición
- `ActionResult<T>`: Tipo de retorno que puede ser `Ok()`, `BadRequest()`, `Created()`, etc.
- `Task<...>`: Métodos asíncronos para no bloquear el hilo

---

## ⚙️ Program.cs: Configuración Principal

### Explicación Línea por Línea

```csharp
using System.Data;
using Microsoft.Data.SqlClient;
using Hotelbackend.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// 1. Crear el builder de la aplicación
var builder = WebApplication.CreateBuilder(args);
```

**Explicación**: `WebApplication.CreateBuilder()` crea un builder que permite configurar servicios y middleware.

```csharp
// 2. Agregar controladores (API)
builder.Services.AddControllers();
```

**Explicación**: Registra los controladores para que ASP.NET los reconozca.

```csharp
// 3. Swagger para documentación y pruebas
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
```

**Explicación**: 
- `AddEndpointsApiExplorer()`: Habilita exploración de endpoints
- `AddSwaggerGen()`: Genera documentación Swagger automáticamente

```csharp
// 4. Registrar conexión a SQL Server
builder.Services.AddScoped<IDbConnection>(sp =>
    new SqlConnection(builder.Configuration.GetConnectionString("DefaultConnection")));
```

**Explicación**:
- `AddScoped<>()`: Crea una instancia por petición HTTP (una conexión por request)
- `IDbConnection`: Interfaz estándar de .NET para conexiones de BD
- `SqlConnection`: Implementación específica para SQL Server
- `GetConnectionString()`: Lee la cadena de `appsettings.json`

```csharp
// 5. Registrar repositorios
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<HabitacionRepository>();
builder.Services.AddScoped<ReservaRepository>();
```

**Explicación**: 
- `AddScoped<>()`: Una instancia por petición HTTP
- ASP.NET inyecta automáticamente `IDbConnection` en los constructores

```csharp
// 6. Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")  // Frontend Angular
              .AllowAnyHeader()                      // Cualquier header
              .AllowAnyMethod()                      // GET, POST, PUT, DELETE
              .AllowCredentials();                   // Cookies/headers de auth
    });
});
```

**Explicación**:
- **CORS**: Permite que el frontend (puerto 4200) llame al backend (puerto 7265)
- Sin CORS, el navegador bloquearía las peticiones por seguridad
- `AllowCredentials()`: Permite enviar cookies/headers de autenticación

```csharp
// 7. Construir la aplicación
var app = builder.Build();
```

**Explicación**: Crea la aplicación con toda la configuración.

```csharp
// 8. Configurar pipeline HTTP (orden importa)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
```

**Explicación**: 
- Solo en desarrollo: muestra Swagger
- `UseSwagger()`: Genera JSON de Swagger
- `UseSwaggerUI()`: Interfaz web de Swagger

```csharp
app.UseHttpsRedirection();
```

**Explicación**: Redirige HTTP a HTTPS automáticamente.

```csharp
app.UseCors("AllowAngular");
```

**Explicación**: Aplica la política CORS configurada antes.

```csharp
app.UseAuthorization();
```

**Explicación**: Middleware de autorización (aunque no está configurado JWT, está listo para usarse).

```csharp
app.MapControllers();
```

**Explicación**: Mapea las rutas de los controladores.

```csharp
app.Run();
```

**Explicación**: Inicia el servidor y escucha peticiones.

---

## 🔌 Conexión a la Base de Datos

### Cadena de Conexión

**appsettings.json**:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=HotelTropicalDB;User Id=sa;Password=TU_PASSWORD;TrustServerCertificate=True;"
  }
}
```

**Componentes de la cadena**:
- `Server=localhost`: Servidor SQL Server (puede ser `localhost\SQLEXPRESS`)
- `Database=HotelTropicalDB`: Nombre de la base de datos
- `User Id=sa`: Usuario de SQL Server
- `Password=...`: Contraseña del usuario
- `TrustServerCertificate=True`: Acepta certificado SSL sin validar (solo desarrollo)

**Alternativa con Windows Authentication**:
```
Server=localhost;Database=HotelTropicalDB;Trusted_Connection=True;TrustServerCertificate=True;
```

### Flujo de Conexión

```
Program.cs registra IDbConnection
    ↓
Cada petición HTTP crea una nueva conexión (AddScoped)
    ↓
Repository recibe IDbConnection en constructor
    ↓
Repository ejecuta query con Dapper
    ↓
Dapper usa la conexión para comunicarse con SQL Server
    ↓
Al finalizar la petición, la conexión se cierra automáticamente
```

---

## 🔄 Flujo Completo de una Petición

### Ejemplo: Login

```
1. Frontend (Angular)
   POST https://localhost:7265/api/Users/Login
   Body: { "nombreUsuario": "admin", "password": "admin123" }
    ↓
2. ASP.NET Core recibe petición
    ↓
3. Routing identifica: UsersController.Login()
    ↓
4. Dependency Injection crea:
   - UserRepository (nuevo)
   - IDbConnection (nuevo, con cadena de appsettings.json)
    ↓
5. UsersController.Login() se ejecuta
    ↓
6. Llama a _userRepository.LoginAsync("admin", "admin123")
    ↓
7. UserRepository ejecuta SQL:
   SELECT * FROM Users WHERE NombreUsuario = @NombreUsuario AND Password = @Password
    ↓
8. SQL Server procesa query y retorna fila
    ↓
9. Dapper mapea fila a objeto User
    ↓
10. UserRepository retorna User
    ↓
11. UsersController crea LoginResponse
    ↓
12. ASP.NET serializa LoginResponse a JSON
    ↓
13. CORS agrega headers permitidos
    ↓
14. Response enviada al frontend
    ↓
15. Frontend recibe JSON y actualiza UI
```

---

## 📝 Notas Técnicas

### Por qué Dapper y no Entity Framework

- **Requisito del profesor**: Se especificó usar Dapper
- **Ventajas de Dapper**:
  - Más rápido (menos overhead)
  - SQL directo (más control)
  - Ligero (menos dependencias)
  - Ideal para proyectos pequeños/medianos

### Scoped vs Singleton vs Transient

- **Scoped** (usado aquí): Una instancia por petición HTTP
  - Ideal para repositorios y conexiones
  - Se crea al inicio de la petición, se destruye al final

- **Singleton**: Una instancia para toda la aplicación
  - No usar para conexiones (problemas de concurrencia)

- **Transient**: Nueva instancia cada vez que se solicita
  - Más overhead, no necesario aquí

### Async/Await

Todos los métodos de repositorios son `async` porque:
- Las operaciones de BD son I/O (esperan respuesta de SQL Server)
- `async/await` no bloquea el hilo principal
- Permite manejar más peticiones concurrentes

---

## 🔗 Archivos Clave

- `Program.cs`: Configuración principal (DI, CORS, middleware)
- `appsettings.json`: Configuración (cadena de conexión)
- `Models/*.cs`: Modelos de datos y DTOs
- `Repositories/*.cs`: Lógica de acceso a datos con Dapper
- `Controllers/*.cs`: Endpoints de la API

