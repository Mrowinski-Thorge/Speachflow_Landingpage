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
            <i className="ri-shield-check-line" />
            Rechtliches
          </div>
          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 break-words"
            style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
          >
            Datenschutz&shy;erklärung
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Zuletzt aktualisiert: April 2026
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
              <p>Gerhart-Hauptmann-Ring 7J</p>
              <p>21629 Neu Wulmstorf, Deutschland</p>
              <p className="mt-2">E-Mail: legacy@speachflow.app</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              2. Hosting und Infrastruktur
            </h2>
            <p className="mb-4">
              Unsere Website wird bei <strong style={{ color: 'var(--text-heading)' }}>Vercel Inc.</strong> gehostet (340 S Lemon Ave #4133, Walnut, CA 91789, USA). Vercel verarbeitet personenbezogene Daten (z. B. IP-Adressen, Zugriffszeiten) als Auftragsverarbeiter im Rahmen der Website-Bereitstellung. Wir haben mit Vercel einen Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO abgeschlossen. Die Datenübertragung in die USA erfolgt auf Basis von Standardvertragsklauseln (SCCs) gemäß Art. 46 Abs. 2 lit. c DSGVO.
            </p>
            <p>
              Unser Backend und die Datenbank werden bei <strong style={{ color: 'var(--text-heading)' }}>Supabase Inc.</strong> betrieben. Die Datenbank-Server befinden sich in der Region <strong style={{ color: 'var(--text-heading)' }}>Europa (Frankfurt, eu-central-1)</strong>. Alle personenbezogenen Daten werden ausschließlich auf Servern innerhalb der Europäischen Union gespeichert und verarbeitet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              3. Erhebung und Verarbeitung personenbezogener Daten
            </h2>
            <p className="mb-4">
              Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Dienste erforderlich ist oder du ausdrücklich eingewilligt hast.
            </p>
            <p className="mb-4">
              <strong style={{ color: 'var(--text-heading)' }}>Sprachaufnahmen (Live-Test):</strong> Wenn du die Live-Demo auf der Website nutzt, werden Sprachaufnahmen temporär verarbeitet, um dir KI-Feedback zu geben. Diese Aufnahmen werden <strong style={{ color: 'var(--text-heading)' }}>nicht dauerhaft gespeichert</strong> und nach der Analyse sofort gelöscht. Es werden keine Audioaufnahmen auf unseren Servern oder bei Drittanbietern persistiert.
            </p>
            <p className="mb-4">
              <strong style={{ color: 'var(--text-heading)' }}>Nutzungsdaten (Rate-Limit):</strong> Um Missbrauch der Live-Demo zu verhindern, speichern wir einen anonymisierten Session-Hash (keine IP-Adresse, kein Name) sowie einen Zähler der genutzten Analysen pro Tag. Diese Daten werden nach Ablauf des Tages automatisch zurückgesetzt.
            </p>
            <p>
              <strong style={{ color: 'var(--text-heading)' }}>Waitlist-E-Mail:</strong> Wenn du dich für die Warteliste anmeldest, speichern wir deine E-Mail-Adresse, um dich über den App-Launch zu informieren. Du kannst dich jederzeit über den Abmelde-Link in jeder E-Mail oder per E-Mail an legacy@speachflow.app abmelden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              4. Cookies und Tracking
            </h2>
            <p className="mb-4">
              Wir verwenden ausschließlich <strong style={{ color: 'var(--text-heading)' }}>technisch notwendige Cookies</strong>, die für den Betrieb der Website erforderlich sind:
            </p>
            <ul className="space-y-2 list-none mb-4">
              {[
                'Cookie-Einwilligungsstatus (Speicherung deiner Zustimmung zur Cookie-Nutzung)',
                'Session-Cookies (zur Aufrechterhaltung der Website-Funktionalität)',
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
            <p className="mb-4">
              Wir verwenden <strong style={{ color: 'var(--text-heading)' }}>keine Analyse- oder Marketing-Cookies</strong> (kein Google Analytics, kein Facebook Pixel, kein Tracking von Drittanbietern). Es findet kein Profiling oder automatisierte Entscheidungsfindung statt.
            </p>
            <p>
              Du kannst deine Cookie-Einstellungen jederzeit über den Link in der Fußzeile dieser Website ändern oder widerrufen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              5. KI-Dienste und EU AI Act
            </h2>
            <p className="mb-4">
              Zur Analyse deiner Sprachaufnahmen nutzen wir <strong style={{ color: 'var(--text-heading)' }}>Google Gemini 2.5 Flash Lite</strong> über die Google Cloud Platform (Vertex AI Enterprise). Die Sprachanalyse erfolgt <strong style={{ color: 'var(--text-heading)' }}>ausschließlich in der Region Frankfurt (Deutschland, europe-west3)</strong> – deine Daten verlassen die Europäische Union nicht.
            </p>
            <p className="mb-4">
              Durch die Nutzung von <strong style={{ color: 'var(--text-heading)' }}>Vertex AI Enterprise</strong> gelten erweiterte Datenschutzgarantien: Deine Daten werden <strong style={{ color: 'var(--text-heading)' }}>nicht zum Training globaler Google-KI-Modelle</strong> verwendet. Google verarbeitet die Daten ausschließlich zur Erbringung des Dienstes im Rahmen des Auftragsverarbeitungsvertrags.
            </p>
            <p className="mb-4">
              Rechtliche Grundlagen und weiterführende Informationen:
            </p>
            <ul className="space-y-2 list-none mb-4">
              {[
                { text: 'Google Cloud Privacy Notice', href: 'https://cloud.google.com/terms/cloud-privacy-notice' },
                { text: 'Vertex AI Data Governance', href: 'https://cloud.google.com/vertex-ai/docs/generative-ai/data-governance' },
              ].map((link) => (
                <li key={link.href} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'var(--blue-light)' }}
                  >
                    <i className="ri-external-link-line text-xs" style={{ color: 'var(--indigo)' }} />
                  </div>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="font-medium" style={{ color: 'var(--indigo)' }}>{link.text}</a>
                </li>
              ))}
            </ul>
            <p className="mb-4">
              Gemäß dem <strong style={{ color: 'var(--text-heading)' }}>EU AI Act (Verordnung (EU) 2024/1689)</strong> informieren wir dich, dass:
            </p>
            <ul className="space-y-2 list-none mb-4">
              {[
                'Die Sprachanalyse durch KI erfolgt ausschließlich zu deiner persönlichen Weiterbildung und Selbstverbesserung.',
                'Die KI gibt kein medizinisches, rechtliches oder berufliches Gutachten ab.',
                'Du hast jederzeit die Möglichkeit, die KI-Analyse abzulehnen und stattdessen manuelles Feedback zu nutzen.',
                'Die KI-Systeme werden regelmäßig auf Fairness, Transparenz und Datenschutzkonformität geprüft.',
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
            <p>
              Wir haben mit Google einen Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO abgeschlossen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              6. Rechtsgrundlagen der Verarbeitung
            </h2>
            <p className="mb-4">
              Die Verarbeitung deiner Daten erfolgt auf Basis folgender Rechtsgrundlagen gemäß DSGVO:
            </p>
            <ul className="space-y-2 list-none">
              {[
                'Art. 6 Abs. 1 lit. a DSGVO – Einwilligung (z. B. Cookie-Banner, Waitlist-Anmeldung)',
                'Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung (App-Nutzung nach Registrierung)',
                'Art. 6 Abs. 1 lit. f DSGVO – Berechtigte Interessen (Rate-Limit zur Missbrauchsprävention)',
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
              7. Datenspeicherung und -sicherheit
            </h2>
            <p className="mb-4">
              Alle personenbezogenen Daten werden ausschließlich auf Servern innerhalb der Europäischen Union gespeichert (Supabase Frankfurt). Wir setzen technische und organisatorische Maßnahmen ein, um deine Daten vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen.
            </p>
            <p>
              Die Übertragung deiner Daten erfolgt verschlüsselt über HTTPS/TLS. Sprachaufnahmen werden nach der Analyse sofort und unwiderruflich gelöscht.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              8. Deine Rechte
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
              Zur Ausübung deiner Rechte wende dich an: <a href="mailto:legacy@speachflow.app" className="font-semibold" style={{ color: 'var(--indigo)' }}>legacy@speachflow.app</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              9. Beschwerderecht
            </h2>
            <p>
              Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die zuständige Behörde für Niedersachsen ist der <strong style={{ color: 'var(--text-heading)' }}>Landesbeauftragte für den Datenschutz Niedersachsen</strong> (Prinzenstraße 5, 30159 Hannover).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              10. Änderungen dieser Datenschutzerklärung
            </h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die aktuelle Version ist stets auf dieser Seite abrufbar. Bei wesentlichen Änderungen informieren wir dich per E-Mail oder auf der Website.
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