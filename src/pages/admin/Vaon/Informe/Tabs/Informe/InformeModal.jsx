import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

import InputField from '@components/InputField';

import { InformeSchema as schema } from '@schema/gestionVaon/Informe/InformeVaon.schema.js';
import { getFormato } from '@service/Produccion/Secciones/Formato.services.js';
import Select from '@components/Select';

const initialForm = () => ({
  periodo: '',
  metros_formato: '',
});

export default function InsumoModal({
  open,
  onClose,
  fetchById,
  isEditing,
  id,
  onSave,
}) {
  const [form, setForm] = useState(initialForm());
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [formatoId, setFormatoId] = useState(null);
  const [formatoErrorId, setFormatoErrorId] = useState(null);

  const title = isEditing ? 'Edición del documento' : 'Nuevo documento';

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  useEffect(() => {
    if (!open) {
      setForm(initialForm());
      setFormatoId(null);
      setFormatoErrorId(null);
      setError({});
      setLoading(false);
      return;
    }

    if (!isEditing) {
      setForm(initialForm());
      setFormatoId(null);
      setFormatoErrorId(null);
      setError({});
    }
  }, [open, isEditing]);

  useEffect(() => {
    if (!open || !id || !isEditing) return;

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const data = await fetchById(id);

        if (!active) return;

        if (data?.ok) {
          setForm({
            ...initialForm(),
            ...(data.dato ?? {}),
          });
          setFormatoId(data?.dato?.formato_id ?? '');
        } else {
          toast.error(data?.message || 'No se pudo cargar el registro');
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
  }, [open, id, isEditing, fetchById]);

  const closeModal = () => {
    setForm(initialForm());

    setError({});
    onClose();
  };

  const validate = (payload) => {
    if (!formatoId) {
      setFormatoErrorId('Selecciona un formato');
    } else {
      setFormatoErrorId('');
    }
    const result = schema.safeParse(payload);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return null;
    }
    const dataValidated = result.data;

    return { formato_id: formatoId, ...dataValidated };
  };

  const handleCreate = async () => {
    const parsed = validate(form);
    if (!parsed) return;

    onSave(parsed);
  };

  const handleUpdate = async () => {
    const parsed = validate(form);
    if (!parsed) return;

    onSave(parsed);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : closeModal}
      />

      <div className="relative z-10 max-h-[calc(100vh-2rem)] w-[92%] max-w-7xl overflow-y-auto rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>

          <button
            type="button"
            onClick={loading ? undefined : closeModal}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-2">
                <InputField
                  label="Periodo"
                  type="month"
                  name="periodo"
                  value={form?.periodo || ''}
                  onChange={updateBase}
                  error={error.periodo}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-3">
                <Select
                  label="Formato"
                  value={formatoId}
                  onChange={(v) => {
                    setFormatoId(v);
                    setFormatoErrorId('');
                  }}
                  placeholder="Selecciona un Formato"
                  getDatos={getFormato}
                  error={formatoErrorId}
                />
              </div>

              <div className="md:col-span-3">
                <InputField
                  label="Metros cuadrados [m²]"
                  name="metros_formato"
                  type="number"
                  value={form?.metros_formato || ''}
                  onChange={updateBase}
                  error={error.metros_formato}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cerrar ventana
            </button>

            {isEditing ? (
              <button
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                className="rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Actualizar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreate}
                disabled={loading}
                className="rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Guardar
              </button>
            )}
          </div>
        </div>

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
      </div>
    </div>
  );
}
