# 🔧 Archivos Corregidos del Backend

## 1. HabitacionesController.cs - COMPLETO Y CORREGIDO

```csharp
using Microsoft.AspNetCore.Mvc;
using Hotelbackend.Repositories;
using Hotelbackend.Models;

namespace Hotelbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitacionesController : ControllerBase
    {
        private readonly HabitacionRepository _habitacionRepository;

        public HabitacionesController(HabitacionRepository habitacionRepository)
        {
            _habitacionRepository = habitacionRepository;
        }

        // GET: api/Habitaciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Habitacion>>> GetHabitaciones()
        {
            var habitaciones = await _habitacionRepository.GetAllAsync();
            return Ok(habitaciones);
        }

        // GET: api/Habitaciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Habitacion>> GetHabitacion(int id)
        {
            var habitacion = await _habitacionRepository.GetByIdAsync(id);
            
            if (habitacion == null)
            {
                return NotFound();
            }

            return Ok(habitacion);
        }

        // POST: api/Habitaciones
        [HttpPost]
        public async Task<ActionResult<Habitacion>> CreateHabitacion([FromBody] Habitacion habitacion)
        {
            if (habitacion == null)
            {
                return BadRequest("Los datos de la habitación son requeridos");
            }

            // Validaciones básicas
            if (string.IsNullOrWhiteSpace(habitacion.Nombre))
            {
                return BadRequest("El nombre de la habitación es requerido");
            }

            if (string.IsNullOrWhiteSpace(habitacion.Tipo))
            {
                return BadRequest("El tipo de habitación es requerido");
            }

            if (habitacion.Precio <= 0)
            {
                return BadRequest("El precio debe ser mayor a cero");
            }

            if (habitacion.Capacidad <= 0)
            {
                return BadRequest("La capacidad debe ser mayor a cero");
            }

            // Disponible es bool (no nullable), así que no necesitamos validar null
            // Si no viene, por defecto será false, así que lo establecemos en true
            habitacion.Disponible = true;

            var id = await _habitacionRepository.CreateAsync(habitacion);
            habitacion.Id = id;

            return CreatedAtAction(nameof(GetHabitacion), new { id = habitacion.Id }, habitacion);
        }

        // PUT: api/Habitaciones/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHabitacion(int id, [FromBody] Habitacion habitacion)
        {
            if (id != habitacion.Id)
            {
                return BadRequest("El ID de la URL no coincide con el ID del cuerpo");
            }

            // Verificar que la habitación existe
            var habitacionExistente = await _habitacionRepository.GetByIdAsync(id);
            if (habitacionExistente == null)
            {
                return NotFound();
            }

            // Validaciones
            if (string.IsNullOrWhiteSpace(habitacion.Nombre))
            {
                return BadRequest("El nombre de la habitación es requerido");
            }

            if (string.IsNullOrWhiteSpace(habitacion.Tipo))
            {
                return BadRequest("El tipo de habitación es requerido");
            }

            if (habitacion.Precio <= 0)
            {
                return BadRequest("El precio debe ser mayor a cero");
            }

            if (habitacion.Capacidad <= 0)
            {
                return BadRequest("La capacidad debe ser mayor a cero");
            }

            var result = await _habitacionRepository.UpdateAsync(habitacion);
            
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Habitaciones/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHabitacion(int id)
        {
            // Verificar que la habitación existe
            var habitacion = await _habitacionRepository.GetByIdAsync(id);
            if (habitacion == null)
            {
                return NotFound();
            }

            var result = await _habitacionRepository.DeleteAsync(id);
            
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
```

---

## 2. HabitacionRepository.cs - SIN DUPLICADOS

```csharp
using Dapper;
using System.Data;
using Hotelbackend.Models;

namespace Hotelbackend.Repositories
{
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

        // Crear habitación
        public async Task<int> CreateAsync(Habitacion habitacion)
        {
            var sql = @"INSERT INTO Habitaciones (Nombre, Descripcion, Tipo, Precio, Capacidad, Disponible, ImagenUrl)
                        VALUES (@Nombre, @Descripcion, @Tipo, @Precio, @Capacidad, @Disponible, @ImagenUrl);
                        SELECT CAST(SCOPE_IDENTITY() as int);";

            var id = await _db.ExecuteScalarAsync<int>(sql, habitacion);
            return id;
        }

        // Actualizar habitación
        public async Task<bool> UpdateAsync(Habitacion habitacion)
        {
            var sql = @"UPDATE Habitaciones
                        SET Nombre = @Nombre,
                            Descripcion = @Descripcion,
                            Tipo = @Tipo,
                            Precio = @Precio,
                            Capacidad = @Capacidad,
                            Disponible = @Disponible,
                            ImagenUrl = @ImagenUrl
                        WHERE Id = @Id";

            var rows = await _db.ExecuteAsync(sql, habitacion);
            return rows > 0;
        }

        // Eliminar habitación
        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "DELETE FROM Habitaciones WHERE Id = @Id";
            var rows = await _db.ExecuteAsync(sql, new { Id = id });
            return rows > 0;
        }
    }
}
```

---

## 3. ReservasController.cs - SIN VARIABLE SQL NO USADA

```csharp
using Microsoft.AspNetCore.Mvc;
using Hotelbackend.Repositories;
using Hotelbackend.Models;

namespace Hotelbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservasController : ControllerBase
    {
        private readonly ReservaRepository _reservaRepository;
        private readonly HabitacionRepository _habitacionRepository;

        public ReservasController(
            ReservaRepository reservaRepository,
            HabitacionRepository habitacionRepository)
        {
            _reservaRepository = reservaRepository;
            _habitacionRepository = habitacionRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<Reserva>> GetReservas()
        {
            return await _reservaRepository.GetAllAsync();
        }

        [HttpGet("User/{userId}")]
        public async Task<IEnumerable<Reserva>> GetReservasByUser(int userId)
        {
            return await _reservaRepository.GetByUserAsync(userId);
        }

        [HttpPost]
        public async Task<ActionResult> CreateReserva([FromBody] ReservaRequest request)
        {
            // Obtenemos la habitación para calcular el total
            var habitacion = await _habitacionRepository.GetByIdAsync(request.HabitacionId);
            if (habitacion == null)
                return BadRequest("Habitación no encontrada");

            var dias = (request.FechaSalida - request.FechaEntrada).Days;
            if (dias <= 0)
                return BadRequest("Las fechas no son válidas");

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
                Total = total
            };

            var id = await _reservaRepository.CreateAsync(reserva);
            reserva.Id = id;

            return CreatedAtAction(nameof(GetReservas), new { id = reserva.Id }, reserva);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEstado(int id, [FromBody] Reserva reserva)
        {
            if (id != reserva.Id)
                return BadRequest();

            var result = await _reservaRepository.UpdateAsync(reserva);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReserva(int id)
        {
            var result = await _reservaRepository.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpGet("VerificarDisponibilidad")]
        public async Task<ActionResult> VerificarDisponibilidad(
            [FromQuery] int habitacionId,
            [FromQuery] string fechaEntrada,
            [FromQuery] string fechaSalida)
        {
            try
            {
                // Convertir strings a DateTime
                if (!DateTime.TryParse(fechaEntrada, out DateTime fechaEntradaDate))
                {
                    return BadRequest(new { disponible = false, mensaje = "Fecha de entrada inválida" });
                }

                if (!DateTime.TryParse(fechaSalida, out DateTime fechaSalidaDate))
                {
                    return BadRequest(new { disponible = false, mensaje = "Fecha de salida inválida" });
                }

                // Validar que la fecha de salida sea posterior a la de entrada
                if (fechaSalidaDate <= fechaEntradaDate)
                {
                    return BadRequest(new { disponible = false, mensaje = "La fecha de salida debe ser posterior a la fecha de entrada" });
                }

                // Verificar disponibilidad usando el repositorio (SIN crear variable sql)
                var count = await _reservaRepository.VerificarDisponibilidadAsync(
                    habitacionId,
                    fechaEntradaDate,
                    fechaSalidaDate
                );

                if (count > 0)
                {
                    return Ok(new
                    {
                        disponible = false,
                        mensaje = "La habitación ya está reservada para esas fechas. Por favor, selecciona otras fechas."
                    });
                }

                return Ok(new { disponible = true, mensaje = "La habitación está disponible para esas fechas" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { disponible = false, mensaje = $"Error al verificar disponibilidad: {ex.Message}" });
            }
        }
    }
}
```

---

## 4. UsersController.cs - CORREGIDO (Namespace y using)

```csharp
using Microsoft.AspNetCore.Mvc;
using Hotelbackend.Repositories;
using Hotelbackend.Models;

namespace Hotelbackend.Controllers  // ⚠️ CAMBIADO de "repositories" a "Controllers"
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        public UsersController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost("Login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            var user = await _userRepository.LoginAsync(request.NombreUsuario, request.Password);

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

        [HttpGet]
        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _userRepository.GetAllAsync();
        }

        [HttpPost("Register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // Validar que los datos no estén vacíos
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Los datos del usuario son requeridos" });
                }

                if (string.IsNullOrWhiteSpace(request.Nombre))
                {
                    return BadRequest(new { success = false, message = "El nombre es requerido" });
                }

                if (string.IsNullOrWhiteSpace(request.NombreUsuario))
                {
                    return BadRequest(new { success = false, message = "El nombre de usuario es requerido" });
                }

                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest(new { success = false, message = "El email es requerido" });
                }

                if (string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { success = false, message = "La contraseña es requerida" });
                }

                // Verificar si el nombre de usuario ya existe
                var usuarios = await _userRepository.GetAllAsync();
                var usuarioExistente = usuarios.FirstOrDefault(u => u.NombreUsuario == request.NombreUsuario);
                if (usuarioExistente != null)
                {
                    return BadRequest(new { success = false, message = "El nombre de usuario ya está en uso" });
                }

                // Verificar si el email ya existe
                var emailExistente = await _userRepository.GetByEmailAsync(request.Email);
                if (emailExistente != null)
                {
                    return BadRequest(new { success = false, message = "El email ya está registrado" });
                }

                // Crear nuevo usuario
                var nuevoUsuario = new User
                {
                    Nombre = request.Nombre,
                    NombreUsuario = request.NombreUsuario,
                    Email = request.Email,
                    Password = request.Password,
                    Rol = "Cliente",
                    FechaCreacion = DateTime.Now
                };

                var id = await _userRepository.RegisterAsync(nuevoUsuario);
                nuevoUsuario.Id = id;

                return Ok(new
                {
                    success = true,
                    message = "Usuario registrado exitosamente",
                    id = nuevoUsuario.Id,
                    nombre = nuevoUsuario.Nombre,
                    nombreUsuario = nuevoUsuario.NombreUsuario,
                    email = nuevoUsuario.Email,
                    rol = nuevoUsuario.Rol
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error al registrar usuario: {ex.Message}" });
            }
        }
    }
}
```

---

## 5. Users.cs - AGREGAR RegisterRequest

```csharp
namespace Hotelbackend.Models
{
    // Representa un registro de la tabla Users
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

    // Clase para recibir el login desde Angular
    public class LoginRequest
    {
        public string NombreUsuario { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Respuesta del login
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

    // ⚠️ AGREGAR ESTA CLASE - Para recibir datos de registro
    public class RegisterRequest
    {
        public string Nombre { get; set; } = string.Empty;
        public string NombreUsuario { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
```

---

## 6. ReservaRepository.cs - YA ESTÁ BIEN (no cambiar nada)

Tu `ReservaRepository.cs` está correcto, no necesita cambios.

---

## 7. UserRepository.cs - YA ESTÁ BIEN (no cambiar nada)

Tu `UserRepository.cs` está correcto, no necesita cambios.

---

## 📋 RESUMEN DE CAMBIOS

### ✅ Archivos que SÍ debes cambiar:

1. **HabitacionesController.cs** - Eliminar código duplicado al final
2. **HabitacionRepository.cs** - Eliminar métodos duplicados (CreateAsync, UpdateAsync, DeleteAsync aparecen 2 veces)
3. **ReservasController.cs** - Eliminar la variable `sql` no usada en VerificarDisponibilidad
4. **UsersController.cs** - Cambiar namespace de `Hotelbackend.repositories` a `Hotelbackend.Controllers` y eliminar `using Microsoft.AspNetCore.Identity.Data;`
5. **Users.cs** - Agregar la clase `RegisterRequest`

### ✅ Archivos que NO debes cambiar:

- **ReservaRepository.cs** - Está correcto
- **UserRepository.cs** - Está correcto
- **Reserva.cs** - Está correcto
- **Habitacion.cs** - Está correcto

---

## 🎯 Pasos a seguir:

1. Copia cada archivo corregido y reemplaza el contenido completo en Visual Studio
2. Compila el proyecto (Ctrl+Shift+B)
3. Verifica que no haya errores
4. Ejecuta el proyecto (F5)

