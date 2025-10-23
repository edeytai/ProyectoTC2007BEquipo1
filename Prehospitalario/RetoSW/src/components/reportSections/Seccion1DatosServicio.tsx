import { Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box, useTheme, Accordion, AccordionSummary, AccordionDetails, Typography, useMediaQuery } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { getColors } from '../../theme/colors';

interface Seccion1Props {
  data: any;
  onChange: (section: string, data: any) => void;
}

export const Seccion1DatosServicio = ({ data, onChange }: Seccion1Props) => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const sectionData = data.datosServicio || {};
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (field: string, value: any) => {
    onChange('datosServicio', {
      ...sectionData,
      [field]: value,
    });
  };

  const SectionWrapper = isMobile ? Accordion : Box;
  const sectionProps = isMobile ? {
    defaultExpanded: true,
    sx: {
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      borderRadius: '8px !important',
      mb: 2,
      '&:before': { display: 'none' },
      '& .MuiAccordionSummary-root': {
        minHeight: 56,
        '&.Mui-expanded': { minHeight: 56 },
      },
    }
  } : {
    sx: {
      border: `1px solid ${colors.border.light}`,
      borderRadius: 1,
      p: 2,
      bgcolor: colors.background.paper,
    }
  };

  return (
    <Grid container spacing={{ xs: 2, sm: 2.5 }}>
      <Grid item xs={12}>
        <SectionWrapper {...sectionProps}>
          {isMobile && (
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ bgcolor: colors.background.paper }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: colors.text.primary }}>
                Cronometría del Servicio
              </Typography>
            </AccordionSummary>
          )}
          {!isMobile && (
            <FormLabel
              sx={{
                color: colors.text.primary,
                fontWeight: 600,
                mb: 2,
                display: 'block',
                fontSize: '0.95rem',
              }}
            >
              Cronometría del Servicio
            </FormLabel>
          )}
          <Box component={isMobile ? AccordionDetails : 'div'} sx={{ p: isMobile ? 2 : 0 }}>
          <Grid container spacing={{ xs: 2.5, sm: 2.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hora Llamada"
              type="time"
              fullWidth
              value={sectionData.horaLlamada || ''}
              onChange={(e) => handleChange('horaLlamada', e.target.value)}
              InputLabelProps={{
                shrink: true,
                sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
              }}
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: 56, sm: 56 },
                  fontSize: { xs: '1rem', sm: '1rem' },
                },
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Hora Traslado"
              type="time"
              fullWidth
              value={sectionData.horaTraslado || ''}
              onChange={(e) => handleChange('horaTraslado', e.target.value)}
              InputLabelProps={{
                shrink: true,
                sx: { fontSize: { xs: '1rem', sm: '0.875rem' } }
              }}
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: 56, sm: 56 },
                  fontSize: { xs: '1rem', sm: '1rem' },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Hora Salida"
              type="time"
              fullWidth
              value={sectionData.horaSalida || ''}
              onChange={(e) => handleChange('horaSalida', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Hora Hospital"
              type="time"
              fullWidth
              value={sectionData.horaHospital || ''}
              onChange={(e) => handleChange('horaHospital', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Hora Llegada"
              type="time"
              fullWidth
              value={sectionData.horaLlegada || ''}
              onChange={(e) => handleChange('horaLlegada', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Hora Salida Hospital"
              type="time"
              fullWidth
              value={sectionData.horaSalidaHospital || ''}
              onChange={(e) => handleChange('horaSalidaHospital', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Hora Base"
              type="time"
              fullWidth
              value={sectionData.horaBase || ''}
              onChange={(e) => handleChange('horaBase', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
          </Box>
        </SectionWrapper>
      </Grid>

      <Grid item xs={12}>
        <SectionWrapper {...sectionProps}>
          {isMobile && (
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ bgcolor: colors.background.paper }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: colors.text.primary }}>
                Motivo de la Atención
              </Typography>
            </AccordionSummary>
          )}
          <Box component={isMobile ? AccordionDetails : 'div'} sx={{ p: isMobile ? 2 : 0 }}>
          <FormControl component="fieldset" fullWidth>
          {!isMobile && (
            <FormLabel
              sx={{
                color: colors.text.primary,
                fontWeight: 600,
                mb: 1,
                fontSize: '0.95rem',
              }}
            >
              Motivo de la Atención
            </FormLabel>
          )}
          <RadioGroup
            value={sectionData.motivoAtencion || ''}
            onChange={(e) => handleChange('motivoAtencion', e.target.value)}
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            <FormControlLabel
              value="enfermedad"
              control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: { xs: 28, sm: 24 } } }} />}
              label="1- Enfermedad"
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: { xs: '1rem', sm: '0.875rem' }
                },
                py: { xs: 0.5, sm: 0 }
              }}
            />
            <FormControlLabel
              value="traumatismo"
              control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: { xs: 28, sm: 24 } } }} />}
              label="2- Traumatismo"
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: { xs: '1rem', sm: '0.875rem' }
                },
                py: { xs: 0.5, sm: 0 }
              }}
            />
            <FormControlLabel
              value="ginecoobstetrico"
              control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: { xs: 28, sm: 24 } } }} />}
              label="3- Ginecoobstétrico"
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: { xs: '1rem', sm: '0.875rem' }
                },
                py: { xs: 0.5, sm: 0 }
              }}
            />
          </RadioGroup>
        </FormControl>
          </Box>
        </SectionWrapper>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormControl component="fieldset">
          <FormLabel
            sx={{
              color: colors.text.primary,
              fontWeight: 600,
              mb: 1,
              fontSize: '0.95rem',
            }}
          >
            Lugar de Ocurrencia
          </FormLabel>
          <RadioGroup
            value={sectionData.lugarOcurrencia || ''}
            onChange={(e) => handleChange('lugarOcurrencia', e.target.value)}
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0.5, sm: 2 },
            }}
          >
            <FormControlLabel
              value="transporte-publico"
              control={<Radio />}
              label="Transporte Público"
            />
            <FormControlLabel value="escuela" control={<Radio />} label="Escuela" />
            <FormControlLabel value="trabajo" control={<Radio />} label="Trabajo" />
            <FormControlLabel value="hogar" control={<Radio />} label="Hogar" />
            <FormControlLabel
              value="recreacion-deporte"
              control={<Radio />}
              label="Recreación y Deporte"
            />
            <FormControlLabel value="via-publica" control={<Radio />} label="Vía Pública" />
          </RadioGroup>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm="auto" sx={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup
                value={sectionData.lugarOcurrencia || ''}
                onChange={(e) => handleChange('lugarOcurrencia', e.target.value)}
              >
                <FormControlLabel value="otra" control={<Radio />} label="Otra" />
              </RadioGroup>
            </Grid>
            {sectionData.lugarOcurrencia === 'otra' && (
              <Grid item xs={12} sm sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="Especifique el lugar de ocurrencia"
                  fullWidth
                  value={sectionData.lugarOcurrenciaOtra || ''}
                  onChange={(e) => handleChange('lugarOcurrenciaOtra', e.target.value)}
                  required
                  size="small"
                />
              </Grid>
            )}
          </Grid>
        </FormControl>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormLabel
          sx={{
            color: colors.text.primary,
            fontWeight: 600,
            mb: 2,
            display: 'block',
            mt: 1,
            fontSize: '0.95rem',
          }}
        >
          Ubicación del Servicio
        </FormLabel>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              label="Calle"
              fullWidth
              value={sectionData.calle || ''}
              onChange={(e) => handleChange('calle', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Entre calles"
              fullWidth
              value={sectionData.entreCalles || ''}
              onChange={(e) => handleChange('entreCalles', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Colonia o Comunidad"
              fullWidth
              value={sectionData.colonia || ''}
              onChange={(e) => handleChange('colonia', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Alcaldía o Municipio"
              fullWidth
              value={sectionData.alcaldia || ''}
              onChange={(e) => handleChange('alcaldia', e.target.value)}
              required
            />
          </Grid>
        </Grid>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormLabel
          sx={{
            color: colors.text.primary,
            fontWeight: 600,
            mb: 2,
            display: 'block',
            mt: 1,
            fontSize: '0.95rem',
          }}
        >
          Unidad de Atención
        </FormLabel>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Número de Ambulancia"
              fullWidth
              value={sectionData.numeroAmbulancia || ''}
              onChange={(e) => handleChange('numeroAmbulancia', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Operador"
              fullWidth
              value={sectionData.operador || ''}
              onChange={(e) => handleChange('operador', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="T.U.M. (Técnico en Urgencias Médicas)"
              fullWidth
              value={sectionData.tum || ''}
              onChange={(e) => handleChange('tum', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Socorrista"
              fullWidth
              value={sectionData.socorrista || ''}
              onChange={(e) => handleChange('socorrista', e.target.value)}
            />
          </Grid>
        </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
