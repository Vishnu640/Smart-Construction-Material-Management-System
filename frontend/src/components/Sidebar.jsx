import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const allLinks = [
  { to: '/dashboard', label: '📊 Dashboard', roles: null },
  { to: '/materials', label: '🧱 Materials', roles: null },
  { to: '/suppliers', label: '🏭 Suppliers', roles: null },
  { to: '/purchases', label: '🛒 Purchases', roles: null },
  { to: '/usage', label: '📋 Usage', roles: null },
  { to: '/projects', label: '🏗️ Projects', roles: null },
  { to: '/expenses', label: '💰 Expenses', roles: ['ADMIN', 'STORE_MANAGER'] },
  { to: '/reports', label: '📈 Reports', roles: ['ADMIN', 'STORE_MANAGER'] },
  { to: '/site-images', label: '📸 Site Images', roles: null },
  { to: '/ai-predict', label: '🤖 AI Predict', roles: ['ADMIN'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const links = allLinks.filter(l => !l.roles || l.roles.includes(user?.role));

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button className="hamburger" onClick={() => setOpen(true)}>☰</button>
        <span className="mobile-logo">🏗️ CivilMatrix</span>
        <div style={{ width: 40 }} />
      </div>

      {/* Overlay */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span style={{ fontSize: 26 }}>🏗️</span>
            <span className="logo-text">CivilMatrix</span>
          </div>
          <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="user-info">
          <div className="avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <div>
            <div className="user-name">{user?.username}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>

        <nav className="nav">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
      </aside>
    </>
  );
}
