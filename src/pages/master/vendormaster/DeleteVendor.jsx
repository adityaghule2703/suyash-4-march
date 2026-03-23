import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  Stack,
  Chip
} from '@mui/material';
import { Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  error: '#D32F2F',
  errorDark: '#C62828',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  border: '#E3E8EF',
  background: '#F8FAFC'
};

const DeleteVendor = ({ open, onClose, vendor, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!vendor?._id) {
      setError('Vendor information is missing');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/api/vendors/${vendor._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        onDelete(vendor._id);
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete vendor');
      }
    } catch (err) {
      console.error('Error deleting vendor:', err);
      setError(err.response?.data?.message || 'Failed to delete vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format vendor code and name for display
  const getVendorDisplayName = () => {
    if (!vendor) return '';
    return vendor.vendor_name || vendor.VendorName || 'this vendor';
  };

  const getVendorCode = () => {
    if (!vendor) return '';
    return vendor.vendor_code || vendor.VendorCode || '';
  };

  const getVendorId = () => {
    if (!vendor) return '';
    return vendor._id || vendor.id || '';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.border}`, 
        pb: 2,
        backgroundColor: COLORS.background,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <WarningIcon sx={{ color: COLORS.error, fontSize: 24 }} />
        <Typography 
          sx={{ 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            color: COLORS.text.primary
          }}
        >
          Confirm Delete
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Stack spacing={2}>
          <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
            Are you sure you want to delete the vendor?
          </Typography>

          {/* Vendor Details Box */}
          <Box sx={{ 
            p: 2, 
            bgcolor: COLORS.background, 
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`
          }}>
            <Stack spacing={1.5}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.tertiary, mb: 0.5 }}>
                  VENDOR NAME
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {getVendorDisplayName()}
                </Typography>
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.tertiary, mb: 0.5 }}>
                  VENDOR CODE
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {getVendorCode() || '-'}
                </Typography>
              </Box>

              {getVendorId() && (
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.tertiary, mb: 0.5 }}>
                    VENDOR ID
                  </Typography>
                  <Chip
                    label={getVendorId().slice(-6)}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      height: 22,
                      bgcolor: '#E8F0F1',
                      color: COLORS.primary,
                      '& .MuiChip-label': { px: 1 }
                    }}
                  />
                </Box>
              )}
            </Stack>
          </Box>

          {/* Warning Message */}
          <Box sx={{ 
            p: 1.5, 
            bgcolor: '#FEF3C7', 
            borderRadius: 1.5,
            border: '1px solid #FDE68A'
          }}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#92400E' }}>
              ⚠️ This action cannot be undone. All related transactions and records associated with this vendor will be permanently deleted.
            </Typography>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                },
                fontSize: '0.75rem'
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        pt: 2,
        borderTop: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.background,
        gap: 1
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{
            borderRadius: 1.5,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
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
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? null : <DeleteIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            borderRadius: 1.5,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.75rem',
            backgroundColor: COLORS.error,
            '&:hover': {
              backgroundColor: COLORS.errorDark
            }
          }}
        >
          {loading ? 'Deleting...' : 'Delete Vendor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteVendor;