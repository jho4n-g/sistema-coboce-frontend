import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  BellIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  FolderIcon,
  UserGroupIcon,
  BeakerIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

export const adminNav = [
  {
    id: 'general',
    title: 'Admin',
    icon: HomeIcon,
    items: [
      { label: 'Gestion usuarios', to: '/admin/usuarios', icon: UsersIcon },
      { label: 'Gestion roles', to: '/admin/roles', icon: UserGroupIcon },
      {
        label: 'Gestiones indicadores',
        to: '/admin/gestion',
        icon: ChartBarIcon,
      },
    ],
  },

  {
    id: 'controlDocumentos',
    title: 'Control Documentos',
    icon: FolderIcon,
    items: [
      {
        label: 'Gestion comunicados',
        to: '/admin/documento/gestion-comunicado',
        icon: DocumentTextIcon,
      },
      {
        label: 'Gestion frases',
        to: '/admin/documento/gestion-frase',
        icon: DocumentTextIcon,
      },
      {
        label: 'Gestion noticias',
        to: '/admin/documento/gestion-noticia',
        icon: DocumentTextIcon,
      },
      {
        label: 'Gestion calidad',
        to: '/admin/documento/gestion-calidad',
        icon: ClipboardDocumentListIcon,
      },
      {
        label: 'Gestion ambiental',
        to: '/admin/documento/gestion-ambiental',
        icon: ClipboardDocumentListIcon,
      },
      {
        label: 'Gestion seguridad',
        to: '/admin/documento/gestion-seguridad',
        icon: ClipboardDocumentListIcon,
      },
    ],
  },
  {
    id: 'cumpleanos',
    title: 'Gestion de cumpleaños',
    icon: BellIcon,
    items: [{ label: 'Trabajadores', to: '/admin/cumpleanos', icon: BellIcon }],
  },

  {
    id: 'alerta',
    title: 'Gestion alerta',
    icon: BellIcon,
    items: [{ label: 'Alertas', to: '/admin/alerta', icon: BellIcon }],
  },

  {
    id: 'gestionVAon',
    title: 'Gestion VAON',
    icon: BuildingOffice2Icon,
    items: [
      {
        label: 'Produccion Nacional',
        to: '/admin/vaon/produccion-nacional',
        icon: ChartBarIcon,
      },
      {
        label: 'Produccion Importado',
        to: '/admin/vaon/produccion-importado',
        icon: ChartBarIcon,
      },
      {
        label: 'Informe VAON',
        to: '/admin/vaon/informe',
        icon: DocumentTextIcon,
      },
    ],
  },

  {
    id: 'produccion',
    title: 'Produccion',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Gestion lineas',
        to: '/admin/produccion/lineas',
        icon: WrenchScrewdriverIcon,
      },
      {
        label: 'Gestion de formatos',
        to: '/admin/produccion/formato',
        icon: ClipboardDocumentListIcon,
      },
      {
        label: 'Informe produccion',
        to: '/admin/produccion/informe-produccion',
        icon: ChartBarIcon,
      },
      {
        label: 'Moliendo barbotina',
        to: '/admin/produccion/barbotina',
        icon: BeakerIcon,
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
        icon: BeakerIcon,
      },
      {
        label: 'Serigrafica y decorado',
        to: '/admin/produccion/serigrafia',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Seleccion y embalaje',
        to: '/admin/produccion/seleccion',
        icon: BriefcaseIcon,
      },
    ],
  },

  {
    id: 'produccionAdministracion',
    title: 'Produccion administracion',
    icon: ChartBarIcon,
    items: [
      {
        label: 'Calidad',
        to: '/admin/produccion/administracion/calidad',
        icon: ClipboardDocumentListIcon,
      },
      {
        label: 'Indice consumo agua',
        to: '/admin/produccion/administracion/indice-consumo-agua',
        icon: ChartBarIcon,
      },
      {
        label: 'Indice consumo bases',
        to: '/admin/produccion/administracion/indice-consumo-bases',
        icon: ChartBarIcon,
      },
      {
        label: 'Indice consumo ee',
        to: '/admin/produccion/administracion/indice-consumo-ee',
        icon: ChartBarIcon,
      },
      {
        label: 'Indice consumo engobe',
        to: '/admin/produccion/administracion/indice-consumo-engobe',
        icon: ChartBarIcon,
      },
      {
        label: 'Indice consumo esmalte',
        to: '/admin/produccion/administracion/indice-consumo-esmalte',
        icon: ChartBarIcon,
      },
      {
        label: 'Indice consumo gn',
        to: '/admin/produccion/administracion/indice-consumo-gn',
        icon: ChartBarIcon,
      },
      {
        label: 'Indice consumo linea',
        to: '/admin/produccion/administracion/indice-consumo-linea',
        icon: ChartBarIcon,
      },
      {
        label: 'Indice polvo atomizado',
        to: '/admin/produccion/administracion/indice-polvo-atomizado',
        icon: ChartBarIcon,
      },
      {
        label: 'Monitoreo gases combustion',
        to: '/admin/produccion/administracion/monitoreo-gases-combustion',
        icon: ChartBarIcon,
      },
      {
        label: 'Produccion',
        to: '/admin/produccion/administracion/produccion',
        icon: ChartBarIcon,
      },
    ],
  },

  {
    id: 'mantenimiento',
    title: 'Mantenimiento',
    icon: WrenchScrewdriverIcon,
    items: [
      {
        label: 'Disponibilidad por linea',
        to: '/admin/mantenimiento/disponibilidad-linea',
        icon: WrenchScrewdriverIcon,
      },
    ],
  },

  {
    id: 'informeGerente',
    title: 'Informe Gerente',
    icon: ChartBarIcon,
    items: [
      {
        label: 'Indicadores del periodo',
        to: '/admin/informe-gerente',
        icon: ChartBarIcon,
      },
    ],
  },

  {
    id: 'secretaria',
    title: 'Secretaria',
    icon: BriefcaseIcon,
    items: [
      {
        label: 'Contratos',
        to: '/admin/secretaria/contrato',
        icon: DocumentTextIcon,
      },
      {
        label: 'Correspondencia recibida unidad',
        to: '/admin/secretaria/correspondencia',
        icon: FolderIcon,
      },
      {
        label: 'Correspondencia externa - Gerencia',
        to: '/admin/secretaria/gerencia',
        icon: FolderIcon,
      },
      {
        label: 'Correspondencia externa - Comercial',
        to: '/admin/secretaria/comercial',
        icon: FolderIcon,
      },
    ],
  },

  {
    id: 'medico',
    title: 'Consultorio medico',
    icon: HeartIcon,
    items: [
      {
        label: 'Inventario',
        to: '/admin/medicina/inventario',
        icon: BeakerIcon,
      },
    ],
  },

  {
    id: 'administracion',
    title: 'Administración',
    icon: BuildingOffice2Icon,
    items: [
      {
        label: 'Horas extra',
        to: '/admin/administracion/horas-extra',
        icon: UsersIcon,
      },
      {
        label: 'Utilidad',
        to: '/admin/administracion/utilidad',
        icon: CurrencyDollarIcon,
      },
      {
        label: 'Generacion de residuos',
        to: '/admin/administracion/generacion-residuos',
        icon: BeakerIcon,
      },
      {
        label: 'Indice de frecuencia',
        to: '/admin/administracion/indice-frecuencia',
        icon: ChartBarIcon,
      },
      {
        label: 'Indice de severidad',
        to: '/admin/administracion/indice-severidad',
        icon: ChartBarIcon,
      },
      {
        label: 'Donaciones',
        to: '/admin/administracion/donaciones',
        icon: HeartIcon,
      },
      {
        label: 'Atencion consultorio',
        to: '/admin/administracion/atencion-consultorio',
        icon: HeartIcon,
      },
    ],
  },

  {
    id: 'comercializacion',
    title: 'Comercializacion',
    icon: CurrencyDollarIcon,
    items: [
      {
        label: 'Ingreso por venta total',
        to: '/admin/comercializacion/ingreso-venta-total',
        icon: CurrencyDollarIcon,
      },
      {
        label: 'Venta total',
        to: '/admin/comercializacion/venta-total',
        icon: ChartBarIcon,
      },
      {
        label: 'Precio unitario',
        to: '/admin/comercializacion/precio-unitario',
        icon: CurrencyDollarIcon,
      },
    ],
  },
];
