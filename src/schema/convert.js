import { z } from 'zod';

export const reqFecha = (label = 'Fecha', opcional = false) =>
  z.preprocess(
    (val) => {
      if (val === '' || val === null) return opcional ? undefined : '';

      if (val instanceof Date) {
        return val.toISOString().slice(0, 10);
      }

      if (typeof val === 'string' && val.includes('T')) {
        return val.split('T')[0];
      }

      return val;
    },
    (opcional
      ? z.string()
      : z.string({
          required_error: `Debe llenar ${label}`,
          invalid_type_error: `Debe llenar ${label}`,
        })
    )
      .min(opcional ? 0 : 1, `Debe llenar ${label}`)
      .regex(/^\d{4}-\d{2}-\d{2}$/, `${label} debe tener formato AAAA-MM-DD`)
      .optional(opcional),
  );

export const reqTime = (label) =>
  z
    .string({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser texto`,
    })
    .trim()
    .refine((s) => /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(s), {
      message: `${label} debe tener formato HH:mm o HH:mm:ss`,
    })
    .transform((s) => {
      // Normaliza a HH:mm:ss
      const [hh, mm, ss] = s.split(':');
      return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:${(
        ss ?? '00'
      ).padStart(2, '0')}`;
    });

export const optTimeAllowEmpty = (label) =>
  z.preprocess((val) => {
    if (val == null) return undefined; // ✅ null o undefined
    if (typeof val === 'string' && val.trim() === '') return undefined; // ✅ ''
    return val;
  }, reqTime(label).optional());

export const optNum = (label) =>
  z.preprocess(
    (val) => {
      if (val === '' || val == null) return 0;

      if (typeof val === 'string') {
        const n = Number(val);
        return Number.isNaN(n) ? 0 : n;
      }

      return val;
    },
    z
      .number({
        invalid_type_error: `El campo ${label} debe ser numérico`,
      })
      .min(0, `${label} debe ser mayor o igual a 0`)
      .optional(),
  );

export const optStr = (label) => {
  return z
    .string({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser texto`,
    })
    .trim()
    .nullish()
    .optional();
};

export const optPct = (label) =>
  z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      if (typeof val === 'string') return Number(val);
      return val;
    },
    z
      .number({
        invalid_type_error: `El campo ${label} debe ser numérico`,
      })
      .min(0, `${label} debe ser ≥ 0`)
      .max(100, `${label} debe ser ≤ 100`)
      .nullish(), // permite undefined/null
  );

export const reqStr = (label) => {
  return z
    .string({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser texto`,
    })
    .trim()
    .min(1, `El campo ${label} debe ser más de un caracter`);
};

export const reqNum = (label) =>
  z.coerce
    .number({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser numérico`,
    })
    .finite(`${label} debe ser numérico válido`) // ✅ reemplaza refine
    .min(1, `Debe ser mayor o igual a 1`);

export const reqPct = (label) => {
  return reqFloat(label)
    .finite(`${label} debe ser numérico válido`)
    .min(0, `${label} debe ser ≥ 0`)
    .max(100, `${label} debe ser ≤ 100`);
};

export const reqFloat = (label) => {
  return z.coerce
    .number({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser numérico`,
    })
    .finite(`${label} debe ser numérico válido`)
    .min(1, `Debe se mas de un caracter ${label} `);
};

export const reqPeriodo = (label = 'Período') => {
  return z.preprocess(
    (val) => {
      if (typeof val !== 'string') return '';
      return val;
    },
    z
      .string({
        required_error: `${label} es requerido`,
        invalid_type_error: `${label} debe ser una cadena de texto`,
      })
      .min(1, `${label} es requerido`)
      .regex(
        /^\d{4}-\d{2}$/,
        `${label}: Formato inválido. Use YYYY-MM (ej: 2024-01)`,
      )
      .refine((value) => {
        const [, month] = value.split('-').map(Number);
        return month >= 1 && month <= 12;
      }, `${label}: Mes debe estar entre 01 y 12`)
      .refine((value) => {
        const [year] = value.split('-').map(Number);
        return year >= 2000 && year <= 2100;
      }, `${label}: Año debe estar entre 2000 y 2100`),
  );
};

export const reqEntero = (label = 'Valor', opcional = false) =>
  z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;

      if (typeof val === 'string') {
        const s = val.trim();
        if (s === '') return undefined;

        const n = Number(s);
        return Number.isFinite(n) ? n : undefined;
      }

      if (typeof val === 'number') {
        return Number.isFinite(val) ? val : undefined;
      }

      return undefined;
    },
    opcional
      ? z
          .number({
            invalid_type_error: `El campo ${label} debe ser numérico`,
          })
          .min(0, `${label} debe ser mayor o igual a 0`)
          .int(`${label} debe ser un número entero`)
          .optional()
      : z
          .number({
            required_error: `Se requiere ${label}`,
            invalid_type_error: `El campo ${label} debe ser numérico`,
          })
          .min(0, `${label} debe ser mayor o igual a 0`)
          .int(`${label} debe ser un número entero`),
  );

export const reqEnteroMayorCero = (label) => {
  return z.coerce
    .number({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser numérico`,
    })
    .finite(`${label} debe ser numérico válido`)
    .min(1, `Debe se mas de un caracter ${label} `)
    .int(`${label} debe ser un número entero`);
};

export const reqBooleano = (label = 'Valor') =>
  z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return false;

      if (typeof val === 'string') {
        const v = val.toLowerCase();
        if (['true', '1', 'on', 'si', 'yes'].includes(v)) return true;
        if (['false', '0', 'off', 'no'].includes(v)) return false;
      }

      if (typeof val === 'number') return val === 1;

      return val;
    },
    z
      .boolean({
        invalid_type_error: `El campo ${label} debe ser verdadero o falso`,
      })
      .default(false),
  );

export const reqInt = (label) => {
  return z.preprocess(
    (val) => {
      // Si viene como number (a veces pasa), lo convertimos a string
      if (typeof val === 'number') return String(val);

      // Si no viene nada (undefined/null), lo dejamos como string vacío
      if (val === undefined || val === null) return '';

      return val; // normalmente será string
    },
    z
      .string({
        required_error: `Se requiere ${label}`,
        invalid_type_error: `El campo ${label} debe ser texto `,
      })
      .trim()
      .min(1, `Se requiere ${label} `) // <- aquí cae el vacío
      .refine((v) => /^-?\d+$/.test(v), {
        message: ` El campo ${label} debe ser un número entero`,
      })
      .transform((v) => parseInt(v, 10)),
  );
};

export const reqIntOptional = (label) => {
  return z.preprocess(
    (val) => {
      // vacío → opcional → undefined
      if (val === '' || val === null || val === undefined) {
        return undefined;
      }

      // si viene number, lo pasamos a string
      if (typeof val === 'number') return String(val);

      return val; // normalmente string
    },
    z
      .string({
        invalid_type_error: `El campo ${label} debe ser texto`,
      })
      .trim()
      .refine((v) => /^-?\d+$/.test(v), {
        message: `El campo ${label} debe ser un número entero`,
      })
      .transform((v) => parseInt(v, 10))
      .optional(), // 👈 CLAVE
  );
};
export const reqArray = (fieldName = 'IDs') =>
  z
    .array(
      z.union([
        z.number().int().positive(),
        z
          .string()
          .regex(/^\d+$/, `${fieldName} debe contener IDs numéricos`)
          .transform((v) => Number(v)),
      ]),
    )
    .min(1, `Debes seleccionar al menos un ${fieldName}`);

export const reqMes = (label = 'mes') => {
  return z.coerce
    .number({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser un número`,
    })
    .int(`El campo ${label} debe ser un número entero`)
    .min(1, `El campo ${label} debe ser mayor o igual a 1`)
    .max(12, `El campo ${label} debe ser menor o igual a 12`);
};

export const reqDia = (label = 'día') => {
  return z.coerce
    .number({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser un número`,
    })
    .int(`El campo ${label} debe ser un número entero`)
    .min(1, `El campo ${label} debe ser mayor o igual a 1`)
    .max(31, `El campo ${label} debe ser menor o igual a 31`);
};
