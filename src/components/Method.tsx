import { method, site, includes } from '@/data/content';
import Reveal, { Fade } from './ui/Reveal';
import { scrollTo } from '@/lib/motion';

/* Painel editorial arredondado inset sobre o preto, com grade editorial,
   marcas de registro, lista numerada e marquee. Totalmente responsivo. */
export default function Method() {
  const marquee = Array.from({ length: 10 }, () => [site.product, method.year]).flat();
  return (
    <section id="metodo" className="relative z-10 px-2.5 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl relative overflow-hidden rounded-[20px] sm:rounded-[28px] bg-panel text-[#111] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.85)]">
        <span className="reg left-6 top-6 hidden sm:block" />
        <span className="reg right-6 top-6 hidden sm:block" />
        <span className="reg bottom-6 left-6 hidden sm:block" />
        <span className="reg bottom-6 right-6 hidden sm:block" />

        {/* header */}
        <div className="flex items-center justify-between px-5 pt-8 sm:px-12 sm:pt-14">
          <h2 className="t-display text-[1.8rem] leading-none sm:text-[3.2rem] lg:text-[3.6rem]">
            {site.product}
          </h2>
          <span className="t-label hidden sm:inline-flex items-center gap-3 text-[#111]/80">
            {method.kicker} <Crosshair />
          </span>
        </div>

        {/* hero band: image-like block with grid */}
        <div className="mx-4 mt-6 grid overflow-hidden rounded-xl border border-black/10 sm:mx-12 sm:mt-8 lg:grid-cols-[1fr_260px]">
          <div
            className="relative"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(135deg,#eceef1,#f8f8f6)',
              backgroundSize: '40px 40px, 40px 40px, 100% 100%',
            }}
          >
            <div className="flex min-h-[220px] items-center justify-center p-3.5 sm:min-h-[260px] sm:p-8">
              <ChatMock />
            </div>
          </div>
          <div className="flex flex-col justify-between border-t border-black/10 bg-white/40 p-4 sm:p-5 lg:border-l lg:border-t-0">
            <div className="t-label text-[#111]/60 space-y-1 text-xs sm:text-sm">
              <div>01 · Aula ao vivo</div>
              <div>02 · Exercício prático</div>
              <div>03 · Aplicação real</div>
            </div>
            <a
              href="#modulos"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#modulos');
              }}
              className="u-link t-label self-end text-[#111]/70 text-xs sm:text-sm mt-3 lg:mt-0"
            >
              Ver módulos <span className="arrow" aria-hidden="true">↘</span>
            </a>
          </div>
        </div>

        {/* editorial grid */}
        <div className="grid gap-6 px-5 py-8 sm:gap-10 sm:px-12 sm:py-12 lg:grid-cols-[120px_1fr] lg:gap-16">
          <span className="t-display text-xl sm:text-2xl text-[#111]/80">{method.year}</span>
          <div className="lg:ml-auto lg:max-w-[580px] lg:text-right">
            <Reveal as="h3" className="t-display-md text-[1.4rem] sm:text-[2rem] leading-snug">
              {method.title}
            </Reveal>
            <Fade>
              <p className="mt-4 text-sm leading-relaxed text-[#111]/70 sm:text-[1rem]">
                {method.body}
              </p>
            </Fade>
          </div>
        </div>

        <div className="grid gap-8 px-5 pb-10 sm:gap-10 sm:px-12 sm:pb-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal
              as="h3"
              className="t-display text-[2rem] leading-none sm:text-[3rem] lg:text-[3.4rem]"
            >
              {method.roleTitle}
            </Reveal>
            <Fade>
              <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-[#111]/70 sm:text-[0.95rem]">
                {method.roleBody}
              </p>
            </Fade>
            <div className="mt-8 sm:mt-10">
              <p className="t-label text-[#111]/55 text-xs sm:text-sm">{method.stackTitle}</p>
              <ol className="mt-3 border-l border-black/15 pl-5 sm:pl-6">
                {method.stack.map((s, i) => (
                  <li key={s} className="py-1.5 sm:py-2">
                    <span className="t-label block text-[#111]/45 text-xs">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="t-label text-sm sm:text-base text-[#111]/85">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 self-start">
            {includes.map((it) => (
              <Fade
                key={it.t}
                className="rounded-xl border border-black/10 bg-white/60 p-4 sm:p-5 shadow-sm"
              >
                <span className="t-display t-mono-num block text-[2.2rem] sm:text-[2.6rem] leading-none text-[#111]">
                  {it.n}
                </span>
                <span className="t-label mt-2 block text-xs sm:text-sm text-[#111]/90 font-bold">
                  {it.t}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-[#111]/60">
                  {it.d}
                </span>
              </Fade>
            ))}
          </div>
        </div>

        {/* marquee */}
        <div className="marquee border-y border-black/10 py-3 text-[#111]/55">
          <div className="marquee-track t-label text-xs sm:text-sm">
            {[...marquee, ...marquee].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-6 sm:gap-10">
                {t} <i className="h-1 w-1 rounded-full bg-current" />
              </span>
            ))}
          </div>
        </div>

        {/* constraints */}
        <div className="relative px-5 py-12 text-center sm:px-12 sm:py-20">
          <Reveal
            as="h3"
            className="t-display-md mx-auto text-[1.5rem] sm:text-[2.2rem] max-w-xl"
          >
            {method.constraintsTitle}
          </Reveal>
          <Fade>
            <p className="mx-auto mt-4 max-w-[60ch] text-xs leading-relaxed text-[#111]/70 sm:text-[0.95rem]">
              {method.constraints}
            </p>
          </Fade>
          <div className="mt-8 flex flex-col items-center gap-3">
            <a
              href={site.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-dark !min-h-[48px] px-8 text-sm font-semibold"
            >
              <span>Comprar por R$ 47</span>
              <span className="arrow" aria-hidden="true">→</span>
            </a>
            <span className="mt-2 h-8 w-px border-l border-dashed border-black/30" aria-hidden="true" />
            <i className="h-1.5 w-1.5 rounded-full bg-black/50" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Crosshair() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 opacity-50"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="7" />
      <path d="M12 1v6M12 17v6M1 12h6M17 12h6" />
    </svg>
  );
}

function ChatMock() {
  return (
    <div className="w-full max-w-[500px] rounded-xl border border-black/10 bg-white/90 p-3.5 sm:p-4 text-left shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)] backdrop-blur">
      <div className="t-micro flex items-center justify-between text-[#111]/45 text-[0.65rem] sm:text-xs">
        <span className="truncate">Sua IA · ChatGPT, Claude ou Gemini</span>
        <span className="shrink-0 ml-2">Aula 02</span>
      </div>
      <div className="mt-3 ml-auto max-w-[90%] rounded-xl rounded-br-sm bg-[#111] px-3 py-2 text-[0.76rem] sm:text-[0.82rem] leading-snug text-white/90">
        <span className="t-micro block text-accent text-[0.62rem]">Você</span>
        Você é analista comercial. Com os dados abaixo, escreva o relatório semanal pro diretor:
        5 linhas, começa pelo resultado, termina com 2 próximos passos.
      </div>
      <div className="mt-2 max-w-[94%] rounded-xl rounded-bl-sm border border-black/10 bg-white px-3 py-2 text-[0.76rem] sm:text-[0.82rem] leading-snug text-[#111]/80">
        <span className="t-micro block text-[#111]/45 text-[0.62rem]">IA</span>
        <b>Semana 42:</b> faturamento R$ 184 mil (+9% vs. semana anterior), puxado pela região Sul.
        Conversão caiu de 14% para 12% no WhatsApp.{' '}
        <b>Próximos passos:</b> 1) revisar o roteiro do WhatsApp; 2) repor estoque até quinta.
      </div>
    </div>
  );
}
