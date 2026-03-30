import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Register() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ teamName: '', slug: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  const fields = [
    { name: 'teamName', label: 'Team Name',  placeholder: 'Acme Corp',       type: 'text' },
    { name: 'slug',     label: 'Team Slug',   placeholder: 'acme-corp',       type: 'text' },
    { name: 'email',    label: 'Email',       placeholder: 'admin@acme.com',  type: 'email' },
    { name: 'password', label: 'Password',    placeholder: '••••••••',        type: 'password', minLength: 6, extra: 'Minimum 6 characters' },
  ];

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoRow}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-link)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          <span style={s.logoText}>AvailAPI</span>
        </div>

        <h1 style={s.heading}>Create your team</h1>
        <p style={s.sub}>Monitor your APIs in under a minute</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={submit}>
          {fields.map(f => (
            <div key={f.name} style={s.field}>
              <div style={s.labelRow}>
                <label style={s.label}>{f.label}</label>
                {f.extra && <span style={s.helperText}>{f.extra}</span>}
              </div>
              <input className="gh-input" name={f.name} type={f.type} minLength={f.minLength}
                placeholder={f.placeholder} onChange={handle} required />
            </div>
          ))}
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? <span style={s.spinner} /> : 'Create account'}
          </button>
        </form>

        <div style={s.foot}>
          Already have an account? <Link to="/login" style={{ color: 'var(--text-link)' }}>Sign in</Link>
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
    maxWidth: '360px',
  },
  logoRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', marginBottom: '16px',
  },
  logoText: { fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' },
  heading: { fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: '4px' },
  sub: { fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '20px' },
  field: { marginBottom: '10px' },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' },
  helperText: { fontSize: '11px', color: 'var(--text-muted)' },
  btn: {
    display: 'flex', width: '100%', padding: '8px 16px',
    background: 'var(--accent-green)', color: 'var(--text-inv)', border: '1px solid rgba(240,246,252,0.1)',
    borderRadius: '6px', fontSize: '14px', fontWeight: 500,
    cursor: 'pointer', marginTop: '14px',
    alignItems: 'center', justifyContent: 'center', height: '36px',
    transition: 'background 0.15s',
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
