import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

import PdfPreviewTW from '@components/PdfPreviewTW';
import InputField from '@components/InputField';

import { InsumosServices as services } from '../../../../../service/GestionVaon//ProduccionImportado/Insumo.services.js';
import { InusmosSchema as schema } from '@schema/gestionVaon/ProduccionImportado/Insumos.schema.js';

const initialForm = () => ({
  periodo: '',
  productos_nombres: '',
  metros_cuadrados: '',
  consumo_bs: '',
  documentos: [],
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
  const [files, setFiles] = useState([]);
  const [error, setError] = useState({});
  const [previewUrls, setPreviewUrls] = useState([]);
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
      setFiles([]);
      setPreviewUrls([]);
      setError({});
      setLoading(false);
      return;
    }

    if (!isEditing) {
      setForm(initialForm());
      setFiles([]);
      setPreviewUrls([]);
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
            documentos: data?.dato?.documentos ?? [],
          });
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
    if (!files.length) {
      setPreviewUrls([]);
      return;
    }

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const validFiles = [];

    for (const file of selectedFiles) {
      if (file.type !== 'application/pdf') {
        toast.error(`El archivo ${file.name} no es un PDF`);
        continue;
      }

      validFiles.push(file);
    }

    setFiles(validFiles);
  };

  const removeSelectedFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const closeModal = () => {
    setForm(initialForm());
    setFiles([]);
    setPreviewUrls([]);
    setError({});
    onClose();
  };

  const validate = () => {
    const payloadToValidate = {
      periodo: form.periodo,
      productos_nombres: form.productos_nombres,
      metros_cuadrados: form.metros_cuadrados,
      consumo_bs: form.consumo_bs,
    };

    const result = schema.safeParse(payloadToValidate);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return null;
    }

    if (!isEditing && files.length === 0) {
      toast.error('Debe subir al menos un documento PDF');
      return null;
    }

    return result.data;
  };

  const handleCreate = async () => {
    const parsed = validate();
    if (!parsed) return;

    onSave({ ...parsed, files });
  };

  const handleUpdate = async () => {
    const parsed = validate();
    if (!parsed) return;

    onSave({ ...parsed, files });
  };

  const handleDownloadDocumento = async (
    documentoId,
    nombre = 'documento.pdf',
  ) => {
    const res = await services.downloadDocumento(documentoId);

    if (!res?.ok) {
      toast.error(res?.message || 'No se pudo descargar el documento');
      return;
    }

    const url = window.URL.createObjectURL(res.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const documentosGuardados = form?.documentos ?? [];
  const showingNewFiles = previewUrls.length > 0;

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

              <div className="md:col-span-7">
                <InputField
                  label="Productos"
                  name="productos_nombres"
                  type="text"
                  value={form?.productos_nombres || ''}
                  onChange={updateBase}
                  error={error.productos_nombres}
                />
              </div>

              <div className="md:col-span-7">
                <InputField
                  label="Metros²"
                  name="metros_cuadrados"
                  type="number"
                  value={form?.metros_cuadrados || ''}
                  onChange={updateBase}
                  error={error.metros_cuadrados}
                />
              </div>

              <div className="md:col-span-3">
                <InputField
                  label="Precio total"
                  name="consumo_bs"
                  type="number"
                  value={form?.consumo_bs || ''}
                  onChange={updateBase}
                  error={error.consumo_bs}
                />
              </div>

              <div className="md:col-span-6">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <ArrowUpTrayIcon className="h-5 w-5" />
                  {files.length > 0 ? 'Cambiar PDFs' : 'Subir PDFs'}
                  <input
                    hidden
                    type="file"
                    multiple
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </label>

                {files.length > 0 && (
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    {files.map((file, i) => (
                      <div
                        key={`${file.name}-${i}`}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <p className="truncate">
                          {i + 1}. <strong>{file.name}</strong>
                        </p>

                        <button
                          type="button"
                          onClick={() => removeSelectedFile(i)}
                          className="ml-3 rounded-lg p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                          aria-label={`Quitar ${file.name}`}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-900">
              Vista previa de los documentos
            </p>

            {showingNewFiles ? (
              <div className="grid gap-4 md:grid-cols-2">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="border-b border-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                      {files[index]?.name || `PDF ${index + 1}`}
                    </div>

                    <div className="h-96">
                      <iframe
                        src={url}
                        title={`Vista previa PDF ${index + 1}`}
                        className="h-full w-full border-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : isEditing && documentosGuardados.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {documentosGuardados.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
                      <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-700">
                        <DocumentTextIcon className="h-5 w-5 shrink-0" />
                        <span className="truncate">Documento {index + 1}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadDocumento(
                            doc.id,
                            `documento-${doc.id}.pdf`,
                          )
                        }
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Descargar
                      </button>
                    </div>

                    <div className="h-96">
                      <PdfPreviewTW
                        documentoId={doc.id}
                        getDocument={services.viewDocumento}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 text-center">
                <p className="text-sm text-slate-600">
                  Aún no has seleccionado ningún PDF. Usa{' '}
                  <strong>“Subir PDFs”</strong> para adjuntar documentos.
                </p>
              </div>
            )}
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
