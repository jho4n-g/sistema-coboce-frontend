import TablaRetutilizable from '@components/TablaReutilizable';
import {
  registerObjMetas,
  getObjPromedios,
  getObjsDesempenioMes,
} from '@service/Administracion/Utilidad.services';
import ConfirmModal from '@components/ConfirmModal';
import UtilidadModal from './UtilidadModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  periodoATexto,
  normalizarPorcentaje,
  AgregarPorcentaje,
} from '@helpers/normalze.helpers';
import ModalChartDesempenio from '@components/ModalChartDesempenio';
import GraficoBarChart from '@components/GraficoBarChart';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Utilidad mensual', key: 'utilidad_mensual_prom' },
  { label: 'Meta mensual', key: 'meta_mensual_prom' },
  {
    label: 'Utilidad acumulado',
    key: 'utilidad_acumulada',
  },
  {
    label: 'Meta acumulado',
    key: 'meta_acumulada',
  },
  {
    label: 'Cumplimiento mensual',
    key: 'cumplimiento_acumulado',
    render: (row) => normalizarPorcentaje(row.cumplimiento_acumulado),
  },
  {
    label: 'Meta',
    key: 'meta',
    render: (row) => AgregarPorcentaje(row?.meta || 0),
  },
];

export default function Utilidad() {
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
      name: 'Utilidad mensual',
      data: datosGrafico?.utilidad_mensual_prom,
    },
    {
      name: 'Meta mensual',
      data: datosGrafico?.meta_mensual_prom,
    },
    {
      name: 'Utilidad acumulada',
      data: datosGrafico?.utilidad_acumulada,
    },
    {
      name: 'Meta acumulada',
      data: datosGrafico?.meta_acumulada,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Produccion/ Control de proceso de seleccion y embalaje"
        datosBusqueda={['periodo']}
        columnas={columnas}
        handleDetail={handleOpenDetalles}
        isDetalle={true}
        handleEdit={() => {}}
        hanldeDelete={() => {}}
        enableHorizontalScroll={false}
        botonCrear={true}
        tituloBoton="Cambiar meta"
        handleCrear={handleOpenMeta}
        isDelete={false}
        isEdit={false}
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Utilidad"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>
      <UtilidadModal
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
        titleChart="Horas extra"
        mapResponseToChart={(resp) => {
          const g = resp?.datos?.datoGrafico ?? {};
          return {
            categories: g.categories ?? [],
            series: [
              {
                name: 'Utilidad Mensual',
                data: g?.utilidad_mensual,
              },
              {
                name: 'Meta mensual',
                data: g?.meta_mensual,
              },
            ],
          };
        }}
      />
    </>
  );
}
