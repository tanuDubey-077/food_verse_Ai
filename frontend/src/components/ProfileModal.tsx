import React from 'react';
import { UserCheck, X, Shield, Award, Sparkles, Heart } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: string;
  onSelectProfile: (name: string, diet: string, cals: number) => void;
}

const PRESET_PROFILES = [
  {
    name: "Dr. Elena Vance",
    role: "Academic AI Capstone Researcher",
    diet: "Omnivore",
    calories: 2200,
    icon: Award,
    iconBg: "var(--color-recognition-pastel)",
    iconColor: "#10B981",
    description: "Evaluating multimodal neural networks, confidence intervals, and HACCP compliance auditing."
  },
  {
    name: "Chef Marcus",
    role: "Executive Culinary Lead",
    diet: "Mediterranean",
    calories: 2500,
    icon: Sparkles,
    iconBg: "var(--color-cooking-pastel)",
    iconColor: "#F59E0B",
    description: "Pantry-to-plate speed cooking, sensory balancing, and culinary technique execution."
  },
  {
    name: "Sarah Jenkins, RD",
    role: "Clinical Dietetics Specialist",
    diet: "High-Protein",
    calories: 2000,
    icon: Heart,
    iconBg: "var(--color-planner-pastel)",
    iconColor: "#A855F7",
    description: "Focus on strict allergen exclusions, macronutrient ratios, and micronutrient densities."
  },
  {
    name: "Alex Chen",
    role: "Home Cook & Meal Prep Explorer",
    diet: "Vegetarian",
    calories: 1900,
    icon: Shield,
    iconBg: "var(--color-freshness-pastel)",
    iconColor: "#A3E635",
    description: "Reducing household food waste through spoilage detection and smart weekly grocery planning."
  }
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onSelectProfile
}) => {
  if (!isOpen) return null;

  return (
    <div className="command-palette-backdrop" onClick={onClose}>
      <div className="command-palette-modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.4rem 1.5rem', borderBottom: '1px solid var(--border-clay)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'var(--color-recognition-pastel)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)'
            }}>
              <UserCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>User Session & Persona</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Select an active persona to preview tailored intelligence profiles</p>
            </div>
          </div>
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
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          {PRESET_PROFILES.map(p => {
            const Icon = p.icon;
            const isSelected = activeProfile === p.name;
            return (
              <div
                key={p.name}
                onClick={() => {
                  onSelectProfile(p.name, p.diet, p.calories);
                  onClose();
                }}
                className="glass-card"
                style={{
                  padding: '1.15rem',
                  cursor: 'pointer',
                  borderColor: isSelected ? '#10B981' : 'var(--border-clay)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface)',
                  boxShadow: isSelected ? '0 0 16px rgba(16, 185, 129, 0.25)' : 'var(--clay-shadow-sm)',
                  transform: isSelected ? 'translateY(-2px)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: p.iconBg,
                      color: p.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{p.name}</span>
                  </div>
                  <span className="badge badge-emerald">{p.diet} • {p.calories} kcal</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600, marginBottom: '0.25rem' }}>{p.role}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
