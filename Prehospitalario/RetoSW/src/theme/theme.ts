import { createTheme, ThemeOptions, PaletteMode } from '@mui/material/styles';
import { getColors } from './colors';

// Crear tema segun el modo
export const createAppTheme = (mode: PaletteMode) => {
  const colors = getColors(mode);

  const themeOptions: ThemeOptions = {
    sidebar: {
      width: 240,
      closedWidth: 55,
    },
    palette: {
      mode,
      primary: {
        main: colors.primary.main,
        dark: colors.primary.dark,
        light: colors.primary.light,
        contrastText: colors.primary.contrast,
      },
      error: {
        main: colors.error.main,
        dark: colors.error.dark,
        light: colors.error.light,
        contrastText: colors.error.contrast,
      },
      success: {
        main: colors.success.main,
        dark: colors.success.dark,
        light: colors.success.light,
        contrastText: colors.success.contrast,
      },
      warning: {
        main: colors.warning.main,
        dark: colors.warning.dark,
        light: colors.warning.light,
        contrastText: colors.warning.contrast,
      },
      info: {
        main: colors.info.main,
        dark: colors.info.dark,
        light: colors.info.light,
        contrastText: colors.info.contrast,
      },
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
        disabled: colors.text.disabled,
      },
      divider: colors.border.light,
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'dark'
              ? '0 2px 8px rgba(0,0,0,0.4)'
              : '0 2px 8px rgba(0,0,0,0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.primary.main,
            color: colors.primary.contrast,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.background.paper,
            borderRight: `1px solid ${colors.border.light}`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: colors.border.focus,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};
