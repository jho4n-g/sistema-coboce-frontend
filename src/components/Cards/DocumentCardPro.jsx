import React, { useEffect, useMemo, useState } from 'react';
import { normalizarFecha } from '../../helpers/normalze.helpers.js';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  TagIcon,
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

  const isProcedimiento = useMemo(() => {
    return normalizedTipo === 'procedimiento';
  }, [normalizedTipo]);

  const closePdfModal = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setPdfTitle('');
  };

  useEffect(() => {
    let active = true;
    let objectUrl = null;

    const loadImage = async () => {
      try {
        setImageUrl(coverUrl);

        if (!id || !services) return;

        let res = null;

        if (isProcedimiento) {
          if (typeof services?.imgPr === 'function') {
            res = await services.imgPr(id);
          }
        } else {
          if (typeof services?.image === 'function') {
            res = await services.image(id);
          }
        }

        if (!active) return;

        if (res?.ok && res?.blob) {
          objectUrl = URL.createObjectURL(res.blob);
          setImageUrl(objectUrl);
        } else {
          setImageUrl(coverUrl);
        }
      } catch (error) {
        toast.error(error?.message || 'Error');
        if (active) setImageUrl(coverUrl);
      }
    };

    loadImage();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, isProcedimiento, coverUrl, services]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleViewDocument = async () => {
    try {
      if (!services) throw new Error('Servicios no disponibles');

      let res;

      if (isProcedimiento) {
        if (typeof services?.docPr !== 'function') {
          throw new Error(`Tipo no soportado: ${tipo}`);
        }
        res = await services.docPr(id);
      } else {
        if (typeof services?.doc !== 'function') {
          throw new Error(`Tipo no soportado: ${tipo}`);
        }
        res = await services.doc(id);
      }

      if (!res?.ok || !res?.blob) {
        throw new Error(res?.message || 'No se pudo abrir el documento');
      }

      if (pdfUrl) URL.revokeObjectURL(pdfUrl);

      const url = URL.createObjectURL(res.blob);
      setPdfUrl(url);
      setPdfTitle(titulo || 'Documento');
    } catch (error) {
      toast.error(error?.message || 'Error al querer ver el documento');
    }
  };

  const handleDownloadDocument = async () => {
    try {
      if (!services) throw new Error('Servicios no disponibles');

      let res;

      if (isProcedimiento) {
        if (typeof services?.docPr !== 'function') {
          throw new Error(`Tipo no soportado para descarga: ${tipo}`);
        }
        res = await services.docPr(id);
      } else {
        if (typeof services?.doc !== 'function') {
          throw new Error(`Tipo no soportado para descarga: ${tipo}`);
        }
        res = await services.doc(id);
      }

      if (!res) throw new Error('No se pudo descargar el documento');

      if (typeof res === 'string') {
        window.open(res, '_blank');
        return;
      }

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
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Error al descargar el documento');
    }
  };

  return (
    <>
      <article className="group relative w-full overflow-hidden rounded-[2rem] border border-slate-200/10 bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div className="relative h-[320px] w-full overflow-hidden md:h-[360px]">
          <img
            src={imageUrl}
            alt={`Portada de ${titulo || 'documento'}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/55 to-slate-900/15" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-transparent to-slate-900/10" />

          <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="absolute left-5 top-5 z-10">
            <div className="flex gap-2">
              {fecha && (
                <p className="mt-2 inline-flex rounded-full border border-sky-200/20 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white">
                  {normalizarFecha(fecha)}
                </p>
              )}

              {tipo && (
                <span className="mt-2 inline-flex rounded-full border border-sky-200/20 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white">
                  {tipo}
                </span>
              )}
            </div>
          </div>

          <div className="absolute inset-0 z-10 flex items-end p-5 md:p-8">
            <div className="w-full max-w-2xl">
              <h3 className="min-h-18 line-clamp-2 text-2xl font-extrabold leading-tight text-white">
                {titulo}
              </h3>

              <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/78">
                {descripcion || 'Sin descripción.'}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {codigo && (
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                    Código: {codigo}
                  </span>
                )}
                {area && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    {area}
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleViewDocument}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  Ver documento
                </button>

                <button
                  type="button"
                  onClick={handleDownloadDocument}
                  disabled={downloading}
                  className={[
                    'inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold backdrop-blur-sm transition duration-200',
                    downloading
                      ? 'cursor-not-allowed border-white/10 bg-white/10 text-white/50'
                      : 'border-white/20 bg-white/10 text-white hover:-translate-y-0.5 hover:bg-white/15',
                  ].join(' ')}
                >
                  {downloading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                  ) : (
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  )}
                  {downloading ? 'Descargando...' : 'Descargar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-5">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closePdfModal}
          />

          <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-slate-200/10 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 md:px-5">
              <div className="min-w-0">
                <h3 className="truncate pr-4 text-sm font-semibold text-slate-800 md:text-base">
                  {pdfTitle}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Vista previa del documento
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                onClick={closePdfModal}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <iframe
              src={pdfUrl}
              title={pdfTitle}
              className="h-[78vh] w-full bg-slate-100"
            />
          </div>
        </div>
      )}
    </>
  );
}
