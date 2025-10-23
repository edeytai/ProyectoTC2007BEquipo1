import { Admin, Resource, CustomRoutes, usePermissions } from 'react-admin';
import { Route, Navigate, BrowserRouter, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { dataProvider } from './dataProvider';
import { Dashboard } from './Dashboard';
import { DashboardSimple } from './DashboardSimple';
import { authProvider } from './authProvider';
import { LoginPage } from './LoginPage';
import { useMemo, useEffect, useState } from 'react';
import { createAppTheme } from './theme/theme';
import { ThemeModeProvider, useThemeMode } from './theme/ThemeContext';
import { ReportesList, ReportesShow, ReportesEdit } from './reportes';
import { UsuariosList, UsuariosCreate, UsuariosEdit, UsuariosShow } from './usuarios';
import { HistorialList, HistorialShow } from './historial';
import { Perfil } from './Perfil';
import { FueraDeTurno } from './FueraDeTurno';
import { DashboardParamedico } from './DashboardParamedico';
import { Assessment, People, History } from '@mui/icons-material';
import { i18nProvider } from './i18n/i18nProvider';
import { ThemeProvider, useTheme } from '@mui/material';

// Verificar permisos antes de mostrar el dashboard
function DashboardWithPermissions() {
  // Obtener permisos del usuario
  const resultado = usePermissions();
  const permissions = resultado.permissions;
  const isLoading = resultado.isLoading;

  // Si esta cargando o no hay permisos, no mostrar nada
  if (isLoading) {
    return null;
  }
  if (!permissions) {
    return null;
  }

  // Verificar si es paramedico (solo puede crear reportes)
  const puedeCrearReportes = permissions.includes('reportes.create');
  const puedeListarReportes = permissions.includes('reportes.list');
  const puedeMostrarReportes = permissions.includes('reportes.show');
  const esAdministrador = permissions.includes('*');

  let esParamedico = false;
  if (puedeCrearReportes) {
    if (!puedeListarReportes) {
      if (!puedeMostrarReportes) {
        if (!esAdministrador) {
          esParamedico = true;
        }
      }
    }
  }

  // Si es paramedico, mostrar dashboard especial
  if (esParamedico) {
    return <DashboardParamedico />;
  }

  // Verificar si puede ver el dashboard normal
  let puedeVerDashboard = false;
  if (esAdministrador) {
    puedeVerDashboard = true;
  }
  if (permissions.includes('dashboard.show')) {
    puedeVerDashboard = true;
  }

  // Si no puede ver dashboard, redirigir a reportes
  if (!puedeVerDashboard) {
    return <Navigate to="/reportes" replace />;
  }

  // Mostrar el dashboard normal
  return <Dashboard />;
}


function AppContent() {
  // Obtener el modo del tema (claro u oscuro)
  const resultado = useThemeMode();
  const mode = resultado.mode;

  // Crear el tema segun el modo
  const theme = useMemo(function() {
    const temaCreado = createAppTheme(mode);
    return temaCreado;
  }, [mode]);

  // Crear funcion para renderizar recursos segun permisos
  function renderizarRecursos(permissions: string[]) {
    // Verificar si es administrador
    let isAdmin = false;
    if (permissions) {
      if (permissions.includes('*')) {
        isAdmin = true;
      }
    }

    // Verificar permisos de reportes
    let canListReportes = false;
    let canShowReportes = false;
    let canEditReportes = false;
    let canCreateReportes = false;

    if (permissions) {
      if (permissions.includes('*')) {
        canListReportes = true;
        canShowReportes = true;
        canEditReportes = true;
        canCreateReportes = true;
      }
      if (permissions.includes('reportes.list')) {
        canListReportes = true;
      }
      if (permissions.includes('reportes.show')) {
        canShowReportes = true;
      }
      if (permissions.includes('reportes.create')) {
        canCreateReportes = true;
      }
    }

    // Verificar si puede ver reportes
    let puedeVerReportes = false;
    if (canListReportes) {
      puedeVerReportes = true;
    }
    if (canCreateReportes) {
      puedeVerReportes = true;
    }

    // Determinar que componentes mostrar para reportes
    let listaReportes = undefined;
    if (canListReportes) {
      listaReportes = ReportesList;
    }

    let mostrarReportes = undefined;
    if (canShowReportes) {
      mostrarReportes = ReportesShow;
    }

    let editarReportes = undefined;
    if (canEditReportes) {
      editarReportes = ReportesEdit;
    }

    // Crear los recursos JSX
    const recursos = [];

    // Agregar recurso de usuarios si es admin
    if (isAdmin) {
      const recursoUsuarios = (
        <Resource
          key="usuarios"
          name="usuarios"
          options={{ label: 'Usuarios' }}
          icon={People}
          list={UsuariosList}
          show={UsuariosShow}
          create={UsuariosCreate}
          edit={UsuariosEdit}
        />
      );
      recursos.push(recursoUsuarios);
    }

    // Agregar recurso de historial si es admin
    if (isAdmin) {
      const recursoHistorial = (
        <Resource
          key="log"
          name="log"
          options={{ label: 'Historial' }}
          icon={History}
          list={HistorialList}
          show={HistorialShow}
        />
      );
      recursos.push(recursoHistorial);
    }

    // Agregar recurso de reportes si puede verlos
    if (puedeVerReportes) {
      const recursoReportes = (
        <Resource
          key="reportes"
          name="reportes"
          options={{ label: 'Reportes Prehospitalarios' }}
          icon={Assessment}
          list={listaReportes}
          show={mostrarReportes}
          edit={editarReportes}
          create={undefined}
        />
      );
      recursos.push(recursoReportes);
    }

    // Agregar rutas personalizadas
    const rutaPerfil = <Route key="perfil" path="/perfil" element={<Perfil />} />;
    const rutasCustom = <CustomRoutes key="custom">{rutaPerfil}</CustomRoutes>;
    recursos.push(rutasCustom);

    return recursos;
  }

  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      dashboard={DashboardWithPermissions}
      loginPage={LoginPage}
      layout={Layout}
      theme={theme}
      i18nProvider={i18nProvider}
    >
      {function(permissions) {
        return renderizarRecursos(permissions);
      }}
    </Admin>
  );
}

export function App() {
  return (
    <ThemeModeProvider>
      <AppContent />
    </ThemeModeProvider>
  );
}
