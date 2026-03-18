import { z } from 'zod';
import { reqFloat, reqPeriodo, reqStr } from '../../convert.js';

export const InusmosSchema = z.object({
  periodo: reqPeriodo('Periodo'),
  productos_nombres: reqStr('Nombres'),
  metros_cuadrados: reqFloat('Litros'),
  consumo_bs: reqFloat('Precio'),
});
