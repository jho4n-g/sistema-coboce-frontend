import { api } from '../../../api.js';
import { toServiceError } from '../../../error.js';

export class EnergiaElectricaServices {
  static async getAll() {
    try {
      const data = await api.get('/vaon/energia-electrica');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const data = await api.get(`/vaon/energia-electrica/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const fd = new FormData();

      fd.append('periodo', payload.periodo);

      fd.append('consumo_kw', payload.consumo_kw);
      fd.append('consumo_bs', payload.consumo_bs);

      fd.append('pdf', payload.file);

      const res = await api.post(`/vaon/energia-electrica/area/vaon`, fd);

      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const fd = new FormData();

      fd.append('periodo', payload.periodo);
      fd.append('consumo_kw', payload.consumo_kw);
      fd.append('consumo_bs', payload.consumo_bs);

      fd.append('pdf', payload.file);

      const res = await api.put(`/vaon/energia-electrica/${id}/area/vaon`, fd);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const res = await api.delete(`/vaon/energia-electrica/${id}`);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async viewDocumeto(id) {
    try {
      const res = await api.get(`/vaon/energia-electrica/view/${id}`, {
        responseType: 'blob',
      });
      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async DownloadDocumento(id) {
    try {
      const res = await api.get(`/vaon/energia-electrica/download/${id}`, {
        responseType: 'blob',
      });

      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
}
