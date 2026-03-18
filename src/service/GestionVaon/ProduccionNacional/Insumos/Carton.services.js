import { api } from '../../../api.js';
import { toServiceError } from '../../../error.js';

export class CartonServices {
  static async getAll() {
    try {
      const data = await api.get('/vaon/carton');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const data = await api.get(`/vaon/carton/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const fd = new FormData();

      fd.append('periodo', payload.periodo);

      fd.append('costo_unitario_caja', payload.costo_unitario_caja);
      fd.append('metros_cuadrados_caja', payload.metros_cuadrados_caja);

      fd.append('pdf', payload.file);

      const res = await api.post(`/vaon/carton/area/vaon`, fd);

      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const fd = new FormData();

      fd.append('periodo', payload.periodo);
      fd.append('costo_unitario_caja', payload.costo_unitario_caja);
      fd.append('metros_cuadrados_caja', payload.metros_cuadrados_caja);

      fd.append('pdf', payload.file);

      const res = await api.put(`/vaon/carton/${id}/area/vaon`, fd);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const res = await api.delete(`/vaon/carton/${id}`);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async viewDocumeto(id) {
    try {
      const res = await api.get(`/vaon/carton/view/${id}`, {
        responseType: 'blob',
      });
      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async DownloadDocumento(id) {
    try {
      const res = await api.get(`/vaon/carton/download/${id}`, {
        responseType: 'blob',
      });

      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
}
