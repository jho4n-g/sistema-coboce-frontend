import { api } from '../api';
import { toServiceError } from '../error';

export const LoginUser = async (datos) => {
  try {
    const data = await api.post('/login', datos);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getMe = async (config) => {
  try {
    const data = await api.get('/me', config);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
