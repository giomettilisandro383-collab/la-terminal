import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Code2,
  Database,
  RefreshCw,
} from 'lucide-react';
import {
  APPSHEET_CONFIG,
  AppSheetComboSlide,
  buildAppSheetEndpoint,
  fetchAppSheetCombos,
  isAppSheetConfigured,
} from '@/src/services/appsheetApi';
import { ResilientImage } from './ResilientImage';

type CarouselViewState = 'unconfigured' | 'loading' | 'error' | 'empty' | 'ready';

export function AppSheetCarousel() {
  const configured = isAppSheetConfigured();
  const hasAccessKey = Boolean(APPSHEET_CONFIG.ACCESS_KEY.trim());

  const [viewState, setViewState] = useState<CarouselViewState>(
    configured ? 'loading' : 'unconfigured',
  );
  const [slides, setSlides] = useState<AppSheetComboSlide[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showIntegrationGuide, setShowIntegrationGuide] = useState(false);

  const touchStartX = useRef<number | null>(null);

  const loadSlides = useCallback(async () => {
    if (!isAppSheetConfigured()) {
      setViewState('unconfigured');
      setSlides([]);
      setErrorMessage('');
      return;
    }

    setViewState('loading');
    setErrorMessage('');

    try {
      const result = await fetchAppSheetCombos();
      if (result.status === 'unconfigured') {
        setViewState('unconfigured');
        setSlides([]);
      } else if (result.status === 'empty') {
        setViewState('empty');
        setSlides([]);
      } else {
        setSlides(result.slides);
        setActiveIndex(0);
        setViewState('ready');
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error inesperado al consultar los combos en AppSheet.',
      );
      setViewState('error');
    }
  }, []);

  useEffect(() => {
    void loadSlides();
  }, [loadSlides]);

  const goToNext = useCallback(() => {
    setSlides((current) => {
      if (current.length <= 1) return current;
      setActiveIndex((prev) => (prev + 1) % current.length);
      return current;
    });
  }, []);

  const goToPrev = useCallback(() => {
    setSlides((current) => {
      if (current.length <= 1) return current;
      setActiveIndex((prev) => (prev - 1 + current.length) % current.length);
      return current;
    });
  }, []);

  // Auto-avance pausable cuando el carrusel tiene más de 1 imagen
  useEffect(() => {
    if (viewState !== 'ready' || slides.length <= 1 || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [viewState, slides.length, isPaused]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (viewState !== 'ready' || slides.length <= 1) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrev();
    }
  };

  const previewLoadingState = () => {
    setErrorMessage('');
    setViewState('loading');
  };

  const previewErrorState = () => {
    setErrorMessage(
      'Error al conectar con la API de AppSheet (verificá APP_ID, nombre de tabla o conexión de red).',
    );
    setViewState('error');
  };

  const resetToConfiguredOrEmpty = () => {
    void loadSlides();
  };

  const currentSlide = slides[activeIndex];

  return (
    <section
      id="vitrina"
      className="py-14 sm:py-20 bg-[#f6f3ed] border-y border-[#d3c3bd]/50"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Encabezado de sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wide text-[#9a4523] mb-2">
              Combos destacados · Conectado a AppSheet API
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#210f07] leading-tight">
              Promociones y combos del día
            </h2>
          </div>

          <p className="text-sm text-[#4f4440] max-w-sm">
            Filtra automáticamente los registros de{' '}
            <span className="font-semibold text-[#210f07]">Categoría: Combo</span>{' '}
            mostrando únicamente imagen y texto promocional.
          </p>
        </div>

        {/* Estado de Carga (Skeleton) */}
        {viewState === 'loading' && (
          <div
            aria-busy="true"
            aria-live="polite"
            className="rounded-2xl border border-[#d3c3bd]/70 bg-[#ffffff] overflow-hidden"
          >
            <div className="aspect-[16/9] sm:aspect-[21/10] w-full bg-[#ebe8e2] animate-pulse relative flex flex-col justify-end p-6 sm:p-10">
              <div className="space-y-3 max-w-md">
                <div className="h-3.5 w-32 rounded bg-[#d3c3bd]/70" />
                <div className="h-8 w-3/4 rounded bg-[#d3c3bd]/80" />
              </div>
            </div>
            <div className="px-6 py-4 flex items-center justify-between border-t border-[#d3c3bd]/50 bg-[#fcf9f3]">
              <span className="text-sm text-[#4f4440] inline-flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#9a4523]" aria-hidden="true" />
                <span>Consultando combos en AppSheet API...</span>
              </span>
              {!configured && (
                <button
                  type="button"
                  onClick={resetToConfiguredOrEmpty}
                  className="text-xs font-semibold text-[#9a4523] hover:underline whitespace-nowrap"
                >
                  Volver a estado vacío
                </button>
              )}
            </div>
          </div>
        )}

        {/* Estado de Error */}
        {viewState === 'error' && (
          <div
            role="alert"
            className="rounded-2xl border border-[#ba1a1a]/30 bg-[#ffffff] p-8 sm:p-12 text-center"
          >
            <div className="max-w-lg mx-auto flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#210f07]">
                No pudimos cargar los combos de AppSheet
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#4f4440] leading-relaxed">
                {errorMessage ||
                  'La API de AppSheet demoró en responder o devolvió un error de acceso.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetToConfiguredOrEmpty}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#fcf9f3] bg-[#210f07] hover:bg-[#382319] rounded-lg transition-colors min-h-[44px]"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  <span>{configured ? 'Reintentar conexión' : 'Volver a estado vacío'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estado Vacío / Sin APP_ID configurado todavía */}
        {(viewState === 'unconfigured' || viewState === 'empty') && (
          <div className="rounded-2xl border border-[#d3c3bd] bg-[#ffffff] p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9a4523] mb-3">
                  <Database className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {viewState === 'unconfigured'
                      ? hasAccessKey
                        ? 'Access Key cargado · Falta indicar App ID de AppSheet'
                        : 'Esperando credenciales de AppSheet'
                      : 'Sin registros en categoría Combo'}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#210f07]">
                  {viewState === 'unconfigured'
                    ? 'Carrusel de combos listo para conectar con tu App ID'
                    : 'No hay imágenes de combos disponibles'}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-[#4f4440] leading-relaxed max-w-xl">
                  {viewState === 'unconfigured'
                    ? 'El Application Access Key ya está integrado y el filtro exclusivo por Categoria = "Combo" está activo. Solo falta completar tu APP_ID (y el nombre exacto de la tabla si difiere) en appsheetApi.ts o en .env.'
                    : `La consulta a la tabla "${APPSHEET_CONFIG.TABLE_NAME}" finalizó correctamente, pero no se encontraron filas con Categoria = "Combo" e Imagen válida.`}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowIntegrationGuide((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#fcf9f3] bg-[#210f07] hover:bg-[#382319] rounded-lg transition-colors min-h-[44px] whitespace-nowrap"
                  >
                    <Code2 className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {showIntegrationGuide
                        ? 'Ocultar código de filtro'
                        : 'Ver filtro Combo y fetch'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={previewLoadingState}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-[#210f07] border border-[#d3c3bd] hover:bg-[#f6f3ed] rounded-lg transition-colors min-h-[44px] whitespace-nowrap"
                  >
                    Simular carga (Skeleton)
                  </button>

                  <button
                    type="button"
                    onClick={previewErrorState}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-[#4f4440] border border-[#d3c3bd] hover:bg-[#f6f3ed] rounded-lg transition-colors min-h-[44px] whitespace-nowrap"
                  >
                    Simular error de API
                  </button>
                </div>
              </div>

              {/* Resumen de configuración activa */}
              <div className="lg:col-span-5 rounded-xl bg-[#f6f3ed] border border-[#d3c3bd]/60 p-5 sm:p-6">
                <h4 className="font-serif text-lg font-medium text-[#210f07] mb-3">
                  Configuración de consulta AppSheet
                </h4>
                <dl className="space-y-2.5 text-sm">
                  <div className="flex justify-between gap-4 pb-2 border-b border-[#d3c3bd]/50">
                    <dt className="font-semibold text-[#210f07]">Access Key</dt>
                    <dd className="font-mono text-xs text-[#9a4523]">
                      {hasAccessKey ? 'Configurado (V2-7GQeh...)' : 'Pendiente'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 pb-2 border-b border-[#d3c3bd]/50">
                    <dt className="font-semibold text-[#210f07]">App ID</dt>
                    <dd className="font-mono text-xs text-[#4f4440]">
                      {APPSHEET_CONFIG.APP_ID.trim() || 'Pendiente de completar'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 pb-2 border-b border-[#d3c3bd]/50">
                    <dt className="font-semibold text-[#210f07]">Filtro aplicado</dt>
                    <dd className="text-right text-[#4f4440]">
                      Categoria === &quot;combo&quot;
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-[#210f07]">Campos usados</dt>
                    <dd className="text-right text-[#4f4440]">
                      Solo Imagen y Texto
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {showIntegrationGuide && (
              <div className="mt-8 pt-6 border-t border-[#d3c3bd]/60">
                <p className="text-xs font-semibold text-[#4f4440] mb-3">
                  Lógica activa en <code className="text-[#210f07]">src/services/appsheetApi.ts</code> (solo falta completar <code className="text-[#210f07]">APP_ID</code> y <code className="text-[#210f07]">TABLE_NAME</code>):
                </p>
                <pre className="overflow-x-auto rounded-xl bg-[#210f07] text-[#f6f3ed] p-4 sm:p-5 text-xs leading-relaxed font-mono">
{`// Endpoint AppSheet REST API v2:
// ${isAppSheetConfigured() ? buildAppSheetEndpoint() : 'https://www.appsheet.com/api/v2/apps/{APP_ID}/tables/{TABLE_NAME}/Action'}

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'ApplicationAccessKey': 'V2-7GQeh-...',
  },
  body: JSON.stringify({ Action: 'Find', Properties: {}, Rows: [] }),
});

const itemsCombo = data
  .filter(item => item.Categoria && item.Categoria.trim().toLowerCase() === 'combo')
  .map(item => ({
    imagenUrl: item.Imagen.startsWith('http')
      ? item.Imagen
      : \`https://www.appsheet.com/template/gettablefileurl?appName=\${APP_ID}&tableName=\${TABLE_NAME}&fileName=\${encodeURIComponent(item.Imagen)}\`,
    texto: item.Texto || ''
  }));`}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Carrusel listo con los combos filtrados */}
        {viewState === 'ready' && currentSlide && (
          <div
            id="carrusel-inner"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
              const delta = touchStartX.current - endX;
              if (Math.abs(delta) > 45) {
                if (delta > 0) goToNext();
                else goToPrev();
              }
              touchStartX.current = null;
            }}
            aria-roledescription="carrusel"
            aria-label="Carrusel de combos desde AppSheet"
            className="relative rounded-2xl overflow-hidden border border-[#d3c3bd] bg-[#210f07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a4523]"
          >
            <div className="aspect-[16/10] sm:aspect-[16/9] max-h-[540px] w-full relative">
              <ResilientImage
                src={currentSlide.imagenUrl}
                alt={currentSlide.texto}
                className="w-full h-full object-cover transition-opacity duration-300"
                fallbackTitle={currentSlide.texto}
              />

              {/* Scrim medido para legibilidad sobre fotografía */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#1c1c18]/85 via-[#1c1c18]/25 to-transparent"
              />

              {/* Texto del combo */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-xl text-[#fcf9f3]">
                  <p className="text-xs font-medium text-[#e2c384] mb-1.5">
                    Combo · Panadería La Terminal
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-tight">
                    {currentSlide.texto}
                  </h3>
                </div>

                {slides.length > 1 && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={goToPrev}
                      aria-label="Combo anterior"
                      className="w-11 h-11 rounded-full bg-[#fcf9f3]/90 hover:bg-[#ffffff] text-[#210f07] inline-flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      aria-label="Siguiente combo"
                      className="w-11 h-11 rounded-full bg-[#fcf9f3]/90 hover:bg-[#ffffff] text-[#210f07] inline-flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {slides.length > 1 && (
              <div className="bg-[#fcf9f3] px-6 py-3.5 border-t border-[#d3c3bd]/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2" role="tablist" aria-label="Seleccionar combo">
                  {slides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={idx === activeIndex}
                      aria-label={`Ver combo ${idx + 1}: ${slide.texto}`}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2.5 rounded-full transition-all duration-150 ${
                        idx === activeIndex
                          ? 'w-7 bg-[#9a4523]'
                          : 'w-2.5 bg-[#d3c3bd] hover:bg-[#81746f]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-[#4f4440] tabular-nums">
                  {activeIndex + 1} / {slides.length}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
