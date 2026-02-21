import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ teamName: '', slug: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/auth/register', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>API Monitor</h1>
        <h2 style={styles.subtitle}>Create your team</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={submit}>
          <input style={styles.input} name="teamName" placeholder="Team Name" onChange={handle} required />
          <input style={styles.input} name="slug" placeholder="Team Slug (e.g. myteam)" onChange={handle} required />
          <input style={styles.input} name="email" type="email" placeholder="Email" onChange={handle} required />
          <input style={styles.input} name="password" type="password" placeholder="Password (min 6)" onChange={handle} required />
          <button style={styles.btn} type="submit">Create Account</button>
        </form>
        <p style={styles.link}>Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' },
  card: { background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#4f46e5', marginBottom: '0.25rem' },
  subtitle: { fontSize: '1.1rem', color: '#6b7280', marginBottom: '1.5rem' },
  input: { display: 'block', width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' },
  btn: { width: '100%', padding: '0.85rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600 },
  error: { background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
  link: { textAlign: 'center', marginTop: '1.25rem', color: '#6b7280' },
};
