import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  Alert,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Grid,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS } from './constants';

const AddCustomerModal = ({ open, onClose, onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New Customer - Full Details Form Data
  const [formData, setFormData] = useState({
    customer_code: '',
    customer_name: '',
    customer_type: 'OEM',
    gstin: '',
    priority: 'Key Account',
    credit_limit: '',
    credit_days: '',
    payment_terms: '',
    billing_address: {
      line1: '',
      line2: '',
      city: '',
      district: '',
      state: '',
      state_code: '',
      pincode: '',
      country: 'India'
    }
  });

  const customerTypeOptions = ['OEM', 'Distributor', 'Dealer', 'Retailer', 'End User', 'Other'];
  const priorityOptions = ['Key Account', 'High', 'Medium', 'Low'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
  };

  const validateForm = () => {
    if (!formData.customer_code.trim()) {
      setError('Customer code is required');
      return false;
    }
    if (!formData.customer_name.trim()) {
      setError('Customer name is required');
      return false;
    }
    if (!formData.billing_address.line1.trim()) {
      setError('Address line 1 is required');
      return false;
    }
    if (!formData.billing_address.city.trim()) {
      setError('City is required');
      return false;
    }
    if (!formData.billing_address.state.trim()) {
      setError('State is required');
      return false;
    }
    if (!formData.billing_address.state_code) {
      setError('State code is required');
      return false;
    }
    if (!formData.billing_address.pincode.trim()) {
      setError('Pincode is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/customers`,
        {
          ...formData,
          credit_limit: formData.credit_limit ? Number(formData.credit_limit) : undefined,
          credit_days: formData.credit_days ? Number(formData.credit_days) : undefined,
          billing_address: {
            ...formData.billing_address,
            state_code: Number(formData.billing_address.state_code),
            pincode: formData.billing_address.pincode.toString()
          }
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onAdd(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to add customer');
      }
    } catch (err) {
      console.error('Error adding customer:', err);
      setError(err.response?.data?.message || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
    setError('');
  };

  const resetForm = () => {
    setFormData({
      customer_code: '',
      customer_name: '',
      customer_type: 'OEM',
      gstin: '',
      priority: 'Key Account',
      credit_limit: '',
      credit_days: '',
      payment_terms: '',
      billing_address: {
        line1: '',
        line2: '',
        city: '',
        district: '',
        state: '',
        state_code: '',
        pincode: '',
        country: 'India'
      }
    });
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      backgroundColor: COLORS.background.white,
      '&:hover fieldset': {
        borderColor: COLORS.primary,
      },
      '&.Mui-focused fieldset': {
        borderColor: COLORS.primary,
        borderWidth: 1
      }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary,
      '&::placeholder': {
        color: COLORS.text.tertiary,
        fontSize: '0.75rem'
      }
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Add New Customer
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, overflowY: 'auto' }}>
        <Stack spacing={2.5}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  CUSTOMER CODE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="customer_code"
                  value={formData.customer_code}
                  onChange={handleChange}
                  placeholder="e.g., SIEMENS-001"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  CUSTOMER NAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="e.g., Siemens Ltd."
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  CUSTOMER TYPE
                </Typography>
                <FormControl fullWidth size="small" disabled={loading}>
                  <Select
                    name="customer_type"
                    value={formData.customer_type}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '& .MuiSelect-select': { py: 1, px: 1.5 }
                    }}
                  >
                    {customerTypeOptions.map(option => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  GSTIN
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="e.g., 27AAECS7112G1Z5"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  PRIORITY
                </Typography>
                <FormControl fullWidth size="small" disabled={loading}>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '& .MuiSelect-select': { py: 1, px: 1.5 }
                    }}
                  >
                    {priorityOptions.map(option => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  PAYMENT TERMS
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="payment_terms"
                  value={formData.payment_terms}
                  onChange={handleChange}
                  placeholder="e.g., Net 45"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  CREDIT LIMIT
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="credit_limit"
                  type="number"
                  value={formData.credit_limit}
                  onChange={handleChange}
                  placeholder="e.g., 500000"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  CREDIT DAYS
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="credit_days"
                  type="number"
                  value={formData.credit_days}
                  onChange={handleChange}
                  placeholder="e.g., 45"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  ADDRESS LINE 1 <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="billing_address.line1"
                  value={formData.billing_address.line1}
                  onChange={handleChange}
                  placeholder="e.g., Kalwa Works, Plot No 12"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  ADDRESS LINE 2
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="billing_address.line2"
                  value={formData.billing_address.line2}
                  onChange={handleChange}
                  placeholder="e.g., MIDC Industrial Area"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  CITY <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="billing_address.city"
                  value={formData.billing_address.city}
                  onChange={handleChange}
                  placeholder="e.g., Thane"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  DISTRICT
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="billing_address.district"
                  value={formData.billing_address.district}
                  onChange={handleChange}
                  placeholder="e.g., Thane"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  STATE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="billing_address.state"
                  value={formData.billing_address.state}
                  onChange={handleChange}
                  placeholder="e.g., Maharashtra"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  STATE CODE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="billing_address.state_code"
                  type="number"
                  value={formData.billing_address.state_code}
                  onChange={handleChange}
                  placeholder="e.g., 27"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  PINCODE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="billing_address.pincode"
                  value={formData.billing_address.pincode}
                  onChange={handleChange}
                  placeholder="e.g., 400605"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={labelStyle}>
                  COUNTRY
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="billing_address.country"
                  value={formData.billing_address.country}
                  onChange={handleChange}
                  placeholder="India"
                  disabled={loading}
                  sx={inputStyle}
                />
              </Box>
            </Grid>
          </Grid>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5,
                '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' },
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
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
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            }
          }}
        >
          {loading ? <CircularProgress size={16} sx={{ color: COLORS.text.light }} /> : 'Add Customer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerModal;