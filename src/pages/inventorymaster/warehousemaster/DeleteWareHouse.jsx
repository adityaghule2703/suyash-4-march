import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS } from './constants';

const DeleteWareHouse = ({ open, onClose, warehouse, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  if (!warehouse) return null;
  
  const handleDelete = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/api/warehouses/${warehouse._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        onDelete();
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete warehouse');
      }
    } catch (err) {
      console.error('Error deleting warehouse:', err);
      setError(err.response?.data?.message || 'Failed to delete warehouse. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Delete Warehouse
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <WarningIcon sx={{ fontSize: 48, color: '#EF4444', mb: 1 }} />
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary, mb: 1 }}>
            Are you sure?
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
            You are about to delete the warehouse:
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.primary, mt: 1 }}>
            {warehouse.warehouse_name}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, mt: 0.5 }}>
            ID: {warehouse.warehouse_id}
          </Typography>
        </Box>
        
        {warehouse.bins && warehouse.bins.length > 0 && (
          <Alert severity="warning" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.7rem' }}>
            This warehouse has {warehouse.bins.length} bin(s). Deleting will remove all associated bins.
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.7rem' }}>
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
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: '#EF4444',
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#DC2626'
            }
          }}
        >
          {loading ? 'Deleting...' : 'Delete Warehouse'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteWareHouse;