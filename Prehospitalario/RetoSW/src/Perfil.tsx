import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Divider, Grid, Paper, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { Person, Schedule, Security, Badge, CalendarMonth } from '@mui/icons-material';
import { Title } from 'react-admin';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface TurnoInfo {
    nombre: string;
    horario: {
        inicio: string;
        fin: string;
    };
    dias: number[];
    cruzaMedianoche: boolean;
    incluyeFestivos: boolean;
}

interface Permisos {
    reportes?: string[];
    usuarios?: string[];
}

interface PerfilData {
    id: string;
    usuario: string;
    rol: string;
    turno: string;
    turnoInfo: TurnoInfo | null;
    permisos: Permisos;
    createdAt: string;
    updatedAt: string;
}

export const Perfil = () => {
    const [perfil, setPerfil] = useState<PerfilData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No hay sesión activa');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_URL}/usuarios/perfil`, {
                    headers: {
                        'Authentication': token,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar el perfil');
                }

                const data = await response.json();
                setPerfil(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, []);

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

    const getDiaSemana = (dia: number) => {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dias[dia];
    };

    const formatearPermisos = (permisos: Permisos) => {
        const resultado: string[] = [];

        if (permisos.reportes) {
            permisos.reportes.forEach(permiso => {
                const accionLabels: Record<string, string> = {
                    create: 'Crear reportes',
                    read: 'Ver reportes',
                    update: 'Actualizar reportes',
                    delete: 'Eliminar reportes',
                };
                resultado.push(accionLabels[permiso] || permiso);
            });
        }

        if (permisos.usuarios) {
            permisos.usuarios.forEach(permiso => {
                const accionLabels: Record<string, string> = {
                    create: 'Crear usuarios',
                    read: 'Ver usuarios',
                    update: 'Actualizar usuarios',
                    delete: 'Eliminar usuarios',
                };
                resultado.push(accionLabels[permiso] || permiso);
            });
        }

        return resultado;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!perfil) {
        return (
            <Box p={3}>
                <Alert severity="warning">No se pudo cargar la información del perfil</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Title title="Mi Perfil" />
            <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> Mi Perfil
            </Typography>

            <Grid container spacing={3}>
                {/* Información Personal */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Badge /> Información Personal
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Usuario
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {perfil.usuario}
                            </Typography>
                        </Box>

                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Rol
                            </Typography>
                            <Box mt={1}>
                                <Chip
                                    label={getRolLabel(perfil.rol)}
                                    color={getRolColor(perfil.rol)}
                                    size="medium"
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Información de Turno */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Schedule /> Turno Asignado
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {perfil.turnoInfo ? (
                            <>
                                <Box mb={2}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Nombre del Turno
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {perfil.turnoInfo.nombre}
                                    </Typography>
                                </Box>

                                {/* Solo mostrar detalles de horario para roles que no sean administrador ni autoridad */}
                                {perfil.rol !== 'administrador' && perfil.rol !== 'autoridad' && (
                                    <>
                                        <Box mb={2}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Horario
                                            </Typography>
                                            <Typography variant="body1">
                                                {perfil.turnoInfo.horario.inicio} - {perfil.turnoInfo.horario.fin}
                                            </Typography>
                                            {perfil.turnoInfo.cruzaMedianoche && (
                                                <Typography variant="caption" color="text.secondary">
                                                    (El turno cruza medianoche)
                                                </Typography>
                                            )}
                                        </Box>

                                        <Box mb={2}>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <CalendarMonth fontSize="small" /> Días de Trabajo
                                            </Typography>
                                            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                                                {perfil.turnoInfo.dias.map((dia) => (
                                                    <Chip
                                                        key={dia}
                                                        label={getDiaSemana(dia)}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                    />
                                                ))}
                                            </Box>
                                            {perfil.turnoInfo.incluyeFestivos && (
                                                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                                                    * Incluye días festivos
                                                </Typography>
                                            )}
                                        </Box>

                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            Puedes acceder al sistema 10 minutos antes de tu turno
                                        </Alert>
                                    </>
                                )}

                                {/* Para administradores y autoridades mostrar mensaje de acceso sin restricciones */}
                                {(perfil.rol === 'administrador' || perfil.rol === 'autoridad') && (
                                    <Alert severity="success" sx={{ mt: 2 }}>
                                        Tienes acceso al sistema sin restricciones de horario
                                    </Alert>
                                )}
                            </>
                        ) : (
                            <Alert severity="warning">
                                No hay información de turno disponible
                            </Alert>
                        )}
                    </Paper>
                </Grid>

                {/* Permisos */}
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Security /> Permisos del Sistema
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {perfil.rol === 'administrador' ? (
                            <Alert severity="success">
                                Como administrador, tienes acceso completo a todas las funcionalidades del sistema.
                            </Alert>
                        ) : (
                            <List>
                                {formatearPermisos(perfil.permisos).map((permiso, index) => (
                                    <ListItem key={index} disablePadding>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    • {permiso}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>

                {/* Información de Cuenta */}
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
                                    {new Date(perfil.createdAt).toLocaleString('es-MX')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Última Actualización
                                </Typography>
                                <Typography variant="body2">
                                    {new Date(perfil.updatedAt).toLocaleString('es-MX')}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
