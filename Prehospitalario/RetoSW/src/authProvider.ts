import { AuthProvider } from "react-admin";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export type UserRole = 'paramedico' | 'jefe_turno' | 'autoridad' | 'administrador';

export interface User {
    id: string;
    usuario: string;
    rol: UserRole;
    turno: string;
}

// Permisos de cada rol
const rolePermissions: Record<UserRole, string[]> = {
    paramedico: [
        'reportes.create',
    ],
    jefe_turno: [
        'reportes.list',
        'reportes.show',
        'reportes.create',
        'dashboard.show',
    ],
    autoridad: [
        'reportes.list',
        'reportes.show',
        'dashboard.show',
    ],
    administrador: ['*'],
};

export const authProvider: AuthProvider = {
    async login(parametros) {
        try {
            const nombreUsuario = parametros.username;
            const contraseña = parametros.password;

            const urlLogin = API_URL + '/usuarios/login';

            const cuerpoLogin = {
                username: nombreUsuario,
                password: contraseña
            };
            const cuerpoLoginTexto = JSON.stringify(cuerpoLogin);

            const respuesta = await fetch(urlLogin, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: cuerpoLoginTexto,
            });

            const codigoRespuesta = respuesta.status;
            if (codigoRespuesta === 401) {
                const error = new Error("Credenciales inválidas. Por favor, verifica tu información.");
                throw error;
            }

            const respuestaExitosa = respuesta.ok;
            if (!respuestaExitosa) {
                const error = new Error("Error al iniciar sesión. Por favor, intenta de nuevo.");
                throw error;
            }

            const datosUsuario = await respuesta.json();

            const token = datosUsuario.token;
            localStorage.setItem("token", token);

            const usuarioTexto = JSON.stringify(datosUsuario);
            localStorage.setItem("user", usuarioTexto);

            const idUsuario = datosUsuario.id;
            localStorage.setItem("userId", idUsuario);

            const usuario = datosUsuario.usuario;
            localStorage.setItem("username", usuario);

            const rol = datosUsuario.rol;
            localStorage.setItem("role", rol);

            const turno = datosUsuario.turno;
            localStorage.setItem("turno", turno);

            let permisosDelRol = rolePermissions[rol];
            if (!permisosDelRol) {
                permisosDelRol = [];
            }
            const permisosTexto = JSON.stringify(permisosDelRol);
            localStorage.setItem("permissions", permisosTexto);

            const estaEnTurno = datosUsuario.enTurno;
            let enTurnoTexto = "false";
            if (estaEnTurno) {
                enTurnoTexto = "true";
            }
            localStorage.setItem("enTurno", enTurnoTexto);

            const informacionTurno = datosUsuario.turnoInfo;
            const turnoInfoTexto = JSON.stringify(informacionTurno);
            localStorage.setItem("turnoInfo", turnoInfoTexto);

            if (!estaEnTurno) {
                return Promise.resolve(false);
            }

            const resultadoLogin = { redirectTo: '/' };
            return Promise.resolve(resultadoLogin);
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("turno");
        localStorage.removeItem("permissions");
        localStorage.removeItem("enTurno");
        localStorage.removeItem("turnoInfo");
    },

    async checkError(parametros) {
        const codigoEstado = parametros.status;

        if (codigoEstado === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("userId");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            localStorage.removeItem("turno");
            localStorage.removeItem("permissions");
            localStorage.removeItem("enTurno");
            localStorage.removeItem("turnoInfo");

            const error = new Error("Sesión expirada");
            throw error;
        }
    },

    async checkAuth() {
        const nombreUsuario = localStorage.getItem("username");

        if (!nombreUsuario) {
            const error = new Error("Autenticación requerida");
            throw error;
        }
    },

    async getPermissions() {
        const permisosTexto = localStorage.getItem("permissions");

        if (permisosTexto) {
            const permisos = JSON.parse(permisosTexto);
            return permisos;
        } else {
            return [];
        }
    },

    async getIdentity() {
        const usuarioTexto = localStorage.getItem("user");

        if (!usuarioTexto) {
            const error = new Error("Usuario no autenticado");
            throw error;
        }

        const usuario = JSON.parse(usuarioTexto) as User;

        const etiquetasDeRoles: Record<UserRole, string> = {
            paramedico: 'Paramédico',
            jefe_turno: 'Jefe de Turno',
            autoridad: 'Autoridad',
            administrador: 'Administrador',
        };

        const rolDelUsuario = usuario.rol;
        const etiquetaDelRol = etiquetasDeRoles[rolDelUsuario];
        const nombreCompleto = usuario.usuario + ' (' + etiquetaDelRol + ')';

        const identidad = {
            id: usuario.id,
            fullName: nombreCompleto,
            avatar: undefined,
        };

        return identidad;
    },
};
