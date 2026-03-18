import { api } from '../../api.js';
import { toServiceError } from '../../error.js';

export class InsumosServices {
  static async getAll() {
    try {
      const res = await api.get('/vaon/insumo');
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async getId(id) {
    try {
      const res = await api.get(`/vaon/insumo/${id}`);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async create(payload) {
    try {
      const fd = new FormData();

      fd.append('periodo', payload.periodo);
      fd.append('productos_nombres', payload.productos_nombres);
      fd.append('metros_cuadrados', payload.metros_cuadrados);
      fd.append('consumo_bs', payload.consumo_bs);

      if (payload.files?.length) {
        payload.files.forEach((file) => {
          fd.append('pdf', file);
        });
      }

      const res = await api.post('/vaon/insumo/area/vaon', fd);

      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async update(id, payload) {
    try {
      const fd = new FormData();

      fd.append('periodo', payload.periodo);
      fd.append('productos_nombres', payload.productos_nombres);
      fd.append('metros_cuadrados', payload.metros_cuadrados);
      fd.append('consumo_bs', payload.consumo_bs);

      if (payload.files?.length) {
        payload.files.forEach((file) => {
          fd.append('pdf', file);
        });
      }

      const res = await api.put(`/vaon/insumo/${id}/area/vaon`, fd);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async delete(id) {
    try {
      const res = await api.delete(`/vaon/insumo/${id}`);
      return res.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  // id = ID DEL DOCUMENTO, no del insumo
  static async viewDocumento(id) {
    try {
      const res = await api.get(`/vaon/insumo/view/${id}`, {
        responseType: 'blob',
      });

      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }

  // id = ID DEL DOCUMENTO, no del insumo
  static async downloadDocumento(id) {
    try {
      const res = await api.get(`/vaon/insumo/download/${id}`, {
        responseType: 'blob',
      });

      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
}
