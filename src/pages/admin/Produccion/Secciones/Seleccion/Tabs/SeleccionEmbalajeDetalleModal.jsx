import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { XMarkIcon } from '@heroicons/react/24/outline';

import InputField from '@components/InputField';

const initialView = {
  fecha: '',
  operador: '',
  supervisor_turno: '',
  producto: '',
  horno: '',
  grupo: '',

  // si tu backend guarda estos nombres ya “humanos”, mejor:
  turno: '',
  linea: '',
  formato: '',

  // si no, al menos ids:
  turno_id: null,
  linea_id: null,
  formato_id: null,

  // header defectos (si lo tienes en el parent)
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

export default function SeleccionDetalleModal({
  open,
  onClose,
  fetchById,
  id,
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialView);

  useEffect(() => {
    if (!open) return;

    // al abrir sin id: limpia
    if (!id) {
      setData(initialView);
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

        setData({
          ...initialView,
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

  const tablaRows = useMemo(() => {
    return Array.isArray(data?.tabla_seleccion_embalaje)
      ? data.tabla_seleccion_embalaje
      : [];
  }, [data?.tabla_seleccion_embalaje]);

  if (!open) return null;

  const turnoLabel =
    data?.turno || (data?.turno_id ? `ID ${data.turno_id}` : '');
  const lineaLabel =
    data?.linea || (data?.linea_id ? `ID ${data.linea_id}` : '');
  const formatoLabel =
    data?.formato || (data?.formato_id ? `ID ${data.formato_id}` : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        onClick={loading ? undefined : onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-10 w-[92%] max-w-9xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-extrabold text-slate-900">
            Detalle Selección Embalaje
          </h3>
          <button
            type="button"
            onClick={loading ? undefined : onClose}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-white/75 backdrop-blur">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <p className="text-sm font-semibold text-slate-800">Cargando…</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Resumen */}
            <div className="p-5">
              <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                  <div className="md:col-span-1 lg:col-span-3">
                    <InputField
                      label="Fecha"
                      type="date"
                      name="fecha"
                      value={data?.fecha || ''}
                      onChange={() => {}}
                      disabled
                    />
                  </div>

                  <div className="md:col-span-1 lg:col-span-3">
                    <InputField
                      label="Turno"
                      type="text"
                      value={turnoLabel}
                      onChange={() => {}}
                      disabled
                    />
                  </div>

                  <div className="md:col-span-1 lg:col-span-6">
                    <InputField
                      label="Operador"
                      type="text"
                      name="operador"
                      value={data?.operador || ''}
                      onChange={() => {}}
                      disabled
                    />
                  </div>

                  <div className="md:col-span-1 lg:col-span-6">
                    <InputField
                      label="Supervisor de turno"
                      type="text"
                      name="supervisor_turno"
                      value={data?.supervisor_turno || ''}
                      onChange={() => {}}
                      disabled
                    />
                  </div>

                  <div className="md:col-span-1 lg:col-span-6">
                    <InputField
                      label="Producto"
                      type="text"
                      name="producto"
                      value={data?.producto || ''}
                      onChange={() => {}}
                      disabled
                    />
                  </div>

                  <div className="md:col-span-1 lg:col-span-3">
                    <InputField
                      label="Línea"
                      type="text"
                      value={lineaLabel}
                      onChange={() => {}}
                      disabled
                    />
                  </div>

                  <div className="md:col-span-1 lg:col-span-3">
                    <InputField
                      label="Horno"
                      type="text"
                      name="horno"
                      value={data?.horno || ''}
                      onChange={() => {}}
                      disabled
                    />
                  </div>

                  <div className="md:col-span-1 lg:col-span-3">
                    <InputField
                      label="Formato"
                      type="text"
                      value={formatoLabel}
                      onChange={() => {}}
                      disabled
                    />
                  </div>

                  <div className="md:col-span-1 lg:col-span-6">
                    <InputField
                      label="Grupo"
                      type="text"
                      name="grupo"
                      value={data?.grupo || ''}
                      onChange={() => {}}
                      disabled
                    />
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2 lg:col-span-12">
                    <p className="text-sm font-semibold text-slate-700 mb-2">
                      Observaciones
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(data?.observacion_embalaje ?? []).length ? (
                        (data?.observacion_embalaje ?? []).map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200"
                          >
                            <span className="max-w-55 sm:max-w-130 truncate">
                              {item?.observacion}
                            </span>
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">
                          Sin observaciones
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla */}
            <div className="px-5 pb-5">
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow">
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
                      {[
                        'TIPO',
                        'A1',
                        'A2',
                        'A3',
                        'B1',
                        'B2',
                        'B3',
                        'C1',
                        'C2',
                        'C3',
                        'D1',
                        'D2',
                        'D3',
                        'CAJAS',
                        'CAJAS', // segunda
                        'N1',
                        'N2',
                        'N3',
                        'N4',
                        'N5',
                        'N6',
                        'N7',
                        'N8',
                        'N9',
                        'N10',
                        'CAJAS', // tercera
                        'N1',
                        'N2',
                        'N3',
                        'N4',
                        'N5',
                        'N6',
                        'N7',
                        'CAJAS', // casco
                        'N1',
                        'N2',
                        'N3',
                        'N4',
                        '(Min.)',
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-10 py-3 text-center border-r border-slate-300"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {tablaRows.map((row, idx) => (
                      <tr key={idx} className="border border-slate-300">
                        <td className="sticky left-0 z-20 p-2 border-r border-slate-300 bg-white">
                          <InputField
                            errorMode="border"
                            type="time"
                            value={row?.hora ?? ''}
                            onChange={() => {}}
                            disabled
                          />
                        </td>

                        <td className="p-2 border-r border-slate-300">
                          <InputField
                            errorMode="border"
                            type="text"
                            value={row?.tipo_concepto ?? ''}
                            onChange={() => {}}
                            disabled
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
                              value={row?.[field] ?? ''}
                              onChange={() => {}}
                              disabled
                            />
                          </td>
                        ))}
                      </tr>
                    ))}

                    {!tablaRows.length && (
                      <tr>
                        <td className="px-4 py-4 text-slate-500" colSpan={999}>
                          Sin filas registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
