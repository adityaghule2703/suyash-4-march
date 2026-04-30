import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  FormControlLabel,
  Switch,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  AddLocation as AddLocationIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Warehouse as WarehouseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching your design system
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF'
};

// TextField styles matching your reference
const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    fontSize: '0.75rem',
    '&:hover fieldset': { borderColor: COLORS.primary },
    '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
  },
  '& .MuiInputBase-input': {
    py: 1,
    px: 1.5,
    fontSize: '0.75rem',
    color: COLORS.text.primary
  },
  '& .MuiInputBase-inputMultiline': {
    py: 1,
    px: 1.5,
    fontSize: '0.75rem',
    lineHeight: 1.5
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.65rem',
    marginLeft: 0,
    marginTop: 0.25
  }
};

const labelOptions = [
  { value: 'Home', label: 'Home', icon: <HomeIcon sx={{ fontSize: '0.9rem' }} /> },
  { value: 'Office', label: 'Office', icon: <BusinessIcon sx={{ fontSize: '0.9rem' }} /> },
  { value: 'Factory', label: 'Factory', icon: <WorkIcon sx={{ fontSize: '0.9rem' }} /> },
  { value: 'Warehouse', label: 'Warehouse', icon: <WarehouseIcon sx={{ fontSize: '0.9rem' }} /> }
];

const ShippingAddressDialog = ({ open, onClose, customer, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [addressData, setAddressData] = useState({
    label: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    state_code: '',
    pincode: '',
    is_default: false
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setAddressData({
        label: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        state_code: '',
        pincode: '',
        is_default: false
      });
      setError('');
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    setAddressData(prev => ({
      ...prev,
      is_default: e.target.checked
    }));
  };

  const handleLabelSelect = (label) => {
    setAddressData(prev => ({
      ...prev,
      label: label
    }));
  };

  const validateForm = () => {
    if (!addressData.label.trim()) {
      setError('Please select or enter a label for the address');
      return false;
    }
    if (!addressData.line1.trim()) {
      setError('Please enter address line 1');
      return false;
    }
    if (!addressData.city.trim()) {
      setError('Please enter city');
      return false;
    }
    if (!addressData.state.trim()) {
      setError('Please enter state');
      return false;
    }
    if (!addressData.state_code) {
      setError('Please enter state code');
      return false;
    }
    if (!addressData.pincode.trim()) {
      setError('Please enter pincode');
      return false;
    }
    if (!/^\d{6}$/.test(addressData.pincode)) {
      setError('Please enter a valid 6-digit pincode');
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
      
      const requestBody = {
        action: "add",
        address: {
          label: addressData.label,
          line1: addressData.line1,
          line2: addressData.line2 || '',
          city: addressData.city,
          state: addressData.state,
          state_code: parseInt(addressData.state_code, 10),
          pincode: addressData.pincode,
          is_default: addressData.is_default
        }
      };

      const response = await axios.put(
        `${BASE_URL}/api/customers/${customer._id}/shipping-addresses`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        onClose();
      } else {
        setError(response.data.message || 'Failed to add shipping address');
      }
    } catch (err) {
      console.error('Error adding shipping address:', err);
      setError(err.response?.data?.message || 'Failed to add shipping address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
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
          overflow: 'hidden'
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddLocationIcon sx={{ fontSize: '1.2rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Add Shipping Address
          </Typography>
          {customer && (
            <Chip 
              label={customer.customer_name} 
              size="small" 
              sx={{ 
                ml: 1, 
                bgcolor: COLORS.primaryLight, 
                color: COLORS.primary,
                fontSize: '0.7rem',
                height: 24,
                fontWeight: 500
              }} 
            />
          )}
        </Box>
        <IconButton 
          size="small" 
          onClick={handleClose}
          disabled={loading}
          sx={{ 
            '&:hover': { bgcolor: COLORS.primaryLight },
            color: COLORS.text.secondary
          }}
        >
          <CloseIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              borderRadius: 1.5, 
              '& .MuiAlert-icon': { fontSize: '1.25rem', alignItems: 'center' }, 
              fontSize: '0.75rem', 
              py: 0.5 
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Address Label Section */}
        <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
            Address Label
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
            {labelOptions.map((option) => (
              <Button
                key={option.value}
                variant={addressData.label === option.value ? "contained" : "outlined"}
                size="small"
                startIcon={option.icon}
                onClick={() => handleLabelSelect(option.value)}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  borderRadius: 1.5,
                  height: 32,
                  bgcolor: addressData.label === option.value ? COLORS.primary : 'transparent',
                  color: addressData.label === option.value ? COLORS.text.light : COLORS.text.secondary,
                  borderColor: COLORS.border,
                  '&:hover': {
                    bgcolor: addressData.label === option.value ? COLORS.primaryDark : COLORS.primaryLight,
                    borderColor: COLORS.primary
                  }
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
              OR CUSTOM LABEL
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="label"
              placeholder="Enter custom label (e.g., Branch Office)"
              value={addressData.label}
              onChange={handleChange}
              disabled={loading}
              sx={textFieldSx}
            />
          </Box>
        </Paper>

        {/* Address Details Section - Full width for each field */}
        <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
            Address Details
          </Typography>
          
          {/* Address Line 1 - Full width */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
              ADDRESS LINE 1 <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              name="line1"
              placeholder="Street address, building number, landmark"
              value={addressData.line1}
              onChange={handleChange}
              disabled={loading}
              sx={textFieldSx}
            />
          </Box>
          
          {/* Address Line 2 - Full width on next line */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
              ADDRESS LINE 2
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              name="line2"
              placeholder="Apartment, suite, unit, floor (Optional)"
              value={addressData.line2}
              onChange={handleChange}
              disabled={loading}
              sx={textFieldSx}
            />
          </Box>
        </Paper>

        {/* Location Information Section - Two columns */}
        <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
            Location Information
          </Typography>
          
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  CITY <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="city"
                  placeholder="Enter city name"
                  value={addressData.city}
                  onChange={handleChange}
                  disabled={loading}
                  sx={textFieldSx}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  PINCODE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="pincode"
                  placeholder="6-digit pincode"
                  value={addressData.pincode}
                  onChange={handleChange}
                  disabled={loading}
                  inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
                  sx={textFieldSx}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  STATE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="state"
                  placeholder="Enter state name"
                  value={addressData.state}
                  onChange={handleChange}
                  disabled={loading}
                  sx={textFieldSx}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  STATE CODE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="state_code"
                  placeholder="e.g., 27 for Maharashtra"
                  value={addressData.state_code}
                  onChange={handleChange}
                  disabled={loading}
                  type="number"
                  inputProps={{ min: 1, max: 99 }}
                  sx={textFieldSx}
                  helperText="Numeric code (e.g., 27 for Maharashtra)"
                  FormHelperTextProps={{ sx: { fontSize: '0.65rem', ml: 0, mt: 0.25 } }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Default Address Switch */}
        <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
          <FormControlLabel
            control={
              <Switch
                checked={addressData.is_default}
                onChange={handleSwitchChange}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: COLORS.primary,
                    '&:hover': {
                      bgcolor: `${COLORS.primary}20`
                    }
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: COLORS.primary
                  }
                }}
              />
            }
            label={
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Set as Default Shipping Address
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                  This address will be used as the primary shipping address
                </Typography>
              </Box>
            }
          />
        </Paper>
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
          startIcon={loading ? null : <AddLocationIcon sx={{ fontSize: '0.9rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: COLORS.primaryDark
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? <CircularProgress size={16} sx={{ mr: 0.5 }} /> : null}
          {loading ? 'Adding...' : 'Add Address'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShippingAddressDialog;