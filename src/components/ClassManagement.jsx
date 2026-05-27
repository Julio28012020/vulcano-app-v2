import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../services/api";
import {
  getAllSchedules,
  createAvailability,
  updateSchedule,
  updateScheduleStatus,
  deleteSchedule
} from "../services/scheduleService";
import "../styles/ClassManagement.css";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";

const ClassManagement = () => {
  const navigate = useNavigate();
  // --- ESTADOS DE VISTA Y DATOS ---
  const [viewMode, setViewMode] = useState("LIST"); // "LIST" o "FORM"
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADO DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    professorId: "",
    name: "",
    specialty: "",
    schedules: [] // Array de { id, date, hours: [] }
  });

  const [editId, setEditId] = useState(null); // ID del horario que estamos editando
  const [loadingProfessor, setLoadingProfessor] = useState(false);

  // --- EFECTOS ---
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const data = await getAllSchedules();

      // Enriquecer los datos con los nombres y especialidades de los profesores
      const uniqueExpertIds = [...new Set(data.map(item => item.expertId || item.professorId).filter(Boolean))];
      const expertNames = {};
      const expertSpecialties = {};

      await Promise.all(uniqueExpertIds.map(async (id) => {
        try {
          const user = await getUserById(id);
          expertNames[id] = `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim() || user.username || `Docente ${id}`;
          expertSpecialties[id] = user.profile?.bio || "Especialidad no definida";
        } catch (e) {
          expertNames[id] = `Profesor #${id}`;
          expertSpecialties[id] = "Desconocida";
        }
      }));

      const enrichedData = data.map(item => ({
        ...item,
        professorName: expertNames[item.expertId || item.professorId] || `Profesor #${item.expertId || item.professorId}`,
        specialty: expertSpecialties[item.expertId || item.professorId] || "Desconocida"
      }));

      setClassList(enrichedData);
    } catch (error) {
      console.error("Error al cargar clases:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- BUSQUEDA DE PROFESOR POR ID ---
  const fetchProfessor = async (id) => {
    if (!id) return;
    setLoadingProfessor(true);
    try {
      const data = await getUserById(id);
      
      // VALIDACIÓN DE ROL: Permitir si es TEACHER
      const isTeacher = data.role === "TEACHER";
      
      if (!isTeacher) {
        setFormData(prev => ({ ...prev, name: "ID no corresponde a un Docente", specialty: "" }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        name: `${data.profile?.firstName || ""} ${data.profile?.lastName || ""}`.trim(),
        specialty: data.profile?.bio || "Especialidad no definida"
      }));
    } catch (error) {
      console.error("Error al buscar profesor:", error);
      setFormData(prev => ({ ...prev, name: "", specialty: "" }));
    } finally {
      setLoadingProfessor(false);
    }
  };

  const handleIdChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, professorId: value }));
    if (value.length >= 1) fetchProfessor(value);
  };

  // --- GESTIÓN DE FECHAS Y HORAS ---
  const addDate = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { id: Date.now(), date: "", hours: [] }]
    }));
  };

  const removeDate = (id) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter(s => s.id !== id)
    }));
  };

  const handleDateChange = (id, dateValue) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.map(s => s.id === id ? { ...s, date: dateValue } : s)
    }));
  };

  const addHour = (dateId, hourValue) => {
    if (!hourValue) return;
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.map(s => {
        if (s.id === dateId) {
          if (s.hours.includes(hourValue)) return s;
          return { ...s, hours: [...s.hours, hourValue] };
        }
        return s;
      })
    }));
  };

  const removeHour = (dateId, hourValue) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.map(s =>
        s.id === dateId ? { ...s, hours: s.hours.filter(h => h !== hourValue) } : s
      )
    }));
  };

  // --- ACCIONES CRUD ---

  const handleCreateNew = () => {
    setEditId(null);
    setFormData({
      professorId: "",
      name: "",
      specialty: "",
      schedules: []
    });
    setViewMode("FORM");
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    // Al editar una clase individual, preparamos el formulario con esa única fecha/hora
    const dateStr = item.startTime ? item.startTime.split('T')[0] : (item.date || "");
    const hourStr = item.startTime ? item.startTime.split('T')[1].substring(0, 5) : (item.time || "");

    setFormData({
      professorId: item.expertId || item.professorId || "",
      name: item.professorName || item.name || "",
      specialty: item.specialty || "",
      schedules: [
        { id: Date.now(), date: dateStr, hours: [hourStr] }
      ]
    });
    setViewMode("FORM");
  };

  const handleGroupDelete = async (group) => {
    const result = await Swal.fire({
      title: "¿Eliminar todas las clases?",
      text: `Se eliminarán todas las clases agendadas para ${group.professorName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#472825",
      cancelButtonColor: "#96786f",
      background: "#fff4e2",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(group.schedules.map(item => deleteSchedule(item.id)));
        Swal.fire({
          title: "Eliminado",
          text: "Las clases han sido eliminadas.",
          icon: "success",
          background: "#fff4e2"
        });
        loadClasses();
      } catch (error) {
        Swal.fire("Error", "No se pudieron eliminar todas las clases", "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.professorId || !formData.name) {
      Swal.fire("Error", "Nombre o ID de profesor inválido", "error");
      return;
    }

    if (formData.schedules.length === 0) {
      Swal.fire("Atención", "Agrega al menos una fecha", "warning");
      return;
    }

    Swal.fire({
      title: "Guardando...",
      didOpen: () => Swal.showLoading(),
      background: "#fff4e2"
    });

    try {
      if (editId) {
        // Si es edición, tomamos la primera fecha y hora del formulario (ya que editamos uno por uno)
        const firstDate = formData.schedules[0]?.date || "";
        const firstHour = formData.schedules[0]?.hours[0] || "";
        const startTime = `${firstDate}T${firstHour}:00`;

        const payload = {
          expertId: Number(formData.professorId),
          courseId: 1,
          startTime: startTime,
          notes: "Disponible"
        };

        await updateSchedule(editId, 1, payload);
      } else {
        // --- NUEVA LÓGICA DE CREACIÓN: Múltiples peticiones por cada hora ---
        const createPromises = [];

        formData.schedules.forEach(sched => {
          sched.hours.forEach(hour => {
            // Combinar date y time en un formato LocalDateTime
            const startTime = `${sched.date}T${hour}:00`;

            const payload = {
              expertId: Number(formData.professorId),
              courseId: 1,
              startTime: startTime,
              notes: "Disponible"
            };
            // createAvailability hace un POST a /api/schedules
            createPromises.push(createAvailability(payload));
          });
        });

        // Esperamos a que todas las peticiones terminen de enviarse
        await Promise.all(createPromises);
      }

      Swal.fire({
        icon: "success",
        title: editId ? "Clase Actualizada" : "Clase Creada",
        confirmButtonColor: "#472825",
        background: "#fff4e2"
      });

      setViewMode("LIST");
      loadClasses();
    } catch (err) {
      Swal.fire("Error", "No se pudo guardar la información", "error");
    }
  };

  const handleToggleGroupPublish = async (group, isPublished) => {
    const newStatus = isPublished ? "AVAILABLE" : "UNPUBLISHED";
    try {
      await Promise.all(group.schedules.map(item => updateScheduleStatus(item.id, newStatus)));
      setClassList(prev => prev.map(c => {
        if (c.expertId === group.profId || c.professorId === group.profId) {
          return { ...c, status: newStatus };
        }
        return c;
      }));
    } catch (err) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  // --- RENDERIZADO ---

  return (
    <div className="class-management-container">
      <div className="management-header">
        <h1 className="management-title">Gestión de Clases</h1>
        <p className="management-subtitle">Administra el catálogo de clases y horarios disponibles.</p>
      </div>

      {viewMode === "LIST" ? (
        <div className="list-view-section">
          <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              <Icon icon="fluent:list-24-filled" />
              Clases Registradas
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-create-init"
                style={{ margin: 0, padding: '12px 24px', fontSize: '15px' }}
                onClick={handleCreateNew}
              >
                <Icon icon="fluent:add-circle-24-filled" />
                Nueva Clase
              </button>
            </div>
          </div>

          <div className="class-list-container">
            {loading ? (
              <div className="empty-list">Cargando clases...</div>
            ) : classList.length === 0 ? (
              <div className="empty-list">No hay clases registradas aún.</div>
            ) : (
              <table className="management-table">
                <thead>
                  <tr>
                    <th>Profesor</th>
                    <th>Especialidad</th>
                    <th>Fecha y Hora</th>
                    <th>Publicado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(classList.reduce((acc, curr) => {
                    const profId = curr.expertId || curr.professorId;
                    if (!acc[profId]) {
                      acc[profId] = {
                        profId,
                        professorName: curr.professorName || curr.name || `Profesor #${profId}`,
                        specialty: curr.specialty || "Desconocida",
                        schedules: []
                      };
                    }
                    acc[profId].schedules.push(curr);
                    return acc;
                  }, {})).map((group) => {
                    const isPublished = group.schedules.some(s => s.status === 'AVAILABLE' || s.status === 'PUBLISHED');
                    return (
                      <tr key={group.profId}>
                        <td>
                          <div className="professor-info-cell">
                            <span className="prof-name">{group.professorName}</span>
                            <span className="prof-id">ID: {group.profId}</span>
                          </div>
                        </td>
                        <td>{group.specialty}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {group.schedules.map(sched => {
                              const dateObj = sched.startTime ? new Date(sched.startTime) : null;
                              const dateStr = dateObj ? dateObj.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : (sched.date + " " + sched.time);
                              return (
                                <div key={sched.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '13px', background: '#f5ebe0', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', width: 'fit-content' }}>
                                    {dateStr}
                                  </span>
                                  <button
                                    onClick={() => handleEdit(sched)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-mid)', display: 'flex', alignItems: 'center', padding: 0 }}
                                    title="Editar esta hora"
                                  >
                                    <Icon icon="fluent:edit-16-regular" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td>
                          <button
                            className={`w-12 h-6 rounded-full relative transition-colors ${isPublished ? 'bg-green-500' : 'bg-gray-300'}`}
                            onClick={() => handleToggleGroupPublish(group, !isPublished)}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isPublished ? 'translate-x-6' : 'translate-x-1'}`}></div>
                          </button>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn-action btn-delete" onClick={() => handleGroupDelete(group)} title="Eliminar Todo">
                              <Icon icon="fluent:delete-24-filled" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <form className="class-form-card" onSubmit={handleSubmit}>
          <div className="section-title">
            <Icon icon="fluent:person-board-24-filled" />
            {editId ? "Editar Clase" : "Información del Profesor"}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">ID PROFESOR</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ingresa el ID"
                value={formData.professorId}
                onChange={handleIdChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nombre y Apellido</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nombre del profesor"
                value={formData.name}
                readOnly
                disabled
              />
              {loadingProfessor && <span style={{ fontSize: '12px', color: 'var(--color-mid)' }}>Buscando...</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Especialidad</label>
              <input
                type="text"
                className="form-input"
                placeholder="Especialidad"
                value={formData.specialty}
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="schedules-section">
            <div className="section-title">
              <Icon icon="fluent:calendar-clock-24-filled" />
              Fechas Disponibles
            </div>

            <button type="button" className="add-date-btn" onClick={addDate}>
              + Agregar Fecha
            </button>

            <div className="dates-list">
              {formData.schedules.map((sched) => (
                <div key={sched.id} className="date-item">
                  <div className="date-header">
                    <input
                      type="date"
                      className="date-input"
                      value={sched.date}
                      onChange={(e) => handleDateChange(sched.id, e.target.value)}
                    />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeDate(sched.id)}
                    >
                      <Icon icon="fluent:delete-24-regular" />
                    </button>
                  </div>

                  <div className="hours-container">
                    {sched.hours && sched.hours.map((h, index) => (
                      <div key={index} className="hour-chip">
                        {h}
                        <button
                          type="button"
                          className="remove-btn"
                          style={{ fontSize: '12px' }}
                          onClick={() => removeHour(sched.id, h)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <div className="add-hour-wrapper">
                      <input
                        type="time"
                        className="hour-input"
                        id={`input-hour-${sched.id}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addHour(sched.id, e.target.value);
                            e.target.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn-add-hour"
                        onClick={() => {
                          const input = document.getElementById(`input-hour-${sched.id}`);
                          if (input) {
                            addHour(sched.id, input.value);
                            input.value = "";
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setViewMode("LIST")}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {editId ? "Actualizar Clase" : "Guardar Clase"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ClassManagement;
