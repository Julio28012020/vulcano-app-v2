/**
 * SERVICIO DE HORARIOS (Schedule API Service - Refactored for specific API)
 * Este archivo centraliza las peticiones CRUD para las clases/horarios.
 */

const API_BASE_URL = "/api/schedules";

/**
 * Obtiene todos los horarios (la lista completa para gestión).
 * @returns {Promise<Array>}
 */
export const getAllSchedules = async () => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Error al obtener los horarios");
    return await response.json();
};

/**
 * Obtiene horarios disponibles de un profesor/experto (PARA LOS ALUMNOS).
 * @param {number|string} expertId 
 * @returns {Promise<Array>}
 */
export const getAvailableSchedules = async (expertId) => {
    const response = await fetch(`${API_BASE_URL}/available/${expertId}`);
    if (!response.ok) throw new Error("Error al obtener disponibilidad");
    return await response.json();
};

/**
 * Obtiene clases de un estudiante específico (Ya agendadas).
 * @param {number|string} studentId 
 * @returns {Promise<Array>}
 */
export const getSchedulesByStudent = async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}`);
    if (!response.ok) throw new Error("Error al obtener los horarios del estudiante");
    return await response.json();
};

/**
 * Crea una nueva clase vinculada a un estudiante (BOOKING).
 * Mantiene compatibilidad con el sistema anterior si se pasan 2 argumentos.
 */
export const createSchedule = async (arg1, arg2) => {
    // Si se pasan dos argumentos, es el booking de un alumno: createSchedule(studentId, data)
    // Si se pasa uno, es la creación de una disponibilidad maestra: createSchedule(formData)
    let url = API_BASE_URL;
    let body = arg1;

    if (arg2) {
        url = `${API_BASE_URL}/student/${arg1}`;
        body = arg2;
    }

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error("Error al crear la clase/horario");
    return await response.json();
};

/**
 * Actualiza una clase existente.
 * @param {number} id 
 * @param {Object} scheduleData 
 */
export const updateSchedule = async (id, scheduleData) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData)
    });
    if (!response.ok) throw new Error("Error al actualizar");
    return await response.json();
};

/**
 * Elimina una clase/registro por ID.
 * @param {number} id 
 */
export const deleteSchedule = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE"
    });
    if (!response.ok) throw new Error("Error al eliminar");
    return true;
};

