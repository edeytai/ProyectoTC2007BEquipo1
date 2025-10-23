import { useDataProvider } from 'react-admin';
import { Button } from '@mui/material';

interface SuspendUserButtonProps {
  id: number;
  website?: string;
}

export const SuspendUserButton = ({ id, website }: SuspendUserButtonProps) => {
  const dataProvider = useDataProvider();

  // Si no hay website esta suspendido
  const isSuspended = !website || website === '';

  const toggleSuspended = async () => {
    try {
      const newWebsite = isSuspended ? 'reactivated.com' : '';
      await dataProvider.update('users', { 
        id, 
        data: { website: newWebsite },
        previousData: { id, website }
      });
      alert(isSuspended ? 'Usuario reactivado.' : 'Usuario suspendido.');
      window.location.reload();
    } catch (e) {
      alert('No se pudo actualizar el estado del usuario.');
    }
  };

  return (
    <Button 
      onClick={toggleSuspended}
      variant="contained"
      size="small"
      color={isSuspended ? "success" : "error"}
      sx={{ minWidth: 80 }}
    >
      {isSuspended ? 'Reactivar' : 'Suspender'}
    </Button>
  );
};