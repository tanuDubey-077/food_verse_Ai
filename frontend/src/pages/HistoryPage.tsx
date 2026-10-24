import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  Filter,
  Download,
  Trash2,
  Eye,
  X,
  FileText,
  Sparkles,
  Scan,
  ShieldAlert,
  ChefHat,
  CalendarCheck
} from 'lucide-react';
import { api } from '../services/api';
import { HistorySummaryItem } from '../types';

export const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<HistorySummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('all');
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);

  useEffect(() => {
    let active = true;
    api.getHistory(moduleFilter, 1, 50)
      .then(res => {
        if (active) {
          setItems(res.items || []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          console.error(err);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [moduleFilter]);

  const handleOpenDetail = async (id: string) => {
    try {
      const detail = await api.getHistoryDetail(id);
      setSelectedDetail(detail);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this analysis record?")) return;
    try {
      await api.deleteHistory(id);
      setItems(prev => prev.filter(i => i.id !== id));
      if (selectedDetail?.id === id) setSelectedDetail(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async () => {
    try {
      const data = await api.exportHistory(moduleFilter);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `foodverse_audit_export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'food_recognition': return <Scan size={16} color="#10B981" />;
      case 'freshness': return <Sparkles size={16} color="#A3E635" />;
      case 'hygiene': return <ShieldAlert size={16} color="#06B6D4" />;
      case 'cooking': return <ChefHat size={16} color="#F59E0B" />;
      case 'meal_planning': return <CalendarCheck size={16} color="#A855F7" />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}>
            <HistoryIcon size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>Analysis History & Saved Reports</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
              Persistent audit records across food recognition, freshness tests, kitchen hygiene audits, and meal schedules.
            </p>
          </div>
        </div>

        <button className="btn-secondary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 1.15rem' }}>
          <Download size={16} color="#10B981" />
          <span>Export All Records</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="#10B981" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Filter by Module:</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'food_recognition', 'freshness', 'hygiene', 'cooking', 'meal_planning'].map(mod => (
            <button
              key={mod}
              onClick={() => setModuleFilter(mod)}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: `1px solid ${moduleFilter === mod ? '#10B981' : 'var(--border-clay)'}`,
                background: moduleFilter === mod ? 'linear-gradient(135deg, #10B981, #059669)' : 'var(--bg-surface-elevated)',
                color: moduleFilter === mod ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: moduleFilter === mod ? '0 0 12px rgba(16, 185, 129, 0.3)' : 'var(--clay-shadow-sm)',
                transition: 'all 150ms ease'
              }}
            >
              {mod.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* History Items Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading history records...</div>
      ) : items.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="brand-icon-wrapper" style={{ width: '64px', height: '64px', background: 'var(--bg-surface-sunken)', color: 'var(--text-dim)', margin: '0 auto 1.25rem' }}>
            <HistoryIcon size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 0.4rem 0' }}>No persisted analyses found</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.5 }}>
            Run any food recognition, freshness, or hygiene audit to populate this history log.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {items.map(item => (
            <div
              key={item.id}
              className="glass-card"
              onClick={() => handleOpenDetail(item.id)}
              style={{
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-clay)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getModuleIcon(item.module_type)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem', fontWeight: 700 }}>{item.module_type}</span>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>{item.title}</h4>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.summary}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                  </div>
                  {item.confidence && (
                    <div style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700 }}>
                      Conf: {(item.confidence * 100).toFixed(0)}%
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '0.45rem 0.75rem' }}
                    onClick={(e) => { e.stopPropagation(); handleOpenDetail(item.id); }}
                    title="View JSON Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ padding: '0.45rem 0.75rem', borderColor: 'rgba(244, 63, 94, 0.45)', color: '#F43F5E' }}
                    onClick={(e) => handleDelete(item.id, e)}
                    title="Delete Record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="command-palette-backdrop" onClick={() => setSelectedDetail(null)}>
          <div className="command-palette-modal" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-clay)' }}>
              <div>
                <span className="badge badge-emerald" style={{ fontSize: '0.68rem', marginBottom: '0.25rem', fontWeight: 700 }}>
                  {selectedDetail.module_type}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>{selectedDetail.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', maxHeight: '450px', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Summary:</strong> {selectedDetail.summary}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Full JSON Result Payload:
              </div>
              <pre style={{
                background: '#070B14',
                padding: '1.15rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-clay)',
                fontSize: '0.8rem',
                color: '#34D399',
                overflowX: 'auto',
                boxShadow: 'var(--clay-shadow-card)'
              }}>
                {JSON.stringify(selectedDetail.results, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
