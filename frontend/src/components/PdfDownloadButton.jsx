import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function PdfDownloadButton({ endpoint, filename, label }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleDownload} disabled={loading} style={styles.btn}>
      {loading ? '⏳ Generating...' : `📄 ${label}`}
    </button>
  );
}

const styles = {
  btn: {
    padding: '10px 18px',
    background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
  },
};
