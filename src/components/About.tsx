import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import logo from '@/assets/dominio-ia-360-logo.jpg';
import { about, site } from '@/data/content';
import { gsap, ScrollTrigger, reduceMotion } from '@/lib/motion';
import { Fade } from './ui/Reveal';

/* "Quem ensina" — replica o About da referência com HUD interativo no desktop
   e versão refinada e responsiva com card HUD no mobile. */

type Anchor = 'c' | 'tl' | 'tr' | 'bl' | 'br' | 'l' | 'r' | 't' | 'b';
type Line = { from: string; to: string; a: Anchor; b: Anchor };

const LINES: Line[] = [
  { from: 'box-a', to: 'frame', a: 'br', b: 'tl' },
  { from: 'name', to: 'frame', a: 'r', b: 'l' },
  { from: 'lbl-b', to: 'frame', a: 'r', b: 'bl' },
  { from: 'lbl-c', to: 'frame', a: 'l', b: 'tr' },
  { from: 'lbl-d', to: 'frame', a: 't', b: 'bl' },
  { from: 'lbl-e', to: 'frame', a: 't', b: 'br' },
  { from: 'box-f', to: 'frame', a: 'l', b: 'r' },
];

function pt(r: DOMRect, a: Anchor, base: DOMRect): [number, number] {
  const x = r.left - base.left,
    y = r.top - base.top,
    w = r.width,
    h = r.height;
  switch (a) {
    case 'tl':
      return [x, y];
    case 'tr':
      return [x + w, y];
    case 'bl':
      return [x, y + h];
    case 'br':
      return [x + w, y + h];
    case 'l':
      return [x, y + h / 2];
    case 'r':
      return [x + w, y + h / 2];
    case 't':
      return [x + w / 2, y];
    case 'b':
      return [x + w / 2, y + h];
    default:
      return [x + w / 2, y + h / 2];
  }
}

export default function About() {
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const obj = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(reduceMotion() ? about.typed : '');
  const [clock, setClock] = useState('');
  const [coords, setCoords] = useState('0.000, 0.000');
  const [segs, setSegs] = useState<[number, number, number, number][]>([]);
  const [size, setSize] = useState({ w: 1, h: 1 });
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // typewriter, guarded against StrictMode double-run
  useEffect(() => {
    const el = root.current;
    if (!el || reduceMotion()) return;
    let i = 0,
      timer = 0,
      alive = true;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        const step = () => {
          if (!alive) return;
          i++;
          setTyped(about.typed.slice(0, i));
          const ch = about.typed[i - 1];
          const pause =
            ch === ' ' ? 120 : ch === '.' ? 260 : 48 + Math.random() * 60;
          if (i < about.typed.length) timer = window.setTimeout(step, pause);
        };
        timer = window.setTimeout(step, 400);
      },
    });
    return () => {
      alive = false;
      st.kill();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // measure lines from real elements; re-measure during parallax
  const measure = () => {
    const el = root.current;
    if (!el) return;
    if (window.innerWidth < 1024) {
      setSegs([]);
      return;
    }
    const base = el.getBoundingClientRect();
    setSize({ w: base.width, h: base.height });
    const next: [number, number, number, number][] = [];
    for (const l of LINES) {
      const a = el.querySelector<HTMLElement>(`[data-hud="${l.from}"]`),
        b = el.querySelector<HTMLElement>(`[data-hud="${l.to}"]`);
      if (!a || !b) continue;
      const [x1, y1] = pt(a.getBoundingClientRect(), l.a, base);
      const [x2, y2] = pt(b.getBoundingClientRect(), l.b, base);
      next.push([x1, y1, x2, y2]);
    }
    setSegs(next);
  };

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (root.current) ro.observe(root.current);
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // mouse parallax on the central object (frame) + live coordinate readout
  useEffect(() => {
    if (reduceMotion()) return;
    let raf = 0,
      running = true;
    const onMove = (e: PointerEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      if (!running) return;
      const m = mouse.current;
      m.x += (m.tx - m.x) * 0.06;
      m.y += (m.ty - m.y) * 0.06;
      if (obj.current)
        obj.current.style.transform = `translate3d(${(m.x * 18).toFixed(2)}px, ${(
          m.y * 12
        ).toFixed(2)}px, 0) rotateY(${(m.x * 4).toFixed(2)}deg) rotateX(${(
          -m.y * 3
        ).toFixed(2)}deg)`;
      if (Math.abs(m.tx - m.x) > 0.002 || Math.abs(m.ty - m.y) > 0.002) {
        measure();
        setCoords(`${m.x.toFixed(3)}, ${(-m.y).toFixed(3)}`);
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  // entrance: lines draw, labels/boxes fade with stagger
  useEffect(() => {
    const el = root.current,
      s = svg.current;
    if (!el || !s || reduceMotion() || segs.length === 0) return;
    const lines = s.querySelectorAll<SVGLineElement>('line');
    const dots = s.querySelectorAll<SVGCircleElement>('circle');
    const hud = el.querySelectorAll('[data-hud^="lbl"], [data-hud^="box"], .readout');
    gsap.set(lines, { strokeDasharray: 2000, strokeDashoffset: 2000 });
    gsap.set([dots, hud], { opacity: 0 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      once: true,
      onEnter: () => {
        gsap.to(lines, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: 'power3.inOut',
          stagger: 0.1,
        });
        gsap.to(dots, { opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.5 });
        gsap.to(hud, { opacity: 1, duration: 0.7, stagger: 0.07, delay: 0.7 });
      },
    });
    return () => st.kill();
  }, [segs.length > 0]);

  return (
    <section
      id="quem"
      ref={root}
      className="relative z-10 min-h-[100svh] overflow-hidden px-4 py-20 sm:px-8 sm:py-28 lg:py-32"
    >
      <svg
        ref={svg}
        className="pointer-events-none absolute inset-0 hidden lg:block"
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
        aria-hidden="true"
      >
        <g stroke="rgba(235,235,235,0.28)" strokeWidth="1">
          {segs.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        <g fill="#5fe3e8">
          {segs.map(([x1, y1, x2, y2], i) => (
            <g key={i}>
              <circle cx={x1} cy={y1} r="2" />
              <circle cx={x2} cy={y2} r="2" />
            </g>
          ))}
        </g>
      </svg>

      {/* top-left telemetry box (desktop only) */}
      <div
        data-hud="box-a"
        className="absolute left-[7%] top-10 hidden h-14 w-[70px] border border-white/25 lg:block"
      >
        <span className="readout absolute -bottom-5 right-0 t-micro text-accent-2 t-mono-num">
          6.7581
        </span>
      </div>

      <div className="mx-auto max-w-7xl relative grid gap-8 lg:grid-cols-[minmax(0,560px)_1fr] lg:items-center">
        <div>
          <h2 className="relative t-display inline-block text-[clamp(2.2rem,8vw,3.8rem)] sm:text-[4rem] lg:text-[4.4rem] leading-[0.92]">
            <span className="invisible" aria-hidden="true">
              {about.typed}
            </span>
            <span className="absolute inset-0 whitespace-pre-wrap" aria-hidden="true">
              {typed}
              <span className="cursor-seg" aria-hidden="true" />
            </span>
            <span className="sr-only">{about.typed}</span>
          </h2>
          <p className="t-label mt-3 text-base sm:text-lg o-85">{about.role}</p>
          <Fade>
            <p
              data-hud="para"
              className="mt-4 max-w-[48ch] text-sm leading-relaxed o-85 sm:text-[0.98rem]"
            >
              {about.body}
            </p>
          </Fade>
          <Fade delay={0.1}>
            <div className="relative mt-6 sm:mt-8 inline-block">
              <div
                data-hud="name"
                className="inline-flex items-center gap-3 border border-white/25 bg-white/[0.02] px-6 py-2.5 sm:px-8 sm:py-3 t-label text-xs sm:text-[0.75rem] normal-case tracking-normal o-85"
              >
                {about.name}
              </div>
              <span className="readout absolute -bottom-5 right-0 t-micro o-35 t-mono-num text-[0.65rem]">
                -91.23
              </span>
            </div>
          </Fade>

          {/* Mobile HUD Logo Preview (shown on screens < lg) */}
          <div className="mt-8 lg:hidden">
            <div className="relative mx-auto max-w-sm rounded-xl border border-white/20 bg-white/[0.03] p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 t-micro o-55 text-[0.65rem]">
                <span className="text-accent-2">● HUD // ONLINE</span>
                <span className="t-mono-num">{clock}</span>
              </div>
              <div className="relative my-3 h-44 overflow-hidden rounded-lg border border-white/10 bg-black/60 flex items-center justify-center p-2">
                <img
                  src={logo}
                  alt={site.product}
                  className="h-full w-full object-contain opacity-90 mix-blend-screen"
                />
              </div>
              <div className="flex items-center justify-between t-micro o-45 text-[0.65rem]">
                <span>{site.product}</span>
                <span className="t-mono-num">23.55° S, 46.63° O</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop 3D/HUD Frame */}
        <div
          className="relative hidden min-h-[480px] lg:block"
          style={{ perspective: '1200px' }}
        >
          <span
            data-hud="lbl-b"
            className="absolute left-[0%] top-[64%] t-micro o-55 normal-case tracking-[0.08em]"
          >
            {about.labels.b} ●
          </span>
          <span
            data-hud="lbl-c"
            className="absolute right-[2%] top-[8%] t-micro o-55 normal-case tracking-[0.08em]"
          >
            ● {about.labels.c}
          </span>
          <div
            data-hud="box-f"
            className="absolute right-[6%] top-[42%] h-12 w-12 border border-white/25"
          >
            <span className="readout absolute -top-5 right-0 t-micro o-35 t-mono-num">
              273.380
            </span>
          </div>

          <div
            ref={obj}
            className="absolute left-[16%] top-[14%] will-change-transform"
          >
            <div
              data-hud="frame"
              className="relative h-[270px] w-[410px] border border-white/35 bg-black/40 backdrop-blur-sm"
            >
              <img
                src={logo}
                alt={site.product}
                className="h-full w-full bg-black object-contain opacity-90 mix-blend-screen"
              />
              <span className="readout absolute -top-5 left-0 t-micro o-55 t-mono-num">
                {coords}
              </span>
              <span className="readout absolute -bottom-5 right-0 t-micro o-35">
                {site.product.toLowerCase().replace(/\s+/g, '-')}.png
              </span>
              <span className="readout absolute -bottom-5 left-0 t-micro o-35 t-mono-num">
                -19
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer telemetry */}
      <div className="mx-auto max-w-7xl relative mt-16 sm:mt-20 grid items-center gap-3 t-micro text-xs sm:grid-cols-3 border-t border-white/10 pt-6">
        <span
          data-hud="lbl-d"
          className="text-center sm:text-left o-55 normal-case tracking-[0.08em]"
        >
          {about.labels.d} ●
        </span>
        <span className="text-center t-mono-num">
          <span className="block o-95 font-medium">{clock}</span>
          <span className="o-55 text-[0.68rem]">23.55° S, 46.63° O</span>
        </span>
        <span
          data-hud="lbl-e"
          className="text-center sm:text-right o-55 normal-case tracking-[0.08em]"
        >
          ● {about.labels.e}
        </span>
      </div>
    </section>
  );
}
