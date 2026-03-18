import InputField from '@components/InputField';
import PasswordField from '@components/PasswordField';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getRoles } from '@service/auth/Rol.services';
import {
  PersonaCreateSchema,
  PersonaUpdateSchema,
} from '../../../../schema/auth/Persona.schema.js';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const initialForm = () => ({
  username: '',
  password: '',
  roleIds: [],
  nombre: '',
  area: '',
  correo: '',
  cargo: '',
});

export default function UsuarioModal({
  open,
  onClose,
  onSave,
  isEdit = false,
  id,
  fetchById,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(initialForm());
  const [rolesCat, setRolesCat] = useState([]);
  const [roleSel, setRoleSel] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState({});

  const title = isEdit ? 'Editar usuario' : 'Nuevo usuario';

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const closeModal = () => {
    setForm(initialForm());
    setRolesCat([]);
    setRoleSel('');
    setSearch('');
    setError({});
    setLoading(false);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setForm(initialForm());
      setRolesCat([]);
      setRoleSel('');
      setSearch('');
      setError({});
      setLoading(false);
      return;
    }

    if (!isEdit) {
      setForm(initialForm());
      setRoleSel('');
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
      setRoleSel('');
      setSearch('');

      try {
        const rolesRes = await getRoles();
        if (!active) return;

        if (!rolesRes?.ok) {
          throw new Error(rolesRes?.message || 'No se pudo cargar roles');
        }

        const list = rolesRes?.roles ?? rolesRes?.data ?? [];
        const rolesArr = Array.isArray(list) ? list : [];
        setRolesCat(rolesArr);

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
          throw new Error(data?.message || 'No se pudo cargar el usuario');
        }

        const dto = Array.isArray(data?.dato) ? data.dato?.[0] : data?.dato;

        const raw = dto?.roleIds ?? dto?.roles ?? [];
        const roleIds = Array.isArray(raw)
          ? raw
              .map((r) => {
                if (typeof r === 'number') return r;
                if (typeof r === 'string' && /^\d+$/.test(r)) return Number(r);
                if (r?.id) return Number(r.id);
                return null;
              })
              .filter((x) => Number.isFinite(x))
          : [];

        setForm({
          username: dto?.username ?? '',
          nombre: dto?.nombre ?? '',
          area: dto?.area ?? '',
          correo: dto?.correo ?? '',
          cargo: dto?.cargo ?? '',
          password: '',
          roleIds,
        });
      } catch (e) {
        toast.error(e?.message || 'Error del servidor');
        setForm(initialForm());
        setRolesCat([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, isEdit, id, fetchById]);

  const rolesMap = useMemo(() => {
    const m = new Map();
    (rolesCat || []).forEach((r) => m.set(Number(r.id), r));
    return m;
  }, [rolesCat]);

  const rolesFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rolesCat;

    return (rolesCat || []).filter((r) =>
      String(r?.nombre ?? '')
        .toLowerCase()
        .includes(q),
    );
  }, [rolesCat, search]);

  if (!open) return null;

  const addRole = () => {
    const rid = Number(roleSel);

    if (!Number.isFinite(rid) || rid <= 0) {
      toast.error('Selecciona un rol');
      return;
    }

    setForm((f) => {
      if (f.roleIds.includes(rid)) return f;
      return { ...f, roleIds: [...f.roleIds, rid] };
    });

    setRoleSel('');
  };

  const removeRole = (rid) => {
    setForm((f) => ({
      ...f,
      roleIds: f.roleIds.filter((x) => x !== rid),
    }));
  };

  const toggleRole = (rid) => {
    setForm((f) => {
      const exists = f.roleIds.includes(rid);
      return {
        ...f,
        roleIds: exists
          ? f.roleIds.filter((x) => x !== rid)
          : [...f.roleIds, rid],
      };
    });
  };

  const guardar = () => {
    if (!Array.isArray(form.roleIds) || form.roleIds.length === 0) {
      toast.error('Selecciona al menos un rol');
      return;
    }

    const result = isEdit
      ? PersonaUpdateSchema.safeParse(form)
      : PersonaCreateSchema.safeParse(form);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setError(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }

    onSave(result.data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : closeModal}
      />

      <div className="relative z-10 flex max-h-[calc(100vh-2rem)] w-[92%] max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
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

        {/* Body */}
        <div className="relative flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Datos personales */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-slate-900">
              Información personal
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <InputField
                label="Nombre completo"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={updateBase}
                error={error.nombre}
              />

              <InputField
                label="Área"
                type="text"
                name="area"
                value={form.area}
                onChange={updateBase}
                error={error.area}
              />

              <InputField
                label="Correo"
                type="text"
                name="correo"
                value={form.correo}
                onChange={updateBase}
                error={error.correo}
              />

              <InputField
                label="Cargo"
                type="text"
                name="cargo"
                value={form.cargo}
                onChange={updateBase}
                error={error.cargo}
              />
            </div>
          </div>

          {/* Datos de acceso */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-slate-900">
              Datos de acceso
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Nombre de usuario"
                type="text"
                name="username"
                value={form.username}
                onChange={updateBase}
                error={error.username}
              />

              <PasswordField
                label={isEdit ? 'Contraseña (opcional)' : 'Contraseña'}
                name="password"
                placeholder={
                  isEdit
                    ? 'Deja vacío si no deseas cambiarla'
                    : 'Introduce tu contraseña'
                }
                value={form.password}
                onChange={updateBase}
                error={error.password}
              />
            </div>
          </div>

          {/* Roles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Roles</h4>
                <p className="text-sm text-slate-500 mt-1">
                  Asigna uno o varios roles al usuario.
                </p>
              </div>

              <div className="w-full md:w-72">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Buscar rol
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ej: Administración"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Selector + agregar */}
            <div className="mt-4 grid grid-cols-1 items-end gap-3 md:grid-cols-12">
              <div className="md:col-span-10">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Seleccionar rol
                </label>

                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  value={roleSel}
                  onChange={(e) => setRoleSel(e.target.value)}
                >
                  <option value="">— Selecciona —</option>
                  {rolesFiltrados?.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={addRole}
                  className="w-full rounded-xl bg-emerald-800 px-3 py-2 text-white hover:bg-emerald-900"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Roles seleccionados */}
            <div className="mt-4">
              {form.roleIds.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No seleccionaste roles todavía.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.roleIds.map((rid) => {
                    const r = rolesMap.get(Number(rid));
                    const label = r?.nombre ?? `Rol #${rid}`;

                    return (
                      <span
                        key={rid}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200"
                      >
                        {label}
                        <button
                          type="button"
                          onClick={() => removeRole(rid)}
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

            {/* Selección rápida */}
            <div className="mt-6 border-t border-slate-200 pt-4">
              <p className="mb-2 text-sm font-semibold text-slate-800">
                Selección rápida
              </p>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {(rolesFiltrados || []).map((r) => {
                  const checked = form.roleIds.includes(Number(r.id));

                  return (
                    <label
                      key={r.id}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                        checked
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRole(Number(r.id))}
                      />
                      <span className="text-slate-700">{r.nombre}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-white px-5 py-4">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cerrar ventana
            </button>

            <button
              type="button"
              onClick={guardar}
              disabled={loading}
              className="rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEdit ? 'Guardar cambios' : 'Guardar'}
            </button>
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
