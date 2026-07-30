import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#e94560', '#0f3460', '#533483', '#2ecc71', '#f39c12'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    api.get('/dashboard/summary').then(r => setSummary(r.data));
    api.get('/materials').then(r => setMaterials(r.data));
    api.get('/purchases').then(r => setPurchases(r.data));
  }, []);

  const categoryData = materials.reduce((acc, m) => {
    const found = acc.find(a => a.name === m.category);
    if (found) found.value += m.quantity;
    else acc.push({ name: m.category || 'Other', value: m.quantity });
    return acc;
  }, []);

  const purchaseChartData = purchases.slice(-8).map(p => ({
    name: p.material?.materialName || 'N/A',
    cost: p.totalCost,
    qty: p.quantity,
  }));

  const cards = summary ? [
    { label: 'Total Materials', value: summary.totalMaterials, icon: '🧱', color: '#e94560' },
    { label: 'Total Stock (Units)', value: summary.totalStock?.toLocaleString(), icon: '📦', color: '#0f3460' },
    { label: 'Monthly Expense', value: `$${summary.monthlyExpense?.toLocaleString()}`, icon: '💰', color: '#533483' },
    { label: 'Low Stock Alerts', value: summary.lowStockItems, icon: '⚠️', color: '#e67e22' },
  ] : [];

  return (
    <div>
      <h2 style={styles.pageTitle}>📊 Dashboard</h2>

      <div style={styles.cardGrid}>
        {cards.map((c) => (
          <div key={c.label} style={{ ...styles.card, borderTop: `4px solid ${c.color}` }}>
            <div style={styles.cardIcon}>{c.icon}</div>
            <div style={styles.cardValue}>{c.value ?? '...'}</div>
            <div style={styles.cardLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.chartsRow}>
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Recent Purchases</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={purchaseChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="cost" fill="#e94560" radius={[4, 4, 0, 0]} name="Cost ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Stock by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {summary?.lowStockItems > 0 && (
        <div style={styles.alert}>
          ⚠️ <strong>{summary.lowStockItems}</strong> material(s) are running low on stock (below 100 units). Check the Materials page.
        </div>
      )}
    </div>
  );
}

const styles = {
  pageTitle: { margin: '0 0 24px', color: '#1a1a2e', fontSize: '22px', fontWeight: '700' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    textAlign: 'center',
  },
  cardIcon: { fontSize: '32px', marginBottom: '8px' },
  cardValue: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' },
  cardLabel: { fontSize: '13px', color: '#718096', fontWeight: '500' },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' },
  chartBox: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
  },
  chartTitle: { margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#2d3748' },
  alert: {
    background: '#fff8e1',
    border: '1px solid #f6c90e',
    borderRadius: '10px',
    padding: '14px 20px',
    color: '#7d5a00',
    fontSize: '14px',
  },
};
