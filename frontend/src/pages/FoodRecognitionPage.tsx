import React, { useState } from 'react';
import {
  Scan,
  UploadCloud,
  Search,
  AlertCircle,
  HelpCircle,
  Sparkles,
  PieChart
} from 'lucide-react';
import { api } from '../services/api';
import { FoodRecognitionResult } from '../types';

export const FoodRecognitionPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textQuery, setTextQuery] = useState('');
  const [portionGrams, setPortionGrams] = useState(150);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FoodRecognitionResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !textQuery.trim()) {
      setError('Please provide a food image or type a dish description.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.recognizeFood(
        selectedFile || undefined,
        textQuery.trim() || undefined,
        portionGrams
      );
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to process food recognition request.');
    } finally {
      setLoading(false);
    }
  };

  const handlePortionChange = async (grams: number) => {
    setPortionGrams(grams);
    if (result) {
      try {
        const nut = await api.getNutrition(result.top_prediction.name, grams);
        setResult(prev => prev ? {
          ...prev,
          portion: nut.portion,
          nutrition: nut.nutrition,
          micronutrients: nut.micronutrients
        } : null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}>
            <Scan size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-emerald" style={{ fontWeight: 700 }}>Google Gemini 2.5 Multimodal AI</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>USDA FoodData Central Grounded</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>Food Recognition & Nutrition Analysis</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '780px' }}>
              Multimodal optical food understanding powered by Google Gemini AI. Identifies prepared dishes, detects plate components, calculates calibrated macros, and flags non-food uploads.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Input Panel */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Input Meal Information</span>
            </h3>
            <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>Interactive Ingest</span>
          </div>

          {/* Drag & Drop Area */}
          <div
            className="spatial-dropzone"
            onClick={() => document.getElementById('food-file-input')?.click()}
          >
            <input
              id="food-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={previewUrl}
                  alt="Food Preview"
                  style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', boxShadow: 'var(--clay-shadow-card)' }}
                />
                <span style={{ fontSize: '0.88rem', color: '#10B981', fontWeight: 600 }}>
                  Click to replace: {selectedFile?.name}
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div className="brand-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', margin: '0 auto' }}>
                  <UploadCloud size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Drag food photo here or click to upload</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Supports JPEG, PNG, WebP (Max 50MB)</div>
              </div>
            )}
          </div>

          {/* Quick manual entry selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Or enter dish name manually:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Avocado Toast, Grilled Salmon, Caesar Salad..."
                value={textQuery}
                onChange={e => setTextQuery(e.target.value)}
              />
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '14px', top: '14px' }} />
            </div>
          </div>

          {/* Portion Size Slider */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Portion Size:</span>
              <span className="badge badge-emerald" style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                {portionGrams} grams
              </span>
            </div>
            <input
              type="range"
              min="25"
              max="500"
              step="25"
              value={portionGrams}
              onChange={e => handlePortionChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontWeight: 500 }}>
              <span>Small (50g)</span>
              <span>Standard (150g)</span>
              <span>Large (300g)</span>
              <span>Feast (500g)</span>
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.45)', color: '#FB7185', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? <span>Inferring Multimodal Model...</span> : (
              <>
                <Sparkles size={18} />
                <span>Run Nutritional Recognition</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Results & Interactive Nutrition Panel */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
              Nutritional Analysis Output
            </h3>
            {result && <span className="badge badge-emerald" style={{ fontWeight: 700 }}>Verified Ingest</span>}
          </div>

          {!result ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="brand-icon-wrapper" style={{ width: '64px', height: '64px', background: 'var(--bg-surface-sunken)', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
                <PieChart size={32} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>No analysis performed yet</div>
              <p style={{ fontSize: '0.88rem', maxWidth: '340px', marginTop: '0.5rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Upload a food image or search a dish to inspect recognized items, top candidates, and complete macronutrient assays.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Check for Non-Food Object Upload */}
              {result.is_food === false ? (
                <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.45)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <AlertCircle size={26} color="#F43F5E" />
                    <div>
                      <span className="badge badge-rose" style={{ fontWeight: 700, fontSize: '0.75rem' }}>Non-Food Object Detected</span>
                      <h3 style={{ fontSize: '1.35rem', color: '#FB7185', margin: '0.2rem 0' }}>
                        {result.dish_name || 'Non-Food Object'}
                      </h3>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                    {result.explanation || 'Visual analysis indicates this image depicts a non-edible object rather than a food dish or beverage.'}
                  </p>
                  {result.visual_attributes && result.visual_attributes.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                      {result.visual_attributes.map((attr, i) => (
                        <span key={i} style={{ background: 'rgba(244, 63, 94, 0.2)', border: '1px solid rgba(244, 63, 94, 0.35)', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.5rem', fontSize: '0.78rem', color: '#FB7185' }}>
                          {attr}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: '0.85rem', color: '#FB7185', background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(244, 63, 94, 0.45)' }}>
                    💡 <strong>Tip:</strong> FoodVerse AI requires an edible food dish, meal plate, or beverage. Please upload a clear photo of food.
                  </div>
                </div>
              ) : (
                <>
                  {/* Top Prediction Card */}
                  <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                          <span className="badge badge-emerald" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                            {result.food_category || result.top_prediction.category}
                          </span>
                          {result.cuisine && (
                            <span className="badge badge-cyan" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                              {result.cuisine} Cuisine
                            </span>
                          )}
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {result.data_source}
                          </span>
                        </div>
                        <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                          {result.dish_name || result.top_prediction.name}
                        </h2>
                      </div>
                      <div style={{ textAlign: 'right', background: 'var(--bg-surface-sunken)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-clay)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Confidence</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                          {(result.top_prediction.confidence * 100).toFixed(0)}%
                        </div>
                        {result.confidence_description && (
                          <div style={{ fontSize: '0.68rem', color: '#34D399', fontWeight: 500 }}>
                            {result.confidence_description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {result.portion.description}
                    </div>
                    {result.explanation && (
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.45, fontStyle: 'italic' }}>
                        "{result.explanation}"
                      </div>
                    )}
                  </div>

                  {/* Components and Ingredients Breakdown */}
                  {((result.visible_ingredients && result.visible_ingredients.length > 0) || (result.possible_hidden_ingredients && result.possible_hidden_ingredients.length > 0)) && (
                    <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                        Dish Components & Ingredients Breakdown
                      </div>
                      {result.visible_ingredients && result.visible_ingredients.length > 0 && (
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Visible Components:</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {result.visible_ingredients.map((ing, i) => (
                              <span key={i} className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.possible_hidden_ingredients && result.possible_hidden_ingredients.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Possible Hidden / Preparation Elements:</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {result.possible_hidden_ingredients.map((ing, i) => (
                              <span key={i} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Energy & Macros Display */}
                  <div className="grid-4" style={{ gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '1rem 0.75rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(245, 158, 11, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#FBBF24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Calories</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'var(--font-mono)', margin: '0.15rem 0' }}>
                        {result.nutrition.calories}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>kcal</div>
                    </div>

                    <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '1rem 0.75rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(16, 185, 129, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Protein</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)', margin: '0.15rem 0' }}>
                        {result.nutrition.protein_g}g
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>4 kcal/g</div>
                    </div>

                    <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '1rem 0.75rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(6, 182, 212, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#22D3EE', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Carbs</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#06B6D4', fontFamily: 'var(--font-mono)', margin: '0.15rem 0' }}>
                        {result.nutrition.carbs_g}g
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Fiber: {result.nutrition.fiber_g}g</div>
                    </div>

                    <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '1rem 0.75rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(244, 63, 94, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#FB7185', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Fat</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F43F5E', fontFamily: 'var(--font-mono)', margin: '0.15rem 0' }}>
                        {result.nutrition.fat_g}g
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>9 kcal/g</div>
                    </div>
                  </div>

                  {/* Top Candidate Predictions */}
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                      Identified Plate Components & Candidates
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {result.recognized_items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', background: idx === 0 ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface-sunken)', border: idx === 0 ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-clay)' }}>
                          <span style={{ fontWeight: idx === 0 ? 700 : 500, color: idx === 0 ? '#34D399' : 'var(--text-secondary)' }}>
                            {idx + 1}. {item.name} ({item.category})
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: idx === 0 ? '#10B981' : 'var(--text-muted)' }}>
                            {(item.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Micronutrients breakdown */}
                  {result.micronutrients && (
                    <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                        Key Micronutrients (per {portionGrams}g)
                      </div>
                      <div className="grid-3" style={{ gap: '0.65rem', fontSize: '0.82rem' }}>
                        <div style={{ background: 'var(--bg-surface-sunken)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-clay)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Potassium:</span> <strong style={{ color: 'var(--text-primary)' }}>{result.micronutrients.potassium_mg || 0} mg</strong>
                        </div>
                        <div style={{ background: 'var(--bg-surface-sunken)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-clay)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Calcium:</span> <strong style={{ color: 'var(--text-primary)' }}>{result.micronutrients.calcium_mg || 0} mg</strong>
                        </div>
                        <div style={{ background: 'var(--bg-surface-sunken)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-clay)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Iron:</span> <strong style={{ color: 'var(--text-primary)' }}>{result.micronutrients.iron_mg || 0} mg</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Uncertainty & Nutrition Source Disclosure */}
                  <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-lg)', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', display: 'flex', gap: '0.75rem', boxShadow: 'var(--clay-shadow-card)' }}>
                    <HelpCircle size={20} color="#FBBF24" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.82rem', color: '#FBBF24', lineHeight: 1.5 }}>
                      <strong style={{ color: '#F59E0B' }}>Source ({result.data_source}):</strong> {result.disclaimer}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
