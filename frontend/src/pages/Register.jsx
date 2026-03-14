import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ teamName: '', slug: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

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

  const inputStyle = (name) => ({
    ...styles.input,
    borderColor: focused === name ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)',
    boxShadow: focused === name ? '0 0 20px rgba(99,102,241,0.1)' : 'none',
  });

  const fields = [
    { name: 'teamName', label: 'Team Name', placeholder: 'Acme Corp', type: 'text' },
    { name: 'slug', label: 'Team Slug', placeholder: 'acme-corp', type: 'text' },
    { name: 'email', label: 'Email', placeholder: 'admin@acme.com', type: 'email' },
    { name: 'password', label: 'Password', placeholder: '••••••••', type: 'password' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.orb3} />

      <div style={styles.card} className="animate-in">
        <div style={styles.topBar} />
        <div style={styles.cardInner}>
          <div style={styles.logoRow}>
            <span style={styles.logoIcon}>◆</span>
            <span style={styles.logoText}>AvailAPI</span>
          </div>
          <h2 style={styles.subtitle}>Create your team</h2>
          <p style={styles.desc}>Start monitoring your APIs in under a minute</p>

          {error && (
            <div style={styles.error}><span>⚠</span> {error}</div>
          )}

          <form onSubmit={submit}>
            {fields.map(f => (
              <div key={f.name} style={styles.field}>
                <label style={styles.label}>{f.label}</label>
                <input
                  style={inputStyle(f.name)}
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  onChange={handle}
                  onFocus={() => setFocused(f.name)}
                  onBlur={() => setFocused('')}
                  required
                />
              </div>
            ))}

            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? <span style={styles.spinner} /> : 'Create Account'}
            </button>
          </form>

          <p style={styles.link}>
            Already have an account?{' '}
            <Link to="/login" style={styles.linkAccent}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#06060f',
    position: 'relative',
    overflow: 'hidden',
    padding: '1rem',
  },
  orb1: {
    position: 'absolute',
    top: '5%',
    right: '20%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
    filter: 'blur(80px)',
    animation: 'float 9s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute',
    bottom: '5%',
    left: '10%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
    filter: 'blur(60px)',
    animation: 'float 11s ease-in-out infinite reverse',
    pointerEvents: 'none',
  },
  orb3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
    filter: 'blur(50px)',
    animation: 'float 7s ease-in-out infinite',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(15, 15, 35, 0.8)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '24px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.05)',
    width: '100%',
    maxWidth: '440px',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    position: 'relative',
    zIndex: 1,
  },
  topBar: {
    height: '3px',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #6366f1)',
    backgroundSize: '200% 100%',
    animation: 'gradient-shift 4s ease infinite',
  },
  cardInner: { padding: '2.25rem 2.5rem' },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem',
  },
  logoIcon: {
    fontSize: '1.5rem',
    background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.4))',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #f1f1f7, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: '#f1f1f7',
    marginBottom: '0.25rem',
  },
  desc: {
    fontSize: '0.9rem',
    color: '#5b5b73',
    marginBottom: '1.75rem',
  },
  field: { marginBottom: '1.1rem' },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#8b8ba3',
    marginBottom: '0.45rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1.5px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    fontSize: '0.95rem',
    color: '#f1f1f7',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  btn: {
    width: '100%',
    padding: '0.85rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: 700,
    marginTop: '0.5rem',
    boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '48px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2.5px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.6s linear infinite',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    marginBottom: '1.25rem',
    fontSize: '0.85rem',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  link: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#5b5b73',
    fontSize: '0.9rem',
  },
  linkAccent: {
    color: '#a78bfa',
    fontWeight: 600,
  },
};
