import { useState, useRef, useEffect, useCallback } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const EDGE_FUNCTION_URL = 'https://hfaxhfyugkvqxpgwbdht.supabase.co/functions/v1/analyze-speech';
const DAILY_LIMIT = 2;

interface AnalysisResult {
  transcript: string;
  overall_score: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  used: number;
  limit: number;
  remaining: number;
}

function getOrCreateSessionId(): string {
  const key = 'speachflow_session_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Ausgezeichnet';
  if (score >= 75) return 'Sehr gut';
  if (score >= 60) return 'Gut';
  if (score >= 45) return 'Ausbaufähig';
  return 'Weiter üben';
}

type Stage = 'idle' | 'recording' | 'analyzing' | 'result' | 'limit';

export default function LiveTestSection() {
  const ref = useScrollReveal();
  const [stage, setStage] = useState<Stage>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usedToday, setUsedToday] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState<number[]>(Array(20).fill(0));
  const [showTranscript, setShowTranscript] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const sessionId = getOrCreateSessionId();

  const analyzeSteps = [
    'Audio wird verarbeitet...',
    'Sprache wird transkribiert...',
    'Qualität wird bewertet...',
    'Feedback wird generiert...',
  ];

  const stopAudioLevel = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const startAudioLevel = useCallback((stream: MediaStream) => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    source.connect(analyser);

    const tick = () => {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      const bars = Array.from({ length: 20 }, (_, i) => {
        const idx = Math.floor((i / 20) * (data.length * 0.6));
        return Math.min(100, (data[idx] / 255) * 120);
      });
      setAudioLevel(bars);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const stopAll = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopAudioLevel();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  }, [stopAudioLevel]);

  useEffect(() => () => { stopAll(); }, [stopAll]);

  useEffect(() => {
    if (stage !== 'analyzing') return;
    setAnalyzeStep(0);
    const iv = setInterval(() => {
      setAnalyzeStep((s) => (s + 1) % analyzeSteps.length);
    }, 1800);
    return () => clearInterval(iv);
  }, [stage]);

  const handleRecord = async () => {
    if (stage === 'recording') {
      setStage('analyzing');
      stopAll();
      return;
    }

    setError(null);
    setResult(null);
    setShowTranscript(false);
    audioChunksRef.current = [];
    setRecordingTime(0);
    setAudioLevel(Array(20).fill(0));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      startAudioLevel(stream);

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
        stopAudioLevel();
        setAudioLevel(Array(20).fill(0));
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        await sendToGemini(blob, mimeType);
      };

      recorder.start(250);
      setStage('recording');

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch {
      setError('Mikrofon-Zugriff verweigert. Bitte erlaube den Zugriff in deinem Browser.');
    }
  };

  const sendToGemini = async (audioBlob: Blob, mimeType: string) => {
    try {
      const formData = new FormData();
      formData.append('audio', new File([audioBlob], 'recording.webm', { type: mimeType }));
      formData.append('session_id', sessionId);
      formData.append('scenario', 'speech');

      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.status === 429) {
        setUsedToday(DAILY_LIMIT);
        setStage('limit');
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Analyse fehlgeschlagen');
      }

      setResult(data);
      setUsedToday(data.used);
      setStage(data.remaining <= 0 ? 'limit' : 'result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.');
      setStage('idle');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setShowTranscript(false);
    setRecordingTime(0);
    setAudioLevel(Array(20).fill(0));
    setStage('idle');
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const showResult = result !== null && (stage === 'result' || stage === 'limit');

  return (
    <section
      id="livetest"
      className="px-6 md:px-8"
      style={{ backgroundColor: 'var(--bg-base)', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div ref={ref} className="section-reveal text-center mb-12">
          <div className="pill-badge mb-5 mx-auto w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Live Demo
          </div>
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

        {/* Interactive Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
          }}
        >

          {/* ── IDLE ── */}
          {stage === 'idle' && (
            <div className="flex flex-col items-center justify-center py-20 px-8 gap-8">
              <div className="relative">
                {/* Pulse rings */}
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: 'rgba(79,70,229,0.15)', animationDuration: '2s' }}
                />
                <button
                  onClick={handleRecord}
                  className="relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
                  }}
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
              {/* Waveform */}
              <div className="flex items-end justify-center gap-1" style={{ height: '72px' }}>
                {audioLevel.map((level, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all"
                    style={{
                      width: '4px',
                      height: `${Math.max(6, (level / 100) * 68)}px`,
                      background: 'linear-gradient(to top, #4F46E5, #818CF8)',
                      opacity: 0.4 + (level / 100) * 0.6,
                      transitionDuration: '80ms',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={handleRecord}
                className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #f87171)',
                }}
              >
                <i className="ri-stop-fill text-3xl text-white" />
              </button>

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
                  {analyzeSteps[analyzeStep]}
                </p>
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {showResult && result && (
            <div className="p-8 space-y-6">
              {/* Score row */}
              <div
                className="rounded-2xl p-5 flex items-center gap-5"
                style={{ backgroundColor: 'var(--blue-light)', border: '1px solid var(--border-indigo)' }}
              >
                <div className="text-center" style={{ minWidth: '72px' }}>
                  <div
                    className="text-5xl font-black tabular-nums"
                    style={{
                      background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {result.overall_score}
                  </div>
                  <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--indigo)' }}>/ 100</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold" style={{ color: 'var(--indigo)' }}>
                      {getScoreLabel(result.overall_score)}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Gesamt-Score</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(79,70,229,0.15)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${result.overall_score}%`,
                        background: 'linear-gradient(90deg, #4F46E5, #818CF8)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Strengths + Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <i className="ri-checkbox-circle-line" style={{ color: 'var(--indigo)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Das lief gut</span>
                  </div>
                  <div className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-3 rounded-xl text-sm"
                        style={{ backgroundColor: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.12)' }}
                      >
                        <i className="ri-check-line mt-0.5 flex-shrink-0 text-xs" style={{ color: 'var(--indigo)' }} />
                        <span style={{ color: 'var(--text-primary)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <i className="ri-arrow-up-circle-line" style={{ color: '#f59e0b' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Verbesserungspotenzial</span>
                  </div>
                  <div className="space-y-2">
                    {result.improvements.map((imp, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-3 rounded-xl text-sm"
                        style={{ backgroundColor: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.12)' }}
                      >
                        <i className="ri-arrow-right-up-line mt-0.5 flex-shrink-0 text-xs" style={{ color: '#f59e0b' }} />
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
                  <i className="ri-sparkling-line text-xs" style={{ color: 'var(--indigo)' }} />
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>KI-Fazit</span>
                </div>
                {result.summary}
              </div>

              {/* Transcript toggle */}
              <button
                onClick={() => setShowTranscript((v) => !v)}
                className="flex items-center gap-1.5 text-xs cursor-pointer transition-colors duration-150"
                style={{ color: 'var(--indigo)' }}
              >
                <i className={showTranscript ? 'ri-eye-off-line' : 'ri-file-text-line'} />
                {showTranscript ? 'Transkript ausblenden' : 'Transkript anzeigen'}
              </button>
              {showTranscript && (
                <div
                  className="p-4 rounded-2xl text-xs leading-relaxed font-mono"
                  style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)', maxHeight: '140px', overflowY: 'auto', border: '1px solid var(--border)' }}
                >
                  {result.transcript || 'Kein Transkript verfügbar.'}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                {stage === 'result' && (
                  <button
                    onClick={handleReset}
                    className="btn-ghost text-sm px-5 py-2.5"
                  >
                    <i className="ri-refresh-line" />
                    Nochmal aufnehmen
                  </button>
                )}
                {stage === 'limit' && (
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Tageslimit erreicht – morgen wieder 2 kostenlose Analysen
                  </p>
                )}
              </div>

              {/* Download CTA after last attempt */}
              {stage === 'limit' && (
                <div
                  className="rounded-2xl p-5 text-center"
                  style={{ backgroundColor: 'var(--blue-light)', border: '1px solid var(--border-indigo)' }}
                >
                  <p className="text-sm font-bold mb-1" style={{ color: 'var(--indigo)' }}>
                    Unbegrenzte Analysen in der App
                  </p>
                  <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Detaillierteres Feedback, Verlauf und mehr – kostenlos herunterladen.
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <a href="#download" className="btn-primary text-sm px-5 py-2.5">
                      <i className="ri-apple-line" /> App Store
                    </a>
                    <a href="#download" className="btn-secondary text-sm px-5 py-2.5">
                      <i className="ri-google-play-line" /> Google Play
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── HARD LIMIT (no result yet) ── */}
          {stage === 'limit' && !result && (
            <div className="flex flex-col items-center justify-center py-20 px-8 gap-6 text-center">
              <div
                className="w-16 h-16 flex items-center justify-center rounded-2xl"
                style={{ backgroundColor: 'var(--blue-light)', border: '1px solid var(--border-indigo)' }}
              >
                <i className="ri-download-cloud-line text-3xl" style={{ color: 'var(--indigo)' }} />
              </div>
              <div>
                <p className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Tageslimit erreicht</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lade die App herunter für unbegrenzte Analysen!</p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <a href="#download" className="btn-primary text-sm px-5 py-2.5">
                  <i className="ri-apple-line" /> App Store
                </a>
                <a href="#download" className="btn-secondary text-sm px-5 py-2.5">
                  <i className="ri-google-play-line" /> Google Play
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            className="mt-4 rounded-2xl p-4 text-sm flex items-start gap-3"
            style={{ backgroundColor: 'rgba(239,68,68,0.06)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}
          >
            <i className="ri-error-warning-line mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Bottom info row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1.5">
            <i className="ri-shield-check-line" style={{ color: 'var(--indigo)' }} />
            Aufnahmen nicht gespeichert
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ri-time-line" style={{ color: 'var(--indigo)' }} />
            2× täglich kostenlos
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ri-sparkling-line" style={{ color: 'var(--indigo)' }} />
            Powered by Google Gemini 2.5 Flash
          </span>
        </div>
      </div>
    </section>
  );
}
