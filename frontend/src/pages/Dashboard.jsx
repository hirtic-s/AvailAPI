import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import AddEndpointModal from '../components/AddEndpointModal';
import { formatTime } from '../utils/time';

// ── helpers ──────────────────────────────────────────────────────────────────
function statusDotClass(s) {
  if (s === 'UP') return 'up';
  if (s === 'DOWN') return 'down';
  if (s === 'TIMEOUT') return 'timeout';
  return 'unknown';
}

function StatusPill({ status }) {
  const cfg = {
    UP:      { color: '#56d364', bg: 'rgba(46,160,67,0.15)', border: 'rgba(46,160,67,0.3)' },
    DOWN:    { color: '#f85149', bg: 'rgba(248,81,73,0.15)', border: 'rgba(248,81,73,0.3)' },
    TIMEOUT: { color: '#e3b341', bg: 'rgba(227,179,65,0.15)', border: 'rgba(227,179,65,0.3)' },
    UNKNOWN: { color: '#6e7681', bg: 'rgba(110,118,129,0.1)', border: 'rgba(110,118,129,0.25)' },
  };
  const c = cfg[status] || cfg.UNKNOWN;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '1px 7px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
      letterSpacing: '0.02em', color: c.color, background: c.bg, border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
      {status || 'UNKNOWN'}
    </span>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [endpoints, setEndpoints]     = useState([]);
  const [histories, setHistories]     = useState({}); // { [epId]: [...] }
  const [showModal, setShowModal]     = useState(false);
  const [selected, setSelected]       = useState(null); // highlighted endpoint
  const [filter, setFilter]           = useState('');
  const navigate = useNavigate();

  // fetch endpoints list
  const fetchEndpoints = async () => {
    const { data } = await api.get('/api/endpoints');
    setEndpoints(data);
    return data;
  };

  // fetch history for a single endpoint
  const fetchHistory = async (ep) => {
    try {
      const { data } = await api.get(`/api/endpoints/${ep.id}/history?hours=24`);
      setHistories(prev => ({ ...prev, [ep.id]: data }));
    } catch (_) {}
  };

  useEffect(() => {
    fetchEndpoints().then(data => {
      data.forEach(ep => fetchHistory(ep));
    });
  }, []);

  const deleteEndpoint = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this endpoint?')) return;
    await api.delete(`/api/endpoints/${id}`);
    setEndpoints(prev => prev.filter(ep => ep.id !== id));
    setHistories(prev => { const n = { ...prev }; delete n[id]; return n; });
    if (selected === id) setSelected(null);
  };

  // ── derived data ────────────────────────────────────────────────────────────

  // filtered endpoint list (left sidebar)
  const filteredEndpoints = useMemo(() =>
    endpoints.filter(ep =>
      !filter || ep.name?.toLowerCase().includes(filter.toLowerCase()) ||
      ep.url?.toLowerCase().includes(filter.toLowerCase())
    ), [endpoints, filter]);

  // merge all histories into a flat list sorted newest-first (center feed)
  const allChecks = useMemo(() => {
    const rows = [];
    Object.entries(histories).forEach(([epId, checks]) => {
      const ep = endpoints.find(e => e.id === epId);
      if (!ep) return;
      checks.forEach(c => rows.push({ ...c, epName: ep.name || ep.url, epId }));
    });
    return rows.sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt));
  }, [histories, endpoints]);

  // center — filtered by selected endpoint if one is clicked
  const visibleChecks = useMemo(() =>
    selected ? allChecks.filter(c => c.epId === selected) : allChecks,
    [allChecks, selected]);

  // right sidebar stats
  const globalUptime = useMemo(() => {
    if (!allChecks.length) return null;
    const up = allChecks.filter(c => c.status === 'UP').length;
    return ((up / allChecks.length) * 100).toFixed(1);
  }, [allChecks]);

  const recentErrors = useMemo(() =>
    allChecks.filter(c => c.status === 'DOWN' || c.status === 'TIMEOUT').slice(0, 6),
    [allChecks]);

  // latest status per endpoint (left sidebar dot)
  const latestStatus = (ep) => {
    const h = histories[ep.id];
    if (!h || !h.length) return 'UNKNOWN';
    return h[h.length - 1].status;
  };

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={s.layout}>
        {/* ── LEFT SIDEBAR ── */}
        <aside style={s.left}>
          <div style={s.sidebarHeader}>
            <span style={s.sidebarTitle}>Endpoints</span>
            <button className="gh-btn gh-btn-green" onClick={() => setShowModal(true)}>
              + New
            </button>
          </div>

          {/* filter */}
          <div style={{ padding: '8px 12px' }}>
            <input
              className="gh-input"
              placeholder="Filter…"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>

          <div style={s.epList}>
            {filteredEndpoints.length === 0 && (
              <div style={s.emptyState}>
                {endpoints.length === 0
                  ? 'No endpoints. Click + New to add one.'
                  : 'No matches.'}
              </div>
            )}
            {filteredEndpoints.map(ep => {
              const st = latestStatus(ep);
              const isActive = selected === ep.id;
              return (
                <div
                  key={ep.id}
                  style={{
                    ...s.epRow,
                    background: isActive ? '#21262d' : 'transparent',
                    borderLeft: isActive ? '3px solid #238636' : '3px solid transparent',
                  }}
                  onClick={() => setSelected(isActive ? null : ep.id)}
                >
                  <span className={`status-dot ${statusDotClass(st)}`} style={{ marginTop: 2 }} />
                  <div style={s.epRowInfo}>
                    <span style={s.epRowName}>{ep.name || ep.url}</span>
                    <span style={s.epRowMeta}>
                      every {ep.checkIntervalSeconds}s
                    </span>
                  </div>
                  <div style={s.epRowActions}>
                    <button style={s.tinyBtn} onClick={() => navigate(`/endpoints/${ep.id}`)}>
                      ↗
                    </button>
                    <button style={{ ...s.tinyBtn, color: '#f85149' }} onClick={(e) => deleteEndpoint(ep.id, e)}>
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── CENTER FEED ── */}
        <main style={s.center}>
          <div style={s.centerHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={s.feedTitle}>
                {selected
                  ? `${endpoints.find(e => e.id === selected)?.name || 'Endpoint'} — Health Checks`
                  : 'Recent Health Checks'}
              </span>
              {selected && (
                <button style={s.clearBtn} onClick={() => setSelected(null)}>
                  All endpoints ✕
                </button>
              )}
            </div>
            <span style={s.feedCount}>{visibleChecks.length} checks</span>
          </div>

          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.tableHead}>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Endpoint</th>
                  <th style={s.th}>Latency</th>
                  <th style={s.th}>Time</th>
                </tr>
              </thead>
              <tbody>
                {visibleChecks.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ ...s.td, textAlign: 'center', color: '#6e7681', padding: '32px' }}>
                      No health checks yet
                    </td>
                  </tr>
                )}
                {visibleChecks.slice(0, 100).map((c, i) => (
                  <tr key={i} style={s.tableRow}
                    onClick={() => navigate(`/endpoints/${c.epId}`)}
                  >
                    <td style={s.td}><StatusPill status={c.status} /></td>
                    <td style={{ ...s.td, color: '#e6edf3', fontWeight: 500 }}>
                      {c.epName}
                    </td>
                    <td style={{ ...s.td, fontFamily: 'monospace' }}>
                      {c.latencyMs >= 0
                        ? <span style={{ color: c.latencyMs > 1000 ? '#e3b341' : '#56d364' }}>{c.latencyMs}ms</span>
                        : <span style={{ color: '#6e7681' }}>—</span>}
                    </td>
                    <td style={{ ...s.td, color: '#8b949e' }}>
                      {formatTime(c.checkedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* ── RIGHT SIDEBAR ── */}
        <aside style={s.right}>
          <div style={s.rightSection}>
            <div style={s.rightTitle}>System Overview</div>

            {/* Global Uptime */}
            <div style={s.overviewCard}>
              <div style={s.overviewLabel}>Global Uptime (24h)</div>
              <div style={{
                ...s.overviewValue,
                color: globalUptime === null ? '#6e7681'
                  : parseFloat(globalUptime) >= 99 ? '#56d364'
                  : parseFloat(globalUptime) >= 95 ? '#e3b341' : '#f85149',
              }}>
                {globalUptime !== null ? `${globalUptime}%` : '—'}
              </div>
            </div>

            {/* Active endpoints */}
            <div style={s.overviewCard}>
              <div style={s.overviewLabel}>Active Endpoints</div>
              <div style={{ ...s.overviewValue, color: '#e6edf3' }}>{endpoints.length}</div>
            </div>

            {/* Uptime per endpoint */}
            {endpoints.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                {endpoints.map(ep => {
                  const h = histories[ep.id] || [];
                  const up = h.filter(c => c.status === 'UP').length;
                  const pct = h.length ? ((up / h.length) * 100).toFixed(0) : null;
                  const st  = latestStatus(ep);
                  return (
                    <div key={ep.id} style={s.epStatRow}>
                      <span className={`status-dot ${statusDotClass(st)}`} />
                      <span style={s.epStatName}>{ep.name || ep.url}</span>
                      <span style={{
                        ...s.epStatPct,
                        color: pct === null ? '#6e7681' : parseFloat(pct) >= 99 ? '#56d364' : parseFloat(pct) >= 90 ? '#e3b341' : '#f85149',
                      }}>
                        {pct !== null ? `${pct}%` : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Errors */}
          <div style={{ ...s.rightSection, marginTop: '1px' }}>
            <div style={s.rightTitle}>
              Recent Errors
              {recentErrors.length > 0 && (
                <span style={s.errorBadge}>{recentErrors.length}</span>
              )}
            </div>

            {recentErrors.length === 0 ? (
              <div style={s.noErrors}>
                <span style={{ color: '#56d364', fontSize: '12px' }}>● </span>
                <span style={{ color: '#8b949e', fontSize: '12px' }}>No recent errors</span>
              </div>
            ) : (
              recentErrors.map((c, i) => (
                <div key={i} style={s.errorRow} onClick={() => navigate(`/endpoints/${c.epId}`)}>
                  <StatusPill status={c.status} />
                  <div style={s.errorInfo}>
                    <span style={s.errorName}>{c.epName}</span>
                    <span style={s.errorTime}>{formatTime(c.checkedAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {showModal && (
        <AddEndpointModal
          onClose={() => setShowModal(false)}
          onAdded={(ep) => {
            setEndpoints(prev => [...prev, ep]);
            fetchHistory(ep);
          }}
        />
      )}
    </div>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────
const s = {
  layout: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr 280px',
    height: 'calc(100vh - 48px)',
    overflow: 'hidden',
  },

  // LEFT
  left: {
    background: '#161b22',
    borderRight: '1px solid #30363d',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 12px 8px',
    borderBottom: '1px solid #21262d',
  },
  sidebarTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  epList: { flex: 1, overflowY: 'auto', paddingTop: '4px' },
  emptyState: {
    padding: '16px 14px',
    fontSize: '12px',
    color: '#6e7681',
    lineHeight: 1.5,
  },
  epRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '7px 10px 7px 9px',
    cursor: 'pointer',
    transition: 'background 0.1s',
    borderLeft: '3px solid transparent',
  },
  epRowInfo: { flex: 1, minWidth: 0 },
  epRowName: {
    display: 'block',
    fontSize: '13px',
    color: '#e6edf3',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  epRowMeta: {
    display: 'block',
    fontSize: '11px',
    color: '#6e7681',
    marginTop: '1px',
  },
  epRowActions: {
    display: 'flex',
    gap: '2px',
    opacity: 0.6,
    flexShrink: 0,
  },
  tinyBtn: {
    background: 'none',
    border: 'none',
    color: '#8b949e',
    fontSize: '11px',
    padding: '2px 4px',
    borderRadius: '3px',
    cursor: 'pointer',
    lineHeight: 1,
  },

  // CENTER
  center: {
    background: '#0d1117',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    borderRight: '1px solid #30363d',
  },
  centerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px 10px',
    borderBottom: '1px solid #21262d',
    position: 'sticky',
    top: 0,
    background: '#0d1117',
    zIndex: 10,
  },
  feedTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#e6edf3',
  },
  feedCount: {
    fontSize: '11px',
    color: '#6e7681',
    background: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '20px',
    padding: '1px 8px',
  },
  clearBtn: {
    fontSize: '11px',
    color: '#8b949e',
    background: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '4px',
    padding: '2px 7px',
    cursor: 'pointer',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { borderBottom: '1px solid #21262d' },
  th: {
    padding: '8px 16px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#6e7681',
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
  },
  tableRow: {
    borderBottom: '1px solid #161b22',
    cursor: 'pointer',
    transition: 'background 0.1s',
  },
  td: {
    padding: '8px 16px',
    fontSize: '12px',
    color: '#8b949e',
    verticalAlign: 'middle',
  },

  // RIGHT
  right: {
    background: '#161b22',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  rightSection: {
    borderBottom: '1px solid #30363d',
    padding: '12px',
  },
  rightTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  errorBadge: {
    fontSize: '11px',
    background: 'rgba(248,81,73,0.15)',
    color: '#f85149',
    border: '1px solid rgba(248,81,73,0.3)',
    borderRadius: '20px',
    padding: '0 6px',
    fontWeight: 600,
  },
  overviewCard: {
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '6px',
    padding: '10px 12px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewLabel: { fontSize: '12px', color: '#8b949e' },
  overviewValue: { fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' },
  epStatRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '5px 0',
    borderBottom: '1px solid #21262d',
  },
  epStatName: {
    flex: 1,
    fontSize: '12px',
    color: '#c9d1d9',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  epStatPct: { fontSize: '12px', fontWeight: 600, flexShrink: 0 },
  noErrors: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 0',
  },
  errorRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '6px 0',
    borderBottom: '1px solid #21262d',
    cursor: 'pointer',
  },
  errorInfo: { flex: 1, minWidth: 0 },
  errorName: {
    display: 'block',
    fontSize: '12px',
    color: '#e6edf3',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  errorTime: { display: 'block', fontSize: '11px', color: '#6e7681', marginTop: '1px' },
};
