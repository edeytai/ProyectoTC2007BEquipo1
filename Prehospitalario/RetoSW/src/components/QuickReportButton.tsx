import { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { getColors } from '../theme/colors';
import { ReportDialog } from './ReportDialog';

export const QuickReportButton = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const colors = getColors(theme.palette.mode);

  return (
    <>
      <Tooltip title="Crear Reporte de Emergencia" placement="left">
        <Fab
          color="primary"
          aria-label="Crear reporte de emergencia"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: colors.primary.main,
            color: colors.primary.contrast,
            zIndex: 1000,
            '&:hover': {
              bgcolor: colors.primary.dark,
              transform: 'scale(1.1)',
            },
            '&:focus': {
              outline: `3px solid ${colors.border.focus}`,
              outlineOffset: '2px',
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(198,40,40,0.4)',
          }}
        >
          <Add sx={{ fontSize: 32 }} />
        </Fab>
      </Tooltip>

      <ReportDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};
