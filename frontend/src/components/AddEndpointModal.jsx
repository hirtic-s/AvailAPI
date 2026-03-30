import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AddEndpointModal({ onClose, onAdded }) {
  const [form, setForm]       = useState({ name: '', url: '', checkIntervalSeconds: 60 });
  const [error, setError]     = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleClose = () => { setVisible(false); setTimeout(onClose, 200); };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/endpoints', {
        ...form, checkIntervalSeconds: Number(form.checkIntervalSeconds),
      });
      onAdded(data);
      handleClose();
    } catch {
      setError('Failed to add endpoint');
      setLoading(false);
    }
  };

  const intervals = [
    { value: 30,  label: '30s' },
    { value: 60,  label: '1m' },
    { value: 300, label: '5m' },
    { value: 600, label: '10m' },
  ];

  return (
    <div style={{
      ...s.overlay,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.2s',
    }} onClick={handleClose}>
      <div style={{
        ...s.modal,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)',
        transition: 'all 0.2s',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={s.header}>
          <div>
            <div style={s.title}>Add endpoint</div>
            <div style={s.subtitle}>Monitor a new API endpoint</div>
          </div>
          <button style={s.closeBtn} onClick={handleClose}>✕</button>
        </div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={submit} style={s.body}>
          <div style={s.field}>
            <label style={s.label}>Name</label>
            <input className="gh-input" name="name" placeholder="e.g. Auth API"
              onChange={handle} required autoFocus />
          </div>

          <div style={s.field}>
            <label style={s.label}>URL</label>
            <input className="gh-input" name="url" type="url"
              placeholder="https://api.example.com/health" onChange={handle} required />
          </div>

          <div style={s.field}>
            <label style={s.label}>Check interval</label>
            <div style={s.intervalRow}>
              {intervals.map(({ value, label }) => {
                const active = Number(form.checkIntervalSeconds) === value;
                return (
                  <button
                    key={value}
                    type="button"
                    style={{
                      ...s.intBtn,
                      background: active ? '#238636' : '#21262d',
                      borderColor: active ? 'rgba(240,246,252,0.1)' : '#30363d',
                      color: active ? '#fff' : '#8b949e',
                    }}
                    onClick={() => setForm({ ...form, checkIntervalSeconds: value })}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={s.actions}>
            <button type="button" className="gh-btn" onClick={handleClose}>Cancel</button>
            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? <span style={s.spinner} /> : 'Add endpoint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200, padding: '16px',
  },
  modal: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '16px 20px', borderBottom: '1px solid #21262d',
  },
  title: { fontSize: '14px', fontWeight: 600, color: '#e6edf3' },
  subtitle: { fontSize: '12px', color: '#8b949e', marginTop: '2px' },
  closeBtn: {
    background: 'none', border: 'none', color: '#8b949e',
    fontSize: '14px', cursor: 'pointer', padding: '0 4px', lineHeight: 1,
  },
  body: { padding: '16px 20px' },
  field: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#c9d1d9', marginBottom: '6px' },
  intervalRow: { display: 'flex', gap: '6px' },
  intBtn: {
    padding: '5px 12px', borderRadius: '6px', border: '1px solid',
    fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
  },
  actions: {
    display: 'flex', justifyContent: 'flex-end', gap: '8px',
    marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #21262d',
  },
  submitBtn: {
    padding: '6px 16px', background: '#238636', color: '#fff',
    border: '1px solid rgba(240,246,252,0.1)', borderRadius: '6px',
    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minWidth: '110px', height: '32px', transition: 'background 0.15s',
  },
  spinner: {
    width: '14px', height: '14px',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite',
  },
  error: {
    margin: '0 20px 0', padding: '8px 12px',
    background: 'rgba(248,81,73,0.1)', color: '#f85149',
    border: '1px solid rgba(248,81,73,0.25)', borderRadius: '6px', fontSize: '13px',
  },
};
