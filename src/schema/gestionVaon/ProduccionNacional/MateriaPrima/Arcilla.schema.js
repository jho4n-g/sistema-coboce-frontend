import { z } from 'zod';
import { reqFloat, reqPeriodo } from '../../../convert.js';

export const ArcillaSchema = z.object({
  periodo: reqPeriodo('Periodo'),
  consumo_kg: reqFloat('Litros'),
  consumo_bs: reqFloat('Precio'),
});
