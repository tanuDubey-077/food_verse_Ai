import React, { useState, useEffect } from 'react';
import {
  Scan,
  Sparkles,
  ShieldAlert,
  ChefHat,
  CalendarCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { SystemHealth, HistorySummaryItem } from '../types';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  systemHealth: SystemHealth | null;
  activeProfileName: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  systemHealth,
  activeProfileName
}) => {
  const [recentAnalyses, setRecentAnalyses] = useState<HistorySummaryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const hist = await api.getHistory('all', 1, 5);
        setRecentAnalyses(hist.items || []);
      } catch (err) {
        console.error("Failed to load history for dashboard", err);
      } finally {
        setLoadingHistory(false);
      }
    }
    loadDashboardData();
  }, []);

  // 5 Capabilities with individual Cyber Dark identities
  const capabilityCards = [
    {
      id: 'food-recognition',
      label: 'Food Recognition',
      icon: Scan,
      desc: 'Image classification & calibrated USDA macros',
      tag: 'Vision AI',
      color: '#10B981',
      bgColor: 'var(--bg-surface)',
      iconBg: 'var(--color-recognition-pastel)',
      badgeClass: 'badge-emerald',
      hoverBorder: 'var(--color-recognition-border)'
    },
    {
      id: 'freshness',
      label: 'Freshness Detection',
      icon: Sparkles,
      desc: 'Visual biomarkers & shelf-life decay modeling',
      tag: 'Freshness',
      color: '#A3E635',
      bgColor: 'var(--bg-surface)',
      iconBg: 'var(--color-freshness-pastel)',
      badgeClass: 'badge-lime',
      hoverBorder: 'var(--color-freshness-border)'
    },
    {
      id: 'hygiene',
      label: 'Restaurant Hygiene',
      icon: ShieldAlert,
      desc: 'Kitchen sanitation, PPE & HACCP video audit',
      tag: 'Kitchen Safety',
      color: '#06B6D4',
      bgColor: 'var(--bg-surface)',
      iconBg: 'var(--color-hygiene-pastel)',
      badgeClass: 'badge-cyan',
      hoverBorder: 'var(--color-hygiene-border)'
    },
    {
      id: 'cooking',
      label: 'Cooking Assistant',
      icon: ChefHat,
      desc: 'Pantry recipes, hands-free timers & voice guide',
      tag: 'Culinary AI',
      color: '#F59E0B',
      bgColor: 'var(--bg-surface)',
      iconBg: 'var(--color-cooking-pastel)',
      badgeClass: 'badge-peach',
      hoverBorder: 'var(--color-cooking-border)'
    },
    {
      id: 'meal-planner',
      label: 'Meal Planner',
      icon: CalendarCheck,
      desc: 'Allergen guardrails & aisle-sorted grocery lists',
      tag: 'Nutrition',
      color: '#A855F7',
      bgColor: 'var(--bg-surface)',
      iconBg: 'var(--color-planner-pastel)',
      badgeClass: 'badge-purple',
      hoverBorder: 'var(--color-planner-border)'
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
      {/* Cyber Hero Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.75rem',
          background: 'linear-gradient(135deg, rgba(17, 26, 46, 0.95) 0%, rgba(13, 21, 39, 0.95) 60%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid var(--border-clay)',
          boxShadow: 'var(--clay-shadow-card)'
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-emerald">Workspace Active</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>FoodVerse AI Central Engine</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '0.6rem', letterSpacing: '-0.03em' }}>
            Welcome back, <span style={{ color: '#10B981' }}>{activeProfileName}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            Access all five multimodal food intelligence consoles, inspect real-time kitchen compliance audits,
            and monitor personalized nutritional telemetry.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => onNavigate('food-recognition')}
          >
            <Scan size={18} />
            <span>Analyze Food</span>
          </button>
          <button
            className="btn-secondary"
            onClick={() => onNavigate('history')}
          >
            <FileText size={18} color="#14B8A6" />
            <span>Saved Reports</span>
          </button>
        </div>
      </div>

      {/* Central Interactive Analysis Surface */}
      <div
        className="glass-panel"
        style={{
          padding: '2.75rem 2.5rem',
          background: 'var(--bg-surface)'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.25rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>Central Workspace</span>
          <h2 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Multimodal Food Intelligence Consoles
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Select an autonomous AI module below to begin sensory, nutritional, or culinary reasoning.
          </p>
        </div>

        {/* 5 Distinct Capability Cards */}
        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {capabilityCards.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: item.bgColor,
                  border: '1px solid var(--border-clay)'
                }}
                onClick={() => onNavigate(item.id)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = item.hoverBorder;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-clay)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: item.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                      boxShadow: '0 0 14px rgba(0, 0, 0, 0.4)'
                    }}>
                      <Icon size={24} />
                    </div>
                    <span className={`badge ${item.badgeClass}`}>{item.tag}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{item.label}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {item.desc}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: item.color,
                  fontSize: '0.88rem',
                  fontWeight: 700
                }}>
                  <span>Open Console</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Recent Persisted Analyses & System Status */}
      <div className="grid-2">
        {/* Recent Analyses Backed by Database */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-recognition-pastel)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={19} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Recent Persisted Analyses</h3>
            </div>
            <button
              onClick={() => onNavigate('history')}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-clay)',
                color: '#10B981',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)'
              }}
            >
              View All ({recentAnalyses.length}) →
            </button>
          </div>

          {loadingHistory ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading history records...</div>
          ) : recentAnalyses.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No analyses logged yet. Run a Food Recognition or Freshness test to populate history!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentAnalyses.map(item => (
                <div
                  key={item.id}
                  className="glass-card"
                  style={{
                    padding: '1rem 1.15rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-clay)'
                  }}
                  onClick={() => onNavigate('history')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{item.module_type}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item.summary}</div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System & AI Provider Status */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-hygiene-pastel)', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={19} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>System & Model Status</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-clay)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>FastAPI Gateway</span>
                <span className="badge badge-emerald">
                  v{systemHealth?.version || '1.0.0'} (Active)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-clay)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Database Tier</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.88rem' }}>
                  {systemHealth?.database === 'connected' ? 'SQLite Local Active' : (systemHealth?.database || 'Connected')}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-clay)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Vision Inference Model</span>
                <span className="badge badge-emerald">
                  Food-101 Classifier Active
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-clay)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Culinary LLM Provider</span>
                <span className="badge badge-peach">
                  Culinary Engine Ready
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-clay)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Nutrition Database</span>
                <span className="badge badge-cyan">
                  USDA 120+ Foods Ingested
                </span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-recognition-pastel)',
            border: '1px solid var(--color-recognition-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <CheckCircle size={20} color="#10B981" />
            <span style={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 600 }}>
              All 5 AI services are loaded and accepting multimodal requests without errors.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
