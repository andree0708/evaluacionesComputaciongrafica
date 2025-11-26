# 📋 Informe del Proyecto - Sistema de Gestión Hotelera

## 1. Descripción General

El **Sistema de Gestión Hotelera** es una aplicación web desarrollada con Angular 19 y ASP.NET Core Web API que permite gestionar reservas de habitaciones de hotel. La aplicación está diseñada para dos tipos de usuarios:

- **Clientes**: Pueden explorar habitaciones, servicios, realizar reservas y gestionar sus propias reservas.
- **Administradores**: Tienen acceso completo al sistema para gestionar habitaciones, ver todas las reservas, editarlas y eliminarlas.

### Tecnologías Utilizadas

**Frontend:**
- Angular 19.2.0
- PrimeNG 19.1.4 (Biblioteca de componentes UI)
- TypeScript 5.7.2
- RxJS 7.8.0
- PrimeIcons 7.0.0

**Backend:**
- ASP.NET Core Web API
- SQL Server (Base de datos)
- Dapper (Micro-ORM para acceso a datos)
- C# (.NET)

**Arquitectura:**
- Arquitectura RESTful API
- Separación de responsabilidades (Controllers, Repositories, Models)
- Autenticación basada en roles (Cliente/Administrador)
- CORS configurado para comunicación frontend-backend

---

## 2. Acciones que Realiza la Aplicación

### 2.1 Funcionalidades para Usuarios No Autenticados (Invitados)

1. **Explorar el sitio público:**
   - Ver página de inicio con testimonios de clientes
   - Explorar habitaciones disponibles con precios y descripciones
   - Ver servicios adicionales del hotel (desayuno, gimnasio, piscina, spa, etc.)
   - Acceder a información de contacto

2. **Registro de nuevos usuarios:**
   - Crear cuenta con nombre, nombre de usuario, email y contraseña
   - Validación de campos requeridos
   - Verificación de duplicados (usuario/email ya existente)

3. **Inicio de sesión:**
   - Autenticación con nombre de usuario y contraseña
   - Redirección automática según rol (Cliente → Reservas, Administrador → Panel Admin)

### 2.2 Funcionalidades para Clientes Autenticados

1. **Gestión de Reservas:**
   - Crear nuevas reservas seleccionando:
     - Habitación disponible
     - Fechas de entrada y salida
     - Datos personales (nombre, email, teléfono)
   - Verificar disponibilidad antes de reservar (previene reservas duplicadas)
   - Seleccionar método de pago
   - Confirmar reserva y recibir confirmación

2. **Navegación:**
   - Acceso a todas las secciones públicas
   - Menú personalizado con opción "Mis Reservas"

### 2.3 Funcionalidades para Administradores

1. **Gestión de Reservas:**
   - Ver todas las reservas del sistema en una tabla
   - Filtrar y ordenar reservas
   - Editar estado de reservas (Pendiente, Confirmada, Cancelada)
   - Eliminar reservas con confirmación

2. **Gestión de Habitaciones (CRUD completo):**
   - **Crear** nuevas habitaciones con:
     - Nombre, descripción, tipo
     - Precio por noche
     - Capacidad de huéspedes
     - Disponibilidad
     - URL de imagen
   - **Leer** lista de todas las habitaciones
   - **Actualizar** información de habitaciones existentes
   - **Eliminar** habitaciones con confirmación

3. **Panel de Administración:**
   - Interfaz con pestañas (tabs) para organizar:
     - Tab 1: Gestión de Reservas
     - Tab 2: Gestión de Habitaciones
   - Notificaciones toast para feedback de acciones
   - Confirmaciones antes de eliminar registros

### 2.4 Validaciones y Seguridad

- **Validación de fechas:** La fecha de salida debe ser posterior a la fecha de entrada
- **Validación de disponibilidad:** No permite reservar la misma habitación en fechas que se solapan
- **Autenticación:** Rutas protegidas con `AuthGuard`
- **Roles:** Separación de permisos según rol del usuario
- **Mensajes de error:** Feedback claro al usuario en caso de errores

---

## 3. Mockups de la Solución

### 3.1 Página de Inicio
- **Banner principal** con título y descripción del hotel
- **Botones de acción:** "Contáctanos" y "Ver Habitaciones"
- **Sección de testimonios:** Tarjetas con opiniones de clientes y calificaciones (rating)

### 3.2 Página de Habitaciones
- **Grid de tarjetas** mostrando cada habitación disponible
- **Información por habitación:**
  - Imagen (si está disponible)
  - Tag de categoría (Más popular, Lujo, Económica)
  - Nombre y descripción
  - Precio por noche
  - Botones: "Ver detalles" y "Reservar"

### 3.3 Página de Servicios
- **Grid de servicios** con imágenes y descripciones:
  - Desayuno Incluido
  - Gimnasio
  - Piscina
  - Wi-Fi Gratis
  - Spa
  - Restaurante

### 3.4 Página de Contacto
- **Tarjeta con información de contacto:**
  - Dirección
  - Teléfono
  - Email
  - Horario de atención

### 3.5 Formulario de Reserva
- **Campos:**
  - Nombre completo (prellenado si está autenticado)
  - Fecha de entrada (date picker)
  - Fecha de salida (date picker)
  - Selección de habitación (dropdown)
- **Validación en tiempo real** de disponibilidad

### 3.6 Panel de Administración
- **Pestañas:**
  - **Reservas:** Tabla con todas las reservas, botones editar/eliminar
  - **Habitaciones:** Tabla con todas las habitaciones, botones crear/editar/eliminar
- **Diálogos modales** para crear/editar registros
- **Confirmaciones** antes de eliminar

### 3.7 Login y Registro
- **Formularios centrados** con validación
- **Mostrar/ocultar contraseña** con icono de ojo
- **Mensajes de error** claros
- **Enlaces** para cambiar entre login y registro

---

## 4. Descripción de la Estructura del Proyecto Frontend

### 4.1 Estructura de Carpetas

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── layout/          # Componente de layout principal (header, sidebar, menú)
│   │   ├── login/           # Componente de inicio de sesión
│   │   └── register/        # Componente de registro
│   │
│   ├── pages/               # Páginas principales de la aplicación
│   │   ├── home/           # Página de inicio
│   │   ├── habitaciones/   # Página de listado de habitaciones
│   │   ├── servicios/      # Página de servicios adicionales
│   │   ├── contacto/       # Página de contacto
│   │   ├── reserva/        # Formulario de reserva
│   │   ├── pago-confirmacion/  # Confirmación de datos antes de pagar
│   │   ├── pago-metodo/    # Selección de método de pago
│   │   └── admin/          # Panel de administración
│   │
│   ├── services/           # Servicios Angular (lógica de negocio)
│   │   ├── api.service.ts  # Servicio para llamadas HTTP al backend
│   │   └── auth.service.ts # Servicio de autenticación y gestión de sesión
│   │
│   ├── guards/             # Guards de Angular Router
│   │   └── auth.guard.ts   # Guard para proteger rutas que requieren autenticación
│   │
│   ├── app.component.ts    # Componente raíz
│   ├── app.config.ts       # Configuración de la aplicación (providers, theme)
│   └── app.routes.ts       # Definición de rutas de la aplicación
│
├── index.html              # HTML principal
├── main.ts                 # Punto de entrada de la aplicación
└── styles.css              # Estilos globales
```

### 4.2 Flujo de Datos y Comunicación entre Componentes

#### 4.2.1 Autenticación
```
LoginComponent → AuthService → ApiService → Backend API
                ↓
         localStorage (almacena usuario)
                ↓
         AuthGuard (protege rutas)
```

#### 4.2.2 Reservas
```
ReservaComponent → ApiService → Backend API
                  ↓
         VerificarDisponibilidad
                  ↓
         PagoConfirmacionComponent
                  ↓
         PagoMetodoComponent → ApiService → Crear Reserva
```

#### 4.2.3 Administración
```
AdminComponent → ApiService → Backend API
                ↓
         CRUD Reservas/Habitaciones
                ↓
         Toast Notifications (feedback)
```

### 4.3 Servicios Principales

#### **ApiService** (`services/api.service.ts`)
- Centraliza todas las llamadas HTTP al backend
- Métodos para:
  - Autenticación (login, register)
  - Habitaciones (GET, POST, PUT, DELETE)
  - Reservas (GET, POST, PUT, DELETE, VerificarDisponibilidad)
- URL base configurada: `https://localhost:7265/api`

#### **AuthService** (`services/auth.service.ts`)
- Gestiona el estado de autenticación del usuario
- Almacena usuario en `localStorage`
- Proporciona métodos:
  - `login()`: Autentica usuario
  - `logout()`: Cierra sesión y muestra mensaje
  - `isAuthenticated()`: Verifica si hay sesión activa
  - `isAdmin()` / `isCliente()`: Verifica rol del usuario
  - `getCurrentUser()`: Obtiene usuario actual

### 4.4 Guards

#### **AuthGuard** (`guards/auth.guard.ts`)
- Protege rutas que requieren autenticación (`/reserva`, `/admin`, `/pago-confirmacion`)
- Si el usuario no está autenticado:
  - Guarda la URL destino en `sessionStorage`
  - Redirige a `/login`
- Si el usuario está autenticado pero intenta acceder a `/admin` sin ser administrador:
  - Redirige a `/reserva`

### 4.5 Routing

Las rutas están definidas en `app.routes.ts`:
- Rutas públicas: `/`, `/habitaciones`, `/servicios`, `/contacto`, `/login`, `/register`
- Rutas protegidas: `/reserva`, `/pago-confirmacion`, `/pago-metodo`, `/admin`

---

## 5. Componentes de PrimeNG Utilizados

### 5.1 Componentes de Formulario

| Componente | Módulo | Uso | Ubicación |
|------------|--------|-----|-----------|
| **InputText** | `InputTextModule` | Campos de texto (nombre, email, teléfono) | Login, Register, Reserva, Admin |
| **Password** | `PasswordModule` | Campo de contraseña con mostrar/ocultar | Login, Register |
| **InputNumber** | `InputNumberModule` | Campos numéricos (precio, capacidad) | Admin (gestión habitaciones) |
| **Dropdown** | `DropdownModule` | Selector de habitación, estado de reserva | Reserva, Admin |
| **Checkbox** | `CheckboxModule` | Checkbox para disponibilidad | Admin (gestión habitaciones) |

### 5.2 Componentes de Botones y Acciones

| Componente | Módulo | Uso | Ubicación |
|------------|--------|-----|-----------|
| **Button** | `ButtonModule` | Botones de acción en toda la aplicación | Todas las páginas |
| **ConfirmDialog** | `ConfirmDialogModule` | Diálogo de confirmación antes de eliminar | Admin |

### 5.3 Componentes de Visualización

| Componente | Módulo | Uso | Ubicación |
|------------|--------|-----|-----------|
| **Card** | `CardModule` | Tarjetas para mostrar contenido | Home, Habitaciones, Servicios, Contacto |
| **Table** | `TableModule` | Tabla de datos (reservas, habitaciones) | Admin |
| **Tag** | `TagModule` | Etiquetas de categoría (Más popular, Lujo) | Habitaciones, Admin |
| **Rating** | `RatingModule` | Calificación con estrellas | Home (testimonios) |
| **Dialog** | `DialogModule` | Diálogos modales para editar/crear | Habitaciones (detalles), Admin |

### 5.4 Componentes de Mensajería

| Componente | Módulo | Uso | Ubicación |
|------------|--------|-----|-----------|
| **Toast** | `ToastModule` | Notificaciones toast (éxito, error, info) | Layout (global), Reserva, Admin |
| **Message** | `MessageModule` | Mensajes de error/success en formularios | Login, Register |

### 5.5 Componentes de Navegación y Layout

| Componente | Módulo | Uso | Ubicación |
|------------|--------|-----|-----------|
| **TabView** | `TabViewModule` | Pestañas para organizar contenido | Admin (Reservas/Habitaciones) |

### 5.6 Servicios de PrimeNG

| Servicio | Uso | Ubicación |
|----------|-----|-----------|
| **MessageService** | Gestiona mensajes toast | `app.config.ts`, `AuthService`, `AdminComponent`, `ReservaComponent` |
| **ConfirmationService** | Gestiona diálogos de confirmación | `AdminComponent` |

### 5.7 Configuración de Tema

- **Tema:** Aura (PrimeNG v19)
- **Configuración:** En `app.config.ts` usando `providePrimeNG()`
- **Iconos:** PrimeIcons (iconos de Font Awesome adaptados)

---

## 6. Mini Manual de Uso de la Aplicación

### 6.1 Requisitos Previos

#### Frontend:
- Node.js (versión 18 o superior)
- Angular CLI: `npm install -g @angular/cli`
- Navegador web moderno (Chrome, Firefox, Edge)

#### Backend:
- Visual Studio 2022 o Visual Studio Code
- SQL Server (LocalDB o SQL Server Express)
- .NET SDK 8.0 o superior

### 6.2 Instalación y Despliegue

#### Paso 1: Configurar el Backend

1. **Abrir el proyecto backend en Visual Studio**
2. **Configurar la cadena de conexión** en `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=TU_SERVIDOR;Database=HotelTropicalDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

3. **Ejecutar los scripts SQL** para crear las tablas (ver `SQL_CREATE_TABLES.sql`)

4. **Ejecutar el backend:**
   - Presionar F5 en Visual Studio
   - Anotar el puerto que aparece en la consola (ej: `https://localhost:7265`)

5. **Aceptar el certificado SSL:**
   - Abrir `https://localhost:7265/swagger` en el navegador
   - Aceptar el certificado SSL cuando el navegador lo solicite

#### Paso 2: Configurar el Frontend

1. **Abrir terminal en la carpeta del proyecto Angular**

2. **Instalar dependencias:**
```bash
npm install
```

3. **Verificar el puerto del backend** en `src/app/services/api.service.ts`:
```typescript
const API_URL = 'https://localhost:7265/api'; // Cambiar si es diferente
```

4. **Iniciar el servidor de desarrollo:**
```bash
ng serve
```

5. **Abrir el navegador en:** `http://localhost:4200`

### 6.3 Guía de Uso para Clientes

#### 6.3.1 Explorar el Sitio (Sin Registro)

1. **Página de Inicio:**
   - Ver banner principal y testimonios
   - Hacer clic en "Ver Habitaciones" para explorar opciones

2. **Página de Habitaciones:**
   - Ver todas las habitaciones disponibles
   - Hacer clic en "Ver detalles" para más información
   - Hacer clic en "Reservar" (será redirigido al login si no está autenticado)

3. **Página de Servicios:**
   - Ver servicios adicionales del hotel

4. **Página de Contacto:**
   - Ver información de contacto del hotel

#### 6.3.2 Registrarse

1. **Ir a "Crear cuenta"** desde el menú o desde la página de login
2. **Completar el formulario:**
   - Nombre completo
   - Nombre de usuario (único)
   - Email (único)
   - Contraseña (mínimo 6 caracteres)
3. **Hacer clic en "Crear cuenta"**
4. **Ser redirigido al login** automáticamente

#### 6.3.3 Iniciar Sesión

1. **Ir a "Iniciar sesión"** desde el menú
2. **Ingresar:**
   - Nombre de usuario
   - Contraseña
3. **Hacer clic en "Iniciar Sesión"**
4. **Ser redirigido** según tu rol:
   - Cliente → Página de Reservas
   - Administrador → Panel de Administración

#### 6.3.4 Realizar una Reserva

1. **Navegar a "Habitaciones"** desde el menú
2. **Seleccionar una habitación** y hacer clic en "Reservar"
3. **Completar el formulario de reserva:**
   - Nombre completo (prellenado si está autenticado)
   - Fecha de entrada (date picker)
   - Fecha de salida (date picker)
   - Seleccionar habitación del dropdown
4. **Hacer clic en "Continuar"**
5. **Si la habitación está disponible:**
   - Ser redirigido a "Confirmar Datos"
   - Verificar/editar nombre, email, teléfono
   - Hacer clic en "Confirmar"
6. **Seleccionar método de pago:**
   - Tarjeta de crédito
   - Transferencia bancaria
   - Efectivo
7. **Hacer clic en "Confirmar Reserva"**
8. **Ver mensaje de confirmación**

#### 6.3.5 Cerrar Sesión

1. **Abrir el menú** (icono de hamburguesa)
2. **Hacer clic en "Cerrar Sesión"**
3. **Ver mensaje toast:** "Sesión cerrada"
4. **Ser redirigido** a la página de inicio

### 6.4 Guía de Uso para Administradores

#### 6.4.1 Acceder al Panel de Administración

1. **Iniciar sesión** con credenciales de administrador
2. **Ser redirigido automáticamente** al Panel de Administración

#### 6.4.2 Gestionar Reservas

1. **En la pestaña "Reservas":**
   - Ver tabla con todas las reservas
   - Información mostrada:
     - ID, Cliente, Habitación, Fechas, Estado, Total
   - **Editar reserva:**
     - Hacer clic en "Editar"
     - Cambiar el estado (Pendiente/Confirmada/Cancelada)
     - Hacer clic en "Guardar"
   - **Eliminar reserva:**
     - Hacer clic en "Eliminar"
     - Confirmar en el diálogo
     - Ver notificación de éxito

#### 6.4.3 Gestionar Habitaciones

1. **Cambiar a la pestaña "Habitaciones"**
2. **Ver tabla** con todas las habitaciones
3. **Crear nueva habitación:**
   - Hacer clic en "Nueva Habitación"
   - Completar formulario:
     - Nombre (requerido)
     - Descripción
     - Tipo (requerido)
     - Precio (requerido, > 0)
     - Capacidad (requerido, > 0)
     - Disponible (checkbox)
     - URL de imagen (opcional)
   - Hacer clic en "Crear"
   - Ver notificación de éxito
4. **Editar habitación:**
   - Hacer clic en "Editar" en la fila de la habitación
   - Modificar campos necesarios
   - Hacer clic en "Guardar"
5. **Eliminar habitación:**
   - Hacer clic en "Eliminar"
   - Confirmar en el diálogo
   - Ver notificación de éxito

### 6.5 Solución de Problemas Comunes

#### Error: "No se pudo conectar con el servidor"
- **Causa:** El backend no está ejecutándose o el puerto es incorrecto
- **Solución:**
  1. Verificar que Visual Studio esté ejecutando el backend
  2. Verificar el puerto en la consola de Visual Studio
  3. Actualizar `API_URL` en `api.service.ts` si es necesario
  4. Aceptar el certificado SSL en el navegador

#### Error: "Usuario o contraseña incorrectos"
- **Causa:** Credenciales incorrectas o usuario no existe
- **Solución:** Verificar credenciales o crear nueva cuenta

#### Error: "La habitación ya está reservada para esas fechas"
- **Causa:** Intento de reservar una habitación en fechas ocupadas
- **Solución:** Seleccionar otras fechas o otra habitación

#### Las imágenes no se muestran
- **Causa:** URLs de imágenes inválidas o bloqueadas por CORS
- **Solución:** Usar URLs de imágenes públicas (Unsplash, Pexels) o alojar imágenes localmente

---

## 7. Capturas de Pantalla Sugeridas

Para el informe, se recomienda incluir capturas de:

1. **Página de Inicio** - Banner y testimonios
2. **Página de Habitaciones** - Grid de tarjetas
3. **Formulario de Reserva** - Con campos completados
4. **Panel de Administración** - Tabla de reservas
5. **Panel de Administración** - Tabla de habitaciones
6. **Diálogo de Crear/Editar Habitación**
7. **Mensaje Toast** - Confirmación de acción
8. **Página de Login** - Formulario de autenticación

---

## 8. Conclusión

El Sistema de Gestión Hotelera es una aplicación completa que permite a los clientes realizar reservas de manera intuitiva y a los administradores gestionar eficientemente las habitaciones y reservas del hotel. La aplicación utiliza tecnologías modernas y sigue buenas prácticas de desarrollo, proporcionando una experiencia de usuario fluida y segura.

