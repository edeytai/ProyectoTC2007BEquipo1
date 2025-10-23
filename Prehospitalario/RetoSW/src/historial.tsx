import {
  List,
  Datagrid,
  TextField,
  DateField,
  Show,
  SimpleShowLayout,
  useRecordContext,
} from 'react-admin';
import { Chip, Box } from '@mui/material';

// Obtener color segun la accion
const getAccionColor = (accion: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  const accionLower = accion?.toLowerCase() || '';
  if (accionLower.includes('crear') || accionLower.includes('autenticacion')) return 'success';
  if (accionLower.includes('actualizar') || accionLower.includes('leer')) return 'info';
  if (accionLower.includes('eliminar')) return 'error';
  return 'default';
};

// Campo de accion con chip
const AccionField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Chip
      label={record.accion}
      color={getAccionColor(record.accion)}
      size="small"
    />
  );
};

// Lista del historial
export const HistorialList = () => (
  <List
    sort={{ field: 'timestamp', order: 'DESC' }}
    perPage={25}
    exporter={false}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <DateField
        source="timestamp"
        label="Fecha y Hora"
        showTime
        locales="es-MX"
      />
      <TextField source="sujeto" label="Usuario" />
      <TextField source="objeto" label="Recurso" />
      <AccionField />
    </Datagrid>
  </List>
);

// Vista de detalles del historial
export const HistorialShow = () => (
  <Show>
    <SimpleShowLayout>
      <DateField
        source="timestamp"
        label="Fecha y Hora"
        showTime
        locales="es-MX"
      />
      <TextField source="sujeto" label="Usuario" />
      <TextField source="objeto" label="Recurso Afectado" />
      <TextField source="accion" label="Acción Realizada" />
    </SimpleShowLayout>
  </Show>
);
