/**
 * SERVICIO DE CURSOS (Course API Service)
 * Este archivo centraliza todas las comunicaciones HTTP (AJAX) entre el 
 * Frontend (React) y el Backend (Spring Boot). 
 * Se encarga de hacer las peticiones usando la API Fetch estándar de JS.
 */

// URL base del API - se obtiene de las variables de entorno
// En desarrollo: Vite proxy redirige /api/* a localhost:8080
// En producción: usa la URL completa de Render para evitar conflictos en Vercel
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/";
const API = `${API_BASE_URL}courses`;

/**
 * Helper: extrae el mensaje de error de una respuesta HTTP fallida.
 * Intenta parsear JSON primero ({ message: "..." }), si falla usa texto plano.
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

/**
 * [READ] Obtiene la lista completa de cursos.
 * @returns {Promise<Array>} Retorna una Promesa que contiene el arreglo de cursos.
 */
export const getCourses = async () => {
  const res = await fetch(API); // Por defecto fetch hace un GET
  if (!res.ok) throw new Error("Error backend al obtener cursos");
  return await res.json();      // Convierte el texto JSON a objetos JavaScript
};

/**
 * [CREATE] Crea un nuevo curso en la base de datos.
 * @param {Object} course - Objeto con los datos del formulario.
 * @returns {Promise<Object>} Promesa con el curso ya guardado incluyendo su nuevo ID.
 */
export const createCourse = async (course) => {
  const res = await fetch(API, {
    method: 'POST', // Usamos POST para crear
    headers: { 'Content-Type': 'application/json' }, // Indicamos que mandamos un JSON
    body: JSON.stringify(course) // Transformamos el objeto JS a una cadena de texto JSON
  });
  if (!res.ok) {
    const msg = await extractError(res, "Error al crear curso");
    throw new Error(msg);
  }
  return await res.json();
};

/**
 * [UPDATE] Actualiza un curso existente.
 * @param {Number} id - El ID real del curso a modificar.
 * @param {Object} course - Los nuevos datos a guardar.
 */
export const updateCourse = async (id, course) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT', // PUT se usa convencionalmente para actualizaciones completas
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  if (!res.ok) {
    const msg = await extractError(res, "Error al actualizar curso");
    throw new Error(msg);
  }
  return await res.json();
};

/**
 * [DELETE] Borra físicamente un curso por su ID.
 * @param {Number} id - ID numérico del curso a eliminar.
 */
export const deleteCourse = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE' // Le indicamos al servidor que la acción es destructiva
  });
  if (!res.ok) {
    const msg = await extractError(res, "Error al eliminar curso");
    throw new Error(msg);
  }
  return true;
};