import { api } from '../api';
import { toServiceError } from '../error';

export class FrasesServicios {
  static async getAll() {
    try {
      const data = await api.get('/documento/frase');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getRandom() {
    try {
      const data = await api.get('/documento/frase/random');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const data = await api.get(`/documento/frase/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const data = await api.post(`/documento/frase/`, payload);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const data = await api.put(`/documento/frase/${id}`, payload);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const data = await api.delete(`/documento/frase/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
