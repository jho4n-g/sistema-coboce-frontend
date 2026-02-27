// InformePeriodo.jsx
import { useEffect, useMemo, useState } from 'react';
import TablaSimple from '../../../../components/TablaSimple';
import { getObjs } from '@service/InformeGerencia/InformeGerencia.services.js';
import { toast } from 'react-toastify';
import {
  periodoATexto,
  normalizarPorcentaje,
} from '../../../../helpers/normalze.helpers';

// =========================
// Helpers
// =========================
const safeArray = (v) => (Array.isArray(v) ? v : []);
const addPercent = (v) => `${Number(v ?? 0)}%`;

// =========================
// COLUMNAS (tus columnas)
// =========================
const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'adm', key: 'adm_prom' },
  { label: 'prd', key: 'prd_prom' },
  { label: 'mantto', key: 'mantto_prom' },
  { label: 'ampliacion', key: 'ampliacion_prom' },
  { label: 'Cc', key: 'cc_prom' },
  { label: 'Seg ind', key: 'seg_ind_prom' },
  { label: 'Region centro', key: 'r_centro_prom' },
  { label: 'Region oeste', key: 'r_oeste_prom' },
  { label: 'Region este', key: 'r_este_prom' },
  { label: 'Region fabr', key: 'r_fabr_prom' },
  { label: 'Total personas', key: 'total_personas_prom' },
  { label: 'Horas extra total', key: 'horas_extra_total' },
  { label: 'Indice horas extra', key: 'indice_horas_extra' },
  {
    label: 'Indice horas extra acumulado',
    key: 'indice_horas_extra_acumulado',
  },
  { label: 'Meta', key: 'meta' },
  {
    label: 'Cumplimineto meta',
    key: 'cumplimiento_meta',
    render: (row) => normalizarPorcentaje(row.cumplimiento_meta),
  },
];

const columnasUtilidad = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Utilidad mensual', key: 'utilidad_mensual_prom' },
  { label: 'Meta mensual', key: 'meta_mensual_prom' },
  { label: 'Utilidad acumulado', key: 'utilidad_acumulada' },
  { label: 'Meta acumulado', key: 'meta_acumulada' },
  {
    label: 'Cumplimiento mensual',
    key: 'cumplimiento_acumulado',
    render: (row) => normalizarPorcentaje(row.cumplimiento_acumulado),
  },
  {
    label: 'Meta',
    key: 'meta',
    render: (row) => addPercent(row.meta),
  },
];

const columnasGeneracionResiduos = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'N trabajadores', key: 'n_trabajadores_prom' },
  { label: 'Kg carton', key: 'kg_carton_prom' },
  { label: 'Pe', key: 'pe_prom' },
  { label: 'Kg strechfilm', key: 'kg_strechfilm_prom' },
  { label: 'Kg bolsas bigbag', key: 'kg_bolsas_bigbag_prom' },
  { label: 'Kg turriles plasticos', key: 'kg_turriles_plasticos_prom' },
  { label: 'Kg envase mil litros', key: 'kg_envase_mil_litros_prom' },
  { label: 'Sunchu kg', key: 'sunchu_kg_prom' },
  { label: 'Kg madera', key: 'kg_madera_prom' },
  { label: 'Kg bidon azul', key: 'kg_bidon_azul_prom' },
  { label: 'Kg aceite sucio', key: 'kg_aceite_sucio_prom' },
  {
    label: 'Kg bolsas plasticas transparentes',
    key: 'kg_bolsas_plasticas_transparentes_prom',
  },
  { label: 'Kg bolsas yute', key: 'kg_bolsas_yute_prom' },
  { label: 'Total residuos', key: 'total_residuos' },
  { label: 'Indice residuos', key: 'indice_residuos' },
];

const columnasIndiceFrecuencia = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'N trabajadores', key: 'n_trabajadores_prom' },
  { label: 'Hora trabajadas mes', key: 'horas_trabajadas_mes' },
  { label: 'Porcentaje ausentismo', key: 'porcentaje_ausentismo_prom' },
  { label: 'Horas expuesta riesgo', key: 'horas_expuesta_riesgo' },
  {
    label: 'Accidentes administracion personas',
    key: 'accidentes_administracion_personas_prom',
  },
  {
    label: 'Accidentes mantenieminto personas',
    key: 'accidentes_mantenieminto_personas_prom',
  },
  {
    label: 'Accidentes produccion personas',
    key: 'accidentes_produccion_personas_prom',
  },
  {
    label: 'Accidentes comercializacion personas',
    key: 'accidentes_comercializacion_personas_prom',
  },
  { label: 'Accidentes mes', key: 'accidente_por_mes' },
  { label: 'Indice frecuencia mensual', key: 'indice_frecuencia' },
  { label: 'Indice frecuencia acumulado', key: 'indice_frecuencia_acumulado' },
  { label: 'Meta', key: 'meta' },
];

const columnasIndiceSeveridad = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'N trabajadores', key: 'n_trabajadores_prom' },
  { label: 'Horas trabajadas mes', key: 'horas_trabajadas_mes' },
  { label: 'porcentaje_ausentismo', key: 'porcentaje_ausentismo_prom' },
  { label: 'Horas expuesta riesgo', key: 'horas_expuesta_riesgo' },
  {
    label: 'Dias baja medica administracion',
    key: 'dias_baja_medica_administracion_prom',
  },
  {
    label: 'Dias baja medica mantenimiento',
    key: 'dias_baja_medica_mantenimiento_prom',
  },
  {
    label: 'Dias baja medica produccion',
    key: 'dias_baja_medica_produccion_prom',
  },
  {
    label: 'Dias baja medica comercializacion',
    key: 'dias_baja_medica_comercializacion_prom',
  },
  { label: 'Dias baja medica mes', key: 'dias_baja_medica' },
  { label: 'Indice gravedad', key: 'indice_gravedad' },
  { label: 'Indice gravedad acumulado', key: 'indice_gravedad_acumulado' },
  { label: 'Meta', key: 'meta' },
];

const columnasDonaciones = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Produccion menual', key: 'produccion_mensual_prom' },
  { label: 'Cascote mensual', key: 'cascote_mensual_prom' },
  { label: 'Donacion', key: 'donacion_prom' },
  { label: 'Produccion acumulado', key: 'produccion_acumulada' },
  { label: 'Cascote acumulado', key: 'cascote_acumulado' },
  { label: 'Donacion acumulado', key: 'donacion_acumulada' },
  { label: 'Donacion / Produccion', key: 'donacion_mensual_cascote' },
  { label: 'Cascote / Produccion', key: 'cascote_mensual_cascote' },
  { label: 'Costo promedio donacion', key: 'costo_promedio_donacion' },
];

const columnasCalidad = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Produccion mensual', key: 'produccion_mensual_prom' },
  { label: 'Presupuesto', key: 'presupuesto_prom' },
  { label: 'Produccion primera mensual', key: 'produccion_primera_prom' },
  { label: 'Produccion segunda mensual', key: 'produccion_segunda_prom' },
  { label: 'Produccion tercera mensual', key: 'produccion_tercera_prom' },
  { label: 'Produccion cascote mensual', key: 'produccion_cascote_prom' },

  {
    label: 'Primera calidad %',
    key: 'primera_calidad_porcentaje',
    render: (row) => normalizarPorcentaje(row.primera_calidad_porcentaje),
  },
  {
    label: 'Segunda calidad %',
    key: 'segunda_calidad_porcentaje',
    render: (row) => normalizarPorcentaje(row.segunda_calidad_porcentaje),
  },
  {
    label: 'Tercera calidad %',
    key: 'tercera_calidad_porcentaje',
    render: (row) => normalizarPorcentaje(row.tercera_calidad_porcentaje),
  },
  {
    label: 'Cascote %',
    key: 'cascote_porcentaje',
    render: (row) => normalizarPorcentaje(row.cascote_porcentaje),
  },

  { label: 'Produccion acumulada', key: 'produccion_acumulada' },
  { label: '1ra calidad acumulada', key: 'primera_acumulada' },
  { label: 'Cascote acumulada', key: 'cascote_acumulada' },

  {
    label: '1ra acumulada [%]',
    key: 'primera_porcentaje_acumulada',
    render: (row) => normalizarPorcentaje(row.primera_porcentaje_acumulada),
  },
  {
    label: 'Cascote acumulada [%]',
    key: 'cascote_porcentaje_acumulada',
    render: (row) => normalizarPorcentaje(row.cascote_porcentaje_acumulada),
  },

  { label: 'Meta primera', key: 'meta_primera' },
  { label: 'Meta cascote', key: 'meta_cascote' },
];

const columnasIndiceConsumoAgua = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Produccion', key: 'produccion_prom' },
  { label: 'Consumo agua', key: 'consumo_agua' },
  { label: 'Cisterna agua', key: 'cisterna_agua_prom' },
  { label: 'Medidor subestacion ee', key: 'medidor_subestacion_ee_prom' },
  { label: 'Medidor tres produccion', key: 'medidor_tres_produccion_prom' },
  { label: 'Medidor cuatro eliza', key: 'medidor_cuatro_eliza_prom' },
  {
    label: 'Medidor cinco administracion',
    key: 'medidor_cinco_administracion_prom',
  },
  { label: 'Medidor seis arcilla', key: 'medidor_seis_arcilla_prom' },
  { label: 'Produccion acumulada', key: 'produccion_acumulado' },
  { label: 'Consumo agua acumulado', key: 'consumo_agua_acumulado' },
  { label: 'Indice consumo agua', key: 'indice_consumo_agua' },
  {
    label: 'Indice consumo agua acumulado',
    key: 'indice_consumo_agua_acumulado',
  },
  { label: 'Cumplimiento [%]', key: 'cumplimiento' },
  { label: 'Meta', key: 'meta' },
];

const columnasIndiceConsumoBases = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Produccion', key: 'produccion_prom' },
  { label: 'Consumo mensual', key: 'consumo_mensual_prom' },
  { label: 'Ratio consumo', key: 'ratio_consumo' },
  { label: 'Meta', key: 'meta' },
  { label: 'Cumplimiento mensual', key: 'cumplimiento_mensual' },
  { label: 'Produccion acumulado', key: 'produccion_acumulada' },
  { label: 'Consumo acumulado', key: 'consumo_acumulado' },
  { label: 'Ratio consumo acumulado', key: 'ratio_consumo_acumulado' },
];

const columnasIndiceConsumoEE = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Produccion', key: 'produccion_prom' },
  { label: 'Consumo energia electrica', key: 'consumo_energia_electrica_prom' },
  { label: 'Produccion acumulada', key: 'produccion_acumulado' },
  { label: 'Consumo ee acumulado', key: 'consumo_energia_electrica_acumulado' },
  { label: 'Indice consumo', key: 'indice_consumo' },
  { label: 'Indice consumo acumulado', key: 'indice_consumo_acumulado' },
  { label: '% Cumplimiento', key: 'cumplimiento_meta' },
  { label: 'Meta', key: 'meta' },
];

const columnasEngobe = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Produccion [m²]', key: 'produccion_prom' },
  { label: 'Consumo mensual', key: 'consumo_mensual_prom' },
  { label: 'Ratio consumo', key: 'ratio_consumo' },
  { label: 'Meta [gr/m²]', key: 'meta_gr_m' },
  {
    label: 'Cumplimiento mensual',
    key: 'cumplimiento_mensual',
    render: (row) => normalizarPorcentaje(row.cumplimiento_mensual ?? 0),
  },
  { label: 'Produccion acumulada', key: 'produccion_acumulado' },
  { label: 'Consumo acumulado', key: 'consumo_acumulado' },
  { label: 'Ratio consumo acumulado', key: 'ratio_consumo_acumulado' },
  {
    label: '% Cumplimiento acumulado',
    key: 'cumplimiento_acumulado',
    render: (row) => normalizarPorcentaje(row.cumplimiento_acumulado ?? 0),
  },
  { label: 'Meta', key: 'meta' },
];

const columnasEsmalte = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Produccion [m²]', key: 'produccion_prom' },
  { label: 'Consumo mensual', key: 'consumo_mensual_prom' },
  { label: 'Ratio consumo', key: 'ratio_consumo' },
  { label: 'Meta [gr/m²]', key: 'meta_gr_m' },
  {
    label: 'Cumplimiento mensual',
    key: 'cumplimiento_mensual',
    render: (row) => normalizarPorcentaje(row.cumplimiento_mensual ?? 0),
  },
  { label: 'Produccion acumulada', key: 'produccion_acumulado' },
  { label: 'Consumo acumulado', key: 'consumo_acumulado' },
  { label: 'Ratio consumo acumulado', key: 'ratio_consumo_acumulado' },
  {
    label: '% Cumplimiento acumulado',
    key: 'cumplimiento_acumulado',
    render: (row) => normalizarPorcentaje(row.cumplimiento_acumulado ?? 0),
  },
  { label: 'Meta', key: 'meta' },
];

const columnasGn = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Produccion [m²]', key: 'produccion_prom' },
  { label: 'Consumo gas natural [pc]', key: 'consumo_gas_natural_prom' },
  { label: 'Produccion acumulada [m²]', key: 'produccion_acumulado' },
  { label: 'Consumo gas acumulado [PC]', key: 'consumo_gas_acumulado' },
  { label: 'Indice consumo GN [pc/m²]', key: 'indice_consumo' },
  {
    label: 'Indice consumo GN acumulado [pc/m²]',
    key: 'indice_consumo_acumulado',
  },
  { label: 'Meta [pc/m²]', key: 'meta_pc_m' },
  {
    label: '% Cumplimiento acumulado',
    key: 'cumplimiento_acumulado',
    render: (row) => normalizarPorcentaje(row.cumplimiento_acumulado ?? 0),
  },
  { label: '% Meta', key: 'meta' },
];

const columnasIndiceConsumoLinea = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Produccion', key: 'produccion_prom' },
  { label: 'Consumo mensual', key: 'consumo_mensual_prom' },
  { label: 'Ratio consumo', key: 'ratio_consumo' },
  { label: 'Meta [gr/m²]', key: 'meta_gr_m' },
  {
    label: 'Cumplimiento mensual',
    key: 'cumplimiento_mensual',
    render: (row) => normalizarPorcentaje(row.cumplimiento_mensual),
  },
  { label: 'Produccion acumulado', key: 'produccion_acumulado' },
  { label: 'Consumo mensual acumulado', key: 'consumo_mensual_acumulado' },
  { label: 'Indice consumo acumulado', key: 'indice_consumo_acumulado' },
  {
    label: 'Cumplimineto acumulado',
    key: 'cumplimiento_acumulado',
    render: (row) => normalizarPorcentaje(row.cumplimiento_acumulado),
  },
];

const columnasIndicePolvoAtomizado = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Produccion', key: 'produccion_prom' },
  { label: 'Consumo mensual', key: 'consumo_mensual_prom' },
  { label: 'Ratio consumo', key: 'ratio_consumo' },
  { label: 'Meta [gr/m²]', key: 'meta_kg_m' },
  {
    label: 'Cumplimiento mensual',
    key: 'cumplimiento_mensual',
    render: (row) => normalizarPorcentaje(row.cumplimiento_mensual),
  },
  { label: 'Produccion acumulado', key: 'produccion_acumulado' },
  { label: 'Consumo mensual acumulado', key: 'consumo_mensual_acumulado' },
  { label: 'Indice consumo acumulado', key: 'indice_consumo_acumulado' },
  {
    label: 'Cumplimineto acumulado',
    key: 'cumplimiento_acumulado',
    render: (row) => normalizarPorcentaje(row.cumplimiento_acumulado),
  },
];

const columnasMonitoreoPolvoAtomizado = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Horno b', key: 'horno_b_prom' },
  { label: 'Horno c', key: 'horno_c_prom' },
  { label: 'Horno d', key: 'horno_d_prom' },
  { label: 'Meta', key: 'meta' },
];

const columnasProduccion = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Presupuesto', key: 'presupuesto_prom' },
  { label: 'Produccion mensual', key: 'produccion_mensual_prom' },
  { label: 'Produccion acumulada', key: 'produccion_acumulado' },
  { label: 'Presupuesto acumulado', key: 'presupuesto_acumulado' },
  { label: 'Diferencia (prod - presu) acumulado', key: 'dif_acu_produ_presu' },
  { label: 'Meta', key: 'meta' },
  {
    label: 'Cumplimiento mensual',
    key: 'cumplimiento_mensual',
    render: (row) => normalizarPorcentaje(row.cumplimiento_mensual),
  },
  {
    label: 'Cumplimiento mensual acumulado',
    key: 'cumplimiento_acumulado',
    render: (row) => normalizarPorcentaje(row.cumplimiento_acumulado),
  },
];

const columnasMantenimiento = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  {
    label: 'N° horas proactivas planificadas',
    key: 'n_horas_productivas_planificadas_prom',
  },
  {
    label: 'N° horas lineas paradas linea b',
    key: 'n_horas_lineas_paradas_linea_b_prom',
  },
  {
    label: 'N° horas lineas paradas linea c',
    key: 'n_horas_lineas_paradas_linea_c_prom',
  },
  {
    label: 'N horas lineas paradas linea d',
    key: 'n_horas_lineas_paradas_linea_d_prom',
  },
  {
    label: 'N horas lineas paradas linea e',
    key: 'n_horas_lineas_paradas_linea_e_prom',
  },
  {
    label: 'Disponibilidad linea b',
    key: 'disponibilidad_linea_b',
    render: (row) => normalizarPorcentaje(row.disponibilidad_linea_b),
  },
  {
    label: 'Disponibilidad linea c',
    key: 'disponibilidad_linea_c',
    render: (row) => normalizarPorcentaje(row.disponibilidad_linea_c),
  },
  {
    label: 'Disponibilidad linea d',
    key: 'disponibilidad_linea_d',
    render: (row) => normalizarPorcentaje(row.disponibilidad_linea_d),
  },
  {
    label: 'Disponibilidad linea e',
    key: 'disponibilidad_linea_e',
    render: (row) => normalizarPorcentaje(row.disponibilidad_linea_e),
  },
  { label: 'Meta', key: 'meta' },
];

const columnasIngresoVentaTotal = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Presupuesto mensual', key: 'presupuesto_mensual_prom' },
  {
    label: 'Venta mensual con otro ingresos',
    key: 'venta_mensual_con_otro_ingresos_prom',
  },
  { label: 'Venta mensual ceramica', key: 'venta_mensual_ceramica_prom' },
  { label: 'Otros ingresos', key: 'otros_ingresos_prom' },
  {
    label: 'Venta acumulada otros',
    key: 'venta_mensual_con_otro_ingresos_acumulado',
  },
  {
    label: 'Venta acumulada ceramica',
    key: 'venta_mensual_ceramica_acumulado',
  },
  { label: 'Presupuesto acumulado', key: 'presupuesto_mensual_acumulado' },
  { label: 'Dif ventas otros vs presupuesto', key: 'dif_otros_presupuesto' },
  {
    label: 'Dif ventas ceramica vs presupuesto',
    key: 'dif_ceramico_presupuesto',
  },
  { label: 'Meta', key: 'meta' },
  {
    label: 'Cumplimiento mensual ceramica',
    key: 'cum_mensual_ceramica',
    render: (row) => normalizarPorcentaje(row.cum_mensual_ceramica),
  },
  {
    label: 'Cumplimiento otros ingresos',
    key: 'cum_otros_ingreso',
    render: (row) => normalizarPorcentaje(row.cum_otros_ingreso),
  },
];

const columnasPrecioUnitario = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Presupuesto mensual', key: 'presupuesto_mensual_prom' },
  { label: 'Precio promedio', key: 'precio_promedio_prom' },
  { label: 'Region centro', key: 'region_centro_prom' },
  { label: 'Region este', key: 'region_este_prom' },
  { label: 'Region oeste', key: 'region_oeste_prom' },
  { label: 'Fabrica', key: 'fabrica_prom' },
  { label: 'Exportacion', key: 'exportacion_prom' },
  { label: 'Meta', key: 'meta' },
  { label: 'Cumplimiento mensual', key: 'cumplimiento_mensual' },
];

const columnasVentaTotal = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'Presupuesto mensual', key: 'presupuesto_mensual_prom' },
  { label: 'Venta mensual', key: 'venta_mensual_prom' },
  { label: 'Diferencia venta vs presupuesto', key: 'dif_venta_presupuesto' },
  { label: 'Venta mensual acumulado', key: 'venta_acumulada' },
  { label: 'Presupuesto mensual acumulado', key: 'presupuesto_acumulado' },
  {
    label: 'Diferencia venta vs presupuesto acumulado',
    key: 'dif_venta_presupuesto_acumulado',
  },
  { label: 'Meta', key: 'meta' },
  { label: 'Cumplimiento mensual', key: 'cum_mensual' },
  { label: 'Cumplimiento acumulado', key: 'cum_acumulado' },
];

// =========================
// Build tables (SIN REPETIR)
// =========================
const buildTables = ({ admin, prod, mantto, com }) => [
  { groupTitle: 'Indicadores administración período' },
  {
    title: 'Indicadores horas extra',
    columnas,
    data: safeArray(admin?.horasExtra),
  },
  {
    title: 'Indicadores utilidad',
    columnas: columnasUtilidad,
    data: safeArray(admin?.utilidad),
  },
  {
    title: 'Indicadores Generación de residuos sólidos',
    columnas: columnasGeneracionResiduos,
    data: safeArray(admin?.generacionResiduosSolidos),
  },
  {
    title: 'Indicadores Índice Frecuencia',
    columnas: columnasIndiceFrecuencia,
    data: safeArray(admin?.indiceFrecuencia),
  },
  {
    title: 'Indicadores Índice Severidad',
    columnas: columnasIndiceSeveridad,
    data: safeArray(admin?.indiceSeveridad),
  },
  {
    title: 'Indicadores Donaciones',
    columnas: columnasDonaciones,
    data: safeArray(admin?.donaciones),
  },

  { groupTitle: 'Indicadores producción período' },
  {
    title: 'Indicadores Calidad',
    columnas: columnasCalidad,
    data: safeArray(prod?.calidad),
  },
  {
    title: 'Indicadores índice consumo agua',
    columnas: columnasIndiceConsumoAgua,
    data: safeArray(prod?.indiceConsumoAgua),
  },
  {
    title: 'Indicadores índice consumo bases',
    columnas: columnasIndiceConsumoBases,
    data: safeArray(prod?.indiceConsumoBases),
  },
  {
    title: 'Indicadores índice consumo energía eléctrica',
    columnas: columnasIndiceConsumoEE,
    data: safeArray(prod?.indiceConsumoEe),
  },
  {
    title: 'Indicadores índice consumo engobe',
    columnas: columnasEngobe,
    data: safeArray(prod?.indiceConsumoEngobe),
  },
  {
    title: 'Indicadores índice consumo esmalte',
    columnas: columnasEsmalte,
    data: safeArray(prod?.indiceConsumoEsmalte),
  },
  {
    title: 'Indicadores índice consumo gas natural',
    columnas: columnasGn,
    data: safeArray(prod?.indiceConsumoGn),
  },
  {
    title: 'Indicadores índice consumo línea',
    columnas: columnasIndiceConsumoLinea,
    data: safeArray(prod?.indiceConsumoLinea),
  },
  {
    title: 'Indicadores índice polvo atomizado',
    columnas: columnasIndicePolvoAtomizado,
    data: safeArray(prod?.indicePolvoAtomizado),
  },
  {
    title: 'Indicadores monitoreo polvo atomizado',
    columnas: columnasMonitoreoPolvoAtomizado,
    data: safeArray(prod?.monitoreoPolvoAtomizado),
  },
  {
    title: 'Indicadores producción',
    columnas: columnasProduccion,
    data: safeArray(prod?.produccion),
  },

  { groupTitle: 'Indicadores mantenimiento período' },
  {
    title: 'Indicadores disponibilidad por línea',
    columnas: columnasMantenimiento,
    data: safeArray(mantto?.disponibilidadPorLinea),
  },

  { groupTitle: 'Indicadores comercialización período' },
  {
    title: 'Indicadores ingreso venta total',
    columnas: columnasIngresoVentaTotal,
    data: safeArray(com?.ingresoVentaTotal),
  },
  {
    title: 'Indicadores precio unitario',
    columnas: columnasPrecioUnitario,
    data: safeArray(com?.precioUnitario),
  },
  {
    title: 'Indicadores venta total',
    columnas: columnasVentaTotal,
    data: safeArray(com?.ventaTotal),
  },
];

// =========================
// COMPONENT
// =========================
export default function InformePeriodo() {
  const [loading, setLoading] = useState(false);

  // guardamos todo junto (menos estados, menos bugs)
  const [payload, setPayload] = useState({
    administracion: {},
    produccion: {},
    mantenimiento: {},
    comercializacion: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getObjs();

        console.log('**************');
        console.log(res);
        console.log('**************');

        if (!res?.ok) {
          throw new Error(res?.message || 'Error al cargar los datos');
        }

        setPayload({
          administracion: res?.data?.administracion || {},
          produccion: res?.data?.produccion || {},
          mantenimiento: res?.data?.mantenimiento || {},
          comercializacion: res?.data?.comercializacion || {},
        });
      } catch (error) {
        toast.error(error?.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tables = useMemo(
    () =>
      buildTables({
        admin: payload.administracion,
        prod: payload.produccion,
        mantto: payload.mantenimiento,
        com: payload.comercializacion,
      }),
    [payload],
  );

  return (
    <>
      {/* Header */}
      <div className="rounded-lg border-2 border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-800">
          Informe por período
        </h3>
        {loading && (
          <p className="mt-2 text-sm text-slate-500">Cargando datos…</p>
        )}
      </div>

      {/* Render dinámico */}
      {tables.map((t, idx) => {
        if (t.groupTitle) {
          return (
            <div
              key={`group-${idx}`}
              className="mt-4 rounded-lg border-2 border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-gray-800">
                {t.groupTitle}
              </h3>
            </div>
          );
        }

        return (
          <div
            key={`${t.title}-${idx}`}
            className="mt-4 rounded-lg border-2 border-slate-200 bg-white p-6 shadow-sm"
          >
            <TablaSimple
              titulo={t.title}
              columnas={t.columnas}
              data={t.data}
              paginado={false}
              isBuscador={false}
              isAcccion={false}
            />
          </div>
        );
      })}
    </>
  );
}
