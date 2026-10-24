import React from 'react';
import { Search, Compass } from 'lucide-react';
import { SystemHealth } from '../types';

interface TopBarProps {
  onOpenCommandPalette: () => void;
  onNavigateLanding: () => void;
  systemHealth: SystemHealth | null;
  activeProfileName: string;
  onOpenProfile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
  onNavigateLanding,
  systemHealth,
  activeProfileName,
  onOpenProfile
}) => {
  const isHealthy = systemHealth?.status === 'healthy';

  return (
    <header className="spatial-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="command-search-btn"
          onClick={onOpenCommandPalette}
          title="Global Search & Navigation (Ctrl+K)"
        >
          <Search size={16} color="#10B981" />
          <span>Search capabilities, foods, or recipes...</span>
          <kbd className="kbd-shortcut">Ctrl+K</kbd>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* System Health Liveness Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          padding: '0.45rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: isHealthy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
          border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.45)' : 'rgba(245, 158, 11, 0.45)'}`,
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          <span style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            backgroundColor: isHealthy ? '#10B981' : '#F59E0B',
            boxShadow: isHealthy ? '0 0 10px #10B981' : 'none',
            display: 'inline-block'
          }} />
          <span style={{ color: isHealthy ? '#34D399' : '#FBBF24' }}>
            {isHealthy ? 'AI ENGINE ONLINE' : 'CONNECTING...'}
          </span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ color: isHealthy ? '#10B981' : '#F59E0B' }}>v{systemHealth?.version || '1.0.0'}</span>
        </div>

        {/* View Landing Mode */}
        <button
          onClick={onNavigateLanding}
          className="btn-secondary"
          style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
        >
          <Compass size={16} color="#10B981" />
          <span>Landing Tour</span>
        </button>

        {/* User Badge */}
        <div
          onClick={onOpenProfile}
          style={{
            cursor: 'pointer',
            padding: '0.45rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-clay)',
            boxShadow: 'var(--clay-shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            transition: 'all 200ms ease'
          }}
          title="Switch User Profile"
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 6px #10B981'
          }} />
          <span>{activeProfileName}</span>
        </div>
      </div>
    </header>
  );
};
