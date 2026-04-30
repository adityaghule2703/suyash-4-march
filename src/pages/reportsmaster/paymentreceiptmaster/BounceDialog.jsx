import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { MoneyOff as BounceIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
const COLORS = {
  primary: '#063C3F',
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

const bounceReasons = [
  'Insufficient funds',
  'Account closed',
  'Payment stopped by drawer',
  'Instrument post dated',
  'Instrument out dated',
  'Signature mismatch',
  'Amount in words and figures differ',
  'Crossed cheque not presented',
  'Cheque mutilated',
  'Other'
];

const BounceDialog = ({ open, onClose, receipt, onSuccess }) => {
  const [bounceReason, setBounceReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!bounceReason) {
      setError('Please select a bounce reason');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${BASE_URL}/api/invoices/payment-receipts/${receipt._id}/bounce`,
        { bounce_reason: bounceReason },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onSuccess();
        onClose();
        setBounceReason('');
      } else {
        setError(response.data.message || 'Failed to bounce payment receipt');
      }
    } catch (err) {
      console.error('Error bouncing payment receipt:', err);
      setError(err.response?.data?.message || 'Failed to bounce payment receipt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setBounceReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, pb: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <BounceIcon sx={{ color: '#EF4444' }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
            Bounce Payment Receipt
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Mark this payment receipt as bounced for <strong>{receipt?.customer_name || 'Customer'}</strong>
        </Typography>
        
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                Bounce Reason <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <FormControl fullWidth size="small" error={!!error}>
                <Select
                  value={bounceReason}
                  onChange={(e) => {
                    setBounceReason(e.target.value);
                    setError('');
                  }}
                  displayEmpty
                  sx={{
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    '& .MuiSelect-select': { py: 1, px: 1.5 }
                  }}
                >
                  <MenuItem value="" disabled>Select bounce reason</MenuItem>
                  {bounceReasons.map(reason => (
                    <MenuItem key={reason} value={reason} sx={{ fontSize: '0.75rem' }}>
                      {reason}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {error && !error.includes('exceed') && (
                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                  {error}
                </Typography>
              )}
            </Box>
          </Grid>

          {receipt && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary, mb: 0.5 }}>
                  Receipt Details
                </Typography>
                <Stack spacing={0.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Receipt No:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{receipt.receipt_no}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Amount:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                      ₹{formatCurrency(receipt.total_amount)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Payment Mode:</Typography>
                    <Typography sx={{ fontSize: '0.7rem' }}>{receipt.payment_mode}</Typography>
                  </Box>
                  {receipt.instrument_no && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.7rem' }}>Instrument No:</Typography>
                      <Typography sx={{ fontSize: '0.7rem' }}>{receipt.instrument_no}</Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>
          )}
        </Grid>

        {error && error.includes('exceed') && (
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
          disabled={submitting || !bounceReason}
          startIcon={submitting ? <CircularProgress size={16} /> : <BounceIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 3,
            borderRadius: 1.5,
            bgcolor: '#EF4444',
            fontSize: '0.7rem',
            textTransform: 'none',
            '&:hover': { bgcolor: '#DC2626' }
          }}
        >
          {submitting ? 'Processing...' : 'Mark as Bounced'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BounceDialog;