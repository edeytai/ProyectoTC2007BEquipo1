// Colores base que no cambian entre temas
const baseColors = {
  // Colores Primarios (Rojo)
  primary: {
    main: '#c62828',
    dark: '#8e0000',
    light: '#ff5f52',
    lighter: '#ffebee',
    contrast: '#ffffff',
  },

  // Colores de Estado
  error: {
    main: '#c62828',
    dark: '#8e0000',
    light: '#ffebee',
    contrast: '#ffffff',
  },

  success: {
    main: '#2e7d32',
    dark: '#1b5e20',
    light: '#e8f5e9',
    contrast: '#ffffff',
  },

  warning: {
    main: '#f57c00',
    dark: '#e65100',
    light: '#fff3e0',
    contrast: '#000000',
  },

  info: {
    main: '#0277bd',
    dark: '#01579b',
    light: '#e1f5fe',
    contrast: '#ffffff',
  },
};

// Tema Claro
export const lightColors = {
  ...baseColors,

  // Escala de Grises para modo claro
  neutral: {
    black: '#000000',
    900: '#212121',
    800: '#424242',
    700: '#616161',
    600: '#757575',
    500: '#9e9e9e',
    400: '#bdbdbd',
    300: '#e0e0e0',
    200: '#eeeeee',
    100: '#f5f5f5',
    white: '#ffffff',
  },

  // Colores de Texto para modo claro
  text: {
    primary: '#000000',
    secondary: '#424242',
    disabled: '#9e9e9e',
    hint: '#757575',
  },

  // Colores de Bordes para modo claro
  border: {
    main: '#757575',
    light: '#e0e0e0',
    dark: '#424242',
    focus: '#c62828',
  },

  // Fondos para modo claro
  background: {
    default: '#fafafa',
    paper: '#ffffff',
    primary: '#c62828',
    gradient: 'linear-gradient(135deg, #c62828 0%, #8e0000 100%)',
  },
} as const;

// Tema Oscuro
export const darkColors = {
  ...baseColors,

  // Ajustes de colores primarios para modo oscuro
  primary: {
    main: '#ef5350',
    dark: '#c62828',
    light: '#ff867c',
    lighter: '#ffcdd2',
    contrast: '#000000',
  },

  // Escala de Grises para modo oscuro
  neutral: {
    black: '#ffffff',
    900: '#f5f5f5',
    800: '#e0e0e0',
    700: '#bdbdbd',
    600: '#9e9e9e',
    500: '#757575',
    400: '#616161',
    300: '#424242',
    200: '#303030',
    100: '#212121',
    white: '#000000',
  },

  // Colores de Texto para modo oscuro
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
    disabled: '#6e6e6e',
    hint: '#9e9e9e',
  },

  // Colores de Bordes para modo oscuro
  border: {
    main: '#616161',
    light: '#424242',
    dark: '#9e9e9e',
    focus: '#ef5350',
  },

  // Fondos para modo oscuro
  background: {
    default: '#121212',
    paper: '#1e1e1e',
    primary: '#ef5350',
    gradient: 'linear-gradient(135deg, #ef5350 0%, #c62828 100%)',
  },

  // Ajustes de colores de estado para modo oscuro
  error: {
    main: '#ef5350',
    dark: '#c62828',
    light: '#3a1a1a',
    contrast: '#000000',
  },

  success: {
    main: '#66bb6a',
    dark: '#2e7d32',
    light: '#1b3a1d',
    contrast: '#000000',
  },

  warning: {
    main: '#ffa726',
    dark: '#f57c00',
    light: '#3d2b1f',
    contrast: '#000000',
  },

  info: {
    main: '#29b6f6',
    dark: '#0277bd',
    light: '#1a2830',
    contrast: '#000000',
  },
} as const;

// Obtener los colores segun el modo
export const getColors = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkColors : lightColors;
};

// Export por defecto
export const colors = lightColors;

// Tipos para TypeScript
export type ColorKey = keyof typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type ErrorColor = keyof typeof colors.error;
export type SuccessColor = keyof typeof colors.success;
export type WarningColor = keyof typeof colors.warning;
export type InfoColor = keyof typeof colors.info;
export type NeutralColor = keyof typeof colors.neutral;
export type TextColor = keyof typeof colors.text;
export type BorderColor = keyof typeof colors.border;
export type BackgroundColor = keyof typeof colors.background;
