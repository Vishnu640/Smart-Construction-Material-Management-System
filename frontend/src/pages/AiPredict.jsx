import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AiPredict() {
  const [predictions, setPredictions] = useState([]);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get('/ai/predict');
      setPredictions(res.data.predictions || []);
      setGeneratedAt(res.data.generatedAt);
      toast.success('Prediction complete!');
    } catch (e) {
      const msg = e.response?.data?.error || 'Prediction failed';
      setError(msg);
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const trendColor = { '📈 Increasing': '#2ecc71', '📉 Decreasing': '#e94560', '➡️ Stable': '#f39c12' };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>🤖 AI Demand Prediction</h2>
          <p style={s.subtitle}>Analyzes past usage patterns to forecast next month's material requirements</p>
        </div>
        <button style={s.runBtn} onClick={run} disabled={loading}>
          {loading ? '⏳ Analyzing...' : '🚀 Run Prediction'}
        </button>
      </div>

      {error && (
        <div style={s.errorBox}>
          <strong>⚠️ {error}</strong>
          <div style={s.errorHint}>
            Start the AI service:<br />
            <code style={s.code}>cd ai-service && pip install -r requirements.txt && python app.py</code>
          </div>
        </div>
      )}

      {predictions.length > 0 && (
        <>
          <div style={s.meta}>
            📅 Generated: {new Date(generatedAt).toLocaleString()} &nbsp;|&nbsp;
            📊 {predictions.length} materials analyzed
          </div>

          <div style={s.grid}>
            {predictions.map((p, i) => (
              <div key={p.material} style={s.card}>
                <div style={s.rank}>#{i + 1}</div>
                <div style={s.matName}>{p.material}</div>
                <div style={s.predicted}>
                  <span style={s.predictedNum}>{p.predictedNextMonth.toLocaleString()}</span>
                  <span style={s.predictedLabel}>units next month</span>
                </div>
                <div style={s.stats}>
                  <div style={s.stat}>
                    <span style={s.statLabel}>Monthly Avg</span>
                    <span style={s.statVal}>{p.averageMonthly.toLocaleString()}</span>
                  </div>
                  <div style={s.stat}>
                    <span style={s.statLabel}>Months Data</span>
                    <span style={s.statVal}>{p.monthsAnalyzed}</span>
                  </div>
                </div>
                <div style={{ ...s.trend, color: trendColor[p.trend] || '#718096' }}>
                  {p.trend}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && predictions.length === 0 && !error && (
        <div style={s.empty}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
          <div>Click "Run Prediction" to analyze usage history and forecast demand.</div>
          <div style={s.emptyNote}>Requires at least 1 month of usage data and the Python AI service running.</div>
        </div>
      )}
    </div>
  );
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title: { margin: '0 0 4px', color: '#1a1a2e', fontSize: '22px', fontWeight: '700' },
  subtitle: { margin: 0, color: '#718096', fontSize: '13px' },
  runBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #1a1a2e, #e94560)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap' },
  errorBox: { background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', color: '#c53030' },
  errorHint: { marginTop: '8px', fontSize: '13px', color: '#4a5568' },
  code: { background: '#edf2f7', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' },
  meta: { fontSize: '13px', color: '#718096', marginBottom: '20px', padding: '10px 16px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' },
  rank: { position: 'absolute', top: '12px', right: '14px', fontSize: '12px', color: '#a0aec0', fontWeight: '700' },
  matName: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e' },
  predicted: { display: 'flex', flexDirection: 'column', gap: '2px' },
  predictedNum: { fontSize: '32px', fontWeight: '700', color: '#e94560', lineHeight: 1 },
  predictedLabel: { fontSize: '12px', color: '#718096' },
  stats: { display: 'flex', gap: '16px' },
  stat: { display: 'flex', flexDirection: 'column', gap: '2px' },
  statLabel: { fontSize: '11px', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.4px' },
  statVal: { fontSize: '15px', fontWeight: '600', color: '#2d3748' },
  trend: { fontSize: '13px', fontWeight: '600' },
  empty: { textAlign: 'center', padding: '80px 40px', color: '#a0aec0', fontSize: '15px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  emptyNote: { marginTop: '8px', fontSize: '13px', color: '#cbd5e0' },
};
