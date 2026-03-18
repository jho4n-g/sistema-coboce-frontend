import { api } from '../api';
import { toServiceError } from '../error';

export const getDocuments = async () => {
  try {
    const data = await api.get('/secretaria/contrato');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdDocument = async (id) => {
  try {
    const data = await api.get(`/secretaria/contrato/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getDocumentsView = async (id) => {
  try {
    const res = await api.get(`/secretaria/contrato/view/${id}`, {
      responseType: 'blob',
    });
    return { ok: true, blob: res.data };
  } catch (e) {
    return toServiceError(e);
  }
};

export const getDocumentsDownload = (id) => {
  return `${import.meta.env.VITE_API_URL}/secretaria/contrato/download/${id}`;
};

export const createDocuments = async (payload) => {
  try {
    const fd = new FormData();

    // Formatear fechas correctamente

    fd.append('n_contrato_cite', payload.n_contrato_cite);
    fd.append('area_contrato', payload.area_contrato);
    fd.append('empresa', payload.empresa);
    fd.append('proveedor', payload.proveedor);
    fd.append('objeto', payload.objeto);
    fd.append('monto_contrato', payload.monto_contrato);
    fd.append('fecha_inicio', payload.fecha_inicio);
    fd.append('finalizacion_contrato', payload.finalizacion_contrato);

    fd.append('pdf', payload.file);

    const res = await api.post(`/secretaria/contrato/area/secretaria`, fd);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updatedDocument = async (id, payload) => {
  try {
    const fd = new FormData();

    fd.append('n_contrato_cite', payload.n_contrato_cite);
    fd.append('area_contrato', payload.area_contrato);
    fd.append('empresa', payload.empresa);
    fd.append('proveedor', payload.proveedor);
    fd.append('objeto', payload.objeto);
    fd.append('monto_contrato', payload.monto_contrato);
    fd.append('fecha_inicio', payload.fecha_inicio);
    fd.append('finalizacion_contrato', payload.finalizacion_contrato);

    fd.append('pdf', payload.file);

    const res = await api.put(`/secretaria/contrato/${id}/area/secretaria`, fd);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteDocument = async (id) => {
  try {
    const res = await api.delete(`/secretaria/contrato/${id}`);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const delelteDocument = deleteDocument;
