import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UptimeBadge from '../components/UptimeBadge';
import SSLBadge from '../components/SSLBadge';

export default function StatusPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/public/${slug}`)
      .then(r => setData(r.data))
      .catch(() => setError('Status page not found'));
  }, [slug]);

  if (error) return (
    <div style={styles.center}>
      <div style={styles.errorCard} className="animate-in">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ color: '#f1f1f7', marginBottom: '0.5rem' }}>{error}</h2>
        <p style={{ color: '#5b5b73' }}>The status page you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  if (!data) return (
    <div style={styles.center}>
      <div style={styles.loader}>
        <span style={styles.spinnerLg} />
      </div>
    </div>
  );

  const allUp = data.endpoints.every(e => e.status === 'UP');

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header} className="animate-in">
          <div style={styles.logoRow}>
            <span style={styles.logoIcon}>◆</span>
            <span style={styles.logoText}>{data.teamName}</span>
          </div>
          <div style={{
            ...styles.overallBadge,
            background: allUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: allUp ? '#34d399' : '#f87171',
            borderColor: allUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            boxShadow: allUp ? '0 0 30px rgba(16, 185, 129, 0.1)' : '0 0 30px rgba(239, 68, 68, 0.1)',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: allUp ? '#10b981' : '#ef4444',
              display: 'inline-block',
              boxShadow: `0 0 8px ${allUp ? '#10b981' : '#ef4444'}`,
              animation: 'glow-pulse 2s ease-in-out infinite',
            }} />
            {allUp ? 'All Systems Operational' : 'Degraded Performance'}
          </div>
        </div>

        {/* Services */}
        <div style={styles.section} className="animate-in animate-in-delay-1">
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>◇</span> Services
          </h2>
          {data.endpoints.map((ep, i) => (
            <div
              key={ep.id}
              style={{
                ...styles.row,
                animation: `fadeInUp 0.4s ease ${i * 0.05}s forwards`,
                opacity: 0,
              }}
            >
              <div style={styles.rowLeft}>
                <span style={styles.epName}>{ep.name}</span>
                <SSLBadge url={ep.url} />
              </div>
              <div style={styles.rowRight}>
                <div style={styles.metricPill}>
                  <span style={styles.metricVal}>{ep.uptimePercent}%</span>
                  <span style={styles.metricLabel}>uptime</span>
                </div>
                <div style={styles.metricPill}>
                  <span style={styles.metricVal}>{ep.avgLatencyMs}ms</span>
                  <span style={styles.metricLabel}>avg</span>
                </div>
                <UptimeBadge status={ep.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Active Incidents */}
        {data.incidents?.filter(i => !i.resolvedAt).length > 0 && (
          <div style={styles.section} className="animate-in animate-in-delay-2">
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>⚠</span> Active Incidents
            </h2>
            {data.incidents.filter(i => !i.resolvedAt).map(inc => (
              <div key={inc.id} style={styles.incident}>
                <span style={styles.incidentDot} />
                Ongoing since {new Date(inc.startedAt).toLocaleString()}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <p style={styles.footer}>
          Last updated: {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#06060f',
  },
  container: {
    maxWidth: '760px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
  },
  header: {
    marginBottom: '2.5rem',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
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
    fontSize: '2rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#f1f1f7',
  },
  overallBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.7rem 1.5rem',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.9rem',
    border: '1px solid',
  },
  section: {
    background: 'rgba(15, 15, 35, 0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  sectionTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#8b8ba3',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  sectionIcon: {
    background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderTop: '1px solid rgba(255,255,255,0.04)',
  },
  rowLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  rowRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  epName: {
    fontWeight: 600,
    color: '#f1f1f7',
    fontSize: '0.95rem',
  },
  metricPill: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem',
    padding: '0.25rem 0.6rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '6px',
  },
  metricVal: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#8b8ba3',
  },
  metricLabel: {
    fontSize: '0.65rem',
    color: '#5b5b73',
  },
  incident: {
    padding: '0.85rem 1rem',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.12)',
    borderRadius: '10px',
    color: '#f87171',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  incidentDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#ef4444',
    boxShadow: '0 0 8px #ef4444',
    animation: 'glow-pulse 2s ease-in-out infinite',
    flexShrink: 0,
  },
  footer: {
    color: '#5b5b73',
    fontSize: '0.78rem',
    textAlign: 'center',
    marginTop: '1rem',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#06060f',
  },
  errorCard: {
    textAlign: 'center',
    padding: '3rem',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
  },
  spinnerLg: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(99,102,241,0.15)',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.8s linear infinite',
  },
};
