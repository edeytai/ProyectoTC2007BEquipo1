import { useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  SelectField,
  SimpleList,
  FilterButton,
  TopToolbar,
  CreateButton,
  TextInput,
  SelectInput,
  useTranslate,
  usePermissions,
  useNotify,
  ExportButton,
  EditButton,
  FunctionField,
} from 'react-admin';
import { useMediaQuery, Chip, Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GetApp, PictureAsPdf } from '@mui/icons-material';
import { estadoReporteChoices, tipoEmergenciaChoices, nivelGravedadChoices, turnoChoices } from '../constants/choices';

import { BACKEND_URL } from '../config';

const incidentFilters = [
  <TextInput source="q" label="ra.action.search" alwaysOn />,
  <SelectInput source="estadoReporte" label="Estado" choices={estadoReporteChoices} />,
  <SelectInput source="tipoEmergencia" label="Tipo" choices={tipoEmergenciaChoices} />,
  <SelectInput source="nivelGravedad" label="Gravedad" choices={nivelGravedadChoices} />,
];

const ListActions = () => {
  const { permissions } = usePermissions();
  const translate = useTranslate();
  const notify = useNotify();
  const [exporting, setExporting] = useState(false);
  const canCreate = permissions === 'brigadista' || permissions === 'coordinador' || permissions === 'admin';

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setExporting(true);
      notify(translate('reports.export.loading'), { type: 'info' });

      const token = sessionStorage.getItem('auth');
      const response = await fetch(`${BACKEND_URL}/reports/export/${format}`, {
        headers: {
          'Authentication': token || '',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al generar ${format.toUpperCase()}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_emergencias_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      notify(translate('reports.export.success'), { type: 'success' });
    } catch {
      notify(translate('reports.export.error'), { type: 'error' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <TopToolbar>
      <FilterButton />
      <Button
        startIcon={exporting ? <CircularProgress size={20} /> : <GetApp />}
        size="small"
        onClick={() => handleExport('csv')}
        disabled={exporting}
        sx={{ mr: 1 }}
      >
        CSV
      </Button>
      <Button
        startIcon={exporting ? <CircularProgress size={20} /> : <PictureAsPdf />}
        size="small"
        onClick={() => handleExport('pdf')}
        disabled={exporting}
        sx={{ mr: 1 }}
      >
        PDF
      </Button>
      {canCreate && <CreateButton />}
    </TopToolbar>
  );
};

const GravedadField = ({ record }: any) => {
  const translate = useTranslate();
  if (!record?.nivelGravedad) return null;

  const color = record.nivelGravedad === 'alta'
    ? 'error'
    : record.nivelGravedad === 'media'
    ? 'warning'
    : 'success';

  return (
    <Chip
      label={translate(`incidents.fields.nivelGravedad.${record.nivelGravedad}`)}
      color={color}
      size="small"
    />
  );
};

const EstadoField = ({ record }: any) => {
  const translate = useTranslate();
  if (!record?.estadoReporte) return null;

  const color = record.estadoReporte === 'aprobado'
    ? 'success'
    : record.estadoReporte === 'en_revision'
    ? 'warning'
    : record.estadoReporte === 'cerrado'
    ? 'default'
    : 'info';

  return (
    <Chip
      label={translate(`incidents.fields.estadoReporte.${record.estadoReporte}`)}
      color={color}
      size="small"
      variant="outlined"
    />
  );
};

export const IncidentList = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const translate = useTranslate();

  // Obtener usuario actual para verificar si es admin
  const identityStr = sessionStorage.getItem('identity');
  const user = identityStr ? JSON.parse(identityStr) : null;
  const isAdmin = user?.role === 'admin';

  return (
    <List
      filters={incidentFilters}
      actions={<ListActions />}
      sort={{ field: 'fecha', order: 'DESC' }}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.solicitudMitigacion}
          secondaryText={(record) =>
            `${translate(`incidents.fields.tipoEmergencia.${record.tipoEmergencia}`)} - ${record.ubicacion?.calle}`
          }
          tertiaryText={(record) => (
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              <GravedadField record={record} />
              <EstadoField record={record} />
            </div>
          )}
          linkType="show"
        />
      ) : (
        <Datagrid rowClick="show">
          <TextField source="solicitudMitigacion" label="Solicitud" />
          <DateField source="fecha" label="Fecha" />
          <SelectField source="turno" label="Turno" choices={turnoChoices} />
          <SelectField source="tipoEmergencia" label="Tipo" choices={tipoEmergenciaChoices} />
          <FunctionField label="Gravedad" render={(record: any) => <GravedadField record={record} />} />
          <TextField source="ubicacion.colonia" label="Colonia" />
          <TextField source="personalACargo" label="Personal a cargo" />
          <FunctionField label="Estado" render={(record: any) => <EstadoField record={record} />} />
          {isAdmin && <EditButton />}
        </Datagrid>
      )}
    </List>
  );
};