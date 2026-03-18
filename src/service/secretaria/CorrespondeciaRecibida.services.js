import { api } from '../api';
import { toServiceError } from '../error';

export const getDocuments = async () => {
  try {
    const data = await api.get('/secretaria/correspondencia');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdDocument = async (id) => {
  try {
    const data = await api.get(`/secretaria/correspondencia/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getDocumentsView = async (id) => {
  try {
    const res = await api.get(`/secretaria/correspondencia/view/${id}`, {
      responseType: 'blob',
    });
    return { ok: true, blob: res.data };
  } catch (e) {
    return toServiceError(e);
  }
};

export const getDocumentsDownload = (id) => {
  return `${import.meta.env.VITE_API_URL}/secretaria/correspondencia/download/${id}`;
};

export const createDocuments = async (payload) => {
  try {
    const fd = new FormData();

    // Formatear fechas correctamente

    fd.append('fecha', payload.fecha);
    fd.append('cite', payload.cite);
    fd.append('referencia', payload.referencia);
    fd.append('emitido_por', payload.emitido_por);
    fd.append('derivado_a', payload.derivado_a);

    fd.append('pdf', payload.file);

    const res = await api.post(
      `/secretaria/correspondencia/area/secretaria`,
      fd,
    );
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updatedDocument = async (id, payload) => {
  try {
    const fd = new FormData();
    fd.append('fecha', payload.fecha);
    fd.append('cite', payload.cite);
    fd.append('referencia', payload.referencia);
    fd.append('emitido_por', payload.emitido_por);
    fd.append('derivado_a', payload.derivado_a);
    fd.append('pdf', payload.file);
    console.log(fd);
    const res = await api.put(
      `/secretaria/correspondencia/${id}/area/secretaria`,
      fd,
    );
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteDocument = async (id) => {
  try {
    const res = await api.delete(`/secretaria/correspondencia/${id}`);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const delelteDocument = deleteDocument;
