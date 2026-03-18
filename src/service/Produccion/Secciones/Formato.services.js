import { api } from '../../api';
import { toServiceError } from '../../error';

export const getFormato = async () => {
  try {
    const data = await api.get('/produccion/formato/');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjs = async () => {
  try {
    const data = await api.get('/produccion/formato/detalles');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdFormatoLinea = async (id) => {
  try {
    const data = await api.get(`/produccion/formato/linea/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObj = async (payload) => {
  try {
    const res = await api.post('/produccion/formato', payload);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const res = await api.get(`/produccion/formato/${id}`);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const UpdateIdObj = async (id, updateddata) => {
  try {
    const data = await api.put(`/produccion/formato/${id}`, updateddata);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/formato/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
