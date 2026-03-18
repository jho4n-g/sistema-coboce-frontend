import { z } from 'zod';

import { optStr, reqStr, reqFecha } from '../../convert.js';

export const PoliticaSchema = z.object({
  fecha: reqFecha('Fecha'),
  codigo: reqStr('Codigo'),
  titulo: reqStr('Titulo'),
  descripcion: optStr('Descripcion'),
});
