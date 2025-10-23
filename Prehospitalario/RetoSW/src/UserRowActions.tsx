import { useRecordContext, useDataProvider } from 'react-admin';
import { Button, Stack } from '@mui/material';

export const UserRowActions = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();

  if (!record) return null;

  // Usar phone para simular activo (si hay phone esta activo)
  const isActive = record.phone && record.phone !== '';

  const toggleActive = async () => {
    try {
      const newPhone = isActive ? '' : '1-000-000-0000';
      await dataProvider.update('users', {
        id: record.id,
        data: { phone: newPhone },
        previousData: record
      });
      alert('Estado actualizado.');
      window.location.reload();
    } catch {
      alert('No se pudo actualizar.');
    }
  };

  const deleteUser = async () => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await dataProvider.delete('users', { id: record.id, previousData: record });
        alert('Usuario eliminado.');
        window.location.reload();
      } catch {
        alert('No se pudo eliminar.');
      }
    }
  };

  return (
    <Stack direction="row" spacing={0.5}>
      <Button
        onClick={toggleActive}
        variant="outlined"
        size="small"
        color={isActive ? "warning" : "success"}
        sx={{ minWidth: 65, fontSize: '10px' }}
      >
        {isActive ? 'Desactivar' : 'Activar'}
      </Button>
      <Button
        onClick={deleteUser}
        variant="outlined"
        size="small"
        color="error"
        sx={{ minWidth: 60, fontSize: '10px' }}
      >
        Eliminar
      </Button>
    </Stack>
  );
};