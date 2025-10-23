import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Typography,
  useTheme,
  LinearProgress,
  useMediaQuery,
} from '@mui/material';
import { Close, NavigateBefore, NavigateNext, Save } from '@mui/icons-material';
import { getColors } from '../theme/colors';
import { useCreate, useNotify } from 'react-admin';
import {
  Seccion1DatosServicio,
  Seccion2DatosPaciente,
  Seccion3Parto,
  Seccion4CausaTraumatica,
  Seccion5CausaClinica,
  Seccion6EvaluacionInicial,
  Seccion9Traslado,
  Seccion10Tratamiento,
  Seccion11DatosLegales,
} from './reportSections';

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
}

const allSteps = [
  'Datos del Servicio',
  'Datos del Paciente',
  'Parto',
  'Causa Traumática',
  'Causa Clínica',
  'Evaluación Inicial',
  'Traslado',
  'Tratamiento',
  'Datos Legales',
];

export const ReportDialog = ({ open, onClose }: ReportDialogProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const [create] = useCreate();
  const notify = useNotify();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Calcular pasos visibles segun motivo de atencion
  const getVisibleSteps = () => {
    const motivoAtencion = formData.datosServicio?.motivoAtencion;

    if (!motivoAtencion) {
      // Mostrar todos los pasos si no hay motivo
      return allSteps;
    }

    const baseSteps = ['Datos del Servicio', 'Datos del Paciente'];
    let specificStep = '';

    if (motivoAtencion === 'ginecoobstetrico') {
      specificStep = 'Parto';
    } else if (motivoAtencion === 'traumatismo') {
      specificStep = 'Causa Traumática';
    } else if (motivoAtencion === 'enfermedad') {
      specificStep = 'Causa Clínica';
    }

    const endSteps = [
      'Evaluación Inicial',
      'Traslado',
      'Tratamiento',
      'Datos Legales',
    ];

    return [...baseSteps, specificStep, ...endSteps];
  };

  const steps = getVisibleSteps();

  const handleNext = () => {
    // Avanzar al siguiente paso
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    // Retroceder al paso anterior
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSave = async () => {
    try {
      console.log('📝 Datos del formulario a guardar:', formData);
      console.log('📋 Estructura completa:', JSON.stringify(formData, null, 2));

      await create(
        'reportes',
        { data: formData },
        {
          onSuccess: () => {
            notify('Reporte guardado exitosamente', { type: 'success' });
            onClose();
            setActiveStep(0);
            setFormData({});
          },
          onError: (error: any) => {
            notify(`Error al guardar el reporte: ${error.message}`, { type: 'error' });
          },
        }
      );
    } catch (error) {
      console.error('Error guardando reporte:', error);
      notify('Error al guardar el reporte', { type: 'error' });
    }
  };

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const renderSection = () => {
    const sectionProps = {
      data: formData,
      onChange: updateFormData,
    };

    const currentStepName = steps[activeStep];

    switch (currentStepName) {
      case 'Datos del Servicio':
        return <Seccion1DatosServicio {...sectionProps} />;
      case 'Datos del Paciente':
        return <Seccion2DatosPaciente {...sectionProps} />;
      case 'Parto':
        return <Seccion3Parto {...sectionProps} />;
      case 'Causa Traumática':
        return <Seccion4CausaTraumatica {...sectionProps} />;
      case 'Causa Clínica':
        return <Seccion5CausaClinica {...sectionProps} />;
      case 'Evaluación Inicial':
        return <Seccion6EvaluacionInicial {...sectionProps} />;
      case 'Traslado':
        return <Seccion9Traslado {...sectionProps} />;
      case 'Tratamiento':
        return <Seccion10Tratamiento {...sectionProps} />;
      case 'Datos Legales':
        return <Seccion11DatosLegales {...sectionProps} />;
      default:
        return null;
    }
  };

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          bgcolor: colors.background.paper,
          height: isMobile ? '100dvh' : '95vh',
          maxHeight: isMobile ? '100dvh' : '95vh',
          m: isMobile ? 0 : 1,
          borderRadius: isMobile ? 0 : 2,
          display: 'flex',
          flexDirection: 'column',
          position: isMobile ? 'fixed' : 'relative',
          top: isMobile ? 0 : 'auto',
          left: isMobile ? 0 : 'auto',
          right: isMobile ? 0 : 'auto',
          bottom: isMobile ? 0 : 'auto',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: colors.primary.main,
          color: colors.primary.contrast,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: { xs: 1.5, sm: 1.5 },
          px: { xs: 2, sm: 3 },
          pt: {
            xs: 'max(1.5rem, env(safe-area-inset-top))',
            sm: 1.5
          },
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.9rem', sm: '1.25rem' },
            pr: 2,
            lineHeight: 1.3,
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Nuevo Reporte de Emergencia Prehospitalaria
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            Nuevo Reporte
          </Box>
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: colors.primary.contrast,
            p: { xs: 0.5, sm: 1 },
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
          aria-label="Cerrar formulario"
        >
          <Close sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
      </DialogTitle>

      {/* Barra de progreso */}
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
            Paso {activeStep + 1} de {steps.length}
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: 600, fontSize: '0.875rem' }}>
            {Math.round(progress)}% completado
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: colors.neutral[200],
            '& .MuiLinearProgress-bar': {
              bgcolor: colors.primary.main,
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* Stepper (oculto en mobile) */}
      <Box sx={{ px: 2, pt: 2, display: { xs: 'none', lg: 'block' } }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    color: colors.text.secondary,
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  '& .MuiStepLabel-label.Mui-active': {
                    color: colors.primary.main,
                    fontWeight: 600,
                  },
                  '& .MuiStepLabel-label.Mui-completed': {
                    color: colors.success.main,
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Contenido */}
      <DialogContent
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          pb: { xs: 3, sm: 2 },
          flex: '1 1 auto',
          overflow: 'auto',
          minHeight: 0,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          '&::-webkit-scrollbar': {
            width: { xs: '4px', sm: '8px' },
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: colors.background.default,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: colors.neutral[400],
            borderRadius: '4px',
            '&:hover': {
              bgcolor: colors.neutral[500],
            },
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: colors.text.primary,
            fontWeight: 600,
            mb: { xs: 2.5, sm: 2.5 },
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            position: 'sticky',
            top: -16,
            bgcolor: colors.background.paper,
            zIndex: 1,
            py: 1,
            mt: -1,
          }}
        >
          {steps[activeStep]}
        </Typography>
        {renderSection()}
      </DialogContent>

      {/* Botones de navegacion */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 2 },
          pb: { xs: 2, sm: 2 },
          marginBottom: {
            xs: 'env(safe-area-inset-bottom)',
            sm: 0
          },
          borderTop: `1px solid ${colors.border.light}`,
          bgcolor: colors.background.paper,
          gap: 1,
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
          boxShadow: isMobile ? `0 -2px 8px rgba(0,0,0,0.1)` : 'none',
        }}
      >
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<NavigateBefore sx={{ fontSize: { xs: 20, sm: 24 } }} />}
          sx={{
            color: colors.text.primary,
            fontSize: { xs: '0.9rem', sm: '0.875rem' },
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1, sm: 1 },
            minHeight: { xs: 44, sm: 40 },
            '&:disabled': {
              color: colors.text.disabled,
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Anterior</Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Atrás</Box>
        </Button>

        <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 } }}>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<Save sx={{ fontSize: { xs: 20, sm: 20 } }} />}
              sx={{
                bgcolor: colors.success.main,
                color: colors.success.contrast,
                fontSize: { xs: '0.9rem', sm: '0.875rem' },
                px: { xs: 2.5, sm: 3 },
                py: { xs: 1, sm: 1 },
                minHeight: { xs: 44, sm: 40 },
                fontWeight: 600,
                boxShadow: { xs: '0 2px 8px rgba(46,125,50,0.3)', sm: 'default' },
                '&:hover': {
                  bgcolor: colors.success.dark,
                },
              }}
            >
              Guardar
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NavigateNext sx={{ fontSize: { xs: 20, sm: 24 } }} />}
              sx={{
                bgcolor: colors.primary.main,
                color: colors.primary.contrast,
                fontSize: { xs: '0.9rem', sm: '0.875rem' },
                px: { xs: 2.5, sm: 3 },
                py: { xs: 1, sm: 1 },
                minHeight: { xs: 44, sm: 40 },
                fontWeight: 600,
                boxShadow: { xs: '0 2px 8px rgba(198,40,40,0.3)', sm: 'default' },
                '&:hover': {
                  bgcolor: colors.primary.dark,
                },
              }}
            >
              Siguiente
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};
