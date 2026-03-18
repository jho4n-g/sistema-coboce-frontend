import { api } from '../../api';
import { toServiceError } from '../../error';

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/produccion/calidad/', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObjMetas = async (payload) => {
  try {
    const data = await api.post('/produccion/calidad/metas', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const createObj = async (payload) => {
  try {
    const data = await api.post('/produccion/calidad/', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getObjsPromedios = async () => {
  try {
    const data = await api.get('/produccion/calidad/promedios');

    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getAllObj = async (id) => {
  try {
    if (id != null) {
      const data = await api.get(`/produccion/calidad/periodo/${id}`);
      return data.data;
    } else {
      const data = await api.get(`/produccion/calidad/periodo/`);
      return data.data;
    }
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/produccion/calidad/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(`/produccion/calidad/${id}`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/calidad/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
