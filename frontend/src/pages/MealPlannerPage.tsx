import React, { useState } from 'react';
import {
  CalendarCheck,
  ShoppingCart,
  Download,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { MealPlanResult } from '../types';

const ALLERGEN_OPTIONS = [
  "Peanuts", "Tree Nuts", "Dairy", "Gluten", "Shellfish", "Eggs", "Soy", "Fish", "Sesame"
];

const DIET_PATTERNS = [
  "Mediterranean", "Omnivore", "High-Protein", "Vegetarian", "Vegan", "Ketogenic", "Low-Carb"
];

export const MealPlannerPage: React.FC = () => {
  const [durationDays, setDurationDays] = useState(7);
  const [dietPattern, setDietPattern] = useState('Mediterranean');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(['Peanuts']);
  const [targetCalories, setTargetCalories] = useState(2100);
  const [includeSnacks, setIncludeSnacks] = useState(true);
  const [budgetTier] = useState('moderate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planResult, setPlanResult] = useState<MealPlanResult | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.generateMealPlan({
        duration_days: durationDays,
        diet_pattern: dietPattern,
        allergens_to_avoid: selectedAllergens,
        target_daily_calories: targetCalories,
        include_snacks: includeSnacks,
        budget_tier: budgetTier
      });
      setPlanResult(res);
      setActiveDayIndex(0);
    } catch (err: any) {
      setError(err.message || 'Failed to generate meal plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    if (!planResult) return;
    const blob = new Blob([JSON.stringify(planResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foodverse_meal_plan_${planResult.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #A855F7, #9333EA)', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)' }}>
            <CalendarCheck size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-purple" style={{ fontWeight: 700 }}>Personalized Macro Logistics</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automated Aisle-Sorted Grocery Compiler</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>Personalized Meal Planner & Grocery Logistics</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '780px' }}>
              Allergen-compliant nutritional schedule optimization and automated aisle-sorted grocery shopping compiler.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Preferences & Allergen Wizard */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Nutritional Constraints & Preferences</h3>
            <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>Constraint Engine</span>
          </div>

          {/* Duration Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Plan Horizon
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDurationDays(1)}
                className={durationDays === 1 ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, padding: '0.7rem', ...(durationDays === 1 ? { background: 'linear-gradient(135deg, #A855F7, #9333EA)', color: '#fff' } : {}) }}
              >
                1-Day Snapshot
              </button>
              <button
                type="button"
                onClick={() => setDurationDays(7)}
                className={durationDays === 7 ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, padding: '0.7rem', ...(durationDays === 7 ? { background: 'linear-gradient(135deg, #A855F7, #9333EA)', color: '#fff' } : {}) }}
              >
                7-Day Weekly Schedule
              </button>
            </div>
          </div>

          {/* Dietary Pattern */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Dietary Pattern
            </label>
            <select
              className="input-field"
              value={dietPattern}
              onChange={e => setDietPattern(e.target.value)}
            >
              {DIET_PATTERNS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Daily Calorie Target */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Target Daily Energy:</span>
              <span className="badge badge-purple" style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                {targetCalories} kcal / day
              </span>
            </div>
            <input
              type="range"
              min="1400"
              max="3500"
              step="50"
              value={targetCalories}
              onChange={e => setTargetCalories(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#A855F7', cursor: 'pointer' }}
            />
          </div>

          {/* Strict Allergen Exclusions Checklist */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={17} color="#FB7185" />
                <span>Strict Allergen Exclusions:</span>
              </label>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ALLERGEN_OPTIONS.map(allergen => {
                const isExcluded = selectedAllergens.includes(allergen);
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
                      border: `1px solid ${isExcluded ? '#F43F5E' : 'var(--border-clay)'}`,
                      background: isExcluded ? 'rgba(244, 63, 94, 0.2)' : 'var(--bg-surface-sunken)',
                      color: isExcluded ? '#FB7185' : 'var(--text-secondary)',
                      boxShadow: 'var(--clay-shadow-sm)',
                      transition: 'all 150ms ease'
                    }}
                  >
                    {isExcluded ? `✕ ${allergen}` : `+ ${allergen}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeSnacks}
                onChange={e => setIncludeSnacks(e.target.checked)}
                style={{ accentColor: '#A855F7', width: '16px', height: '16px' }}
              />
              <span>Include Afternoon Snacks</span>
            </label>
          </div>

          {error && (
            <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.45)', color: '#FB7185', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleGeneratePlan}
            disabled={loading}
            style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', background: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)', boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)' }}
          >
            {loading ? <span>Solving Nutritional Constraints...</span> : <span>Generate Personalized Plan</span>}
          </button>
        </div>

        {/* Right Column: Generated Plan View & Shopping List */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Personalized Meal Schedule</h3>
            {planResult && (
              <button
                onClick={handleExportJSON}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>
            )}
          </div>

          {!planResult ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="brand-icon-wrapper" style={{ width: '64px', height: '64px', background: 'var(--bg-surface-sunken)', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
                <CalendarCheck size={32} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>No meal plan generated yet</div>
              <p style={{ fontSize: '0.88rem', maxWidth: '340px', marginTop: '0.5rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Set your dietary goals and allergen exclusions on the left to compile a complete daily or weekly schedule.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Plan Metadata Banner */}
              <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>{planResult.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Allergen Guardrails Active: <strong>{planResult.allergens_excluded.length > 0 ? planResult.allergens_excluded.join(', ') : 'None specified'}</strong>
                    </div>
                  </div>
                  <span className="badge badge-purple" style={{ fontWeight: 700, fontSize: '0.82rem' }}>{planResult.duration_days} Days</span>
                </div>
              </div>

              {/* Day Switcher Tabs */}
              {planResult.days.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                  {planResult.days.map((day, idx) => (
                    <button
                      key={day.day_number}
                      onClick={() => setActiveDayIndex(idx)}
                      style={{
                        padding: '0.55rem 0.95rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        border: `1px solid ${activeDayIndex === idx ? '#A855F7' : 'var(--border-clay)'}`,
                        background: activeDayIndex === idx ? 'linear-gradient(135deg, #A855F7, #9333EA)' : 'var(--bg-surface-elevated)',
                        color: activeDayIndex === idx ? '#FFFFFF' : 'var(--text-secondary)',
                        boxShadow: activeDayIndex === idx ? '0 0 12px rgba(168, 85, 247, 0.35)' : 'var(--clay-shadow-sm)',
                        transition: 'all 150ms ease'
                      }}
                    >
                      Day {day.day_number} ({day.day_name.slice(0, 3)})
                    </button>
                  ))}
                </div>
              )}

              {/* Active Day Meals */}
              {planResult.days[activeDayIndex] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600, background: 'var(--bg-surface-sunken)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-clay)' }}>
                    <span>{planResult.days[activeDayIndex].day_name} Targets</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#C084FC' }}>
                      {planResult.days[activeDayIndex].estimated_calories} kcal | P: {planResult.days[activeDayIndex].total_protein_g}g | C: {planResult.days[activeDayIndex].total_carbs_g}g | F: {planResult.days[activeDayIndex].total_fat_g}g
                    </span>
                  </div>

                  {planResult.days[activeDayIndex].meals.map(meal => (
                    <div key={meal.id} style={{ background: 'var(--bg-surface-elevated)', padding: '1rem 1.15rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <div>
                          <span className="badge badge-purple" style={{ fontSize: '0.68rem', marginBottom: '0.25rem', fontWeight: 700 }}>{meal.meal_type}</span>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{meal.name}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 800, color: '#F59E0B', fontFamily: 'var(--font-mono)', fontSize: '1.05rem' }}>
                            {meal.calories} kcal
                          </span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{meal.prep_time_min} mins prep</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                        {meal.ingredients.join(', ')}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#34D399', background: 'rgba(16, 185, 129, 0.12)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                        "{meal.rationale}"
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Consolidated Grocery Shopping List */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <ShoppingCart size={20} color="#A855F7" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    Aisle-Categorized Grocery Shopping List
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {Object.entries(planResult.shopping_list).map(([aisle, items]) => (
                    <div key={aisle}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#C084FC', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                        {aisle}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {items.map((item, i) => (
                          <span key={i} className="badge badge-purple" style={{ fontSize: '0.75rem', textTransform: 'none', background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.45)' }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Notice */}
              <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-clay)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, boxShadow: 'var(--clay-shadow-card)' }}>
                {planResult.disclaimer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
