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
  Chip,
  Divider,
  Grid
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Business as BusinessIcon,
  CreditCard as CreditCardIcon,
  Percent as PercentIcon,
  Recycling as RecyclingIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const DeleteCompanyFinancial = ({ open, onClose, financial, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCompanyInitials = (companyName) => {
    if (!companyName) return 'C';
    
    const words = companyName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return companyName.substring(0, 2).toUpperCase();
  };

  const formatDays = (days) => {
    if (days < 0) {
      return `${Math.abs(days)} days (Advance)`;
    }
    return `${days} days`;
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const handleDelete = async () => {
    if (!financial?._id) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/api/company-financial/${financial._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        onDelete(financial._id);
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete company financial');
      }
    } catch (err) {
      console.error('Error deleting company financial:', err);
      setError(err.response?.data?.message || 'Failed to delete company financial. Please try again.');
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
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#101010'
        }}>
          Confirm Delete
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ 
        pt: 4,
        px: 3,
        pb: 2
      }}>
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: '#EF4444',
              fontSize: '1.25rem'
            }}>
              {getCompanyInitials(financial?.CompanyID?.CompanyName)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {financial?.CompanyID?.CompanyName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                GST: {financial?.CompanyID?.GSTIN || 'N/A'}
              </Typography>
            </Box>
          </Stack>
          
          <Divider />
          
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Financial Parameters
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CreditCardIcon sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography variant="body2" color="textSecondary">Input Credit:</Typography>
              </Stack>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 4 }}>
                {formatDays(financial?.CreditOnInputMaterialDays)}
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CreditCardIcon sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography variant="body2" color="textSecondary">Customer Credit:</Typography>
              </Stack>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 4 }}>
                {formatDays(financial?.CreditGivenToCustomerDays)}
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PercentIcon sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography variant="body2" color="textSecondary">Cost of Capital:</Typography>
              </Stack>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 4 }}>
                {(financial?.CostOfCapital * 100).toFixed(1)}%
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PercentIcon sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography variant="body2" color="textSecondary">OHP:</Typography>
              </Stack>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 4 }}>
                {formatPercentage(financial?.OHPPercentage)}
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <RecyclingIcon sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography variant="body2" color="textSecondary">Scrap Recovery:</Typography>
              </Stack>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 4 }}>
                {formatPercentage(financial?.ScrapRecoveryPercentage)}
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <RecyclingIcon sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography variant="body2" color="textSecondary">Scrap Multiplier:</Typography>
              </Stack>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 4 }}>
                {financial?.EffectiveScrapRateMultiplier}x
              </Typography>
            </Grid>
          </Grid>
        </Stack>
        
        <Box sx={{ 
          p: 2, 
          bgcolor: '#FEF2F2', 
          borderRadius: 1,
          border: '1px solid #FECACA',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1
        }}>
          <WarningIcon sx={{ color: '#DC2626', fontSize: 20, mt: 0.5 }} />
          <Box>
            <Typography variant="body2" color="#991B1B" fontWeight={600}>
              Warning: This action cannot be undone
            </Typography>
            <Typography variant="caption" color="#B91C1C">
              Deleting these financial parameters will permanently remove all associated financial data for this company. This may affect cost calculations and financial reports.
            </Typography>
          </Box>
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 1,
              mt: 3
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
          {loading ? 'Deleting...' : 'Delete Financial Parameters'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCompanyFinancial;