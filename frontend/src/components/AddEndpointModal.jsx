import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AddEndpointModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', url: '', checkIntervalSeconds: 60 });
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/endpoints', { ...form, checkIntervalSeconds: Number(form.checkIntervalSeconds) });
      onAdded(data);
      handleClose();
    } catch (err) {
      setError('Failed to add endpoint');
      setLoading(false);
    }
  };

  const intervals = [
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
  ];

  return (
    <div
      style={{
        ...styles.overlay,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          ...styles.modal,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
          opacity: visible ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative gradient line at top */}
        <div style={styles.topLine} />

        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.title}>Add Endpoint</h2>
            <p style={styles.subtitle}>Monitor a new API endpoint</p>
          </div>
          <button style={styles.closeBtn} onClick={handleClose}>✕</button>
        </div>

        {error && (
          <div style={styles.error}>
            <span style={{ marginRight: '0.5rem' }}>⚠</span>{error}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              name="name"
              placeholder="e.g. Auth API"
              onChange={handle}
              required
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>URL</label>
            <input
              style={styles.input}
              name="url"
              type="url"
              placeholder="https://api.example.com/health"
              onChange={handle}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Check Interval</label>
            <div style={styles.intervalGrid}>
              {intervals.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  style={{
                    ...styles.intervalBtn,
                    ...(Number(form.checkIntervalSeconds) === value ? styles.intervalActive : {}),
                  }}
                  onClick={() => setForm({ ...form, checkIntervalSeconds: value })}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span style={styles.spinner} />
              ) : (
                'Add Endpoint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: '1rem',
  },
  modal: {
    background: 'rgba(15, 15, 35, 0.95)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.08)',
    overflow: 'hidden',
  },
  topLine: {
    height: '3px',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
    backgroundSize: '200% 100%',
    animation: 'gradient-shift 3s ease infinite',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.5rem 1.75rem 0',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#f1f1f7',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#5b5b73',
    marginTop: '0.25rem',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#8b8ba3',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  field: {
    padding: '0 1.75rem',
    marginTop: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#8b8ba3',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1.5px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: '#f1f1f7',
    outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
  },
  intervalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.5rem',
  },
  intervalBtn: {
    padding: '0.6rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1.5px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#8b8ba3',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  intervalActive: {
    background: 'rgba(99, 102, 241, 0.12)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    color: '#a78bfa',
    boxShadow: '0 0 16px rgba(99,102,241,0.1)',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    padding: '1.5rem 1.75rem',
    marginTop: '0.5rem',
  },
  cancelBtn: {
    padding: '0.7rem 1.25rem',
    background: 'rgba(255,255,255,0.04)',
    color: '#8b8ba3',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  submitBtn: {
    padding: '0.7rem 1.5rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '0.9rem',
    boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
    transition: 'all 0.25s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '130px',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.6s linear infinite',
  },
  error: {
    margin: '1rem 1.75rem 0',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    border: '1px solid rgba(239, 68, 68, 0.15)',
  },
};
