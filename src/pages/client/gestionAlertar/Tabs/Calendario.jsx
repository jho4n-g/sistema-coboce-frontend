import { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  BellIcon,
  ClockIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

function EChartBox({ option, height = 320 }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    instanceRef.current = echarts.init(chartRef.current);

    const handleResize = () => {
      instanceRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      instanceRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!instanceRef.current) return;
    instanceRef.current.setOption(option, true);
    instanceRef.current.resize();
  }, [option]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
}

function generarCalendario(year, month) {
  const primerDia = new Date(year, month, 1);
  const ultimoDia = new Date(year, month + 1, 0);
  const diasMes = ultimoDia.getDate();

  let inicioSemana = primerDia.getDay();
  inicioSemana = inicioSemana === 0 ? 6 : inicioSemana - 1;

  const calendario = [];
  let semana = [];

  for (let i = 0; i < inicioSemana; i++) {
    semana.push(null);
  }

  for (let dia = 1; dia <= diasMes; dia++) {
    semana.push(dia);

    if (semana.length === 7) {
      calendario.push(semana);
      semana = [];
    }
  }

  if (semana.length > 0) {
    while (semana.length < 7) {
      semana.push(null);
    }
    calendario.push(semana);
  }

  while (calendario.length < 6) {
    calendario.push([null, null, null, null, null, null, null]);
  }

  return calendario;
}

function normalizarFecha(fecha) {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diferenciaEnDias(fecha1, fecha2) {
  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.floor(
    (normalizarFecha(fecha1) - normalizarFecha(fecha2)) / msPorDia,
  );
}

function formatearFecha(year, month, day) {
  const mes = String(month + 1).padStart(2, '0');
  const dia = String(day).padStart(2, '0');
  return `${year}-${mes}-${dia}`;
}

function obtenerEstadoVisualEvento(evento, hoy = new Date()) {
  if (evento.completado) return 'completado';

  const diff = diferenciaEnDias(evento.fecha, hoy);

  if (diff < 0) return 'vencida';
  if (diff <= 5) return 'cercana';
  return 'futura';
}

function obtenerClaseEvento(evento) {
  const estado = obtenerEstadoVisualEvento(evento);

  switch (estado) {
    case 'completado':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200 line-through';
    case 'vencida':
      return 'bg-red-100 text-red-700 border border-red-200';
    case 'cercana':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'futura':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}

function obtenerEtiquetaTipo(tipoEvento) {
  switch (tipoEvento) {
    case 'tarea':
      return 'Tarea';
    case 'estatica':
      return 'Fecha estática';
    default:
      return 'Evento';
  }
}

function obtenerEtiquetaEstado(estado) {
  switch (estado) {
    case 'completado':
      return 'Completado';
    case 'vencida':
      return 'Vencida';
    case 'cercana':
      return 'Próxima';
    case 'futura':
      return 'Futura';
    default:
      return 'Pendiente';
  }
}

function obtenerClaseBadgeEstado(estado) {
  switch (estado) {
    case 'completado':
      return 'bg-emerald-100 text-emerald-700';
    case 'vencida':
      return 'bg-red-100 text-red-700';
    case 'cercana':
      return 'bg-amber-100 text-amber-700';
    case 'futura':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

const nombresMeses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const eventosIniciales = [
  {
    id: 'tarea-1',
    original_id: 1,
    titulo: 'Enviar informe semanal',
    descripcion: 'Preparar el informe y enviarlo antes del cierre',
    fecha: '2026-04-03',
    tipo_evento: 'tarea',
    completado: false,
  },
  {
    id: 'tarea-2',
    original_id: 2,
    titulo: 'Capacitación de seguridad',
    descripcion: 'Capacitación obligatoria del personal',
    fecha: '2026-04-08',
    tipo_evento: 'tarea',
    completado: false,
  },
  {
    id: 'estatica-1',
    original_id: 3,
    titulo: 'Renovación anual de licencia',
    descripcion: 'Se repite cada año',
    fecha: '2026-04-15',
    tipo_evento: 'estatica',
    completado: true,
  },
  {
    id: 'tarea-3',
    original_id: 4,
    titulo: 'Reunión con jefaturas',
    descripcion: 'Revisión de pendientes de área',
    fecha: '2026-04-18',
    tipo_evento: 'tarea',
    completado: false,
  },
  {
    id: 'tarea-4',
    original_id: 5,
    titulo: 'Entregar reporte mensual',
    descripcion: 'Entrega del reporte consolidado',
    fecha: '2026-04-19',
    tipo_evento: 'tarea',
    completado: false,
  },
  {
    id: 'estatica-2',
    original_id: 6,
    titulo: 'Cierre anual administrativo',
    descripcion: 'Fecha fija recurrente',
    fecha: '2026-04-24',
    tipo_evento: 'estatica',
    completado: false,
  },
  {
    id: 'tarea-5',
    original_id: 7,
    titulo: 'Inventario general',
    descripcion: 'Verificar diferencias y ajustar',
    fecha: '2026-04-28',
    tipo_evento: 'tarea',
    completado: false,
  },
];

const formularioVacio = {
  id: null,
  original_id: null,
  fecha: '',
  titulo: '',
  descripcion: '',
  tipo_evento: 'tarea',
  completado: false,
};

export default function Alertas() {
  const fechaActual = new Date();

  const [fechaVista, setFechaVista] = useState({
    year: fechaActual.getFullYear(),
    month: fechaActual.getMonth(),
  });

  const [eventos, setEventos] = useState(eventosIniciales);
  const [detalleDia, setDetalleDia] = useState(null);
  const [modalFormulario, setModalFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState('crear');
  const [formulario, setFormulario] = useState(formularioVacio);

  const { year, month } = fechaVista;

  const calendario = useMemo(
    () => generarCalendario(year, month),
    [year, month],
  );

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const eventosDelMes = useMemo(() => {
    const prefijoMes = `${year}-${String(month + 1).padStart(2, '0')}-`;
    return eventos.filter((evento) => evento.fecha.startsWith(prefijoMes));
  }, [eventos, year, month]);

  const resumenNotificaciones = useMemo(() => {
    const hoy = new Date();

    const atrasadas = [];
    const paraHoy = [];
    const proximas = [];
    const completadas = [];
    const futuras = [];

    eventosDelMes.forEach((evento) => {
      if (evento.completado) {
        completadas.push(evento);
        return;
      }

      const diff = diferenciaEnDias(evento.fecha, hoy);

      if (diff < 0) {
        atrasadas.push(evento);
      } else if (diff === 0) {
        paraHoy.push(evento);
        proximas.push({ ...evento, diasRestantes: diff });
      } else if (diff <= 5) {
        proximas.push({ ...evento, diasRestantes: diff });
      } else {
        futuras.push(evento);
      }
    });

    proximas.sort((a, b) => a.diasRestantes - b.diasRestantes);

    return {
      atrasadas,
      paraHoy,
      proximas,
      completadas,
      futuras,
    };
  }, [eventosDelMes]);

  const porcentajeCumplimiento = useMemo(() => {
    if (eventosDelMes.length === 0) return 0;
    return Math.round(
      (resumenNotificaciones.completadas.length / eventosDelMes.length) * 100,
    );
  }, [eventosDelMes, resumenNotificaciones.completadas.length]);

  const pieOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 0,
        left: 'center',
      },
      series: [
        {
          name: 'Estado de tareas',
          type: 'pie',
          radius: ['45%', '70%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c}',
          },
          data: [
            {
              value: resumenNotificaciones.completadas.length,
              name: 'Completadas',
              itemStyle: { color: '#10b981' },
            },
            {
              value: resumenNotificaciones.atrasadas.length,
              name: 'Vencidas',
              itemStyle: { color: '#ef4444' },
            },
            {
              value: resumenNotificaciones.proximas.length,
              name: 'Próximas 5 días',
              itemStyle: { color: '#f59e0b' },
            },
            {
              value: resumenNotificaciones.futuras.length,
              name: 'Futuras',
              itemStyle: { color: '#3b82f6' },
            },
          ],
        },
      ],
    };
  }, [resumenNotificaciones]);

  const barOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '8%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['Mes actual'],
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
      },
      series: [
        {
          name: 'Completadas',
          type: 'bar',
          data: [resumenNotificaciones.completadas.length],
          itemStyle: { color: '#10b981' },
          barMaxWidth: 50,
        },
        {
          name: 'Vencidas',
          type: 'bar',
          data: [resumenNotificaciones.atrasadas.length],
          itemStyle: { color: '#ef4444' },
          barMaxWidth: 50,
        },
        {
          name: 'Próximas 5 días',
          type: 'bar',
          data: [resumenNotificaciones.proximas.length],
          itemStyle: { color: '#f59e0b' },
          barMaxWidth: 50,
        },
        {
          name: 'Futuras',
          type: 'bar',
          data: [resumenNotificaciones.futuras.length],
          itemStyle: { color: '#3b82f6' },
          barMaxWidth: 50,
        },
      ],
    };
  }, [resumenNotificaciones]);

  const gaugeOption = useMemo(() => {
    return {
      series: [
        {
          type: 'gauge',
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 100,
          splitNumber: 5,
          progress: {
            show: true,
            width: 16,
            itemStyle: {
              color: '#10b981',
            },
          },
          pointer: {
            show: true,
          },
          axisLine: {
            lineStyle: {
              width: 16,
              color: [[1, '#e5e7eb']],
            },
          },
          axisTick: {
            distance: -20,
            splitNumber: 5,
            lineStyle: {
              width: 1,
              color: '#94a3b8',
            },
          },
          splitLine: {
            distance: -24,
            length: 10,
            lineStyle: {
              width: 2,
              color: '#64748b',
            },
          },
          axisLabel: {
            distance: -2,
            color: '#64748b',
            fontSize: 10,
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}%',
            color: '#0f172a',
            fontSize: 26,
            offsetCenter: [0, '55%'],
          },
          title: {
            offsetCenter: [0, '80%'],
            fontSize: 12,
            color: '#64748b',
          },
          data: [
            {
              value: porcentajeCumplimiento,
              name: 'Cumplimiento',
            },
          ],
        },
      ],
    };
  }, [porcentajeCumplimiento]);

  const irMesAnterior = () => {
    setFechaVista((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const irMesSiguiente = () => {
    setFechaVista((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  const irHoy = () => {
    setFechaVista({
      year: fechaActual.getFullYear(),
      month: fechaActual.getMonth(),
    });
  };

  const esMismoMes =
    fechaActual.getFullYear() === year && fechaActual.getMonth() === month;

  const abrirCrearEvento = (fecha = '') => {
    setModoFormulario('crear');
    setFormulario({
      ...formularioVacio,
      fecha,
    });
    setModalFormulario(true);
  };

  const abrirEditarEvento = (evento) => {
    setModoFormulario('editar');
    setFormulario({
      id: evento.id,
      original_id: evento.original_id,
      fecha: evento.fecha,
      titulo: evento.titulo,
      descripcion: evento.descripcion || '',
      tipo_evento: evento.tipo_evento,
      completado: evento.completado,
    });
    setModalFormulario(true);
  };

  const cerrarFormulario = () => {
    setModalFormulario(false);
    setFormulario(formularioVacio);
  };

  const handleChangeFormulario = (e) => {
    const { name, value, type, checked } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const guardarEvento = (e) => {
    e.preventDefault();

    if (
      !formulario.titulo.trim() ||
      !formulario.fecha ||
      !formulario.tipo_evento
    ) {
      return;
    }

    if (modoFormulario === 'crear') {
      const prefijo =
        formulario.tipo_evento === 'estatica' ? 'estatica' : 'tarea';

      const nuevoEvento = {
        id: `${prefijo}-${Date.now()}`,
        original_id: null,
        fecha: formulario.fecha,
        titulo: formulario.titulo.trim(),
        descripcion: formulario.descripcion.trim(),
        tipo_evento: formulario.tipo_evento,
        completado: formulario.completado,
      };

      setEventos((prev) => [...prev, nuevoEvento]);
    } else {
      setEventos((prev) =>
        prev.map((evento) =>
          evento.id === formulario.id
            ? {
                ...evento,
                fecha: formulario.fecha,
                titulo: formulario.titulo.trim(),
                descripcion: formulario.descripcion.trim(),
                tipo_evento: formulario.tipo_evento,
                completado: formulario.completado,
              }
            : evento,
        ),
      );
    }

    cerrarFormulario();
  };

  const eliminarEvento = (id) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este evento?');
    if (!confirmar) return;

    setEventos((prev) => prev.filter((evento) => evento.id !== id));

    if (detalleDia) {
      const nuevosEventos = detalleDia.eventos.filter(
        (evento) => evento.id !== id,
      );

      if (nuevosEventos.length === 0) {
        setDetalleDia(null);
      } else {
        setDetalleDia((prev) => ({
          ...prev,
          eventos: nuevosEventos,
        }));
      }
    }
  };

  const toggleCompletado = (id) => {
    setEventos((prev) =>
      prev.map((evento) =>
        evento.id === id
          ? { ...evento, completado: !evento.completado }
          : evento,
      ),
    );

    if (detalleDia) {
      setDetalleDia((prev) => ({
        ...prev,
        eventos: prev.eventos.map((evento) =>
          evento.id === id
            ? { ...evento, completado: !evento.completado }
            : evento,
        ),
      }));
    }
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-stretch md:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              <p className="text-sm font-semibold text-red-700">Vencidas</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-red-800">
              {resumenNotificaciones.atrasadas.length}
            </p>
            <p className="mt-1 text-xs text-red-600">No hechas y ya vencidas</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2">
              <BellIcon className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-semibold text-amber-700">
                Próximas 5 días
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-800">
              {resumenNotificaciones.proximas.length}
            </p>
            <p className="mt-1 text-xs text-amber-600">Pendientes cercanas</p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-semibold text-blue-700">Futuras</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-blue-800">
              {resumenNotificaciones.futuras.length}
            </p>
            <p className="mt-1 text-xs text-blue-600">
              Pendientes después de 5 días
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-700">
                Completadas
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-800">
              {resumenNotificaciones.completadas.length}
            </p>
            <p className="mt-1 text-xs text-emerald-600">
              Tareas realizadas en el mes
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => abrirCrearEvento()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-900"
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo evento
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-700">
          Vencida
        </span>
        <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
          Próxima 5 días
        </span>
        <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
          Futura
        </span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
          Completada
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {nombresMeses[month]} {year}
            </h2>
            <p className="text-sm text-slate-500">
              Calendario de tareas y fechas estáticas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={irHoy}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Hoy
            </button>

            <button
              type="button"
              onClick={irMesAnterior}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={irMesSiguiente}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100">
          {diasSemana.map((dia) => (
            <div
              key={dia}
              className="py-3 text-center text-sm font-semibold text-slate-600"
            >
              {dia}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendario.flat().map((dia, i) => {
            if (!dia) {
              return (
                <div
                  key={i}
                  className="h-28 border-b border-r border-slate-200 bg-slate-50"
                />
              );
            }

            const fechaCelda = formatearFecha(year, month, dia);
            const eventosDelDia = eventos.filter(
              (evento) => evento.fecha === fechaCelda,
            );

            const esHoy = esMismoMes && dia === fechaActual.getDate();
            const tieneEventos = eventosDelDia.length > 0;

            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (tieneEventos) {
                    setDetalleDia({
                      fecha: fechaCelda,
                      dia,
                      mes: nombresMeses[month],
                      year,
                      eventos: eventosDelDia,
                    });
                  } else {
                    abrirCrearEvento(fechaCelda);
                  }
                }}
                className="relative h-28 border-b border-r border-slate-200 bg-white p-2 text-left transition hover:bg-slate-50"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      esHoy
                        ? 'bg-green-800 text-white shadow'
                        : 'text-slate-700'
                    }`}
                  >
                    {dia}
                  </span>

                  {tieneEventos && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                      {eventosDelDia.length}{' '}
                      {eventosDelDia.length > 1 ? 'eventos' : 'evento'}
                    </span>
                  )}
                </div>

                <div className="mt-2 max-h-16 space-y-1 overflow-y-auto pr-1">
                  {eventosDelDia.slice(0, 2).map((evento) => (
                    <div
                      key={evento.id}
                      className={`truncate rounded-lg px-2 py-1 text-[10px] font-medium ${obtenerClaseEvento(
                        evento,
                      )}`}
                      title={evento.titulo}
                    >
                      {evento.titulo}
                    </div>
                  ))}

                  {!tieneEventos && (
                    <div className="mt-3 text-[11px] text-slate-400">
                      + Agregar evento
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
          <h3 className="text-lg font-bold text-slate-900">
            Resumen de tareas del mes
          </h3>
          <p className="mb-4 text-sm text-slate-500">Distribución por estado</p>
          <EChartBox option={pieOption} height={320} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
          <h3 className="text-lg font-bold text-slate-900">
            Cantidades del mes
          </h3>
          <p className="mb-4 text-sm text-slate-500">
            Comparación del mes visible
          </p>
          <EChartBox option={barOption} height={320} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
          <h3 className="text-lg font-bold text-slate-900">
            Cumplimiento mensual
          </h3>
          <p className="mb-4 text-sm text-slate-500">
            Porcentaje completado del mes actual
          </p>
          <EChartBox option={gaugeOption} height={320} />
        </div>
      </div>

      {detalleDia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setDetalleDia(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {detalleDia.dia} de {detalleDia.mes} de {detalleDia.year}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {detalleDia.eventos.length} evento(s) programado(s)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => abrirCrearEvento(detalleDia.fecha)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
                >
                  <PlusIcon className="h-4 w-4" />
                  Agregar
                </button>

                <button
                  type="button"
                  onClick={() => setDetalleDia(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="space-y-4">
                {detalleDia.eventos.map((evento) => {
                  const estadoVisual = obtenerEstadoVisualEvento(evento);

                  return (
                    <div
                      key={evento.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4
                            className={`font-semibold ${
                              evento.completado
                                ? 'text-slate-500 line-through'
                                : 'text-slate-900'
                            }`}
                          >
                            {evento.titulo}
                          </h4>

                          {evento.descripcion ? (
                            <p className="mt-1 text-sm text-slate-500">
                              {evento.descripcion}
                            </p>
                          ) : null}

                          <p className="mt-2 text-sm text-slate-500">
                            Fecha: {evento.fecha}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {obtenerEtiquetaTipo(evento.tipo_evento)}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${obtenerClaseBadgeEstado(
                              estadoVisual,
                            )}`}
                          >
                            {obtenerEtiquetaEstado(estadoVisual)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => toggleCompletado(evento.id)}
                          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                            evento.completado
                              ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          {evento.completado
                            ? 'Marcar pendiente'
                            : 'Marcar hecho'}
                        </button>

                        <button
                          type="button"
                          onClick={() => abrirEditarEvento(evento)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarEvento(evento.id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}

                {detalleDia.eventos.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No hay eventos registrados para este día.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setDetalleDia(null)}
                className="rounded-xl bg-emerald-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalFormulario && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4"
          onClick={cerrarFormulario}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {modoFormulario === 'crear'
                    ? 'Nuevo evento'
                    : 'Editar evento'}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Prototipo sin conexión al backend
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarFormulario}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={guardarEvento} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Título
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formulario.titulo}
                    onChange={handleChangeFormulario}
                    placeholder="Ej. Reunión con gerencia"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={handleChangeFormulario}
                    rows={3}
                    placeholder="Detalle del evento"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formulario.fecha}
                    onChange={handleChangeFormulario}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Tipo de evento
                  </label>
                  <select
                    name="tipo_evento"
                    value={formulario.tipo_evento}
                    onChange={handleChangeFormulario}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                  >
                    <option value="tarea">Tarea</option>
                    <option value="estatica">Fecha estática</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <input
                    type="checkbox"
                    name="completado"
                    checked={formulario.completado}
                    onChange={handleChangeFormulario}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Marcar como completado
                  </span>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
                >
                  {modoFormulario === 'crear' ? 'Guardar' : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
