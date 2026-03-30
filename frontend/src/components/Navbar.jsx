import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07-.71.71M6.34 17.66l-.71.71m12.73 0-.71-.71M6.34 6.34l-.71-.71M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={s.nav}>
      <div style={s.left}>
        <Link to="/dashboard" style={s.brand}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-link)' }}>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
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
            <button onClick={toggleTheme} style={s.signOut} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
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
    background: 'var(--bg-default)',
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
    color: 'var(--text-primary)',
  },
  right: { display: 'flex', alignItems: 'center', gap: '8px' },
  navLink: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'color 0.15s',
    textDecoration: 'none',
  },
  divider: {
    width: '1px',
    height: '16px',
    background: 'var(--border-default)',
  },
  avatarWrap: { display: 'flex', alignItems: 'center' },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'var(--accent-green)',
    border: '1px solid #30363d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-inv)',
  },
  signOut: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'color 0.15s',
  },
};
