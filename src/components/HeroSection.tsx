import { ArrowDownRight, Instagram } from 'lucide-react';
import { BAKERY_INFO, CRAFT_PILLARS } from '@/src/data/bakeryData';
import { ResilientImage } from './ResilientImage';

export function HeroSection() {
  return (
    <section id="inicio" className="pt-10 sm:pt-14 pb-14 sm:pb-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Composición editorial en 2 columnas balanceadas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs sm:text-sm font-medium text-[#4f4440] mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{BAKERY_INFO.ownerLine}</span>
              <span aria-hidden="true">·</span>
              <span>{BAKERY_INFO.address}, {BAKERY_INFO.city}</span>
              <span aria-hidden="true">·</span>
              <a
                href={BAKERY_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9a4523] hover:underline font-semibold"
              >
                {BAKERY_INFO.instagramHandle}
              </a>
            </p>

            <h1
              className="font-serif font-normal text-[#210f07] tracking-tight leading-[1.08]"
              style={{ fontSize: 'clamp(2.25rem, 4.1vw, 3.6rem)' }}
            >
              Panadería y confitería artesanal con{' '}
              <em className="italic text-[#9a4523]">tortas de autor</em> en Villa Constitución.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#4f4440] leading-relaxed max-w-2xl">
              En <strong className="font-semibold text-[#210f07]">La Terminal</strong> elaboramos cada día panificados frescos, facturas clásicas y tortas de confitería decoradas a mano para celebrar en familia o pasar por nuestro mostrador de Neuquén 1450.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#instagram"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#fcf9f3] bg-[#9a4523] hover:bg-[#7b2f0e] rounded-lg transition-colors duration-150 min-h-[44px] whitespace-nowrap"
              >
                <span>Ver tortas y productos</span>
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href={BAKERY_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#210f07] border border-[#210f07]/30 hover:bg-[#f0eee8] rounded-lg transition-colors duration-150 min-h-[44px] whitespace-nowrap"
              >
                <Instagram className="w-4 h-4 text-[#9a4523]" aria-hidden="true" />
                <span>Seguir en Instagram</span>
              </a>
            </div>
          </div>

          {/* Fotografía real del producto destacado de @laterminal_panaderia */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-[#d3c3bd]/80 bg-[#f6f3ed]">
              <div className="aspect-square w-full">
                <ResilientImage
                  src={BAKERY_INFO.heroImage}
                  alt="Torta artesanal de chocolate con frutillas frescas, crema chantilly y cerezas de Panadería y Confitería La Terminal"
                  className="w-full h-full object-cover"
                  fallbackTitle="Panadería y Confitería La Terminal"
                />
              </div>
              <div className="px-5 py-3.5 bg-[#ffffff] border-t border-[#d3c3bd]/60 flex items-center justify-between gap-3">
                <span className="font-serif text-sm sm:text-base text-[#210f07]">
                  Torta chocolate &amp; frutillas frescas
                </span>
                <span className="text-xs font-medium text-[#9a4523] whitespace-nowrap">
                  {BAKERY_INFO.instagramHandle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pilares del oficio con numeración editorial humana */}
        <div
          id="oficio"
          className="mt-12 sm:mt-16 pt-10 border-t border-[#d3c3bd]/60 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {CRAFT_PILLARS.map((pillar) => (
            <article key={pillar.index} className="flex flex-col gap-2">
              <div className="flex items-baseline gap-2.5">
                <span className="font-serif text-lg text-[#9a4523] tabular-nums">
                  {pillar.index}.
                </span>
                <h2 className="font-serif text-xl font-medium text-[#210f07]">
                  {pillar.title}
                </h2>
              </div>
              <p className="text-sm sm:text-[15px] leading-relaxed text-[#4f4440]">
                {pillar.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
