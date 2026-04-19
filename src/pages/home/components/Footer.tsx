import { useScrollReveal } from '@/hooks/useScrollReveal';
import { assetPath } from '@/utils/assetPath';

const LOGO_SRC = assetPath('logo.svg');

export default function Footer() {
  const ref = useScrollReveal();

  return (
    <footer style={{ backgroundColor: 'var(--bg-base)', borderTop: '1px solid var(--border)' }}>

      {/* Final CTA */}
      <div className="px-6 md:px-8" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <div ref={ref} className="section-reveal max-w-[1100px] mx-auto">
          <div
            className="rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
            }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
            />

            <div className="relative">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
              >
                <i className="ri-rocket-line" />
                Jetzt starten
              </div>

              <h2
                className="text-4xl md:text-5xl font-black mb-5 tracking-tight text-white"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Bereit, deine Präsentationen
                <br />
                auf das nächste Level zu bringen?
              </h2>
              <p className="text-base mb-10 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.70)', lineHeight: '1.75' }}>
                Starte jetzt kostenlos – keine Kreditkarte nötig.
              </p>

              {/* Store buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <a
                  href="#"
                  className="flex items-center justify-center gap-3 px-7 py-3.5 rounded-full font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap text-white"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.30)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.22)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.15)';
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="text-sm">App Store</span>
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center gap-3 px-7 py-3.5 rounded-full font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap text-indigo-700"
                  style={{ backgroundColor: 'white' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.92)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'white';
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-11.96-3.24-3.24L3.18 23.76z" fill="#EA4335"/>
                    <path d="M22.14 10.5l-3.06-1.74-3.6 3.42 3.6 3.42 3.09-1.74c.87-.51.87-1.86-.03-2.36z" fill="#FBBC04"/>
                    <path d="M3.18.24C2.85.42 2.64.78 2.64 1.26v21.48c0 .48.21.84.54 1.02l12.36-11.76L3.18.24z" fill="#4285F4"/>
                    <path d="M4.17.04L16.53 12 13.29 15.24.69.24C.99.08 1.35.04 1.71.04c.84 0 1.68.42 2.46 0z" fill="#34A853"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#4F46E5' }}>Google Play</span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { icon: 'ri-shield-check-line', text: 'DSGVO-konform' },
                  { icon: 'ri-map-pin-line', text: 'Daten in Europa' },
                  { icon: 'ri-lock-line', text: 'Ende-zu-Ende verschlüsselt' },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <i className={`${b.icon} text-sm`} style={{ color: 'rgba(255,255,255,0.85)' }} />
                    <span className="text-sm">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div
        className="max-w-[1100px] mx-auto px-6 md:px-8 py-8"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <img
              src={LOGO_SRC}
              alt="SpeachFlow"
              className="h-7 w-auto"
            />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              KI-Präsentationstraining
            </span>
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap items-center gap-5">
            {[
              { label: 'Datenschutz', href: '/datenschutz' },
              { label: 'Nutzungsbedingungen', href: '/nutzungsbedingungen' },
              { label: 'Impressum', href: '/impressum' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs transition-colors duration-150 cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--indigo)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2025 SpeachFlow GmbH · Made in Europe 🇪🇺
          </p>
        </div>
      </div>
    </footer>
  );
}
