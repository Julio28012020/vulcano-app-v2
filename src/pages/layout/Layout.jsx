// ============================================================
// Layout.jsx
// ------------------------------------------------------------
// Página principal a la que llega el usuario después del login
// exitoso. Tiene tres zonas en el sidebar izquierdo:
//
//   ZONA SUPERIOR → Foto de perfil + nombre
//   ZONA MEDIA    → Navegación entre páginas
//   ZONA INFERIOR → "Modificar Perfil" y "Cerrar sesión"
//
// Los datos del usuario se leen de localStorage.
// Cuando el usuario hizo login, guardamos el objeto User
// completo que devolvió el backend. Aquí lo recuperamos.
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "../../styles/Layout.css";
import EditProfileModal from "../../components/EditProfileModal";
import { getUserById } from "../../services/api";
import { Icon } from "@iconify/react";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const userRaw = localStorage.getItem("user");
    return userRaw ? JSON.parse(userRaw) : null;
  });

  useEffect(() => {
    if (user && user.id) {
      getUserById(user.id)
        .then((freshUser) => {
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        })
        .catch((err) => {
          console.error("Error al sincronizar con la BD:", err);
        });
    } else {
      navigate("/Login");
    }
  }, [navigate, user]);

  const firstName = user?.profile?.firstName || "Usuario";
  const lastName = user?.profile?.lastName || "";
  const roleDisplay = user?.role === "ADMIN" ? "ADMINISTRADOR" : "USUARIO";
  const profilePic = user?.profile?.profilePictureUrl || null;

  const [showEditModal, setShowEditModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setShowEditModal(false);
  };

  return (
    <div className={`layout-container ${isSidebarOpen ? "" : "sidebar-collapsed"}`}>
      <aside className={`layout-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-profile">
          {profilePic ? (
            <img
              src={profilePic}
              alt={`Foto de perfil de ${firstName}`}
              className="sidebar-avatar"
            />
          ) : (
            <div className="sidebar-avatar-placeholder">👤</div>
          )}

          <p className="sidebar-name">{firstName} {lastName}</p>
          <p className="sidebar-role">{roleDisplay}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className="sidebar-nav-btn"
            onClick={() => navigate("/layout")}
          >
            <span className="btn-icon">🏠</span>
            <span className="sidebar-text">Inicio</span>
          </button>

          <button
            className="sidebar-nav-btn"
            onClick={() => navigate("/layout/Course")}
          >
            <span className="btn-icon">📚</span>
            <span className="sidebar-text">Cursos</span>
          </button>

          <button
            className="sidebar-nav-btn"
            onClick={() => navigate("/layout/ModuleView")}
          >
            <span className="btn-icon">🎓</span>
            <span className="sidebar-text">Módulos</span>
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
            onClick={() => navigate("/layout/Review")}
          >
            <span className="btn-icon">💬</span>
            <span className="sidebar-text">Opiniones</span>
          </button>
           

          {user?.role === "ADMIN" && (
            <button
              className="sidebar-nav-btn"
              onClick={() => navigate("/Users")}
            >
              <span className="btn-icon">👥</span>
              <span className="sidebar-text">Usuarios</span>
            </button>
          )}

          <button
            className="sidebar-nav-btn"
            onClick={() => navigate("/layout/clases")}
          >
            <span className="btn-icon"><Icon icon="fluent-emoji-flat:teacher-light" width="32" height="32" /></span>
            <span className="sidebar-text">Clases</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-footer-btn"
            onClick={() => setShowEditModal(true)}
          >
            <span className="btn-icon">✏️</span>
            <span className="sidebar-text">Modificar Perfil</span>
          </button>

          <button
            className="sidebar-footer-btn danger"
            onClick={handleLogout}
          >
            <span className="btn-icon">🚪</span>
            <span className="sidebar-text">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="layout-main">
        <button
          className="sidebar-toggle-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
        >
          {isSidebarOpen ? "◀" : "☰"}
        </button>

        {children || <Outlet context={{ setShowEditModal, firstName }} />}
      </main>

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
