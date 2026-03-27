import { api } from '../api';
import { toServiceError } from '../error';

export class InformeProduccionServices {
  static async getAll() {
    try {
      const data = await api.get('/jefe-produccion/informe');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async getId(id) {
    try {
      const data = await api.get(`/jefe-produccion/informe/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const data = await api.post(`/jefe-produccion/informe/`, payload);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const data = await api.put(`/jefe-produccion/informe/${id}`, payload);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const data = await api.delete(`/jefe-produccion/informe/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
