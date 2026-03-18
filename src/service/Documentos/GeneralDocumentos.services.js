import { api } from '../api';
import { toServiceError } from '../error';
export class GeneralDocumentos {
  static async getCalidad() {
    try {
      const data = await api.get('/documento/general/calidad');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getAmbiente() {
    try {
      const data = await api.get('/documento/general/ambiental');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getSeguridad() {
    try {
      const data = await api.get('/documento/general/seguridad');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getNoticias() {
    try {
      const data = await api.get('/documento/general/noticias');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getComunicado() {
    try {
      const data = await api.get('/documento/general/comunicado');
      return data.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getUltimaNoticia() {
    try {
      const res = await api.get('/documento/general/ultima-noticia', {
        responseType: 'blob',
      });
      return { ok: true, blob: res.data };
    } catch (e) {
      return toServiceError(e);
    }
  }
}
