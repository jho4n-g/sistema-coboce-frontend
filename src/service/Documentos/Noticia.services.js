import { api } from '../api';
import { toServiceError } from '../error';

export class NoticiaServices {
  static async getAll() {
    try {
      const data = await api.get('/documento/noticia');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const data = await api.get(`/documento/noticia/${id}`);
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

      const res = await api.post(`/documento/noticia/area/noticia`, fd);

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
      fd.append('codigo', payload.codigo);
      fd.append('descripcion', payload.descripcion);

      fd.append('pdf', payload.file);
      fd.append('img', payload.imageFile);

      const res = await api.put(`/documento/noticia/${id}/area/noticia`, fd);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const res = await api.delete(`/documento/noticia/${id}`);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async viewDocumeto(id) {
    try {
      const res = await api.get(`/documento/noticia/view/${id}`, {
        responseType: 'blob',
      });

      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async DownloadDocumento(id) {
    return `${import.meta.env.VITE_API_URL}/documento/noticia/view/${id}`;
  }
  static async getImage(id) {
    try {
      const res = await api.get(`/documento/noticia/imagen/${id}`, {
        responseType: 'blob',
      });

      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
  static getImageUrl(id, version = '') {
    const base = `${import.meta.env.VITE_API_URL}/documento/noticia/imagen/${id}`;
    return version ? `${base}?v=${version}` : base;
  }
}
