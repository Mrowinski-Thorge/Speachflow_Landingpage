import { useEffect, useState, useRef } from 'react';

const PHRASES = [
  'Pitch wie ein Profi',
  'Präsentiere in der Schule wie ein GOAT',
  'Überzeuge im Job wie ein Boss',
  'Rede. Überzeuge. Gewinne.',
  'Dein KI-Coach für jeden Auftritt',
];

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

const IMAGES = [
  { src: `${base}/Pitch.png`, label: 'Pitch' },
  { src: `${base}/Job.png`, label: 'Job' },
  { src: `${base}/School.png`, label: 'Schule' },
];

function useTypewriter(phrases: string[], typingSpeed = 55, deletingSpeed = 30, pauseMs = 2200) {
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = phrases[phraseIdx];

    const tick = () => {
      if (!isDeleting) {
        if (displayed.length < current.length) {
          setDisplayed(current.slice(0, displayed.length + 1));
          timeoutRef.current = setTimeout(tick, typingSpeed);
        } else {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseMs);
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(current.slice(0, displayed.length - 1));
          timeoutRef.current = setTimeout(tick, deletingSpeed);
        } else {
          setIsDeleting(false);
          setPhraseIdx((i) => (i + 1) % phrases.length);
        }
      }
    };

    timeoutRef.current = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, isDeleting, phraseIdx, phrases, typingSpeed, deletingSpeed, pauseMs]);

  return displayed;
}

const METRICS = [
  { target: 10000, suffix: '+', label: 'Aktive Nutzer', display: (v: number) => v >= 1000 ? `${Math.floor(v / 1000)}K+` : `${v}+` },
  { target: 34, suffix: '%', label: 'Ø Score-Verbesserung', display: (v: number) => `+${Math.floor(v)}%` },
  { target: 4.8, suffix: '★', label: 'App-Bewertung', display: (v: number) => `${v.toFixed(1)} ★` },
];

function useCountUp(target: number, duration = 1800, started: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return value;
}

function MetricItem({ metric, started }: { metric: typeof METRICS[0]; started: boolean }) {
  const value = useCountUp(metric.target, 1800, started);
  return (
    <div className="text-center">
      <div
        className="text-2xl font-bold mb-0.5"
        style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
      >
        {metric.display(value)}
      </div>
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{metric.label}</div>
    </div>
  );
}

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [imgOrder, setImgOrder] = useState([0, 1, 2]);
  const [shuffling, setShuffling] = useState(false);
  const [metricsStarted, setMetricsStarted] = useState(false);
  const metricsRef = useRef<HTMLDivElement>(null);
  const typewriterText = useTypewriter(PHRASES);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = metricsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setMetricsStarted(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShuffling(true);
      setTimeout(() => {
        setImgOrder((prev) => [prev[2], prev[0], prev[1]]);
        setShuffling(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  const [left, center, right] = imgOrder;

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)', paddingTop: '90px', paddingBottom: '60px' }}
    >
      {/* Soft glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.10) 0%, transparent 65%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(59,130,246,0.08) 0%, transparent 60%)' }}
      />

      <div className="relative w-full max-w-[1100px] mx-auto px-4 md:px-8 flex flex-col items-center">

        {/* ── Headline with typewriter ── */}
        <div className="text-center mb-5 w-full" style={fade(100)}>
          {/*
            Fixed-height container — 2 Zeilen Platz reserviert.
            Mobile: kleinere Schrift → weniger Höhe nötig.
            Smooth transition wenn Text umbricht.
          */}
          <div
            style={{
              minHeight: 'calc(clamp(28px, 7vw, 68px) * 1.15 * 2 + 8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'min-height 0.35s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <h1
              className="font-black tracking-tight leading-[1.15] text-center"
              style={{
                color: 'var(--text-heading)',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(28px, 7vw, 68px)',
                transition: 'font-size 0.3s ease',
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {typewriterText || '\u00a0'}
              </span>
              <span
                className="inline-block w-0.5 h-[0.85em] ml-1 align-middle animate-pulse"
                style={{ backgroundColor: 'var(--indigo)', verticalAlign: 'middle' }}
              />
            </h1>
          </div>
          <p
            className="mt-3 max-w-xl mx-auto leading-relaxed px-2"
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(14px, 3.5vw, 17px)',
              lineHeight: '1.75',
            }}
          >
            SpeachFlow analysiert deine Sprache, Haltung und Mimik in Echtzeit –
            und gibt dir präzises Feedback, das dich wirklich besser macht.
          </p>
        </div>

        {/* ── CTAs ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 md:mb-14 w-full px-4"
          style={fade(220)}
        >
          <a href="#download" className="btn-primary text-sm md:text-base px-6 md:px-8 py-3 md:py-3.5 w-full sm:w-auto text-center">
            <i className="ri-download-line" />
            Kostenlos herunterladen
          </a>
          <a href="#livetest" className="btn-secondary text-sm md:text-base px-6 md:px-8 py-3 md:py-3.5 w-full sm:w-auto text-center">
            <i className="ri-rocket-line" style={{ display: 'inline-block', transform: 'rotate(45deg)' }} />
            Live testen
          </a>
        </div>

        {/* ── Image Layout ── */}
        {/* Desktop: 3-Image Fan. Mobile: single centered card */}
        <div style={fade(400)} className="w-full">

          {/* MOBILE: single image, centered, full width */}
          <div className="md:hidden flex flex-col items-center w-full">
            <div
              className="relative w-full transition-all duration-500"
              style={{
                maxWidth: '280px',
                height: '340px',
                opacity: shuffling ? 0.6 : 1,
                transform: shuffling ? 'scale(0.96)' : 'scale(1)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
            >
              <div
                className="w-full h-full rounded-3xl overflow-hidden"
                style={{
                  border: '2px solid var(--border-indigo)',
                  backgroundColor: 'var(--bg-surface)',
                }}
              >
                <img
                  src={IMAGES[center].src}
                  alt={IMAGES[center].label}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)', color: '#fff' }}
              >
                {IMAGES[center].label}
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-2 mt-8">
              {IMAGES.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: imgOrder[1] === i ? '20px' : '6px',
                    height: '6px',
                    backgroundColor: imgOrder[1] === i ? 'var(--indigo)' : 'var(--border)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* DESKTOP: 3-Image Fan */}
          <div
            className="hidden md:flex relative w-full items-end justify-center"
            style={{ height: '420px', maxWidth: '860px', margin: '0 auto' }}
          >
            {/* LEFT */}
            <div
              className="absolute"
              style={{
                left: '0%',
                bottom: '0',
                width: '260px',
                height: '360px',
                zIndex: 1,
                transform: shuffling
                  ? 'rotate(-10deg) translateX(-10px) scale(0.88) translateY(20px)'
                  : 'rotate(-8deg) translateX(0px) scale(0.9)',
                transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
                opacity: shuffling ? 0.5 : 0.85,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className="w-full h-full rounded-3xl overflow-hidden"
                style={{ border: '2px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}
              >
                <img src={IMAGES[left].src} alt={IMAGES[left].label} className="w-full h-full object-cover object-top" />
              </div>
              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                {IMAGES[left].label}
              </div>
            </div>

            {/* CENTER */}
            <div
              className="absolute"
              style={{
                left: '50%',
                bottom: '0',
                width: '300px',
                height: '420px',
                zIndex: 3,
                transform: shuffling
                  ? 'translateX(-50%) scale(0.95) translateY(10px)'
                  : 'translateX(-50%) scale(1)',
                transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
                opacity: shuffling ? 0.7 : 1,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className="w-full h-full rounded-3xl overflow-hidden"
                style={{ border: '2px solid var(--border-indigo)', backgroundColor: 'var(--bg-surface)', boxShadow: '0 32px 80px rgba(79,70,229,0.18)' }}
              >
                <img src={IMAGES[center].src} alt={IMAGES[center].label} className="w-full h-full object-cover object-top" />
              </div>
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)', color: '#fff' }}
              >
                {IMAGES[center].label}
              </div>
            </div>

            {/* RIGHT */}
            <div
              className="absolute"
              style={{
                right: '0%',
                bottom: '0',
                width: '260px',
                height: '360px',
                zIndex: 1,
                transform: shuffling
                  ? 'rotate(10deg) translateX(10px) scale(0.88) translateY(20px)'
                  : 'rotate(8deg) translateX(0px) scale(0.9)',
                transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
                opacity: shuffling ? 0.5 : 0.85,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className="w-full h-full rounded-3xl overflow-hidden"
                style={{ border: '2px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}
              >
                <img src={IMAGES[right].src} alt={IMAGES[right].label} className="w-full h-full object-cover object-top" />
              </div>
              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                {IMAGES[right].label}
              </div>
            </div>

            {/* Dots */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {IMAGES.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: imgOrder[1] === i ? '20px' : '6px',
                    height: '6px',
                    backgroundColor: imgOrder[1] === i ? 'var(--indigo)' : 'var(--border)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Metrics ── */}
        <div
          ref={metricsRef}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-16 md:mt-20 pt-8 md:pt-10 w-full"
          style={{ ...fade(500), borderTop: '1px solid var(--border)' }}
        >
          {METRICS.map((m) => (
            <MetricItem key={m.label} metric={m} started={metricsStarted} />
          ))}
        </div>
      </div>
    </section>
  );
}
