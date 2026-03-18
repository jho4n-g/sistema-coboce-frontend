import { api } from '../../../api.js';
import { toServiceError } from '../../../error.js';

export class AguaServices {
  static async getAll() {
    try {
      const data = await api.get('/vaon/agua');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const data = await api.get(`/vaon/agua/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const fd = new FormData();

      fd.append('periodo', payload.periodo);

      fd.append('consumo_litros', payload.consumo_litros);
      fd.append('precio_total', payload.precio_total);
      fd.append('metros_cuadrados', payload.metros_cuadrados);

      fd.append('pdf', payload.file);

      const res = await api.post(`/vaon/agua/area/vaon`, fd);

      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const fd = new FormData();

      fd.append('periodo', payload.periodo);
      fd.append('consumo_litros', payload.consumo_litros);
      fd.append('precio_total', payload.precio_total);
      fd.append('metros_cuadrados', payload.metros_cuadrados);

      fd.append('pdf', payload.file);

      const res = await api.put(`/vaon/agua/${id}/area/vaon`, fd);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const res = await api.delete(`/vaon/agua/${id}`);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async viewDocumeto(id) {
    try {
      const res = await api.get(`/vaon/agua/view/${id}`, {
        responseType: 'blob',
      });
      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async DownloadDocumento(id) {
    try {
      const res = await api.get(`/vaon/agua/download/${id}`, {
        responseType: 'blob',
      });

      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
}
