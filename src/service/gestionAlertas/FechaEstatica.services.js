import { api } from '../api';
import { toServiceError } from '../error';

export class FechaEstaticaServices {
  static async getAll() {
    try {
      const data = await api.get('/fecha-estatica');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async getId(id) {
    try {
      const data = await api.get(`/fecha-estatica/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const data = await api.post('/fecha-estatica', payload);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const data = await api.put(`/fecha-estatica/${id}`, payload);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const data = await api.delete(`/fecha-estatica/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
