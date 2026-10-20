import { useEffect, useRef } from 'react';
import { createBlackHole, type BlackHoleRenderer } from '@/lib/blackhole';
import { ScrollTrigger, reduceMotion } from '@/lib/motion';

/* Fundo fixo: buraco negro ray-traced (src/lib/blackhole.ts).
   O scroll da zona do hero inclina a câmera (de cima para a borda do disco);
   o mouse dá paralaxe de câmera. */
export default function Scene({ active }: { active: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<BlackHoleRenderer | null>(null);
  const stateRef = useRef({ scroll: 0, mouse: { x: 0, y: 0 }, active: false });

  useEffect(() => {
    if (!canvas.current) return;
    let r: BlackHoleRenderer | null = null;
    try { r = createBlackHole(canvas.current); } catch { r = null; }
    rendererRef.current = r;
    const push = () => r?.setState(stateRef.current);
    const st = ScrollTrigger.create({
      trigger: '#hero-zone', start: 'top top', end: 'bottom bottom', scrub: 0.6,
      onUpdate: (self) => { stateRef.current.scroll = self.progress; push(); },
    });
    const onMove = (e: PointerEvent) => {
      if (reduceMotion()) return;
      stateRef.current.mouse = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
      push();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    push();
    return () => { st.kill(); window.removeEventListener('pointermove', onMove); r?.dispose(); rendererRef.current = null; };
  }, []);

  useEffect(() => { stateRef.current.active = active; rendererRef.current?.setState(stateRef.current); }, [active]);

  return (
    <div className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-[1800ms] ease-out ${active ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
      <canvas ref={canvas} className="pointer-events-none block h-full w-full" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 50%, transparent 60%, rgba(0,0,0,0.5) 100%)' }} />
    </div>
  );
}
