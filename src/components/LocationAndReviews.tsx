import { ArrowUpRight, Clock, MapPin, Star } from 'lucide-react';
import { BAKERY_INFO, GOOGLE_REVIEWS_SUMMARY } from '@/src/data/bakeryData';

export function LocationAndReviews() {
  return (
    <section
      id="ubicacion"
      className="py-16 sm:py-24 bg-[#f6f3ed] border-t border-[#d3c3bd]/60"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold text-[#9a4523] mb-2">
            Nuestra Ubicación · Villa Constitución
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#210f07]">
            Dónde encontrarnos y qué dicen los vecinos
          </h2>
        </div>

        {/* Grilla balanceada de 12 columnas con igual altura */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Columna izquierda: Mapa interactivo incrustado (Google Maps Embed Iframe) */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl overflow-hidden border border-[#d3c3bd] bg-[#ffffff]">
            <div className="w-full h-[340px] sm:h-[400px] lg:flex-1 bg-[#ebe8e2]">
              <iframe
                title="Mapa de ubicación de Panadería La Terminal en Neuquén 1450, Villa Constitución"
                src={BAKERY_INFO.googleMapsEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="p-6 sm:p-7 bg-[#ffffff] border-t border-[#d3c3bd]/60 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9a4523] mb-1.5">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>Dirección del local</span>
                </div>
                <p className="font-serif text-xl font-medium text-[#210f07]">
                  {BAKERY_INFO.address}
                </p>
                <p className="text-sm text-[#4f4440]">
                  {BAKERY_INFO.postalCode} · {BAKERY_INFO.city}, {BAKERY_INFO.province}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9a4523] mb-1.5">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>Horarios de atención</span>
                </div>
                <ul className="space-y-1 text-sm text-[#4f4440] tabular-nums">
                  {BAKERY_INFO.hours.map((slot) => (
                    <li key={slot.days} className="flex justify-between gap-3">
                      <span className="font-medium text-[#210f07]">{slot.days}</span>
                      <span>{slot.time}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={BAKERY_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#9a4523] hover:underline"
                >
                  <span>Cómo llegar en Google Maps</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Columna derecha: Tarjeta de Reseñas de Google Maps */}
          <div className="lg:col-span-5 rounded-2xl border border-[#d3c3bd] bg-[#ffffff] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Cabecera de puntaje agregado */}
              <div className="pb-6 border-b border-[#d3c3bd]/60 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#4f4440] mb-1">
                    Reseñas de Google Maps
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-4xl sm:text-5xl font-normal text-[#210f07] tabular-nums">
                      {GOOGLE_REVIEWS_SUMMARY.averageRating.toFixed(1)}
                    </span>
                    <div>
                      <div
                        className="flex items-center gap-0.5 text-[#9a4523]"
                        aria-label={`Calificación promedio ${GOOGLE_REVIEWS_SUMMARY.averageRating} de 5 estrellas`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-[#9a4523] text-[#9a4523]"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-[#4f4440] tabular-nums">
                        {GOOGLE_REVIEWS_SUMMARY.totalReviews} opiniones · consultado el{' '}
                        {GOOGLE_REVIEWS_SUMMARY.lastUpdated}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-4">
                <span className="text-xs font-medium text-[#4f4440]">
                  Reseñas recientes de Google Maps
                </span>
              </div>

              {/* Lista de reseñas separadas por líneas finas */}
              <div className="divide-y divide-[#d3c3bd]/50">
                {GOOGLE_REVIEWS_SUMMARY.reviews.map((review) => (
                  <article key={review.id} className="py-4 first:pt-2 last:pb-2">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div>
                        <h3 className="text-sm font-semibold text-[#210f07]">
                          {review.author}
                        </h3>
                        <p className="text-xs text-[#4f4440] flex items-center gap-1.5">
                          <span>{review.context}</span>
                          <span aria-hidden="true">·</span>
                          <span>{review.relativeDate}</span>
                        </p>
                      </div>
                      <div
                        className="flex items-center gap-0.5 shrink-0"
                        aria-label={`${review.rating} de 5 estrellas`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? 'fill-[#9a4523] text-[#9a4523]'
                                : 'text-[#d3c3bd]'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#4f4440] leading-relaxed">
                      “{review.comment}”
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#d3c3bd]/60 flex items-center justify-between gap-4">
              <span className="text-xs text-[#4f4440]">
                Villa Constitución, Santa Fe
              </span>
              <a
                href={BAKERY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-[#210f07] border border-[#210f07]/30 hover:bg-[#f6f3ed] rounded-lg transition-colors whitespace-nowrap"
              >
                <span>Ver reseñas en Maps</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
