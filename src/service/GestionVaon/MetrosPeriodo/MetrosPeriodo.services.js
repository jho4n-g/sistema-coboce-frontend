import { api } from '../../api';
import { toServiceError } from '../../error';

export class PeriodoMetrosServicios {
  static async getAll() {
    try {
      const data = await api.get('/vaon/metros');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async getId(id) {
    try {
      const data = await api.get(`/vaon/metros/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const data = await api.post(`/vaon/metros/`, payload);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const data = await api.put(`/vaon/metros/${id}`, payload);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const data = await api.delete(`/vaon/metros/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
