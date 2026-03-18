import { z } from 'zod';
import { reqFloat, reqPeriodo } from '../../../convert.js';

export const GasNaturalSchema = z.object({
  periodo: reqPeriodo('Periodo'),
  consumo_psc: reqFloat('Consumo psc'),
  consumo_bs: reqFloat('Consumo bs'),
});
