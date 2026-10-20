import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, ScrollTrigger, reduceMotion, EASE } from '@/lib/motion';

type Props = {
  as?: ElementType;
  className?: string;
  children: string;
  delay?: number;
  stagger?: number;
  /** 'scroll' animates when entering the viewport; 'now' animates on mount (after `delay`). */
  trigger?: 'scroll' | 'now';
  start?: string;
};

/** Word-by-word reveal with a soft blur, as in the reference. Text is visible at rest. */
export default function Reveal({ as: Tag = 'p', className = '', children, delay = 0, stagger = 0.03, trigger = 'scroll', start = 'top 85%' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const words = children.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion()) return;
    el.classList.add('is-armed');
    const targets = el.querySelectorAll('.w');
    const tween = gsap.to(targets, {
      opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: EASE, stagger: { each: stagger, from: 'start' }, delay,
      paused: trigger === 'scroll',
      onComplete: () => el.classList.remove('is-armed'),
    });
    let st: ScrollTrigger | undefined;
    if (trigger === 'scroll') st = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => tween.play() });
    return () => { st?.kill(); tween.kill(); };
  }, [children, delay, stagger, trigger, start]);

  return (
    <Tag ref={ref} className={`reveal ${className}`} aria-label={children}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
          <span className="w">{w}{i < words.length - 1 ? ' ' : ''}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Generic fade/slide-up for blocks. */
export function Fade({ children, className = '', delay = 0, y = 24 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion()) return;
    gsap.set(el, { opacity: 0, y });
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay }),
    });
    return () => { st.kill(); gsap.set(el, { clearProps: 'all' }); };
  }, [delay, y]);
  return <div ref={ref} className={className}>{children}</div>;
}
