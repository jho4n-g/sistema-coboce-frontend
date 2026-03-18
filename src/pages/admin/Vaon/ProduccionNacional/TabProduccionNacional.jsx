import { useState } from 'react';
import Tabs from '@components/Tabs';
import Agua from './Tabs/Agua/Agua.jsx';
import Carton from './Tabs/Carton/Carton.jsx';
import EnergiaElectrica from './Tabs/EnergiaElectrica/EnergiaElectrica.jsx';
import GasNatural from './Tabs/GasNatural/GasNatural.jsx';
import TranspArcilla from './Tabs/TranspArcilla/TranspArcilla.jsx';
import ManoObra from './Tabs/ManoObra/ManoObra.jsx';
import Arcilla from './Tabs/MateriaPrima/Arcilla.jsx';

const tabs = [
  { key: 'Agua', label: 'Agua' },
  { key: 'Carton', label: 'Carton' },
  { key: 'EnergiaElectrica', label: 'Energia Electrica' },
  { key: 'GasNatural', label: 'Gas natural' },
  { key: 'TranspArcilla', label: 'Transp arcilla' },
  { key: 'ManoObra', label: 'Mano obra' },
  { key: 'Arcilla', label: 'Arcilla' },
];

export default function TabProduccioNaciona() {
  const [tab, setTab] = useState('Agua');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'Agua' && <Agua />}
        {tab === 'Carton' && <Carton />}
        {tab === 'EnergiaElectrica' && <EnergiaElectrica />}
        {tab === 'GasNatural' && <GasNatural />}
        {tab === 'TranspArcilla' && <TranspArcilla />}
        {tab === 'ManoObra' && <ManoObra />}
        {tab === 'Arcilla' && <Arcilla />}
      </div>
    </div>
  );
}
