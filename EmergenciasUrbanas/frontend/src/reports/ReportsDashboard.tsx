import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Button, CircularProgress } from '@mui/material';
import {
  Assessment,
  Warning,
  CheckCircle,
  GetApp,
  PictureAsPdf,
} from '@mui/icons-material';
import { useTranslate, useNotify } from 'react-admin';

import { BACKEND_URL } from '../config';

const StatCard = ({ title, value, subtitle, icon, color }: any) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{
            bgcolor: `${color}.light`,
            borderRadius: 2,
            p: 1,
            mr: 2,
            display: 'flex',
          }}
        >
          {icon}
        </Box>
        <Typography color="textSecondary" variant="body2">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

interface Stats {
  totalIncidents: number;
  criticalIncidents: number;
  monthIncidents: number;
  byStatus: { [key: string]: number };
  byType: { [key: string]: number };
}

export const ReportsDashboard = () => {
  const translate = useTranslate();
  const notify = useNotify();
  const [state, setState] = useState({
    stats: null as Stats | null,
    loading: true,
    exporting: false,
    error: null as string | null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem('auth');
        const response = await fetch(`${BACKEND_URL}/reports/stats`, {
          headers: {
            'Authentication': token || '',
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar estadísticas');
        }

        const data = await response.json();
        setState(prev => ({ ...prev, stats: data }));
      } catch (err) {
        setState(prev => ({ ...prev, error: err instanceof Error ? err.message : 'Error desconocido' }));
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setState(prev => ({ ...prev, exporting: true }));
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
      setState(prev => ({ ...prev, exporting: false }));
    }
  };

  if (state.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (state.error) {
    return (
      <Box p={3}>
        <Typography color="error">Error: {state.error}</Typography>
      </Box>
    );
  }

  if (!state.stats) {
    return null;
  }

  const approvedCount = state.stats.byStatus.aprobado || 0;
  const resolutionPercentage = state.stats.totalIncidents > 0
    ? ((approvedCount / state.stats.totalIncidents) * 100).toFixed(1)
    : '0.0';

  const typeEntries = Object.entries(state.stats.byType).sort((a, b) => b[1] - a[1]);
  const maxTypeCount = typeEntries.length > 0 ? typeEntries[0][1] : 1;

  // Colores para cada tipo
  const typeColors: { [key: string]: string } = {
    'inundacion': 'primary',
    'incendio': 'error',
    'socavon': 'warning',
    'fuga': 'info',
    'otro': 'grey',
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">{translate('reports.dashboard.title')}</Typography>
        <Box>
          <Button
            startIcon={state.exporting ? <CircularProgress size={20} /> : <GetApp />}
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => handleExport('csv')}
            disabled={state.exporting}
          >
            {translate('reports.export.csv')}
          </Button>
          <Button
            startIcon={state.exporting ? <CircularProgress size={20} /> : <PictureAsPdf />}
            variant="outlined"
            color="error"
            onClick={() => handleExport('pdf')}
            disabled={state.exporting}
          >
            {translate('reports.export.pdf')}
          </Button>
        </Box>
      </Box>

      {/* KPIs Grid */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={translate('reports.dashboard.totalIncidents')}
            value={state.stats.totalIncidents}
            subtitle={translate('ra.navigation.page_range_info', { offsetBegin: 0, offsetEnd: state.stats.totalIncidents, total: state.stats.totalIncidents })}
            icon={<Assessment sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={translate('reports.dashboard.criticalIncidents')}
            value={state.stats.criticalIncidents}
            subtitle={translate('commons.severity.alta')}
            icon={<Warning sx={{ color: 'error.main' }} />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={translate('commons.status.aprobado')}
            value={approvedCount}
            subtitle={`${resolutionPercentage}% del total`}
            icon={<CheckCircle sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Estadisticas por tipo y estado */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {translate('reports.byType')}
              </Typography>
              <Box>
                {typeEntries.length > 0 ? (
                  typeEntries.map(([tipo, count]) => {
                    const porcentaje = (count / maxTypeCount) * 100;
                    const color = typeColors[tipo] || 'grey';

                    return (
                      <Box key={tipo} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="body2">{translate(`incidents.fields.tipoEmergencia.${tipo}`, { _: tipo })}</Typography>
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              width: 100,
                              height: 8,
                              bgcolor: `${color}.light`,
                              borderRadius: 1,
                              mr: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: `${porcentaje}%`,
                                height: '100%',
                                bgcolor: `${color}.main`,
                                borderRadius: 1,
                              }}
                            />
                          </Box>
                          <Typography variant="body2">{count}</Typography>
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No hay datos disponibles
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {translate('reports.byStatus')}
              </Typography>
              <Box>
                {Object.entries(state.stats.byStatus).map(([estado, count]) => {
                  const statusColors: { [key: string]: string } = {
                    'draft': 'grey',
                    'en_revision': 'warning',
                    'aprobado': 'success',
                  };
                  const color = statusColors[estado] || 'info';
                  const maxStatusCount = Math.max(...Object.values(state.stats.byStatus));
                  const porcentaje = (count / maxStatusCount) * 100;

                  return (
                    <Box key={estado} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="body2">{translate(`incidents.fields.estadoReporte.${estado}`, { _: estado })}</Typography>
                      <Box display="flex" alignItems="center">
                        <Box
                          sx={{
                            width: 100,
                            height: 8,
                            bgcolor: `${color}.light`,
                            borderRadius: 1,
                            mr: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: `${porcentaje}%`,
                              height: '100%',
                              bgcolor: `${color}.main`,
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                        <Typography variant="body2">{count}</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
