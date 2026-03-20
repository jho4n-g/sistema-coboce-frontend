import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

import InputField from '@components/InputField';

import { FechasOmsServices as services } from '../../../../service/OficinaMedica/FechasOms.services.js';
import { FechasOmsschema as schema } from '../../../../schema/OficinaMedica/FechasOms.schema.js';

const initialForm = () => ({
  dia: '',
  mes: '',
  titulo: '',
  descripcion: '',
});

const IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
];
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

export default function PoliticaModal({
  open,
  onClose,
  fetchById,
  isEditing,
  id,
  onSave,
}) {
  const [form, setForm] = useState(initialForm());
  const [imageFile, setImageFile] = useState(null);

  const [error, setError] = useState({});
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageVersion, setImageVersion] = useState(Date.now());

  const [loading, setLoading] = useState(false);

  const title = isEditing ? 'Edición del documento' : 'Nuevo documento';

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  useEffect(() => {
    if (!open) {
      setForm(initialForm());
      setImageFile(null);

      setImagePreviewUrl(null);
      setError({});
      setLoading(false);
      setImageVersion(Math.floor(10000 + Math.random() * 90000));
      return;
    }

    if (!isEditing) {
      setForm(initialForm());
      setImageFile(null);

      setImagePreviewUrl(null);
      setError({});
      setImageVersion(Math.floor(10000 + Math.random() * 90000));
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
          setForm(data.dato ?? initialForm());
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

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!IMAGE_TYPES.includes(f.type)) {
      toast.error('Solo se permiten imágenes PNG, JPG, JPEG, WEBP o SVG');
      return;
    }

    setImageFile(f);
  };

  const closeModal = () => {
    setForm(initialForm());
    setImageFile(null);

    setImagePreviewUrl(null);
    setError({});
    onClose();
  };

  const validate = () => {
    const result = schema.safeParse(form);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return null;
    }

    if (!isEditing && !imageFile) {
      toast.error('Debe subir una imagen');
      return null;
    }

    if (imageFile && !IMAGE_TYPES.includes(imageFile.type)) {
      toast.error('La imagen no tiene un formato válido');
      return null;
    }

    return result.data;
  };

  const handleCreate = async () => {
    const parsed = validate();
    if (!parsed) return;

    onSave({ ...parsed, imageFile });
  };

  const handleUpdate = async () => {
    const parsed = validate();
    if (!parsed) return;

    onSave({ ...parsed, imageFile });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : closeModal}
      />

      <div className="relative z-10 max-h-[calc(100vh-2rem)] w-[92%] max-w-7xl overflow-y-auto rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        {/* Header */}
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

        {/* Content */}
        <div className="px-5 py-5">
          {/* Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-2">
                <InputField
                  label="dia"
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

              <div className="md:col-span-12">
                <InputField
                  label="Titulo"
                  name="titulo"
                  value={form?.titulo || ''}
                  onChange={updateBase}
                  error={error.titulo}
                />
              </div>

              <div className="md:col-span-12">
                <InputField
                  label="Descripción"
                  name="descripcion"
                  value={form?.descripcion || ''}
                  onChange={updateBase}
                  error={error.descripcion}
                />
              </div>

              {/* Upload Imagen */}
              <div className="md:col-span-6">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <ArrowUpTrayIcon className="h-5 w-5" />
                  {imageFile ? 'Cambiar imagen' : 'Subir imagen'}
                  <input
                    hidden
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={handleImageChange}
                  />
                </label>

                {imageFile && (
                  <p className="mt-2 text-sm text-slate-600">
                    Imagen seleccionada: <strong>{imageFile.name}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preview Imagen */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-900">
              Vista previa de la imagen
            </p>

            {isEditing ? (
              imagePreviewUrl ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img
                    src={imagePreviewUrl}
                    alt="Vista previa imagen"
                    className="h-72 w-full object-contain bg-slate-100"
                  />
                </div>
              ) : services?.getImageUrl ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img
                    src={services.getImageUrl(id, imageVersion)}
                    alt="Imagen actual"
                    className="h-72 w-full object-contain bg-slate-100"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 text-center">
                  <p className="text-sm text-slate-600">
                    No se configuró
                    <strong>services.getImagenUrl</strong> para mostrar la
                    imagen actual del servidor.
                  </p>
                </div>
              )
            ) : imagePreviewUrl ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <img
                  src={imagePreviewUrl}
                  alt="Vista previa imagen"
                  className="h-72 w-full object-contain bg-slate-100"
                />
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 text-center">
                <p className="text-sm text-slate-600">
                  Aún no has seleccionado ninguna imagen. Usa{' '}
                  <strong>“Subir imagen”</strong> para adjuntarla.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
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
      </div>
    </div>
  );
}
