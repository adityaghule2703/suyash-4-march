import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Business as BusinessIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching AddCustomer
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

// Modern Stepper Connector
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Options
const UNIT_OPTIONS = ['Nos', 'Kg', 'Meter', 'Set', 'Piece'];
const DC_TYPE_OPTIONS = ['Supply of Goods', 'Delivery for Approval', 'Job Work Outward', 'Sales Return', 'Exhibition', 'Export'];

const steps = ['Sales Order Info', 'Shipping Address', 'Items Details'];

const AddDeliveryChallan = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Data fetching states
  const [salesOrders, setSalesOrders] = useState([]);
  const [selectedSO, setSelectedSO] = useState(null);
  const [loadingSO, setLoadingSO] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    so_id: '',
    dc_type: 'Supply of Goods',
    ship_to: {
      line1: '',
      line2: '',
      city: '',
      district: '',
      state: '',
      state_code: '',
      pincode: '',
      country: 'India'
    },
    items: []
  });

  // Fetch Sales Orders
  const fetchSalesOrders = useCallback(async () => {
    try {
      setLoadingSO(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/sales-orders?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSalesOrders(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching sales orders:', err);
    } finally {
      setLoadingSO(false);
    }
  }, []);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchSalesOrders();
    }
  }, [open, fetchSalesOrders]);

  // Handle SO selection
  const handleSOChange = (event, newValue) => {
    setSelectedSO(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        so_id: newValue._id,
        items: newValue.items.map(item => ({
          so_item_id: item._id,
          part_no: item.part_no,
          part_name: item.part_name,
          hsn_code: item.hsn_code,
          dispatch_qty: '',
          unit: item.unit || 'Nos',
          unit_price: item.unit_price || '',
          batch_no: '',
          quality_cert_id: ''
        }))
      }));
      
      // Auto-fill shipping address from SO if available
      if (newValue.shipping_address && newValue.shipping_address.line1) {
        setFormData(prev => ({
          ...prev,
          ship_to: {
            line1: newValue.shipping_address.line1 || '',
            line2: newValue.shipping_address.line2 || '',
            city: newValue.shipping_address.city || '',
            district: newValue.shipping_address.district || '',
            state: newValue.shipping_address.state || '',
            state_code: newValue.shipping_address.state_code || '',
            pincode: newValue.shipping_address.pincode || '',
            country: newValue.shipping_address.country || 'India'
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        so_id: '',
        items: []
      }));
    }
    setFieldErrors({});
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      ship_to: { ...prev.ship_to, [field]: value }
    }));
    setFieldErrors(prev => ({ ...prev, [`ship_to_${field}`]: '' }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: updatedItems }));
    setFieldErrors(prev => ({ ...prev, [`item_${index}_${field}`]: '' }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          so_item_id: '',
          part_no: '',
          part_name: '',
          hsn_code: '',
          dispatch_qty: '',
          unit: 'Nos',
          unit_price: '',
          batch_no: '',
          quality_cert_id: ''
        }
      ]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: updatedItems }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Sales Order Info
        if (!formData.so_id) {
          errors.so_id = 'Sales Order is required';
          isValid = false;
        }
        if (!formData.dc_type) {
          errors.dc_type = 'DC Type is required';
          isValid = false;
        }
        break;
      
      case 1: // Shipping Address
        if (!formData.ship_to.line1.trim()) {
          errors.ship_to_line1 = 'Address line 1 is required';
          isValid = false;
        }
        if (!formData.ship_to.city.trim()) {
          errors.ship_to_city = 'City is required';
          isValid = false;
        }
        if (!formData.ship_to.state.trim()) {
          errors.ship_to_state = 'State is required';
          isValid = false;
        }
        if (!formData.ship_to.pincode.trim()) {
          errors.ship_to_pincode = 'Pincode is required';
          isValid = false;
        }
        break;
      
      case 2: // Items Details
        for (let i = 0; i < formData.items.length; i++) {
          if (!formData.items[i].part_no) {
            errors[`item_${i}_part_no`] = `Item ${i + 1}: Part No is required`;
            isValid = false;
          }
          if (!formData.items[i].dispatch_qty) {
            errors[`item_${i}_dispatch_qty`] = `Item ${i + 1}: Dispatch quantity is required`;
            isValid = false;
          }
          if (formData.items[i].dispatch_qty && formData.items[i].dispatch_qty <= 0) {
            errors[`item_${i}_dispatch_qty`] = `Item ${i + 1}: Quantity must be greater than 0`;
            isValid = false;
          }
          if (!formData.items[i].unit_price) {
            errors[`item_${i}_unit_price`] = `Item ${i + 1}: Unit price is required`;
            isValid = false;
          }
          if (formData.items[i].unit_price && formData.items[i].unit_price <= 0) {
            errors[`item_${i}_unit_price`] = `Item ${i + 1}: Unit price must be greater than 0`;
            isValid = false;
          }
        }
        break;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
    }
    return isValid;
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.so_id) {
      errors.so_id = 'Sales Order is required';
      isValid = false;
    }
    if (!formData.dc_type) {
      errors.dc_type = 'DC Type is required';
      isValid = false;
    }
    
    if (!formData.ship_to.line1.trim()) {
      errors.ship_to_line1 = 'Address line 1 is required';
      isValid = false;
    }
    if (!formData.ship_to.city.trim()) {
      errors.ship_to_city = 'City is required';
      isValid = false;
    }
    if (!formData.ship_to.state.trim()) {
      errors.ship_to_state = 'State is required';
      isValid = false;
    }
    if (!formData.ship_to.pincode.trim()) {
      errors.ship_to_pincode = 'Pincode is required';
      isValid = false;
    }
    
    for (let i = 0; i < formData.items.length; i++) {
      if (!formData.items[i].part_no) {
        errors[`item_${i}_part_no`] = `Item ${i + 1}: Part No is required`;
        isValid = false;
      }
      if (!formData.items[i].dispatch_qty) {
        errors[`item_${i}_dispatch_qty`] = `Item ${i + 1}: Dispatch quantity is required`;
        isValid = false;
      }
      if (formData.items[i].dispatch_qty && formData.items[i].dispatch_qty <= 0) {
        errors[`item_${i}_dispatch_qty`] = `Item ${i + 1}: Quantity must be greater than 0`;
        isValid = false;
      }
      if (!formData.items[i].unit_price) {
        errors[`item_${i}_unit_price`] = `Item ${i + 1}: Unit price is required`;
        isValid = false;
      }
      if (formData.items[i].unit_price && formData.items[i].unit_price <= 0) {
        errors[`item_${i}_unit_price`] = `Item ${i + 1}: Unit price must be greater than 0`;
        isValid = false;
      }
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix all validation errors');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const requestData = {
        so_id: formData.so_id,
        dc_type: formData.dc_type,
        ship_to: formData.ship_to,
        items: formData.items.map(item => ({
          so_item_id: item.so_item_id,
          part_no: item.part_no,
          part_name: item.part_name,
          hsn_code: item.hsn_code,
          dispatch_qty: Number(item.dispatch_qty),
          unit: item.unit,
          unit_price: Number(item.unit_price),
          batch_no: item.batch_no || undefined,
          quality_cert_id: item.quality_cert_id || undefined
        }))
      };

      const response = await axios.post(`${BASE_URL}/api/delivery-challans`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onSuccess();
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to create delivery challan');
      }
    } catch (err) {
      console.error('Error creating delivery challan:', err);
      setError(err.response?.data?.message || 'Failed to create delivery challan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setSelectedSO(null);
    setFormData({
      so_id: '',
      dc_type: 'Supply of Goods',
      ship_to: {
        line1: '',
        line2: '',
        city: '',
        district: '',
        state: '',
        state_code: '',
        pincode: '',
        country: 'India'
      },
      items: []
    });
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Render Step Content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Sales Order Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Select Sales Order <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={salesOrders}
                      getOptionLabel={(option) => `${option.so_number} - ${option.customer_name || option.customer_id}`}
                      loading={loadingSO}
                      value={selectedSO}
                      onChange={handleSOChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Search and select sales order"
                          error={!!fieldErrors.so_id}
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
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingSO && <CircularProgress size={16} />}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                    {fieldErrors.so_id && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.so_id}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      DC Type <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.dc_type}>
                      <Select
                        value={formData.dc_type}
                        onChange={handleChange}
                        name="dc_type"
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        {DC_TYPE_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {fieldErrors.dc_type && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.dc_type}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <LocationIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Shipping Address <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Address Line 1 <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.ship_to.line1}
                      onChange={(e) => handleAddressChange('line1', e.target.value)}
                      placeholder="e.g., Plot No. A-123, MIDC Area"
                      error={!!fieldErrors.ship_to_line1}
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
                    {fieldErrors.ship_to_line1 && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.ship_to_line1}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Address Line 2
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.ship_to.line2}
                      onChange={(e) => handleAddressChange('line2', e.target.value)}
                      placeholder="e.g., Chakan Industrial Park"
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
                      City <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.ship_to.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      placeholder="e.g., Pune"
                      error={!!fieldErrors.ship_to_city}
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
                    {fieldErrors.ship_to_city && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.ship_to_city}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      District
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.ship_to.district}
                      onChange={(e) => handleAddressChange('district', e.target.value)}
                      placeholder="e.g., Pune"
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
                      State <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.ship_to.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      placeholder="e.g., Maharashtra"
                      error={!!fieldErrors.ship_to_state}
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
                    {fieldErrors.ship_to_state && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.ship_to_state}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      State Code
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.ship_to.state_code}
                      onChange={(e) => handleAddressChange('state_code', e.target.value)}
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Pincode <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.ship_to.pincode}
                      onChange={(e) => handleAddressChange('pincode', e.target.value)}
                      placeholder="e.g., 411001"
                      error={!!fieldErrors.ship_to_pincode}
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
                    {fieldErrors.ship_to_pincode && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.ship_to_pincode}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Country
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.ship_to.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      placeholder="e.g., India"
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
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Items to Dispatch <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              {formData.items.map((item, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 1.5,
                    mb: 2,
                    bgcolor: COLORS.background.light,
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Item {index + 1}
                    </Typography>
                    {formData.items.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removeItem(index)}
                        sx={{ color: '#EF4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                  
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Part No <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.part_no}
                          InputProps={{ readOnly: !!selectedSO }}
                          placeholder="e.g., CB-100X10-C11000"
                          error={!!fieldErrors[`item_${index}_part_no`]}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              bgcolor: selectedSO ? '#F5F5F5' : 'transparent',
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
                        {fieldErrors[`item_${index}_part_no`] && (
                          <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                            {fieldErrors[`item_${index}_part_no`]}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Part Name
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.part_name}
                          InputProps={{ readOnly: true }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              bgcolor: '#F5F5F5',
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
                          HSN Code
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.hsn_code}
                          InputProps={{ readOnly: true }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              bgcolor: '#F5F5F5',
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
                    
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Dispatch Qty <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={item.dispatch_qty}
                          onChange={(e) => handleItemChange(index, 'dispatch_qty', e.target.value)}
                          placeholder="100"
                          error={!!fieldErrors[`item_${index}_dispatch_qty`]}
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
                        {fieldErrors[`item_${index}_dispatch_qty`] && (
                          <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                            {fieldErrors[`item_${index}_dispatch_qty`]}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Unit
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            sx={{
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '& .MuiSelect-select': { py: 1, px: 1.5 }
                            }}
                          >
                            {UNIT_OPTIONS.map(option => (
                              <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Unit Price <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                          placeholder="2500"
                          error={!!fieldErrors[`item_${index}_unit_price`]}
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
                        {fieldErrors[`item_${index}_unit_price`] && (
                          <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                            {fieldErrors[`item_${index}_unit_price`]}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Batch No (Optional)
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.batch_no}
                          onChange={(e) => handleItemChange(index, 'batch_no', e.target.value)}
                          placeholder="BATCH-2403-001"
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
                </Paper>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={addItem}
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
                Add Item
              </Button>
            </Paper>
          </Stack>
        );

      default:
        return null;
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
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Create Delivery Challan
        </Typography>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
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
          Back
        </Button>
        <Box>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              height: 32,
              px: 2,
              mr: 1,
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
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !selectedSO}
              startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
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
                  bgcolor: COLORS.primaryDark,
                }
              }}
            >
              {loading ? 'Creating...' : 'Create DC'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
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
                  bgcolor: COLORS.primaryDark,
                }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddDeliveryChallan;