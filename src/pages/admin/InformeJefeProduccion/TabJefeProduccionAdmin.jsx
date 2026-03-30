import { useState } from 'react';
import Tabs from '@components/Tabs';
import InformeJefeProduccion from './Tabs/LlenadoInforme/InformeJefeProduccion';

const tabs = [{ key: 'InformeJefeProduccion', label: 'Informe  produccion' }];

export default function TabBarbotinaAdmin() {
  const [tab, setTab] = useState('InformeJefeProduccion');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'InformeJefeProduccion' && <InformeJefeProduccion />}
      </div>
    </div>
  );
}
