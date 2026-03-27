import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
// import { informeSchema } from '../../../../schema/Produccion/Informe.schema.js';

const CALIDADES_FIJAS = [
  { id: 1, nombre: 'Primera' },
  { id: 2, nombre: 'Segunda' },
  { id: 3, nombre: 'Tercera' },
  { id: 4, nombre: 'Casco' },
  { id: 5, nombre: 'Pruebas' },
];

const TURNOS_FIJOS = [1, 2, 3];

const createFilaCalidad = (calidad) => ({
  calidad_id: calidad.id,
  calidad_nombre: calidad.nombre,

  turno_1_m2: '',
  turno_1_pct: '',

  turno_2_m2: '',
  turno_2_pct: '',

  turno_3_m2: '',
  turno_3_pct: '',
});

const createProductoBlock = () => ({
  producto_id: '',
  filas: CALIDADES_FIJAS.map(createFilaCalidad),
});

const createPrensaInicial = () => [
  {
    turno_id: 1,
    silo_utilizado: '',
    arcilla_consumida: '',
    ciclos: '',
    peso_pieza: '',
    perdida: '',
  },
  {
    turno_id: 2,
    silo_utilizado: '',
    arcilla_consumida: '',
    ciclos: '',
    peso_pieza: '',
    perdida: '',
  },
  {
    turno_id: 3,
    silo_utilizado: '',
    arcilla_consumida: '',
    ciclos: '',
    peso_pieza: '',
    perdida: '',
  },
];

const initialForm = () => ({
  dia_id: '',
  supervisor: '',
  prensa: createPrensaInicial(),
  horno: [createProductoBlock()],
  rectificado: [createProductoBlock()],
});

function TextInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  error,
  placeholder,
  className = '',
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
          error
            ? 'border-red-500 focus:border-red-600'
            : 'border-slate-300 focus:border-slate-500'
        } ${className}`}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function SelectInput({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  placeholder = 'Seleccione',
  className = '',
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
          error
            ? 'border-red-500 focus:border-red-600'
            : 'border-slate-300 focus:border-slate-500'
        } ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((i) => (
          <option key={i.value} value={i.value}>
            {i.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function NumberCell({ value, onChange, placeholder = '' }) {
  return (
    <input
      type="number"
      step="any"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full min-w-20 rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-slate-500"
    />
  );
}

function ProduccionPrensaTable({ data, setData }) {
  const handleChange = (index, field, value) => {
    const copy = [...data];
    copy[index] = { ...copy[index], [field]: value };
    setData(copy);
  };

  return (
    <section className="rounded-xl border border-slate-300 bg-white">
      <div className="border-b border-slate-300 px-4 py-3">
        <h4 className="text-base font-semibold text-slate-800">
          1. Producción Prensa
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="border border-slate-300 p-2">Dato</th>
              <th className="border border-slate-300 p-2">Turno 1</th>
              <th className="border border-slate-300 p-2">Turno 2</th>
              <th className="border border-slate-300 p-2">Turno 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 p-2 font-medium">
                Silo utilizado
              </td>
              {data.map((item, index) => (
                <td
                  key={`silo-${index}`}
                  className="border border-slate-300 p-2"
                >
                  <TextInput
                    value={item.silo_utilizado}
                    onChange={(e) =>
                      handleChange(index, 'silo_utilizado', e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="border border-slate-300 p-2 font-medium">
                Arcilla consumida
              </td>
              {data.map((item, index) => (
                <td
                  key={`arcilla-${index}`}
                  className="border border-slate-300 p-2"
                >
                  <TextInput
                    type="number"
                    value={item.arcilla_consumida}
                    onChange={(e) =>
                      handleChange(index, 'arcilla_consumida', e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="border border-slate-300 p-2 font-medium">
                Ciclos
              </td>
              {data.map((item, index) => (
                <td
                  key={`ciclos-${index}`}
                  className="border border-slate-300 p-2"
                >
                  <TextInput
                    type="number"
                    value={item.ciclos}
                    onChange={(e) =>
                      handleChange(index, 'ciclos', e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="border border-slate-300 p-2 font-medium">
                Peso pieza
              </td>
              {data.map((item, index) => (
                <td
                  key={`peso-${index}`}
                  className="border border-slate-300 p-2"
                >
                  <TextInput
                    type="number"
                    value={item.peso_pieza}
                    onChange={(e) =>
                      handleChange(index, 'peso_pieza', e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="border border-slate-300 p-2 font-medium">
                Pérdida
              </td>
              {data.map((item, index) => (
                <td
                  key={`perdida-${index}`}
                  className="border border-slate-300 p-2"
                >
                  <TextInput
                    type="number"
                    value={item.perdida}
                    onChange={(e) =>
                      handleChange(index, 'perdida', e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProduccionProcesoTable({
  title,
  productosState,
  setProductosState,
  productosOptions,
}) {
  const productosMap = useMemo(() => {
    const map = new Map();
    productosOptions.forEach((p) => map.set(String(p.id), p.nombre));
    return map;
  }, [productosOptions]);

  const handleProductoChange = (index, value) => {
    const copy = [...productosState];
    copy[index].producto_id = value;
    setProductosState(copy);
  };

  const handleCellChange = (productoIndex, filaIndex, field, value) => {
    const copy = [...productosState];
    copy[productoIndex].filas[filaIndex][field] = value;
    setProductosState(copy);
  };

  const addProducto = () => {
    setProductosState((prev) => [...prev, createProductoBlock()]);
  };

  const removeProducto = (index) => {
    setProductosState((prev) => prev.filter((_, i) => i !== index));
  };

  const calcularTotalM2 = (fila) => {
    return (
      Number(fila.turno_1_m2 || 0) +
      Number(fila.turno_2_m2 || 0) +
      Number(fila.turno_3_m2 || 0)
    );
  };

  const calcularPromedioPct = (fila) => {
    const valores = [fila.turno_1_pct, fila.turno_2_pct, fila.turno_3_pct]
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v) && v > 0);

    if (!valores.length) return '';
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
  };

  return (
    <section className="rounded-xl border border-slate-300 bg-white">
      <div className="flex items-center justify-between border-b border-slate-300 px-4 py-3">
        <h4 className="text-base font-semibold text-slate-800">{title}</h4>

        <button
          type="button"
          onClick={addProducto}
          className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Agregar producto
        </button>
      </div>

      <div className="space-y-6 p-4">
        {productosState.map((producto, productoIndex) => (
          <div
            key={productoIndex}
            className="overflow-hidden rounded-lg border border-slate-300"
          >
            <div className="flex flex-col gap-3 border-b border-slate-300 bg-slate-50 px-4 py-3 md:flex-row md:items-end md:justify-between">
              <div className="w-full md:max-w-md">
                <SelectInput
                  label="Producto"
                  value={producto.producto_id}
                  onChange={(e) =>
                    handleProductoChange(productoIndex, e.target.value)
                  }
                  options={productosOptions.map((p) => ({
                    value: p.id,
                    label: p.nombre,
                  }))}
                />
              </div>

              <button
                type="button"
                onClick={() => removeProducto(productoIndex)}
                className="rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
                disabled={productosState.length === 1}
              >
                Eliminar producto
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th
                      rowSpan="2"
                      className="border border-slate-300 p-2 text-center"
                    >
                      PRODUCTO
                    </th>
                    <th
                      rowSpan="2"
                      className="border border-slate-300 p-2 text-center"
                    >
                      CALIDAD
                    </th>
                    <th
                      colSpan="2"
                      className="border border-slate-300 p-2 text-center"
                    >
                      TURNO 1
                    </th>
                    <th
                      colSpan="2"
                      className="border border-slate-300 p-2 text-center"
                    >
                      TURNO 2
                    </th>
                    <th
                      colSpan="2"
                      className="border border-slate-300 p-2 text-center"
                    >
                      TURNO 3
                    </th>
                    <th
                      colSpan="2"
                      className="border border-slate-300 p-2 text-center"
                    >
                      TOTAL
                    </th>
                  </tr>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-300 p-2 text-center">
                      m²
                    </th>
                    <th className="border border-slate-300 p-2 text-center">
                      %
                    </th>
                    <th className="border border-slate-300 p-2 text-center">
                      m²
                    </th>
                    <th className="border border-slate-300 p-2 text-center">
                      %
                    </th>
                    <th className="border border-slate-300 p-2 text-center">
                      m²
                    </th>
                    <th className="border border-slate-300 p-2 text-center">
                      %
                    </th>
                    <th className="border border-slate-300 p-2 text-center">
                      m²
                    </th>
                    <th className="border border-slate-300 p-2 text-center">
                      %
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {producto.filas.map((fila, filaIndex) => (
                    <tr key={fila.calidad_id}>
                      {filaIndex === 0 && (
                        <td
                          rowSpan={producto.filas.length}
                          className="border border-slate-300 p-2 align-top font-semibold"
                        >
                          {productosMap.get(String(producto.producto_id)) ||
                            '—'}
                        </td>
                      )}

                      <td className="border border-slate-300 p-2 font-medium">
                        {fila.calidad_nombre}
                      </td>

                      <td className="border border-slate-300 p-1">
                        <NumberCell
                          value={fila.turno_1_m2}
                          onChange={(e) =>
                            handleCellChange(
                              productoIndex,
                              filaIndex,
                              'turno_1_m2',
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="border border-slate-300 p-1">
                        <NumberCell
                          value={fila.turno_1_pct}
                          onChange={(e) =>
                            handleCellChange(
                              productoIndex,
                              filaIndex,
                              'turno_1_pct',
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td className="border border-slate-300 p-1">
                        <NumberCell
                          value={fila.turno_2_m2}
                          onChange={(e) =>
                            handleCellChange(
                              productoIndex,
                              filaIndex,
                              'turno_2_m2',
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="border border-slate-300 p-1">
                        <NumberCell
                          value={fila.turno_2_pct}
                          onChange={(e) =>
                            handleCellChange(
                              productoIndex,
                              filaIndex,
                              'turno_2_pct',
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td className="border border-slate-300 p-1">
                        <NumberCell
                          value={fila.turno_3_m2}
                          onChange={(e) =>
                            handleCellChange(
                              productoIndex,
                              filaIndex,
                              'turno_3_m2',
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="border border-slate-300 p-1">
                        <NumberCell
                          value={fila.turno_3_pct}
                          onChange={(e) =>
                            handleCellChange(
                              productoIndex,
                              filaIndex,
                              'turno_3_pct',
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td className="border border-slate-300 p-2 text-center font-medium">
                        {calcularTotalM2(fila)}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-medium">
                        {calcularPromedioPct(fila)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function buildDetallePayload(productosState, procesoId) {
  const result = [];

  productosState.forEach((producto) => {
    producto.filas.forEach((fila) => {
      TURNOS_FIJOS.forEach((turnoId) => {
        const metrosKey = `turno_${turnoId}_m2`;
        const porcentajeKey = `turno_${turnoId}_pct`;

        const metros = fila[metrosKey];
        const porcentaje = fila[porcentajeKey];

        const tieneDato =
          String(metros ?? '').trim() !== '' ||
          String(porcentaje ?? '').trim() !== '';

        if (tieneDato && String(producto.producto_id).trim() !== '') {
          result.push({
            producto_id: Number(producto.producto_id),
            proceso_id: Number(procesoId),
            turno_id: Number(turnoId),
            calidad_id: Number(fila.calidad_id),
            metros_cuadrados:
              String(metros ?? '').trim() === '' ? undefined : Number(metros),
            porcentaje:
              String(porcentaje ?? '').trim() === ''
                ? undefined
                : Number(porcentaje),
          });
        }
      });
    });
  });

  return result;
}

function mapDetallesToProceso(detalles, procesoId) {
  const filtrados = detalles.filter(
    (d) => Number(d.proceso_id) === Number(procesoId),
  );

  if (!filtrados.length) return [createProductoBlock()];

  const productosAgrupados = new Map();

  filtrados.forEach((item) => {
    const key = String(item.producto_id);

    if (!productosAgrupados.has(key)) {
      productosAgrupados.set(key, {
        producto_id: item.producto_id,
        filas: CALIDADES_FIJAS.map(createFilaCalidad),
      });
    }

    const bloque = productosAgrupados.get(key);
    const fila = bloque.filas.find(
      (f) => Number(f.calidad_id) === Number(item.calidad_id),
    );

    if (fila) {
      fila[`turno_${item.turno_id}_m2`] = item.metros_cuadrados ?? '';
      fila[`turno_${item.turno_id}_pct`] = item.porcentaje ?? '';
    }
  });

  const result = Array.from(productosAgrupados.values());

  if (!result.length) return [createProductoBlock()];

  return result;
}

export default function InformeProduccionModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
  isEdit = false,

  dias = [],
  productos = [],
  procesos = [],
}) {
  const [form, setForm] = useState(initialForm());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const title = isEdit
    ? 'Editar informe de producción'
    : 'Nuevo informe de producción';

  const procesoHorno = useMemo(
    () =>
      procesos.find((p) => String(p.nombre).toLowerCase().includes('horno'))
        ?.id ?? 1,
    [procesos],
  );

  const procesoRectificado = useMemo(
    () =>
      procesos.find((p) =>
        String(p.nombre).toLowerCase().includes('rectificado'),
      )?.id ?? 2,
    [procesos],
  );

  useEffect(() => {
    if (!open) {
      setForm(initialForm());
      setErrors({});
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !isEdit || !id || !fetchById) return;

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const resp = await fetchById(id);

        if (!active) return;

        const data = resp?.dato || resp;

        setForm({
          dia_id: data?.dia_id ?? data?.informe_dia?.id ?? '',
          supervisor: data?.supervisor ?? '',
          prensa:
            data?.informe_prensa?.length > 0
              ? TURNOS_FIJOS.map((turnoId) => {
                  const item = data.informe_prensa.find(
                    (p) => Number(p.turno_id) === Number(turnoId),
                  );

                  return {
                    turno_id: turnoId,
                    silo_utilizado: item?.silo_utilizado ?? '',
                    arcilla_consumida: item?.arcilla_consumida ?? '',
                    ciclos: item?.ciclos ?? '',
                    peso_pieza: item?.peso_pieza ?? '',
                    perdida: item?.perdida ?? '',
                  };
                })
              : createPrensaInicial(),
          horno: mapDetallesToProceso(
            data?.informe_detalle ?? [],
            procesoHorno,
            productos,
          ),
          rectificado: mapDetallesToProceso(
            data?.informe_detalle ?? [],
            procesoRectificado,
            productos,
          ),
        });
      } catch (error) {
        toast.error(error?.message || 'No se pudo cargar el informe');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [
    open,
    isEdit,
    id,
    fetchById,
    procesoHorno,
    procesoRectificado,
    productos,
  ]);

  if (!open) return null;

  const updateBase = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setForm(initialForm());
    setErrors({});
    onClose();
  };

  const normalizePayload = () => {
    const detalles = [
      ...buildDetallePayload(form.horno, procesoHorno),
      ...buildDetallePayload(form.rectificado, procesoRectificado),
    ];

    return {
      dia_id: Number(form.dia_id),
      supervisor: form.supervisor,
      prensa: form.prensa.map((p) => ({
        turno_id: Number(p.turno_id),
        silo_utilizado: p.silo_utilizado,
        arcilla_consumida: Number(p.arcilla_consumida),
        ciclos: Number(p.ciclos),
        peso_pieza: Number(p.peso_pieza),
        perdida: Number(p.perdida),
      })),
      detalles,
    };
  };

  const handleSave = () => {
    try {
      const payload = normalizePayload();
      const result = payload;

      if (!result.success) {
        const firstError =
          result.error.issues?.[0]?.message || 'Datos inválidos';
        setErrors(result.error.flatten().fieldErrors);
        toast.error(firstError);
        return;
      }

      onSave(result.data);
    } catch (error) {
      toast.error(error?.message || 'Error al procesar datos');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative max-h-[95vh] w-[98vw] max-w-7xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {loading ? (
          <div className="grid h-[300px] place-items-center">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
              <p className="text-sm font-semibold text-slate-800">
                Cargando...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-300 bg-white px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-6 p-5">
              <section className="rounded-xl border border-slate-300 bg-white">
                <div className="border-b border-slate-300 px-4 py-3">
                  <h4 className="text-base font-semibold text-slate-800">
                    Cabecera del informe
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                  <SelectInput
                    label="Día"
                    value={form.dia_id}
                    onChange={(e) => updateBase('dia_id', e.target.value)}
                    options={dias.map((d) => ({
                      value: d.id,
                      label: d.fecha || d.nombre || `Día ${d.id}`,
                    }))}
                    error={errors?.dia_id?.[0]}
                  />

                  <TextInput
                    label="Supervisor"
                    value={form.supervisor}
                    onChange={(e) => updateBase('supervisor', e.target.value)}
                    error={errors?.supervisor?.[0]}
                  />
                </div>
              </section>
              <ProduccionPrensaTable
                data={form.prensa}
                setData={(newData) =>
                  setForm((prev) => ({ ...prev, prensa: newData }))
                }
              />
              <ProduccionProcesoTable
                title="2. Producción Horno - Selección y Embalaje"
                productosState={form.horno}
                setProductosState={(newData) =>
                  setForm((prev) => ({ ...prev, horno: newData }))
                }
                productosOptions={productos}
              />
              <ProduccionProcesoTable
                title="3. Producción Rectificado"
                productosState={form.rectificado}
                setProductosState={(newData) =>
                  setForm((prev) => ({ ...prev, rectificado: newData }))
                }
                productosOptions={productos}
              />
            </div>

            <div className="sticky bottom-0 z-20 flex justify-end gap-3 border-t border-slate-300 bg-white px-5 py-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
              >
                {isEdit ? 'Guardar cambios' : 'Guardar informe'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
