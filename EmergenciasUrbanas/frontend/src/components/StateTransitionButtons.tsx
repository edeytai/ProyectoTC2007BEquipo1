import { useState } from 'react';
import { BACKEND_URL } from '../config';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  Check as CheckIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useTranslate, useNotify, useRefresh, usePermissions, useRecordContext } from 'react-admin';

type TransitionAction = 'submit' | 'approve' | 'reject' | 'close';

interface ConfirmDialogProps {
  open: boolean;
  action: TransitionAction;
  onConfirm: (motivo?: string) => void;
  onCancel: () => void;
}

const ConfirmDialog = ({ open, action, onConfirm, onCancel }: ConfirmDialogProps) => {
  const translate = useTranslate();
  const [motivo, setMotivo] = useState('');

  const handleConfirm = () => {
    onConfirm(action === 'reject' ? motivo : undefined);
    setMotivo('');
  };

  const getDialogContent = () => {
    switch (action) {
      case 'submit':
        return {
          title: translate('incidents.confirmations.submit.title'),
          content: translate('incidents.confirmations.submit.message'),
          confirmColor: 'primary' as const,
        };
      case 'approve':
        return {
          title: translate('incidents.confirmations.approve.title'),
          content: translate('incidents.confirmations.approve.message'),
          confirmColor: 'success' as const,
        };
      case 'reject':
        return {
          title: translate('incidents.confirmations.reject.title'),
          content: translate('incidents.confirmations.reject.message'),
          confirmColor: 'error' as const,
          showMotivo: true,
        };
      case 'close':
        return {
          title: translate('incidents.confirmations.close.title'),
          content: translate('incidents.confirmations.close.message'),
          confirmColor: 'secondary' as const,
        };
    }
  };

  const dialogContent = getDialogContent();

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogContent.title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {dialogContent.content}
        </Typography>
        {dialogContent.showMotivo && (
          <TextField
            label={translate('incidents.fields.motivo.label')}
            placeholder={translate('incidents.fields.motivo.placeholder')}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            fullWidth
            multiline
            rows={3}
            required
            sx={{ mt: 2 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {translate('incidents.actions.cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={dialogContent.confirmColor}
          disabled={dialogContent.showMotivo && !motivo.trim()}
        >
          {translate('incidents.actions.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const StateTransitionButtons = () => {
  const record = useRecordContext();
  const { permissions } = usePermissions();
  const notify = useNotify();
  const refresh = useRefresh();
  const translate = useTranslate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<TransitionAction>('submit');
  const [loading, setLoading] = useState(false);

  const identityStr = sessionStorage.getItem('identity');
  const user = identityStr ? JSON.parse(identityStr) : null;

  if (!record) return null;

  const handleOpenDialog = (action: TransitionAction) => {
    setCurrentAction(action);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirm = async (motivo?: string) => {
    setDialogOpen(false);
    setLoading(true);

    try {
      const token = sessionStorage.getItem('auth');
      const baseUrl = BACKEND_URL;

      let endpoint = '';
      let body = {};

      switch (currentAction) {
        case 'submit':
          endpoint = `/incidents/${record.id}/submit`;
          break;
        case 'approve':
          endpoint = `/incidents/${record.id}/approve`;
          break;
        case 'reject':
          endpoint = `/incidents/${record.id}/reject`;
          body = { motivo };
          break;
        case 'close':
          endpoint = `/incidents/${record.id}/close`;
          break;
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authentication: token || '',
        },
        body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cambiar estado');
      }

      const result = await response.json();
      const stateLabel = translate(`incidents.notifications.states.${result.estadoReporte}`);
      notify(translate('incidents.notifications.stateChanged', { state: stateLabel }), {
        type: 'success',
      });
      refresh();
    } catch (error: any) {
      notify(error.message || translate('incidents.notifications.stateChangeError'), {
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderActions = () => {
    // Brigadistas solo pueden enviar a revision sus propios incidentes en draft
    if (
      permissions === 'brigadista' &&
      record.estadoReporte === 'draft' &&
      record.createdBy === user?.username
    ) {
      return (
        <Button
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          onClick={() => handleOpenDialog('submit')}
          disabled={loading}
        >
          {translate('incidents.actions.sendToReview')}
        </Button>
      );
    }

    if (permissions === 'coordinador' || permissions === 'admin') {
      if (record.estadoReporte === 'en_revision') {
        return (
          <>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              onClick={() => handleOpenDialog('approve')}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              {translate('incidents.actions.approve')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CloseIcon />}
              onClick={() => handleOpenDialog('reject')}
              disabled={loading}
            >
              {translate('incidents.actions.reject')}
            </Button>
          </>
        );
      }

      if (record.estadoReporte === 'aprobado') {
        return (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloseIcon />}
            onClick={() => handleOpenDialog('close')}
            disabled={loading}
          >
            {translate('incidents.actions.close')}
          </Button>
        );
      }
    }

    return null;
  };

  const actions = renderActions();
  if (!actions) return null;

  return (
    <>
      <Box sx={{ mt: 2, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {translate('incidents.actions.title')}
            </Typography>
            <Box sx={{ mt: 2 }}>{actions}</Box>
          </CardContent>
        </Card>
      </Box>

      <ConfirmDialog
        open={dialogOpen}
        action={currentAction}
        onConfirm={handleConfirm}
        onCancel={handleCloseDialog}
      />
    </>
  );
};
