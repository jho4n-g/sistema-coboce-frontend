import { z } from 'zod';
import { reqFloat, reqPeriodo } from '../../../convert.js';

export const ManoObraSchema = z.object({
  periodo: reqPeriodo('Periodo'),
  metros_cuadrados: reqFloat('Litros'),
  consumo_bs: reqFloat('Precio'),
});
