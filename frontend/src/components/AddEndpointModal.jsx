import React, { useState } from 'react';
import api from '../api/axios';

export default function AddEndpointModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', url: '', checkIntervalSeconds: 60 });
  const [error, setError] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/endpoints', { ...form, checkIntervalSeconds: Number(form.checkIntervalSeconds) });
      onAdded(data);
      onClose();
    } catch (err) {
      setError('Failed to add endpoint');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Add Endpoint</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={submit}>
          <input style={styles.input} name="name" placeholder="Name (e.g. Auth API)" onChange={handle} required />
          <input style={styles.input} name="url" type="url" placeholder="https://api.example.com/health" onChange={handle} required />
          <select style={styles.input} name="checkIntervalSeconds" onChange={handle}>
            <option value={30}>Every 30 seconds</option>
            <option value={60}>Every 1 minute</option>
            <option value={300}>Every 5 minutes</option>
            <option value={600}>Every 10 minutes</option>
          </select>
          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={styles.btn}>Add Endpoint</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modal: { background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '440px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
  title: { fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' },
  input: { display: 'block', width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' },
  btn: { padding: '0.75rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem' },
  cancelBtn: { padding: '0.75rem 1.5rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem' },
  actions: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
};
