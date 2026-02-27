import { useState } from 'react';
import Tabs from '@components/Tabs';
import DisponibilidadPorLinea from '../../Mantenimiento/DisponibilidadLinea/DisponibilidadPorLinea';

const tabs = [
  { key: 'DisponibilidadPorLinea', label: 'Disponibilidad por linea' },
];

export default function TabMantenimiento() {
  const [tab, setTab] = useState('DisponibilidadPorLinea');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'DisponibilidadPorLinea' && <DisponibilidadPorLinea />}
      </div>
    </div>
  );
}
