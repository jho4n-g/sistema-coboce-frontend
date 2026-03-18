import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

// ✅ Estructura base para evitar undefined (esto arregla addRows/removeRows y muchos edge cases)
const initialForm = {
  fecha: '',
  operador: '',
  supervisor_turno: '',
  producto: '',
  horno: '',
  grupo: '',
  // campos de defectos del header (si existen en tu schema)
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

export default function SelecccionModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
}) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState({});
  const [tablaError, setTablaError] = useState([]);
  const [loading, setLoading] = useState(false);

  const [obsInput, setObsInput] = useState('');

  const [turnoError, setTurnoError] = useState('');
  const [turnoId, setTurnoId] = useState(null);

  const [lineaId, setLineaId] = useState(null);
  const [lineaError, setLineaError] = useState('');

  const [formatoError, setFormatoError] = useState('');
  const [formatoId, setFormatoId] = useState(null);

  // --------- Datos de Formato dependiente de línea ----------
  const getDatosFormatos = useCallback(() => {
    if (!lineaId) return Promise.resolve({ ok: true, data: [] });
    return getIdFormatoLinea(lineaId);
  }, [lineaId]);

  // --------- Cargar registro al abrir modal ----------
  useEffect(() => {
    if (!open) return;

    // Si es "nuevo" (sin id), resetea
    if (!id) {
      setForm(initialForm);
      setTurnoId(null);
      setLineaId(null);
      setFormatoId(null);
      setError({});
      setTablaError([]);
      setTurnoError('');
      setLineaError('');
      setFormatoError('');
      setObsInput('');
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const resp = await fetchById?.(id);
        if (!active) return;

        if (!resp?.ok) {
          toast.error(resp?.message || 'No se pudo cargar el registro');
          return;
        }

        const datos = resp?.dato ?? {};

        // ✅ Fusionar con base para evitar undefined
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

        setTurnoId(datos?.turno_id ?? null);
        setLineaId(datos?.linea_id ?? null);
        setFormatoId(datos?.formato_id ?? null);

        // limpia errores al cargar
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

  // --------- Helpers ----------
  const tablaRows = useMemo(
    () =>
      Array.isArray(form?.tabla_seleccion_embalaje)
        ? form.tabla_seleccion_embalaje
        : [],
    [form?.tabla_seleccion_embalaje],
  );

  const addObs = () => {
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
    setForm((f) => ({
      ...f,
      observacion_embalaje: (f.observacion_embalaje ?? []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const setCargaTabla = (idx, field, value) => {
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

  // --------- Validación y Guardado ----------
  const handleValidation = async () => {
    // selects
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

      // ✅ OJO: aquí estaba el bug en tu código: usabas 'datos_tabla_esmalte'
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        onClick={loading ? undefined : onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-10 w-[92%] max-w-9xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-white/75 backdrop-blur">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <p className="text-sm font-semibold text-slate-800">
                Procesando…
              </p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Selección Embalaje
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Cerrar"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Fecha"
                    type="date"
                    name="fecha"
                    value={form?.fecha || ''}
                    onChange={updateBase}
                    error={error?.fecha}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-3">
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
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Operador"
                    type="text"
                    name="operador"
                    value={form?.operador || ''}
                    onChange={updateBase}
                    error={error?.operador}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Supervisor de turno"
                    type="text"
                    name="supervisor_turno"
                    value={form?.supervisor_turno || ''}
                    onChange={updateBase}
                    error={error?.supervisor_turno}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Producto"
                    type="text"
                    name="producto"
                    value={form?.producto || ''}
                    onChange={updateBase}
                    error={error?.producto}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-3">
                  <Select
                    label="Línea"
                    value={lineaId}
                    onChange={(v) => {
                      setLineaId(v);
                      setLineaError('');
                      // ✅ cuando cambia línea, resetea formato
                      setFormatoId(null);
                      setFormatoError('');
                    }}
                    placeholder="Selecciona una línea"
                    getDatos={getLineas}
                    error={lineaError}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Horno"
                    type="text"
                    name="horno"
                    value={form?.horno || ''}
                    onChange={updateBase}
                    error={error?.horno}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-3">
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
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Grupo"
                    type="text"
                    name="grupo"
                    value={form?.grupo || ''}
                    onChange={updateBase}
                    error={error?.grupo}
                  />
                </div>

                {/* Observaciones */}
                <div className="md:col-span-2 lg:col-span-7">
                  <InputField
                    label="Observaciones"
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

                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form?.observacion_embalaje ?? []).map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200"
                      >
                        <span className="max-w-55 sm:max-w-[320px] truncate">
                          {item?.observacion}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeObs(idx)}
                          className="rounded-full p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                          aria-label="Eliminar observación"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 lg:col-span-1 flex md:justify-end lg:items-start lg:pt-6">
                  <button
                    type="button"
                    className="w-full md:w-auto rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900 inline-flex justify-center"
                    onClick={addObs}
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Botones filas */}
            <div className="flex justify-end py-5 px-10 gap-5">
              <button
                type="button"
                className="rounded-xl bg-white px-3 py-2 ring-1 ring-red-700 hover:bg-red-100"
                onClick={removeRows}
              >
                Eliminar fila
              </button>
              <button
                type="button"
                className="rounded-xl bg-white px-3 py-2 ring-1 ring-green-900 hover:bg-emerald-100"
                onClick={addRows}
              >
                Agregar fila
              </button>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 mx-5">
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

                    {/* Header defectos segunda */}
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN1"
                        value={form?.segunda_defectoN1 || ''}
                        onChange={updateBase}
                        error={error?.segunda_defectoN1}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN2"
                        value={form?.segunda_defectoN2 || ''}
                        onChange={updateBase}
                        error={error?.segunda_defectoN2}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN3"
                        value={form?.segunda_defectoN3 || ''}
                        onChange={updateBase}
                        error={error?.segunda_defectoN3}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN4"
                        value={form?.segunda_defectoN4 || ''}
                        onChange={updateBase}
                        error={error?.segunda_defectoN4}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN5"
                        value={form?.segunda_defectoN5 || ''}
                        onChange={updateBase}
                        error={error?.segunda_defectoN5}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN6"
                        value={form?.segunda_defectoN6 || ''}
                        onChange={updateBase}
                        error={error?.segunda_defectoN6}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN7"
                        value={form?.segunda_defectoN7 || ''}
                        onChange={updateBase}
                        error={error?.segunda_defectoN7}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN8"
                        value={form?.segunda_defectoN8 || ''}
                        onChange={updateBase}
                        error={error?.segunda_defectoN8}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN9"
                        value={form?.segunda_defectoN9 || ''}
                        onChange={updateBase}
                        error={error?.segunda_defectoN9}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN10"
                        value={form?.segunda_defectoN10 || ''}
                        onChange={updateBase}
                        error={error?.segunda_defectoN10}
                      />
                    </th>

                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      CAJAS
                    </th>

                    {/* Header defectos tercera */}
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN1"
                        value={form?.tercera_defectoN1 || ''}
                        onChange={updateBase}
                        error={error?.tercera_defectoN1}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN2"
                        value={form?.tercera_defectoN2 || ''}
                        onChange={updateBase}
                        error={error?.tercera_defectoN2}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN3"
                        value={form?.tercera_defectoN3 || ''}
                        onChange={updateBase}
                        error={error?.tercera_defectoN3}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN4"
                        value={form?.tercera_defectoN4 || ''}
                        onChange={updateBase}
                        error={error?.tercera_defectoN4}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN5"
                        value={form?.tercera_defectoN5 || ''}
                        onChange={updateBase}
                        error={error?.tercera_defectoN5}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN6"
                        value={form?.tercera_defectoN6 || ''}
                        onChange={updateBase}
                        error={error?.tercera_defectoN6}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN7"
                        value={form?.tercera_defectoN7 || ''}
                        onChange={updateBase}
                        error={error?.tercera_defectoN7}
                      />
                    </th>

                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      CAJAS
                    </th>

                    {/* Header defectos casco */}
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="casco_defectoN1"
                        value={form?.casco_defectoN1 || ''}
                        onChange={updateBase}
                        error={error?.casco_defectoN1}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="casco_defectoN2"
                        value={form?.casco_defectoN2 || ''}
                        onChange={updateBase}
                        error={error?.casco_defectoN2}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="casco_defectoN3"
                        value={form?.casco_defectoN3 || ''}
                        onChange={updateBase}
                        error={error?.casco_defectoN3}
                      />
                    </th>
                    <th className="px-3 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="casco_defectoN4"
                        value={form?.casco_defectoN4 || ''}
                        onChange={updateBase}
                        error={error?.casco_defectoN4}
                      />
                    </th>

                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      (Min.)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tablaRows.map((row, idx) => (
                    <tr key={idx} className="border border-slate-300 p-3">
                      <td className="sticky left-0 z-20 p-2 border-r border-slate-300 bg-white">
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
                      </td>

                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="text"
                          name="tipo_concepto"
                          value={row?.tipo_concepto ?? ''}
                          onChange={(e) =>
                            setCargaTabla(idx, 'tipo_concepto', e.target.value)
                          }
                          error={!!tablaError?.[idx]?.tipo_concepto}
                        />
                      </td>

                      {[
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
                      ].map((field) => (
                        <td
                          key={field}
                          className="p-2 border-r border-slate-300"
                        >
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
                        </td>
                      ))}
                    </tr>
                  ))}

                  {!tablaRows.length && (
                    <tr>
                      <td className="px-4 py-4 text-slate-500" colSpan={999}>
                        No hay filas. Presiona <b>Agregar fila</b>.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-5 gap-5">
              <button
                type="button"
                className="rounded-xl bg-red-600 px-3 py-2 text-white hover:bg-red-900"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
                onClick={handleValidation}
              >
                Guardar cambios
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
