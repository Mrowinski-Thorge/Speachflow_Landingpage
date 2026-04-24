import { useState, useRef, useEffect, useCallback } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const EDGE_FUNCTION_URL = 'https://hfaxhfyugkvqxpgwbdht.supabase.co/functions/v1/analyze-speech';
const DAILY_LIMIT = 2;
const LOCAL_KEY = 'speachflow_v2';
const FP_KEY = 'speachflow_fp';
const MIN_RECORDING_SECONDS = 3;
const ANALYZE_STEPS = [
  'Audio wird verarbeitet...',
  'Sprache wird transkribiert...',
  'Qualität wird bewertet...',
  'Feedback wird generiert...',
];

// ─────────────────────────────────────────────
// Browser Fingerprint (Canvas + Navigator)
// ─────────────────────────────────────────────
async function buildFingerprint(): Promise<string> {
  const parts: string[] = [];

  // Navigator signals
  parts.push(navigator.language ?? '');
  parts.push(String(navigator.hardwareConcurrency ?? 0));
  parts.push(String((navigator as { deviceMemory?: number }).deviceMemory ?? 0));
  parts.push(navigator.platform ?? '');
  parts.push(String(screen.width) + 'x' + String(screen.height));
  parts.push(String(screen.colorDepth));
  parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone ?? '');

  // Canvas fingerprint
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('SpeachFlow🎤', 2, 15);
      ctx.fillStyle = 'rgba(102,204,0,0.7)';
      ctx.fillText('SpeachFlow🎤', 4, 17);
      parts.push(canvas.toDataURL().slice(-80));
    }
  } catch { /* canvas blocked */ }

  const raw = parts.join('|');

  // Hash via SubtleCrypto
  try {
    const encoded = new TextEncoder().encode(raw);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
  } catch {
    // Fallback: simple djb2
    let h = 5381;
    for (let i = 0; i < raw.length; i++) h = ((h << 5) + h) ^ raw.charCodeAt(i);
    return Math.abs(h).toString(16).padStart(8, '0');
  }
}

// ─────────────────────────────────────────────
// Session ID (localStorage, stable per browser)
// ─────────────────────────────────────────────
function getOrCreateSessionId(): string {
  const key = 'speachflow_session_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

// ─────────────────────────────────────────────
// Local limit state (per fingerprint + localStorage)
// ─────────────────────────────────────────────
interface LocalState {
  used: number;
  date: string; // YYYY-MM-DD
  fp: string;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function loadLocal(fp: string): LocalState {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return { used: 0, date: todayStr(), fp };
    const parsed = JSON.parse(raw) as LocalState;
    // Reset if new day
    if (parsed.date !== todayStr()) return { used: 0, date: todayStr(), fp };
    // If fingerprint changed (incognito / cleared storage), still count
    return parsed;
  } catch {
    return { used: 0, date: todayStr(), fp };
  }
}

function saveLocal(state: LocalState): void {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
}

// checkLimit: returns true if allowed, false if blocked
function checkLocalLimit(fp: string): { allowed: boolean; used: number } {
  const state = loadLocal(fp);
  // Also check fingerprint-keyed storage as second layer
  const fpUsedRaw = localStorage.getItem(`${FP_KEY}_${fp}`);
  const fpUsed = fpUsedRaw ? parseInt(fpUsedRaw, 10) : 0;
  const effectiveUsed = Math.max(state.used, fpUsed);
  return { allowed: effectiveUsed < DAILY_LIMIT, used: effectiveUsed };
}

function incrementLocal(fp: string): void {
  const state = loadLocal(fp);
  const newUsed = state.used + 1;
  saveLocal({ used: newUsed, date: todayStr(), fp });
  // Also update fingerprint layer
  const fpUsedRaw = localStorage.getItem(`${FP_KEY}_${fp}`);
  const fpUsed = fpUsedRaw ? parseInt(fpUsedRaw, 10) : 0;
  localStorage.setItem(`${FP_KEY}_${fp}`, String(Math.max(newUsed, fpUsed + 1)));
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface AnalysisResult {
  transcript: string;
  strengths: string[];
  improvements: string[];
  summary: string;
  used: number;
  limit: number;
  remaining: number;
  cooldown_until?: string;
}

type Stage =
  | 'loading'      // startup: checking server limit
  | 'blocked'      // server says limit reached on open
  | 'idle'
  | 'recording'
  | 'analyzing'
  | 'result'       // 1st result shown
  | 'limit'        // 2nd result → show download CTA
  | 'too_short'
  | 'error';

// ─────────────────────────────────────────────
// Download CTA
// ─────────────────────────────────────────────
function DownloadCTA({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center py-10 px-8">
      <div
        className="w-14 h-14 flex items-center justify-center rounded-2xl"
        style={{ backgroundColor: 'rgba(79,70,229,0.10)', border: '1px solid rgba(79,70,229,0.18)' }}
      >
        <i className="ri-smartphone-line text-2xl" style={{ color: 'var(--indigo)' }} />
      </div>
      <div>
        <p className="text-base font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
          {title ?? 'Lade SpeachFlow herunter um weiter zu üben'}
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {subtitle ?? 'Unbegrenzte Analysen, detailliertes Feedback & Verlauf – kostenlos in der App.'}
        </p>
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        <a href="#download" className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap cursor-pointer">
          <i className="ri-apple-line" /> App Store
        </a>
        <a href="#download" className="btn-secondary text-sm px-5 py-2.5 whitespace-nowrap cursor-pointer">
          <i className="ri-google-play-line" /> Google Play
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function LiveTestSection() {
  const ref = useScrollReveal();

  const [stage, setStage] = useState<Stage>('loading');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usedToday, setUsedToday] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [fp, setFp] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionId = useRef(getOrCreateSessionId());

  // ── Startup: build fingerprint + check server limit ──
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const fingerprint = await buildFingerprint();
      if (cancelled) return;
      setFp(fingerprint);

      // 1. Local check first (instant)
      const local = checkLocalLimit(fingerprint);
      if (local.used >= DAILY_LIMIT) {
        setUsedToday(local.used);
        setStage('blocked');
        return;
      }

      // 2. Server check (authoritative)
      try {
        const res = await fetch(
          `${EDGE_FUNCTION_URL}?session_id=${encodeURIComponent(sessionId.current)}`,
          { method: 'GET' }
        );
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (data.is_blocked) {
            // Sync local to server truth
            saveLocal({ used: DAILY_LIMIT, date: todayStr(), fp: fingerprint });
            localStorage.setItem(`${FP_KEY}_${fingerprint}`, String(DAILY_LIMIT));
            setUsedToday(DAILY_LIMIT);
            setStage('blocked');
            return;
          }
          if (!cancelled) {
            setUsedToday(data.used ?? 0);
          }
        }
      } catch { /* offline – fall through to local state */ }

      if (!cancelled) {
        setUsedToday(local.used);
        setStage('idle');
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  // ── Analyze steps animation ──
  useEffect(() => {
    if (stage !== 'analyzing') return;
    setAnalyzeStep(0);
    const iv = setInterval(() => {
      setAnalyzeStep((s) => (s + 1) % ANALYZE_STEPS.length);
    }, 1800);
    return () => clearInterval(iv);
  }, [stage]);

  const stopAll = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => () => { stopAll(); }, [stopAll]);

  // ── Record / Stop ──
  const handleRecord = async () => {
    if (stage === 'recording') {
      if (recordingTime < MIN_RECORDING_SECONDS) {
        stopAll();
        setStage('too_short');
        return;
      }
      setStage('analyzing');
      stopAll();
      return;
    }

    setError(null);
    setResult(null);
    audioChunksRef.current = [];
    setRecordingTime(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        if (!blob || blob.size < 1000) { setStage('too_short'); return; }
        await sendToGemini(blob, mimeType);
      };

      recorder.start(250);
      setStage('recording');

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch {
      setError('Mikrofon-Zugriff verweigert. Bitte erlaube den Zugriff in deinem Browser.');
      setStage('idle');
    }
  };

  const sendToGemini = async (audioBlob: Blob, mimeType: string) => {
    // Local limit check (offline-safe, fingerprint-backed)
    const local = checkLocalLimit(fp);
    if (!local.allowed) {
      setUsedToday(DAILY_LIMIT);
      setStage('blocked');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('audio', new File([audioBlob], 'recording.webm', { type: mimeType }));
      formData.append('session_id', sessionId.current);
      formData.append('scenario', 'speech');

      const response = await fetch(EDGE_FUNCTION_URL, { method: 'POST', body: formData });
      const data = await response.json();

      if (response.status === 429) {
        // Server says blocked → sync local
        saveLocal({ used: DAILY_LIMIT, date: todayStr(), fp });
        localStorage.setItem(`${FP_KEY}_${fp}`, String(DAILY_LIMIT));
        setUsedToday(DAILY_LIMIT);
        setStage('blocked');
        return;
      }

      if (response.status === 422 && data.error === 'audio_too_short') {
        setStage('too_short');
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Analyse fehlgeschlagen');
      }

      // Increment local counter after successful server response
      incrementLocal(fp);

      const newUsed = data.used ?? local.used + 1;
      setUsedToday(newUsed);
      setResult(data);

      if (data.remaining <= 0) {
        // Show result briefly then switch to limit view
        setStage('limit');
      } else {
        setStage('result');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.');
      setStage('idle');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setRecordingTime(0);
    setStage('idle');
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <section
      id="livetest"
      className="px-6 md:px-8"
      style={{ backgroundColor: 'var(--bg-base)', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div ref={ref} className="section-reveal text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
          >
            Teste es jetzt live
          </h2>
          <p className="text-base md:text-lg max-w-lg mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}>
            Einfach aufnehmen – die KI bewertet automatisch deine Sprache, Klarheit und Wirkung.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >

          {/* ── LOADING ── */}
          {stage === 'loading' && (
            <div className="flex flex-col items-center justify-center py-20 px-8 gap-4">
              <div className="relative w-12 h-12">
                <div
                  className="absolute inset-0 rounded-full animate-spin"
                  style={{
                    background: 'conic-gradient(var(--indigo), transparent)',
                    mask: 'radial-gradient(circle at center, transparent 55%, black 55%)',
                    WebkitMask: 'radial-gradient(circle at center, transparent 55%, black 55%)',
                  }}
                />
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Wird geladen…</p>
            </div>
          )}

          {/* ── BLOCKED (limit already reached on open) ── */}
          {stage === 'blocked' && (
            <DownloadCTA
              title="Lade SpeachFlow herunter um weiter zu üben"
              subtitle="Du hast dein Tageslimit erreicht. Unbegrenzte Analysen gibt es in der App – kostenlos."
            />
          )}

          {/* ── TOO SHORT ── */}
          {stage === 'too_short' && (
            <div className="flex flex-col items-center justify-center py-20 px-8 gap-6 text-center">
              <div
                className="w-14 h-14 flex items-center justify-center rounded-2xl"
                style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <i className="ri-time-line text-2xl" style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <p className="text-base font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Aufnahme zu kurz</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Bitte sprich mindestens <strong>3 Sekunden</strong> – die KI braucht genug Inhalt zum Analysieren.
                </p>
              </div>
              <button onClick={handleReset} className="btn-ghost text-sm px-5 py-2.5 cursor-pointer whitespace-nowrap">
                <i className="ri-refresh-line" /> Nochmal versuchen
              </button>
            </div>
          )}

          {/* ── IDLE ── */}
          {stage === 'idle' && (
            <div className="flex flex-col items-center justify-center py-20 px-8 gap-8">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: 'rgba(79,70,229,0.12)', animationDuration: '2s' }}
                />
                <button
                  onClick={handleRecord}
                  className="relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)' }}
                >
                  <i className="ri-mic-fill text-4xl text-white" />
                </button>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Aufnahme starten
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Tippe auf den Button und sprich frei – die KI entscheidet alles
                </p>
              </div>
              {usedToday > 0 && (
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {Array.from({ length: DAILY_LIMIT }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor: i < usedToday ? 'var(--indigo)' : 'var(--bg-muted)',
                        border: '1px solid var(--border-indigo)',
                      }}
                    />
                  ))}
                  <span>{usedToday}/{DAILY_LIMIT} heute genutzt</span>
                </div>
              )}
            </div>
          )}

          {/* ── RECORDING ── */}
          {stage === 'recording' && (
            <div className="flex flex-col items-center justify-center py-16 px-8 gap-8">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: 'rgba(239,68,68,0.15)', animationDuration: '1s' }}
                />
                <div
                  className="absolute inset-3 rounded-full animate-ping"
                  style={{ backgroundColor: 'rgba(239,68,68,0.10)', animationDuration: '1.4s', animationDelay: '0.2s' }}
                />
                <button
                  onClick={handleRecord}
                  className="relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)' }}
                >
                  <i className="ri-stop-fill text-3xl text-white" />
                </button>
              </div>
              <div className="text-center">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-3"
                  style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {formatTime(recordingTime)}
                </div>
                <p className="text-sm font-semibold block" style={{ color: 'var(--text-primary)' }}>
                  Aufnahme läuft – tippe zum Stoppen
                </p>
              </div>
            </div>
          )}

          {/* ── ANALYZING ── */}
          {stage === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-20 px-8 gap-6">
              <div className="relative w-20 h-20">
                <div
                  className="absolute inset-0 rounded-full animate-spin"
                  style={{
                    background: 'conic-gradient(#4F46E5, transparent)',
                    mask: 'radial-gradient(circle at center, transparent 55%, black 55%)',
                    WebkitMask: 'radial-gradient(circle at center, transparent 55%, black 55%)',
                  }}
                />
                <div
                  className="absolute inset-2 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--bg-muted)' }}
                >
                  <i className="ri-sparkling-line text-xl" style={{ color: 'var(--indigo)' }} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  KI analysiert deine Aufnahme
                </p>
                <p className="text-sm transition-all duration-500" style={{ color: 'var(--text-secondary)' }}>
                  {ANALYZE_STEPS[analyzeStep]}
                </p>
              </div>
            </div>
          )}

          {/* ── RESULT (1st use) ── */}
          {stage === 'result' && result && (
            <div className="p-8 space-y-5">
              {/* Strengths + Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-checkbox-circle-line" style={{ color: 'var(--indigo)' }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Das lief gut</span>
                  </div>
                  <div className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-3 rounded-xl text-sm"
                        style={{ backgroundColor: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.12)' }}
                      >
                        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <i className="ri-check-line text-xs" style={{ color: 'var(--indigo)' }} />
                        </div>
                        <span style={{ color: 'var(--text-primary)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-arrow-up-circle-line" style={{ color: '#f59e0b' }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Verbesserungspotenzial</span>
                  </div>
                  <div className="space-y-2">
                    {result.improvements.map((imp, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-3 rounded-xl text-sm"
                        style={{ backgroundColor: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.12)' }}
                      >
                        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <i className="ri-arrow-right-up-line text-xs" style={{ color: '#f59e0b' }} />
                        </div>
                        <span style={{ color: 'var(--text-primary)' }}>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div
                className="p-4 rounded-2xl text-sm leading-relaxed"
                style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-sparkling-line text-xs" style={{ color: 'var(--indigo)' }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>KI-Fazit</span>
                </div>
                {result.summary}
              </div>
            </div>
          )}

          {/* ── LIMIT (2nd use → only download CTA, no result shown) ── */}
          {stage === 'limit' && (
            <DownloadCTA
              title="Lade SpeachFlow herunter um weiter zu üben"
              subtitle="Du hast dein Tageslimit erreicht. Unbegrenzte Analysen gibt es in der App – kostenlos."
            />
          )}

          {/* ── ERROR ── */}
          {stage === 'error' && (
            <div className="flex flex-col items-center justify-center py-16 px-8 gap-5 text-center">
              <div
                className="w-14 h-14 flex items-center justify-center rounded-2xl"
                style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <i className="ri-error-warning-line text-2xl" style={{ color: '#ef4444' }} />
              </div>
              <div>
                <p className="text-base font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Etwas ist schiefgelaufen</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
              </div>
              <button onClick={handleReset} className="btn-ghost text-sm px-5 py-2.5 cursor-pointer whitespace-nowrap">
                <i className="ri-refresh-line" /> Nochmal versuchen
              </button>
            </div>
          )}

        </div>

        {/* Inline error (non-blocking) */}
        {error && stage !== 'error' && (
          <div
            className="mt-4 rounded-2xl p-4 text-sm flex items-start gap-3"
            style={{ backgroundColor: 'rgba(239,68,68,0.06)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}
          >
            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-error-warning-line" />
            </div>
            <span>{error}</span>
          </div>
        )}

      </div>
    </section>
  );
}
