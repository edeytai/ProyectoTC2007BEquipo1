type UserRole = 'brigadista' | 'coordinador' | 'autoridad' | 'admin';

interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
}

import { BACKEND_URL } from '../config';

export const authProvider = {
  login: async ({ username, password }: any) => {
    const request = new Request(`${BACKEND_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });

    try {
      const response = await fetch(request);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      }

      const auth = await response.json();

      sessionStorage.setItem('auth', auth.token);
      sessionStorage.setItem('identity', JSON.stringify({
        id: auth.id,
        username: auth.username,
        fullName: auth.fullName,
        role: auth.role
      }));

      return Promise.resolve();

    } catch {
      throw new Error('Usuario o contraseña incorrectos');
    }
  },

  logout: () => {
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('identity');
    return Promise.resolve();
  },

  checkAuth: () => {
    return sessionStorage.getItem('auth')
      ? Promise.resolve()
      : Promise.reject();
  },

  checkError: ({ status }: any) => {
    if (status === 401 || status === 403) {
      sessionStorage.removeItem('auth');
      sessionStorage.removeItem('identity');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => {
    const identityStr = sessionStorage.getItem('identity');
    if (!identityStr) return Promise.reject();

    const identity: User = JSON.parse(identityStr);
    return Promise.resolve(identity.role);
  },

  getIdentity: () => {
    const identityStr = sessionStorage.getItem('identity');
    if (!identityStr) return Promise.reject();

    const identity: User = JSON.parse(identityStr);
    return Promise.resolve({
      id: identity.id,
      fullName: identity.fullName,
      role: identity.role
    });
  }
};