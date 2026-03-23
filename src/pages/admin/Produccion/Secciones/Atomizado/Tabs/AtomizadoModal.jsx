import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

import { DatosAtomizado } from '@schema/Produccion/Seccion/Atomizado.schema';
import { extractArrayFieldErrors } from '@helpers/normalze.helpers';
import InputField from '@components/InputField';
import Select from '@components/Select';
import { getObjs } from '@service/Produccion/Turno.services';

const NuevaFilaTabla = () => ({
  hora: '',
  pba1_bareas: '',
  pa1_bareas: '',
  pba2_bareas: '',
  pa2_bareas: '',
  pba3_bareas: '',
  pa3_bareas: '',
  te_c1: '',
  te_c2: '',
  ts_c: '',
  as: '',
  humedad_uno: '',
  humedad_dos: '',
  humedad_tres: '',
  silo_descarga: '',
  producto: '',
  n_silo_llenos: '',
});

const filasControlGranulomtria = [
  { key: 'hora', label: 'HORA', type: 'time' },
  { key: 'silo_n', label: 'SILO N°', type: 'number' },
  { key: 'humedad', label: '% HUMEDAD', type: 'number' },
  { key: 'malla_35', label: 'MALLA 35', type: 'number' },
  { key: 'malla_40', label: 'MALLA 40', type: 'number' },
  { key: 'malla_50', label: 'MALLA 50', type: 'number' },
  { key: 'malla_70', label: 'MALLA 70', type: 'number' },
  { key: 'malla_100', label: 'MALLA 100', type: 'number' },
  { key: 'malla_120', label: 'MALLA 120', type: 'number' },
  { key: 'fondo', label: 'FONDO' },
];

const createInitialForm = () => ({
  fecha: '',
  turno: '',
  operador: '',
  hora_inicio: '',
  hora_final: '',
  supervisor_turno: '',
  observacionesAtomizadoDatos: [],
  tabla_atomizado: [],
  control_granulometria: [],
  control_fosas: [],
});

const rows = 8;

export default function AtomizadoModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
  mode = 'view', // view | edit
}) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const [form, setForm] = useState(createInitialForm());
  const [error, setError] = useState({});
  const [tablaError, setTablaError] = useState([]);
  const [errorGranulometria, setErrorGranulometria] = useState([]);
  const [errorTablaFosa, setErrorTablaFosa] = useState([]);
  const [loading, setLoading] = useState(false);
  const [obsInput, setObsInput] = useState('');
  const [turnoError, setTurnoError] = useState('');
  const [turnoId, setTurnoId] = useState('');
  const [tab, setTab] = useState('general');

  const title = useMemo(() => {
    if (isView) return 'Detalle de Atomizado';
    return id ? 'Editar registro de Atomizado' : 'Nuevo registro de Atomizado';
  }, [id, isView]);

  useEffect(() => {
    if (!open) return;

    let active = true;
    setLoading(true);
    setError({});
    setTablaError([]);
    setErrorGranulometria([]);
    setErrorTablaFosa([]);
    setTurnoError('');
    setObsInput('');
    setTab('general');

    (async () => {
      try {
        const turnos = await getObjs();
        if (!active) return;

        if (!turnos?.ok) {
          toast.error(turnos?.message || 'No se pudo cargar los turnos');
        }

        if (id && fetchById) {
          const data = await fetchById(id);
          if (!active) return;

          if (data?.ok) {
            const dato = data?.dato ?? {};

            setForm({
              ...createInitialForm(),
              ...dato,
              observacionesAtomizadoDatos:
                dato?.observacionesAtomizadoDatos ?? [],
              tabla_atomizado: dato?.tabla_atomizado ?? [],
              control_granulometria: dato?.control_granulometria ?? [],
              control_fosas: dato?.control_fosas ?? [],
            });

            setTurnoId(dato?.turno_id ?? '');
          } else {
            toast.error(data?.message || 'No se pudo cargar el registro');
          }
        } else {
          setForm({
            ...createInitialForm(),
            tabla_atomizado: [NuevaFilaTabla()],
          });
          setTurnoId('');
        }
      } catch (e) {
        if (active) toast.error(e?.message || 'Error del servidor');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, id, fetchById]);

  if (!open) return null;

  const updateBase = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const addObs = () => {
    if (isView) return;
    const v = obsInput.trim();
    if (!v) return;

    setForm((f) => ({
      ...f,
      observacionesAtomizadoDatos: [
        ...(f.observacionesAtomizadoDatos ?? []),
        { observacion: v },
      ],
    }));
    setObsInput('');
  };

  const removeObs = (index) => {
    if (isView) return;
    setForm((f) => ({
      ...f,
      observacionesAtomizadoDatos: (f.observacionesAtomizadoDatos ?? []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const setCargaTabla = (idx, field, value) => {
    if (isView) return;

    setForm((f) => {
      const rowsData = Array.isArray(f?.tabla_atomizado)
        ? [...f.tabla_atomizado]
        : [];
      if (idx < 0 || idx >= rowsData.length) return f;
      rowsData[idx] = { ...(rowsData[idx] ?? {}), [field]: value };
      return { ...f, tabla_atomizado: rowsData };
    });

    setTablaError((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      const rowErr = { ...(arr[idx] ?? {}) };
      delete rowErr[field];
      arr[idx] = Object.keys(rowErr).length ? rowErr : undefined;
      return arr;
    });
  };

  const setGran = (colIdx, field, value) => {
    if (isView) return;

    setForm((f) => {
      const next = [...(f.control_granulometria ?? [])];
      next[colIdx] = { ...(next[colIdx] ?? {}), [field]: value };
      return { ...f, control_granulometria: next };
    });

    setErrorGranulometria((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      const colErrors = { ...(next[colIdx] ?? {}) };
      delete colErrors[field];
      next[colIdx] = Object.keys(colErrors).length ? colErrors : undefined;
      return next;
    });
  };

  const setFosa = (idx, field, value) => {
    if (isView) return;

    setForm((f) => {
      const next = [...(f.control_fosas ?? [])];
      next[idx] = { ...(next[idx] ?? {}), [field]: value };
      return { ...f, control_fosas: next };
    });

    setErrorTablaFosa((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      const rowErr = { ...(arr[idx] ?? {}) };
      delete rowErr[field];
      arr[idx] = Object.keys(rowErr).length ? rowErr : undefined;
      return arr;
    });
  };

  const addRows = () => {
    if (isView) return;
    setForm((f) => {
      if ((f.tabla_atomizado ?? []).length >= rows) return f;
      return {
        ...f,
        tabla_atomizado: [...(f.tabla_atomizado ?? []), NuevaFilaTabla()],
      };
    });
  };

  const removeRows = () => {
    if (isView) return;
    setForm((f) => {
      if ((f.tabla_atomizado ?? []).length <= 0) return f;
      return {
        ...f,
        tabla_atomizado: f.tabla_atomizado.slice(0, -1),
      };
    });
  };

  const handleValidation = async () => {
    if (isView) return;

    if (!turnoId) {
      setTurnoError('Selecciona un turno');
      toast.error('Selecciona un turno');
      return;
    } else {
      setTurnoError('');
    }

    const result = DatosAtomizado.safeParse(form);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      const tablaErrors = extractArrayFieldErrors(
        result.error,
        'tabla_atomizado',
      );
      const tablaErrorsControlGranulometria = extractArrayFieldErrors(
        result.error,
        'control_granulometria',
      );
      const tablaErrorFosa = extractArrayFieldErrors(
        result.error,
        'control_fosas',
      );

      setErrorTablaFosa(tablaErrorFosa);
      setErrorGranulometria(tablaErrorsControlGranulometria);
      setTablaError(tablaErrors);
      setError(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }

    const payload = {
      turno_id: turnoId,
      ...result.data,
    };

    onSave?.(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        onClick={loading ? undefined : onClose}
        className="absolute inset-0"
      />

      <div className="relative z-10 w-[96%] max-w-9xl overflow-hidden rounded-2xl border border-slate-700 bg-white shadow-2xl max-h-[calc(100vh-2rem)]">
        {loading && (
          <div className="absolute inset-0 z-50 grid place-items-center bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-4 shadow-lg">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <p className="text-sm font-semibold text-slate-800">
                Cargando datos...
              </p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            <div className="border-b border-slate-200 bg-linear-to-r from-emerald-900 via-emerald-800 to-emerald-700 px-6 py-4 text-white">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                    Sistema de Producción
                  </p>
                  <h2 className="text-xl font-bold">{title}</h2>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-600 bg-emerald-800/80 px-4 py-2 text-sm">
                  {isView ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <PencilSquareIcon className="h-5 w-5" />
                  )}
                  <span>{isView ? 'Modo visualización' : 'Modo edición'}</span>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <TabButton
                  active={tab === 'general'}
                  onClick={() => setTab('general')}
                >
                  Información general
                </TabButton>
                <TabButton
                  active={tab === 'observaciones'}
                  onClick={() => setTab('observaciones')}
                >
                  Observaciones
                </TabButton>
                <TabButton
                  active={tab === 'atomizado'}
                  onClick={() => setTab('atomizado')}
                >
                  Tabla atomizado
                </TabButton>
                <TabButton
                  active={tab === 'granulometria'}
                  onClick={() => setTab('granulometria')}
                >
                  Control granulometría
                </TabButton>
                <TabButton
                  active={tab === 'fosas'}
                  onClick={() => setTab('fosas')}
                >
                  Control fosas
                </TabButton>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-14rem)] bg-slate-50">
              {tab === 'general' && (
                <section className="p-6">
                  <div className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      Datos operativos
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Fecha"
                        value={form.fecha}
                        isView={isView}
                      >
                        <InputField
                          label="Fecha"
                          type="date"
                          name="fecha"
                          value={form.fecha || ''}
                          onChange={updateBase}
                          error={error.fecha}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Hora inicio"
                        value={form.hora_inicio}
                        isView={isView}
                      >
                        <InputField
                          label="Hora inicio"
                          type="time"
                          name="hora_inicio"
                          value={form.hora_inicio || ''}
                          onChange={updateBase}
                          error={error.hora_inicio}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Hora final"
                        value={form.hora_final}
                        isView={isView}
                      >
                        <InputField
                          label="Hora final"
                          type="time"
                          name="hora_final"
                          value={form.hora_final || ''}
                          onChange={updateBase}
                          error={error.hora_final}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      {isView ? (
                        <ReadOnlyBox label="Turno" value={turnoId || '-'} />
                      ) : (
                        <Select
                          label="Turno"
                          value={turnoId}
                          onChange={(v) => {
                            setTurnoId(v);
                            setTurnoError('');
                          }}
                          placeholder="Selecciona un turno"
                          getDatos={getObjs}
                          error={turnoError}
                        />
                      )}
                    </div>

                    <div className="lg:col-span-6">
                      <FieldShell
                        label="Operador"
                        value={form.operador}
                        isView={isView}
                      >
                        <InputField
                          label="Operador"
                          type="text"
                          name="operador"
                          value={form.operador || ''}
                          onChange={updateBase}
                          error={error.operador}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-6">
                      <FieldShell
                        label="Supervisor de turno"
                        value={form.supervisor_turno}
                        isView={isView}
                      >
                        <InputField
                          label="Supervisor de turno"
                          type="text"
                          name="supervisor_turno"
                          value={form.supervisor_turno || ''}
                          onChange={updateBase}
                          error={error.supervisor_turno}
                        />
                      </FieldShell>
                    </div>
                  </div>
                </section>
              )}

              {tab === 'observaciones' && (
                <section className="p-6">
                  <div className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      Bitácora de observaciones
                    </h3>
                  </div>

                  {!isView && (
                    <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
                      <InputField
                        label="Nueva observación"
                        type="text"
                        name="observaciones"
                        value={obsInput || ''}
                        onChange={(e) => setObsInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addObs();
                          }
                        }}
                      />

                      <button
                        type="button"
                        className="mt-auto inline-flex h-[42px] items-center justify-center rounded-xl bg-emerald-700 px-4 text-white hover:bg-emerald-800"
                        onClick={addObs}
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
                    {(form.observacionesAtomizadoDatos ?? []).length === 0 ? (
                      <p className="text-sm text-slate-500">
                        No hay observaciones registradas.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {(form.observacionesAtomizadoDatos ?? []).map(
                          (item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700"
                            >
                              <span className="max-w-[320px] truncate">
                                {item?.observacion || '-'}
                              </span>

                              {!isView && (
                                <button
                                  type="button"
                                  onClick={() => removeObs(idx)}
                                  className="rounded-full p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              )}
                            </span>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {tab === 'atomizado' && (
                <section className="p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      Tabla de atomizado
                    </h3>

                    {!isView && (
                      <div className="flex gap-2">
                        <button
                          className="rounded-xl border border-red-400 bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                          onClick={removeRows}
                        >
                          Eliminar fila
                        </button>
                        <button
                          className="rounded-xl border border-emerald-500 bg-emerald-700 px-3 py-2 text-sm text-white hover:bg-emerald-800"
                          onClick={addRows}
                        >
                          Agregar fila
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 px-5 bg-white">
                    <table className="text-sm">
                      <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
                        <tr className="border border-slate-300">
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            rowSpan={2}
                          >
                            HORA
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            PB1
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            PA1
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            PB2
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            PA2
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            PB3
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            PA3
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            TE
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            TS
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            rowSpan={2}
                          >
                            AS
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            LANZ
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={3}
                            rowSpan={2}
                          >
                            HUMEDAD
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            SILO
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            rowSpan={2}
                          >
                            PRODUCTO
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            rowSpan={2}
                          >
                            N° SILOS LLENOS
                          </th>
                        </tr>
                        <tr className="border border-slate-300">
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            Bareas
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            Bareas
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            Bareas
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            Bareas
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            Bareas
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            Bareas
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            °C
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            °C
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            °C
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            DESCARGANDO
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {form?.tabla_atomizado?.map((row, idx) => (
                          <tr key={idx} className="border border-slate-300 p-3">
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.hora} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="time"
                                  name="hora"
                                  value={row.hora}
                                  onChange={(e) => {
                                    setCargaTabla(idx, 'hora', e.target.value);
                                  }}
                                  error={!!tablaError[idx]?.hora}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.pba1_bareas} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="pa1_bareas"
                                  value={row.pba1_bareas}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'pba1_bareas',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.pba1_bareas}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.pa1_bareas} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="pa1_bareas"
                                  value={row.pa1_bareas}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'pa1_bareas',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.pa1_bareas}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.pba2_bareas} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="pa2_bareas"
                                  value={row.pba2_bareas}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'pba2_bareas',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.pba2_bareas}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.pa2_bareas} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="pa2_bareas"
                                  value={row.pa2_bareas}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'pa2_bareas',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.pa2_bareas}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.pba3_bareas} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="pa3_bareas"
                                  value={row.pba3_bareas}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'pba3_bareas',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.pba3_bareas}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.pa3_bareas} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="pa3_bareas"
                                  value={row.pa3_bareas}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'pa3_bareas',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.pa3_bareas}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.te_c1} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="te_c1"
                                  value={row.te_c1}
                                  onChange={(e) => {
                                    setCargaTabla(idx, 'te_c1', e.target.value);
                                  }}
                                  error={!!tablaError[idx]?.te_c1}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.te_c2} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="te_c2"
                                  value={row.te_c2}
                                  onChange={(e) => {
                                    setCargaTabla(idx, 'te_c2', e.target.value);
                                  }}
                                  error={!!tablaError[idx]?.te_c2}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.ts_c} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="ts_c"
                                  value={row.ts_c}
                                  onChange={(e) => {
                                    setCargaTabla(idx, 'ts_c', e.target.value);
                                  }}
                                  error={!!tablaError[idx]?.ts_c}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.as} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="as"
                                  value={row.as}
                                  onChange={(e) => {
                                    setCargaTabla(idx, 'as', e.target.value);
                                  }}
                                  error={!!tablaError[idx]?.as}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.as} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="as"
                                  value={row.as}
                                  onChange={(e) => {
                                    setCargaTabla(idx, 'as', e.target.value);
                                  }}
                                  error={!!tablaError[idx]?.as}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.humedad_uno} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="humedad_uno"
                                  value={row.humedad_uno}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'humedad_uno',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.humedad_uno}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.humedad_dos} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="humedad_dos"
                                  value={row.humedad_dos}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'humedad_dos',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.humedad_dos}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.humedad_tres} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="humedad_tres"
                                  value={row.humedad_tres}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'humedad_tres',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.humedad_tres}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.silo_descarga} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="silo_descarga"
                                  value={row.silo_descarga}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'silo_descarga',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.silo_descarga}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.producto} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="text"
                                  name="producto"
                                  value={row.producto}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'producto',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.producto}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.n_silo_llenos} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="text"
                                  name="n_silo_llenos"
                                  value={row.n_silo_llenos}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'n_silo_llenos',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.n_silo_llenos}
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {tab === 'granulometria' && (
                <section className="p-6">
                  <div className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      Control granulometría
                    </h3>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 px-5 flex justify-center bg-white">
                    <table className="text-sm">
                      <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
                        <tr className="border-b border-slate-300">
                          <th
                            className="px-10 py-3 text-center border border-slate-300"
                            colSpan={5}
                          >
                            CONTROL GRANULOMETIRA
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filasControlGranulomtria?.map((r) => (
                          <tr
                            key={r.key}
                            className="border border-slate-300 p-3"
                          >
                            <td className="p-2 border-r border-slate-300 text-center align-middle ">
                              {r.label}
                            </td>
                            {form.control_granulometria?.map((col, colIdx) => (
                              <td
                                key={colIdx}
                                className="p-2 border-r border-slate-300 text-center align-middle "
                              >
                                {isView ? (
                                  <TableReadOnly value={col?.[r.key] ?? ''} />
                                ) : (
                                  <InputField
                                    type={r.type ?? 'text'}
                                    value={col?.[r.key] ?? ''}
                                    onChange={(e) =>
                                      setGran(colIdx, r.key, e.target.value)
                                    }
                                    errorMode="border"
                                    error={
                                      errorGranulometria?.[colIdx]?.[r.key]
                                    }
                                  />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {tab === 'fosas' && (
                <section className="p-6">
                  <div className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      Control fosas
                    </h3>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 px-5 flex justify-center bg-white">
                    <table className="text-sm">
                      <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
                        <tr className="border-b border-slate-300">
                          <th
                            className="px-10 py-3 text-center border border-slate-300"
                            colSpan={4}
                          >
                            CONTROL FOSAS
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {form?.control_fosas?.map((row, idx) => (
                          <tr key={idx} className="border border-slate-300">
                            <td className="p-2 border-r border-slate-300 text-center align-middle ">
                              {row.label}
                            </td>
                            <td className="p-2 border-r border-slate-300 text-center align-middle ">
                              {isView ? (
                                <TableReadOnly value={row.densidad} />
                              ) : (
                                <InputField
                                  value={row.densidad}
                                  onChange={(e) =>
                                    setFosa(idx, 'densidad', e.target.value)
                                  }
                                  errorMode="border"
                                  error={!!errorTablaFosa[idx]?.densidad}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300 text-center align-middle ">
                              {isView ? (
                                <TableReadOnly value={row.viscosidad} />
                              ) : (
                                <InputField
                                  value={row.viscosidad}
                                  onChange={(e) =>
                                    setFosa(idx, 'viscosidad', e.target.value)
                                  }
                                  errorMode="border"
                                  error={!!errorTablaFosa[idx]?.viscosidad}
                                />
                              )}
                            </td>
                            <td className="p-2 border-r border-slate-300 text-center align-middle ">
                              {isView ? (
                                <TableReadOnly value={row.residuo} />
                              ) : (
                                <InputField
                                  value={row.residuo}
                                  onChange={(e) =>
                                    setFosa(idx, 'residuo', e.target.value)
                                  }
                                  errorMode="border"
                                  error={!!errorTablaFosa[idx]?.residuo}
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
              <button
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
                onClick={onClose}
              >
                {isView ? 'Cerrar' : 'Cancelar'}
              </button>

              {isEdit && (
                <button
                  className="rounded-xl bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
                  onClick={handleValidation}
                >
                  Guardar cambios
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-emerald-800 text-white shadow'
          : 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

function ReadOnlyBox({ label, value }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-[10px] text-sm text-slate-800">
        {value || '-'}
      </div>
    </div>
  );
}

function FieldShell({ label, value, isView, children }) {
  if (isView) {
    return <ReadOnlyBox label={label} value={value} />;
  }

  return children;
}

function TableReadOnly({ value }) {
  return (
    <div className="min-w-[70px] rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-center text-sm text-slate-700">
      {value || '-'}
    </div>
  );
}
