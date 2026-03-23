import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS } from './constants';

const DeleteCustomer = ({ open, onClose, customer, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!customer?._id) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/api/customers/${customer._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        onDelete(customer._id);
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete customer');
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError(err.response?.data?.message || 'Failed to delete customer');
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5 }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Confirm Delete
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <DeleteIcon sx={{ fontSize: 48, color: '#EF4444', mb: 1 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>Delete Customer</Typography>
          <Typography variant="body2" color="textSecondary">
            Are you sure you want to delete customer <strong>{customer.customer_name}</strong>?
            <br />
            This action cannot be undone.
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: COLORS.background.light, borderRadius: 1 }}>
            <Typography variant="body2" fontWeight={500}>{customer.customer_name}</Typography>
            <Typography variant="caption" color="textSecondary">Code: {customer.customer_code}</Typography>
          </Box>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleDelete} 
          disabled={loading}
          sx={{ bgcolor: '#D32F2F', '&:hover': { bgcolor: '#C62828' } }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCustomer;