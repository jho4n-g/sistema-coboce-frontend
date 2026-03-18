import { z } from 'zod';

import { optStr, reqArray, reqStr } from '../convert.js';

export const PersonaCreateSchema = z.object({
  username: reqStr('username'),
  password: reqStr('password'),
  nombre: reqStr('Nombre completo'),
  area: optStr('Area'),
  correo: optStr('Correo'),
  cargo: optStr('Cargo'),
  roleIds: reqArray('Roles'),
});

export const PersonaUpdateSchema = z.object({
  username: reqStr('username'),
  password: optStr('password'),
  nombre: reqStr('Nombre completo'),
  area: optStr('Area'),
  correo: optStr('Correo'),
  cargo: optStr('Cargo'),
  roleIds: reqArray('Roles'),
});
