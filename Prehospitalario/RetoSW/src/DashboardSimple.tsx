import { Box, Typography } from '@mui/material';

export function DashboardSimple() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '500px',
      width: '100%'
    }}>
      <h1 style={{ color: 'black', fontSize: '32px' }}>Dashboard Simple</h1>
      <p style={{ color: 'black', fontSize: '18px' }}>Este es un dashboard de prueba</p>
      <p style={{ color: 'blue', fontSize: '18px', marginTop: '20px' }}>Si ves esto, el componente funciona!</p>
    </div>
  );
}
