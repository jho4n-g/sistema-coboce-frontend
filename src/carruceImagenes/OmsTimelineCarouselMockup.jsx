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
