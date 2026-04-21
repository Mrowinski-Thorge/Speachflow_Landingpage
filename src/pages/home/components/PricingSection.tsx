import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Zum Ausprobieren',
    features: [
      '5 Min. Aufnahme / Monat',
      'Basis KI-Analyse',
      'Sprach-Feedback',
    ],
    missing: [
      'Fortschritts-Tracking',
      'Haltungs-Analyse',
      'Mimik-Erkennung',
    ],
    cta: 'Kostenlos starten',
    highlight: false,
  },
  {
    id: 'student',
    name: 'Schüler',
    price: { monthly: 2.99, yearly: 1.99 },
    description: 'Für Schüler & Studenten',
    features: [
      '60 Min. Aufnahme / Monat',
      'Erweiterte KI-Analyse',
      'Sprach-Feedback',
      'Fortschritts-Tracking',
      'Haltungs-Analyse',
    ],
    missing: [
      'Mimik-Erkennung',
    ],
    cta: 'Schüler-Plan wählen',
    highlight: false,
  },
  {
    id: 'plus',
    name: 'Plus',
    price: { monthly: 4.99, yearly: 3.99 },
    description: 'Für ambitionierte Sprecher',
    badge: 'Beliebteste Wahl',
    features: [
      'Unbegrenzte Aufnahmen',
      'Premium KI-Analyse',
      'Sprach-Feedback',
      'Fortschritts-Tracking',
      'Haltungs-Analyse',
      'Mimik-Erkennung',
      'Unbegrenzte Szenarien',
    ],
    missing: [],
    cta: 'Plus wählen',
    highlight: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: { monthly: 9.99, yearly: 7.99 },
    description: 'Für Teams & Unternehmen',
    features: [
      'Alles aus Plus',
      'Team-Dashboard',
      'Admin-Verwaltung',
      'API-Zugang',
      'Dedizierter Support',
      'Datenexport & Reports',
    ],
    missing: [],
    cta: 'Business wählen',
    highlight: false,
  },
];

export default function PricingSection() {
  const ref = useScrollReveal();
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      className="px-6 md:px-8"
      style={{ backgroundColor: 'var(--bg-base)', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <div ref={ref} className="section-reveal text-center mb-14">
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
          >
            Einfache, transparente Preise
          </h2>
          <p className="text-base max-w-lg mx-auto mb-8" style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}>
            Starte kostenlos. Upgrade jederzeit. Keine versteckten Kosten.
          </p>

          {/* Toggle */}
          <div
            className="inline-flex items-center p-1 rounded-full gap-1"
            style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setYearly(false)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: !yearly ? 'var(--bg-surface)' : 'transparent',
                color: !yearly ? 'var(--text-heading)' : 'var(--text-secondary)',
                border: !yearly ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              Monatlich
            </button>
            <button
              onClick={() => setYearly(true)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
              style={{
                backgroundColor: yearly ? 'var(--bg-surface)' : 'transparent',
                color: yearly ? 'var(--text-heading)' : 'var(--text-secondary)',
                border: yearly ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              Jährlich
              <span
                className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: 'var(--blue-light)', color: 'var(--indigo)' }}
              >
                −20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} yearly={yearly} delay={i * 60} />
          ))}
        </div>

        <p className="text-center text-sm mt-10" style={{ color: 'var(--text-muted)' }}>
          Alle Pläne DSGVO-konform · Daten in Europa · Jederzeit kündbar
        </p>
      </div>
    </section>
  );
}

function PricingCard({
  plan,
  yearly,
  delay,
}: {
  plan: (typeof plans)[0];
  yearly: boolean;
  delay: number;
}) {
  const ref = useScrollReveal();
  const price = yearly ? plan.price.yearly : plan.price.monthly;

  return (
    <div
      ref={ref}
      className="section-reveal rounded-2xl p-6 flex flex-col relative transition-all duration-200 hover:-translate-y-1"
      style={{
        transitionDelay: `${delay}ms`,
        backgroundColor: plan.highlight ? 'var(--indigo)' : 'var(--bg-surface)',
        border: plan.highlight ? 'none' : '1px solid var(--border)',
      }}
    >
      {/* Popular badge */}
      {plan.badge && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
          style={{ backgroundColor: 'var(--text-heading)', color: 'var(--bg-surface)' }}
        >
          {plan.badge}
        </div>
      )}

      {/* Plan name */}
      <div className="mb-5">
        <h3
          className="text-sm font-bold mb-1"
          style={{
            color: plan.highlight ? 'rgba(255,255,255,0.95)' : 'var(--text-heading)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {plan.name}
        </h3>
        <p className="text-xs" style={{ color: plan.highlight ? 'rgba(255,255,255,0.60)' : 'var(--text-muted)' }}>
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div
        className="mb-6 pb-6"
        style={{ borderBottom: `1px solid ${plan.highlight ? 'rgba(255,255,255,0.18)' : 'var(--border)'}` }}
      >
        <div className="flex items-baseline gap-1">
          <span
            className="text-3xl font-black"
            style={{
              color: plan.highlight ? 'white' : 'var(--text-heading)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {price === 0 ? 'Gratis' : `${price.toFixed(2).replace('.', ',')}€`}
          </span>
        </div>
        {price > 0 && (
          <div className="text-xs mt-1" style={{ color: plan.highlight ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)' }}>
            pro Monat{yearly ? ', jährlich' : ''}
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2.5 flex-1 mb-6">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <div
              className="w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
              style={{
                backgroundColor: plan.highlight ? 'rgba(255,255,255,0.20)' : 'var(--blue-light)',
              }}
            >
              <i
                className="ri-check-line text-xs"
                style={{ color: plan.highlight ? 'white' : 'var(--indigo)' }}
              />
            </div>
            <span
              className="text-sm"
              style={{ color: plan.highlight ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)' }}
            >
              {f}
            </span>
          </li>
        ))}
        {plan.missing.map((f) => (
          <li key={f} className="flex items-start gap-2.5 opacity-35">
            <div
              className="w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
              style={{ backgroundColor: 'var(--bg-muted)' }}
            >
              <i className="ri-close-line text-xs" style={{ color: 'var(--text-muted)' }} />
            </div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#download"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap"
        style={
          plan.highlight
            ? { backgroundColor: 'white', color: 'var(--indigo)' }
            : {
                backgroundColor: 'var(--blue-light)',
                color: 'var(--indigo)',
                border: '1px solid var(--border-indigo)',
              }
        }
        onMouseEnter={(e) => {
          if (plan.highlight) {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.90)';
          } else {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--bg-muted)';
          }
        }}
        onMouseLeave={(e) => {
          if (plan.highlight) {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'white';
          } else {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--blue-light)';
          }
        }}
      >
        {plan.cta}
        <i className="ri-arrow-right-line text-xs" />
      </a>
    </div>
  );
}
