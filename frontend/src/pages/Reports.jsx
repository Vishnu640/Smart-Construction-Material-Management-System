import { useEffect, useState } from 'react';
import api from '../services/api';
import PdfDownloadButton from '../components/PdfDownloadButton';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';

export default function Reports() {
  const [materials, setMaterials] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [usage, setUsage] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    api.get('/materials').then(r => setMaterials(r.data));
    api.get('/purchases').then(r => setPurchases(r.data));
    api.get('/usage').then(r => setUsage(r.data));
    api.get('/expenses').then(r => setExpenses(r.data));
  }, []);

  const stockData = materials.slice(0, 10).map(m => ({
    name: m.materialName,
    stock: m.quantity,
  }));

  const usageByMaterial = usage.reduce((acc, u) => {
    const name = u.material?.materialName || 'Unknown';
    const found = acc.find(a => a.name === name);
    if (found) found.used += u.usedQuantity;
    else acc.push({ name, used: u.usedQuantity });
    return acc;
  }, []);

  const expenseByMonth = expenses.reduce((acc, e) => {
    const month = e.expenseDate?.slice(0, 7) || 'Unknown';
    const found = acc.find(a => a.month === month);
    if (found) found.amount += e.amount;
    else acc.push({ month, amount: e.amount });
    return acc;
  }, []).sort((a, b) => a.month.localeCompare(b.month));

  const totalPurchaseCost = purchases.reduce((s, p) => s + p.totalCost, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalUsed = usage.reduce((s, u) => s + u.usedQuantity, 0);

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>📈 Reports</h2>
        <div style={styles.btnGroup}>
          <PdfDownloadButton endpoint="/reports/pdf/materials" filename="material_stock_report.pdf" label="Stock PDF" />
          <PdfDownloadButton endpoint="/reports/pdf/purchases" filename="purchase_report.pdf" label="Purchases PDF" />
          <PdfDownloadButton endpoint="/reports/pdf/usage" filename="usage_report.pdf" label="Usage PDF" />
          <PdfDownloadButton endpoint="/reports/pdf/expenses" filename="expense_report.pdf" label="Expenses PDF" />
          <PdfDownloadButton endpoint="/reports/pdf/suppliers" filename="supplier_report.pdf" label="Suppliers PDF" />
          <button style={styles.printBtn} onClick={() => window.print()}>🖨️ Print</button>
        </div>
      </div>

      <div style={styles.summaryGrid}>
        {[
          { label: 'Total Materials', value: materials.length, color: '#e94560' },
          { label: 'Total Purchase Cost', value: `$${totalPurchaseCost.toLocaleString()}`, color: '#0f3460' },
          { label: 'Total Units Used', value: totalUsed.toLocaleString(), color: '#533483' },
          { label: 'Total Expenses', value: `$${totalExpenses.toLocaleString()}`, color: '#e67e22' },
        ].map(s => (
          <div key={s.label} style={{ ...styles.summaryCard, borderLeft: `4px solid ${s.color}` }}>
            <div style={{ ...styles.summaryVal, color: s.color }}>{s.value}</div>
            <div style={styles.summaryLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.chartsGrid}>
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>📦 Current Stock Levels</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stockData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="stock" fill="#0f3460" radius={[0, 4, 4, 0]} name="Stock" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>🔧 Usage by Material</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={usageByMaterial}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="used" fill="#e94560" radius={[4, 4, 0, 0]} name="Used Qty" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...styles.chartBox, gridColumn: '1 / -1' }}>
          <h3 style={styles.chartTitle}>💰 Monthly Expense Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={expenseByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#e94560" strokeWidth={2} dot={{ r: 4 }} name="Expense ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.tableSection}>
        <h3 style={styles.tableTitle}>📋 Low Stock Materials</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              {['Material', 'Category', 'Current Stock', 'Price', 'Supplier', 'Status'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materials.filter(m => m.quantity < 100).map((m, i) => (
              <tr key={m.materialId} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                <td style={{ ...styles.td, fontWeight: '600' }}>{m.materialName}</td>
                <td style={styles.td}>{m.category}</td>
                <td style={{ ...styles.td, color: '#c53030', fontWeight: '700' }}>{m.quantity}</td>
                <td style={styles.td}>${m.price}</td>
                <td style={styles.td}>{m.supplier}</td>
                <td style={styles.td}><span style={styles.lowBadge}>⚠️ Low Stock</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {materials.filter(m => m.quantity < 100).length === 0 && (
          <p style={styles.empty}>✅ All materials have sufficient stock.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title: { margin: 0, color: '#1a1a2e', fontSize: '22px', fontWeight: '700' },
  btnGroup: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' },
  printBtn: { padding: '10px 18px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  summaryCard: { background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  summaryVal: { fontSize: '24px', fontWeight: '700', marginBottom: '4px' },
  summaryLabel: { fontSize: '13px', color: '#718096' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' },
  chartBox: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  chartTitle: { margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#2d3748' },
  tableSection: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  tableTitle: { margin: '0', padding: '20px 24px', fontSize: '15px', fontWeight: '600', color: '#2d3748', borderBottom: '1px solid #f0f0f0' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e' },
  th: { padding: '14px 16px', color: '#fff', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '13px 16px', fontSize: '14px', color: '#2d3748', borderBottom: '1px solid #f0f0f0' },
  trEven: { background: '#fff' },
  trOdd: { background: '#fafafa' },
  lowBadge: { background: '#fff5f5', color: '#c53030', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  empty: { textAlign: 'center', padding: '32px', color: '#a0aec0' },
};
