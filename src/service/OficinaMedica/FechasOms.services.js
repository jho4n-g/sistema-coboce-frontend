import { api } from '../api';
import { toServiceError } from '../error';

export class FechasOmsServices {
  static async getAll() {
    try {
      const data = await api.get('/medicina/oms');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getFechasCercanas() {
    try {
      const data = await api.get('/medicina/oms/cercanas');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const data = await api.get(`/medicina/oms/${id}`);
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const fd = new FormData();

      fd.append('dia', payload.dia);
      fd.append('mes', payload.mes);
      fd.append('titulo', payload.titulo);
      fd.append('descripcion', payload.descripcion);

      fd.append('img', payload.imageFile);

      const res = await api.post(`/medicina/oms/area/consultorio`, fd);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const fd = new FormData();

      fd.append('dia', payload.dia);
      fd.append('mes', payload.mes);
      fd.append('titulo', payload.titulo);
      fd.append('descripcion', payload.descripcion);

      fd.append('img', payload.imageFile);

      const res = await api.put(`/medicina/oms/${id}/area/consultorio`, fd);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const res = await api.delete(`/medicina/oms/${id}`);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getImage(id) {
    try {
      const res = await api.get(`/medicina/oms/imagen/${id}`, {
        responseType: 'blob',
      });

      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
  static getImageUrl(id, version = '') {
    const base = `${import.meta.env.VITE_API_URL}/medicina/oms/imagen/${id}`;
    return version ? `${base}?v=${version}` : base;
  }
}
