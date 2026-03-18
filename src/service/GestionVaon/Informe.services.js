import { api } from '../api.js';
import { toServiceError } from '../error.js';

export class InformeServices {
  static async getAll() {
    try {
      const data = await api.get('/vaon/informe');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getIdCostos(id) {
    try {
      const data = await api.get(`/vaon/informe/costo/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const data = await api.get(`/vaon/informe/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const res = await api.post(`/vaon/informe/`, payload);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const res = await api.put(`/vaon/informe/${id}`, payload);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const res = await api.delete(`/vaon/informe/${id}`);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
