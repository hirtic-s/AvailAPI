import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import UptimeBadge from '../components/UptimeBadge';
import SSLBadge from '../components/SSLBadge';
import AddEndpointModal from '../components/AddEndpointModal';

export default function Dashboard() {
  const [endpoints, setEndpoints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchEndpoints = async () => {
    const { data } = await api.get('/api/endpoints');
    setEndpoints(data);
  };

  useEffect(() => { fetchEndpoints(); }, []);

  const deleteEndpoint = async (id) => {
    if (!window.confirm('Delete this endpoint?')) return;
    await api.delete(`/api/endpoints/${id}`);
    setEndpoints(endpoints.filter(e => e.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Your Endpoints</h1>
          <button style={styles.addBtn} onClick={() => setShowModal(true)}>+ Add Endpoint</button>
        </div>

        {endpoints.length === 0 ? (
          <div style={styles.empty}>
            <p>No endpoints yet. Add your first API to monitor.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {endpoints.map(ep => (
              <div key={ep.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <h3 style={styles.epName}>{ep.name || ep.url}</h3>
                    <p style={styles.epUrl}>{ep.url}</p>
                  </div>
                  <SSLBadge url={ep.url} />
                </div>
                <div style={styles.cardBottom}>
                  <span style={styles.interval}>⏱ every {ep.checkIntervalSeconds}s</span>
                  <div style={styles.actions}>
                    <button style={styles.detailBtn} onClick={() => navigate(`/endpoints/${ep.id}`)}>Details</button>
                    <button style={styles.deleteBtn} onClick={() => deleteEndpoint(ep.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddEndpointModal
          onClose={() => setShowModal(false)}
          onAdded={(ep) => setEndpoints([...endpoints, ep])}
        />
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: 700 },
  addBtn: { padding: '0.65rem 1.25rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' },
  card: { background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  epName: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' },
  epUrl: { fontSize: '0.8rem', color: '#6b7280', wordBreak: 'break-all' },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  interval: { fontSize: '0.8rem', color: '#9ca3af' },
  actions: { display: 'flex', gap: '0.5rem' },
  detailBtn: { padding: '0.4rem 0.8rem', background: '#ede9fe', color: '#4f46e5', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem' },
  deleteBtn: { padding: '0.4rem 0.8rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem' },
  empty: { textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px', color: '#9ca3af', fontSize: '1rem' },
};
