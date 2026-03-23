import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

import { datosBarbotina } from '@schema/Produccion/Seccion/Barbotina.schema';
import { extractArrayFieldErrors } from '@helpers/normalze.helpers';
import InputField from '@components/InputField';
import Select from '@components/Select';
import { getObjs } from '@service/Produccion/Turno.services';

const MAX_ROWS = 15;

const NuevaFilaTabla = () => ({
  deflo_cargando_molinos: '',
  dens_descargando_molinos: '',
  h2o_cargando_molinos: '',
  hora_final: '',
  hora_inicio: '',
  n_fosa_descargando_molinos: '',
  n_molino_cargando_molinos: '',
  producto_descargando_molinos: '',
  reoma_cargando_molinos: '',
  res_descargando_molinos: '',
  tn_lugar_cuantro_cargando_molinos: '',
  tn_lugar_dos_cargando_molinos: '',
  tn_lugar_tres_cargando_molinos: '',
  tn_lugar_uno_cargando_molinos: '',
  visc_descargando_molinos: '',
});

const initialForm = {
  fecha: '',
  operador: '',
  supervisor_turno: '',
  equipo: '',
  horometro_inicio: '',
  horometro_final: '',
  nombre_lugar_uno_cargando_molinos: '',
  nombre_lugar_dos_cargando_molinos: '',
  nombre_lugar_tres_cargando_molinos: '',
  nombre_lugar_cuarto_cargando_molinos: '',
  humedad_lugar_uno_cargando_molinos: '',
  humedad_lugar_dos_cargando_molinos: '',
  humedad_lugar_tres_cargando_molinos: '',
  humedad_lugar_cuarto_cargando_molinos: '',
  deflo_proveerdo_cargando_molinos: '',
  ObservacionesBarbotinaDatos: [],
  TablaBarbotinaDatos: [],
};

export default function BarbotinaModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
  mode = 'view', // 'view' | 'edit'
}) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState({});
  const [tablaError, setTablaError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [obsInput, setObsInput] = useState('');
  const [turnoError, setTurnoError] = useState('');
  const [turnoId, setTurnoId] = useState('');
  const [tab, setTab] = useState('general');

  useEffect(() => {
    if (!open) return;

    let active = true;
    setLoading(true);
    setError({});
    setTablaError([]);
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
              ...initialForm,
              ...dato,
              ObservacionesBarbotinaDatos:
                dato?.ObservacionesBarbotinaDatos ?? [],
              TablaBarbotinaDatos: dato?.TablaBarbotinaDatos ?? [],
            });
            setTurnoId(dato?.turno_id ?? '');
          } else {
            toast.error(data?.message || 'No se pudo cargar el registro');
          }
        } else {
          setForm({
            ...initialForm,
            TablaBarbotinaDatos: [NuevaFilaTabla()],
          });
          setTurnoId('');
        }
      } catch (e) {
        if (active) {
          toast.error(e?.message || 'Error del servidor');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, id, fetchById]);

  const title = useMemo(() => {
    if (isView) return 'Detalle de Barbotina';
    return id ? 'Editar registro de Barbotina' : 'Nuevo registro de Barbotina';
  }, [isView, id]);

  if (!open) return null;

  const updateBase = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const setCargaTabla = (idx, field, value) => {
    if (isView) return;

    setForm((f) => {
      const rows = Array.isArray(f?.TablaBarbotinaDatos)
        ? [...f.TablaBarbotinaDatos]
        : [];
      if (idx < 0 || idx >= rows.length) return f;
      rows[idx] = { ...(rows[idx] ?? {}), [field]: value };
      return { ...f, TablaBarbotinaDatos: rows };
    });

    setTablaError((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      const rowErr = { ...(arr[idx] ?? {}) };
      delete rowErr[field];
      arr[idx] = Object.keys(rowErr).length ? rowErr : undefined;
      return arr;
    });
  };

  const addObs = () => {
    if (isView) return;
    const v = obsInput.trim();
    if (!v) return;

    setForm((f) => ({
      ...f,
      ObservacionesBarbotinaDatos: [
        ...(f.ObservacionesBarbotinaDatos ?? []),
        { observacion: v },
      ],
    }));
    setObsInput('');
  };

  const removeObs = (index) => {
    if (isView) return;
    setForm((f) => ({
      ...f,
      ObservacionesBarbotinaDatos: (f.ObservacionesBarbotinaDatos ?? []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const addRows = () => {
    if (isView) return;
    setForm((f) => {
      const current = f?.TablaBarbotinaDatos ?? [];
      if (current.length >= MAX_ROWS) return f;
      return {
        ...f,
        TablaBarbotinaDatos: [...current, NuevaFilaTabla()],
      };
    });
  };

  const removeRows = () => {
    if (isView) return;
    setForm((f) => {
      const current = f?.TablaBarbotinaDatos ?? [];
      if (!current.length) return f;
      return {
        ...f,
        TablaBarbotinaDatos: current.slice(0, -1),
      };
    });
  };

  const handleValidation = async () => {
    if (isView) return;

    if (!turnoId) {
      setTurnoError('Selecciona un turno');
      toast.error('Selecciona un turno');
      return;
    }

    setTurnoError('');

    const result = datosBarbotina.safeParse(form);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      const tablaErrors = extractArrayFieldErrors(
        result.error,
        'TablaBarbotinaDatos',
      );
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

        <div className="border-b border-slate-200 bg-linear-to-r from-emerald-900 via-emerald-800 to-emerald-700 px-6 py-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800/80 px-4 py-2 text-sm">
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
            <TabButton active={tab === 'tabla'} onClick={() => setTab('tabla')}>
              Tabla de molinos
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
                  <FieldShell label="Fecha" isView={isView} value={form?.fecha}>
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
                    isView={isView}
                    value={form?.operador}
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
                    isView={isView}
                    value={form?.supervisor_turno}
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

                <div className="lg:col-span-6">
                  <FieldShell
                    label="Equipo"
                    isView={isView}
                    value={form?.equipo}
                  >
                    <InputField
                      label="Equipo"
                      type="text"
                      name="equipo"
                      value={form?.equipo || ''}
                      onChange={updateBase}
                      error={error.equipo}
                    />
                  </FieldShell>
                </div>

                <div className="lg:col-span-6">
                  <FieldShell
                    label="Horómetro inicio"
                    isView={isView}
                    value={form?.horometro_inicio}
                  >
                    <InputField
                      label="Horometro inicio"
                      type="number"
                      name="horometro_inicio"
                      value={form?.horometro_inicio || ''}
                      onChange={updateBase}
                      error={error.horometro_inicio}
                    />
                  </FieldShell>
                </div>

                <div className="lg:col-span-6">
                  <FieldShell
                    label="Horómetro fin"
                    isView={isView}
                    value={form?.horometro_final}
                  >
                    <InputField
                      label="Horometro fin"
                      type="number"
                      name="horometro_final"
                      value={form?.horometro_final || ''}
                      onChange={updateBase}
                      error={error.horometro_final}
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
                    value={obsInput}
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
                    onClick={addObs}
                    className="mt-auto inline-flex h-10.5 items-center justify-center rounded-xl bg-emerald-700 px-4 text-white hover:bg-emerald-800"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              )}

              <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
                {(form?.ObservacionesBarbotinaDatos ?? []).length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No hay observaciones registradas.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {(form?.ObservacionesBarbotinaDatos ?? []).map(
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
                  Control de molinos
                </h3>

                {!isView && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-red-400 bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                      onClick={removeRows}
                    >
                      Eliminar fila
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-emerald-500 bg-emerald-700 px-3 py-2 text-sm text-white hover:bg-emerald-800"
                      onClick={addRows}
                    >
                      Agregar fila
                    </button>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white shadow-sm">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-700">
                    <tr className="border-b border-slate-300">
                      <th
                        className="border-r border-slate-300 px-4 py-3 text-center"
                        colSpan={8}
                      >
                        CARGANDO MOLINOS
                      </th>
                      <th className="px-4 py-3 text-center" colSpan={7}>
                        DESCARGANDO MOLINOS
                      </th>
                    </tr>

                    <tr className="border-b border-slate-300">
                      <th
                        className="border-r border-slate-300 px-3 py-3 text-center"
                        rowSpan={2}
                      >
                        MOLINO
                      </th>

                      <th
                        className="border-r border-slate-300 px-3 py-3 text-center"
                        rowSpan={2}
                      >
                        HORA INICIO
                      </th>

                      <th
                        className="border-r border-slate-300 px-3 py-3 text-center"
                        rowSpan={2}
                      >
                        HORA FIN
                      </th>

                      <th className="border-r border-slate-300 px-2 py-3 text-center min-w-[170px]">
                        {isView ? (
                          <HeaderReadOnly
                            label="Lugar uno"
                            value={form?.nombre_lugar_uno_cargando_molinos}
                          />
                        ) : (
                          <InputField
                            label="Lugar uno"
                            type="text"
                            name="nombre_lugar_uno_cargando_molinos"
                            value={
                              form?.nombre_lugar_uno_cargando_molinos || ''
                            }
                            onChange={updateBase}
                            error={error.nombre_lugar_uno_cargando_molinos}
                          />
                        )}
                      </th>

                      <th className="border-r border-slate-300 px-2 py-3 text-center min-w-[170px]">
                        {isView ? (
                          <HeaderReadOnly
                            label="Lugar dos"
                            value={form?.nombre_lugar_dos_cargando_molinos}
                          />
                        ) : (
                          <InputField
                            label="Lugar dos"
                            type="text"
                            name="nombre_lugar_dos_cargando_molinos"
                            value={
                              form?.nombre_lugar_dos_cargando_molinos || ''
                            }
                            onChange={updateBase}
                            error={error.nombre_lugar_dos_cargando_molinos}
                          />
                        )}
                      </th>

                      <th className="border-r border-slate-300 px-2 py-3 text-center min-w-[170px]">
                        {isView ? (
                          <HeaderReadOnly
                            label="Lugar tres"
                            value={form?.nombre_lugar_tres_cargando_molinos}
                          />
                        ) : (
                          <InputField
                            label="Lugar tres"
                            type="text"
                            name="nombre_lugar_tres_cargando_molinos"
                            value={
                              form?.nombre_lugar_tres_cargando_molinos || ''
                            }
                            onChange={updateBase}
                            error={error.nombre_lugar_tres_cargando_molinos}
                          />
                        )}
                      </th>

                      <th className="border-r border-slate-300 px-2 py-3 text-center min-w-[170px]">
                        {isView ? (
                          <HeaderReadOnly
                            label="Lugar cuatro"
                            value={form?.nombre_lugar_cuarto_cargando_molinos}
                          />
                        ) : (
                          <InputField
                            label="Lugar cuatro"
                            type="text"
                            name="nombre_lugar_cuarto_cargando_molinos"
                            value={
                              form?.nombre_lugar_cuarto_cargando_molinos || ''
                            }
                            onChange={updateBase}
                            error={error.nombre_lugar_cuarto_cargando_molinos}
                          />
                        )}
                      </th>

                      <th
                        className="border-r border-slate-300 px-3 py-3 text-center"
                        rowSpan={2}
                      >
                        H2O
                      </th>

                      <th className="border-r border-slate-300 px-2 py-3 text-center min-w-[190px]">
                        {isView ? (
                          <HeaderReadOnly
                            label="Proveedor"
                            value={form?.deflo_proveerdo_cargando_molinos}
                          />
                        ) : (
                          <InputField
                            label="Proveedor"
                            type="text"
                            name="deflo_proveerdo_cargando_molinos"
                            value={form?.deflo_proveerdo_cargando_molinos || ''}
                            onChange={updateBase}
                            error={error.deflo_proveerdo_cargando_molinos}
                          />
                        )}
                      </th>

                      <th
                        className="border-r border-slate-300 px-3 py-3 text-center"
                        rowSpan={2}
                      >
                        REOMA
                      </th>

                      <th
                        className="border-r border-slate-300 px-3 py-3 text-center"
                        rowSpan={2}
                      >
                        DENS
                      </th>

                      <th
                        className="border-r border-slate-300 px-3 py-3 text-center"
                        rowSpan={2}
                      >
                        VISC
                      </th>

                      <th
                        className="border-r border-slate-300 px-3 py-3 text-center"
                        rowSpan={2}
                      >
                        RES
                      </th>

                      <th
                        className="border-r border-slate-300 px-3 py-3 text-center"
                        rowSpan={2}
                      >
                        FOSA
                      </th>

                      <th className="px-3 py-3 text-center" rowSpan={3}>
                        PRODUCTO
                      </th>
                    </tr>

                    <tr className="border-b border-slate-300">
                      <th className="border-r border-slate-300 px-2 py-3 text-center min-w-[170px]">
                        {isView ? (
                          <HeaderReadOnly
                            label="Humedad uno"
                            value={form?.humedad_lugar_uno_cargando_molinos}
                          />
                        ) : (
                          <InputField
                            label="Humedad uno"
                            type="number"
                            name="humedad_lugar_uno_cargando_molinos"
                            value={
                              form?.humedad_lugar_uno_cargando_molinos || ''
                            }
                            onChange={updateBase}
                            error={error.humedad_lugar_uno_cargando_molinos}
                          />
                        )}
                      </th>

                      <th className="border-r border-slate-300 px-2 py-3 text-center min-w-[170px]">
                        {isView ? (
                          <HeaderReadOnly
                            label="Humedad dos"
                            value={form?.humedad_lugar_dos_cargando_molinos}
                          />
                        ) : (
                          <InputField
                            label="Humedad dos"
                            type="number"
                            name="humedad_lugar_dos_cargando_molinos"
                            value={
                              form?.humedad_lugar_dos_cargando_molinos || ''
                            }
                            onChange={updateBase}
                            error={error.humedad_lugar_dos_cargando_molinos}
                          />
                        )}
                      </th>

                      <th className="border-r border-slate-300 px-2 py-3 text-center min-w-[170px]">
                        {isView ? (
                          <HeaderReadOnly
                            label="Humedad tres"
                            value={form?.humedad_lugar_tres_cargando_molinos}
                          />
                        ) : (
                          <InputField
                            label="Humedad tres"
                            type="number"
                            name="humedad_lugar_tres_cargando_molinos"
                            value={
                              form?.humedad_lugar_tres_cargando_molinos || ''
                            }
                            onChange={updateBase}
                            error={error.humedad_lugar_tres_cargando_molinos}
                          />
                        )}
                      </th>

                      <th className="border-r border-slate-300 px-2 py-3 text-center min-w-[170px]">
                        {isView ? (
                          <HeaderReadOnly
                            label="Humedad cuatro"
                            value={form?.humedad_lugar_cuarto_cargando_molinos}
                          />
                        ) : (
                          <InputField
                            label="Humedad cuatro"
                            type="number"
                            name="humedad_lugar_cuarto_cargando_molinos"
                            value={
                              form?.humedad_lugar_cuarto_cargando_molinos || ''
                            }
                            onChange={updateBase}
                            error={error.humedad_lugar_cuarto_cargando_molinos}
                          />
                        )}
                      </th>

                      <th className="border-r border-slate-300 px-2 py-3 text-center">
                        DEFLO
                      </th>
                    </tr>

                    <tr className="border-b border-slate-300">
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        TN
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        TN
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        TN
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        TN
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        TN
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        LITROS
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        KG
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        KG
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        G/ML
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        S
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        %
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        N
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        %
                      </th>
                      <th className="border-r border-slate-300 px-3 py-3 text-center">
                        N
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {(form?.TablaBarbotinaDatos ?? []).length === 0 ? (
                      <tr>
                        <td
                          colSpan={15}
                          className="px-4 py-6 text-center text-slate-500"
                        >
                          No hay filas registradas.
                        </td>
                      </tr>
                    ) : (
                      (form?.TablaBarbotinaDatos ?? []).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <TableCell
                            isView={isView}
                            value={row.n_molino_cargando_molinos}
                          >
                            <InputField
                              errorMode="border"
                              type="number"
                              value={row.n_molino_cargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'n_molino_cargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={
                                !!tablaError[idx]?.n_molino_cargando_molinos
                              }
                            />
                          </TableCell>

                          <TableCell isView={isView} value={row.hora_inicio}>
                            <InputField
                              errorMode="border"
                              type="time"
                              value={row.hora_inicio}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'hora_inicio',
                                  e.target.value,
                                )
                              }
                              error={!!tablaError[idx]?.hora_inicio}
                            />
                          </TableCell>

                          <TableCell isView={isView} value={row.hora_final}>
                            <InputField
                              errorMode="border"
                              type="time"
                              value={row.hora_final}
                              onChange={(e) =>
                                setCargaTabla(idx, 'hora_final', e.target.value)
                              }
                              error={!!tablaError[idx]?.hora_final}
                            />
                          </TableCell>

                          <TableCell
                            isView={isView}
                            value={row.tn_lugar_uno_cargando_molinos}
                          >
                            <InputField
                              errorMode="border"
                              type="number"
                              value={row.tn_lugar_uno_cargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'tn_lugar_uno_cargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={
                                !!tablaError[idx]?.tn_lugar_uno_cargando_molinos
                              }
                            />
                          </TableCell>

                          <TableCell
                            isView={isView}
                            value={row.tn_lugar_dos_cargando_molinos}
                          >
                            <InputField
                              errorMode="border"
                              type="number"
                              value={row.tn_lugar_dos_cargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'tn_lugar_dos_cargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={
                                !!tablaError[idx]?.tn_lugar_dos_cargando_molinos
                              }
                            />
                          </TableCell>

                          <TableCell
                            isView={isView}
                            value={row.tn_lugar_tres_cargando_molinos}
                          >
                            <InputField
                              errorMode="border"
                              type="number"
                              value={row.tn_lugar_tres_cargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'tn_lugar_tres_cargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={
                                !!tablaError[idx]
                                  ?.tn_lugar_tres_cargando_molinos
                              }
                            />
                          </TableCell>

                          <TableCell
                            isView={isView}
                            value={row.tn_lugar_cuantro_cargando_molinos}
                          >
                            <InputField
                              errorMode="border"
                              type="number"
                              value={row.tn_lugar_cuantro_cargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'tn_lugar_cuantro_cargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={
                                !!tablaError[idx]
                                  ?.tn_lugar_cuantro_cargando_molinos
                              }
                            />
                          </TableCell>

                          <TableCell
                            isView={isView}
                            value={row.h2o_cargando_molinos}
                          >
                            <InputField
                              errorMode="border"
                              type="number"
                              value={row.h2o_cargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'h2o_cargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={!!tablaError[idx]?.h2o_cargando_molinos}
                            />
                          </TableCell>

                          <TableCell
                            isView={isView}
                            value={row.deflo_cargando_molinos}
                          >
                            <InputField
                              errorMode="border"
                              type="number"
                              value={row.deflo_cargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'deflo_cargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={!!tablaError[idx]?.deflo_cargando_molinos}
                            />
                          </TableCell>

                          <TableCell
                            isView={isView}
                            value={row.reoma_cargando_molinos}
                          >
                            <InputField
                              errorMode="border"
                              type="number"
                              value={row.reoma_cargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'reoma_cargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={!!tablaError[idx]?.reoma_cargando_molinos}
                            />
                          </TableCell>

                          <TableCell
                            isView={isView}
                            value={row.dens_descargando_molinos}
                          >
                            <InputField
                              errorMode="border"
                              type="number"
                              value={row.dens_descargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'dens_descargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={
                                !!tablaError[idx]?.dens_descargando_molinos
                              }
                            />
                          </TableCell>

                          <TableCell
                            isView={isView}
                            value={row.visc_descargando_molinos}
                          >
                            <InputField
                              errorMode="border"
                              type="number"
                              value={row.visc_descargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'visc_descargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={
                                !!tablaError[idx]?.visc_descargando_molinos
                              }
                            />
                          </TableCell>

                          <TableCell
                            isView={isView}
                            value={row.res_descargando_molinos}
                          >
                            <InputField
                              errorMode="border"
                              type="number"
                              value={row.res_descargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'res_descargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={!!tablaError[idx]?.res_descargando_molinos}
                            />
                          </TableCell>

                          <TableCell
                            isView={isView}
                            value={row.n_fosa_descargando_molinos}
                          >
                            <InputField
                              errorMode="border"
                              type="text"
                              value={row.n_fosa_descargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'n_fosa_descargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={
                                !!tablaError[idx]?.n_fosa_descargando_molinos
                              }
                            />
                          </TableCell>

                          <TableCell
                            isView={isView}
                            value={row.producto_descargando_molinos}
                            last
                          >
                            <InputField
                              errorMode="border"
                              type="text"
                              value={row.producto_descargando_molinos}
                              onChange={(e) =>
                                setCargaTabla(
                                  idx,
                                  'producto_descargando_molinos',
                                  e.target.value,
                                )
                              }
                              error={
                                !!tablaError[idx]?.producto_descargando_molinos
                              }
                            />
                          </TableCell>
                        </tr>
                      ))
                    )}
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
              className="rounded-xl bg-emerald-800 px-4 py-2 font-medium text-white hover:bg-emerald-800"
              onClick={handleValidation}
            >
              Guardar cambios
            </button>
          )}
        </div>
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
          ? 'bg-emerald-900 text-white shadow'
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
      <div className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2.5 text-sm text-slate-800">
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

function TableCell({ isView, value, children, last = false }) {
  if (isView) {
    return (
      <td
        className={`border-r border-slate-200 px-3 py-3 text-center text-slate-700 ${last ? 'border-r-0' : ''}`}
      >
        {value || '-'}
      </td>
    );
  }

  return (
    <td className={`border-r border-slate-200 p-2 ${last ? 'border-r-0' : ''}`}>
      {children}
    </td>
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
