# VERCEL DEPLOYMENT GUIDE - VULCANO APP

## ✅ Cambios Realizados para Compatibilidad con Vercel

### 1. Corregidas las URLs de API en servicios
Todos los servicios ahora usan `import.meta.env.VITE_API_BASE_URL` en lugar de rutas relativas:

**Archivos actualizados:**
- ✅ `src/services/courseService.js` - Cambio: `/api/courses` → `${import.meta.env.VITE_API_BASE_URL}courses`
- ✅ `src/services/moduleService.js` - Cambio: `/api/modules` → `${import.meta.env.VITE_API_BASE_URL}modules`
- ✅ `src/services/scheduleService.js` - Cambio: `/api/schedules` → `${import.meta.env.VITE_API_BASE_URL}schedules`

### 2. Archivos de Configuración

**`.env.development`** (Ya existía)
```
VITE_API_BASE_URL=https://cursosvulcano-backend.onrender.com/api/
```

**`.env.production`** (Ya existía)
```
VITE_API_BASE_URL=https://cursosvulcano-backend.onrender.com/api/
```

**`vercel.json`** (Creado)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "@vite_api_base_url"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🔧 Configuración en Vercel Dashboard

### Paso 1: Acceder al Proyecto
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto "vulcano-app-v2"

### Paso 2: Configurar Variables de Entorno
1. Click en **Settings**
2. Ve a **Environment Variables**
3. Agrega una nueva variable:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://cursosvulcano-backend.onrender.com/api/`
   - **Environments:** Selecciona `Production`, `Preview`, `Development`
4. Click en **Save**

### Paso 3: Re-deploy
1. Ve a la pestaña **Deployments**
2. Haz click en los tres puntos (...) del último deploy
3. Selecciona **Redeploy**
4. Espera a que termine (verás un ✓ verde)

---

## 🧪 Verificación

Una vez desplegado, prueba:

### Verificar que la API se comunica correctamente:
1. Abre la app en Vercel
2. Intenta **login** con credenciales válidas
3. Si ves el dashboard sin errores → ✅ **Funcionando**
4. Si ves errores en red → ❌ **Revisar configuración**

### Ver logs de desarrollo (DevTools)
- Abre la página en el navegador
- Presiona **F12** (Developer Tools)
- Ve a la pestaña **Network**
- Intenta hacer un login
- Verifica que las peticiones vayan a `https://cursosvulcano-backend.onrender.com/api/` y NO a `vercel-app.com/api/`

---

## 🐛 Troubleshooting

### Problema: "Failed to fetch" en la consola
**Causa:** Las URLs siguen apuntando a la app de Vercel en lugar del backend
**Solución:** 
- Verifica que `VITE_API_BASE_URL` está configurada en Vercel
- Haz un nuevo deploy después de cambiar la variable

### Problema: 404 en endpoints
**Causa:** Backend (Render) está caído o fuera de línea
**Solución:**
- Abre https://cursosvulcano-backend.onrender.com/api/users en el navegador
- Debe cargar sin errores (aunque sea un JSON vacío)
- Si no funciona, revisa el estado de Render

### Problema: CORS errors
**Causa:** Backend no acepta peticiones desde el dominio de Vercel
**Solución:**
- En el backend, verifica la configuración de CORS
- Debe incluir el dominio de Vercel en `allowedOrigins`

---

## 📝 Cómo Funciona el Sistema

### En Desarrollo (npm run dev):
```
Frontend (localhost:5173) 
  → Pide /api/courses
  → Vite proxy intercepta
  → Redirige a http://localhost:8080/api/courses
  → Backend responde ✅
```

### En Producción (Vercel):
```
Frontend (vercel-app.com)
  → Pide ${VITE_API_BASE_URL}courses
  → Resuelve a https://cursosvulcano-backend.onrender.com/api/courses
  → Backend en Render responde ✅
```

---

## 📚 Referencias
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Render.com](https://render.com) - Donde está alojado el backend
