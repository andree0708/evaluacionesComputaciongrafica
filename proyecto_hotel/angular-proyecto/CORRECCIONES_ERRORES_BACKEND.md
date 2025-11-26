# 🔧 Correcciones Específicas para Errores de Compilación

## Error 1: CS0104 - LoginRequest ambiguo

**Problema**: `'LoginRequest' es una referencia ambigua entre 'Hotelbackend.Models.LoginRequest' y 'Microsoft.AspNetCore.Identity.Data.LoginRequest'`

**Solución**: En `UsersController.cs`, al inicio del archivo, agrega un alias:

```csharp
using Microsoft.AspNetCore.Mvc;
using Hotelbackend.Repositories;
using Hotelbackend.Models;
using LoginRequest = Hotelbackend.Models.LoginRequest; // Agregar esta línea
```

Y en el método Login, usa el alias o el namespace completo:

```csharp
[HttpPost("Login")]
public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
{
    // ... código existente
}
```

---

## Error 2: CS1061 - RegisterRequest sin propiedades

**Problema**: `"RegisterRequest" no contiene una definición para "Nombre"`

**Solución**: Verifica que en `Models/User.cs` (o donde tengas los modelos) el `RegisterRequest` tenga estas propiedades:

```csharp
public class RegisterRequest
{
    public string Nombre { get; set; } = string.Empty;
    public string NombreUsuario { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

Si no existe, agrégalo al archivo donde están los modelos (probablemente `Models/User.cs`).

---

## Error 3: CS0105 - Using duplicado

**Problema**: `La directiva using para 'Microsoft.AspNetCore.Mvc' aparece previamente`

**Solución**: En `HabitacionesController.cs`, elimina el `using Microsoft.AspNetCore.Mvc;` duplicado. Debe aparecer solo UNA vez al inicio del archivo.

---

## Error 4: CS0472 - Comparación bool con bool?

**Problema**: `El resultado de la expresión siempre es 'false' porque un valor del tipo 'bool' nunca es igual a 'NULL'`

**Solución**: En `HabitacionesController.cs`, línea 72 (o donde esté la comparación), cambia:

**ANTES**:
```csharp
if (habitacion.Disponible == null)
{
    habitacion.Disponible = true;
}
```

**DESPUÉS**:
```csharp
if (!habitacion.Disponible.HasValue)
{
    habitacion.Disponible = true;
}
```

O si `Disponible` es `bool` (no nullable), simplemente elimina esa validación:

```csharp
// Si Disponible es bool (no nullable), no necesitas esta validación
// habitacion.Disponible ya tiene un valor por defecto
```

---

## Error 5: CS0219 - Variable 'sql' no usada

**Problema**: `La variable 'sql' está asignada pero su valor nunca se usa`

**Solución**: En `ReservasController.cs`, en el método `VerificarDisponibilidad`, elimina la variable `sql` que no se usa. El código debe quedar así:

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

        // Verificar disponibilidad usando el repositorio (sin crear variable sql)
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

---

## Resumen de Archivos a Modificar

1. **UsersController.cs**:
   - Agregar alias: `using LoginRequest = Hotelbackend.Models.LoginRequest;`
   - Cambiar método Register para usar `Hotelbackend.Models.RegisterRequest`

2. **Models/User.cs** (o donde estén los modelos):
   - Verificar que `RegisterRequest` tenga las propiedades: `Nombre`, `NombreUsuario`, `Email`, `Password`

3. **HabitacionesController.cs**:
   - Eliminar `using Microsoft.AspNetCore.Mvc;` duplicado
   - Cambiar `habitacion.Disponible == null` por `!habitacion.Disponible.HasValue`

4. **ReservasController.cs**:
   - Eliminar la variable `sql` no usada en `VerificarDisponibilidad`

---

## Verificación Final

Después de hacer estos cambios:

1. **Compila el proyecto** (Ctrl+Shift+B)
2. **Verifica que no haya errores** en la lista de errores
3. **Ejecuta el proyecto** (F5)
4. **Prueba en Swagger** que los endpoints funcionen

