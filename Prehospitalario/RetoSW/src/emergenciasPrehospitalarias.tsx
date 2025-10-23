import {
  List,
  Datagrid,
  TextField,
  DateField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  SelectInput,
  required,
  useRecordContext,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  TopToolbar,
  CreateButton,
  ExportButton,
  useTheme,
} from 'react-admin';
import {
  Box,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  LocalHospital,
  Person,
  CalendarToday,
  LocationOn,
  Emergency,
} from '@mui/icons-material';
import { getColors } from './theme/colors';

const prioridadOpciones = [
  { id: 'baja', name: 'Baja' },
  { id: 'media', name: 'Media' },
  { id: 'alta', name: 'Alta' },
  { id: 'critica', name: 'Crítica' },
];

const tipoEmergenciaOpciones = [
  { id: 'trauma', name: 'Trauma' },
  { id: 'clinico', name: 'Clínico' },
  { id: 'obstetrico', name: 'Obstétrico' },
  { id: 'pediatrico', name: 'Pediátrico' },
  { id: 'otro', name: 'Otro' },
];

const estadoEmergenciaOpciones = [
  { id: 'en-curso', name: 'En Curso' },
  { id: 'en-transito', name: 'En Tránsito' },
  { id: 'finalizada', name: 'Finalizada' },
  { id: 'cancelada', name: 'Cancelada' },
];

const sexoOpciones = [
  { id: 'masculino', name: 'Masculino' },
  { id: 'femenino', name: 'Femenino' },
  { id: 'otro', name: 'Otro' },
  { id: 'prefiero-no-decir', name: 'Prefiero no decir' },
];

const EstadoChip = () => {
  const record = useRecordContext();
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);

  if (!record) return null;

  const estadoConfig = {
    'en-curso': { color: colors.warning.dark, bgColor: colors.warning.light, label: 'En Curso' },
    'en-transito': { color: colors.info.main, bgColor: colors.info.light, label: 'En Tránsito' },
    'finalizada': { color: colors.success.main, bgColor: colors.success.light, label: 'Finalizada' },
    'cancelada': { color: colors.neutral[600], bgColor: colors.neutral[200], label: 'Cancelada' },
  };

  const config = estadoConfig[record.estado as keyof typeof estadoConfig] || estadoConfig['en-curso'];

  return (
    <Chip
      label={config.label}
      sx={{
        bgcolor: config.bgColor,
        color: config.color,
        fontWeight: 600,
        border: `1px solid ${config.color}`,
      }}
      size="small"
      aria-label={`Estado: ${config.label}`}
    />
  );
};

const PrioridadChip = () => {
  const record = useRecordContext();
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);

  if (!record) return null;

  const prioridadConfig = {
    'baja': { color: colors.info.main, bgColor: colors.info.light, label: 'Baja' },
    'media': { color: colors.warning.dark, bgColor: colors.warning.light, label: 'Media' },
    'alta': { color: colors.primary.main, bgColor: colors.error.light, label: 'Alta' },
    'critica': { color: colors.error.dark, bgColor: colors.error.light, label: 'Crítica' },
  };

  const config = prioridadConfig[record.prioridad as keyof typeof prioridadConfig] || prioridadConfig['media'];

  return (
    <Chip
      label={config.label}
      sx={{
        bgcolor: config.bgColor,
        color: config.color,
        fontWeight: 600,
        border: `1px solid ${config.color}`,
      }}
      size="small"
      aria-label={`Prioridad: ${config.label}`}
    />
  );
};

const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Nueva Emergencia" />
    <ExportButton label="Exportar" />
  </TopToolbar>
);

export const EmergenciasPrehospitalariaslist = () => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);

  return (
    <Box sx={{ bgcolor: colors.background.default, minHeight: '100vh', p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocalHospital sx={{ color: colors.primary.main, mr: 1, fontSize: 32 }} />
          <Typography
            variant="h4"
            sx={{ color: colors.text.primary, fontWeight: 700 }}
            component="h1"
          >
            Emergencias Prehospitalarias
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: colors.text.secondary }}>
          Gestión de atención médica de emergencia en campo
        </Typography>
      </Box>

      <List actions={<ListActions />} sx={{ bgcolor: colors.background.paper }}>
        <Datagrid
          bulkActionButtons={false}
          sx={{
            '& .RaDatagrid-headerCell': {
              bgcolor: colors.background.paper,
              color: colors.text.primary,
              fontWeight: 600,
            },
            '& .RaDatagrid-rowCell': {
              color: colors.text.primary,
            },
          }}
        >
          <TextField source="folio" label="Folio" />
          <DateField source="fechaHora" label="Fecha y Hora" showTime />
          <TextField source="paciente.nombre" label="Paciente" />
          <TextField source="tipoEmergencia" label="Tipo" />
          <PrioridadChip />
          <EstadoChip />
          <TextField source="ubicacion" label="Ubicación" />
        </Datagrid>
      </List>
    </Box>
  );
};

const EmergenciasPrehospitalariasForm = () => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);

  return (
    <SimpleForm
      sx={{
        bgcolor: colors.background.paper,
        '& .MuiFormControl-root': {
          '& label': {
            color: colors.text.secondary,
          },
          '& .MuiInputBase-input': {
            color: colors.text.primary,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colors.border.main,
            },
            '&:hover fieldset': {
              borderColor: colors.border.focus,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.border.focus,
            },
          },
        },
      }}
    >
      {/* Cronologia del servicio */}
      <Accordion defaultExpanded sx={{ mb: 2, bgcolor: colors.background.paper }}>
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: colors.text.primary }} />}
          sx={{ bgcolor: colors.error.light }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarToday sx={{ mr: 1, color: colors.primary.main }} />
            <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>
              Cronología del Servicio (RFPH1)
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextInput
                source="folio"
                label="Folio"
                fullWidth
                validate={required()}
                helperText="Número único de identificación del servicio"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateInput
                source="fechaHora"
                label="Fecha y Hora de Llamada"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateInput source="horaSalida" label="Hora de Salida Base" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateInput source="horaLlegadaEscena" label="Hora de Llegada a Escena" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateInput
                source="horaLlegadaHospital"
                label="Hora de Llegada a Hospital"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateInput
                source="horaDisponible"
                label="Hora Disponible (fin servicio)"
                fullWidth
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Datos del paciente */}
      <Accordion sx={{ mb: 2, bgcolor: colors.background.paper }}>
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: colors.text.primary }} />}
          sx={{ bgcolor: colors.error.light }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1, color: colors.primary.main }} />
            <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>
              Datos del Paciente (RFPH2)
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextInput
                source="paciente.nombre"
                label="Nombre Completo"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <NumberInput source="paciente.edad" label="Edad" fullWidth validate={required()} />
            </Grid>
            <Grid item xs={12} md={3}>
              <SelectInput
                source="paciente.sexo"
                label="Sexo"
                choices={sexoOpciones}
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput source="paciente.curp" label="CURP" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput source="paciente.telefono" label="Teléfono" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                source="paciente.direccion"
                label="Dirección"
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* RFPH3: Ubicación y Motivo */}
      <Accordion sx={{ mb: 2, bgcolor: colors.background.paper }}>
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: colors.text.primary }} />}
          sx={{ bgcolor: colors.error.light }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ mr: 1, color: colors.primary.main }} />
            <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>
              Ubicación y Clasificación (RFPH3)
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextInput
                source="ubicacion"
                label="Ubicación de la Emergencia"
                fullWidth
                multiline
                rows={2}
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="coordenadas.latitud"
                label="Latitud GPS"
                fullWidth
                helperText="Se captura automáticamente con geolocalización"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="coordenadas.longitud"
                label="Longitud GPS"
                fullWidth
                helperText="Se captura automáticamente con geolocalización"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectInput
                source="tipoEmergencia"
                label="Tipo de Emergencia"
                choices={tipoEmergenciaOpciones}
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectInput
                source="prioridad"
                label="Nivel de Prioridad"
                choices={prioridadOpciones}
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                source="motivoAtencion"
                label="Motivo de Atención"
                fullWidth
                multiline
                rows={3}
                validate={required()}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* RFPH5: Signos Vitales */}
      <Accordion sx={{ mb: 2, bgcolor: colors.background.paper }}>
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: colors.text.primary }} />}
          sx={{ bgcolor: colors.error.light }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Emergency sx={{ mr: 1, color: colors.primary.main }} />
            <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>
              Signos Vitales (RFPH5)
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 2, color: colors.text.secondary }}>
            Registrar signos vitales iniciales y durante el traslado
          </Typography>
          <ArrayInput source="signosVitales">
            <SimpleFormIterator inline>
              <DateInput source="hora" label="Hora" />
              <NumberInput source="presionArterial.sistolica" label="PA Sistólica (mmHg)" />
              <NumberInput source="presionArterial.diastolica" label="PA Diastólica (mmHg)" />
              <NumberInput source="frecuenciaCardiaca" label="FC (lpm)" />
              <NumberInput source="frecuenciaRespiratoria" label="FR (rpm)" />
              <NumberInput source="temperatura" label="Temperatura (°C)" step={0.1} />
              <NumberInput source="saturacionOxigeno" label="SpO2 (%)" />
              <TextInput source="glucosa" label="Glucosa (mg/dL)" />
            </SimpleFormIterator>
          </ArrayInput>
        </AccordionDetails>
      </Accordion>

      {/* RFPH6: Tratamientos y Procedimientos */}
      <Accordion sx={{ mb: 2, bgcolor: colors.background.paper }}>
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: colors.text.primary }} />}
          sx={{ bgcolor: colors.error.light }}
        >
          <Typography sx={{ fontWeight: 600, color: colors.text.primary, ml: 5 }}>
            Tratamientos Aplicados (RFPH6)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ArrayInput source="tratamientos">
            <SimpleFormIterator>
              <TextInput source="procedimiento" label="Procedimiento" fullWidth />
              <TextInput source="medicamento" label="Medicamento" fullWidth />
              <TextInput source="dosis" label="Dosis" />
              <TextInput source="via" label="Vía de Administración" />
              <DateInput source="hora" label="Hora de Aplicación" />
              <TextInput
                source="observaciones"
                label="Observaciones"
                fullWidth
                multiline
                rows={2}
              />
            </SimpleFormIterator>
          </ArrayInput>
        </AccordionDetails>
      </Accordion>

      {/* RFPH7: Destino del Paciente */}
      <Accordion sx={{ mb: 2, bgcolor: colors.background.paper }}>
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: colors.text.primary }} />}
          sx={{ bgcolor: colors.error.light }}
        >
          <Typography sx={{ fontWeight: 600, color: colors.text.primary, ml: 5 }}>
            Destino del Paciente (RFPH7)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextInput
                source="destino.hospital"
                label="Hospital de Destino"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput source="destino.servicio" label="Servicio Hospitalario" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                source="destino.medicoReceptor"
                label="Médico Receptor"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                source="destino.observaciones"
                label="Observaciones del Traslado"
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Estado y Personal */}
      <Divider sx={{ my: 3, borderColor: colors.border.main }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SelectInput
            source="estado"
            label="Estado de la Emergencia"
            choices={estadoEmergenciaOpciones}
            fullWidth
            validate={required()}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            source="unidad"
            label="Unidad/Ambulancia"
            fullWidth
            validate={required()}
            helperText="Número de la unidad que atendió"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            source="paramedico"
            label="Paramédico Responsable"
            fullWidth
            validate={required()}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput source="tripulacion" label="Tripulación" fullWidth multiline rows={2} />
        </Grid>
      </Grid>
    </SimpleForm>
  );
};

export const EmergenciasPrehospitalariasEdit = () => (
  <Edit>
    <EmergenciasPrehospitalariasForm />
  </Edit>
);

export const EmergenciasPrehospitalariasCreate = () => (
  <Create>
    <EmergenciasPrehospitalariasForm />
  </Create>
);
