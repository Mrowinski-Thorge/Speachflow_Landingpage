import { useScrollReveal } from '@/hooks/useScrollReveal';

const testimonials = [
  {
    name: 'Lena Hoffmann',
    role: 'Schülerin, 17 Jahre',
    initial: 'L',
    quote: 'Ich hatte immer Angst vor Referaten. Mit SpeachFlow habe ich in 2 Wochen so viel Selbstvertrauen gewonnen. Meine Lehrerin war begeistert!',
    plan: 'Schüler',
    stars: 5,
  },
  {
    name: 'Markus Bauer',
    role: 'Startup-Gründer',
    initial: 'M',
    quote: 'SpeachFlow hat meinen Investor-Pitch auf ein neues Level gebracht. Die KI-Analyse ist unglaublich präzise – ich habe Dinge bemerkt, die mir nie aufgefallen wären.',
    plan: 'Business',
    stars: 5,
  },
  {
    name: 'Sophie Müller',
    role: 'Studentin, BWL',
    initial: 'S',
    quote: 'Für meine Bachelorarbeitspräsentation war SpeachFlow ein Lebensretter. Das Feedback zu Sprechtempo und Pausen hat mir wirklich geholfen.',
    plan: 'Plus',
    stars: 5,
  },
  {
    name: 'Thomas Richter',
    role: 'Vertriebsleiter',
    initial: 'T',
    quote: 'Unser gesamtes Vertriebsteam nutzt SpeachFlow. Die Verbesserungen in Kundenpräsentationen sind messbar. Absolut empfehlenswert!',
    plan: 'Business',
    stars: 5,
  },
  {
    name: 'Anna Schneider',
    role: 'Gymnasiallehrerin',
    initial: 'A',
    quote: 'Ich empfehle SpeachFlow meinen Schülern für Referate. Die App ist intuitiv und das Feedback ist verständlich – auch für Jugendliche.',
    plan: 'Schüler',
    stars: 5,
  },
  {
    name: 'Felix Wagner',
    role: 'Unternehmensberater',
    initial: 'F',
    quote: 'Die Kombination aus Sprach-, Haltungs- und Mimikanalyse ist einzigartig. Kein anderes Tool bietet diesen Umfang zu diesem Preis.',
    plan: 'Business',
    stars: 5,
  },
];

const avatarColors = [
  { bg: 'linear-gradient(135deg, #4F46E5, #818CF8)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #3B82F6, #60A5FA)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #4F46E5, #3B82F6)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #818CF8, #4F46E5)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #60A5FA, #3B82F6)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #3730A3, #4F46E5)', text: '#fff' },
];

export default function TestimonialsSection() {
  const ref = useScrollReveal();

  return (
    <section
      id="testimonials"
      className="px-6 md:px-8"
      style={{ backgroundColor: 'var(--bg-surface)', paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <div ref={ref} className="section-reveal text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
          >
            Was unsere Nutzer sagen
          </h2>
          <div className="flex items-center justify-center gap-1 mt-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <i key={s} className="ri-star-fill text-base" style={{ color: '#FBBF24' }} />
            ))}
            <span className="text-sm ml-2" style={{ color: 'var(--text-secondary)' }}>
              4.8 / 5 · 2.400+ Bewertungen
            </span>
          </div>
        </div>

        {/* Quote cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} delay={i * 60} colorIdx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  t,
  delay,
  colorIdx,
}: {
  t: (typeof testimonials)[0];
  delay: number;
  colorIdx: number;
}) {
  const ref = useScrollReveal();
  const color = avatarColors[colorIdx % avatarColors.length];

  return (
    <div
      ref={ref}
      className="section-reveal rounded-2xl p-6 flex flex-col gap-5 transition-all duration-200 hover:-translate-y-1"
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
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: t.stars }).map((_, i) => (
          <i key={i} className="ri-star-fill text-sm" style={{ color: '#FBBF24' }} />
        ))}
      </div>

      {/* Quote */}
      <blockquote
        className="text-sm leading-relaxed flex-1"
        style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}
      >
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Author row */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
          style={{ background: color.bg, color: color.text }}
        >
          {t.initial}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-sm font-bold truncate"
            style={{ color: 'var(--text-heading)', fontFamily: 'Inter, sans-serif' }}
          >
            {t.name}
          </div>
          <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {t.role}
          </div>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{
            backgroundColor: 'var(--blue-light)',
            color: 'var(--indigo)',
          }}
        >
          {t.plan}
        </span>
      </div>
    </div>
  );
}
