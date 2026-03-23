import { useState, useEffect, useMemo } from 'react';
import { DatosEsmalte } from '@schema/Produccion/Seccion/Esmalte.schema';
import { extractArrayFieldErrors } from '@helpers/normalze.helpers';
import InputField from '@components/InputField';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import Select from '@components/Select';
import { getObjs } from '@service/Produccion/Turno.services';

const NuevaFilaTabla = () => ({
  hora: '',
  operador_aplicacion_agua: '',
  sup_prod_aplicacion_agua: '',
  operador_aplicacion_engobe: '',
  sup_prod_aplicacion_engobe: '',
  operador_vizcosidad_normal: '',
  sup_prod_vizcosidad_normal: '',
  operador_densidad_recuperado: '',
  sup_prod_densidad_recuperado: '',
  operador_residuo_implemeable: '',
  sup_prod_residuo_implemeable: '',
  operador_aplicacion_esmalte: '',
  sup_prod_aplicacion_esmalte: '',
  operador_vizcosidad_brillante_recuperado: '',
  sup_prod_vizcosidad_brillante_recuperado: '',
  operador_densidad_transparente_satinado: '',
  sup_prod_densidad_transparente_satinado: '',
  operador_residuo_digital_blanco: '',
  sup_prod_residuo_digital_blanco: '',
});

const rows = 8;

const createInitialForm = () => ({
  fecha: '',
  operador: '',
  supervisor_turno: '',
  linea: '',
  producto: '',
  agua_aplicacion: '',
  normal_viscosidad: '',
  recuperado_densidad: '',
  implemeable_residuo: '',
  brillante_viscosidad: '',
  recuperado_viscosidad: '',
  tranparente_densidad: '',
  satinado_densidad: '',
  digital_residuo: '',
  blanco_residuo: '',
  observaciones_esmalte: [],
  datos_tabla_esmalte: [],
});

export default function EsmalteModal({
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
    if (isView) return 'Detalle de Esmalte';
    return id ? 'Editar registro de Esmalte' : 'Nuevo registro de Esmalte';
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
              observaciones_esmalte: dato?.observaciones_esmalte ?? [],
              datos_tabla_esmalte: dato?.datos_tabla_esmalte ?? [],
            });
            setTurnoId(dato?.turno_id ?? '');
          } else {
            toast.error(data?.message || 'No se pudo cargar el registro');
          }
        } else {
          setForm({
            ...createInitialForm(),
            datos_tabla_esmalte: [NuevaFilaTabla()],
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
      observaciones_esmalte: [
        ...(f.observaciones_esmalte ?? []),
        { observacion: v },
      ],
    }));
    setObsInput('');
  };

  const removeObs = (index) => {
    if (isView) return;
    setForm((f) => ({
      ...f,
      observaciones_esmalte: (f.observaciones_esmalte ?? []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const setCargaTabla = (idx, field, value) => {
    if (isView) return;

    setForm((f) => {
      const rowsData = Array.isArray(f?.datos_tabla_esmalte)
        ? [...f.datos_tabla_esmalte]
        : [];
      if (idx < 0 || idx >= rowsData.length) return f;
      rowsData[idx] = { ...(rowsData[idx] ?? {}), [field]: value };
      return { ...f, datos_tabla_esmalte: rowsData };
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
      const tabla = Array.isArray(f?.datos_tabla_esmalte)
        ? f.datos_tabla_esmalte
        : [];
      if (tabla.length >= rows) return f;
      return {
        ...f,
        datos_tabla_esmalte: [...tabla, NuevaFilaTabla()],
      };
    });
  };

  const removeRows = () => {
    if (isView) return;
    setForm((f) => {
      const tabla = Array.isArray(f?.datos_tabla_esmalte)
        ? f.datos_tabla_esmalte
        : [];
      if (tabla.length <= 0) return f;
      return {
        ...f,
        datos_tabla_esmalte: tabla.slice(0, -1),
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

    const result = DatosEsmalte.safeParse(form);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      const tablaErrors = extractArrayFieldErrors(
        result.error,
        'datos_tabla_esmalte',
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
            <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 px-6 py-4 text-white">
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
                  Tabla esmalte
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
                        label="Agua"
                        value={form?.agua_aplicacion}
                        isView={isView}
                      >
                        <InputField
                          label="Agua"
                          type="text"
                          name="agua_aplicacion"
                          value={form?.agua_aplicacion || ''}
                          onChange={updateBase}
                          error={error.agua_aplicacion}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Normal"
                        value={form?.normal_viscosidad}
                        isView={isView}
                      >
                        <InputField
                          label="Normal"
                          type="text"
                          name="normal_viscosidad"
                          value={form?.normal_viscosidad || ''}
                          onChange={updateBase}
                          error={error.normal_viscosidad}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Recuperado densidad"
                        value={form?.recuperado_densidad}
                        isView={isView}
                      >
                        <InputField
                          label="Recuperado densidad"
                          type="text"
                          name="recuperado_densidad"
                          value={form?.recuperado_densidad || ''}
                          onChange={updateBase}
                          error={error.recuperado_densidad}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Implemeable residuo"
                        value={form?.implemeable_residuo}
                        isView={isView}
                      >
                        <InputField
                          label="Implemeable residuo"
                          type="text"
                          name="implemeable_residuo"
                          value={form?.implemeable_residuo || ''}
                          onChange={updateBase}
                          error={error.implemeable_residuo}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Brillante viscosidad"
                        value={form?.brillante_viscosidad}
                        isView={isView}
                      >
                        <InputField
                          label="Brillante viscosidad"
                          type="text"
                          name="brillante_viscosidad"
                          value={form?.brillante_viscosidad || ''}
                          onChange={updateBase}
                          error={error.brillante_viscosidad}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Recuperado viscosidad"
                        value={form?.recuperado_viscosidad}
                        isView={isView}
                      >
                        <InputField
                          label="Recuperado viscosidad"
                          type="text"
                          name="recuperado_viscosidad"
                          value={form?.recuperado_viscosidad || ''}
                          onChange={updateBase}
                          error={error.recuperado_viscosidad}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Transparente densidad"
                        value={form?.tranparente_densidad}
                        isView={isView}
                      >
                        <InputField
                          label="Transparente densidad"
                          type="text"
                          name="tranparente_densidad"
                          value={form?.tranparente_densidad || ''}
                          onChange={updateBase}
                          error={error.tranparente_densidad}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Satinado densidad"
                        value={form?.satinado_densidad}
                        isView={isView}
                      >
                        <InputField
                          label="Satinado densidad"
                          type="text"
                          name="satinado_densidad"
                          value={form?.satinado_densidad || ''}
                          onChange={updateBase}
                          error={error.satinado_densidad}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Digital residuo"
                        value={form?.digital_residuo}
                        isView={isView}
                      >
                        <InputField
                          label="Digital residuo"
                          type="text"
                          name="digital_residuo"
                          value={form?.digital_residuo || ''}
                          onChange={updateBase}
                          error={error.digital_residuo}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Blanco residuo"
                        value={form?.blanco_residuo}
                        isView={isView}
                      >
                        <InputField
                          label="Blanco residuo"
                          type="text"
                          name="blanco_residuo"
                          value={form?.blanco_residuo || ''}
                          onChange={updateBase}
                          error={error.blanco_residuo}
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
                    {(form?.observaciones_esmalte ?? []).length === 0 ? (
                      <p className="text-sm text-slate-500">
                        No hay observaciones registradas.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {(form?.observaciones_esmalte ?? []).map(
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

              {tab === 'tabla' && (
                <section className="p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      Tabla de esmalte
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
                            colSpan={2}
                          >
                            {isView ? (
                              <HeaderReadOnly
                                label="Agua"
                                value={form?.agua_aplicacion}
                              />
                            ) : (
                              <InputField
                                label="Agua"
                                type="text"
                                name="agua_aplicacion"
                                value={form?.agua_aplicacion || ''}
                                onChange={updateBase}
                                error={error.agua_aplicacion}
                              />
                            )}
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            ENGOBE
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            {isView ? (
                              <HeaderReadOnly
                                label="Normal"
                                value={form?.normal_viscosidad}
                              />
                            ) : (
                              <InputField
                                label="Normal"
                                type="text"
                                name="normal_viscosidad"
                                value={form?.normal_viscosidad || ''}
                                onChange={updateBase}
                                error={error.normal_viscosidad}
                              />
                            )}
                          </th>
                          <th
                            className="px-2 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            {isView ? (
                              <HeaderReadOnly
                                label="Recuperado"
                                value={form?.recuperado_densidad}
                              />
                            ) : (
                              <InputField
                                label="Recuperado"
                                type="text"
                                name="recuperado_densidad"
                                value={form?.recuperado_densidad || ''}
                                onChange={updateBase}
                                error={error.recuperado_densidad}
                              />
                            )}
                          </th>
                          <th
                            className="px-2 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            {isView ? (
                              <HeaderReadOnly
                                label="Implemeable"
                                value={form?.implemeable_residuo}
                              />
                            ) : (
                              <InputField
                                label="Implemeable"
                                type="text"
                                name="implemeable_residuo"
                                value={form?.implemeable_residuo || ''}
                                onChange={updateBase}
                                error={error.implemeable_residuo}
                              />
                            )}
                          </th>
                          <th
                            className="px-2 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            ESMALTE
                          </th>
                          <th className="px-2 py-3 text-center border-r border-slate-300">
                            {isView ? (
                              <HeaderReadOnly
                                label="Brillante"
                                value={form?.brillante_viscosidad}
                              />
                            ) : (
                              <InputField
                                label="Brillante"
                                type="text"
                                name="brillante_viscosidad"
                                value={form?.brillante_viscosidad || ''}
                                onChange={updateBase}
                                error={error.brillante_viscosidad}
                              />
                            )}
                          </th>
                          <th className="px-2 py-3 text-center border-r border-slate-300">
                            {isView ? (
                              <HeaderReadOnly
                                label="Recuperado"
                                value={form?.recuperado_viscosidad}
                              />
                            ) : (
                              <InputField
                                label="Recuperado"
                                type="text"
                                name="recuperado_viscosidad"
                                value={form?.recuperado_viscosidad || ''}
                                onChange={updateBase}
                                error={error.recuperado_viscosidad}
                              />
                            )}
                          </th>
                          <th className="px-2 py-3 text-center border-r border-slate-300">
                            {isView ? (
                              <HeaderReadOnly
                                label="Transparente"
                                value={form?.tranparente_densidad}
                              />
                            ) : (
                              <InputField
                                label="Transparente"
                                type="text"
                                name="tranparente_densidad"
                                value={form?.tranparente_densidad || ''}
                                onChange={updateBase}
                                error={error.tranparente_densidad}
                              />
                            )}
                          </th>
                          <th className="px-2 py-3 text-center border-r border-slate-300">
                            {isView ? (
                              <HeaderReadOnly
                                label="Satinado"
                                value={form?.satinado_densidad}
                              />
                            ) : (
                              <InputField
                                label="Satinado"
                                type="text"
                                name="satinado_densidad"
                                value={form?.satinado_densidad || ''}
                                onChange={updateBase}
                                error={error.satinado_densidad}
                              />
                            )}
                          </th>
                          <th className="px-2 py-3 text-center border-r border-slate-300">
                            {isView ? (
                              <HeaderReadOnly
                                label="Digital"
                                value={form?.digital_residuo}
                              />
                            ) : (
                              <InputField
                                label="Digital"
                                type="text"
                                name="digital_residuo"
                                value={form?.digital_residuo || ''}
                                onChange={updateBase}
                                error={error.digital_residuo}
                              />
                            )}
                          </th>
                          <th className="px-2 py-3 border-r border-slate-300">
                            {isView ? (
                              <HeaderReadOnly
                                label="*"
                                value={form?.blanco_residuo}
                              />
                            ) : (
                              <InputField
                                label="*"
                                type="text"
                                name="blanco_residuo"
                                value={form?.blanco_residuo || ''}
                                onChange={updateBase}
                                error={error.blanco_residuo}
                              />
                            )}
                          </th>
                        </tr>

                        <tr className="border border-slate-300">
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            APLICACION [G]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            APLICACION [G]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            VIZCOCIDAD [S]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            DENSIDAD [G/CM²]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            RESIDUIO [%]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            APLICACION [G]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            VIZCOCIDAD [S]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            DENSIDAD [G/CM²]
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={2}
                          >
                            RESIDUIO [%]
                          </th>
                        </tr>

                        <tr className="border border-slate-300">
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            OPERADOR
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            SUP. PROD.
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            OPERADOR
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            SUP. PROD.
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            OPERADOR
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            SUP. PROD.
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            OPERADOR
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            SUP. PROD.
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            OPERADOR
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            SUP. PROD.
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            OPERADOR
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            SUP. PROD.
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            OPERADOR
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            SUP. PROD.
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            OPERADOR
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            SUP. PROD.
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            OPERADOR
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            SUP. PROD.
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {form?.datos_tabla_esmalte?.map((row, idx) => (
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
                                <TableReadOnly
                                  value={row.operador_aplicacion_agua}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="operador_aplicacion_agua"
                                  value={row.operador_aplicacion_agua}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'operador_aplicacion_agua',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]?.operador_aplicacion_agua
                                  }
                                />
                              )}
                            </td>

                            <td className="border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.sup_prod_aplicacion_agua}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="sup_prod_aplicacion_agua"
                                  value={row.sup_prod_aplicacion_agua}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'sup_prod_aplicacion_agua',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]?.sup_prod_aplicacion_agua
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.operador_aplicacion_engobe}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="operador_aplicacion_engobe"
                                  value={row.operador_aplicacion_engobe}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'operador_aplicacion_engobe',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.operador_aplicacion_engobe
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.sup_prod_aplicacion_engobe}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="sup_prod_aplicacion_engobe"
                                  value={row.sup_prod_aplicacion_engobe}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'sup_prod_aplicacion_engobe',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.sup_prod_aplicacion_engobe
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.operador_vizcosidad_normal}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="operador_vizcosidad_normal"
                                  value={row.operador_vizcosidad_normal}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'operador_vizcosidad_normal',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.operador_vizcosidad_normal
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.sup_prod_vizcosidad_normal}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="sup_prod_vizcosidad_normal"
                                  value={row.sup_prod_vizcosidad_normal}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'sup_prod_vizcosidad_normal',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.sup_prod_vizcosidad_normal
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.operador_densidad_recuperado}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="operador_densidad_recuperado"
                                  value={row.operador_densidad_recuperado}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'operador_densidad_recuperado',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.operador_densidad_recuperado
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.sup_prod_densidad_recuperado}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="sup_prod_densidad_recuperado"
                                  value={row.sup_prod_densidad_recuperado}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'sup_prod_densidad_recuperado',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.sup_prod_densidad_recuperado
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.operador_residuo_implemeable}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="operador_residuo_implemeable"
                                  value={row.operador_residuo_implemeable}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'operador_residuo_implemeable',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.operador_residuo_implemeable
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.sup_prod_residuo_implemeable}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="sup_prod_residuo_implemeable"
                                  value={row.sup_prod_residuo_implemeable}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'sup_prod_residuo_implemeable',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.sup_prod_residuo_implemeable
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.operador_aplicacion_esmalte}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="operador_aplicacion_esmalte"
                                  value={row.operador_aplicacion_esmalte}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'operador_aplicacion_esmalte',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.operador_aplicacion_esmalte
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.sup_prod_aplicacion_esmalte}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="sup_prod_aplicacion_esmalte"
                                  value={row.sup_prod_aplicacion_esmalte}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'sup_prod_aplicacion_esmalte',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.sup_prod_aplicacion_esmalte
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={
                                    row.operador_vizcosidad_brillante_recuperado
                                  }
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="operador_vizcosidad_brillante_recuperado"
                                  value={
                                    row.operador_vizcosidad_brillante_recuperado
                                  }
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'operador_vizcosidad_brillante_recuperado',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.operador_vizcosidad_brillante_recuperado
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={
                                    row.sup_prod_vizcosidad_brillante_recuperado
                                  }
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="sup_prod_vizcosidad_brillante_recuperado"
                                  value={
                                    row.sup_prod_vizcosidad_brillante_recuperado
                                  }
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'sup_prod_vizcosidad_brillante_recuperado',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.sup_prod_vizcosidad_brillante_recuperado
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={
                                    row.operador_densidad_transparente_satinado
                                  }
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="operador_densidad_transparente_satinado"
                                  value={
                                    row.operador_densidad_transparente_satinado
                                  }
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'operador_densidad_transparente_satinado',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.operador_densidad_transparente_satinado
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={
                                    row.sup_prod_densidad_transparente_satinado
                                  }
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="sup_prod_densidad_transparente_satinado"
                                  value={
                                    row.sup_prod_densidad_transparente_satinado
                                  }
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'sup_prod_densidad_transparente_satinado',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.sup_prod_densidad_transparente_satinado
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.operador_residuo_digital_blanco}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="operador_residuo_digital_blanco"
                                  value={row.operador_residuo_digital_blanco}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'operador_residuo_digital_blanco',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.operador_residuo_digital_blanco
                                  }
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly
                                  value={row.sup_prod_residuo_digital_blanco}
                                />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="number"
                                  name="operador_residuo_digital_blanco"
                                  value={row.sup_prod_residuo_digital_blanco}
                                  onChange={(e) => {
                                    setCargaTabla(
                                      idx,
                                      'sup_prod_residuo_digital_blanco',
                                      e.target.value,
                                    );
                                  }}
                                  error={
                                    !!tablaError[idx]
                                      ?.sup_prod_residuo_digital_blanco
                                  }
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
