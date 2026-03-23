import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // Si NO está logeado → redirige
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si está logeado → renderiza las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;
