import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Warning as WarningIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  border: '#E3E8EF',
  background: {
    light: '#F8FFFC'
  }
};

const DeleteAccident = ({ open, onClose, accident, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(
        `${BASE_URL}/api/safety/accidents/${accident._id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Call the onDelete callback with the deleted accident data
        if (onDelete) {
          onDelete(response.data.data);
        }
        handleClose();
      } else {
        setError(response.data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Error deleting accident:', err);
      setError(err.response?.data?.message || 'Failed to delete accident record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setLoading(false);
    onClose();
  };

  // Format employee display name if needed
  const getEmployeeDisplay = () => {
    if (!accident?.employee) return 'Unknown Employee';
    if (typeof accident.employee === 'object') {
      return accident.employee.name || accident.employee.email || accident.employee._id;
    }
    return accident.employee;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography fontSize="0.9rem" fontWeight={600} color={COLORS.primary}>
            Delete Accident Record
          </Typography>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, py: 0, fontSize: '0.7rem' }}>
            {error}
          </Alert>
        )}

        <Box sx={{ 
          textAlign: 'center', 
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <WarningIcon sx={{ fontSize: 60, color: '#f44336' }} />
          
          <Typography variant="h6" sx={{ color: COLORS.text.primary, fontWeight: 600 }}>
            Are you sure?
          </Typography>
          
          <Typography variant="body2" sx={{ color: COLORS.text.secondary, textAlign: 'center' }}>
            This action cannot be undone. This will permanently delete the accident record
            {accident?.employee && (
              <span>
                {' '}for employee <strong>{getEmployeeDisplay()}</strong>
              </span>
            )}
            .
          </Typography>

          {accident && (
            <Box sx={{ 
              mt: 2, 
              p: 1.5, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 1,
              width: '100%',
              textAlign: 'left'
            }}>
              {/* <Typography variant="caption" sx={{ color: COLORS.text.secondary, display: 'block' }}>
                Accident ID: {accident._id}
              </Typography> */}
              {accident.accidentType && (
                <Typography variant="caption" sx={{ color: COLORS.text.secondary, display: 'block' }}>
                  Type: {accident.accidentType}
                </Typography>
              )}
              {accident.date && (
                <Typography variant="caption" sx={{ color: COLORS.text.secondary, display: 'block' }}>
                  Date: {new Date(accident.date).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: `1px solid ${COLORS.border}`, p: 1.5, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          size="small" 
          disabled={loading}
          sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={loading}
          size="small"
          sx={{ 
            fontSize: '0.7rem', 
            bgcolor: '#f44336',
            '&:hover': {
              bgcolor: '#d32f2f'
            }
          }}
        >
          {loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccident;