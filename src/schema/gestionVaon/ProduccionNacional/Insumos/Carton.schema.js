import { z } from 'zod';
import { reqFloat, reqPeriodo } from '../../../convert.js';

export const CartonSchema = z.object({
  periodo: reqPeriodo('Periodo'),
  costo_unitario_caja: reqFloat('Litros'),
  metros_cuadrados_caja: reqFloat('Precio'),
});
