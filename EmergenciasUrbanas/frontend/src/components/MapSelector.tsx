import { Box, Typography, Paper, IconButton, CircularProgress, Alert } from '@mui/material';
import { LocationOn, MyLocation, ZoomIn, ZoomOut } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslate } from 'react-admin';

interface Location {
  lat: number;
  lng: number;
  calle?: string;
  colonia?: string;
  ciudad?: string;
  estado?: string;
}

interface MapSelectorProps {
  value?: Location;
  onChange?: (location: Location) => void;
  label?: string;
}

export const MapSelector = ({ value, onChange, label }: MapSelectorProps) => {
  const [zoom, setZoom] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedLocation, setDetectedLocation] = useState<Location | null>(null);
  const translate = useTranslate();

  // Coordenadas por defecto para Cuajimalpa
  const defaultLocation = {
    lat: value?.lat || 19.3597,
    lng: value?.lng || -99.2843
  };

  // Reverse Geocoding usando Nominatim API (OpenStreetMap)
  // Convierte coordenadas lat/lng en direccion legible
  const reverseGeocode = async (lat: number, lng: number): Promise<Location> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=es`,
        {
          headers: {
            'User-Agent': 'EmergenciasUrbanas/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener dirección');
      }

      const data = await response.json();

      // Extraer informacion relevante
      const address = data.address || {};

      const locationData = {
        lat,
        lng,
        calle: address.road || address.pedestrian || address.footway || '',
        colonia: address.neighbourhood || address.suburb || address.quarter || '',
        ciudad: address.city || address.town || address.municipality || 'Ciudad de México',
        estado: address.state || 'Ciudad de México'
      };

      return locationData;
    } catch {
      return {
        lat,
        lng,
        calle: '',
        colonia: '',
        ciudad: 'Ciudad de México',
        estado: 'Ciudad de México'
      };
    }
  };

  // Obtener ubicacion actual del dispositivo usando HTML5 Geolocation API
  const handleGetCurrentLocation = async () => {
    setError(null);
    setLoading(true);

    if (!navigator.geolocation) {
      setError(translate('incidents.location.noSupport'));
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Hacer reverse geocoding para obtener la direccion
          const locationData = await reverseGeocode(latitude, longitude);

          setDetectedLocation(locationData);
          setLoading(false);
        } catch {
          setError(translate('incidents.location.error'));
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError(translate('incidents.location.permissionDenied'));
            break;
          case error.POSITION_UNAVAILABLE:
            setError(translate('incidents.location.unavailable'));
            break;
          case error.TIMEOUT:
            setError(translate('incidents.location.timeout'));
            break;
          default:
            setError(translate('incidents.location.error'));
        }
      },
      options
    );
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {label || translate('incidents.location.title')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {detectedLocation && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setDetectedLocation(null)}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Ubicacion detectada:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2">
              <strong>Coordenadas:</strong> Lat: {detectedLocation.lat.toFixed(6)} | Lng: {detectedLocation.lng.toFixed(6)}
            </Typography>
            {detectedLocation.calle && (
              <Typography variant="body2">
                <strong>Calle:</strong> {detectedLocation.calle}
              </Typography>
            )}
            {detectedLocation.colonia && (
              <Typography variant="body2">
                <strong>Colonia:</strong> {detectedLocation.colonia}
              </Typography>
            )}
            {detectedLocation.ciudad && (
              <Typography variant="body2">
                <strong>Ciudad:</strong> {detectedLocation.ciudad}
              </Typography>
            )}
          </Box>
          <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
            Puedes usar estos datos en los campos de abajo
          </Typography>
        </Alert>
      )}

      <Box
        sx={{
          position: 'relative',
          height: 300,
          bgcolor: '#e8f4f8',
          borderRadius: 1,
          overflow: 'hidden',
          cursor: loading ? 'wait' : 'default',
          opacity: loading ? 0.7 : 1
        }}
      >
        {/* Mapa simulado */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `
              linear-gradient(45deg, #e8f4f8 25%, transparent 25%),
              linear-gradient(-45deg, #e8f4f8 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #e8f4f8 75%),
              linear-gradient(-45deg, transparent 75%, #e8f4f8 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        />

        {/* Indicador de carga */}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Marcador de ubicación */}
        {value && (
          <LocationOn
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -100%)',
              fontSize: 40,
              color: 'error.main',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
            }}
          />
        )}

        {/* Controles del mapa */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <IconButton
            size="small"
            sx={{ bgcolor: 'background.paper' }}
            onClick={(e) => {
              e.stopPropagation();
              setZoom(Math.min(zoom + 1, 20));
            }}
            disabled={loading}
          >
            <ZoomIn />
          </IconButton>
          <IconButton
            size="small"
            sx={{ bgcolor: 'background.paper' }}
            onClick={(e) => {
              e.stopPropagation();
              setZoom(Math.max(zoom - 1, 10));
            }}
            disabled={loading}
          >
            <ZoomOut />
          </IconButton>
          <IconButton
            size="small"
            sx={{ bgcolor: 'primary.main', color: 'white' }}
            onClick={(e) => {
              e.stopPropagation();
              handleGetCurrentLocation();
            }}
            disabled={loading}
            title={translate('incidents.location.useCurrentLocation')}
          >
            <MyLocation />
          </IconButton>
        </Box>

        {/* Texto overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            bgcolor: 'background.paper',
            px: 2,
            py: 1,
            borderRadius: 1,
            boxShadow: 1,
            maxWidth: 'calc(100% - 20px)'
          }}
        >
          <Typography variant="caption" display="block">
            {value?.colonia || 'Alcaldía Cuajimalpa'}
          </Typography>
          {value && (
            <Typography variant="caption" display="block" color="text.secondary">
              Lat: {value.lat.toFixed(4)}, Lng: {value.lng.toFixed(4)}
            </Typography>
          )}
        </Box>

        {/* Instrucciones */}
        {!value && !loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 1,
              boxShadow: 2,
              maxWidth: '80%'
            }}
          >
            <MyLocation sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {translate('incidents.location.instructions')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {translate('incidents.location.clickOrUseButton')}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="textSecondary">
          Zoom: {zoom}x
        </Typography>
        {value?.calle && (
          <Typography variant="caption" color="primary">
            {value.calle}, {value.colonia}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
