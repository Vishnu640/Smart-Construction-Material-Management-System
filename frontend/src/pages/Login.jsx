import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [tick, setTick] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  // animate crane arm & particles
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const craneAngle = Math.sin(tick * 0.03) * 6;
  const particles = Array.from({ length: 8 }, (_, i) => ({
    x: 60 + Math.sin((tick * 0.02) + i * 0.8) * 18,
    y: 30 + Math.cos((tick * 0.015) + i * 1.1) * 12,
    r: 2 + (i % 3),
    op: 0.3 + Math.abs(Math.sin(tick * 0.04 + i)) * 0.5,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      toast.success(`Welcome, ${data.username}!`);
      navigate('/dashboard');
    } catch {
      toast.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* ── LEFT PANEL ── */}
      <div style={s.left}>
        {/* animated background grid */}
        <svg style={s.bgGrid} viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="400" height="600" fill="url(#grid)" />
        </svg>

        {/* floating particles */}
        <svg style={s.particles} viewBox="0 0 120 80">
          {particles.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#f6c90e" opacity={p.op} />
          ))}
        </svg>

        {/* main civil engineering SVG illustration */}
        <svg style={s.illustration} viewBox="0 0 420 480" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f3460" />
              <stop offset="100%" stopColor="#16213e" />
            </linearGradient>
            <linearGradient id="bldg1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="100%" stopColor="#0d2137" />
            </linearGradient>
            <linearGradient id="bldg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#243b55" />
              <stop offset="100%" stopColor="#141e30" />
            </linearGradient>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2d4a22" />
              <stop offset="100%" stopColor="#1a2e14" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* sky */}
          <rect width="420" height="480" fill="url(#sky)" />

          {/* stars */}
          {[{x:30,y:20},{x:80,y:35},{x:150,y:15},{x:220,y:28},{x:300,y:18},{x:370,y:40},{x:50,y:60},{x:340,y:55}].map((st,i)=>(
            <circle key={i} cx={st.x} cy={st.y} r="1.5" fill="white" opacity="0.6"/>
          ))}

          {/* moon */}
          <circle cx="370" cy="45" r="22" fill="#f0e68c" opacity="0.15"/>
          <circle cx="378" cy="40" r="18" fill="#16213e" opacity="0.9"/>

          {/* background buildings */}
          <rect x="0" y="200" width="60" height="280" fill="#0d1b2a" opacity="0.7"/>
          <rect x="360" y="180" width="60" height="300" fill="#0d1b2a" opacity="0.7"/>
          {/* bg windows */}
          {[210,230,250,270,290,310].map((y,i)=>(
            <rect key={i} x="10" y={y} width="8" height="6" fill="#f6c90e" opacity="0.3"/>
          ))}
          {[190,210,230,250,270,290].map((y,i)=>(
            <rect key={i} x="370" y={y} width="8" height="6" fill="#f6c90e" opacity="0.3"/>
          ))}

          {/* main building left */}
          <rect x="30" y="150" width="110" height="330" fill="url(#bldg1)" rx="2"/>
          <rect x="30" y="150" width="110" height="4" fill="#e94560" opacity="0.8"/>
          {/* windows left building */}
          {[165,190,215,240,265,290,315,340,365,390].map((y,i)=>(
            [40,65,90,105].map((x,j)=>(
              <rect key={`${i}-${j}`} x={x} y={y} width="14" height="16"
                fill={Math.random()>0.3?"#f6c90e":"#1a3a5c"} opacity="0.7" rx="1"/>
            ))
          ))}

          {/* main building right */}
          <rect x="280" y="120" width="120" height="360" fill="url(#bldg2)" rx="2"/>
          <rect x="280" y="120" width="120" height="4" fill="#e94560" opacity="0.8"/>
          {/* windows right building */}
          {[135,160,185,210,235,260,285,310,335,360,385].map((y,i)=>(
            [290,315,340,365,385].map((x,j)=>(
              <rect key={`${i}-${j}`} x={x} y={y} width="14" height="16"
                fill={Math.random()>0.4?"#f6c90e":"#1a3a5c"} opacity="0.7" rx="1"/>
            ))
          ))}

          {/* center tower under construction */}
          <rect x="155" y="220" width="110" height="260" fill="#1e3a5f" rx="2"/>
          <rect x="155" y="220" width="110" height="5" fill="#e94560"/>
          {/* scaffolding */}
          {[220,250,280,310,340,370,400].map((y,i)=>(
            <line key={i} x1="155" y1={y} x2="265" y2={y} stroke="#f6c90e" strokeWidth="1.5" opacity="0.5"/>
          ))}
          {[165,185,205,225,245].map((x,i)=>(
            <line key={i} x1={x} y1="220" x2={x} y2="480" stroke="#f6c90e" strokeWidth="1" opacity="0.4"/>
          ))}
          {/* center windows */}
          {[235,265,295,325,355,385].map((y,i)=>(
            [165,195,225].map((x,j)=>(
              <rect key={`${i}-${j}`} x={x} y={y} width="18" height="20"
                fill={i%2===0?"#f6c90e":"#1a3a5c"} opacity="0.8" rx="1"/>
            ))
          ))}

          {/* CRANE */}
          <g transform={`translate(210, 220) rotate(${craneAngle}, 0, 0)`}>
            {/* mast */}
            <rect x="-5" y="-200" width="10" height="200" fill="#e94560" rx="2"/>
            {/* horizontal jib */}
            <rect x="-10" y="-200" width="120" height="8" fill="#e94560" rx="2"/>
            {/* counter jib */}
            <rect x="-60" y="-200" width="55" height="8" fill="#c0392b" rx="2"/>
            {/* cables */}
            <line x1="0" y1="-192" x2="80" y2="-192" stroke="#f6c90e" strokeWidth="1.5"/>
            <line x1="80" y1="-192" x2="80" y2="-155" stroke="#f6c90e" strokeWidth="1.5"/>
            {/* hook */}
            <rect x="74" y="-158" width="12" height="10" fill="#aaa" rx="2"/>
            {/* counterweight */}
            <rect x="-58" y="-196" width="30" height="16" fill="#888" rx="2"/>
            {/* mast stripes */}
            {[-180,-160,-140,-120,-100,-80,-60,-40,-20].map((y,i)=>(
              <rect key={i} x="-5" y={y} width="10" height="6" fill="#fff" opacity="0.2"/>
            ))}
          </g>

          {/* ground / road */}
          <rect x="0" y="440" width="420" height="40" fill="url(#ground)"/>
          <rect x="0" y="440" width="420" height="3" fill="#f6c90e" opacity="0.6"/>
          {/* road markings */}
          {[20,60,100,140,180,220,260,300,340,380].map((x,i)=>(
            <rect key={i} x={x} y="455" width="25" height="4" fill="white" opacity="0.3" rx="2"/>
          ))}

          {/* construction truck */}
          <g transform="translate(50, 415)">
            <rect x="0" y="10" width="70" height="22" fill="#e94560" rx="3"/>
            <rect x="45" y="2" width="28" height="20" fill="#c0392b" rx="2"/>
            <circle cx="15" cy="34" r="7" fill="#333"/>
            <circle cx="15" cy="34" r="4" fill="#666"/>
            <circle cx="55" cy="34" r="7" fill="#333"/>
            <circle cx="55" cy="34" r="4" fill="#666"/>
            <rect x="48" y="5" width="22" height="14" fill="#87ceeb" opacity="0.6" rx="1"/>
          </g>

          {/* cement mixer */}
          <g transform="translate(300, 410)">
            <rect x="0" y="15" width="65" height="20" fill="#f6c90e" rx="3"/>
            <ellipse cx="42" cy="18" rx="18" ry="14" fill="#e0a800"/>
            <ellipse cx="42" cy="18" rx="10" ry="8" fill="#c8960c"/>
            <circle cx="12" cy="37" r="6" fill="#333"/>
            <circle cx="52" cy="37" r="6" fill="#333"/>
          </g>

          {/* hard hat worker */}
          <g transform="translate(195, 400)">
            <circle cx="12" cy="0" r="8" fill="#f4a261"/>
            <rect x="5" y="-2" width="14" height="6" fill="#f6c90e" rx="3"/>
            <rect x="7" y="8" width="10" height="18" fill="#1e3a5f"/>
            <line x1="7" y1="14" x2="0" y2="24" stroke="#f4a261" strokeWidth="3"/>
            <line x1="17" y1="14" x2="24" y2="24" stroke="#f4a261" strokeWidth="3"/>
          </g>

          {/* blueprint roll */}
          <g transform="translate(240, 405)">
            <rect x="0" y="0" width="30" height="22" fill="#1a6b9a" rx="2" opacity="0.9"/>
            <line x1="5" y1="6" x2="25" y2="6" stroke="white" strokeWidth="1" opacity="0.6"/>
            <line x1="5" y1="11" x2="25" y2="11" stroke="white" strokeWidth="1" opacity="0.6"/>
            <line x1="5" y1="16" x2="18" y2="16" stroke="white" strokeWidth="1" opacity="0.6"/>
            <rect x="-3" y="-2" width="6" height="26" fill="#0d4f73" rx="3"/>
            <rect x="27" y="-2" width="6" height="26" fill="#0d4f73" rx="3"/>
          </g>

          {/* dust/smoke particles near construction */}
          {[{x:170,y:215},{x:185,y:210},{x:200,y:218},{x:260,y:212}].map((p,i)=>(
            <circle key={i} cx={p.x} cy={p.y + Math.sin(tick*0.05+i)*4} r="6"
              fill="white" opacity={0.04 + Math.abs(Math.sin(tick*0.03+i))*0.06}/>
          ))}

          {/* top label */}
          <text x="210" y="95" textAnchor="middle" fill="white" fontSize="13"
            fontFamily="Arial" fontWeight="bold" opacity="0.5" letterSpacing="4">
            UNDER CONSTRUCTION
          </text>
          <line x1="80" y1="100" x2="155" y2="100" stroke="#e94560" strokeWidth="1" opacity="0.5"/>
          <line x1="265" y1="100" x2="340" y2="100" stroke="#e94560" strokeWidth="1" opacity="0.5"/>
        </svg>

        {/* left panel text */}
        <div style={s.leftText}>
          <div style={s.badge}>🏗️ CIVIL ENGINEERING PLATFORM</div>
          <h2 style={s.leftTitle}>CivilMatrix</h2>
          <p style={s.leftSub}>Smart Construction Material Management</p>
          <div style={s.features}>
            {['📦 Real-time Stock Tracking','📊 Project Analytics','🤖 AI Demand Prediction','📄 PDF Reports'].map(f => (
              <div key={f} style={s.featureItem}>
                <span style={s.featureDot}/>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={s.right}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.logoCircle}>🏗️</div>
            <h1 style={s.cardTitle}>Welcome Back</h1>
            <p style={s.cardSub}>Sign in to CivilMatrix</p>
          </div>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Username</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>👤</span>
                <input
                  style={s.input}
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Password</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>🔒</span>
                <input
                  style={s.input}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <span style={s.eyeBtn} onClick={() => setShowPass(v => !v)}>
                  {showPass ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

            <button style={{ ...s.btn, opacity: loading ? 0.8 : 1 }} type="submit" disabled={loading}>
              {loading
                ? <span style={s.btnInner}><span style={s.spinner}/> Signing in...</span>
                : <span style={s.btnInner}>🚀 Sign In</span>
              }
            </button>
          </form>

          <div style={s.divider}><span style={s.dividerText}>Quick Access</span></div>

          <div style={s.roles}>
            {[
              { role: 'Admin', user: 'admin', pass: 'admin123', color: '#e94560', icon: '👑' },
              { role: 'Engineer', user: 'engineer', pass: 'engineer123', color: '#3182ce', icon: '⚙️' },
              { role: 'Store Mgr', user: 'storemanager', pass: 'store123', color: '#38a169', icon: '🏪' },
            ].map(r => (
              <button key={r.role} style={{ ...s.roleBtn, borderColor: r.color, color: r.color }}
                onClick={() => setForm({ username: r.user, password: r.pass })}>
                <span>{r.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 600 }}>{r.role}</span>
              </button>
            ))}
          </div>

          <p style={s.hint}>Click a role above to auto-fill credentials</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: '#0f1923',
  },
  // LEFT
  left: {
    flex: 1,
    background: 'linear-gradient(160deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '40px 30px',
    '@media(maxWidth:768px)': { display: 'none' },
  },
  bgGrid: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none',
  },
  particles: {
    position: 'absolute', top: '5%', right: '5%', width: '120px', height: '80px',
    pointerEvents: 'none',
  },
  illustration: {
    width: '100%', maxWidth: '420px', height: 'auto', position: 'relative', zIndex: 1,
  },
  leftText: {
    position: 'relative', zIndex: 2, textAlign: 'center', marginTop: '20px',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(233,69,96,0.2)',
    border: '1px solid rgba(233,69,96,0.5)',
    color: '#e94560',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '2px',
    padding: '5px 14px',
    borderRadius: '20px',
    marginBottom: '12px',
  },
  leftTitle: {
    color: '#fff', fontSize: '32px', fontWeight: '800', margin: '0 0 6px',
    textShadow: '0 0 30px rgba(233,69,96,0.4)',
  },
  leftSub: {
    color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 20px',
  },
  features: {
    display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start',
    display: 'inline-flex',
  },
  featureItem: {
    display: 'flex', alignItems: 'center', gap: '8px',
    color: 'rgba(255,255,255,0.7)', fontSize: '13px',
  },
  featureDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: '#e94560', flexShrink: 0,
  },
  // RIGHT
  right: {
    width: '420px',
    minWidth: '320px',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 20px',
  },
  card: {
    width: '100%', maxWidth: '360px',
  },
  cardHeader: { textAlign: 'center', marginBottom: '28px' },
  logoCircle: {
    fontSize: '44px',
    display: 'block',
    marginBottom: '10px',
    filter: 'drop-shadow(0 4px 12px rgba(233,69,96,0.3))',
  },
  cardTitle: {
    margin: '0 0 4px', color: '#1a1a2e', fontSize: '24px', fontWeight: '800',
  },
  cardSub: { color: '#718096', fontSize: '13px', margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.5px' },
  inputWrap: {
    display: 'flex', alignItems: 'center',
    border: '2px solid #e2e8f0', borderRadius: '10px',
    overflow: 'hidden', background: '#f8fafc',
    transition: 'border-color 0.2s',
  },
  inputIcon: { padding: '0 10px', fontSize: '16px', userSelect: 'none' },
  input: {
    flex: 1, padding: '12px 8px', border: 'none', background: 'transparent',
    fontSize: '14px', outline: 'none', color: '#2d3748',
  },
  eyeBtn: {
    padding: '0 12px', cursor: 'pointer', fontSize: '16px', userSelect: 'none',
  },
  btn: {
    padding: '14px',
    background: 'linear-gradient(135deg, #e94560 0%, #c0392b 100%)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(233,69,96,0.4)',
    transition: 'transform 0.1s',
    marginTop: '4px',
  },
  btnInner: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  spinner: {
    width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite', display: 'inline-block',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: '10px',
    margin: '22px 0 14px',
  },
  dividerText: {
    color: '#a0aec0', fontSize: '11px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '1px',
    background: '#fff', padding: '0 8px', whiteSpace: 'nowrap',
    flex: 1, textAlign: 'center',
    borderTop: '1px solid #e2e8f0',
  },
  roles: { display: 'flex', gap: '8px', justifyContent: 'center' },
  roleBtn: {
    flex: 1, padding: '10px 6px', background: '#fff',
    border: '2px solid', borderRadius: '10px', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    fontSize: '18px', transition: 'background 0.2s',
  },
  hint: { textAlign: 'center', color: '#a0aec0', fontSize: '11px', marginTop: '14px' },
};
