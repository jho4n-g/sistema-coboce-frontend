import { useState } from 'react';
import Tabs from '@components/Tabs';

import AlertaAdmin from './Tabs/admin/Alertar.jsx';

const tabs = [
  { key: 'general', label: 'General' },
  { key: 'AlertaAdmin', label: 'Alertar Admin' },
];

export default function TabAlerta() {
  const [tab, setTab] = useState('general');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'general' && <div>Contenido General</div>}
        {tab === 'AlertaAdmin' && <AlertaAdmin />}
      </div>
    </div>
  );
}
