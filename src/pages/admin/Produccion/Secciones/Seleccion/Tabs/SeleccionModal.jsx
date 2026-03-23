import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

import { DatosEmbalaje } from '@schema/Produccion/Seccion/SeleccionEmbalaje';
import { extractArrayFieldErrors } from '@helpers/normalze.helpers';

import InputField from '@components/InputField';
import Select from '@components/Select';

import { getObjs as getTurnos } from '@service/Produccion/Turno.services';
import { getIdFormatoLinea } from '@service/Produccion/Secciones/Formato.services';
import { getObjsUnidos as getLineas } from '@service/Produccion/Secciones/Lineas.services';

const NuevaFilaTabla = () => ({
  hora: '',
  tipo_concepto: '',
  a1: '',
  a2: '',
  a3: '',
  b1: '',
  b2: '',
  b3: '',
  c1: '',
  c2: '',
  c3: '',
  d1: '',
  d2: '',
  d3: '',
  cajas_segunda: '',
  defecto_segundaN1: '',
  defecto_segundaN2: '',
  defecto_segundaN3: '',
  defecto_segundaN4: '',
  defecto_segundaN5: '',
  defecto_segundaN6: '',
  defecto_segundaN7: '',
  defecto_segundaN8: '',
  defecto_segundaN9: '',
  defecto_segundaN10: '',
  cajas_tercera: '',
  defecto_terceraN1: '',
  defecto_terceraN2: '',
  defecto_terceraN3: '',
  defecto_terceraN4: '',
  defecto_terceraN5: '',
  defecto_terceraN6: '',
  defecto_terceraN7: '',
  cajas_casco: '',
  defecto_cascoN1: '',
  defecto_cascoN2: '',
  defecto_cascoN3: '',
  defecto_cascoN4: '',
  espacio_min: '',
});

const MAX_ROWS = 8;

const initialForm = {
  fecha: '',
  operador: '',
  supervisor_turno: '',
  producto: '',
  horno: '',
  grupo: '',
  segunda_defectoN1: '',
  segunda_defectoN2: '',
  segunda_defectoN3: '',
  segunda_defectoN4: '',
  segunda_defectoN5: '',
  segunda_defectoN6: '',
  segunda_defectoN7: '',
  segunda_defectoN8: '',
  segunda_defectoN9: '',
  segunda_defectoN10: '',
  tercera_defectoN1: '',
  tercera_defectoN2: '',
  tercera_defectoN3: '',
  tercera_defectoN4: '',
  tercera_defectoN5: '',
  tercera_defectoN6: '',
  tercera_defectoN7: '',
  casco_defectoN1: '',
  casco_defectoN2: '',
  casco_defectoN3: '',
  casco_defectoN4: '',
  observacion_embalaje: [],
  tabla_seleccion_embalaje: [],
};

export default function SeleccionModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
  mode = 'view', // view | edit
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

  const [lineaId, setLineaId] = useState('');
  const [lineaError, setLineaError] = useState('');

  const [formatoError, setFormatoError] = useState('');
  const [formatoId, setFormatoId] = useState('');

  const [tab, setTab] = useState('general');

  const title = useMemo(() => {
    if (isView) return 'Detalle de Selección / Embalaje';
    return id
      ? 'Editar registro de Selección / Embalaje'
      : 'Nuevo registro de Selección / Embalaje';
  }, [id, isView]);

  const getDatosFormatos = useCallback(() => {
    if (!lineaId) return Promise.resolve({ ok: true, data: [] });
    return getIdFormatoLinea(lineaId);
  }, [lineaId]);

  useEffect(() => {
    if (!open) return;

    if (!id) {
      setForm(initialForm);
      setTurnoId('');
      setLineaId('');
      setFormatoId('');
      setError({});
      setTablaError([]);
      setTurnoError('');
      setLineaError('');
      setFormatoError('');
      setObsInput('');
      setTab('general');
      return;
    }

    let active = true;
    setLoading(true);
    setTab('general');

    (async () => {
      try {
        const resp = await fetchById?.(id);
        if (!active) return;

        if (!resp?.ok) {
          toast.error(resp?.message || 'No se pudo cargar el registro');
          return;
        }

        const datos = resp?.dato ?? {};

        setForm({
          ...initialForm,
          ...datos,
          observacion_embalaje: Array.isArray(datos?.observacion_embalaje)
            ? datos.observacion_embalaje
            : [],
          tabla_seleccion_embalaje: Array.isArray(
            datos?.tabla_seleccion_embalaje,
          )
            ? datos.tabla_seleccion_embalaje
            : [],
        });

        setTurnoId(datos?.turno_id ?? '');
        setLineaId(datos?.linea_id ?? '');
        setFormatoId(datos?.formato_id ?? '');

        setError({});
        setTablaError([]);
        setTurnoError('');
        setLineaError('');
        setFormatoError('');
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

  const tablaRows = useMemo(
    () =>
      Array.isArray(form?.tabla_seleccion_embalaje)
        ? form.tabla_seleccion_embalaje
        : [],
    [form?.tabla_seleccion_embalaje],
  );

  const addObs = () => {
    if (isView) return;
    const v = String(obsInput ?? '').trim();
    if (!v) return;

    setForm((f) => ({
      ...f,
      observacion_embalaje: [
        ...(f.observacion_embalaje ?? []),
        { observacion: v },
      ],
    }));
    setObsInput('');
  };

  const removeObs = (index) => {
    if (isView) return;
    setForm((f) => ({
      ...f,
      observacion_embalaje: (f.observacion_embalaje ?? []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const updateBase = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const setCargaTabla = (idx, field, value) => {
    if (isView) return;

    setForm((f) => {
      const rows = Array.isArray(f?.tabla_seleccion_embalaje)
        ? [...f.tabla_seleccion_embalaje]
        : [];
      if (idx < 0 || idx >= rows.length) return f;
      rows[idx] = { ...(rows[idx] ?? {}), [field]: value };
      return { ...f, tabla_seleccion_embalaje: rows };
    });

    setTablaError((prev) => {
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
      const current = Array.isArray(f?.tabla_seleccion_embalaje)
        ? f.tabla_seleccion_embalaje
        : [];
      if (current.length >= MAX_ROWS)
        return { ...f, tabla_seleccion_embalaje: current };
      return {
        ...f,
        tabla_seleccion_embalaje: [...current, NuevaFilaTabla()],
      };
    });
  };

  const removeRows = () => {
    if (isView) return;
    setForm((f) => {
      const current = Array.isArray(f?.tabla_seleccion_embalaje)
        ? f.tabla_seleccion_embalaje
        : [];
      if (!current.length) return { ...f, tabla_seleccion_embalaje: current };
      return {
        ...f,
        tabla_seleccion_embalaje: current.slice(0, -1),
      };
    });
  };

  const handleValidation = async () => {
    if (isView) return;

    setLineaError(!lineaId ? 'Selecciona una línea' : '');
    setFormatoError(!formatoId ? 'Selecciona un formato' : '');
    setTurnoError(!turnoId ? 'Selecciona un turno' : '');

    if (!lineaId || !formatoId || !turnoId) {
      toast.error('Completa los campos requeridos');
      return;
    }

    const result = DatosEmbalaje.safeParse(form);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      const tablaErrors = extractArrayFieldErrors(
        result.error,
        'tabla_seleccion_embalaje',
      );

      setTablaError(tablaErrors);
      setError(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }

    const payload = {
      turno_id: turnoId,
      linea_id: lineaId,
      formato_id: formatoId,
      ...result.data,
    };

    onSave?.(payload);
  };

  if (!open) return null;

  const dataFields = [
    'a1',
    'a2',
    'a3',
    'b1',
    'b2',
    'b3',
    'c1',
    'c2',
    'c3',
    'd1',
    'd2',
    'd3',
    'cajas_segunda',
    'defecto_segundaN1',
    'defecto_segundaN2',
    'defecto_segundaN3',
    'defecto_segundaN4',
    'defecto_segundaN5',
    'defecto_segundaN6',
    'defecto_segundaN7',
    'defecto_segundaN8',
    'defecto_segundaN9',
    'defecto_segundaN10',
    'cajas_tercera',
    'defecto_terceraN1',
    'defecto_terceraN2',
    'defecto_terceraN3',
    'defecto_terceraN4',
    'defecto_terceraN5',
    'defecto_terceraN6',
    'defecto_terceraN7',
    'cajas_casco',
    'defecto_cascoN1',
    'defecto_cascoN2',
    'defecto_cascoN3',
    'defecto_cascoN4',
    'espacio_min',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        onClick={loading ? undefined : onClose}
        className="absolute inset-0"
      />

      <div className="relative z-10 w-[96%] max-w-[96vw] overflow-hidden rounded-2xl border border-slate-700 bg-white shadow-2xl max-h-[calc(100vh-2rem)]">
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
                  Tabla selección
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
                          error={error?.fecha}
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
                          getDatos={getTurnos}
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
                          error={error?.operador}
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
                          error={error?.supervisor_turno}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-6">
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
                          error={error?.producto}
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
                            setFormatoId('');
                            setFormatoError('');
                          }}
                          placeholder="Selecciona una línea"
                          getDatos={getLineas}
                          error={lineaError}
                        />
                      )}
                    </div>

                    <div className="lg:col-span-3">
                      <FieldShell
                        label="Horno"
                        value={form?.horno}
                        isView={isView}
                      >
                        <InputField
                          label="Horno"
                          type="text"
                          name="horno"
                          value={form?.horno || ''}
                          onChange={updateBase}
                          error={error?.horno}
                        />
                      </FieldShell>
                    </div>

                    <div className="lg:col-span-3">
                      {isView ? (
                        <ReadOnlyBox label="Formato" value={formatoId || '-'} />
                      ) : (
                        <Select
                          label="Formato"
                          value={formatoId}
                          onChange={(v) => {
                            setFormatoId(v);
                            setFormatoError('');
                          }}
                          placeholder="Selecciona un formato"
                          getDatos={getDatosFormatos}
                          error={formatoError}
                          disabled={!lineaId}
                        />
                      )}
                    </div>

                    <div className="lg:col-span-6">
                      <FieldShell
                        label="Grupo"
                        value={form?.grupo}
                        isView={isView}
                      >
                        <InputField
                          label="Grupo"
                          type="text"
                          name="grupo"
                          value={form?.grupo || ''}
                          onChange={updateBase}
                          error={error?.grupo}
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
                        className="mt-auto inline-flex h-[42px] items-center justify-center rounded-xl bg-emerald-700 px-4 text-white hover:bg-emerald-800"
                        onClick={addObs}
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
                    {(form?.observacion_embalaje ?? []).length === 0 ? (
                      <p className="text-sm text-slate-500">
                        No hay observaciones registradas.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {(form?.observacion_embalaje ?? []).map((item, idx) => (
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
                      Tabla de selección / embalaje
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

                  <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 bg-white">
                    <table className="text-sm">
                      <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
                        <tr className="border border-slate-300">
                          <th
                            className="sticky left-0 z-20 px-10 py-3 text-center border border-slate-300 bg-white"
                            rowSpan={2}
                          >
                            HORA
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={13}
                          >
                            PRIMERA (CAJA) TONO - CALIBRE
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            SEGUNDA
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={10}
                          >
                            DEFECTOS (PIEZAS)
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            TERCERA
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={7}
                          >
                            DEFECTOS (PIEZAS)
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            CASCO
                          </th>
                          <th
                            className="px-10 py-3 text-center border-r border-slate-300"
                            colSpan={4}
                          >
                            DEFECTOS (PIEZAS)
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            ESPACIO
                          </th>
                        </tr>

                        <tr className="border border-slate-300">
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            TIPO
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            A1
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            A2
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            A3
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            B1
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            B2
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            B3
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            C1
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            C2
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            C3
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            D1
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            D2
                          </th>
                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            D3
                          </th>

                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            CAJAS
                          </th>

                          <HeaderCell
                            isView={isView}
                            value={form?.segunda_defectoN1}
                          >
                            <InputField
                              type="number"
                              name="segunda_defectoN1"
                              value={form?.segunda_defectoN1 || ''}
                              onChange={updateBase}
                              error={error?.segunda_defectoN1}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.segunda_defectoN2}
                          >
                            <InputField
                              type="number"
                              name="segunda_defectoN2"
                              value={form?.segunda_defectoN2 || ''}
                              onChange={updateBase}
                              error={error?.segunda_defectoN2}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.segunda_defectoN3}
                          >
                            <InputField
                              type="number"
                              name="segunda_defectoN3"
                              value={form?.segunda_defectoN3 || ''}
                              onChange={updateBase}
                              error={error?.segunda_defectoN3}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.segunda_defectoN4}
                          >
                            <InputField
                              type="number"
                              name="segunda_defectoN4"
                              value={form?.segunda_defectoN4 || ''}
                              onChange={updateBase}
                              error={error?.segunda_defectoN4}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.segunda_defectoN5}
                          >
                            <InputField
                              type="number"
                              name="segunda_defectoN5"
                              value={form?.segunda_defectoN5 || ''}
                              onChange={updateBase}
                              error={error?.segunda_defectoN5}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.segunda_defectoN6}
                          >
                            <InputField
                              type="number"
                              name="segunda_defectoN6"
                              value={form?.segunda_defectoN6 || ''}
                              onChange={updateBase}
                              error={error?.segunda_defectoN6}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.segunda_defectoN7}
                          >
                            <InputField
                              type="number"
                              name="segunda_defectoN7"
                              value={form?.segunda_defectoN7 || ''}
                              onChange={updateBase}
                              error={error?.segunda_defectoN7}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.segunda_defectoN8}
                          >
                            <InputField
                              type="number"
                              name="segunda_defectoN8"
                              value={form?.segunda_defectoN8 || ''}
                              onChange={updateBase}
                              error={error?.segunda_defectoN8}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.segunda_defectoN9}
                          >
                            <InputField
                              type="number"
                              name="segunda_defectoN9"
                              value={form?.segunda_defectoN9 || ''}
                              onChange={updateBase}
                              error={error?.segunda_defectoN9}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.segunda_defectoN10}
                          >
                            <InputField
                              type="number"
                              name="segunda_defectoN10"
                              value={form?.segunda_defectoN10 || ''}
                              onChange={updateBase}
                              error={error?.segunda_defectoN10}
                            />
                          </HeaderCell>

                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            CAJAS
                          </th>

                          <HeaderCell
                            isView={isView}
                            value={form?.tercera_defectoN1}
                          >
                            <InputField
                              type="number"
                              name="tercera_defectoN1"
                              value={form?.tercera_defectoN1 || ''}
                              onChange={updateBase}
                              error={error?.tercera_defectoN1}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.tercera_defectoN2}
                          >
                            <InputField
                              type="number"
                              name="tercera_defectoN2"
                              value={form?.tercera_defectoN2 || ''}
                              onChange={updateBase}
                              error={error?.tercera_defectoN2}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.tercera_defectoN3}
                          >
                            <InputField
                              type="number"
                              name="tercera_defectoN3"
                              value={form?.tercera_defectoN3 || ''}
                              onChange={updateBase}
                              error={error?.tercera_defectoN3}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.tercera_defectoN4}
                          >
                            <InputField
                              type="number"
                              name="tercera_defectoN4"
                              value={form?.tercera_defectoN4 || ''}
                              onChange={updateBase}
                              error={error?.tercera_defectoN4}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.tercera_defectoN5}
                          >
                            <InputField
                              type="number"
                              name="tercera_defectoN5"
                              value={form?.tercera_defectoN5 || ''}
                              onChange={updateBase}
                              error={error?.tercera_defectoN5}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.tercera_defectoN6}
                          >
                            <InputField
                              type="number"
                              name="tercera_defectoN6"
                              value={form?.tercera_defectoN6 || ''}
                              onChange={updateBase}
                              error={error?.tercera_defectoN6}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.tercera_defectoN7}
                          >
                            <InputField
                              type="number"
                              name="tercera_defectoN7"
                              value={form?.tercera_defectoN7 || ''}
                              onChange={updateBase}
                              error={error?.tercera_defectoN7}
                            />
                          </HeaderCell>

                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            CAJAS
                          </th>

                          <HeaderCell
                            isView={isView}
                            value={form?.casco_defectoN1}
                          >
                            <InputField
                              type="number"
                              name="casco_defectoN1"
                              value={form?.casco_defectoN1 || ''}
                              onChange={updateBase}
                              error={error?.casco_defectoN1}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.casco_defectoN2}
                          >
                            <InputField
                              type="number"
                              name="casco_defectoN2"
                              value={form?.casco_defectoN2 || ''}
                              onChange={updateBase}
                              error={error?.casco_defectoN2}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.casco_defectoN3}
                          >
                            <InputField
                              type="number"
                              name="casco_defectoN3"
                              value={form?.casco_defectoN3 || ''}
                              onChange={updateBase}
                              error={error?.casco_defectoN3}
                            />
                          </HeaderCell>
                          <HeaderCell
                            isView={isView}
                            value={form?.casco_defectoN4}
                          >
                            <InputField
                              type="number"
                              name="casco_defectoN4"
                              value={form?.casco_defectoN4 || ''}
                              onChange={updateBase}
                              error={error?.casco_defectoN4}
                            />
                          </HeaderCell>

                          <th className="px-10 py-3 text-center border-r border-slate-300">
                            (Min.)
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {tablaRows.map((row, idx) => (
                          <tr key={idx} className="border border-slate-300 p-3">
                            <td className="sticky left-0 z-20 p-2 border-r border-slate-300 bg-white">
                              {isView ? (
                                <TableReadOnly value={row?.hora} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="time"
                                  name="hora"
                                  value={row?.hora ?? ''}
                                  onChange={(e) =>
                                    setCargaTabla(idx, 'hora', e.target.value)
                                  }
                                  error={!!tablaError?.[idx]?.hora}
                                />
                              )}
                            </td>

                            <td className="p-2 border-r border-slate-300">
                              {isView ? (
                                <TableReadOnly value={row?.tipo_concepto} />
                              ) : (
                                <InputField
                                  errorMode="border"
                                  type="text"
                                  name="tipo_concepto"
                                  value={row?.tipo_concepto ?? ''}
                                  onChange={(e) =>
                                    setCargaTabla(
                                      idx,
                                      'tipo_concepto',
                                      e.target.value,
                                    )
                                  }
                                  error={!!tablaError?.[idx]?.tipo_concepto}
                                />
                              )}
                            </td>

                            {dataFields.map((field) => (
                              <td
                                key={field}
                                className="p-2 border-r border-slate-300"
                              >
                                {isView ? (
                                  <TableReadOnly value={row?.[field]} />
                                ) : (
                                  <InputField
                                    errorMode="border"
                                    type="number"
                                    name={field}
                                    value={row?.[field] ?? ''}
                                    onChange={(e) =>
                                      setCargaTabla(idx, field, e.target.value)
                                    }
                                    error={!!tablaError?.[idx]?.[field]}
                                  />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}

                        {!tablaRows.length && (
                          <tr>
                            <td
                              className="px-4 py-4 text-slate-500"
                              colSpan={999}
                            >
                              No hay filas registradas.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
              <button
                type="button"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
                onClick={onClose}
              >
                {isView ? 'Cerrar' : 'Cancelar'}
              </button>

              {isEdit && (
                <button
                  type="button"
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

function HeaderCell({ isView, value, children }) {
  return (
    <th className="px-3 py-3 text-center border-r border-slate-300">
      {isView ? <TableReadOnly value={value} /> : children}
    </th>
  );
}
