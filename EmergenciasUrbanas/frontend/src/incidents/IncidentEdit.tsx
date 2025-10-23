import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  TimeInput,
  SelectInput,
  NumberInput,
  required,
  minValue,
  maxValue,
  useTranslate,
  ArrayInput,
  SimpleFormIterator,
  usePermissions,
  useRecordContext,
  Toolbar,
  SaveButton,
} from 'react-admin';
import { Box, Typography, Alert } from '@mui/material';
import { turnoChoices, modoActivacionChoices, tipoEmergenciaChoices, nivelGravedadChoices, estadoReporteChoices } from '../constants/choices';

const validateKms = [required(), minValue(0), maxValue(1000)];
const validateTiempo = [required(), minValue(0), maxValue(480)];

const EditToolbar = () => {
  const record = useRecordContext();
  const { permissions } = usePermissions();
  const translate = useTranslate();

  // Solo puede editar si es su propio registro o es admin/coordinador
  const canEdit = permissions === 'admin' ||
    permissions === 'coordinador' ||
    (permissions === 'brigadista' && record?.estadoReporte === 'draft');

  if (!canEdit) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        {translate('incidents.permissions.noEdit')}
      </Alert>
    );
  }

  return (
    <Toolbar>
      <SaveButton />
    </Toolbar>
  );
};

export const IncidentEdit = () => {
  const translate = useTranslate();
  const { permissions } = usePermissions();

  return (
    <Edit>
      <SimpleForm toolbar={<EditToolbar />}>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          {translate('incidents.sections.operational')}
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <TextInput
            source="solicitudMitigacion"
            label={translate('incidents.fields.solicitudMitigacion')}
            validate={required()}
            fullWidth
            disabled={permissions === 'brigadista'}
          />
          <DateInput
            source="fecha"
            label={translate('incidents.fields.fecha')}
            validate={required()}
            fullWidth
          />
          <TimeInput
            source="hora"
            label={translate('incidents.fields.hora')}
            validate={required()}
            fullWidth
          />
        </Box>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <SelectInput
            source="turno"
            label="Turno"
            choices={turnoChoices}
            validate={required()}
            fullWidth
          />
          <SelectInput
            source="modoActivacion"
            label="Modo de activación"
            choices={modoActivacionChoices}
            validate={required()}
            fullWidth
          />
          <TextInput
            source="personalACargo"
            label={translate('incidents.fields.personalACargo')}
            validate={required()}
            fullWidth
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {translate('incidents.sections.attention')}
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <TimeInput
            source="horaAtencion"
            label={translate('incidents.fields.horaAtencion')}
            validate={required()}
            fullWidth
          />
          <NumberInput
            source="tiempoTrasladoMin"
            label={translate('incidents.fields.tiempoTrasladoMin')}
            validate={validateTiempo}
            fullWidth
          />
          <NumberInput
            source="kmsRecorridos"
            label={translate('incidents.fields.kmsRecorridos')}
            validate={validateKms}
            step={0.1}
            fullWidth
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {translate('incidents.sections.location')}
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <NumberInput
            source="ubicacion.lat"
            label={translate('incidents.fields.ubicacion.lat')}
            validate={required()}
            fullWidth
          />
          <NumberInput
            source="ubicacion.lng"
            label={translate('incidents.fields.ubicacion.lng')}
            validate={required()}
            fullWidth
          />
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 2 }}>
          <TextInput
            source="ubicacion.calle"
            label={translate('incidents.fields.ubicacion.calle')}
            validate={required()}
            fullWidth
          />
          <TextInput
            source="ubicacion.colonia"
            label={translate('incidents.fields.ubicacion.colonia')}
            validate={required()}
            fullWidth
          />
        </Box>
        <TextInput
          source="ubicacion.referencias"
          label={translate('incidents.fields.ubicacion.referencias')}
          fullWidth
          multiline
        />

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {translate('incidents.sections.classification')}
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <SelectInput
            source="tipoEmergencia"
            label="Tipo de emergencia"
            choices={tipoEmergenciaChoices}
            validate={required()}
            fullWidth
          />
          <SelectInput
            source="nivelGravedad"
            label="Nivel de gravedad"
            choices={nivelGravedadChoices}
            validate={required()}
            fullWidth
          />
        </Box>

        {/* Estado solo editable por coordinador/admin */}
        {(permissions === 'coordinador' || permissions === 'admin') && (
          <SelectInput
            source="estadoReporte"
            label={translate('incidents.fields.estadoReporte')}
            choices={estadoReporteChoices}
            fullWidth
          />
        )}

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {translate('incidents.sections.results')}
        </Typography>
        <ArrayInput source="trabajosRealizados" label={translate('incidents.fields.trabajosRealizados')}>
          <SimpleFormIterator>
            <TextInput label={translate('incidents.fields.trabajo')} validate={required()} />
          </SimpleFormIterator>
        </ArrayInput>

        <TextInput
          source="observaciones"
          label={translate('incidents.fields.observaciones')}
          multiline
          rows={4}
          fullWidth
          validate={required()}
        />

        <TextInput
          source="conclusionDictamen"
          label={translate('incidents.fields.conclusionDictamen')}
          multiline
          rows={3}
          fullWidth
          validate={required()}
        />

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {translate('incidents.sections.participants')}
        </Typography>
        <ArrayInput source="dependencias" label={translate('incidents.fields.dependencias')}>
          <SimpleFormIterator>
            <TextInput label={translate('incidents.fields.dependencia')} />
          </SimpleFormIterator>
        </ArrayInput>

        <ArrayInput source="autoridadesIntervinientes" label={translate('incidents.fields.autoridadesIntervinientes')}>
          <SimpleFormIterator>
            <TextInput label={translate('incidents.fields.autoridad')} />
          </SimpleFormIterator>
        </ArrayInput>

        <TextInput
          source="responsableInmueble"
          label={translate('incidents.fields.responsableInmueble')}
          fullWidth
        />
      </SimpleForm>
    </Edit>
  );
};