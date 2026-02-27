import { useState } from 'react';
import Tabs from '@components/Tabs';
import Calidad from '../../Produccion/Administracion/Calidad/Calidad';
import IndiceConsumoAgua from '../../Produccion/Administracion/IndiceConsumoAgua/IndiceConsumoAgua';
import IndiceConsumoBases from '../../Produccion/Administracion/IndiceConsumoBases/IndiceConsumoBases';
import IndiceConsumoEe from '../../Produccion/Administracion/IndiceConsumoEE/IndiceConsumoEe';
import IndiceConsumoEngobe from '../../Produccion/Administracion/IndiceConsumoEngobe/IndiceConsumoEngobe';
import IndiceConsumoEsmalte from '../../Produccion/Administracion/IndiceConsumoEsmalte/IndiceConsumoEsmalte';
import IndiceConsumoGn from '../../Produccion/Administracion/IndiceConsumoGn/IndiceConsumoGn';
import IndiceConsumoLinea from '../../Produccion/Administracion/IndiceConsumoLinea/IndiceConsumoLinea';
import IndicePolvoAtomizado from '../../Produccion/Administracion/IndicePolvoAtomizado/IndicePolvoAtomizado';
import MonitoreoGasesCombustion from '../../Produccion/Administracion/MonitoreoGasesCombustion/MonitoreoGasesCombustion';
import Produccion from '../../Produccion/Administracion/Produccion/Produccion';
import ProductoNoConforme from '../../Produccion/Administracion/ProductoNoConforme/ProductoNoConforme';

const tabs = [
  { key: 'Calidad', label: 'Calidad' },
  { key: 'IndiceConsumoAgua', label: 'Índice de Consumo de Agua' },
  { key: 'IndiceConsumoBases', label: 'Índice de Consumo de Bases' },
  { key: 'IndiceConsumoEe', label: 'Índice de Consumo ee' },
  { key: 'IndiceConsumoEngobe', label: 'Índice de Consumo Engobe' },
  { key: 'IndiceConsumoEsmalte', label: 'Índice de Consumo Esmalte' },
  { key: 'IndiceConsumoGn', label: 'Índice de Consumo GN' },
  { key: 'IndiceConsumoLinea', label: 'Índice de Consumo Línea' },
  { key: 'IndicePolvoAtomizado', label: 'Índice de Polvo Atomizado' },
  {
    key: 'MonitoreoGasesCombustion',
    label: 'Monitoreo de Gases de Combustión',
  },
  { key: 'Produccion', label: 'Producción' },
  { key: 'ProductoNoConforme', label: 'Producto No Conforme' },
];

export default function TabProduccion() {
  const [tab, setTab] = useState('Calidad');

  return (
    <div className="w-full space-y-6">
      {/* Asegura que Tabs no encoge */}
      <div className="w-full">
        <Tabs tabs={tabs} onChange={setTab} />
      </div>

      {/* Card full width */}
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sml">
        {tab === 'Calidad' && <Calidad />}
        {tab === 'IndiceConsumoAgua' && <IndiceConsumoAgua />}
        {tab === 'IndiceConsumoBases' && <IndiceConsumoBases />}
        {tab === 'IndiceConsumoEe' && <IndiceConsumoEe />}
        {tab === 'IndiceConsumoEngobe' && <IndiceConsumoEngobe />}
        {tab === 'IndiceConsumoEsmalte' && <IndiceConsumoEsmalte />}
        {tab === 'IndiceConsumoGn' && <IndiceConsumoGn />}
        {tab === 'IndiceConsumoLinea' && <IndiceConsumoLinea />}
        {tab === 'IndicePolvoAtomizado' && <IndicePolvoAtomizado />}
        {tab === 'MonitoreoGasesCombustion' && <MonitoreoGasesCombustion />}
        {tab === 'Produccion' && <Produccion />}
        {tab === 'ProductoNoConforme' && <ProductoNoConforme />}
      </div>
    </div>
  );
}
