import { useCreate } from 'react-admin';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export const QuickCreateUser = () => {
  const [create, { isLoading }] = useCreate();

  const createNewUser = () => {
    create(
      'users',
      { 
        data: { 
          name: 'Nuevo Usuario',
          username: `user_${Date.now()}`,
          email: `user_${Date.now()}@example.com`,
          phone: '1-555-000-0000',
          website: 'nuevo-usuario.com'
        } 
      },
      {
        onSuccess: ({ data }) => {
          alert('Usuario creado: ' + (data?.name ?? 'sin nombre'));
          window.location.reload();
        },
        onError: () => alert('No se pudo crear el usuario.'),
      }
    );
  };

  return (
    <Button 
      onClick={createNewUser} 
      disabled={isLoading}
      variant="contained"
      color="primary"
      startIcon={<Add />}
      sx={{ mb: 1 }}
    >
      {isLoading ? 'Creando…' : 'Crear Usuario Rápido'}
    </Button>
  );
};