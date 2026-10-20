import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, reduceMotion } from '@/lib/motion';
import { modules, site } from '@/data/content';
import Reveal from './ui/Reveal';

/* Carrossel horizontal pinado no desktop (>= 1024px),
   e grade/cards imersivos fluidos e legíveis no mobile (< 1024px). */
export default function Modules() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const w = wrap.current,
      t = track.current;
    if (!w || !t) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const n = modules.length;
      const tween = gsap.to(t, {
        x: () => -(t.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: w,
          start: 'top top',
          end: () => `+=${t.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            setIdx(Math.min(n - 1, Math.round(self.progress * (n - 1)))),
        },
      });
      stRef.current = tween.scrollTrigger ?? null;
      // parallax on the big numbers
      t.querySelectorAll<HTMLElement>('.mod-num').forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: 20 },
          {
            xPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          }
        );
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        stRef.current = null;
      };
    });
    return () => mm.revert();
  }, []);

  const next = () => {
    const st = stRef.current;
    if (!st) {
      document
        .getElementById(`mod-${Math.min(modules.length - 1, idx + 1)}`)
        ?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const n = modules.length;
    const target = Math.min(n - 1, idx + 1) / (n - 1);
    const y = st.start + (st.end - st.start) * target;
    const lenis = (
      window as unknown as { __lenis?: { scrollTo: (v: number, o?: object) => void } }
    ).__lenis;
    lenis
      ? lenis.scrollTo(y, { duration: 1.2 })
      : window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section
      id="modulos"
      ref={wrap}
      className="relative z-10 bg-bg/70 backdrop-blur-[4px] lg:h-[100svh] lg:overflow-hidden"
    >
      <div className="px-4 pt-16 sm:px-8 sm:pt-20 lg:absolute lg:inset-x-0 lg:top-0 lg:z-20 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <p className="t-micro text-accent tracking-wider">O que você vai aprender</p>
          <Reveal
            as="h2"
            className="t-display-md mt-2 text-[clamp(1.8rem,5vw,2.6rem)] sm:text-[2.8rem] lg:text-[2.4rem] tracking-tight"
          >
            8 módulos, do zero ao seu sistema de IA.
          </Reveal>
        </div>
      </div>

      <div
        ref={track}
        className="mx-auto max-w-7xl flex flex-col gap-6 px-4 py-10 sm:px-8 sm:py-14 lg:h-full lg:max-w-none lg:flex-row lg:items-end lg:gap-0 lg:px-8 lg:py-0 lg:pb-24 lg:pt-48"
      >
        {modules.map((m, i) => (
          <article
            id={`mod-${i}`}
            key={m.n}
            className="relative flex shrink-0 flex-col justify-end rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:h-full lg:w-[64vw] lg:pr-[10vw] xl:w-[56vw]"
          >
            {/* Background number watermark */}
            <span
              className="mod-num pointer-events-none select-none t-display t-mono-num absolute top-3 right-4 text-[4.5rem] leading-none text-white/[0.04] sm:text-[6rem] lg:-top-6 lg:left-0 lg:right-auto lg:text-[18rem]"
              aria-hidden="true"
            >
              {m.n}
            </span>

            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="t-display t-mono-num text-accent text-lg sm:text-xl">
                  {m.n}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="t-micro o-65 text-[0.7rem]">{m.dur}</span>
              </div>

              <h3 className="t-display mt-3 text-[clamp(2rem,6vw,3.2rem)] sm:text-[3.6rem] lg:text-[5.4rem] leading-[0.92] tracking-tight">
                {m.title}
              </h3>
              <p className="t-label mt-2 text-sm sm:text-base o-95 font-semibold">
                {m.sub}
              </p>
              <p className="mt-3 max-w-[46ch] text-sm leading-relaxed o-65 sm:text-[0.98rem]">
                {m.desc}
              </p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {m.stack.map((s) => (
                  <li
                    key={s}
                    className="t-micro rounded-full border border-white/15 bg-white/[0.02] px-3 py-1 o-85 text-[0.68rem]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}

        {/* Mobile quick CTA card at the end of modules */}
        <div className="lg:hidden flex flex-col items-center justify-center rounded-2xl border border-accent/30 bg-accent/[0.05] p-6 text-center mt-2">
          <p className="t-display text-xl sm:text-2xl text-accent">Pronto para dominar IA?</p>
          <p className="mt-2 text-sm o-75">
            Acesso imediato a todos os 8 módulos e ferramentas por apenas R$ 47.
          </p>
          <a
            href={site.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill pill-accent mt-5 w-full justify-center text-center font-semibold"
          >
            <span>Quero entrar agora</span>
            <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="hidden lg:flex absolute bottom-8 right-8 z-20 flex-col items-end gap-1">
        <span className="t-display t-mono-num text-3xl leading-none">
          <span className="o-95">{String(idx + 1).padStart(2, '0')}</span>{' '}
          <span className="text-base o-55">/ {String(modules.length).padStart(2, '0')}</span>
        </span>
        <button
          type="button"
          onClick={next}
          className="u-link t-label text-[0.75rem] o-85"
        >
          <span aria-hidden="true">›</span> Próximo módulo
        </button>
      </div>
      <span className="hidden lg:block absolute bottom-8 left-8 z-20 t-micro o-35">
        Role para percorrer
      </span>
    </section>
  );
}
