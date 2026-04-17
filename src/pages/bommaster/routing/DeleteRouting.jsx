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
  Stack,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Route as RouteIcon,
  Work as WorkIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
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
  warning: '#D97706',
  info: '#3B82F6'
};

const DeleteRouting = ({ open, onClose, routing, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    setErrorDetails(null);

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
        // Store additional error details if available
        if (response.data.work_order) {
          setErrorDetails(response.data);
        }
      }
    } catch (err) {
      console.error('Error deleting routing:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete routing. Please try again.';
      setError(errorMessage);
      
      // Store additional error details from response
      if (err.response?.data?.work_order) {
        setErrorDetails(err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? { bg: '#D1FAE5', color: '#059669' } : { bg: '#FEF3C7', color: '#D97706' };
  };

  const totalOperations = routing?.operations?.length || 0;
  const statusColors = getStatusColor(routing?.is_active);
  
  // Check if error is about routing being used in work orders
  const isUsedInWorkOrder = error && (error.includes('used in open Work Order') || errorDetails?.work_order);

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
        {/* Show detailed error when routing is in use */}
        {isUsedInWorkOrder ? (
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <ErrorIcon sx={{ fontSize: 48, color: COLORS.error, mb: 2 }} />
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.error, mb: 2 }}>
              Cannot Delete Routing
            </Typography>
            
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                {error}
              </Typography>
            </Alert>

            {/* Work Order Details */}
            {errorDetails?.work_order && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: COLORS.background.light, 
                borderRadius: 1.5,
                textAlign: 'left',
                border: `1px solid ${COLORS.border}`
              }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.error, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WorkIcon sx={{ fontSize: '0.9rem' }} />
                  Associated Work Order
                </Typography>
                
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Work Order Number</Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {errorDetails.work_order.wo_number}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>
                    <Chip
                      label={errorDetails.work_order.status}
                      size="small"
                      sx={{ 
                        fontSize: '0.65rem',
                        height: 24,
                        bgcolor: errorDetails.work_order.status === 'In Progress' ? '#FEF3C7' : '#D1FAE5',
                        color: errorDetails.work_order.status === 'In Progress' ? '#D97706' : '#059669'
                      }}
                    />
                  </Box>
                </Stack>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, textAlign: 'center' }}>
                  Please complete or cancel the associated work order before deleting this routing.
                </Typography>
              </Paper>
            )}

            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                mt: 3,
                height: 36,
                px: 3,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'none'
              }}
            >
              Close
            </Button>
          </Box>
        ) : (
          <>
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

            {error && !isUsedInWorkOrder && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
                {error}
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      {!isUsedInWorkOrder && (
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
      )}
    </Dialog>
  );
};

export default DeleteRouting;