import { Box, Paper, Typography, Alert, Button, Divider, Chip } from '@mui/material';
import { Schedule, ExitToApp, CalendarMonth } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { getColors } from './theme/colors';

export const FueraDeTurno = () => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);

  // Obtener informacion del turno
  const turnoInfoStr = localStorage.getItem('turnoInfo');
  const turnoInfo = turnoInfoStr ? JSON.parse(turnoInfoStr) : null;
  const username = localStorage.getItem('username') || 'Usuario';

  const handleLogout = () => {
    // Limpiar datos de sesion
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("turno");
    localStorage.removeItem("permissions");
    localStorage.removeItem("enTurno");
    localStorage.removeItem("turnoInfo");

    // Volver al login
    window.location.href = '/';
  };

  const getDiaSemana = (dia: number) => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[dia];
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: colors.background.default,
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          width: '100%',
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Schedule
            sx={{
              fontSize: 80,
              color: colors.warning.main,
              mb: 2,
            }}
          />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: colors.text.primary }}>
            Fuera de Turno
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hola, <strong>{username}</strong>
          </Typography>
        </Box>

        <Alert severity="warning" sx={{ mb: 3 }}>
          No es tu horario de trabajo asignado. Solo puedes acceder al sistema durante tu turno.
        </Alert>

        <Divider sx={{ my: 3 }} />

        {turnoInfo && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Schedule /> Información de tu Turno
            </Typography>

            <Box sx={{ bgcolor: colors.background.paper, p: 2, borderRadius: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Nombre del Turno
              </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
                {turnoInfo.nombre}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Horario
              </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
                {turnoInfo.horario.inicio} - {turnoInfo.horario.fin}
                {turnoInfo.cruzaMedianoche && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    (El turno cruza medianoche)
                  </Typography>
                )}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <CalendarMonth fontSize="small" /> Días de Trabajo
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
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Por favor, inicia sesión nuevamente durante tu horario asignado.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ExitToApp />}
            onClick={handleLogout}
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
