# 📸 Guía: Dónde y Cómo Agregar Imágenes

## 🎯 Resumen de Ubicaciones

### 1. **Imágenes de Habitaciones** (Admin Panel)

**Ubicación**: Panel de Administración → Tab "Habitaciones" → Crear/Editar Habitación

**Campo**: "URL de Imagen"

**Cómo agregar**:
1. Ve al panel de administración (`/admin`)
2. Haz clic en "Nueva Habitación" o edita una existente
3. En el campo "URL de Imagen", pega la URL completa de la imagen
4. Guarda la habitación

**Ejemplo de URL válida**:
```
https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop
```

**⚠️ IMPORTANTE**: 
- La URL debe ser accesible públicamente (sin autenticación)
- Usa URLs de servicios como Unsplash, Pexels, o imágenes alojadas en tu servidor
- Las URLs de Google Images/Brave Search pueden no funcionar porque requieren referrer

**Dónde se muestran**: 
- Página `/habitaciones` - En las tarjetas de cada habitación
- Diálogo de detalles de habitación

---

### 2. **Imágenes de Servicios** (Código Frontend)

**Ubicación**: `src/app/pages/servicios/servicios.component.ts`

**Archivo**: Líneas 13-38

**Cómo agregar**:
Edita el array `servicios` y agrega la propiedad `imagen` a cada servicio:

```typescript
servicios = [
  {
    titulo: 'Desayuno Incluido',
    descripcion: 'Disfruta de un delicioso desayuno cada mañana...',
    imagen: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop'
  },
  {
    titulo: 'Gimnasio',
    descripcion: 'Mantente en forma...',
    imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'
  },
  // ... más servicios
];
```

**Ejemplos de URLs de Unsplash** (gratis y sin restricciones):
- **Desayuno**: `https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop`
- **Gimnasio**: `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop`
- **Piscina**: `https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop`
- **Wi-Fi**: `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop`
- **Spa**: `https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop`
- **Restaurante**: `https://images.unsplash.com/photo-1517248135467-4c7edcad99c9?w=400&h=300&fit=crop`

**Dónde se muestran**: 
- Página `/servicios` - En cada tarjeta de servicio (lado izquierdo)

---

## 🔧 Solución al Problema de Imágenes de Google/Brave

**Problema**: Las URLs de Google Images o Brave Search no funcionan porque:
1. Requieren un referrer específico
2. Pueden tener protección CORS
3. Son URLs temporales que pueden expirar

**Solución**: Usa servicios de imágenes gratuitos:

### Opción 1: Unsplash (Recomendado)
```
https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop
```
- Gratis
- Sin restricciones
- URLs estables

### Opción 2: Pexels
```
https://images.pexels.com/photos/[ID]/pexels-photo-[ID].jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop
```

### Opción 3: Alojar tus propias imágenes
1. Crea una carpeta `assets/images/` en `src/`
2. Coloca las imágenes ahí
3. Usa rutas relativas: `/assets/images/habitacion1.jpg`

---

## 📝 Pasos para Agregar Imágenes a Servicios

1. **Abre**: `src/app/pages/servicios/servicios.component.ts`

2. **Encuentra el array `servicios`** (líneas 13-38)

3. **Agrega la propiedad `imagen`** a cada servicio:

```typescript
{
  titulo: 'Desayuno Incluido',
  descripcion: 'Disfruta de un delicioso desayuno...',
  imagen: 'AQUÍ_PEGA_LA_URL_DE_LA_IMAGEN'
}
```

4. **Guarda el archivo**

5. **Las imágenes aparecerán automáticamente** en la página de servicios

---

## 📝 Pasos para Agregar Imágenes a Habitaciones (Admin)

1. **Inicia sesión como Administrador**

2. **Ve a**: Panel de Administración (`/admin`)

3. **Haz clic en**: Tab "Habitaciones"

4. **Crea o edita una habitación**:
   - Si es nueva: Click en "Nueva Habitación"
   - Si es existente: Click en el ícono de editar (lápiz)

5. **En el campo "URL de Imagen"**, pega la URL completa

6. **Haz clic en "Guardar" o "Crear"**

7. **La imagen aparecerá** en la página `/habitaciones`

---

## 🎨 Estilos CSS Aplicados

Las imágenes se muestran usando `background-image` en CSS:

**Habitaciones**:
```css
.room-image {
  background-size: cover;
  background-position: center;
}
```

**Servicios**:
```css
.servicio-image {
  background-size: cover;
  background-position: center;
}
```

Esto hace que las imágenes:
- Se ajusten al contenedor
- Mantengan su proporción
- Se centren correctamente

---

## ✅ Checklist

- [ ] Imágenes de servicios agregadas en `servicios.component.ts`
- [ ] URLs de imágenes son accesibles públicamente
- [ ] Imágenes de habitaciones agregadas desde el panel admin
- [ ] Las imágenes se muestran correctamente en las páginas
- [ ] No hay errores en la consola del navegador

---

## 🆘 Si las Imágenes No Se Muestran

1. **Verifica la URL**: Abre la URL en una nueva pestaña del navegador
2. **Revisa la consola**: F12 → Console, busca errores CORS o 404
3. **Usa URLs de Unsplash**: Son más confiables
4. **Verifica el formato**: Debe ser `.jpg`, `.png`, `.webp`, etc.

