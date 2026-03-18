import { z } from 'zod';
import { reqFloat, reqPeriodo } from '../../convert.js';

export const InformeSchema = z.object({
  periodo: reqPeriodo('Periodo'),
  metros_formato: reqFloat('Agua'),
});
