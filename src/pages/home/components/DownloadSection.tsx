import { useScrollReveal } from '@/hooks/useScrollReveal';
import { assetPath } from '@/utils/assetPath';

const PHONE_DASHBOARD = assetPath('phone-dashboard.svg');
const PHONE_RECORDING = assetPath('phone-recording.svg');

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
                  src={PHONE_DASHBOARD}
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
                  src={PHONE_RECORDING}
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
            <div className="pill-badge mb-6">
              <i className="ri-smartphone-line" />
              Jetzt verfügbar
            </div>

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
                className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: '1px solid var(--border)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-indigo)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                }}
              >
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{ color: 'var(--text-heading)' }}>
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Laden im</div>
                  <div className="text-sm font-bold whitespace-nowrap" style={{ color: 'var(--text-heading)' }}>App Store</div>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: '1px solid var(--border)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-indigo)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                }}
              >
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-11.96-3.24-3.24L3.18 23.76z" fill="#EA4335"/>
                    <path d="M22.14 10.5l-3.06-1.74-3.6 3.42 3.6 3.42 3.09-1.74c.87-.51.87-1.86-.03-2.36z" fill="#FBBC04"/>
                    <path d="M3.18.24C2.85.42 2.64.78 2.64 1.26v21.48c0 .48.21.84.54 1.02l12.36-11.76L3.18.24z" fill="#4285F4"/>
                    <path d="M4.17.04L16.53 12 13.29 15.24.69.24C.99.08 1.35.04 1.71.04c.84 0 1.68.42 2.46 0z" fill="#34A853"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Jetzt bei</div>
                  <div className="text-sm font-bold whitespace-nowrap" style={{ color: 'var(--text-heading)' }}>Google Play</div>
                </div>
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
