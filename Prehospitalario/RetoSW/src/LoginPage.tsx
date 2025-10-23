import { useLogin } from 'react-admin';
import { Box, TextField, Button, Typography, Paper, InputAdornment, IconButton, Alert, AlertTitle, useTheme, Tooltip } from '@mui/material';
import { Person, Lock, Visibility, VisibilityOff, ErrorOutline, Brightness4, Brightness7 } from '@mui/icons-material';
import { useState } from 'react';
import { getColors } from './theme/colors';
import { useThemeMode } from './theme/ThemeContext';

export const LoginPage = () => {
  const login = useLogin();
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const { mode, toggleTheme } = useThemeMode();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Enviar formulario de login
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const username = fd.get('username') as string;
    const password = fd.get('password') as string;

    try {
      await login({ username, password });
    } catch (err) {
      setError('Credenciales inválidas. Por favor, verifica tu información.');
    }
  };

  return (
    <Box
      component="main"
      role="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: colors.background.gradient,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '150%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'moveBackground 20s linear infinite',
        },
        '@keyframes moveBackground': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 12, sm: 16 },
          right: { xs: 12, sm: 16 },
          zIndex: 10,
        }}
      >
        <Tooltip title={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: colors.text.primary,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 1)',
              },
              '&:focus': {
                outline: `2px solid ${colors.border.focus}`,
                outlineOffset: '2px',
              },
            }}
            aria-label={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {mode === 'dark' ? <Brightness7 sx={{ fontSize: { xs: 20, sm: 24 } }} /> : <Brightness4 sx={{ fontSize: { xs: 20, sm: 24 } }} />}
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          width: '100%',
          maxWidth: 500,
          boxShadow: { xs: '0 10px 40px rgba(0,0,0,0.2)', sm: '0 20px 60px rgba(0,0,0,0.3)' },
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
          mx: { xs: 2, sm: 3 },
        }}
      >
        <Paper
          elevation={0}
          component="section"
          aria-labelledby="login-title"
          sx={{
            flex: 1,
            p: { xs: 3, sm: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            bgcolor: colors.background.paper,
          }}
        >
          <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                mb: { xs: 1.5, sm: 2 },
                color: colors.text.primary,
                letterSpacing: '-0.5px',
                textAlign: 'center',
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
              }}
            >
              Bienvenido
            </Typography>

            <Typography
              id="login-title"
              variant="h2"
              sx={{
                fontWeight: 600,
                mb: { xs: 3, sm: 4 },
                color: colors.primary.main,
                letterSpacing: '-0.5px',
                textAlign: 'center',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              }}
            >
              Iniciar Sesión
            </Typography>

            {error && (
              <Alert
                severity="error"
                icon={<ErrorOutline sx={{ color: colors.error.dark, fontSize: { xs: 20, sm: 24 } }} />}
                sx={{
                  mb: { xs: 2, sm: 3 },
                  bgcolor: colors.error.light,
                  border: `2px solid ${colors.error.main}`,
                  borderRadius: 2,
                  p: { xs: 1, sm: 1.5 },
                  '& .MuiAlert-message': {
                    color: colors.neutral[900],
                    width: '100%',
                  },
                }}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <AlertTitle sx={{ color: colors.error.dark, fontWeight: 600, mb: 0.5, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Error de autenticación
                </AlertTitle>
                <Typography variant="body2" sx={{ color: colors.neutral[900], fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {error}
                </Typography>
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={onSubmit}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              noValidate
              aria-label="Formulario de inicio de sesión"
            >
              <TextField
                name="username"
                label="Usuario"
                type="text"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                autoComplete="username"
                id="username-input"
                aria-required="true"
                aria-describedby="username-helper"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: colors.text.secondary }} aria-hidden="true" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  sx: { color: colors.text.secondary }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: colors.text.primary,
                    },
                    '& fieldset': {
                      borderColor: colors.border.main,
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: colors.border.focus,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.border.focus,
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.primary.main,
                  },
                }}
              />

              <TextField
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                required
                fullWidth
                margin="normal"
                variant="outlined"
                autoComplete="current-password"
                id="password-input"
                aria-required="true"
                aria-describedby="password-helper"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: colors.text.secondary }} aria-hidden="true" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: colors.text.secondary }}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        tabIndex={0}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  sx: { color: colors.text.secondary }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: colors.text.primary,
                    },
                    '& fieldset': {
                      borderColor: colors.border.main,
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: colors.border.focus,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.border.focus,
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.primary.main,
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                aria-label="Ingresar al sistema"
                sx={{
                  mt: { xs: 3, sm: 4 },
                  mb: 2,
                  py: { xs: 1.25, sm: 1.5 },
                  bgcolor: colors.primary.main,
                  color: colors.primary.contrast,
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(198, 40, 40, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: colors.primary.dark,
                    boxShadow: '0 6px 20px rgba(198, 40, 40, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  '&:focus': {
                    outline: `3px solid ${colors.border.focus}`,
                    outlineOffset: '2px',
                  },
                }}
              >
                Ingresar
              </Button>

              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: colors.text.secondary,
                  mt: 2,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
                role="note"
              >
                ¿Problemas para acceder? Contacta al administrador
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
