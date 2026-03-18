import { useState } from 'react';
import Tabs from '../../../../../components/Tabs';
import PrensadoAdmin from './Tabs/Prensado';
import PrensadoCliente from '../../../../client/Produccion/Secciones/Tabs/Prensado';

const tabs = [
  { key: 'tabla', label: 'Tabla' },
  { key: 'llenado', label: 'Llenado' },
];

export default function TabBarbotinaAdmin() {
  const [tab, setTab] = useState('tabla');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'tabla' && <PrensadoAdmin />}
        {tab === 'llenado' && <PrensadoCliente />}
      </div>
    </div>
  );
}
