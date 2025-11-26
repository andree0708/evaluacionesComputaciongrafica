# 📸 Funcionamiento de la Carga de Imágenes

Este documento explica detalladamente cómo funciona el sistema de carga y visualización de imágenes en el proyecto.

---

## 📋 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Sistema de Imágenes para Habitaciones](#sistema-de-imágenes-para-habitaciones)
3. [Sistema de Imágenes para Servicios](#sistema-de-imágenes-para-servicios)
4. [Flujo de Datos](#flujo-de-datos)
5. [Renderizado en el Frontend](#renderizado-en-el-frontend)
6. [Almacenamiento](#almacenamiento)

---

## 🏗️ Arquitectura General

El sistema de imágenes funciona de **dos maneras diferentes** según el tipo de contenido:

### 1. **Habitaciones** (Dinámico - Base de Datos)
- Las URLs de imágenes se almacenan en la base de datos
- Se pueden agregar/editar desde el panel de administración
- Se cargan dinámicamente desde la API

### 2. **Servicios** (Estático - Código Frontend)
- Las URLs de imágenes están hardcodeadas en el componente TypeScript
- No se almacenan en base de datos
- Se modifican editando el código

---

## 🏨 Sistema de Imágenes para Habitaciones

### Estructura de Datos

#### Backend (Base de Datos)

**Tabla: `Habitaciones`**
```sql
CREATE TABLE Habitaciones (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    Tipo NVARCHAR(50) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    Capacidad INT NOT NULL,
    Disponible BIT NOT NULL DEFAULT 1,
    ImagenUrl NVARCHAR(500)  -- ← Campo para almacenar la URL
);
```

**Modelo C# (`Habitacion.cs`):**
```csharp
public class Habitacion {
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public int Capacidad { get; set; }
    public bool Disponible { get; set; }
    public string? ImagenUrl { get; set; }  // ← Propiedad nullable
}
```

### Flujo Completo

#### Paso 1: Agregar/Editar Imagen (Panel Admin)

**Ubicación:** `/admin` → Tab "Habitaciones"

**Proceso:**
1. El administrador hace clic en "Nueva Habitación" o edita una existente
2. Se abre un diálogo modal con un formulario
3. En el campo "URL de Imagen", el admin pega la URL completa
4. Al guardar, se envía una petición HTTP al backend

**Código del Formulario (`admin.component.html`):**
```html
<div class="form-group">
  <label class="form-label">URL de Imagen</label>
  <input 
    pInputText 
    [(ngModel)]="nuevaHabitacion.imagenUrl" 
    class="w-full" 
    placeholder="https://images.unsplash.com/photo-..."
  />
</div>
```

#### Paso 2: Guardar en Base de Datos (Backend)

**Endpoint:** `POST /api/Habitaciones` o `PUT /api/Habitaciones/{id}`

**Controller (`HabitacionesController.cs`):**
```csharp
[HttpPost]
public async Task<ActionResult<Habitacion>> CreateHabitacion([FromBody] Habitacion habitacion)
{
    // Validaciones...
    
    // El campo ImagenUrl viene en el objeto habitacion
    var id = await _habitacionRepository.CreateAsync(habitacion);
    habitacion.Id = id;
    
    return CreatedAtAction(nameof(GetHabitacion), new { id = habitacion.Id }, habitacion);
}
```

**Repository (`HabitacionRepository.cs`):**
```csharp
public async Task<int> CreateAsync(Habitacion habitacion)
{
    var sql = @"INSERT INTO Habitaciones 
                (Nombre, Descripcion, Tipo, Precio, Capacidad, Disponible, ImagenUrl)
                VALUES 
                (@Nombre, @Descripcion, @Tipo, @Precio, @Capacidad, @Disponible, @ImagenUrl);
                SELECT CAST(SCOPE_IDENTITY() as int);";
    
    // Dapper mapea automáticamente habitacion.ImagenUrl a @ImagenUrl
    var id = await _db.ExecuteScalarAsync<int>(sql, habitacion);
    return id;
}
```

**SQL Ejecutado:**
```sql
INSERT INTO Habitaciones (Nombre, Descripcion, Tipo, Precio, Capacidad, Disponible, ImagenUrl)
VALUES ('Suite Presidencial', 'Suite de lujo...', 'Suite', 500.00, 2, 1, 
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop');
```

#### Paso 3: Cargar desde la API (Frontend)

**Componente (`habitaciones.component.ts`):**
```typescript
export class HabitacionesComponent implements OnInit {
  habitaciones: any[] = [];

  ngOnInit(): void {
    // Llamada HTTP al backend
    this.apiService.getHabitaciones().subscribe({
      next: (data) => {
        // data es un array de objetos Habitacion con ImagenUrl
        this.habitaciones = data.map((habitacion: any) => ({
          ...habitacion,  // Incluye habitacion.imagenUrl
          tag: habitacion.tipo === 'Suite' ? 'Lujo' : 'Más popular',
          tagSeverity: 'success' as const
        }));
      }
    });
  }
}
```

**Servicio API (`api.service.ts`):**
```typescript
getHabitaciones(): Observable<any> {
  return this.http.get(`${API_URL}/Habitaciones`);
  // Retorna: [{ id: 1, nombre: "...", imagenUrl: "https://...", ... }]
}
```

#### Paso 4: Renderizar en el Template

**Template (`habitaciones.component.html`):**
```html
<div class="room-image" 
     [style.background-image]="habitacion.imagenUrl ? 'url(' + habitacion.imagenUrl + ')' : 'none'">
  
  <!-- Si NO hay imagen, mostrar placeholder -->
  <div class="room-placeholder" *ngIf="!habitacion.imagenUrl">
    {{ habitacion.nombre }}
  </div>
</div>
```

**Explicación del Binding:**
- `[style.background-image]` es un binding de propiedad de Angular
- Si `habitacion.imagenUrl` existe, crea: `background-image: url(https://...)`
- Si no existe, usa: `background-image: none`
- El `*ngIf` muestra un placeholder con el nombre si no hay imagen

#### Paso 5: Estilos CSS

**CSS (`habitaciones.component.css`):**
```css
.room-image {
  position: relative;
  height: 200px;
  background: var(--gris-claro);  /* Color de fondo si no hay imagen */
  background-size: cover;          /* Ajusta la imagen al contenedor */
  background-position: center;      /* Centra la imagen */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Propiedades CSS importantes:**
- `background-size: cover`: La imagen cubre todo el contenedor manteniendo proporción
- `background-position: center`: Centra la imagen horizontal y verticalmente
- `height: 200px`: Altura fija del contenedor

---

## 🎯 Sistema de Imágenes para Servicios

### Estructura de Datos

**Componente TypeScript (`servicios.component.ts`):**
```typescript
export class ServiciosComponent {
  servicios = [
    {
      titulo: 'Desayuno Incluido',
      descripcion: 'Disfruta de un delicioso desayuno...',
      imagen: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop'
    },
    {
      titulo: 'Gimnasio',
      descripcion: 'Mantente en forma...',
      imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'
    },
    // ... más servicios
  ];
}
```

### Flujo Completo

#### Paso 1: Definir en el Código

Las imágenes se definen directamente en el array `servicios` del componente.

**No hay:**
- ❌ Base de datos
- ❌ API endpoints
- ❌ Panel de administración

**Solo hay:**
- ✅ Array hardcodeado en TypeScript

#### Paso 2: Renderizar en el Template

**Template (`servicios.component.html`):**
```html
<div class="servicio-image" 
     [style.background-image]="'url(' + servicio.imagen + ')'">
</div>
```

**Explicación:**
- `servicio.imagen` contiene la URL completa
- Se concatena con `'url(' + ... + ')'` para crear el valor CSS
- Resultado: `background-image: url(https://images.unsplash.com/...)`

#### Paso 3: Estilos CSS

**CSS (`servicios.component.css`):**
```css
.servicio-image {
  width: 120px;
  height: 120px;
  background: var(--gris-claro);
  background-size: cover;      /* Ajusta la imagen */
  background-position: center;  /* Centra la imagen */
  border-radius: 8px;          /* Bordes redondeados */
  flex-shrink: 0;              /* No se encoge */
}
```

---

## 🔄 Flujo de Datos Comparativo

### Habitaciones (Dinámico)

```
┌─────────────────┐
│  Panel Admin   │
│  (Frontend)    │
└────────┬───────┘
         │ POST/PUT /api/Habitaciones
         │ { ..., "imagenUrl": "https://..." }
         ▼
┌─────────────────┐
│   Backend API   │
│  Controller     │
└────────┬───────┘
         │
         ▼
┌─────────────────┐
│   Repository    │
│  (Dapper)       │
└────────┬───────┘
         │ INSERT/UPDATE
         │ ImagenUrl = 'https://...'
         ▼
┌─────────────────┐
│  SQL Server     │
│  Base de Datos  │
└────────┬───────┘
         │
         │ GET /api/Habitaciones
         ▼
┌─────────────────┐
│   Frontend      │
│  Component      │
└────────┬───────┘
         │
         ▼
┌─────────────────┐
│   Template      │
│  HTML + CSS     │
└─────────────────┘
```

### Servicios (Estático)

```
┌─────────────────┐
│  TypeScript     │
│  Component      │
│  servicios = [] │
└────────┬───────┘
         │
         ▼
┌─────────────────┐
│   Template      │
│  HTML + CSS     │
└─────────────────┘
```

---

## 🎨 Renderizado en el Frontend

### Técnica Utilizada: `background-image` CSS

**¿Por qué `background-image` y no `<img>`?**

**Ventajas:**
1. ✅ Control total sobre el tamaño y posición
2. ✅ Fácil de hacer responsive
3. ✅ Permite overlays (como el tag "Más popular")
4. ✅ Mejor para imágenes decorativas

**Desventajas:**
1. ❌ No es semántico (no hay `<img>` con `alt`)
2. ❌ No se puede hacer lazy loading fácilmente
3. ❌ No es accesible para lectores de pantalla

### Ejemplo de Renderizado

**HTML Generado:**
```html
<!-- Habitación con imagen -->
<div class="room-image" 
     style="background-image: url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop);">
  <p-tag value="Lujo" severity="warn"></p-tag>
</div>

<!-- Habitación sin imagen -->
<div class="room-image" style="background-image: none;">
  <div class="room-placeholder">Habitación Doble</div>
</div>
```

### Manejo de Errores

**Si la imagen no carga:**
- El navegador muestra el color de fondo (`var(--gris-claro)`)
- Para habitaciones, se muestra el placeholder con el nombre
- Para servicios, solo se ve el fondo gris

**No hay validación de:**
- ❌ Si la URL es válida
- ❌ Si la imagen existe
- ❌ Si hay errores de CORS

---

## 💾 Almacenamiento

### Habitaciones

**Ubicación:** Base de datos SQL Server
- **Tabla:** `Habitaciones`
- **Campo:** `ImagenUrl` (NVARCHAR(500))
- **Tipo:** URL externa (string)

**Ejemplo en BD:**
```
Id | Nombre              | ImagenUrl
---|---------------------|--------------------------------------------------
1  | Habitación Doble    | https://images.unsplash.com/photo-1566073771259...
2  | Suite              | https://images.unsplash.com/photo-1578683010236...
3  | Individual         | NULL
```

### Servicios

**Ubicación:** Código fuente TypeScript
- **Archivo:** `src/app/pages/servicios/servicios.component.ts`
- **Tipo:** Array hardcodeado

**No se almacena en:**
- ❌ Base de datos
- ❌ Archivos locales
- ❌ Servidor

---

## 🔧 Cómo Agregar/Modificar Imágenes

### Para Habitaciones

1. **Iniciar sesión como Administrador**
2. **Ir a:** `/admin` → Tab "Habitaciones"
3. **Crear o editar habitación:**
   - Click en "Nueva Habitación" o icono de editar
4. **En el campo "URL de Imagen":**
   - Pegar URL completa: `https://images.unsplash.com/photo-...`
5. **Guardar**
6. **La imagen aparecerá automáticamente** en `/habitaciones`

### Para Servicios

1. **Abrir:** `src/app/pages/servicios/servicios.component.ts`
2. **Encontrar el array `servicios`** (líneas 13-44)
3. **Modificar la propiedad `imagen`** de cada servicio:
   ```typescript
   {
     titulo: 'Desayuno Incluido',
     descripcion: '...',
     imagen: 'NUEVA_URL_AQUI'  // ← Cambiar aquí
   }
   ```
4. **Guardar el archivo**
5. **Recargar la página** `/servicios`

---

## 📝 Formatos de URL Soportados

### URLs Externas (Recomendado)

**Unsplash:**
```
https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop
```

**Pexels:**
```
https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600
```

### URLs Locales (Si se implementa)

**Si se alojan imágenes en el backend:**
```
https://localhost:7265/images/habitacion1.jpg
```

**Si se alojan en assets de Angular:**
```
/assets/images/habitacion1.jpg
```

---

## ⚠️ Consideraciones Importantes

### 1. CORS (Cross-Origin Resource Sharing)

**Problema:** Algunos servicios de imágenes bloquean peticiones desde otros dominios.

**Solución:** Usar servicios que permitan CORS:
- ✅ Unsplash
- ✅ Pexels
- ❌ Google Images (requiere referrer)
- ❌ Brave Search Images (puede bloquear)

### 2. URLs Temporales

**Problema:** Algunas URLs de imágenes pueden expirar.

**Solución:** Usar URLs estables:
- ✅ Unsplash: URLs permanentes
- ✅ Pexels: URLs permanentes
- ❌ URLs de búsqueda de imágenes: Pueden expirar

### 3. Tamaño de Imágenes

**Recomendación:** Usar parámetros de tamaño en URLs:
```
https://images.unsplash.com/photo-...?w=800&h=600&fit=crop
```

**Ventajas:**
- ✅ Imágenes más pequeñas = carga más rápida
- ✅ Menor uso de ancho de banda
- ✅ Mejor experiencia de usuario

### 4. Placeholder para Imágenes Faltantes

**Habitaciones:**
- Si `imagenUrl` es `null` o vacío, se muestra el nombre de la habitación

**Servicios:**
- Todas las imágenes están hardcodeadas, así que siempre deberían existir

---

## 🚀 Mejoras Futuras Posibles

### 1. Subida de Archivos

**Implementar:**
- Campo de subida de archivos en el panel admin
- Almacenar imágenes en el servidor (carpeta `wwwroot/images`)
- Generar URLs relativas: `/images/habitacion-1.jpg`

### 2. Validación de URLs

**Agregar:**
- Validación en el frontend antes de guardar
- Verificar que la URL sea accesible
- Mostrar preview de la imagen antes de guardar

### 3. Optimización de Imágenes

**Implementar:**
- Lazy loading para imágenes
- WebP format con fallback
- Responsive images (diferentes tamaños según dispositivo)

### 4. Base de Datos para Servicios

**Migrar:**
- Crear tabla `Servicios` en la base de datos
- Permitir CRUD desde el panel admin
- Misma funcionalidad que habitaciones

---

## 📚 Resumen

### Habitaciones
- ✅ Dinámico (desde base de datos)
- ✅ Editable desde panel admin
- ✅ Almacenado en SQL Server
- ✅ Cargado desde API

### Servicios
- ✅ Estático (hardcodeado)
- ✅ Editable desde código
- ✅ No requiere base de datos
- ✅ Más simple pero menos flexible

### Renderizado
- ✅ Usa `background-image` CSS
- ✅ Responsive con `background-size: cover`
- ✅ Placeholder para imágenes faltantes
- ✅ Overlays (tags) sobre imágenes

---

**Última actualización:** Noviembre 2024

