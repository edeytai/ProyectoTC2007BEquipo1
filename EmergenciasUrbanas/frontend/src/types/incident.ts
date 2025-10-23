export interface Incident {
  id: string;
  // Operativos
  solicitudMitigacion: string;
  fecha: string;
  hora: string;
  turno: 'matutino' | 'vespertino' | 'nocturno';
  modoActivacion: 'llamada' | 'oficio';
  personalACargo: string;
  // Atencion
  horaAtencion: string;
  tiempoTrasladoMin: number;
  kmsRecorridos: number;
  ubicacion: {
    lat: number;
    lng: number;
    calle: string;
    colonia: string;
    referencias?: string;
  };
  nivelGravedad: 'baja' | 'media' | 'alta';
  // Resultados
  trabajosRealizados: string[];
  observaciones: string;
  conclusionDictamen: string;
  // Participantes
  dependencias: string[];
  autoridadesIntervinientes: string[];
  responsableInmueble: string;
  // Clasificacion
  tipoEmergencia: 'inundacion' | 'incendio' | 'socavon' | 'deslave' | 'sismo' | 'fuga' | 'otro';
  // Flujo
  estadoReporte: 'draft' | 'en_revision' | 'aprobado' | 'cerrado';
  // Metadatos
  creadoPor: string;
  actualizadoPor?: string;
  createdAt: string;
  updatedAt?: string;
}