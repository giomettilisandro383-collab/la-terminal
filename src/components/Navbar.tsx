import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

const NAV_LINKS = [
  { href: '#oficio', label: 'El Oficio' },
  { href: '#vitrina', label: 'Vitrina' },
  { href: '#instagram', label: 'Instagram' },
  { href: '#ubicacion', label: 'Ubicación' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fcf9f3]/90 backdrop-blur-md border-b border-[#d3c3bd]/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zona 1: Marca única en una línea */}
        <a
          href="#inicio"
          className="whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a4523] rounded"
          aria-label="Panadería La Terminal — Inicio"
        >
          <BrandLogo />
        </a>

        {/* Zona 2: Enlaces editoriales concisos */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4f4440]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#9a4523] hover:text-[#210f07] transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zona 3: Acción principal única */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#ubicacion"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-[#fcf9f3] bg-[#210f07] hover:bg-[#382319] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px]"
          >
            Cómo llegar
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#210f07] hover:bg-[#f0eee8] transition-colors duration-150"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Drawer móvil limpio */}
      {mobileMenuOpen && (
        <nav
          aria-label="Navegación móvil"
          className="md:hidden border-t border-[#d3c3bd]/50 bg-[#fcf9f3] px-5 py-4 flex flex-col gap-1"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-2 text-base font-medium text-[#210f07] hover:bg-[#f0eee8] rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#ubicacion"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-[#fcf9f3] bg-[#210f07] rounded-lg"
          >
            Cómo llegar a Neuquén 1450
          </a>
        </nav>
      )}
    </header>
  );
}
