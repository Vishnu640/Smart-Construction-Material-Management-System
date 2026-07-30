import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import PdfDownloadButton from '../components/PdfDownloadButton';

const empty = { materialName: '', category: '', quantity: '', price: '', supplier: '' };

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => api.get('/materials').then(r => setMaterials(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/materials/${editId}`, form);
        toast.success('Material updated');
      } else {
        await api.post('/materials', form);
        toast.success('Material added');
      }
      setForm(empty); setEditId(null); setShowForm(false); load();
    } catch { toast.error('Operation failed'); }
  };

  const handleEdit = (m) => {
    setForm({ materialName: m.materialName, category: m.category, quantity: m.quantity, price: m.price, supplier: m.supplier });
    setEditId(m.materialId); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this material?')) return;
    await api.delete(`/materials/${id}`);
    toast.success('Deleted'); load();
  };

  const filtered = materials.filter(m =>
    m.materialName?.toLowerCase().includes(search.toLowerCase()) ||
    m.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>🧱 Materials</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <PdfDownloadButton endpoint="/reports/pdf/materials" filename="material_stock_report.pdf" label="Download Stock Report" />
          <button style={styles.addBtn} onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}>+ Add Material</button>
        </div>
      </div>

      <input
        style={styles.search}
        placeholder="🔍 Search by name or category..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>{editId ? 'Edit Material' : 'Add New Material'}</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            {[
              { key: 'materialName', label: 'Material Name', type: 'text' },
              { key: 'category', label: 'Category', type: 'text' },
              { key: 'quantity', label: 'Quantity', type: 'number' },
              { key: 'price', label: 'Price ($)', type: 'number' },
              { key: 'supplier', label: 'Supplier', type: 'text' },
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
              <button type="submit" style={styles.saveBtn}>{editId ? 'Update' : 'Save'}</button>
              <button type="button" style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableCard}>
        <div className="table-wrap">
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              {['#', 'Name', 'Category', 'Quantity', 'Price', 'Supplier', 'Status', 'Actions'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.materialId} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                <td style={styles.td}>{i + 1}</td>
                <td style={{ ...styles.td, fontWeight: '600' }}>{m.materialName}</td>
                <td style={styles.td}><span style={styles.badge}>{m.category}</span></td>
                <td style={styles.td}>{m.quantity}</td>
                <td style={styles.td}>${m.price}</td>
                <td style={styles.td}>{m.supplier}</td>
                <td style={styles.td}>
                  <span style={m.quantity < 100 ? styles.lowStock : styles.inStock}>
                    {m.quantity < 100 ? '⚠️ Low' : '✅ OK'}
                  </span>
                </td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => handleEdit(m)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(m.materialId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={styles.empty}>No materials found.</p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  title: { margin: 0, color: '#1a1a2e', fontSize: '22px', fontWeight: '700' },
  addBtn: { padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  search: { width: '100%', padding: '11px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', boxSizing: 'border-box' },
  formCard: { background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  formTitle: { margin: '0 0 20px', color: '#1a1a2e', fontSize: '16px', fontWeight: '600' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' },
  formActions: { gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '4px' },
  saveBtn: { padding: '10px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { padding: '10px 24px', background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  tableCard: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e' },
  th: { padding: '14px 16px', color: '#fff', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '13px 16px', fontSize: '14px', color: '#2d3748', borderBottom: '1px solid #f0f0f0' },
  trEven: { background: '#fff' },
  trOdd: { background: '#fafafa' },
  badge: { background: '#ebf4ff', color: '#2b6cb0', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  lowStock: { background: '#fff5f5', color: '#c53030', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  inStock: { background: '#f0fff4', color: '#276749', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  editBtn: { padding: '5px 14px', background: '#ebf8ff', color: '#2b6cb0', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '6px', fontWeight: '500', fontSize: '13px' },
  deleteBtn: { padding: '5px 14px', background: '#fff5f5', color: '#c53030', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' },
  empty: { textAlign: 'center', padding: '40px', color: '#a0aec0' },
};
