import { useListContext } from 'react-admin';
import { Box, Typography } from '@mui/material';

export const UsersHeader = () => {
  const { total, selectedIds } = useListContext();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        my: 1,
        flexWrap: 'wrap',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body1" fontWeight="bold">
          Total: {total ?? 0} usuarios
        </Typography>
        {selectedIds && selectedIds.length > 0 && (
          <Typography variant="body2" color="primary">
            Seleccionados: {selectedIds.length}
          </Typography>
        )}
      </Box>
    </Box>
  );
};