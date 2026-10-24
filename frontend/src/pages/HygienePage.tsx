import React, { useState } from 'react';
import {
  ShieldAlert,
  Video,
  FileCheck2,
  Clock,
  Printer
} from 'lucide-react';
import { api } from '../services/api';
import { HygieneResult } from '../types';

export const HygienePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [environmentType, setEnvironmentType] = useState('commercial_kitchen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HygieneResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setIsVideo(selected.type.startsWith('video/'));
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a kitchen scene image or video clip.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.analyzeHygiene(file, environmentType);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to complete hygiene analysis.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'badge-rose';
      case 'Major': return 'badge-amber';
      case 'Minor': return 'badge-cyan';
      default: return 'badge-emerald';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #06B6D4, #0891B2)', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(6, 182, 212, 0.4)' }}>
            <ShieldAlert size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-cyan" style={{ fontWeight: 700 }}>HACCP Compliance Vision</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sanitation & PPE Verification</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>Restaurant Hygiene & Safety Monitoring</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '780px' }}>
              Temporal computer vision auditing for kitchen sanitization, PPE glove adherence, workstation cleanliness, and HACCP cross-contamination prevention.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Input Form & Media Upload */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Kitchen Surveillance Media</h3>
            <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>Audit Ingest</span>
          </div>

          <div
            className="spatial-dropzone"
            onClick={() => document.getElementById('hygiene-file-input')?.click()}
          >
            <input
              id="hygiene-file-input"
              type="file"
              accept="image/*,video/mp4,video/webm"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                {isVideo ? (
                  <video
                    src={previewUrl}
                    controls
                    style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--clay-shadow-card)' }}
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Kitchen Preview"
                    style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', boxShadow: 'var(--clay-shadow-card)' }}
                  />
                )}
                <span style={{ fontSize: '0.88rem', color: '#06B6D4', fontWeight: 600 }}>Click to replace: {file?.name}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div className="brand-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', margin: '0 auto' }}>
                  <Video size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Drop kitchen photo or video clip here</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Supports MP4, WebM, JPEG, PNG (Sample frames evaluated at 1 fps)</div>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Kitchen Environment Type
            </label>
            <select
              className="input-field"
              value={environmentType}
              onChange={e => setEnvironmentType(e.target.value)}
            >
              <option value="commercial_kitchen">Commercial Restaurant Main Kitchen</option>
              <option value="prep_station">Cold Prep / Salad Assembly Workstation</option>
              <option value="cook_line">Hot Line / Thermal Cooking Zone</option>
              <option value="storage_walkin">Refrigerated Storage & Walk-In Cooler</option>
            </select>
          </div>

          {error && (
            <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.45)', color: '#FB7185', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', boxShadow: '0 4px 16px rgba(6, 182, 212, 0.4)' }}
          >
            {loading ? <span>Extracting & Auditing Frames...</span> : <span>Run Kitchen Sanitation Audit</span>}
          </button>
        </div>

        {/* Right Column: Audit Report & Observation Timeline */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Inspection Audit Report</h3>
            {result && (
              <button
                onClick={() => window.print()}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Printer size={15} />
                <span>Print Audit</span>
              </button>
            )}
          </div>

          {!result ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="brand-icon-wrapper" style={{ width: '64px', height: '64px', background: 'var(--bg-surface-sunken)', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
                <FileCheck2 size={32} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>No audit performed yet</div>
              <p style={{ fontSize: '0.88rem', maxWidth: '340px', marginTop: '0.5rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Upload kitchen footage to generate frame-level sanitation findings, severity logs, and compliance grades.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Score & Tier Banner */}
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-cyan" style={{ marginBottom: '0.35rem', fontWeight: 700 }}>
                    {result.frames_analyzed} {result.frames_analyzed === 1 ? 'Frame Analyzed' : 'Video Frames Evaluated'}
                  </span>
                  <h2 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', margin: '0.2rem 0' }}>{result.inspection_tier}</h2>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: 'var(--bg-surface-sunken)',
                    border: '4px solid #06B6D4',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--clay-shadow-card)'
                  }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1, color: 'var(--text-primary)' }}>
                      {result.overall_score}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>SCORE</span>
                  </div>
                </div>
              </div>

              {/* Summary Counts */}
              <div className="grid-4" style={{ gap: '0.65rem' }}>
                <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '0.85rem 0.65rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(244, 63, 94, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#FB7185', fontWeight: 700, textTransform: 'uppercase' }}>Critical</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F43F5E', margin: '0.1rem 0' }}>{result.summary.critical_count}</div>
                </div>
                <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.85rem 0.65rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(245, 158, 11, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#FBBF24', fontWeight: 700, textTransform: 'uppercase' }}>Major</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F59E0B', margin: '0.1rem 0' }}>{result.summary.major_count}</div>
                </div>
                <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.85rem 0.65rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(6, 182, 212, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#22D3EE', fontWeight: 700, textTransform: 'uppercase' }}>Minor</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#06B6D4', margin: '0.1rem 0' }}>{result.summary.minor_count}</div>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.85rem 0.65rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(16, 185, 129, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 700, textTransform: 'uppercase' }}>Compliant</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10B981', margin: '0.1rem 0' }}>{result.summary.compliant_count}</div>
                </div>
              </div>

              {/* Timestamped Observations */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Frame Observation Evidence Log
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {result.observations.map((obs, idx) => (
                    <div key={idx} style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-clay)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                            <Clock size={13} /> {obs.timestamp_sec.toFixed(1)}s
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{obs.category}</span>
                        </div>
                        <span className={`badge ${getSeverityBadgeClass(obs.severity)}`}>
                          {obs.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', lineHeight: 1.4 }}>{obs.finding}</div>
                      <div style={{ fontSize: '0.8rem', color: '#34D399', background: 'rgba(16, 185, 129, 0.12)', padding: '0.4rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                        <strong style={{ color: '#10B981' }}>Corrective Action:</strong> {obs.remediation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Observations & Human Review Breakdown */}
              {((result.direct_observations && result.direct_observations.length > 0) || (result.recommended_human_review && result.recommended_human_review.length > 0)) && (
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.direct_observations && result.direct_observations.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                        Direct Visual Observations:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {result.direct_observations.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '0.2rem' }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.recommended_human_review && result.recommended_human_review.length > 0 && (
                    <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FBBF24', marginBottom: '0.25rem' }}>
                        Recommended Human In-Person Verification:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {result.recommended_human_review.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '0.2rem' }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Regulatory Disclaimer */}
              <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-lg)', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', boxShadow: 'var(--clay-shadow-card)' }}>
                <div style={{ fontSize: '0.82rem', color: '#FBBF24', lineHeight: 1.5 }}>
                  <strong style={{ color: '#F59E0B' }}>Compliance Notice:</strong> {result.disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
