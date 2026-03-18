import { z } from 'zod';

import { optStr, reqStr, reqFecha } from '../../convert.js';

export const ProcedimientoSchema = z.object({
  fecha: reqFecha('Fecha'),
  codigo: reqStr('codigo'),
  titulo: reqStr('titulo'),
  descripcion: optStr('descripcion'),
  area: reqStr('area'),
});
