import { api } from '../api';
import { toServiceError } from '../error';

export const getObjPromedios = async () => {
  try {
    const data = await api.get(`/comercializacion/venta-total/promedios`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjsDesempenioMes = async (id) => {
  try {
    const data = await api.get(
      `/comercializacion/venta-total/desempenio/${id}`,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const registerObjMetas = async (payload) => {
  try {
    const data = await api.post(`/comercializacion/venta-total/metas`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getObjsUser = async (id) => {
  try {
    if (id != null) {
      const data = await api.get(`/comercializacion/venta-total/cliente/${id}`);
      return data.data;
    } else {
      const data = await api.get(`/comercializacion/venta-total/cliente/`);
      return data.data;
    }
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/comercializacion/venta-total/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(`/comercializacion/venta-total/${id}`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/comercializacion/venta-total', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/comercializacion/venta-total/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
