import React from 'react';
import {
  Info,
  ShieldAlert,
  Cpu,
  Database
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}>
            <Info size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>About FoodVerse AI & Engineering Methodology</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
              Academic capstone project specification, multimodal AI system design, dataset provenance, and ethical safety boundaries.
            </p>
          </div>
        </div>
      </div>

      {/* Abstract & Research Context */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
          Research Motivation & System Abstract
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1rem' }}>
          In modern culinary environments, commercial restaurants, and household meal management, decision-making is heavily fragmented.
          Nutritional tracking depends on manual calorie logging; food freshness is judged purely through subjective visual inspection
          without calibrated shelf-life estimation; restaurant kitchen hygiene relies on periodic, infrequent physical audits;
          and cooking tools are typically restricted to static text recipes without interactive voice or substitution intelligence.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
          <strong style={{ color: 'var(--text-primary)' }}>FoodVerse AI</strong> addresses these systemic challenges through a unified multimodal food intelligence architecture.
          By combining computer vision, video temporal frame extraction, structured USDA composition datasets, and culinary natural language
          reasoning into a high-performance Cyber-Dark user interface, FoodVerse AI demonstrates the practical power of AI in kitchen workflows,
          spoilage mitigation, operational safety, and personalized dietetics.
        </p>
      </div>

      {/* Technology Stack & Datasets */}
      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div className="brand-icon-wrapper" style={{ width: '38px', height: '38px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <Database size={18} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Curated Datasets & Provenance</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.15rem', fontSize: '0.9rem', color: 'var(--text-secondary)', padding: 0, margin: 0 }}>
            <li style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-clay)' }}>
              <strong style={{ color: '#10B981', fontSize: '0.95rem' }}>Food-101 Benchmark Dataset:</strong>
              <div style={{ marginTop: '0.35rem', lineHeight: 1.5 }}>
                101 food classes covering 101,000 real-world food photographs used to train and calibrate classification heuristics.
              </div>
            </li>
            <li style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-clay)' }}>
              <strong style={{ color: '#06B6D4', fontSize: '0.95rem' }}>USDA FoodData Central (FDC):</strong>
              <div style={{ marginTop: '0.35rem', lineHeight: 1.5 }}>
                Standard Reference Legacy and Foundation Foods composition dataset providing baseline macronutrients and micronutrients per 100g.
              </div>
            </li>
            <li style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-clay)' }}>
              <strong style={{ color: '#F59E0B', fontSize: '0.95rem' }}>HACCP & FDA Food Code:</strong>
              <div style={{ marginTop: '0.35rem', lineHeight: 1.5 }}>
                Kitchen sanitation classification rules modeling cross-contamination boundaries, single-use glove adherence, and cold-chain storage.
              </div>
            </li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div className="brand-icon-wrapper" style={{ width: '38px', height: '38px', background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
              <Cpu size={18} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Production Technology Stack</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-clay)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Frontend Framework</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>React 19 + TypeScript + Vite</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-clay)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>UI & Design System</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Cyber-Dark Glass & Neon Tokens</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-clay)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Backend Engine</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>FastAPI (Python 3.14) + Pydantic v2</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-clay)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Persistence Tier</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>SQLAlchemy 2.0 (SQLite / Postgres)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-clay)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Audio & Speech I/O</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Web Speech API (STT & TTS)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-clay)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Quality Assurance</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>pytest automated test suite (33/33 passed)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ethical AI & Scientific Limitations */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div className="brand-icon-wrapper" style={{ width: '38px', height: '38px', background: 'rgba(244, 63, 94, 0.15)', color: '#F43F5E' }}>
            <ShieldAlert size={18} />
          </div>
          <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-primary)' }}>
            Scientific Limitations & Ethical Boundaries
          </h3>
        </div>

        <div className="grid-2" style={{ gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(244, 63, 94, 0.12)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(244, 63, 94, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: '#FB7185', fontWeight: 700 }}>
              1. Volume vs. Mass Uncertainty
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              2D computer vision images estimate food volume based on surface geometry and container perspective,
              not physical mass. Real caloric and macronutrient values vary with moisture content, oil immersion,
              and internal density.
            </p>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.12)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(244, 63, 94, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: '#FB7185', fontWeight: 700 }}>
              2. Microbiological Spoilage Boundaries
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Visual analysis detects surface mycelium, cellular weeping, and discoloration. It cannot detect
              tasteless, odorless, invisible bacterial pathogens (e.g. <em>Salmonella</em>, <em>Listeria</em>,
              <em>E. coli</em>, or <em>Botulinum</em>). Food that looks intact may still harbor microbial toxins.
            </p>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.12)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(244, 63, 94, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: '#FB7185', fontWeight: 700 }}>
              3. Non-Regulatory Hygiene Auditing
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Computer vision hygiene scoring serves solely as an assistive training and internal quality benchmark.
              It does not substitute for statutory public health inspections or certified HACCP health department audits.
            </p>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.12)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(244, 63, 94, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: '#FB7185', fontWeight: 700 }}>
              4. Lifestyle Planning vs. Medical Nutrition
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Meal plans provide general wellness and culinary guidance. They do not constitute clinical Medical
              Nutrition Therapy (MNT). Individuals with severe anaphylactic allergies or chronic metabolic diseases
              must verify commercial packaging labels and consult licensed physicians.
            </p>
          </div>
        </div>
      </div>

      {/* Project Leadership & Provenance */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
              Project Engineering & Maintenance
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Lead Engineer: <strong style={{ color: '#10B981' }}>Tanu Dubey</strong> (@tanuDubey-077) &middot; Repository: <a href="https://github.com/tanuDubey-077/food_verse_Ai" target="_blank" rel="noopener noreferrer" style={{ color: '#06B6D4', textDecoration: 'none' }}>food_verse_Ai</a>
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-surface-elevated)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-clay)' }}>
            Cyber-Dark AI Edition &middot; v1.0.0
          </span>
        </div>
      </div>
    </div>
  );
};
