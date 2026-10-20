import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const EASE = 'expo.out';

export const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Smooth scroll (Lenis) synced with GSAP ScrollTrigger. Returns a cleanup. */
export function initSmoothScroll() {
  if (reduceMotion()) return () => {};
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    delete (window as unknown as { __lenis?: Lenis }).__lenis;
  };
}

export function scrollTo(target: string) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  const el = document.querySelector(target);
  if (!el) return;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 });
  else (el as HTMLElement).scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' });
}

export function lockScroll(lock: boolean) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lock ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = lock ? 'hidden' : '';
}

export { gsap, ScrollTrigger };
