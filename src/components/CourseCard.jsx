/**
 * Componente CourseCard (Tarjeta de Curso)
 * Este es un componente visual, que recibe información (props) y simplemente la renderiza.
 * No guarda variables globales ni interactúa con la base de datos por sí solo.
 * 
 * @param {Object} course - Todo el objeto del curso (name, status, courseLevel, etc.)
 * @param {Function} onEdit - Función padre a ejecutar cuando se toque Editar
 * @param {Function} onDelete - Función padre a ejecutar cuando se toque Eliminar
 * @param {Number} index - El número de posición de la tarjeta (0, 1, 2...)
 * @param {String} viewMode - Manda "grid" (cuadrados) o "list" (filas horizontales largas)
 */
const CourseCard = ({ course, onEdit, onDelete, index, viewMode = 'grid' }) => {

  // -- LÓGICA DE CÁLCULO DE INTERFAZ --
  // Si existe una fecha de creación y la diferencia entre la fecha de hoy 
  // y esa fecha es menor a 3 días (calculados en milisegundos), consideramos que es 'Nuevo'
  const isNew = course.createdAt && (new Date() - new Date(course.createdAt)) < (3 * 24 * 60 * 60 * 1000);

  return (
    // Contenedor principal de la Tarjeta. Incluye animaciones CSS de Hover para elevarse.
    <div className={`cp-card hover:-translate-y-2 hover:scale-[1.03] hover:border-[var(--color-mid)] hover:shadow-[0_12px_0_var(--color-mid)] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${viewMode === 'list' ? 'cp-card-list' : ''}`} style={{ animationDelay: `${index * 0.07}s` }}>

      {/* ZONA 1: IMAGEN DEL CURSO */}
      <div className="cp-card-img-wrapper">
        {course.imageUrl ? (
          <img src={course.imageUrl} alt={course.name} className="cp-card-img" />
        ) : (
          <div className="cp-card-img bg-gradient-to-br from-slate-100 to-indigo-50 flex items-center justify-center">
            {/* Ícono de Volcán que aparece por defecto si no pusiste un link de foto */}
            <span className="text-5xl opacity-40">🌋</span>
          </div>
        )}
      </div>

      {/* ZONA 2: CONTENIDO DE TEXTO */}
      <div className="cp-card-list-content">
        <div>
          {/* Fila superior: Contador visual e indicación si es Público/Oculto */}
          <div className="flex justify-between items-center mb-3">
            <span className="cp-card-id">
              #{index + 1} <span style={{ opacity: 0.5, fontWeight: 600, fontStyle: 'italic', marginLeft: '4px', fontSize: '11px' }}>(ID Real: {course.id})</span>
            </span>
            <div className="flex gap-2">
              <span className={course.isPublished ? "cp-pill bg-blue-100 text-blue-700" : "cp-pill bg-gray-200 text-gray-700"}>
                {course.isPublished ? '🌐 Publicado' : '🔒 Oculto'}
              </span>
            </div>
          </div>

          {/* Título del curso y la etiqueta dinámica de Nuevo */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="cp-card-title">{course.name || 'Sin nombre'}</h3>
            {isNew && (
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 text-amber-950 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-amber-200 flex-shrink-0 animate-pulse">
                ✨ Nuevo
              </span>
            )}
          </div>

          {/* Opcionalmente pintamos la descripción si el usuario escribió una */}
          {course.description && (
            <p className="cp-card-desc">{course.description}</p>
          )}
        </div>

        {/* ZONA 3: PÍLDORAS (PILLS) Y ACCIONES AL FINAL DE LA TARJETA */}
        <div>
          <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
            {/* Diccionario de colores/textos condicional para los Niveles de Dificultad */}
            <span className="cp-pill bg-purple-100 text-purple-700">
              {course.courseLevel === 'BEGINNER' ? '🐣 Principiante' :
                course.courseLevel === 'INTERMEDIATE' ? '🛠️ Intermedio' :
                  course.courseLevel === 'ADVANCED' ? '🔥 Avanzado' : course.courseLevel}
            </span>

            {/* Píldora de STATUS (Activo o Inactivo) con su respectiva bolita de color */}
            <span className={course.status === 'ACTIVE' ? "cp-pill bg-green-100 text-green-700 status-pill-active" : "cp-pill bg-red-100 text-red-700 status-pill-inactive"}>
              {course.status === 'ACTIVE' ? (
                <><div className="cp-status-dot"></div> Activo</>
              ) : (
                <><div className="cp-status-dot-inactive"></div> Inactivo</>
              )}
            </span>

            {/* Fecha: aparece únicamente si el curso pasó de ser "Nuevo" (han pasado 3 días) */}
            {course.createdAt && !isNew && (
              <span className="cp-pill bg-slate-100 text-slate-500 border border-slate-200">
                📅 {new Date(course.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>

          {/* Botones de control del CRUD de React */}
          <div className="flex gap-2 mt-1">
            <button className="cp-card-btn cp-card-edit flex-1" onClick={() => onEdit(course)}>Editar</button>
            <button className="cp-card-btn cp-card-delete flex-1" onClick={() => onDelete(course)}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
