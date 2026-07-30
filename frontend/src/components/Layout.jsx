import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="topbar-right">
          <NotificationBell />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
