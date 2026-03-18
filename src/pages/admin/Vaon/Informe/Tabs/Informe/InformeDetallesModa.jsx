import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { exportInformeVaonExcel } from './exportInformeVaonExcel';

const initialData = () => ({
  periodo: '',
  metros_formato: '',
  formato: '',
  cantidad_arcilla: '',
  precionUnitario_arcilla: '',
  costoTotal_arcilla: '',
  cantidad_cajas: '',
  precioUnitario_caja: '',
  costoTotal_caja: '',
  precionUnitario_energia: '',
  costoTotal_energia: '',
  cantidad_energia: '',
  cantidad_gas: '',
  preconUnitario_gas: '',
  costoTotal_gas: '',
  cantidad_agua: '',
  precioUnitario_agua: '',
  costoTotal_agua: '',
  cantidad_transp: '',
  precioUnitario_transp: '',
  costoTotal_transp: '',
  cantidad_mo: '',
  precioUnitario_mo: '',
  costoTotal_mo: '',
  cantidad_insumo: '',
  precioUnitario_insumos: '',
  costoTotal_insumo: '',
});

export default function InformeDetallesModal({ open, onClose, fetchById, id }) {
  const [data, setData] = useState(initialData());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setData(initialData());
      setLoading(false);
      return;
    }

    if (!id) return;

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetchById(id);

        if (!active) return;

        if (res?.ok) {
          setData({
            ...initialData(),
            ...(res.dato ?? {}),
          });
        } else {
          toast.error(res?.message || 'No se pudo cargar el documento');
        }
      } catch (e) {
        if (active) {
          toast.error(e?.message || 'Error del servidor');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, id, fetchById]);

  const closeModal = () => {
    if (loading) return;
    setData(initialData());
    onClose();
  };
  const handleDownloadExcel = async () => {
    try {
      await exportInformeVaonExcel(data);
      toast.success('Excel descargado correctamente');
    } catch (error) {
      toast.error(error?.message || 'No se pudo descargar el Excel');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : closeModal}
      />

      <div className="relative z-10 max-h-[calc(100vh-2rem)] w-[92%] max-w-7xl overflow-y-auto rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-extrabold text-slate-900">
            Informe vaon
          </h3>

          <button
            type="button"
            onClick={loading ? undefined : closeModal}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          {/* Datos */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Periodo
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {data?.periodo || 'Sin periodo'}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Formato
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {data?.formato || 'Sin periodo'}
                </div>
              </div>

              <div className="md:col-span-12">
                <div className="mt-4  rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="w-full overflow-x-auto">
                    <table className="min-w-max w-full table-auto border-separate border-spacing-0 text-sm">
                      <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr className="divide-x divide-slate-200">
                          <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                            DESCRIPCION
                          </th>
                          <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                            UNIDAD
                          </th>
                          <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                            CANTIDAD
                          </th>
                          <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                            COSTO UNITARIO (BOB)
                          </th>
                          <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                            COSTO TOTAL (BOB)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td
                            colSpan={5}
                            className="border-b border-black bg-slate-100 px-4 py-2 font-bold"
                          >
                            1. MATERIA PRIMA
                          </td>
                        </tr>

                        <tr className=" border-black">
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            ARCILLA
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            kg
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.cantidad_arcilla || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.precionUnitario_arcilla || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.costoTotal_arcilla || 0}
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="border-b border-black bg-slate-100 px-4 py-2 font-bold"
                            colSpan={2}
                          >
                            TOTAL MATERIA PRIMA
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.cantidad_arcilla || 0}
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.precionUnitario_arcilla || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.costoTotal_arcilla || 0}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={5}
                            className="border-b border-black bg-slate-100 px-4 py-2 font-bold"
                          >
                            2. INSUMOS
                          </td>
                        </tr>
                        <tr className=" border-black">
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            Carton
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            Pza
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.cantidad_cajas || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.precioUnitario_caja || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.costoTotal_caja || 0}
                          </td>
                        </tr>
                        <tr className=" border-black">
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            Energia electrica
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            KW
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.cantidad_energia || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.precionUnitario_energia || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.costoTotal_energia || 0}
                          </td>
                        </tr>
                        <tr className=" border-black">
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            Gas natural
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            Pcs
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.cantidad_gas || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.preconUnitario_gas || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.costoTotal_gas || 0}
                          </td>
                        </tr>
                        <tr className=" border-black">
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            Agua
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            LTS
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.cantidad_agua || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.precioUnitario_agua || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.costoTotal_agua || 0}
                          </td>
                        </tr>
                        <tr className=" border-black">
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            Transp. Arcilla
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            KG.
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.cantidad_transp || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.precioUnitario_transp || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.costoTotal_transp || 0}
                          </td>
                        </tr>
                        <tr className=" border-black">
                          <td
                            className="border-b border-black bg-slate-100 px-4 py-2 font-bold"
                            colSpan={3}
                          >
                            TOTAL INSUMO
                          </td>

                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.precioUnitario_transp +
                              data?.precioUnitario_caja +
                              data?.precionUnitario_energia +
                              data?.preconUnitario_gas +
                              data?.precioUnitario_agua}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.costoTotal_transp +
                              data?.costoTotal_agua +
                              data?.costoTotal_gas +
                              data?.costoTotal_energia +
                              data?.costoTotal_caja}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={5}
                            className="border-b border-black bg-slate-100 px-4 py-2 font-bold"
                          >
                            PRODUCCION IMPORTADO
                          </td>
                        </tr>
                        <tr className=" border-black">
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.nombres_insumo || ''}
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600"></td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.cantidad_insumo || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.precioUnitario_insumos || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.costoTotal_insumo || 0}
                          </td>
                        </tr>
                        <tr className=" border-black">
                          <td
                            className="border-b border-black bg-slate-100 px-4 py-2 font-bold"
                            colSpan={2}
                          >
                            TOTAL INSUMO
                          </td>
                          <td className="border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.cantidad_insumo || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.precioUnitario_insumos || 0}
                          </td>
                          <td className=" border-b border-black px-4 py-2 text-center font-semibold text-slate-600">
                            {data?.costoTotal_insumo || 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0  border-slate-200 bg-white px-5 py-4">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              Descargar Excel
            </button>

            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cerrar ventana
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-white/75 backdrop-blur">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <p className="text-sm font-semibold text-slate-800">
                Cargando documento…
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
