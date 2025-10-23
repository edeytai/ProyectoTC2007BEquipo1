import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  ArrayField,
  SingleFieldList,
  ChipField,
  useTranslate,
  usePermissions,
  useRecordContext,
  EditButton,
  TopToolbar,
  DeleteButton,
} from 'react-admin';
import { Box, Typography, Card, CardContent, Chip, Grid } from '@mui/material';
import {
  Warning as WarningIcon,
} from '@mui/icons-material';
import { StateTransitionButtons } from '../components/StateTransitionButtons';

const ShowActions = () => {
  const record = useRecordContext();
  const { permissions } = usePermissions();
  const identityStr = sessionStorage.getItem('identity');
  const user = identityStr ? JSON.parse(identityStr) : null;

  const canEdit = permissions === 'admin' ||
    (permissions === 'coordinador' && record?.estadoReporte !== 'cerrado') ||
    (permissions === 'brigadista' && record?.estadoReporte === 'draft' && record?.createdBy === user?.username);

  return (
    <TopToolbar>
      {canEdit && <EditButton />}
      {permissions === 'admin' && <DeleteButton />}
    </TopToolbar>
  );
};


const GravedadField = ({ source }: any) => {
  const record = useRecordContext();
  const translate = useTranslate();

  if (!record?.[source]) return null;

  const colorMap: Record<string, 'error' | 'warning' | 'success'> = {
    alta: 'error',
    media: 'warning',
    baja: 'success',
  };

  return (
    <Chip
      label={translate(`incidents.fields.nivelGravedad.${record[source]}`)}
      color={colorMap[record[source]] || 'success'}
      icon={record[source] === 'alta' ? <WarningIcon /> : undefined}
    />
  );
};

export const IncidentShow = () => {
  const translate = useTranslate();

  return (
    <Show actions={<ShowActions />}>
      <SimpleShowLayout>
        <StateTransitionButtons />

        {/* Alert for high severity */}
        <Box>
          <GravedadField source="nivelGravedad" />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {translate('incidents.sections.operational')}
                </Typography>
                <TextField source="solicitudMitigacion" />
                <DateField source="fecha" />
                <TextField source="hora" />
                <TextField source="turno" />
                <TextField source="modoActivacion" />
                <TextField source="personalACargo" />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {translate('incidents.sections.attention')}
                </Typography>
                <TextField source="horaAtencion" />
                <NumberField source="tiempoTrasladoMin" />
                <NumberField source="kmsRecorridos" />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {translate('incidents.sections.location')}
                </Typography>
                <TextField source="ubicacion.calle" />
                <TextField source="ubicacion.colonia" />
                <TextField source="ubicacion.referencias" />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Coordenadas: {translate('incidents.fields.ubicacion.lat')}: <NumberField source="ubicacion.lat" /> | {translate('incidents.fields.ubicacion.lng')}: <NumberField source="ubicacion.lng" />
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {translate('incidents.sections.classification')}
                </Typography>
                <TextField source="tipoEmergencia" />
                <Box sx={{ mt: 1 }}>
                  <TextField source="estadoReporte" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {translate('incidents.sections.results')}
                </Typography>
                <ArrayField source="trabajosRealizados">
                  <SingleFieldList>
                    <ChipField source="." />
                  </SingleFieldList>
                </ArrayField>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {translate('incidents.fields.observaciones')}
                </Typography>
                <TextField source="observaciones" />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {translate('incidents.fields.conclusionDictamen')}
                </Typography>
                <TextField source="conclusionDictamen" />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {translate('incidents.sections.participants')}
                </Typography>

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  {translate('incidents.fields.dependencias')}
                </Typography>
                <ArrayField source="dependencias">
                  <SingleFieldList>
                    <ChipField source="." />
                  </SingleFieldList>
                </ArrayField>

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  {translate('incidents.fields.autoridadesIntervinientes')}
                </Typography>
                <ArrayField source="autoridadesIntervinientes">
                  <SingleFieldList>
                    <ChipField source="." />
                  </SingleFieldList>
                </ArrayField>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                    {translate('incidents.fields.responsableInmueble')}
                  </Typography>
                  <TextField source="responsableInmueble" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </SimpleShowLayout>
    </Show>
  );
};