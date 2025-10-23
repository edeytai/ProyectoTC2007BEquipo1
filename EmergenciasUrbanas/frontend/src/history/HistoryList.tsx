import {
  List,
  Datagrid,
  TextField,
  DateField,
  Filter,
  TextInput,
  SelectInput,
  FunctionField,
} from 'react-admin';
import { Box, Typography, Chip } from '@mui/material';
import {
  Create,
  Edit,
  Visibility,
  CheckCircle,
  Cancel,
  Send,
  Login,
  Logout,
  Person,
} from '@mui/icons-material';

const HistoryFilters = (props: any) => (
  <Filter {...props}>
    <TextInput source="q" label="Buscar" alwaysOn placeholder="Buscar..." />
    <SelectInput
      source="accion"
      label="Acción"
      choices={[
        { id: 'login', name: 'Login' },
        { id: 'logout', name: 'Logout' },
        { id: 'crear', name: 'Crear' },
        { id: 'actualizar', name: 'Actualizar' },
        { id: 'eliminar', name: 'Eliminar' },
        { id: 'leer', name: 'Leer' },
      ]}
    />
    <TextInput source="sujeto" label="Usuario" />
  </Filter>
);

const ActionIcon = ({ action }: { action: string }) => {
  if (!action) return <Edit sx={{ fontSize: 20 }} />;

  if (action.includes('login') || action.includes('exitoso')) {
    return <Login sx={{ fontSize: 20, color: 'success.main' }} />;
  }
  if (action.includes('logout') || action.includes('fallido')) {
    return <Logout sx={{ fontSize: 20, color: 'error.main' }} />;
  }
  if (action.includes('crear')) {
    return <Create sx={{ fontSize: 20, color: 'primary.main' }} />;
  }
  if (action.includes('actualizar') || action.includes('editar')) {
    return <Edit sx={{ fontSize: 20, color: 'info.main' }} />;
  }
  if (action.includes('leer') || action.includes('ver')) {
    return <Visibility sx={{ fontSize: 20 }} />;
  }
  if (action.includes('eliminar')) {
    return <Cancel sx={{ fontSize: 20, color: 'error.main' }} />;
  }
  if (action.includes('aprobar')) {
    return <CheckCircle sx={{ fontSize: 20, color: 'success.main' }} />;
  }
  return <Person sx={{ fontSize: 20 }} />;
};

const ActionChip = ({ action }: { action: string }) => {
  let color: 'default' | 'success' | 'error' | 'info' | 'warning' = 'default';

  if (action.includes('login') || action.includes('exitoso') || action.includes('crear')) {
    color = 'success';
  } else if (action.includes('fallido') || action.includes('eliminar')) {
    color = 'error';
  } else if (action.includes('actualizar')) {
    color = 'info';
  } else if (action.includes('leer')) {
    color = 'default';
  }

  return <Chip label={action} size="small" color={color} />;
};

export const HistoryList = () => {
  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Historial de Actividades
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Registro completo de todas las acciones realizadas en el sistema
      </Typography>

      <List
        filters={<HistoryFilters />}
        sort={{ field: 'timestamp', order: 'DESC' }}
        perPage={25}
      >
        <Datagrid bulkActionButtons={false}>
          <FunctionField
            label=""
            render={(record: any) => <ActionIcon action={record.accion} />}
          />
          <DateField
            source="timestamp"
            label="Fecha/Hora"
            showTime
            locales="es-MX"
          />
          <TextField source="sujeto" label="Usuario" />
          <FunctionField
            label="Acción"
            render={(record: any) => <ActionChip action={record.accion} />}
          />
          <TextField source="objeto" label="Objeto/Recurso" />
        </Datagrid>
      </List>
    </Box>
  );
};
