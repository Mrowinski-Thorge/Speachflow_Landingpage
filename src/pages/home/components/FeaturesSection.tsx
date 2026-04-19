import { useScrollReveal } from '@/hooks/useScrollReveal';

const features = [
  {
    icon: 'ri-mic-2-line',
    title: 'Sprachanalyse',
    description: 'KI erkennt Tonfall, Sprechtempo, Pausen und Füllwörter in Echtzeit. Präzises Feedback zu jeder Silbe.',
    tag: 'Echtzeit',
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.08)',
  },
  {
    icon: 'ri-body-scan-line',
    title: 'Haltungs-Tracking',
    description: 'Körpersprache und Gestik werden analysiert. Lerne, selbstbewusst aufzutreten und überzeugend zu wirken.',
    tag: 'KI-Vision',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    icon: 'ri-emotion-line',
    title: 'Mimik-Erkennung',
    description: 'Augenkontakt, Lächeln und Emotionen werden ausgewertet. Wirke authentisch und verbinde dich mit deinem Publikum.',
    tag: 'Facial AI',
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.08)',
  },
  {
    icon: 'ri-flashlight-line',
    title: 'Sofort-Feedback',
    description: 'Während du sprichst, erhältst du sofortige Tipps. Verbessere dich live, nicht erst danach.',
    tag: '< 200ms',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    icon: 'ri-line-chart-line',
    title: 'Fortschritts-Tracking',
    description: 'Verfolge deine Verbesserungen über Zeit. Detaillierte Statistiken zeigen dir genau, wo du gewachsen bist.',
    tag: 'Analytics',
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.08)',
  },
  {
    icon: 'ri-shield-keyhole-line',
    title: 'DSGVO-konform',
    description: 'Alle Daten auf EU-Servern. Vollständig DSGVO-konform, verschlüsselt und niemals weitergegeben.',
    tag: 'EU-Server',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.08)',
  },
];

export default function FeaturesSection() {
  const ref = useScrollReveal();

  return (
    <section
      id="features"
      className="px-6 md:px-8"
      style={{ backgroundColor: 'var(--bg-surface)', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <div ref={ref} className="section-reveal text-center mb-16">
          <div className="pill-badge mb-5 mx-auto w-fit">
            <i className="ri-sparkling-line" />
            Features
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-5"
            style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
          >
            Alles, was du brauchst,
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              um besser zu werden.
            </span>
          </h2>
          <p
            className="text-base max-w-lg mx-auto"
            style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}
          >
            KI-Technologie trifft auf echtes Feedback – für jeden, der überzeugend sprechen will.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  delay,
}: {
  feature: (typeof features)[0];
  delay: number;
}) {
  const ref = useScrollReveal();

  return (
    <div
      ref={ref}
      className="section-reveal group p-7 rounded-2xl cursor-default transition-all duration-200 hover:-translate-y-1"
      style={{
        transitionDelay: `${delay}ms`,
        backgroundColor: 'var(--bg-base)',
        border: '1px solid var(--border)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-indigo)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
      }}
    >
      {/* Icon + Tag */}
      <div className="flex items-start justify-between mb-6">
        <div
          className="w-12 h-12 flex items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110"
          style={{ backgroundColor: feature.bg }}
        >
          <i className={`${feature.icon} text-xl`} style={{ color: feature.color }} />
        </div>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{
            backgroundColor: 'var(--bg-muted)',
            color: 'var(--text-secondary)',
          }}
        >
          {feature.tag}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-base font-bold mb-2.5"
        style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
        {feature.description}
      </p>
    </div>
  );
}
