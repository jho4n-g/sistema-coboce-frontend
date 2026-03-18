import InputField from '@components/InputField';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getPermisos } from '@service/auth/Rol.services';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const initialForm = () => ({
  nombre: '',
  permisos: [],
});

export default function RolModal({
  open,
  onClose,
  onSave,
  isEdit = false,
  id,
  fetchById,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(initialForm());
  const [permisosCat, setPermisosCat] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState({});

  const title = isEdit ? 'Editar rol' : 'Nuevo rol';

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const closeModal = () => {
    setForm(initialForm());
    setPermisosCat([]);
    setSearch('');
    setError({});
    setLoading(false);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setForm(initialForm());
      setPermisosCat([]);
      setSearch('');
      setError({});
      setLoading(false);
      return;
    }

    if (!isEdit) {
      setForm(initialForm());
      setSearch('');
      setError({});
    }
  }, [open, isEdit]);

  useEffect(() => {
    if (!open) return;

    let active = true;

    (async () => {
      setLoading(true);
      setError({});
      setSearch('');

      try {
        const permisosRes = await getPermisos();

        if (!active) return;

        if (!permisosRes?.ok) {
          throw new Error(permisosRes?.message || 'No se pudo cargar permisos');
        }

        let list = permisosRes?.data ?? permisosRes?.datos?.data ?? [];

        if (Array.isArray(list) && typeof list[0] === 'string') {
          list = list.map((codigo) => ({
            codigo,
            nombre: formatearNombrePermiso(codigo),
          }));
        }

        const permisosArr = Array.isArray(list) ? list : [];
        setPermisosCat(permisosArr);

        if (!isEdit) {
          setForm(initialForm());
          return;
        }

        if (!id || typeof fetchById !== 'function') {
          setForm(initialForm());
          return;
        }

        const data = await fetchById(id);

        if (!active) return;

        if (!data?.ok) {
          throw new Error(data?.message || 'No se pudo cargar el rol');
        }

        const dto = Array.isArray(data?.dato) ? data.dato?.[0] : data?.dato;
        const rawPerms = dto?.permisos ?? [];

        const permisosCodigos = Array.isArray(rawPerms)
          ? rawPerms
              .map((p) => {
                if (typeof p === 'string') return p;
                if (p?.codigo) return String(p.codigo);
                return null;
              })
              .filter(Boolean)
          : [];

        setForm({
          nombre: dto?.nombre ?? '',
          permisos: permisosCodigos,
        });
      } catch (e) {
        toast.error(e?.message || 'Error del servidor');
        setForm(initialForm());
        setPermisosCat([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, isEdit, id, fetchById]);

  const permisosMap = useMemo(() => {
    const m = new Map();
    (permisosCat || []).forEach((p) => {
      m.set(String(p.codigo), p);
    });
    return m;
  }, [permisosCat]);

  const permisosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return permisosCat;

    return (permisosCat || []).filter((p) => {
      const codigo = String(p?.codigo ?? '').toLowerCase();
      const nombre = String(p?.nombre ?? '').toLowerCase();
      return codigo.includes(q) || nombre.includes(q);
    });
  }, [permisosCat, search]);

  const permisosAgrupados = useMemo(() => {
    const grupos = {};

    (permisosFiltrados || []).forEach((permiso) => {
      const codigo = String(permiso.codigo || '');
      const partes = codigo.split('.');
      const grupo = partes.slice(0, -1).join('.') || 'general';

      if (!grupos[grupo]) grupos[grupo] = [];
      grupos[grupo].push(permiso);
    });

    return grupos;
  }, [permisosFiltrados]);

  if (!open) return null;

  const seleccionarTodosDelGrupo = (permisosGrupo) => {
    const codigosGrupo = permisosGrupo.map((p) => String(p.codigo));

    setForm((f) => {
      const nuevos = [...new Set([...f.permisos, ...codigosGrupo])];
      return { ...f, permisos: nuevos };
    });
  };

  const quitarTodosDelGrupo = (permisosGrupo) => {
    const codigosGrupo = permisosGrupo.map((p) => String(p.codigo));

    setForm((f) => ({
      ...f,
      permisos: f.permisos.filter((codigo) => !codigosGrupo.includes(codigo)),
    }));
  };

  const grupoCompletoSeleccionado = (permisosGrupo) => {
    const codigosGrupo = permisosGrupo.map((p) => String(p.codigo));
    return codigosGrupo.every((codigo) => form.permisos.includes(codigo));
  };

  const removePermiso = (codigo) => {
    setForm((f) => ({
      ...f,
      permisos: f.permisos.filter((x) => x !== codigo),
    }));
  };

  const togglePermiso = (codigo) => {
    setForm((f) => {
      const exists = f.permisos.includes(codigo);
      return {
        ...f,
        permisos: exists
          ? f.permisos.filter((x) => x !== codigo)
          : [...f.permisos, codigo],
      };
    });
  };

  const guardar = () => {
    if (!form?.nombre?.trim()) {
      setError((e) => ({ ...e, nombre: 'El nombre es obligatorio' }));
      toast.error('Completa el nombre del rol');
      return;
    }

    if (!Array.isArray(form.permisos) || form.permisos.length === 0) {
      toast.error('Selecciona al menos un permiso');
      return;
    }

    onSave({
      nombre: form.nombre.trim(),
      permisos: form.permisos,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : closeModal}
      />

      <div className="relative z-10 flex max-h-[calc(100vh-2rem)] w-[95%] max-w-8xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">
              Configura el nombre del rol y sus permisos de acceso.
            </p>
          </div>

          <button
            type="button"
            onClick={loading ? undefined : closeModal}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="relative flex-1 overflow-y-auto p-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Nombre del rol"
                type="text"
                name="nombre"
                value={form.nombre ?? ''}
                onChange={updateBase}
                error={error.nombre}
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Buscar permiso
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ej: barbotina, alertas.crear..."
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-slate-900">
                Permisos seleccionados
              </h4>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {form.permisos.length} seleccionado(s)
              </span>
            </div>

            <div className="mt-4">
              {form.permisos.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No seleccionaste permisos todavía.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.permisos.map((codigo) => {
                    const p = permisosMap.get(String(codigo));
                    const label = p?.nombre ?? formatearNombrePermiso(codigo);

                    return (
                      <span
                        key={codigo}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200"
                      >
                        {label}
                        <button
                          type="button"
                          onClick={() => removePermiso(codigo)}
                          className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800 hover:bg-emerald-200"
                          aria-label={`Quitar ${label}`}
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-slate-800">
              Selección rápida por módulos
            </p>

            <div className="space-y-5">
              {Object.entries(permisosAgrupados).map(([grupo, permisos]) => {
                const todosSeleccionados = grupoCompletoSeleccionado(permisos);

                return (
                  <div
                    key={grupo}
                    className="overflow-hidden rounded-2xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {formatearGrupoPermiso(grupo)}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {permisos.length} permiso(s)
                        </p>
                      </div>

                      {!todosSeleccionados ? (
                        <button
                          type="button"
                          onClick={() => seleccionarTodosDelGrupo(permisos)}
                          className="rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                        >
                          Seleccionar todo
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => quitarTodosDelGrupo(permisos)}
                          className="rounded-xl bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                        >
                          Quitar todo
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3">
                      {permisos.map((p) => {
                        const checked = form.permisos.includes(
                          String(p.codigo),
                        );

                        return (
                          <label
                            key={p.codigo}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                              checked
                                ? 'border-emerald-300 bg-emerald-50'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermiso(String(p.codigo))}
                              className="mt-0.5"
                            />

                            <div className="min-w-0">
                              <p className="font-medium text-slate-800">
                                {p.nombre || formatearNombrePermiso(p.codigo)}
                              </p>
                              <p className="mt-0.5 break-all text-xs text-slate-500">
                                {p.codigo}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        {!loading && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                className="rounded-xl bg-slate-100 px-4 py-2 text-slate-800 hover:bg-slate-200"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="rounded-xl bg-green-800 px-4 py-2 text-white hover:bg-green-900"
                onClick={guardar}
              >
                {isEdit ? 'Guardar cambios' : 'Guardar'}
              </button>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 grid place-items-center rounded-3xl bg-white/75 backdrop-blur">
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

function formatearNombrePermiso(codigo) {
  if (!codigo) return '';

  const partes = String(codigo).split('.');
  const accion = partes[partes.length - 1];
  const ruta = partes.slice(0, -1);

  const accionMap = {
    ver: 'Ver',
    crear: 'Crear',
    editar: 'Editar',
    eliminar: 'Eliminar',
    aprobar: 'Aprobar',
    exportar: 'Exportar',
    imprimir: 'Imprimir',
    gestionar: 'Gestionar',
  };

  const nombreRuta = ruta
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' / ');

  return `${accionMap[accion] || accion} ${nombreRuta}`;
}

function formatearGrupoPermiso(grupo) {
  return grupo
    .split('.')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' / ');
}
