import { z } from 'zod';
import { reqStr, reqMes, reqDia } from '../convert.js';

export const FechasOmsschema = z.object({
  dia: reqDia('dia'),
  mes: reqMes('mes'),
  titulo: reqStr('titulo'),
  descripcion: reqStr('Descripcion'),
});
