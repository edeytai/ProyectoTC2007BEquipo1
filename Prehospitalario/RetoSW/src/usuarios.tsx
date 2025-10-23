import {
  List,
  Datagrid,
  TextField,
  DateField,
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  PasswordInput,
  Edit,
  required,
  useRecordContext,
  SimpleList,
  FunctionField,
  Show,
} from 'react-admin';
import { Chip, Box, useMediaQuery, useTheme, Paper, Typography, Divider, Grid, Alert } from '@mui/material';
import { Person, Schedule, Badge, Security } from '@mui/icons-material';

const RolField = () => {
  const record = useRecordContext();
  if (!record || !record.rol) return null;

  const rolColors: Record<string, 'primary' | 'error' | 'warning' | 'success' | 'info' | 'secondary'> = {
    administrador: 'error',
    jefe_turno: 'warning',
    paramedico: 'primary',
    autoridad: 'info',
  };

  const rolLabels: Record<string, string> = {
    administrador: 'Administrador',
    jefe_turno: 'Jefe de Turno',
    paramedico: 'Paramédico',
    autoridad: 'Autoridad',
  };

  return (
    <Chip
      label={rolLabels[record.rol] || record.rol}
      color={rolColors[record.rol] || 'default'}
      size="small"
    />
  );
};

const TurnoField = () => {
  const record = useRecordContext();
  if (!record || !record.turno) return null;

  const turnoLabels: Record<string, string> = {
    'administrador': 'Administrador',
    'autoridad': 'Autoridad',
    'lun-vie-matutino': 'Lun–Vie (matutino)',
    'lun-vie-vespertino': 'Lun–Vie (vespertino)',
    'lun-mie-vie-nocturno': 'Lun, Mie, Vie (nocturno)',
    'mar-jue-dom-nocturno': 'Mar, Jue, Dom (nocturno)',
    'sab-dom-fest-dia': 'Sáb, Dom, Festivos (día)',
    'sab-dom-fest-nocturno': 'Sáb, Dom, Festivos (nocturno)',
  };

  return <span>{turnoLabels[record.turno] || record.turno}</span>;
};

export const UsuariosList = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const rolLabels: Record<string, string> = {
    administrador: 'Administrador',
    jefe_turno: 'Jefe de Turno',
    paramedico: 'Paramédico',
    autoridad: 'Autoridad',
  };

  const turnoLabels: Record<string, string> = {
    'administrador': 'Administrador',
    'autoridad': 'Autoridad',
    'lun-vie-matutino': 'Lun–Vie (matutino)',
    'lun-vie-vespertino': 'Lun–Vie (vespertino)',
    'lun-mie-vie-nocturno': 'Lun, Mie, Vie (nocturno)',
    'mar-jue-dom-nocturno': 'Mar, Jue, Dom (nocturno)',
    'sab-dom-fest-dia': 'Sáb, Dom, Festivos (día)',
    'sab-dom-fest-nocturno': 'Sáb, Dom, Festivos (nocturno)',
  };

  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.usuario}
          secondaryText={(record) => `${rolLabels[record.rol]} • ${turnoLabels[record.turno]}`}
          tertiaryText={(record) => {
            const fecha = new Date(record.createdAt);
            return `Creado: ${fecha.toLocaleDateString()}`;
          }}
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
          <TextField source="usuario" label="Usuario" />
          <FunctionField label="Rol" render={() => <RolField />} />
          <FunctionField label="Turno" render={() => <TurnoField />} />
          <DateField source="createdAt" label="Fecha de Creación" showTime />
          <DateField source="updatedAt" label="Última Actualización" showTime />
        </Datagrid>
      )}
    </List>
  );
};

export const UsuariosCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput
        source="usuario"
        label="Nombre de Usuario"
        validate={required()}
        fullWidth
      />
      <PasswordInput
        source="contrasena"
        label="Contraseña"
        validate={required()}
        fullWidth
      />
      <SelectInput
        source="turno"
        label="Turno"
        choices={[
          { id: 'administrador', name: 'Administrador (sin restricciones)' },
          { id: 'autoridad', name: 'Autoridad (sin restricciones)' },
          { id: 'lun-vie-matutino', name: 'Lun–Vie (matutino) - 8:00 am a 3:00 pm' },
          { id: 'lun-vie-vespertino', name: 'Lun–Vie (vespertino) - 3:00 pm a 9:00 pm' },
          { id: 'lun-mie-vie-nocturno', name: 'Lun, Mie, Vie (nocturno) - 9:00 pm a 8:00 am' },
          { id: 'mar-jue-dom-nocturno', name: 'Mar, Jue, Dom (nocturno) - 9:00 pm a 8:00 am' },
          { id: 'sab-dom-fest-dia', name: 'Sáb, Dom, Festivos (día) - 8:00 am a 8:00 pm' },
          { id: 'sab-dom-fest-nocturno', name: 'Sáb, Dom, Festivos (nocturno) - 8:00 pm a 8:00 am' },
        ]}
        validate={required()}
        fullWidth
      />
      <SelectInput
        source="rol"
        label="Rol"
        choices={[
          { id: 'administrador', name: 'Administrador' },
          { id: 'jefe_turno', name: 'Jefe de Turno' },
          { id: 'paramedico', name: 'Paramédico' },
          { id: 'autoridad', name: 'Autoridad' },
        ]}
        validate={required()}
        fullWidth
      />
    </SimpleForm>
  </Create>
);

export const UsuariosEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput
        source="usuario"
        label="Nombre de Usuario"
        validate={required()}
        fullWidth
      />
      <PasswordInput
        source="contraseña"
        label="Contraseña (dejar vacío para no cambiar)"
        fullWidth
      />
      <SelectInput
        source="turno"
        label="Turno"
        choices={[
          { id: 'administrador', name: 'Administrador (sin restricciones)' },
          { id: 'autoridad', name: 'Autoridad (sin restricciones)' },
          { id: 'lun-vie-matutino', name: 'Lun–Vie (matutino) - 8:00 am a 3:00 pm' },
          { id: 'lun-vie-vespertino', name: 'Lun–Vie (vespertino) - 3:00 pm a 9:00 pm' },
          { id: 'lun-mie-vie-nocturno', name: 'Lun, Mie, Vie (nocturno) - 9:00 pm a 8:00 am' },
          { id: 'mar-jue-dom-nocturno', name: 'Mar, Jue, Dom (nocturno) - 9:00 pm a 8:00 am' },
          { id: 'sab-dom-fest-dia', name: 'Sáb, Dom, Festivos (día) - 8:00 am a 8:00 pm' },
          { id: 'sab-dom-fest-nocturno', name: 'Sáb, Dom, Festivos (nocturno) - 8:00 pm a 8:00 am' },
        ]}
        validate={required()}
        fullWidth
      />
      <SelectInput
        source="rol"
        label="Rol"
        choices={[
          { id: 'administrador', name: 'Administrador' },
          { id: 'jefe_turno', name: 'Jefe de Turno' },
          { id: 'paramedico', name: 'Paramédico' },
          { id: 'autoridad', name: 'Autoridad' },
        ]}
        validate={required()}
        fullWidth
      />
    </SimpleForm>
  </Edit>
);

const getRolLabel = (rol: string) => {
  const labels: Record<string, string> = {
    paramedico: 'Paramédico',
    jefe_turno: 'Jefe de Turno',
    autoridad: 'Autoridad',
    administrador: 'Administrador',
  };
  return labels[rol] || rol;
};

const getRolColor = (rol: string): 'success' | 'info' | 'warning' | 'error' | 'primary' => {
  const colors: Record<string, 'success' | 'info' | 'warning' | 'error' | 'primary'> = {
    paramedico: 'primary',
    jefe_turno: 'warning',
    autoridad: 'info',
    administrador: 'error',
  };
  return colors[rol] || 'primary';
};

const getTurnoInfo = (turno: string) => {
  const turnoLabels: Record<string, { nombre: string; horario: string; dias: string }> = {
    'administrador': {
      nombre: 'Administrador (Sin restricciones)',
      horario: '24/7',
      dias: 'Todos los días'
    },
    'autoridad': {
      nombre: 'Autoridad (Sin restricciones)',
      horario: '24/7',
      dias: 'Todos los días'
    },
    'lun-vie-matutino': {
      nombre: 'Lunes a Viernes (Matutino)',
      horario: '8:00 am - 3:00 pm',
      dias: 'Lun, Mar, Mie, Jue, Vie'
    },
    'lun-vie-vespertino': {
      nombre: 'Lunes a Viernes (Vespertino)',
      horario: '3:00 pm - 9:00 pm',
      dias: 'Lun, Mar, Mie, Jue, Vie'
    },
    'lun-mie-vie-nocturno': {
      nombre: 'Lunes, Miércoles, Viernes (Nocturno)',
      horario: '9:00 pm - 8:00 am',
      dias: 'Lun, Mie, Vie'
    },
    'mar-jue-dom-nocturno': {
      nombre: 'Martes, Jueves, Domingo (Nocturno)',
      horario: '9:00 pm - 8:00 am',
      dias: 'Mar, Jue, Dom'
    },
    'sab-dom-fest-dia': {
      nombre: 'Sábado, Domingo, Festivos (Día)',
      horario: '8:00 am - 8:00 pm',
      dias: 'Sáb, Dom, Festivos'
    },
    'sab-dom-fest-nocturno': {
      nombre: 'Sábado, Domingo, Festivos (Nocturno)',
      horario: '8:00 pm - 8:00 am',
      dias: 'Sáb, Dom, Festivos'
    },
  };
  return turnoLabels[turno] || { nombre: turno, horario: 'N/A', dias: 'N/A' };
};

const getPermisosForRol = (rol: string) => {
  const permisos: Record<string, string[]> = {
    paramedico: ['Crear reportes'],
    jefe_turno: ['Crear reportes', 'Ver reportes'],
    autoridad: ['Ver reportes', 'Ver dashboard'],
    administrador: [
      'Crear reportes',
      'Ver reportes',
      'Actualizar reportes',
      'Eliminar reportes',
      'Crear usuarios',
      'Ver usuarios',
      'Actualizar usuarios',
      'Eliminar usuarios',
      'Ver dashboard',
    ],
  };
  return permisos[rol] || [];
};

const UsuarioShowContent = () => {
  const record = useRecordContext();

  if (!record) return null;

  const turnoInfo = getTurnoInfo(record.turno);
  const permisos = getPermisosForRol(record.rol);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person /> Información del Usuario
      </Typography>

      <Grid container spacing={3}>
        {/* Informacion personal */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Badge /> Información Personal
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                ID de Usuario
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {record.id}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Nombre de Usuario
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {record.usuario}
              </Typography>
            </Box>

            {record.nombre && (
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Nombre Completo
                </Typography>
                <Typography variant="body1">
                  {record.nombre}
                </Typography>
              </Box>
            )}

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Rol
              </Typography>
              <Box mt={1}>
                <Chip
                  label={getRolLabel(record.rol)}
                  color={getRolColor(record.rol)}
                  size="medium"
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Informacion de turno */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Schedule /> Turno Asignado
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Nombre del Turno
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {turnoInfo.nombre}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Horario
              </Typography>
              <Typography variant="body1">
                {turnoInfo.horario}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Días de Trabajo
              </Typography>
              <Typography variant="body1">
                {turnoInfo.dias}
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              Los usuarios pueden acceder 10 minutos antes de su turno
            </Alert>
          </Paper>
        </Grid>

        {/* Permisos del usuario */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Security /> Permisos del Sistema
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {record.rol === 'administrador' ? (
              <Alert severity="success">
                Como administrador, este usuario tiene acceso completo a todas las funcionalidades del sistema.
              </Alert>
            ) : (
              <Box>
                {permisos.map((permiso, index) => (
                  <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                    • {permiso}
                  </Typography>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Informacion de la cuenta */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Información de la Cuenta
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Cuenta Creada
                </Typography>
                <Typography variant="body2">
                  {record.createdAt ? new Date(record.createdAt).toLocaleString('es-MX') : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Última Actualización
                </Typography>
                <Typography variant="body2">
                  {record.updatedAt ? new Date(record.updatedAt).toLocaleString('es-MX') : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export const UsuariosShow = () => (
  <Show>
    <UsuarioShowContent />
  </Show>
);
