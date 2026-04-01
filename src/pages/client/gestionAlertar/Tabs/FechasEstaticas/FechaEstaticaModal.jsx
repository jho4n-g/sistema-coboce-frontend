import { useState, useEffect } from 'react';
import { FechasEstaticasSchema as schema } from '../../../../../schema/auth/FechasEstaticas.schema.js';
import InputField from '@components/InputField';
import { toast } from 'react-toastify';

const initialForm = () => ({
  titulo: '',
  descripcion: '',
  dia: '',
  mes: ',',
});
const meses = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];
export default function FrasesModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
  isEdit = false,
}) {
  const [form, setForm] = useState();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const title = isEdit ? 'Edición del registro' : 'Nueva registro';
  useEffect(() => {
    if (!open) {
      setForm(initialForm());
      setError({});
      setLoading(false);
      return;
    }

    if (!isEdit) {
      setForm(initialForm());
      setError({});
    }
  }, [open, isEdit]);

  useEffect(() => {
    if (!open || !id) return; // evita correr si no aplica

    let active = true; // evita setState tras unmount
    setLoading(true);

    // CREAR
    if (!isEdit) {
      setForm(initialForm());
      setError({});
      setLoading(false);
      return () => {
        active = false;
      };
    }

    // EDITAR
    if (!id) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    (async () => {
      try {
        const data = await fetchById(id); // ← ahora sí esperamos aquí

        if (!active) return;

        if (data?.ok) {
          setForm(data.dato ?? {});
        } else {
          toast.error(data?.message || 'No se pudo cargar el registro');
        }
      } catch (e) {
        if (active) toast.error(e?.message || 'Error del servidor');
      } finally {
        if (active) setLoading(false); // ← se apaga al terminar de verdadfi
      }
    })();

    return () => {
      active = false;
    };
  }, [open, id, fetchById, isEdit]);

  if (!open) return null;

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleValidation = async () => {
    const result = schema.safeParse(form);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      setError(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    } else {
      const data = result.data;

      handleSave(data);
    }
  };
  const handleSave = (payload) => {
    onSave(payload);
  };

  const handleClose = () => {
    setError({});
    setForm(initialForm());
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay (fondo) */}
      <div
        onClick={loading ? undefined : onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        className="relative z-10 w-3xl max-w-7xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
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
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            </div>

            <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-2">
              <div className="grid grid-cols-12 md:grid-cols-12 lg:grid-cols-12 gap-4 sm:gap-12">
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Dia"
                    type="number"
                    name="dia"
                    value={form?.dia || ''}
                    onChange={updateBase}
                    error={error.dia}
                  />
                </div>
                <div className="md:col-span-7">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Mes
                  </label>
                  <select
                    name="mes"
                    value={form.mes}
                    onChange={updateBase}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:border-sky-500"
                  >
                    <option value="">Seleccione un mes</option>
                    {meses.map((mes) => (
                      <option key={mes.value} value={mes.value}>
                        {mes.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-1 lg:col-span-12">
                  <InputField
                    label="Titulo"
                    type="text"
                    name="titulo"
                    value={form?.titulo || ''}
                    onChange={updateBase}
                    error={error.titulo}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-12">
                  <InputField
                    label="Descripcion"
                    type="text"
                    name="descripcion"
                    value={form?.descripcion || ''}
                    onChange={updateBase}
                    error={error.descripcion}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5">
              <button
                className="rounded-xl bg-red-800 px-3 py-2 text-white hover:bg-red-900"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button
                className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
                onClick={handleValidation}
              >
                {isEdit ? 'Guardar cambios' : 'Guardar registro'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
