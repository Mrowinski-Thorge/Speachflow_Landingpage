import { useEffect } from 'react';
import { Link } from 'react-router-dom';


const IMPRESSUM_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://speachflow.app/impressum',
  url: 'https://speachflow.app/impressum',
  name: 'Impressum – SpeachFlow',
  description: 'Impressum der SpeachFlow GmbH gemäß § 5 TMG. Unternehmensangaben, Kontakt und rechtliche Informationen.',
  inLanguage: 'de-DE',
  isPartOf: { '@id': 'https://speachflow.app/#website' },
};

export default function ImpressumPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Impressum – SpeachFlow';

    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const prevRobots = robotsMeta?.content ?? '';
    if (robotsMeta) {
      robotsMeta.content = 'noindex, follow';
    } else {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      robotsMeta.content = 'noindex, follow';
      document.head.appendChild(robotsMeta);
    }

    const id = 'jsonld-impressum';
    if (!document.getElementById(id)) {
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(IMPRESSUM_JSONLD);
      document.head.appendChild(script);
    }

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
      if (robotsMeta) robotsMeta.content = prevRobots || 'index, follow';
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-50 px-6 md:px-8"
        style={{
          backgroundColor: 'rgba(245,247,255,0.90)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-[1100px] mx-auto h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer">
            <img
              src="/logo.png"
              alt="SpeachFlow"
              className="h-9 w-auto"
            />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium cursor-pointer transition-colors duration-150"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--indigo)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'; }}
          >
            <i className="ri-arrow-left-line" />
            Zurück zur Startseite
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[760px] mx-auto px-6 md:px-8 py-20">
        <div className="mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            style={{ backgroundColor: 'var(--blue-light)', color: 'var(--indigo)' }}
          >
            <i className="ri-building-line" />
            Rechtliches
          </div>
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
          >
            Impressum
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Angaben gemäß § 5 TMG
          </p>
        </div>

        <div className="space-y-10" style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px' }}>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              Unternehmensangaben
            </h2>
            <div
              className="p-6 rounded-2xl space-y-2"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <p className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>SpeachFlow GmbH</p>
              <p>Gerhart-Hauptmann-Ring 7J</p>
              <p>21629 Neu Wulmstorf</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              Kontakt
            </h2>
            <div className="space-y-3">
              {[
                { icon: 'ri-mail-line', label: 'E-Mail', value: 'legacy@speachflow.app' },
                { icon: 'ri-global-line', label: 'Website', value: 'www.speachflow.app' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--blue-light)' }}
                  >
                    <i className={`${item.icon} text-base`} style={{ color: 'var(--indigo)' }} />
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              Geschäftsführung
            </h2>
            <div
              className="p-6 rounded-2xl"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <p className="font-semibold" style={{ color: 'var(--text-heading)' }}>Thorge Mrowinski</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Geschäftsführer</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              Verantwortlich für den Inhalt
            </h2>
            <p>
              Verantwortlich für den Inhalt gemäß § 55 Abs. 2 RStV:
            </p>
            <div
              className="mt-4 p-6 rounded-2xl"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <p className="font-semibold" style={{ color: 'var(--text-heading)' }}>Thorge Mrowinski</p>
              <p>Gerhart-Hauptmann-Ring 7J</p>
              <p>21629 Neu Wulmstorf</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              Streitschlichtung
            </h2>
            <p className="mb-4">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="font-semibold"
                style={{ color: 'var(--indigo)' }}
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              Haftungsausschluss
            </h2>
            <p className="mb-4">
              <strong style={{ color: 'var(--text-heading)' }}>Haftung für Inhalte:</strong> Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
            </p>
            <p>
              <strong style={{ color: 'var(--text-heading)' }}>Haftung für Links:</strong> Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-6 md:px-8 py-8 mt-8"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-[760px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© 2025 SpeachFlow GmbH</p>
          <div className="flex gap-5">
            <Link to="/datenschutz" className="text-xs transition-colors duration-150" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--indigo)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}
            >Datenschutz</Link>
            <Link to="/nutzungsbedingungen" className="text-xs transition-colors duration-150" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--indigo)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}
            >Nutzungsbedingungen</Link>
          </div>
        </div>
      </div>

    </div>
  );
}