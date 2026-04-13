import React, { useState } from 'react';
import '../styles/Course.css'; // Aquí están las clases cp-card

// Datos de prueba para los expertos
const experts = [
  {
    id: 1,
    name: "Dr. Mario Munera",
    role: "Experto en Back-end",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Ing. Albani Lucioni",
    role: "Experta en resulucion de conflictos",
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Lic. Julio Correa",
    role: "Experto en Front-end",
    imageUrl: "https://randomuser.me/api/portraits/men/46.jpg"
  }
];

const ClassScheduling = () => {
    // Estado para guardar qué clases han sido agendadas por ID de experto
    const [scheduledClasses, setScheduledClasses] = useState({});

    // Función para agendar
    const handleSchedule = (expertId) => {
        setScheduledClasses(prev => ({
            ...prev,
            [expertId]: true
        }));
    };

    // Función para eliminar/cancelar agendamiento
    const handleCancel = (expertId) => {
        setScheduledClasses(prev => {
            const next = {...prev};
            delete next[expertId];
            return next;
        });
    };

    // Función para modificar agendamiento (mockup)
    const handleModify = (expertId) => {
        alert("Abrir modal o vista para modificar clase con Experto ID: " + expertId);
    };

    return (
        <div className="p-8 w-full">
            <h2 className="text-3xl font-bold text-[var(--color-dark)] mb-8 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Agenda tu clase privada con uno de nuestros expertos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experts.map((expert, index) => {
                    const isScheduled = scheduledClasses[expert.id];
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
                                        <span className="cp-card-id">#{expert.id} - Formador</span>
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
        </div>
    );
};

export default ClassScheduling;
