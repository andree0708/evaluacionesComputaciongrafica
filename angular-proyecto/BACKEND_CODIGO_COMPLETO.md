# 🔧 Código Completo para Backend

## 1. HabitacionesController.cs - CRUD Completo

Reemplaza todo el contenido de `HabitacionesController.cs` con esto:

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

            // Si Disponible es nullable, establecer por defecto
            if (!habitacion.Disponible.HasValue)
            {
                habitacion.Disponible = true;
            }

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

## 2. HabitacionRepository.cs - Agregar métodos faltantes

Agrega estos métodos a tu `HabitacionRepository.cs`:

```csharp
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
```

## 3. ReservasController.cs - Completar VerificarDisponibilidad

Reemplaza el método `VerificarDisponibilidad` en tu `ReservasController.cs`:

```csharp
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

        // Verificar disponibilidad usando el repositorio
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
```

## 4. ReservaRepository.cs - Agregar método VerificarDisponibilidadAsync

Agrega este método a tu `ReservaRepository.cs`:

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

    var count = await _db.ExecuteScalarAsync<int>(sql, new
    {
        HabitacionId = habitacionId,
        FechaEntrada = fechaEntrada,
        FechaSalida = fechaSalida
    });

    return count;
}
```

## 5. UsersController.cs - Corregir Register y Login

**IMPORTANTE**: Agrega esto al inicio del archivo para resolver el conflicto de LoginRequest:

```csharp
using Microsoft.AspNetCore.Mvc;
using Hotelbackend.Repositories;
using Hotelbackend.Models;
using LoginRequest = Hotelbackend.Models.LoginRequest; // Alias para evitar conflicto
```

**Método Register corregido**:

```csharp
[HttpPost("Register")]
public async Task<ActionResult> Register([FromBody] Hotelbackend.Models.RegisterRequest request)
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
```

**Método Login corregido** (para evitar el conflicto):

```csharp
[HttpPost("Login")]
public async Task<ActionResult<LoginResponse>> Login([FromBody] Hotelbackend.Models.LoginRequest request)
{
    // ... resto del código del método Login sin cambios
}
```

## 6. UserRepository.cs - Agregar método GetByEmailAsync

Agrega este método a tu `UserRepository.cs`:

```csharp
public async Task<User?> GetByEmailAsync(string email)
{
    var sql = "SELECT * FROM Users WHERE Email = @Email";
    return await _db.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
}
```

## 7. Corregir Namespace de ReservasController

Tu `ReservasController` está en el namespace incorrecto. Debe ser:

```csharp
namespace Hotelbackend.Controllers  // NO Hotelbackend.Repositories
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservasController : ControllerBase
    {
        // ... resto del código
    }
}
```

## 8. Verificar que el Model RegisterRequest tenga las propiedades correctas

Asegúrate de que en `Models/User.cs` (o donde tengas definido `RegisterRequest`) tenga estas propiedades:

```csharp
public class RegisterRequest
{
    public string Nombre { get; set; } = string.Empty;
    public string NombreUsuario { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

## 9. Resumen de Correcciones

1. **CS0104 (LoginRequest ambiguo)**: Usa `Hotelbackend.Models.LoginRequest` explícitamente o crea un alias
2. **CS1061 (RegisterRequest sin propiedades)**: Verifica que el modelo `RegisterRequest` tenga las propiedades `Nombre`, `NombreUsuario`, `Email`, `Password`
3. **CS0105 (using duplicado)**: Elimina el `using Microsoft.AspNetCore.Mvc;` duplicado en `HabitacionesController.cs`
4. **CS0472 (bool vs bool?)**: Cambia `habitacion.Disponible == null` por `!habitacion.Disponible.HasValue`
5. **CS0219 (variable sql no usada)**: Eliminé la variable `sql` del método `VerificarDisponibilidad` ya que se usa directamente en el repositorio

