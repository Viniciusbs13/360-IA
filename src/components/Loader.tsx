import { useEffect, useRef, useState } from 'react';
import logo from '@/assets/dominio-ia-360-logo.jpg';
import { gsap, EASE, reduceMotion } from '@/lib/motion';
import { loader, site } from '@/data/content';

/* Tela de entrada no padrão da referência: grade fina, wordmark gigante,
   botão sublinhado, contador 0→100 e dois cards-etiqueta com a ficha do produto. */
export default function Loader({ onEnter }: { onEnter: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  const leaving = useRef(false);

  useEffect(() => {
    const o = { v: 0 };
    const tw = gsap.to(o, { v: 100, duration: reduceMotion() ? 0.1 : 2.1, ease: 'power3.out', onUpdate: () => setCount(Math.round(o.v)), onComplete: () => setReady(true) });
    if (!reduceMotion()) {
      gsap.from('.ld-in', { opacity: 0, y: 14, duration: 1, ease: EASE, stagger: 0.07, delay: 0.1 });
    }
    return () => { tw.kill(); };
  }, []);

  const enter = () => {
    if (!ready || leaving.current) return;
    leaving.current = true;
    const el = root.current!;
    if (reduceMotion()) { onEnter(); return; }
    const tl = gsap.timeline({ onComplete: onEnter });
    tl.to(el.querySelectorAll('.ld-in'), { opacity: 0, y: -16, duration: 0.5, ease: 'power2.in', stagger: 0.03 }, 0)
      .to(el, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 0.25);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter') enter(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div ref={root} className="fixed inset-0 z-[100] bg-bg text-fg" role="dialog" aria-label="Abertura">
      <div className="grid-bg absolute inset-x-4 inset-y-4 border-x border-white/5 sm:inset-x-8" />
      {/* top rule */}
      <div className="absolute inset-x-0 top-4 h-px bg-white/10" />
      <div className="absolute inset-x-0 bottom-4 h-px bg-white/10" />

      <div className="relative h-full px-5 pt-8 pb-8 sm:px-12 sm:pb-10 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <h1 className="ld-in t-display text-[clamp(2.8rem,12vw,6.5rem)] leading-[0.86]">
            <span className="block">{loader.title[0]}</span>
            <span className="block text-[0.55em] font-bold tracking-[-0.02em] o-85">{loader.title[1]}</span>
          </h1>
          <Mark className="ld-in mt-2 h-7 w-7 sm:h-8 sm:w-8 o-85 shrink-0" />
        </div>

        <div className="ld-in my-auto self-start sm:ml-[16%] py-4">
          <button type="button" onClick={enter} disabled={!ready} className="u-link t-label min-h-[44px] inline-flex items-center text-xs sm:text-[0.72rem] disabled:opacity-60 cursor-pointer" aria-live="polite">
            {ready ? loader.enter : `${loader.fetching} · ${count}%`}
          </button>
        </div>

        <div className="flex items-end justify-between gap-4">
          <a href="#inicio" onClick={(e) => { e.preventDefault(); enter(); }} className="ld-in t-label min-h-[44px] inline-flex items-center text-xs sm:text-[0.7rem] o-85 gap-2">
            <span aria-hidden="true">↘</span> {loader.lite}
          </a>
          <div className="flex items-end gap-3">
            <span className="ld-in t-display t-mono-num text-[3.4rem] sm:text-[4.2rem] leading-none mr-1" aria-hidden="true">{count}</span>
            <LabelCard className="ld-in hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelCard({ className = '' }: { className?: string }) {
  return (
    <div className={`w-[180px] rounded-md border border-white/15 bg-bg/80 p-3 text-fg ${className}`} aria-hidden="true">
      <div className="flex items-start gap-3">
        <div className="t-micro o-55 [writing-mode:vertical-rl] rotate-180">{loader.tag}&nbsp;&nbsp;<span className="text-accent-2">{loader.variant}</span></div>
        <div className="flex-1">
          <img src={logo} alt="" className="h-20 w-full rounded-sm bg-black object-contain opacity-90" />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] items-end gap-2 border-t border-white/10 pt-2">
        <div>
          <div className="t-micro o-55">{loader.card.made}</div>
          <div className="t-label text-accent">{loader.card.where}</div>
        </div>
        <div className="text-right">
          <div className="t-display t-mono-num text-xl leading-none">{loader.card.n}</div>
          <div className="t-micro o-55">{loader.card.label}</div>
        </div>
      </div>
      <div className="barcode mt-2 opacity-70" />
      <div className="mt-1 flex items-center justify-between t-micro o-55"><span>{site.domain}</span><span>© {site.year}</span></div>
    </div>
  );
}

export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="16" cy="16" rx="15" ry="5.5" stroke="currentColor" strokeWidth="1.2" transform="rotate(-25 16 16)" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
    </svg>
  );
}
