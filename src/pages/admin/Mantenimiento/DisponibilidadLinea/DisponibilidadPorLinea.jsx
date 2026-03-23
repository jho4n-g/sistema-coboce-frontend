import TablaRetutilizable from '@components/TablaReutilizable';
import {
  registerObjMetas,
  getObjPromedios,
  getObjsDesempenioMes,
} from '@service/Mantenimiento/DisponibilidadPorLinea';
import ConfirmModal from '@components/ConfirmModal';
import DisponibilidadPorLineaModal from './DisponibilidadPorLineaModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import GraficoBarChart from '@components/GraficoBarChart';
import {
  periodoATexto,
  normalizarPorcentaje,
} from '../../../../helpers/normalze.helpers';
import ModalChartDesempenio from '@components/ModalChartDesempenio';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  {
    label: 'N° horas proactivas planificadas',
    key: 'n_horas_productivas_planificadas_prom',
  },
  {
    label: 'N° horas lineas paradas linea b',
    key: 'n_horas_lineas_paradas_linea_b_prom',
  },
  {
    label: 'N° horas lineas paradas linea c',
    key: 'n_horas_lineas_paradas_linea_c_prom',
  },
  {
    label: 'N horas lineas paradas linea d',
    key: 'n_horas_lineas_paradas_linea_d_prom',
  },
  {
    label: 'N horas lineas paradas linea e',
    key: 'n_horas_lineas_paradas_linea_e_prom',
  },
  {
    label: 'Disponibilidad linea b',
    key: 'disponibilidad_linea_b',
    render: (row) => normalizarPorcentaje(row.disponibilidad_linea_b),
  },
  {
    label: 'Disponibilidad linea c',
    key: 'disponibilidad_linea_c',
    render: (row) => normalizarPorcentaje(row.disponibilidad_linea_c),
  },
  {
    label: 'Disponibilidad linea d',
    key: 'disponibilidad_linea_d',
    render: (row) => normalizarPorcentaje(row.disponibilidad_linea_d),
  },
  {
    label: 'Disponibilidad linea d',
    key: 'disponibilidad_linea_e',
    render: (row) => normalizarPorcentaje(row.disponibilidad_linea_e),
  },
  {
    label: 'Meta',
    key: 'meta',
  },
];

export default function DisponibilidadPorLinea() {
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

  const [datosGrafico, setDatosGrafica] = useState(null);

  //Cambiear meta
  const [openMeta, setOpenMeta] = useState(false);
  const [openMetaConfirm, setOpenMetaConfirm] = useState(false);
  const [payloadMeta, setPayloadMeta] = useState(null);

  //Detalles
  const [idRow, setIdRow] = useState(null);
  const [openDetalles, setOpenDetalles] = useState(false);
  //Detalles
  const handleOpenDetalles = (id) => {
    setIdRow(id);
    setOpenDetalles(true);
  };

  const handleCloseDetalles = () => {
    setOpenDetalles(false);
    setIdRow(null);
  };

  const handleOpenMeta = () => {
    setOpenMeta(true);
  };
  const handleOpenMetaConfirm = (payload) => {
    setPayloadMeta(payload);
    setOpenMetaConfirm(true);
  };
  const handleCreateMeta = async () => {
    try {
      setLoading(true);
      const res = await registerObjMetas(payloadMeta);
      if (res.ok) {
        toast.success(res.message || 'Registro creado con éxito');
        tableRef.current?.reload();
        setOpenMetaConfirm(false);
        setOpenMeta(false);
      }
      if (!res.ok) {
        setOpenMetaConfirm(false);
        throw new Error(res.message || 'Error al crear el registro');
      }
    } catch (e) {
      toast.error(e.message || 'Error al crear el registro');
    } finally {
      setLoading(false);
    }
  };

  const labelCategorias = (datosGrafico?.categories ?? []).map((row) =>
    periodoATexto(row),
  );
  const series = [
    {
      name: 'N horas paradas lineas paradas b',
      data: datosGrafico?.n_horas_productivas_planificadas_prom,
    },
    {
      name: 'N horas paradas lineas paradas c',
      data: datosGrafico?.n_horas_lineas_paradas_linea_c_prom,
    },
    {
      name: 'N horas paradas lineas paradas d',
      data: datosGrafico?.n_horas_lineas_paradas_linea_d_prom,
    },
    {
      name: 'N horas paradas lineas paradas e',
      data: datosGrafico?.n_horas_lineas_paradas_linea_e_prom,
    },
  ];

  const seriesTwo = [
    {
      name: 'Disponibilidad linea b',
      data: datosGrafico?.disponibilidad_linea_b,
    },
    {
      name: 'Disponibilidad linea c',
      data: datosGrafico?.disponibilidad_linea_c,
    },
    {
      name: 'Disponibilidad linea d',
      data: datosGrafico?.disponibilidad_linea_d,
    },
    {
      name: 'Disponibilidad linea e',
      data: datosGrafico?.disponibilidad_linea_e,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Mantenimineto/ Disponibilidad por linea"
        datosBusqueda={['periodo']}
        columnas={columnas}
        handleDetail={handleOpenDetalles}
        isDetalle={true}
        handleEdit={() => {}}
        hanldeDelete={() => {}}
        enableHorizontalScroll={false}
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
        botonCrear={true}
        tituloBoton="Ingresar nuevo periodo"
        handleCrear={handleOpenMeta}
        isDelete={false}
        isEdit={false}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="N° lineas paradas"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Disponibilidad por linea"
          categories={labelCategorias}
          series={seriesTwo}
          height={400}
          showToolbox
        />
      </div>
      <DisponibilidadPorLineaModal
        open={openMeta}
        onClose={() => setOpenMeta(false)}
        onSave={handleOpenMetaConfirm}
      />
      <ConfirmModal
        open={openMetaConfirm}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenMetaConfirm(false)}
        onConfirm={handleCreateMeta}
      />
      <ModalChartDesempenio
        open={openDetalles}
        onClose={handleCloseDetalles}
        fetchById={getObjsDesempenioMes}
        id={idRow}
        titleModal="Desempeño del mes"
        titleChart="Disponibilidad insumos por linea"
        mapResponseToChart={(resp) => {
          const g = resp?.datos?.datoGrafico ?? {};
          return {
            categories: g.categories ?? [],
            series: [
              {
                name: 'N horas paradas linea b',
                data: g.n_horas_lineas_paradas_linea_b ?? [],
              },
              {
                name: 'N horas paradas linea c',
                data: g.n_horas_lineas_paradas_linea_c ?? [],
              },
              {
                name: 'N horas paradas linea d',
                data: g.n_horas_lineas_paradas_linea_d ?? [],
              },
              {
                name: 'N horas paradas linea e',
                data: g.n_horas_lineas_paradas_linea_e ?? [],
              },
            ],
          };
        }}
      />
    </>
  );
}
