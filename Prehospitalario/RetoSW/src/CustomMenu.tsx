import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment,
  LocalHospital,
  People,
} from '@mui/icons-material';
import { getColors } from './theme/colors';

export const CustomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const permissionsStr = localStorage.getItem('permissions');
    if (permissionsStr) {
      setPermissions(JSON.parse(permissionsStr));
    }
  }, []);

  // Verificar permisos
  const isAdmin = permissions.includes('*');
  const canViewReportes = permissions.includes('*') || permissions.includes('reportes.list');
  const canViewDashboard = permissions.includes('*') || permissions.includes('dashboard.show');

  // Filtrar menu items según permisos
  const allMenuItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon />, show: canViewDashboard },
    { label: 'Usuarios', path: '/usuarios', icon: <People />, show: isAdmin },
    { label: 'Reportes Prehospitalarios', path: '/reportes', icon: <Assessment />, show: canViewReportes },
  ];

  const menuItems = allMenuItems.filter(item => item.show);

  const isSelected = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: colors.background.paper,
        borderRight: `1px solid ${colors.border.light}`,
      }}
    >
      {/* Logo y título */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: `1px solid ${colors.border.light}`,
        }}
      >
        <Avatar
          sx={{
            bgcolor: colors.primary.main,
            width: 48,
            height: 48,
          }}
        >
          <LocalHospital sx={{ fontSize: 28 }} />
        </Avatar>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: colors.text.primary,
              fontSize: '1.1rem',
              lineHeight: 1.2,
            }}
          >
            Emergencias
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: colors.text.secondary,
              fontSize: '0.75rem',
            }}
          >
            Cuajimalpa
          </Typography>
        </Box>
      </Box>

      {/* Menu items */}
      <List sx={{ flex: 1, pt: 2, px: 2 }}>
        {menuItems.map((item) => {
          const selected = isSelected(item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={selected}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? colors.neutral[200] : colors.neutral[100],
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  bgcolor: colors.primary.light,
                  color: colors.primary.main,
                  fontWeight: 600,
                  boxShadow: theme.palette.mode === 'dark'
                    ? `0 4px 12px rgba(239, 83, 80, 0.2)`
                    : `0 4px 12px rgba(198, 40, 40, 0.15)`,
                  '&:hover': {
                    bgcolor: colors.primary.light,
                    transform: 'translateX(4px)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: colors.primary.main,
                  },
                },
                '& .MuiListItemIcon-root': {
                  minWidth: 40,
                  color: selected ? colors.primary.main : colors.text.secondary,
                },
                '& .MuiListItemText-primary': {
                  fontWeight: selected ? 600 : 500,
                  fontSize: '0.95rem',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  color: selected ? colors.text.primary : colors.text.secondary,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

    </Box>
  );
};
