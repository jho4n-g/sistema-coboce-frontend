import React, { useEffect, useMemo, useState } from 'react';
import { normalizarFecha } from '../../helpers/normalze.helpers.js';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function DocumentCard({
  id,
  fecha,
  titulo,
  codigo,
  revision,
  descripcion,
  area,
  tipo,
  coverUrl = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=60',
  downloading = false,
  services = null,
}) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfTitle, setPdfTitle] = useState('');
  const [imageUrl, setImageUrl] = useState(coverUrl);

  const normalizedTipo = useMemo(() => {
    return String(tipo || '')
      .trim()
      .toLowerCase();
  }, [tipo]);

  const closePdfModal = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setPdfTitle('');
  };
  useEffect(() => {
    let active = true;
    let objectUrl = null;

    const loadImage = async () => {
      try {
        if (!services?.image || !id) {
          setImageUrl(coverUrl);
          return;
        }

        let res;
        if (tipo == 'Procedimiento') {
          res = await services?.imgPr(id);
        } else {
          res = await services?.image(id);
        }

        if (!active) return;

        if (res?.ok && res?.blob) {
          objectUrl = URL.createObjectURL(res.blob);
          setImageUrl(objectUrl);
        } else {
          setImageUrl(coverUrl);
        }
      } catch (e) {
        console.error(e);
        if (active) setImageUrl(coverUrl);
      }
    };

    loadImage();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id, normalizedTipo, coverUrl, services, tipo]);
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleViewDocument = async () => {
    try {
      if (!services?.doc) {
        throw new Error(`Tipo no soportado: ${tipo}`);
      }

      let res;
      if (tipo == 'Procedimiento') {
        res = await services.docPr(id);
      } else {
        res = await services.doc(id);
      }

      if (!res?.ok || !res?.blob) {
        throw new Error(res?.message || 'No se pudo abrir el documento');
      }

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      const url = URL.createObjectURL(res.blob);
      setPdfUrl(url);
      setPdfTitle(titulo || 'Documento');
    } catch (e) {
      toast.error(e?.message || 'Error al querer ver el documento');
    }
  };

  const handleDownloadDocument = async () => {
    try {
      if (!services?.doc) {
        throw new Error(`Tipo no soportado para descarga: ${tipo}`);
      }

      let res;
      if (tipo == 'Procedimiento') {
        res = await services.docPr(id);
      } else {
        res = await services.doc(id);
      }

      if (!res) {
        throw new Error('No se pudo descargar el documento');
      }

      // Caso 1: si tu servicio devuelve una URL directa
      if (typeof res === 'string') {
        window.open(res, '_blank');
        return;
      }

      // Caso 2: si tu servicio devuelve { ok, blob, filename }
      if (res?.ok && res?.blob) {
        const url = URL.createObjectURL(res.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = res?.filename || `${titulo || 'documento'}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        return;
      }

      throw new Error(res?.message || 'Formato de descarga no válido');
    } catch (e) {
      console.error(e);
      toast.error(e?.message || 'Error al descargar el documento');
    }
  };

  return (
    <>
      <article className="group w-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-lg">
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={`Portada de ${titulo || 'documento'}`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            {tipo && (
              <span className="inline-flex items-center rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                {tipo}
              </span>
            )}
            {area && (
              <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm ring-1 ring-black/5">
                {area}
              </span>
            )}
          </div>

          {fecha && (
            <div className="absolute bottom-3 left-4">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm ring-1 ring-black/5">
                {normalizarFecha(fecha)}
              </span>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 pt-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-600">
            {codigo && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                Código: <span className="text-slate-900">{codigo}</span>
              </span>
            )}
            {revision && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                Rev: <span className="text-slate-900">{revision}</span>
              </span>
            )}
          </div>

          <h3 className="mt-3 line-clamp-2 text-lg font-extrabold leading-snug text-slate-900">
            {titulo}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm text-slate-600">
            {descripcion || 'Sin descripción.'}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={handleViewDocument}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-emerald-700 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 active:scale-[0.99]"
            >
              <DocumentTextIcon className="h-5 w-5" />
              Ver
            </button>

            <button
              type="button"
              onClick={handleDownloadDocument}
              disabled={downloading}
              className={[
                'inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 active:scale-[0.99]',
                downloading
                  ? 'cursor-not-allowed bg-emerald-300 text-white'
                  : 'bg-emerald-800 text-white hover:bg-emerald-900',
              ].join(' ')}
            >
              {downloading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/70 border-t-white" />
              ) : (
                <ArrowDownTrayIcon className="h-5 w-5" />
              )}
              {downloading ? 'Descargando' : 'Descargar'}
            </button>
          </div>
        </div>
      </article>

      {pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closePdfModal}
          />

          <div className="relative z-10 w-[95%] max-w-6xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">{pdfTitle}</h3>
              <button
                type="button"
                className="rounded-lg px-3 py-1 text-sm hover:bg-slate-100"
                onClick={closePdfModal}
              >
                Cerrar
              </button>
            </div>

            <iframe src={pdfUrl} title={pdfTitle} className="h-[80vh] w-full" />
          </div>
        </div>
      )}
    </>
  );
}
