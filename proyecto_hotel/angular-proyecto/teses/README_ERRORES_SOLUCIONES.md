# 🐛 README - Errores y Soluciones

## 🎯 Descripción General

Este documento recopila todos los errores que surgieron durante el desarrollo y cómo se solucionaron.

---

## 1. ❌ Error: PowerShell `&&` Token

### **Error Original**
```
El token '&&' no es un separador de instrucciones válido en esta versión.
```

### **Causa**
PowerShell no reconoce `&&` como separador de comandos (eso es de bash).

### **Solución**
Usar `;` en lugar de `&&` o ejecutar comandos por separado:

**Antes**:
```powershell
cd carpeta && ng serve
```

**Después**:
```powershell
cd carpeta; ng serve
```

O ejecutar por separado:
```powershell
cd carpeta
ng serve
```

---

## 2. ❌ Error: PrimeNG v20 - Módulos No Encontrados

### **Error Original**
```
Could not resolve "primeng/sidebar"
Cannot find module 'primeng/sidebar'
Could not resolve "primeng/calendar"
Cannot find module 'primeng/calendar'
```

### **Causa**
PrimeNG v20 introdujo cambios breaking en su estructura de módulos. Algunos componentes como `SidebarModule` y `CalendarModule` ya no están disponibles o cambiaron de ubicación.

### **Solución**
1. **Reemplazar SidebarModule**: Crear sidebar personalizado con CSS
2. **Reemplazar CalendarModule**: Usar inputs HTML5 `<input type="date">`
3. **Downgrade a PrimeNG v19**: Cambiar en `package.json`:
   ```json
   "primeng": "^19.1.4"
   ```

**Resultado**: Se usó PrimeNG v19.1.4 que es compatible con Angular 19.

---

## 3. ❌ Error: Type 'string' no asignable a Severity

### **Error Original**
```
Type 'string' is not assignable to type '"success" | "info" | "secondary" | "warn" | "danger" | "contrast" | null | undefined'
```

### **Causa**
TypeScript infiere `string` en lugar de un literal type para `tagSeverity`.

### **Solución**
Usar `as const` para forzar tipos literales:

**Antes**:
```typescript
tagSeverity: 'success'
```

**Después**:
```typescript
tagSeverity: 'success' as const
```

---

## 4. ❌ Error: NG5002 - Incomplete block "@hotel"

### **Error Original**
```
NG5002: Incomplete block "hotel". If you meant to write the @ character, you should use the "&#64;" HTML entity instead.
```

### **Causa**
Angular interpreta `@` como inicio de un bloque de template.

### **Solución**
Escapar el `@` en emails:

**Antes**:
```html
info@hotel.com
```

**Después**:
```html
info&#64;hotel.com
```

---

## 5. ❌ Error: NG8002 - Propiedad 'cancel' no existe en p-rating

### **Error Original**
```
NG8002: Can't bind to 'cancel' since it isn't a known property of 'p-rating'.
```

### **Causa**
La propiedad `[cancel]` no existe en `p-rating` de PrimeNG v19/v20.

### **Solución**
Eliminar la propiedad `[cancel]="false"` del componente:

**Antes**:
```html
<p-rating [cancel]="false" ...></p-rating>
```

**Después**:
```html
<p-rating ...></p-rating>
```

---

## 6. ❌ Error: RouterLink no usado en template

### **Error Original**
```
RouterLink is not used within the template of PagoMetodoComponent.
```

### **Causa**
Se importó `RouterLink` pero no se usó en el template.

### **Solución**
Eliminar `RouterLink` de los imports del componente:

**Antes**:
```typescript
imports: [..., RouterLink]
```

**Después**:
```typescript
imports: [...] // Sin RouterLink
```

---

## 7. ❌ Error: Schema validation - Estilos en angular.json

### **Error Original**
```
Schema validation failed: Data path "/styles/0" must be object.
Data path "/styles/0" must match pattern "\.(?:css|scss|sass|less)$"
```

### **Causa**
Se intentó agregar `@primeuix/themes/lara-light-green` directamente en `angular.json` como string, pero Angular espera un objeto o una ruta de archivo CSS.

### **Solución**
1. **Remover de angular.json**: Eliminar la referencia directa al paquete
2. **Configurar en app.config.ts**: Usar `providePrimeNG`:
   ```typescript
   providePrimeNG({
     theme: {
       preset: Aura,
       options: {
         darkModeSelector: false,
       }
     }
   })
   ```
3. **Mover primeicons.css**: Agregar en `styles.css`:
   ```css
   @import "../node_modules/primeicons/primeicons.css";
   ```

---

## 8. ❌ Error: No matching export 'DOCUMENT' y '@angular/animations'

### **Error Original**
```
No matching export in "node_modules/@angular/core/fesm2022/core.mjs" for import "DOCUMENT"
Could not resolve "@angular/animations/browser"
Could not resolve "@angular/animations"
```

### **Causa**
Incompatibilidad entre versiones de Angular y PrimeNG. El proyecto usaba Angular 19 con PrimeNG 20, que no son compatibles.

### **Solución**
1. **Downgrade PrimeNG**: Cambiar a v19.1.4
2. **Verificar @angular/animations**: Asegurar que esté en la misma versión que Angular:
   ```json
   "@angular/animations": "^19.2.0"
   ```
3. **Reinstalar dependencias**:
   ```bash
   npm install
   ```

---

## 9. ❌ Error: Foreign Key - Tabla 'Users' no válida

### **Error Original** (SQL Server)
```
La clave externa 'FK_Reservas_...' hace referencia a la tabla no válida 'Users'.
La clave externa 'FK_Reservas_...' hace referencia a la tabla no válida 'Habitaciones'.
```

### **Causa**
Se intentó crear la tabla `Reservas` antes de crear `Users` y `Habitaciones`. Las foreign keys no pueden referenciar tablas que no existen.

### **Solución**
Crear las tablas en el orden correcto:

1. **Primero**: `Users` (no tiene dependencias)
2. **Segundo**: `Habitaciones` (no tiene dependencias)
3. **Tercero**: `Reservas` (depende de Users y Habitaciones)

**Script corregido**:
```sql
-- Eliminar en orden inverso
DROP TABLE IF EXISTS Reservas;
DROP TABLE IF EXISTS Habitaciones;
DROP TABLE IF EXISTS Users;

-- Crear en orden correcto
CREATE TABLE Users (...);
CREATE TABLE Habitaciones (...);
CREATE TABLE Reservas (
    ...,
    CONSTRAINT FK_Reservas_Users FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_Reservas_Habitaciones FOREIGN KEY (HabitacionId) REFERENCES Habitaciones(Id)
);
```

---

## 10. ❌ Error: Login failed for user 'LAPTOP-CVFQDUR2\Andrea'

### **Error Original**
```
Microsoft.Data.SqlClient.SqlException: Login failed for user 'LAPTOP-CVFQDUR2\Andrea'.
Cannot open database "HotelTropicalDB" requested by the login.
```

### **Causa**
La cadena de conexión usaba `Trusted_Connection=True`, que intenta autenticarse con el usuario de Windows actual (`Andrea`), pero ese usuario no tiene permisos en SQL Server.

### **Solución**
**Opción 1**: Usar autenticación de SQL Server:
```json
"DefaultConnection": "Server=localhost;Database=HotelTropicalDB;User Id=sa;Password=TU_PASSWORD;TrustServerCertificate=True;"
```

**Opción 2**: Dar permisos al usuario de Windows:
1. Abrir SSMS como administrador
2. Seguridad → Inicios de sesión → Nuevo inicio de sesión
3. Tipo: Usuario de Windows
4. Nombre: `LAPTOP-CVFQDUR2\Andrea`
5. Asignar usuario a `HotelTropicalDB` con rol `db_owner`

---

## 11. ❌ Error: Login failed for user 'sa'

### **Error Original**
```
Login failed for user 'sa'.
Error Number:18456,State:1,Class:14
```

### **Causa**
1. Contraseña incorrecta en `appsettings.json`
2. Autenticación de SQL Server deshabilitada

### **Solución**
1. **Verificar contraseña**: Asegurar que coincida con la de SSMS
2. **Habilitar autenticación mixta**:
   - SSMS → Propiedades del servidor → Seguridad
   - Habilitar "Autenticación de SQL Server y de Windows"
   - Reiniciar servicio SQL Server

---

## 12. ❌ Error: No se pudo conectar con el servidor (Frontend)

### **Error Original**
```
Error: No se pudo conectar con el servidor
[object ProgressEvent]
```

### **Causa**
1. Backend no está corriendo
2. Puerto incorrecto en `api.service.ts`
3. Certificado SSL no aceptado
4. CORS mal configurado

### **Solución**
1. **Verificar puerto**: 
   - Visual Studio muestra: `Now listening on: https://localhost:7265`
   - `api.service.ts` debe tener: `https://localhost:7265/api`

2. **Aceptar certificado SSL**:
   - Abrir `https://localhost:7265/swagger` en el navegador
   - Aceptar certificado (Avanzado → Continuar)

3. **Verificar CORS**:
   - `Program.cs` debe tener:
     ```csharp
     policy.WithOrigins("http://localhost:4200")  // HTTP, no HTTPS
     ```

4. **Mejorar manejo de errores**:
   ```typescript
   error: (error) => {
     if (error.status === 0) {
       this.errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
     } else {
       this.errorMessage = error.error?.message || 'Error desconocido';
     }
   }
   ```

---

## 13. ❌ Error: Namespace 'Repositories' no existe

### **Error Original**
```
CS0234: El tipo o el nombre del espacio de nombres 'Repositories' no existe en el espacio de nombres 'Hotelbackend'
```

### **Causa**
El namespace en los archivos de repositorio no coincidía con el `using` en `Program.cs`.

### **Solución**
**Verificar namespace en cada repositorio**:
```csharp
namespace Hotelbackend.Repositories  // Debe ser exactamente esto
{
    public class UserRepository { ... }
}
```

**Verificar using en Program.cs**:
```csharp
using Hotelbackend.Repositories;  // Debe coincidir
```

**Nota**: El nombre de la carpeta física no importa, solo el namespace dentro del archivo.

---

## 14. ❌ Error: DropdownModule no encontrado

### **Error Original**
```
TS2304: Cannot find name 'DropdownModule'.
TS-991010: 'imports' must be an array of components, directives, pipes, or NgModules.
```

### **Causa**
Se usó `DropdownModule` en el array de imports pero no se importó desde PrimeNG.

### **Solución**
Agregar el import:
```typescript
import { DropdownModule } from 'primeng/dropdown';
```

Y agregarlo al array de imports:
```typescript
imports: [
  ...,
  DropdownModule
]
```

---

## 15. ❌ Error: AuthService no encontrado en LayoutComponent

### **Error Original**
```
TS2307: Cannot find module '../services/auth.service'
TS-992003: No suitable injection token for parameter 'authService'
```

### **Causa**
Ruta incorrecta del import. `LayoutComponent` está en `components/layout/` y necesita subir dos niveles para llegar a `services/`.

### **Solución**
Corregir la ruta del import:
```typescript
// Antes (incorrecto)
import { AuthService } from '../services/auth.service';

// Después (correcto)
import { AuthService } from '../../services/auth.service';
```

---

## 16. ❌ Error: CommonModule no importado en RegisterComponent

### **Error Original**
```
NG8103: The `*ngIf` directive was used in the template, but neither the `NgIf` directive nor the `CommonModule` was imported.
```

### **Causa**
Se usó `*ngIf` en el template pero no se importó `CommonModule`.

### **Solución**
Agregar `CommonModule` a los imports:
```typescript
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ...]
})
```

---

## 📝 Resumen de Lecciones Aprendidas

1. **PowerShell**: Usar `;` en lugar de `&&`
2. **PrimeNG**: Usar v19 con Angular 19, no v20
3. **TypeScript**: Usar `as const` para tipos literales
4. **Angular Templates**: Escapar `@` como `&#64;`
5. **SQL Server**: Crear tablas en orden (sin dependencias primero)
6. **Autenticación SQL**: Verificar contraseña y habilitar autenticación mixta
7. **CORS**: Configurar para `http://localhost:4200` (HTTP, no HTTPS)
8. **Namespaces**: Verificar que coincidan entre archivos
9. **Imports**: Verificar rutas relativas correctas
10. **Manejo de errores**: Distinguir entre errores de conexión y errores del servidor

---

## 🔧 Comandos Útiles para Debug

```bash
# Limpiar y reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar versión de Angular
ng version

# Verificar versión de PrimeNG
npm list primeng

# Compilar y ver errores
ng build

# Ejecutar y ver errores en consola
ng serve
```

---

## 🆘 Si Nada Funciona

1. **Reiniciar todo**:
   - Cerrar Visual Studio
   - Cerrar terminal de Angular
   - Reiniciar SQL Server
   - Volver a abrir todo

2. **Verificar logs**:
   - Visual Studio: Ventana de Salida
   - Angular: Terminal
   - Navegador: F12 → Console

3. **Verificar versiones**:
   - Angular: `ng version`
   - PrimeNG: `npm list primeng`
   - .NET: `dotnet --version`

