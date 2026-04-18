import React, { useState, useEffect } from 'react';
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
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  IconButton,
  Autocomplete,
  Divider
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Business as BusinessIcon,
  PersonAdd as PersonAddIcon,
  Link as LinkIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { COLORS } from './constants';

const ConvertLeadPopup = ({ open, onClose, lead, onConvert }) => {
  const [conversionType, setConversionType] = useState('new_minimal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  
  // New Customer - Minimal Form Data
  const [minimalFormData, setMinimalFormData] = useState({
    customer_code: '',
    customer_type: 'OEM',
    billing_address: {
      line1: '',
      city: '',
      state: '',
      state_code: '',
      pincode: ''
    }
  });
  
  // New Customer - Full Details Form Data
  const [fullFormData, setFullFormData] = useState({
    customer_code: '',
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
  
  // Link to Existing Customer
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch customers for dropdown
  useEffect(() => {
    if (open && conversionType === 'existing') {
      fetchCustomers();
    }
  }, [open, conversionType]);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/customers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCustomers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleMinimalChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setMinimalFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setMinimalFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFullChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFullFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFullFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateMinimalForm = () => {
    if (!minimalFormData.customer_code.trim()) {
      setError('Customer code is required');
      return false;
    }
    if (!minimalFormData.billing_address.line1.trim()) {
      setError('Address line 1 is required');
      return false;
    }
    if (!minimalFormData.billing_address.city.trim()) {
      setError('City is required');
      return false;
    }
    if (!minimalFormData.billing_address.state.trim()) {
      setError('State is required');
      return false;
    }
    if (!minimalFormData.billing_address.state_code) {
      setError('State code is required');
      return false;
    }
    if (!minimalFormData.billing_address.pincode.trim()) {
      setError('Pincode is required');
      return false;
    }
    return true;
  };

  const validateFullForm = () => {
    if (!fullFormData.customer_code.trim()) {
      setError('Customer code is required');
      return false;
    }
    if (!fullFormData.billing_address.line1.trim()) {
      setError('Address line 1 is required');
      return false;
    }
    if (!fullFormData.billing_address.city.trim()) {
      setError('City is required');
      return false;
    }
    if (!fullFormData.billing_address.state.trim()) {
      setError('State is required');
      return false;
    }
    if (!fullFormData.billing_address.state_code) {
      setError('State code is required');
      return false;
    }
    if (!fullFormData.billing_address.pincode.trim()) {
      setError('Pincode is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    
    let requestData = {};
    
    if (conversionType === 'new_minimal') {
      if (!validateMinimalForm()) return;
      requestData = {
        new_customer: {
          ...minimalFormData,
          billing_address: {
            ...minimalFormData.billing_address,
            state_code: Number(minimalFormData.billing_address.state_code)
          }
        }
      };
    } else if (conversionType === 'new_full') {
      if (!validateFullForm()) return;
      requestData = {
        new_customer: {
          ...fullFormData,
          credit_limit: fullFormData.credit_limit ? Number(fullFormData.credit_limit) : undefined,
          credit_days: fullFormData.credit_days ? Number(fullFormData.credit_days) : undefined,
          billing_address: {
            ...fullFormData.billing_address,
            state_code: Number(fullFormData.billing_address.state_code),
            pincode: fullFormData.billing_address.pincode.toString()
          }
        }
      };
    } else if (conversionType === 'existing') {
      if (!selectedCustomer) {
        setError('Please select a customer');
        return;
      }
      requestData = {
        existing_customer_id: selectedCustomer._id
      };
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/leads/${lead._id}/convert`,
        requestData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onConvert(response.data.data);
        handleClose();
      } else {
        setError(response.data.message || 'Failed to convert lead');
      }
    } catch (err) {
      console.error('Error converting lead:', err);
      setError(err.response?.data?.message || 'Failed to convert lead');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConversionType('new_minimal');
    setMinimalFormData({
      customer_code: '',
      customer_type: 'OEM',
      billing_address: {
        line1: '',
        city: '',
        state: '',
        state_code: '',
        pincode: ''
      }
    });
    setFullFormData({
      customer_code: '',
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
    setSelectedCustomer(null);
    setError('');
    onClose();
  };

  if (!lead) return null;

  const customerTypeOptions = ['OEM', 'Distributor', 'Dealer', 'Retailer', 'End User', 'Other'];
  const priorityOptions = ['Key Account', 'High', 'Medium', 'Low'];

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
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Convert Lead to Customer
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, overflowY: 'auto' }}>
        <Stack spacing={2.5}>
          {/* Lead Information */}
          {/* <Paper sx={{ 
            p: 1.5, 
            bgcolor: COLORS.background.light, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            boxShadow: 'none'
          }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Lead ID:</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {lead.lead_id}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Company:</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {lead.company_name}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Contact:</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {lead.contact_name}
                </Typography>
              </Stack>
            </Stack>
          </Paper> */}

          {/* Conversion Type Selection */}
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1, letterSpacing: '0.5px' }}>
              CONVERSION TYPE <span style={{ color: '#EF4444' }}>*</span>
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                  fullWidth
                  variant={conversionType === 'new_minimal' ? 'contained' : 'outlined'}
                  onClick={() => setConversionType('new_minimal')}
                  
                  sx={{
                    height: 56,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    flexDirection: 'column',
                    gap: 0.5,
                    bgcolor: conversionType === 'new_minimal' ? COLORS.primary : 'transparent',
                    borderColor: COLORS.border,
                    color: conversionType === 'new_minimal' ? COLORS.text.light : COLORS.text.secondary,
                    '&:hover': {
                      bgcolor: conversionType === 'new_minimal' ? COLORS.primaryDark : COLORS.primaryLight
                    }
                  }}
                >
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                    New Customer
                  </Typography>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 400 }}>
                    Minimal Details
                  </Typography>
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                  fullWidth
                  variant={conversionType === 'new_full' ? 'contained' : 'outlined'}
                  onClick={() => setConversionType('new_full')}
               
                  sx={{
                    height: 56,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    flexDirection: 'column',
                    gap: 0.5,
                    bgcolor: conversionType === 'new_full' ? COLORS.primary : 'transparent',
                    borderColor: COLORS.border,
                    color: conversionType === 'new_full' ? COLORS.text.light : COLORS.text.secondary,
                    '&:hover': {
                      bgcolor: conversionType === 'new_full' ? COLORS.primaryDark : COLORS.primaryLight
                    }
                  }}
                >
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                    New Customer
                  </Typography>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 400 }}>
                    Full Details
                  </Typography>
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                  fullWidth
                  variant={conversionType === 'existing' ? 'contained' : 'outlined'}
                  onClick={() => setConversionType('existing')}
             
                  sx={{
                    height: 56,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    flexDirection: 'column',
                    gap: 0.5,
                    bgcolor: conversionType === 'existing' ? COLORS.primary : 'transparent',
                    borderColor: COLORS.border,
                    color: conversionType === 'existing' ? COLORS.text.light : COLORS.text.secondary,
                    '&:hover': {
                      bgcolor: conversionType === 'existing' ? COLORS.primaryDark : COLORS.primaryLight
                    }
                  }}
                >
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                    Existing Customer
                  </Typography>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 400 }}>
                    Link to existing
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Form based on selected conversion type */}
          {conversionType === 'new_minimal' && (
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Customer Information (Minimal)
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CUSTOMER CODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="customer_code"
                      value={minimalFormData.customer_code}
                      onChange={handleMinimalChange}
                      placeholder="e.g., SIEMENS-001"
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CUSTOMER TYPE
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="customer_type"
                        value={minimalFormData.customer_type}
                        onChange={handleMinimalChange}
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

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ADDRESS LINE 1 <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.line1"
                      value={minimalFormData.billing_address.line1}
                      onChange={handleMinimalChange}
                      placeholder="e.g., Kalwa Works, Plot No 12"
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CITY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.city"
                      value={minimalFormData.billing_address.city}
                      onChange={handleMinimalChange}
                      placeholder="e.g., Thane"
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.state"
                      value={minimalFormData.billing_address.state}
                      onChange={handleMinimalChange}
                      placeholder="e.g., Maharashtra"
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STATE CODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.state_code"
                      type="number"
                      value={minimalFormData.billing_address.state_code}
                      onChange={handleMinimalChange}
                      placeholder="e.g., 27"
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PINCODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.pincode"
                      value={minimalFormData.billing_address.pincode}
                      onChange={handleMinimalChange}
                      placeholder="e.g., 400605"
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
              </Grid>
            </Box>
          )}

          {conversionType === 'new_full' && (
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Customer Information (Full Details)
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CUSTOMER CODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="customer_code"
                      value={fullFormData.customer_code}
                      onChange={handleFullChange}
                      placeholder="e.g., SIEMENS-001"
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CUSTOMER TYPE
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="customer_type"
                        value={fullFormData.customer_type}
                        onChange={handleFullChange}
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      GSTIN
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="gstin"
                      value={fullFormData.gstin}
                      onChange={handleFullChange}
                      placeholder="e.g., 27AAECS7112G1Z5"
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PRIORITY
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="priority"
                        value={fullFormData.priority}
                        onChange={handleFullChange}
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

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CREDIT LIMIT
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="credit_limit"
                      type="number"
                      value={fullFormData.credit_limit}
                      onChange={handleFullChange}
                      placeholder="e.g., 500000"
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

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CREDIT DAYS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="credit_days"
                      type="number"
                      value={fullFormData.credit_days}
                      onChange={handleFullChange}
                      placeholder="e.g., 45"
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

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PAYMENT TERMS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="payment_terms"
                      value={fullFormData.payment_terms}
                      onChange={handleFullChange}
                      placeholder="e.g., Net 45"
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ADDRESS LINE 1 <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.line1"
                      value={fullFormData.billing_address.line1}
                      onChange={handleFullChange}
                      placeholder="e.g., Kalwa Works, Plot No 12"
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ADDRESS LINE 2
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.line2"
                      value={fullFormData.billing_address.line2}
                      onChange={handleFullChange}
                      placeholder="e.g., MIDC Industrial Area"
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CITY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.city"
                      value={fullFormData.billing_address.city}
                      onChange={handleFullChange}
                      placeholder="e.g., Thane"
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DISTRICT
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.district"
                      value={fullFormData.billing_address.district}
                      onChange={handleFullChange}
                      placeholder="e.g., Thane"
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

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.state"
                      value={fullFormData.billing_address.state}
                      onChange={handleFullChange}
                      placeholder="e.g., Maharashtra"
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

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STATE CODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.state_code"
                      type="number"
                      value={fullFormData.billing_address.state_code}
                      onChange={handleFullChange}
                      placeholder="e.g., 27"
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

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PINCODE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.pincode"
                      value={fullFormData.billing_address.pincode}
                      onChange={handleFullChange}
                      placeholder="e.g., 400605"
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      COUNTRY
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="billing_address.country"
                      value={fullFormData.billing_address.country}
                      onChange={handleFullChange}
                      placeholder="India"
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
              </Grid>
            </Box>
          )}

          {conversionType === 'existing' && (
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Link to Existing Customer
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  SELECT CUSTOMER <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  fullWidth
                  options={customers}
                  getOptionLabel={(option) => `${option.customer_code} - ${option.customer_name}`}
                  value={selectedCustomer}
                  onChange={(event, newValue) => setSelectedCustomer(newValue)}
                  loading={loadingCustomers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Search customers..."
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
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{option.customer_name}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Code: {option.customer_code} | Type: {option.customer_type}
                        </Typography>
                      </Box>
                    </li>
                  )}
                />
              </Box>
            </Box>
          )}

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
          startIcon={loading ? null : <CheckCircleIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Converting...' : 'Convert to Customer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConvertLeadPopup;