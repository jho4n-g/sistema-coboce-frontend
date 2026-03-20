import { z } from 'zod';
import { optStr, reqFecha, reqStr } from '../convert.js';

export const FechaTareaSchema = z.object({
  fecha: reqFecha('Fecha'),
  titulo: reqStr('Titulo'),
  descripcion: optStr('Descripcion'),
});
