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
  Chip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const DeleteLeaveTypes = ({ open, onClose, leaveType, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!leaveType?._id) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/api/leavetypes/${leaveType._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        onDelete(leaveType._id);
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete leave type');
      }
    } catch (err) {
      console.error('Error deleting leave type:', err);
      setError(err.response?.data?.message || 'Failed to delete leave type. Please try again.');
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
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #E0E0E0', 
        pb: 2,
        backgroundColor: '#F8FAFC'
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#101010',
          paddingTop: '8px'
        }}>
          Confirm Delete
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {/* Add padding from top */}
        <div style={{ marginTop: '16px' }}>
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              {leaveType?.Name}
            </Typography>
            
            <Stack direction="row" spacing={2}>
              <Chip
                label={`${leaveType?.MaxDaysPerYear} days/year`}
                color="primary"
                sx={{ 
                  fontWeight: 500,
                  backgroundColor: '#E3F2FD',
                  color: '#1565C0'
                }}
              />
              
              <Chip
                label={leaveType?.IsActive ? 'Active' : 'Inactive'}
                color={leaveType?.IsActive ? 'success' : 'default'}
                sx={{ 
                  fontWeight: 500,
                  '&.MuiChip-colorSuccess': {
                    bgcolor: '#E8F5E9',
                    color: '#2E7D32'
                  },
                  '&.MuiChip-colorDefault': {
                    bgcolor: '#F5F5F5',
                    color: '#616161'
                  }
                }}
              />
            </Stack>
            
            {leaveType?.Description && (
              <Typography variant="body2" color="textSecondary">
                {leaveType.Description}
              </Typography>
            )}
          </Stack>
          
          <Typography variant="body1" sx={{ mb: 2, fontSize: '0.875rem' }}>
            Are you sure you want to delete this leave type?
          </Typography>
          <Typography variant="body2" color="error" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            ⚠️ This action cannot be undone. All leave records associated with this type will be affected.
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 3,
                borderRadius: 1,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              {error}
            </Alert>
          )}
        </div>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        borderTop: '1px solid #E0E0E0', 
        pt: 2,
        backgroundColor: '#F8FAFC'
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? null : <DeleteIcon />}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            backgroundColor: '#D32F2F',
            '&:hover': {
              backgroundColor: '#C62828'
            }
          }}
        >
          {loading ? 'Deleting...' : 'Delete Leave Type'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteLeaveTypes;