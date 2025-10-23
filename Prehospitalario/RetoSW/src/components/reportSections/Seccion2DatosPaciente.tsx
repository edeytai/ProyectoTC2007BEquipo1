import { Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box, useTheme } from '@mui/material';
import { getColors } from '../../theme/colors';

interface Seccion2Props {
  data: any;
  onChange: (section: string, data: any) => void;
}

export const Seccion2DatosPaciente = ({ data, onChange }: Seccion2Props) => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const sectionData = data.datosPaciente || {};

  const handleChange = (field: string, value: any) => {
    onChange('datosPaciente', {
      ...sectionData,
      [field]: value,
    });
  };

  return (
    <Grid container spacing={{ xs: 3, sm: 3 }}>
      <Grid item xs={12}>
        <Box sx={{
          border: `1px solid ${colors.border.light}`,
          borderRadius: { xs: 2, sm: 1 },
          p: { xs: 2.5, sm: 2 },
          bgcolor: colors.background.paper,
          boxShadow: { xs: '0 1px 3px rgba(0,0,0,0.08)', sm: 'none' },
        }}>
          <FormLabel
          sx={{
            color: colors.text.primary,
            fontWeight: 600,
            mb: { xs: 2.5, sm: 2 },
            display: 'block',
            fontSize: { xs: '1rem', sm: '0.95rem' },
          }}
        >
          Información Personal
        </FormLabel>
        <Grid container spacing={{ xs: 2.5, sm: 2.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Nombre Completo del Paciente"
              fullWidth
              value={sectionData.nombre || ''}
              onChange={(e) => handleChange('nombre', e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: 56, sm: 56 },
                  fontSize: { xs: '1rem', sm: '1rem' },
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '1rem', sm: '1rem' },
                },
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel
                sx={{
                  color: colors.text.primary,
                  fontWeight: 600,
                  mb: { xs: 1.5, sm: 1 },
                  fontSize: { xs: '1rem', sm: '0.9rem' },
                }}
              >
                Sexo
              </FormLabel>
              <RadioGroup
                row
                value={sectionData.sexo || ''}
                onChange={(e) => handleChange('sexo', e.target.value)}
                sx={{ gap: { xs: 1, sm: 0 } }}
              >
                <FormControlLabel
                  value="masculino"
                  control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: { xs: 28, sm: 24 } } }} />}
                  label="Masculino"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
                  }}
                />
                <FormControlLabel
                  value="femenino"
                  control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: { xs: 28, sm: 24 } } }} />}
                  label="Femenino"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Edad (Años)"
              type="number"
              fullWidth
              value={sectionData.edadAnios || ''}
              onChange={(e) => handleChange('edadAnios', e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: 56, sm: 56 },
                  fontSize: { xs: '1rem', sm: '1rem' },
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '1rem', sm: '1rem' },
                },
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Edad (Meses)"
              type="number"
              fullWidth
              value={sectionData.edadMeses || ''}
              onChange={(e) => handleChange('edadMeses', e.target.value)}
              helperText="Solo para menores de 1 año"
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: 56, sm: 56 },
                  fontSize: { xs: '1rem', sm: '1rem' },
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '1rem', sm: '1rem' },
                },
                '& .MuiFormHelperText-root': {
                  fontSize: { xs: '0.75rem', sm: '0.75rem' },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Ocupación"
              fullWidth
              value={sectionData.ocupacion || ''}
              onChange={(e) => handleChange('ocupacion', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              fullWidth
              value={sectionData.telefono || ''}
              onChange={(e) => handleChange('telefono', e.target.value)}
            />
          </Grid>
        </Grid>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{
          border: `1px solid ${colors.border.light}`,
          borderRadius: { xs: 2, sm: 1 },
          p: { xs: 2.5, sm: 2 },
          bgcolor: colors.background.paper,
          boxShadow: { xs: '0 1px 3px rgba(0,0,0,0.08)', sm: 'none' },
        }}>
          <FormLabel
          sx={{
            color: colors.text.primary,
            fontWeight: 600,
            mb: { xs: 2.5, sm: 2 },
            display: 'block',
            fontSize: { xs: '1rem', sm: '0.95rem' },
          }}
        >
          Domicilio
        </FormLabel>
        <Grid container spacing={{ xs: 2.5, sm: 2.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Calle y Número"
              fullWidth
              multiline
              rows={3}
              value={sectionData.domicilio || ''}
              onChange={(e) => handleChange('domicilio', e.target.value)}
              required
              helperText="Incluya calle, número exterior, número interior (si aplica)"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Colonia o Comunidad"
              fullWidth
              value={sectionData.colonia || ''}
              onChange={(e) => handleChange('colonia', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Alcaldía o Municipio"
              fullWidth
              value={sectionData.alcaldia || ''}
              onChange={(e) => handleChange('alcaldia', e.target.value)}
            />
          </Grid>
        </Grid>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{
          border: `1px solid ${colors.border.light}`,
          borderRadius: { xs: 2, sm: 1 },
          p: { xs: 2.5, sm: 2 },
          bgcolor: colors.background.paper,
          boxShadow: { xs: '0 1px 3px rgba(0,0,0,0.08)', sm: 'none' },
        }}>
          <FormLabel
          sx={{
            color: colors.text.primary,
            fontWeight: 600,
            mb: { xs: 2.5, sm: 2 },
            display: 'block',
            fontSize: { xs: '1rem', sm: '0.95rem' },
          }}
        >
          Información Médica
        </FormLabel>
        <Grid container spacing={{ xs: 2.5, sm: 2.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Derechohabiente a"
              fullWidth
              value={sectionData.derechohabiente || ''}
              onChange={(e) => handleChange('derechohabiente', e.target.value)}
              helperText="Ejemplo: IMSS, ISSSTE, INSABI, Seguro Popular, etc."
            />
          </Grid>
        </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
