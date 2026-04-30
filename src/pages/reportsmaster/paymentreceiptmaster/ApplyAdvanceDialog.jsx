import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  TextField,
  Grid,
  Box,
  Paper,
  Autocomplete,
  CircularProgress,
  Alert,
} from '@mui/material';
import { AccountBalance as AdvanceIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
  },
  border: '#E3E8EF',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
  }
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const ApplyAdvanceDialog = ({ open, onClose, receipt, onSuccess }) => {
  const [advances, setAdvances] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedAdvance, setSelectedAdvance] = useState(null);
  const [amount, setAmount] = useState('');
  const [loadingAdvances, setLoadingAdvances] = useState(false);
  
  // Get the invoice_id from the receipt's allocations array
  const invoiceId = receipt?.allocations?.[0]?.invoice_id;

  useEffect(() => {
    if (open && receipt && receipt.customer_id) {
      fetchCustomerAdvances();
    }
  }, [open, receipt]);

  const fetchCustomerAdvances = async () => {
    try {
      setLoadingAdvances(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/invoices/customer-advances?limit=200`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const customerAdvances = response.data.data.filter(advance => 
          advance.customer_id === receipt.customer_id && 
          advance.balance > 0 &&
          advance.status === 'Open'
        );
        setAdvances(customerAdvances);
      }
    } catch (err) {
      console.error('Error fetching customer advances:', err);
      setError('Failed to load customer advances');
    } finally {
      setLoadingAdvances(false);
    }
  };

  const handleAdvanceChange = (event, newValue) => {
    setSelectedAdvance(newValue);
    setAmount('');
    setError('');
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (selectedAdvance && parseFloat(value) > selectedAdvance.balance) {
      setError(`Amount cannot exceed available balance of ₹${formatCurrency(selectedAdvance.balance)}`);
    } else {
      setError('');
    }
    setAmount(value);
  };

  const handleSubmit = async () => {
    if (!selectedAdvance) {
      setError('Please select a customer advance');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (parseFloat(amount) > selectedAdvance.balance) {
      setError(`Amount cannot exceed available balance of ₹${formatCurrency(selectedAdvance.balance)}`);
      return;
    }
    if (!invoiceId) {
      setError('No invoice found for this payment receipt');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      // Use the invoice_id from the receipt's allocation
      const response = await axios.put(
        `${BASE_URL}/api/invoices/${invoiceId}/apply-advance`,
        {
          advance_id: selectedAdvance._id,
          amount: parseFloat(amount)
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onSuccess();
        onClose();
        setSelectedAdvance(null);
        setAmount('');
      } else {
        setError(response.data.message || 'Failed to apply advance');
      }
    } catch (err) {
      console.error('Error applying advance:', err);
      setError(err.response?.data?.message || 'Failed to apply advance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedAdvance(null);
    setAmount('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, pb: 2, mb:2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AdvanceIcon sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
            Apply Customer Advance
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Apply customer advance to invoice <strong>{receipt?.allocations?.[0]?.invoice_no || 'N/A'}</strong> for customer <strong>{receipt?.customer_name || 'Customer'}</strong>
        </Typography>
        
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                Select Customer Advance <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <Autocomplete
                fullWidth
                options={advances}
                getOptionLabel={(option) => `${option.advance_no} - ₹${formatCurrency(option.balance)} (${option.payment_mode})`}
                value={selectedAdvance}
                onChange={handleAdvanceChange}
                loading={loadingAdvances}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Search and select customer advance"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                Amount to Apply <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                type="number"
                size="small"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                error={!!error && error.includes('exceed')}
                helperText={error && error.includes('exceed') ? error : ''}
                disabled={!selectedAdvance}
                InputProps={{
                  startAdornment: <Typography sx={{ fontSize: '0.7rem', mr: 0.5 }}>₹</Typography>,
                  inputProps: { step: 0.01, min: 0, max: selectedAdvance?.balance || 0 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    '&:hover fieldset': { borderColor: COLORS.primary },
                    '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                  },
                  '& .MuiInputBase-input': {
                    py: 1,
                    px: 1.5,
                    fontSize: '0.75rem'
                  }
                }}
              />
            </Box>
          </Grid>

          {selectedAdvance && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  Advance Details
                </Typography>
                <Stack spacing={0.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Advance No:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{selectedAdvance.advance_no}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Available Balance:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                      ₹{formatCurrency(selectedAdvance.balance)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Advance Date:</Typography>
                    <Typography sx={{ fontSize: '0.7rem' }}>{formatDate(selectedAdvance.advance_date)}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          )}

          {/* Show invoice details */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, mb: 0.5 }}>
                Invoice Details
              </Typography>
              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.7rem' }}>Invoice No:</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{receipt?.allocations?.[0]?.invoice_no || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.7rem' }}>Invoice Total:</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                    ₹{formatCurrency(receipt?.allocations?.[0]?.invoice_total || 0)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.7rem' }}>Balance Before:</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                    ₹{formatCurrency(receipt?.allocations?.[0]?.balance_before || 0)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {error && !error.includes('exceed') && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${COLORS.border}` }}>
        <Button 
          onClick={handleClose} 
          disabled={submitting}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={submitting || !selectedAdvance || !amount || parseFloat(amount) <= 0}
          startIcon={submitting ? <CircularProgress size={16} /> : <AdvanceIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 3,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            textTransform: 'none',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {submitting ? 'Applying...' : 'Apply Advance'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplyAdvanceDialog;