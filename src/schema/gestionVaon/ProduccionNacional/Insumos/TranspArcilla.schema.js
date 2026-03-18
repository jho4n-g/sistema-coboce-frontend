import { z } from 'zod';
import { reqFloat, reqPeriodo } from '../../../convert.js';

export const TranspArcillaSchema = z.object({
  periodo: reqPeriodo('Periodo'),
  consumo_kg: reqFloat('Consumo kg'),
  consumo_bs: reqFloat('Consumo bs'),
});
