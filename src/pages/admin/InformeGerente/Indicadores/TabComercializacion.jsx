import { useState } from 'react';
import Tabs from '@components/Tabs';
import IngresoVentaTotal from '../../Comercializacion/IngresoVentaTotal/IngresoVentaTotal';
import VentaTotal from '../../Comercializacion/VentaTotal/VentaTotal';
import PrecioUnitario from '../../Comercializacion/PrecioUnitario/PrecioUnitario';

const tabs = [
  { key: 'IngresoVentaTotal', label: 'Ingreso Venta Total' },
  { key: 'VentaTotal', label: 'Venta Total' },
  { key: 'PrecioUnitario', label: 'Precio Unitario' },
];

export default function TabComercializacion() {
  const [tab, setTab] = useState('IngresoVentaTotal');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'IngresoVentaTotal' && <IngresoVentaTotal />}
        {tab === 'VentaTotal' && <VentaTotal />}
        {tab === 'PrecioUnitario' && <PrecioUnitario />}
      </div>
    </div>
  );
}
