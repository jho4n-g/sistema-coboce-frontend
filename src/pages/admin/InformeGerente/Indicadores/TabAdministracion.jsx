import { useState } from 'react';
import Tabs from '@components/Tabs';
import HorasExtra from '../../Administracion/HorasExtra/HorasExtra';
import Utilidad from '../../Administracion/Utilidad/Utilidad';
import GeneracionResiduos from '../../Administracion/GeneracionResiduos/GeneracionResiduos';
import IndiceFrecuencia from '../../Administracion/IndiceFrecuencia/IndiceFrecuencia';
import IndiceSeveridad from '../../Administracion/IndiceSeveridad/IndiceSeveridad';
import Donaciones from '../../Administracion/Donaciones/Donaciones';
import ReclamoProductoTerminado from '../../Administracion/ReclamoPoductoTerminado/ReclamoProductoTerminado';

const tabs = [
  { key: 'HorasExtra', label: 'Horas Extra' },
  { key: 'Utilidad', label: 'Utilidad' },
  { key: 'GeneracionResiduos', label: 'Generación de Residuos' },
  { key: 'IndiceFrecuencia', label: 'Índice de Frecuencia' },
  { key: 'IndiceSeveridad', label: 'Índice de Severidad' },
  { key: 'Donaciones', label: 'Donaciones' },
];

export default function PlanillaProduccion() {
  const [tab, setTab] = useState('HorasExtra');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'HorasExtra' && <HorasExtra />}
        {tab === 'Utilidad' && <Utilidad />}
        {tab === 'GeneracionResiduos' && <GeneracionResiduos />}
        {tab === 'IndiceFrecuencia' && <IndiceFrecuencia />}
        {tab === 'IndiceSeveridad' && <IndiceSeveridad />}
        {tab === 'Donaciones' && <Donaciones />}
      </div>
    </div>
  );
}
