import { useState, useEffect } from 'react';
import { UserMenu, Logout, useLogout, useGetIdentity } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  Toolbar,
  MenuItem,
  IconButton,
  Tooltip,
  Box,
  Button,
  Avatar,
  useTheme,
  Typography,
  Divider,
  Menu,
  ListItemIcon,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Add,
  AccountCircle,
  Menu as MenuIcon,
  Person,
  ExitToApp,
  History,
} from '@mui/icons-material';
import { useThemeMode } from './theme/ThemeContext';
import { ReportDialog } from './components/ReportDialog';
import { getColors } from './theme/colors';
import type { User } from './authProvider';

interface CustomAppBarProps {
  onMenuToggle?: () => void;
}

export const CustomAppBar = function(props: CustomAppBarProps) {
  // Obtener la funcion onMenuToggle de las propiedades
  const onMenuToggle = props.onMenuToggle;

  // Obtener funciones y datos del tema
  const themeContext = useThemeMode();
  const mode = themeContext.mode;
  const toggleTheme = themeContext.toggleTheme;

  // Estado para controlar si el dialogo de reporte esta abierto
  const openReportState = useState(false);
  const openReport = openReportState[0];
  const setOpenReport = openReportState[1];

  // Estado para el elemento de anclaje del menu
  const anchorElState = useState<null | HTMLElement>(null);
  const anchorEl = anchorElState[0];
  const setAnchorEl = anchorElState[1];

  // Obtener el tema actual
  const theme = useTheme();
  const themeMode = theme.palette.mode;
  const colors = getColors(themeMode);

  // Funciones de react-admin
  const logout = useLogout();
  const navigate = useNavigate();
  const identityData = useGetIdentity();
  const identity = identityData.data;
  const isLoading = identityData.isLoading;

  // Estado para informacion del usuario
  const userInfoState = useState<User | null>(null);
  const userInfo = userInfoState[0];
  const setUserInfo = userInfoState[1];

  // Estado para permisos
  const canCreateReportesState = useState(false);
  const canCreateReportes = canCreateReportesState[0];
  const setCanCreateReportes = canCreateReportesState[1];

  const isAdminState = useState(false);
  const isAdmin = isAdminState[0];
  const setIsAdmin = isAdminState[1];

  // Cargar informacion del usuario al montar el componente
  useEffect(function() {
    // Obtener datos del localStorage
    const userStr = localStorage.getItem('user');
    const permissionsStr = localStorage.getItem('permissions');

    // Si existe informacion del usuario, cargarla
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUserInfo(parsedUser);
    }

    // Si existen permisos, procesarlos
    if (permissionsStr) {
      const permissions = JSON.parse(permissionsStr);

      // Verificar si el usuario es paramedico
      const hasCreatePermission = permissions.includes('reportes.create');
      const hasListPermission = permissions.includes('reportes.list');
      const hasShowPermission = permissions.includes('reportes.show');
      const hasAllPermissions = permissions.includes('*');

      const isParamedico = hasCreatePermission && !hasListPermission && !hasShowPermission && !hasAllPermissions;

      // Determinar si puede crear reportes
      // Mostrar boton de crear solo para usuarios que NO sean paramedicos
      let canCreate = false;
      if (!isParamedico) {
        if (hasAllPermissions) {
          canCreate = true;
        }
        if (hasCreatePermission) {
          canCreate = true;
        }
      }

      setCanCreateReportes(canCreate);
      setIsAdmin(hasAllPermissions);
    }
  }, []);

  // Funcion para abrir el menu de usuario
  function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
    const target = event.currentTarget;
    setAnchorEl(target);
  }

  // Funcion para cerrar el menu
  function handleMenuClose() {
    setAnchorEl(null);
  }

  // Funcion para ir al perfil
  function handleProfileClick() {
    handleMenuClose();
    navigate('/perfil');
  }

  // Funcion para cerrar sesion
  function handleLogout() {
    handleMenuClose();
    logout();
  }

  // Objeto con etiquetas de roles
  const rolLabels: Record<string, string> = {
    administrador: 'Administrador',
    jefe_turno: 'Jefe de Turno',
    paramedico: 'Paramédico',
    autoridad: 'Autoridad',
  };

  // Funcion para obtener iniciales del usuario
  function getUserInitials() {
    // Si no hay usuario, devolver 'U'
    if (!userInfo) {
      return 'U';
    }
    if (!userInfo.usuario) {
      return 'U';
    }

    // Separar el nombre en palabras
    const names = userInfo.usuario.split(' ');

    // Si hay al menos dos nombres, usar las iniciales de los primeros dos
    if (names.length >= 2) {
      const firstInitial = names[0][0];
      const secondInitial = names[1][0];
      const initials = firstInitial + secondInitial;
      return initials.toUpperCase();
    }

    // Si solo hay un nombre, usar los primeros dos caracteres
    const twoChars = userInfo.usuario.substring(0, 2);
    return twoChars.toUpperCase();
  }

  return (
    <>
      <MuiAppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: colors.primary.main,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 2px 8px rgba(0,0,0,0.3)'
            : '0 2px 8px rgba(0,0,0,0.08)',
          borderBottom: `1px solid ${colors.border.light}`,
        }}
      >
        <Toolbar sx={{ px: { xs: 1.5, sm: 3 }, py: 1.5, minHeight: { xs: 56, sm: 64 } }}>
          {/* Boton de menu */}
          <Tooltip title="Alternar menú">
            <IconButton
              onClick={onMenuToggle}
              sx={{
                color: colors.primary.contrast,
                mr: { xs: 1, sm: 2 },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
              aria-label="Alternar menú"
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <Box sx={{ flex: 1 }} />

          {/* Boton de nuevo reporte */}
          {canCreateReportes && (
            <Button
              onClick={() => setOpenReport(true)}
              startIcon={<Add />}
              variant="contained"
              sx={{
                bgcolor: colors.neutral.white,
                color: colors.primary.main,
                mr: { xs: 1, sm: 2 },
                fontWeight: 700,
                px: { xs: 2, sm: 3 },
                py: { xs: 0.75, sm: 1 },
                borderRadius: 2,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 12px rgba(255,255,255,0.15)'
                  : '0 4px 12px rgba(198,40,40,0.2)',
                textTransform: 'none',
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                '&:hover': {
                  bgcolor: colors.neutral[50],
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 6px 16px rgba(255,255,255,0.2)'
                    : '0 6px 16px rgba(198,40,40,0.25)',
                },
                transition: 'all 0.2s ease',
                '& .MuiButton-startIcon': {
                  marginRight: { xs: 0.5, sm: 1 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              }}
              aria-label="Crear nuevo reporte de emergencia"
            >
              Nuevo Reporte
            </Button>
          )}

          {/* Boton de historial (solo administradores) */}
          {isAdmin && (
            <Button
              onClick={() => navigate('/log')}
              startIcon={<History />}
              variant="outlined"
              sx={{
                borderColor: colors.neutral.white,
                color: colors.neutral.white,
                mr: { xs: 1, sm: 2 },
                fontWeight: 600,
                px: { xs: 2, sm: 3 },
                py: { xs: 0.75, sm: 1 },
                borderRadius: 2,
                textTransform: 'none',
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderColor: colors.neutral.white,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
                '& .MuiButton-startIcon': {
                  marginRight: { xs: 0.5, sm: 1 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              }}
              aria-label="Ver historial de actividad"
            >
              Historial
            </Button>
          )}

          {/* Boton de cambio de tema */}
          <Tooltip title={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: colors.primary.contrast,
                mr: { xs: 1, sm: 2 },
                p: { xs: 0.5, sm: 1 },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
                '&:focus': {
                  outline: `2px solid ${colors.neutral.white}`,
                  outlineOffset: '2px',
                },
              }}
              aria-label={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {mode === 'dark' ? <Brightness7 sx={{ fontSize: { xs: 20, sm: 24 } }} /> : <Brightness4 sx={{ fontSize: { xs: 20, sm: 24 } }} />}
            </IconButton>
          </Tooltip>

          {/* Menu de usuario */}
          <Tooltip title={userInfo ? `${userInfo.usuario} (${rolLabels[userInfo.rol]})` : 'Usuario'}>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                p: 0,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  bgcolor: colors.neutral.white,
                  color: colors.primary.main,
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                }}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                marginTop: 1,
                borderRadius: 2,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0,0,0,0.4)'
                  : '0 8px 32px rgba(0,0,0,0.12)',
                minWidth: { xs: 220, sm: 250 },
              },
            }}
          >
            <MenuItem disableRipple sx={{ cursor: 'default', '&:hover': { bgcolor: 'transparent' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, width: '100%' }}>
                <Avatar
                  sx={{
                    bgcolor: colors.primary.light,
                    color: colors.primary.main,
                    width: 48,
                    height: 48,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}
                >
                  {getUserInitials()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
                    {userInfo?.usuario || 'Usuario'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                    {userInfo ? rolLabels[userInfo.rol] : 'Rol'}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleProfileClick}
              sx={{
                fontWeight: 500,
                py: 1.5,
                '&:hover': {
                  bgcolor: colors.primary.light + '20',
                }
              }}
            >
              <ListItemIcon>
                <Person sx={{ color: colors.primary.main }} />
              </ListItemIcon>
              <Typography variant="body2">Mi Perfil</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: colors.error.main,
                fontWeight: 500,
                py: 1.5,
                '&:hover': {
                  bgcolor: colors.error.main + '10',
                }
              }}
            >
              <ListItemIcon>
                <ExitToApp sx={{ color: colors.error.main }} />
              </ListItemIcon>
              <Typography variant="body2">Cerrar Sesión</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </MuiAppBar>

      <ReportDialog open={openReport} onClose={() => setOpenReport(false)} />
    </>
  );
};