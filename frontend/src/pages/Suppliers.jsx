import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import PdfDownloadButton from '../components/PdfDownloadButton';

const empty = { supplierName: '', phone: '', address: '' };

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/suppliers').then(r => setSuppliers(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/suppliers/${editId}`, form);
        toast.success('Supplier updated');
      } else {
        await api.post('/suppliers', form);
        toast.success('Supplier added');
      }
      setForm(empty); setEditId(null); setShowForm(false); load();
    } catch { toast.error('Operation failed'); }
  };

  const handleEdit = (s) => {
    setForm({ supplierName: s.supplierName, phone: s.phone, address: s.address });
    setEditId(s.supplierId); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this supplier?')) return;
    await api.delete(`/suppliers/${id}`);
    toast.success('Deleted'); load();
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>🏭 Suppliers</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <PdfDownloadButton endpoint="/reports/pdf/suppliers" filename="supplier_report.pdf" label="Download Supplier Report" />
          <button style={styles.addBtn} onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}>+ Add Supplier</button>
        </div>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>{editId ? 'Edit Supplier' : 'Add New Supplier'}</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            {[
              { key: 'supplierName', label: 'Supplier Name', type: 'text' },
              { key: 'phone', label: 'Phone', type: 'text' },
              { key: 'address', label: 'Address', type: 'text' },
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

      <div style={styles.grid}>
        {suppliers.map(s => (
          <div key={s.supplierId} style={styles.card}>
            <div style={styles.cardIcon}>🏭</div>
            <h3 style={styles.cardName}>{s.supplierName}</h3>
            <p style={styles.cardInfo}>📞 {s.phone}</p>
            <p style={styles.cardInfo}>📍 {s.address}</p>
            <div style={styles.cardActions}>
              <button style={styles.editBtn} onClick={() => handleEdit(s)}>Edit</button>
              <button style={styles.deleteBtn} onClick={() => handleDelete(s.supplierId)}>Delete</button>
            </div>
          </div>
        ))}
        {suppliers.length === 0 && <p style={styles.empty}>No suppliers found.</p>}
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, color: '#1a1a2e', fontSize: '22px', fontWeight: '700' },
  addBtn: { padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  formCard: { background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  formTitle: { margin: '0 0 20px', color: '#1a1a2e', fontSize: '16px', fontWeight: '600' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' },
  formActions: { gridColumn: '1 / -1', display: 'flex', gap: '12px' },
  saveBtn: { padding: '10px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { padding: '10px 24px', background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  cardIcon: { fontSize: '36px', marginBottom: '12px' },
  cardName: { margin: '0 0 8px', color: '#1a1a2e', fontSize: '16px', fontWeight: '700' },
  cardInfo: { margin: '4px 0', color: '#718096', fontSize: '13px' },
  cardActions: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' },
  editBtn: { padding: '6px 16px', background: '#ebf8ff', color: '#2b6cb0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
  deleteBtn: { padding: '6px 16px', background: '#fff5f5', color: '#c53030', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
  empty: { color: '#a0aec0', gridColumn: '1/-1', textAlign: 'center', padding: '40px' },
};
