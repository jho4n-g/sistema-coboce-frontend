import { useState } from 'react';
import Tabs from '@components/Tabs';
import Informe from './Tabs/Informe/Informe';
import MetrosPeriodo from './Tabs/MetrosPeriodo/MetrosPeriodo';

const tabs = [
  { key: 'Informe', label: 'Informe' },
  { key: 'MetrosPeriodo', label: 'Metros por periodo' },
];

export default function TabProduccioImportado() {
  const [tab, setTab] = useState('Informe');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'Informe' && <Informe />}
        {tab === 'MetrosPeriodo' && <MetrosPeriodo />}
      </div>
    </div>
  );
}
