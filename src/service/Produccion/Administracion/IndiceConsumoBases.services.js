import { api } from '../../api';
import { toServiceError } from '../../error';

export const getObjsDesempenioMes = async (id) => {
  try {
    const data = await api.get(
      `/produccion/indice-consumo-bases/desempenio/${id}`,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObjMetas = async (payload) => {
  try {
    const data = await api.post(
      `/produccion/indice-consumo-bases/metas`,
      payload,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjPromedios = async () => {
  try {
    const data = await api.get(`/produccion/indice-consumo-bases/promedios/`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getAllObj = async (id) => {
  try {
    if (id != null) {
      const data = await api.get(
        `/produccion/indice-consumo-bases/cliente/${id}`,
      );
      return data.data;
    } else {
      const data = await api.get(`/produccion/indice-consumo-bases/cliente/`);
      return data.data;
    }
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/produccion/indice-consumo-bases/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/produccion/indice-consumo-bases/${id}`,
      payload,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/produccion/indice-consumo-bases/', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/indice-consumo-bases/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
