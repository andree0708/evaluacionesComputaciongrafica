# 📘 Guía Completa de Implementación - Backend y Frontend

## 🎯 Resumen del Proyecto

Este documento explica cómo implementar completamente el sistema de reservas de hotel con:
- **Backend**: API REST en .NET con SQL Server
- **Frontend**: Angular con autenticación y roles
- **Base de Datos**: SQL Server con tablas de usuarios, habitaciones y reservas

---

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#1-configuración-inicial)
2. [Backend - .NET API](#2-backend---net-api)
3. [Base de Datos SQL Server](#3-base-de-datos-sql-server)
4. [Frontend - Angular](#4-frontend---angular)
5. [Flujo Completo del Sistema](#5-flujo-completo-del-sistema)
6. [Pruebas y Verificación](#6-pruebas-y-verificación)

---

## 1. Configuración Inicial

### Requisitos Previos

- ✅ Visual Studio 2022
- ✅ SQL Server Management Studio (SSMS)
- ✅ Node.js y npm
- ✅ Angular CLI
- ✅ .NET 8.0 SDK

---

## 2. Backend - .NET API

### Paso 2.1: Crear el Proyecto

1. Abre Visual Studio 2022
2. **File → New → Project**
3. Busca **"ASP.NET Core Web API"**
4. Nombre: `HotelTropicalAPI`
5. Framework: **.NET 8.0**
6. Click **Create**

### Paso 2.2: Instalar Paquetes NuGet

En **Package Manager Console**:

```powershell
Install-Package Microsoft.EntityFrameworkCore
Install-Package Microsoft.EntityFrameworkCore.SqlServer
Install-Package Microsoft.EntityFrameworkCore.Tools
Install-Package Microsoft.AspNetCore.Cors
```

### Paso 2.3: Crear Estructura de Carpetas

```
HotelTropicalAPI/
├── Controllers/
├── Models/
├── Data/
└── Program.cs
```

**Sigue las instrucciones detalladas en `BACKEND_SETUP.md`** para:
- Crear los modelos (User, Habitacion, Reserva)
- Configurar DbContext
- Crear los controladores
- Configurar CORS

---

## 3. Base de Datos SQL Server

### Paso 3.1: Crear la Base de Datos

1. Abre **SQL Server Management Studio**
2. Conéctate a tu instancia local
3. Ejecuta este script:

```sql
CREATE DATABASE HotelTropicalDB;
GO

USE HotelTropicalDB;
GO
```

### Paso 3.2: Crear las Tablas

Ejecuta el script completo que está en `BACKEND_SETUP.md` sección 1.3

### Paso 3.3: Insertar Datos de Prueba

Ejecuta el script de la sección 1.4 de `BACKEND_SETUP.md`

**Usuarios de prueba:**
- **Admin**: `admin` / `admin123`
- **Cliente**: `juanperez` / `cliente123`

---

## 4. Frontend - Angular

### Paso 4.1: Verificar que los Servicios Estén Creados

Los siguientes archivos ya están creados:
- ✅ `src/app/services/api.service.ts`
- ✅ `src/app/services/auth.service.ts`
- ✅ `src/app/components/login/login.component.*`
- ✅ `src/app/pages/admin/admin.component.*`
- ✅ `src/app/guards/auth.guard.ts`

### Paso 4.2: Configurar la URL de la API

En `src/app/services/api.service.ts`, verifica que la URL sea correcta:

```typescript
const API_URL = 'https://localhost:7128/api';
```

**Nota**: Si tu API corre en otro puerto, cámbialo aquí.

### Paso 4.3: Instalar Dependencias Adicionales (si es necesario)

```bash
npm install --legacy-peer-deps
```

---

## 5. Flujo Completo del Sistema

### 🔐 Flujo de Autenticación

```
1. Usuario hace click en "Reservar" (sin estar autenticado)
   ↓
2. AuthGuard detecta que no está autenticado
   ↓
3. Redirige a /login y guarda la URL de retorno
   ↓
4. Usuario ingresa credenciales (nombreUsuario, password)
   ↓
5. LoginComponent envía POST a /api/Users/Login
   ↓
6. Backend valida en SQL Server
   ↓
7. Si es válido, retorna datos del usuario + rol
   ↓
8. AuthService guarda usuario en localStorage
   ↓
9. Redirige según rol:
   - Admin → /admin
   - Cliente → /reserva (o URL guardada)
```

### 📝 Flujo de Reserva (Cliente)

```
1. Cliente autenticado accede a /reserva
   ↓
2. Selecciona habitación, fechas, completa datos
   ↓
3. Click en "Enviar Reserva"
   ↓
4. Va a /pago-confirmacion (confirma datos)
   ↓
5. Va a /pago-metodo (selecciona método de pago)
   ↓
6. Click en "Proceder con el Pago"
   ↓
7. Frontend envía POST a /api/Reservas con:
   {
     userId: número,
     habitacionId: número,
     nombreCompleto: string,
     email: string,
     telefono: string,
     fechaEntrada: fecha,
     fechaSalida: fecha,
     metodoPago: string
   }
   ↓
8. Backend calcula total y guarda en SQL Server
   ↓
9. Retorna reserva creada
   ↓
10. Frontend muestra mensaje de éxito y redirige a inicio
```

### 👨‍💼 Flujo de Administración

```
1. Admin autenticado accede a /admin
   ↓
2. AdminComponent carga todas las reservas (GET /api/Reservas)
   ↓
3. Muestra tabla con todas las reservas
   ↓
4. Admin puede:
   - Ver todas las reservas
   - Editar estado de reserva (Pendiente/Confirmada/Cancelada)
   - Eliminar reserva
   ↓
5. Cada acción hace PUT o DELETE a /api/Reservas/{id}
   ↓
6. Backend actualiza/elimina en SQL Server
   ↓
7. Frontend recarga la tabla
```

---

## 6. Pruebas y Verificación

### Paso 6.1: Ejecutar el Backend

1. En Visual Studio, presiona **F5**
2. La API debería iniciar en `https://localhost:7128`
3. Abre el navegador en `https://localhost:7128/swagger`
4. Prueba el endpoint `/api/Users/Login`:
   ```json
   {
     "nombreUsuario": "admin",
     "password": "admin123"
   }
   ```
5. Deberías recibir una respuesta con `success: true`

### Paso 6.2: Ejecutar el Frontend

```bash
ng serve
```

La aplicación estará en `http://localhost:4200`

### Paso 6.3: Probar el Flujo Completo

#### Como Cliente:

1. Ve a `http://localhost:4200`
2. Click en "Ver Habitaciones"
3. Click en "Reservar" en cualquier habitación
4. **Debería redirigirte a /login**
5. Ingresa:
   - Usuario: `juanperez`
   - Contraseña: `cliente123`
6. Deberías ser redirigido a /reserva
7. Completa el formulario y sigue el flujo de pago
8. Al finalizar, la reserva se guarda en la base de datos

#### Como Administrador:

1. Ve a `http://localhost:4200/login`
2. Ingresa:
   - Usuario: `admin`
   - Contraseña: `admin123`
3. Deberías ser redirigido a /admin
4. Verás todas las reservas en una tabla
5. Puedes editar el estado o eliminar reservas

---

## 🔧 Solución de Problemas

### Error: "Could not resolve API"

- Verifica que el backend esté corriendo
- Verifica la URL en `api.service.ts`
- Verifica CORS en `Program.cs` del backend

### Error: "Usuario o contraseña incorrectos"

- Verifica que los datos estén en la base de datos
- Ejecuta el script de inserción de datos de nuevo

### Error: "CORS policy"

- Asegúrate de que en `Program.cs` del backend esté configurado:
  ```csharp
  policy.WithOrigins("http://localhost:4200")
  ```

### Error: "Cannot connect to database"

- Verifica la cadena de conexión en `appsettings.json`
- Verifica que SQL Server esté corriendo
- Verifica que la base de datos exista

---

## 📊 Estructura de la Base de Datos

### Tabla: Users
- `Id` (PK, Identity)
- `Nombre`
- `NombreUsuario` (Unique)
- `Email` (Unique)
- `Password`
- `Rol` (Cliente/Administrador)
- `FechaCreacion`

### Tabla: Habitaciones
- `Id` (PK, Identity)
- `Nombre`
- `Descripcion`
- `Tipo`
- `Precio`
- `Capacidad`
- `Disponible`
- `ImagenUrl`

### Tabla: Reservas
- `Id` (PK, Identity)
- `UserId` (FK → Users)
- `HabitacionId` (FK → Habitaciones)
- `NombreCompleto`
- `Email`
- `Telefono`
- `FechaEntrada`
- `FechaSalida`
- `MetodoPago`
- `Estado` (Pendiente/Confirmada/Cancelada)
- `Total`
- `FechaReserva`

---

## 🎨 Roles y Permisos

### Cliente
- ✅ Ver habitaciones
- ✅ Ver servicios
- ✅ Hacer reservas
- ✅ Ver sus propias reservas (futuro)
- ❌ Acceder a /admin

### Administrador
- ✅ Todo lo del cliente
- ✅ Acceder a /admin
- ✅ Ver todas las reservas
- ✅ Editar reservas
- ✅ Eliminar reservas

---

## 📝 Notas Importantes

1. **Seguridad**: 
   - ⚠️ Las contraseñas están en texto plano (solo para desarrollo)
   - En producción, usa hashing (BCrypt, etc.)

2. **Autenticación**:
   - Actualmente usa localStorage
   - En producción, considera JWT tokens

3. **Validaciones**:
   - Agrega validaciones en el backend
   - Valida fechas, emails, etc.

4. **Manejo de Errores**:
   - Implementa manejo de errores más robusto
   - Agrega logging

---

## 🚀 Próximos Pasos

- [ ] Implementar JWT para autenticación real
- [ ] Agregar validaciones de fechas (no reservar en el pasado)
- [ ] Implementar verificación de disponibilidad
- [ ] Agregar imágenes reales de habitaciones
- [ ] Implementar búsqueda y filtros
- [ ] Agregar reportes para administradores
- [ ] Implementar sistema de notificaciones por email

---

## 📞 Soporte

Si tienes problemas, verifica:
1. Que el backend esté corriendo
2. Que la base de datos esté creada y tenga datos
3. Que la URL de la API sea correcta
4. Que CORS esté configurado correctamente

---

**¡Listo! Ahora tienes un sistema completo de reservas funcionando.** 🎉

