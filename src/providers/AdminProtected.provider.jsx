import { Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import useAuth from '../hooks/auth.hook';

const AdminProtected = () => {
  const { auth, loading } = useAuth();

  //   if (loading) return <div>Cargando...</div>;

  //   if (!auth) {
  //     return <Navigate to="/login" replace />;
  //   }

  //   if (auth.rol !== 'cliente') {
  //     return <Navigate to="/login" replace />;
  //   }
  return <AdminLayout />;
};

export default AdminProtected;
