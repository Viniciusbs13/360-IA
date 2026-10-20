import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, EASE, reduceMotion, scrollTo } from '@/lib/motion';
import { hero, statements, site } from '@/data/content';
import Reveal from './ui/Reveal';

/* #hero-zone = 1 tela de hero + 1 tela pinada de frases. A cena 3D lê o
   progresso dessa zona para inclinar o portal e aproximar a câmera. */
export default function Hero({ active }: { active: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const stRef = useRef<HTMLElement>(null);

  // entrance
  useEffect(() => {
    if (!active || !heroRef.current || reduceMotion()) return;
    const q = heroRef.current.querySelectorAll('.hv');
    gsap.fromTo(
      q,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 1.2, ease: EASE, stagger: 0.08, delay: 0.5 }
    );
  }, [active]);

  // statements: pinned, one at a time
  useEffect(() => {
    const el = stRef.current;
    if (!el) return;
    const lines = el.querySelectorAll<HTMLElement>('.stmt');
    if (reduceMotion()) {
      lines.forEach((l) => (l.style.opacity = '1'));
      return;
    }
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: `+=${lines.length * 70}%`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
    });
    lines.forEach((l, i) => {
      tl.fromTo(
        l,
        { opacity: 0, y: 30, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' },
        i * 1.6
      );
      if (i < lines.length - 1) {
        tl.to(
          l,
          { opacity: 0, y: -24, filter: 'blur(6px)', duration: 0.8, ease: 'power2.in' },
          i * 1.6 + 1.1
        );
      }
    });
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // hero fades out as you scroll past it
  useEffect(() => {
    const el = heroRef.current;
    if (!el || reduceMotion()) return;
    const st = gsap.to(el.querySelector('.hero-inner'), {
      opacity: 0,
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom 40%', scrub: true },
    });
    return () => {
      st.scrollTrigger?.kill();
      st.kill();
    };
  }, []);

  return (
    <div id="hero-zone" className="relative z-10">
      <section
        id="inicio"
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col justify-end px-4 pb-10 pt-24 sm:px-8 sm:pb-14 sm:pt-28"
      >
        <div className="hero-inner mx-auto w-full max-w-7xl grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[1100px]">
            <p className="hv t-micro text-accent mb-4 tracking-wider">{hero.eyebrow}</p>
            <h2 className="hv t-display text-[clamp(2.5rem,10vw,4.8rem)] sm:text-[4.6rem] lg:text-[6.6rem] xl:text-[7.6rem] leading-[0.92] tracking-tight">
              <span className="block">{hero.title[0]}</span>
              <span className="block text-accent">{hero.title[1]}</span>
            </h2>
            <p className="hv mt-5 max-w-[50ch] text-base leading-relaxed o-85 sm:text-lg sm:leading-relaxed">
              {hero.sub}
            </p>
            <div className="hv mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <a
                href={site.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill pill-accent !min-h-[50px] justify-center text-center shadow-[0_0_25px_rgba(217,189,120,0.3)] hover:shadow-[0_0_35px_rgba(217,189,120,0.5)]"
              >
                <span>{hero.cta}</span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a
                href="#modulos"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('#modulos');
                }}
                className="u-link t-label o-85 justify-center py-2 sm:py-0 text-center"
              >
                <span>Ver os módulos</span>
                <span className="arrow" aria-hidden="true">
                  ↘
                </span>
              </a>
            </div>
          </div>

          <div className="hv flex items-end justify-between gap-6 border-t border-white/10 pt-4 lg:flex-col lg:items-end lg:gap-2 lg:border-t-0 lg:pt-0">
            <span className="t-label o-55 inline-flex items-center gap-2 text-xs sm:text-sm">
              {hero.scroll} <span aria-hidden="true">↓</span>
            </span>
            <span className="t-display t-mono-num text-xl sm:text-2xl lg:text-3xl leading-none o-95">
              {site.product}
            </span>
          </div>
        </div>
      </section>

      <section
        ref={stRef}
        className="relative flex min-h-[100svh] items-center justify-center px-4 text-center sm:px-6"
        aria-label="Manifesto"
      >
        <div className="relative min-h-[50vh] sm:h-[60vh] w-full max-w-[1000px] flex items-center justify-center">
          {statements.map((s, i) => (
            <p
              key={i}
              className="stmt stmt-text absolute inset-x-0 top-1/2 -translate-y-1/2 t-display-md text-[1.85rem] sm:text-[3.2rem] lg:text-[4.6rem] leading-[1.08] sm:leading-[1]"
              style={{ opacity: 0 }}
            >
              {i === statements.length - 1 ? (
                <span className="text-accent">{s}</span>
              ) : (
                renderHl(s)
              )}
            </p>
          ))}
        </div>
        <span className="absolute bottom-8 left-5 sm:left-8 t-micro o-35 text-[0.7rem]">
          {String(1).padStart(2, '0')} / {String(statements.length).padStart(2, '0')}
        </span>
      </section>

      {/* lead-in for the next section */}
      <div className="px-5 pb-20 pt-6 sm:px-8 sm:pb-24 sm:pt-10">
        <Reveal
          as="p"
          className="mx-auto max-w-[56ch] text-center text-base leading-relaxed o-65 sm:text-xl"
        >
          Vamos te ensinar a usar IA do básico ao avançado, pra você usar no seu dia a dia,
          produzir mais e ganhar dinheiro com isso.
        </Reveal>
      </div>
    </div>
  );
}

/** '[[trecho]]' vira <span class="hl-dark"> (destaque escuro, legível sobre o disco claro) */
function renderHl(s: string) {
  return s.split(/(\[\[.*?\]\])/g).map((part, i) =>
    part.startsWith('[[') ? (
      <span key={i} className="hl-dark">
        {part.slice(2, -2)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export { ScrollTrigger };
