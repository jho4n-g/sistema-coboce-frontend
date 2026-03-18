import { z } from 'zod';
import { reqFecha, reqStr, reqEntero } from '../convert.js';

export const CumpleañosSchema = z.object({
  nombre_completo: reqStr('Entregado por'),
  fecha: reqFecha('Fecha'),
  edad: reqEntero('Edad'),
});
