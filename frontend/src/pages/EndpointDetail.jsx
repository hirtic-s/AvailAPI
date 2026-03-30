import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import UptimeBadge from '../components/UptimeBadge';
import LatencyChart from '../components/LatencyChart';
import { formatTime } from '../utils/time';

export default function EndpointDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [endpoint, setEndpoint] = useState(null);
  const [history, setHistory]   = useState([]);

  useEffect(() => {
    api.get('/api/endpoints').then(({ data }) =>
      setEndpoint(data.find(e => e.id === id))
    );
    api.get(`/api/endpoints/${id}/history?hours=24`).then(({ data }) => setHistory(data));
  }, [id]);

  const latest        = history[history.length - 1];
  const upCount       = history.filter(p => p.status === 'UP').length;
  const uptime        = history.length ? ((upCount / history.length) * 100).toFixed(2) : 'N/A';
  const validLat      = history.filter(p => p.latencyMs >= 0);
  const avgLatency    = validLat.length
    ? Math.round(validLat.reduce((a, b) => a + b.latencyMs, 0) / validLat.length) : 0;

  const stats = [
    { label: '24h Uptime',    value: `${uptime}%`,       color: 'var(--status-up)' },
    { label: 'Avg Latency',   value: `${avgLatency}ms`,  color: 'var(--text-link)' },
    { label: 'Checks (24h)',  value: `${history.length}`, color: 'var(--text-secondary)' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <Navbar />
      <div style={s.container}>
        <button style={s.back} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        {endpoint && (
          <>
            <div style={s.header}>
              <div>
                <h1 style={s.title}>{endpoint.name || endpoint.url}</h1>
                <code style={s.url}>{endpoint.url}</code>
              </div>
              {latest && <UptimeBadge status={latest.status} />}
            </div>

            {/* Stats */}
            <div style={s.statsRow}>
              {stats.map(stat => (
                <div key={stat.label} style={s.statCard}>
                  <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
                  <div style={s.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>Latency</span>
                <span style={s.badge}>Last 24h</span>
              </div>
              <LatencyChart data={history} />
            </div>

            {/* Recent Checks Table */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>Recent Checks</span>
                <span style={s.badge}>{history.length} total</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Time (IST)</th>
                      <th style={s.th}>Status</th>
                      <th style={s.th}>Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...history].reverse().slice(0, 20).map((p, i) => (
                      <tr key={i} style={s.tr}>
                        <td style={s.td}>{formatTime(p.checkedAt)}</td>
                        <td style={s.td}><UptimeBadge status={p.status} /></td>
                        <td style={{ ...s.td, fontFamily: 'monospace' }}>
                          {p.latencyMs >= 0
                            ? <span style={{ color: p.latencyMs > 1000 ? 'var(--status-timeout)' : 'var(--status-up)' }}>{p.latencyMs}ms</span>
                            : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '20px 16px 40px' },
  back: {
    background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px',
    cursor: 'pointer', padding: '0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '16px',
  },
  title: { fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' },
  url: { fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '16px' },
  statCard: {
    background: 'var(--bg-default)', border: '1px solid #30363d', borderRadius: '6px',
    padding: '16px', textAlign: 'center',
  },
  statValue: { fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 },
  statLabel: { fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' },
  card: {
    background: 'var(--bg-default)', border: '1px solid #30363d', borderRadius: '6px',
    padding: '16px', marginBottom: '16px',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  cardTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' },
  badge: {
    fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-subtle)',
    border: '1px solid #30363d', borderRadius: '20px', padding: '1px 8px',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '8px 12px', fontSize: '11px', fontWeight: 600,
    color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em',
    borderBottom: '1px solid #21262d',
  },
  tr: { borderBottom: '1px solid #21262d' },
  td: { padding: '8px 12px', fontSize: '12px', color: 'var(--text-secondary)' },
};
