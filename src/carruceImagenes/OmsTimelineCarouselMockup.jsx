// import { useEffect, useMemo, useState } from 'react';
// import {
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   PauseIcon,
//   PlayIcon,
// } from '@heroicons/react/24/outline';

// export default function OmsTimelineCarouselMockup() {
//   const eventos = useMemo(
//     () => [
//       {
//         fecha: '7 de abril',
//         titulo: 'Día Mundial de la Salud',
//         descripcion:
//           'Campaña global con enfoque en prevención, acceso a salud y bienestar para todas las personas.',
//         imagen:
//           'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80',
//       },
//       {
//         fecha: '31 de mayo',
//         titulo: 'Día Mundial Sin Tabaco',
//         descripcion:
//           'Concienciación sobre los riesgos del consumo de tabaco y la importancia de políticas públicas de salud.',
//         imagen:
//           'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
//       },
//       {
//         fecha: '14 de junio',
//         titulo: 'Día Mundial del Donante de Sangre',
//         descripcion:
//           'Reconocimiento a donantes voluntarios y promoción de donaciones seguras y regulares.',
//         imagen:
//           'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
//       },
//       {
//         fecha: '10 de octubre',
//         titulo: 'Salud Mental',
//         descripcion:
//           'Visibilización del bienestar emocional, la prevención y el acompañamiento integral de la salud mental.',
//         imagen:
//           'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80',
//       },
//     ],
//     [],
//   );

//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);

//   useEffect(() => {
//     if (!isPlaying) return;

//     const interval = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % eventos.length);
//     }, 3500);

//     return () => clearInterval(interval);
//   }, [isPlaying, eventos.length]);

//   const irAnterior = () => {
//     setActiveIndex((prev) => (prev - 1 + eventos.length) % eventos.length);
//   };

//   const irSiguiente = () => {
//     setActiveIndex((prev) => (prev + 1) % eventos.length);
//   };

//   return (
//     <div className="min-h-screen bg-lnear-to-br from-sky-50 via-white to-cyan-50 p-6 md:p-10">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//           <div>
//             <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-medium text-sky-700">
//               Mockup UI · React + Tailwind
//             </span>
//             <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
//               Carrusel en movimiento de fechas OMS
//             </h1>
//             <p className="mt-3 max-w-3xl text-base text-slate-600 md:text-lg">
//               Propuesta visual con autoplay, transición suave, tarjetas
//               destacadas e indicadores para fechas importantes de salud.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={irAnterior}
//               className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
//             >
//               <ChevronLeftIcon className="h-5 w-5 text-slate-700" />
//             </button>

//             <button
//               onClick={() => setIsPlaying((prev) => !prev)}
//               className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
//             >
//               {isPlaying ? (
//                 <PauseIcon className="h-4 w-4" />
//               ) : (
//                 <PlayIcon className="h-4 w-4" />
//               )}
//               {isPlaying ? 'Pausar' : 'Reproducir'}
//             </button>

//             <button
//               onClick={irSiguiente}
//               className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
//             >
//               <ChevronRightIcon className="h-5 w-5 text-slate-700" />
//             </button>
//           </div>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
//           <div className="relative overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-slate-200">
//             <div
//               className="flex transition-transform duration-700 ease-in-out"
//               style={{ transform: `translateX(-${activeIndex * 100}%)` }}
//             >
//               {eventos.map((evento, index) => (
//                 <div key={index} className="min-w-full">
//                   <div className="relative h-130 overflow-hidden">
//                     <img
//                       src={evento.imagen}
//                       alt={evento.titulo}
//                       className="h-full w-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-lnear-to-r from-slate-950/85 via-slate-900/40 to-transparent" />

//                     <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-sky-700 shadow-lg">
//                       {evento.fecha}
//                     </div>

//                     <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
//                       <div className="max-w-2xl rounded-4xl bg-white/10 p-6 backdrop-blur-md">
//                         <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
//                           Organización Mundial de la Salud
//                         </p>
//                         <h2 className="text-3xl font-bold text-white md:text-5xl">
//                           {evento.titulo}
//                         </h2>
//                         <p className="mt-4 max-w-xl text-sm leading-7 text-slate-100 md:text-base">
//                           {evento.descripcion}
//                         </p>
//                         <button className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
//                           Ver campaña
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="rounded-4xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
//             <div className="mb-4 flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-slate-900">
//                 Fechas destacadas
//               </h3>
//               <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
//                 {activeIndex + 1}/{eventos.length}
//               </span>
//             </div>

//             <div className="space-y-4">
//               {eventos.map((evento, index) => {
//                 const activo = index === activeIndex;

//                 return (
//                   <button
//                     key={index}
//                     onClick={() => setActiveIndex(index)}
//                     className={`w-full rounded-3xl border p-4 text-left transition ${
//                       activo
//                         ? 'border-sky-200 bg-sky-50 shadow-md'
//                         : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
//                     }`}
//                   >
//                     <div className="flex items-start gap-4">
//                       <img
//                         src={evento.imagen}
//                         alt={evento.titulo}
//                         className="h-20 w-20 rounded-2xl object-cover"
//                       />

//                       <div className="min-w-0 flex-1">
//                         <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
//                           {evento.fecha}
//                         </p>
//                         <h4 className="mt-1 text-base font-bold text-slate-900">
//                           {evento.titulo}
//                         </h4>
//                         <p className="mt-1 line-clamp-2 text-sm text-slate-600">
//                           {evento.descripcion}
//                         </p>
//                       </div>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>

//             <div className="mt-6 flex items-center justify-center gap-2">
//               {eventos.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setActiveIndex(index)}
//                   className={`h-2.5 rounded-full transition-all ${
//                     index === activeIndex
//                       ? 'w-8 bg-sky-600'
//                       : 'w-2.5 bg-slate-300'
//                   }`}
//                   aria-label={`Ir al slide ${index + 1}`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useMemo, useState } from 'react';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
// import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';

// export function getNextIndex(currentIndex, total) {
//   if (total <= 0) return 0;
//   return (currentIndex + 1) % total;
// }

// export function getPrevIndex(currentIndex, total) {
//   if (total <= 0) return 0;
//   return (currentIndex - 1 + total) % total;
// }

// function runCarouselSanityChecks() {
//   console.assert(
//     getNextIndex(0, 4) === 1,
//     'getNextIndex should advance to the next slide',
//   );
//   console.assert(
//     getNextIndex(3, 4) === 0,
//     'getNextIndex should wrap to the first slide',
//   );
//   console.assert(
//     getPrevIndex(0, 4) === 3,
//     'getPrevIndex should wrap to the last slide',
//   );
//   console.assert(
//     getPrevIndex(2, 4) === 1,
//     'getPrevIndex should move back one slide',
//   );
//   console.assert(
//     getNextIndex(0, 0) === 0,
//     'getNextIndex should handle empty lists safely',
//   );
//   console.assert(
//     getPrevIndex(0, 0) === 0,
//     'getPrevIndex should handle empty lists safely',
//   );
// }

// if (typeof window !== 'undefined') {
//   runCarouselSanityChecks();
// }

// export default function OmsTimelineCarouselMockup() {
//   const eventos = useMemo(
//     () => [
//       {
//         fecha: '7 de abril',
//         titulo: 'Día Mundial de la Salud',
//         descripcion:
//           'Campaña global con enfoque en prevención, acceso a salud y bienestar para todas las personas.',
//         imagen:
//           'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80',
//       },
//       {
//         fecha: '31 de mayo',
//         titulo: 'Día Mundial Sin Tabaco',
//         descripcion:
//           'Concienciación sobre los riesgos del consumo de tabaco y la importancia de políticas públicas de salud.',
//         imagen:
//           'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
//       },
//       {
//         fecha: '14 de junio',
//         titulo: 'Día Mundial del Donante de Sangre',
//         descripcion:
//           'Reconocimiento a donantes voluntarios y promoción de donaciones seguras y regulares.',
//         imagen:
//           'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
//       },
//       {
//         fecha: '10 de octubre',
//         titulo: 'Salud Mental',
//         descripcion:
//           'Visibilización del bienestar emocional, la prevención y el acompañamiento integral de la salud mental.',
//         imagen:
//           'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80',
//       },
//     ],
//     [],
//   );

//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);

//   useEffect(() => {
//     if (!isPlaying || eventos.length <= 1) return;

//     const interval = window.setInterval(() => {
//       setActiveIndex((prev) => getNextIndex(prev, eventos.length));
//     }, 3500);

//     return () => window.clearInterval(interval);
//   }, [isPlaying, eventos.length]);

//   const irAnterior = () => {
//     setActiveIndex((prev) => getPrevIndex(prev, eventos.length));
//   };

//   const irSiguiente = () => {
//     setActiveIndex((prev) => getNextIndex(prev, eventos.length));
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes indicatorBounce {
//           0%, 100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-4px);
//           }
//         }
//       `}</style>

//       <div className="bg-linear-to-br from-sky-50 via-white to-cyan-50 p-4 md:p-8">
//         <div className="mx-auto max-w-7xl">
//           <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//             <div>
//               <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-medium text-sky-700">
//                 Mockup UI · React + Tailwind
//               </span>
//               <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
//                 Carrusel en movimiento de fechas OMS
//               </h1>
//               <p className="mt-3 max-w-3xl text-base text-slate-600 md:text-lg">
//                 Propuesta visual con autoplay, transición suave, tarjetas
//                 destacadas e indicadores para fechas importantes de salud.
//               </p>
//             </div>

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={irAnterior}
//                 className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
//                 aria-label="Slide anterior"
//                 type="button"
//               >
//                 <ChevronLeftIcon className="h-5 w-5 text-slate-700" />
//               </button>

//               <button
//                 onClick={() => setIsPlaying((prev) => !prev)}
//                 className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-xl"
//                 aria-label={
//                   isPlaying ? 'Pausar carrusel' : 'Reproducir carrusel'
//                 }
//                 type="button"
//               >
//                 {isPlaying ? (
//                   <PauseIcon className="h-4 w-4" />
//                 ) : (
//                   <PlayIcon className="h-4 w-4" />
//                 )}
//                 {isPlaying ? 'Pausar' : 'Reproducir'}
//               </button>

//               <button
//                 onClick={irSiguiente}
//                 className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
//                 aria-label="Slide siguiente"
//                 type="button"
//               >
//                 <ChevronRightIcon className="h-5 w-5 text-slate-700" />
//               </button>
//             </div>
//           </div>

//           <div className="grid items-start gap-6 xl:grid-cols-[1.2fr_0.8fr]">
//             <div className="relative overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-slate-200">
//               <div
//                 className="flex transition-transform duration-700 ease-in-out"
//                 style={{ transform: `translateX(-${activeIndex * 100}%)` }}
//               >
//                 {eventos.map((evento) => (
//                   <div key={evento.titulo} className="min-w-full">
//                     <div className="relative h-105 sm:h-115 lg:h-130 overflow-hidden">
//                       <img
//                         src={evento.imagen}
//                         alt={evento.titulo}
//                         className="h-full w-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-linear-to-r from-slate-950/85 via-slate-900/40 to-transparent" />

//                       <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-sky-700 shadow-lg">
//                         {evento.fecha}
//                       </div>

//                       <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
//                         <div className="max-w-2xl rounded-4xl bg-white/10 p-5 backdrop-blur-md md:p-6">
//                           <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
//                             Organización Mundial de la Salud
//                           </p>
//                           <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
//                             {evento.titulo}
//                           </h2>
//                           <p className="mt-4 max-w-xl text-sm leading-7 text-slate-100 md:text-base">
//                             {evento.descripcion}
//                           </p>
//                           <button
//                             className="mt-6 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/20 transition hover:-translate-y-0.5 hover:bg-sky-500 hover:shadow-xl"
//                             type="button"
//                           >
//                             Ver campaña
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="rounded-4xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
//               <div className="mb-4 flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-slate-900">
//                   Fechas destacadas
//                 </h3>
//                 <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
//                   {eventos.length > 0
//                     ? `${activeIndex + 1}/${eventos.length}`
//                     : '0/0'}
//                 </span>
//               </div>

//               <div className="space-y-4">
//                 {eventos.map((evento, index) => {
//                   const activo = index === activeIndex;

//                   return (
//                     <button
//                       key={evento.titulo}
//                       onClick={() => setActiveIndex(index)}
//                       className={`w-full rounded-3xl border p-4 text-left transition ${
//                         activo
//                           ? 'border-sky-200 bg-sky-50 shadow-md'
//                           : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
//                       }`}
//                       type="button"
//                     >
//                       <div className="flex items-start gap-4">
//                         <img
//                           src={evento.imagen}
//                           alt={evento.titulo}
//                           className="h-20 w-20 rounded-2xl object-cover"
//                         />

//                         <div className="min-w-0 flex-1">
//                           <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
//                             {evento.fecha}
//                           </p>
//                           <h4 className="mt-1 text-base font-bold text-slate-900">
//                             {evento.titulo}
//                           </h4>
//                           <p className="mt-1 line-clamp-2 text-sm text-slate-600">
//                             {evento.descripcion}
//                           </p>
//                         </div>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>

//               <div className="mt-6 flex items-center justify-center gap-2">
//                 {eventos.map((evento, index) => (
//                   <button
//                     key={evento.titulo}
//                     onClick={() => setActiveIndex(index)}
//                     className={`rounded-full transition-all duration-500 ${
//                       index === activeIndex
//                         ? 'h-3 w-8 animate-pulse bg-sky-600 shadow-md shadow-sky-300'
//                         : 'h-2.5 w-2.5 bg-slate-300 hover:scale-110'
//                     }`}
//                     aria-label={`Ir al slide ${index + 1}`}
//                     style={{
//                       animation:
//                         index === activeIndex
//                           ? 'indicatorBounce 1.2s infinite'
//                           : 'none',
//                     }}
//                     type="button"
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

export default function OmsTimelineCarouselMockup() {
  const eventos = [
    {
      fecha: '7 de abril',
      titulo: 'Día Mundial de la Salud',
      descripcion:
        'Campaña global con enfoque en prevención, acceso a salud y bienestar para todas las personas.',
      imagen:
        'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80',
    },
    {
      fecha: '31 de mayo',
      titulo: 'Día Mundial Sin Tabaco',
      descripcion:
        'Concienciación sobre los riesgos del consumo de tabaco y la importancia de políticas públicas de salud.',
      imagen:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    },
    {
      fecha: '14 de junio',
      titulo: 'Día Mundial del Donante de Sangre',
      descripcion:
        'Reconocimiento a donantes voluntarios y promoción de donaciones seguras y regulares.',
      imagen:
        'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
    },
    {
      fecha: '10 de octubre',
      titulo: 'Salud Mental',
      descripcion:
        'Visibilización del bienestar emocional, la prevención y el acompañamiento integral de la salud mental.',
      imagen:
        'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-medium text-sky-700">
            Mockup UI · React + Tailwind
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Carrusel de fechas relacionadas con la OMS
          </h1>
          <p className="mt-3 max-w-3xl text-base text-slate-600 md:text-lg">
            Propuesta visual para mostrar fechas destacadas de salud con
            imágenes, descripción breve y navegación horizontal.
          </p>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-max gap-6">
            {eventos.map((evento, index) => (
              <article
                key={index}
                className="group relative w-[320px] flex-shrink-0 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-2xl md:w-[380px]"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={evento.imagen}
                    alt={evento.titulo}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-sky-700 shadow">
                    {evento.fecha}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl font-bold text-white md:text-2xl">
                      {evento.titulo}
                    </h2>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm leading-6 text-slate-600 md:text-base">
                    {evento.descripcion}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <button className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700">
                      Ver detalle
                    </button>
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                      OMS
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white/70 p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Ideas para la versión final
          </h3>
          <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              Agregar autoplay con botones anterior/siguiente.
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              Usar datos dinámicos desde una API o arreglo de fechas sanitarias.
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              Mostrar indicador activo y modal con información ampliada.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
