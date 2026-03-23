import ClienteLayout from '../layouts/ClienteLayout';
import { AuthProvider } from './auth.provider';
import useAuth from '../hooks/auth.hook';

const ClienteProtected = () => {
  const { auth, loading } = useAuth();

  //   if (loading) return <div>Cargando...</div>;

  //   if (!auth) {
  //     return <Navigate to="/login" replace />;
  //   }

  //   if (auth.rol !== 'cliente') {
  //     return <Navigate to="/login" replace />;
  //   }
  return (
    <AuthProvider>
      <ClienteLayout />
    </AuthProvider>
  );
};

export default ClienteProtected;
