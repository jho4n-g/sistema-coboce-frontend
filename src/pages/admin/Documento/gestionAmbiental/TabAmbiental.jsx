import { useState } from 'react';
import Tabs from '@components/Tabs';
import Politica from './Tabs/Politica/Politica.jsx';
import Procedimiento from './Tabs/Procedimiento/Procedimiento.jsx';

const tabs = [
  { key: 'Politica', label: 'Politica' },
  { key: 'Procedimiento', label: 'Procedimiento' },
];

export default function TabAmbiental() {
  const [tab, setTab] = useState('Politica');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'Politica' && <Politica />}
        {tab === 'Procedimiento' && <Procedimiento />}
      </div>
    </div>
  );
}
