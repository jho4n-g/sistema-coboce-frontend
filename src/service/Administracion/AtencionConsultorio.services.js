import { api } from '../api';
import { toServiceError } from '../error';

export const getObjsUser = async (id) => {
  try {
    if (id != null) {
      const data = await api.get(
        `/administracion/atencion-consultorio/cliente/${id}`,
      );
      return data.data;
    } else {
      const data = await api.get(
        `/administracion/atencion-consultorio/cliente/`,
      );
      return data.data;
    }
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/administracion/atencion-consultorio/${id}`,
      payload,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const registerObj = async (payload) => {
  try {
    const data = await api.post(
      '/administracion/atencion-consultorio',
      payload,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/administracion/atencion-consultorio/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/administracion/atencion-consultorio/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
