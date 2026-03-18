import { api } from '../../api';
import { toServiceError } from '../../error';

export const getObjPromedios = async () => {
  try {
    const data = await api.get(`/produccion/indice-consumo-gn/promedios`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjsDesempenioMes = async (id) => {
  try {
    const data = await api.get(
      `/produccion/indice-consumo-gn/desempenio/${id}`,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const registerObjMetas = async (payload) => {
  try {
    const data = await api.post(`/produccion/indice-consumo-gn/metas`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjsUser = async (id) => {
  try {
    if (id != null) {
      const data = await api.get(`/produccion/indice-consumo-gn/cliente/${id}`);
      return data.data;
    } else {
      const data = await api.get(`/produccion/indice-consumo-gn/cliente/`);
      return data.data;
    }
  } catch (e) {
    return toServiceError(e);
  }
};
export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/produccion/indice-consumo-gn/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(`/produccion/indice-consumo-gn/${id}`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/produccion/indice-consumo-gn/', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/indice-consumo-gn/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
