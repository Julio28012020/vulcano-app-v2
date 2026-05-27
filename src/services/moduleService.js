
// URL base del API - se obtiene de las variables de entorno
// En desarrollo: Vite proxy redirige /api/* a localhost:8080
// En producción: usa la URL completa de Render para evitar conflictos en Vercel
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/";
const API = `${API_BASE_URL}modules`;

/**
 * Helper: obtiene el userId del usuario logueado desde localStorage.
 * Se usa para enviar el header X-User-Id en operaciones de escritura.
 */
const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id || null;
  } catch {
    return null;
  }
};

/**
 * Helper: extrae el mensaje de error de una respuesta HTTP fallida.
 */
const extractError = async (res, fallback) => {
  try {
    const data = await res.json();
    return data.message || fallback;
  } catch {
    try {
      const text = await res.text();
      return text || fallback;
    } catch {
      return fallback;
    }
  }
};

export const getModules = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Error backend al obtener módulos");
  return await res.json();
};

export const getModuleById = async (id) => {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error("Error backend al obtener el módulo");
  return await res.json();
};

export const getModulesByCourseId = async (courseId) => {
  const res = await fetch(`${API}/course/${courseId}`);
  if (!res.ok) throw new Error("Error backend al obtener módulos del curso");
  return await res.json();
};

export const createModule = async (mod, courseId) => {
  const url = courseId ? `${API}/course/${courseId}` : API;
  const headers = { 'Content-Type': 'application/json' };
  const userId = getUserId();
  if (userId) headers['X-User-Id'] = userId;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(mod)
  });
  if (!res.ok) {
    const msg = await extractError(res, "Error al crear módulo");
    throw new Error(msg);
  }
  return await res.json();
};

export const updateModule = async (id, mod) => {
  const headers = { 'Content-Type': 'application/json' };
  const userId = getUserId();
  if (userId) headers['X-User-Id'] = userId;

  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(mod)
  });
  if (!res.ok) {
    const msg = await extractError(res, "Error al actualizar módulo");
    throw new Error(msg);
  }
  return await res.json();
};

export const deleteModule = async (id) => {
  const headers = {};
  const userId = getUserId();
  if (userId) headers['X-User-Id'] = userId;

  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers
  });
  if (!res.ok) {
    const msg = await extractError(res, "Error al eliminar módulo");
    throw new Error(msg);
  }
  return true;
};
