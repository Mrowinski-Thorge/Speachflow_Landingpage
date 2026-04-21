import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Live Demo', href: '#livetest' },
    { label: 'Preise', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/*
        KEY FIX: position:fixed + top:0 + will-change:transform
        → Browser rendert den Header in einem eigenen Compositing-Layer.
        → Wenn die Browser-Chrome (Adressleiste) ein-/ausblendet, bewegt sich
          der Viewport, aber der Header bleibt stabil weil er im eigenen Layer ist.
        → Kein env(safe-area-inset-top) als top-Wert — das springt beim Scrollen.
          Stattdessen padding-top für Safe Area.
      */}
      <div
        className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{
          top: 0,
          paddingTop: `max(env(safe-area-inset-top, 0px), ${scrolled ? '10px' : '16px'})`,
          transition: 'padding-top 0.35s cubic-bezier(0.22,1,0.36,1)',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        <header
          className="pointer-events-auto w-full transition-all duration-350"
          style={{
            maxWidth: scrolled ? '860px' : '100%',
            margin: scrolled ? '0 24px' : '0',
            borderRadius: scrolled ? '999px' : '0px',
            backgroundColor: scrolled
              ? (dark ? 'rgba(20,20,24,0.85)' : 'rgba(255,255,255,0.82)')
              : 'transparent',
            backdropFilter: scrolled ? 'blur(32px) saturate(200%) brightness(1.05)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(32px) saturate(200%) brightness(1.05)' : 'none',
            border: scrolled
              ? `1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(79,70,229,0.13)'}`
              : '1px solid transparent',
            transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        >
          <div
            className="px-5 md:px-7"
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              paddingRight: scrolled ? '6px' : undefined,
              paddingLeft: scrolled ? '28px' : undefined,
              transition: 'padding 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div className="flex items-center justify-between h-14">

              {/* Logo + Brand name */}
              <a href="#" className="flex items-center gap-2.5 cursor-pointer">
                <img
                  src="https://static.readdy.ai/image/c22c690b3fad44e0f4e8b70799dbf390/8efff0df91d4bff17be966e52d6bcb60.png"
                  alt="SpeachFlow Logo"
                  className="h-11 w-auto"
                />
                {/* SpeachFlow text — hidden on mobile */}
                <span
                  className="block text-lg font-bold tracking-tight whitespace-nowrap"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--text-heading)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  SpeachFlow
                </span>
              </a>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)';
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--bg-muted)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* Right: toggle + CTA */}
              <div className="flex items-center gap-2" style={{ transition: 'margin 0.4s cubic-bezier(0.22,1,0.36,1)' }}>
                <button
                  onClick={() => setDark(!dark)}
                  className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
                  style={{
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-muted)',
                    border: '1px solid var(--border)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--indigo)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-indigo)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                  }}
                  aria-label="Dark mode toggle"
                >
                  <i className={`text-sm ${dark ? 'ri-sun-line' : 'ri-moon-line'}`} />
                </button>

                {isDesktop && (
                  <a
                    href="#download"
                    className="btn-primary text-sm px-5 py-2 whitespace-nowrap"
                  >
                    App laden
                  </a>
                )}

                <button
                  className="md:hidden w-9 h-9 flex items-center justify-center cursor-pointer transition-all duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <i className={`text-xl ${menuOpen ? 'ri-close-line' : 'ri-menu-line'}`} />
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="fixed left-4 right-4 z-40 md:hidden"
          style={{
            top: '74px',
            backgroundColor: dark ? 'rgba(20,20,24,0.95)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(28px) saturate(200%)',
            WebkitBackdropFilter: 'blur(28px) saturate(200%)',
            borderRadius: '20px',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(79,70,229,0.13)'}`,
            padding: '12px',
            animation: 'slideDownFade 0.25s cubic-bezier(0.22,1,0.36,1)',
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-medium cursor-pointer transition-colors duration-150"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--bg-muted)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#download"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-2 text-sm py-3"
            >
              App laden
            </a>
          </nav>
        </div>
      )}

      <style>{`
        @keyframes slideDownFade {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
