import { api } from '../api';
import { toServiceError } from '../error';

export const getObjPromedios = async () => {
  try {
    const data = await api.get(`/administracion/genracion-residuos/promedios`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjsDesempenioMes = async (id) => {
  try {
    const data = await api.get(
      `/administracion/genracion-residuos/desempenio/${id}`,
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
        `/administracion/genracion-residuos/cliente/${id}`,
      );
      return data.data;
    } else {
      const data = await api.get(`/administracion/genracion-residuos/cliente/`);
      return data.data;
    }
  } catch (e) {
    return toServiceError(e);
  }
};
export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/administracion/genracion-residuos/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/administracion/genracion-residuos/${id}`,
      payload,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/administracion/genracion-residuos', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/administracion/genracion-residuos/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
