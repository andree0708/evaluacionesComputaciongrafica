# Guía Completa: Backend con .NET API y SQL Server

## 📚 Índice
1. [Configuración de SQL Server](#1-configuración-de-sql-server)
2. [Creación del Proyecto .NET API](#2-creación-del-proyecto-net-api)
3. [Configuración de Entity Framework](#3-configuración-de-entity-framework)
4. [Modelos de Datos](#4-modelos-de-datos)
5. [Controladores API](#5-controladores-api)
6. [Configuración CORS](#6-configuración-cors)
7. [Integración con Angular](#7-integración-con-angular)

---

## 1. Configuración de SQL Server

### Paso 1.1: Instalar SQL Server Management Studio (SSMS)
1. Descarga e instala SSMS desde: https://aka.ms/ssmsfullsetup
2. Abre SSMS y conéctate a tu instancia local (usualmente `localhost` o `.\SQLEXPRESS`)

### Paso 1.2: Crear la Base de Datos
```sql
-- Ejecuta este script en SSMS
CREATE DATABASE HotelTropicalDB;
GO

USE HotelTropicalDB;
GO
```

### Paso 1.3: Crear las Tablas

**⚠️ IMPORTANTE: Debes ejecutar las tablas EN ESTE ORDEN porque Reservas tiene claves foráneas que dependen de Users y Habitaciones.**

```sql
-- PRIMERO: Eliminar tablas si existen (en orden inverso por las foreign keys)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Reservas]') AND type in (N'U'))
    DROP TABLE [dbo].[Reservas];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Habitaciones]') AND type in (N'U'))
    DROP TABLE [dbo].[Habitaciones];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
    DROP TABLE [dbo].[Users];
GO

-- SEGUNDO: Crear tabla Users (PRIMERO porque no tiene dependencias)
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    NombreUsuario NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Rol NVARCHAR(20) NOT NULL DEFAULT 'Cliente', -- 'Cliente' o 'Administrador'
    FechaCreacion DATETIME DEFAULT GETDATE()
);
GO

-- TERCERO: Crear tabla Habitaciones (SEGUNDO porque no tiene dependencias)
CREATE TABLE Habitaciones (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    Tipo NVARCHAR(50) NOT NULL, -- 'Doble', 'Suite', 'Individual'
    Precio DECIMAL(10,2) NOT NULL,
    Capacidad INT NOT NULL,
    Disponible BIT DEFAULT 1,
    ImagenUrl NVARCHAR(500)
);
GO

-- CUARTO: Crear tabla Reservas (ÚLTIMO porque depende de Users y Habitaciones)
CREATE TABLE Reservas (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    HabitacionId INT NOT NULL,
    NombreCompleto NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Telefono NVARCHAR(20),
    FechaEntrada DATE NOT NULL,
    FechaSalida DATE NOT NULL,
    MetodoPago NVARCHAR(50),
    Estado NVARCHAR(20) DEFAULT 'Pendiente', -- 'Pendiente', 'Confirmada', 'Cancelada'
    Total DECIMAL(10,2),
    FechaReserva DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Reservas_Users FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_Reservas_Habitaciones FOREIGN KEY (HabitacionId) REFERENCES Habitaciones(Id)
);
GO
```

**📝 Nota:** Si tienes errores, usa el archivo `SQL_CREATE_TABLES.sql` que tiene el script completo con manejo de errores.

### Paso 1.4: Insertar Datos de Prueba
```sql
-- Insertar usuarios de prueba
INSERT INTO Users (Nombre, NombreUsuario, Email, Password, Rol) VALUES
('Admin Principal', 'admin', 'admin@hotel.com', 'admin123', 'Administrador'),
('Juan Pérez', 'juanperez', 'juan@email.com', 'cliente123', 'Cliente'),
('María García', 'mariag', 'maria@email.com', 'cliente123', 'Cliente');
GO

-- Insertar habitaciones
INSERT INTO Habitaciones (Nombre, Descripcion, Tipo, Precio, Capacidad, Disponible) VALUES
('Habitación Doble', 'Hasta 4 personas, cama doble.', 'Doble', 150.00, 4, 1),
('Suite', 'Con vista al mar y jacuzzi.', 'Suite', 300.00, 2, 1),
('Habitación Individual', 'Ideal para una persona.', 'Individual', 80.00, 1, 1);
GO
```

---

## 2. Creación del Proyecto .NET API

### Paso 2.1: Crear el Proyecto en Visual Studio 2022
1. Abre Visual Studio 2022
2. **File → New → Project**
3. Busca **"ASP.NET Core Web API"**
4. Nombre: `HotelTropicalAPI`
5. Framework: **.NET 8.0** o **.NET 7.0**
6. Desmarca **"Use controllers"** si aparece (lo agregaremos manualmente)
7. Click **Create**

### Paso 2.2: Instalar Paquetes NuGet
Abre la **Package Manager Console** (Tools → NuGet Package Manager → Package Manager Console) y ejecuta:

```powershell
Install-Package Microsoft.EntityFrameworkCore
Install-Package Microsoft.EntityFrameworkCore.SqlServer
Install-Package Microsoft.EntityFrameworkCore.Tools
Install-Package Microsoft.AspNetCore.Cors
```

---

## 3. Configuración de Entity Framework

### Paso 3.1: Crear el DbContext
Crea una carpeta `Data` y dentro crea `HotelTropicalDbContext.cs`:

```csharp
using Microsoft.EntityFrameworkCore;
using HotelTropicalAPI.Models;

namespace HotelTropicalAPI.Data
{
    public class HotelTropicalDbContext : DbContext
    {
        public HotelTropicalDbContext(DbContextOptions<HotelTropicalDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Habitacion> Habitaciones { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
    }
}
```

### Paso 3.2: Configurar la Cadena de Conexión
En `appsettings.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=HotelTropicalDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

**Nota**: Si usas SQL Server Express, cambia `localhost` por `localhost\\SQLEXPRESS`

### Paso 3.3: Registrar el DbContext en Program.cs
```csharp
using Microsoft.EntityFrameworkCore;
using HotelTropicalAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar Entity Framework
builder.Services.AddDbContext<HotelTropicalDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();

app.Run();
```

---

## 4. Modelos de Datos

Crea una carpeta `Models` y agrega estos archivos:

### 4.1: User.cs
```csharp
namespace HotelTropicalAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string NombreUsuario { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Rol { get; set; } = "Cliente";
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }

    public class LoginRequest
    {
        public string NombreUsuario { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string NombreUsuario { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
```

### 4.2: Habitacion.cs
```csharp
namespace HotelTropicalAPI.Models
{
    public class Habitacion
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public int Capacidad { get; set; }
        public bool Disponible { get; set; } = true;
        public string? ImagenUrl { get; set; }
    }
}
```

### 4.3: Reserva.cs
```csharp
namespace HotelTropicalAPI.Models
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
        public DateTime FechaReserva { get; set; } = DateTime.Now;

        // Navegación
        public User? User { get; set; }
        public Habitacion? Habitacion { get; set; }
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

---

## 5. Controladores API

Crea una carpeta `Controllers` y agrega:

### 5.1: UsersController.cs
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelTropicalAPI.Data;
using HotelTropicalAPI.Models;

namespace HotelTropicalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly HotelTropicalDbContext _context;

        public UsersController(HotelTropicalDbContext context)
        {
            _context = context;
        }

        // POST: api/Users/Login
        [HttpPost("Login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.NombreUsuario == request.NombreUsuario 
                                           && u.Password == request.Password);

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
                    Id = user.Id,
                    Nombre = user.Nombre,
                    NombreUsuario = user.NombreUsuario,
                    Email = user.Email,
                    Rol = user.Rol,
                    Success = true,
                    Message = "Login exitoso"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new LoginResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                });
            }
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // POST: api/Users/Register
        [HttpPost("Register")]
        public async Task<ActionResult<User>> Register([FromBody] User user)
        {
            // Verificar si el usuario ya existe
            var existe = await _context.Users
                .AnyAsync(u => u.NombreUsuario == user.NombreUsuario || u.Email == user.Email);

            if (existe)
            {
                return BadRequest("El usuario o email ya existe");
            }

            user.Rol = "Cliente"; // Por defecto es cliente
            user.FechaCreacion = DateTime.Now;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
        }
    }
}
```

### 5.2: HabitacionesController.cs
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelTropicalAPI.Data;
using HotelTropicalAPI.Models;

namespace HotelTropicalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitacionesController : ControllerBase
    {
        private readonly HotelTropicalDbContext _context;

        public HabitacionesController(HotelTropicalDbContext context)
        {
            _context = context;
        }

        // GET: api/Habitaciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Habitacion>>> GetHabitaciones()
        {
            return await _context.Habitaciones.Where(h => h.Disponible).ToListAsync();
        }

        // GET: api/Habitaciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Habitacion>> GetHabitacion(int id)
        {
            var habitacion = await _context.Habitaciones.FindAsync(id);

            if (habitacion == null)
            {
                return NotFound();
            }

            return habitacion;
        }
    }
}
```

### 5.3: ReservasController.cs
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelTropicalAPI.Data;
using HotelTropicalAPI.Models;

namespace HotelTropicalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservasController : ControllerBase
    {
        private readonly HotelTropicalDbContext _context;

        public ReservasController(HotelTropicalDbContext context)
        {
            _context = context;
        }

        // GET: api/Reservas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reserva>>> GetReservas()
        {
            return await _context.Reservas
                .Include(r => r.User)
                .Include(r => r.Habitacion)
                .OrderByDescending(r => r.FechaReserva)
                .ToListAsync();
        }

        // GET: api/Reservas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Reserva>> GetReserva(int id)
        {
            var reserva = await _context.Reservas
                .Include(r => r.User)
                .Include(r => r.Habitacion)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reserva == null)
            {
                return NotFound();
            }

            return reserva;
        }

        // GET: api/Reservas/User/5
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<Reserva>>> GetReservasByUser(int userId)
        {
            return await _context.Reservas
                .Include(r => r.Habitacion)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.FechaReserva)
                .ToListAsync();
        }

        // POST: api/Reservas
        [HttpPost]
        public async Task<ActionResult<Reserva>> CreateReserva([FromBody] ReservaRequest request)
        {
            // Calcular el total
            var habitacion = await _context.Habitaciones.FindAsync(request.HabitacionId);
            if (habitacion == null)
            {
                return BadRequest("Habitación no encontrada");
            }

            var dias = (request.FechaSalida - request.FechaEntrada).Days;
            var total = habitacion.Precio * dias;

            var reserva = new Reserva
            {
                UserId = request.UserId,
                HabitacionId = request.HabitacionId,
                NombreCompleto = request.NombreCompleto,
                Email = request.Email,
                Telefono = request.Telefono,
                FechaEntrada = request.FechaEntrada,
                FechaSalida = request.FechaSalida,
                MetodoPago = request.MetodoPago,
                Estado = "Pendiente",
                Total = total,
                FechaReserva = DateTime.Now
            };

            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReserva), new { id = reserva.Id }, reserva);
        }

        // PUT: api/Reservas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReserva(int id, [FromBody] Reserva reserva)
        {
            if (id != reserva.Id)
            {
                return BadRequest();
            }

            _context.Entry(reserva).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReservaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Reservas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReserva(int id)
        {
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null)
            {
                return NotFound();
            }

            _context.Reservas.Remove(reserva);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReservaExists(int id)
        {
            return _context.Reservas.Any(e => e.Id == id);
        }
    }
}
```

---

## 6. Configuración CORS

Ya está configurado en el `Program.cs` del paso 3.3. Asegúrate de que el puerto de Angular (4200) esté permitido.

---

## 7. Integración con Angular

### Paso 7.1: Crear el Servicio de API
En Angular, crea `src/app/services/api.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:7128/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // Login
  login(nombreUsuario: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/Users/Login`, {
      nombreUsuario,
      password
    });
  }

  // Habitaciones
  getHabitaciones(): Observable<any> {
    return this.http.get(`${API_URL}/Habitaciones`);
  }

  // Reservas
  getReservas(): Observable<any> {
    return this.http.get(`${API_URL}/Reservas`);
  }

  getReservasByUser(userId: number): Observable<any> {
    return this.http.get(`${API_URL}/Reservas/User/${userId}`);
  }

  createReserva(reserva: any): Observable<any> {
    return this.http.post(`${API_URL}/Reservas`, reserva);
  }

  updateReserva(id: number, reserva: any): Observable<any> {
    return this.http.put(`${API_URL}/Reservas/${id}`, reserva);
  }

  deleteReserva(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/Reservas/${id}`);
  }
}
```

### Paso 7.2: Configurar HttpClient en app.config.ts
```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    provideHttpClient()
  ]
};
```

---

## 🚀 Ejecutar el Proyecto

1. **Ejecutar la API**:
   - En Visual Studio, presiona **F5** o click en **Run**
   - La API estará en `https://localhost:7128` (o el puerto que Visual Studio asigne)

2. **Ejecutar Angular**:
   ```bash
   ng serve
   ```

3. **Probar la API**:
   - Abre el navegador en `https://localhost:7128/swagger` para ver la documentación de la API
   - O usa Postman para probar los endpoints

---

## 📝 Notas Importantes

- **Seguridad**: En producción, NUNCA almacenes contraseñas en texto plano. Usa hashing (BCrypt, etc.)
- **Autenticación**: Considera implementar JWT tokens para autenticación real
- **Validaciones**: Agrega validaciones en el backend para datos de entrada
- **Manejo de Errores**: Implementa un manejo de errores más robusto

---

## 🔍 Verificar que Todo Funciona

1. Ejecuta la API y verifica que no haya errores
2. Abre Swagger y prueba el endpoint `/api/Users/Login` con:
   - nombreUsuario: `admin`
   - password: `admin123`
3. Deberías recibir una respuesta con `Success: true` y los datos del usuario

