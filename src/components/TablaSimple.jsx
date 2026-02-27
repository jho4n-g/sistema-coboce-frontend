import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';
import { normalize } from '../helpers/normalze.helpers';

/**
 * columnas: [{ key: 'nombre', label: 'NOMBRE', render?: (row)=>JSX }]
 * data: array de objetos
 */
export default function TablaSimple({
  titulo,
  columnas = [],
  data = [],

  // buscador
  isBuscador = true,
  datosBusqueda = [], // ['nombre','codigo'] si lo dejas vacío => busca en todas las columnas (por key)

  // paginado
  paginado = true,
  rowsPerPageOptions = [5, 10, 20, 50],
  rowsPerPageDefault = 5,

  // acciones (opcionales)
  isAcccion = false,
  isDetalle = true,
  isEdit = true,
  isDelete = true,
  onDetail,
  onEdit,
  onDelete,

  // keys
  rowKey = (row, idx) => row?.id ?? `${idx}`,
}) {
  const [query, setQuery] = useState('');

  const [page, setPage] = useState(0); // 0-based
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);

  // campos donde buscar
  const searchKeys = useMemo(() => {
    if (datosBusqueda?.length) return datosBusqueda;
    return columnas.map((c) => c.key).filter(Boolean);
  }, [datosBusqueda, columnas]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return Array.isArray(data) ? data : [];

    return (Array.isArray(data) ? data : []).filter((r) =>
      searchKeys.some((k) => normalize(r?.[k]).includes(q)),
    );
  }, [data, query, searchKeys]);

  const totalPages = useMemo(() => {
    if (!paginado) return 1;
    return Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  }, [filtered.length, paginado, rowsPerPage]);

  const paginated = useMemo(() => {
    if (!paginado) return filtered;
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage, paginado]);

  useEffect(() => {
    setPage(0);
  }, [query, rowsPerPage]);

  const pagesToShow = useMemo(() => {
    const total = totalPages;
    const current = page;
    const windowSize = 5;

    if (total <= windowSize) return Array.from({ length: total }, (_, i) => i);

    const half = Math.floor(windowSize / 2);
    let start = Math.max(0, current - half);
    let end = Math.min(total - 1, start + windowSize - 1);
    start = Math.max(0, end - (windowSize - 1));

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const handleChangeRowsPerPage = (evt) => {
    setRowsPerPage(parseInt(evt.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      {titulo && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text">{titulo}</h2>
        </div>
      )}

      {isBuscador && (
        <div className="rounded-lg border-2 border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-sm">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar
              </label>

              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Buscar..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm text-slate-900
                    focus:border-slate-500 focus:outline-none focus:ring-4 focus:ring-slate-200"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="hidden md:block" />
          </div>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="min-w-max w-full table-auto border-separate border-spacing-0 text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr className="divide-x divide-slate-200">
                {columnas.map((c, i) => (
                  <th
                    key={`${c.key}-${i}`}
                    className={[
                      'border-b px-4 py-3 text-left font-semibold whitespace-nowrap',
                      i === 0 && 'sticky left-0 z-20 bg-slate-50',
                    ].join(' ')}
                  >
                    {c.label}
                  </th>
                ))}

                {isAcccion && (
                  <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap sticky right-0 z-20 bg-slate-50">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={columnas.length + (isAcccion ? 1 : 0)}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    No hay registros
                  </td>
                </tr>
              ) : (
                paginated.map((row, ri) => (
                  <tr
                    key={rowKey(row, ri)}
                    className="border border-slate-300 divide-x divide-slate-200 hover:bg-slate-100/60 transition-colors"
                  >
                    {columnas.map((c, i) => (
                      <td
                        key={`${c.key}-${i}`}
                        className={[
                          'px-4 py-3 whitespace-nowrap',
                          i === 0 && 'sticky left-0 z-10 bg-white',
                        ].join(' ')}
                      >
                        {c.render ? c.render(row) : row?.[c.key]}
                      </td>
                    ))}

                    {isAcccion && (
                      <td className="px-4 py-3 sticky right-0 z-10 bg-white">
                        <div className="flex flex-col gap-2">
                          {isDetalle ? (
                            <button
                              className="rounded-xl bg-white px-3 py-2 text-reen-900 ring-1 ring-green-900 hover:bg-emerald-100"
                              onClick={() => onDetail?.(row)}
                            >
                              Detalles
                            </button>
                          ) : (
                            <div />
                          )}

                          {isEdit ? (
                            <button
                              type="button"
                              className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
                              onClick={() => onEdit?.(row)}
                            >
                              Editar
                            </button>
                          ) : (
                            <div />
                          )}

                          {isDelete ? (
                            <button
                              className="rounded-xl bg-[#bb9457] px-3 py-2 text-white hover:bg-[#a67c3f]"
                              onClick={() => onDelete?.(row)}
                            >
                              Eliminar
                            </button>
                          ) : (
                            <div />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {paginado && (
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Filas:</span>
              <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {rowsPerPageOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <span className="ml-2">
                {filtered.length === 0
                  ? '0'
                  : `${page * rowsPerPage + 1}-${Math.min(
                      (page + 1) * rowsPerPage,
                      filtered.length,
                    )}`}{' '}
                de {filtered.length}
              </span>
            </div>

            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Anterior
              </button>

              {pagesToShow[0] > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => setPage(0)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    1
                  </button>
                  <span className="px-1 text-slate-400">…</span>
                </>
              )}

              {pagesToShow.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={[
                    'rounded-xl px-3 py-1.5 text-sm border',
                    p === page
                      ? 'border-green-900 bg-green-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
                  ].join(' ')}
                >
                  {p + 1}
                </button>
              ))}

              {pagesToShow[pagesToShow.length - 1] < totalPages - 1 && (
                <>
                  <span className="px-1 text-slate-400">…</span>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages - 1)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                type="button"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                Siguiente
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
