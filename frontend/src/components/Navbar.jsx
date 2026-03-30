import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={s.nav}>
      <div style={s.left}>
        <Link to="/dashboard" style={s.brand}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ color: '#58a6ff' }}>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span style={s.brandText}>AvailAPI</span>
        </Link>
      </div>

      <div style={s.right}>
        {user && (
          <>
            <Link to={`/status/${user.slug}`} style={s.navLink}>
              Status Page
            </Link>
            <div style={s.divider} />
            <div style={s.avatarWrap} title={user.email}>
              <div style={s.avatar}>{user.email?.[0]?.toUpperCase()}</div>
            </div>
            <button style={s.signOut} onClick={handleLogout}>Sign out</button>
          </>
        )}
      </div>
    </nav>
  );
}

const s = {
  nav: {
    height: '48px',
    background: '#161b22',
    borderBottom: '1px solid #30363d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexShrink: 0,
  },
  left: { display: 'flex', alignItems: 'center', gap: '8px' },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  brandText: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#e6edf3',
  },
  right: { display: 'flex', alignItems: 'center', gap: '8px' },
  navLink: {
    fontSize: '13px',
    color: '#8b949e',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'color 0.15s',
    textDecoration: 'none',
  },
  divider: {
    width: '1px',
    height: '16px',
    background: '#30363d',
  },
  avatarWrap: { display: 'flex', alignItems: 'center' },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#238636',
    border: '1px solid #30363d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: '#fff',
  },
  signOut: {
    background: 'none',
    border: 'none',
    color: '#8b949e',
    fontSize: '13px',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'color 0.15s',
  },
};
