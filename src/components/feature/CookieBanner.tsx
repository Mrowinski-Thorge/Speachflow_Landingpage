import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

export const COOKIE_CONSENT_KEY = 'speachflow_cookie_consent';

// Global event to open cookie banner from anywhere
export function openCookieBanner() {
  window.dispatchEvent(new CustomEvent('speachflow:open-cookie-banner'));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const checkAndShow = useCallback(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  useEffect(() => {
    checkAndShow();
  }, [checkAndShow]);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener('speachflow:open-cookie-banner', handler);
    return () => window.removeEventListener('speachflow:open-cookie-banner', handler);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString(),
      necessary: true,
    }));
    setVisible(false);
  };

  const handleDecline = () => {
    // Technisch notwendige Cookies müssen gesetzt werden – Ablehnen = nur optionale abgelehnt
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      accepted: false,
      timestamp: new Date().toISOString(),
      necessary: true,
    }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] px-4 md:px-6 py-4 md:py-5 max-h-[80vh] overflow-y-auto"
      style={{
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderTop: '1px solid var(--border)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          {/* Icon + Text */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.15)' }}
            >
              <i className="ri-shield-check-line text-base" style={{ color: 'var(--indigo)' }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>
                Cookie-Einstellungen & Datenschutz
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Wir verwenden technisch notwendige Cookies sowie eine anonyme Geräte-ID zur Nutzungsbegrenzung.
                Kein Tracking, keine Werbung.{' '}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="font-semibold underline cursor-pointer"
                  style={{ color: 'var(--indigo)' }}
                >
                  {showDetails ? 'Weniger anzeigen' : 'Details & Datenschutz'}
                </button>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap"
              style={{
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--bg-base)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
            >
              Nur notwendige
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-all duration-200 whitespace-nowrap"
              style={{ backgroundColor: 'var(--indigo)', color: 'white' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4338ca'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--indigo)'; }}
            >
              Alle akzeptieren
            </button>
          </div>
        </div>

        {/* Details */}
        {showDetails && (
          <div
            className="mt-4 p-4 rounded-2xl text-xs leading-relaxed"
            style={{
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <p className="font-semibold mb-3" style={{ color: 'var(--text-heading)' }}>
              Was wir speichern & warum:
            </p>
            <ul className="space-y-2.5 mb-4">
              <li className="flex items-start gap-2">
                <i className="ri-check-line text-xs mt-0.5 flex-shrink-0" style={{ color: 'var(--indigo)' }} />
                <span>
                  <strong style={{ color: 'var(--text-heading)' }}>Cookie-Consent</strong> – Speichert deine Entscheidung. Laufzeit: 1 Jahr. Notwendig.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-check-line text-xs mt-0.5 flex-shrink-0" style={{ color: 'var(--indigo)' }} />
                <span>
                  <strong style={{ color: 'var(--text-heading)' }}>Anonyme Geräte-ID</strong> – Eine lokal generierte, anonyme Prüfsumme deines Geräts (ohne IP-Adresse, Name oder Standort), die berechnet wird, um das kostenlose Tageslimit (2 Analysen) fair zu verwalten und Missbrauch zu verhindern. Diese Prüfsumme wird nicht für Tracking genutzt und nicht an Dritte weitergegeben.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-check-line text-xs mt-0.5 flex-shrink-0" style={{ color: 'var(--indigo)' }} />
                <span>
                  <strong style={{ color: 'var(--text-heading)' }}>KI-Analyse (Vertex AI)</strong> – Deine Sprachaufnahme wird zur Analyse an Google Vertex AI übertragen, <strong style={{ color: 'var(--text-heading)' }}>ausschließlich in der Region Frankfurt (Deutschland)</strong>. Die Aufnahme wird nach der Analyse sofort gelöscht und nicht dauerhaft gespeichert.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-check-line text-xs mt-0.5 flex-shrink-0" style={{ color: 'var(--indigo)' }} />
                <span>
                  <strong style={{ color: 'var(--text-heading)' }}>Hosting & Backend</strong> – Die Website wird über{' '}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="nofollow noopener noreferrer" className="underline" style={{ color: 'var(--indigo)' }}>Vercel</a>{' '}
                  gehostet. Das Backend läuft auf{' '}
                  <a href="https://supabase.com/privacy" target="_blank" rel="nofollow noopener noreferrer" className="underline" style={{ color: 'var(--indigo)' }}>Supabase</a>.
                  Die KI-Verarbeitung erfolgt über{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="nofollow noopener noreferrer" className="underline" style={{ color: 'var(--indigo)' }}>Google Cloud</a>.
                </span>
              </li>
            </ul>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Durch Klick auf &quot;Nur notwendige&quot; oder &quot;Alle akzeptieren&quot; stimmst du der Nutzung der technisch notwendigen Cookies zu – diese sind für den Betrieb der Website erforderlich.
              Weitere Informationen:{' '}
              <Link to="/datenschutz" className="font-semibold underline" style={{ color: 'var(--indigo)' }}>
                Datenschutzerklärung
              </Link>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
