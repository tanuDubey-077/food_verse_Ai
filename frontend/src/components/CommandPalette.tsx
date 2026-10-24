import React, { useState, useEffect } from 'react';
import {
  Search,
  Scan,
  Sparkles,
  ShieldAlert,
  ChefHat,
  CalendarCheck,
  History,
  Settings,
  Info,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'food-recognition', label: 'Food Recognition & Nutrition Analysis', icon: Scan, category: 'AI Capability', iconBg: 'var(--color-recognition-pastel)', iconColor: '#10B981' },
    { id: 'freshness', label: 'Freshness & Spoilage Detection', icon: Sparkles, category: 'AI Capability', iconBg: 'var(--color-freshness-pastel)', iconColor: '#A3E635' },
    { id: 'hygiene', label: 'Restaurant Kitchen Hygiene & Safety Audit', icon: ShieldAlert, category: 'AI Capability', iconBg: 'var(--color-hygiene-pastel)', iconColor: '#06B6D4' },
    { id: 'cooking', label: 'Smart Cooking Assistant & Recipe Builder', icon: ChefHat, category: 'AI Capability', iconBg: 'var(--color-cooking-pastel)', iconColor: '#F59E0B' },
    { id: 'meal-planner', label: 'Personalized Meal Planner & Grocery Generator', icon: CalendarCheck, category: 'AI Capability', iconBg: 'var(--color-planner-pastel)', iconColor: '#A855F7' },
    { id: 'dashboard', label: 'Main AI Dashboard Workspace', icon: Sparkles, category: 'Navigation', iconBg: 'rgba(30, 41, 59, 0.6)', iconColor: '#94A3B8' },
    { id: 'history', label: 'Analysis History & Exportable Reports', icon: History, category: 'Navigation', iconBg: 'rgba(30, 41, 59, 0.6)', iconColor: '#94A3B8' },
    { id: 'settings', label: 'User Dietary Preferences & AI Providers', icon: Settings, category: 'Navigation', iconBg: 'rgba(30, 41, 59, 0.6)', iconColor: '#94A3B8' },
    { id: 'about', label: 'Methodology, Models & Limitations', icon: Info, category: 'Navigation', iconBg: 'rgba(30, 41, 59, 0.6)', iconColor: '#94A3B8' },
  ];

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (pageId: string) => {
    onNavigate(pageId);
    onClose();
  };

  return (
    <div className="command-palette-backdrop" onClick={onClose}>
      <div className="command-palette-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '1.15rem 1.4rem', borderBottom: '1px solid var(--border-clay)', gap: '0.85rem' }}>
          <Search size={22} color="#10B981" />
          <input
            type="text"
            placeholder="Search AI capability, food item, or navigation... (Esc to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              fontWeight: 500
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-clay)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: '390px', overflowY: 'auto', padding: '0.75rem' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
              No matching modules or actions found.
            </div>
          ) : (
            filtered.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 160ms ease',
                    marginBottom: '0.35rem'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      background: item.iconBg,
                      color: item.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.label}</span>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{item.category}</span>
                </div>
              );
            })
          )}
        </div>

        <div style={{ padding: '0.75rem 1.4rem', background: 'var(--bg-surface-sunken)', borderTop: '1px solid var(--border-clay)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          <span>Click to navigate</span>
          <span><kbd className="kbd-shortcut">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
};
