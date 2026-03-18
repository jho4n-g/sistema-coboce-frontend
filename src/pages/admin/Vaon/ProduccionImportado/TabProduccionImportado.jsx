import { useState } from 'react';
import Tabs from '@components/Tabs';
import Insumos from './Tabs/Insumos.jsx';

const tabs = [{ key: 'Insumos', label: 'Insumos' }];

export default function TabProduccioImportado() {
  const [tab, setTab] = useState('Insumos');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'Insumos' && <Insumos />}
      </div>
    </div>
  );
}
