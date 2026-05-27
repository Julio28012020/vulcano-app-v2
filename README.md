# 🌋 Vulcano App — Frontend (Grupo 1)

### **Aprendizaje Interactivo a Través de la Gamificación**

---

## 📌 Descripción

**Vulcano App** es la interfaz de usuario de la plataforma educativa Vulcano. Permite a los estudiantes interactuar con cursos, módulos de aprendizaje, desafíos de código y clases privadas con expertos. Para los administradores, ofrece gestión completa de cursos, módulos, usuarios y contenido.

**Arquitectura:** Aplicación SPA (Single Page Application) con React que se comunica con el backend [Vulcano API](https://github.com/MarioMunera1993/vulcano-api-grupo-1) mediante API REST.

---

## 🛠️ Tech Stack

| Herramienta | Versión | Descripción |
| :--- | :--- | :--- |
| **Node.js** | >= 18.x | Entorno de ejecución |
| **React** | 19.2.0 | Biblioteca base de la interfaz |
| **Vite** | 7.3.1 | Herramienta de compilación ultra rápida |
| **Tailwind CSS** | 4.2.1 | Framework de estilos utilitarios |
| **SweetAlert2** | latest | Notificaciones y modales |
| **React Router** | latest | Navegación SPA |
| **JavaScript** | ES6+ | Lógica de la aplicación |

---

## 📋 Requisitos Previos

- **Node.js** versión 18 o superior
- **npm** (viene incluido con Node.js)
- **Backend arrancado** en `http://localhost:8080` (Vulcano API)

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/MarioMunera1993/vulcano-app.git
cd vulcano-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Lanzar el servidor de desarrollo

```bash
npm run dev
```

> La aplicación estará disponible en `http://localhost:5173`

---

## 🔧 Configuración del Proxy (Vite)

El frontend usa un **proxy de Vite** para evitar errores de CORS durante el desarrollo. Todas las peticiones a `/api/*` y `/uploads/*` se redirigen automáticamente al backend:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
    '/uploads': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

> **Importante:** Los servicios ahora usan `import.meta.env.VITE_API_BASE_URL` para compatibilidad con producción. En desarrollo, Vite redirige `/api/*` al backend.

---

## 🚀 Deployment en Vercel

### Configuración Requerida

Cuando despliegues en **Vercel**, debes configurar la siguiente variable de entorno:

#### En el Dashboard de Vercel:
1. Ve a tu proyecto → **Settings** → **Environment Variables**
2. Agrega una nueva variable:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://cursosvulcano-backend.onrender.com/api/`
   - **Environments:** Production, Preview, Development

### Archivos de Configuración

- **`.env.development`** - Configuración local (para desarrollo con `npm run dev`)
- **`.env.production`** - Configuración de producción (se usa en build)
- **`vercel.json`** - Configuración específica de Vercel (rewrites para SPA)

### Proceso de Deploy

```bash
# 1. Git push a tu rama
git push origin main

# 2. Vercel detecta automáticamente el cambio
# 3. Vercel instala dependencias: npm install
# 4. Vercel ejecuta el build: npm run build
# 5. Vercel publica el contenido de /dist
```

### Troubleshooting

Si las peticiones a la API fallan en Vercel:
- Verifica que `VITE_API_BASE_URL` está configurada correctamente
- Revisa que el backend (Render) está activo y accesible
- Comprueba los logs de build en Vercel: **Deployments** → último deploy → **Logs**

---

## 📂 Estructura del Proyecto

```text
src/
├── assets/         # Recursos estáticos (imágenes, SVGs, fuentes)
├── components/     # Componentes reutilizables (CourseCard, ModuleCard, NavBar...)
├── helpers/        # Funciones de utilidad y lógica auxiliar
├── hooks/          # Custom hooks (useAuth)
├── pages/          # Vistas principales (CoursePage, ModuleView...)
│   └── layout/     # Layout principal con sidebar
├── router/         # Configuración de rutas y PrivateRoute
├── services/       # Comunicación con la API (api.js, courseService, moduleService)
├── styles/         # Archivos CSS por módulo
├── App.jsx         # Componente raíz
├── main.jsx        # Punto de entrada de React
└── index.css       # Estilos globales
```

---

## 🔐 Roles y Permisos

La aplicación soporta dos roles de usuario:

| Funcionalidad | `USER` | `ADMIN` |
| :--- | :---: | :---: |
| Ver cursos publicados y activos | ✅ | ✅ |
| Inscribirse en cursos | ✅ | ✅ |
| Ver módulos de un curso | ✅ | ✅ |
| Crear/editar/eliminar cursos | ❌ | ✅ |
| Crear/editar/eliminar módulos | ❌ | ✅ |
| Gestionar usuarios y roles | ❌ | ✅ |
| Botón "Módulos" en tarjeta de curso | ❌ | ✅ |

---

## 🧠 Características Técnicas

- **Gestión de Cursos (CRUD):** Creación, edición, publicación y eliminación con validaciones del backend.
- **Gestión de Módulos (CRUD):** Vinculados a cursos, con control de acceso por rol.
- **Sistema de Reseñas:** Interacción con la API REST para valoraciones.
- **Filtros Avanzados:** Búsqueda por nombre, filtros por estado, visibilidad y nivel.
- **Vista Dual:** Grid y Lista para la visualización de cursos.
- **Autenticación:** Login/registro con validaciones en frontend y backend.
- **SweetAlert2:** Notificaciones toast y modales de confirmación.
- **View Transitions:** Animaciones fluidas al filtrar y navegar.

---

## 👥 Integrantes del Equipo

| Nombre | Rol principal | Usuario GitHub |
| :--- | :--- | :--- |
| Mario Múnera | Líder / Backend | [@MarioMunera1993](https://github.com/MarioMunera1993) |
| Albany Luciani | Frontend Lead | [@albanyluciani1](https://github.com/albanyluciani1) |
| Roque Aldana | Backend / DB Specialist | [@Julio28012020](https://github.com/Julio28012020) |
| Julio Correa | QA / Tester | [@Jcorrea24](https://github.com/Jcorrea24) |
| Sergio Montoya | UI/UX Designer | [@SerelbochaD3773](https://github.com/SerelbochaD3773) |

---

## 📄 Licencia

Este proyecto se encuentra bajo la licencia MIT.