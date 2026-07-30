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

  const handleLogout = () => { logout(); navigate('/login'); };

  const links = allLinks.filter(l => !l.roles || l.roles.includes(user?.role));

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>🏗️</span>
        <span style={styles.logoText}>ConstructPro</span>
      </div>
      <div style={styles.userInfo}>
        <div style={styles.avatar}>{user?.username?.[0]?.toUpperCase()}</div>
        <div>
          <div style={styles.userName}>{user?.username}</div>
          <div style={styles.userRole}>{user?.role}</div>
        </div>
      </div>
      <nav style={styles.nav}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button onClick={handleLogout} style={styles.logoutBtn}>
        🚪 Logout
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    boxShadow: '4px 0 15px rgba(0,0,0,0.3)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoIcon: { fontSize: '28px' },
  logoText: { color: '#e94560', fontWeight: '700', fontSize: '18px', letterSpacing: '0.5px' },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '8px',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: '#e94560',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
  },
  userName: { color: '#fff', fontWeight: '600', fontSize: '14px' },
  userRole: { color: '#a0aec0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  nav: { display: 'flex', flexDirection: 'column', flex: 1, padding: '8px 12px' },
  link: {
    display: 'block',
    padding: '11px 16px',
    color: '#a0aec0',
    textDecoration: 'none',
    borderRadius: '8px',
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  activeLink: {
    background: 'rgba(233,69,96,0.2)',
    color: '#e94560',
    borderLeft: '3px solid #e94560',
  },
  logoutBtn: {
    margin: '16px',
    padding: '10px',
    background: 'rgba(233,69,96,0.15)',
    color: '#e94560',
    border: '1px solid rgba(233,69,96,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};
