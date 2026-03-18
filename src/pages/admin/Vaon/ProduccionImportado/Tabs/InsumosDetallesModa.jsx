import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

import PdfPreviewTW from '@components/PdfPreviewTW';
import { InsumosServices as services } from '../../../../../service/GestionVaon/ProduccionImportado/Insumo.services.js';

const initialData = () => ({
  periodo: '',
  productos_nombres: '',
  metros_cuadrados: '',
  consumo_bs: '',
  documentos: [],
});

export default function InsumoDetallesModal({ open, onClose, fetchById, id }) {
  const [data, setData] = useState(initialData());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setData(initialData());
      setLoading(false);
      return;
    }

    if (!id) return;

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetchById(id);

        if (!active) return;

        if (res?.ok) {
          setData({
            ...initialData(),
            ...(res.dato ?? {}),
            documentos: res?.dato?.documentos ?? [],
          });
        } else {
          toast.error(res?.message || 'No se pudo cargar el documento');
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
  }, [open, id, fetchById]);

  const closeModal = () => {
    if (loading) return;
    setData(initialData());
    onClose();
  };

  const handleDownload = async (documentoId, nombre = 'documento.pdf') => {
    try {
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
    } catch (e) {
      toast.error(e?.message || 'Error al descargar el documento');
    }
  };

  const documentos = data?.documentos ?? [];

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
          <h3 className="text-lg font-extrabold text-slate-900">
            Lectura del documento
          </h3>

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
          {/* Datos */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Periodo
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {data?.periodo || 'Sin periodo'}
                </div>
              </div>

              <div className="md:col-span-7">
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Productos
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {data?.productos_nombres || 'Sin producto'}
                </div>
              </div>

              <div className="md:col-span-7">
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Metros²
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {data?.metros_cuadrados || 'Sin dato'}
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Precio total mensual
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {data?.consumo_bs || 'Sin dato'}
                </div>
              </div>
            </div>
          </div>

          {/* Vista previa */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-900">
              Documentos asociados
            </p>

            {documentos.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {documentos.map((doc, index) => (
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
                          handleDownload(doc.id, `documento-${doc.id}.pdf`)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
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
                  Este registro no tiene documentos PDF asociados.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cerrar ventana
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-white/75 backdrop-blur">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <p className="text-sm font-semibold text-slate-800">
                Cargando documento…
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
