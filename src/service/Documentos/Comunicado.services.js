import { api } from '../api';
import { toServiceError } from '../error';

export class ComunicadoServices {
  static async getAll() {
    try {
      const data = await api.get('/documento/comunicado');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const data = await api.get(`/documento/comunicado/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const fd = new FormData();

      fd.append('titulo', payload.titulo);
      fd.append('fecha', payload.fecha);
      fd.append('descripcion', payload.descripcion);

      fd.append('pdf', payload.file);
      fd.append('img', payload.imageFile);

      const res = await api.post(`/documento/comunicado/area/comunicado`, fd);

      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const fd = new FormData();

      fd.append('titulo', payload.titulo);
      fd.append('fecha', payload.fecha);
      fd.append('descripcion', payload.descripcion);

      fd.append('pdf', payload.file);
      fd.append('img', payload.imageFile);

      const res = await api.put(
        `/documento/comunicado/${id}/area/comunicado`,
        fd,
      );
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const res = await api.delete(`/documento/comunicado/${id}`);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async viewDocumeto(id) {
    try {
      const res = await api.get(`/documento/comunicado/view/${id}`, {
        responseType: 'blob',
      });
      console.log(res);
      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async DownloadDocumento(id) {
    try {
      const res = await api.get(`/documento/comunicado/download/${id}`, {
        responseType: 'blob',
      });
      return { ok: true, blob: res.data };
    } catch (e) {
      console.log(e);
      return toServiceError(e);
    }
  }
  static async getImage(id) {
    try {
      const res = await api.get(`/documento/comunicado/imagen/${id}`, {
        responseType: 'blob',
      });

      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
  static getImageUrl(id, version = '') {
    const base = `${import.meta.env.VITE_API_URL}/documento/comunicado/imagen/${id}`;
    return version ? `${base}?v=${version}` : base;
  }
}
