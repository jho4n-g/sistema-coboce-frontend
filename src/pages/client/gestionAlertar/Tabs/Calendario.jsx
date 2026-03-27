import { useMemo, useState } from 'react';
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
} from '@heroicons/react/24/outline';

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

function obtenerClaseEvento(tipo) {
  switch (tipo) {
    case 'informe':
      return 'bg-red-100 text-red-700 border border-red-200';
    case 'capacitacion':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'reunion':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'recordatorio':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
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
    id: 1,
    fecha: '2026-03-03',
    titulo: 'Enviar informe semanal',
    tipo: 'informe',
  },
  {
    id: 2,
    fecha: '2026-03-08',
    titulo: 'Capacitación de seguridad',
    tipo: 'capacitacion',
  },
  {
    id: 3,
    fecha: '2026-03-18',
    titulo: 'Reunión con jefaturas',
    tipo: 'reunion',
  },
  {
    id: 4,
    fecha: '2026-03-19',
    titulo: 'Entregar reporte mensual',
    tipo: 'informe',
  },
  {
    id: 5,
    fecha: '2026-03-24',
    titulo: 'Recordar cierre de mes',
    tipo: 'recordatorio',
  },
  {
    id: 6,
    fecha: '2026-02-24',
    titulo: 'Recordar cierre de mes 12',
    tipo: 'recordatorio',
  },
  {
    id: 7,
    fecha: '2026-03-19',
    titulo: 'Entregar reporte mensual',
    tipo: 'informe',
  },
];

const formularioVacio = {
  id: null,
  fecha: '',
  titulo: '',
  tipo: 'recordatorio',
};

export default function Alertas() {
  const fechaActual = new Date();

  const [fechaVista, setFechaVista] = useState({
    year: 2026,
    month: 2,
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

  const margenDias = 7;

  const resumenNotificaciones = useMemo(() => {
    const hoy = new Date();

    const atrasadas = [];
    const paraHoy = [];
    const proximas = [];

    eventos.forEach((evento) => {
      const diff = diferenciaEnDias(evento.fecha, hoy);

      if (diff < 0) {
        atrasadas.push(evento);
      } else if (diff === 0) {
        paraHoy.push(evento);
      } else if (diff <= margenDias) {
        proximas.push({ ...evento, diasRestantes: diff });
      }
    });

    proximas.sort((a, b) => a.diasRestantes - b.diasRestantes);

    return {
      atrasadas,
      paraHoy,
      proximas,
    };
  }, [eventos]);

  const abrirCrearEvento = (fecha = '') => {
    setModoFormulario('crear');
    setFormulario({
      id: null,
      fecha,
      titulo: '',
      tipo: 'recordatorio',
    });
    setModalFormulario(true);
  };

  const abrirEditarEvento = (evento) => {
    setModoFormulario('editar');
    setFormulario({
      id: evento.id,
      fecha: evento.fecha,
      titulo: evento.titulo,
      tipo: evento.tipo,
    });
    setModalFormulario(true);
  };

  const cerrarFormulario = () => {
    setModalFormulario(false);
    setFormulario(formularioVacio);
  };

  const handleChangeFormulario = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarEvento = (e) => {
    e.preventDefault();

    if (!formulario.titulo.trim() || !formulario.fecha || !formulario.tipo) {
      return;
    }

    if (modoFormulario === 'crear') {
      const nuevoEvento = {
        id: Date.now(),
        fecha: formulario.fecha,
        titulo: formulario.titulo.trim(),
        tipo: formulario.tipo,
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
                tipo: formulario.tipo,
              }
            : evento,
        ),
      );

      if (detalleDia) {
        const nuevaFecha = formulario.fecha;
        const fechaAnterior = detalleDia.fecha;

        if (nuevaFecha !== fechaAnterior) {
          const eventosActualizados = eventos.filter(
            (evento) =>
              !(evento.id === formulario.id) && evento.fecha === fechaAnterior,
          );

          setDetalleDia((prev) => ({
            ...prev,
            eventos: eventosActualizados,
          }));
        }
      }
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

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-stretch md:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-rose-600" />
              <p className="text-sm font-semibold text-rose-700">Atrasadas</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-rose-800">
              {resumenNotificaciones.atrasadas.length}
            </p>
            <p className="mt-1 text-xs text-rose-600">
              Tareas vencidas antes de hoy
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2">
              <BellIcon className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-semibold text-amber-700">Para hoy</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-800">
              {resumenNotificaciones.paraHoy.length}
            </p>
            <p className="mt-1 text-xs text-amber-600">
              Tareas programadas para hoy
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-semibold text-blue-700">
                Próximas {margenDias} días
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold text-blue-800">
              {resumenNotificaciones.proximas.length}
            </p>
            <p className="mt-1 text-xs text-blue-600">
              Tareas cercanas al vencimiento
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

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {nombresMeses[month]} {year}
            </h2>
            <p className="text-sm text-slate-500">
              Calendario de alertas y tareas
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
                className={`relative h-28 border-b border-r border-slate-200 p-2 text-left transition ${
                  tieneEventos
                    ? 'cursor-pointer bg-white hover:bg-slate-50'
                    : 'bg-white hover:bg-slate-50'
                }`}
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
                      {eventosDelDia.length > 1 ? 'Tareas' : 'Tarea'}
                    </span>
                  )}
                </div>

                <div className="mt-2 max-h-17.5 space-y-1 overflow-y-auto pr-1">
                  {eventosDelDia.slice(0, 2).map((evento) => (
                    <div
                      key={evento.id}
                      className={`truncate rounded-lg px-2 py-1 text-[10px] font-medium ${obtenerClaseEvento(
                        evento.tipo,
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
                  {detalleDia.eventos.length} tarea(s) programada(s)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => abrirCrearEvento(detalleDia.fecha)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 transition"
                >
                  <PlusIcon className="h-4 w-4" />
                  Agregar
                </button>

                <button
                  type="button"
                  onClick={() => setDetalleDia(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="space-y-4">
                {detalleDia.eventos.map((evento) => (
                  <div
                    key={evento.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">
                          {evento.titulo}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          Fecha: {evento.fecha}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${obtenerClaseEvento(
                          evento.tipo,
                        )}`}
                      >
                        {evento.tipo}
                      </span>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => abrirEditarEvento(evento)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarEvento(evento.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}

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
                className="rounded-xl bg-emrald-900 px-4 py-2 text-sm font-medium text-white hover:bg-emrald-800 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalFormulario && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 p-4"
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
                  Completa los datos del evento
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarFormulario}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition"
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
                    Tipo
                  </label>
                  <select
                    name="tipo"
                    value={formulario.tipo}
                    onChange={handleChangeFormulario}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                  >
                    <option value="recordatorio">Recordatorio</option>
                    <option value="informe">Informe</option>
                    <option value="capacitacion">Capacitación</option>
                    <option value="reunion">Reunión</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 transition"
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
