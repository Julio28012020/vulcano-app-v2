import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarPpal from '../components/NavbarPpal';
import ModuleSidebar from '../components/ModuleSidebar';
import { getModules, getModuleById } from '../services/moduleService';
import Swal from 'sweetalert2';
import '../styles/StudentModuleView.css';

const StudentModuleView = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [status, setStatus] = useState('loading');
  
  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    if (moduleId && modules.length > 0) {
      loadModuleById(moduleId);
    } else if (modules.length > 0 && !moduleId) {
      const firstActive = modules.find(m => m.status === 'ACTIVE');
      if (firstActive) {
        navigate(`/StudentModules/${firstActive.id}`, { replace: true });
      }
    }
  }, [moduleId, modules]);

  const loadModules = async () => {
    try {
      const data = await getModules();
      const sorted = [...data].sort((a, b) => (a.content?.orderIndex || 0) - (b.content?.orderIndex || 0));
      setModules(sorted);
      setStatus('ok');
    } catch (err) {
      setStatus('error');
      Swal.fire({
        title: 'Error de conexión',
        text: 'No se pudo cargar los módulos. Asegúrate de que el backend esté corriendo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#472825'
      });
    }
  };

  const loadModuleById = async (id) => {
    try {
      const mod = await getModuleById(id);
      setCurrentModule(mod);
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar el módulo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#472825'
      });
    }
  };

  const handleSelectModule = (id) => {
    navigate(`/StudentModules/${id}`);
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getYoutubeEmbedUrl = (url) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (status === 'loading') {
    return (
      <div className="smv-container">
        <div className="smv-loading">
          <div className="smv-loading-spinner" />
          <p>Cargando módulos...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="smv-container">
        <NavbarPpal />
        <div className="smv-error">
          <span className="smv-error-icon">🌋</span>
          <p className="smv-error-text">No se pudo conectar con el backend</p>
          <button className="mv-btn mv-btn-secondary" onClick={loadModules}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const sortedModules = [...modules].sort((a, b) => (a.content?.orderIndex || 0) - (b.content?.orderIndex || 0));
  const currentIndex = currentModule 
    ? sortedModules.findIndex(m => m.id === currentModule.id) 
    : -1;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === sortedModules.length - 1;

  const handlePrev = () => {
    if (!isFirst && sortedModules[currentIndex - 1]) {
      handleSelectModule(sortedModules[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (!isLast && sortedModules[currentIndex + 1]) {
      handleSelectModule(sortedModules[currentIndex + 1].id);
    }
  };

  return (
    <div className="smv-container">
      <NavbarPpal />
      
      <ModuleSidebar 
        modules={modules} 
        currentModuleId={currentModule?.id}
        onSelectModule={handleSelectModule}
      />
      
      <main className="smv-content">
        <div className="smv-content-inner">
          {currentModule ? (
            <>
              <header className="smv-content-header">
                <div className="smv-content-badge">
                  <span>📚</span>
                  <span>Módulo {currentModule.content?.orderIndex || currentIndex + 1}</span>
                </div>
                <h1 className="smv-content-title">
                  {currentModule.content?.name || 'Sin título'}
                </h1>
                <div className="smv-content-meta">
                  <div className="smv-meta-item">
                    <span>⏱</span>
                    <span>{currentModule.durationInMinutes} minutos</span>
                  </div>
                  <div className="smv-meta-item">
                    <span>📖</span>
                    <span>Lección {currentIndex + 1} de {sortedModules.length}</span>
                  </div>
                </div>
              </header>

              {currentModule.content?.description && (
                <section className="smv-section">
                  <h2 className="smv-section-title">
                    <span className="smv-section-icon">📖</span>
                    Resumen
                  </h2>
                  <p className="smv-text-content">
                    {currentModule.content.description}
                  </p>
                </section>
              )}

              {currentModule.videoUrl && (
                <div className="smv-video-container">
                  {getYoutubeEmbedUrl(currentModule.videoUrl) ? (
                    <iframe
                      className="smv-video-iframe"
                      src={getYoutubeEmbedUrl(currentModule.videoUrl)}
                      title={currentModule.content?.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="smv-video-placeholder">
                      📹 Video: {currentModule.videoUrl}
                    </div>
                  )}
                </div>
              )}

              <section className="smv-section">
                <h2 className="smv-section-title">
                  <span className="smv-section-icon">🎮</span>
                  Juego Interactivo
                </h2>
                <div className="smv-game-container">
                  <div className="smv-game-icon">🌋</div>
                  <h3 className="smv-game-title">¡Pon a prueba tus conocimientos!</h3>
                  <p className="smv-game-desc">
                    Completa el juego de este módulo para desbloquear el siguiente.
                  </p>
                  <button 
                    className="smv-game-btn"
                    onClick={() => {
                      Swal.fire({
                        title: '🎮 Juego en Desarrollo',
                        text: 'El juego interactivo estará disponible pronto.',
                        icon: 'info',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#472825'
                      });
                    }}
                  >
                    Iniciar Juego
                  </button>
                </div>
              </section>

              <div className="smv-nav-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                <button 
                  className="mv-btn mv-btn-secondary"
                  onClick={handlePrev}
                  disabled={isFirst}
                  style={{ opacity: isFirst ? 0.5 : 1 }}
                >
                  ← Anterior
                </button>
                <button 
                  className="mv-btn mv-btn-primary"
                  onClick={handleNext}
                  disabled={isLast}
                  style={{ opacity: isLast ? 0.5 : 1 }}
                >
                  Siguiente →
                </button>
              </div>
            </>
          ) : (
            <div className="smv-empty">
              <span className="smv-empty-icon">🗺️</span>
              <p className="smv-empty-text">Selecciona un módulo para comenzar</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentModuleView;