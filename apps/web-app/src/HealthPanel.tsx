import React, { useState } from 'react';
import { Button, Alert, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { checkHealth } from './health.api';
import type { HealthResponse } from './types/health';

export const HealthPanel: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const verificarConexion = async () => {
    setLoading(true);
    setError(null);
    setHealth(null);

    try {
      const data = await checkHealth();
      setHealth(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el backend. ¿El servidor NestJS está corriendo?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 450, margin: '40px auto', textAlign: 'center' }}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            Prueba de Conexión Monorepo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            EcoPartes Tech — Conexión React + NestJS
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={verificarConexion}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ mb: 3 }}
          >
            {loading ? 'Verificando...' : 'Verificar conexión'}
          </Button>

          {health && (
            <Alert severity="success" sx={{ textAlign: 'left', mb: 2 }}>
              <strong>¡Conectado con éxito!</strong><br />
              Servicio: {health.service}<br />
              Estado: {health.status.toUpperCase()}<br />
              {lastChecked && <small>Última verificación: {lastChecked}</small>}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ textAlign: 'left', mb: 2 }}>
              <strong>Error de Conexión:</strong><br />
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};