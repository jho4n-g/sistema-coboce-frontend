import { api } from '../api';
import { toServiceError } from '../error';

export const getObjPromedios = async () => {
  try {
    const data = await api.get(`/administracion/horas-extra/promedios`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjsDesempenioMes = async (id) => {
  try {
    const data = await api.get(`/administracion/horas-extra/desempenio/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const registerObjMetas = async (payload) => {
  try {
    const data = await api.post(`/administracion/horas-extra/metas`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjsUser = async (id) => {
  try {
    if (id != null) {
      const data = await api.get(`/administracion/horas-extra/cliente/${id}`);
      return data.data;
    } else {
      const data = await api.get(`/administracion/horas-extra/cliente/`);
      return data.data;
    }
  } catch (e) {
    return toServiceError(e);
  }
};
export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/administracion/horas-extra/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(`/administracion/horas-extra/${id}`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/administracion/horas-extra', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/administracion/horas-extra/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
