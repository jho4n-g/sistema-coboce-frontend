import { z } from 'zod';
import { optStr, reqStr, reqDia, reqMes } from '../convert.js';

export const FechasEstaticasSchema = z.object({
  dia: reqDia('Dia'),
  mes: reqMes('Mes'),
  titulo: reqStr('Titulo'),
  descripcion: optStr('Descripcion'),
});
