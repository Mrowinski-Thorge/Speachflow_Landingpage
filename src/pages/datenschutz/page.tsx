import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const DATENSCHUTZ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://speachflow.app/datenschutz',
  url: 'https://speachflow.app/datenschutz',
  name: 'Datenschutzerklärung – SpeachFlow',
  description: 'Datenschutzerklärung der SpeachFlow GmbH gemäß DSGVO. Informationen zur Erhebung, Verarbeitung und Speicherung personenbezogener Daten.',
  inLanguage: 'de-DE',
  isPartOf: { '@id': 'https://speachflow.app/#website' },
};

export default function DatenschutzPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Datenschutzerklärung – SpeachFlow';

    // noindex for legal pages
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

    const id = 'jsonld-datenschutz';
    if (!document.getElementById(id)) {
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(DATENSCHUTZ_JSONLD);
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
              src="https://static.readdy.ai/image/c22c690b3fad44e0f4e8b70799dbf390/8efff0df91d4bff17be966e52d6bcb60.png"
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
            <i className="ri-shield-check-line" />
            Rechtliches
          </div>
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
          >
            Datenschutzerklärung
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Zuletzt aktualisiert: Januar 2025
          </p>
        </div>

        <div className="space-y-10" style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px' }}>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              1. Verantwortlicher
            </h2>
            <p>
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
            </p>
            <div
              className="mt-4 p-5 rounded-2xl"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <p className="font-semibold" style={{ color: 'var(--text-heading)' }}>SpeachFlow GmbH</p>
              <p>Musterstraße 1</p>
              <p>10115 Berlin, Deutschland</p>
              <p className="mt-2">E-Mail: datenschutz@speachflow.app</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              2. Erhebung und Verarbeitung personenbezogener Daten
            </h2>
            <p className="mb-4">
              Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Dienste erforderlich ist oder du ausdrücklich eingewilligt hast.
            </p>
            <p className="mb-4">
              <strong style={{ color: 'var(--text-heading)' }}>Sprachaufnahmen:</strong> Wenn du die Live-Demo oder die App nutzt, werden Sprachaufnahmen temporär verarbeitet, um dir KI-Feedback zu geben. Diese Aufnahmen werden <strong style={{ color: 'var(--text-heading)' }}>nicht dauerhaft gespeichert</strong> und nach der Analyse sofort gelöscht.
            </p>
            <p>
              <strong style={{ color: 'var(--text-heading)' }}>Nutzungsdaten:</strong> Wir erfassen anonymisierte Nutzungsstatistiken (z. B. Seitenaufrufe, Gerättyp) zur Verbesserung unserer Dienste. Diese Daten lassen keinen Rückschluss auf deine Person zu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              3. Rechtsgrundlagen der Verarbeitung
            </h2>
            <p className="mb-4">
              Die Verarbeitung deiner Daten erfolgt auf Basis folgender Rechtsgrundlagen gemäß DSGVO:
            </p>
            <ul className="space-y-2 list-none">
              {[
                'Art. 6 Abs. 1 lit. a DSGVO – Einwilligung',
                'Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung',
                'Art. 6 Abs. 1 lit. f DSGVO – Berechtigte Interessen',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'var(--blue-light)' }}
                  >
                    <i className="ri-check-line text-xs" style={{ color: 'var(--indigo)' }} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              4. Datenspeicherung und -sicherheit
            </h2>
            <p className="mb-4">
              Alle Daten werden ausschließlich auf Servern innerhalb der Europäischen Union gespeichert. Wir setzen technische und organisatorische Maßnahmen ein, um deine Daten vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen.
            </p>
            <p>
              Die Übertragung deiner Daten erfolgt verschlüsselt über HTTPS/TLS. Sprachaufnahmen werden nach der Analyse sofort und unwiderruflich gelöscht.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              5. Drittanbieter und KI-Dienste
            </h2>
            <p className="mb-4">
              Zur Analyse deiner Sprachaufnahmen nutzen wir <strong style={{ color: 'var(--text-heading)' }}>Google Gemini 2.5 Flash</strong> (Vertex AI). Die Verarbeitung erfolgt gemäß den Datenschutzbestimmungen von Google und den Anforderungen der DSGVO.
            </p>
            <p>
              Wir haben mit Google einen Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO abgeschlossen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              6. Deine Rechte
            </h2>
            <p className="mb-4">Du hast folgende Rechte bezüglich deiner personenbezogenen Daten:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: 'ri-eye-line', title: 'Auskunftsrecht', desc: 'Informationen über gespeicherte Daten' },
                { icon: 'ri-edit-line', title: 'Berichtigungsrecht', desc: 'Korrektur unrichtiger Daten' },
                { icon: 'ri-delete-bin-line', title: 'Löschungsrecht', desc: 'Löschung deiner Daten' },
                { icon: 'ri-pause-circle-line', title: 'Einschränkungsrecht', desc: 'Einschränkung der Verarbeitung' },
                { icon: 'ri-download-line', title: 'Datenübertragbarkeit', desc: 'Export deiner Daten' },
                { icon: 'ri-close-circle-line', title: 'Widerspruchsrecht', desc: 'Widerspruch gegen Verarbeitung' },
              ].map((right) => (
                <div
                  key={right.title}
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <i className={`${right.icon} text-sm`} style={{ color: 'var(--indigo)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>{right.title}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{right.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              Zur Ausübung deiner Rechte wende dich an: <a href="mailto:datenschutz@speachflow.app" className="font-semibold" style={{ color: 'var(--indigo)' }}>datenschutz@speachflow.app</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              7. Beschwerderecht
            </h2>
            <p>
              Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die zuständige Behörde für Berlin ist der <strong style={{ color: 'var(--text-heading)' }}>Berliner Beauftragte für Datenschutz und Informationsfreiheit</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              8. Änderungen dieser Datenschutzerklärung
            </h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die aktuelle Version ist stets auf dieser Seite abrufbar. Bei wesentlichen Änderungen informieren wir dich per E-Mail oder In-App-Benachrichtigung.
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
            <Link to="/impressum" className="text-xs transition-colors duration-150" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--indigo)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}
            >Impressum</Link>
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
