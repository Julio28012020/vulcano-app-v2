import '../styles/Footer.css';



/* --- DATOS DEL EQUIPO --- */

/* Lista de integrantes con nombre y cargo */
const teamMembers = [
  { name: "Mario Múnera",   role: "Líder / Backend"  },
  { name: "Albany Luciani", role: "Frontend Lead"     },
  { name: "Roque Aldana",   role: "Backend / DB"      },
  { name: "Julio Correa",   role: "QA / Tester"       },
  { name: "Sergio Montoya", role: "UI/UX Designer"    },
];



/* --- LINKS DE NAVEGACIÓN --- */

/* Lista de secciones del sitio con su ruta */
const navLinks = [
  { label: "Inicio",   href: "#" },
  { label: "Desafíos", href: "#" },
  { label: "Aprender", href: "#" },
  { label: "Ranking",  href: "#" },
  { label: "Reseñas",  href: "#" },
];



/* --- ICONO --- */

/* Ruta del icono del logo en la carpeta public */
const vulcanoIcon = '/Icons/Vulcano_Icon-removebg-preview.png';

const VulcanoFooter = () => {
  return (
    <footer className="vf-footer">

      {/* Línea decorativa superior */}
      <div className="vf-top-border" />

      {/* Grid principal de 4 columnas */}
      <div className="vf-container">

        {/* --- Columna 1: Marca --- */}
        {/* Logo e icono con descripción de la app */}
        <div className="vf-brand">
          <div className="vf-logo">
            <img src={vulcanoIcon} alt="Vulcano Icon" className="vf-logo-icon" />
            <span className="vf-logo-text">VULCANO APP</span>
          </div>
          <p className="vf-brand-desc">
            La plataforma educativa gamificada para dominar el desarrollo de software. Aprende, compite y alcanza la cima.
          </p>
        </div>

        {/* --- Columna 2: Navegación --- */}
        {/* Links de las secciones del sitio */}
        <div className="vf-nav">
          <h3 className="vf-col-title">Navegación</h3>
          <ul className="vf-nav-list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="vf-nav-link">
                  <span className="vf-link-arrow">▶</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        {/* --- Columna 4: Equipo --- */}
        {/* Lista de integrantes con avatar de inicial y cargo */}
        <div className="vf-team">
          <h3 className="vf-col-title">Equipo</h3>
          <ul className="vf-team-list">
            {teamMembers.map((member) => (
              <li key={member.name} className="vf-team-member">
                <div className="vf-member-link">
                  {/* Círculo con la primera letra del nombre */}
                  <span className="vf-member-avatar">
                    {member.name.charAt(0)}
                  </span>
                  <div>
                    <span className="vf-member-name">{member.name}</span>
                    <span className="vf-member-role">{member.role}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* --- Barra inferior --- */}
      {/* Copyright y nombre del equipo */}
      <div className="vf-bottom-bar">
        <span>© 2026 Vulcano App · Todos los derechos reservados</span>
        <span className="vf-bottom-divider">·</span>
        <span>Team Vulcano 🌋</span>
      </div>

    </footer>
  );
};

export default VulcanoFooter;