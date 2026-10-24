import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Cpu,
  Save,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { SystemSettingsResponse, UserProfileSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileSettings>({
    username: 'Chef Guest',
    display_name: 'FoodVerse Explorer',
    dietary_pattern: 'Omnivore',
    allergens: ['Peanuts'],
    daily_calorie_target: 2000,
    macro_ratios: { protein: 25, carbs: 50, fat: 25 }
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettingsResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api.getSettings();
        setSystemSettings(res);
        if (res.profile) setProfile(res.profile);
      } catch (err) {
        console.error(err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const allergenPresets = ["Peanuts", "Tree Nuts", "Dairy", "Gluten", "Shellfish", "Eggs", "Soy", "Fish", "Sesame"];

  const toggleAllergen = (item: string) => {
    setProfile(prev => ({
      ...prev,
      allergens: prev.allergens.includes(item)
        ? prev.allergens.filter(a => a !== item)
        : [...prev.allergens, item]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}>
            <SettingsIcon size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>User Settings & AI System Configuration</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
              Configure dietary profiles, strict allergen safeguards, and review multimodal provider orchestrations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: User Dietary Preferences */}
        <form onSubmit={handleSave} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="brand-icon-wrapper" style={{ width: '38px', height: '38px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                <User size={18} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Personal Dietary Profile</h3>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>Preferences</span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Display Name
            </label>
            <input
              type="text"
              className="input-field"
              value={profile.display_name}
              onChange={e => setProfile({ ...profile, display_name: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Default Dietary Pattern
            </label>
            <select
              className="input-field"
              value={profile.dietary_pattern}
              onChange={e => setProfile({ ...profile, dietary_pattern: e.target.value })}
            >
              <option value="Omnivore">Omnivore (Standard Balanced)</option>
              <option value="Mediterranean">Mediterranean (Heart-Healthy / Unsaturated)</option>
              <option value="High-Protein">High-Protein (Hypertrophy / Athletic)</option>
              <option value="Vegetarian">Vegetarian (Lacto-Ovo)</option>
              <option value="Vegan">Vegan (100% Plant-Based)</option>
              <option value="Ketogenic">Ketogenic (Very Low-Carb / High-Fat)</option>
              <option value="Low-Carb">Low-Carb (Moderate Carbohydrates)</option>
            </select>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Daily Caloric Baseline:</span>
              <span className="badge badge-emerald" style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                {profile.daily_calorie_target} kcal
              </span>
            </div>
            <input
              type="range"
              min="1400"
              max="3500"
              step="50"
              value={profile.daily_calorie_target}
              onChange={e => setProfile({ ...profile, daily_calorie_target: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
            />
          </div>

          {/* Allergens Checklist */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Permanent Allergen Exclusions:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {allergenPresets.map(allergen => {
                const isChecked = profile.allergens.includes(allergen);
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergen(allergen)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: `1px solid ${isChecked ? '#F43F5E' : 'var(--border-clay)'}`,
                      background: isChecked ? 'rgba(244, 63, 94, 0.2)' : 'var(--bg-surface-sunken)',
                      color: isChecked ? '#FB7185' : 'var(--text-secondary)',
                      boxShadow: 'var(--clay-shadow-sm)',
                      transition: 'all 150ms ease'
                    }}
                  >
                    {isChecked ? `✕ ${allergen}` : `+ ${allergen}`}
                  </button>
                );
              })}
            </div>
          </div>

          {savedSuccess && (
            <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.45)', color: '#34D399', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} />
              <span>Preferences saved and persisted to database.</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.9rem' }}>
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </form>

        {/* Right Column: AI Providers & System Environment */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="brand-icon-wrapper" style={{ width: '38px', height: '38px', background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
                <Cpu size={18} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>AI Architecture & Providers</h3>
            </div>
            <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>Engine Telemetry</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '1.15rem 1.35rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(16, 185, 129, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
              <div style={{ fontSize: '0.75rem', color: '#34D399', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                Computer Vision Model Provider
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#10B981' }}>
                {systemSettings?.providers.vision || 'local'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                Google Gemini Vision inference with Food-101 taxonomy and macro calibration.
              </div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '1.15rem 1.35rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(245, 158, 11, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
              <div style={{ fontSize: '0.75rem', color: '#FBBF24', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                Culinary LLM Provider
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#F59E0B' }}>
                {systemSettings?.providers.llm || 'local'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                Intelligent local recipe synthesis with Google Gemini conversational culinary engine.
              </div>
            </div>

            <div style={{ background: 'rgba(6, 182, 212, 0.12)', padding: '1.15rem 1.35rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(6, 182, 212, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
              <div style={{ fontSize: '0.75rem', color: '#22D3EE', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                Nutrition Dataset Provider
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#06B6D4' }}>
                {systemSettings?.providers.nutrition || 'local'} (USDA FoodData Central)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                Bundled 120-item standard composition database with portion-scaling adapter.
              </div>
            </div>

            <div style={{ background: 'rgba(168, 85, 247, 0.12)', padding: '1.15rem 1.35rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(168, 85, 247, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
              <div style={{ fontSize: '0.75rem', color: '#C084FC', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                Security & Media Upload Limit
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#A855F7' }}>
                {systemSettings?.max_upload_size_mb || 50} MB Max Media Payload
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                Enforced server-side with MIME magic-byte screening and disk sanitization.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
