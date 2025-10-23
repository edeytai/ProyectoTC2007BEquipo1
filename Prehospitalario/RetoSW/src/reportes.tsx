import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  useRecordContext,
  Show,
  SimpleShowLayout,
  Edit,
  SimpleForm,
  TextInput,
  DateTimeInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  BooleanInput,
  NumberInput,
  FormDataConsumer,
  useInput,
  SimpleList,
} from 'react-admin';
import { Chip, Box, Typography, Grid, Divider, Card, CardContent, FormGroup, FormControlLabel, Checkbox, FormLabel, useMediaQuery, useTheme } from '@mui/material';
import { Event, Person, LocalHospital, LocationOn } from '@mui/icons-material';

// Campo de motivo de atencion
const MotivoAtencionField = () => {
  const record = useRecordContext();
  if (!record || !record.datosServicio?.motivoAtencion) return null;

  const motivoMap: Record<string, { label: string; color: 'primary' | 'error' | 'secondary' }> = {
    enfermedad: { label: 'Enfermedad', color: 'primary' },
    traumatismo: { label: 'Traumatismo', color: 'error' },
    ginecoobstetrico: { label: 'Ginecoobstétrico', color: 'secondary' },
  };

  const motivo = motivoMap[record.datosServicio.motivoAtencion];

  return motivo ? (
    <Chip label={motivo.label} color={motivo.color} size="small" />
  ) : null;
};

// Componente de checkboxes con opcion Otro
const CheckboxGroupInput = ({
  source,
  label,
  choices,
  otroFieldSource
}: {
  source: string;
  label: string;
  choices: string[];
  otroFieldSource?: string;
}) => {
  const {
    field: { value, onChange },
  } = useInput({ source });

  // Usar useInput siempre para evitar errores de Hooks
  const otroFieldInput = useInput({ source: otroFieldSource || 'dummy' });
  const otroField = otroFieldSource ? otroFieldInput : null;

  const currentValues = value || [];

  const handleCheckboxChange = (choice: string, checked: boolean) => {
    const newValues = checked
      ? [...currentValues, choice]
      : currentValues.filter((v: string) => v !== choice);
    onChange(newValues);
  };

  // Separar opcion Otro
  const mainChoices = choices.filter(c => c !== 'Otro');
  const hasOtro = choices.includes('Otro');

  return (
    <Box>
      <FormLabel sx={{ fontWeight: 600, mb: 1, display: 'block' }}>{label}</FormLabel>
      <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
        {mainChoices.map((choice) => (
          <FormControlLabel
            key={choice}
            control={
              <Checkbox
                checked={currentValues.includes(choice)}
                onChange={(e) => handleCheckboxChange(choice, e.target.checked)}
              />
            }
            label={choice}
          />
        ))}
      </FormGroup>
      {hasOtro && (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={currentValues.includes('Otro')}
                onChange={(e) => handleCheckboxChange('Otro', e.target.checked)}
              />
            }
            label="Otro"
            sx={{ minWidth: 'auto', mt: 0 }}
          />
          {currentValues.includes('Otro') && otroField && (
            <Box sx={{ width: '300px', maxWidth: '50%', mt: '-8px' }}>
              <TextInput
                source={otroFieldSource!}
                label="Especificar"
                fullWidth
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

// Lista de reportes
export const ReportesList = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.datosPaciente?.nombre || 'Sin nombre'}
          secondaryText={(record) => {
            const fecha = new Date(record.fechaCreacion);
            return `${fecha.toLocaleDateString()} • ${fecha.toLocaleTimeString()}`;
          }}
          tertiaryText={(record) => (
            <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip
                size="small"
                label={`Ambulancia ${record.datosServicio?.numeroAmbulancia || 'N/A'}`}
                variant="outlined"
                sx={{ fontSize: '0.75rem', height: 26, fontWeight: 500 }}
              />
              {record.datosServicio?.motivoAtencion && (
                <Chip
                  size="small"
                  label={record.datosServicio.motivoAtencion === 'enfermedad' ? 'Enfermedad' :
                         record.datosServicio.motivoAtencion === 'traumatismo' ? 'Traumatismo' :
                         'Ginecoobstétrico'}
                  color={record.datosServicio.motivoAtencion === 'enfermedad' ? 'primary' :
                         record.datosServicio.motivoAtencion === 'traumatismo' ? 'error' :
                         'secondary'}
                  sx={{ fontSize: '0.75rem', height: 26, fontWeight: 500 }}
                />
              )}
            </Box>
          )}
          linkType="show"
          sx={{
            '& .MuiListItem-root': {
              borderBottom: `1px solid ${theme.palette.divider}`,
              py: 2.5,
              px: 2.5,
            },
            '& .MuiListItemText-primary': {
              fontWeight: 600,
              fontSize: '1.05rem',
              mb: 0.75,
            },
            '& .MuiListItemText-secondary': {
              fontSize: '0.875rem',
              color: theme.palette.text.secondary,
              mb: 0.5,
            },
          }}
        />
      ) : (
        <Datagrid rowClick="show" sx={{ '& .RaDatagrid-headerCell': { fontWeight: 600 } }}>
          <DateField source="fechaCreacion" label="Fecha de Creación" showTime />
          <TextField source="datosPaciente.nombre" label="Nombre del Paciente" />
          <TextField source="datosServicio.numeroAmbulancia" label="Ambulancia" />
          <FunctionField
            label="Motivo de Atención"
            render={() => <MotivoAtencionField />}
          />
          <TextField source="datosServicio.calle" label="Ubicación" />
          <TextField source="traslado.hospital" label="Hospital Destino" />
        </Datagrid>
      )}
    </List>
  );
};

// Componente para mostrar checkbox
const CheckboxItem = ({ checked, label }: { checked: boolean; label: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
    <Typography variant="body2" sx={{ mr: 1, fontSize: '1.2rem' }}>
      {checked ? '✓' : '○'}
    </Typography>
    <Typography variant="body2" sx={{ color: checked ? 'text.primary' : 'text.secondary' }}>
      {label}
    </Typography>
  </Box>
);

// Componente para mostrar campo
const FieldItem = ({ label, value }: { label: string; value: any }) => {
  if (!value && value !== 0) return null;
  return (
    <Box sx={{ mb: { xs: 1.5, sm: 1.5 } }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.75rem' } }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5, fontSize: { xs: '0.95rem', sm: '0.875rem' } }}>
        {value}
      </Typography>
    </Box>
  );
};

// Contenido de la vista de detalles del reporte
const ReportesShowContent = () => {
  const record = useRecordContext();

  if (!record) return null;

  return (
    <Box sx={{ width: '100%', p: { xs: 1.5, sm: 2 } }}>
          {/* Informacion general */}
          <Card sx={{ mb: { xs: 2, sm: 3 }, boxShadow: { xs: 1, sm: 2 } }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, mb: { xs: 1.5, sm: 2 } }}>
                Información del Reporte
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.75rem' }, fontWeight: 600 }}>
                    ID del Reporte
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                    #{record.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.75rem' }, fontWeight: 600 }}>
                    Motivo de Atención
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <FunctionField render={() => <MotivoAtencionField />} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.75rem' }, fontWeight: 600 }}>
                    Fecha de Creación
                  </Typography>
                  <DateField source="fechaCreacion" showTime sx={{ display: 'block', mt: 0.5, fontSize: { xs: '0.95rem', sm: '1rem' } }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.75rem' }, fontWeight: 600 }}>
                    Creado Por
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                    {record.creadoPor || 'N/A'}
                  </Typography>
                </Grid>
                {record.fechaModificacion && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.75rem' }, fontWeight: 600 }}>
                        Última Modificación
                      </Typography>
                      <DateField source="fechaModificacion" showTime sx={{ display: 'block', mt: 0.5, fontSize: { xs: '0.95rem', sm: '1rem' } }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.75rem' }, fontWeight: 600 }}>
                        Modificado Por
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                        {record.modificadoPor || 'N/A'}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Datos del Servicio */}
          <Card sx={{ mb: { xs: 2, sm: 3 }, boxShadow: { xs: 1, sm: 2 } }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, mb: { xs: 1.5, sm: 2 } }}>
                Datos del Servicio
              </Typography>

              {/* Cronometría del Servicio */}
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                Cronometría del Servicio
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <FieldItem label="Hora de Llamada" value={record.datosServicio?.horaLlamada} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FieldItem label="Hora de Traslado" value={record.datosServicio?.horaTraslado} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FieldItem label="Hora de Salida" value={record.datosServicio?.horaSalida} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FieldItem label="Hora Hospital" value={record.datosServicio?.horaHospital} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FieldItem label="Hora de Llegada" value={record.datosServicio?.horaLlegada} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FieldItem label="Hora Salida Hospital" value={record.datosServicio?.horaSalidaHospital} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FieldItem label="Hora Base" value={record.datosServicio?.horaBase} />
                </Grid>
              </Grid>

              {/* Información del Servicio */}
              <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                Información del Servicio
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 2 }}>
                <Grid item xs={12} md={6}>
                  <FieldItem label="Número de Ambulancia" value={record.datosServicio?.numeroAmbulancia} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldItem label="Motivo de Atención" value={record.datosServicio?.motivoAtencion} />
                </Grid>
              </Grid>

              {/* Lugar de Ocurrencia */}
              <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                Lugar de Ocurrencia
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 2 }}>
                <Grid item xs={12}>
                  <FieldItem label="Lugar de Ocurrencia" value={record.datosServicio?.lugarOcurrencia} />
                </Grid>
                {record.datosServicio?.lugarOcurrencia === 'otra' && (
                  <Grid item xs={12}>
                    <FieldItem label="Especifique" value={record.datosServicio?.lugarOcurrenciaOtra} />
                  </Grid>
                )}
              </Grid>

              {/* Dirección */}
              <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                Dirección
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 2 }}>
                <Grid item xs={12}>
                  <FieldItem label="Calle" value={record.datosServicio?.calle} />
                </Grid>
                <Grid item xs={12}>
                  <FieldItem label="Entre Calles" value={record.datosServicio?.entreCalles} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldItem label="Colonia" value={record.datosServicio?.colonia} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldItem label="Alcaldía" value={record.datosServicio?.alcaldia} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldItem label="Número Exterior" value={record.datosServicio?.numExterior} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldItem label="Número Interior" value={record.datosServicio?.numInterior} />
                </Grid>
                <Grid item xs={12}>
                  <FieldItem label="Referencias del Domicilio" value={record.datosServicio?.referencias} />
                </Grid>
              </Grid>

              {/* Personal de Atención */}
              <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                Personal de Atención
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 2 }}>
                <Grid item xs={12} md={4}>
                  <FieldItem label="Médico" value={record.datosServicio?.medico} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FieldItem label="Paramédico" value={record.datosServicio?.paramedico} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FieldItem label="TUM" value={record.datosServicio?.tum} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Datos del Paciente */}
          <Card sx={{ mb: { xs: 2, sm: 3 }, boxShadow: { xs: 1, sm: 2 } }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, mb: { xs: 1.5, sm: 2 } }}>
                Datos del Paciente
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 2 }}>
                <Grid item xs={12} md={6}>
                  <FieldItem label="Nombre" value={record.datosPaciente?.nombre} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldItem label="Sexo" value={record.datosPaciente?.sexo} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FieldItem label="Edad (años)" value={record.datosPaciente?.edadAnios} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FieldItem label="Edad (meses)" value={record.datosPaciente?.edadMeses} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FieldItem label="Edad (días)" value={record.datosPaciente?.edadDias} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldItem label="Teléfono" value={record.datosPaciente?.telefono} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldItem label="Alergias" value={record.datosPaciente?.alergias} />
                </Grid>
                <Grid item xs={12}>
                  <FieldItem label="Antecedentes" value={record.datosPaciente?.antecedentes} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Traslado */}
          {record.traslado && Object.keys(record.traslado).some(key => record.traslado[key]) && (
            <Card sx={{ mb: { xs: 2, sm: 3 }, boxShadow: { xs: 1, sm: 2 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, mb: { xs: 1.5, sm: 2 } }}>
                  Información de Traslado
                </Typography>
                <Grid container spacing={{ xs: 2, sm: 2 }}>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Hospital" value={record.traslado?.hospital} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Doctor" value={record.traslado?.doctor} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Folio CRU" value={record.traslado?.folioCRU} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Parto - Solo mostrar si el motivo es ginecoobstetrico */}
          {record.datosServicio?.motivoAtencion === 'ginecoobstetrico' && record.parto && Object.keys(record.parto).length > 0 && (
            <Card sx={{ mb: { xs: 2, sm: 3 }, boxShadow: { xs: 1, sm: 2 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, mb: { xs: 1.5, sm: 2 } }}>
                  Datos de Parto
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Semanas de Gestación" value={record.parto?.semanasGesta} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Hora de Inicio de Contracciones" value={record.parto?.horaContracciones} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Frecuencia de Contracciones (minutos)" value={record.parto?.frecuenciaContracciones} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Duración de Contracciones (segundos)" value={record.parto?.duracionContracciones} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Hora de Nacimiento" value={record.parto?.horaNacimiento} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Producto" value={record.parto?.producto} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Sexo del Producto" value={record.parto?.sexoProducto} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Apgar" value={record.parto?.apgar} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Causa Traumática - Solo mostrar si el motivo es traumatismo */}
          {record.datosServicio?.motivoAtencion === 'traumatismo' && record.causaTraumatica && Object.keys(record.causaTraumatica).length > 0 && (
            <Card sx={{ mb: { xs: 2, sm: 3 }, boxShadow: { xs: 1, sm: 2 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, mb: { xs: 1.5, sm: 2 } }}>
                  Causa Traumática
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
                      Agentes
                    </Typography>
                    {record.causaTraumatica.agentes?.map((agente: string, idx: number) => (
                      <CheckboxItem key={idx} checked label={agente} />
                    ))}
                  </Grid>
                  {record.causaTraumatica.especificar && (
                    <Grid item xs={12}>
                      <FieldItem label="Especificación" value={record.causaTraumatica.especificar} />
                    </Grid>
                  )}
                  {record.causaTraumatica.accidenteAutomovilistico === 'si' && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                          Detalles del Accidente Automovilístico
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FieldItem label="Tipo de Accidente" value={record.causaTraumatica.tipoAccidente} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FieldItem label="Contra Objeto Fijo" value={record.causaTraumatica.contraObjetoFijo} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FieldItem label="Impacto" value={record.causaTraumatica.impacto} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FieldItem label="Parabrisas" value={record.causaTraumatica.parabrisas} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FieldItem label="Volante" value={record.causaTraumatica.volante} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FieldItem label="Bolsa de Aire" value={record.causaTraumatica.bolsaAire} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FieldItem label="Cinturón de Seguridad" value={record.causaTraumatica.cinturon} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FieldItem label="Víctima" value={record.causaTraumatica.victima} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FieldItem label="Atropellado" value={record.causaTraumatica.atropellado} />
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Causa Clínica - Solo mostrar si el motivo es enfermedad */}
          {record.datosServicio?.motivoAtencion === 'enfermedad' && record.causaClinica && Object.keys(record.causaClinica).length > 0 && (
            <Card sx={{ mb: { xs: 2, sm: 3 }, boxShadow: { xs: 1, sm: 2 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, mb: { xs: 1.5, sm: 2 } }}>
                  Causa Clínica
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
                      Origen Probable
                    </Typography>
                    {record.causaClinica.origenes?.map((origen: string, idx: number) => (
                      <CheckboxItem key={idx} checked label={origen} />
                    ))}
                  </Grid>
                  {record.causaClinica.especificar && (
                    <Grid item xs={12}>
                      <FieldItem label="Especificación" value={record.causaClinica.especificar} />
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Tipo de Servicio" value={record.causaClinica.tipoServicio} />
                  </Grid>
                  {record.causaClinica.fechaAnterior && (
                    <Grid item xs={12} md={6}>
                      <FieldItem label="Fecha Anterior" value={record.causaClinica.fechaAnterior} />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Evaluación Inicial */}
          {record.evaluacionInicial && Object.keys(record.evaluacionInicial).length > 0 && (
            <Card sx={{ mb: { xs: 2, sm: 3 }, boxShadow: { xs: 1, sm: 2 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, mb: { xs: 1.5, sm: 2 } }}>
                  Evaluación Inicial
                </Typography>
                <Grid container spacing={{ xs: 2, sm: 2 }}>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Nivel de Conciencia" value={record.evaluacionInicial?.nivelConsciencia} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Vía Aérea" value={record.evaluacionInicial?.viaAerea} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Ventilación" value={record.evaluacionInicial?.ventilacion} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Circulación" value={record.evaluacionInicial?.circulacion} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Tratamiento */}
          {record.tratamiento && Object.keys(record.tratamiento).length > 0 && (
            <Card sx={{ mb: { xs: 2, sm: 3 }, boxShadow: { xs: 1, sm: 2 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, mb: { xs: 1.5, sm: 2 } }}>
                  Tratamiento
                </Typography>
                <Grid container spacing={3}>
                  {/* Vía Aérea */}
                  {record.tratamiento.viaAerea && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
                        Vía Aérea
                      </Typography>
                      <CheckboxItem checked={!!record.tratamiento.viaAerea.aspiracion} label="Aspiración" />
                      <CheckboxItem checked={!!record.tratamiento.viaAerea.canulaOrofaringea} label="Cánula Orofaríngea" />
                      <CheckboxItem checked={!!record.tratamiento.viaAerea.canulaNasofaringea} label="Cánula Nasofaríngea" />
                      <CheckboxItem checked={!!record.tratamiento.viaAerea.intubacionOrotraqueal} label="Intubación Orotraqueal" />
                      <CheckboxItem checked={!!record.tratamiento.viaAerea.mascarillaLaringea} label="Mascarilla Laríngea" />
                    </Grid>
                  )}

                  {/* Control Cervical */}
                  {record.tratamiento.controlCervical && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
                        Control Cervical
                      </Typography>
                      <CheckboxItem checked={!!record.tratamiento.controlCervical.collarinRigido} label="Collarín Rígido" />
                      <CheckboxItem checked={!!record.tratamiento.controlCervical.collarinBlando} label="Collarín Blando" />
                    </Grid>
                  )}

                  {/* Asistencia Ventilatoria */}
                  {record.tratamiento.asistenciaVentilatoria && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
                        Asistencia Ventilatoria
                      </Typography>
                      <CheckboxItem checked={!!record.tratamiento.asistenciaVentilatoria.puntas} label="Puntas" />
                      <CheckboxItem checked={!!record.tratamiento.asistenciaVentilatoria.mascarillaSimple} label="Mascarilla Simple" />
                      <CheckboxItem checked={!!record.tratamiento.asistenciaVentilatoria.mascarillaReservorio} label="Mascarilla con Reservorio" />
                      <CheckboxItem checked={!!record.tratamiento.asistenciaVentilatoria.bvm} label="BVM" />
                      <CheckboxItem checked={!!record.tratamiento.asistenciaVentilatoria.valvulaDemanda} label="Válvula de Demanda" />
                      <CheckboxItem checked={!!record.tratamiento.asistenciaVentilatoria.ventiladorAutomatico} label="Ventilador Automático" />
                    </Grid>
                  )}

                  {/* Control de Hemorragias */}
                  {record.tratamiento.controlHemorragias && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
                        Control de Hemorragias
                      </Typography>
                      <CheckboxItem checked={!!record.tratamiento.controlHemorragias.presionDirecta} label="Presión Directa" />
                      <CheckboxItem checked={!!record.tratamiento.controlHemorragias.presionIndirecta} label="Presión Indirecta" />
                      <CheckboxItem checked={!!record.tratamiento.controlHemorragias.torniquete} label="Torniquete" />
                      <CheckboxItem checked={!!record.tratamiento.controlHemorragias.vendajeCompresivo} label="Vendaje Compresivo" />
                    </Grid>
                  )}

                  {/* Vía Venosa */}
                  {record.tratamiento.viaVenosa && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
                        Vía Venosa
                      </Typography>
                      <CheckboxItem checked={!!record.tratamiento.viaVenosa.perifericaBrazo} label="Periférica Brazo" />
                      <CheckboxItem checked={!!record.tratamiento.viaVenosa.perifericaPierna} label="Periférica Pierna" />
                      <CheckboxItem checked={!!record.tratamiento.viaVenosa.viaOsea} label="Vía Ósea" />
                    </Grid>
                  )}

                  {/* Maniobras de Reanimación */}
                  {record.tratamiento.maniobrasReanimacion && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
                        Maniobras de Reanimación
                      </Typography>
                      <CheckboxItem checked={!!record.tratamiento.maniobrasReanimacion.rcp} label="RCP" />
                      <CheckboxItem checked={!!record.tratamiento.maniobrasReanimacion.dea} label="DEA" />
                      <CheckboxItem checked={!!record.tratamiento.maniobrasReanimacion.cardioversion} label="Cardioversión" />
                      <CheckboxItem checked={!!record.tratamiento.maniobrasReanimacion.desfibrilacion} label="Desfibrilación" />
                      <CheckboxItem checked={!!record.tratamiento.maniobrasReanimacion.marcapasoExterno} label="Marcapaso Externo" />
                    </Grid>
                  )}

                  {/* Otro */}
                  {record.tratamiento.otro && (
                    <Grid item xs={12}>
                      <FieldItem label="Otro Tratamiento" value={record.tratamiento.otro} />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Datos Legales */}
          {record.datosLegales && Object.keys(record.datosLegales).length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Datos Legales
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Autoridad que tomó conocimiento" value={record.datosLegales?.autoridadConocimiento} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldItem label="Número de los Oficiales" value={record.datosLegales?.numeroOficiales} />
                  </Grid>
                  {record.datosLegales?.vehiculosInvolucrados && record.datosLegales.vehiculosInvolucrados.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
                        Vehículos Involucrados
                      </Typography>
                      {record.datosLegales.vehiculosInvolucrados.map((vehiculo: any, idx: number) => (
                        <Box key={idx} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            Vehículo {idx + 1}
                          </Typography>
                          <FieldItem label="Tipo de Vehículo" value={vehiculo.tipoVehiculo} />
                          <FieldItem label="Marca" value={vehiculo.marca} />
                          <FieldItem label="Modelo" value={vehiculo.modelo} />
                          <FieldItem label="Año" value={vehiculo.anio} />
                          <FieldItem label="Color" value={vehiculo.color} />
                          <FieldItem label="Placas" value={vehiculo.placas} />
                          <FieldItem label="Estado de Placas" value={vehiculo.estadoPlacas} />
                        </Box>
                      ))}
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}
    </Box>
  );
};

export const ReportesShow = () => (
  <Show>
    <SimpleShowLayout>
      <ReportesShowContent />
    </SimpleShowLayout>
  </Show>
);

export const ReportesEdit = () => {
  // Función recursiva para eliminar todos los campos _id e id de un objeto
  const removeIds = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => removeIds(item));
    }

    if (typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        // Saltar los campos _id e id
        if (key === '_id' || key === 'id') {
          continue;
        }
        newObj[key] = removeIds(obj[key]);
      }
      return newObj;
    }

    return obj;
  };

  const transform = (data: any) => {
    const motivoAtencion = data?.datosServicio?.motivoAtencion;

    // Crear una copia del objeto excluyendo las secciones no relevantes
    const { causaTraumatica, causaClinica, parto, ...baseData } = data;

    let transformedData;

    // Limpiar datos de secciones no relevantes según el motivo de atención
    if (motivoAtencion === 'traumatismo') {
      // Si es traumatismo, solo incluir causa traumática y eliminar explícitamente las otras
      transformedData = {
        ...baseData,
        causaTraumatica: causaTraumatica || {},
        causaClinica: undefined,
        parto: undefined
      };
    } else if (motivoAtencion === 'enfermedad') {
      // Si es enfermedad, solo incluir causa clínica y eliminar explícitamente las otras
      transformedData = {
        ...baseData,
        causaClinica: causaClinica || {},
        causaTraumatica: undefined,
        parto: undefined
      };
    } else if (motivoAtencion === 'ginecoobstetrico') {
      // Si es ginecoobstétrico, solo incluir parto y eliminar explícitamente las otras
      transformedData = {
        ...baseData,
        parto: parto || {},
        causaTraumatica: undefined,
        causaClinica: undefined
      };
    } else {
      // Si no hay motivo de atención, devolver todo
      transformedData = data;
    }

    // Eliminar todos los campos _id e id (incluyendo los anidados)
    return removeIds(transformedData);
  };

  return (
    <Edit
      transform={transform}
      mutationMode="pessimistic"
      mutationOptions={{
        meta: { method: 'PUT' }
      }}
    >
      <SimpleForm>
      <Box sx={{
        width: '100%',
        '& .MuiFormControl-root': {
          marginTop: 0,
          marginBottom: 0,
        },
        '& .RaLabeled-label': {
          marginTop: 0,
        }
      }}>
        <Typography variant="h6" gutterBottom>
          Editar Reporte
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Datos del Servicio */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
          Datos del Servicio
        </Typography>

        <Typography variant="body2" sx={{ mt: 2, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Cronometría del Servicio
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <TextInput source="datosServicio.horaLlamada" label="Hora de Llamada" type="time" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextInput source="datosServicio.horaTraslado" label="Hora de Traslado" type="time" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextInput source="datosServicio.horaSalida" label="Hora de Salida" type="time" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextInput source="datosServicio.horaHospital" label="Hora Hospital" type="time" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextInput source="datosServicio.horaLlegada" label="Hora de Llegada" type="time" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextInput source="datosServicio.horaSalidaHospital" label="Hora Salida Hospital" type="time" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextInput source="datosServicio.horaBase" label="Hora Base" type="time" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Información del Servicio
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <TextInput source="datosServicio.numeroAmbulancia" label="Número de Ambulancia" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <SelectInput
              source="datosServicio.motivoAtencion"
              label="Motivo de Atención"
              choices={[
                { id: 'enfermedad', name: 'Enfermedad' },
                { id: 'traumatismo', name: 'Traumatismo' },
                { id: 'ginecoobstetrico', name: 'Ginecoobstétrico' },
              ]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Lugar de Ocurrencia
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12}>
            <SelectInput
              source="datosServicio.lugarOcurrencia"
              label="Lugar de Ocurrencia"
              choices={[
                { id: 'transporte-publico', name: 'Transporte Público' },
                { id: 'escuela', name: 'Escuela' },
                { id: 'trabajo', name: 'Trabajo' },
                { id: 'hogar', name: 'Hogar' },
                { id: 'recreacion-deporte', name: 'Recreación y Deporte' },
                { id: 'via-publica', name: 'Vía Pública' },
                { id: 'otra', name: 'Otra' },
              ]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <FormDataConsumer>
            {({ formData }) =>
              formData?.datosServicio?.lugarOcurrencia === 'otra' && (
                <Grid item xs={12}>
                  <TextInput source="datosServicio.lugarOcurrenciaOtra" label="Especifique el lugar de ocurrencia" fullWidth />
                </Grid>
              )
            }
          </FormDataConsumer>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Dirección
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12}>
            <TextInput source="datosServicio.calle" label="Calle" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextInput source="datosServicio.entreCalles" label="Entre Calles" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput source="datosServicio.colonia" label="Colonia" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput source="datosServicio.alcaldia" label="Alcaldía" fullWidth />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Personal de Atención
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <TextInput source="datosServicio.operador" label="Operador" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextInput source="datosServicio.tum" label="TUM" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextInput source="datosServicio.socorrista" label="Socorrista" fullWidth />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Datos del Paciente */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
          Datos del Paciente
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <TextInput source="datosPaciente.nombre" label="Nombre" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectInput
              source="datosPaciente.sexo"
              label="Sexo"
              choices={[
                { id: 'masculino', name: 'Masculino' },
                { id: 'femenino', name: 'Femenino' },
              ]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <NumberInput source="datosPaciente.edadAnios" label="Edad (años)" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <NumberInput source="datosPaciente.edadMeses" label="Edad (meses)" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextInput source="datosPaciente.ocupacion" label="Ocupación" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput source="datosPaciente.telefono" label="Teléfono" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput source="datosPaciente.derechohabiente" label="Derechohabiente" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextInput source="datosPaciente.domicilio" label="Domicilio" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput source="datosPaciente.colonia" label="Colonia" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput source="datosPaciente.alcaldia" label="Alcaldía" fullWidth />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <FormDataConsumer>
          {({ formData }) => {
            const motivoAtencion = formData?.datosServicio?.motivoAtencion;

            return (
              <>
                {/* Mostrar Causa Traumática solo si el motivo es traumatismo */}
                {motivoAtencion === 'traumatismo' && (
                  <>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                      Causa Traumática
                    </Typography>
                    <Grid container spacing={2} alignItems="flex-start">
                      <Grid item xs={12}>
                        <CheckboxGroupInput
                          source="causaTraumatica.agentes"
                          label="Agente Causal"
                          choices={[
                            'Arma', 'Juguete', 'Explosión', 'Fuego', 'Animal', 'Bicicleta',
                            'Automotor', 'Maquinaria', 'Herramienta', 'Electricidad',
                            'Sustancia Caliente', 'Sustancia Tóxica', 'Producto Biológico', 'Ser Humano', 'Otro'
                          ]}
                          otroFieldSource="causaTraumatica.especificar"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SelectInput
                          source="causaTraumatica.accidenteAutomovilistico"
                          label="Accidente Automovilístico"
                          choices={[
                            { id: 'si', name: 'Sí' },
                            { id: 'no', name: 'No' },
                          ]}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>

                    <FormDataConsumer>
                      {({ formData }) =>
                        formData?.causaTraumatica?.accidenteAutomovilistico === 'si' && (
                          <>
                            <Typography variant="body2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                              Detalles del Accidente Automovilístico
                            </Typography>
                            <Grid container spacing={2} alignItems="flex-start">
                              <Grid item xs={12} md={6}>
                                <SelectInput
                                  source="causaTraumatica.tipoAccidente"
                                  label="Tipo de Accidente"
                                  choices={[
                                    { id: 'colision', name: 'Colisión' },
                                    { id: 'volcadura', name: 'Volcadura' },
                                    { id: 'automotor', name: 'Automotor' },
                                    { id: 'bicicleta', name: 'Bicicleta' },
                                    { id: 'motocicleta', name: 'Motocicleta' },
                                    { id: 'maquinaria', name: 'Maquinaria' },
                                  ]}
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <SelectInput
                                  source="causaTraumatica.contraObjetoFijo"
                                  label="Contra Objeto Fijo"
                                  choices={[
                                    { id: 'si', name: 'Sí' },
                                    { id: 'no', name: 'No' },
                                  ]}
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <SelectInput
                                  source="causaTraumatica.impacto"
                                  label="Impacto"
                                  choices={[
                                    { id: 'posterior', name: 'Posterior' },
                                    { id: 'rotacional', name: 'Rotacional' },
                                    { id: 'frontal', name: 'Frontal' },
                                    { id: 'lateral', name: 'Lateral' },
                                  ]}
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <SelectInput
                                  source="causaTraumatica.parabrisas"
                                  label="Parabrisas"
                                  choices={[
                                    { id: 'integro', name: 'Íntegro' },
                                    { id: 'estrellado', name: 'Estrellado' },
                                  ]}
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <SelectInput
                                  source="causaTraumatica.volante"
                                  label="Volante"
                                  choices={[
                                    { id: 'integro', name: 'Íntegro' },
                                    { id: 'doblado', name: 'Doblado' },
                                  ]}
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <SelectInput
                                  source="causaTraumatica.bolsaAire"
                                  label="Bolsa de Aire"
                                  choices={[
                                    { id: 'si', name: 'Sí' },
                                    { id: 'no', name: 'No' },
                                  ]}
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <SelectInput
                                  source="causaTraumatica.cinturon"
                                  label="Cinturón de Seguridad"
                                  choices={[
                                    { id: 'colocado', name: 'Colocado' },
                                    { id: 'no-colocado', name: 'No Colocado' },
                                  ]}
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <SelectInput
                                  source="causaTraumatica.victima"
                                  label="Víctima"
                                  choices={[
                                    { id: 'dentro-vehiculo', name: 'Dentro del vehículo' },
                                    { id: 'eyectado', name: 'Eyectado' },
                                  ]}
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <SelectInput
                                  source="causaTraumatica.atropellado"
                                  label="Atropellado"
                                  choices={[
                                    { id: 'automotor', name: 'Automotor' },
                                    { id: 'moto', name: 'Moto' },
                                    { id: 'bici', name: 'Bici' },
                                    { id: 'maquinaria', name: 'Maquinaria' },
                                  ]}
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                            </Grid>
                          </>
                        )
                      }
                    </FormDataConsumer>

                    <Grid container spacing={2} alignItems="flex-start">
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Mostrar Causa Clínica solo si el motivo es enfermedad */}
                {motivoAtencion === 'enfermedad' && (
                  <>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                      Causa Clínica
                    </Typography>
                    <Grid container spacing={2} alignItems="flex-start">
                      <Grid item xs={12}>
                        <CheckboxGroupInput
                          source="causaClinica.origenes"
                          label="Origen Probable"
                          choices={[
                            'Neurológica', 'Infecciosa', 'Musculo Esquelético', 'Urogenital',
                            'Digestiva', 'Cardiovascular', 'Oncológico', 'Metabólico',
                            'Ginecoobstétrica', 'Respiratorio', 'Cognitivo', 'Emocional', 'Otro'
                          ]}
                          otroFieldSource="causaClinica.especificar"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SelectInput
                          source="causaClinica.tipoServicio"
                          label="Tipo de Servicio"
                          choices={[
                            { id: 'primera-vez', name: 'Primera Vez' },
                            { id: 'subsecuente', name: 'Subsecuente' },
                          ]}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DateTimeInput source="causaClinica.fechaAnterior" label="Fecha Anterior" fullWidth />
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Mostrar Datos de Parto solo si el motivo es ginecoobstetrico */}
                {motivoAtencion === 'ginecoobstetrico' && (
                  <>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                      Datos de Parto
                    </Typography>
                    <Grid container spacing={2} alignItems="flex-start">
                      <Grid item xs={12} md={6}>
                        <NumberInput source="parto.semanasGesta" label="Semanas de Gestación" fullWidth />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextInput source="parto.horaContracciones" label="Hora de Inicio de Contracciones" type="time" fullWidth InputLabelProps={{ shrink: true }} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextInput source="parto.frecuenciaContracciones" label="Frecuencia de Contracciones (minutos)" fullWidth />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextInput source="parto.duracionContracciones" label="Duración de Contracciones (segundos)" fullWidth />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextInput source="parto.horaNacimiento" label="Hora de Nacimiento" type="time" fullWidth InputLabelProps={{ shrink: true }} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SelectInput
                          source="parto.producto"
                          label="Producto"
                          choices={[
                            { id: 'vivo', name: 'Vivo' },
                            { id: 'muerto', name: 'Muerto' },
                          ]}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SelectInput
                          source="parto.sexoProducto"
                          label="Sexo del Producto"
                          choices={[
                            { id: 'masculino', name: 'Masculino' },
                            { id: 'femenino', name: 'Femenino' },
                          ]}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextInput source="parto.apgar" label="Apgar" fullWidth />
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}
              </>
            );
          }}
        </FormDataConsumer>

        {/* Evaluación Inicial */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
          Evaluación Inicial
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <SelectInput
              source="evaluacionInicial.nivelConsciencia"
              label="Nivel de Conciencia"
              choices={[
                { id: 'alerta', name: 'Alerta' },
                { id: 'verbal', name: 'Verbal' },
                { id: 'dolor', name: 'Dolor' },
                { id: 'inconsciente', name: 'Inconsciente' },
              ]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectInput
              source="evaluacionInicial.deglucion"
              label="Deglución"
              choices={[
                { id: 'ausente', name: 'Ausente' },
                { id: 'presente', name: 'Presente' },
              ]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectInput
              source="evaluacionInicial.viaAerea"
              label="Vía Aérea"
              choices={[
                { id: 'permeable', name: 'Permeable' },
                { id: 'comprometida', name: 'Comprometida' },
              ]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectInput
              source="evaluacionInicial.ventilacion"
              label="Ventilación"
              choices={[
                { id: 'regular', name: 'Regular' },
                { id: 'irregular', name: 'Irregular' },
                { id: 'apnea', name: 'Apnea' },
                { id: 'rapida', name: 'Rápida' },
                { id: 'superficial', name: 'Superficial' },
              ]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectInput
              source="evaluacionInicial.auscultacion"
              label="Auscultación"
              choices={[
                { id: 'normal', name: 'Normal' },
                { id: 'disminuidos', name: 'Disminuidos' },
                { id: 'ausentes', name: 'Ausentes' },
              ]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectInput
              source="evaluacionInicial.pulsos"
              label="Pulsos"
              choices={[
                { id: 'carotideo', name: 'Carotídeo' },
                { id: 'radial', name: 'Radial' },
                { id: 'paro', name: 'Paro cardiorrespiratorio' },
              ]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectInput
              source="evaluacionInicial.calidad"
              label="Calidad"
              choices={[
                { id: 'rapido', name: 'Rápido' },
                { id: 'lento', name: 'Lento' },
                { id: 'ritmico', name: 'Rítmico' },
                { id: 'arritmico', name: 'Arrítmico' },
              ]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectInput
              source="evaluacionInicial.piel"
              label="Piel"
              choices={[
                { id: 'normal', name: 'Normal' },
                { id: 'palida', name: 'Pálida' },
                { id: 'cianotica', name: 'Cianótica' },
              ]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <SelectInput
              source="evaluacionInicial.caracteristicas"
              label="Características"
              choices={[
                { id: 'caliente', name: 'Caliente' },
                { id: 'fria', name: 'Fría' },
                { id: 'diaforetica', name: 'Diaforética' },
                { id: 'normotermico', name: 'Normotérmico' },
              ]}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Traslado */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
          Datos de Traslado
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <TextInput source="traslado.hospital" label="Hospital" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput source="traslado.doctor" label="Doctor" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextInput source="traslado.folioCRU" label="Folio CRU" fullWidth />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Tratamiento */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
          Tratamiento
        </Typography>

        <Typography variant="body2" sx={{ mt: 2, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Vía Aérea
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.viaAerea.aspiracion" label="Aspiración" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.viaAerea.canulaOrofaringea" label="Cánula Orofaríngea" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.viaAerea.canulaNasofaringea" label="Cánula Nasofaríngea" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.viaAerea.intubacionOrotraqueal" label="Intubación Orotraqueal" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.viaAerea.mascarillaLaringea" label="Mascarilla Laríngea" />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Control Cervical
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.controlCervical.collarinRigido" label="Collarín Rígido" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.controlCervical.collarinBlando" label="Collarín Blando" />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Asistencia Ventilatoria
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.asistenciaVentilatoria.puntas" label="Puntas" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.asistenciaVentilatoria.mascarillaSimple" label="Mascarilla Simple" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.asistenciaVentilatoria.mascarillaReservorio" label="Mascarilla con Reservorio" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.asistenciaVentilatoria.bvm" label="BVM" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.asistenciaVentilatoria.valvulaDemanda" label="Válvula de Demanda" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.asistenciaVentilatoria.ventiladorAutomatico" label="Ventilador Automático" />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Control de Hemorragias
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.controlHemorragias.presionDirecta" label="Presión Directa" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.controlHemorragias.presionIndirecta" label="Presión Indirecta" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.controlHemorragias.torniquete" label="Torniquete" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.controlHemorragias.vendajeCompresivo" label="Vendaje Compresivo" />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Vía Venosa
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.viaVenosa.perifericaBrazo" label="Periférica Brazo" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.viaVenosa.perifericaPierna" label="Periférica Pierna" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.viaVenosa.viaOsea" label="Vía Ósea" />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Maniobras de Reanimación
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.maniobrasReanimacion.rcp" label="RCP" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.maniobrasReanimacion.dea" label="DEA" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.maniobrasReanimacion.cardioversion" label="Cardioversión" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.maniobrasReanimacion.desfibrilacion" label="Desfibrilación" />
          </Grid>
          <Grid item xs={12} md={6}>
            <BooleanInput source="tratamiento.maniobrasReanimacion.marcapasoExterno" label="Marcapaso Externo" />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Pertenencias
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12}>
            <TextInput source="tratamiento.pertenencias" label="Pertenencias" fullWidth multiline />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Datos Legales */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
          Datos Legales
        </Typography>

        <Typography variant="body2" sx={{ mt: 2, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Información General
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <TextInput source="datosLegales.dependencia" label="Dependencia" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput source="datosLegales.numeroUnidad" label="Número de Unidad" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextInput source="datosLegales.numeroOficiales" label="Número de los Oficiales" fullWidth />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2.5, mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Vehículos Involucrados
        </Typography>
        <ArrayInput source="datosLegales.vehiculosInvolucrados" label="">
          <SimpleFormIterator
            inline
            sx={{
              '& .RaSimpleFormIterator-line': {
                borderBottom: 'none',
              },
              '& .RaSimpleFormIterator-form': {
                borderBottom: 'none',
              }
            }}
          >
            <TextInput source="tipoMarca" label="Tipo/Marca" sx={{ width: '50%' }} />
            <TextInput source="placas" label="Placas" sx={{ width: '50%' }} />
          </SimpleFormIterator>
        </ArrayInput>

      </Box>
    </SimpleForm>
  </Edit>
  );
};
