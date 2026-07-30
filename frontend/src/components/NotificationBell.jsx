import { useEffect, useState, useRef } from 'react';
import api from '../services/api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        api.get('/notifications/unread'),
        api.get('/notifications/count'),
      ]);
      setNotifications(notifRes.data);
      setCount(countRes.data.count);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    await api.put('/notifications/mark-all-read');
    setNotifications([]);
    setCount(0);
  };

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications(prev => prev.filter(n => n.id !== id));
    setCount(prev => Math.max(0, prev - 1));
  };

  const clearAll = async () => {
    await api.delete('/notifications');
    setNotifications([]);
    setCount(0);
    setOpen(false);
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div ref={ref} style={styles.wrapper}>
      <button style={styles.bell} onClick={() => setOpen(!open)}>
        🔔
        {count > 0 && <span style={styles.badge}>{count > 9 ? '9+' : count}</span>}
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.dropHeader}>
            <span style={styles.dropTitle}>🔔 Notifications</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {notifications.length > 0 && (
                <button style={styles.actionBtn} onClick={markAllRead}>Mark all read</button>
              )}
              <button style={{ ...styles.actionBtn, color: '#c53030' }} onClick={clearAll}>Clear all</button>
            </div>
          </div>

          <div style={styles.list}>
            {notifications.length === 0 ? (
              <div style={styles.empty}>
                <div style={{ fontSize: '32px' }}>✅</div>
                <div>All caught up! No new alerts.</div>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={styles.item}>
                  <div style={styles.itemIcon}>
                    {n.type === 'LOW_STOCK' ? '⚠️' : 'ℹ️'}
                  </div>
                  <div style={styles.itemBody}>
                    <div style={styles.itemTitle}>{n.title}</div>
                    <div style={styles.itemMsg}>{n.message}</div>
                    <div style={styles.itemTime}>{timeAgo(n.createdAt)}</div>
                  </div>
                  <button style={styles.dismissBtn} onClick={() => markRead(n.id)}>✕</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { position: 'relative' },
  bell: {
    background: '#1a1a2e',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '18px',
    position: 'relative',
    color: '#fff',
  },
  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    background: '#e94560',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '10px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '48px',
    width: '360px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    zIndex: 1000,
    overflow: 'hidden',
  },
  dropHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid #f0f0f0',
    background: '#fafafa',
  },
  dropTitle: { fontWeight: '700', fontSize: '14px', color: '#1a1a2e' },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#2b6cb0',
    fontWeight: '500',
  },
  list: { maxHeight: '380px', overflowY: 'auto' },
  empty: {
    padding: '40px',
    textAlign: 'center',
    color: '#a0aec0',
    fontSize: '13px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  item: {
    display: 'flex',
    gap: '12px',
    padding: '14px 16px',
    borderBottom: '1px solid #f7f7f7',
    alignItems: 'flex-start',
    background: '#fffbf0',
  },
  itemIcon: { fontSize: '20px', marginTop: '2px' },
  itemBody: { flex: 1 },
  itemTitle: { fontWeight: '600', fontSize: '13px', color: '#1a1a2e', marginBottom: '3px' },
  itemMsg: { fontSize: '12px', color: '#4a5568', lineHeight: '1.5' },
  itemTime: { fontSize: '11px', color: '#a0aec0', marginTop: '4px' },
  dismissBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#a0aec0',
    fontSize: '14px',
    padding: '2px 4px',
  },
};
