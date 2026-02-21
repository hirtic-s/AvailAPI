import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>⚡ API Monitor</Link>
      <div style={styles.right}>
        {user && (
          <>
            <a href={`/status/${user.slug}`} target="_blank" rel="noreferrer" style={styles.link}>
              Public Page ↗
            </a>
            <span style={styles.email}>{user.email}</span>
            <button style={styles.btn} onClick={handleLogout}>Sign Out</button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 },
  brand: { fontSize: '1.25rem', fontWeight: 700, color: '#4f46e5' },
  right: { display: 'flex', alignItems: 'center', gap: '1.25rem' },
  link: { color: '#4f46e5', fontSize: '0.9rem', fontWeight: 500 },
  email: { color: '#6b7280', fontSize: '0.9rem' },
  btn: { padding: '0.45rem 1rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.875rem' },
};
