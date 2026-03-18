import TablaRetutilizable from '@components/TablaReutilizable';
import {
  createDocuments,
  deleteDocument,
  getDocuments,
  updatedDocument,
  getIdDocument,
} from '@service/secretaria/CorrespondenciaRecibida.services.js';
import ConfirmModal from '@components/ConfirmModal';
import CorrespondenciaRecibidaModal from './CorrespondenciaRecibidaModal';
import CorrespondenciaInternaDetallesModal from './CorrespondenciaInternaDetallesModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { normalizarFecha } from '@helpers/normalze.helpers';

const columnas = [
  {
    label: 'Fecha',
    key: 'fecha',
    render: (row) => normalizarFecha(row.fecha),
  },
  { label: 'Cite', key: 'cite' },
  { label: 'Referencia', key: 'referencia' },
  { label: 'Emitido Por', key: 'emitido_por' },
  {
    label: 'Derivado a',
    key: 'derivado_a',
  },
];

export default function CorrespondenciaRecibida() {
  const [idRow, setIdRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);
  //delete
  const [openModalDelete, setOpenDelete] = useState(false);
  //update
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openConfirmUpdate, setOpenConfirmUpdate] = useState(false);
  const [payloadUpdate, setPayloadUpdate] = useState(null);
  //create
  //create
  const [openCreate, setOpenCreate] = useState(false);
  const [openConfirmCreate, setOpenConfirmCreate] = useState(false);
  const [payloadCreate, setPayloadCreate] = useState(false);
  //Detalles
  const [openDetails, setOpenDetails] = useState(false);
  const [detailId, setDetailId] = useState(null);

  const handleView = (id) => {
    setDetailId(id);
    setOpenDetails(true);
  };

  //create
  const handleCreate = (payload) => {
    setPayloadCreate(payload);
    setOpenConfirmCreate(true);
  };
  const handleConfirmCreate = async () => {
    try {
      setLoading(true);
      const res = await createDocuments(payloadCreate);
      if (res.ok) {
        toast.success(res.message || 'Registro guardado con éxito');
        setOpenConfirmCreate(false);
        setOpenCreate(false);
        tableRef.current?.reload();
      }
      if (!res.ok) {
        setOpenConfirmUpdate(false);
        toast.error(res.message || 'Error al guardar el registro12');
      }
    } catch (e) {
      toast.error(e.message || 'Error al guardar el registro');
    } finally {
      setLoading(false);
    }
  };
  //delete

  const hanldeOpenConfirmDelete = (id) => {
    setIdRow(id);
    setOpenDelete(true);
  };
  const hanldeDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteDocument(idRow);
      if (res.ok) {
        toast.success('Registro eliminado con éxito');
        closeDelete();
        tableRef.current?.reload();
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al eliminar el registro');
        setOpenConfirmCreate(false);
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
    setOpenUpdate(true);
  };

  const handleOpenConfirmUpdate = (data) => {
    setPayloadUpdate(data);
    setOpenConfirmUpdate(true);
  };
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await updatedDocument(idRow, payloadUpdate);
      if (res.ok) {
        toast.success('Registro actualizado con éxito');
        setOpenConfirmUpdate(false);
        tableRef.current?.reload();
        setOpenUpdate(false);
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al actualizar el registro12');
        setOpenConfirmUpdate(false);
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
        getObj={getDocuments}
        titulo="Secretaria/ Correspondencia recibida"
        datosBusqueda={['cite', 'referencia', 'emitido_por', 'derivado_a']}
        columnas={columnas}
        handleDetail={handleView}
        handleEdit={hanldeEdit}
        hanldeDelete={hanldeOpenConfirmDelete}
        enableHorizontalScroll={false}
        botonCrear={true}
        tituloBoton="Nuevo documento"
        handleCrear={() => setOpenCreate(true)}
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

      <CorrespondenciaRecibidaModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={getIdDocument}
        id={idRow}
        isEditing={true}
      />
      <ConfirmModal
        open={openConfirmUpdate}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenConfirmUpdate(false)}
        onConfirm={handleUpdate}
      />
      <CorrespondenciaRecibidaModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={handleCreate}
      />
      <ConfirmModal
        open={openConfirmCreate}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => {
          setOpenConfirmCreate(false);
        }}
        onConfirm={handleConfirmCreate}
      />
      <CorrespondenciaInternaDetallesModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        fetchById={getIdDocument} // tu función getById del service
        id={detailId}
      />
    </>
  );
}
