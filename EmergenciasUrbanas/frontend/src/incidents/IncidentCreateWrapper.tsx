import {
  Create,
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
  useLocaleState,
} from 'react-admin';
import { Box, Typography } from '@mui/material';
import { MapSelector } from '../components/MapSelector';
import { useState } from 'react';

const validateKms = [required(), minValue(0), maxValue(1000)];
const validateTiempo = [required(), minValue(0), maxValue(480)];

export const IncidentCreate = () => {
  const translate = useTranslate();
  const [locale] = useLocaleState();
  const [mapLocation, setMapLocation] = useState<any>(null);

  // Funcion auxiliar para obtener etiquetas traducidas
  const getLabel = (key: string) => {
    const esLabels: any = {
      'solicitudMitigacion': 'Solicitud de mitigación',
      'fecha': 'Fecha',
      'hora': 'Hora',
      'turno': 'Turno',
      'modoActivacion': 'Modo de activación',
      'personalACargo': 'Personal a cargo',
      'horaAtencion': 'Hora de atención',
      'tiempoTrasladoMin': 'Tiempo de traslado (min)',
      'kmsRecorridos': 'Kilómetros recorridos',
      'ubicacion.lat': 'Latitud',
      'ubicacion.lng': 'Longitud',
      'ubicacion.calle': 'Calle',
      'ubicacion.colonia': 'Colonia',
      'ubicacion.referencias': 'Referencias',
      'tipoEmergencia': 'Tipo de emergencia',
      'nivelGravedad': 'Nivel de gravedad',
      'trabajosRealizados': 'Trabajos realizados',
      'trabajo': 'Trabajo',
      'observaciones': 'Observaciones',
      'conclusionDictamen': 'Conclusión o dictamen',
      'dependencias': 'Dependencias',
      'dependencia': 'Dependencia',
      'autoridadesIntervinientes': 'Autoridades intervinientes',
      'autoridad': 'Autoridad',
      'responsableInmueble': 'Responsable del inmueble'
    };

    const enLabels: any = {
      'solicitudMitigacion': 'Mitigation request',
      'fecha': 'Date',
      'hora': 'Time',
      'turno': 'Shift',
      'modoActivacion': 'Activation mode',
      'personalACargo': 'Personnel in charge',
      'horaAtencion': 'Attention time',
      'tiempoTrasladoMin': 'Transfer time (min)',
      'kmsRecorridos': 'Kilometers traveled',
      'ubicacion.lat': 'Latitude',
      'ubicacion.lng': 'Longitude',
      'ubicacion.calle': 'Street',
      'ubicacion.colonia': 'Neighborhood',
      'ubicacion.referencias': 'References',
      'tipoEmergencia': 'Emergency type',
      'nivelGravedad': 'Severity level',
      'trabajosRealizados': 'Work performed',
      'trabajo': 'Work',
      'observaciones': 'Observations',
      'conclusionDictamen': 'Conclusion or opinion',
      'dependencias': 'Dependencies',
      'dependencia': 'Dependency',
      'autoridadesIntervinientes': 'Intervening authorities',
      'autoridad': 'Authority',
      'responsableInmueble': 'Property manager'
    };

    return locale === 'en' ? enLabels[key] || key : esLabels[key] || key;
  };

  const getSection = (key: string) => {
    const sections: any = {
      es: {
        operational: 'Datos operativos',
        attention: 'Atención de la emergencia',
        location: 'Ubicación',
        classification: 'Clasificación de la emergencia',
        results: 'Resultados del servicio',
        participants: 'Participantes'
      },
      en: {
        operational: 'Operational data',
        attention: 'Emergency attention',
        location: 'Location',
        classification: 'Emergency classification',
        results: 'Service results',
        participants: 'Participants'
      }
    };
    return sections[locale]?.[key] || sections['es']?.[key] || key;
  };

  const getChoices = (field: string) => {

    if (field === 'turno') {
      return locale === 'en' ? [
        { id: 'matutino', name: 'Morning' },
        { id: 'vespertino', name: 'Evening' },
        { id: 'nocturno', name: 'Night' }
      ] : [
        { id: 'matutino', name: 'Matutino' },
        { id: 'vespertino', name: 'Vespertino' },
        { id: 'nocturno', name: 'Nocturno' }
      ];
    }

    if (field === 'modoActivacion') {
      return locale === 'en' ? [
        { id: 'llamada', name: 'Call' },
        { id: 'oficio', name: 'Official' }
      ] : [
        { id: 'llamada', name: 'Llamada' },
        { id: 'oficio', name: 'Oficio' }
      ];
    }

    if (field === 'tipoEmergencia') {
      return locale === 'en' ? [
        { id: 'inundacion', name: 'Flood' },
        { id: 'incendio', name: 'Fire' },
        { id: 'socavon', name: 'Sinkhole' },
        { id: 'deslave', name: 'Landslide' },
        { id: 'sismo', name: 'Earthquake' },
        { id: 'fuga', name: 'Leak' },
        { id: 'otro', name: 'Other' }
      ] : [
        { id: 'inundacion', name: 'Inundación' },
        { id: 'incendio', name: 'Incendio' },
        { id: 'socavon', name: 'Socavón' },
        { id: 'deslave', name: 'Deslave' },
        { id: 'sismo', name: 'Sismo' },
        { id: 'fuga', name: 'Fuga' },
        { id: 'otro', name: 'Otro' }
      ];
    }

    if (field === 'nivelGravedad') {
      return locale === 'en' ? [
        { id: 'baja', name: 'Low' },
        { id: 'media', name: 'Medium' },
        { id: 'alta', name: 'High' }
      ] : [
        { id: 'baja', name: 'Baja' },
        { id: 'media', name: 'Media' },
        { id: 'alta', name: 'Alta' }
      ];
    }

    return [];
  };

  return (
    <Create redirect="show">
      <SimpleForm>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          {getSection('operational')}
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <TextInput
            source="solicitudMitigacion"
            label={getLabel('solicitudMitigacion')}
            validate={required()}
            fullWidth
          />
          <DateInput
            source="fecha"
            label={getLabel('fecha')}
            validate={required()}
            fullWidth
          />
          <TimeInput
            source="hora"
            label={getLabel('hora')}
            validate={required()}
            fullWidth
          />
        </Box>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <SelectInput
            source="turno"
            label={getLabel('turno')}
            choices={getChoices('turno')}
            validate={required()}
            fullWidth
          />
          <SelectInput
            source="modoActivacion"
            label={getLabel('modoActivacion')}
            choices={getChoices('modoActivacion')}
            validate={required()}
            fullWidth
          />
          <TextInput
            source="personalACargo"
            label={getLabel('personalACargo')}
            validate={required()}
            fullWidth
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {getSection('attention')}
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <TimeInput
            source="horaAtencion"
            label={getLabel('horaAtencion')}
            validate={required()}
            fullWidth
          />
          <NumberInput
            source="tiempoTrasladoMin"
            label={getLabel('tiempoTrasladoMin')}
            validate={validateTiempo}
            fullWidth
          />
          <NumberInput
            source="kmsRecorridos"
            label={getLabel('kmsRecorridos')}
            validate={validateKms}
            step={0.1}
            fullWidth
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {getSection('location')}
        </Typography>

        <MapSelector
          value={mapLocation}
          onChange={(location: any) => setMapLocation(location)}
          label={locale === 'en' ? 'Select location on map' : 'Seleccionar ubicación en el mapa'}
        />

        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <NumberInput
            source="ubicacion.lat"
            label={getLabel('ubicacion.lat')}
            validate={required()}
            fullWidth
            value={mapLocation?.lat}
            disabled={!mapLocation}
          />
          <NumberInput
            source="ubicacion.lng"
            label={getLabel('ubicacion.lng')}
            validate={required()}
            fullWidth
            value={mapLocation?.lng}
            disabled={!mapLocation}
          />
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 2 }}>
          <TextInput
            source="ubicacion.calle"
            label={getLabel('ubicacion.calle')}
            validate={required()}
            fullWidth
          />
          <TextInput
            source="ubicacion.colonia"
            label={getLabel('ubicacion.colonia')}
            validate={required()}
            fullWidth
          />
        </Box>
        <TextInput
          source="ubicacion.referencias"
          label={getLabel('ubicacion.referencias')}
          fullWidth
          multiline
        />

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {getSection('classification')}
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <SelectInput
            source="tipoEmergencia"
            label={getLabel('tipoEmergencia')}
            choices={getChoices('tipoEmergencia')}
            validate={required()}
            fullWidth
          />
          <SelectInput
            source="nivelGravedad"
            label={getLabel('nivelGravedad')}
            choices={getChoices('nivelGravedad')}
            validate={required()}
            fullWidth
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {getSection('results')}
        </Typography>
        <ArrayInput source="trabajosRealizados" label={getLabel('trabajosRealizados')}>
          <SimpleFormIterator>
            <TextInput label={getLabel('trabajo')} validate={required()} />
          </SimpleFormIterator>
        </ArrayInput>

        <TextInput
          source="observaciones"
          label={getLabel('observaciones')}
          multiline
          rows={4}
          fullWidth
          validate={required()}
        />

        <TextInput
          source="conclusionDictamen"
          label={getLabel('conclusionDictamen')}
          multiline
          rows={3}
          fullWidth
          validate={required()}
        />

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {getSection('participants')}
        </Typography>
        <ArrayInput source="dependencias" label={getLabel('dependencias')}>
          <SimpleFormIterator>
            <TextInput label={getLabel('dependencia')} />
          </SimpleFormIterator>
        </ArrayInput>

        <ArrayInput source="autoridadesIntervinientes" label={getLabel('autoridadesIntervinientes')}>
          <SimpleFormIterator>
            <TextInput label={getLabel('autoridad')} />
          </SimpleFormIterator>
        </ArrayInput>

        <TextInput
          source="responsableInmueble"
          label={getLabel('responsableInmueble')}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};