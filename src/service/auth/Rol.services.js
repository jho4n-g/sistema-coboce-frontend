import { api } from '../api';
import { toServiceError } from '../error';

export const createObj = async (payload) => {
  try {
    const data = await api.post(`/rol/`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getObjs = async () => {
  try {
    const data = await api.get('/rol');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getRoles = async () => {
  try {
    const data = await api.get('/rol/seleccion');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getPermisos = async () => {
  try {
    const data = await api.get('/rol/permiso');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/rol/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(`/rol/${id}`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/rol/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
