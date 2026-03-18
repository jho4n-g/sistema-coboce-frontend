import { api } from '../api';
import { toServiceError } from '../error';

export class CumpleañosMesServices {
  static async getAll() {
    try {
      const data = await api.get('/cumpleanos/trabajador');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getCumpleaniosPorMes() {
    try {
      const data = await api.get('/cumpleanos/trabajador/mes');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const data = await api.get(`/cumpleanos/trabajador/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const data = await api.post('/cumpleanos/trabajador/', payload);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const data = await api.put(`/cumpleanos/trabajador/${id}`, payload);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const data = await api.delete(`/cumpleanos/trabajador/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
