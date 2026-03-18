import { api } from '../api';
import { toServiceError } from '../error';

export class EnfermedadesMesServices {
  static async getAll() {
    try {
      const data = await api.get('/medicina/enfermedad');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getEnfermedadesPeriodo() {
    try {
      const data = await api.get('/medicina/enfermedad/mes');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const data = await api.get(`/medicina/enfermedad/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const data = await api.post(`/medicina/enfermedad/`, payload);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const data = await api.put(`/medicina/enfermedad/${id}`, payload);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const data = await api.delete(`/medicina/enfermedad/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
