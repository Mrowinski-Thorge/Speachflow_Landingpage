import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const faqs = [
  {
    q: 'Wie funktioniert die KI-Analyse?',
    a: 'SpeachFlow nutzt modernste KI-Modelle, die speziell für Sprachanalyse trainiert wurden. Die App analysiert Tonfall, Sprechtempo, Pausen, Körperhaltung und Mimik in Echtzeit und gibt dir sofortiges, präzises Feedback.',
  },
  {
    q: 'Sind meine Daten sicher?',
    a: 'Absolut. Alle Daten werden ausschließlich auf EU-Servern gespeichert und sind vollständig DSGVO-konform. Deine Aufnahmen werden verschlüsselt übertragen und niemals an Dritte weitergegeben.',
  },
  {
    q: 'Kann ich SpeachFlow als Schüler nutzen?',
    a: 'Ja! SpeachFlow wurde speziell auch für Schüler entwickelt. Der Schüler-Plan bietet alle wichtigen Funktionen zu einem günstigen Preis von 2,99€/Monat. Viele Lehrer empfehlen SpeachFlow für Referate und Präsentationen.',
  },
  {
    q: 'Welche Geräte werden unterstützt?',
    a: 'SpeachFlow ist für iOS (iPhone & iPad) und Android verfügbar. Du benötigst lediglich ein Mikrofon und optional eine Kamera für die Haltungs- und Mimikanalyse.',
  },
  {
    q: 'Kann ich meinen Plan jederzeit wechseln?',
    a: 'Ja, du kannst deinen Plan jederzeit upgraden oder downgraden. Bei einem Downgrade bleibt dein aktueller Plan bis zum Ende des Abrechnungszeitraums aktiv.',
  },
  {
    q: 'Gibt es eine kostenlose Testphase?',
    a: 'Ja! Der Free-Plan ist dauerhaft kostenlos und beinhaltet 5 Minuten Aufnahme pro Monat. So kannst du SpeachFlow ohne Risiko ausprobieren.',
  },
  {
    q: 'Wie unterscheidet sich der Business-Plan?',
    a: 'Der Business-Plan bietet zusätzlich Team-Features wie ein Admin-Dashboard, Nutzerverwaltung, API-Zugang und dedizierten Support. Ideal für Unternehmen, die ihre Teams schulen möchten.',
  },
];

export default function HowItWorksSection() {
  const ref = useScrollReveal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="px-6 md:px-8"
      style={{ backgroundColor: 'var(--bg-surface)', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* Left */}
          <div ref={ref} className="section-reveal lg:w-80 flex-shrink-0">
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
              style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
            >
              Häufige Fragen
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}>
              Alles, was du über SpeachFlow wissen musst.
            </p>
          </div>

          {/* Right: FAQ list */}
          <div className="flex-1 space-y-2">
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                faq={faq}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                delay={i * 60}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({
  faq,
  open,
  onToggle,
  delay,
}: {
  faq: { q: string; a: string };
  open: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const ref = useScrollReveal();

  return (
    <div
      ref={ref}
      className="section-reveal rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        transitionDelay: `${delay}ms`,
        border: `1px solid ${open ? 'var(--border-indigo)' : 'var(--border)'}`,
        backgroundColor: open ? 'var(--bg-base)' : 'transparent',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
      >
        <span
          className="text-sm font-semibold pr-4 leading-relaxed"
          style={{ color: open ? 'var(--text-heading)' : 'var(--text-secondary)' }}
        >
          {faq.q}
        </span>
        <div
          className="w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-200"
          style={{
            backgroundColor: open ? 'var(--blue-light)' : 'var(--bg-muted)',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <i
            className="ri-add-line text-xs"
            style={{ color: open ? 'var(--indigo)' : 'var(--text-muted)' }}
          />
        </div>
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}>
            {faq.a}
          </p>
        </div>
      )}
    </div>
  );
}
