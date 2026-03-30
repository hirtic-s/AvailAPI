import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoRow}>
          <svg width="20" height="20" viewBox="0 0 16 16" fill="#58a6ff">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span style={s.logoText}>AvailAPI</span>
        </div>

        <h1 style={s.heading}>Sign in</h1>
        <p style={s.sub}>to your monitoring dashboard</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={submit}>
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input className="gh-input" name="email" type="email"
              placeholder="you@company.com" onChange={handle} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input className="gh-input" name="password" type="password"
              placeholder="••••••••" onChange={handle} required />
          </div>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? <span style={s.spinner} /> : 'Sign in'}
          </button>
        </form>

        <div style={s.foot}>
          New to AvailAPI? <Link to="/register" style={{ color: '#58a6ff' }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#0d1117',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '340px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  logoText: { fontSize: '16px', fontWeight: 700, color: '#e6edf3' },
  heading: { fontSize: '20px', fontWeight: 600, color: '#e6edf3', textAlign: 'center', marginBottom: '4px' },
  sub: { fontSize: '13px', color: '#8b949e', textAlign: 'center', marginBottom: '20px' },
  field: { marginBottom: '12px' },
  label: {
    display: 'block', fontSize: '13px', fontWeight: 600,
    color: '#c9d1d9', marginBottom: '6px',
  },
  btn: {
    display: 'block', width: '100%', padding: '8px 16px',
    background: '#238636', color: '#fff', border: '1px solid rgba(240,246,252,0.1)',
    borderRadius: '6px', fontSize: '14px', fontWeight: 500,
    cursor: 'pointer', marginTop: '16px', textAlign: 'center',
    transition: 'background 0.15s', height: '36px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  spinner: {
    width: '16px', height: '16px',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite',
  },
  error: {
    background: 'rgba(248,81,73,0.1)', color: '#f85149',
    border: '1px solid rgba(248,81,73,0.25)', borderRadius: '6px',
    padding: '8px 12px', fontSize: '13px', marginBottom: '12px',
  },
  foot: {
    marginTop: '16px', fontSize: '13px', color: '#8b949e', textAlign: 'center',
    borderTop: '1px solid #21262d', paddingTop: '16px',
  },
};
