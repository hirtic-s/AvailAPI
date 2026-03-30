import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UptimeBadge from '../components/UptimeBadge';
import SSLBadge from '../components/SSLBadge';

export default function StatusPage() {
  const { slug } = useParams();
  const [data, setData]   = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/public/${slug}`)
      .then(r => setData(r.data))
      .catch(() => setError('Status page not found'));
  }, [slug]);

  if (error) return (
    <div style={s.center}>
      <div style={s.errorWrap}>
        <div style={s.errorCode}>404</div>
        <h2 style={s.errorTitle}>{error}</h2>
        <p style={s.errorSub}>The status page you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  if (!data) return (
    <div style={s.center}>
      <span style={s.spinner} />
    </div>
  );

  const allUp = data.endpoints.every(e => e.status === 'UP');

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <h1 style={s.teamName}>{data.teamName}</h1>
          <div style={{
            ...s.overallBadge,
            color: allUp ? 'var(--status-up)' : 'var(--status-down)',
            borderColor: allUp ? 'var(--border-up-subtle)' : 'var(--border-down-subtle)',
            background: allUp ? 'var(--bg-up-subtle)' : 'var(--bg-down-subtle)',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', display: 'inline-block',
              background: allUp ? 'var(--status-up)' : 'var(--status-down)',
              animation: 'glow-pulse 2s ease-in-out infinite',
            }} />
            {allUp ? 'All Systems Operational' : 'Degraded Performance'}
          </div>
        </div>

        {/* Services */}
        <div style={s.card}>
          <div style={s.cardTitle}>Services</div>
          {data.endpoints.map((ep, i) => (
            <div key={ep.id} style={{ ...s.row, borderTop: i > 0 ? '1px solid #21262d' : 'none' }}>
              <div style={s.rowLeft}>
                <span style={s.epName}>{ep.name}</span>
                <SSLBadge url={ep.url} />
              </div>
              <div style={s.rowRight}>
                <span style={s.metricPill}>{ep.uptimePercent}% uptime</span>
                <span style={s.metricPill}>{ep.avgLatencyMs}ms avg</span>
                <UptimeBadge status={ep.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Active Incidents */}
        {data.incidents?.filter(i => !i.resolvedAt).length > 0 && (
          <div style={{ ...s.card, borderColor: 'var(--border-down-subtle)' }}>
            <div style={{ ...s.cardTitle, color: 'var(--status-down)' }}>⚠ Active Incidents</div>
            {data.incidents.filter(i => !i.resolvedAt).map(inc => (
              <div key={inc.id} style={s.incident}>
                <span style={s.incDot} />
                Ongoing since {new Date(inc.startedAt).toLocaleString()}
              </div>
            ))}
          </div>
        )}

        <p style={s.footer}>
          Last updated: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: 'var(--bg-canvas)' },
  container: { maxWidth: '700px', margin: '0 auto', padding: '32px 16px' },
  header: { marginBottom: '24px' },
  teamName: { fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' },
  overallBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: '1px solid',
  },
  card: {
    background: 'var(--bg-default)', border: '1px solid #30363d',
    borderRadius: '6px', padding: '16px', marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px',
  },
  row: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: '12px', paddingBottom: '12px',
  },
  rowLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  rowRight: { display: 'flex', alignItems: 'center', gap: '8px' },
  epName: { fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' },
  metricPill: {
    fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-subtle)',
    border: '1px solid #30363d', borderRadius: '4px', padding: '2px 8px',
  },
  incident: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '13px', color: 'var(--status-down)', padding: '6px 0',
  },
  incDot: {
    width: 8, height: 8, borderRadius: '50%', background: 'var(--status-down)',
    boxShadow: '0 0 6px #f85149', flexShrink: 0, display: 'inline-block',
    animation: 'glow-pulse 2s ease-in-out infinite',
  },
  footer: { fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' },
  center: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', background: 'var(--bg-canvas)',
  },
  spinner: {
    width: '32px', height: '32px',
    border: '3px solid #30363d', borderTopColor: 'var(--accent-green)',
    borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite',
  },
  errorWrap: { textAlign: 'center' },
  errorCode: { fontSize: '64px', fontWeight: 700, color: 'var(--bg-subtle)', lineHeight: 1 },
  errorTitle: { fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', marginTop: '8px' },
  errorSub: { fontSize: '13px', color: 'var(--text-secondary)' },
};
