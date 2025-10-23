import * as React from 'react';
import {
  Admin,
  Resource,
  Layout,
  AppBar,
  defaultTheme,
  CustomRoutes,
} from 'react-admin';
import { Route } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import {
  LocalFireDepartment,
  Assessment,
  History,
  People,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { authProvider } from './providers/authProvider';
import { dataProvider } from './providers/dataProvider';
import { i18nProvider } from './providers/i18nProvider';

import {
  IncidentList,
  IncidentCreate,
  IncidentEdit,
  IncidentShow,
} from './incidents';

import {
  UserList,
  UserCreate,
  UserEdit,
} from './users';

import { ReportsDashboard } from './reports/ReportsDashboard';
import { HistoryList } from './history/HistoryList';
import { PublicCapture } from './PublicCapture';
import { Dashboard } from './Dashboard';

const lightTheme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 12,
    h1: { fontSize: '1.8rem' },
    h2: { fontSize: '1.6rem' },
    h3: { fontSize: '1.4rem' },
    h4: { fontSize: '1.2rem' },
    h5: { fontSize: '1.1rem' },
    h6: { fontSize: '1rem' },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8rem' },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        margin: 'dense',
        size: 'small',
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: 'dense',
        size: 'small',
      },
    },
  },
});

const darkTheme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 12,
    h1: { fontSize: '1.8rem' },
    h2: { fontSize: '1.6rem' },
    h3: { fontSize: '1.4rem' },
    h4: { fontSize: '1.2rem' },
    h5: { fontSize: '1.1rem' },
    h6: { fontSize: '1rem' },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8rem' },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        margin: 'dense',
        size: 'small',
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: 'dense',
        size: 'small',
      },
    },
  },
});

const CustomAppBar = () => (
  <AppBar>
    <Box flex={1} display="flex" alignItems="center">
      <LocalFireDepartment sx={{ mr: 1 }} />
      <Typography variant="h6" id="react-admin-title">
        Emergencias Urbanas - POC
      </Typography>
    </Box>
  </AppBar>
);

const CustomLayout = (props: any) => (
  <Layout {...props} appBar={CustomAppBar} />
);

const LoginPage = () => {
  const [loading, setLoading] = React.useState(false);

  const userPasswords: { [key: string]: string } = {
    'brigadista1': 'brigadista123',
    'brigadista2': 'brigadista123',
    'coordinador1': 'coordinador123',
    'autoridad1': 'autoridad123',
    'admin': 'admin123'
  };

  const handleLogin = async (username: string) => {
    setLoading(true);
    try {
      const password = userPasswords[username] || '';
      await authProvider.login({ username, password });
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      alert('Error al iniciar sesión. Verifique que el backend esté corriendo.');
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Box
        p={4}
        bgcolor="background.paper"
        borderRadius={2}
        boxShadow={3}
        maxWidth={400}
        width="100%"
        mx={2}
      >
        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          <LocalFireDepartment sx={{ fontSize: 40, mr: 1, color: 'primary.main' }} />
          <Typography variant="h5">Emergencias Urbanas</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
          Seleccione un usuario para ingresar al sistema
        </Typography>

        <Box display="flex" flexDirection="column" gap={1}>
          <button
            onClick={() => handleLogin('brigadista1')}
            disabled={loading}
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: '#fff',
              cursor: loading ? 'wait' : 'pointer',
              textAlign: 'left',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Typography variant="subtitle1">
              {loading ? 'Iniciando sesión...' : 'Brigadista'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Crear y editar reportes en borrador
            </Typography>
          </button>

          <button
            onClick={() => handleLogin('coordinador1')}
            disabled={loading}
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: '#fff',
              cursor: loading ? 'wait' : 'pointer',
              textAlign: 'left',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Typography variant="subtitle1">Coordinador</Typography>
            <Typography variant="caption" color="text.secondary">
              Aprobar y gestionar reportes
            </Typography>
          </button>

          <button
            onClick={() => handleLogin('autoridad1')}
            disabled={loading}
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: '#fff',
              cursor: loading ? 'wait' : 'pointer',
              textAlign: 'left',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Typography variant="subtitle1">Autoridad</Typography>
            <Typography variant="caption" color="text.secondary">
              Solo lectura de reportes
            </Typography>
          </button>

          <button
            onClick={() => handleLogin('admin')}
            disabled={loading}
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: '#fff',
              cursor: loading ? 'wait' : 'pointer',
              textAlign: 'left',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Typography variant="subtitle1">Administrador</Typography>
            <Typography variant="caption" color="text.secondary">
              Acceso completo al sistema
            </Typography>
          </button>
        </Box>

        <Typography variant="caption" color="text.secondary" display="block" mt={3} textAlign="center">
          POC - Prueba de Concepto
        </Typography>
      </Box>
    </Box>
  );
};

function App() {
  const [permissions, setPermissions] = React.useState<string>('');

  React.useEffect(() => {
    const identityStr = sessionStorage.getItem('identity');
    if (identityStr) {
      const identity = JSON.parse(identityStr);
      setPermissions(identity.role);
    }
  }, []);

  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      layout={CustomLayout}
      dashboard={Dashboard}
      loginPage={LoginPage}
      theme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="light"
      disableTelemetry
    >
      <Resource
        name="incidents"
        list={IncidentList}
        create={IncidentCreate}
        edit={IncidentEdit}
        show={IncidentShow}
        icon={LocalFireDepartment}
        options={{ label: 'Incidentes' }}
      />

      {/* Users - Admin only */}
      {permissions === 'admin' && (
        <Resource
          name="users"
          list={UserList}
          create={UserCreate}
          edit={UserEdit}
          icon={People}
          options={{ label: 'Usuarios' }}
        />
      )}

      {(permissions === 'coordinador' || permissions === 'autoridad' || permissions === 'admin') && (
        <Resource
          name="reports"
          list={ReportsDashboard}
          icon={Assessment}
          options={{ label: 'Reportes' }}
        />
      )}

      {(permissions === 'autoridad' || permissions === 'admin' || permissions === 'coordinador') && (
        <Resource
          name="history"
          list={HistoryList}
          icon={History}
          options={{ label: 'Historial' }}
        />
      )}

      <CustomRoutes noLayout>
        <Route path="/capture" element={<PublicCapture />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App
