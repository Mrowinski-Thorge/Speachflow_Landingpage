import { useEffect, useRef, useState, useCallback } from 'react';

const features = [
  {
    icon: 'ri-mic-2-line',
    title: 'Sprachanalyse',
    description: 'KI erkennt Tonfall, Sprechtempo, Pausen und Füllwörter in Echtzeit. Präzises Feedback zu jeder Silbe.',
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.08)',
  },
  {
    icon: 'ri-body-scan-line',
    title: 'Haltungs-Tracking',
    description: 'Körpersprache und Gestik werden analysiert. Lerne, selbstbewusst aufzutreten und überzeugend zu wirken.',
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.08)',
  },
  {
    icon: 'ri-emotion-line',
    title: 'Mimik-Erkennung',
    description: 'Augenkontakt, Lächeln und Emotionen werden ausgewertet. Wirke authentisch und verbinde dich mit deinem Publikum.',
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.08)',
  },
  {
    icon: 'ri-flashlight-line',
    title: 'Sofort-Feedback',
    description: 'Während du sprichst, erhältst du sofortige Tipps. Verbessere dich live, nicht erst danach.',
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.08)',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(-1);
  const [headingVisible, setHeadingVisible] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeadingVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollRange = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollRange));
      // Start showing cards from progress=0 (as soon as sticky kicks in)
      // Map 0..1 across 4 cards, but start first card early
      const idx = Math.min(features.length - 1, Math.floor(progress * features.length));
      setActiveCard(idx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      {/* ── DESKTOP ── */}
      <div
        className="hidden md:block"
        style={{ minHeight: `${features.length * 100 + 80}vh` }}
      >
        <div
          className="sticky top-0 flex items-center overflow-hidden"
          style={{ height: '100vh' }}
        >
          <div className="w-full max-w-[1160px] mx-auto px-12 flex items-center gap-24">

            {/* Left heading */}
            <div ref={headingRef} className="flex-shrink-0" style={{ width: '380px' }}>
              <h2
                className="font-bold tracking-tight leading-tight mb-5"
                style={{
                  color: 'var(--text-heading)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(36px, 3.6vw, 54px)',
                  letterSpacing: '-0.02em',
                }}
              >
                Alles, was du brauchst,
                <br />
                <span className="relative inline-block" style={{
                  background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  um besser zu werden.
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.6) 50%, transparent 75%)',
                      backgroundSize: '250% 100%',
                      animation: headingVisible ? 'shimmerSlide 1.8s ease-out 0.3s forwards' : 'none',
                      opacity: 0,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                    }}
                  />
                </span>
              </h2>
              <p className="mb-10" style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px' }}>
                KI-Technologie trifft auf echtes Feedback – für jeden, der überzeugend sprechen will.
              </p>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {features.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-500"
                    style={{
                      width: activeCard === i ? '28px' : '7px',
                      height: '7px',
                      backgroundColor: activeCard === i ? 'var(--indigo)' : 'var(--border)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right: stacked cards */}
            <div className="flex-1 relative" style={{ height: '400px' }}>
              {features.map((feature, i) => {
                const isVisible = i <= activeCard;
                const stackDepth = activeCard - i;

                // Per-card directional offsets — fan/spread effect
                const cardOffsets = [
                  { x:   0, y:   0, rot:  0   },  // depth 0 = active: center
                  { x:  88, y:  24, rot:  4.5 },  // depth 1: far right + slightly down
                  { x: -88, y: -36, rot: -5   },  // depth 2: far left + up
                  { x:   0, y:  60, rot:  1.5 },  // depth 3: center + far down
                ];

                const offset = cardOffsets[Math.min(stackDepth, 3)];
                const scale = 1 - stackDepth * 0.05;
                const opacity = stackDepth > 2 ? 0 : 1 - stackDepth * 0.2;

                return (
                  <div
                    key={feature.title}
                    className="absolute inset-0 rounded-3xl flex flex-col"
                    style={{
                      padding: '48px 52px',
                      backgroundColor: 'var(--bg-base)',
                      border: `1.5px solid ${i === activeCard ? 'var(--border-indigo)' : 'var(--border)'}`,
                      transform: isVisible
                        ? `translateX(${offset.x}px) translateY(${offset.y}px) scale(${scale}) rotate(${offset.rot}deg)`
                        : 'translateY(220px) scale(0.88)',
                      opacity: isVisible ? opacity : 0,
                      transition: isVisible
                        ? 'transform 0.85s cubic-bezier(0.22,1.1,0.36,1), opacity 0.65s ease'
                        : 'transform 0s, opacity 0s',
                      zIndex: i + 1,
                      pointerEvents: i === activeCard ? 'auto' : 'none',
                    }}
                  >
                    {/* Icon centered top */}
                    <div className="flex justify-center mb-8">
                      <div
                        className="w-20 h-20 flex items-center justify-center rounded-2xl"
                        style={{ backgroundColor: feature.bg }}
                      >
                        <i className={`${feature.icon} text-4xl`} style={{ color: feature.color }} />
                      </div>
                    </div>

                    <h3
                      className="font-bold mb-5 text-center"
                      style={{
                        color: 'var(--text-heading)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '32px',
                        letterSpacing: '-0.02em',
                        lineHeight: '1.15',
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="flex-1 text-center"
                      style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.85',
                        fontSize: '17px',
                        maxWidth: '420px',
                        margin: '0 auto',
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* ── MOBILE: auto-scroll slider ── */}
      <div className="md:hidden" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
        <div ref={headingRef} className="text-center px-6 mb-10">
          <h2
            className="font-bold tracking-tight leading-tight mb-4"
            style={{
              color: 'var(--text-heading)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(26px, 7vw, 36px)',
              letterSpacing: '-0.02em',
            }}
          >
            Alles, was du brauchst,
            <br />
            <span className="relative inline-block" style={{
              background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              um besser zu werden.
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.6) 50%, transparent 75%)',
                  backgroundSize: '250% 100%',
                  animation: headingVisible ? 'shimmerSlide 1.8s ease-out 0.3s forwards' : 'none',
                  opacity: 0,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
              />
            </span>
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}>
            KI-Technologie trifft auf echtes Feedback.
          </p>
        </div>

        <MobileSlider />
      </div>

      <style>{`
        @keyframes shimmerSlide {
          0%   { opacity: 0; background-position: 160% center; }
          15%  { opacity: 1; }
          100% { opacity: 0; background-position: -60% center; }
        }
      `}</style>
    </section>
  );
}

function MobileSlider() {
  const [current, setCurrent] = useState(0);
  const startXRef = useRef(0);
  const dragging = useRef(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const directionRef = useRef<1 | -1>(1);

  const go = useCallback((idx: number) => {
    setCurrent(Math.max(0, Math.min(features.length - 1, idx)));
  }, []);

  const resetAutoScroll = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      setCurrent(prev => {
        const next = prev + directionRef.current;
        if (next >= features.length) {
          directionRef.current = -1;
          return prev - 1;
        }
        if (next < 0) {
          directionRef.current = 1;
          return prev + 1;
        }
        return next;
      });
    }, 5000);
  }, []);

  useEffect(() => {
    resetAutoScroll();
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [resetAutoScroll]);

  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    dragging.current = true;
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    const diff = startXRef.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      const next = current + 1;
      if (next < features.length) {
        go(next);
        directionRef.current = 1;
      } else {
        directionRef.current = -1;
      }
    } else if (diff < -40) {
      const prev = current - 1;
      if (prev >= 0) {
        go(prev);
        directionRef.current = -1;
      } else {
        directionRef.current = 1;
      }
    }
    dragging.current = false;
    resetAutoScroll();
  };

  const handleNav = (idx: number) => {
    go(idx);
    directionRef.current = idx > current ? 1 : -1;
    resetAutoScroll();
  };

  return (
    <div>
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(calc(-${current * 100}vw))`,
            transition: 'transform 0.45s cubic-bezier(0.34,1.2,0.64,1)',
            willChange: 'transform',
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="flex-shrink-0 px-6"
              style={{ width: '100vw' }}
            >
              <div
                className="rounded-3xl flex flex-col items-center text-center"
                style={{
                  padding: '40px 32px',
                  backgroundColor: 'var(--bg-base)',
                  border: `1.5px solid ${i === current ? 'var(--border-indigo)' : 'var(--border)'}`,
                  minHeight: '280px',
                }}
              >
                {/* Icon centered */}
                <div
                  className="w-18 h-18 flex items-center justify-center rounded-2xl mb-7"
                  style={{ backgroundColor: feature.bg, width: '72px', height: '72px' }}
                >
                  <i className={`${feature.icon} text-3xl`} style={{ color: feature.color }} />
                </div>
                <h3
                  className="font-bold mb-4"
                  style={{
                    color: 'var(--text-heading)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '26px',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.2',
                  }}
                >
                  {feature.title}
                </h3>
                <p className="flex-1" style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px' }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-5 mt-7">
        <button
          onClick={() => handleNav(current - 1)}
          disabled={current === 0}
          className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap"
          style={{
            backgroundColor: current === 0 ? 'var(--bg-muted)' : 'var(--blue-light)',
            color: current === 0 ? 'var(--text-muted)' : 'var(--indigo)',
            border: '1px solid var(--border)',
            opacity: current === 0 ? 0.35 : 1,
          }}
        >
          <i className="ri-arrow-left-s-line text-lg" />
        </button>

        <div className="flex items-center gap-2">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => handleNav(i)}
              className="rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: current === i ? '22px' : '7px',
                height: '7px',
                backgroundColor: current === i ? 'var(--indigo)' : 'var(--border)',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => handleNav(current + 1)}
          disabled={current === features.length - 1}
          className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap"
          style={{
            backgroundColor: current === features.length - 1 ? 'var(--bg-muted)' : 'var(--blue-light)',
            color: current === features.length - 1 ? 'var(--text-muted)' : 'var(--indigo)',
            border: '1px solid var(--border)',
            opacity: current === features.length - 1 ? 0.35 : 1,
          }}
        >
          <i className="ri-arrow-right-s-line text-lg" />
        </button>
      </div>
    </div>
  );
}
