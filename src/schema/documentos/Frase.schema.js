import { z } from 'zod';

import { reqStr } from '../convert.js';

export const FraseSchema = z.object({
  frase: reqStr('Frase'),
});
