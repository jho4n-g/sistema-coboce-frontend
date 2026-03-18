import { api } from '../api';
import { toServiceError } from '../error';

export const getObjPromedios = async () => {
  try {
    const data = await api.get(`/administracion/indice-severidad/promedios`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjsDesempenioMes = async (id) => {
  try {
    const data = await api.get(
      `/administracion/indice-severidad/desempenio/${id}`,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const registerObjMetas = async (payload) => {
  try {
    const data = await api.post(
      `/administracion/indice-severidad/metas`,
      payload,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjsUser = async (id) => {
  try {
    if (id != null) {
      const data = await api.get(
        `/administracion/indice-severidad/cliente/${id}`,
      );
      return data.data;
    } else {
      const data = await api.get(`/administracion/indice-severidad/cliente/`);
      return data.data;
    }
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/administracion/indice-severidad/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/administracion/indice-severidad/${id}`,
      payload,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/administracion/indice-severidad', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/administracion/indice-severidad/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
