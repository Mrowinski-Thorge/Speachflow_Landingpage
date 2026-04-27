import { useScrollReveal } from '@/hooks/useScrollReveal';

const STATS = [
  { value: '10K+', label: 'Aktive Nutzer' },
  { value: '4.8', label: 'App Store Rating' },
  { value: '100%', label: 'DSGVO-konform' },
];

export default function DownloadSection() {
  const ref = useScrollReveal();
  const imgRef = useScrollReveal();

  return (
    <section
      id="download"
      className="px-6 md:px-8 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-surface)', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left: App Screenshots */}
          <div ref={imgRef} className="section-reveal flex-1 flex justify-center relative">
            <div className="relative flex gap-4 items-end">
              {/* Phone 1 */}
              <div
                className="w-44 md:w-52 rounded-3xl overflow-hidden -rotate-6 transition-transform duration-500 hover:-rotate-3 hover:-translate-y-2"
                style={{ border: '1px solid var(--border)' }}
              >
                <img
                  src="https://readdy.ai/api/search-image?query=mobile%20app%20screen%20clean%20white%20UI%20showing%20speech%20coaching%20dashboard%20with%20circular%20score%20indicators%20indigo%20purple%20blue%20accent%20colors%20clean%20minimal%20modern%20interface%20presentation%20training%20analytics%20typography%20white%20background%20professional%20app%20design&width=208&height=420&seq=dl-phone-indigo-1&orientation=portrait"
                  alt="SpeachFlow Dashboard"
                  className="w-full h-auto object-top"
                />
              </div>
              {/* Phone 2 */}
              <div
                className="w-44 md:w-52 rounded-3xl overflow-hidden rotate-3 -mb-4 transition-transform duration-500 hover:rotate-1 hover:-translate-y-2"
                style={{ border: '1px solid var(--border)' }}
              >
                <img
                  src="https://readdy.ai/api/search-image?query=mobile%20app%20screen%20white%20light%20UI%20showing%20real-time%20AI%20feedback%20during%20presentation%20recording%20with%20waveform%20audio%20visualization%20microphone%20active%20state%20indigo%20blue%20purple%20accent%20colors%20white%20background%20modern%20minimal%20clean%20typography%20professional&width=208&height=420&seq=dl-phone-indigo-2&orientation=portrait"
                  alt="SpeachFlow Aufnahme"
                  className="w-full h-auto object-top"
                />
              </div>
            </div>

            {/* Glow */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-24 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse, rgba(79,70,229,0.12), transparent)',
                filter: 'blur(32px)',
              }}
            />
          </div>

          {/* Right: Text + Buttons */}
          <div ref={ref} className="section-reveal flex-1 max-w-lg">
            <h2
              className="text-4xl md:text-5xl font-bold mb-5 leading-tight tracking-tight"
              style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
            >
              Lade SpeachFlow
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                kostenlos herunter
              </span>
            </h2>

            <p
              className="text-base leading-relaxed mb-10"
              style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}
            >
              Verfügbar für iOS und Android. Starte noch heute mit deinem kostenlosen Plan und übe wann und wo du willst.
            </p>

            {/* Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <a
                href="#"
                className="transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-12 flex items-center"
              >
                <img
                  src="/App_Store_Download.svg"
                  alt="Im App Store herunterladen"
                  className="h-full w-auto"
                />
              </a>

              <a
                href="#"
                className="transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-12 flex items-center"
              >
                <img
                  src="/Play_Store_Download.png"
                  alt="Bei Google Play herunterladen"
                  className="h-full w-auto"
                />
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-2xl font-black mb-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
