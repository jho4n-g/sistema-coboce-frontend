import TablaRetutilizable from '@components/TablaReutilizable';
import ConfirmModal from '@components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { FrasesServicios } from '@service/Documentos/Frases.services.js';
import FrasesModal from './FrasesModal';

const columnas = [
  {
    label: 'Frases',
    key: 'frase',
    render: (row) => (
      <div className="max-w-200 whitespace-normal wrap-break-word">
        {row.frase}
      </div>
    ),
  },
];

export default function Frases() {
  const tableRef = useRef(null);

  const [idRow, setIdRow] = useState(null);
  const [loading, setLoading] = useState(false);
  //delete
  const [openDelete, setDelete] = useState(false);
  //udate
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openConfirmUpdate, setConfirmUpdate] = useState(false);
  const [payloadUpdate, setPayloadUpdate] = useState(null);
  //create
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openConfirmCreate, setOpenConfirmCreate] = useState(false);
  const [payloadCreate, setPayloadCreate] = useState(null);

  //
  const hanldeOpenConfirmDelete = (id) => {
    setIdRow(id);
    setDelete(true);
  };
  const hanldeDelete = async () => {
    setLoading(true);
    try {
      const res = await FrasesServicios.delete(idRow);
      if (res.ok) {
        toast.success('Registro eliminado con éxito');
        closeDelete();
        tableRef.current?.reload();
      }
      if (!res.ok) {
        const err = new Error(res.message || 'Erro al acualizar');
        closeDelete();
        throw err;
      }
    } catch (e) {
      toast.error(e.message || 'Problemos en el servidor');
    } finally {
      setLoading(false);
    }
  };
  const closeDelete = () => {
    setDelete(false);
    setIdRow(null);
  };

  const hanldeEdit = (id) => {
    console.log('**********');
    console.log(id);
    console.log('**********');
    setIdRow(id);
    setOpenUpdate(true);
  };

  const handleOpenConfirmUpdate = (data) => {
    setPayloadUpdate(data);
    setConfirmUpdate(true);
  };
  const handleCloseConfirmUpdate = () => {
    setIdRow(null);
    setPayloadUpdate(null);
    setOpenUpdate(false);
  };
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await FrasesServicios.update(idRow, payloadUpdate);
      if (res.ok) {
        toast.success('Registro actualizado con éxito');
        setConfirmUpdate(false);
        setOpenUpdate(false);
        tableRef.current?.reload();
      }
      if (!res.ok) {
        const err = new Error(res.message || 'Error al actualizar');
        setConfirmUpdate(false);
        throw err;
      }
    } catch (e) {
      toast.error(e.message || 'Error al actualizar el registro');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModalConfirmCreate = (payload) => {
    setOpenConfirmCreate(true);
    setPayloadCreate(payload);
  };
  const hanldeCreate = async () => {
    try {
      setLoading(true);
      const res = await FrasesServicios.create(payloadCreate);
      if (res.ok) {
        toast.success('Registro actualizado con éxito');
        setOpenConfirmCreate(false);
        setOpenModalCreate(false);
        setPayloadCreate(null);
        tableRef.current?.reload();
      }
      if (!res.ok) {
        const err = new Error(res.message || 'Error al actualizar');
        setOpenConfirmCreate(false);
        throw err;
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
        getObj={FrasesServicios.getAll}
        titulo="Gestion de frases"
        datosBusqueda={['codigo', 'titulo']}
        columnas={columnas}
        isDetalle={false}
        handleDetail={() => {}}
        handleEdit={hanldeEdit}
        hanldeDelete={hanldeOpenConfirmDelete}
        enableHorizontalScroll={false}
        botonCrear={true}
        tituloBoton="Nuevo documento"
        handleCrear={() => setOpenModalCreate(true)}
      />
      <ConfirmModal
        open={openDelete}
        title="Eliminar registro"
        message="Esta acción no se puede deshacer. ¿Deseas continuar?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={loading}
        danger
        onClose={closeDelete}
        onConfirm={hanldeDelete}
      />

      <FrasesModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={FrasesServicios.getId}
        id={idRow}
        isEdit={true}
      />
      <ConfirmModal
        open={openConfirmUpdate}
        title="Editar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={handleCloseConfirmUpdate}
        onConfirm={handleUpdate}
      />
      <FrasesModal
        open={openModalCreate}
        onClose={() => setOpenModalCreate(false)}
        onSave={handleOpenModalConfirmCreate}
        isEdit={false}
      />
      <ConfirmModal
        open={openConfirmCreate}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenConfirmCreate(false)}
        onConfirm={hanldeCreate}
      />
    </>
  );
}
