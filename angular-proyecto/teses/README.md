# Hotel Tropical - Sistema de Reservas

Aplicación web desarrollada en Angular 19 para la gestión de reservas de un hotel con diseño tropical y componentes PrimeNG.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Componentes PrimeNG Utilizados](#componentes-primeng-utilizados)
- [Estructura de la Aplicación](#estructura-de-la-aplicación)
- [Flujo de Datos](#flujo-de-datos)
- [Flujo de Funcionamiento](#flujo-de-funcionamiento)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Paleta de Colores](#paleta-de-colores)

## 📝 Descripción

Hotel Tropical es una aplicación web moderna que permite a los usuarios:
- Explorar diferentes tipos de habitaciones disponibles
- Ver servicios adicionales y testimonios de huéspedes
- Realizar reservas de habitaciones
- Completar el proceso de pago con múltiples métodos

## 🛠 Tecnologías Utilizadas

- **Angular 19.2.0** - Framework principal
- **PrimeNG 19.1.4** - Biblioteca de componentes UI
- **PrimeIcons 7.0.0** - Iconos
- **TypeScript 5.7.2** - Lenguaje de programación
- **RxJS 7.8.0** - Programación reactiva
- **@primeuix/themes 1.2.5** - Sistema de temas

## 🎨 Componentes PrimeNG Utilizados

### 1. **ButtonModule** (`primeng/button`)
- **Función**: Botones interactivos con múltiples estilos
- **Uso en la aplicación**:
  - Botones de navegación (Ver Habitaciones, Contáctanos)
  - Botones de acción (Reservar, Enviar Reserva, Confirmar)
  - Botones de menú (toggle del sidebar)
- **Características**: Soporta estilos outlined, rounded, con iconos

### 2. **CardModule** (`primeng/card`)
- **Función**: Contenedores de contenido con header, body y footer
- **Uso en la aplicación**:
  - Tarjetas de habitaciones con imagen, descripción y botón de reserva
  - Tarjetas de servicios adicionales
  - Tarjetas de testimonios de huéspedes
  - Formularios de reserva y pago
- **Características**: Estructura flexible con templates personalizables

### 3. **TagModule** (`primeng/tag`)
- **Función**: Etiquetas para categorizar o destacar información
- **Uso en la aplicación**:
  - Etiquetas en habitaciones: "Más popular", "Lujo", "Económica"
- **Características**: Diferentes severities (success, warn, info)

### 4. **InputTextModule** (`primeng/inputtext`)
- **Función**: Campos de entrada de texto estilizados
- **Uso en la aplicación**:
  - Campo de nombre completo en reserva
  - Campos de confirmación de datos (nombre, correo, teléfono)
- **Características**: Integración con formularios reactivos

### 5. **RatingModule** (`primeng/rating`)
- **Función**: Componente de calificación con estrellas
- **Uso en la aplicación**:
  - Mostrar calificaciones de 5 estrellas en testimonios
- **Características**: Modo solo lectura para visualización

### 6. **ToastModule** (`primeng/toast`)
- **Función**: Notificaciones toast para mensajes al usuario
- **Uso en la aplicación**:
  - Confirmación de pago procesado exitosamente
- **Características**: Mensajes de éxito, error, información

### 7. **MessageService** (`primeng/api`)
- **Función**: Servicio para gestionar mensajes toast
- **Uso en la aplicación**:
  - Mostrar notificaciones cuando se completa el pago
- **Características**: Integrado con ToastModule

## 🏗 Estructura de la Aplicación

```
src/
├── app/
│   ├── components/
│   │   └── layout/
│   │       ├── layout.component.ts       # Componente principal con menú lateral
│   │       ├── layout.component.html
│   │       └── layout.component.css
│   │
│   ├── pages/
│   │   ├── home/
│   │   │   └── home.component.*          # Página de inicio con banner promocional
│   │   │
│   │   ├── habitaciones/
│   │   │   └── habitaciones.component.* # Lista de habitaciones disponibles
│   │   │
│   │   ├── servicios/
│   │   │   └── servicios.component.*    # Servicios adicionales y testimonios
│   │   │
│   │   ├── reserva/
│   │   │   └── reserva.component.*      # Formulario de reserva
│   │   │
│   │   ├── pago-confirmacion/
│   │   │   └── pago-confirmacion.component.* # Confirmación de datos personales
│   │   │
│   │   └── pago-metodo/
│   │       └── pago-metodo.component.*   # Selección de método de pago
│   │
│   ├── app.component.ts                  # Componente raíz
│   ├── app.config.ts                     # Configuración de la app (tema PrimeNG)
│   └── app.routes.ts                     # Configuración de rutas
│
├── styles.css                            # Estilos globales y paleta de colores
└── index.html                            # HTML principal
```

## 🔄 Flujo de Datos

### 1. **Estado de Componentes**

#### LayoutComponent
```typescript
sidebarVisible: boolean = false  // Controla la visibilidad del menú lateral
```

#### HomeComponent
- No maneja estado, solo presenta información y botones de navegación

#### HabitacionesComponent
```typescript
habitaciones = [
  {
    id: number,
    nombre: string,
    descripcion: string,
    tag: string,
    tagSeverity: 'success' | 'warn' | 'info'
  }
]
```

#### ServiciosComponent
```typescript
servicios = [
  { titulo: string, descripcion: string }
]

testimonios = [
  {
    nombre: string,
    comentario: string,
    rating: number (1-5)
  }
]
```

#### ReservaComponent
```typescript
nombreCompleto: string = ''
fechaEntrada: string = ''      // Formato: YYYY-MM-DD
fechaSalida: string = ''      // Formato: YYYY-MM-DD
```

#### PagoConfirmacionComponent
```typescript
nombre: string = ''
correo: string = ''
telefono: string = ''
```

#### PagoMetodoComponent
```typescript
metodosPago = [
  { nombre: string, icono: string }
]
metodoSeleccionado: string | null = null
```

### 2. **Flujo de Navegación**

```
Inicio (/) 
  ↓ [Ver Habitaciones]
Habitaciones (/habitaciones)
  ↓ [Reservar]
Reserva (/reserva)
  ↓ [Enviar Reserva]
Pago Confirmación (/pago-confirmacion)
  ↓ [Confirmar]
Pago Método (/pago-metodo)
  ↓ [Proceder con el Pago]
Inicio (/) [Redirección automática]
```

### 3. **Comunicación entre Componentes**

- **Router Service**: Navegación entre páginas usando `Router.navigate()`
- **Query Parameters**: Envío de ID de habitación seleccionada (preparado para implementación)
- **MessageService**: Notificaciones toast para feedback al usuario

## 🚀 Flujo de Funcionamiento

### 1. **Página de Inicio (Home)**

**Ruta**: `/`

**Funcionalidad**:
- Muestra banner promocional con mensaje de bienvenida
- Dos botones principales:
  - **"Contáctanos"**: Navega a `/servicios`
  - **"Ver Habitaciones"**: Navega a `/habitaciones`

**Componentes PrimeNG**:
- `p-button` (2 instancias: outlined y sólido)

---

### 2. **Página de Habitaciones**

**Ruta**: `/habitaciones`

**Funcionalidad**:
- Muestra 3 tipos de habitaciones en tarjetas:
  1. **Habitación Doble** (Tag: "Más popular")
  2. **Suite** (Tag: "Lujo")
  3. **Habitación Individual** (Tag: "Económica")
- Cada tarjeta tiene:
  - Imagen placeholder
  - Tag con severity
  - Título y descripción
  - Botón "Reservar"

**Componentes PrimeNG**:
- `p-card` (3 instancias)
- `p-tag` (3 instancias con diferentes severities)
- `p-button` (4 instancias: 1 general + 3 por habitación)

**Flujo de datos**:
```typescript
reservar(id: number) {
  // Navega a /reserva con queryParams
  this.router.navigate(['/reserva'], { 
    queryParams: { habitacion: id } 
  });
}
```

---

### 3. **Página de Servicios**

**Ruta**: `/servicios`

**Funcionalidad**:
- **Sección de Servicios Adicionales**:
  - Título y descripción
  - Botón "Ver Servicios" (navega a `/reserva`)
  - 2 tarjetas de servicios:
    - Desayuno Incluido
    - Gimnasio

- **Sección de Testimonios**:
  - Título y descripción
  - 2 tarjetas de testimonios con:
    - Avatar placeholder
    - Nombre del huésped
    - Rating de 5 estrellas
    - Comentario

**Componentes PrimeNG**:
- `p-card` (4 instancias: 2 servicios + 2 testimonios)
- `p-button` (1 instancia)
- `p-rating` (2 instancias, modo readonly)

---

### 4. **Página de Reserva**

**Ruta**: `/reserva`

**Funcionalidad**:
- Formulario de reserva con:
  - Campo de nombre completo (InputText)
  - Dos campos de fecha (HTML5 date inputs):
    - Fecha de entrada
    - Fecha de salida
  - Botón "Enviar Reserva"

- Footer con información de contacto:
  - Dirección
  - Teléfono
  - Redes sociales

**Componentes PrimeNG**:
- `p-card` (1 instancia para el formulario)
- `p-inputtext` (1 instancia)
- `p-button` (1 instancia)

**Flujo de datos**:
```typescript
enviarReserva() {
  if (this.nombreCompleto && this.fechaEntrada && this.fechaSalida) {
    this.router.navigate(['/pago-confirmacion']);
  }
}
```

---

### 5. **Página de Confirmación de Pago**

**Ruta**: `/pago-confirmacion`

**Funcionalidad**:
- Header con:
  - Título "Detalles de Pago"
  - Descripción
  - Dos botones:
    - "Cancelar" (navega a `/reserva`)
    - "Continuar" (navega a `/pago-metodo`)

- Formulario de confirmación de datos:
  - Nombre completo
  - Correo electrónico
  - Número de teléfono
  - Botón "Confirmar"

**Componentes PrimeNG**:
- `p-card` (1 instancia)
- `p-inputtext` (3 instancias)
- `p-button` (3 instancias)

**Flujo de datos**:
```typescript
confirmar() {
  if (this.nombre && this.correo && this.telefono) {
    this.router.navigate(['/pago-metodo']);
  }
}
```

---

### 6. **Página de Método de Pago**

**Ruta**: `/pago-metodo`

**Funcionalidad**:
- Título "Selección de Método de Pago"
- Grid de 4 métodos de pago:
  1. Efecty
  2. Visa
  3. MasterCard
  4. PayPal
- Cada método es un botón seleccionable
- Botón "Proceder con el Pago" (habilitado solo si hay método seleccionado)
- Footer con información de contacto

**Componentes PrimeNG**:
- `p-card` (1 instancia)
- `p-button` (1 instancia)
- `p-toast` (1 instancia para notificaciones)

**Flujo de datos**:
```typescript
seleccionarMetodo(metodo: string) {
  this.metodoSeleccionado = metodo;
}

procederPago() {
  if (this.metodoSeleccionado) {
    // Muestra notificación de éxito
    this.messageService.add({
      severity: 'success',
      summary: 'Pago procesado',
      detail: `Pago procesado con ${this.metodoSeleccionado}`
    });
    
    // Redirige al inicio después de 2 segundos
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }
}
```

---

### 7. **Layout Component (Menú Lateral)**

**Funcionalidad**:
- Header fijo con:
  - Botón de menú (hamburguesa)
  - Logo "Hotel Tropical"

- Menú lateral desplegable (lado izquierdo):
  - Inicio
  - Habitaciones
  - Servicios
  - Reservar

- Overlay oscuro cuando el menú está abierto

**Componentes PrimeNG**:
- `p-button` (1 instancia para toggle del menú)

**Flujo de datos**:
```typescript
toggleSidebar() {
  this.sidebarVisible = !this.sidebarVisible;
}
```

---

## 📦 Instalación

1. **Clonar el repositorio** (si aplica)
```bash
git clone <url-del-repositorio>
cd angular-proyecto
```

2. **Instalar dependencias**
```bash
npm install --legacy-peer-deps
```

**Nota**: Se usa `--legacy-peer-deps` debido a diferencias menores de versiones entre Angular 19 y algunas dependencias.

---

## ▶️ Ejecución

### Modo Desarrollo
```bash
ng serve
```
La aplicación estará disponible en `http://localhost:4200`

### Compilar para Producción
```bash
ng build
```
Los archivos compilados se generarán en `dist/angular-proyecto/`

### Compilar con Watch Mode
```bash
ng build --watch
```

---

## 🎨 Paleta de Colores

La aplicación utiliza una paleta de colores tropical definida en `src/styles.css`:

```css
--verde-tropical: #4a7c59    /* Verde principal */
--cafe-claro: #d4a574        /* Café claro para acentos */
--cafe-oscuro: #8b6f47       /* Café oscuro para textos y botones */
--verde-claro: #a8d5ba       /* Verde claro para fondos suaves */
--blanco: #ffffff            /* Blanco para contrastes */
--gris-claro: #f5f5f5        /* Gris claro para fondos */
--gris-oscuro: #333333       /* Gris oscuro para textos secundarios */
```

### Aplicación de Colores

- **Header**: Gradiente de verde tropical a café claro
- **Botones principales**: Café oscuro con hover en café claro
- **Botones outlined**: Borde café oscuro, fondo transparente
- **Fondos**: Gris claro para el body, blanco para tarjetas
- **Textos**: Café oscuro para mejor legibilidad

---

## 🔧 Configuración de PrimeNG

El tema de PrimeNG se configura en `src/app/app.config.ts`:

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

Se utiliza el preset **Aura** de `@primeuix/themes` con modo claro.

---

## 📱 Responsive Design

La aplicación es responsive y se adapta a diferentes tamaños de pantalla:

- **Desktop**: Layout completo con menú lateral
- **Tablet**: Menú lateral con overlay
- **Mobile**: Menú lateral oculto por defecto, se activa con botón hamburguesa

---

## 🚧 Mejoras Futuras

- [ ] Implementar servicio de reservas con backend
- [ ] Agregar validación de formularios más robusta
- [ ] Implementar autenticación de usuarios
- [ ] Agregar galería de imágenes reales para habitaciones
- [ ] Integrar pasarela de pago real
- [ ] Agregar sistema de gestión de reservas para administradores
- [ ] Implementar búsqueda y filtros de habitaciones
- [ ] Agregar calendario visual para selección de fechas

---

## 📄 Licencia

Este proyecto es parte de un proyecto académico de Computación Gráfica.

---

## 👥 Autores

- **Andrea Martínez Galíndez**

---

## 📞 Contacto

Para más información sobre el proyecto, contactar a través de:
- Email: info@hotel.com
- Teléfono: +57 123 456 789

---

**Desarrollado con ❤️ usando Angular y PrimeNG**
