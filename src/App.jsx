import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
//layouts
import AdminLayout from './layouts/AdminLayout.jsx';
import ClienteLayout from './layouts/ClienteLayout.jsx';

//admin

//CONSULTORIO MEDICO
import InventarioMedicina from './pages/admin/OficinaMedica/Inventario/InventarioMedicina.jsx';
import EnfermedadMes from './pages/admin/OficinaMedica/EnfermedadMes/EnfermedadMes.jsx';
import FechasOms from './pages/admin/OficinaMedica/FechasOms/FechasOms.jsx';
//SECRETARIA
import ContratoAdmin from './pages/admin/Secretaria/Contrato/Contrato.jsx';
import CorrespondenciaRecibida from './pages/admin/Secretaria/CorrespondenciaRecibida/CorrespondenciaRecibida.jsx';
import CorrespondenciaExternaRecibida from './pages/admin/Secretaria/CorrespondenciaRecibidaExterna/CorrespondenciaExternaRecibida.jsx';
import CorrespondenciaExternaComercial from './pages/admin/Secretaria/CorrespondenciaExternaComercial/CorrespondenciaExternaComercial.jsx';

//documentos

import GestionCalidadPage from './pages/admin/Documento/gestionCalidad/TabCalidad.jsx';
import GestionAmbiental from './pages/admin/Documento/gestionAmbiental/TabAmbiental.jsx';
import GestionSeguridad from './pages/admin/Documento/gestionSeguridad/TabSeguridad.jsx';
import GestionNoticia from './pages/admin/Documento/gestionNoticias/Noticia.jsx';
import GestionComunicado from './pages/admin/Documento/gestionComunicados/Comunicado.jsx';
import GestionFrases from './pages/admin/Documento/gestionFrases/Frases.jsx';

//produccio
import TabBarbotinaAdmin from './pages/admin/Produccion/Secciones/Barbotina/TabBarbotinaAdmin.jsx';
import TabAtomizadoAdmin from './pages/admin/Produccion/Secciones/Atomizado/TabAtomizadoAdmin.jsx';
import TabPrensadoAdmin from './pages/admin/Produccion/Secciones/Prensado/TabPrensadoAdmin.jsx';
import TabEsmalteAdmin from './pages/admin/Produccion/Secciones/Esmalte/TabEsmalteAdmin.jsx';
import TabSerigrafiadoAdmin from './pages/admin/Produccion/Secciones/Serigrafia/TabSerigrafiado.jsx';
import TabSeleccion from './pages/admin/Produccion/Secciones/Seleccion/TabSeleccion.jsx';
import InformeProduccion from './pages/admin/InformeProduccion/InformeProduccion.jsx';
import LineasAdmin from './pages/admin/Produccion/Lineas/Lineas.jsx';
import FormatoAdmin from './pages/admin/Produccion/Formatos/Formato.jsx';
//produccio administracion

import ProductoNoConforme from './pages/admin/Produccion/Administracion/ProductoNoConforme/ProductoNoConforme.jsx';
import IndiceConsumoAgua from './pages/admin/Produccion/Administracion/IndiceConsumoAgua/IndiceConsumoAgua.jsx';
import IndiceConsumoBases from './pages/admin/Produccion/Administracion/IndiceConsumoBases/IndiceConsumoBases.jsx';
import IndiceConsumoEe from './pages/admin/Produccion/Administracion/IndiceConsumoEE/IndiceConsumoEe.jsx';
import IndiceConsumoEngobe from './pages/admin/Produccion/Administracion/IndiceConsumoEngobe/IndiceConsumoEngobe.jsx';
import IndiceConsumoEsmalte from './pages/admin/Produccion/Administracion/IndiceConsumoEsmalte/IndiceConsumoEsmalte.jsx';
import IndiceConsumoGn from './pages/admin/Produccion/Administracion/IndiceConsumoGn/IndiceConsumoGn.jsx';
import IndiceConsumoLinea from './pages/admin/Produccion/Administracion/IndiceConsumoLinea/IndiceConsumoLinea.jsx';
import IndicePolvoAtomizado from './pages/admin/Produccion/Administracion/IndicePolvoAtomizado/IndicePolvoAtomizado.jsx';
import MonitoreoGasesCombustion from './pages/admin/Produccion/Administracion/MonitoreoGasesCombustion/MonitoreoGasesCombustion.jsx';
import Produccion from './pages/admin/Produccion/Administracion/Produccion/Produccion.jsx';
//administracion
import ReclamoProductoTerminado from './pages/admin/Administracion/ReclamoPoductoTerminado/ReclamoProductoTerminado.jsx';
import AtencionConsultorio from './pages/admin/Administracion/AtencionConsultorio/AtencionConsultorioMedico.jsx';
import ConsultorioDental from './pages/admin/Administracion/ConsultaDental/ConsultorioDental.jsx';
import HorasExtra from './pages/admin/Administracion/HorasExtra/HorasExtra.jsx';
import Utilidad from './pages/admin/Administracion/Utilidad/Utilidad.jsx';
import GeneracionResiduos from './pages/admin/Administracion/GeneracionResiduos/GeneracionResiduos.jsx';
import IndiceFrecuencia from './pages/admin/Administracion/IndiceFrecuencia/IndiceFrecuencia.jsx';
import IndiceSeveridad from './pages/admin/Administracion/IndiceSeveridad/IndiceSeveridad.jsx';
import IndiceAccionesCorrectivas from './pages/admin/Administracion/IndiceAccionesCorrectivas/IndiceAccionesCorrectivas.jsx';
import Donaciones from './pages/admin/Administracion/Donaciones/Donaciones.jsx';
import EvolucionContadoContraCredito from './pages/admin/Administracion/EvolucionContado/EvolucionContado.jsx';
//comercializacion
import IngresoVentaTotal from './pages/admin/Comercializacion/IngresoVentaTotal/IngresoVentaTotal.jsx';
import PrecioUnitario from './pages/admin/Comercializacion/PrecioUnitario/PrecioUnitario.jsx';
import VentaTotal from './pages/admin/Comercializacion/VentaTotal/VentaTotal.jsx';
//mantenimiento
import DisponibilidadPorLinea from './pages/admin/Mantenimiento/DisponibilidadLinea/DisponibilidadPorLinea.jsx';
//administracion
import Calidad from './pages/admin/Produccion/Administracion/Calidad/Calidad.jsx';
//cliente
import Inicio from './pages/client/Inicio.jsx';
import TabProduccion from './pages/client/Produccion/Secciones/TabProduccion.jsx';
import TabProduccionAdministracion from './pages/client/Produccion/Administracion/TabProduccionAdministracion.jsx';
import TabProduccionMantenimiento from './pages/client/Mantenimiento/TabMantenimiento.jsx';
import TabAdministracion from './pages/client/Administracion/TabAdministracion.jsx';
import TabComercializacion from './pages/client/Comercializacion/TabComercializacion.jsx';
//Prueba
import Prueba from './components/Prueba.jsx';
//Documentos
import DocumetosLayout from './pages/document/DocumetosLayout.jsx';
//admin
import UsuarioAdmin from './pages/admin/AdminFunciones/Usuarios/Usuario.jsx';
import RolAdmin from './pages/admin/AdminFunciones/Roles/Rol.jsx';
import GestionAdmin from './pages/admin/AdminFunciones/Gestiones/Gestiones.jsx';
//Informe Gerente
import InformeGerente from './pages/admin/InformeGerente/InformeGerente.jsx';
//Vaon
import TabProduccionNacionalVaon from './pages/admin/Vaon/ProduccionNacional/TabProduccionNacional.jsx';
import TabProduccionImportadoVaon from './pages/admin/Vaon/ProduccionImportado/TabProduccionImportado.jsx';
import TabInformeVaon from './pages/admin/Vaon/Informe/TabInforme.jsx';
//provideer
import { AuthProvider } from './providers/auth.provider.jsx';
//Alertas
import TabsAlertasAdmin from './pages/admin/gestionAlertas/TabsAlertas.jsx';
import CarrucelMovimiento from './carruceImagenes/CarrucelMovimiento.jsx';
//Cumpleaños
import CumpleanosAdmin from './pages/admin/Cumpleaños/Cumpleanos.jsx';

//Protected
import AdminProtected from './providers/AdminProtected.provider.jsx';
import ClienteProtected from './providers/ClienteProtected.provider.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<div>Error 404</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/prueba" element={<Prueba />} />
        <Route
          path="/admin"
          element={
            <AuthProvider>
              <AdminProtected />
            </AuthProvider>
          }
        >
          {/**admin */}
          <Route index element={<UsuarioAdmin />} />
          <Route path="usuarios" element={<UsuarioAdmin />} />
          <Route path="roles" element={<RolAdmin />} />
          <Route path="gestion" element={<GestionAdmin />} />
          {/* Produccion */}
          <Route path="produccion/barbotina" element={<TabBarbotinaAdmin />} />
          <Route path="produccion/atomizado" element={<TabAtomizadoAdmin />} />
          <Route path="produccion/prensado" element={<TabPrensadoAdmin />} />
          <Route path="produccion/esmalte" element={<TabEsmalteAdmin />} />
          <Route
            path="produccion/serigrafia"
            element={<TabSerigrafiadoAdmin />}
          />
          <Route path="produccion/lineas" element={<LineasAdmin />} />
          <Route path="produccion/formato" element={<FormatoAdmin />} />
          <Route path="produccion/seleccion" element={<TabSeleccion />} />
          <Route
            path="produccion/informe-produccion"
            element={<InformeProduccion />}
          />
          {/* Produccion Admistracion */}
          <Route
            path="produccion/administracion/no-conforme"
            element={<ProductoNoConforme />}
          />
          <Route
            path="produccion/administracion/calidad"
            element={<Calidad />}
          />
          <Route
            path="produccion/administracion/indice-consumo-agua"
            element={<IndiceConsumoAgua />}
          />
          <Route
            path="produccion/administracion/indice-consumo-bases"
            element={<IndiceConsumoBases />}
          />
          <Route
            path="produccion/administracion/indice-consumo-ee"
            element={<IndiceConsumoEe />}
          />
          <Route
            path="produccion/administracion/indice-consumo-engobe"
            element={<IndiceConsumoEngobe />}
          />
          <Route
            path="produccion/administracion/indice-consumo-esmalte"
            element={<IndiceConsumoEsmalte />}
          />
          <Route
            path="produccion/administracion/indice-consumo-gn"
            element={<IndiceConsumoGn />}
          />
          <Route
            path="produccion/administracion/indice-consumo-linea"
            element={<IndiceConsumoLinea />}
          />
          <Route
            path="produccion/administracion/indice-polvo-atomizado"
            element={<IndicePolvoAtomizado />}
          />
          <Route
            path="produccion/administracion/monitoreo-gases-combustion"
            element={<MonitoreoGasesCombustion />}
          />
          <Route
            path="produccion/administracion/produccion"
            element={<Produccion />}
          />
          {/** administracion */}
          <Route
            path="administracion/atencion-consultorio"
            element={<AtencionConsultorio />}
          />
          <Route
            path="administracion/consultorio-dental"
            element={<ConsultorioDental />}
          />
          <Route path="administracion/horas-extra" element={<HorasExtra />} />
          <Route path="administracion/utilidad" element={<Utilidad />} />
          <Route
            path="administracion/generacion-residuos"
            element={<GeneracionResiduos />}
          />
          <Route
            path="administracion/indice-frecuencia"
            element={<IndiceFrecuencia />}
          />
          <Route
            path="administracion/indice-severidad"
            element={<IndiceSeveridad />}
          />
          <Route
            path="administracion/indice-acciones-correctivas"
            element={<IndiceAccionesCorrectivas />}
          />
          <Route path="administracion/donaciones" element={<Donaciones />} />
          <Route
            path="administracion/evolucion-contado-credito"
            element={<EvolucionContadoContraCredito />}
          />
          <Route
            path="administracion/reclamo-producto-terminado"
            element={<ReclamoProductoTerminado />}
          />
          {/** administracion */}
          <Route
            path="comercializacion/ingreso-venta-total"
            element={<IngresoVentaTotal />}
          />
          <Route
            path="comercializacion/precio-unitario"
            element={<PrecioUnitario />}
          />
          <Route path="comercializacion/venta-total" element={<VentaTotal />} />
          {/** mantenimiento */}
          <Route
            path="mantenimiento/disponibilidad-linea"
            element={<DisponibilidadPorLinea />}
          />
          {/** Documento */}

          <Route path="secretaria/contrato" element={<ContratoAdmin />} />
          <Route
            path="secretaria/correspondencia"
            element={<CorrespondenciaRecibida />}
          />
          <Route
            path="secretaria/comercial"
            element={<CorrespondenciaExternaComercial />}
          />
          <Route
            path="secretaria/gerencia"
            element={<CorrespondenciaExternaRecibida />}
          />
          <Route path="medicina/inventario" element={<InventarioMedicina />} />
          <Route path="medicina/enfermedad" element={<EnfermedadMes />} />
          <Route path="medicina/oms" element={<FechasOms />} />
          {/* Informe Gerente */}
          <Route path="informe-gerente" element={<InformeGerente />} />
          {/****Documeto */}
          <Route
            path="documento/gestion-calidad"
            element={<GestionCalidadPage />}
          />
          <Route
            path="documento/gestion-ambiental"
            element={<GestionAmbiental />}
          />
          <Route
            path="documento/gestion-seguridad"
            element={<GestionSeguridad />}
          />
          <Route
            path="documento/gestion-noticia"
            element={<GestionNoticia />}
          />
          <Route
            path="documento/gestion-comunicado"
            element={<GestionComunicado />}
          />
          <Route path="documento/gestion-frase" element={<GestionFrases />} />
          {/***Gestion Vaon */}
          <Route
            path="vaon/produccion-nacional"
            element={<TabProduccionNacionalVaon />}
          />
          <Route
            path="vaon/produccion-importado"
            element={<TabProduccionImportadoVaon />}
          />
          <Route path="vaon/informe" element={<TabInformeVaon />} />
          {/***Alertar */}
          <Route path="alerta" element={<TabsAlertasAdmin />} />
          {/***Cumpleanos */}
          <Route path="cumpleanos" element={<CumpleanosAdmin />} />
        </Route>
        <Route path="/cliente" element={<ClienteProtected />}>
          <Route index element={<Inicio />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="produccion/secciones" element={<TabProduccion />} />
          <Route
            path="produccion/administracion"
            element={<TabProduccionAdministracion />}
          />
          <Route
            path="produccion/mantenimiento"
            element={<TabProduccionMantenimiento />}
          />
          <Route path="adminitracion" element={<TabAdministracion />} />
          <Route path="comercializacion" element={<TabComercializacion />} />
        </Route>
        <Route path="/" element={<DocumetosLayout />} />
        <Route path="/carrucel" element={<CarrucelMovimiento />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
