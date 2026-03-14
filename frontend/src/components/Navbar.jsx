import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{
      ...styles.nav,
      background: scrolled ? 'rgba(6, 6, 15, 0.85)' : 'rgba(6, 6, 15, 0.4)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
    }}>
      <Link to="/dashboard" style={styles.brand}>
        <span style={styles.logoIcon}>◆</span>
        <span style={styles.logoText}>AvailAPI</span>
      </Link>
      <div style={styles.right}>
        {user && (
          <>
            <Link to={`/status/${user.slug}`} style={styles.link}>
              <span style={styles.linkIcon}>↗</span> Status Page
            </Link>
            <div style={styles.divider} />
            <div style={styles.userChip}>
              <div style={styles.avatar}>{user.email?.[0]?.toUpperCase()}</div>
              <span style={styles.email}>{user.email}</span>
            </div>
            <button style={styles.btn} onClick={handleLogout}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.85rem 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
  },
  logoIcon: {
    fontSize: '1.1rem',
    background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.4))',
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #f1f1f7 0%, #a78bfa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  link: {
    color: '#8b8ba3',
    fontSize: '0.85rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    transition: 'color 0.2s',
    padding: '0.4rem 0.75rem',
    borderRadius: '8px',
    border: '1px solid transparent',
  },
  linkIcon: {
    fontSize: '0.7rem',
  },
  divider: {
    width: '1px',
    height: '20px',
    background: 'rgba(255,255,255,0.08)',
  },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.3rem 0.75rem 0.3rem 0.3rem',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  avatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#fff',
  },
  email: {
    color: '#8b8ba3',
    fontSize: '0.82rem',
    fontWeight: 500,
  },
  btn: {
    padding: '0.45rem 1rem',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.82rem',
    transition: 'all 0.25s ease',
  },
};
