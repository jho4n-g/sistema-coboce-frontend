import { api } from '../api';
import { toServiceError } from '../error';

export const getObjs = async () => {
  try {
    const data = await api.get(`/informe-gerente`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
