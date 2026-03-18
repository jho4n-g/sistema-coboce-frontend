import { api } from '../api';
import { toServiceError } from '../error';

export const getObjPromedios = async () => {
  try {
    const data = await api.get(`/administracion/donaciones/promedios`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjsDesempenioMes = async (id) => {
  try {
    const data = await api.get(`/administracion/donaciones/desempenio/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjsUser = async (id) => {
  try {
    if (id != null) {
      const data = await api.get(`/administracion/donaciones/cliente/${id}`);
      return data.data;
    } else {
      const data = await api.get(`/administracion/donaciones/cliente/`);
      return data.data;
    }
  } catch (e) {
    return toServiceError(e);
  }
};
export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/administracion/donaciones/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(`/administracion/donaciones/${id}`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/administracion/donaciones', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/administracion/donaciones/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
