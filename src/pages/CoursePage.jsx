import { useState, useEffect } from 'react';
import NavbarPpal from '../components/NavbarPpal';
import VulcanoFooter from '../components/VulcanoFooter';
import '../styles/Course.css';
import { getCourses, createCourse, updateCourse, deleteCourse } from "../services/courseservises";
import Modal from '../components/Modal';
import CourseForm from '../components/CourseForm';
import CourseCard from '../components/CourseCard';

/* ---- Página principal ---- */
const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const load = () => {
    setStatus('loading');
    getCourses()
      .then(d => { setCourses(d); setStatus('ok'); })
      .catch(() => setStatus('error'));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = form => {
    setSaving(true);
    createCourse(form)
      .then(() => { setSaving(false); setModal(null); showToast('✅ Curso creado exitosamente'); load(); })
      .catch(() => { setSaving(false); showToast('❌ Error al crear el curso'); });
  };

  const handleUpdate = form => {
    setSaving(true);
    updateCourse(editing.id, form)
      .then(() => { setSaving(false); setModal(null); setEditing(null); showToast('✅ Curso actualizado'); load(); })
      .catch(() => { setSaving(false); showToast('❌ Error al actualizar el curso'); });
  };

  const confirmDelete = id => { setDeleteId(id); setModal('confirm'); };

  const handleDelete = () => {
    deleteCourse(deleteId)
      .then(() => { setDeleteId(null); setModal(null); showToast('🗑️ Curso eliminado'); load(); })
      .catch(() => { setDeleteId(null); setModal(null); showToast('❌ Error al eliminar el curso'); });
  };

  const openEdit = course => { setEditing(course); setModal('edit'); };

  return (
    <div className="vh-container">
      <NavbarPpal />

      <main className="flex-1 max-w-4xl w-full mx-auto px-5 py-10">

        {/* Encabezado */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-8">
          <div>
            <h1 className="cp-heading">Cursos</h1>
            <p className="cp-subheading">
              {status === 'ok'
                ? `${courses.length} curso${courses.length !== 1 ? 's' : ''} disponible${courses.length !== 1 ? 's' : ''}`
                : 'Cargando catálogo...'}
            </p>
          </div>
          <button className="cp-btn-primary" onClick={() => setModal('create')}>
            + Nuevo curso
          </button>
        </div>

        {/* Estado: cargando */}
        {status === 'loading' && (
          <div className="flex flex-col items-center py-16 gap-4">
            <div className="cp-spinner" />
            <p className="cp-subheading">Cargando cursos...</p>
          </div>
        )}

        {/* Estado: error */}
        {status === 'error' && (
          <div className="cp-error-box">
            <span className="cp-error-icon">🌋</span>
            <p>No se pudo conectar con el backend.</p>
            <small>
              Asegúrate de que Spring Boot corra en <code>localhost:8080</code> y que tengas <code>@CrossOrigin</code> en el controller.
            </small>
            <button className="cp-btn-secondary" onClick={load} style={{ marginTop: '12px' }}>
              Reintentar
            </button>
          </div>
        )}

        {/* Estado: vacío */}
        {status === 'ok' && courses.length === 0 && (
          <div className="cp-empty">
            <span className="cp-empty-icon">📚</span>
            <p>No hay cursos todavía.</p>
            <button className="cp-btn-primary" onClick={() => setModal('create')}>
              Crear el primero
            </button>
          </div>
        )}

        {/* Grid de tarjetas */}
        {status === 'ok' && courses.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {courses.map((c, i) => (
              <CourseCard key={c.id} course={c} index={i} onEdit={openEdit} onDelete={confirmDelete} />
            ))}
          </div>
        )}
      </main>

      {/* Modal: crear */}
      {modal === 'create' && (
        <Modal title="Nuevo curso" onClose={() => setModal(null)}>
          <CourseForm onSave={handleCreate} onCancel={() => setModal(null)} saving={saving} />
        </Modal>
      )}

      {/* Modal: editar */}
      {modal === 'edit' && editing && (
        <Modal title="Editar curso" onClose={() => { setModal(null); setEditing(null); }}>
          <CourseForm initial={editing} onSave={handleUpdate} onCancel={() => { setModal(null); setEditing(null); }} saving={saving} />
        </Modal>
      )}

      {/* Modal: confirmar eliminación */}
      {modal === 'confirm' && (
        <Modal title="¿Eliminar curso?" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <p className="cp-subheading">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 justify-end">
              <button className="cp-btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button className="cp-btn-danger" onClick={handleDelete}>Sí, eliminar</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Notificación Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center font-medium border border-slate-700">
          {toast}
        </div>
      )}

      <VulcanoFooter />
    </div>
  );
};

export default CoursePage;