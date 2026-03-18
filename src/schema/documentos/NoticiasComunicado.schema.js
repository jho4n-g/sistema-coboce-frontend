import { z } from 'zod';

import { optStr, reqStr, reqFecha } from '../convert.js';

export const NoticiaComunicadoSchema = z.object({
  fecha: reqFecha('Fecha'),
  titulo: reqStr('Titulo'),
  descripcion: optStr('Descripcion'),
});
