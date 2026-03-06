import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Stack,
  Avatar,
  Box,
  Chip
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const DeleteProcess = ({ open, onClose, process, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getProcessInitials = (processName) => {
    if (!processName) return 'P';
    
    const words = processName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return processName.substring(0, 2).toUpperCase();
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Core': { bg: '#E0F2FE', color: '#0369A1' },
      'Finishing': { bg: '#FCE7F3', color: '#9D174D' },
      'Packing': { bg: '#D1FAE5', color: '#065F46' },
      'Other': { bg: '#F5F5F5', color: '#616161' }
    };
    return colors[category] || colors['Other'];
  };

  // Get rate type color
  const getRateTypeColor = (rateType) => {
    const colors = {
      'Per Nos': { bg: '#F3E8FF', color: '#7C3AED' },
      'Per Kg': { bg: '#DCFCE7', color: '#059669' },
      'Per Hour': { bg: '#F0F9FF', color: '#0C4A6E' },
      'Fixed': { bg: '#FEF3C7', color: '#92400E' }
    };
    return colors[rateType] || { bg: '#F5F5F5', color: '#616161' };
  };

  const handleDelete = async () => {
    if (!process?._id) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/api/processes/${process._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        onDelete(process._id);
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete process');
      }
    } catch (err) {
      console.error('Error deleting process:', err);
      setError(err.response?.data?.message || 'Failed to delete process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!process) return null;

  const categoryColor = getCategoryColor(process.category);
  const rateTypeColor = getRateTypeColor(process.rate_type);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #E0E0E0', 
        pb: 2,
        backgroundColor: '#F8FAFC',
        pt: 3,
        px: 3
      }}>
        <Typography variant="h6" fontWeight={600} color="#101010">
          Confirm Delete
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ 
        pt: 4,
        px: 3,
        pb: 2
      }}>
        <Stack spacing={3} sx={{ mb: 3 }}>
          {/* Process Header */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: '#4F46E5',
              fontSize: '1.25rem',
              fontWeight: 500
            }}>
              {getProcessInitials(process.process_name)}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" fontWeight={600}>
                {process.process_name}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                ID: {process.process_id}
              </Typography>
            </Box>
          </Stack>

          {/* Process Details */}
          <Box sx={{ 
            backgroundColor: '#F8FAFC', 
            p: 2.5, 
            borderRadius: 2,
            border: '1px solid #E2E8F0'
          }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="textSecondary">Category:</Typography>
                <Chip
                  label={process.category}
                  size="small"
                  sx={{
                    bgcolor: categoryColor.bg,
                    color: categoryColor.color,
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="textSecondary">Rate Type:</Typography>
                <Chip
                  label={process.rate_type}
                  size="small"
                  sx={{
                    bgcolor: rateTypeColor.bg,
                    color: rateTypeColor.color,
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="textSecondary">Status:</Typography>
                <Chip
                  icon={process.is_active ? <CheckCircleIcon /> : <CancelIcon />}
                  label={process.is_active ? 'Active' : 'Inactive'}
                  size="small"
                  sx={{
                    bgcolor: process.is_active ? '#dcfce7' : '#fee2e2',
                    color: process.is_active ? '#166534' : '#991b1b',
                    border: '1px solid',
                    borderColor: process.is_active ? '#86efac' : '#fca5a5',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    '& .MuiChip-icon': {
                      fontSize: 14
                    }
                  }}
                />
              </Stack>

              {process.description && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Description:
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    backgroundColor: 'white', 
                    p: 1.5, 
                    borderRadius: 1,
                    border: '1px solid #E2E8F0'
                  }}>
                    {process.description}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Warning Message */}
          <Box sx={{ 
            backgroundColor: '#FEF3C7',
            p: 2,
            borderRadius: 2,
            border: '1px solid #FCD34D'
          }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600, color: '#92400E' }}>
              ⚠️ Warning
            </Typography>
            <Typography variant="body2" color="#92400E">
              Are you sure you want to delete this process? This action cannot be undone. 
              The process record will be permanently deleted from the system.
            </Typography>
          </Box>
        </Stack>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 1,
              mt: 2,
              '& .MuiAlert-icon': {
                alignItems: 'center'
              }
            }}
          >
            {error}
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        pt: 2,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC',
        gap: 1
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
          sx={{
            borderRadius: 1.5,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            borderColor: '#CBD5E1',
            color: '#475569'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={!loading && <DeleteIcon />}
          sx={{
            borderRadius: 1.5,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            backgroundColor: '#D32F2F',
            '&:hover': {
              backgroundColor: '#C62828'
            },
            '&.Mui-disabled': {
              backgroundColor: '#EF5350'
            }
          }}
        >
          {loading ? 'Deleting...' : 'Delete Process'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProcess;