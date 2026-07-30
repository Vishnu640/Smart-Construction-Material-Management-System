import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const empty = {
  projectName: '', location: '', engineer: '',
  startDate: '', endDate: '', progress: 0,
  materialRequirements: '', status: 'ACTIVE',
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/projects').then(r => setProjects(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/projects/${editId}`, form);
        toast.success('Project updated!');
      } else {
        await api.post('/projects', form);
        toast.success('Project added!');
      }
      setForm(empty); setEditId(null); setShowForm(false); load();
    } catch { toast.error('Failed to save project'); }
  };

  const handleEdit = (p) => {
    setForm({
      projectName: p.projectName, location: p.location || '',
      engineer: p.engineer || '', startDate: p.startDate || '',
      endDate: p.endDate || '', progress: p.progress,
      materialRequirements: p.materialRequirements || '', status: p.status,
    });
    setEditId(p.projectId); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    toast.success('Deleted'); load();
  };

  const statusColor = { ACTIVE: '#2ecc71', COMPLETED: '#0f3460', ON_HOLD: '#e67e22' };

  return (
    <div>
      <div style={s.header}>
        <h2 style={s.title}>🏗️ Projects</h2>
        <button style={s.addBtn} onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}>
          + New Project
        </button>
      </div>

      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>{editId ? 'Edit Project' : 'Add New Project'}</h3>
          <form onSubmit={handleSubmit} style={s.grid}>
            <div style={s.field}>
              <label style={s.label}>Project Name *</label>
              <input style={s.input} required value={form.projectName}
                onChange={e => setForm({ ...form, projectName: e.target.value })} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Location</label>
              <input style={s.input} value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Assigned Engineer</label>
              <input style={s.input} value={form.engineer}
                onChange={e => setForm({ ...form, engineer: e.target.value })} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Status</label>
              <select style={s.input} value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Start Date</label>
              <input type="date" style={s.input} value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div style={s.field}>
              <label style={s.label}>End Date</label>
              <input type="date" style={s.input} value={form.endDate}
                onChange={e => setForm({ ...form, endDate: e.target.value })} />
            </div>
            <div style={{ ...s.field, gridColumn: '1 / -1' }}>
              <label style={s.label}>Progress: {form.progress}%</label>
              <input type="range" min="0" max="100" value={form.progress}
                onChange={e => setForm({ ...form, progress: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#e94560' }} />
            </div>
            <div style={{ ...s.field, gridColumn: '1 / -1' }}>
              <label style={s.label}>Material Requirements (e.g. Steel - 5000 Kg, Cement - 2000 Bags)</label>
              <textarea style={{ ...s.input, height: '70px', resize: 'vertical' }}
                value={form.materialRequirements}
                onChange={e => setForm({ ...form, materialRequirements: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
              <button type="submit" style={s.saveBtn}>{editId ? 'Update' : 'Save'} Project</button>
              <button type="button" style={s.cancelBtn}
                onClick={() => { setShowForm(false); setEditId(null); setForm(empty); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={s.grid2}>
        {projects.map(p => (
          <div key={p.projectId} style={s.card}>
            <div style={s.cardTop}>
              <div>
                <div style={s.projectName}>{p.projectName}</div>
                <div style={s.meta}>📍 {p.location || '—'}</div>
                <div style={s.meta}>👷 {p.engineer || '—'}</div>
              </div>
              <span style={{ ...s.badge, background: statusColor[p.status] || '#718096' }}>
                {p.status}
              </span>
            </div>

            <div style={s.progressSection}>
              <div style={s.progressLabel}>
                <span>Progress</span><span style={{ fontWeight: '700', color: '#e94560' }}>{p.progress}%</span>
              </div>
              <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: `${p.progress}%` }} />
              </div>
            </div>

            {p.materialRequirements && (
              <div style={s.materials}>
                <div style={s.matTitle}>📦 Required Materials</div>
                <div style={s.matText}>{p.materialRequirements}</div>
              </div>
            )}

            <div style={s.dates}>
              {p.startDate && <span>🗓️ Start: {p.startDate}</span>}
              {p.endDate && <span>🏁 End: {p.endDate}</span>}
            </div>

            <div style={s.actions}>
              <button style={s.editBtn} onClick={() => handleEdit(p)}>✏️ Edit</button>
              <button style={s.delBtn} onClick={() => handleDelete(p.projectId)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div style={s.empty}>No projects yet. Click "+ New Project" to add one.</div>
        )}
      </div>
    </div>
  );
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { margin: 0, color: '#1a1a2e', fontSize: '22px', fontWeight: '700' },
  addBtn: { padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  formCard: { background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  formTitle: { margin: '0 0 20px', color: '#1a1a2e', fontSize: '16px', fontWeight: '700' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.4px' },
  input: { padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  saveBtn: { padding: '10px 24px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { padding: '10px 24px', background: '#f7fafc', color: '#4a5568', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' },
  card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: '14px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  projectName: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' },
  meta: { fontSize: '13px', color: '#718096', marginBottom: '2px' },
  badge: { padding: '3px 10px', borderRadius: '20px', color: '#fff', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' },
  progressSection: { display: 'flex', flexDirection: 'column', gap: '6px' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4a5568' },
  progressBar: { height: '8px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #e94560, #0f3460)', borderRadius: '4px', transition: 'width 0.3s' },
  materials: { background: '#f7fafc', borderRadius: '8px', padding: '10px 12px' },
  matTitle: { fontSize: '12px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' },
  matText: { fontSize: '13px', color: '#2d3748', lineHeight: '1.5' },
  dates: { display: 'flex', gap: '16px', fontSize: '12px', color: '#718096' },
  actions: { display: 'flex', gap: '8px', marginTop: '4px' },
  editBtn: { flex: 1, padding: '8px', background: '#ebf8ff', color: '#2b6cb0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  delBtn: { flex: 1, padding: '8px', background: '#fff5f5', color: '#c53030', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  empty: { gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#a0aec0', fontSize: '15px' },
};
