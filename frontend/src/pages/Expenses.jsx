import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['MATERIAL', 'LABOUR', 'TRANSPORT', 'OTHER'];
const CAT_COLORS = { MATERIAL: '#e94560', LABOUR: '#0f3460', TRANSPORT: '#533483', OTHER: '#e67e22' };
const CAT_ICONS = { MATERIAL: '🧱', LABOUR: '👷', TRANSPORT: '🚛', OTHER: '📌' };

const empty = { description: '', amount: '', expenseDate: '', category: 'OTHER', projectName: '' };

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState('ALL');

  const load = () => api.get('/expenses').then(r => setExpenses(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', form);
      toast.success('Expense added');
      setForm(empty); setShowForm(false); load();
    } catch { toast.error('Failed to add expense'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return;
    await api.delete(`/expenses/${id}`);
    toast.success('Deleted'); load();
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
    return acc;
  }, {});

  const filtered = filterCat === 'ALL' ? expenses : expenses.filter(e => e.category === filterCat);

  return (
    <div>
      <div style={st.header}>
        <h2 style={st.title}>💰 Expenses</h2>
        <button style={st.addBtn} onClick={() => { setForm(empty); setShowForm(true); }}>+ Add Expense</button>
      </div>

      {/* Summary Cards */}
      <div style={st.summaryGrid}>
        <div style={{ ...st.totalCard, gridColumn: '1 / -1' }}>
          <span style={st.totalLabel}>Total Project Cost</span>
          <span style={st.totalVal}>₹{total.toLocaleString()}</span>
        </div>
        {CATEGORIES.map(cat => (
          <div key={cat} style={{ ...st.catCard, borderLeft: `4px solid ${CAT_COLORS[cat]}` }}>
            <div style={st.catIcon}>{CAT_ICONS[cat]}</div>
            <div>
              <div style={{ ...st.catAmt, color: CAT_COLORS[cat] }}>₹{byCategory[cat].toLocaleString()}</div>
              <div style={st.catLabel}>{cat}</div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={st.formCard}>
          <h3 style={st.formTitle}>Add Expense</h3>
          <form onSubmit={handleSubmit} style={st.formGrid}>
            <div style={st.field}>
              <label style={st.label}>Category</label>
              <select style={st.input} value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
              </select>
            </div>
            <div style={st.field}>
              <label style={st.label}>Description *</label>
              <input style={st.input} required value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={st.field}>
              <label style={st.label}>Amount (₹) *</label>
              <input style={st.input} type="number" required value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div style={st.field}>
              <label style={st.label}>Date *</label>
              <input style={st.input} type="date" required value={form.expenseDate}
                onChange={e => setForm({ ...form, expenseDate: e.target.value })} />
            </div>
            <div style={st.field}>
              <label style={st.label}>Project Name</label>
              <input style={st.input} value={form.projectName}
                onChange={e => setForm({ ...form, projectName: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
              <button type="submit" style={st.saveBtn}>Save</button>
              <button type="button" style={st.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={st.tabs}>
        {['ALL', ...CATEGORIES].map(cat => (
          <button key={cat} style={{ ...st.tab, ...(filterCat === cat ? st.tabActive : {}) }}
            onClick={() => setFilterCat(cat)}>
            {cat !== 'ALL' ? CAT_ICONS[cat] + ' ' : ''}{cat}
          </button>
        ))}
      </div>

      <div style={st.tableCard}>
        <table style={st.table}>
          <thead>
            <tr style={st.thead}>
              {['#', 'Category', 'Description', 'Project', 'Amount', 'Date', 'Actions'].map(h => (
                <th key={h} style={st.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={e.expenseId} style={i % 2 === 0 ? st.trEven : st.trOdd}>
                <td style={st.td}>{i + 1}</td>
                <td style={st.td}>
                  <span style={{ ...st.catBadge, background: CAT_COLORS[e.category] || '#718096' }}>
                    {CAT_ICONS[e.category] || '📌'} {e.category || 'OTHER'}
                  </span>
                </td>
                <td style={st.td}>{e.description}</td>
                <td style={st.td}>{e.projectName || '—'}</td>
                <td style={{ ...st.td, color: '#c53030', fontWeight: '700' }}>₹{e.amount?.toLocaleString()}</td>
                <td style={st.td}>{e.expenseDate}</td>
                <td style={st.td}>
                  <button style={st.deleteBtn} onClick={() => handleDelete(e.expenseId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={st.empty}>No expenses found.</p>}
      </div>
    </div>
  );
}

const st = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, color: '#1a1a2e', fontSize: '22px', fontWeight: '700' },
  addBtn: { padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' },
  totalCard: { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', borderRadius: '12px', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: '#a0aec0', fontSize: '14px' },
  totalVal: { color: '#fff', fontSize: '28px', fontWeight: '700' },
  catCard: { background: '#fff', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: '14px' },
  catIcon: { fontSize: '28px' },
  catAmt: { fontSize: '20px', fontWeight: '700' },
  catLabel: { fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase' },
  formCard: { background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  formTitle: { margin: '0 0 20px', color: '#1a1a2e', fontSize: '16px', fontWeight: '600' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
  saveBtn: { padding: '10px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { padding: '10px 24px', background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
  tab: { padding: '7px 16px', border: '1px solid #e2e8f0', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#4a5568' },
  tabActive: { background: '#1a1a2e', color: '#fff', border: '1px solid #1a1a2e' },
  tableCard: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e' },
  th: { padding: '14px 16px', color: '#fff', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '13px 16px', fontSize: '14px', color: '#2d3748', borderBottom: '1px solid #f0f0f0' },
  trEven: { background: '#fff' },
  trOdd: { background: '#fafafa' },
  catBadge: { padding: '3px 10px', borderRadius: '20px', color: '#fff', fontSize: '11px', fontWeight: '700' },
  deleteBtn: { padding: '5px 14px', background: '#fff5f5', color: '#c53030', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' },
  empty: { textAlign: 'center', padding: '40px', color: '#a0aec0' },
};
