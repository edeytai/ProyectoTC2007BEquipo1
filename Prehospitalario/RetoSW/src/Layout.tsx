import type { ReactNode } from "react";
import { useState } from "react";
import { CheckForApplicationUpdate } from "react-admin";
import { Box, useMediaQuery, Theme, useTheme } from "@mui/material";
import { CustomAppBar } from "./CustomAppBar";
import { CustomMenu } from "./CustomMenu";
import { getColors } from "./theme/colors";
import { FueraDeTurno } from "./FueraDeTurno";

// Ancho de la barra lateral
const SIDEBAR_WIDTH = 240;
// Altura de la barra superior
const APPBAR_HEIGHT = 64;

export function Layout(props: { children: ReactNode }) {
  // Verificar si el usuario esta en su turno
  const enTurnoTexto = localStorage.getItem('enTurno');
  let enTurno = false;
  if (enTurnoTexto === 'true') {
    enTurno = true;
  }

  // Obtener el token
  const token = localStorage.getItem('token');

  // Si hay token pero no esta en turno, mostrar pantalla de fuera de turno
  if (token) {
    if (!enTurno) {
      return <FueraDeTurno />;
    }
  }

  // Obtener los hijos del componente
  const children = props.children;

  // Estado para controlar si el menu esta abierto
  const resultadoEstado = useState(true);
  const menuAbierto = resultadoEstado[0];
  const setMenuAbierto = resultadoEstado[1];

  // Obtener el tema actual
  const theme = useTheme();
  const modoTema = theme.palette.mode;
  const colors = getColors(modoTema);

  // Funcion para abrir/cerrar el menu
  function toggleMenu() {
    const nuevoEstado = !menuAbierto;
    setMenuAbierto(nuevoEstado);
  }

  // Calcular el ancho del menu
  const anchoMenu = 240;

  // Calcular el margen izquierdo del contenido
  let margenIzquierdo = 0;
  if (menuAbierto) {
    margenIzquierdo = anchoMenu;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Barra superior */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        zIndex: 1300
      }}>
        <CustomAppBar onMenuToggle={toggleMenu} />
      </div>

      {/* Menu lateral */}
      <div style={{
        position: 'fixed',
        top: '64px',
        left: 0,
        width: anchoMenu + 'px',
        height: 'calc(100vh - 64px)',
        transform: menuAbierto ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s',
        zIndex: 1200
      }}>
        <CustomMenu />
      </div>

      {/* Contenido principal */}
      <div style={{
        marginTop: '64px',
        marginLeft: margenIzquierdo + 'px',
        padding: '20px',
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: colors.background.default,
        transition: 'margin-left 0.3s'
      }}>
        {children}
      </div>

      <CheckForApplicationUpdate />
    </div>
  );
}
