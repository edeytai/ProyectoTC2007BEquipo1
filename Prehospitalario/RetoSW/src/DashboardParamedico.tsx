import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add,
  LocalHospital,
  Schedule,
  CalendarMonth,
} from '@mui/icons-material';
import { Title } from 'react-admin';
import { useTheme } from '@mui/material';
import { getColors } from './theme/colors';
import { ReportDialog } from './components/ReportDialog';

export const DashboardParamedico = () => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const [openReport, setOpenReport] = useState(false);

  // Obtener informacion del usuario
  const username = localStorage.getItem('username') || 'Paramedico';
  const turnoInfoStr = localStorage.getItem('turnoInfo');
  const turnoInfo = turnoInfoStr ? JSON.parse(turnoInfoStr) : null;

  const getDiaSemana = (dia: number) => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[dia];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Title title="Inicio - Paramédico" />

      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: colors.text.primary }}>
          Bienvenido, {username}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Panel de control para paramédicos
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Boton de crear reporte */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
              color: colors.neutral.white,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 12px 24px rgba(239, 83, 80, 0.3)'
                  : '0 12px 24px rgba(198, 40, 40, 0.25)',
              },
            }}
            onClick={() => setOpenReport(true)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    p: 2,
                    display: 'flex',
                  }}
                >
                  <Add sx={{ fontSize: 40 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Crear Nuevo Reporte
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Registra una nueva atención prehospitalaria
                  </Typography>
                </Box>
              </Box>
              <LocalHospital sx={{ fontSize: 60, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>

        {/* Informacion del turno */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Schedule /> Tu Turno
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {turnoInfo ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nombre del Turno
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {turnoInfo.nombre}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Horario
                  </Typography>
                  <Typography variant="body1">
                    {turnoInfo.horario.inicio} - {turnoInfo.horario.fin}
                  </Typography>
                  {turnoInfo.cruzaMedianoche && (
                    <Typography variant="caption" color="text.secondary">
                      (El turno cruza medianoche)
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <CalendarMonth fontSize="small" /> Dias de Trabajo
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {turnoInfo.dias.map((dia: number) => (
                      <Chip
                        key={dia}
                        label={getDiaSemana(dia)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  Puedes acceder al sistema 10 minutos antes de tu turno
                </Alert>
              </>
            ) : (
              <Alert severity="warning">
                No hay informacion de turno disponible
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Mensaje de ayuda */}
        <Grid item xs={12}>
          <Alert severity="success" icon={<LocalHospital />}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              ¿Necesitas ayuda?
            </Typography>
            <Typography variant="body2">
              Como paramédico, tu función principal es crear reportes de atención prehospitalaria.
              Usa el botón "Crear Nuevo Reporte" para registrar cada atención que realices.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      <ReportDialog open={openReport} onClose={() => setOpenReport(false)} />
    </Box>
  );
};
