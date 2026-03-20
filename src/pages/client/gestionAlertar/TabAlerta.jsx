import { useState } from 'react';
import Tabs from '@components/Tabs';
import Calendario from './Tabs/Calendario';
import FechaEstatica from './Tabs/FechasEstaticas/FechaEstatica';
const tabs = [
  { key: 'Calendario', label: 'Calendario' },
  { key: 'FechaEstatica', label: 'Fecha Estatica' },
];

export default function PlanillaProduccion() {
  const [tab, setTab] = useState('Calendario');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'Calendario' && <Calendario />}
        {tab === 'FechaEstatica' && <FechaEstatica />}
      </div>
    </div>
  );
}
