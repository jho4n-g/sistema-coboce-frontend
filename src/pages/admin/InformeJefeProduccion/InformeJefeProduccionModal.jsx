import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import InputField from '@components/InputField';

import { getObjs as getTurnos } from '@service/Produccion/Turno.services';
import { getIdFormatoLinea } from '@service/Produccion/Secciones/Formato.services';
import { getObjsUnidos as getLineas } from '@service/Produccion/Secciones/Lineas.services';

const initialDetalleByTurnos = (turnos = []) =>
  turnos.length
    ? turnos.map((turno) => ({
        turno_id: turno.id,
        turno_label: turno.nombre || turno.descripcion || `Turno ${turno.id}`,
        metros_cuadrados_primera: '',
        porcentaje_primera: '',
        metros_cuadrados_segunda: '',
        porcentaje_segunda: '',
        metros_cuadrados_tercera: '',
        porcentaje_tercera: '',
        metros_cuadrados_casco: '',
        porcentaje_casco: '',
      }))
    : [];

const initialPrensaByTurnos = (turnos = []) =>
  turnos.length
    ? turnos.map((turno) => ({
        turno_id: turno.id,
        turno_label: turno.nombre || turno.descripcion || `Turno ${turno.id}`,
        silo_utilizado: '',
        arcilla_consumida: '',
        ciclos: '',
        peso_pieza: '',
        perdida: '',
      }))
    : [];

const initialProducto = (turnos = [], orden = 1) => ({
  nombre_producto: '',
  programado_m2: '',
  acumulado_m2: '',
  acumulado_dia: '',
  orden,
  detalles: initialDetalleByTurnos(turnos),
});

export default function InformeModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
  isEdit = false,
  isView = false,
}) {
  const [form, setForm] = useState(null);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [turnos, setTurnos] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [formatos, setFormatos] = useState([]);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [loadingLineas, setLoadingLineas] = useState(false);
  const [loadingFormatos, setLoadingFormatos] = useState(false);

  const title = useMemo(() => {
    if (isView) return 'Detalle del informe';
    if (isEdit) return 'Edición del informe';
    return 'Nuevo informe';
  }, [isEdit, isView]);

  const buildInitialForm = (loadedTurnos = []) => ({
    fecha: '',
    supervisor: '',
    linea_id: '',
    formato_id: '',
    prensa: initialPrensaByTurnos(loadedTurnos),
    informe_producto: [initialProducto(loadedTurnos, 1)],
  });

  useEffect(() => {
    if (!open) {
      setForm(null);
      setError({});
      setLoading(false);
      setSaving(false);
      setLineas([]);
      setFormatos([]);
      return;
    }

    let active = true;
    setLoadingTurnos(true);
    setLoadingLineas(true);

    (async () => {
      try {
        const [respTurnos, respLineas] = await Promise.all([
          getTurnos(),
          getLineas(),
        ]);
        if (!active) return;

        const turnosList = respTurnos?.dato || respTurnos?.data || [];
        const lineasList = respLineas?.dato || respLineas?.data || [];

        setTurnos(Array.isArray(turnosList) ? turnosList : []);
        setLineas(Array.isArray(lineasList) ? lineasList : []);
      } catch (e) {
        if (active) {
          toast.error(
            e?.message || 'No se pudieron cargar los datos iniciales',
          );
        }
      } finally {
        if (active) {
          setLoadingTurnos(false);
          setLoadingLineas(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open || loadingTurnos || loadingLineas) return;

    let active = true;
    setLoading(true);

    (async () => {
      try {
        if (!isEdit && !isView) {
          if (active) {
            setForm(buildInitialForm(turnos));
            setError({});
          }
          return;
        }

        if (!id || !fetchById) {
          if (active) {
            setForm(buildInitialForm(turnos));
            setError({});
          }
          return;
        }

        const resp = await fetchById(id);
        if (!active) return;

        if (!resp?.ok) {
          toast.error(resp?.message || 'No se pudo cargar el informe');
          setForm(buildInitialForm(turnos));
          return;
        }

        const data = resp?.dato ?? resp?.data ?? {};

        const prensaMap = new Map(
          (data?.informe_prensa || []).map((item) => [
            String(item.turno_id),
            item,
          ]),
        );

        const productos =
          Array.isArray(data?.informe_producto) && data.informe_producto.length
            ? data.informe_producto.map((producto, index) => {
                const detalleMap = new Map(
                  (producto?.producto_detalle || []).map((det) => [
                    String(det.turno_id),
                    det,
                  ]),
                );

                return {
                  nombre_producto: producto?.nombre_producto || '',
                  programado_m2: producto?.programado_m2 || '',
                  acumulado_m2: producto?.acumulado_m2 || '',
                  acumulado_dia: producto?.acumulado_dia || '',
                  orden: producto?.orden || index + 1,
                  detalles: turnos.map((turno) => {
                    const det = detalleMap.get(String(turno.id));
                    return {
                      turno_id: turno.id,
                      turno_label:
                        turno.nombre ||
                        turno.descripcion ||
                        `Turno ${turno.id}`,
                      metros_cuadrados_primera:
                        det?.metros_cuadrados_primera || '',
                      porcentaje_primera: det?.porcentaje_primera || '',
                      metros_cuadrados_segunda:
                        det?.metros_cuadrados_segunda || '',
                      porcentaje_segunda: det?.porcentaje_segunda || '',
                      metros_cuadrados_tercera:
                        det?.metros_cuadrados_tercera || '',
                      porcentaje_tercera: det?.porcentaje_tercera || '',
                      metros_cuadrados_casco: det?.metros_cuadrados_casco || '',
                      porcentaje_casco: det?.porcentaje_casco || '',
                    };
                  }),
                };
              })
            : [initialProducto(turnos, 1)];

        setForm({
          fecha: data?.fecha || data?.informe_dia?.fecha || '',
          supervisor: data?.supervisor || '',
          linea_id: data?.linea_id || data?.informe_linea?.id || '',
          formato_id: data?.formato_id || data?.informejefe_formato?.id || '',
          prensa: turnos.map((turno) => {
            const row = prensaMap.get(String(turno.id));
            return {
              turno_id: turno.id,
              turno_label:
                turno.nombre || turno.descripcion || `Turno ${turno.id}`,
              silo_utilizado: row?.silo_utilizado || '',
              arcilla_consumida: row?.arcilla_consumida || '',
              ciclos: row?.ciclos || '',
              peso_pieza: row?.peso_pieza || '',
              perdida: row?.perdida || '',
            };
          }),
          informe_producto: productos,
        });
        setError({});
      } catch (e) {
        if (active) toast.error(e?.message || 'Error al cargar el informe');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [
    open,
    id,
    fetchById,
    isEdit,
    isView,
    loadingTurnos,
    loadingLineas,
    turnos,
  ]);

  useEffect(() => {
    if (!open) return;

    if (!form?.linea_id) {
      setFormatos([]);
      return;
    }

    let active = true;
    setLoadingFormatos(true);

    (async () => {
      try {
        const resp = await getIdFormatoLinea(form.linea_id);
        if (!active) return;

        const list = resp?.dato || resp?.data || [];
        setFormatos(Array.isArray(list) ? list : []);
      } catch (e) {
        if (active) {
          setFormatos([]);
          toast.error(e?.message || 'No se pudieron cargar los formatos');
        }
      } finally {
        if (active) setLoadingFormatos(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, form?.linea_id]);

  if (!open) return null;

  const updateBase = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const updatePrensa = (index, field, value) => {
    if (isView) return;
    setForm((prev) => {
      const copy = [...prev.prensa];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, prensa: copy };
    });
  };

  const updateProducto = (index, field, value) => {
    if (isView) return;
    setForm((prev) => {
      const copy = [...prev.informe_producto];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, informe_producto: copy };
    });
  };

  const updateDetalle = (productoIndex, detalleIndex, field, value) => {
    if (isView) return;
    setForm((prev) => {
      const productos = [...prev.informe_producto];
      const detalles = [...productos[productoIndex].detalles];
      detalles[detalleIndex] = { ...detalles[detalleIndex], [field]: value };
      productos[productoIndex] = { ...productos[productoIndex], detalles };
      return { ...prev, informe_producto: productos };
    });
  };

  const addProducto = () => {
    if (isView) return;
    setForm((prev) => ({
      ...prev,
      informe_producto: [
        ...prev.informe_producto,
        initialProducto(turnos, prev.informe_producto.length + 1),
      ],
    }));
  };

  const removeProducto = (index) => {
    if (isView) return;
    setForm((prev) => {
      const next = prev.informe_producto.filter((_, i) => i !== index);
      return {
        ...prev,
        informe_producto: next.length
          ? next.map((item, idx) => ({ ...item, orden: idx + 1 }))
          : [initialProducto(turnos, 1)],
      };
    });
  };

  const normalizeNumber = (value) => {
    if (value === '' || value === null || value === undefined) return 0;
    return Number(value);
  };

  const validate = () => {
    const nextError = {};

    if (!form?.fecha) nextError.fecha = 'La fecha es obligatoria';
    if (!form?.supervisor?.trim())
      nextError.supervisor = 'El supervisor es obligatorio';
    if (!form?.linea_id) nextError.linea_id = 'La línea es obligatoria';
    if (!form?.formato_id) nextError.formato_id = 'El formato es obligatorio';

    if (!form?.informe_producto?.length) {
      nextError.informe_producto = 'Debe registrar al menos un producto';
    }

    form?.informe_producto?.forEach((producto) => {
      if (!producto.nombre_producto?.trim()) {
        nextError.informe_producto = 'Todos los productos deben tener nombre';
      }
    });

    setError(nextError);
    return Object.keys(nextError).length === 0;
  };

  const handleSave = async () => {
    if (isView || saving) return;
    if (!validate()) {
      toast.error('Completa correctamente los datos del informe');
      return;
    }

    const payload = {
      fecha: form.fecha,
      supervisor: form.supervisor.trim(),
      linea_id: Number(form.linea_id),
      formato_id: Number(form.formato_id),
      prensa: form.prensa.map((item) => ({
        turno_id: Number(item.turno_id),
        silo_utilizado: item.silo_utilizado,
        arcilla_consumida: normalizeNumber(item.arcilla_consumida),
        ciclos: normalizeNumber(item.ciclos),
        peso_pieza: normalizeNumber(item.peso_pieza),
        perdida: normalizeNumber(item.perdida),
      })),
      informe_producto: form.informe_producto.map((producto, index) => ({
        nombre_producto: producto.nombre_producto.trim(),
        programado_m2: normalizeNumber(producto.programado_m2),
        acumulado_m2: normalizeNumber(producto.acumulado_m2),
        acumulado_dia: normalizeNumber(producto.acumulado_dia),
        orden: producto.orden || index + 1,
        detalles: producto.detalles.map((detalle) => ({
          turno_id: Number(detalle.turno_id),
          metros_cuadrados_primera: normalizeNumber(
            detalle.metros_cuadrados_primera,
          ),
          porcentaje_primera: normalizeNumber(detalle.porcentaje_primera),
          metros_cuadrados_segunda: normalizeNumber(
            detalle.metros_cuadrados_segunda,
          ),
          porcentaje_segunda: normalizeNumber(detalle.porcentaje_segunda),
          metros_cuadrados_tercera: normalizeNumber(
            detalle.metros_cuadrados_tercera,
          ),
          porcentaje_tercera: normalizeNumber(detalle.porcentaje_tercera),
          metros_cuadrados_casco: normalizeNumber(
            detalle.metros_cuadrados_casco,
          ),
          porcentaje_casco: normalizeNumber(detalle.porcentaje_casco),
        })),
      })),
    };

    try {
      setSaving(true);
      await onSave(payload);
    } catch (e) {
      toast.error(e?.message || 'No se pudo guardar el informe');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (loading || saving) return;
    setError({});
    setForm(buildInitialForm(turnos));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={loading || saving ? undefined : handleClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-10 w-[96vw] max-w-9xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {(loading ||
          loadingTurnos ||
          loadingLineas ||
          loadingFormatos ||
          saving ||
          !form) && (
          <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-white/75 backdrop-blur">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <p className="text-sm font-semibold text-slate-800">
                {saving ? 'Guardando datos…' : 'Cargando datos…'}
              </p>
            </div>
          </div>
        )}

        {form && !loading && !loadingTurnos && !loadingLineas && (
          <>
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl bg-white p-4 shadow ring-1 ring-slate-200">
                <div className="grid grid-cols-12 gap-4 sm:gap-6">
                  <div className="col-span-12 md:col-span-3">
                    <InputField
                      label="Fecha"
                      type="date"
                      name="fecha"
                      value={form.fecha || ''}
                      onChange={updateBase}
                      error={error.fecha}
                      disabled={isView}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-5">
                    <InputField
                      label="Supervisor"
                      type="text"
                      name="supervisor"
                      value={form.supervisor || ''}
                      onChange={updateBase}
                      error={error.supervisor}
                      disabled={isView}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Línea
                    </label>
                    <select
                      name="linea_id"
                      value={form.linea_id || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          linea_id: value,
                          formato_id: '',
                        }));
                        setError((prev) => ({
                          ...prev,
                          linea_id: undefined,
                          formato_id: undefined,
                        }));
                      }}
                      disabled={isView || loadingLineas}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:border-sky-500 disabled:bg-slate-100"
                    >
                      <option value="">Seleccione una línea</option>
                      {lineas.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nombre || item.descripcion}
                        </option>
                      ))}
                    </select>
                    {error.linea_id && (
                      <p className="mt-1 text-sm text-red-600">
                        {error.linea_id}
                      </p>
                    )}
                  </div>

                  <div className="col-span-12 md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Formato
                    </label>
                    <select
                      name="formato_id"
                      value={form.formato_id || ''}
                      onChange={updateBase}
                      disabled={isView || !form.linea_id || loadingFormatos}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:border-sky-500 disabled:bg-slate-100"
                    >
                      <option value="">Seleccione un formato</option>
                      {formatos.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nombre || item.descripcion}
                        </option>
                      ))}
                    </select>
                    {error.formato_id && (
                      <p className="mt-1 text-sm text-red-600">
                        {error.formato_id}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-4 shadow ring-1 ring-slate-200">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">
                    Datos de prensa por turno
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-3 py-2 text-left">
                          Turno
                        </th>
                        <th className="border border-slate-300 px-3 py-2 text-left">
                          Silo utilizado
                        </th>
                        <th className="border border-slate-300 px-3 py-2 text-left">
                          Arcilla consumida
                        </th>
                        <th className="border border-slate-300 px-3 py-2 text-left">
                          Ciclos
                        </th>
                        <th className="border border-slate-300 px-3 py-2 text-left">
                          Peso pieza
                        </th>
                        <th className="border border-slate-300 px-3 py-2 text-left">
                          Pérdida
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.prensa.map((row, index) => (
                        <tr key={row.turno_id || index}>
                          <td className="border border-slate-300 px-3 py-2 font-medium text-slate-700">
                            {row.turno_label}
                          </td>
                          <td className="border border-slate-300 p-2">
                            <InputField
                              type="text"
                              value={row.silo_utilizado || ''}
                              onChange={(e) =>
                                updatePrensa(
                                  index,
                                  'silo_utilizado',
                                  e.target.value,
                                )
                              }
                              disabled={isView}
                              errorMode="border"
                            />
                          </td>
                          <td className="border border-slate-300 p-2">
                            <InputField
                              type="number"
                              value={row.arcilla_consumida || ''}
                              onChange={(e) =>
                                updatePrensa(
                                  index,
                                  'arcilla_consumida',
                                  e.target.value,
                                )
                              }
                              disabled={isView}
                              errorMode="border"
                            />
                          </td>
                          <td className="border border-slate-300 p-2">
                            <InputField
                              type="number"
                              value={row.ciclos || ''}
                              onChange={(e) =>
                                updatePrensa(index, 'ciclos', e.target.value)
                              }
                              disabled={isView}
                              errorMode="border"
                            />
                          </td>
                          <td className="border border-slate-300 p-2">
                            <InputField
                              type="number"
                              value={row.peso_pieza || ''}
                              onChange={(e) =>
                                updatePrensa(
                                  index,
                                  'peso_pieza',
                                  e.target.value,
                                )
                              }
                              disabled={isView}
                              errorMode="border"
                            />
                          </td>
                          <td className="border border-slate-300 p-2">
                            <InputField
                              type="number"
                              value={row.perdida || ''}
                              onChange={(e) =>
                                updatePrensa(index, 'perdida', e.target.value)
                              }
                              disabled={isView}
                              errorMode="border"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow ring-1 ring-slate-200">
                  <h4 className="text-base font-semibold text-slate-900">
                    Productos del informe
                  </h4>
                  {!isView && (
                    <button
                      className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
                      onClick={addProducto}
                      type="button"
                    >
                      Agregar producto
                    </button>
                  )}
                </div>

                {form.informe_producto.map((producto, productoIndex) => (
                  <div
                    key={productoIndex}
                    className="rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h5 className="text-base font-semibold text-slate-900">
                        Producto #{productoIndex + 1}
                      </h5>
                      {!isView && form.informe_producto.length > 1 && (
                        <button
                          type="button"
                          className="rounded-xl bg-red-800 px-3 py-2 text-white hover:bg-red-900"
                          onClick={() => removeProducto(productoIndex)}
                        >
                          Quitar producto
                        </button>
                      )}
                    </div>

                    <div className="mb-4 grid grid-cols-12 gap-4 sm:gap-6">
                      <div className="col-span-12 md:col-span-4">
                        <InputField
                          label="Nombre producto"
                          type="text"
                          value={producto.nombre_producto || ''}
                          onChange={(e) =>
                            updateProducto(
                              productoIndex,
                              'nombre_producto',
                              e.target.value,
                            )
                          }
                          disabled={isView}
                        />
                      </div>

                      <div className="col-span-12 md:col-span-2">
                        <InputField
                          label="Programado m2"
                          type="number"
                          value={producto.programado_m2 || ''}
                          onChange={(e) =>
                            updateProducto(
                              productoIndex,
                              'programado_m2',
                              e.target.value,
                            )
                          }
                          disabled={isView}
                        />
                      </div>

                      <div className="col-span-12 md:col-span-2">
                        <InputField
                          label="Acumulado m2"
                          type="number"
                          value={producto.acumulado_m2 || ''}
                          onChange={(e) =>
                            updateProducto(
                              productoIndex,
                              'acumulado_m2',
                              e.target.value,
                            )
                          }
                          disabled={isView}
                        />
                      </div>

                      <div className="col-span-12 md:col-span-2">
                        <InputField
                          label="Acumulado día"
                          type="number"
                          value={producto.acumulado_dia || ''}
                          onChange={(e) =>
                            updateProducto(
                              productoIndex,
                              'acumulado_dia',
                              e.target.value,
                            )
                          }
                          disabled={isView}
                        />
                      </div>

                      <div className="col-span-12 md:col-span-2">
                        <InputField
                          label="Orden"
                          type="number"
                          value={producto.orden || ''}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-slate-300 px-3 py-2 text-left">
                              Turno
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                              M² primera
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                              % primera
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                              M² segunda
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                              % segunda
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                              M² tercera
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                              % tercera
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                              M² casco
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                              % casco
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {producto.detalles.map((detalle, detalleIndex) => (
                            <tr key={detalle.turno_id || detalleIndex}>
                              <td className="border border-slate-300 px-3 py-2 font-medium text-slate-700">
                                {detalle.turno_label}
                              </td>
                              <td className="border border-slate-300 p-2">
                                <InputField
                                  type="number"
                                  value={detalle.metros_cuadrados_primera || ''}
                                  onChange={(e) =>
                                    updateDetalle(
                                      productoIndex,
                                      detalleIndex,
                                      'metros_cuadrados_primera',
                                      e.target.value,
                                    )
                                  }
                                  disabled={isView}
                                  errorMode="border"
                                />
                              </td>
                              <td className="border border-slate-300 p-2">
                                <InputField
                                  type="number"
                                  value={detalle.porcentaje_primera || ''}
                                  onChange={(e) =>
                                    updateDetalle(
                                      productoIndex,
                                      detalleIndex,
                                      'porcentaje_primera',
                                      e.target.value,
                                    )
                                  }
                                  disabled={isView}
                                  errorMode="border"
                                />
                              </td>
                              <td className="border border-slate-300 p-2">
                                <InputField
                                  type="number"
                                  value={detalle.metros_cuadrados_segunda || ''}
                                  onChange={(e) =>
                                    updateDetalle(
                                      productoIndex,
                                      detalleIndex,
                                      'metros_cuadrados_segunda',
                                      e.target.value,
                                    )
                                  }
                                  disabled={isView}
                                  errorMode="border"
                                />
                              </td>
                              <td className="border border-slate-300 p-2">
                                <InputField
                                  type="number"
                                  value={detalle.porcentaje_segunda || ''}
                                  onChange={(e) =>
                                    updateDetalle(
                                      productoIndex,
                                      detalleIndex,
                                      'porcentaje_segunda',
                                      e.target.value,
                                    )
                                  }
                                  disabled={isView}
                                  errorMode="border"
                                />
                              </td>
                              <td className="border border-slate-300 p-2">
                                <InputField
                                  type="number"
                                  value={detalle.metros_cuadrados_tercera || ''}
                                  onChange={(e) =>
                                    updateDetalle(
                                      productoIndex,
                                      detalleIndex,
                                      'metros_cuadrados_tercera',
                                      e.target.value,
                                    )
                                  }
                                  disabled={isView}
                                  errorMode="border"
                                />
                              </td>
                              <td className="border border-slate-300 p-2">
                                <InputField
                                  type="number"
                                  value={detalle.porcentaje_tercera || ''}
                                  onChange={(e) =>
                                    updateDetalle(
                                      productoIndex,
                                      detalleIndex,
                                      'porcentaje_tercera',
                                      e.target.value,
                                    )
                                  }
                                  disabled={isView}
                                  errorMode="border"
                                />
                              </td>
                              <td className="border border-slate-300 p-2">
                                <InputField
                                  type="number"
                                  value={detalle.metros_cuadrados_casco || ''}
                                  onChange={(e) =>
                                    updateDetalle(
                                      productoIndex,
                                      detalleIndex,
                                      'metros_cuadrados_casco',
                                      e.target.value,
                                    )
                                  }
                                  disabled={isView}
                                  errorMode="border"
                                />
                              </td>
                              <td className="border border-slate-300 p-2">
                                <InputField
                                  type="number"
                                  value={detalle.porcentaje_casco || ''}
                                  onChange={(e) =>
                                    updateDetalle(
                                      productoIndex,
                                      detalleIndex,
                                      'porcentaje_casco',
                                      e.target.value,
                                    )
                                  }
                                  disabled={isView}
                                  errorMode="border"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 z-20 flex justify-end gap-2 border-t border-slate-200 bg-white/95 p-5 backdrop-blur-sm">
              <button
                className="rounded-xl bg-red-800 px-3 py-2 text-white hover:bg-red-900"
                onClick={handleClose}
                type="button"
              >
                {isView ? 'Cerrar' : 'Cancelar'}
              </button>
              {!isView && (
                <button
                  className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
                  onClick={handleSave}
                  type="button"
                >
                  {isEdit ? 'Guardar cambios' : 'Guardar registro'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
