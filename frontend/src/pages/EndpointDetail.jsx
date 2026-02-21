import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import UptimeBadge from '../components/UptimeBadge';
import LatencyChart from '../components/LatencyChart';

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
  const avgLatency = history.filter(p => p.latencyMs >= 0).reduce((a, b) => a + b.latencyMs, 0) / (history.filter(p => p.latencyMs >= 0).length || 1);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Navbar />
      <div style={styles.container}>
        <button style={styles.back} onClick={() => navigate('/dashboard')}>← Back</button>
        {endpoint && (
          <>
            <div style={styles.header}>
              <div>
                <h1 style={styles.title}>{endpoint.name || endpoint.url}</h1>
                <p style={styles.url}>{endpoint.url}</p>
              </div>
              {latest && <UptimeBadge status={latest.status} />}
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.stat}><p style={styles.statVal}>{uptime}%</p><p style={styles.statLabel}>24h Uptime</p></div>
              <div style={styles.stat}><p style={styles.statVal}>{Math.round(avgLatency)}ms</p><p style={styles.statLabel}>Avg Latency</p></div>
              <div style={styles.stat}><p style={styles.statVal}>{history.length}</p><p style={styles.statLabel}>Checks (24h)</p></div>
            </div>

            <div style={styles.chartCard}>
              <h2 style={styles.chartTitle}>Latency (last 24h)</h2>
              <LatencyChart data={history} />
            </div>

            <div style={styles.historyCard}>
              <h2 style={styles.chartTitle}>Recent Checks</h2>
              <table style={styles.table}>
                <thead><tr style={styles.th}><th>Time</th><th>Status</th><th>Latency</th></tr></thead>
                <tbody>
                  {[...history].reverse().slice(0, 20).map((p, i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>{new Date(p.checkedAt).toLocaleString()}</td>
                      <td style={styles.td}><UptimeBadge status={p.status} /></td>
                      <td style={styles.td}>{p.latencyMs >= 0 ? `${p.latencyMs}ms` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem' },
  back: { background: 'none', border: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1.25rem', padding: 0 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  url: { color: '#6b7280', fontSize: '0.875rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  stat: { background: '#fff', padding: '1.25rem', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  statVal: { fontSize: '1.75rem', fontWeight: 700, color: '#4f46e5' },
  statLabel: { color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.25rem' },
  chartCard: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  historyCard: { background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  chartTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#f9fafb', color: '#6b7280', fontSize: '0.8rem', textAlign: 'left', padding: '0.75rem' },
  tr: { borderTop: '1px solid #f3f4f6' },
  td: { padding: '0.75rem', fontSize: '0.875rem' },
};
