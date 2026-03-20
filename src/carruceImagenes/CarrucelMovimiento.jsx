import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { FechasOmsServices as services } from '../service/OficinaMedica/FechasOms.services';

function getNextIndex(currentIndex, total) {
  if (total <= 0) return 0;
  return (currentIndex + 1) % total;
}

function getPrevIndex(currentIndex, total) {
  if (total <= 0) return 0;
  return (currentIndex - 1 + total) % total;
}

function runCarouselSanityChecks() {
  console.assert(
    getNextIndex(0, 4) === 1,
    'getNextIndex should advance to the next slide',
  );
  console.assert(
    getNextIndex(3, 4) === 0,
    'getNextIndex should wrap to the first slide',
  );
  console.assert(
    getPrevIndex(0, 4) === 3,
    'getPrevIndex should wrap to the last slide',
  );
  console.assert(
    getPrevIndex(2, 4) === 1,
    'getPrevIndex should move back one slide',
  );
  console.assert(
    getNextIndex(0, 0) === 0,
    'getNextIndex should handle empty lists safely',
  );
  console.assert(
    getPrevIndex(0, 0) === 0,
    'getPrevIndex should handle empty lists safely',
  );
}

if (typeof window !== 'undefined') {
  runCarouselSanityChecks();
}

export default function OmsTimelineCarouselMockup() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [datoOms, setDatoOms] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await services.getFechasCercanas();

        if (data?.ok) {
          setDatoOms(data.data ?? []);
        } else {
          toast.error(data?.message || 'No se pudo cargar el registro');
        }
      } catch (e) {
        toast.error(e?.message || 'Error del servidor');
      }
    })();
  }, []);
  useEffect(() => {
    if (!isPlaying || datoOms?.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => getNextIndex(prev, datoOms?.length));
    }, 3500);

    return () => window.clearInterval(interval);
  }, [isPlaying, datoOms?.length]);

  const irAnterior = () => {
    setActiveIndex((prev) => getPrevIndex(prev, datoOms?.length));
  };

  const irSiguiente = () => {
    setActiveIndex((prev) => getNextIndex(prev, datoOms?.length));
  };

  return (
    <>
      <style>{`
        @keyframes indicatorBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      <div className="bg-linear-to-br from-sky-50 via-white to-cyan-50 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-end">
            <div className="flex items-center gap-3">
              <button
                onClick={irAnterior}
                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:bg-slate-300"
                type="button"
                aria-label="Anterior"
              >
                <ChevronLeftIcon className="h-5 w-5 text-slate-700" />
              </button>

              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-2xl bg-green-800 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-900"
                type="button"
                aria-label={
                  isPlaying ? 'Pausar carrusel' : 'Reproducir carrusel'
                }
              >
                {isPlaying ? (
                  <PauseIcon className="h-4 w-4" />
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
                {isPlaying ? 'Pausar' : 'Reproducir'}
              </button>

              <button
                onClick={irSiguiente}
                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:bg-slate-300"
                type="button"
                aria-label="Siguiente"
              >
                <ChevronRightIcon className="h-5 w-5 text-slate-700" />
              </button>
            </div>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="relative overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-slate-200">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {datoOms?.map((evento) => (
                  <div key={evento.id} className="min-w-full">
                    <div className="relative h-105 sm:h-115 lg:h-130 overflow-hidden">
                      <img
                        src={services.getImageUrl(evento.id)}
                        alt={evento.titulo}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-linear-to-r from-slate-950/85 via-slate-900/40 to-transparent" />

                      <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-sky-700 shadow-lg">
                        {evento.fecha}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                        <div className="max-w-2xl rounded-4xl bg-white/10 p-6 backdrop-blur-md">
                          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
                            Organización Mundial de la Salud
                          </p>
                          <h2 className="text-3xl font-bold text-white md:text-5xl">
                            {evento.titulo}
                          </h2>
                          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-100 md:text-base">
                            {evento.descripcion}
                          </p>
                          <button
                            className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            type="button"
                          >
                            Ver campaña
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-4xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Fechas destacadas
                </h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {activeIndex + 1}/{datoOms?.length}
                </span>
              </div>

              <div className="space-y-4">
                {datoOms?.map((evento, index) => {
                  const activo = index === activeIndex;

                  return (
                    <button
                      key={`${evento.id}-${index}`}
                      onClick={() => setActiveIndex(index)}
                      className={`w-full rounded-3xl border p-4 text-left transition ${
                        activo
                          ? 'border-sky-200 bg-sky-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                      type="button"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={services.getImageUrl(evento.id)}
                          alt={evento.titulo}
                          className="h-20 w-20 rounded-2xl object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                            {evento.fecha}
                          </p>
                          <h4 className="mt-1 text-base font-bold text-slate-900">
                            {evento.titulo}
                          </h4>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                            {evento.descripcion}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                {datoOms?.map((evento, index) => (
                  <button
                    key={`${evento.id}-${evento.titulo}-${index}`}
                    onClick={() => setActiveIndex(index)}
                    className={`rounded-full transition-all duration-500 ${
                      index === activeIndex
                        ? 'h-3 w-8 animate-pulse bg-sky-600 shadow-md shadow-sky-300'
                        : 'h-2.5 w-2.5 bg-slate-300 hover:scale-110'
                    }`}
                    aria-label={`Ir al slide ${index + 1}`}
                    style={{
                      animation:
                        index === activeIndex
                          ? 'indicatorBounce 1.2s infinite'
                          : 'none',
                    }}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
