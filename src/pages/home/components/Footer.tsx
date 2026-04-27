import { useScrollReveal } from '@/hooks/useScrollReveal';
import { openCookieBanner } from '@/components/feature/CookieBanner';

interface FooterLink {
  label: string;
  href: string;
  onClick?: () => void;
}

export default function Footer() {
  const ref = useScrollReveal();

  const legalLinks: FooterLink[] = [
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'Nutzungsbedingungen', href: '/nutzungsbedingungen' },
    { label: 'Impressum', href: '/impressum' },
    {
      label: 'Cookie-Einstellungen',
      href: '#',
      onClick: () => openCookieBanner(),
    },
  ];

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
                  className="transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <img
                    src="/App_Store_Download.svg"
                    alt="Im App Store herunterladen"
                    className="h-12 w-auto"
                  />
                </a>
                <a
                  href="#"
                  className="transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <img
                    src="/Play_Store_Download.png"
                    alt="Bei Google Play herunterladen"
                    className="h-12 w-auto"
                  />
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
              src="/logo.png"
              alt="SpeachFlow"
              className="h-11 w-auto"
            />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              KI-Präsentationstraining
            </span>
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap items-center gap-5">
            {legalLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs transition-colors duration-150 cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
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
