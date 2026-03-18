import { useState } from 'react';
import Tabs from '@components/Tabs';
import HoraExtraLlenado from './Tabs/HorasExtra/HorasExtra';
import UtilidadLlenado from './Tabs/Utilidad/Utilidad';
import GeneracionResiduosSolidosLlenado from './Tabs/GeneracionResiduos/GeneracionResiduos';
import IndiceFrecuenciaLlenado from './Tabs/IndiceFrecuencia/IndiceFrecuencia';
import IndiceSeveridadLlenado from './Tabs/IndiceSeveridad/IndiceSeveridad';
//
import ConsultorioDentaLlenado from './Tabs/ConsultorioDentaLlenado';
//
import DonacionesLlenado from './Tabs/Donaciones/Donaciones';

const tabs = [
  { key: 'general', label: 'General' },
  { key: 'HoraExtraLlenado', label: 'Horas extra' },
  { key: 'UtilidadLlenado', label: 'Utilidad' },
  {
    key: 'GeneracionResiduosSolidosLlenado',
    label: 'Generacion residuos solidos',
  },
  {
    key: 'IndiceFrecuenciaLlenado',
    label: 'Indice frecuencia',
  },
  {
    key: 'IndiceSeveridadLlenado',
    label: 'Indice severidad',
  },

  {
    key: 'DonacionesLlenado',
    label: 'Donaciones ',
  },
];

export default function PlanillaAdministracion() {
  const [tab, setTab] = useState('general');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'general' && <div>Contenido General</div>}
        {tab === 'HoraExtraLlenado' && <HoraExtraLlenado />}
        {tab === 'UtilidadLlenado' && <UtilidadLlenado />}
        {tab === 'GeneracionResiduosSolidosLlenado' && (
          <GeneracionResiduosSolidosLlenado />
        )}
        {tab === 'IndiceFrecuenciaLlenado' && <IndiceFrecuenciaLlenado />}
        {tab === 'IndiceSeveridadLlenado' && <IndiceSeveridadLlenado />}
        {tab === 'ConsultorioDentaLlenado' && <ConsultorioDentaLlenado />}
        {tab === 'DonacionesLlenado' && <DonacionesLlenado />}
      </div>
    </div>
  );
}
