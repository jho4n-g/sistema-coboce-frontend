import TablaRetutilizable from '@components/TablaReutilizable';
import {
  getObjs,
  UpdateIdObj,
  deleteObj,
  getIdObj,
} from '@service/Produccion/Secciones/Seleccion.services';
import ConfirmModal from '@components/ConfirmModal';
import SeleccionModal from './SeleccionModal';
import SeleccionEmbalajeDetalleModal from './SeleccionEmbalajeDetalleModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { normalizarFecha } from '@helpers/normalze.helpers';

const columnas = [
  { label: 'Fecha', key: 'fecha', render: (row) => normalizarFecha(row.fecha) },
  { label: 'Producto', key: 'producto' },
  { label: 'Linea', key: 'linea' },
  { label: 'Horno', key: 'horno' },
  { label: 'Formato', key: 'formato' },
  { label: 'Turno', key: 'turno' },
  { label: 'Operador', key: 'operador' },
  { label: 'Grupo', key: 'grupo' },
  {
    label: 'Observaciones',
    key: 'observacion_embalaje',
    render: (row) => (
      <div className="max-w-80 whitespace-normal wrap-break-word">
        {row.observacion_embalaje?.map((o) => o.observacion).join(' | ')}
      </div>
    ),
  },
];

export default function Seleccion() {
  const [idRow, setIdRow] = useState(null);
  const [openModalDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [payload, setPayload] = useState(null);

  const [openDetalle, setOpenDetalle] = useState(false);

  //
  const handleOpenDetalle = (id) => {
    setIdRow(id);
    setOpenDetalle(true);
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
        toast.error(res.message || 'Error al actualizar el registro12');
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
        titulo="Produccion/ Control de proceso de seleccion y embalaje"
        datosBusqueda={[
          'turno',
          'operador',
          'producto',
          'horno',
          'formato',
          'grupo',
        ]}
        columnas={columnas}
        handleDetail={handleOpenDetalle}
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
      <SeleccionModal
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
      <SeleccionModal
        open={openDetalle}
        onClose={() => setOpenDetalle(false)}
        fetchById={getIdObj} // tu servicio
        id={idRow}
        mode="view"
      />
    </>
  );
}
