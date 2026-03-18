import TablaRetutilizable from '@components/TablaReutilizable';
import { useState, useRef } from 'react';
import {
  getUsers,
  createUser,
  updateUser,
  getIdUser,
  deleteUser,
} from '@service/auth/Users.services';
import { toast } from 'react-toastify';
import UsuarioModal from './UsuarioModal';
import ConfirmModal from '@components/ConfirmModal';
const columnas = [
  { label: 'Nombre de usuario', key: 'username' },
  { label: 'Nombre persona', key: 'persona_nombre' },
  {
    label: 'Roles',
    key: 'roles',
    render: (row) => (
      <div className="max-w-200 whitespace-normal wrap-break-word">
        {row.roles?.map((o, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-medium text-emerald-800 m-1"
          >
            {o.nombre}
          </span>
        ))}
      </div>
    ),
  },
];

export default function Usuario() {
  const tableRef = useRef(null);
  const [loading, setLoading] = useState(false);
  //crear
  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateConfirm, setOpenCreateConfirm] = useState(false);
  const [payloadCreate, setPayloadCreate] = useState({});
  //actualizar
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openUpdateConfirm, setOpenUpdateConfirm] = useState(false);
  const [idUpdate, setIdUpdate] = useState(null);
  const [payloadUpdate, setPayloadUpdate] = useState({});
  //delete
  const [idDelete, setIdDelete] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  //Delete
  const handleOpenConfirmDelete = (id) => {
    setIdDelete(id);
    setOpenDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await deleteUser(idDelete);
      if (res.ok) {
        toast.success(res.message || 'Registro eliminado con éxito');
        tableRef.current?.reload();
        setOpenDeleteConfirm(false);
      }
      if (!res.ok) {
        throw new Error(res.message || 'Error al eliminar el usuario');
      }
    } catch (e) {
      toast.error(e.message || 'Error al eliminar el usuario');
    } finally {
      setLoading(false);
    }
  };

  //crear
  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleOpenConfirmCreate = (data) => {
    setPayloadCreate(data);
    setOpenCreateConfirm(true);
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const res = await createUser(payloadCreate);
      if (res.ok) {
        toast.success(res.message || 'Registro actualizado con éxito');
        tableRef.current?.reload();
        setOpenCreateConfirm(false);
        setOpenCreate(false);
      }
      if (!res.ok) {
        setOpenCreateConfirm(false);
        throw new Error(res.message || 'Error al actualizar el rol');
      }
    } catch (e) {
      toast.error(e.message || 'Error al actualizar el rol');
    } finally {
      setLoading(false);
    }
  };

  //update
  const handleOpenUpdate = (id) => {
    setIdUpdate(id);
    setOpenUpdate(true);
  };
  const handleOpenConfirmUpdate = (data) => {
    setPayloadUpdate(data);
    setOpenUpdateConfirm(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await updateUser(idUpdate, payloadUpdate);
      if (res.ok) {
        toast.success(res.message || 'Registro actualizado con éxito');
        tableRef.current?.reload();
        setOpenUpdateConfirm(false);
        setOpenUpdate(false);
      }
      if (!res.ok) {
        setOpenUpdateConfirm(false);
        throw new Error(res.message || 'Error al actualizar el rol');
      }
    } catch (e) {
      toast.error(e.message || 'Error al actualizar el rol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getUsers}
        titulo="Admin/ Gestión de usuarios"
        datosBusqueda={['username']}
        columnas={columnas}
        handleDetail={() => {}}
        handleEdit={handleOpenUpdate}
        hanldeDelete={handleOpenConfirmDelete}
        enableHorizontalScroll={false}
        isDetalle={false}
        tituloBoton="Crear nueva usuario"
        botonCrear={true}
        handleCrear={handleOpenCreate}
      />
      <UsuarioModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={handleOpenConfirmCreate}
      />
      <ConfirmModal
        open={openCreateConfirm}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenCreateConfirm(false)}
        onConfirm={handleCreate}
      />
      <UsuarioModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={getIdUser}
        id={idUpdate}
        isEdit={true}
      />
      <ConfirmModal
        open={openUpdateConfirm}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenUpdateConfirm(false)}
        onConfirm={handleUpdate}
      />
      <ConfirmModal
        open={openDeleteConfirm}
        title="Eliminar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={loading}
        danger={true}
        onClose={() => setOpenDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
