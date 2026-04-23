import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Straighten as GaugeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568'
  },
  background: {
    white: '#FFFFFF'
  },
  border: '#E3E8EF'
};

const DeleteGauge = ({ open, onClose, gauge, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/api/gauges/${gauge._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        onDelete();
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete gauge');
      }
    } catch (err) {
      console.error('Error deleting gauge:', err);
      setError(err.response?.data?.message || 'Failed to delete gauge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 2,
        px: 3,
        bgcolor: COLORS.background.white,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <WarningIcon sx={{ color: '#EF4444', fontSize: '1.5rem' }} />
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Delete Gauge
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.primary, mb: 1 }}>
          Are you sure you want to delete this gauge?
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 2 }}>
          This action cannot be undone.
        </Typography>
        
        <Box sx={{ 
          p: 2, 
          bgcolor: '#FEF2F2', 
          borderRadius: 2, 
          border: '1px solid #FEE2E2',
          mb: 2
        }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <GaugeIcon sx={{ color: '#991B1B', fontSize: '1.25rem' }} />
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#991B1B' }}>
                Gauge Code: {gauge?.gauge_code || gauge?.gauge_id}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#991B1B', mt: 0.5 }}>
                Gauge Name: {gauge?.gauge_name}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            bgcolor: '#EF4444',
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { bgcolor: '#DC2626' }
          }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteGauge;