import { Box, Typography, TextField, Button, Paper, MenuItem, Alert, Snackbar } from '@mui/material';
import { LocalFireDepartment, Send, Camera, LocationOn } from '@mui/icons-material';
import { useState } from 'react';
import { MapSelector } from './components/MapSelector';

export const PublicCapture = () => {
  const [formData, setFormData] = useState({
    solicitudMitigacion: '',
    tipoEmergencia: '',
    nivelGravedad: '',
    ubicacion: {
      lat: null,
      lng: null,
      calle: '',
      colonia: '',
      referencias: ''
    },
    descripcion: '',
    nombreReportante: '',
    telefonoReportante: ''
  });

  const [openSuccess, setOpenSuccess] = useState(false);
  const [mapLocation, setMapLocation] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del incidente publico:', formData);
    setOpenSuccess(true);

    setTimeout(() => {
      setFormData({
        solicitudMitigacion: '',
        tipoEmergencia: '',
        nivelGravedad: '',
        ubicacion: {
          lat: null,
          lng: null,
          calle: '',
          colonia: '',
          referencias: ''
        },
        descripcion: '',
        nombreReportante: '',
        telefonoReportante: ''
      });
      setMapLocation(null);
    }, 2000);
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('ubicacion.')) {
      const locationField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        ubicacion: {
          ...prev.ubicacion,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        p: 2
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <LocalFireDepartment sx={{ fontSize: 40, mr: 2, color: 'error.main' }} />
            <Box>
              <Typography variant="h5">
                Reporte Público de Emergencias
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Alcaldía Cuajimalpa - Sistema de Atención Ciudadana
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            Use este formulario para reportar emergencias en la Alcaldía Cuajimalpa.
            Su reporte será atendido por nuestro equipo de Protección Civil.
          </Alert>

          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Información de la Emergencia
            </Typography>

            <TextField
              fullWidth
              required
              label="¿Qué está sucediendo?"
              value={formData.solicitudMitigacion}
              onChange={(e) => handleInputChange('solicitudMitigacion', e.target.value)}
              margin="normal"
              placeholder="Describa brevemente la emergencia"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                select
                fullWidth
                required
                label="Tipo de Emergencia"
                value={formData.tipoEmergencia}
                onChange={(e) => handleInputChange('tipoEmergencia', e.target.value)}
              >
                <MenuItem value="inundacion">Inundacion</MenuItem>
                <MenuItem value="incendio">Incendio</MenuItem>
                <MenuItem value="socavon">Socavon</MenuItem>
                <MenuItem value="deslave">Deslave</MenuItem>
                <MenuItem value="sismo">Sismo</MenuItem>
                <MenuItem value="fuga">Fuga</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                required
                label="Gravedad Estimada"
                value={formData.nivelGravedad}
                onChange={(e) => handleInputChange('nivelGravedad', e.target.value)}
              >
                <MenuItem value="baja">Baja - No hay riesgo inmediato</MenuItem>
                <MenuItem value="media">Media - Requiere atencion pronto</MenuItem>
                <MenuItem value="alta">Alta - Emergencia critica</MenuItem>
              </TextField>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Ubicacion de la Emergencia
            </Typography>

            <MapSelector
              value={mapLocation}
              onChange={(location: any) => {
                setMapLocation(location);
                handleInputChange('ubicacion.lat', location.lat);
                handleInputChange('ubicacion.lng', location.lng);
              }}
              label="Marque la ubicacion exacta en el mapa"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                required
                label="Calle"
                value={formData.ubicacion.calle}
                onChange={(e) => handleInputChange('ubicacion.calle', e.target.value)}
                placeholder="Nombre de la calle"
              />
              <TextField
                fullWidth
                required
                label="Colonia"
                value={formData.ubicacion.colonia}
                onChange={(e) => handleInputChange('ubicacion.colonia', e.target.value)}
                placeholder="Nombre de la colonia"
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Referencias"
              value={formData.ubicacion.referencias}
              onChange={(e) => handleInputChange('ubicacion.referencias', e.target.value)}
              margin="normal"
              placeholder="Entre qué calles, cerca de..."
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción detallada"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              margin="normal"
              placeholder="Proporcione más detalles sobre la situación"
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Datos de Contacto (Opcional)
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.nombreReportante}
                onChange={(e) => handleInputChange('nombreReportante', e.target.value)}
                placeholder="Su nombre"
              />
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefonoReportante}
                onChange={(e) => handleInputChange('telefonoReportante', e.target.value)}
                placeholder="10 dígitos"
                inputProps={{ maxLength: 10 }}
              />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Camera />}
                sx={{ flex: 1 }}
                onClick={() => alert('Función de cámara no implementada en POC')}
              >
                Agregar Foto
              </Button>

              <Button
                variant="outlined"
                startIcon={<LocationOn />}
                sx={{ flex: 1 }}
                onClick={() => alert('Función de GPS no implementada en POC')}
              >
                Usar mi Ubicación
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="error"
              size="large"
              fullWidth
              startIcon={<Send />}
              sx={{ mt: 4 }}
            >
              Enviar Reporte de Emergencia
            </Button>
          </form>
        </Paper>

        <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
          <Typography variant="body2" color="textSecondary" textAlign="center">
            <strong>Números de Emergencia Directa:</strong><br />
            911 - Emergencias | 55-5555-5555 - Protección Civil Cuajimalpa<br />
            Este formulario es monitoreado 24/7
          </Typography>
        </Paper>
      </Box>

      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={() => setOpenSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setOpenSuccess(false)}>
          Reporte enviado exitosamente. ID de seguimiento: EM-{new Date().getTime()}
        </Alert>
      </Snackbar>
    </Box>
  );
};