import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const empty = { material: { materialId: '' }, usedQuantity: '', usedDate: '', projectName: '' };

export default function Usage() {
  const [records, setRecords] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    api.get('/usage').then(r => setRecords(r.data));
    api.get('/materials').then(r => setMaterials(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/usage', form);
      toast.success('Usage recorded & stock deducted');
      setForm(empty); setShowForm(false); load();
    } catch { toast.error('Failed to record usage'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    await api.delete(`/usage/${id}`);
    toast.success('Deleted'); load();
  };

  const totalUsed = records.reduce((s, r) => s + r.usedQuantity, 0);

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>📋 Material Usage</h2>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>+ Record Usage</button>
      </div>

      <div style={styles.statBar}>
        <div style={styles.stat}>
          <span style={styles.statVal}>{records.length}</span>
          <span style={styles.statLabel}>Total Records</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statVal}>{totalUsed.toLocaleString()}</span>
          <span style={styles.statLabel}>Total Units Used</span>
        </div>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Record Material Usage</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Material</label>
              <select
                style={styles.input}
                value={form.material.materialId}
                onChange={e => setForm({ ...form, material: { materialId: e.target.value } })}
                required
              >
                <option value="">Select material</option>
                {materials.map(m => (
                  <option key={m.materialId} value={m.materialId}>{m.materialName} (Stock: {m.quantity})</option>
                ))}
              </select>
            </div>
            {[
              { key: 'usedQuantity', label: 'Used Quantity', type: 'number' },
              { key: 'usedDate', label: 'Date', type: 'date' },
              { key: 'projectName', label: 'Project Name', type: 'text' },
            ].map(f => (
              <div key={f.key} style={styles.field}>
                <label style={styles.label}>{f.label}</label>
                <input
                  style={styles.input}
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  required
                />
              </div>
            ))}
            <div style={styles.formActions}>
              <button type="submit" style={styles.saveBtn}>Save Record</button>
              <button type="button" style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              {['#', 'Material', 'Used Qty', 'Date', 'Project', 'Actions'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={r.usageId} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                <td style={styles.td}>{i + 1}</td>
                <td style={{ ...styles.td, fontWeight: '600' }}>{r.material?.materialName}</td>
                <td style={{ ...styles.td, color: '#c53030', fontWeight: '600' }}>{r.usedQuantity}</td>
                <td style={styles.td}>{r.usedDate}</td>
                <td style={styles.td}><span style={styles.projectBadge}>{r.projectName}</span></td>
                <td style={styles.td}>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(r.usageId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && <p style={styles.empty}>No usage records found.</p>}
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, color: '#1a1a2e', fontSize: '22px', fontWeight: '700' },
  addBtn: { padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  statBar: { display: 'flex', gap: '20px', marginBottom: '20px' },
  stat: { background: '#fff', borderRadius: '12px', padding: '20px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statVal: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e' },
  statLabel: { fontSize: '12px', color: '#718096', marginTop: '4px' },
  formCard: { background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  formTitle: { margin: '0 0 20px', color: '#1a1a2e', fontSize: '16px', fontWeight: '600' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' },
  formActions: { gridColumn: '1 / -1', display: 'flex', gap: '12px' },
  saveBtn: { padding: '10px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { padding: '10px 24px', background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  tableCard: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e' },
  th: { padding: '14px 16px', color: '#fff', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '13px 16px', fontSize: '14px', color: '#2d3748', borderBottom: '1px solid #f0f0f0' },
  trEven: { background: '#fff' },
  trOdd: { background: '#fafafa' },
  projectBadge: { background: '#f0fff4', color: '#276749', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  deleteBtn: { padding: '5px 14px', background: '#fff5f5', color: '#c53030', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' },
  empty: { textAlign: 'center', padding: '40px', color: '#a0aec0' },
};
