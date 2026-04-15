import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Alert,
  Box,
  IconButton,
  Chip,
  Paper,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Route as RouteIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
// Import missing icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';


const COLORS = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F9FAFB'
  },
  border: '#E5E7EB',
  error: '#DC2626',
  warning: '#D97706'
};

const DeleteRouting = ({ open, onClose, routing, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.delete(`${BASE_URL}/api/routings/${routing._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        if (onDelete) {
          onDelete(response.data.data);
        }
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete routing');
      }
    } catch (err) {
      console.error('Error deleting routing:', err);
      setError(err.response?.data?.message || 'Failed to delete routing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? { bg: '#D1FAE5', color: '#059669' } : { bg: '#FEF3C7', color: '#D97706' };
  };

  const totalOperations = routing?.operations?.length || 0;
  const statusColors = getStatusColor(routing?.is_active);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.error }}>
          Delete Routing
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <WarningIcon sx={{ fontSize: 48, color: COLORS.error, mb: 2 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary, mb: 1 }}>
            Are you sure you want to delete this routing?
          </Typography>
          
          {/* Routing Information Card */}
          <Paper sx={{ 
            p: 2, 
            mt: 2, 
            mb: 1, 
            bgcolor: COLORS.background.light, 
            borderRadius: 1.5,
            textAlign: 'left'
          }}>
            <Stack spacing={1.5}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  Routing Name
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {routing?.routing_name}
                </Typography>
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  Routing ID
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: COLORS.text.primary }}>
                  {routing?.routing_id}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Routing Type
                  </Typography>
                  <Chip
                    label={routing?.routing_type || '-'}
                    size="small"
                    sx={{ fontSize: '0.65rem', height: 24, bgcolor: '#E0E7FF', color: '#4F46E5' }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Status
                  </Typography>
                  <Chip
                    icon={routing?.is_active ? <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> : <PendingIcon sx={{ fontSize: '0.7rem' }} />}
                    label={routing?.is_active ? 'Active' : 'Draft'}
                    size="small"
                    sx={{ 
                      fontSize: '0.65rem',
                      height: 24,
                      bgcolor: statusColors.bg,
                      color: statusColors.color
                    }}
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Total Operations
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.primary }}>
                    {totalOperations}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Version
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    v{routing?.version || '1.0'}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
          
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.error, mt: 2 }}>
            This action cannot be undone. The routing will be deactivated.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        gap: 1
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? null : <DeleteIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.error,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: '#B91C1C' }
          }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default DeleteRouting;