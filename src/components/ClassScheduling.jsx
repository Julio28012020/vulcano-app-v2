import React, { useState, useEffect } from 'react';
import '../styles/Course.css';
import { alertaEliminarClase } from '../helpers/alerts';
import Swal from 'sweetalert2';
import { 
    getAllSchedules, 
    getAvailableSchedules, 
    bookSchedule, 
    updateSchedule,
    deleteSchedule 
} from '../services/scheduleService';

import { getUserById, getAssetUrl } from '../services/api';

const ClassScheduling = () => {
    // --- ESTADOS DE EXPERTOS DINÁMICOS ---
    const [experts, setExperts] = useState([]);
    const [isLoadingExperts, setIsLoadingExperts] = useState(true);

    // Estado para guardar qué clases han sido agendadas por ID de experto
    const [scheduledClasses, setScheduledClasses] = useState({});
    
    // Obtener usuario actual del localStorage
    const [currentUser] = useState(() => {
        const userRaw = localStorage.getItem("user");
        return userRaw ? JSON.parse(userRaw) : null;
    });

    // --- ESTADOS PARA EL MODAL DE MODIFICACIÓN / AGENDAMIENTO ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('schedule'); // 'schedule' o 'modify'
    const [selectedExpertForMod, setSelectedExpertForMod] = useState(null);
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

    useEffect(() => {
        const fetchExperts = async () => {
            setIsLoadingExperts(true);
            try {
                const data = await getAllSchedules();
                
                // 1. Filtrar solo schedules con status publicado y obtener IDs únicos de expertos
                const publishedSchedules = data.filter(item => item.status === 'AVAILABLE' || item.status === 'PUBLISHED');
                const uniqueExpertIds = [...new Set(publishedSchedules.map(item => item.expertId || item.professorId).filter(Boolean))];

                // 2. Buscar info real de cada experto una sola vez
                const expertDataMap = new Map();
                
                await Promise.all(uniqueExpertIds.map(async (profId) => {
                    try {
                        const user = await getUserById(profId);
                        
                        // VALIDACIÓN: Mostrar si es TEACHER
                        const isTeacher = user.role === "TEACHER";
                        if (isTeacher) {
                            const realName = `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim() || user.username || `Profesor #${profId}`;
                            
                            expertDataMap.set(profId, {
                                id: profId,
                                name: realName,
                                role: user.profile?.bio || "Experto en el tema",
                                registrationCode: user.profile?.registrationCode || null,
                                imageUrl: getAssetUrl(user.profile?.profilePictureUrl) || `https://ui-avatars.com/api/?name=${encodeURIComponent(realName)}&background=random`
                            });
                        }
                    } catch (e) {
                        console.error(`Error al buscar el nombre real del profesor ${profId}:`, e);
                        // No lo agregamos al mapa si falla la búsqueda y no queremos mostrar placeholders sin nombre
                        // O si prefieres mostrarlo con placeholder, descomenta abajo:
                        /*
                        expertDataMap.set(profId, {
                            id: profId,
                            name: `Profesor #${profId}`,
                            role: "Experto en el tema",
                            imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('P')}&background=random`
                        });
                        */
                    }
                }));

                setExperts(Array.from(expertDataMap.values()));
            } catch (error) {
                console.error("Error al cargar profesores:", error);
            } finally {
                setIsLoadingExperts(false);
            }
        };

        fetchExperts();
    }, []);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // --- CONEXIÓN A API REAL (Spring Boot) ---
    const fetchAvailableSchedules = async (expertId) => {
        try {
            const data = await getAvailableSchedules(expertId);
            return data;
        } catch (error) {
            console.error("Error de conexión a la API:", error);
            return [];
        }
    };

    // Función unificada para abrir el modal
    const openModal = async (expertId, mode) => {
        setModalMode(mode);
        setSelectedExpertForMod(expertId);
        setIsModalOpen(true);
        setIsLoadingSchedules(true);
        setSelectedDate(null);
        setSelectedTime(null);
        setAvailableSchedules([]);

        // Consumir "API" (Mock)
        const data = await fetchAvailableSchedules(expertId);
        setAvailableSchedules(data);
        setIsLoadingSchedules(false);
    };

    // Función para agendar
    const handleSchedule = (expertId) => openModal(expertId, 'schedule');

    // Función para eliminar/cancelar agendamiento
    const handleCancel = async (expertId) => {
        const isConfirmed = await alertaEliminarClase();

        if (isConfirmed) {
            setScheduledClasses(prev => {
                const next = { ...prev };
                delete next[expertId];
                return next;
            });
        }
    };

    // Función para modificar agendamiento
    const handleModify = (expertId) => openModal(expertId, 'modify');

    // Función para guardar el cambio o nuevo agendamiento
    const handleSaveSchedule = async () => {
        if (!currentUser) {
            Swal.fire("Error", "Debes iniciar sesión para agendar una clase.", "error");
            return;
        }

        if (!selectedDate || !selectedTime) return;

        Swal.fire({
            title: "Procesando...",
            didOpen: () => Swal.showLoading(),
            background: "#fff4e2"
        });

        const startTime = `${selectedDate}T${selectedTime}:00`;
        const payload = {
            expertId: selectedExpertForMod,
            courseId: 1,
            startTime: startTime,
            notes: "Agendada por el estudiante"
        };

        try {
            if (modalMode === 'schedule') {
                await bookSchedule(currentUser.id, payload);
            } else {
                // Para modificar, necesitaríamos el ID del schedule anterior. 
                // Como el estado actual es simplificado, buscamos si ya tenía una agendada.
                // Nota: Esto es una simplificación.
                Swal.fire("Aviso", "La reprogramación requiere el ID de la clase original.", "info");
                setIsModalOpen(false);
                return;
            }

            setScheduledClasses(prev => ({
                ...prev,
                [selectedExpertForMod]: {
                    date: selectedDate,
                    time: selectedTime
                }
            }));

            setIsModalOpen(false);

            Swal.fire({
                title: "Clase Agendada",
                text: `Has agendado tu clase con éxito el ${selectedDate} a las ${selectedTime}.`,
                icon: "success",
                confirmButtonColor: "#472825",
                background: "#fff4e2",
                color: "#472825"
            });
        } catch (error) {
            Swal.fire("Error", "No se pudo agendar la clase: " + error.message, "error");
        }
    };

    return (
        <div className="p-8 w-full">
            <h2 className="text-3xl font-bold text-(--color-dark) mb-8 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Agenda tu clase privada con uno de nuestros expertos
            </h2>

            {isLoadingExperts ? (
                <div className="text-center p-10 mt-10">
                    <div className="w-12 h-12 border-4 border-[#d3abb0] border-t-[#472825] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#96786f] font-bold text-lg">Cargando profesores disponibles...</p>
                </div>
            ) : experts.length === 0 ? (
                <div className="text-center p-12 mt-10 bg-[#fff4e2]/60 rounded-2xl border-2 border-dashed border-[#d3abb0]">
                    <span className="text-4xl block mb-4">📭</span>
                    <h3 className="text-2xl font-bold text-[#472825] mb-2">No hay clases disponibles</h3>
                    <p className="text-[#96786f]">Actualmente no hay profesores con horarios publicados para agendar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experts.map((expert, index) => {
                        const scheduledInfo = scheduledClasses[expert.id];
                        const isScheduled = !!scheduledInfo;

                        return (
                            <div
                                key={expert.id}
                                className="cp-card hover:-translate-y-2 hover:scale-[1.03] hover:border-[var(--color-mid)] hover:shadow-[0_12px_0_var(--color-mid)] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex flex-col"
                                style={{ animationDelay: `${index * 0.07}s`, fontFamily: 'Nunito, sans-serif' }}
                            >
                                {/* IMAGEN DEL EXPERTO */}
                                <div className="cp-card-img-wrapper" style={{ height: '220px' }}>
                                    <img src={expert.imageUrl} alt={expert.name} className="cp-card-img" style={{ objectFit: 'cover' }} />
                                </div>

                                {/* CONTENIDO Y BOTONES */}
                                <div className="cp-card-list-content flex flex-col flex-1 justify-between p-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="cp-card-id">{expert.registrationCode || `#${expert.id}`} - Formador</span>
                                            {isScheduled ? (
                                                <span className="cp-pill bg-green-100 text-green-700">
                                                    ✅ Agendada
                                                </span>
                                            ) : (
                                                <span className="cp-pill bg-blue-100 text-blue-700">
                                                    📅 Disponible
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="cp-card-title text-xl font-bold text-[var(--color-dark)]">
                                            {expert.name}
                                        </h3>
                                        <p className="cp-card-desc mt-1 font-semibold text-[var(--color-mid)] opacity-90">
                                            {expert.role}
                                        </p>

                                        {isScheduled && (
                                            <div className="mt-3 p-3 bg-[#fde4bc]/40 rounded-xl border border-[#d3abb0]/50 text-sm font-bold text-[#472825] flex flex-col gap-1 items-start">
                                                <span className="flex items-center gap-2">📅 {scheduledInfo.date}</span>
                                                <span className="flex items-center gap-2">⏰ {scheduledInfo.time}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5">
                                        {isScheduled ? (
                                            <div className="flex gap-2">
                                                <button
                                                    className="cp-card-btn cp-card-edit flex-1"
                                                    onClick={() => handleModify(expert.id)}
                                                >
                                                    Modificar
                                                </button>
                                                <button
                                                    className="cp-card-btn cp-card-delete flex-1"
                                                    onClick={() => handleCancel(expert.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="w-full bg-[var(--color-dark)] text-[var(--color-cream)] border-none rounded-xl py-3 font-bold hover:bg-[var(--color-mid)] transition-colors shadow-sm"
                                                onClick={() => handleSchedule(expert.id)}
                                            >
                                                Agendar Clase
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL DE MODIFICACIÓN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-['Nunito',sans-serif]">
                    <div className="bg-[#fff4e2] w-full max-w-lg rounded-2xl p-6 shadow-xl flex flex-col relative animate-[fadeIn_0.3s_ease-out]">

                        <button
                            className="absolute top-4 right-4 text-[#472825] hover:bg-[#d3abb0]/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors font-bold"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✕
                        </button>

                        <h3 className="text-2xl font-bold text-[#472825] mb-2">
                            {modalMode === 'schedule' ? 'Agendar Horario' : 'Modificar Horario'}
                        </h3>
                        <p className="text-[#96786f] mb-6">Selecciona una fecha y hora disponible para tu clase.</p>

                        {isLoadingSchedules ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <div className="w-10 h-10 border-4 border-[#d3abb0] border-t-[#472825] rounded-full animate-spin"></div>
                                <p className="mt-4 text-[#96786f] font-semibold">Cargando horarios disponibles...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h4 className="font-bold text-[#472825] mb-2">Fechas disponibles</h4>

                                    {availableSchedules.length === 0 ? (
                                        <p className="text-[#96786f] italic text-sm">
                                            No se encontraron fechas o hubo un problema al consultarlas.
                                        </p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {availableSchedules.map((schedule) => (
                                                <button
                                                    key={schedule.date}
                                                    onClick={() => {
                                                        setSelectedDate(schedule.date);
                                                        setSelectedTime(null);
                                                    }}
                                                    className={`px-4 py-2 rounded-xl font-bold transition-all border-2 outline-none ${selectedDate === schedule.date
                                                            ? 'bg-[#472825] text-[#fde4bc] border-[#472825]'
                                                            : 'bg-white text-[#472825] border-[#d3abb0] hover:bg-[#d3abb0]/20'
                                                        }`}
                                                >
                                                    {schedule.date}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {selectedDate && (
                                    <div className="mt-2 animate-[fadeIn_0.3s_ease-out]">
                                        <h4 className="font-bold text-[#472825] mb-2">Horas para el {selectedDate}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {availableSchedules.find(s => s.date === selectedDate)?.times.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`px-4 py-2 rounded-xl font-bold transition-all border-2 outline-none ${selectedTime === time
                                                            ? 'bg-[#472825] text-[#fde4bc] border-[#472825]'
                                                            : 'bg-white text-[#472825] border-[#d3abb0] hover:bg-[#d3abb0]/20'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-8 flex gap-3 flex-col sm:flex-row">
                            <button
                                className="flex-1 py-3 px-4 bg-transparent border-2 border-[#96786f] text-[#472825] font-bold rounded-xl hover:bg-[#96786f]/10 transition-colors"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className={`flex-1 py-3 px-4 font-bold rounded-xl transition-all shadow-sm ${(!selectedDate || !selectedTime)
                                        ? 'bg-[#96786f]/40 text-[#472825]/50 cursor-not-allowed border-none'
                                        : 'bg-[#472825] text-[#fde4bc] hover:bg-[#472825]/90 hover:-translate-y-1 hover:shadow-lg'
                                    }`}
                                disabled={!selectedDate || !selectedTime}
                                onClick={handleSaveSchedule}
                            >
                                {modalMode === 'schedule' ? 'Confirmar Agendamiento' : 'Confirmar Cambio'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassScheduling;
