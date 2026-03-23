import { useState, useEffect, useMemo } from 'react';
import { DatosSerigrafia } from '@schema/Produccion/Seccion/Serigrafia.schema';
import { extractArrayFieldErrors } from '@helpers/normalze.helpers';
import InputField from '@components/InputField';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

import { getObjs } from '@service/Produccion/Turno.services';
import Select from '@components/Select';

const rows = 8;

const NuevaFilaTabla = () => ({
  hora: '',
  operador_apl_pasta1: '',
  sp_apl_pasta1: '',
  operador_v_pasta1: '',
  sp_v_pasta1: '',
  operador_d_pasta1: '',
  sp_d_pasta1: '',
  operador_apl_pasta2: '',
  sp_apl_pasta2: '',
  operador_v_pasta2: '',
  sp_v_pasta2: '',
  operador_d_pasta2: '',
  sp_d_pasta2: '',
  operador_apl_pasta3: '',
  sp_apl_pasta3: '',
  operador_v_pasta3: '',
  sp_v_pasta3: '',
  operador_d_pasta3: '',
  sp_d_pasta3: '',
  operador_apl_pasta4: '',
  sp_apl_pasta4: '',
  operador_v_pasta4: '',
  sp_v_pasta4: '',
  operador_d_pasta4: '',
  sp_d_pasta4: '',
});

const createInitialForm = () => ({
  fecha: '',
  operador: '',
  supervisor_turno: '',
  linea: '',
  producto: '',
  pasta1: '',
  pasta2: '',
  pasta3: '',
  pasta4: '',
  observacionesSer: [],
  datos_tabla_serigrafiado: [],
});

export default function SerigrafiaModal({
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
  const [loading, setLoading] = useState(false);
  const [obsInput, setObsInput] = useState('');

  const [turnoError, setTurnoError] = useState('');
  const [turnoId, setTurnoId] = useState('');
  const [tab, setTab] = useState('general');

  const title = useMemo(() => {
    if (isView) return 'Detalle de Serigrafía';
    return id
      ? 'Editar registro de Serigrafía'
      : 'Nuevo registro de Serigrafía';
  }, [id, isView]);

  useEffect(() => {
    if (!open) return;

    let active = true;
    setLoading(true);
    setError({});
    setTablaError([]);
    setObsInput('');
    setTurnoError('');
    setTab('general');

    (async () => {
      try {
        if (id && fetchById) {
          const data = await fetchById(id);

          if (!active) return;

          if (data?.ok) {
            const dato = data?.dato ?? {};
            setForm({
              ...createInitialForm(),
              ...dato,
              observacionesSer: dato?.observacionesSer ?? [],
              datos_tabla_serigrafiado: dato?.datos_tabla_serigrafiado ?? [],
            });
            setTurnoId(dato?.turno_id ?? '');
          } else {
            toast.error(data?.message || 'No se pudo cargar el registro');
          }
        } else {
          setForm({
            ...createInitialForm(),
            datos_tabla_serigrafiado: [NuevaFilaTabla()],
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

  const addObs = () => {
    if (isView) return;
    const v = obsInput.trim();
    if (!v) return;

    setForm((f) => ({
      ...f,
      observacionesSer: [...(f.observacionesSer ?? []), { observacion: v }],
    }));
    setObsInput('');
  };

  const removeObs = (index) => {
    if (isView) return;
    setForm((f) => ({
      ...f,
      observacionesSer: (f.observacionesSer ?? []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const setCargaTabla = (idx, field, value) => {
    if (isView) return;

    setForm((f) => {
      const rowsData = Array.isArray(f?.datos_tabla_serigrafiado)
        ? [...f.datos_tabla_serigrafiado]
        : [];
      if (idx < 0 || idx >= rowsData.length) return f;
      rowsData[idx] = { ...(rowsData[idx] ?? {}), [field]: value };
      return { ...f, datos_tabla_serigrafiado: rowsData };
    });

    setTablaError((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      const rowErr = { ...(arr[idx] ?? {}) };
      delete rowErr[field];
      arr[idx] = Object.keys(rowErr).length === 0 ? undefined : rowErr;
      return arr;
    });
  };

  const addRows = () => {
    if (isView) return;
    setForm((f) => {
      const tabla = Array.isArray(f?.datos_tabla_serigrafiado)
        ? f.datos_tabla_serigrafiado
        : [];
      if (tabla.length >= rows) return f;
      return {
        ...f,
        datos_tabla_serigrafiado: [...tabla, NuevaFilaTabla()],
      };
    });
  };

  const removeRows = () => {
    if (isView) return;
    setForm((f) => {
      const tabla = Array.isArray(f?.datos_tabla_serigrafiado)
        ? f.datos_tabla_serigrafiado
        : [];
      if (tabla.length <= 0) return f;
      return {
        ...f,
        datos_tabla_serigrafiado: tabla.slice(0, -1),
      };
    });
  };

  const updateBase = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
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

    const result = DatosSerigrafia.safeParse(form);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      const tablaErrors = extractArrayFieldErrors(
        result.error,
        'datos_tabla_serigrafiado',
      );

      setTablaError(tablaErrors);
      setError(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }

    const data = { turno_id: turnoId, ...result.data };
    onSave?.(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        onClick={loading ? undefined : onClose}
        className="absolute inset-0"
      />

      <div className="relative z-10 w-[96%] max-w-7xl overflow-hidden rounded-2xl border border-slate-700 bg-white shadow-2xl max-h-[calc(100vh-2rem)]">
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
                  active={tab === 'tabla'}
                  onClick={() => setTab('tabla')}
                >
                  Tabla serigrafía
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
                        value={form?.fecha}
                        isView={isView}
                      >
                        <InputField
                          label="Fecha"
                          type="date"
                          name="fecha"
                          value={form?.fecha || ''}
                          onChange={updateBase}
                          error={error.fecha}
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
                        value={form?.operador}
                        isView={isView}
                      >
                        <InputField
                          label="Operador"
                          type="text"
                          name="operador"
                          value={form?.operador || ''}
                          onChange={updateBase}
                          error={error.operador}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-6">
                      <FieldShell
                        label="Supervisor de turno"
                        value={form?.supervisor_turno}
                        isView={isView}
                      >
                        <InputField
                          label="Supervisor de turno"
                          type="text"
                          name="supervisor_turno"
                          value={form?.supervisor_turno || ''}
                          onChange={updateBase}
                          error={error.supervisor_turno}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Línea"
                        value={form?.linea}
                        isView={isView}
                      >
                        <InputField
                          label="Linea"
                          type="text"
                          name="linea"
                          value={form?.linea || ''}
                          onChange={updateBase}
                          error={error.linea}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Producto"
                        value={form?.producto}
                        isView={isView}
                      >
                        <InputField
                          label="Producto"
                          type="text"
                          name="producto"
                          value={form?.producto || ''}
                          onChange={updateBase}
                          error={error.producto}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Pasta 1"
                        value={form?.pasta1}
                        isView={isView}
                      >
                        <InputField
                          label="Pasta 1"
                          type="text"
                          name="pasta1"
                          value={form?.pasta1 || ''}
                          onChange={updateBase}
                          error={error.pasta1}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Pasta 2"
                        value={form?.pasta2}
                        isView={isView}
                      >
                        <InputField
                          label="Pasta 2"
                          type="text"
                          name="pasta2"
                          value={form?.pasta2 || ''}
                          onChange={updateBase}
                          error={error.pasta2}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Pasta 3"
                        value={form?.pasta3}
                        isView={isView}
                      >
                        <InputField
                          label="Pasta 3"
                          type="text"
                          name="pasta3"
                          value={form?.pasta3 || ''}
                          onChange={updateBase}
                          error={error.pasta3}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Pasta 4"
                        value={form?.pasta4}
                        isView={isView}
                      >
                        <InputField
                          label="Pasta 4"
                          type="text"
                          name="pasta4"
                          value={form?.pasta4 || ''}
                          onChange={updateBase}
                          error={error.pasta4}
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
                    {(form?.observacionesSer ?? []).length === 0 ? (
                      <p className="text-sm text-slate-500">
                        No hay observaciones registradas.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {(form?.observacionesSer ?? []).map((item, idx) => (
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
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {tab === 'tabla' && (
                <section className="p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      Tabla de serigrafía
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
                            rowSpan={3}
                          >
                            HORA
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={6}
                          >
                            {isView ? (
                              <HeaderReadOnly
                                label="Pasta 1"
                                value={form?.pasta1}
                              />
                            ) : (
                              <InputField
                                label="Pasta 1"
                                type="text"
                                name="pasta1"
                                value={form?.pasta1 || ''}
                                onChange={updateBase}
                                error={error.pasta1}
                              />
                            )}
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={6}
                          >
                            {isView ? (
                              <HeaderReadOnly
                                label="Pasta 2"
                                value={form?.pasta2}
                              />
                            ) : (
                              <InputField
                                label="Pasta 2"
                                type="text"
                                name="pasta2"
                                value={form?.pasta2 || ''}
                                onChange={updateBase}
                                error={error.pasta2}
                              />
                            )}
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={6}
                          >
                            {isView ? (
                              <HeaderReadOnly
                                label="Pasta 3"
                                value={form?.pasta3}
                              />
                            ) : (
                              <InputField
                                label="Pasta 3"
                                type="text"
                                name="pasta3"
                                value={form?.pasta3 || ''}
                                onChange={updateBase}
                                error={error.pasta3}
                              />
                            )}
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={6}
                          >
                            {isView ? (
                              <HeaderReadOnly
                                label="Pasta 4"
                                value={form?.pasta4}
                              />
                            ) : (
                              <InputField
                                label="Pasta 4"
                                type="text"
                                name="pasta4"
                                value={form?.pasta4 || ''}
                                onChange={updateBase}
                                error={error.pasta4}
                              />
                            )}
                          </th>
                        </tr>

                        <tr className="border border-slate-300">
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            APL [G]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            V [s]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            D [g/cm³]
                          </th>

                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            APL [G]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            V [s]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            D [g/cm³]
                          </th>

                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            APL [G]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            V [s]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            D [g/cm³]
                          </th>

                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            APL [G]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            V [s]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            D [g/cm³]
                          </th>
                        </tr>

                        <tr className="border border-slate-300">
                          {Array.from({ length: 12 }).flatMap((_, i) => [
                            <th
                              key={`oper-${i}`}
                              className="px-10 py-3 text-center border-r border-slate-300"
                            >
                              OPERADOR
                            </th>,
                            <th
                              key={`sp-${i}`}
                              className="px-10 py-3 text-center border-r border-slate-300"
                            >
                              S.P.
                            </th>,
                          ])}
                        </tr>
                      </thead>

                      <tbody>
                        {form?.datos_tabla_serigrafiado?.map((row, idx) => (
                          <tr key={idx} className="border border-slate-300 p-3">
                            <Cell isView={isView} value={row.hora}>
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
                            </Cell>

                            <Cell
                              isView={isView}
                              value={row.operador_apl_pasta1}
                            >
                              <InputField
                                errorMode="border"
                                type="number"
                                name="operador_apl_pasta1"
                                value={row.operador_apl_pasta1}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'operador_apl_pasta1',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.operador_apl_pasta1}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.sp_apl_pasta1}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="sp_apl_pasta1"
                                value={row.sp_apl_pasta1}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'sp_apl_pasta1',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.sp_apl_pasta1}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.operador_v_pasta1}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="operador_v_pasta1"
                                value={row.operador_v_pasta1}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'operador_v_pasta1',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.operador_v_pasta1}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.sp_v_pasta1}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="sp_v_pasta1"
                                value={row.sp_v_pasta1}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'sp_v_pasta1',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.sp_v_pasta1}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.operador_d_pasta1}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="operador_d_pasta1"
                                value={row.operador_d_pasta1}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'operador_d_pasta1',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.operador_d_pasta1}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.sp_d_pasta1}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="sp_d_pasta1"
                                value={row.sp_d_pasta1}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'sp_d_pasta1',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.sp_d_pasta1}
                              />
                            </Cell>

                            <Cell
                              isView={isView}
                              value={row.operador_apl_pasta2}
                            >
                              <InputField
                                errorMode="border"
                                type="number"
                                name="operador_apl_pasta2"
                                value={row.operador_apl_pasta2}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'operador_apl_pasta2',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.operador_apl_pasta2}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.sp_apl_pasta2}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="sp_apl_pasta2"
                                value={row.sp_apl_pasta2}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'sp_apl_pasta2',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.sp_apl_pasta2}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.operador_v_pasta2}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="operador_v_pasta2"
                                value={row.operador_v_pasta2}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'operador_v_pasta2',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.operador_v_pasta2}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.sp_v_pasta2}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="sp_v_pasta2"
                                value={row.sp_v_pasta2}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'sp_v_pasta2',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.sp_v_pasta2}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.operador_d_pasta2}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="operador_d_pasta2"
                                value={row.operador_d_pasta2}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'operador_d_pasta2',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.operador_d_pasta2}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.sp_d_pasta2}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="sp_d_pasta2"
                                value={row.sp_d_pasta2}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'sp_d_pasta2',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.sp_d_pasta2}
                              />
                            </Cell>

                            <Cell
                              isView={isView}
                              value={row.operador_apl_pasta3}
                            >
                              <InputField
                                errorMode="border"
                                type="number"
                                name="operador_apl_pasta3"
                                value={row.operador_apl_pasta3}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'operador_apl_pasta3',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.operador_apl_pasta3}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.sp_apl_pasta3}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="sp_apl_pasta3"
                                value={row.sp_apl_pasta3}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'sp_apl_pasta3',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.sp_apl_pasta3}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.operador_v_pasta3}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="operador_v_pasta3"
                                value={row.operador_v_pasta3}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'operador_v_pasta3',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.operador_v_pasta3}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.sp_v_pasta3}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="sp_v_pasta3"
                                value={row.sp_v_pasta3}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'sp_v_pasta3',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.sp_v_pasta3}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.operador_d_pasta3}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="operador_d_pasta3"
                                value={row.operador_d_pasta3}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'operador_d_pasta3',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.operador_d_pasta3}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.sp_d_pasta3}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="sp_d_pasta3"
                                value={row.sp_d_pasta3}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'sp_d_pasta3',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.sp_d_pasta3}
                              />
                            </Cell>

                            <Cell
                              isView={isView}
                              value={row.operador_apl_pasta4}
                            >
                              <InputField
                                errorMode="border"
                                type="number"
                                name="operador_apl_pasta4"
                                value={row.operador_apl_pasta4}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'operador_apl_pasta4',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.operador_apl_pasta4}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.sp_apl_pasta4}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="sp_apl_pasta4"
                                value={row.sp_apl_pasta4}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'sp_apl_pasta4',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.sp_apl_pasta4}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.operador_v_pasta4}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="operador_v_pasta4"
                                value={row.operador_v_pasta4}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'operador_v_pasta4',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.operador_v_pasta4}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.sp_v_pasta4}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="sp_v_pasta4"
                                value={row.sp_v_pasta4}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'sp_v_pasta4',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.sp_v_pasta4}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.operador_d_pasta4}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="operador_d_pasta4"
                                value={row.operador_d_pasta4}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'operador_d_pasta4',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.operador_d_pasta4}
                              />
                            </Cell>

                            <Cell isView={isView} value={row.sp_d_pasta4}>
                              <InputField
                                errorMode="border"
                                type="number"
                                name="sp_d_pasta4"
                                value={row.sp_d_pasta4}
                                onChange={(e) => {
                                  setCargaTabla(
                                    idx,
                                    'sp_d_pasta4',
                                    e.target.value,
                                  );
                                }}
                                error={!!tablaError[idx]?.sp_d_pasta4}
                              />
                            </Cell>
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

function HeaderReadOnly({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </p>
      <div className="rounded-lg border border-slate-300 bg-slate-100 px-2 py-2 text-xs normal-case text-slate-800">
        {value || '-'}
      </div>
    </div>
  );
}

function Cell({ isView, value, children }) {
  return (
    <td className="p-2 border-r border-slate-300">
      {isView ? <TableReadOnly value={value} /> : children}
    </td>
  );
}
