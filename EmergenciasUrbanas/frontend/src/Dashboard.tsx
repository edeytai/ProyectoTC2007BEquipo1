import { useTranslate } from 'react-admin';
import { Box, Typography } from '@mui/material';

export const Dashboard = () => {
  const userStr = sessionStorage.getItem('identity');
  const user = userStr ? JSON.parse(userStr) : null;
  const translate = useTranslate();

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {translate('dashboard.title')}
      </Typography>

      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 2,
          borderRadius: 1,
          mb: 3
        }}
      >
        <Typography variant="h6">
          {translate('dashboard.currentUser')}: {user?.fullName}
        </Typography>
        <Typography variant="body2">
          {translate('dashboard.role')}: <strong>{user?.role?.toUpperCase()}</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {user?.role && translate(`dashboard.roles.${user.role}.description`)}
        </Typography>
      </Box>
    </Box>
  );
};