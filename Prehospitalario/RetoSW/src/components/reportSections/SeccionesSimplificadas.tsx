import { Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Typography, Box, Button, useTheme } from '@mui/material';
import { getColors } from '../../theme/colors';

interface SeccionProps {
  data: any;
  onChange: (section: string, data: any) => void;
}

export const Seccion3Parto = ({ data, onChange }: SeccionProps) => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const sectionData = data.parto || {};

  const handleChange = (field: string, value: any) => {
    onChange('parto', { ...sectionData, [field]: value });
  };

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Semanas de Gestación"
                type="number"
                fullWidth
                value={sectionData.semanasGesta || ''}
                onChange={(e) => handleChange('semanasGesta', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Hora de Inicio de Contracciones"
                type="time"
                fullWidth
                value={sectionData.horaContracciones || ''}
                onChange={(e) => handleChange('horaContracciones', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Frecuencia de Contracciones (minutos)"
                fullWidth
                value={sectionData.frecuenciaContracciones || ''}
                onChange={(e) => handleChange('frecuenciaContracciones', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Duración de Contracciones (segundos)"
                fullWidth
                value={sectionData.duracionContracciones || ''}
                onChange={(e) => handleChange('duracionContracciones', e.target.value)}
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
          Datos del Recién Nacido (si aplica)
        </FormLabel>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Hora de Nacimiento"
              type="time"
              fullWidth
              value={sectionData.horaNacimiento || ''}
              onChange={(e) => handleChange('horaNacimiento', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl component="fieldset">
              <FormLabel sx={{ color: colors.text.primary, mb: 1 }}>Producto</FormLabel>
              <RadioGroup
                row
                value={sectionData.producto || ''}
                onChange={(e) => handleChange('producto', e.target.value)}
              >
                <FormControlLabel value="vivo" control={<Radio />} label="Vivo" />
                <FormControlLabel value="muerto" control={<Radio />} label="Muerto" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl component="fieldset">
              <FormLabel sx={{ color: colors.text.primary, mb: 1 }}>Sexo</FormLabel>
              <RadioGroup
                row
                value={sectionData.sexoProducto || ''}
                onChange={(e) => handleChange('sexoProducto', e.target.value)}
              >
                <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
                <FormControlLabel value="femenino" control={<Radio />} label="Femenino" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Puntaje APGAR"
              fullWidth
              value={sectionData.apgar || ''}
              onChange={(e) => handleChange('apgar', e.target.value)}
              helperText="Formato: 1min, 5min, 10min"
            />
          </Grid>
        </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export const Seccion4CausaTraumatica = ({ data, onChange }: SeccionProps) => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const sectionData = data.causaTraumatica || {};

  const handleChange = (field: string, value: any) => {
    onChange('causaTraumatica', { ...sectionData, [field]: value });
  };

  const agentesOptions = [
    'Arma', 'Juguete', 'Explosión', 'Fuego', 'Animal', 'Bicicleta',
    'Automotor', 'Maquinaria', 'Herramienta', 'Electricidad',
    'Sustancia Caliente', 'Sustancia Tóxica', 'Producto Biológico', 'Ser Humano'
  ];

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormLabel
            sx={{
              color: colors.text.primary,
              fontWeight: 600,
              mb: 1,
              display: 'block',
              fontSize: '0.95rem',
            }}
          >
            Agente Causal
          </FormLabel>
        <FormGroup
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {agentesOptions.map((agente) => (
            <FormControlLabel
              key={agente}
              control={
                <Checkbox
                  checked={sectionData.agentes?.includes(agente) || false}
                  onChange={(e) => {
                    const current = sectionData.agentes || [];
                    const updated = e.target.checked
                      ? [...current, agente]
                      : current.filter((a: string) => a !== agente);
                    handleChange('agentes', updated);
                  }}
                />
              }
              label={agente}
            />
          ))}
        </FormGroup>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm="auto" sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.agentes?.includes('Otro') || false}
                    onChange={(e) => {
                      const current = sectionData.agentes || [];
                      const updated = e.target.checked
                        ? [...current, 'Otro']
                        : current.filter((a: string) => a !== 'Otro');
                      handleChange('agentes', updated);
                    }}
                  />
                }
                label="Otro"
              />
            </Grid>
            {sectionData.agentes?.includes('Otro') && (
              <Grid item xs={12} sm sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="Especifique el agente causal"
                  fullWidth
                  value={sectionData.especificar || ''}
                  onChange={(e) => handleChange('especificar', e.target.value)}
                  required
                  size="small"
                />
              </Grid>
            )}
          </Grid>
        </Box>
        </Box>
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
            ¿Accidente Automovilístico?
          </FormLabel>
          <RadioGroup
            row
            value={sectionData.accidenteAutomovilistico || ''}
            onChange={(e) => handleChange('accidenteAutomovilistico', e.target.value)}
          >
            <FormControlLabel value="si" control={<Radio />} label="Sí" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>

        {sectionData.accidenteAutomovilistico === 'si' && (
          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel sx={{ color: colors.text.primary, mb: 1 }}>Tipo</FormLabel>
                <RadioGroup
                  value={sectionData.tipoAccidente || ''}
                  onChange={(e) => handleChange('tipoAccidente', e.target.value)}
                  sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 0.5, sm: 2 },
                  }}
                >
                  <FormControlLabel value="colision" control={<Radio />} label="Colisión" />
                  <FormControlLabel value="volcadura" control={<Radio />} label="Volcadura" />
                  <FormControlLabel value="automotor" control={<Radio />} label="Automotor" />
                  <FormControlLabel value="bicicleta" control={<Radio />} label="Bicicleta" />
                  <FormControlLabel value="motocicleta" control={<Radio />} label="Motocicleta" />
                  <FormControlLabel value="maquinaria" control={<Radio />} label="Maquinaria" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel sx={{ color: colors.text.primary, mb: 1 }}>Contra Objeto Fijo</FormLabel>
                <RadioGroup
                  row
                  value={sectionData.contraObjetoFijo || ''}
                  onChange={(e) => handleChange('contraObjetoFijo', e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="si" control={<Radio />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel sx={{ color: colors.text.primary, mb: 1 }}>Impacto</FormLabel>
                <RadioGroup
                  row
                  value={sectionData.tipoImpacto || ''}
                  onChange={(e) => handleChange('tipoImpacto', e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="posterior" control={<Radio />} label="Posterior" />
                  <FormControlLabel value="rotacional" control={<Radio />} label="Rotacional" />
                  <FormControlLabel value="frontal" control={<Radio />} label="Frontal" />
                  <FormControlLabel value="lateral" control={<Radio />} label="Lateral" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel sx={{ color: colors.text.primary, mb: 1 }}>Parabrisas</FormLabel>
                <RadioGroup
                  row
                  value={sectionData.parabrisas || ''}
                  onChange={(e) => handleChange('parabrisas', e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="integro" control={<Radio />} label="Íntegro" />
                  <FormControlLabel value="estrellado" control={<Radio />} label="Estrellado" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel sx={{ color: colors.text.primary, mb: 1 }}>Volante</FormLabel>
                <RadioGroup
                  row
                  value={sectionData.volante || ''}
                  onChange={(e) => handleChange('volante', e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="integro" control={<Radio />} label="Íntegro" />
                  <FormControlLabel value="doblado" control={<Radio />} label="Doblado" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel sx={{ color: colors.text.primary, mb: 1 }}>Bolsa de Aire</FormLabel>
                <RadioGroup
                  row
                  value={sectionData.bolsaAire || ''}
                  onChange={(e) => handleChange('bolsaAire', e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="si" control={<Radio />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel sx={{ color: colors.text.primary, mb: 1 }}>Cinturón de Seguridad</FormLabel>
                <RadioGroup
                  row
                  value={sectionData.cinturon || ''}
                  onChange={(e) => handleChange('cinturon', e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="colocado" control={<Radio />} label="Colocado" />
                  <FormControlLabel value="no-colocado" control={<Radio />} label="No Colocado" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel sx={{ color: colors.text.primary, mb: 1 }}>Víctima</FormLabel>
                <RadioGroup
                  row
                  value={sectionData.victima || ''}
                  onChange={(e) => handleChange('victima', e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="dentro-vehiculo" control={<Radio />} label="Dentro del vehículo" />
                  <FormControlLabel value="eyectado" control={<Radio />} label="Eyectado" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel sx={{ color: colors.text.primary, mb: 1 }}>Atropellado</FormLabel>
                <RadioGroup
                  row
                  value={sectionData.atropellado || ''}
                  onChange={(e) => handleChange('atropellado', e.target.value)}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="automotor" control={<Radio />} label="Automotor" />
                  <FormControlLabel value="moto" control={<Radio />} label="Moto" />
                  <FormControlLabel value="bici" control={<Radio />} label="Bici" />
                  <FormControlLabel value="maquinaria" control={<Radio />} label="Maquinaria" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        )}
        </Box>
      </Grid>
    </Grid>
  );
};

export const Seccion5CausaClinica = ({ data, onChange }: SeccionProps) => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const sectionData = data.causaClinica || {};

  const handleChange = (field: string, value: any) => {
    onChange('causaClinica', { ...sectionData, [field]: value });
  };

  const origenesOptions = [
    'Neurológica', 'Infecciosa', 'Musculo Esquelético', 'Urogenital',
    'Digestiva', 'Cardiovascular', 'Oncológico', 'Metabólico',
    'Ginecoobstétrica', 'Respiratorio', 'Cognitivo', 'Emocional', 'Otro'
  ];

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormLabel
            sx={{
              color: colors.text.primary,
              fontWeight: 600,
              mb: 1,
              display: 'block',
              fontSize: '0.95rem',
            }}
          >
            Origen Probable
          </FormLabel>
          <FormGroup
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {origenesOptions.map((origen) => (
            <FormControlLabel
              key={origen}
              control={
                <Checkbox
                  checked={sectionData.origenes?.includes(origen) || false}
                  onChange={(e) => {
                    const current = sectionData.origenes || [];
                    const updated = e.target.checked
                      ? [...current, origen]
                      : current.filter((o: string) => o !== origen);
                    handleChange('origenes', updated);
                  }}
                />
              }
              label={origen}
            />
          ))}
        </FormGroup>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormControl component="fieldset">
          <FormLabel sx={{ color: colors.text.primary, mb: 1 }}>Tipo de Servicio</FormLabel>
          <RadioGroup
            row
            value={sectionData.tipoServicio || ''}
            onChange={(e) => handleChange('tipoServicio', e.target.value)}
            sx={{ gap: 3 }}
          >
            <FormControlLabel value="primera-vez" control={<Radio />} label="1.ª Vez" />
            <FormControlLabel value="subsecuente" control={<Radio />} label="Subsecuente" />
          </RadioGroup>
        </FormControl>

        {sectionData.tipoServicio === 'subsecuente' && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Fecha del Servicio Anterior"
              type="date"
              fullWidth
              value={sectionData.fechaAnterior || ''}
              onChange={(e) => handleChange('fechaAnterior', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
        )}
        </Box>
      </Grid>

      {sectionData.origenes?.includes('Otro') && (
        <Grid item xs={12}>
          <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
            <TextField
            label="Especifique el origen probable"
            fullWidth
            value={sectionData.especificar || ''}
            onChange={(e) => handleChange('especificar', e.target.value)}
            required
          />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export const Seccion6EvaluacionInicial = ({ data, onChange }: SeccionProps) => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const sectionData = data.evaluacionInicial || {};

  const handleChange = (field: string, value: any) => {
    onChange('evaluacionInicial', { ...sectionData, [field]: value });
  };

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ color: colors.text.primary, fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
              Nivel de Conciencia
            </FormLabel>
            <RadioGroup
              row
              value={sectionData.nivelConsciencia || ''}
              onChange={(e) => handleChange('nivelConsciencia', e.target.value)}
              sx={{ gap: 3 }}
            >
              <FormControlLabel value="alerta" control={<Radio />} label="Alerta" />
              <FormControlLabel value="verbal" control={<Radio />} label="Verbal" />
              <FormControlLabel value="dolor" control={<Radio />} label="Dolor" />
              <FormControlLabel value="inconsciente" control={<Radio />} label="Inconsciente" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ color: colors.text.primary, fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
              Deglución
            </FormLabel>
            <RadioGroup
              row
              value={sectionData.deglucion || ''}
              onChange={(e) => handleChange('deglucion', e.target.value)}
              sx={{ gap: 3 }}
            >
              <FormControlLabel value="ausente" control={<Radio />} label="Ausente" />
              <FormControlLabel value="presente" control={<Radio />} label="Presente" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ color: colors.text.primary, fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
              Vía Aérea
            </FormLabel>
            <RadioGroup
              row
              value={sectionData.viaAerea || ''}
              onChange={(e) => handleChange('viaAerea', e.target.value)}
              sx={{ gap: 3 }}
            >
              <FormControlLabel value="permeable" control={<Radio />} label="Permeable" />
              <FormControlLabel value="comprometida" control={<Radio />} label="Comprometida" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ color: colors.text.primary, fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
              Ventilación
            </FormLabel>
            <RadioGroup
              row
              value={sectionData.ventilacion || ''}
              onChange={(e) => handleChange('ventilacion', e.target.value)}
              sx={{ gap: 3 }}
            >
              <FormControlLabel value="regular" control={<Radio />} label="Regular" />
              <FormControlLabel value="irregular" control={<Radio />} label="Irregular" />
              <FormControlLabel value="apnea" control={<Radio />} label="Apnea" />
              <FormControlLabel value="rapida" control={<Radio />} label="Rápida" />
              <FormControlLabel value="superficial" control={<Radio />} label="Superficial" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ color: colors.text.primary, fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
              Auscultación
            </FormLabel>
            <RadioGroup
              row
              value={sectionData.auscultacion || ''}
              onChange={(e) => handleChange('auscultacion', e.target.value)}
              sx={{ gap: 3 }}
            >
              <FormControlLabel value="normal" control={<Radio />} label="Normal" />
              <FormControlLabel value="disminuidos" control={<Radio />} label="Disminuidos" />
              <FormControlLabel value="ausentes" control={<Radio />} label="Ausentes" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ color: colors.text.primary, fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
              Pulsos
            </FormLabel>
            <RadioGroup
              row
              value={sectionData.pulsos || ''}
              onChange={(e) => handleChange('pulsos', e.target.value)}
              sx={{ gap: 3 }}
            >
              <FormControlLabel value="carotideo" control={<Radio />} label="Carotídeo" />
              <FormControlLabel value="radial" control={<Radio />} label="Radial" />
              <FormControlLabel value="paro" control={<Radio />} label="Paro cardiorrespiratorio" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ color: colors.text.primary, fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
              Calidad
            </FormLabel>
            <RadioGroup
              row
              value={sectionData.calidad || ''}
              onChange={(e) => handleChange('calidad', e.target.value)}
              sx={{ gap: 3 }}
            >
              <FormControlLabel value="rapido" control={<Radio />} label="Rápido" />
              <FormControlLabel value="lento" control={<Radio />} label="Lento" />
              <FormControlLabel value="ritmico" control={<Radio />} label="Rítmico" />
              <FormControlLabel value="arritmico" control={<Radio />} label="Arrítmico" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ color: colors.text.primary, fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
              Piel
            </FormLabel>
            <RadioGroup
              row
              value={sectionData.piel || ''}
              onChange={(e) => handleChange('piel', e.target.value)}
              sx={{ gap: 3 }}
            >
              <FormControlLabel value="normal" control={<Radio />} label="Normal" />
              <FormControlLabel value="palida" control={<Radio />} label="Pálida" />
              <FormControlLabel value="cianotica" control={<Radio />} label="Cianótica" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ color: colors.text.primary, fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
              Características
            </FormLabel>
            <RadioGroup
              row
              value={sectionData.caracteristicas || ''}
              onChange={(e) => handleChange('caracteristicas', e.target.value)}
              sx={{ gap: 3 }}
            >
              <FormControlLabel value="caliente" control={<Radio />} label="Caliente" />
              <FormControlLabel value="fria" control={<Radio />} label="Fría" />
              <FormControlLabel value="diaforetica" control={<Radio />} label="Diaforética" />
              <FormControlLabel value="normotermico" control={<Radio />} label="Normotérmico" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
  );
};

export const Seccion7ExploracionFisica = ({ data, onChange }: SeccionProps) => null;

export const Seccion8SignosVitales = ({ data, onChange }: SeccionProps) => null;

export const Seccion9Traslado = ({ data, onChange }: SeccionProps) => {
  const sectionData = data.traslado || {};
  const handleChange = (field: string, value: any) => {
    onChange('traslado', { ...sectionData, [field]: value });
  };

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <TextField
          label="Hospital"
          fullWidth
          value={sectionData.hospital || ''}
          onChange={(e) => handleChange('hospital', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Dr."
          fullWidth
          value={sectionData.doctor || ''}
          onChange={(e) => handleChange('doctor', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Folio CRU"
          fullWidth
          value={sectionData.folioCRU || ''}
          onChange={(e) => handleChange('folioCRU', e.target.value)}
        />
      </Grid>
    </Grid>
  );
};

export const Seccion10Tratamiento = ({ data, onChange }: SeccionProps) => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const sectionData = data.tratamiento || {};

  const handleChange = (field: string, value: any) => {
    onChange('tratamiento', {
      ...sectionData,
      [field]: value,
    });
  };

  const handleCheckboxChange = (category: string, field: string, checked: boolean) => {
    const categoryData = sectionData[category] || {};
    onChange('tratamiento', {
      ...sectionData,
      [category]: {
        ...categoryData,
        [field]: checked,
      },
    });
  };

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 2 }}>
          <FormLabel
            sx={{
              color: colors.text.primary,
              fontWeight: 600,
              mb: 1.5,
              display: 'block',
              fontSize: '0.95rem',
            }}
          >
            Vía Aérea
          </FormLabel>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viaAerea?.aspiracion || false}
                    onChange={(e) => handleCheckboxChange('viaAerea', 'aspiracion', e.target.checked)}
                  />
                }
                label="Aspiración"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viaAerea?.canulaOrofaringea || false}
                    onChange={(e) => handleCheckboxChange('viaAerea', 'canulaOrofaringea', e.target.checked)}
                  />
                }
                label="Cánula orofaríngea"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viaAerea?.canulaNasofaringea || false}
                    onChange={(e) => handleCheckboxChange('viaAerea', 'canulaNasofaringea', e.target.checked)}
                  />
                }
                label="Cánula nasofaríngea"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viaAerea?.intubacionOrotraqueal || false}
                    onChange={(e) => handleCheckboxChange('viaAerea', 'intubacionOrotraqueal', e.target.checked)}
                  />
                }
                label="Intubación orotraqueal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viaAerea?.combitubo || false}
                    onChange={(e) => handleCheckboxChange('viaAerea', 'combitubo', e.target.checked)}
                  />
                }
                label="Combitubo"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viaAerea?.intubacionNasotraqueal || false}
                    onChange={(e) => handleCheckboxChange('viaAerea', 'intubacionNasotraqueal', e.target.checked)}
                  />
                }
                label="Intubación nasotraqueal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viaAerea?.mascarillaLaringea || false}
                    onChange={(e) => handleCheckboxChange('viaAerea', 'mascarillaLaringea', e.target.checked)}
                  />
                }
                label="Mascarilla laríngea"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viaAerea?.cricotiroidotomia || false}
                    onChange={(e) => handleCheckboxChange('viaAerea', 'cricotiroidotomia', e.target.checked)}
                  />
                }
                label="Cricotiroidotomía por punción"
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
              mb: 1.5,
              display: 'block',
              fontSize: '0.95rem',
            }}
          >
            Control Cervical
          </FormLabel>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.controlCervical?.manual || false}
                    onChange={(e) => handleCheckboxChange('controlCervical', 'manual', e.target.checked)}
                  />
                }
                label="Manual"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.controlCervical?.collarinRigido || false}
                    onChange={(e) => handleCheckboxChange('controlCervical', 'collarinRigido', e.target.checked)}
                  />
                }
                label="Collarín rígido"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.controlCervical?.collarinBlando || false}
                    onChange={(e) => handleCheckboxChange('controlCervical', 'collarinBlando', e.target.checked)}
                  />
                }
                label="Collarín blando"
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
              mb: 1.5,
              display: 'block',
              fontSize: '0.95rem',
            }}
          >
            Asistencia Ventilatoria
          </FormLabel>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.asistenciaVentilatoria?.balonValvulaMascarilla || false}
                    onChange={(e) => handleCheckboxChange('asistenciaVentilatoria', 'balonValvulaMascarilla', e.target.checked)}
                  />
                }
                label="Balón-válvula mascarilla"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.asistenciaVentilatoria?.valvulaDemanda || false}
                    onChange={(e) => handleCheckboxChange('asistenciaVentilatoria', 'valvulaDemanda', e.target.checked)}
                  />
                }
                label="Válvula de demanda"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.asistenciaVentilatoria?.hiperventilacion || false}
                    onChange={(e) => handleCheckboxChange('asistenciaVentilatoria', 'hiperventilacion', e.target.checked)}
                  />
                }
                label="Hiperventilación"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.asistenciaVentilatoria?.puntasNasales || false}
                    onChange={(e) => handleCheckboxChange('asistenciaVentilatoria', 'puntasNasales', e.target.checked)}
                  />
                }
                label="Puntas nasales"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.asistenciaVentilatoria?.mascarillaSimple || false}
                    onChange={(e) => handleCheckboxChange('asistenciaVentilatoria', 'mascarillaSimple', e.target.checked)}
                  />
                }
                label="Mascarilla simple"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.asistenciaVentilatoria?.mascarillaReservorio || false}
                    onChange={(e) => handleCheckboxChange('asistenciaVentilatoria', 'mascarillaReservorio', e.target.checked)}
                  />
                }
                label="Mascarilla con reservorio"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.asistenciaVentilatoria?.mascarillaVenturi || false}
                    onChange={(e) => handleCheckboxChange('asistenciaVentilatoria', 'mascarillaVenturi', e.target.checked)}
                  />
                }
                label="Mascarilla venturi"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.asistenciaVentilatoria?.ventiladorAutomatico || false}
                    onChange={(e) => handleCheckboxChange('asistenciaVentilatoria', 'ventiladorAutomatico', e.target.checked)}
                  />
                }
                label="Ventilador automático"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.asistenciaVentilatoria?.descompresionPleural || false}
                    onChange={(e) => handleCheckboxChange('asistenciaVentilatoria', 'descompresionPleural', e.target.checked)}
                  />
                }
                label="Descompresión pleural con agua"
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
              mb: 1.5,
              display: 'block',
              fontSize: '0.95rem',
            }}
          >
            Control de Hemorragias
          </FormLabel>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.controlHemorragias?.presionDirecta || false}
                    onChange={(e) => handleCheckboxChange('controlHemorragias', 'presionDirecta', e.target.checked)}
                  />
                }
                label="Presión directa"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.controlHemorragias?.presionIndirecta || false}
                    onChange={(e) => handleCheckboxChange('controlHemorragias', 'presionIndirecta', e.target.checked)}
                  />
                }
                label="Presión indirecta"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.controlHemorragias?.vendajeCompresivo || false}
                    onChange={(e) => handleCheckboxChange('controlHemorragias', 'vendajeCompresivo', e.target.checked)}
                  />
                }
                label="Vendaje compresivo"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.controlHemorragias?.crioterapia || false}
                    onChange={(e) => handleCheckboxChange('controlHemorragias', 'crioterapia', e.target.checked)}
                  />
                }
                label="Crioterapia"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.controlHemorragias?.mast || false}
                    onChange={(e) => handleCheckboxChange('controlHemorragias', 'mast', e.target.checked)}
                  />
                }
                label="MAST"
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
              mb: 1.5,
              display: 'block',
              fontSize: '0.95rem',
            }}
          >
            Vías Venosas y Solución
          </FormLabel>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viasVenosas?.hartmann || false}
                    onChange={(e) => handleCheckboxChange('viasVenosas', 'hartmann', e.target.checked)}
                  />
                }
                label="Hartmann"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viasVenosas?.nacl || false}
                    onChange={(e) => handleCheckboxChange('viasVenosas', 'nacl', e.target.checked)}
                  />
                }
                label="NaCl 0.9%"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viasVenosas?.mixta || false}
                    onChange={(e) => handleCheckboxChange('viasVenosas', 'mixta', e.target.checked)}
                  />
                }
                label="Mixta"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viasVenosas?.glucosa || false}
                    onChange={(e) => handleCheckboxChange('viasVenosas', 'glucosa', e.target.checked)}
                  />
                }
                label="Glucosa 5%"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.viasVenosas?.otra || false}
                    onChange={(e) => handleCheckboxChange('viasVenosas', 'otra', e.target.checked)}
                  />
                }
                label="Otra"
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
              mb: 1.5,
              display: 'block',
              fontSize: '0.95rem',
            }}
          >
            Atención Básica
          </FormLabel>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.atencionBasica?.rcpBasica || false}
                    onChange={(e) => handleCheckboxChange('atencionBasica', 'rcpBasica', e.target.checked)}
                  />
                }
                label="RCP básica"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.atencionBasica?.rcpAvanzada || false}
                    onChange={(e) => handleCheckboxChange('atencionBasica', 'rcpAvanzada', e.target.checked)}
                  />
                }
                label="RCP avanzada"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.atencionBasica?.curacion || false}
                    onChange={(e) => handleCheckboxChange('atencionBasica', 'curacion', e.target.checked)}
                  />
                }
                label="Curación"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.atencionBasica?.inmovilizacion || false}
                    onChange={(e) => handleCheckboxChange('atencionBasica', 'inmovilizacion', e.target.checked)}
                  />
                }
                label="Inmovilización de extremidades"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.atencionBasica?.empaquetamiento || false}
                    onChange={(e) => handleCheckboxChange('atencionBasica', 'empaquetamiento', e.target.checked)}
                  />
                }
                label="Empaquetamiento"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionData.atencionBasica?.vendaje || false}
                    onChange={(e) => handleCheckboxChange('atencionBasica', 'vendaje', e.target.checked)}
                  />
                }
                label="Vendaje"
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Pertenencias"
          fullWidth
          multiline
          rows={4}
          value={sectionData.pertenencias || ''}
          onChange={(e) => handleChange('pertenencias', e.target.value)}
          placeholder="Describa las pertenencias del paciente..."
        />
      </Grid>
    </Grid>
  );
};

export const Seccion11DatosLegales = ({ data, onChange }: SeccionProps) => {
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);
  const sectionData = data.datosLegales || {};
  const vehiculos = sectionData.vehiculosInvolucrados || [{ tipoMarca: '', placas: '' }];

  const handleChange = (field: string, value: any) => {
    onChange('datosLegales', { ...sectionData, [field]: value });
  };

  const handleVehiculoChange = (index: number, field: string, value: string) => {
    const newVehiculos = [...vehiculos];
    newVehiculos[index] = { ...newVehiculos[index], [field]: value };
    handleChange('vehiculosInvolucrados', newVehiculos);
  };

  const agregarVehiculo = () => {
    const newVehiculos = [...vehiculos, { tipoMarca: '', placas: '' }];
    handleChange('vehiculosInvolucrados', newVehiculos);
  };

  const eliminarVehiculo = (index: number) => {
    if (vehiculos.length > 1) {
      const newVehiculos = vehiculos.filter((_: any, i: number) => i !== index);
      handleChange('vehiculosInvolucrados', newVehiculos);
    }
  };

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <FormLabel
          sx={{
            color: colors.text.primary,
            fontWeight: 600,
            mb: 2,
            display: 'block',
            fontSize: '0.95rem',
          }}
        >
          Autoridades que tomaron conocimiento
        </FormLabel>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              label="Dependencia"
              fullWidth
              value={sectionData.dependencia || ''}
              onChange={(e) => handleChange('dependencia', e.target.value)}
              helperText="Ejemplo: SSP, Policía Municipal, Fiscalía, etc."
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Número de unidad"
              fullWidth
              value={sectionData.numeroUnidad || ''}
              onChange={(e) => handleChange('numeroUnidad', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Número de los oficiales"
              fullWidth
              value={sectionData.numeroOficiales || ''}
              onChange={(e) => handleChange('numeroOficiales', e.target.value)}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
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
          Vehículos involucrados
        </FormLabel>
        {vehiculos.map((vehiculo: any, index: number) => (
          <Box
            key={index}
            sx={{
              border: `1px solid ${colors.border.light}`,
              borderRadius: 1,
              p: 2,
              mb: 2,
            }}
          >
            <Grid container spacing={2.5} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Tipo y marca"
                  fullWidth
                  value={vehiculo.tipoMarca || ''}
                  onChange={(e) => handleVehiculoChange(index, 'tipoMarca', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Placas"
                  fullWidth
                  value={vehiculo.placas || ''}
                  onChange={(e) => handleVehiculoChange(index, 'placas', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => eliminarVehiculo(index)}
                  disabled={vehiculos.length === 1}
                  sx={{ height: '56px' }}
                >
                  Eliminar
                </Button>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={agregarVehiculo}
          sx={{
            color: colors.primary.main,
            borderColor: colors.primary.main,
            '&:hover': {
              borderColor: colors.primary.dark,
              bgcolor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          + Agregar vehículo
        </Button>
      </Grid>
    </Grid>
  );
};
