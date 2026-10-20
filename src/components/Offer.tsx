import { useEffect, useState } from 'react';
import logo from '@/assets/dominio-ia-360-logo.jpg';
import { offer, site, faq, footer } from '@/data/content';
import Reveal, { Fade } from './ui/Reveal';
import { Mark } from './Loader';

export function Offer() {
  return (
    <section id="oferta" className="relative z-10 px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <p className="t-micro text-accent tracking-wider">{offer.kicker}</p>
          <Reveal
            as="h2"
            className="t-display mt-3 text-[clamp(2.2rem,6vw,3.6rem)] sm:text-[4rem] lg:text-[4.6rem] leading-[0.92] tracking-tight"
          >
            {offer.title}
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2">
            {offer.list.map((l) => (
              <li
                key={l}
                className="flex items-start gap-3 border-t border-white/10 pt-3 text-sm leading-relaxed o-85 sm:text-[0.95rem]"
              >
                <span className="text-accent font-bold mt-0.5 shrink-0" aria-hidden="true">
                  ✓
                </span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>

        <Fade className="relative rounded-[24px] border border-accent/30 bg-[#0c0c0c]/90 p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] sm:p-8">
          <span className="reg right-4 top-4 text-fg hidden sm:block" />
          <div className="mx-auto flex h-24 w-full max-w-[240px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/80 p-2">
            <img
              src={logo}
              alt={site.product}
              className="h-full w-full object-contain opacity-95 mix-blend-screen"
            />
          </div>

          <div className="mt-5 text-center">
            <span className="t-label block text-xs o-55 uppercase tracking-widest">
              {site.product}
            </span>
            <div className="mt-1 text-xs o-45 line-through">
              De R$ {site.price.from} por apenas:
            </div>
            <div className="mt-2 flex items-start justify-center gap-1 leading-none">
              <span className="t-display mt-2 text-xl text-accent font-bold">R$</span>
              <span className="t-display t-mono-num text-[4.5rem] sm:text-[5.2rem] leading-[0.85] text-white">
                {site.price.now}
              </span>
            </div>
            <div className="t-label mt-2 text-xs sm:text-sm o-85 font-medium">
              {site.price.installments}
            </div>
          </div>

          {/* Primary Checkout CTA */}
          <a
            href={site.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill pill-accent mt-6 w-full justify-center text-center font-bold text-base !min-h-[52px] shadow-[0_0_30px_rgba(217,189,120,0.35)] hover:shadow-[0_0_40px_rgba(217,189,120,0.5)] active:scale-[0.98]"
          >
            <span>{offer.cta}</span>
            <span className="arrow ml-1" aria-hidden="true">
              →
            </span>
          </a>

          <p className="mt-4 text-center text-xs leading-relaxed o-55">
            {offer.pay}
          </p>

          <div className="mt-4 border-t border-dashed border-white/20 pt-4 text-center text-xs leading-relaxed o-85 flex items-center justify-center gap-2">
            <span className="text-accent-2">🛡️</span>
            <span>{offer.guarantee}</span>
          </div>

          {/* Security & Access trust badges */}
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-[0.68rem] o-65">
            <div className="flex items-center gap-1.5 justify-center text-center">
              <span>⚡</span> <span>Acesso imediato</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center text-center">
              <span>🔒</span> <span>Checkout Seguro</span>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative z-10 px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="t-micro text-accent tracking-wider">Dúvidas</p>
        <Reveal
          as="h2"
          className="t-display-md mt-2 text-[clamp(1.8rem,5vw,2.8rem)] tracking-tight"
        >
          Respostas sem rodeio.
        </Reveal>
        <div className="mt-8 border-t border-white/10">
          {faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex min-h-[56px] w-full items-center justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <span className="t-label text-sm sm:text-[0.95rem] o-95 font-semibold pr-2">
                    {f.q}
                  </span>
                  <span
                    className={`t-display text-2xl text-accent transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[64ch] pb-5 text-sm leading-relaxed o-65 sm:text-[0.95rem]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <section
      className="relative z-10 flex min-h-[80svh] flex-col justify-end px-4 pb-8 pt-20 sm:px-8 sm:min-h-[90svh]"
      aria-label="Fechamento"
    >
      <div className="mx-auto w-full max-w-7xl grid gap-8 lg:grid-cols-2 lg:items-end">
        <div>
          <Reveal
            as="h2"
            className="t-display text-[clamp(2.5rem,8vw,5.5rem)] sm:text-[6rem] lg:text-[7.4rem] leading-[0.88] tracking-tight"
          >
            Bora fazer algo foda?
          </Reveal>
          <a
            href={site.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill pill-accent mt-6 sm:mt-8 !min-h-[50px] font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(217,189,120,0.3)]"
          >
            <span>{offer.cta}</span>
            <span className="arrow ml-1" aria-hidden="true">
              →
            </span>
          </a>
        </div>
        <div className="lg:text-right">
          <p className="t-display-md text-xl sm:text-[2.6rem]">Fale com a gente</p>
          <button
            type="button"
            onClick={copy}
            className="u-link t-label mt-2 o-85 text-sm sm:text-base py-1"
            aria-live="polite"
          >
            <span>{copied ? 'E-mail copiado!' : site.email}</span>
            <span className="arrow ml-1" aria-hidden="true">
              ↙
            </span>
          </button>
        </div>
      </div>

      <footer className="mx-auto mt-14 sm:mt-16 w-full max-w-7xl flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 t-micro o-55 text-xs">
          <Mark className="h-5 w-5 shrink-0" />
          <span>
            {site.domain} · {site.year}
          </span>
          <span aria-hidden="true">·</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-fg">
            {footer.legal}
          </a>
          <span aria-hidden="true">·</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-fg">
            {footer.privacy}
          </a>
        </div>
        <p className="max-w-[60ch] t-micro normal-case tracking-normal o-40 text-xs sm:text-right">
          {footer.note}
        </p>
      </footer>
    </section>
  );
}

/** Sticky bottom CTA exclusively for mobile viewports */
export function FloatingMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offerEl = document.getElementById('oferta');
      let nearOffer = false;

      if (offerEl) {
        const rect = offerEl.getBoundingClientRect();
        // Hide when near or inside the offer section
        if (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0) {
          nearOffer = true;
        }
      }

      // Show after scrolling past hero (~350px) and when not near the main offer card
      setVisible(scrollY > 350 && !nearOffer);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 p-3 sm:hidden transition-all duration-300 pointer-events-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-sm items-center justify-between gap-3 rounded-full border border-accent/40 bg-[#0a0a0a]/95 px-4 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-xl pointer-events-auto">
        <div className="flex flex-col">
          <span className="t-micro text-[0.65rem] text-accent font-semibold tracking-wider">
            {site.product}
          </span>
          <span className="t-display text-sm leading-none text-white font-bold">
            R$ {site.price.now}{' '}
            <span className="text-[0.65rem] font-normal o-65">único</span>
          </span>
        </div>

        <a
          href={site.checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pill pill-accent !min-h-[36px] !px-4 !py-1 text-xs font-bold shrink-0 shadow-[0_0_15px_rgba(217,189,120,0.35)]"
        >
          <span>Comprar</span>
          <span className="arrow ml-1" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
