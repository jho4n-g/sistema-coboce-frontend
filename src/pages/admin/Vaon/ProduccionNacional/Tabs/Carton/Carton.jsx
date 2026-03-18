import TablaRetutilizable from '@components/TablaReutilizable';
import ConfirmModal from '@components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { periodoATexto } from '@helpers/normalze.helpers';
import { CartonServices as services } from '@service/GestionVaon/ProduccionNacional/Insumos/Carton.services.js';
import CartonModal from './CartonModal';
import CartonDetallesModa from './CartonDetallesModa';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Conto unitario caja', key: 'costo_unitario_caja' },
  { label: 'M² caja', key: 'metros_cuadrados_caja' },
];

export default function Politica() {
  const tableRef = useRef(null);

  const [idRow, setIdRow] = useState(null);
  const [loading, setLoading] = useState(false);
  //

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
  //detalles
  //
  const [openDetalles, setOpenDetalles] = useState(false);
  const [idDetalles, setIdDetalles] = useState(null);
  //detalles
  const hanldeOpenDetalles = (id) => {
    setIdDetalles(id);
    setOpenDetalles(true);
  };
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
        titulo="Produccion nacional/ Carton"
        datosBusqueda={['codigo', 'titulo']}
        columnas={columnas}
        handleDetail={hanldeOpenDetalles}
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

      <CartonModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={services.getId}
        id={idRow}
        isEditing={true}
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
      <CartonModal
        open={openModalCreate}
        onClose={() => setOpenModalCreate(false)}
        onSave={handleOpenModalConfirmCreate}
        isEditing={false}
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
      <CartonDetallesModa
        open={openDetalles}
        onClose={() => setOpenDetalles(false)}
        id={idDetalles}
        fetchById={services.getId}
      />
    </>
  );
}
