import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import LogoCeramicaCoboce from '../img/logo-ceramica-coboce.png';

import {
  Bars3Icon,
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const navItems = [
  { to: '/cliente/inicio', label: 'Inicio' },
  { to: '/cliente/produccion/secciones', label: 'Planilla Producción' },
  {
    to: '/cliente/produccion/administracion',
    label: 'Planilla Producción administracion',
  },
  {
    to: '/cliente/produccion/mantenimiento',
    label: 'Planilla mantenimiento',
  },
  {
    to: '/cliente/adminitracion',
    label: 'Planilla administracion',
  },
  {
    to: '/cliente/comercializacion',
    label: 'Planilla comercializacion',
  },
];

export default function ClienteLyaout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!userRef.current) return;
      if (!userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* AppBar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                aria-label="Abrir menú"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-13 w-30 items-center justify-center rounded-xl bg-white  ring-1 ring-slate-200 overflow-hidden">
                  <img
                    src={LogoCeramicaCoboce}
                    alt="Coboce"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Center */}
            <nav className="hidden lg:flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50/70 p-1">
              {navItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  className={({ isActive }) =>
                    cx(
                      'rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-green-800 text-white shadow-sm ring-1 '
                        : 'text-slate-600 hover:bg-white hover:text-slate-900',
                    )
                  }
                >
                  {it.label}
                </NavLink>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Notificaciones */}
              <button
                type="button"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                aria-label="Notificaciones"
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
              </button>

              {/* User */}
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserOpen((v) => !v)}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm transition hover:bg-slate-50"
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">
                    U
                  </div>

                  <div className="hidden sm:block text-left leading-tight">
                    <p className="text-sm font-semibold text-slate-900">
                      Usuario
                    </p>
                    <p className="text-xs text-slate-500">Operador</p>
                  </div>

                  <ChevronDownIcon
                    className={cx(
                      'h-4 w-4 text-slate-500 transition-transform duration-200',
                      userOpen && 'rotate-180',
                    )}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={cx(
                    'absolute  left-0.5 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 transition-all duration-200',
                    userOpen
                      ? 'visible translate-y-0 opacity-100 scale-100'
                      : 'invisible -translate-y-1 opacity-0 scale-95 pointer-events-none',
                  )}
                  role="menu"
                >
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-700">
                      U
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        Usuario
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        usuario@coboce.bo
                      </p>
                    </div>
                  </div>

                  <div className="p-2">
                    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50">
                      <UserIcon className="h-5 w-5 shrink-0 text-slate-500" />
                      Perfil
                    </button>

                    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50">
                      <Cog6ToothIcon className="h-5 w-5 shrink-0 text-slate-500" />
                      Configuración
                    </button>

                    <div className="my-2 h-px bg-slate-100" />

                    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-600 transition hover:bg-rose-50">
                      <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile nav */}
          <div
            className={cx('lg:hidden pb-4', mobileOpen ? 'block' : 'hidden')}
          >
            <div className="mt-2 grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              {navItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cx(
                      'rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                        : 'text-slate-700 hover:bg-slate-50',
                    )
                  }
                >
                  {it.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-8xl px-4 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
