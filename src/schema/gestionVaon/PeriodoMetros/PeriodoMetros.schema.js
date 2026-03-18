import { z } from 'zod';
import { reqFloat, reqPeriodo } from '../../convert.js';

export const PeriodoMetrosSchema = z.object({
  periodo: reqPeriodo('Periodo'),
  metros: reqFloat('Metros'),
});
