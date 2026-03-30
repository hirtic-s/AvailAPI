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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-link)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
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
          New to AvailAPI? <Link to="/register" style={{ color: 'var(--text-link)' }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-canvas)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    background: 'var(--bg-default)',
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
  logoText: { fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' },
  heading: { fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: '4px' },
  sub: { fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '20px' },
  field: { marginBottom: '12px' },
  label: {
    display: 'block', fontSize: '13px', fontWeight: 600,
    color: '#c9d1d9', marginBottom: '6px',
  },
  btn: {
    display: 'block', width: '100%', padding: '8px 16px',
    background: 'var(--accent-green)', color: 'var(--text-inv)', border: '1px solid rgba(240,246,252,0.1)',
    borderRadius: '6px', fontSize: '14px', fontWeight: 500,
    cursor: 'pointer', marginTop: '16px', textAlign: 'center',
    transition: 'background 0.15s', height: '36px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  spinner: {
    width: '16px', height: '16px',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--text-inv)',
    borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite',
  },
  error: {
    background: 'var(--bg-down-subtle)', color: 'var(--status-down)',
    border: '1px solid rgba(248,81,73,0.25)', borderRadius: '6px',
    padding: '8px 12px', fontSize: '13px', marginBottom: '12px',
  },
  foot: {
    marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center',
    borderTop: '1px solid #21262d', paddingTop: '16px',
  },
};
