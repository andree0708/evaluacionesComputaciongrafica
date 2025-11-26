# 📱 README - Frontend (Angular + PrimeNG)

## 🎯 Descripción General

Este documento explica la estructura, componentes y flujo de trabajo del frontend de la aplicación Hotel Tropical, desarrollada con **Angular 19** y **PrimeNG v19.1.4**.

---

## 📦 Componentes de PrimeNG Utilizados

### 1. **ButtonModule** (`p-button`)
- **Ubicación**: Usado en múltiples componentes
- **Propósito**: Botones estilizados con iconos
- **Ejemplos de uso**:
  - `LoginComponent`: Botón "Iniciar Sesión"
  - `HabitacionesComponent`: Botones "Reservar" y "Ver detalles"
  - `AdminComponent`: Botones de acciones (editar, eliminar)
  - `LayoutComponent`: Botón del menú hamburguesa
- **Características**:
  - Soporte para iconos (PrimeIcons)
  - Estados: `loading`, `disabled`
  - Variantes: `outlined`, `text`, `rounded`

### 2. **CardModule** (`p-card`)
- **Ubicación**: 
  - `LoginComponent`: Contenedor del formulario de login
  - `RegisterComponent`: Contenedor del formulario de registro
  - `HabitacionesComponent`: Tarjetas de cada habitación
  - `AdminComponent`: Contenedor de la tabla de reservas
- **Propósito**: Contenedores con estilo de tarjeta
- **Características**:
  - Header, body y footer personalizables
  - Estilos responsivos

### 3. **InputTextModule** (`pInputText`)
- **Ubicación**: 
  - `LoginComponent`: Campos de usuario y contraseña
  - `RegisterComponent`: Todos los campos del formulario
  - `ReservaComponent`: Campos de nombre y fechas
- **Propósito**: Campos de entrada de texto estilizados
- **Características**:
  - Integración con Angular Forms
  - Validación visual

### 4. **TableModule** (`p-table`)
- **Ubicación**: `AdminComponent`
- **Propósito**: Tabla de datos con paginación
- **Características**:
  - Paginación automática
  - Ordenamiento
  - Templates personalizados (header, body, footer)
  - Usado para mostrar todas las reservas

### 5. **DialogModule** (`p-dialog`)
- **Ubicación**: 
  - `AdminComponent`: Diálogo para editar reservas
  - `HabitacionesComponent`: Diálogo de detalles de habitación
- **Propósito**: Ventanas modales
- **Características**:
  - Modal (bloquea interacción con fondo)
  - Header y footer personalizables
  - Control de visibilidad con `[(visible)]`

### 6. **DropdownModule** (`p-dropdown`)
- **Ubicación**: 
  - `ReservaComponent`: Selección de habitación
  - `AdminComponent`: Selección de estado de reserva
- **Propósito**: Listas desplegables
- **Características**:
  - Búsqueda integrada
  - Opciones personalizadas (label/value)
  - Integración con `ngModel`

### 7. **TagModule** (`p-tag`)
- **Ubicación**: 
  - `HabitacionesComponent`: Etiquetas de categoría (Más popular, Lujo, Económica)
  - `AdminComponent`: Etiquetas de estado (Confirmada, Pendiente, Cancelada)
- **Propósito**: Etiquetas visuales con colores
- **Características**:
  - Severity: `success`, `warning`, `danger`, `info`
  - Colores automáticos según severidad

### 8. **ToastModule** (`p-toast`)
- **Ubicación**: `AdminComponent`
- **Propósito**: Notificaciones toast (mensajes temporales)
- **Características**:
  - Aparece en esquina de la pantalla
  - Auto-desaparece
  - Severity: success, error, warning, info
  - Usado para feedback de acciones (crear, editar, eliminar)

### 9. **ConfirmDialogModule** (`p-confirmDialog`)
- **Ubicación**: `AdminComponent`
- **Propósito**: Diálogos de confirmación
- **Características**:
  - Confirmación antes de eliminar
  - Botones personalizables (Aceptar/Rechazar)
  - Iconos personalizables

### 10. **MessageModule** (`p-message`)
- **Ubicación**: `LoginComponent`, `RegisterComponent`
- **Propósito**: Mensajes de error/éxito inline
- **Características**:
  - Severity: error, success, warning, info
  - Se muestra dentro del formulario

---

## 🏗️ Estructura de Componentes

### Componentes de Layout

#### **LayoutComponent** (`components/layout/`)
- **Propósito**: Contenedor principal de la aplicación
- **Características**:
  - Sidebar colapsable (menú lateral)
  - Header con logo y botón de menú
  - Router outlet para contenido dinámico
  - Integración con `AuthService` para mostrar/ocultar opciones según rol
- **Menú dinámico**:
  - **Invitado**: Inicio, Habitaciones, Servicios, Iniciar sesión, Crear cuenta
  - **Cliente**: Inicio, Habitaciones, Servicios, Mis reservas, Cerrar sesión
  - **Administrador**: Todo lo anterior + Administración

### Componentes de Autenticación

#### **LoginComponent** (`components/login/`)
- **Ruta**: `/login`
- **Propósito**: Formulario de inicio de sesión
- **Flujo**:
  1. Usuario ingresa `nombreUsuario` y `password`
  2. Llama a `AuthService.login()`
  3. Si es exitoso, guarda usuario en `localStorage`
  4. Redirige según rol:
     - `Administrador` → `/admin`
     - `Cliente` → `/reserva` (o URL guardada)
- **Componentes PrimeNG**: `p-card`, `pInputText`, `p-button`, `p-message`

#### **RegisterComponent** (`components/register/`)
- **Ruta**: `/register`
- **Propósito**: Formulario de registro de nuevos usuarios
- **Flujo**:
  1. Usuario completa: nombre completo, nombre de usuario, email, contraseña
  2. Llama a `ApiService.register()`
  3. Si es exitoso, muestra mensaje y redirige a `/login`
- **Componentes PrimeNG**: `p-card`, `pInputText`, `p-button`, `p-message`

### Páginas Principales

#### **HomeComponent** (`pages/home/`)
- **Ruta**: `/`
- **Propósito**: Página de inicio del hotel
- **Características**: Información general, imágenes, llamados a la acción

#### **HabitacionesComponent** (`pages/habitaciones/`)
- **Ruta**: `/habitaciones`
- **Propósito**: Listado de habitaciones disponibles
- **Flujo**:
  1. Al cargar, llama a `ApiService.getHabitaciones()`
  2. Muestra tarjetas con cada habitación
  3. Botón "Ver detalles" abre diálogo con información completa
  4. Botón "Reservar" redirige a `/reserva` (si está autenticado) o `/login`
- **Componentes PrimeNG**: `p-card`, `p-button`, `p-tag`, `p-dialog`

#### **ServiciosComponent** (`pages/servicios/`)
- **Ruta**: `/servicios`
- **Propósito**: Información sobre servicios del hotel
- **Características**: Listado de servicios con iconos y descripciones

#### **ReservaComponent** (`pages/reserva/`)
- **Ruta**: `/reserva`
- **Protección**: `authGuard` (requiere autenticación)
- **Propósito**: Formulario para crear una reserva
- **Flujo**:
  1. Carga habitaciones desde API
  2. Usuario selecciona habitación, fechas, completa datos
  3. Al enviar, navega a `/pago-confirmacion` con query params
- **Componentes PrimeNG**: `p-card`, `pInputText`, `p-button`, `p-dropdown`

#### **PagoConfirmacionComponent** (`pages/pago-confirmacion/`)
- **Ruta**: `/pago-confirmacion`
- **Protección**: `authGuard`
- **Propósito**: Confirmación de datos antes del pago
- **Flujo**: Recibe datos de reserva, muestra resumen, navega a `/pago-metodo`

#### **PagoMetodoComponent** (`pages/pago-metodo/`)
- **Ruta**: `/pago-metodo`
- **Protección**: `authGuard`
- **Propósito**: Selección de método de pago y creación de reserva
- **Flujo**:
  1. Usuario selecciona método de pago
  2. Llama a `ApiService.createReserva()`
  3. Muestra mensaje de éxito y redirige a inicio

#### **AdminComponent** (`pages/admin/`)
- **Ruta**: `/admin`
- **Protección**: `authGuard` + verificación de rol
- **Propósito**: Panel de administración de reservas
- **Funcionalidades**:
  - Ver todas las reservas (tabla con paginación)
  - Editar estado de reserva (diálogo)
  - Eliminar reserva (con confirmación)
- **Componentes PrimeNG**: `p-table`, `p-button`, `p-dialog`, `p-dropdown`, `p-tag`, `p-toast`, `p-confirmDialog`

---

## 🔄 Flujo de Trabajo del Frontend

### 1. Flujo de Autenticación

```
Usuario no autenticado intenta acceder a /reserva
    ↓
AuthGuard detecta que no está autenticado
    ↓
Guarda URL de retorno en sessionStorage
    ↓
Redirige a /login
    ↓
Usuario ingresa credenciales
    ↓
LoginComponent → AuthService.login()
    ↓
AuthService → ApiService.login() → POST /api/Users/Login
    ↓
Backend valida en SQL Server
    ↓
Si es válido:
    - AuthService guarda usuario en localStorage
    - Redirige según rol:
      * Administrador → /admin
      * Cliente → /reserva (o URL guardada)
```

### 2. Flujo de Reserva (Cliente)

```
Cliente autenticado accede a /habitaciones
    ↓
HabitacionesComponent carga habitaciones desde API
    ↓
Usuario hace click en "Reservar"
    ↓
Navega a /reserva (con query param habitacionId)
    ↓
ReservaComponent:
    - Carga habitación seleccionada
    - Usuario completa fechas y datos
    ↓
Navega a /pago-confirmacion (con datos en query params)
    ↓
PagoConfirmacionComponent muestra resumen
    ↓
Usuario confirma y navega a /pago-metodo
    ↓
PagoMetodoComponent:
    - Usuario selecciona método de pago
    - Llama a ApiService.createReserva()
    - POST /api/Reservas
    ↓
Backend crea reserva en SQL Server
    ↓
Muestra mensaje de éxito y redirige a inicio
```

### 3. Flujo de Administración

```
Administrador hace login
    ↓
Redirige a /admin
    ↓
AdminComponent.ngOnInit():
    - Verifica rol (debe ser Administrador)
    - Llama a ApiService.getReservas()
    ↓
Muestra tabla con todas las reservas
    ↓
Administrador puede:
    - Editar estado: Abre diálogo, actualiza, llama a ApiService.updateReserva()
    - Eliminar: Muestra confirmación, llama a ApiService.deleteReserva()
```

---

## 🔌 Comunicación entre Componentes

### 1. **Servicios como Mediadores**

#### **ApiService** (`services/api.service.ts`)
- **Propósito**: Centraliza todas las llamadas HTTP al backend
- **Métodos principales**:
  - `login()`: POST `/api/Users/Login`
  - `register()`: POST `/api/Users/Register`
  - `getHabitaciones()`: GET `/api/Habitaciones`
  - `getHabitacion(id)`: GET `/api/Habitaciones/{id}`
  - `getReservas()`: GET `/api/Reservas`
  - `createReserva()`: POST `/api/Reservas`
  - `updateReserva()`: PUT `/api/Reservas/{id}`
  - `deleteReserva()`: DELETE `/api/Reservas/{id}`
- **URL base**: `https://localhost:7265/api` (configurable)

#### **AuthService** (`services/auth.service.ts`)
- **Propósito**: Gestiona autenticación y estado del usuario
- **Métodos principales**:
  - `login()`: Llama a ApiService, guarda usuario en localStorage
  - `logout()`: Limpia localStorage y redirige
  - `getCurrentUser()`: Retorna usuario actual
  - `isAuthenticated()`: Verifica si hay usuario logueado
  - `isAdmin()`: Verifica si el usuario es administrador
  - `isCliente()`: Verifica si el usuario es cliente
- **Almacenamiento**: `localStorage` con clave `'currentUser'`
- **Observable**: `currentUser$` para suscripciones reactivas

### 2. **Inyección de Dependencias**

Todos los componentes reciben servicios mediante el constructor:

```typescript
constructor(
  private apiService: ApiService,
  private authService: AuthService,
  private router: Router
) {}
```

### 3. **Comunicación Padre-Hijo**

- **LayoutComponent** → **RouterOutlet**: Renderiza componentes hijos según la ruta
- **Query Params**: Componentes se comunican mediante query params en la URL
  - Ejemplo: `/reserva?habitacion=1` pasa el ID de habitación

### 4. **Estado Global**

- **localStorage**: Usuario actual (`AuthService`)
- **sessionStorage**: URL de retorno después del login
- **Observables**: `AuthService.currentUser$` para cambios reactivos

---

## 🌐 Conexión Backend-Frontend

### Configuración de la URL

**Archivo**: `src/app/services/api.service.ts`

```typescript
const API_URL = 'https://localhost:7265/api';
```

**⚠️ IMPORTANTE**: El puerto debe coincidir con el que muestra Visual Studio al ejecutar el backend.

### Flujo de una Petición HTTP

```
Componente (ej: LoginComponent)
    ↓
Llama a AuthService.login()
    ↓
AuthService llama a ApiService.login()
    ↓
ApiService hace POST a https://localhost:7265/api/Users/Login
    ↓
HttpClient (Angular) envía petición HTTP
    ↓
Backend recibe en UsersController.Login()
    ↓
Backend procesa (valida en SQL Server)
    ↓
Backend retorna JSON
    ↓
HttpClient recibe respuesta
    ↓
ApiService retorna Observable
    ↓
AuthService procesa respuesta
    ↓
Componente recibe resultado y actualiza UI
```

### CORS (Cross-Origin Resource Sharing)

**Backend** (`Program.cs`):
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")  // Frontend
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

**Frontend**: No requiere configuración adicional, HttpClient maneja CORS automáticamente.

### Manejo de Errores

**En componentes**:
```typescript
this.apiService.login(user, pass).subscribe({
  next: (response) => {
    // Éxito
  },
  error: (error) => {
    if (error.status === 0) {
      // Error de conexión (backend no disponible)
    } else {
      // Error del servidor (credenciales incorrectas, etc.)
    }
  }
});
```

---

## 🛡️ Guards y Protección de Rutas

### **AuthGuard** (`guards/auth.guard.ts`)

**Propósito**: Protege rutas que requieren autenticación

**Rutas protegidas**:
- `/reserva`
- `/pago-confirmacion`
- `/pago-metodo`
- `/admin`

**Funcionamiento**:
1. Verifica si hay usuario en `localStorage` (mediante `AuthService`)
2. Si no hay usuario:
   - Guarda URL actual en `sessionStorage`
   - Redirige a `/login`
3. Si hay usuario, permite el acceso

---

## 🎨 Estilos y Temas

### Paleta de Colores Tropical

Definida en `src/styles.css`:
```css
:root {
  --verde-tropical: #4a7c59;
  --cafe-claro: #d4a574;
  --cafe-oscuro: #8b6f47;
  --verde-claro: #a8d5ba;
  --blanco: #ffffff;
  --gris-claro: #f5f5f5;
  --gris-oscuro: #333333;
}
```

### Tema PrimeNG

Configurado en `app.config.ts`:
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

---

## 📱 Responsive Design

- **Sidebar**: Se oculta en móviles, se muestra como overlay
- **Tablas**: Scroll horizontal en pantallas pequeñas
- **Grid de habitaciones**: Se adapta de 3 columnas a 1 columna
- **Diálogos**: Ancho adaptable según tamaño de pantalla

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
ng serve

# Compilar para producción
ng build

# Ejecutar tests
ng test
```

---

## 📝 Notas Importantes

1. **Puerto del Backend**: Verifica que `API_URL` en `api.service.ts` coincida con el puerto de Visual Studio
2. **Certificado SSL**: Acepta el certificado SSL del backend la primera vez que accedas a Swagger
3. **CORS**: El backend debe permitir `http://localhost:4200` (HTTP, no HTTPS)
4. **localStorage**: El usuario se guarda en `localStorage`, se mantiene al recargar la página
5. **Lazy Loading**: Todos los componentes están cargados de forma lazy (excepto LayoutComponent)

---

## 🔗 Archivos Clave

- `app.config.ts`: Configuración global (routing, HTTP, PrimeNG)
- `app.routes.ts`: Definición de rutas
- `services/api.service.ts`: Servicio de API
- `services/auth.service.ts`: Servicio de autenticación
- `guards/auth.guard.ts`: Guard de autenticación
- `components/layout/`: Componente de layout principal

