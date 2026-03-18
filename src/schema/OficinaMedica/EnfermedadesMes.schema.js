import { z } from 'zod';
import { reqStr, reqPeriodo, reqEntero } from '../convert.js';

export const EnfermedadesMesschema = z.object({
  periodo: reqPeriodo('periodo'),
  titulo: reqStr('titulo'),
  casos: reqEntero('casos'),
});
