import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'delivery', label: '📦 Material Delivery' },
  { value: 'damage', label: '⚠️ Damage Report' },
  { value: 'progress', label: '🏗️ Site Progress' },
  { value: 'general', label: '📷 General' },
];

export default function SiteImages() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const load = () => api.get('/images').then(r => setImages(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('File too large (max 10MB)'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', category);
      await api.post('/images/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Image uploaded!');
      load();
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); fileRef.current.value = ''; }
  };

  const handleDelete = async (filename) => {
    if (!confirm('Delete this image?')) return;
    await api.delete(`/images/${filename}`);
    toast.success('Deleted');
    load();
  };

  const getCatLabel = (filename) => {
    const cat = CATEGORIES.find(c => filename.startsWith(c.value));
    return cat ? cat.label : '📷 General';
  };

  return (
    <div>
      <div style={s.header}>
        <h2 style={s.title}>📸 Site Images</h2>
      </div>

      <div style={s.uploadCard}>
        <h3 style={s.uploadTitle}>Upload Site Photo</h3>
        <div style={s.uploadRow}>
          <div style={s.field}>
            <label style={s.label}>Category</label>
            <select style={s.select} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Select Image</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload}
              style={s.fileInput} disabled={uploading} />
          </div>
          {uploading && <div style={s.uploading}>⏳ Uploading...</div>}
        </div>
      </div>

      {preview && (
        <div style={s.overlay} onClick={() => setPreview(null)}>
          <img src={`http://localhost:8080/api${preview}`} alt="preview"
            style={s.previewImg} onClick={e => e.stopPropagation()} />
          <button style={s.closeBtn} onClick={() => setPreview(null)}>✕ Close</button>
        </div>
      )}

      <div style={s.grid}>
        {images.map(img => (
          <div key={img.filename} style={s.card}>
            <div style={s.imgWrap} onClick={() => setPreview(img.url)}>
              <img src={`http://localhost:8080/api${img.url}`} alt={img.filename}
                style={s.img} onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect fill="%23edf2f7" width="200" height="150"/><text x="50%" y="50%" text-anchor="middle" fill="%23a0aec0" dy=".3em">No Preview</text></svg>'; }} />
              <div style={s.imgOverlay}>🔍 View</div>
            </div>
            <div style={s.cardBody}>
              <div style={s.catTag}>{getCatLabel(img.filename)}</div>
              <div style={s.filename}>{img.filename.split('_').slice(1).join('_') || img.filename}</div>
              <button style={s.delBtn} onClick={() => handleDelete(img.filename)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div style={s.empty}>No images uploaded yet. Upload site photos above.</div>
        )}
      </div>
    </div>
  );
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { margin: 0, color: '#1a1a2e', fontSize: '22px', fontWeight: '700' },
  uploadCard: { background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  uploadTitle: { margin: '0 0 16px', color: '#1a1a2e', fontSize: '16px', fontWeight: '600' },
  uploadRow: { display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.4px' },
  select: { padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', minWidth: '200px' },
  fileInput: { padding: '8px', border: '2px dashed #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', background: '#f7fafc' },
  uploading: { color: '#718096', fontSize: '14px', alignSelf: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  card: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  imgWrap: { position: 'relative', cursor: 'pointer', height: '160px', overflow: 'hidden', background: '#f7fafc' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' },
  imgOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', fontSize: '16px', fontWeight: '600' },
  cardBody: { padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' },
  catTag: { fontSize: '12px', color: '#0f3460', fontWeight: '600' },
  filename: { fontSize: '12px', color: '#718096', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  delBtn: { padding: '5px 12px', background: '#fff5f5', color: '#c53030', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', alignSelf: 'flex-start' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' },
  previewImg: { maxWidth: '90vw', maxHeight: '80vh', borderRadius: '8px', objectFit: 'contain' },
  closeBtn: { padding: '10px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  empty: { gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#a0aec0', fontSize: '15px' },
};
