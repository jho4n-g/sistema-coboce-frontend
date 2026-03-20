import { z } from 'zod';
import { reqStr, reqDia, reqMes } from '../convert.js';

export const CumpleañosSchema = z.object({
  nombre_completo: reqStr('Nombre completo'),
  dia: reqDia('Dia'),
  mes: reqMes('Mes'),
});
