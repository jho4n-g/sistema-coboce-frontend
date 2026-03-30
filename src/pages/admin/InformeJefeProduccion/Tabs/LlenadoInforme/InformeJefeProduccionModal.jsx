import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import InputField from '@components/InputField';

import { getObjs as getTurnos } from '@service/Produccion/Turno.services';
import {
  getIdFormatoLinea,
  getIdObj as getFormatoById,
} from '@service/Produccion/Secciones/Formato.services';
import { getObjsUnidos as getLineas } from '@service/Produccion/Secciones/Lineas.services';

import {
  informeSchema,
  informeUpdateSchema,
} from '@schema/JefeProduccion/InformeProduccion.schema.js';

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
        metros_cuadrados_pruebas: '',
        pruebas_porcentaje: '',
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

const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getTotalDetalleTurno = (detalle = {}) => {
  return (
    toNumber(detalle.metros_cuadrados_primera) +
    toNumber(detalle.metros_cuadrados_segunda) +
    toNumber(detalle.metros_cuadrados_tercera) +
    toNumber(detalle.metros_cuadrados_casco) +
    toNumber(detalle.metros_cuadrados_pruebas)
  );
};

const getTotalesGenerales = (productos = [], turnos = []) => {
  const totalesPorTurno = turnos.map((turno) => {
    const total = productos.reduce((acc, producto) => {
      const detalle = (producto.detalles || []).find(
        (item) => Number(item.turno_id) === Number(turno.id),
      );

      return acc + getTotalDetalleTurno(detalle);
    }, 0);

    return {
      turno_id: turno.id,
      turno_label: turno.nombre || turno.descripcion || `Turno ${turno.id}`,
      total,
    };
  });

  const totalMetrosCuadrados = totalesPorTurno.reduce(
    (acc, item) => acc + item.total,
    0,
  );

  return {
    totalesPorTurno,
    totalMetrosCuadrados,
  };
};

const getTotalesPrimeraSegundaPorTurno = (
  productos = [],
  turnos = [],
  metrosCaja,
) => {
  const divisor = Number(metrosCaja);

  // ✅ evitamos división por 0, null, undefined o NaN
  const divisorSeguro = divisor > 0 ? divisor : 1;

  const datosTurno = turnos.map((turno) => {
    const primera = productos.reduce((acc, producto) => {
      const detalle = (producto.detalles || []).find(
        (item) => Number(item.turno_id) === Number(turno.id),
      );

      return acc + toNumber(detalle?.metros_cuadrados_primera);
    }, 0);

    const segunda = productos.reduce((acc, producto) => {
      const detalle = (producto.detalles || []).find(
        (item) => Number(item.turno_id) === Number(turno.id),
      );

      return acc + toNumber(detalle?.metros_cuadrados_segunda);
    }, 0);

    const tercera = productos.reduce((acc, producto) => {
      const detalle = (producto.detalles || []).find(
        (item) => Number(item.turno_id) === Number(turno.id),
      );

      return acc + toNumber(detalle?.metros_cuadrados_tercera);
    }, 0);

    const casco = productos.reduce((acc, producto) => {
      const detalle = (producto.detalles || []).find(
        (item) => Number(item.turno_id) === Number(turno.id),
      );

      return acc + toNumber(detalle?.metros_cuadrados_casco);
    }, 0);

    const pruebas = productos.reduce((acc, producto) => {
      const detalle = (producto.detalles || []).find(
        (item) => Number(item.turno_id) === Number(turno.id),
      );

      return acc + toNumber(detalle?.metros_cuadrados_pruebas);
    }, 0);

    const totalPrimeraSegunda = primera + segunda;

    return {
      turno_id: turno.id,
      turno_label: turno.nombre || turno.descripcion || `Turno ${turno.id}`,
      primera,
      segunda,
      tercera,
      casco,
      pruebas,
      total_primera_segunda: totalPrimeraSegunda,
    };
  });

  const datosGeneralPrimera = datosTurno.reduce(
    (acc, item) => acc + item.primera,
    0,
  );

  const datosGeneralSegunda = datosTurno.reduce(
    (acc, item) => acc + item.segunda,
    0,
  );

  const datosGeneralPrimeraSegunda = datosTurno.reduce(
    (acc, item) => acc + item.total_primera_segunda,
    0,
  );
  const datosGeneralTercera = datosTurno.reduce(
    (acc, item) => acc + item.tercera,
    0,
  );
  const datosGeneralCasco = datosTurno.reduce(
    (acc, item) => acc + item.casco,
    0,
  );
  const datosGeneralPruebas = datosTurno.reduce(
    (acc, item) => acc + item.pruebas,
    0,
  );

  const resumenPorTurno = datosTurno.map((item) => ({
    turno_id: item.turno_id,
    turno_label: item.turno_label,
    primera: item.primera / divisorSeguro,
    segunda: item.segunda / divisorSeguro,
    total_primera_segunda: item.total_primera_segunda / divisorSeguro,
  }));

  return {
    resumenPorTurno,
    primera_m2: datosGeneralPrimera,
    segunda_m2: datosGeneralSegunda,
    tercera_m2: datosGeneralTercera,
    casco_m2: datosGeneralCasco,
    pruebas_m2: datosGeneralPruebas,
    totalGeneralPrimera: datosGeneralPrimera / divisorSeguro,
    totalGeneralSegunda: datosGeneralSegunda / divisorSeguro,
    totalGeneralPrimeraSegunda: datosGeneralPrimeraSegunda / divisorSeguro,
  };
};
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
  const [datosFormato, setDatosFormato] = useState(null);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [loadingLineas, setLoadingLineas] = useState(false);
  const [loadingFormatos, setLoadingFormatos] = useState(false);

  // Totales generales
  const [generalMetros, setGeneralMetros] = useState(null);
  const [datosCalidadesM2, setDatosCalidadesM2] = useState(null);

  const title = useMemo(() => {
    if (isView) return 'Detalle del informe';
    if (isEdit) return 'Edición del informe';
    return 'Nuevo informe';
  }, [isEdit, isView]);

  const totalesGenerales = useMemo(() => {
    return getTotalesGenerales(form?.informe_producto || [], turnos);
  }, [form?.informe_producto, turnos]);

  const totalesPrimeraSegunda = useMemo(() => {
    return getTotalesPrimeraSegundaPorTurno(
      form?.informe_producto || [],
      turnos,
      datosFormato,
    );
  }, [form?.informe_producto, turnos, datosFormato]);

  useEffect(() => {
    setGeneralMetros(getTotalesGenerales(form?.informe_producto || [], turnos));
    setDatosCalidadesM2(
      getTotalesPrimeraSegundaPorTurno(
        form?.informe_producto || [],
        turnos,
        datosFormato,
      ),
    );
  }, [form?.informe_producto, turnos, datosFormato]);

  const buildInitialForm = (loadedTurnos = []) => ({
    fecha: '',
    supervisor: '',
    linea_id: '',
    formato_id: '',
    prensa: initialPrensaByTurnos(loadedTurnos),
    informe_producto: [initialProducto(loadedTurnos, 1)],
  });

  const mapZodErrors = (issues = []) => {
    const formatted = {};

    for (const issue of issues) {
      const path = issue.path.join('.');
      if (!formatted[path]) {
        formatted[path] = issue.message;
      }
    }

    return formatted;
  };

  const normalizeNumber = (value) => {
    if (value === '' || value === null || value === undefined) return 0;
    return Number(value);
  };

  const buildPayload = () => ({
    fecha: form.fecha,
    supervisor: form.supervisor?.trim(),
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
      nombre_producto: producto.nombre_producto?.trim(),
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
        metros_cuadrados_casco: normalizeNumber(detalle.metros_cuadrados_casco),
        porcentaje_casco: normalizeNumber(detalle.porcentaje_casco),
        //
        metros_cuadrados_pruebas: normalizeNumber(
          detalle.metros_cuadrados_pruebas,
        ),
        pruebas_porcentaje: normalizeNumber(detalle.pruebas_porcentaje),
      })),
    })),
  });

  const validateWithSchema = (payload) => {
    const result = isEdit
      ? informeUpdateSchema.safeParse(payload)
      : informeSchema.safeParse(payload);

    if (result.success) {
      setError({});
      return { ok: true, data: result.data };
    }

    const zodErrors = mapZodErrors(result.error.issues);
    setError(zodErrors);

    toast.error(result.error.issues?.[0]?.message || 'Datos inválidos');
    return { ok: false, errors: zodErrors };
  };

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

                      metros_cuadrados_pruebas:
                        det?.metros_cuadrados_pruebas || '',
                      pruebas_porcentaje: det?.pruebas_porcentaje || '',
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

  useEffect(() => {
    if (!form?.formato_id) {
      setDatosFormato(null);
      return;
    }

    let active = true;

    (async () => {
      try {
        const resp = await getFormatoById(form.formato_id);

        if (!active) return;

        if (!resp?.ok) {
          toast.error(
            resp?.message || 'No se pudo cargar el formato seleccionado',
          );
          return;
        }

        setDatosFormato(
          resp?.dato?.[0]?.caja_metros || resp?.data?.[0]?.caja_metros || null,
        );
      } catch (error) {
        if (active) {
          toast.error(error.message || 'Error al obtener el formato');
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [form?.formato_id]);

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

    setError((prev) => ({
      ...prev,
      [`prensa.${index}.${field}`]: undefined,
      prensa: undefined,
    }));
  };

  const updateProducto = (index, field, value) => {
    if (isView) return;
    setForm((prev) => {
      const copy = [...prev.informe_producto];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, informe_producto: copy };
    });

    setError((prev) => ({
      ...prev,
      [`informe_producto.${index}.${field}`]: undefined,
      informe_producto: undefined,
    }));
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

    setError((prev) => ({
      ...prev,
      [`informe_producto.${productoIndex}.detalles.${detalleIndex}.${field}`]:
        undefined,
      [`informe_producto.${productoIndex}.detalles`]: undefined,
      informe_producto: undefined,
    }));
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

  const handleSave = async () => {
    if (isView || saving) return;

    const payload = buildPayload();

    const validation = validateWithSchema(payload);

    if (!validation.ok) return;

    try {
      setSaving(true);

      const dataSave = {
        total_dia_m2: generalMetros?.totalMetrosCuadrados,
        total_primera_m2: datosCalidadesM2?.primera_m2,
        total_segunda_m2: datosCalidadesM2?.segunda_m2,
        total_tercera_m2: datosCalidadesM2?.tercera_m2,
        total_casco_m2: datosCalidadesM2?.casco_m2,
        total_pruebas_m2: datosCalidadesM2?.pruebas_m2,

        ...validation.data,
      };

      await onSave(dataSave);
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

      <div className="relative z-10 max-h-[calc(100vh-2rem)] w-[96vw] max-w-9xl overflow-y-auto rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
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
                      className={`w-full rounded-xl border bg-white px-4 py-2 outline-none focus:border-sky-500 disabled:bg-slate-100 ${
                        error.linea_id ? 'border-red-500' : 'border-slate-300'
                      }`}
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
                      className={`w-full rounded-xl border bg-white px-4 py-2 outline-none focus:border-sky-500 disabled:bg-slate-100 ${
                        error.formato_id ? 'border-red-500' : 'border-slate-300'
                      }`}
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

                {error.prensa && (
                  <p className="mb-3 text-sm text-red-600">{error.prensa}</p>
                )}

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
                              error={error[`prensa.${index}.silo_utilizado`]}
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
                              error={error[`prensa.${index}.arcilla_consumida`]}
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
                              error={error[`prensa.${index}.ciclos`]}
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
                              error={error[`prensa.${index}.peso_pieza`]}
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
                              error={error[`prensa.${index}.perdida`]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl bg-white p-4 shadow ring-1 ring-slate-200">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">
                    Resumen total de producción
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-3 py-2 text-left">
                          Concepto
                        </th>
                        {totalesGenerales.totalesPorTurno.map((item) => (
                          <th
                            key={item.turno_id}
                            className="border border-slate-300 px-3 py-2 text-center"
                          >
                            {item.turno_label}
                          </th>
                        ))}
                        <th className="border border-slate-300 px-3 py-2 text-center">
                          Total m²
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2 font-semibold text-slate-800">
                          Total producto
                        </td>
                        {totalesGenerales.totalesPorTurno.map((item) => (
                          <td
                            key={item.turno_id}
                            className="border border-slate-300 px-3 py-2 text-center font-semibold text-slate-700"
                          >
                            {item.total.toFixed(2)}
                          </td>
                        ))}
                        <td className="border border-slate-300 px-3 py-2 text-center font-bold text-emerald-800">
                          {totalesGenerales.totalMetrosCuadrados.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total de m² producidos en el día
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-800">
                      {totalesGenerales.totalMetrosCuadrados.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow ring-1 ring-slate-200">
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">
                      Productos del informe
                    </h4>
                    {error.informe_producto && (
                      <p className="mt-1 text-sm text-red-600">
                        {error.informe_producto}
                      </p>
                    )}
                  </div>

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
                          error={
                            error[
                              `informe_producto.${productoIndex}.nombre_producto`
                            ]
                          }
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
                          error={
                            error[
                              `informe_producto.${productoIndex}.programado_m2`
                            ]
                          }
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
                          error={
                            error[
                              `informe_producto.${productoIndex}.acumulado_m2`
                            ]
                          }
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
                          error={
                            error[
                              `informe_producto.${productoIndex}.acumulado_dia`
                            ]
                          }
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

                    {error[`informe_producto.${productoIndex}.detalles`] && (
                      <p className="mb-3 text-sm text-red-600">
                        {error[`informe_producto.${productoIndex}.detalles`]}
                      </p>
                    )}

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
                            <th className="border border-slate-300 px-3 py-2 text-left">
                              M² pruebas
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                              % pruebas
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-center">
                              Total turno
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
                                  error={
                                    error[
                                      `informe_producto.${productoIndex}.detalles.${detalleIndex}.metros_cuadrados_primera`
                                    ]
                                  }
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
                                  error={
                                    error[
                                      `informe_producto.${productoIndex}.detalles.${detalleIndex}.porcentaje_primera`
                                    ]
                                  }
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
                                  error={
                                    error[
                                      `informe_producto.${productoIndex}.detalles.${detalleIndex}.metros_cuadrados_segunda`
                                    ]
                                  }
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
                                  error={
                                    error[
                                      `informe_producto.${productoIndex}.detalles.${detalleIndex}.porcentaje_segunda`
                                    ]
                                  }
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
                                  error={
                                    error[
                                      `informe_producto.${productoIndex}.detalles.${detalleIndex}.metros_cuadrados_tercera`
                                    ]
                                  }
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
                                  error={
                                    error[
                                      `informe_producto.${productoIndex}.detalles.${detalleIndex}.porcentaje_tercera`
                                    ]
                                  }
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
                                  error={
                                    error[
                                      `informe_producto.${productoIndex}.detalles.${detalleIndex}.metros_cuadrados_casco`
                                    ]
                                  }
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
                                  error={
                                    error[
                                      `informe_producto.${productoIndex}.detalles.${detalleIndex}.porcentaje_casco`
                                    ]
                                  }
                                />
                              </td>
                              <td className="border border-slate-300 p-2">
                                <InputField
                                  type="number"
                                  value={detalle.metros_cuadrados_pruebas || ''}
                                  onChange={(e) =>
                                    updateDetalle(
                                      productoIndex,
                                      detalleIndex,
                                      'metros_cuadrados_pruebas',
                                      e.target.value,
                                    )
                                  }
                                  disabled={isView}
                                  errorMode="border"
                                  error={
                                    error[
                                      `informe_producto.${productoIndex}.detalles.${detalleIndex}.metros_cuadrados_pruebas`
                                    ]
                                  }
                                />
                              </td>
                              <td className="border border-slate-300 p-2">
                                <InputField
                                  type="number"
                                  value={detalle.pruebas_porcentaje || ''}
                                  onChange={(e) =>
                                    updateDetalle(
                                      productoIndex,
                                      detalleIndex,
                                      'pruebas_porcentaje',
                                      e.target.value,
                                    )
                                  }
                                  disabled={isView}
                                  errorMode="border"
                                  error={
                                    error[
                                      `informe_producto.${productoIndex}.detalles.${detalleIndex}.pruebas_porcentaje`
                                    ]
                                  }
                                />
                              </td>
                              <td className="border border-slate-300 px-3 py-2 text-center font-semibold text-slate-700">
                                {getTotalDetalleTurno(detalle).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-white p-4 shadow ring-1 ring-slate-200">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">
                    Resumen total de producción
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-3 py-2 text-left">
                          Concepto
                        </th>
                        {totalesPrimeraSegunda.resumenPorTurno.map((item) => (
                          <th
                            key={item.turno_id}
                            className="border border-slate-300 px-3 py-2 text-center"
                          >
                            {item.turno_label}
                          </th>
                        ))}
                        <th className="border border-slate-300 px-3 py-2 text-center">
                          Total general
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2 font-semibold text-slate-800">
                          Primera
                        </td>
                        {totalesPrimeraSegunda.resumenPorTurno.map((item) => (
                          <td
                            key={`primera-${item.turno_id}`}
                            className="border border-slate-300 px-3 py-2 text-center font-semibold text-slate-700"
                          >
                            {item.primera.toFixed(2)}
                          </td>
                        ))}
                        <td className="border border-slate-300 px-3 py-2 text-center font-bold text-blue-800">
                          {totalesPrimeraSegunda.totalGeneralPrimera.toFixed(2)}
                        </td>
                      </tr>

                      <tr>
                        <td className="border border-slate-300 px-3 py-2 font-semibold text-slate-800">
                          Segunda
                        </td>
                        {totalesPrimeraSegunda.resumenPorTurno.map((item) => (
                          <td
                            key={`segunda-${item.turno_id}`}
                            className="border border-slate-300 px-3 py-2 text-center font-semibold text-slate-700"
                          >
                            {item.segunda.toFixed(2)}
                          </td>
                        ))}
                        <td className="border border-slate-300 px-3 py-2 text-center font-bold text-amber-700">
                          {totalesPrimeraSegunda.totalGeneralSegunda.toFixed(2)}
                        </td>
                      </tr>

                      <tr className="bg-emerald-50">
                        <td className="border border-slate-300 px-3 py-2 font-bold text-slate-900">
                          Total primera + segunda
                        </td>
                        {totalesPrimeraSegunda.resumenPorTurno.map((item) => (
                          <td
                            key={`total-${item.turno_id}`}
                            className="border border-slate-300 px-3 py-2 text-center font-bold text-emerald-800"
                          >
                            {item.total_primera_segunda.toFixed(2)}
                          </td>
                        ))}
                        <td className="border border-slate-300 px-3 py-2 text-center font-extrabold text-emerald-900">
                          {totalesPrimeraSegunda.totalGeneralPrimeraSegunda.toFixed(
                            2,
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total primera
                    </p>
                    <p className="mt-2 text-2xl font-bold text-blue-800">
                      {totalesPrimeraSegunda.totalGeneralPrimera.toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total segunda
                    </p>
                    <p className="mt-2 text-2xl font-bold text-amber-700">
                      {totalesPrimeraSegunda.totalGeneralSegunda.toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total primera + segunda
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-800">
                      {totalesPrimeraSegunda.totalGeneralPrimeraSegunda.toFixed(
                        2,
                      )}
                    </p>
                  </div>
                </div>
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
