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

  if (error) return <div style={styles.center}><h2>{error}</h2></div>;
  if (!data) return <div style={styles.center}><p>Loading...</p></div>;

  const allUp = data.endpoints.every(e => e.status === 'UP');

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>{data.teamName}</h1>
          <div style={{ ...styles.overallBadge, background: allUp ? '#dcfce7' : '#fee2e2', color: allUp ? '#16a34a' : '#dc2626' }}>
            {allUp ? '✅ All Systems Operational' : '🔴 Degraded Performance'}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Services</h2>
          {data.endpoints.map(ep => (
            <div key={ep.id} style={styles.row}>
              <div>
                <span style={styles.epName}>{ep.name}</span>
                <SSLBadge url={ep.url} />
              </div>
              <div style={styles.epRight}>
                <span style={styles.uptime}>{ep.uptimePercent}% uptime</span>
                <span style={styles.latency}>{ep.avgLatencyMs}ms avg</span>
                <UptimeBadge status={ep.status} />
              </div>
            </div>
          ))}
        </div>

        {data.incidents?.filter(i => !i.resolvedAt).length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Active Incidents</h2>
            {data.incidents.filter(i => !i.resolvedAt).map(inc => (
              <div key={inc.id} style={styles.incident}>
                <span>🔴 Ongoing since {new Date(inc.startedAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        <p style={styles.footer}>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f5f7fa' },
  container: { maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' },
  header: { marginBottom: '2rem' },
  title: { fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' },
  overallBadge: { display: 'inline-block', padding: '0.6rem 1.25rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem' },
  section: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, color: '#374151', marginBottom: '1rem' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderTop: '1px solid #f3f4f6' },
  epName: { fontWeight: 600, marginRight: '0.75rem' },
  epRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  uptime: { fontSize: '0.8rem', color: '#6b7280' },
  latency: { fontSize: '0.8rem', color: '#6b7280' },
  incident: { padding: '0.75rem', background: '#fef2f2', borderRadius: '8px', color: '#dc2626' },
  footer: { color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
};
