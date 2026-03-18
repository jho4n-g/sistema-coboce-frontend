import { api } from '../../api';
import { toServiceError } from '../../error';

export const getObjs = async () => {
  try {
    const data = await api.get('/produccion/dia-informe');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/produccion/dia-informe/${id}`);

    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
