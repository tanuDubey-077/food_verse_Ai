import React from 'react';
import {
  Scan,
  Sparkles,
  ShieldAlert,
  ChefHat,
  CalendarCheck,
  LayoutDashboard,
  History,
  FileText,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface NavigationRailProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenProfile: () => void;
  activeProfileName: string;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  onOpenProfile,
  activeProfileName
}) => {
  const primaryLinks = [
    { id: 'food-recognition', label: 'Food Recognition', icon: Scan, activeBg: 'var(--color-recognition-pastel)', activeColor: '#10B981', activeBorder: 'var(--color-recognition-border)' },
    { id: 'freshness', label: 'Freshness Detection', icon: Sparkles, activeBg: 'var(--color-freshness-pastel)', activeColor: '#A3E635', activeBorder: 'var(--color-freshness-border)' },
    { id: 'hygiene', label: 'Restaurant Hygiene', icon: ShieldAlert, activeBg: 'var(--color-hygiene-pastel)', activeColor: '#06B6D4', activeBorder: 'var(--color-hygiene-border)' },
    { id: 'cooking', label: 'Cooking Assistant', icon: ChefHat, activeBg: 'var(--color-cooking-pastel)', activeColor: '#F59E0B', activeBorder: 'var(--color-cooking-border)' },
    { id: 'meal-planner', label: 'Meal Planner', icon: CalendarCheck, activeBg: 'var(--color-planner-pastel)', activeColor: '#A855F7', activeBorder: 'var(--color-planner-border)' },
  ];

  const secondaryLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'Project Information', icon: Info },
  ];

  return (
    <aside className={`spatial-nav-rail ${collapsed ? 'collapsed' : ''}`}>
      <div className="nav-header">
        <div className="brand-badge" onClick={() => onNavigate('dashboard')}>
          <div className="brand-icon-wrapper">
            <span style={{ fontSize: '1.4rem' }}>🥑</span>
          </div>
          {!collapsed && (
            <div>
              <div style={{ lineHeight: 1.15, fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                FoodVerse <span style={{ color: '#10B981' }}>AI</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
                FOOD INTELLIGENCE
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-clay)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
      </div>

      <div className="nav-links-container">
        {!collapsed && <div className="nav-section-title">Core AI Capabilities</div>}
        {primaryLinks.map(link => {
          const Icon = link.icon;
          const isActive = currentPage === link.id;
          return (
            <div
              key={link.id}
              className="nav-link-item"
              onClick={() => onNavigate(link.id)}
              title={collapsed ? link.label : undefined}
              style={isActive ? {
                background: link.activeBg,
                color: link.activeColor,
                borderColor: link.activeBorder,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
              } : undefined}
            >
              <Icon size={20} color={isActive ? link.activeColor : 'var(--text-dim)'} />
              {!collapsed && <span>{link.label}</span>}
            </div>
          );
        })}

        {!collapsed && <div className="nav-section-title" style={{ marginTop: '0.75rem' }}>Workspace</div>}
        {secondaryLinks.map(link => {
          const Icon = link.icon;
          const isActive = currentPage === link.id;
          return (
            <div
              key={link.id}
              className={`nav-link-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(link.id)}
              title={collapsed ? link.label : undefined}
            >
              <Icon size={19} color={isActive ? '#10B981' : 'var(--text-dim)'} />
              {!collapsed && <span>{link.label}</span>}
            </div>
          );
        })}
      </div>

      {/* User Session Footer */}
      <div style={{ padding: '0.85rem', borderTop: '1px solid var(--border-clay)' }}>
        <div
          onClick={onOpenProfile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-elevated)',
            cursor: 'pointer',
            border: '1px solid var(--border-clay)',
            boxShadow: 'var(--clay-shadow-sm)',
            transition: 'all 200ms ease'
          }}
          title="Switch User Profile"
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <UserCheck size={16} />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{activeProfileName}</div>
              <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>Active Session</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
