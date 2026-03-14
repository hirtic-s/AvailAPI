import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background animated orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <div style={styles.card} className="animate-in">
        {/* Gradient top border */}
        <div style={styles.topBar} />

        <div style={styles.cardInner}>
          <div style={styles.logoRow}>
            <span style={styles.logoIcon}>◆</span>
            <span style={styles.logoText}>AvailAPI</span>
          </div>
          <h2 style={styles.subtitle}>Welcome back</h2>
          <p style={styles.desc}>Sign in to your monitoring dashboard</p>

          {error && (
            <div style={styles.error}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={{
                  ...styles.input,
                  borderColor: focused === 'email' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)',
                  boxShadow: focused === 'email' ? '0 0 20px rgba(99,102,241,0.1)' : 'none',
                }}
                name="email"
                type="email"
                placeholder="you@company.com"
                onChange={handle}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={{
                  ...styles.input,
                  borderColor: focused === 'password' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)',
                  boxShadow: focused === 'password' ? '0 0 20px rgba(99,102,241,0.1)' : 'none',
                }}
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handle}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                required
              />
            </div>

            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? <span style={styles.spinner} /> : 'Sign In'}
            </button>
          </form>

          <p style={styles.link}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.linkAccent}>Create one</Link>
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
    top: '10%',
    left: '15%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
    filter: 'blur(60px)',
    animation: 'float 8s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute',
    bottom: '10%',
    right: '15%',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
    filter: 'blur(60px)',
    animation: 'float 10s ease-in-out infinite reverse',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(15, 15, 35, 0.8)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '24px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.05)',
    width: '100%',
    maxWidth: '420px',
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
  cardInner: {
    padding: '2.5rem',
  },
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
  field: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#8b8ba3',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.8rem 1rem',
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
    transition: 'color 0.2s',
  },
};
