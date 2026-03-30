import TablaRetutilizable from '@components/TablaReutilizable';
import ConfirmModal from '@components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { InformeProduccionServices as services } from '@service/InformeProduccion/InformeProduccion.services.js';
import InformeJefeProduccionModal from './InformeJefeProduccionModal.jsx';
import { getIdFormatoLinea } from '@service/Produccion/Secciones/Formato.services';
import { getObjsUnidos as getLineas } from '@service/Produccion/Secciones/Lineas.services';
import { normalizarFecha } from '@helpers/normalze.helpers.js';

const columnas = [
  {
    label: 'Fecha',
    key: 'fecha',
    render: (row) => normalizarFecha(row.fecha),
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
  {
    label: 'Primera m2',
    key: 'total_primera_m2',
  },
  {
    label: 'Segunda m2',
    key: 'total_segunda_m2',
  },
  {
    label: 'Tercera m2',
    key: 'total_tercera_m2',
  },
  {
    label: 'Casco m2',
    key: 'total_casco_m2',
  },
  {
    label: 'Pruebas m2',
    key: 'total_pruebas_m2',
  },
  {
    label: 'Total m2',
    key: 'total_dia_m2',
  },
];

export default function Frases() {
  const tableRef = useRef(null);

  // const [idRow, setIdRow] = useState(null);
  const [loading, setLoading] = useState(false);
  //delete
  const [idDelete, setIdDelete] = useState(null);
  const [openDelete, setDelete] = useState(false);
  //udate
  const [idUpdate, setIdUpdate] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openConfirmUpdate, setConfirmUpdate] = useState(false);
  const [payloadUpdate, setPayloadUpdate] = useState(null);
  //create
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openConfirmCreate, setOpenConfirmCreate] = useState(false);
  const [payloadCreate, setPayloadCreate] = useState(null);
  //Detalles

  const [idDetalle, setIdDetalle] = useState(null);
  const [openDetalle, setOpenDetalle] = useState(false);
  //

  const handldeOpenDetalle = (id) => {
    setIdDetalle(id);
    setOpenDetalle(true);
  };
  const handleCloseDetalle = () => {
    setIdDetalle(null);
    setOpenDetalle(false);
  };
  //
  const hanldeOpenConfirmDelete = (id) => {
    setIdDelete(id);
    setDelete(true);
  };
  const hanldeDelete = async () => {
    setLoading(true);
    try {
      const res = await services.delete(idDelete);
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
    setIdDelete(null);
  };

  const hanldeEdit = (id) => {
    setIdUpdate(id);
    setOpenUpdate(true);
  };

  const handleOpenConfirmUpdate = (data) => {
    setPayloadUpdate(data);
    setConfirmUpdate(true);
  };
  const handleCloseConfirmUpdate = () => {
    setIdUpdate(null);
    setConfirmUpdate(null);
    setOpenUpdate(false);
  };
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await services.update(idUpdate, payloadUpdate);
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
        isDetalle={true}
        handleDetail={handldeOpenDetalle}
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
        id={idUpdate}
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

      <InformeJefeProduccionModal
        id={idDetalle}
        open={openDetalle}
        fetchById={services.getId}
        onClose={handleCloseDetalle}
        isView={true}
      />
    </>
  );
}
