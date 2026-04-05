const ModuleCard = ({ mod, index, onEdit, onDelete, total }) => {
  const isActive = mod.status === 'ACTIVE';

  return (
    <div className="mv-node" style={{ animationDelay: `${index * 0.12}s` }}>
      {/* Connector line from previous node */}
      {index > 0 && <div className="mv-connector" />}

      {/* Step badge */}
      <div className="mv-step-badge">
        <span className="mv-step-number">{mod.content?.orderIndex || index + 1}</span>
      </div>

      {/* Card body */}
      <div className={`mv-card ${!isActive ? 'mv-card--inactive' : ''}`}>
        <div className="mv-card-header">
          <div className="mv-card-meta">
            <span className={`mv-pill ${isActive ? 'mv-pill--active' : 'mv-pill--inactive'}`}>
              {isActive ? '🟢 Activo' : '🔴 Inactivo'}
            </span>
            <span className="mv-pill mv-pill--duration">
              ⏱ {mod.durationInMinutes} min
            </span>
          </div>
          <span className="mv-card-id">#{mod.id}</span>
        </div>

        <h3 className="mv-card-title">
          {mod.content?.name || 'Sin nombre'}
        </h3>

        {mod.content?.description && (
          <p className="mv-card-desc">{mod.content.description}</p>
        )}

        {mod.videoUrl && (
          <div className="mv-card-video-tag">
            <span className="mv-video-icon">▶</span>
            <span className="mv-video-text">Video adjunto</span>
          </div>
        )}

        <div className="mv-card-actions">
          <button className="mv-btn mv-btn-edit" onClick={() => onEdit(mod)}>
            ✏️ Editar
          </button>
          <button className="mv-btn mv-btn-delete" onClick={() => onDelete(mod.id)}>
            🗑️ Eliminar
          </button>
        </div>
      </div>

      {/* Connector line to next node */}
      {index < total - 1 && <div className="mv-connector mv-connector--bottom" />}
    </div>
  );
};

export default ModuleCard;
