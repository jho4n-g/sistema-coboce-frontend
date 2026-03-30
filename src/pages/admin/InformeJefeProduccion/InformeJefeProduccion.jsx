import TablaRetutilizable from '@components/TablaReutilizable';
import ConfirmModal from '@components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { InformeProduccionServices as services } from '../../../service/InformeProduccion/InformeProduccion.services.js';
import InformeJefeProduccionModal from './InformeJefeProduccionModal.jsx';
import { getIdFormatoLinea } from '@service/Produccion/Secciones/Formato.services';
import { getObjsUnidos as getLineas } from '@service/Produccion/Secciones/Lineas.services';

const columnas = [
  {
    label: 'Fecha',
    key: 'fecha',
  },
  {
    label: 'Supervisor',
    key: 'supervisor',
  },
  {
    label: 'Linea',
    key: 'linea',
  },
  {
    label: 'Formato',
    key: 'formato',
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
      const res = await services.delete(idRow);
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
      const res = await services.update(idRow, payloadUpdate);
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
      const res = await services.create(payloadCreate);
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
        getObj={services.getAll}
        titulo="Informe Jefe de Producción"
        datosBusqueda={['supervisor', 'linea', 'formato']}
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

      <InformeJefeProduccionModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={services.getId}
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

      <InformeJefeProduccionModal
        open={openModalCreate}
        onClose={() => setOpenModalCreate(false)}
        onSave={handleOpenModalConfirmCreate}
        mode="create" // create | edit | view
        getLineas={getLineas}
        getFormatosByLinea={getIdFormatoLinea}
      />
      <InformeJefeProduccionModal
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
