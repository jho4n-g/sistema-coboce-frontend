import { api } from '../../api';
import { toServiceError } from '../../error';

export class ProcesosServices {
  static async getAll() {
    try {
      const data = await api.get('/documento/calidad/procedimiento');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const data = await api.get(`/documento/calidad/procedimiento/${id}`);
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
      fd.append('codigo', payload.codigo);
      fd.append('descripcion', payload.descripcion);
      fd.append('area', payload.area);

      fd.append('pdf', payload.file);
      fd.append('img', payload.imageFile);

      const res = await api.post(
        `/documento/calidad/procedimiento/area/calidad`,
        fd,
      );

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
      fd.append('area', payload.area);

      fd.append('pdf', payload.file);
      fd.append('img', payload.imageFile);

      const res = await api.put(
        `/documento/calidad/procedimiento/${id}/area/calidad`,
        fd,
      );
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const res = await api.delete(`/documento/calidad/procedimiento/${id}`);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async viewDocumeto(id) {
    try {
      const res = await api.get(`/documento/calidad/procedimiento/view/${id}`, {
        responseType: 'blob',
      });
      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async DownloadDocumento(id) {
    try {
      const res = await api.get(
        `/documento/calidad/procedimiento/download/${id}`,
        {
          responseType: 'blob',
        },
      );

      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getImage(id) {
    try {
      const res = await api.get(
        `/documento/calidad/procedimiento/imagen/${id}`,
        {
          responseType: 'blob',
        },
      );

      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
  static getImageUrl(id, version = '') {
    const base = `${import.meta.env.VITE_API_URL}/documento/calidad/procedimiento/imagen/${id}`;
    return version ? `${base}?v=${version}` : base;
  }
}
