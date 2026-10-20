import { useEffect, useRef, useState } from 'react';
import { gsap, EASE, reduceMotion, scrollTo } from '@/lib/motion';
import { nav, site } from '@/data/content';
import { Mark } from './Loader';

export default function Nav({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!visible || !root.current || reduceMotion()) return;
    gsap.from(root.current.querySelectorAll('.nv'), {
      opacity: 0,
      y: -10,
      duration: 1,
      ease: EASE,
      stagger: 0.06,
      delay: 0.3,
    });
  }, [visible]);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    if (reduceMotion()) {
      el.style.display = open ? 'block' : 'none';
      return;
    }
    if (open) {
      el.style.display = 'block';
      gsap.fromTo(
        el,
        { opacity: 0, y: -10, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: EASE }
      );
      const items = el.querySelectorAll('.menu-item');
      gsap.fromTo(
        items,
        { opacity: 0, x: -6 },
        { opacity: 1, x: 0, duration: 0.3, ease: EASE, stagger: 0.03, delay: 0.05 }
      );
    } else {
      gsap.to(el, {
        opacity: 0,
        y: -8,
        scale: 0.98,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          el.style.display = 'none';
        },
      });
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <header
        ref={root}
        className={`fixed inset-x-0 top-0 z-50 transition-opacity duration-700 ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8 sm:py-5">
          {/* Brand */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              go('#inicio');
            }}
            className="nv group inline-flex items-center gap-2.5 o-95"
            aria-label={site.brand}
          >
            <Mark className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12" />
            <span className="t-display text-lg tracking-tight sm:text-xl">
              {site.brand}
            </span>
          </a>

          {/* Right actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <span className="nv t-label hidden items-center gap-2 lg:inline-flex o-85 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-ok shadow-[0_0_10px_#2ecc40]" />{' '}
              {site.status}
            </span>

            {/* Direct purchase CTA on the nav bar */}
            <a
              href={site.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nv pill pill-accent !min-h-[38px] !px-3.5 !py-1.5 text-xs sm:!px-4 sm:!text-sm shrink-0 shadow-[0_0_20px_rgba(217,189,120,0.25)]"
            >
              <span>Comprar</span>
              <span className="hidden sm:inline">por R$ 47</span>
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>

            {/* Menu button with >= 44px touch hitbox */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="nv flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-bg/80 backdrop-blur-md transition-colors hover:bg-white/10 active:scale-95"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            >
              {open ? (
                <span className="text-lg leading-none font-light" aria-hidden="true">
                  ✕
                </span>
              ) : (
                <span className="flex gap-1" aria-hidden="true">
                  <i className="h-1 w-1 rounded-full bg-fg" />
                  <i className="h-1 w-1 rounded-full bg-fg" />
                  <i className="h-1 w-1 rounded-full bg-fg" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile menu */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Dropdown Menu */}
      <div
        id="site-menu"
        ref={list}
        style={{ display: 'none' }}
        className="fixed right-4 top-20 z-50 w-[calc(100vw-32px)] max-w-[340px] rounded-2xl border border-white/15 bg-[#0a0a0a]/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:right-8"
      >
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <span className="t-micro text-accent tracking-wider">Navegação</span>
          <span className="t-micro o-55 inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" /> {site.status}
          </span>
        </div>

        <ul className="space-y-1">
          {nav.map((n) => (
            <li key={n.href} className="menu-item">
              <a
                href={n.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(n.href);
                }}
                className="flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2 text-base font-medium o-95 transition-colors hover:bg-white/5 hover:text-accent"
              >
                <span>{n.label}</span>
                <span className="arrow text-sm opacity-40" aria-hidden="true">
                  ↘
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-white/10 pt-4">
          <a
            href={site.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="pill pill-accent flex w-full items-center justify-center text-center text-sm font-semibold !py-3"
          >
            <span>Garantir Vaga · R$ 47</span>
            <span className="arrow ml-1" aria-hidden="true">
              →
            </span>
          </a>
          <div className="mt-3 flex items-center justify-between t-micro o-45 text-[0.7rem]">
            <span>{site.domain}</span>
            <span>7 dias de garantia</span>
          </div>
        </div>
      </div>
    </>
  );
}
