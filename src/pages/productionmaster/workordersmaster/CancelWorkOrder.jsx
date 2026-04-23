// CancelWorkOrder.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  TextField,
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

const CancelWorkOrderPopup = ({ open, onClose, workOrder, onCancel }) => {
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!cancelReason.trim()) {
      setError('Cancel reason is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/work-orders/${workOrder._id}/cancel`,
        { cancel_reason: cancelReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        onCancel(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to cancel work order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel work order');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCancelReason('');
    setError('');
    onClose();
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <BlockIcon sx={{ color: '#DC2626' }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Cancel Work Order
          </Typography>
        </Stack>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>WO Number:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.wo_number}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.customer_name}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Part:</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{workOrder?.part_no} - {workOrder?.part_name}</Typography>
              </Stack>
            </Stack>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
              CANCEL REASON <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              size="small"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide the reason for cancellation..."
              error={!!error}
              sx={inputStyle}
            />
            {error && <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>{error}</Typography>}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={<BlockIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: '#DC2626',
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: '#B91C1C' }
          }}
        >
          {loading ? 'Cancelling...' : 'Cancel Work Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelWorkOrderPopup;