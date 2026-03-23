import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

import { datosPrensadoSecado } from '@schema/Produccion/Seccion/Prensado.schema';
import { extractArrayFieldErrors } from '@helpers/normalze.helpers';
import InputField from '@components/InputField';
import Select from '@components/Select';

import { getObjs } from '@service/Produccion/Turno.services';
import { getObjsUnidos as getLineas } from '@service/Produccion/Secciones/Lineas.services';

const NuevaFilaTabla = () => ({
  hora: '',
  humo_polvo: '',
  masa_molde1: '',
  masa_molde2: '',
  masa_molde4: '',
  masa_molde5: '',
  masa_molde6: '',
  masa_molde7: '',
  espesor_molde1_a: '',
  espesor_molde1_b: '',
  espesor_molde2_a: '',
  espesor_molde2_b: '',
  espesor_molde3_a: '',
  espesor_molde3_b: '',
  espesor_molde4_a: '',
  espesor_molde4_b: '',
  espesor_molde5_a: '',
  espesor_molde5_b: '',
  espesor_molde6_a: '',
  espesor_molde6_b: '',
  granulometria_mallas35: '',
  granulometria_mallas40: '',
  granulometria_mallas70: '',
  granulometria_mallas100: '',
  granulometria_mallas120: '',
  fond: ' ',
});

const siloUsado = () => ({
  n_silo: '',
  humedad: '',
});

const rows = 8;

const createInitialForm = () => ({
  fecha: '',
  operador: '',
  supervisor_turno: '',
  n_prensa: '',
  formato: '',
  producto: '',
  presion_especifica: '',
  golpes_inicial: '',
  golpes_final: '',
  total_golpes: '',
  hum_salida_secadora: '',
  temp_secadero_t1: '',
  temp_secadero_t2: '',
  temp_secadero_t3: '',
  temp_secadero_t4: '',
  temp_secadero_t5: '',
  temp_secadero_t6: '',
  ciclo_secadero: '',
  observaciones_prensado_secado: [],
  tabla_prensado_secado: [],
  tabla_silos_usado: [],
});

export default function PrensadoModal({
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
  const [tablaSiloError, setTablaSiloError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [obsInput, setObsInput] = useState('');

  const [turnoError, setTurnoError] = useState('');
  const [turnoId, setTurnoId] = useState('');

  const [lineaId, setLineaId] = useState('');
  const [lineaError, setLineaError] = useState('');

  const [tab, setTab] = useState('general');

  const title = useMemo(() => {
    if (isView) return 'Detalle de Prensado';
    return id ? 'Editar registro de Prensado' : 'Nuevo registro de Prensado';
  }, [id, isView]);

  useEffect(() => {
    if (!open) return;

    let active = true;
    setLoading(true);
    setError({});
    setTablaError([]);
    setTablaSiloError([]);
    setTurnoError('');
    setLineaError('');
    setObsInput('');
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
              observaciones_prensado_secado:
                dato?.observaciones_prensado_secado ?? [],
              tabla_prensado_secado: dato?.tabla_prensado_secado ?? [],
              tabla_silos_usado: dato?.tabla_silos_usado ?? [],
            });

            setTurnoId(dato?.turno_id ?? '');
            setLineaId(dato?.linea_id ?? data?.linea_id ?? '');
          } else {
            toast.error(data?.message || 'No se pudo cargar el registro');
          }
        } else {
          setForm({
            ...createInitialForm(),
            tabla_prensado_secado: [NuevaFilaTabla()],
            tabla_silos_usado: [siloUsado()],
          });
          setTurnoId('');
          setLineaId('');
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
      observaciones_prensado_secado: [
        ...(f.observaciones_prensado_secado ?? []),
        { observacion: v },
      ],
    }));
    setObsInput('');
  };

  const removeObs = (index) => {
    if (isView) return;
    setForm((f) => ({
      ...f,
      observaciones_prensado_secado: (
        f.observaciones_prensado_secado ?? []
      ).filter((_, i) => i !== index),
    }));
  };

  const setCargaTabla = (idx, field, value) => {
    if (isView) return;

    setForm((f) => {
      const rowsData = Array.isArray(f?.tabla_prensado_secado)
        ? [...f.tabla_prensado_secado]
        : [];
      if (idx < 0 || idx >= rowsData.length) return f;
      rowsData[idx] = { ...(rowsData[idx] ?? {}), [field]: value };
      return { ...f, tabla_prensado_secado: rowsData };
    });

    setTablaError((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      const rowErr = { ...(arr[idx] ?? {}) };
      delete rowErr[field];
      arr[idx] = Object.keys(rowErr).length ? rowErr : undefined;
      return arr;
    });
  };

  const setCargaTablaSilo = (idx, field, value) => {
    if (isView) return;

    setForm((f) => {
      const rowsData = Array.isArray(f?.tabla_silos_usado)
        ? [...f.tabla_silos_usado]
        : [];
      if (idx < 0 || idx >= rowsData.length) return f;
      rowsData[idx] = { ...(rowsData[idx] ?? {}), [field]: value };
      return { ...f, tabla_silos_usado: rowsData };
    });

    setTablaSiloError((prev) => {
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
      const tabla = Array.isArray(f?.tabla_prensado_secado)
        ? f.tabla_prensado_secado
        : [];
      if (tabla.length >= rows) return f;
      return {
        ...f,
        tabla_prensado_secado: [...tabla, NuevaFilaTabla()],
      };
    });
  };

  const removeRows = () => {
    if (isView) return;
    setForm((f) => {
      const tabla = Array.isArray(f?.tabla_prensado_secado)
        ? f.tabla_prensado_secado
        : [];
      if (tabla.length <= 0) return f;
      return {
        ...f,
        tabla_prensado_secado: tabla.slice(0, -1),
      };
    });
  };

  const addRowsSilo = () => {
    if (isView) return;
    setForm((f) => {
      const tabla = Array.isArray(f?.tabla_silos_usado)
        ? f.tabla_silos_usado
        : [];
      if (tabla.length >= rows) return f;
      return {
        ...f,
        tabla_silos_usado: [...tabla, siloUsado()],
      };
    });
  };

  const removeRowsSilo = () => {
    if (isView) return;
    setForm((f) => {
      const tabla = Array.isArray(f?.tabla_silos_usado)
        ? f.tabla_silos_usado
        : [];
      if (tabla.length <= 0) return f;
      return {
        ...f,
        tabla_silos_usado: tabla.slice(0, -1),
      };
    });
  };

  const handleValidation = async () => {
    if (isView) return;

    let hasErrors = false;

    if (!turnoId) {
      setTurnoError('Selecciona un turno');
      hasErrors = true;
    } else {
      setTurnoError('');
    }

    if (!lineaId) {
      setLineaError('Selecciona una línea');
      hasErrors = true;
    } else {
      setLineaError('');
    }

    if (hasErrors) {
      toast.error('Completa los campos requeridos');
      return;
    }

    const result = datosPrensadoSecado.safeParse(form);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      const tablaErrors = extractArrayFieldErrors(
        result.error,
        'tabla_prensado_secado',
      );

      const tablaErrorsSilo = extractArrayFieldErrors(
        result.error,
        'tabla_silos_usado',
      );

      setTablaSiloError(tablaErrorsSilo);
      setTablaError(tablaErrors);
      setError(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }

    const payload = {
      turno_id: turnoId,
      linea_id: lineaId,
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
                  active={tab === 'prensado'}
                  onClick={() => setTab('prensado')}
                >
                  Tabla prensado
                </TabButton>
                <TabButton
                  active={tab === 'secadero'}
                  onClick={() => setTab('secadero')}
                >
                  Secadero
                </TabButton>
                <TabButton
                  active={tab === 'silos'}
                  onClick={() => setTab('silos')}
                >
                  Silos usados
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
                      {isView ? (
                        <ReadOnlyBox label="Línea" value={lineaId || '-'} />
                      ) : (
                        <Select
                          label="Línea"
                          value={lineaId}
                          onChange={(v) => {
                            setLineaId(v);
                            setLineaError('');
                          }}
                          placeholder="Selecciona una línea"
                          getDatos={getLineas}
                          error={lineaError}
                        />
                      )}
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="N° prensa"
                        value={form?.n_prensa}
                        isView={isView}
                      >
                        <InputField
                          label="N° prensa"
                          type="number"
                          name="n_prensa"
                          value={form?.n_prensa || ''}
                          onChange={updateBase}
                          error={error.n_prensa}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Formato"
                        value={form?.formato}
                        isView={isView}
                      >
                        <InputField
                          label="Formato"
                          type="text"
                          name="formato"
                          value={form?.formato || ''}
                          onChange={updateBase}
                          error={error.formato}
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
                        label="Presión específica"
                        value={form?.presion_especifica}
                        isView={isView}
                      >
                        <InputField
                          label="Presion especifica"
                          type="number"
                          name="presion_especifica"
                          value={form?.presion_especifica || ''}
                          onChange={updateBase}
                          error={error.presion_especifica}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Golpes inicial"
                        value={form?.golpes_inicial}
                        isView={isView}
                      >
                        <InputField
                          label="Golpes inicial"
                          type="number"
                          name="golpes_inicial"
                          value={form?.golpes_inicial || ''}
                          onChange={updateBase}
                          error={error.golpes_inicial}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Golpes final"
                        value={form?.golpes_final}
                        isView={isView}
                      >
                        <InputField
                          label="Golpes final"
                          type="number"
                          name="golpes_final"
                          value={form?.golpes_final || ''}
                          onChange={updateBase}
                          error={error.golpes_final}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Total golpes"
                        value={form?.total_golpes}
                        isView={isView}
                      >
                        <InputField
                          label="Total golpes"
                          type="number"
                          name="total_golpes"
                          value={form?.total_golpes || ''}
                          onChange={updateBase}
                          error={error.total_golpes}
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
                    {(form?.observaciones_prensado_secado ?? []).length ===
                    0 ? (
                      <p className="text-sm text-slate-500">
                        No hay observaciones registradas.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {(form?.observaciones_prensado_secado ?? []).map(
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

              {tab === 'prensado' && (
                <section className="p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      Tabla de prensado
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
                            rowSpan={3}
                          >
                            % HUMO POLVO
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={7}
                            rowSpan={2}
                          >
                            MASA POR MOLDE KG
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={14}
                          >
                            ESPESOR POR MOLDE MM
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={7}
                          >
                            GRANULOMETRIA
                          </th>
                        </tr>
                        <tr className="border border-slate-300">
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            MOLDE 1
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            MOLDE 2
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            MOLDE 3
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            MOLDE 4
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            MOLDE 5
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            MOLDE 6
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            MOLDE 7
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={7}
                          >
                            MALLAS
                          </th>
                        </tr>
                        <tr className="border border-slate-300">
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            1
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            2
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            3
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            4
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            5
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            6
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            7
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            A
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            B
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            A
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            B
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            A
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            B
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            A
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            B
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            A
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            B
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            A
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            B
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            A
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            B
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            35
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            40
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            50
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            70
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            100
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            120
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            FOND.
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {form?.tabla_prensado_secado?.map((row, idx) => (
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
                                <TableReadOnly value={row.hum_polvo} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="hum_polvo"
                                  value={row.hum_polvo}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'hum_polvo',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.hum_polvo}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.masa_molde_uno} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="masa_molde_uno"
                                  value={row.masa_molde_uno}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'masa_molde_uno',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.masa_molde_uno}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.masa_molde_dos} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="masa_molde_dos"
                                  value={row.masa_molde_dos}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'masa_molde_dos',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.masa_molde_dos}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.masa_molde_tres} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="masa_molde_tres"
                                  value={row.masa_molde_tres}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'masa_molde_tres',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.masa_molde_tres}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.masa_molde_cuatro} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="masa_molde_cuatro"
                                  value={row.masa_molde_cuatro}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'masa_molde_cuatro',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.masa_molde_cuatro}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.masa_molde_cinco} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="masa_molde_cinco"
                                  value={row.masa_molde_cinco}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'masa_molde_cinco',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.masa_molde_cinco}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.masa_molde_seis} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="masa_molde_seis"
                                  value={row.masa_molde_seis}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'masa_molde_seis',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.masa_molde_seis}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.masa_molde_siete} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="masa_molde_siete"
                                  value={row.masa_molde_siete}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'masa_molde_siete',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.masa_molde_siete}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_uno_a}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_uno_a"
                                  value={row.espesor_molde_uno_a}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_uno_a',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.espesor_molde_uno_a}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_uno_b}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_uno_b"
                                  value={row.espesor_molde_uno_b}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_uno_b',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.espesor_molde_uno_b}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_dos_a}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_dos_a"
                                  value={row.espesor_molde_dos_a}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_dos_a',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.espesor_molde_dos_a}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_dos_b}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_dos_b"
                                  value={row.espesor_molde_dos_b}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_dos_b',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.espesor_molde_dos_b}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_tres_a}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_tres_a"
                                  value={row.espesor_molde_tres_a}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_tres_a',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]?.espesor_molde_tres_a
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_tres_b}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_tres_b"
                                  value={row.espesor_molde_tres_b}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_tres_b',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]?.espesor_molde_tres_b
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_cuatro_a}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_cuatro_a"
                                  value={row.espesor_molde_cuatro_a}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_cuatro_a',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]?.espesor_molde_cuatro_a
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_cuatro_b}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_cuatro_b"
                                  value={row.espesor_molde_cuatro_b}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_cuatro_b',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]?.espesor_molde_cuatro_b
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_cinco_a}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_cinco_a"
                                  value={row.espesor_molde_cinco_a}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_cinco_a',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]?.espesor_molde_cinco_a
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_cinco_b}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_cinco_b"
                                  value={row.espesor_molde_cinco_b}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_cinco_b',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]?.espesor_molde_cinco_b
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_seis_a}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_seis_a"
                                  value={row.espesor_molde_seis_a}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_seis_a',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]?.espesor_molde_seis_a
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_seis_b}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_seis_b"
                                  value={row.espesor_molde_seis_b}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_seis_b',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]?.espesor_molde_seis_b
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_siete_a}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_siete_a"
                                  value={row.espesor_molde_siete_a}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_siete_a',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]?.espesor_molde_siete_a
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.espesor_molde_siete_b}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="espesor_molde_siete_b"
                                  value={row.espesor_molde_siete_b}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'espesor_molde_siete_b',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]?.espesor_molde_siete_b
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.mallas_35} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="mallas_35"
                                  value={row.mallas_35}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'mallas_35',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.mallas_35}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.mallas_40} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="mallas_40"
                                  value={row.mallas_40}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'mallas_40',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.mallas_40}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.mallas_50} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="mallas_50"
                                  value={row.mallas_50}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'mallas_50',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.mallas_50}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.mallas_70} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="mallas_70"
                                  value={row.mallas_70}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'mallas_70',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.mallas_70}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.mallas_100} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="mallas_100"
                                  value={row.mallas_100}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'mallas_100',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.mallas_100}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.mallas_120} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="mallas_120"
                                  value={row.mallas_120}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'mallas_120',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaError[idx]?.mallas_120}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.font} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="font"
                                  value={row.font}
                                  onChange={(e) => {
                                    setCargaTabla(idx, 'font', e.target.value);
                                  }}
                                  error={!!tablaError[idx]?.font}
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

              {tab === 'secadero' && (
                <section className="p-6">
                  <div className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      Datos de secadero
                    </h3>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 px-5 bg-white">
                    <table className="text-sm">
                      <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
                        <tr className="border-b border-slate-300">
                          <th className="px-5 py-3 text-center border border-slate-300">
                            HUM. SALIDA DEL SECADERO
                          </th>

                          <th className="px-2 py-3 text-center border border-slate-300">
                            {isView ? (
                              <TableReadOnly
                                value={form?.hum_salida_secadora}
                              />
                            ) : (
                              <InputField
                                type="number"
                                name="hum_salida_secadora"
                                value={form?.hum_salida_secadora || ''}
                                onChange={updateBase}
                                error={error.hum_salida_secadora}
                              />
                            )}
                          </th>

                          <th className="px-10 py-3 text-center border border-slate-300">
                            TEMP. SECADERO
                          </th>

                          <th className="px-2 py-3 text-center border border-slate-300">
                            {isView ? (
                              <LabeledReadOnly
                                label="T1"
                                value={form?.temp_secadero_t1}
                              />
                            ) : (
                              <InputField
                                label="T1"
                                type="number"
                                name="temp_secadero_t1"
                                value={form?.temp_secadero_t1 || ''}
                                onChange={updateBase}
                                error={error.temp_secadero_t1}
                              />
                            )}
                          </th>

                          <th className="px-2 py-3 text-center border border-slate-300">
                            {isView ? (
                              <LabeledReadOnly
                                label="T2"
                                value={form?.temp_secadero_t2}
                              />
                            ) : (
                              <InputField
                                label="T2"
                                type="number"
                                name="temp_secadero_t2"
                                value={form?.temp_secadero_t2 || ''}
                                onChange={updateBase}
                                error={error.temp_secadero_t2}
                              />
                            )}
                          </th>

                          <th className="px-2 py-3 text-center border border-slate-300">
                            {isView ? (
                              <LabeledReadOnly
                                label="T3"
                                value={form?.temp_secadero_t3}
                              />
                            ) : (
                              <InputField
                                label="T3"
                                type="number"
                                name="temp_secadero_t3"
                                value={form?.temp_secadero_t3 || ''}
                                onChange={updateBase}
                                error={error.temp_secadero_t3}
                              />
                            )}
                          </th>

                          <th className="px-2 py-3 text-center border border-slate-300">
                            {isView ? (
                              <LabeledReadOnly
                                label="T4"
                                value={form?.temp_secadero_t4}
                              />
                            ) : (
                              <InputField
                                label="T4"
                                type="number"
                                name="temp_secadero_t4"
                                value={form?.temp_secadero_t4 || ''}
                                onChange={updateBase}
                                error={error.temp_secadero_t4}
                              />
                            )}
                          </th>

                          <th className="px-2 py-3 text-center border border-slate-300">
                            {isView ? (
                              <LabeledReadOnly
                                label="T5"
                                value={form?.temp_secadero_t5}
                              />
                            ) : (
                              <InputField
                                label="T5"
                                type="number"
                                name="temp_secadero_t5"
                                value={form?.temp_secadero_t5 || ''}
                                onChange={updateBase}
                                error={error.temp_secadero_t5}
                              />
                            )}
                          </th>

                          <th className="px-2 py-3 text-center border border-slate-300">
                            {isView ? (
                              <LabeledReadOnly
                                label="T6"
                                value={form?.temp_secadero_t6}
                              />
                            ) : (
                              <InputField
                                label="T6"
                                type="number"
                                name="temp_secadero_t6"
                                value={form?.temp_secadero_t6 || ''}
                                onChange={updateBase}
                                error={error.temp_secadero_t6}
                              />
                            )}
                          </th>

                          <th className="px-2 py-3 text-center border border-slate-300">
                            {isView ? (
                              <LabeledReadOnly
                                label="Ciclo secadero"
                                value={form?.ciclo_secadero}
                              />
                            ) : (
                              <InputField
                                label="Ciclo secadero"
                                type="number"
                                name="ciclo_secadero"
                                value={form?.ciclo_secadero || ''}
                                onChange={updateBase}
                                error={error.ciclo_secadero}
                              />
                            )}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </section>
              )}

              {tab === 'silos' && (
                <section className="p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      Silos usados
                    </h3>

                    {!isView && (
                      <div className="flex gap-2">
                        <button
                          className="rounded-xl border border-red-400 bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                          onClick={removeRowsSilo}
                        >
                          Eliminar fila
                        </button>
                        <button
                          className="rounded-xl border border-emerald-500 bg-emerald-700 px-3 py-2 text-sm text-white hover:bg-emerald-800"
                          onClick={addRowsSilo}
                        >
                          Agregar fila
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 px-5 flex justify-center bg-white">
                    <table className="text-sm">
                      <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
                        <tr className="border-b border-slate-300">
                          <th className="px-10 py-3 text-center border border-slate-300">
                            SILOS USADOS
                          </th>
                          <th className="px-10 py-3 text-center border border-slate-300">
                            HUMEDAD
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {form?.tabla_silos_usado?.map((row, idx) => (
                          <tr key={idx} className="border border-slate-300 p-3">
                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.n_silo} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="n_silo"
                                  value={row.n_silo}
                                  onChange={(e) => {
                                    setCargaTablaSilo(
                                      idx,
                                      'n_silo',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaSiloError[idx]?.n_silo}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row.humedad} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="humedad"
                                  value={row.humedad}
                                  onChange={(e) => {
                                    setCargaTablaSilo(
                                      idx,
                                      'humedad',
                                      e.target.value,
                                    );
                                  }}
                                  error={!!tablaSiloError[idx]?.humedad}
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

function LabeledReadOnly({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold text-slate-600">{label}</p>
      <div className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-center text-sm text-slate-700">
        {value || '-'}
      </div>
    </div>
  );
}
