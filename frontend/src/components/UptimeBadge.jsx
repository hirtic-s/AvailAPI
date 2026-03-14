import React from 'react';

export default function UptimeBadge({ status }) {
  const config = {
    UP: {
      bg: 'rgba(16, 185, 129, 0.12)',
      color: '#34d399',
      border: 'rgba(16, 185, 129, 0.2)',
      glow: '0 0 12px rgba(16, 185, 129, 0.15)',
      dot: '#10b981',
      label: 'UP',
    },
    DOWN: {
      bg: 'rgba(239, 68, 68, 0.12)',
      color: '#f87171',
      border: 'rgba(239, 68, 68, 0.2)',
      glow: '0 0 12px rgba(239, 68, 68, 0.15)',
      dot: '#ef4444',
      label: 'DOWN',
    },
    TIMEOUT: {
      bg: 'rgba(245, 158, 11, 0.12)',
      color: '#fbbf24',
      border: 'rgba(245, 158, 11, 0.2)',
      glow: '0 0 12px rgba(245, 158, 11, 0.15)',
      dot: '#f59e0b',
      label: 'TIMEOUT',
    },
    UNKNOWN: {
      bg: 'rgba(139, 139, 163, 0.12)',
      color: '#8b8ba3',
      border: 'rgba(139, 139, 163, 0.2)',
      glow: 'none',
      dot: '#8b8ba3',
      label: 'UNKNOWN',
    },
  };

  const c = config[status] || config.UNKNOWN;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      background: c.bg,
      color: c.color,
      padding: '0.3rem 0.8rem',
      borderRadius: '999px',
      fontWeight: 700,
      fontSize: '0.72rem',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      border: `1px solid ${c.border}`,
      boxShadow: c.glow,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: c.dot,
        boxShadow: `0 0 6px ${c.dot}`,
        animation: status === 'UP' ? 'glow-pulse 2s ease-in-out infinite' : 'none',
      }} />
      {c.label}
    </span>
  );
}
