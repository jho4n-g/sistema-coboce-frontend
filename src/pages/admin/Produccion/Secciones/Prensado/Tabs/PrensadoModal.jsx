import { useState, useEffect } from 'react';
import { datosPrensadoSecado } from '@schema/Produccion/Seccion/Prensado.schema';
import { extractArrayFieldErrors } from '@helpers/normalze.helpers';
import InputField from '@components/InputField';
import { toast } from 'react-toastify';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
//
import { getObjs } from '@service/Produccion/Turno.services';
import { getObjsUnidos as getLineas } from '@service/Produccion/Secciones/Lineas.services';
import Select from '@components/Select';

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

export default function BarbotinaModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
}) {
  const [form, setForm] = useState();
  const [error, setError] = useState({});
  const [tablaError, setTablaError] = useState({});
  const [tablaSiloError, setTablaSiloError] = useState({});
  const [loading, setLoading] = useState(false);
  const [obsInput, setObsInput] = useState('');

  const [turnoError, setTurnoError] = useState(null);
  const [turnoId, setTurnoId] = useState(null);

  const [lineaId, setLineaId] = useState(null);
  const [lineaError, setLineaError] = useState('');

  useEffect(() => {
    if (!open || !id) return; // evita correr si no aplica

    let active = true; // evita setState tras unmount
    setLoading(true);

    (async () => {
      try {
        const data = await fetchById(id); // ← ahora sí esperamos aquí

        if (!active) return;
        // console.log('atimizado', data);
        if (data?.ok) {
          setForm(data.dato ?? {});
          setTurnoId(data?.dato?.turno_id ?? '');
          setLineaId(data?.linea_id ?? '');
        } else toast.error(data?.message || 'No se pudo cargar el registro');
      } catch (e) {
        if (active) toast.error(e?.message || 'Error del servidor');
      } finally {
        if (active) setLoading(false); // ← se apaga al terminar de verdadfi
      }
    })();

    return () => {
      active = false;
    };
  }, [open, id, fetchById]);

  if (!open) return null;

  const addObs = () => {
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
    setForm((f) => ({
      ...f,
      observaciones_prensado_secado: f.observaciones_prensado_secado.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const setCargaTablaSilo = (idx, field, value) => {
    setForm((f) => {
      const rows = Array.isArray(f?.tabla_silos_usado)
        ? [...f.tabla_silos_usado]
        : [];
      if (idx < 0 || idx >= rows.length) return f; // evita índices fuera de rango
      rows[idx] = { ...(rows[idx] ?? {}), [field]: value };
      return { ...f, tabla_silos_usado: rows };
    });

    // Usa el setter real de errores (p.ej., setTablaError)
    setTablaSiloError?.((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      const rowErr = { ...(arr[idx] ?? {}) };
      delete rowErr[field];
      arr[idx] = rowErr;

      // Opcional: limpia la fila si ya no tiene errores
      if (Object.keys(rowErr).length === 0) arr[idx] = undefined;

      return arr;
    });
  };

  const addRowsSilo = () => {
    setForm((f) => {
      const tabla = Array.isArray(f.tabla_silos_usado)
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
    setForm((f) => {
      if (f.tabla_silos_usado.length <= 0) return f;
      return {
        ...f,
        tabla_silos_usado: f.tabla_silos_usado.slice(0, -1),
      };
    });
  };

  const setCargaTabla = (idx, field, value) => {
    setForm((f) => {
      const rows = Array.isArray(f?.tabla_prensado_secado)
        ? [...f.tabla_prensado_secado]
        : [];
      if (idx < 0 || idx >= rows.length) return f; // evita índices fuera de rango
      rows[idx] = { ...(rows[idx] ?? {}), [field]: value };
      return { ...f, tabla_prensado_secado: rows };
    });

    // Usa el setter real de errores (p.ej., setTablaError)
    setTablaError?.((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      const rowErr = { ...(arr[idx] ?? {}) };
      delete rowErr[field];
      arr[idx] = rowErr;

      // Opcional: limpia la fila si ya no tiene errores
      if (Object.keys(rowErr).length === 0) arr[idx] = undefined;

      return arr;
    });
  };

  const addRows = () => {
    setForm((f) => {
      if (f.tabla_prensado_secado.length >= rows) return f;
      return {
        ...f,
        tabla_prensado_secado: [...f.tabla_prensado_secado, NuevaFilaTabla()],
      };
    });
  };

  const removeRows = () => {
    setForm((f) => {
      if (f.tabla_prensado_secado.length <= 0) return f;
      return {
        ...f,
        tabla_prensado_secado: f.tabla_prensado_secado.slice(0, -1),
      };
    });
  };
  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };
  const handleValidation = async () => {
    if (!turnoId) {
      setTurnoError('Selecciona un turno');
    } else {
      setTurnoError('');
    }
    if (!lineaId) {
      setTurnoError('Selecciona un turno');
    } else {
      setTurnoError('');
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
    } else {
      const data = { turno_id: turnoId, linea_id: lineaId, ...result.data };
      handleSave(data);
    }
  };
  const handleSave = (payload) => {
    onSave(payload);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay (fondo) */}
      <div
        onClick={loading ? undefined : onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        className="relative z-10 w-[92%] max-w-7xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
                max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        {loading && (
          <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-white/75 backdrop-blur">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <p className="text-sm font-semibold text-slate-800">
                Cargando datos…
              </p>
            </div>
          </div>
        )}
        {!loading && (
          <>
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Prensado Modal
              </h3>
            </div>
            <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                {/* Fila 1 */}
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Fecha"
                    type="date"
                    name="fecha"
                    value={form?.fecha || ''}
                    onChange={updateBase}
                    error={error.fecha}
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
                    getDatos={getObjs}
                    error={turnoError}
                  />
                </div>

                {/* Fila 2 */}
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Operador"
                    type="text"
                    name="operador"
                    value={form?.operador || ''}
                    onChange={updateBase}
                    error={error.operador}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Supervisor de turno"
                    type="text"
                    name="supervisor_turno"
                    value={form?.supervisor_turno || ''}
                    onChange={updateBase}
                    error={error.supervisor_turno}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
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
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="N° prensa"
                    type="number"
                    name="n_prensa"
                    value={form?.n_prensa || ''}
                    onChange={updateBase}
                    error={error.n_prensa}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Formato"
                    type="text"
                    name="formato"
                    value={form?.formato || ''}
                    onChange={updateBase}
                    error={error.formato}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Producto"
                    type="text"
                    name="producto"
                    value={form?.producto || ''}
                    onChange={updateBase}
                    error={error.producto}
                  />
                </div>

                {/* Observaciones + botón */}
                <div className="md:col-span-2 lg:col-span-6">
                  <InputField
                    label="Observaciones"
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

                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form?.observaciones_prensado_secado ?? []).map(
                      (item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200"
                        >
                          <span className="max-w-55 sm:max-w-[320px] truncate">
                            {item.observacion}
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
                      ),
                    )}
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
            <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Presion especifica"
                    type="number"
                    name="presion_especifica"
                    value={form?.presion_especifica || ''}
                    onChange={updateBase}
                    error={error.presion_especifica}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Golpes inicial"
                    type="number"
                    name="golpes_inicial"
                    value={form?.golpes_inicial || ''}
                    onChange={updateBase}
                    error={error.golpes_inicial}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Golpes final"
                    type="number"
                    name="golpes_final"
                    value={form?.golpes_final || ''}
                    onChange={updateBase}
                    error={error.golpes_final}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Total golpes"
                    type="number"
                    name="total_golpes"
                    value={form?.total_golpes || ''}
                    onChange={updateBase}
                    error={error.total_golpes}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end py-5 px-10 gap-5 ">
              <button
                className="  rounded-xl bg-white px-3 py-2 text-reen-900 ring-1 ring-red-700 hover:bg-red-100"
                onClick={removeRows}
              >
                Eliminar fila
              </button>
              <button
                className="  rounded-xl bg-white px-3 py-2 text-reen-900 ring-1 ring-green-900 hover:bg-emerald-100"
                onClick={addRows}
              >
                Agregar fila
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 px-5">
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
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="hum_polvo"
                          value={row.hum_polvo}
                          onChange={(e) => {
                            setCargaTabla(idx, 'hum_polvo', e.target.value);
                          }}
                          error={!!tablaError[idx]?.hum_polvo}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                          error={!!tablaError[idx]?.espesor_molde_tres_a}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                          error={!!tablaError[idx]?.espesor_molde_tres_b}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                          error={!!tablaError[idx]?.espesor_molde_cuatro_a}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                          error={!!tablaError[idx]?.espesor_molde_cuatro_b}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                          error={!!tablaError[idx]?.espesor_molde_cinco_a}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                          error={!!tablaError[idx]?.espesor_molde_cinco_b}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                          error={!!tablaError[idx]?.espesor_molde_seis_a}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                          error={!!tablaError[idx]?.espesor_molde_seis_b}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                          error={!!tablaError[idx]?.espesor_molde_siete_a}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                          error={!!tablaError[idx]?.espesor_molde_siete_b}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="mallas_35"
                          value={row.mallas_35}
                          onChange={(e) => {
                            setCargaTabla(idx, 'mallas_35', e.target.value);
                          }}
                          error={!!tablaError[idx]?.mallas_35}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="mallas_40"
                          value={row.mallas_40}
                          onChange={(e) => {
                            setCargaTabla(idx, 'mallas_40', e.target.value);
                          }}
                          error={!!tablaError[idx]?.mallas_40}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="mallas_50"
                          value={row.mallas_50}
                          onChange={(e) => {
                            setCargaTabla(idx, 'mallas_50', e.target.value);
                          }}
                          error={!!tablaError[idx]?.mallas_50}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="mallas_70"
                          value={row.mallas_70}
                          onChange={(e) => {
                            setCargaTabla(idx, 'mallas_70', e.target.value);
                          }}
                          error={!!tablaError[idx]?.mallas_70}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="mallas_100"
                          value={row.mallas_100}
                          onChange={(e) => {
                            setCargaTabla(idx, 'mallas_100', e.target.value);
                          }}
                          error={!!tablaError[idx]?.mallas_100}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="mallas_120"
                          value={row.mallas_120}
                          onChange={(e) => {
                            setCargaTabla(idx, 'mallas_120', e.target.value);
                          }}
                          error={!!tablaError[idx]?.mallas_120}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/*++*************************************/}
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 px-5 ">
              <table className="text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
                  <tr className="border-b border-slate-300">
                    <th className="px-5 py-3 text-center border border-slate-300">
                      HUM. SALIDA DEL SECADERO
                    </th>
                    <th className="px-2 py-3 text-center border border-slate-300">
                      <InputField
                        type="number"
                        name="hum_salida_secadora"
                        value={form?.hum_salida_secadora || ''}
                        onChange={updateBase}
                        error={error.hum_salida_secadora}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border border-slate-300">
                      TEMP. SECADERO
                    </th>
                    <th className="px-2 py-3 text-center border border-slate-300">
                      <InputField
                        label="T1"
                        type="number"
                        name="temp_secadero_t1"
                        value={form?.temp_secadero_t1 || ''}
                        onChange={updateBase}
                        error={error.temp_secadero_t1}
                      />
                    </th>
                    <th className="px-2 py-3 text-center border border-slate-300">
                      <InputField
                        label="T2"
                        type="number"
                        name="temp_secadero_t2"
                        value={form?.temp_secadero_t2 || ''}
                        onChange={updateBase}
                        error={error.temp_secadero_t2}
                      />
                    </th>
                    <th className="px-2 py-3 text-center border border-slate-300">
                      <InputField
                        label="T3"
                        type="number"
                        name="temp_secadero_t3"
                        value={form?.temp_secadero_t3 || ''}
                        onChange={updateBase}
                        error={error.temp_secadero_t3}
                      />
                    </th>
                    <th className="px-2 py-3 text-center border border-slate-300">
                      <InputField
                        label="T4"
                        type="number"
                        name="temp_secadero_t4"
                        value={form?.temp_secadero_t4 || ''}
                        onChange={updateBase}
                        error={error.temp_secadero_t4}
                      />
                    </th>
                    <th className="px-2 py-3 text-center border border-slate-300">
                      <InputField
                        label="T5"
                        type="number"
                        name="temp_secadero_t5"
                        value={form?.temp_secadero_t5 || ''}
                        onChange={updateBase}
                        error={error.temp_secadero_t5}
                      />
                    </th>
                    <th className="px-2 py-3 text-center border border-slate-300">
                      <InputField
                        label="T6"
                        type="number"
                        name="temp_secadero_t6"
                        value={form?.temp_secadero_t6 || ''}
                        onChange={updateBase}
                        error={error.temp_secadero_t6}
                      />
                    </th>
                    <th className="px-2 py-3 text-center border border-slate-300">
                      <InputField
                        label="Ciclo secadero"
                        type="number"
                        name="ciclo_secadero"
                        value={form?.ciclo_secadero || ''}
                        onChange={updateBase}
                        error={error.ciclo_secadero}
                      />
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="flex justify-end py-5 px-10 gap-5 ">
              <button
                className="  rounded-xl bg-white px-3 py-2 text-reen-900 ring-1 ring-red-700 hover:bg-red-100"
                onClick={removeRowsSilo}
              >
                Eliminar fila
              </button>
              <button
                className="  rounded-xl bg-white px-3 py-2 text-reen-900 ring-1 ring-green-900 hover:bg-emerald-100"
                onClick={addRowsSilo}
              >
                Agregar fila
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 px-5 flex justify-center">
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
                        <InputField
                          errorMode="border"
                          type="number"
                          name="n_silo"
                          value={row.n_silo}
                          onChange={(e) => {
                            setCargaTablaSilo(idx, 'n_silo', e.target.value);
                          }}
                          error={!!tablaSiloError[idx]?.n_silo}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="humedad"
                          value={row.humedad}
                          onChange={(e) => {
                            setCargaTablaSilo(idx, 'humedad', e.target.value);
                          }}
                          error={!!tablaSiloError[idx]?.humedad}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end p-5 gap-5">
              <button
                className="rounded-xl bg-red-600 px-3 py-2 text-white hover:bg-red-900"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
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
