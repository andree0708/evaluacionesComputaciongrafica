# 🔌 Guía: Conectar Backend con Frontend

## ⚠️ Problema Común
Si ves "Error: no se pudo conectar con el servidor", sigue estos pasos:

---

## 📋 Paso 1: Verificar el Puerto del Backend

### 1.1 En Visual Studio:
1. Ejecuta tu proyecto backend (F5)
2. Mira la **ventana de salida** o la **consola** de Visual Studio
3. Busca un mensaje como:
   ```
   Now listening on: https://localhost:XXXX
   ```
   Donde `XXXX` es el puerto (puede ser `7128`, `7265`, `5001`, etc.)

### 1.2 O revisa el archivo `Properties/launchSettings.json`:
```json
{
  "profiles": {
    "Hotelbackend": {
      "applicationUrl": "https://localhost:7128;http://localhost:5000"
    }
  }
}
```

**Anota el puerto HTTPS** (el que empieza con `https://`)

---

## 📋 Paso 2: Actualizar la URL en Angular

### 2.1 Abre `src/app/services/api.service.ts`

### 2.2 Cambia la línea 5:
```typescript
// Si tu backend está en el puerto 7265:
const API_URL = 'https://localhost:7265/api';

// Si tu backend está en el puerto 7128:
const API_URL = 'https://localhost:7128/api';
```

**⚠️ IMPORTANTE**: Usa el puerto que viste en el Paso 1

---

## 📋 Paso 3: Aceptar el Certificado SSL

### 3.1 Abre el navegador (Chrome, Edge, etc.)

### 3.2 Ve a la URL del backend:
```
https://localhost:XXXX/swagger
```
(Reemplaza XXXX con tu puerto)

### 3.3 Si aparece una advertencia de seguridad:
- Haz clic en **"Avanzado"** o **"Advanced"**
- Haz clic en **"Continuar al sitio"** o **"Proceed to localhost"**
- Esto acepta el certificado SSL para tu máquina

### 3.4 Verifica que Swagger se abra correctamente
Deberías ver la interfaz de Swagger con tus endpoints

---

## 📋 Paso 4: Verificar CORS en el Backend

### 4.1 Abre `Program.cs` en Visual Studio

### 4.2 Busca la configuración de CORS:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")  // ← Debe ser HTTP, no HTTPS
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});
```

### 4.3 Asegúrate de que:
- ✅ El origen sea `http://localhost:4200` (HTTP, no HTTPS)
- ✅ Esté antes de `app.UseAuthorization()`
- ✅ Esté después de `app.UseHttpsRedirection()`

### 4.4 El orden correcto en `Program.cs`:
```csharp
app.UseHttpsRedirection();
app.UseCors("AllowAngular");  // ← Aquí
app.UseAuthorization();
app.MapControllers();
```

---

## 📋 Paso 5: Probar la Conexión

### 5.1 Ejecuta el Backend:
- En Visual Studio, presiona **F5**
- Espera a que aparezca "Now listening on..."

### 5.2 Ejecuta el Frontend:
```bash
cd "C:\Users\Andrea\Documents\proyectoFianlCG\evaluacionesComputaciongrafica\angular-proyecto"
ng serve
```

### 5.3 Abre el navegador:
```
http://localhost:4200
```

### 5.4 Prueba el Login:
1. Ve a `/login`
2. Ingresa: `admin` / `admin123`
3. Si funciona, deberías ser redirigido a `/admin`

### 5.5 Si aún no funciona, abre la Consola del Navegador:
1. Presiona **F12** en el navegador
2. Ve a la pestaña **"Console"**
3. Intenta hacer login de nuevo
4. Mira los errores que aparecen:
   - Si dice `CORS`, el problema es CORS
   - Si dice `net::ERR_CONNECTION_REFUSED`, el backend no está corriendo
   - Si dice `certificate`, necesitas aceptar el certificado SSL

---

## 📋 Paso 6: Verificar que el Endpoint Existe

### 6.1 En Swagger (`https://localhost:XXXX/swagger`):
1. Busca el endpoint `POST /api/Users/Login`
2. Haz clic en **"Try it out"**
3. Ingresa:
   ```json
   {
     "nombreUsuario": "admin",
     "password": "admin123"
   }
   ```
4. Haz clic en **"Execute"**
5. Deberías ver una respuesta `200 OK` con los datos del usuario

### 6.2 Si el endpoint no existe:
- Verifica que tu controlador se llame `UsersController`
- Verifica que tenga el método `[HttpPost("Login")]`
- Verifica que la ruta sea `[Route("api/[controller]")]`

---

## 📋 Paso 7: Verificar el Endpoint de Registro

### 7.1 En Swagger:
1. Busca `POST /api/Users/Register`
2. Si no existe, necesitas crearlo en el backend

### 7.2 El método debería ser:
```csharp
[HttpPost("Register")]
public async Task<ActionResult> Register([FromBody] RegisterRequest request)
{
    // Tu código aquí
}
```

---

## 🔧 Soluciones Rápidas

### Error: "CORS policy"
**Solución**: Verifica el Paso 4 (CORS)

### Error: "ERR_CONNECTION_REFUSED"
**Solución**: 
1. Verifica que el backend esté corriendo (F5 en Visual Studio)
2. Verifica el puerto en `api.service.ts`

### Error: "Certificate" o "SSL"
**Solución**: Sigue el Paso 3 (Aceptar certificado)

### Error: "404 Not Found"
**Solución**: 
1. Verifica que la ruta del endpoint sea correcta
2. Verifica que el controlador esté registrado

---

## ✅ Checklist Final

Antes de probar, verifica:

- [ ] Backend está corriendo (F5 en Visual Studio)
- [ ] El puerto en `api.service.ts` coincide con el del backend
- [ ] Aceptaste el certificado SSL en el navegador
- [ ] CORS está configurado para `http://localhost:4200`
- [ ] El endpoint `/api/Users/Login` funciona en Swagger
- [ ] El endpoint `/api/Users/Register` existe y funciona
- [ ] Frontend está corriendo (`ng serve`)
- [ ] Abriste `http://localhost:4200` (no `https://`)

---

## 🆘 Si Nada Funciona

1. **Reinicia todo**:
   - Cierra Visual Studio
   - Cierra la terminal de Angular
   - Vuelve a abrir y ejecutar ambos

2. **Verifica los logs**:
   - En Visual Studio: Ventana de Salida
   - En Angular: Terminal donde ejecutaste `ng serve`
   - En el navegador: F12 → Console

3. **Prueba con Postman**:
   - Si Postman puede llamar al backend, el problema es CORS o el frontend
   - Si Postman tampoco puede, el problema es el backend

---

## 📞 Información para Debug

Si necesitas ayuda, proporciona:
1. El puerto que muestra Visual Studio al ejecutar
2. El puerto que tienes en `api.service.ts`
3. Los errores de la consola del navegador (F12)
4. Si Swagger funciona o no

