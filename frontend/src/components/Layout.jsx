import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>
      <Sidebar />
      <main style={{ marginLeft: '240px', flex: 1, padding: '28px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <NotificationBell />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
