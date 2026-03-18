import { api } from '../api';
import { toServiceError } from '../error';

export const getObjs = async () => {
  try {
    const data = await api.get(`/produccion/informe-gerente`);
    return data.data;
  } catch (e) {
    console.log(e);
    return toServiceError(e);
  }
};
