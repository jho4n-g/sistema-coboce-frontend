import { z } from 'zod';
import { reqFloat, reqPeriodo } from '../../../convert.js';

export const EnergiaElectricaSchema = z.object({
  periodo: reqPeriodo('Periodo'),
  consumo_kw: reqFloat('Consumo kw'),
  consumo_bs: reqFloat('Consumo bs'),
});
