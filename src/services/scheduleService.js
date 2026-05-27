/**
 * SERVICIO DE HORARIOS (Schedule API Service)
 * Este archivo centraliza las peticiones CRUD para las clases/horarios.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/";
const API_BASE_URL = `${API_BASE}schedules`;

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
 * Obtiene clases de un estudiante específico (ya agendadas).
 * @param {number|string} studentId
 * @returns {Promise<Array>}
 */
export const getSchedulesByStudent = async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}`);
    if (!response.ok) throw new Error("Error al obtener los horarios del estudiante");
    return await response.json();
};

/**
 * [DOCENTE] Crea un nuevo bloque de disponibilidad (horario disponible).
 * Lo usa el docente/admin para publicar sus horas disponibles.
 * @param {Object} formData - Datos del horario a crear
 * @returns {Promise<Object>}
 */
export const createAvailability = async (formData) => {
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error from backend:", errorText);
        throw new Error("Error al crear la disponibilidad: " + errorText);
    }
    return await response.json();
};

/**
 * [ALUMNO] Reserva (agenda) una clase para un estudiante específico.
 * Lo usa el alumno para agendar una clase con un docente.
 * @param {number} studentId - ID del estudiante que agenda
 * @param {Object} scheduleData - Datos de la clase a agendar
 * @returns {Promise<Object>}
 */
export const bookSchedule = async (studentId, scheduleData) => {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData)
    });
    if (!response.ok) throw new Error("Error al agendar la clase");
    return await response.json();
};

/**
 * Actualiza una clase existente.
 * @param {number} scheduleId
 * @param {number} studentId
 * @param {Object} scheduleData
 * @returns {Promise<Object>}
 */
export const updateSchedule = async (scheduleId, studentId, scheduleData) => {
    const response = await fetch(`${API_BASE_URL}/${scheduleId}/student/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData)
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error from backend on update:", errorText);
        throw new Error("Error al actualizar el horario: " + errorText);
    }
    return await response.json();
};

/**
 * Actualiza solo el status (publicar/despublicar) de un horario.
 * No requiere studentId, es una acción de administración.
 * @param {number} scheduleId
 * @param {string} status - "AVAILABLE" | "UNPUBLISHED"
 * @returns {Promise<Object>}
 */
export const updateScheduleStatus = async (scheduleId, status) => {
    const response = await fetch(`${API_BASE_URL}/${scheduleId}/status?status=${status}`, {
        method: "PATCH"
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error from backend on status update:", errorText);
        throw new Error("Error al cambiar el estado: " + errorText);
    }
    return await response.json();
};

/**
 * Elimina una clase/disponibilidad por ID (admin, sin studentId).
 * @param {number} scheduleId
 * @returns {Promise<boolean>}
 */
export const deleteSchedule = async (scheduleId) => {
    const response = await fetch(`${API_BASE_URL}/${scheduleId}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error from backend on delete:", errorText);
        throw new Error("Error al eliminar el horario: " + errorText);
    }
    return true;
};