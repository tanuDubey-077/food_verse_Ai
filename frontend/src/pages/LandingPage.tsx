import React from 'react';
import {
  Scan,
  Sparkles,
  ShieldAlert,
  ChefHat,
  CalendarCheck,
  ArrowRight,
  Cpu,
  Database,
  Layers,
  CheckCircle2,
  Lock,
  Activity
} from 'lucide-react';

interface LandingPageProps {
  onEnterWorkspace: (page?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterWorkspace }) => {
  const capabilities = [
    {
      id: 'food-recognition',
      title: 'Food Recognition & Nutrition',
      subtitle: 'Computer Vision & USDA Composition',
      icon: Scan,
      iconBg: 'linear-gradient(135deg, #10B981, #059669)',
      badgeClass: 'badge-emerald',
      actionColor: '#10B981',
      description: 'Upload meal imagery or query food items to instantly classify food types, compute calibrated macronutrient distributions, and examine micronutrients with transparent uncertainty bounds.'
    },
    {
      id: 'freshness',
      title: 'Freshness & Spoilage Detection',
      subtitle: 'Surface Biomarker & Degradation Modeling',
      icon: Sparkles,
      iconBg: 'linear-gradient(135deg, #A3E635, #65A30D)',
      badgeClass: 'badge-lime',
      actionColor: '#A3E635',
      description: 'Identify visual fungal mycelium, enzymatic browning, cuticular dehydration, and structural breakdown combined with shelf-life storage context to prevent food waste and maintain safe kitchen practices.'
    },
    {
      id: 'hygiene',
      title: 'Restaurant Hygiene Monitoring',
      subtitle: 'Video & Image Computer Vision Auditing',
      icon: ShieldAlert,
      iconBg: 'linear-gradient(135deg, #06B6D4, #0891B2)',
      badgeClass: 'badge-cyan',
      actionColor: '#06B6D4',
      description: 'Review kitchen video and photo streams to audit glove compliance, hair restraint adherence, cross-contamination vectors, and stainless prep sanitization with timestamped evidence logs.'
    },
    {
      id: 'cooking',
      title: 'Smart Cooking Assistance',
      subtitle: 'Conversational Culinary Reasoning',
      icon: ChefHat,
      iconBg: 'linear-gradient(135deg, #F59E0B, #D97706)',
      badgeClass: 'badge-peach',
      actionColor: '#F59E0B',
      description: 'Turn available refrigerator ingredients into gourmet structured recipes with step-by-step interactive cooking timers, chef tips, hands-free voice synthesis, and dynamic ingredient substitutions.'
    },
    {
      id: 'meal-planner',
      title: 'Personalized Meal Planner',
      subtitle: 'Constraint Solver & Allergen Guardrails',
      icon: CalendarCheck,
      iconBg: 'linear-gradient(135deg, #A855F7, #9333EA)',
      badgeClass: 'badge-purple',
      actionColor: '#A855F7',
      description: 'Generate comprehensive 1-day or 7-day nutritional plans adhering strictly to dietary patterns and allergen exclusions, complete with consolidated grocery lists organized by supermarket aisle.'
    }
  ];

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem 3rem', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="badge badge-emerald" style={{ fontWeight: 700 }}>
            <Activity size={14} />
            Academic Capstone & Production AI Platform
          </span>
          <span className="badge badge-cyan" style={{ fontWeight: 700 }}>Python 3.14 • React 19 • Cyber-Dark AI Edition</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          FoodVerse <span style={{ background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #A855F7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          <br />
          <span style={{ fontSize: 'clamp(1.4rem, 3vw, 2.3rem)', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Multimodal Food Intelligence Agent
          </span>
        </h1>

        <p style={{ maxWidth: '780px', margin: '0 auto 2.5rem', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          A unified, multimodal food intelligence platform synthesizing computer vision, video temporal auditing,
          scientific USDA nutrition databases, and large language model culinary reasoning to deliver actionable,
          transparent food decisions across households, restaurants, and clinical dietetics.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            style={{ padding: '0.95rem 2.25rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => onEnterWorkspace('dashboard')}
          >
            <span>Launch Intelligence Workspace</span>
            <ArrowRight size={18} />
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '0.95rem 2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => onEnterWorkspace('about')}
          >
            <Layers size={18} color="#10B981" />
            <span>Architecture & Methodology</span>
          </button>
        </div>
      </section>

      {/* 5 Core Capabilities Cards */}
      <section style={{ marginTop: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.1rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Five Specialized Multimodal Pillars</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>Each domain operates as an autonomous, modular service with transparent confidence modeling.</p>
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {capabilities.map(cap => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.id}
                className="glass-card"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem', transition: 'all 0.25s ease' }}
                onClick={() => onEnterWorkspace(cap.id)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div className="brand-icon-wrapper" style={{ background: cap.iconBg, color: '#FFFFFF', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
                      <Icon size={24} />
                    </div>
                    <span className={`badge ${cap.badgeClass}`} style={{ fontSize: '0.72rem', fontWeight: 700 }}>Explore</span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>{cap.title}</h3>
                  <div style={{ fontSize: '0.82rem', color: cap.actionColor, fontWeight: 700, marginBottom: '0.85rem' }}>
                    {cap.subtitle}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {cap.description}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: cap.actionColor, fontSize: '0.88rem', fontWeight: 700 }}>
                  <span>Open Console</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* System Architecture Highlights */}
      <section className="glass-panel" style={{ marginTop: '4.5rem', padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
          <h2 style={{ fontSize: '1.9rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Decoupled Multimodal Architecture</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>Engineered according to rigorous software engineering and AI safety standards.</p>
        </div>

        <div className="grid-3" style={{ gap: '1.75rem' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="brand-icon-wrapper" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}>
                <Cpu size={20} />
              </div>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>Modular FastAPI Backend</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>Pydantic v2 strict serialization</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>Provider-agnostic AI adapters</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>Secure file upload screening</span>
              </li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="brand-icon-wrapper" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #06B6D4, #0891B2)', color: '#fff' }}>
                <Database size={20} />
              </div>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>Zero-Config Persistence</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#06B6D4" />
                <span>SQLAlchemy 2.0 ORM schema</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#06B6D4" />
                <span>SQLite development & Postgres production</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#06B6D4" />
                <span>Full audit trails & JSON report exports</span>
              </li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="brand-icon-wrapper" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}>
                <Lock size={20} />
              </div>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>Scientific AI Guardrails</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#F59E0B" />
                <span>Volume-vs-mass uncertainty disclosures</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#F59E0B" />
                <span>Microbiological safety disclaimers</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#F59E0B" />
                <span>Strict allergen elimination solver</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
