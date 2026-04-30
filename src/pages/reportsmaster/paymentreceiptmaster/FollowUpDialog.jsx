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
import { Phone as PhoneIcon, Email as EmailIcon, Home as VisitIcon, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
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

const channelOptions = [
  { value: 'Call', label: 'Call', icon: <PhoneIcon sx={{ fontSize: '0.9rem' }} /> },
  { value: 'Email', label: 'Email', icon: <EmailIcon sx={{ fontSize: '0.9rem' }} /> },
  { value: 'Visit', label: 'Visit', icon: <VisitIcon sx={{ fontSize: '0.9rem' }} /> },
  { value: 'WhatsApp', label: 'WhatsApp', icon: <WhatsAppIcon sx={{ fontSize: '0.9rem' }} /> },
];

const getChannelIcon = (channel) => {
  const option = channelOptions.find(opt => opt.value === channel);
  return option?.icon || <PhoneIcon sx={{ fontSize: '0.9rem' }} />;
};

const FollowUpDialog = ({ open, onClose, receipt, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    channel: 'Call',
    summary: '',
    promise_date: new Date().toISOString().split('T')[0],
    promise_amount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.summary || formData.summary.trim() === '') {
      setError('Please enter a summary for the follow-up');
      return;
    }
    if (!formData.promise_date) {
      setError('Please select a promise date');
      return;
    }
    if (!formData.promise_amount || parseFloat(formData.promise_amount) < 0) {
      setError('Please enter a valid promise amount');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const payload = {
        channel: formData.channel,
        summary: formData.summary,
        promise_date: formData.promise_date,
        promise_amount: parseFloat(formData.promise_amount)
      };
      
      const response = await axios.put(
        `${BASE_URL}/api/invoices/payment-receipts/${receipt._id}/followup`,
        payload,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onSuccess();
        onClose();
        setFormData({
          channel: 'Call',
          summary: '',
          promise_date: new Date().toISOString().split('T')[0],
          promise_amount: '',
        });
      } else {
        setError(response.data.message || 'Failed to add follow-up');
      }
    } catch (err) {
      console.error('Error adding follow-up:', err);
      setError(err.response?.data?.message || 'Failed to add follow-up. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      channel: 'Call',
      summary: '',
      promise_date: new Date().toISOString().split('T')[0],
      promise_amount: '',
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, pb: 2, mb:2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {getChannelIcon(formData.channel)}
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
            Add Follow-Up
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Add a follow-up action for payment receipt <strong>{receipt?.receipt_no}</strong> for customer <strong>{receipt?.customer_name || 'Customer'}</strong>
        </Typography>
        
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                Channel <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  name="channel"
                  value={formData.channel}
                  onChange={handleChange}
                  sx={{
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    '& .MuiSelect-select': { py: 1, px: 1.5, display: 'flex', alignItems: 'center', gap: 1 }
                  }}
                  renderValue={(value) => (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {getChannelIcon(value)}
                      <Typography sx={{ fontSize: '0.75rem' }}>{value}</Typography>
                    </Stack>
                  )}
                >
                  {channelOptions.map(option => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.icon}
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                Promise Date <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                type="date"
                size="small"
                name="promise_date"
                value={formData.promise_date}
                onChange={handleChange}
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

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                Promise Amount <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                type="number"
                size="small"
                name="promise_amount"
                value={formData.promise_amount}
                onChange={handleChange}
                placeholder="0.00"
                InputProps={{
                  startAdornment: <Typography sx={{ fontSize: '0.7rem', mr: 0.5 }}>₹</Typography>,
                  inputProps: { step: 0.01, min: 0 }
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

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                Summary / Notes <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                size="small"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Enter follow-up details, conversation summary, or action items..."
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
                    <Typography sx={{ fontSize: '0.7rem' }}>Total Amount:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                      ₹{formatCurrency(receipt.total_amount)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Net Received:</Typography>
                    <Typography sx={{ fontSize: '0.7rem' }}>₹{formatCurrency(receipt.net_received)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Status:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: receipt.status === 'Bounced' ? '#EF4444' : '#10B981' }}>
                      {receipt.status || 'Pending'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          )}
        </Grid>

        {error && (
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
          disabled={submitting || !formData.summary || !formData.promise_date || !formData.promise_amount}
          startIcon={submitting ? <CircularProgress size={16} /> : <PhoneIcon sx={{ fontSize: '1rem' }} />}
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
          {submitting ? 'Adding...' : 'Add Follow-Up'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FollowUpDialog;