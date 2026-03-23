import TablaRetutilizable from '@components/TablaReutilizable';
import {
  getObjs,
  UpdateIdObj,
  deleteObj,
  getIdObj,
} from '@service/Produccion/Secciones/Prensado.services';
import ConfirmModal from '@components/ConfirmModal';
import PrensadoGif from '../../../../../../animation/Prensado.gif';
import PrensadoModal from './PrensadoModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const columnas = [
  { label: 'Fecha', key: 'fecha' },
  { label: 'N° prensa', key: 'n_prensa' },
  { label: 'Turno', key: 'turno' },
  { label: 'Formato', key: 'formato' },
  { label: 'Operador', key: 'operador' },
  { label: 'Producto', key: 'producto' },
  {
    label: 'Observaciones',
    key: 'observaciones_prensado_secado',
    render: (row) =>
      row.observaciones_prensado_secado?.map((o) => o.observacion).join(' | '),
  },
];

export default function Prensado() {
  const [idRow, setIdRow] = useState(null);
  const [openModalDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [payload, setPayload] = useState(null);
  //Detalles
  const [openDetalles, setOpenDetalles] = useState(false);
  const [idDetalles, setIdDetalles] = useState(null);

  const handleDetalles = (id) => {
    setIdDetalles(id);
    setOpenDetalles(true);
  };
  const handleCloseDetalles = () => {
    setIdDetalles(null);
    setOpenDetalles(false);
  };

  const hanldeOpenConfirmDelete = (id) => {
    setIdRow(id);
    setOpenDelete(true);
  };
  const hanldeDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteObj(idRow);
      if (res.ok) {
        toast.success('Registro eliminado con éxito');
        closeDelete();
        tableRef.current?.reload();
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al eliminar el registro');
        setOpenModalUpdate(false);
      }
    } catch (e) {
      toast.error(e.message || 'Error al eliminar el registro');
    } finally {
      setLoading(false);
    }
  };
  const closeDelete = () => {
    setOpenDelete(false);
    setIdRow(null);
  };

  const hanldeEdit = (id) => {
    setIdRow(id);
    setOpenModal(true);
  };

  const handleOpenConfirmUpdate = (data) => {
    setPayload(data);
    setOpenModalUpdate(true);
  };
  const handleCloseConfirmUpdate = () => {
    setIdRow(null);
    setPayload(null);
    setOpenModalUpdate(false);
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await UpdateIdObj(idRow, payload);

      if (res.ok) {
        toast.success('Registro actualizado con éxito');
        setOpenModalUpdate(false);
        tableRef.current?.reload();
        setOpenModal(false);
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al actualizar el registro');
        setOpenModalUpdate(false);
      }
    } catch (e) {
      toast.error(e.message || 'Error al actualizar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <img
        src={PrensadoGif}
        alt="Cargando..."
        className="w-15 aspect-square object-contain"
      />
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjs}
        titulo="Produccion/ Control de proceso prensado y secado"
        datosBusqueda={['fecha', 'turno', 'operador']}
        columnas={columnas}
        handleDetail={handleDetalles}
        handleEdit={hanldeEdit}
        hanldeDelete={hanldeOpenConfirmDelete}
        enableHorizontalScroll={false}
      />
      <ConfirmModal
        open={openModalDelete}
        title="Eliminar registro"
        message="Esta acción no se puede deshacer. ¿Deseas continuar?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={loading}
        danger
        onClose={closeDelete}
        onConfirm={hanldeDelete}
      />
      <PrensadoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={getIdObj}
        id={idRow}
        mode="edit"
      />
      <ConfirmModal
        open={openModalUpdate}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={handleCloseConfirmUpdate}
        onConfirm={handleSave}
      />
      <PrensadoModal
        open={openDetalles}
        onClose={handleCloseDetalles}
        fetchById={getIdObj}
        id={idDetalles}
        mode="view"
      />
    </>
  );
}
