import TablaRetutilizable from '@components/TablaReutilizable';
import {
  getObjs,
  UpdateIdObj,
  deleteObj,
  getIdObj,
} from '@service/Produccion/Secciones/Atomizado.services';
import ConfirmModal from '@components/ConfirmModal';
import AtomizadoModal from './AtomizadoModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const columnas = [
  { label: 'Fecha', key: 'fecha' },
  { label: 'Turno', key: 'turno' },
  { label: 'Operador', key: 'operador' },
  { label: 'Hora Inicio', key: 'hora_inicio' },
  { label: 'Hora Fin', key: 'hora_final' },
  {
    label: 'Observaciones',
    key: 'observacionesAtomizadoDatos',
    render: (row) =>
      row.observacionesAtomizadoDatos?.map((o) => o.observacion).join(' | '),
  },
];

export default function Atomizado() {
  const [idRow, setIdRow] = useState(null);
  const [payload, setPayload] = useState(null);
  const [openModalDelete, setOpenDelete] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
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
        setIdRow(null);
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al eliminar el registro');
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
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjs}
        titulo="Produccion/ Control de proceso de atomizado"
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
        danger={true}
        onClose={closeDelete}
        onConfirm={hanldeDelete}
      />
      <AtomizadoModal
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
      <AtomizadoModal
        open={openDetalles}
        onClose={handleCloseDetalles}
        fetchById={getIdObj}
        id={idDetalles}
        mode="view"
      />
    </>
  );
}
