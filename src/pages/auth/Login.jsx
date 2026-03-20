import LogoCeramicaCoboce from '../../img/logo-ceramica-coboce.png';
import InputField from '@components/InputField';
import PasswordField from '@components/PasswordField';
import { DatosLogin } from '@schema/auth/Login.schema';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoginUser } from '../../service/auth/Login.services';

import useAuth from '../../hooks/auth.hook.jsx';

const initialForm = {
  username: '',
  password: '',
};

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleValidation = async () => {
    const result = DatosLogin.safeParse(form);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      setError(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    } else {
      const data = result.data;
      SaveData(data);
    }
  };

  const SaveData = async (data) => {
    try {
      setLoading(true);
      const res = await LoginUser(data);
      console.log(res);
      if (res.ok) {
        toast.success('Inicio de sesión exitoso');
        localStorage.setItem('token', res.token);
        setAuth(res.user);
        setForm(initialForm);
        if (res.user.roles[0].nombre == 'admin') {
          navigate('/admin/');
        } else {
          navigate('/cliente');
        }
      } else {
        throw new Error(res.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError({ username: ' ', password: ' ' });
      toast.error(error.message || 'Error del servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda: login */}
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
          {/* Logo */}
          <div className="mb-6">
            <img
              src={LogoCeramicaCoboce}
              alt="logo"
              className="h-10 w-20 rounded object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold mb-1">Bienvenido de nuevo</h1>
          <p className="text-sm text-slate-500 mb-6">
            Inicia sesión para acceder a tu cuenta.
          </p>
          {/* Correo */}
          <div>
            <InputField
              label="Nombre de usuario"
              type="text"
              placeholder="Introduce tu correo"
              name="username"
              value={form?.username ?? ''}
              onChange={updateBase}
              error={error.username}
            />
          </div>
          {/* Contraseña */}
          <PasswordField
            label="Contraseña"
            name="password"
            className="mt-2"
            placeholder="Introduce tu contraseña"
            value={form?.password ?? ''}
            onChange={updateBase}
            error={error.password}
          />
          {/* Botón */}
          <button
            className="w-full mt-3 rounded-lg bg-emerald-800 py-2.5 text-sm font-medium text-white hover:bg-emerald-900"
            onClick={handleValidation}
          >
            {loading ? 'Procesando...' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
      <div className="hidden md:flex flex-1 bg-emerald-800 items-center justify-center px-10">
        <div className="w-full max-w-xl bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8">
          {/* Etiqueta pequeña arriba */}
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-2">
            Cultura
          </p>

          {/* Título principal */}
          <h2 className="text-2xl font-semibold mb-3 text-emerald-900">
            Reglas de Oro
          </h2>

          {/* Frase introductoria */}
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            La puntualidad habla de tu compromiso y respeto por los demás. Ten
            en cuenta:
          </p>

          {/* Lista de reglas */}
          <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-700 mb-4">
            <li>Si llegas cinco minutos antes, estás a tiempo.</li>
            <li>Si llegas justo a la hora, es tarde.</li>
            <li>Si llegas tarde, no puedes ingresar.</li>
            <li>
              Ser puntual es:
              <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                <li>Orden</li>
                <li>Respeto</li>
                <li>Responsabilidad</li>
                <li>Disciplina</li>
                <li>Actitud positiva</li>
              </ul>
            </li>
          </ul>

          {/* Frase de cierre */}
          <p className="text-xs text-slate-500 italic">
            “La puntualidad es la cortesía de los reyes y la disciplina de los
            equipos profesionales.”
          </p>
        </div>
      </div>
    </div>
  );
}
