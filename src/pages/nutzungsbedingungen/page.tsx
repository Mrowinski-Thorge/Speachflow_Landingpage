import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assetPath } from '@/utils/assetPath';

const LOGO_SRC = assetPath('logo.svg');

export default function NutzungsbedingungenPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
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
              src={LOGO_SRC}
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
            <i className="ri-file-text-line" />
            Rechtliches
          </div>
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
          >
            Nutzungsbedingungen
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Zuletzt aktualisiert: Januar 2025
          </p>
        </div>

        <div className="space-y-10" style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px' }}>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              1. Geltungsbereich
            </h2>
            <p>
              Diese Nutzungsbedingungen gelten für die Nutzung der SpeachFlow-App und der Website speachflow.app (nachfolgend &ldquo;Dienst&rdquo;), betrieben von der SpeachFlow GmbH, Musterstraße 1, 10115 Berlin (nachfolgend &ldquo;wir&rdquo; oder &ldquo;SpeachFlow&rdquo;).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              2. Leistungsbeschreibung
            </h2>
            <p className="mb-4">
              SpeachFlow ist eine KI-gestützte Anwendung zur Verbesserung von Präsentations- und Sprechfähigkeiten. Der Dienst umfasst:
            </p>
            <ul className="space-y-2">
              {[
                'Echtzeit-Analyse von Sprachaufnahmen mittels KI',
                'Feedback zu Sprechtempo, Tonfall, Pausen und Füllwörtern',
                'Analyse von Körpersprache und Mimik (Premium)',
                'Fortschritts-Tracking und Statistiken',
                'Verschiedene Übungsszenarien',
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
              3. Registrierung und Nutzerkonto
            </h2>
            <p className="mb-4">
              Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich. Du bist verpflichtet, bei der Registrierung wahrheitsgemäße Angaben zu machen und deine Zugangsdaten sicher aufzubewahren.
            </p>
            <p>
              Du bist für alle Aktivitäten verantwortlich, die unter deinem Konto stattfinden. Bei Verdacht auf unbefugten Zugriff informiere uns bitte umgehend unter <a href="mailto:hallo@speachflow.app" className="font-semibold" style={{ color: 'var(--indigo)' }}>hallo@speachflow.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              4. Nutzungsrechte und -beschränkungen
            </h2>
            <p className="mb-4">
              Wir gewähren dir ein nicht-exklusives, nicht übertragbares Recht zur Nutzung des Dienstes für persönliche, nicht-kommerzielle Zwecke.
            </p>
            <div
              className="p-5 rounded-2xl"
              style={{ backgroundColor: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}
            >
              <p className="text-sm font-bold mb-3" style={{ color: '#ef4444' }}>Folgendes ist untersagt:</p>
              <ul className="space-y-1.5 text-sm">
                {[
                  'Reverse Engineering oder Dekompilierung der App',
                  'Automatisiertes Auslesen von Daten (Scraping)',
                  'Nutzung für illegale oder schädliche Zwecke',
                  'Weitergabe von Zugangsdaten an Dritte',
                  'Umgehung von Sicherheitsmaßnahmen',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <i className="ri-close-line text-xs mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              5. Preise und Zahlungsbedingungen
            </h2>
            <p className="mb-4">
              SpeachFlow bietet sowohl kostenlose als auch kostenpflichtige Pläne an. Die aktuellen Preise sind auf unserer Website einsehbar.
            </p>
            <p className="mb-4">
              Kostenpflichtige Abonnements werden monatlich oder jährlich abgerechnet. Die Zahlung erfolgt im Voraus. Du kannst dein Abonnement jederzeit zum Ende des Abrechnungszeitraums kündigen.
            </p>
            <p>
              Bei jährlicher Abrechnung erfolgt keine anteilige Rückerstattung für nicht genutzte Monate, sofern kein gesetzliches Widerrufsrecht besteht.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              6. Widerrufsrecht
            </h2>
            <p className="mb-4">
              Als Verbraucher hast du das Recht, innerhalb von 14 Tagen ohne Angabe von Gründen von diesem Vertrag zurückzutreten. Die Widerrufsfrist beträgt 14 Tage ab dem Tag des Vertragsabschlusses.
            </p>
            <p>
              Um dein Widerrufsrecht auszuüben, teile uns deine Entscheidung per E-Mail an <a href="mailto:hallo@speachflow.app" className="font-semibold" style={{ color: 'var(--indigo)' }}>hallo@speachflow.app</a> mit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              7. Haftungsbeschränkung
            </h2>
            <p className="mb-4">
              SpeachFlow haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für vorsätzliche oder grob fahrlässige Pflichtverletzungen.
            </p>
            <p>
              Für leicht fahrlässige Verletzungen wesentlicher Vertragspflichten haftet SpeachFlow auf den vorhersehbaren, vertragstypischen Schaden begrenzt. Im Übrigen ist die Haftung für leichte Fahrlässigkeit ausgeschlossen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              8. Änderungen der Nutzungsbedingungen
            </h2>
            <p>
              Wir behalten uns vor, diese Nutzungsbedingungen zu ändern. Über wesentliche Änderungen informieren wir dich mindestens 30 Tage im Voraus per E-Mail. Wenn du dem Dienst nach Inkrafttreten der Änderungen weiterhin nutzt, gilt dies als Zustimmung zu den neuen Bedingungen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              9. Anwendbares Recht und Gerichtsstand
            </h2>
            <p>
              Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist Berlin, sofern du Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen bist.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}>
              10. Kontakt
            </h2>
            <p>
              Bei Fragen zu diesen Nutzungsbedingungen wende dich an:{' '}
              <a href="mailto:hallo@speachflow.app" className="font-semibold" style={{ color: 'var(--indigo)' }}>
                hallo@speachflow.app
              </a>
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
            <Link to="/impressum" className="text-xs transition-colors duration-150" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--indigo)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}
            >Impressum</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
