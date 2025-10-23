# Sistema de Diseño - Guía de Uso

Este documento describe cómo usar el sistema de colores accesibles del proyecto.

## 📋 Tabla de Contenidos
- [Importación](#importación)
- [Uso Básico](#uso-básico)
- [Colores Disponibles](#colores-disponibles)
- [Accesibilidad](#accesibilidad)

## Importación

```typescript
import { colors } from './theme/colors';
```

## Uso Básico

### En componentes Material-UI

```tsx
<Box sx={{ bgcolor: colors.primary.main, color: colors.primary.contrast }}>
  Contenido
</Box>

<Button sx={{
  bgcolor: colors.primary.main,
  '&:hover': { bgcolor: colors.primary.dark }
}}>
  Botón
</Button>

<Typography sx={{ color: colors.text.primary }}>
  Texto principal
</Typography>
```

### En estilos inline

```tsx
<div style={{ backgroundColor: colors.background.paper }}>
  Contenido
</div>
```

## Colores Disponibles

### 🔴 Colores Primarios
```typescript
colors.primary.main      // #c62828 - Rojo principal
colors.primary.dark      // #8e0000 - Rojo oscuro
colors.primary.light     // #ff5f52 - Rojo claro
colors.primary.contrast  // #ffffff - Texto sobre primary
```

**Uso:**
- Botones principales
- Enlaces importantes
- Elementos de marca

### ⚠️ Colores de Estado

#### Error
```typescript
colors.error.main      // #c62828 - Error
colors.error.dark      // #8e0000 - Error oscuro
colors.error.light     // #ffebee - Fondo error
colors.error.contrast  // #ffffff - Texto sobre error
```

**Uso:**
- Alertas de error
- Mensajes de validación
- Estados de error

#### Success
```typescript
colors.success.main      // #2e7d32 - Verde
colors.success.dark      // #1b5e20 - Verde oscuro
colors.success.light     // #e8f5e9 - Fondo success
colors.success.contrast  // #ffffff - Texto sobre success
```

**Uso:**
- Confirmaciones
- Mensajes de éxito
- Notificaciones positivas

#### Warning
```typescript
colors.warning.main      // #f57c00 - Naranja
colors.warning.dark      // #e65100 - Naranja oscuro
colors.warning.light     // #fff3e0 - Fondo warning
colors.warning.contrast  // #000000 - Texto sobre warning
```

**Uso:**
- Advertencias
- Información importante
- Alertas no críticas

#### Info
```typescript
colors.info.main      // #0277bd - Azul
colors.info.dark      // #01579b - Azul oscuro
colors.info.light     // #e1f5fe - Fondo info
colors.info.contrast  // #ffffff - Texto sobre info
```

**Uso:**
- Información general
- Tips y ayudas
- Mensajes informativos

### ⚫ Neutros (Grises)
```typescript
colors.neutral.black   // #000000 - Negro puro
colors.neutral[900]    // #212121 - Casi negro
colors.neutral[800]    // #424242 - Gris muy oscuro
colors.neutral[700]    // #616161 - Gris oscuro
colors.neutral[600]    // #757575 - Gris medio-oscuro
colors.neutral[500]    // #9e9e9e - Gris medio
colors.neutral[400]    // #bdbdbd - Gris medio-claro
colors.neutral[300]    // #e0e0e0 - Gris claro
colors.neutral[200]    // #eeeeee - Gris muy claro
colors.neutral[100]    // #f5f5f5 - Casi blanco
colors.neutral.white   // #ffffff - Blanco puro
```

**Uso:**
- Fondos secundarios
- Separadores
- Sombras y bordes

### 📝 Colores de Texto
```typescript
colors.text.primary    // #000000 - Texto principal
colors.text.secondary  // #424242 - Texto secundario
colors.text.disabled   // #9e9e9e - Texto deshabilitado
colors.text.hint       // #757575 - Texto de ayuda
```

**Uso:**
- Párrafos y títulos principales: `colors.text.primary`
- Subtítulos y descripciones: `colors.text.secondary`
- Elementos deshabilitados: `colors.text.disabled`
- Placeholders y hints: `colors.text.hint`

### 🖼️ Colores de Borde
```typescript
colors.border.main   // #757575 - Borde principal
colors.border.light  // #e0e0e0 - Borde claro
colors.border.dark   // #424242 - Borde oscuro
colors.border.focus  // #c62828 - Borde en foco
```

**Uso:**
- Inputs y campos de formulario
- Tarjetas y contenedores
- Estados de foco

### 🎨 Fondos
```typescript
colors.background.default   // #ffffff - Fondo por defecto
colors.background.paper     // #ffffff - Fondo de tarjetas
colors.background.primary   // #c62828 - Fondo primario
colors.background.gradient  // Gradiente rojo
```

## Accesibilidad

### Ratios de Contraste WCAG 2.1

Todos los colores cumplen con WCAG 2.1:
- ✅ **AA Normal**: Mínimo 4.5:1
- ✅ **AA Grande**: Mínimo 3:1
- ✅ **AAA Normal**: Mínimo 7:1

### Ejemplos de Contraste

| Combinación | Ratio | Nivel |
|------------|-------|-------|
| `text.primary` sobre `background.default` | 21:1 | AAA |
| `text.secondary` sobre `background.default` | 11.26:1 | AAA |
| `primary.main` sobre `primary.contrast` | 4.52:1 | AA |
| `error.dark` sobre `error.light` | 10.59:1 | AAA |

### Mejores Prácticas

1. **Texto sobre fondos claros**: Usa `colors.text.primary` o `colors.text.secondary`
2. **Texto sobre fondos de color**: Usa `.contrast` del color correspondiente
3. **Bordes visibles**: Usa `colors.border.main` (ratio 5.74:1)
4. **Estados de foco**: Siempre usa `colors.border.focus` con un outline visible

## Ejemplos Completos

### Alert Accesible
```tsx
<Alert
  severity="error"
  icon={<ErrorOutline sx={{ color: colors.error.dark }} />}
  sx={{
    bgcolor: colors.error.light,
    border: `2px solid ${colors.error.main}`,
    '& .MuiAlert-message': {
      color: colors.neutral[900],
    },
  }}
>
  <AlertTitle sx={{ color: colors.error.dark }}>
    Error
  </AlertTitle>
  Mensaje de error
</Alert>
```

### TextField Accesible
```tsx
<TextField
  label="Campo"
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
      },
      '&:hover fieldset': {
        borderColor: colors.border.focus,
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.border.focus,
      },
    },
  }}
/>
```

### Button Accesible
```tsx
<Button
  sx={{
    bgcolor: colors.primary.main,
    color: colors.primary.contrast,
    '&:hover': {
      bgcolor: colors.primary.dark,
    },
    '&:focus': {
      outline: `3px solid ${colors.border.focus}`,
      outlineOffset: '2px',
    },
  }}
>
  Botón
</Button>
```

## 🔍 Verificación de Contraste

Para verificar el contraste de tus combinaciones de colores:
- Usa herramientas como [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Los valores de ratio están documentados en `colors.ts`

## 📚 Referencias

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Accessibility](https://material.io/design/usability/accessibility.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
