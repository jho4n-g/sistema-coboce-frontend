import { z } from 'zod';
import {
  optNum,
  reqEntero,
  reqFecha,
  reqFloat,
  reqPct,
  reqStr,
} from '../convert.js';

// =========================
// PRENSA
// =========================
const prensaSchema = z.object({
  turno_id: reqEntero('turno'),
  silo_utilizado: reqStr('silo utilizado'),
  arcilla_consumida: reqFloat('arcilla consumida'),
  ciclos: reqFloat('ciclos'),
  peso_pieza: reqFloat('peso pieza'),
  perdida: reqFloat('pérdida'),
});

// =========================
// DETALLE DE PRODUCTO POR TURNO
// =========================
const detalleSchema = z.object({
  turno_id: reqEntero('turno'),

  metros_cuadrados_primera: reqFloat('metros cuadrados primera'),
  porcentaje_primera: reqPct('porcentaje primera'),

  metros_cuadrados_segunda: reqFloat('metros cuadrados segunda'),
  porcentaje_segunda: reqPct('porcentaje segunda'),

  metros_cuadrados_tercera: reqFloat('metros cuadrados tercera'),
  porcentaje_tercera: reqPct('porcentaje tercera'),

  metros_cuadrados_casco: reqFloat('metros cuadrados casco'),
  porcentaje_casco: reqPct('porcentaje casco'),
});

// =========================
// PRODUCTO DEL INFORME
// =========================
const informeProductoSchema = z
  .object({
    nombre_producto: reqStr('producto'),
    programado_m2: reqFloat('programado m2'),
    acumulado_m2: reqFloat('acumulado m2'),
    acumulado_dia: reqFloat('acumulado día'),
    orden: optNum().optional(),
    detalles: z.array(detalleSchema).min(1, 'Debe tener al menos un detalle'),
  })
  .refine(
    (data) => {
      const set = new Set();

      for (const d of data.detalles) {
        if (set.has(d.turno_id)) return false;
        set.add(d.turno_id);
      }

      return true;
    },
    {
      message: 'No puede haber turnos repetidos en los detalles del producto',
      path: ['detalles'],
    },
  );

// =========================
// CREATE
// =========================
export const informeSchema = z
  .object({
    fecha: reqFecha('día'),
    supervisor: reqStr('supervisor'),
    linea_id: reqEntero('línea'),
    formato_id: reqEntero('formato'),
    prensa: z.array(prensaSchema).min(1, 'Debe tener al menos una prensa'),
    informe_producto: z
      .array(informeProductoSchema)
      .min(1, 'Debe tener al menos un producto'),
  })
  .refine(
    (data) => {
      const set = new Set();

      for (const p of data.prensa) {
        if (set.has(p.turno_id)) return false;
        set.add(p.turno_id);
      }

      return true;
    },
    {
      message: 'No puede haber turnos repetidos en prensa',
      path: ['prensa'],
    },
  );

// =========================
// UPDATE
// =========================
export const informeUpdateSchema = z
  .object({
    fecha: reqFecha('día').optional(),
    supervisor: reqStr('supervisor').optional(),
    linea_id: reqEntero('línea').optional(),
    formato_id: reqEntero('formato').optional(),
    prensa: z.array(prensaSchema).optional(),
    informe_producto: z.array(informeProductoSchema).optional(),
  })
  .refine(
    (data) => {
      if (!data.prensa) return true;

      const set = new Set();

      for (const p of data.prensa) {
        if (set.has(p.turno_id)) return false;
        set.add(p.turno_id);
      }

      return true;
    },
    {
      message: 'No puede haber turnos repetidos en prensa',
      path: ['prensa'],
    },
  );
