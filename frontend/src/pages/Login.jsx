import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

/* ── 3D Isometric Building Scene ─────────────────────────── */
function Building3D({ tick }) {
  const crane = Math.sin(tick * 0.025) * 8;
  const hookY  = 60 + Math.abs(Math.sin(tick * 0.02)) * 20;
  const smoke  = [0,1,2].map(i => ({
    x: 760 + Math.sin(tick * 0.03 + i * 1.2) * 8,
    y: 80  - (((tick * 0.4 + i * 30) % 60)),
    r: 4 + i * 3,
    o: 0.15 - i * 0.04,
  }));

  /* isometric helpers */
  const iso = (x, y, z) => ({
    sx: (x - y) * Math.cos(Math.PI / 6),
    sy: (x + y) * Math.sin(Math.PI / 6) - z,
  });

  /* draw one iso box face */
  const faceTop  = (cx,cy,cz, w,d, fill) => {
    const a = iso(cx,    cy,    cz);
    const b = iso(cx+w,  cy,    cz);
    const c = iso(cx+w,  cy+d,  cz);
    const e = iso(cx,    cy+d,  cz);
    return `${a.sx},${a.sy} ${b.sx},${b.sy} ${c.sx},${c.sy} ${e.sx},${e.sy}`;
  };
  const faceLeft = (cx,cy,cz, w,h, fill) => {
    const a = iso(cx,   cy,   cz);
    const b = iso(cx+w, cy,   cz);
    const c = iso(cx+w, cy,   cz-h);
    const e = iso(cx,   cy,   cz-h);
    return `${a.sx},${a.sy} ${b.sx},${b.sy} ${c.sx},${c.sy} ${e.sx},${e.sy}`;
  };
  const faceRight= (cx,cy,cz, d,h) => {
    const a = iso(cx,   cy,   cz);
    const b = iso(cx,   cy+d, cz);
    const c = iso(cx,   cy+d, cz-h);
    const e = iso(cx,   cy,   cz-h);
    return `${a.sx},${a.sy} ${b.sx},${b.sy} ${c.sx},${c.sy} ${e.sx},${e.sy}`;
  };

  /* window grid on a face */
  const isoWindows = (cx,cy,cz, w,h, cols,rows, axis) => {
    const wins = [];
    const ww = w / (cols * 2 + 1);
    const wh = h / (rows * 2 + 1);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const lit = (r + c + Math.floor(tick*0.005)) % 3 !== 0;
        const ox = ww + c * ww * 2;
        const oz = wh + r * wh * 2;
        let pts;
        if (axis === 'left') {
          const a = iso(cx + ox,      cy, cz - oz);
          const b = iso(cx + ox + ww, cy, cz - oz);
          const cc= iso(cx + ox + ww, cy, cz - oz - wh);
          const e = iso(cx + ox,      cy, cz - oz - wh);
          pts = `${a.sx},${a.sy} ${b.sx},${b.sy} ${cc.sx},${cc.sy} ${e.sx},${e.sy}`;
        } else {
          const a = iso(cx, cy + ox,      cz - oz);
          const b = iso(cx, cy + ox + ww, cz - oz);
          const cc= iso(cx, cy + ox + ww, cz - oz - wh);
          const e = iso(cx, cy + ox,      cz - oz - wh);
          pts = `${a.sx},${a.sy} ${b.sx},${b.sy} ${cc.sx},${cc.sy} ${e.sx},${e.sy}`;
        }
        wins.push(<polygon key={`${r}-${c}`} points={pts}
          fill={lit ? '#ffe066' : '#1a2a3a'} opacity={lit ? 0.9 : 0.6} />);
      }
    }
    return wins;
  };

  const S = 38; // scale unit

  /* building definitions [cx, cy, cz_base, w, d, h, colorTop, colorLeft, colorRight] */
  const buildings = [
    // back-left tall tower
    [0,   0,  0,  4, 3, 14*S, '#2a4a6b','#1a3a5b','#0f2a4a'],
    // back-right tower
    [5,   0,  0,  3, 4, 12*S, '#2a4a6b','#1a3a5b','#0f2a4a'],
    // mid tower (under construction)
    [2,   2,  0,  3, 3, 10*S, '#e94560','#c0392b','#a93226'],
    // front-left medium
    [0,   4,  0,  3, 2,  7*S, '#2d5a8e','#1e4a7e','#0f3a6e'],
    // front-right medium
    [4,   3,  0,  2, 3,  8*S, '#2d5a8e','#1e4a7e','#0f3a6e'],
    // small front
    [1,   5,  0,  2, 2,  4*S, '#3a6a9e','#2a5a8e','#1a4a7e'],
    [5,   5,  0,  2, 2,  5*S, '#3a6a9e','#2a5a8e','#1a4a7e'],
  ];

  const VB = 900;
  const cx = VB / 2 - 20, cy = VB * 0.62;

  return (
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="40%" r="70%">
          <stop offset="0%"   stopColor="#0f2a4a"/>
          <stop offset="60%"  stopColor="#0a1a2e"/>
          <stop offset="100%" stopColor="#050d18"/>
        </radialGradient>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#e94560" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#e94560" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#3182ce" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#3182ce" stopOpacity="0"/>
        </radialGradient>
        <filter id="blur4"><feGaussianBlur stdDeviation="4"/></filter>
        <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
        <filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>
      </defs>

      {/* sky */}
      <rect width={VB} height={VB} fill="url(#bgGrad)"/>

      {/* stars */}
      {Array.from({length:60},(_,i)=>{
        const sx = (i*137.5)%VB;
        const sy = (i*97.3)%(VB*0.55);
        const sr = 0.5 + (i%3)*0.5;
        const so = 0.3 + (i%4)*0.15;
        return <circle key={i} cx={sx} cy={sy} r={sr} fill="white" opacity={so}/>;
      })}

      {/* moon */}
      <circle cx="780" cy="80" r="45" fill="#f0e68c" opacity="0.12" filter="url(#blur4)"/>
      <circle cx="780" cy="80" r="32" fill="#f0e68c" opacity="0.18"/>
      <circle cx="793" cy="72" r="26" fill="#0a1a2e"/>

      {/* ambient glow behind buildings */}
      <ellipse cx={cx} cy={cy+40} rx="320" ry="80" fill="url(#glow2)" filter="url(#blur8)"/>

      {/* ground plane */}
      <g transform={`translate(${cx},${cy})`}>
        {/* ground tiles */}
        {[-3,-2,-1,0,1,2,3].map(gx =>
          [-2,-1,0,1,2].map(gy => {
            const a = iso(gx*S,   gy*S,   0);
            const b = iso(gx*S+S, gy*S,   0);
            const c = iso(gx*S+S, gy*S+S, 0);
            const e = iso(gx*S,   gy*S+S, 0);
            const shade = (gx+gy)%2===0 ? '#0d2035' : '#0a1828';
            return <polygon key={`${gx}-${gy}`}
              points={`${a.sx},${a.sy} ${b.sx},${b.sy} ${c.sx},${c.sy} ${e.sx},${e.sy}`}
              fill={shade} stroke="#0f2540" strokeWidth="0.5"/>;
          })
        )}

        {/* road lines */}
        {[-2,-1,0,1,2].map(i => {
          const a = iso(-3*S, i*S+S*0.45, 1);
          const b = iso( 3*S, i*S+S*0.45, 1);
          return <line key={i} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy}
            stroke="#f6c90e" strokeWidth="0.8" opacity="0.15" strokeDasharray="8,12"/>;
        })}

        {/* BUILDINGS */}
        {buildings.map(([bx,by,bz,w,d,h,cTop,cLeft,cRight],bi) => {
          const bxs = (bx-3)*S, bys = (by-2)*S;
          return (
            <g key={bi}>
              {/* right face */}
              <polygon points={faceRight(bxs,bys,bz,d*S,h)} fill={cRight} stroke="#000" strokeWidth="0.3"/>
              {/* left face */}
              <polygon points={faceLeft(bxs,bys,bz,w*S,h)} fill={cLeft} stroke="#000" strokeWidth="0.3"/>
              {/* top face */}
              <polygon points={faceTop(bxs,bys,bz-h,w*S,d*S)} fill={cTop} stroke="#000" strokeWidth="0.3"/>
              {/* windows left */}
              {isoWindows(bxs,bys,bz, w*S,h, Math.max(1,w), Math.max(2,Math.floor(h/S/2)), 'left')}
              {/* windows right */}
              {isoWindows(bxs,bys+d*S,bz, d*S,h, Math.max(1,d), Math.max(2,Math.floor(h/S/2)), 'right')}
              {/* rooftop glow on tall buildings */}
              {h > 8*S && (() => {
                const top = iso(bxs+w*S/2, bys+d*S/2, bz-h-4);
                return <circle cx={top.sx} cy={top.sy} r="6"
                  fill="#e94560" opacity={0.6+Math.sin(tick*0.05+bi)*0.3} filter="url(#blur2)"/>;
              })()}
            </g>
          );
        })}

        {/* CRANE on mid tower */}
        {(() => {
          const base = iso(-1*S, 0*S, 0);
          const top  = iso(-1*S, 0*S, 10*S);
          const jibR = iso(-1*S + 4*S*Math.cos(crane*Math.PI/180), 0*S + 4*S*Math.sin(crane*Math.PI/180), 10*S);
          const jibL = iso(-1*S - 2*S*Math.cos(crane*Math.PI/180), 0*S - 2*S*Math.sin(crane*Math.PI/180), 10*S);
          const hook = iso(-1*S + 3.5*S*Math.cos(crane*Math.PI/180), 0*S + 3.5*S*Math.sin(crane*Math.PI/180), 10*S - hookY);
          return (
            <g>
              <line x1={base.sx} y1={base.sy} x2={top.sx} y2={top.sy} stroke="#e94560" strokeWidth="3"/>
              <line x1={jibL.sx} y1={jibL.sy} x2={jibR.sx} y2={jibR.sy} stroke="#e94560" strokeWidth="2.5"/>
              <line x1={top.sx} y1={top.sy} x2={hook.sx} y2={hook.sy} stroke="#f6c90e" strokeWidth="1.2"/>
              <rect x={hook.sx-5} y={hook.sy-4} width="10" height="8" fill="#aaa" rx="2"/>
              <circle cx={top.sx} cy={top.sy} r="5" fill="#e94560"/>
            </g>
          );
        })()}

        {/* CONSTRUCTION TRUCK */}
        {(() => {
          const tx = -3*S + ((tick*0.3)%(7*S));
          const tp = iso(tx, 2*S, 2);
          return (
            <g transform={`translate(${tp.sx},${tp.sy})`}>
              <rect x="-18" y="-10" width="36" height="14" fill="#e94560" rx="2"/>
              <rect x="10"  y="-16" width="14" height="12" fill="#c0392b" rx="1"/>
              <circle cx="-10" cy="6" r="5" fill="#222"/>
              <circle cx="-10" cy="6" r="3" fill="#555"/>
              <circle cx="12"  cy="6" r="5" fill="#222"/>
              <circle cx="12"  cy="6" r="3" fill="#555"/>
              <rect x="11" y="-14" width="11" height="8" fill="#87ceeb" opacity="0.5" rx="1"/>
            </g>
          );
        })()}

        {/* SMOKE from crane area */}
        {smoke.map((p,i) => {
          const sp = iso(-1*S, 0*S, 10*S + p.y);
          return <circle key={i} cx={sp.sx + p.x - VB/2 + cx} cy={sp.sy} r={p.r}
            fill="white" opacity={p.o} filter="url(#blur2)"/>;
        })}

        {/* WORKERS */}
        {[[-2*S,3*S],[ 0*S,4*S],[2*S,2*S]].map(([wx,wy],i) => {
          const wp = iso(wx, wy, 2);
          return (
            <g key={i} transform={`translate(${wp.sx},${wp.sy})`}>
              <circle cx="0" cy="-12" r="4" fill="#f4a261"/>
              <rect x="-2" y="-14" width="8" height="4" fill="#f6c90e" rx="2"/>
              <rect x="-3" y="-8"  width="6" height="10" fill="#1e3a5f"/>
            </g>
          );
        })}
      </g>

      {/* top glow overlay */}
      <ellipse cx={cx} cy={cy-180} rx="200" ry="120" fill="url(#glow1)" filter="url(#blur8)" opacity="0.5"/>

      {/* grid overlay */}
      <rect width={VB} height={VB} fill="none"
        style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',
        backgroundSize:'60px 60px'}}/>

      {/* vignette */}
      <radialGradient id="vig" cx="50%" cy="50%" r="70%">
        <stop offset="0%"   stopColor="transparent"/>
        <stop offset="100%" stopColor="rgba(0,0,0,0.55)"/>
      </radialGradient>
      <rect width={VB} height={VB} fill="url(#vig)"/>
    </svg>
  );
}

/* ── Login Component ─────────────────────────────────────── */
export default function Login() {
  const [form, setForm]       = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [tick, setTick]       = useState(0);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(id);
  }, []);

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
      {/* full-screen 3D background */}
      <Building3D tick={tick} />

      {/* dark overlay for readability */}
      <div style={s.overlay}/>

      {/* centered login card */}
      <div style={s.center}>
        {/* brand strip above card */}
        <div style={s.brand}>
          <span style={s.brandIcon}>🏗️</span>
          <span style={s.brandName}>CivilMatrix</span>
          <span style={s.brandTag}>Smart Construction Platform</span>
        </div>

        <div style={s.card}>
          <h1 style={s.cardTitle}>Welcome Back</h1>
          <p style={s.cardSub}>Sign in to continue</p>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Username</label>
              <div style={s.inputWrap}>
                <span style={s.iIcon}>👤</span>
                <input style={s.input} type="text" placeholder="Enter username"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })} required/>
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Password</label>
              <div style={s.inputWrap}>
                <span style={s.iIcon}>🔒</span>
                <input style={s.input} type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required/>
                <span style={s.eye} onClick={() => setShowPass(v => !v)}>
                  {showPass ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

            <button style={{ ...s.btn, opacity: loading ? 0.8 : 1 }} type="submit" disabled={loading}>
              {loading
                ? <><span style={s.spinner}/> Signing in...</>
                : <>🚀 Sign In</>}
            </button>
          </form>

          <div style={s.divLine}><span style={s.divTxt}>Quick Access</span></div>

          <div style={s.roles}>
            {[
              { label:'Admin',     user:'admin',        pass:'admin123',    color:'#e94560', icon:'👑' },
              { label:'Engineer',  user:'engineer',     pass:'engineer123', color:'#3182ce', icon:'⚙️' },
              { label:'Store Mgr',user:'storemanager', pass:'store123',    color:'#38a169', icon:'🏪' },
            ].map(r => (
              <button key={r.label}
                style={{ ...s.roleBtn, borderColor: r.color, color: r.color }}
                onClick={() => setForm({ username: r.user, password: r.pass })}>
                <span style={{ fontSize:18 }}>{r.icon}</span>
                <span style={{ fontSize:10, fontWeight:700 }}>{r.label}</span>
              </button>
            ))}
          </div>
          <p style={s.hint}>Click a role to auto-fill credentials</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: '#050d18',
  },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg,rgba(5,13,24,0.45) 0%,rgba(10,26,46,0.35) 100%)',
    zIndex: 1,
  },
  center: {
    position: 'relative', zIndex: 2,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    width: '100%', maxWidth: '420px',
    padding: '16px',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: '10px',
    marginBottom: '16px',
  },
  brandIcon: { fontSize: '32px', filter: 'drop-shadow(0 0 12px rgba(233,69,96,0.7))' },
  brandName: {
    color: '#fff', fontSize: '26px', fontWeight: '800',
    textShadow: '0 0 20px rgba(233,69,96,0.5)',
    letterSpacing: '-0.5px',
  },
  brandTag: {
    color: 'rgba(255,255,255,0.45)', fontSize: '11px',
    borderLeft: '1px solid rgba(255,255,255,0.2)',
    paddingLeft: '10px', lineHeight: '1.3',
  },
  card: {
    width: '100%',
    background: 'rgba(255,255,255,0.97)',
    borderRadius: '20px',
    padding: '32px 28px 24px',
    boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
    backdropFilter: 'blur(20px)',
  },
  cardTitle: { margin: '0 0 4px', color: '#1a1a2e', fontSize: '22px', fontWeight: '800', textAlign:'center' },
  cardSub:   { color: '#718096', fontSize: '13px', margin: '0 0 24px', textAlign:'center' },
  form:  { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '11px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.6px' },
  inputWrap: {
    display: 'flex', alignItems: 'center',
    border: '2px solid #e2e8f0', borderRadius: '10px',
    background: '#f8fafc', overflow: 'hidden',
  },
  iIcon: { padding: '0 10px', fontSize: '15px', userSelect: 'none' },
  input: {
    flex: 1, padding: '11px 6px', border: 'none', background: 'transparent',
    fontSize: '14px', outline: 'none', color: '#2d3748',
  },
  eye: { padding: '0 12px', cursor: 'pointer', fontSize: '15px', userSelect: 'none' },
  btn: {
    padding: '13px',
    background: 'linear-gradient(135deg,#e94560,#c0392b)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(233,69,96,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    marginTop: '4px',
  },
  spinner: {
    width: '14px', height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
  divLine: {
    display: 'flex', alignItems: 'center',
    margin: '20px 0 12px',
    gap: '10px',
  },
  divTxt: {
    flex: 1, textAlign: 'center',
    color: '#a0aec0', fontSize: '11px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '1px',
    borderTop: '1px solid #e2e8f0',
  },
  roles: { display: 'flex', gap: '8px' },
  roleBtn: {
    flex: 1, padding: '9px 4px',
    background: '#fff', border: '2px solid', borderRadius: '10px',
    cursor: 'pointer', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '3px',
  },
  hint: { textAlign: 'center', color: '#a0aec0', fontSize: '11px', marginTop: '12px' },
};
