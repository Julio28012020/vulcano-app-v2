const API_BASE = "/api/modules";

export const getModules = async () => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Error backend al obtener módulos");
  return await res.json();
};

export const getModuleById = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Error backend al obtener el módulo");
  return await res.json();
};

export const getModulesByCourseId = async (courseId) => {
  const res = await fetch(`${API_BASE}/course/${courseId}`);
  if (!res.ok) throw new Error("Error backend al obtener módulos del curso");
  return await res.json();
};

export const createModule = async (mod, courseId) => {
  const url = courseId ? `${API_BASE}/course/${courseId}` : API_BASE;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mod)
  });
  if (!res.ok) throw new Error("Error al crear módulo");
  return await res.json();
};

export const updateModule = async (id, mod) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mod)
  });
  if (!res.ok) throw new Error("Error al actualizar módulo");
  return await res.json();
};

export const deleteModule = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error("Error al eliminar módulo");
  return true;
};
