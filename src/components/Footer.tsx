import { Instagram, MapPin } from 'lucide-react';
import { BAKERY_INFO } from '@/src/data/bakeryData';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#fcf9f3] border-t border-[#d3c3bd]/70 py-12">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#d3c3bd]/50">
          <div className="md:col-span-5">
            <BrandLogo />
            <p className="mt-3 text-sm text-[#4f4440] max-w-sm leading-relaxed">
              Panadería y confitería artesanal {BAKERY_INFO.ownerLine} en Villa Constitución. Tortas decoradas, facturas y panificados frescos todos los días.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2 text-sm text-[#4f4440]">
            <p className="font-semibold text-[#210f07]">Local y horarios</p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#9a4523] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{BAKERY_INFO.fullAddress}</span>
            </p>
            <p className="tabular-nums">Lunes a Lunes · 07:00 a 23:00 hs · Todo el año</p>
          </div>

          <div className="md:col-span-3 space-y-2 text-sm">
            <p className="font-semibold text-[#210f07]">Comunidad</p>
            <a
              href={BAKERY_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#9a4523] hover:underline font-medium"
            >
              <Instagram className="w-4 h-4" aria-hidden="true" />
              <span>{BAKERY_INFO.instagramHandle}</span>
            </a>
            <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#4f4440]">
              <a href="#oficio" className="hover:text-[#210f07]">El Oficio</a>
              <a href="#vitrina" className="hover:text-[#210f07]">Vitrina</a>
              <a href="#instagram" className="hover:text-[#210f07]">Instagram</a>
              <a href="#ubicacion" className="hover:text-[#210f07]">Ubicación</a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4f4440]">
          <p>© {year} Panadería y Confitería La Terminal {BAKERY_INFO.ownerLine}.</p>
          <p>Neuquén 1450 · {BAKERY_INFO.postalCode}</p>
        </div>
      </div>
    </footer>
  );
}
