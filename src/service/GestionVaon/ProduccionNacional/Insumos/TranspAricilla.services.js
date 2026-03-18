import { api } from '../../../api.js';
import { toServiceError } from '../../../error.js';

export class TranspArcillaServices {
  static async getAll() {
    try {
      const data = await api.get('/vaon/transp-arcilla');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const data = await api.get(`/vaon/transp-arcilla/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const fd = new FormData();

      fd.append('periodo', payload.periodo);

      fd.append('consumo_kg', payload.consumo_kg);
      fd.append('consumo_bs', payload.consumo_bs);

      fd.append('pdf', payload.file);

      const res = await api.post(`/vaon/transp-arcilla/area/vaon`, fd);

      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const fd = new FormData();

      fd.append('periodo', payload.periodo);
      fd.append('consumo_kg', payload.consumo_kg);
      fd.append('consumo_bs', payload.consumo_bs);

      fd.append('pdf', payload.file);

      const res = await api.put(`/vaon/transp-arcilla/${id}/area/vaon`, fd);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const res = await api.delete(`/vaon/transp-arcilla/${id}`);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async viewDocumeto(id) {
    try {
      const res = await api.get(`/vaon/transp-arcilla/view/${id}`, {
        responseType: 'blob',
      });
      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async DownloadDocumento(id) {
    try {
      const res = await api.get(`/vaon/transp-arcilla/download/${id}`, {
        responseType: 'blob',
      });

      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
}
