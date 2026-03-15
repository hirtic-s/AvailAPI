import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import SSLBadge from '../components/SSLBadge';
import AddEndpointModal from '../components/AddEndpointModal';

export default function Dashboard() {
  const [endpoints, setEndpoints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
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

  const getStatusDot = (ep) => {
    const isHttps = ep.url?.startsWith('https');
    return isHttps ? '#10b981' : '#f59e0b';
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header} className="animate-in">
          <div>
            <h1 style={styles.title}>Your Endpoints</h1>
            <p style={styles.subtitle}>Monitor and manage your API health checks</p>
          </div>
          <button
            style={styles.addBtn}
            onClick={() => setShowModal(true)}
          >
            <span style={styles.addIcon}>+</span>
            Add Endpoint
          </button>
        </div>

        {endpoints.length === 0 ? (
          <div style={styles.empty} className="animate-in animate-in-delay-1">
            <div style={styles.emptyIcon}>📡</div>
            <h3 style={styles.emptyTitle}>No endpoints yet</h3>
            <p style={styles.emptyText}>Add your first API endpoint to start monitoring its health and uptime.</p>
            <button style={styles.emptyBtn} onClick={() => setShowModal(true)}>
              <span style={styles.addIcon}>+</span> Add Your First Endpoint
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {endpoints.map((ep, i) => (
              <div
                key={ep.id}
                className={`animate-in animate-in-delay-${Math.min(i + 1, 4)}`}
                style={{
                  ...styles.card,
                  ...(hoveredCard === ep.id ? styles.cardHover : {}),
                  animationDelay: `${0.1 * (i + 1)}s`,
                }}
                onMouseEnter={() => setHoveredCard(ep.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Status indicator line */}
                <div style={{
                  ...styles.cardLine,
                  background: `linear-gradient(90deg, ${getStatusDot(ep)}, transparent)`,
                }} />

                <div style={styles.cardContent}>
                  <div style={styles.cardTop}>
                    <div style={{ flex: 1 }}>
                      <h3 style={styles.epName}>{ep.name || ep.url}</h3>
                      <p style={styles.epUrl}>{ep.url}</p>
                    </div>
                    <SSLBadge url={ep.url} />
                  </div>

                  <div style={styles.cardMeta}>
                    <div style={styles.metaItem}>
                      <span style={styles.metaIcon}>⏱</span>
                      <span style={styles.metaText}>every {ep.checkIntervalSeconds}s</span>
                    </div>
                  </div>

                  <div style={styles.cardBottom}>
                    <button
                      style={styles.detailBtn}
                      onClick={() => navigate(`/endpoints/${ep.id}`)}
                    >
                      View Details
                      <span style={styles.arrowIcon}>→</span>
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteEndpoint(ep.id)}
                    >
                      Delete
                    </button>
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
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem 1.5rem 3rem',
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
  },
  subtitle: {
    color: '#c4b5d4',
    fontSize: '0.9rem',
    marginTop: '0.35rem',
  },
  addBtn: {
    padding: '0.7rem 1.25rem',
    background: 'linear-gradient(135deg, #e8446d, #ff6b8a)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    boxShadow: '0 4px 20px rgba(232,68,109,0.25)',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  addIcon: {
    fontSize: '1.1rem',
    fontWeight: 300,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    background: 'rgba(30, 15, 55, 0.55)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  cardHover: {
    border: '1px solid rgba(232,68,109,0.25)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.3), 0 0 30px rgba(232,68,109,0.08)',
    transform: 'translateY(-2px)',
  },
  cardLine: {
    height: '2px',
    opacity: 0.6,
  },
  cardContent: {
    padding: '1.25rem 1.5rem',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
  },
  epName: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '0.3rem',
  },
  epUrl: {
    fontSize: '0.78rem',
    color: '#8a7a9e',
    wordBreak: 'break-all',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
  },
  cardMeta: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  metaIcon: {
    fontSize: '0.75rem',
  },
  metaText: {
    color: '#8a7a9e',
    fontSize: '0.78rem',
  },
  cardBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem',
  },
  detailBtn: {
    padding: '0.5rem 1rem',
    background: 'rgba(232, 68, 109, 0.1)',
    border: '1px solid rgba(232, 68, 109, 0.2)',
    color: '#ff6b8a',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '0.82rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'all 0.25s',
  },
  arrowIcon: {
    transition: 'transform 0.25s',
    display: 'inline-block',
  },
  deleteBtn: {
    padding: '0.5rem 0.9rem',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.12)',
    color: '#f87171',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '0.82rem',
    transition: 'all 0.25s',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'rgba(30, 15, 55, 0.45)',
    border: '1px dashed rgba(255,255,255,0.1)',
    borderRadius: '20px',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    animation: 'bounce-subtle 3s ease-in-out infinite',
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: '#8a7a9e',
    fontSize: '0.9rem',
    maxWidth: '320px',
    margin: '0 auto 1.5rem',
    lineHeight: 1.6,
  },
  emptyBtn: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #e8446d, #ff6b8a)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '0.9rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    boxShadow: '0 4px 20px rgba(232,68,109,0.3)',
  },
};
