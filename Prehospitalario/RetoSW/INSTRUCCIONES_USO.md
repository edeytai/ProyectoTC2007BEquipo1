# Sistema de Emergencias Prehospitalarias - Instrucciones de Uso

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js (v18 o superior)
- MongoDB instalado y corriendo
- npm o yarn

### 1. Configuración Inicial

#### Instalar MongoDB
Sigue las instrucciones en `SETUP_MONGODB.md`

#### Instalar dependencias del proyecto
```bash
# Frontend
npm install

# Backend (en otra terminal)
cd server
npm install
```

### 2. Iniciar el Sistema

#### Terminal 1: Iniciar MongoDB
```bash
# macOS
brew services start mongodb-community

# O manualmente
mongod
```

#### Terminal 2: Iniciar el servidor backend
```bash
cd server
npm run dev
```

Deberías ver:
```
✅ Conectado a MongoDB
📊 Base de datos: emergencias_prehospitalarias_TC2007B
🚀 Servidor corriendo en http://localhost:3001
```

#### Terminal 3: Iniciar el frontend
```bash
npm run dev
```

El sistema estará disponible en: **http://localhost:5173**

## 📝 Uso del Sistema

### Crear un Nuevo Reporte

1. **Hacer clic en el botón flotante "+" (esquina inferior derecha)**
   - Este botón está siempre visible sin importar en qué página estés

2. **Completar el formulario paso a paso:**

   **Paso 1: Datos del Servicio**
   - Cronometría del Servicio (horarios)
   - Motivo de Atención (Enfermedad, Traumatismo, o Ginecoobstétrico)
   - Lugar de Ocurrencia
   - Ubicación del Servicio
   - Unidad de Atención (ambulancia, personal)

   **Paso 2: Datos del Paciente**
   - Información Personal (nombre, sexo, edad, ocupación, teléfono)
   - Domicilio
   - Información Médica

   **Paso 3: Sección Específica** (según motivo de atención seleccionado)
   - Si es **Ginecoobstétrico**: Datos de Parto
   - Si es **Traumatismo**: Causa Traumática
   - Si es **Enfermedad**: Causa Clínica

   **Paso 4: Evaluación Inicial**
   - Nivel de Conciencia
   - Deglución
   - Vía Aérea
   - Ventilación
   - Auscultación
   - Pulsos
   - Calidad
   - Piel
   - Características

   **Paso 5: Traslado**
   - Hospital de destino
   - Doctor que recibe
   - Folio CRU

   **Paso 6: Tratamiento**
   - Vía Aérea
   - Control Cervical
   - Asistencia Ventilatoria
   - Control de Hemorragias
   - Vías Venosas y Solución
   - Atención Básica
   - Pertenencias del paciente

   **Paso 7: Datos Legales**
   - Autoridades que tomaron conocimiento
   - Vehículos involucrados (con opción de agregar múltiples)

3. **Guardar el reporte**
   - Al finalizar todos los pasos, hacer clic en "Guardar Reporte"
   - El reporte se guardará automáticamente en MongoDB
   - Verás una notificación de éxito

### Ver Reportes Existentes

1. En el menú lateral, hacer clic en "Reportes Prehospitalarios"
2. Verás una tabla con todos los reportes guardados mostrando:
   - Fecha de Creación
   - Nombre del Paciente
   - Número de Ambulancia
   - Motivo de Atención
   - Ubicación
   - Hospital Destino

## 🔧 Características Importantes

### Navegación del Formulario
- **Siguiente**: Avanza al siguiente paso
- **Anterior**: Retrocede al paso anterior
- **Progreso**: Barra de progreso muestra el % completado
- **Stepper**: Muestra todos los pasos del proceso (visible en pantallas grandes)

### Formulario Dinámico
El formulario se adapta según el **Motivo de Atención** seleccionado:
- **Enfermedad** → Muestra "Causa Clínica"
- **Traumatismo** → Muestra "Causa Traumática"
- **Ginecoobstétrico** → Muestra "Parto"

### Campos Condicionales
- **Lugar de Ocurrencia "Otra"** → Muestra campo de texto para especificar
- **Accidente Automovilístico "Sí"** → Muestra todos los campos relacionados con accidente
- **Tipo de Servicio "Subsecuente"** → Muestra campo de fecha del servicio anterior
- **Origen Probable "Otro"** → Muestra campo de texto para especificar

### Vehículos Involucrados
- Inicia con un vehículo
- **"+ Agregar vehículo"** para añadir más
- **"Eliminar"** para quitar vehículos (siempre debe haber mínimo 1)

## 🗄️ Base de Datos

### Estructura
Todos los datos se guardan en MongoDB con la siguiente estructura:

```javascript
{
  datosServicio: { ... },
  datosPaciente: { ... },
  parto: { ... },           // Solo si motivo = ginecoobstetrico
  causaTraumatica: { ... }, // Solo si motivo = traumatismo
  causaClinica: { ... },    // Solo si motivo = enfermedad
  evaluacionInicial: { ... },
  traslado: { ... },
  tratamiento: { ... },
  datosLegales: { ... },
  createdAt: Date,
  updatedAt: Date
}
```

### Consultar la Base de Datos

```bash
# Conectar a MongoDB
mongosh emergencias_prehospitalarias_TC2007B

# Ver todos los reportes
db.reportes.find().pretty()

# Contar reportes
db.reportes.countDocuments()

# Buscar por motivo de atención
db.reportes.find({ "datosServicio.motivoAtencion": "traumatismo" })
```

## 🎨 Temas

El sistema soporta tema claro y oscuro:
- Cambiar con el botón en la barra superior derecha
- La preferencia se guarda localmente

## ⚠️ Solución de Problemas

### El botón "+" no aparece
- Verificar que estés logueado en el sistema
- El botón está en la esquina inferior derecha

### Error al guardar reporte
1. Verificar que MongoDB esté corriendo
2. Verificar que el servidor backend esté corriendo en http://localhost:3001
3. Revisar la consola del navegador para errores

### No se conecta a MongoDB
1. Verificar que MongoDB esté instalado e iniciado
2. Verificar la URL de conexión en `server/.env`
3. Reiniciar el servidor backend

### Puerto ocupado
Si el puerto 3001 está ocupado:
1. Cambiar el puerto en `server/.env`
2. Actualizar `VITE_API_URL` en `.env` del frontend
3. Reiniciar ambos servidores

## 📦 Estructura del Proyecto

```
RetoSW/
├── src/                          # Frontend React
│   ├── components/
│   │   ├── ReportDialog.tsx      # Modal del formulario
│   │   └── reportSections/       # Secciones del formulario
│   ├── reportes.tsx              # Lista de reportes
│   ├── dataProvider.ts           # Conexión con API
│   └── App.tsx                   # Aplicación principal
├── server/                       # Backend Node.js
│   └── src/
│       ├── models/
│       │   └── Reporte.js        # Modelo MongoDB
│       ├── routes/
│       │   └── reportes.js       # API endpoints
│       └── index.js              # Servidor Express
└── SETUP_MONGODB.md              # Instrucciones MongoDB
```
