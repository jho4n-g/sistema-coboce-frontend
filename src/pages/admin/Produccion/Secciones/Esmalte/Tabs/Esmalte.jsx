import TablaRetutilizable from '@components/TablaReutilizable';
import {
  getObjs,
  UpdateIdObj,
  deleteObj,
  getIdObj,
} from '@service/Produccion/Secciones/Esmalte.services';
import ConfirmModal from '@components/ConfirmModal';
import EsmalteModal from './EsmalteModal.jsx';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const columnas = [
  { label: 'Fecha', key: 'fecha' },
  { label: 'Turno', key: 'turno' },
  { label: 'Operador', key: 'operador' },
  { label: 'Producto', key: 'producto' },
  { label: 'Linea', key: 'linea' },
  {
    label: 'Observaciones',
    key: 'observaciones_esmalte',
    render: (row) =>
      row.observaciones_esmalte?.map((o) => o.observacion).join(' | '),
  },
];

export default function Esmalte() {
  const [idRow, setIdRow] = useState(null);
  const [openModalDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [payload, setPayload] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);

  const tableRef = useRef(null);
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
  //

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
      toast.error(e.message || 'Problemos en el servidor');
    } finally {
      setLoading(false);
    }
  };
  const closeDelete = () => {
    setOpenDelete(false);
    setIdRow(null);
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
  const hanldeEdit = (id) => {
    setIdRow(id);
    setOpenModal(true);
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
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjs}
        titulo="Produccion/ Control de la linea de esmaltacion"
        datosBusqueda={['fecha', 'turno', 'operador']}
        columnas={columnas}
        handleDetail={handleDetalles}
        handleEdit={(id) => hanldeEdit(id)}
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
      <EsmalteModal
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
      <EsmalteModal
        open={openDetalles}
        onClose={handleCloseDetalles}
        fetchById={getIdObj}
        id={idDetalles}
        mode="view"
      />
    </>
  );
}
