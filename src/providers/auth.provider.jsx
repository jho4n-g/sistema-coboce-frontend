import { useEffect } from 'react';
import { useState, createContext } from 'react';
import { getMe } from '../service/auth/Login.services';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuth(null);
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const data = await getMe(config);
        if (data.ok) {
          setAuth(data.user);
        } else {
          setAuth(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        setAuth(null);
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
