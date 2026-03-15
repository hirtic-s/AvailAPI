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
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/api/endpoints').then(({ data }) => {
      const ep = data.find(e => e.id === id);
      setEndpoint(ep);
    });
    api.get(`/api/endpoints/${id}/history?hours=24`).then(({ data }) => setHistory(data));
  }, [id]);

  const latest = history[history.length - 1];
  const upCount = history.filter(p => p.status === 'UP').length;
  const uptime = history.length ? ((upCount / history.length) * 100).toFixed(2) : 'N/A';
  const validLatencies = history.filter(p => p.latencyMs >= 0);
  const avgLatency = validLatencies.length
    ? Math.round(validLatencies.reduce((a, b) => a + b.latencyMs, 0) / validLatencies.length)
    : 0;

  const stats = [
    {
      label: '24h Uptime',
      value: `${uptime}%`,
      color: '#10b981',
      icon: '↑',
      glow: 'rgba(16, 185, 129, 0.15)',
    },
    {
      label: 'Avg Latency',
      value: `${avgLatency}ms`,
      color: '#e8446d',
      icon: '⚡',
      glow: 'rgba(232, 68, 109, 0.15)',
    },
    {
      label: 'Checks (24h)',
      value: `${history.length}`,
      color: '#8b5cf6',
      icon: '●',
      glow: 'rgba(139, 92, 246, 0.15)',
    },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <button
          style={styles.back}
          onClick={() => navigate('/dashboard')}
          className="animate-in"
        >
          <span style={styles.backArrow}>←</span> Back to Dashboard
        </button>

        {endpoint && (
          <>
            {/* Header */}
            <div style={styles.header} className="animate-in animate-in-delay-1">
              <div>
                <h1 style={styles.title}>{endpoint.name || endpoint.url}</h1>
                <p style={styles.url}>{endpoint.url}</p>
              </div>
              {latest && <UptimeBadge status={latest.status} />}
            </div>

            {/* Stats */}
            <div style={styles.statsGrid}>
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  style={styles.statCard}
                  className={`animate-in animate-in-delay-${i + 1}`}
                >
                  <div style={{
                    ...styles.statIconWrap,
                    background: `${s.color}15`,
                    boxShadow: `0 0 20px ${s.glow}`,
                  }}>
                    <span style={{ ...styles.statIcon, color: s.color }}>{s.icon}</span>
                  </div>
                  <p style={{ ...styles.statVal, color: s.color }}>{s.value}</p>
                  <p style={styles.statLabel}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={styles.chartCard} className="animate-in animate-in-delay-3">
              <div style={styles.chartHeader}>
                <h2 style={styles.sectionTitle}>Latency</h2>
                <span style={styles.timeRange}>Last 24 hours</span>
              </div>
              <LatencyChart data={history} />
            </div>

            {/* Recent Checks */}
            <div style={styles.historyCard} className="animate-in animate-in-delay-4">
              <div style={styles.chartHeader}>
                <h2 style={styles.sectionTitle}>Recent Checks</h2>
                <span style={styles.timeRange}>{history.length} total</span>
              </div>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Time (IST)</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...history].reverse().slice(0, 20).map((p, i) => (
                      <tr
                        key={i}
                        style={{
                          ...styles.tr,
                          animation: `fadeIn 0.3s ease ${i * 0.03}s forwards`,
                          opacity: 0,
                        }}
                      >
                        <td style={styles.td}>{formatTime(p.checkedAt)}</td>
                        <td style={styles.td}><UptimeBadge status={p.status} /></td>
                        <td style={styles.tdLatency}>
                          {p.latencyMs >= 0 ? (
                            <>
                              <span style={styles.latencyBar}>
                                <span style={{
                                  ...styles.latencyFill,
                                  width: `${Math.min((p.latencyMs / 2000) * 100, 100)}%`,
                                }} />
                              </span>
                              <span>{p.latencyMs}ms</span>
                            </>
                          ) : '-'}
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

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1.5rem 3rem',
  },
  back: {
    background: 'none',
    border: 'none',
    color: '#c4b5d4',
    fontWeight: 500,
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    padding: '0.4rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'color 0.2s',
  },
  backArrow: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#ffffff',
    marginBottom: '0.35rem',
  },
  url: {
    color: '#8a7a9e',
    fontSize: '0.85rem',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    background: 'rgba(30, 15, 55, 0.55)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '1.5rem',
    borderRadius: '16px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  statIconWrap: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 0.75rem',
  },
  statIcon: {
    fontSize: '1rem',
    fontWeight: 700,
  },
  statVal: {
    fontSize: '2rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  statLabel: {
    color: '#8a7a9e',
    fontSize: '0.78rem',
    marginTop: '0.4rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontWeight: 500,
  },
  chartCard: {
    background: 'rgba(30, 15, 55, 0.55)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  timeRange: {
    fontSize: '0.78rem',
    color: '#8a7a9e',
    padding: '0.3rem 0.75rem',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  historyCard: {
    background: 'rgba(30, 15, 55, 0.55)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    color: '#8a7a9e',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background 0.2s',
  },
  td: {
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
    color: '#c4b5d4',
  },
  tdLatency: {
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
    color: '#c4b5d4',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  latencyBar: {
    width: '60px',
    height: '4px',
    borderRadius: '2px',
    background: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    display: 'inline-block',
  },
  latencyFill: {
    height: '100%',
    borderRadius: '2px',
    background: 'linear-gradient(90deg, #e8446d, #ff6b8a)',
    display: 'block',
    transition: 'width 0.5s ease',
  },
};
