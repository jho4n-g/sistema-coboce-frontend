import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { XMarkIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

import PdfPreviewTW from '../../../PdfPreviewTW';
import { ProcesosServices } from '../../../../../../service/Documentos/gestionCalidad/Procedimiento';

const initialData = () => ({
  fecha: '',
  titulo: '',
  codigo: '',
  descripcion: '',
  area: '',
});

export default function ProcedimientoDetallesModal({
  open,
  onClose,
  fetchById,
  id,
}) {
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
          setData(res.dato ?? initialData());
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

  const handleDownload = async () => {
    try {
      const res = await ProcesosServices.DownloadDocumento(id);

      if (!res?.ok) {
        toast.error(res?.message || 'No se pudo descargar el documento');
        return;
      }

      const url = window.URL.createObjectURL(res.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data?.titulo || 'documento'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e?.message || 'Error al descargar el documento');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : closeModal}
      />

      <div className="relative z-10 w-[92%] max-w-7xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 max-h-[calc(100vh-2rem)] overflow-y-auto">
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
                  Fecha
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {data?.fecha || 'Sin fecha'}
                </div>
              </div>

              <div className="md:col-span-7">
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Título
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {data?.titulo || 'Sin título'}
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Código
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {data?.codigo || 'Sin código'}
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Area
                </label>
                <div className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {data?.area || 'Sin area'}
                </div>
              </div>

              <div className="md:col-span-12">
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Descripción
                </label>
                <div className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {data?.descripcion || 'Sin descripción'}
                </div>
              </div>
            </div>
          </div>

          {/* Vista previa */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                Descargar PDF
              </button>
            </div>

            <PdfPreviewTW
              documentoId={id}
              getDocument={ProcesosServices.viewDocumeto}
            />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            Vista previa de la imagen
          </p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <img
              src={ProcesosServices.getImageUrl(
                id,
                Math.floor(10000 + Math.random() * 90000),
              )}
              alt="Imagen actual"
              className="h-72 w-full object-contain bg-slate-100"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
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
