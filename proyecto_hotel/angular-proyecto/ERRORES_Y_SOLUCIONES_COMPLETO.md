# 🐛 Errores y Soluciones del Proyecto - Sistema de Gestión Hotelera

Este documento recopila todos los errores encontrados durante el desarrollo del proyecto y sus soluciones detalladas.

---

## 📋 Índice

1. [Errores de Frontend (Angular/TypeScript)](#errores-de-frontend)
2. [Errores de Backend (C# / ASP.NET Core)](#errores-de-backend)
3. [Errores de Base de Datos (SQL Server)](#errores-de-base-de-datos)
4. [Errores de Conexión Frontend-Backend](#errores-de-conexión)
5. [Errores de Dependencias (npm)](#errores-de-dependencias)
6. [Errores de Configuración](#errores-de-configuración)

---

## 🔵 Errores de Frontend

### Error 1: PowerShell `&&` Token

**Error:**
```
El token '&&' no es un separador de instrucciones válido en esta versión.
```

**Causa:**
PowerShell no reconoce `&&` como separador de comandos (eso es de bash/cmd).

**Solución:**
Usar `;` en lugar de `&&` o ejecutar comandos por separado:

```powershell
# ❌ Incorrecto
cd carpeta && ng serve

# ✅ Correcto
cd carpeta; ng serve

# O ejecutar por separado
cd carpeta
ng serve
```

---

### Error 2: PrimeNG v20 - Módulos No Encontrados

**Error:**
```
Could not resolve "primeng/sidebar"
Cannot find module 'primeng/sidebar'
Could not resolve "primeng/calendar"
```

**Causa:**
PrimeNG v20 introdujo cambios breaking. El proyecto usaba Angular 19, que no es compatible con PrimeNG v20.

**Solución:**
1. **Downgrade a PrimeNG v19:**
   ```json
   // package.json
   "primeng": "^19.1.4",
   "@angular/animations": "^19.2.0"
   ```

2. **Reinstalar dependencias:**
   ```bash
   npm install
   ```

3. **Reemplazar componentes no disponibles:**
   - `SidebarModule` → Sidebar personalizado con CSS
   - `CalendarModule` → Input HTML5 `<input type="date">`

---

### Error 3: No matching export 'DOCUMENT' y '@angular/animations'

**Error:**
```
No matching export in "node_modules/@angular/core/fesm2022/core.mjs" for import "DOCUMENT"
Could not resolve "@angular/animations/browser"
Could not resolve "@angular/animations"
```

**Causa:**
Incompatibilidad entre versiones de Angular y PrimeNG. El proyecto tenía Angular 19 con PrimeNG 20.

**Solución:**
1. **Verificar versiones en package.json:**
   ```json
   {
     "@angular/core": "^19.2.0",
     "@angular/animations": "^19.2.0",
     "primeng": "^19.1.4"
   }
   ```

2. **Limpiar e instalar:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### Error 4: Type 'string' no asignable a Severity

**Error:**
```
Type 'string' is not assignable to type '"success" | "info" | "secondary" | "warn" | "danger" | "contrast" | null | undefined'
```

**Causa:**
TypeScript infiere `string` en lugar de un literal type para propiedades como `tagSeverity`.

**Solución:**
Usar `as const` para forzar tipos literales:

```typescript
// ❌ Incorrecto
tagSeverity: 'success'

// ✅ Correcto
tagSeverity: 'success' as const

// Ejemplo completo
habitaciones = data.map((h: any) => ({
  tag: h.tipo === 'Suite' ? 'Lujo' : 'Más popular',
  tagSeverity: h.tipo === 'Suite' ? ('warn' as const) : ('success' as const)
}));
```

---

### Error 5: NG5002 - Incomplete block "@hotel"

**Error:**
```
NG5002: Incomplete block "hotel". If you meant to write the @ character, you should use the "&#64;" HTML entity instead.
```

**Causa:**
Angular interpreta `@` como inicio de un bloque de template (como `@if`, `@for`).

**Solución:**
Escapar el `@` en emails usando entidad HTML:

```html
<!-- ❌ Incorrecto -->
<p>info@hotel.com</p>

<!-- ✅ Correcto -->
<p>info&#64;hotel.com</p>
```

---

### Error 6: NG8002 - Propiedad 'cancel' no existe en p-rating

**Error:**
```
NG8002: Can't bind to 'cancel' since it isn't a known property of 'p-rating'.
```

**Causa:**
La propiedad `[cancel]` no existe en `p-rating` de PrimeNG v19.

**Solución:**
Eliminar la propiedad `[cancel]` del componente:

```html
<!-- ❌ Incorrecto -->
<p-rating [cancel]="false" [(ngModel)]="rating" [readonly]="true"></p-rating>

<!-- ✅ Correcto -->
<p-rating [(ngModel)]="rating" [readonly]="true"></p-rating>
```

---

### Error 7: RouterLink no usado en template

**Error:**
```
TS-998113: RouterLink is not used within the template of AdminComponent
```

**Causa:**
Se importó `RouterLink` pero no se usó en el template HTML.

**Solución:**
Agregar uso de `RouterLink` en el template o eliminarlo de los imports:

```typescript
// Opción 1: Usar RouterLink en el template
// admin.component.html
<p-button routerLink="/" label="Ver sitio público"></p-button>

// Opción 2: Eliminar de imports si no se usa
imports: [/* ... otros imports sin RouterLink */]
```

---

### Error 8: AuthService no encontrado - Ruta incorrecta

**Error:**
```
TS2307: Cannot find module '../services/auth.service'
TS-992003: No suitable injection token for parameter 'authService'
```

**Causa:**
Ruta incorrecta del import. `LayoutComponent` está en `components/layout/` y necesita subir dos niveles.

**Solución:**
Corregir la ruta del import:

```typescript
// ❌ Incorrecto (desde components/layout/)
import { AuthService } from '../services/auth.service';

// ✅ Correcto (sube dos niveles)
import { AuthService } from '../../services/auth.service';
```

**Estructura de carpetas:**
```
src/app/
├── components/
│   └── layout/
│       └── layout.component.ts  ← Aquí está el archivo
└── services/
    └── auth.service.ts  ← Necesita subir ../../ para llegar aquí
```

---

### Error 9: CommonModule no importado

**Error:**
```
NG8103: The `*ngIf` directive was used in the template, but neither the `NgIf` directive nor the `CommonModule` was imported.
```

**Causa:**
Se usó `*ngIf` o `*ngFor` en el template pero no se importó `CommonModule`.

**Solución:**
Agregar `CommonModule` a los imports:

```typescript
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, /* otros imports */]
})
```

---

### Error 10: DropdownModule no encontrado

**Error:**
```
TS2304: Cannot find name 'DropdownModule'.
TS-991010: 'imports' must be an array of components, directives, pipes, or NgModules.
```

**Causa:**
Se usó `DropdownModule` en el array de imports pero no se importó desde PrimeNG.

**Solución:**
Agregar el import:

```typescript
// Agregar el import
import { DropdownModule } from 'primeng/dropdown';

@Component({
  imports: [
    // ... otros imports
    DropdownModule  // Agregar aquí
  ]
})
```

---

### Error 11: Schema validation - Estilos en angular.json

**Error:**
```
Schema validation failed: Data path "/styles/0" must be object.
Data path "/styles/0" must match pattern "\.(?:css|scss|sass|less)$"
```

**Causa:**
Se intentó agregar `@primeuix/themes/lara-light-green` directamente en `angular.json` como string, pero Angular espera un objeto o una ruta de archivo CSS.

**Solución:**
1. **Remover de angular.json** la referencia directa al paquete
2. **Configurar en app.config.ts** usando `providePrimeNG`:

```typescript
// app.config.ts
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        }
      }
    })
  ]
};
```

3. **Agregar primeicons.css en styles.css:**
```css
/* styles.css */
@import "../node_modules/primeicons/primeicons.css";
```

---

### Error 12: checkRoomAvailability no existe en ApiService

**Error:**
```
Property 'checkRoomAvailability' does not exist on type 'ApiService'
```

**Causa:**
El método se llamaba `verificarDisponibilidad` pero se intentaba usar como `checkRoomAvailability`.

**Solución:**
Unificar el nombre del método:

```typescript
// api.service.ts
checkRoomAvailability(habitacionId: number, fechaEntrada: string, fechaSalida: string): Observable<any> {
  return this.http.get(`${API_URL}/Reservas/VerificarDisponibilidad`, {
    params: {
      habitacionId: habitacionId.toString(),
      fechaEntrada: fechaEntrada,
      fechaSalida: fechaSalida
    }
  });
}
```

---

## 🔴 Errores de Backend

### Error 13: CS0104 - LoginRequest ambiguo

**Error:**
```
CS0104: 'LoginRequest' es una referencia ambigua entre 'Hotelbackend.Models.LoginRequest' y 'Microsoft.AspNetCore.Identity.Data.LoginRequest'
```

**Causa:**
Conflicto entre el `LoginRequest` del proyecto y el de `Microsoft.AspNetCore.Identity.Data`.

**Solución:**
Agregar un alias en `UsersController.cs`:

```csharp
using Microsoft.AspNetCore.Mvc;
using Hotelbackend.Repositories;
using Hotelbackend.Models;
using LoginRequest = Hotelbackend.Models.LoginRequest; // ← Agregar esta línea

namespace Hotelbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        // Ahora LoginRequest se refiere a Hotelbackend.Models.LoginRequest
        [HttpPost("Login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            // ...
        }
    }
}
```

---

### Error 14: CS1061 - RegisterRequest sin propiedades

**Error:**
```
CS1061: "RegisterRequest" no contiene una definición para "Nombre"
```

**Causa:**
La clase `RegisterRequest` no estaba definida o no tenía las propiedades necesarias.

**Solución:**
Agregar la clase `RegisterRequest` en `Models/User.cs`:

```csharp
namespace Hotelbackend.Models
{
    public class User { /* ... */ }
    
    public class LoginRequest { /* ... */ }
    
    // ← Agregar esta clase
    public class RegisterRequest
    {
        public string Nombre { get; set; } = string.Empty;
        public string NombreUsuario { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
    
    public class LoginResponse { /* ... */ }
}
```

---

### Error 15: CS0105 - Using duplicado

**Error:**
```
CS0105: La directiva using para 'Microsoft.AspNetCore.Mvc' aparece previamente
```

**Causa:**
El `using Microsoft.AspNetCore.Mvc;` aparece dos veces en el mismo archivo.

**Solución:**
Eliminar el `using` duplicado. Debe aparecer solo UNA vez al inicio del archivo:

```csharp
// HabitacionesController.cs
using Microsoft.AspNetCore.Mvc;  // ← Solo una vez
using Hotelbackend.Repositories;
using Hotelbackend.Models;

namespace Hotelbackend.Controllers
{
    // ...
}
```

---

### Error 16: CS0472 - Comparación bool con bool?

**Error:**
```
CS0472: El resultado de la expresión siempre es 'false' porque un valor del tipo 'bool' nunca es igual a 'NULL' de tipo 'bool?'
```

**Causa:**
Se intentó comparar un `bool` (no nullable) con `null`.

**Solución:**
Si `Disponible` es `bool` (no nullable), eliminar la validación:

```csharp
// ❌ Incorrecto
if (habitacion.Disponible == null)
{
    habitacion.Disponible = true;
}

// ✅ Correcto (si Disponible es bool)
habitacion.Disponible = true; // No necesita validación

// Si Disponible es bool? (nullable), usar:
if (!habitacion.Disponible.HasValue)
{
    habitacion.Disponible = true;
}
```

---

### Error 17: CS0219 - Variable 'sql' no usada

**Error:**
```
CS0219: La variable 'sql' está asignada pero su valor nunca se usa
```

**Causa:**
Se declaró una variable `sql` pero no se usó porque la lógica se movió al repositorio.

**Solución:**
Eliminar la variable no usada:

```csharp
// ❌ Incorrecto
[HttpGet("VerificarDisponibilidad")]
public async Task<ActionResult> VerificarDisponibilidad(...)
{
    var sql = @"SELECT COUNT(*) ..."; // ← Variable no usada
    var count = await _reservaRepository.VerificarDisponibilidadAsync(...);
    // ...
}

// ✅ Correcto
[HttpGet("VerificarDisponibilidad")]
public async Task<ActionResult> VerificarDisponibilidad(...)
{
    // Llamar directamente al repositorio
    var count = await _reservaRepository.VerificarDisponibilidadAsync(...);
    // ...
}
```

---

### Error 18: CS0234 - Namespace 'Repositories' no existe

**Error:**
```
CS0234: El tipo o el nombre del espacio de nombres 'Repositories' no existe en el espacio de nombres 'Hotelbackend'
```

**Causa:**
El namespace en los archivos de repositorio no coincide con el `using` en `Program.cs`.

**Solución:**
Verificar que el namespace sea exactamente `Hotelbackend.Repositories`:

```csharp
// UserRepository.cs, HabitacionRepository.cs, ReservaRepository.cs
namespace Hotelbackend.Repositories  // ← Debe ser exactamente esto
{
    public class UserRepository { /* ... */ }
}

// Program.cs
using Hotelbackend.Repositories;  // ← Debe coincidir
```

**Nota:** El nombre de la carpeta física no importa, solo el namespace dentro del archivo.

---

### Error 19: Métodos duplicados en HabitacionRepository

**Error:**
```
CS0111: Type 'HabitacionRepository' already defines a member called 'CreateAsync' with the same parameters
```

**Causa:**
Se copiaron métodos duplicados en `HabitacionRepository.cs` (probablemente por copy-paste).

**Solución:**
Eliminar los métodos duplicados. Cada método debe aparecer solo UNA vez:

```csharp
public class HabitacionRepository
{
    // Cada método solo una vez
    public async Task<int> CreateAsync(Habitacion habitacion) { /* ... */ }
    public async Task<bool> UpdateAsync(Habitacion habitacion) { /* ... */ }
    public async Task<bool> DeleteAsync(int id) { /* ... */ }
    // No duplicar estos métodos
}
```

---

### Error 20: UsersController en namespace incorrecto

**Error:**
```
El controlador UsersController está en el namespace 'Hotelbackend.repositories' pero debería estar en 'Hotelbackend.Controllers'
```

**Causa:**
El archivo `UsersController.cs` tenía el namespace incorrecto.

**Solución:**
Corregir el namespace:

```csharp
// ❌ Incorrecto
namespace Hotelbackend.repositories
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase { /* ... */ }
}

// ✅ Correcto
namespace Hotelbackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase { /* ... */ }
}
```

---

## 🗄️ Errores de Base de Datos

### Error 21: Foreign Key - Tabla 'Users' no válida

**Error:**
```
La clave externa 'FK_Reservas_Users' hace referencia a la tabla no válida 'Users'.
La clave externa 'FK_Reservas_Habitaciones' hace referencia a la tabla no válida 'Habitaciones'.
```

**Causa:**
Se intentó crear la tabla `Reservas` antes de crear `Users` y `Habitaciones`. Las foreign keys no pueden referenciar tablas que no existen.

**Solución:**
Crear las tablas en el orden correcto:

```sql
-- 1. Primero eliminar en orden inverso (si existen)
DROP TABLE IF EXISTS Reservas;
DROP TABLE IF EXISTS Habitaciones;
DROP TABLE IF EXISTS Users;

-- 2. Crear en orden correcto
-- Primero: Users (no tiene dependencias)
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    NombreUsuario NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Rol NVARCHAR(20) NOT NULL DEFAULT 'Cliente',
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Segundo: Habitaciones (no tiene dependencias)
CREATE TABLE Habitaciones (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    Tipo NVARCHAR(50) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    Capacidad INT NOT NULL,
    Disponible BIT NOT NULL DEFAULT 1,
    ImagenUrl NVARCHAR(500)
);

-- Tercero: Reservas (depende de Users y Habitaciones)
CREATE TABLE Reservas (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    HabitacionId INT NOT NULL,
    NombreCompleto NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Telefono NVARCHAR(20),
    FechaEntrada DATETIME NOT NULL,
    FechaSalida DATETIME NOT NULL,
    MetodoPago NVARCHAR(50),
    Estado NVARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    Total DECIMAL(10,2),
    FechaReserva DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Reservas_Users FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_Reservas_Habitaciones FOREIGN KEY (HabitacionId) REFERENCES Habitaciones(Id)
);
```

---

### Error 22: Login failed for user 'LAPTOP-CVFQDUR2\Andrea'

**Error:**
```
Microsoft.Data.SqlClient.SqlException: Login failed for user 'LAPTOP-CVFQDUR2\Andrea'.
Cannot open database "HotelTropicalDB" requested by the login.
```

**Causa:**
La cadena de conexión usaba `Trusted_Connection=True`, que intenta autenticarse con el usuario de Windows actual, pero ese usuario no tiene permisos en SQL Server.

**Solución:**

**Opción 1: Usar autenticación de SQL Server (Recomendado)**

```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=HotelTropicalDB;User Id=sa;Password=TU_PASSWORD;TrustServerCertificate=True;"
  }
}
```

**Opción 2: Dar permisos al usuario de Windows**

1. Abrir SQL Server Management Studio (SSMS) como administrador
2. Conectar al servidor
3. Seguridad → Inicios de sesión → Click derecho → Nuevo inicio de sesión
4. Tipo: Usuario de Windows
5. Nombre: `LAPTOP-CVFQDUR2\Andrea` (o tu nombre de usuario)
6. Mapear a base de datos: Seleccionar `HotelTropicalDB`
7. Roles: Asignar `db_owner`
8. Aceptar

---

### Error 23: Login failed for user 'sa'

**Error:**
```
Login failed for user 'sa'.
Error Number:18456,State:1,Class:14
```

**Causa:**
1. Contraseña incorrecta en `appsettings.json`
2. Autenticación de SQL Server deshabilitada

**Solución:**

1. **Verificar contraseña:**
   - Abrir SSMS
   - Intentar conectar con `sa` y la contraseña
   - Si no funciona, la contraseña en `appsettings.json` es incorrecta

2. **Habilitar autenticación mixta:**
   - SSMS → Click derecho en el servidor → Propiedades
   - Pestaña "Seguridad"
   - Seleccionar "Autenticación de SQL Server y de Windows"
   - Aceptar
   - Reiniciar el servicio SQL Server:
     - Servicios de Windows → SQL Server (MSSQLSERVER) → Reiniciar

3. **Verificar que el usuario 'sa' esté habilitado:**
   - SSMS → Seguridad → Inicios de sesión → `sa`
   - Click derecho → Propiedades
   - Pestaña "Estado"
   - Habilitar inicio de sesión: Sí
   - Aceptar

---

### Error 24: Tabla no existe al ejecutar queries

**Error:**
```
Invalid object name 'Users'
Invalid object name 'Habitaciones'
```

**Causa:**
Las tablas no se crearon en la base de datos o se está conectando a una base de datos diferente.

**Solución:**

1. **Verificar que la base de datos existe:**
   ```sql
   SELECT name FROM sys.databases WHERE name = 'HotelTropicalDB';
   ```

2. **Verificar que las tablas existen:**
   ```sql
   USE HotelTropicalDB;
   SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
   ```

3. **Ejecutar el script SQL completo** para crear todas las tablas (ver `SQL_CREATE_TABLES.sql`)

4. **Verificar la cadena de conexión** en `appsettings.json` apunta a la base de datos correcta

---

## 🔌 Errores de Conexión

### Error 25: No se pudo conectar con el servidor (Frontend)

**Error:**
```
Error: No se pudo conectar con el servidor
[object ProgressEvent]
```

**Causa:**
1. Backend no está corriendo
2. Puerto incorrecto en `api.service.ts`
3. Certificado SSL no aceptado
4. CORS mal configurado

**Solución:**

1. **Verificar que el backend esté corriendo:**
   - Visual Studio debe mostrar: `Now listening on: https://localhost:7265`
   - Si no aparece, presionar F5 para ejecutar

2. **Verificar el puerto en api.service.ts:**
   ```typescript
   // src/app/services/api.service.ts
   const API_URL = 'https://localhost:7265/api'; // ← Verificar que coincida con Visual Studio
   ```

3. **Aceptar certificado SSL:**
   - Abrir `https://localhost:7265/swagger` en el navegador
   - Si aparece advertencia de certificado:
     - Click en "Avanzado" o "Advanced"
     - Click en "Continuar" o "Proceed to localhost"
   - Esto debe hacerse UNA vez por navegador

4. **Verificar CORS en Program.cs:**
   ```csharp
   builder.Services.AddCors(options => {
       options.AddPolicy("AllowAngular", policy => {
           policy.WithOrigins("http://localhost:4200")  // ← HTTP, no HTTPS
                 .AllowAnyHeader()
                 .AllowAnyMethod()
                 .AllowCredentials();
       });
   });
   ```

5. **Mejorar manejo de errores en el frontend:**
   ```typescript
   error: (error) => {
     if (error.status === 0) {
       this.errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución y el certificado SSL sea aceptado.';
     } else {
       this.errorMessage = error.error?.message || 'Error desconocido';
     }
   }
   ```

---

### Error 26: CORS Policy bloquea las peticiones

**Error:**
```
Access to XMLHttpRequest at 'https://localhost:7265/api/Users/Login' from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Causa:**
CORS no está configurado correctamente o el origen no coincide.

**Solución:**

1. **Verificar que CORS esté configurado en Program.cs:**
   ```csharp
   builder.Services.AddCors(options => {
       options.AddPolicy("AllowAngular", policy => {
           policy.WithOrigins("http://localhost:4200")  // ← Debe ser HTTP
                 .AllowAnyHeader()
                 .AllowAnyMethod()
                 .AllowCredentials();
       });
   });
   
   var app = builder.Build();
   
   // IMPORTANTE: UseCors debe estar ANTES de UseAuthorization
   app.UseCors("AllowAngular");
   app.UseAuthorization();
   ```

2. **Verificar que el frontend use HTTP (no HTTPS):**
   - Angular por defecto usa `http://localhost:4200`
   - Si cambiaste a HTTPS, actualiza CORS para incluir ambos orígenes

---

### Error 27: Certificado SSL no confiable

**Error:**
```
NET::ERR_CERT_AUTHORITY_INVALID
```

**Causa:**
El certificado SSL autofirmado de IIS Express no es confiable para el navegador.

**Solución:**

1. **Aceptar el certificado manualmente:**
   - Abrir `https://localhost:7265/swagger` en el navegador
   - Click en "Avanzado" → "Continuar a localhost"

2. **Confiar en el certificado de desarrollo (Windows):**
   ```powershell
   # Ejecutar como administrador
   dotnet dev-certs https --trust
   ```

3. **Si el problema persiste:**
   - Reiniciar el navegador
   - Limpiar caché del navegador
   - Probar en otro navegador

---

## 📦 Errores de Dependencias

### Error 28: npm error code ERESOLVE

**Error:**
```
npm error code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! peer @angular/core@"^20.0.0" from primeng@20.3.0
```

**Causa:**
Conflicto de versiones entre `primeng@20.3.0` (requiere Angular 20) y `@angular/core@19.2.0`.

**Solución:**

1. **Downgrade PrimeNG a v19:**
   ```json
   // package.json
   {
     "dependencies": {
       "@angular/core": "^19.2.0",
       "@angular/animations": "^19.2.0",
       "primeng": "^19.1.4"
     }
   }
   ```

2. **Instalar con legacy peer deps (si es necesario):**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Limpiar e instalar:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### Error 29: PrimeIcons no se muestran

**Error:**
Los iconos de PrimeIcons no se muestran (aparecen cuadrados o nada).

**Causa:**
El CSS de PrimeIcons no está importado.

**Solución:**

Agregar en `styles.css`:

```css
/* styles.css */
@import "../node_modules/primeicons/primeicons.css";
```

O verificar que `primeicons` esté instalado:

```bash
npm install primeicons
```

---

## ⚙️ Errores de Configuración

### Error 30: Habitación N/A en panel de administración

**Error:**
En el panel de administración aparece "Habitación N/A" en lugar del nombre de la habitación.

**Causa:**
El backend no está devolviendo la información de la habitación junto con la reserva, o el mapeo en el frontend es incorrecto.

**Solución:**

1. **Verificar que el repositorio haga JOIN:**
   ```csharp
   // ReservaRepository.cs - GetAllAsync()
   var sql = @"SELECT r.*, u.Nombre as NombreUsuario, h.Nombre as NombreHabitacion
               FROM Reservas r
               INNER JOIN Users u ON r.UserId = u.Id
               INNER JOIN Habitaciones h ON r.HabitacionId = h.Id
               ORDER BY r.FechaReserva DESC";
   ```

2. **Mapear correctamente en el frontend:**
   ```typescript
   // admin.component.ts
   cargarReservas() {
     this.apiService.getReservas().subscribe({
       next: (data) => {
         this.reservas = data.map((reserva: any) => {
           // Si el backend trae la habitación, usarla
           if (reserva.habitacion) {
             reserva.habitacionNombre = reserva.habitacion.nombre;
           } else if (reserva.habitacionId) {
             // Si no, buscar en el array local
             const habitacion = this.habitaciones.find(h => h.id === reserva.habitacionId);
             reserva.habitacionNombre = habitacion ? habitacion.nombre : `Habitación #${reserva.habitacionId}`;
           }
           return reserva;
         });
       }
     });
   }
   ```

---

### Error 31: Imágenes no se muestran desde URLs externas

**Error:**
Las imágenes de habitaciones o servicios no se muestran aunque la URL es válida.

**Causa:**
1. CORS bloquea las imágenes desde dominios externos
2. URLs incorrectas o rotas
3. Navegador bloquea contenido mixto (HTTP/HTTPS)

**Solución:**

1. **Usar URLs de servicios confiables:**
   - Unsplash: `https://images.unsplash.com/photo-...`
   - Pexels: `https://images.pexels.com/photos/...`

2. **Verificar que las URLs sean HTTPS:**
   ```typescript
   imagenUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop'
   ```

3. **Si usas imágenes locales, servir desde el backend:**
   - Crear carpeta `wwwroot/images` en el backend
   - Configurar archivos estáticos en `Program.cs`
   - Usar URLs relativas: `/images/habitacion1.jpg`

---

### Error 32: Mensaje de "Sesión cerrada" no aparece

**Error:**
Al cerrar sesión, no aparece el mensaje toast de confirmación.

**Causa:**
`MessageService` no está disponible en el componente o `ToastModule` no está importado.

**Solución:**

1. **Agregar ToastModule al LayoutComponent:**
   ```typescript
   // layout.component.ts
   import { ToastModule } from 'primeng/toast';
   
   @Component({
     imports: [/* ... otros imports */, ToastModule]
   })
   ```

2. **Agregar <p-toast> en el template:**
   ```html
   <!-- layout.component.html -->
   <div class="layout-container">
     <p-toast></p-toast>  <!-- ← Agregar esto -->
     <!-- resto del contenido -->
   </div>
   ```

3. **Inyectar MessageService en AuthService:**
   ```typescript
   // auth.service.ts
   constructor(
     private apiService: ApiService,
     private router: Router,
     private messageService: MessageService  // ← Inyectar
   ) {}
   
   logout(): void {
     localStorage.removeItem('currentUser');
     this.currentUserSubject.next(null);
     this.messageService.add({  // ← Usar aquí
       severity: 'info',
       summary: 'Sesión cerrada',
       detail: 'Has cerrado sesión correctamente'
     });
     this.router.navigate(['/']);
   }
   ```

---

## 📝 Resumen de Lecciones Aprendidas

1. **PowerShell**: Usar `;` en lugar de `&&` para separar comandos
2. **PrimeNG**: Usar v19 con Angular 19, no v20
3. **TypeScript**: Usar `as const` para tipos literales
4. **Angular Templates**: Escapar `@` como `&#64;` en emails
5. **SQL Server**: Crear tablas en orden (sin dependencias primero)
6. **Autenticación SQL**: Verificar contraseña y habilitar autenticación mixta
7. **CORS**: Configurar para `http://localhost:4200` (HTTP, no HTTPS)
8. **Namespaces**: Verificar que coincidan entre archivos
9. **Imports**: Verificar rutas relativas correctas (`../` vs `../../`)
10. **Manejo de errores**: Distinguir entre errores de conexión (status 0) y errores del servidor
11. **Certificados SSL**: Aceptar manualmente en desarrollo o usar `dotnet dev-certs https --trust`
12. **Dependencias**: Verificar compatibilidad de versiones antes de instalar

---

## 🔧 Comandos Útiles para Debug

```bash
# Limpiar y reinstalar dependencias (Frontend)
rm -rf node_modules package-lock.json
npm install

# Verificar versiones
ng version
npm list primeng
dotnet --version

# Compilar y ver errores
ng build
dotnet build

# Ejecutar y ver errores en consola
ng serve
dotnet run

# Confiar en certificado SSL de desarrollo
dotnet dev-certs https --trust
```

---

## 🆘 Checklist de Solución de Problemas

Si nada funciona, seguir este orden:

1. ✅ **Verificar que el backend esté corriendo** (Visual Studio muestra puerto)
2. ✅ **Verificar que el frontend esté corriendo** (`ng serve` en terminal)
3. ✅ **Verificar puerto en api.service.ts** coincide con Visual Studio
4. ✅ **Aceptar certificado SSL** en el navegador (`https://localhost:7265/swagger`)
5. ✅ **Verificar CORS** en `Program.cs` permite `http://localhost:4200`
6. ✅ **Verificar base de datos** existe y tiene las tablas creadas
7. ✅ **Verificar cadena de conexión** en `appsettings.json` es correcta
8. ✅ **Revisar logs**:
   - Visual Studio: Ventana de Salida
   - Angular: Terminal
   - Navegador: F12 → Console y Network
9. ✅ **Reiniciar todo**:
   - Cerrar Visual Studio
   - Cerrar terminal de Angular
   - Reiniciar SQL Server
   - Volver a abrir todo

---

## 📚 Referencias

- [Documentación de Angular](https://angular.io/docs)
- [Documentación de PrimeNG](https://primeng.org/)
- [Documentación de Dapper](https://github.com/DapperLib/Dapper)
- [Documentación de ASP.NET Core](https://docs.microsoft.com/aspnet/core)

---

**Última actualización:** Noviembre 2024

