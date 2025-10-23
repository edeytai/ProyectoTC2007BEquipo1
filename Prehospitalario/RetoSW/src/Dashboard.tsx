import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Paper,
  Chip,
  useTheme,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Assessment,
  People,
  LocalHospital,
  TrendingUp,
  CalendarToday,
  Warning,
  Healing,
  AccessTime,
  Male,
  Female,
  DirectionsCar,
  PersonOutline,
} from '@mui/icons-material';
import { useDataProvider } from 'react-admin';
import { getColors } from './theme/colors';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function StatCard(props: {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  color: string;
  bgColor: string;
  subtitle?: string;
}) {
  const titulo = props.title;
  const valor = props.value;
  const Icono = props.icon;
  const tendencia = props.trend;
  const color = props.color;
  const colorFondo = props.bgColor;
  const subtitulo = props.subtitle;

  const tema = useTheme();
  const modoTema = tema.palette.mode;
  const colores = getColors(modoTema);

  let colorSombraHover = '0 8px 24px rgba(0,0,0,0.12)';
  if (modoTema === 'dark') {
    colorSombraHover = '0 8px 24px rgba(0,0,0,0.4)';
  }

  let colorChip = colores.success.dark;
  if (modoTema === 'dark') {
    colorChip = colores.success.main;
  }

  const bordeTarjeta = '1px solid ' + colores.border.light;

  const bordeChip = '1px solid ' + colores.success.main;

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        bgcolor: colores.background.paper,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: colorSombraHover,
        },
        border: bordeTarjeta,
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: colores.text.secondary,
                fontWeight: 500,
                mb: 1,
              }}
            >
              {titulo}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: colores.text.primary,
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {valor}
            </Typography>
            {subtitulo && (
              <Typography variant="caption" sx={{ color: colores.text.secondary }}>
                {subtitulo}
              </Typography>
            )}
            {tendencia && (
              <Chip
                label={tendencia}
                size="small"
                sx={{
                  bgcolor: colores.success.light,
                  color: colorChip,
                  fontWeight: 600,
                  height: 24,
                  fontSize: '0.75rem',
                  border: bordeChip,
                  mt: 1,
                }}
              />
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: colorFondo,
              width: 56,
              height: 56,
              flexShrink: 0,
            }}
          >
            <Icono sx={{ color, fontSize: 28 }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

export const Dashboard = () => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const dataProvider = useDataProvider();

  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingStats(true);
        const token = localStorage.getItem('token');

        const statsResponse = await fetch(`${API_URL}/estadisticas/dashboard`, {
          headers: {
            'Authentication': token || '',
            'Accept': 'application/json',
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setEstadisticas(statsData);
        }

        const permissionsStr = localStorage.getItem('permissions');
        if (permissionsStr) {
          const permissions = JSON.parse(permissionsStr);
          const isAdmin = permissions.includes('*');

          if (isAdmin) {
            try {
              const usuarios = await dataProvider.getList('usuarios', {
                pagination: { page: 1, perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: {},
              });
              setTotalUsuarios(usuarios.data.length);
            } catch (error) {
              console.log('No se pudieron cargar usuarios (sin permisos)');
              setTotalUsuarios(0);
            }
          } else {
            setTotalUsuarios(0);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchData();
  }, [dataProvider]);

  const COLORS = {
    primary: colors.primary.main,
    success: colors.success.main,
    warning: colors.warning.main,
    error: colors.error.main,
    info: colors.info.main,
  };

  const CHART_COLORS = [
    COLORS.primary,
    COLORS.info,
    COLORS.warning,
    COLORS.success,
    COLORS.error,
    '#9c27b0',
  ];

  const motivosData = estadisticas?.motivosAtencion
    ? [
        { name: 'Accidentes', value: estadisticas.motivosAtencion.accidente, color: COLORS.error },
        { name: 'Enfermedades', value: estadisticas.motivosAtencion.enfermedad, color: COLORS.info },
        { name: 'Ginecoobstétrico', value: estadisticas.motivosAtencion.ginecoobstetrico, color: '#7b1fa2' },
      ]
    : [];

  const sexoData = estadisticas?.reportesPorSexo
    ? [
        { name: 'Hombres', value: estadisticas.reportesPorSexo.masculino || estadisticas.reportesPorSexo.Hombre || estadisticas.reportesPorSexo.M || 0, color: COLORS.info },
        { name: 'Mujeres', value: estadisticas.reportesPorSexo.femenino || estadisticas.reportesPorSexo.Mujer || estadisticas.reportesPorSexo.F || 0, color: '#e91e63' },
      ]
    : [];

  const trasladoData = [
    { name: 'Con Traslado', value: estadisticas?.reportesConTraslado || 0, color: COLORS.success },
    { name: 'Sin Traslado', value: estadisticas?.reportesSinTraslado || 0, color: COLORS.warning },
  ];

  if (isLoadingStats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: colors.background.default,
        minHeight: '100vh',
        p: 3,
      }}
    >
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: colors.text.primary, fontWeight: 700, mb: 1 }}>
          Dashboard de Análisis
        </Typography>
        <Typography variant="body1" sx={{ color: colors.text.secondary }}>
          Estadísticas y métricas del sistema de emergencias prehospitalarias
        </Typography>
      </Box>

      {/* Indicadores principales */}
      <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600, mb: 2 }}>
        Indicadores Clave de Desempeño
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Reportes"
            value={estadisticas?.totalReportes || 0}
            icon={Assessment}
            color={colors.primary.main}
            bgColor={colors.primary.light}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reportes Hoy"
            value={estadisticas?.reportesHoy || 0}
            icon={CalendarToday}
            trend="Día actual"
            color={colors.info.main}
            bgColor={colors.info.light}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Esta Semana"
            value={estadisticas?.reportesSemana || 0}
            icon={TrendingUp}
            trend="Últimos 7 días"
            color={colors.success.main}
            bgColor={colors.success.light}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Este Mes"
            value={estadisticas?.reportesMes || 0}
            icon={LocalHospital}
            trend="Mes actual"
            color={colors.warning.main}
            bgColor={colors.warning.light}
          />
        </Grid>
      </Grid>

      {/* Metricas operacionales */}
      <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600, mb: 2 }}>
        Métricas Operacionales
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Casos Con Traslado"
            value={estadisticas?.reportesConTraslado || 0}
            subtitle={`${estadisticas?.totalReportes > 0 ? Math.round((estadisticas.reportesConTraslado / estadisticas.totalReportes) * 100) : 0}% del total`}
            icon={DirectionsCar}
            color={colors.success.main}
            bgColor={colors.success.light}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Casos Sin Traslado"
            value={estadisticas?.reportesSinTraslado || 0}
            subtitle={`${estadisticas?.totalReportes > 0 ? Math.round((estadisticas.reportesSinTraslado / estadisticas.totalReportes) * 100) : 0}% del total`}
            icon={Healing}
            color={colors.warning.main}
            bgColor={colors.warning.light}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Personal Activo"
            value={totalUsuarios}
            subtitle="Usuarios registrados"
            icon={People}
            color={colors.info.main}
            bgColor={colors.info.light}
          />
        </Grid>
      </Grid>

      {/* Tipos de emergencia */}
      <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600, mb: 2 }}>
        Tipos de Emergencia
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Accidentes/Traumáticos"
            value={estadisticas?.motivosAtencion?.accidente || 0}
            subtitle="Casos de trauma"
            icon={Warning}
            color={colors.error.main}
            bgColor={colors.error.light}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Enfermedades"
            value={estadisticas?.motivosAtencion?.enfermedad || 0}
            subtitle="Casos médicos"
            icon={Healing}
            color={colors.info.main}
            bgColor={colors.info.light}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Ginecoobstétrico"
            value={estadisticas?.motivosAtencion?.ginecoobstetrico || 0}
            subtitle="Casos obstétricos"
            icon={LocalHospital}
            color={'#7b1fa2'}
            bgColor={'#f3e5f5'}
          />
        </Grid>
      </Grid>

      {/* Tipos de accidente */}
      {estadisticas?.tiposAccidente && Object.keys(estadisticas.tiposAccidente).length > 0 && (
        <>
          <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600, mb: 2 }}>
            Tipos de Accidente
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {estadisticas.tiposAccidente.colision !== undefined && (
              <Grid item xs={6} sm={4} md={2}>
                <StatCard
                  title="Colisión"
                  value={estadisticas.tiposAccidente.colision || 0}
                  icon={DirectionsCar}
                  color={colors.error.main}
                  bgColor={colors.error.light}
                />
              </Grid>
            )}
            {estadisticas.tiposAccidente.volcadura !== undefined && (
              <Grid item xs={6} sm={4} md={2}>
                <StatCard
                  title="Volcadura"
                  value={estadisticas.tiposAccidente.volcadura || 0}
                  icon={Warning}
                  color={colors.warning.main}
                  bgColor={colors.warning.light}
                />
              </Grid>
            )}
            {estadisticas.tiposAccidente.automotor !== undefined && (
              <Grid item xs={6} sm={4} md={2}>
                <StatCard
                  title="Automotor"
                  value={estadisticas.tiposAccidente.automotor || 0}
                  icon={DirectionsCar}
                  color={colors.info.main}
                  bgColor={colors.info.light}
                />
              </Grid>
            )}
            {estadisticas.tiposAccidente.bicicleta !== undefined && (
              <Grid item xs={6} sm={4} md={2}>
                <StatCard
                  title="Bicicleta"
                  value={estadisticas.tiposAccidente.bicicleta || 0}
                  icon={PersonOutline}
                  color={colors.success.main}
                  bgColor={colors.success.light}
                />
              </Grid>
            )}
            {estadisticas.tiposAccidente.motocicleta !== undefined && (
              <Grid item xs={6} sm={4} md={2}>
                <StatCard
                  title="Motocicleta"
                  value={estadisticas.tiposAccidente.motocicleta || 0}
                  icon={DirectionsCar}
                  color={colors.primary.main}
                  bgColor={colors.primary.light}
                />
              </Grid>
            )}
            {estadisticas.tiposAccidente.maquinaria !== undefined && (
              <Grid item xs={6} sm={4} md={2}>
                <StatCard
                  title="Maquinaria"
                  value={estadisticas.tiposAccidente.maquinaria || 0}
                  icon={Healing}
                  color={'#7b1fa2'}
                  bgColor={'#f3e5f5'}
                />
              </Grid>
            )}
          </Grid>
        </>
      )}

      {/* Graficas de analisis */}
      <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600, mb: 2 }}>
        Análisis Detallado
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Grafica de tendencia semanal */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, border: `1px solid ${colors.border.light}`, height: '100%', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Tendencia Semanal de Reportes
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
              <LineChart data={estadisticas?.reportesPorDia || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.light} />
                <XAxis
                  dataKey="fecha"
                  stroke={colors.text.secondary}
                  tick={{ fill: colors.text.secondary }}
                />
                <YAxis stroke={colors.text.secondary} tick={{ fill: colors.text.secondary }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.background.paper,
                    border: `1px solid ${colors.border.light}`,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cantidad"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Reportes"
                />
              </LineChart>
            </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Grafica de tipos de emergencia */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, border: `1px solid ${colors.border.light}`, height: '100%', minHeight: 380, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Tipos de Emergencia
            </Typography>
            <Box sx={{ flex: 1, width: '100%', minHeight: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={motivosData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {motivosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Grafica de distribucion por edad */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, border: `1px solid ${colors.border.light}`, minHeight: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Distribución por Rango de Edad
            </Typography>
            <Box sx={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
              <BarChart data={estadisticas?.reportesPorEdad || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.light} />
                <XAxis
                  dataKey="rango"
                  stroke={colors.text.secondary}
                  tick={{ fill: colors.text.secondary }}
                />
                <YAxis stroke={colors.text.secondary} tick={{ fill: colors.text.secondary }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.background.paper,
                    border: `1px solid ${colors.border.light}`,
                  }}
                />
                <Bar dataKey="cantidad" fill={COLORS.info} name="Pacientes" />
              </BarChart>
            </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Grafica de distribucion por sexo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, border: `1px solid ${colors.border.light}`, minHeight: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Distribución por Sexo
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: 320 }}>
              <Box sx={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sexoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sexoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', width: '100%' }}>
                {sexoData.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: item.color,
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.name}: <strong>{item.value}</strong>
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Hospitales mas frecuentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, border: `1px solid ${colors.border.light}`, height: '100%', minHeight: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Hospitales Más Frecuentes
            </Typography>
            <List>
              {estadisticas?.hospitalesFrecuentes?.length > 0 ? (
                estadisticas.hospitalesFrecuentes.map((hospital: any, index: number) => (
                  <ListItem
                    key={index}
                    sx={{
                      borderLeft: `4px solid ${CHART_COLORS[index % CHART_COLORS.length]}`,
                      mb: 1,
                      bgcolor: colors.background.default,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemIcon>
                      <LocalHospital sx={{ color: CHART_COLORS[index % CHART_COLORS.length] }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={hospital.hospital}
                      secondary={`${hospital.cantidad} traslados`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay datos de traslados disponibles
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Grafica de traslados */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, border: `1px solid ${colors.border.light}`, minHeight: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Casos con/sin Traslado
            </Typography>
            <Box sx={{ width: '100%', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trasladoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trasladoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
