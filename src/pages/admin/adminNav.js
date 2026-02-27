import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export const adminNav = [
  {
    id: 'general',
    title: 'Admin',
    icon: HomeIcon,
    items: [
      { label: 'Gestion usuarios', to: '/admin/usuarios', icon: ChartBarIcon },
      {
        label: 'Gestion roles',
        to: '/admin/roles',
        icon: ClipboardDocumentListIcon,
      },
      {
        label: 'Gestiones indicadores',
        to: '/admin/gestion',
        icon: ClipboardDocumentListIcon,
      },
    ],
  },
  {
    id: 'controlDocumentos',
    title: 'Control Documentos',
    icon: CalendarDaysIcon,
    items: [
      {
        label: 'Politicas',
        to: '/admin/documento/politica',
        icon: ClipboardDocumentListIcon,
      },
      {
        label: 'Procedimientos',
        to: '/admin/documento/procedimiento',
        icon: CalendarDaysIcon,
      },
      {
        label: 'Novedades',
        to: '/admin/documento/boletin',
        icon: Cog6ToothIcon,
      },
    ],
  },
  {
    id: 'produccion',
    title: 'Produccion',
    icon: UsersIcon,
    items: [
      {
        label: 'Gestion lineas',
        to: '/admin/produccion/lineas',
        icon: UsersIcon,
      },
      {
        label: 'Gestion de formatos',
        to: '/admin/produccion/formato',
        icon: UsersIcon,
      },
      {
        label: 'Informe produccion',
        to: '/admin/produccion/informe-produccion',
        icon: UsersIcon,
      },
      {
        label: 'Moliendo barbotina',
        to: '/admin/produccion/barbotina',
        icon: UsersIcon,
      },
      {
        label: 'Atomizado',
        to: '/admin/produccion/atomizado',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Prensado y secado',
        to: '/admin/produccion/prensado',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Linea esmaltacion',
        to: '/admin/produccion/esmalte',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Serigrafica y decorado ',
        to: '/admin/produccion/serigrafia',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Seleccion y embalaje',
        to: '/admin/produccion/seleccion',
        icon: Cog6ToothIcon,
      },
    ],
  },
  {
    id: 'produccionAdministracion',
    title: 'Produccion administracion',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Calidad',
        to: '/admin/produccion/administracion/calidad',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo agua',
        to: '/admin/produccion/administracion/indice-consumo-agua',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo bases',
        to: '/admin/produccion/administracion/indice-consumo-bases',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo ee',
        to: '/admin/produccion/administracion/indice-consumo-ee',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo engobe',
        to: '/admin/produccion/administracion/indice-consumo-engobe',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo esmalte',
        to: '/admin/produccion/administracion/indice-consumo-esmalte',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo gn',
        to: '/admin/produccion/administracion/indice-consumo-gn',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo linea',
        to: '/admin/produccion/administracion/indice-consumo-linea',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice polvo atomizado',
        to: '/admin/produccion/administracion/indice-polvo-atomizado',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Monitoreo gases combustion',
        to: '/admin/produccion/administracion/monitoreo-gases-combustion',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Produccion',
        to: '/admin/produccion/administracion/produccion',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Producto no conforme',
        to: '/admin/produccion/administracion/no-conforme',
        icon: Cog6ToothIcon,
      },
    ],
  },
  {
    id: 'mantenimiento',
    title: 'Mantenimiento',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Disponibilidad por linea',
        to: '/admin/mantenimiento/disponibilidad-linea',
        icon: Cog6ToothIcon,
      },
    ],
  },

  {
    id: 'informeGerente',
    title: 'Informe Gerente',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Indicadores del periodo',
        to: '/admin/informe-gerente',
        icon: Cog6ToothIcon,
      },
    ],
  },
  {
    id: 'secretaria',
    title: 'Secretaria',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Contratos',
        to: '/admin/secretaria/contrato',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Correspondencia recibida unidad',
        to: '/admin/secretaria/correspondencia',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Correspondencia externa - Gerencia',
        to: '/admin/secretaria/gerencia',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Correspondencia externa - Comercial',
        to: '/admin/secretaria/comercial',
        icon: Cog6ToothIcon,
      },
    ],
  },
  {
    id: 'medico',
    title: 'Consultorio medico',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Inventario',
        to: '/admin/medicina/inventario',
        icon: Cog6ToothIcon,
      },
    ],
  },

  {
    id: 'administracion',
    title: 'Administración',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Horas extra',
        to: '/admin/administracion/horas-extra',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Utilidad',
        to: '/admin/administracion/utilidad',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Generacion de residuos',
        to: '/admin/administracion/generacion-residuos',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice de frecuencia',
        to: '/admin/administracion/indice-frecuencia',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice de severidad',
        to: '/admin/administracion/indice-severidad',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Donaciones',
        to: '/admin/administracion/donaciones',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Atencion consultorio',
        to: '/admin/administracion/atencion-consultorio',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Reclamo producto terminado',
        to: '/admin/administracion/reclamo-producto-terminado',
        icon: Cog6ToothIcon,
      },
    ],
  },
  {
    id: 'comercializacion',
    title: 'Comercializacion',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Ingreso por venta total',
        to: '/admin/comercializacion/ingreso-venta-total',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Venta total',
        to: '/admin/comercializacion/venta-total',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Precio unitario',
        to: '/admin/comercializacion/precio-unitario',
        icon: Cog6ToothIcon,
      },
    ],
  },
];
