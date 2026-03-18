import { z } from 'zod';
import { reqFloat, reqPeriodo } from '../../../convert.js';

export const AguaSchema = z.object({
  periodo: reqPeriodo('Periodo'),
  consumo_litros: reqFloat('Litros'),
  precio_total: reqFloat('Precio'),
  metros_cuadrados: reqFloat('Metros²'),
});
