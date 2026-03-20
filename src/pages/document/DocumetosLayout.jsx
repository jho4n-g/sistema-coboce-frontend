import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import LogoCeramica from '../../img/logo-ceramica-coboce.png';

import { NoticiaServices } from '../../service/Documentos/Noticia.services.js';
import Novedades from './TiposDocumentos/Novedades';

import { GeneralDocumentos } from '../../service/Documentos/GeneralDocumentos.services.js';
import { ComunicadoServices } from '../../service/Documentos/Comunicado.services.js';
import { PoliticaServices as PoliticaCalidad } from '../../service/Documentos/gestionCalidad/Politica.js';
import { ProcesosServices as ProcedimientoCalidad } from '../../service/Documentos/gestionCalidad/Procedimiento.js';
import { PoliticaServices as PoliticaSeguridad } from '../../service/Documentos/gestionSeguridad/Politica.js';
import { ProcesosServices as ProcedimientoSeguridad } from '../../service/Documentos/gestionSeguridad/Procedimiento.js';
import { PoliticaServices as PoliticaAmbiental } from '../../service/Documentos/gestionAmbiental/Politica.js';
import { ProcesosServices as ProcedimientoAmbiental } from '../../service/Documentos/gestionAmbiental/Procedimiento.js';
import { FrasesServicios } from '../../service/Documentos/Frases.services.js';
import { CumpleañosMesServices } from '../../service/gestionCumpleaños/CumpleañosMes.services.js';
import { EnfermedadesMesServices } from '../../service/OficinaMedica/EnfermedadesMes.services.js';
import { toast } from 'react-toastify';
import CarrucelMovimiento from '../../carruceImagenes/CarrucelMovimiento.jsx';

import { normalizarFecha } from '../../helpers/normalze.helpers.js';
function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export default function DocumentManagerPageTW() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(params.get('tab') || 'novedades');
  const [searchQuery, setSearchQuery] = useState(params.get('q') || '');
  const [area, setArea] = useState(params.get('area') || 'Todas');
  const [sortBy, setSortBy] = useState(params.get('sort') || 'recientes');
  const [resultCount, setResultCount] = useState(0);
  const [isListLoading, setIsListLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfTitle, setPdfTitle] = useState('');

  const [fraseDia, SetFraseDia] = useState(null);
  const [cumpleanerosMes, setCumpleanosMes] = useState(null);
  const [dataEnfermedad, setDataEnfermedad] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEnfermedadModal, setOpenEnfermedadModal] = useState(false);

  const debouncedQuery = useDebouncedValue(searchQuery, 350);
  useEffect(() => {
    const loadComunicado = async () => {
      try {
        const res = await GeneralDocumentos.getUltimaNoticia();
        if (!res?.ok || !res?.blob) return;

        const url = URL.createObjectURL(res.blob);
        setPdfUrl(url);
        setPdfTitle('Ultimo comunicado');

        const fraseRes = await FrasesServicios.getRandom();
        if (!fraseRes.ok) {
          throw new Error(fraseRes.message || 'No se pudo cargar la frase');
        }
        SetFraseDia(fraseRes?.frase || 'Hoy es un hermoso dia');

        const cumpleRes = await CumpleañosMesServices.getCumpleaniosPorMes();
        if (!cumpleRes.ok) {
          throw new Error(
            fraseRes.message || 'No se pudo cargar los cumpleañeros',
          );
        }

        setCumpleanosMes(cumpleRes?.data || []);
        const enfermedadRes =
          await EnfermedadesMesServices.getEnfermedadesPeriodo();
        if (!enfermedadRes.ok) {
          throw new Error(
            enfermedadRes.message || 'No se pudo cargar la frase',
          );
        }
        setDataEnfermedad(enfermedadRes?.data || []);
      } catch (error) {
        toast.error(error.message || 'Erro al cargar el comunicado');
      }
    };

    loadComunicado();
  }, []);

  const { total, top, pct, resto } = useMemo(() => {
    const lista = Array.isArray(dataEnfermedad) ? dataEnfermedad : [];

    const totalCasos = lista.reduce((acc, item) => acc + (item.casos || 0), 0);

    const ordenadas = [...lista].sort(
      (a, b) => (b.casos || 0) - (a.casos || 0),
    );
    const topItem = ordenadas[0] || null;
    const porcentaje = totalCasos
      ? Math.round(((topItem?.casos || 0) / totalCasos) * 100)
      : 0;

    return {
      total: totalCasos,
      top: topItem,
      pct: porcentaje,
      resto: ordenadas.slice(1),
    };
  }, [dataEnfermedad]);

  // ✅ Frase del día (rotación simple por día)

  const tabsConfig = useMemo(
    () => ({
      novedades: {
        label: 'Noticias',
        title: 'Noticias',
        fetcher: GeneralDocumentos.getNoticias,
        services: {
          image: NoticiaServices.getImage,
          doc: NoticiaServices.viewDocumeto,
        },
      },
      politicas: {
        label: 'Gestion de calidad',
        title: 'Gestion de calidad',
        fetcher: GeneralDocumentos.getCalidad,
        services: {
          image: PoliticaCalidad.getImage,
          doc: PoliticaCalidad.viewDocumeto,
          imgPr: ProcedimientoCalidad.getImage,
          docPr: ProcedimientoCalidad.viewDocumeto,
        },
      },
      gestion_seguridad: {
        label: 'Gestion de seguridad',
        title: 'Gestion de seguridad',
        fetcher: GeneralDocumentos.getSeguridad,
        services: {
          image: PoliticaSeguridad.getImage,
          doc: PoliticaSeguridad.viewDocumeto,
          imgPr: ProcedimientoSeguridad.getImage,
          docPr: ProcedimientoSeguridad.viewDocumeto,
        },
      },
      gestion_ambiental: {
        label: 'Gestion de ambiental',
        title: 'Gestion de ambiental',
        fetcher: GeneralDocumentos.getAmbiente,
        services: {
          image: PoliticaAmbiental.getImage,
          doc: PoliticaAmbiental.viewDocumeto,
          imgPr: ProcedimientoAmbiental.getImage,
          docPr: ProcedimientoAmbiental.viewDocumeto,
        },
      },
      boletines: {
        label: 'Comunicado',
        title: 'Comunicados',
        fetcher: GeneralDocumentos.getComunicado,
        services: {
          image: ComunicadoServices.getImage,
          doc: ComunicadoServices.viewDocumeto,
        },
      },
    }),
    [],
  );

  const tabs = useMemo(
    () =>
      Object.entries(tabsConfig).map(([key, v]) => ({ key, label: v.label })),
    [tabsConfig],
  );

  const current = tabsConfig[activeTab] || tabsConfig.novedades;
  const hasFilters =
    searchQuery.trim() || area !== 'Todas' || sortBy !== 'recientes';

  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set('tab', activeTab);
    next.set('area', area);
    next.set('q', searchQuery);
    next.set('sort', sortBy);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, area, searchQuery, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setArea('Todas');
    setSortBy('recientes');
  };
  const closePdfModal = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setPdfTitle('');
  };

  const [paginaCumples, setPaginaCumples] = useState(0);

  const grupoTamano = 3;
  const totalPaginas = Math.ceil((cumpleanerosMes?.length || 0) / grupoTamano);

  useEffect(() => {
    if (!cumpleanerosMes?.length || totalPaginas <= 1) return;

    const interval = setInterval(() => {
      setPaginaCumples((prev) => (prev + 1) % totalPaginas);
    }, 3000);

    return () => clearInterval(interval);
  }, [cumpleanerosMes, totalPaginas]);

  const cumplesVisibles =
    cumpleanerosMes?.slice(
      paginaCumples * grupoTamano,
      paginaCumples * grupoTamano + grupoTamano,
    ) || [];

  return (
    <>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <header className="sticky top-0 z-40 h-20 border-b border-slate-200 bg-white/90 backdrop-blur shadow-[0_2px_8px_rgba(2,6,23,0.06)]">
          <div className="mx-auto flex h-full max-w-7xl items-center px-4 md:px-6">
            <div className="flex flex-1 items-center"></div>

            <div className="flex flex-1 justify-end">
              <button
                onClick={() => navigate('/login')}
                className="rounded-xl bg-emerald-800 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-900"
              >
                Sistema Intranet
              </button>
            </div>
          </div>
        </header>

        <section className="bg-linear-to-r from-emerald-800 via-emerald-800 to-slate-800 text-white">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
            {/* GRID: izquierda contenido, derecha indicador */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
              {/* IZQUIERDA */}
              <div className="min-w-0">
                <div className="mb-5 md:mb-7">
                  <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                    Ceramica Coboce
                  </h1>
                  <p className="mt-3 text-white/90">
                    Encuentra políticas, procedimientos, boletines y novedades
                    en un solo lugar.
                  </p>
                </div>

                <div
                  className="mb-4 flex gap-2 overflow-x-auto pb-1"
                  role="tablist"
                  aria-label="Secciones de documentos"
                >
                  {tabs.map((t) => {
                    const selected = activeTab === t.key;

                    return (
                      <button
                        key={t.key}
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setActiveTab(t.key)}
                        className={[
                          'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
                          selected
                            ? 'bg-white text-slate-900'
                            : 'bg-white/15 text-white hover:bg-white/25',
                        ].join(' ')}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center lg:gap-4">
                  <div className="relative min-w-0">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500/70" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por nombre, código, proceso..."
                      className="w-full rounded-full bg-white px-12 py-3 text-sm text-slate-900 outline-none ring-1 ring-black/5 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="relative">
                    <FunnelIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-700" />
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="h-11.5 w-full appearance-none rounded-xl bg-white pl-12 pr-10 text-sm font-semibold text-slate-900 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-emerald-700 lg:w-48"
                    >
                      <option value="Todas">Todas las áreas</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Producción">Producción</option>
                      <option value="Calidad">Calidad</option>
                      <option value="Seguridad">Seguridad</option>
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                      ▾
                    </span>
                  </div>

                  <div className="relative">
                    <ArrowsUpDownIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-700" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-11.5 w-full appearance-none rounded-xl bg-white pl-12 pr-10 text-sm font-semibold text-slate-900 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-emerald-700 lg:w-52"
                    >
                      <option value="recientes">Más recientes</option>
                      <option value="antiguos">Más antiguos</option>
                      <option value="titulo">Título A-Z</option>
                      <option value="codigo">Código A-Z</option>
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                      ▾
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={clearFilters}
                    disabled={!hasFilters}
                    className={[
                      'inline-flex h-11.5 items-center justify-center rounded-xl px-4 text-sm font-semibold transition',
                      hasFilters
                        ? 'bg-white text-slate-900 hover:bg-slate-100'
                        : 'cursor-not-allowed bg-white/50 text-slate-300',
                    ].join(' ')}
                  >
                    Limpiar filtros
                  </button>
                </div>

                {hasFilters && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {searchQuery.trim() && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
                      >
                        Texto: {searchQuery}
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}

                    {area !== 'Todas' && (
                      <button
                        type="button"
                        onClick={() => setArea('Todas')}
                        className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
                      >
                        Área: {area}
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}

                    {sortBy !== 'recientes' && (
                      <button
                        type="button"
                        onClick={() => setSortBy('recientes')}
                        className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
                      >
                        Orden: {sortBy}
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="lg:pt-2 lg:justify-self-end lg:translate-x-8 xl:translate-x-60">
                <img
                  src={LogoCeramica}
                  alt="COBOCE"
                  className="h-50 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ✅ MAIN */}
        <main className="mx-auto max-w-8xl px-4 pb-12 pt-6 md:px-6 md:pb-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            {/* IZQUIERDA */}
            <section className="min-w-0  ">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {current.title}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isListLoading
                      ? 'Cargando documentos...'
                      : `${resultCount} documento${resultCount === 1 ? '' : 's'} disponibles`}
                  </p>
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Intranet documental
                </p>
              </div>

              <Novedades
                ObtenerDocumentos={current.fetcher}
                searchQuery={debouncedQuery}
                area={area}
                sortBy={sortBy}
                onFilteredCountChange={setResultCount}
                onLoadingChange={setIsListLoading}
                services={current.services}
              />
            </section>

            {/* DERECHA */}
            <aside className="lg:sticky lg:top-28 lg:self-center">
              <div className="space-y-4">
                {/* Frase del día */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Hoy
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                      Frase del día
                    </h3>
                  </div>
                  <div className="px-5 py-4">
                    <div className="rounded-xl bg-linear-to-r from-emerald-800 to-slate-800 p-4 text-white shadow-sm">
                      <p className="text-sm font-semibold text-white/90">
                        “{fraseDia}”
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cumpleañeros */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Comunidad
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                      Cumpleañeros del mes
                    </h3>
                  </div>
                  <div className="px-5 py-4">
                    <div className="space-y-2 transition-all duration-500 h-51 overflow-hidden">
                      {cumplesVisibles.map((p) => (
                        <div
                          key={`${p.nombre_completo}-${p.fecha}`}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {p.nombre_completo}
                            </p>
                            <p className="text-xs text-slate-500">{p.fecha}</p>
                          </div>
                          <div className="ml-3 shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800 ring-1 ring-emerald-100">
                            {p.edad}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex justify-center gap-1">
                      {Array.from({ length: totalPaginas }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPaginaCumples(i)}
                          className={`h-2.5 w-2.5 rounded-full ${
                            i === paginaCumples
                              ? 'bg-emerald-700'
                              : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenModal(true)}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-emerald-900"
                    >
                      Ver todos
                    </button>
                  </div>
                </div>

                {/* ✅ Enfermos por tipo */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
                  <div className="rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Salud del mes
                        </p>
                        <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                          Informe medico mensual
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {top
                            ? 'Top 1 por cantidad de casos.'
                            : 'Sin datos aún.'}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
                        {top ? `${top.casos} casos` : '—'}
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl bg-linear-to-r from-emerald-700/80 to-slate-700/80 p-4 ring-1 ring-white/10">
                      <p className="truncate text-base font-extrabold text-white">
                        {top?.titulo || 'No disponible'}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-xs font-semibold text-white/80">
                        <span>Participación</span>
                        <span>{top ? `${pct}%` : '0%'}</span>
                      </div>

                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/25">
                        <div
                          className="h-full rounded-full bg-white"
                          style={{ width: `${pct}%` }}
                          aria-label={`Porcentaje ${pct}%`}
                        />
                      </div>

                      <p className="mt-3 text-xs text-white/80">
                        Total mes:{' '}
                        <span className="font-bold text-white">{total}</span>{' '}
                        casos
                      </p>

                      <button
                        type="button"
                        onClick={() => setOpenEnfermedadModal(true)}
                        disabled={!dataEnfermedad?.length}
                        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-emerald-900"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
          <CarrucelMovimiento />
        </main>
      </div>

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
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-5">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpenModal(false)}
          />

          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-extrabold text-slate-800">
                🎂 Cumpleañeros del mes
              </h2>

              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="max-h-80 space-y-2 overflow-y-auto px-5 py-4">
              {cumpleanerosMes?.length > 0 ? (
                cumpleanerosMes.map((p) => (
                  <div
                    key={`${p.nombre_completo}-${p.fecha}`}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {p.nombre_completo}
                      </p>
                      <p className="text-xs text-slate-500">
                        {normalizarFecha(p.fecha)}
                      </p>
                    </div>

                    <span className="ml-3 shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-100">
                      {p.edad}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No hay cumpleañeros este mes.
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-emerald-900"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {openEnfermedadModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpenEnfermedadModal(false)}
          />

          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h4 className="text-lg font-extrabold text-slate-900">
                  Detalle de enfermedades
                </h4>
                <p className="text-sm text-slate-500">
                  Casos registrados del mes
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenEnfermedadModal(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
              {dataEnfermedad.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No hay datos disponibles.
                </p>
              ) : (
                <div className="space-y-3">
                  {[top, ...resto].filter(Boolean).map((item, index) => {
                    const porcentaje = total
                      ? Math.round(((item.casos || 0) / total) * 100)
                      : 0;

                    return (
                      <div
                        key={`${item.titulo}-${index}`}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-900">
                              {item.titulo}
                            </p>
                            <p className="text-xs text-slate-500">
                              {porcentaje}% del total
                            </p>
                          </div>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                            {item.casos} casos
                          </span>
                        </div>

                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-emerald-600"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setOpenEnfermedadModal(false)}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-emerald-900"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
