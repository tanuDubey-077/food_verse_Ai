import React, { useState, useEffect, useRef } from 'react';
import {
  ChefHat,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { CookingChatResponse, Recipe, SubstituteOption } from '../types';

export const CookingAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string; recipe?: Recipe }>>([
    {
      role: 'assistant',
      content: 'Welcome to **FoodVerse Smart Cooking Assistant**! Tell me what ingredients you have in your pantry, or request a custom recipe with your dietary preferences.'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  // Timer state for step-by-step cooking
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Speech Recognition & Synthesis
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Substitution state
  const [substituteQuery, setSubstituteQuery] = useState('');
  const [substituteResult, setSubstituteResult] = useState<{ ingredient: string; substitutes: SubstituteOption[]; explanation: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer tick without direct set-state-in-effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res: CookingChatResponse = await api.cookingChat(text);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.reply,
        recipe: res.recipe
      }]);
      if (res.recipe) {
        setActiveRecipe(res.recipe);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API: Text-to-Speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported on this browser.");
    }
  };

  // Web Speech API: Voice dictation
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported on this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const startStepTimer = (stepIdx: number, seconds: number) => {
    setActiveStepIndex(stepIdx);
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const handleLookupSubstitute = async () => {
    if (!substituteQuery.trim()) return;
    try {
      const res = await api.getSubstitute(substituteQuery.trim());
      setSubstituteResult({
        ingredient: res.ingredient,
        substitutes: res.substitutes,
        explanation: res.culinary_explanation
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)' }}>
            <ChefHat size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-peach" style={{ fontWeight: 700 }}>AI Culinary Intelligence</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hands-Free Kitchen Companion</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>Smart Cooking Assistant & Recipe Builder</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '780px' }}>
              Conversational culinary intelligence with pantry recipe synthesis, hands-free voice timers, and dynamic ingredient substitutions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Interactive Chat Console */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-clay)', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Culinary Dialogue</span>
            </h3>
            <span className="badge badge-peach" style={{ fontWeight: 700, fontSize: '0.75rem' }}>Hands-Free Enabled</span>
          </div>

          {/* Messages Scroll Area */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.role === 'user' ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${m.role === 'user' ? 'rgba(245, 158, 11, 0.45)' : 'var(--border-clay)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.95rem 1.15rem',
                  boxShadow: 'var(--clay-shadow-card)'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: m.role === 'user' ? '#FBBF24' : '#F59E0B', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {m.role === 'user' ? 'You' : 'Chef Assistant'}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {m.content}
                </div>

                {m.recipe && (
                  <button
                    onClick={() => setActiveRecipe(m.recipe!)}
                    className="btn-secondary"
                    style={{ marginTop: '0.75rem', padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <ChefHat size={15} color="#F59E0B" />
                    <span>View Recipe: {m.recipe.title}</span>
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input & Voice Controls */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-clay)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={toggleListening}
              style={{
                background: isListening ? 'rgba(244, 63, 94, 0.2)' : 'var(--bg-surface-sunken)',
                border: `1px solid ${isListening ? '#F43F5E' : 'var(--border-clay)'}`,
                color: isListening ? '#FB7185' : 'var(--text-muted)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--clay-shadow-card)',
                transition: 'all 0.2s ease'
              }}
              title={isListening ? "Listening... click to stop" : "Speak your message (Voice dictation)"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              className="input-field"
              placeholder="Ask a recipe, list ingredients, or request substitutions..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              style={{ flex: 1 }}
            />

            <button
              className="btn-primary"
              onClick={() => handleSendMessage()}
              disabled={loading || !inputMessage.trim()}
              style={{ padding: '0.75rem 1.25rem' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Recipe Interactive Console & Timers */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '640px', overflowY: 'auto' }}>
          {activeRecipe ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span className="badge badge-peach" style={{ marginBottom: '0.35rem', fontWeight: 700 }}>
                    {activeRecipe.difficulty} • {activeRecipe.servings} Servings
                  </span>
                  <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', margin: '0.2rem 0' }}>{activeRecipe.title}</h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Prep: {activeRecipe.prep_time_min} mins | Cook: {activeRecipe.cook_time_min} mins | {activeRecipe.calories_per_serving || 450} kcal/serving
                  </div>
                </div>

                <button
                  onClick={() => speakText(`${activeRecipe.title}. Ingredients: ${activeRecipe.ingredients.map(i => i.name).join(', ')}`)}
                  className="btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  title="Read aloud via Text-to-Speech"
                >
                  {isSpeaking ? <VolumeX size={16} color="#FB7185" /> : <Volume2 size={16} color="#F59E0B" />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Audio Guide'}</span>
                </button>
              </div>

              {/* Active Step Timer Widget */}
              {activeStepIndex !== null && (
                <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.45)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 700, textTransform: 'uppercase' }}>ACTIVE STEP {activeStepIndex + 1} TIMER</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F59E0B', margin: '0.1rem 0' }}>
                      {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="btn-primary"
                      style={{ padding: '0.5rem 0.95rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                      <span>{timerRunning ? 'Pause' : 'Resume'}</span>
                    </button>
                    <button
                      onClick={() => { setTimerRunning(false); setTimerSeconds(0); setActiveStepIndex(null); }}
                      className="btn-secondary"
                      style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Ingredients List */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Required Ingredients ({activeRecipe.ingredients.length})
                </div>
                <div className="grid-2" style={{ gap: '0.5rem', fontSize: '0.85rem' }}>
                  {activeRecipe.ingredients.map((ing, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-primary)', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-sunken)' }}>
                      <CheckCircle2 size={15} color="#10B981" />
                      <strong>{ing.amount}</strong> <span>{ing.name}</span>
                      {ing.notes && <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({ing.notes})</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Cooking Guide */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Step-by-Step Cooking Workflow
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activeRecipe.steps.map((st, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: activeStepIndex === i ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-surface-sunken)',
                        border: `1px solid ${activeStepIndex === i ? '#F59E0B' : 'var(--border-clay)'}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: activeStepIndex === i ? '#FBBF24' : '#F59E0B' }}>
                          Step {st.step_number}
                        </span>
                        {st.timer_sec > 0 && (
                          <button
                            onClick={() => startStepTimer(i, st.timer_sec)}
                            className="btn-secondary"
                            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <Clock size={12} />
                            <span>Start Timer ({Math.round(st.timer_sec / 60)}m)</span>
                          </button>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                        {st.instruction}
                      </p>
                      {st.technique_tip && (
                        <div style={{ fontSize: '0.78rem', color: '#FBBF24', background: 'rgba(245, 158, 11, 0.15)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.35)', marginTop: '0.45rem' }}>
                          💡 <strong>Chef Technique:</strong> {st.technique_tip}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef Tips */}
              <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-lg)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', fontSize: '0.85rem', color: '#34D399', boxShadow: 'var(--clay-shadow-card)' }}>
                <strong style={{ color: '#10B981' }}>Executive Chef Tip:</strong> {activeRecipe.chef_tips}
              </div>
            </div>
          ) : (
            /* Ingredient Substitution Finder Widget */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem 1.5rem' }}>
                <div className="brand-icon-wrapper" style={{ width: '64px', height: '64px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', margin: '0 auto 1.25rem' }}>
                  <ChefHat size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Interactive Culinary Station</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '340px', margin: '0 auto', lineHeight: 1.5 }}>
                  Ask any recipe question in the chat, or use the substitution calculator below to replace missing ingredients.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-clay)', boxShadow: 'var(--clay-shadow-card)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.65rem 0', color: 'var(--text-primary)' }}>
                  Smart Ingredient Substitution Engine
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Buttermilk, Egg, Sour cream..."
                    value={substituteQuery}
                    onChange={e => setSubstituteQuery(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button className="btn-primary" onClick={handleLookupSubstitute}>
                    Find
                  </button>
                </div>

                {substituteResult && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#F59E0B', fontWeight: 700 }}>
                      Substitutes for {substituteResult.ingredient}:
                    </div>
                    {substituteResult.substitutes.map((opt, i) => (
                      <div key={i} style={{ padding: '0.75rem', background: 'var(--bg-surface-sunken)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-clay)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          <span>{opt.name}</span>
                          <span className="badge badge-emerald">{opt.ratio}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{opt.notes}</div>
                      </div>
                    ))}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.35rem' }}>
                      {substituteResult.explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
