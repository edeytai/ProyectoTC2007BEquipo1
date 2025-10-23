import { fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

import { BACKEND_URL } from '../config';

// Custom fetchJson que anade el token JWT en el header Authentication
const fetchJson = (url: string, options: fetchUtils.Options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }

  const token = sessionStorage.getItem('auth');
  if (token) {
    (options.headers as Headers).set('Authentication', token);
  }

  return fetchUtils.fetchJson(url, options);
};

// DataProvider basado en ra-data-json-server con autenticacion JWT
// Este proveedor conecta con el backend y automaticamente anade el token JWT a cada request
// Recursos disponibles: incidents, users
// El backend implementa control de permisos por roles:
// - Brigadistas: solo ven/editan sus propios incidentes
// - Coordinadores: ven todo, solo pueden cambiar estado
// - Autoridades: solo lectura
// - Admin: acceso total

export const dataProvider = jsonServerProvider(BACKEND_URL, fetchJson);
