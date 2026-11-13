import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Instagram,
  X,
} from 'lucide-react';
import {
  BAKERY_INFO,
  INSTAGRAM_POSTS,
  InstagramCategory,
  InstagramPost,
} from '@/src/data/bakeryData';
import { ResilientImage } from './ResilientImage';

const CATEGORIES: InstagramCategory[] = [
  'Todo',
  'Chocolate',
  'Crema Chantilly',
];

export function InstagramGallery() {
  const [selectedCategory, setSelectedCategory] = useState<InstagramCategory>('Todo');
  const [activePost, setActivePost] = useState<InstagramPost | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);

  const visiblePosts = useMemo(() => {
    if (selectedCategory === 'Todo') return INSTAGRAM_POSTS;
    return INSTAGRAM_POSTS.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  // Ajustar cantidad de tarjetas visibles según el ancho de pantalla
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, visiblePosts.length - visibleCount);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, visibleCount]);

  const goToNext = useCallback(() => {
    if (maxIndex === 0) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goToPrev = useCallback(() => {
    if (maxIndex === 0) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-desplazamiento pausable en hover o con modal abierto
  useEffect(() => {
    if (maxIndex === 0 || isPaused || activePost) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => window.clearInterval(timer);
  }, [maxIndex, isPaused, activePost]);

  useEffect(() => {
    if (!activePost) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePost(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activePost]);

  const handleCarouselKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (maxIndex === 0) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrev();
    }
  };

  return (
    <section id="instagram" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Encabezado editorial y filtro funcional */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <a
              href={BAKERY_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#9a4523] hover:underline mb-2"
            >
              <Instagram className="w-4 h-4" aria-hidden="true" />
              <span>{BAKERY_INFO.instagramHandle}</span>
            </a>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#210f07]">
              Galería y novedades en Instagram
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* Controles de filtro por categoría */}
            <div
              role="group"
              aria-label="Filtrar publicaciones por especialidad"
              className="flex flex-wrap items-center gap-1.5 p-1 bg-[#f0eee8] rounded-xl border border-[#d3c3bd]/60"
            >
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[38px] ${
                      isSelected
                        ? 'bg-[#ffffff] text-[#210f07] shadow-xs'
                        : 'text-[#4f4440] hover:text-[#210f07]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Botones Anterior / Siguiente del carrusel */}
            {maxIndex > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={goToPrev}
                  aria-label="Publicación anterior de Instagram"
                  className="w-10 h-10 rounded-full border border-[#d3c3bd] bg-[#ffffff] hover:bg-[#f6f3ed] text-[#210f07] inline-flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Siguiente publicación de Instagram"
                  className="w-10 h-10 rounded-full border border-[#d3c3bd] bg-[#ffffff] hover:bg-[#f6f3ed] text-[#210f07] inline-flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carrusel horizontal responsivo */}
        <div
          tabIndex={0}
          onKeyDown={handleCarouselKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
            const delta = touchStartX.current - endX;
            if (Math.abs(delta) > 40) {
              if (delta > 0) goToNext();
              else goToPrev();
            }
            touchStartX.current = null;
          }}
          aria-roledescription="carrusel"
          aria-label="Carrusel de publicaciones de Instagram de La Terminal"
          className="overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a4523] rounded-2xl"
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
            }}
          >
            {visiblePosts.map((post) => (
              <article
                key={post.id}
                style={{ width: `${100 / visibleCount}%` }}
                className="shrink-0 px-2.5 sm:px-3 group flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => setActivePost(post)}
                  className="text-left rounded-2xl overflow-hidden border border-[#d3c3bd]/70 bg-[#ffffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a4523]"
                >
                  <div className="aspect-square w-full overflow-hidden bg-[#f6f3ed]">
                    <ResilientImage
                      src={post.imageSrc}
                      alt={post.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                      fallbackTitle={post.title}
                    />
                  </div>
                </button>

                {/* Metadatos sin píldoras */}
                <div className="mt-3.5 px-1">
                  <p className="text-xs text-[#4f4440] flex items-center gap-1.5">
                    <span className="font-semibold text-[#9a4523]">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.dateLabel}</span>
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-medium text-[#210f07] leading-snug">
                    <button
                      type="button"
                      onClick={() => setActivePost(post)}
                      className="text-left hover:text-[#9a4523] transition-colors"
                    >
                      {post.title}
                    </button>
                  </h3>
                  <p className="mt-1 text-sm text-[#4f4440] line-clamp-2 leading-relaxed">
                    {post.caption}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Indicadores de posición del carrusel */}
        {maxIndex > 0 && (
          <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Páginas del carrusel de Instagram">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={`Ir a la vista ${idx + 1} del carrusel`}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-150 ${
                  idx === currentIndex
                    ? 'w-7 bg-[#9a4523]'
                    : 'w-2.5 bg-[#d3c3bd] hover:bg-[#81746f]'
                }`}
              />
            ))}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-[#d3c3bd]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-[#4f4440]">
            Compartimos tortas, vitrina diaria y novedades del local en{' '}
            <strong className="font-semibold text-[#210f07]">{BAKERY_INFO.instagramHandle}</strong>.
          </p>
          <a
            href={BAKERY_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#210f07] hover:text-[#9a4523] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Abrir perfil completo en Instagram</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Lightbox accesible */}
      {activePost && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ig-modal-title"
          className="fixed inset-0 z-50 bg-[#1c1c18]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActivePost(null)}
        >
          <div
            className="bg-[#fcf9f3] border border-[#d3c3bd] rounded-2xl max-w-3xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square bg-[#f6f3ed]">
              <ResilientImage
                src={activePost.imageSrc}
                alt={activePost.imageAlt}
                className="w-full h-full object-cover"
                fallbackTitle={activePost.title}
              />
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs text-[#4f4440] flex items-center gap-1.5">
                    <span className="font-semibold text-[#9a4523]">{activePost.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activePost.dateLabel}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setActivePost(null)}
                    aria-label="Cerrar vista ampliada"
                    className="w-10 h-10 -mt-2 -mr-2 rounded-lg inline-flex items-center justify-center text-[#4f4440] hover:bg-[#f0eee8] hover:text-[#210f07] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3
                  id="ig-modal-title"
                  className="mt-3 font-serif text-2xl font-medium text-[#210f07]"
                >
                  {activePost.title}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-[#4f4440] leading-relaxed">
                  {activePost.caption}
                </p>
              </div>

              <div className="pt-4 border-t border-[#d3c3bd]/60 flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-[#4f4440]">
                  {BAKERY_INFO.instagramHandle}
                </span>
                <a
                  href={activePost.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#fcf9f3] bg-[#9a4523] hover:bg-[#7b2f0e] rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>Ver en Instagram</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
