// ============================================================
// Layout.jsx
// ------------------------------------------------------------
// Página principal a la que llega el usuario después del login
// exitoso. Tiene tres zonas en el sidebar izquierdo:
//
//   ZONA SUPERIOR → Foto de perfil + nombre + username
//   ZONA MEDIA    → Botón "Cursos" (navega a /Course)
//   ZONA INFERIOR → "Modificar Perfil" y "Cerrar sesión"
//
// Los datos del usuario se leen de localStorage.
// Cuando el usuario hizo login, guardamos el objeto User
// completo que devolvió el backend. Aquí lo recuperamos.
// ============================================================

import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "../../styles/Layout.css";
import EditProfileModal from "../../components/EditProfileModal";

const Layout = () => {
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // PASO 1: Leer los datos del usuario desde localStorage
  // ----------------------------------------------------------
  // Al hacer login, guardamos: localStorage.setItem("user", JSON.stringify(userData))
  // Aquí recuperamos ese objeto para mostrar la info en el sidebar.
  //
  // JSON.parse  convierte el string guardado en un objeto JavaScript.
  // El "|| null" evita errores si por alguna razón el localStorage está vacío.
  // ----------------------------------------------------------
  const userRaw = localStorage.getItem("user");
  const user    = userRaw ? JSON.parse(userRaw) : null;

  // Extraemos los datos del perfil con valores por defecto (fallbacks)
  // por si algún campo está vacío o es null.
  const firstName  = user?.profile?.firstName       || "Usuario";
  const lastName   = user?.profile?.lastName        || "";
  const username   = user?.username                 || "";
  const profilePic = user?.profile?.profilePictureUrl || null;

  // ----------------------------------------------------------
  // PASO 2: Estado para mostrar/ocultar el modal de edición
  // ----------------------------------------------------------
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // ----------------------------------------------------------
  // handleLogout: Limpia la sesión y redirige al Login
  // ----------------------------------------------------------
  // localStorage.removeItem() borra la llave "user" del almacenamiento.
  // Después de eso, si el usuario intenta volver a /layout, verá los
  // datos como si fuera un desconocido (firstName = "Usuario").
  // ----------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/Login");
  };

  // ----------------------------------------------------------
  // handleProfileUpdated: Callback que llama el modal al guardar
  // ----------------------------------------------------------
  // Recibe el objeto User actualizado que devolvió el backend.
  // Lo guardamos en localStorage (reemplazando el anterior) y
  // recargamos la página para que el sidebar muestre los nuevos datos.
  // ----------------------------------------------------------
  const handleProfileUpdated = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setShowEditModal(false);
    // Recargamos para que el sidebar lea el nuevo localStorage
    window.location.reload();
  };

  return (
    <div className="layout-container">

      {/* ════════════════════════════════════════════════════
          SIDEBAR LATERAL IZQUIERDO
          ════════════════════════════════════════════════════ */}
      <aside className={`layout-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-inner">
        {/* ── ZONA SUPERIOR: Foto y nombre del usuario ─── */}
        <div className="sidebar-profile">

          {/* Si el usuario tiene foto → mostramos la imagen.
              Si no tiene → mostramos un emoji de placeholder. */}
          {profilePic ? (
            <img
              src={profilePic}
              alt={`Foto de perfil de ${firstName}`}
              className="sidebar-avatar"
            />
          ) : (
            <div className="sidebar-avatar-placeholder">👤</div>
          )}

          {/* Nombre completo */}
          <p className="sidebar-name">{firstName} {lastName}</p>

          {/* @ username */}
          <p className="sidebar-username">@{username}</p>
        </div>

        {/* ── ZONA MEDIA: Botones de navegación ────────── */}
        <nav className="sidebar-nav">
          {/* Botón "Cursos" → navega normalmente a /Course */}

          <button
            className="sidebar-nav-btn"
            onClick={() => navigate("/Course")}
          >
            <span className="btn-icon">🏠</span>
            <span className="sidebar-text">Inicio</span>
          </button>

          <button
            className="sidebar-nav-btn"
            onClick={() => navigate("/Course")}
          >
            <span className="btn-icon">📚</span>
            <span className="sidebar-text">Cursos</span>
          </button>

          <button
            className="sidebar-nav-btn"
            onClick={() => navigate("/Course")}
          >
            <span className="btn-icon">🎓</span>
            <span className="sidebar-text">Modulos</span>
          </button>

            <button
            className="sidebar-nav-btn"
            onClick={() => navigate("/layout/agendar")}
          >
            <span className="btn-icon">📅</span>
            <span className="sidebar-text">Agendar Clases</span>
          </button>
    

          <button
            className="sidebar-nav-btn"
            onClick={() => navigate("/Course")}
          >
            <span className="btn-icon">💬</span>
            <span className="sidebar-text">Opiniones</span>
          </button>

        </nav>

        {/* ── ZONA INFERIOR: Acciones del perfil ─────── */}
        <div className="sidebar-footer">
          {/* Botón para abrir el modal de edición de perfil */}
          <button
            className="sidebar-footer-btn"
            onClick={() => setShowEditModal(true)}
          >
            <span className="btn-icon">✏️</span>
            <span className="sidebar-text">Modificar Perfil</span>
          </button>

          {/* Botón para cerrar sesión */}
          <button
            className="sidebar-footer-btn danger"
            onClick={handleLogout}
          >
            <span className="btn-icon">🚪</span>
            <span className="sidebar-text">Cerrar sesión</span>
          </button>
        </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════
          ÁREA MAIN — Mensaje de bienvenida + accesos rápidos
          ════════════════════════════════════════════════════ */}
      <main className={`layout-main ${isSidebarOpen ? "" : "expanded"}`}>

        {/* Botón de toggle del sidebar */}
        <button 
          className="sidebar-toggle-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
        >
          {isSidebarOpen ? "◀" : "☰"}
        </button>

        {/* Aquí se renderizarán DashboardHome o ClassScheduling dependiendo de la URL */}
        <Outlet context={{ setShowEditModal, firstName }} />

      </main>

      {/* ════════════════════════════════════════════════════
          MODAL DE EDICIÓN DE PERFIL
          Solo se renderiza cuando showEditModal === true
          y cuando tenemos datos del usuario disponibles.
          ════════════════════════════════════════════════════ */}
      {showEditModal && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSaved={handleProfileUpdated}
        />
      )}

    </div>
  );
};

export default Layout;
