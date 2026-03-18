import { api } from '../api';
import { toServiceError } from '../error';

export const getObjs = async () => {
  try {
    const data = await api.get('/secretaria/gerencia');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const registerObj = async (payload) => {
  try {
    const res = await api.post('/secretaria/gerencia', payload);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const res = await api.get(`/secretaria/gerencia/${id}`);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const UpdateIdObj = async (id, updateddata) => {
  try {
    const data = await api.put(`/secretaria/gerencia/${id}`, updateddata);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/secretaria/gerencia/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
