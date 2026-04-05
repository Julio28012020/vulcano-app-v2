import { useState } from 'react';

export const emptyModule = {
  content: {
    name: '',
    description: '',
    orderIndex: 1
  },
  videoUrl: '',
  durationInMinutes: 5,
  status: 'ACTIVE'
};

const ModuleForm = ({ initial = emptyModule, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(initial);

  const setContent = (key) => (e) =>
    setForm((f) => ({
      ...f,
      content: { ...f.content, [key]: e.target.value }
    }));

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="mv-form">
      <div className="mv-form-group">
        <label className="mv-label">Nombre del módulo</label>
        <input
          className="mv-input"
          type="text"
          maxLength={80}
          placeholder="Ej: Variables y tipos de datos"
          value={form.content.name}
          onChange={setContent('name')}
        />
      </div>

      <div className="mv-form-group">
        <label className="mv-label">Descripción</label>
        <textarea
          className="mv-input mv-textarea"
          placeholder="¿Qué aprenderá el estudiante en este módulo?"
          rows={3}
          value={form.content.description}
          onChange={setContent('description')}
        />
      </div>

      <div className="mv-form-row">
        <div className="mv-form-group">
          <label className="mv-label">Orden</label>
          <input
            className="mv-input"
            type="number"
            min={1}
            value={form.content.orderIndex}
            onChange={setContent('orderIndex')}
          />
        </div>
        <div className="mv-form-group">
          <label className="mv-label">Duración (min)</label>
          <input
            className="mv-input"
            type="number"
            min={1}
            value={form.durationInMinutes}
            onChange={setField('durationInMinutes')}
          />
        </div>
      </div>

      <div className="mv-form-group">
        <label className="mv-label">URL del Video</label>
        <input
          className="mv-input"
          type="text"
          placeholder="https://www.youtube.com/watch?v=..."
          value={form.videoUrl}
          onChange={setField('videoUrl')}
        />
      </div>

      <div className="mv-form-group">
        <label className="mv-label">Estado</label>
        <select className="mv-input" value={form.status} onChange={setField('status')}>
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
        </select>
      </div>

      <div className="mv-form-actions">
        <button className="mv-btn mv-btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button
          className="mv-btn mv-btn-primary"
          onClick={() => onSave(form)}
          disabled={saving || !form.content.name.trim()}
        >
          {saving ? 'Guardando...' : 'Guardar módulo'}
        </button>
      </div>
    </div>
  );
};

export default ModuleForm;
