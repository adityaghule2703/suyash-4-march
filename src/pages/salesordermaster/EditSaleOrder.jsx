// EditSaleOrder.jsx - Only updatable fields editable
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
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
  Select,
  MenuItem,
  styled,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';
import AddCustomer from '../master/customermaster/AddCustomer';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9'
  },
  border: '#E3E8EF'
};

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

const DELIVERY_TERMS_OPTIONS = ['Ex-Works', 'FOR Destination', 'CIF', 'FOB', ''];
const DELIVERY_MODE_OPTIONS = ['Road', 'Rail', 'Air', 'Sea', 'Hand Delivery', ''];

const steps = ['Basic Information', 'Delivery Details', 'Items', 'Review & Submit'];

const EditSaleOrder = ({ open, onClose, so, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [customers, setCustomers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  
  // Read-only data from the order (cannot be edited)
  const [readOnlyData, setReadOnlyData] = useState({
    so_number: '',
    customer_name: '',
    customer_id: '',
    currency: 'INR',
    so_date: '',
    status: ''
  });
  
  // Editable fields only
  const [formData, setFormData] = useState({
    customer_po_number: '',
    customer_po_date: '',
    payment_terms: '',
    delivery_terms: '',
    delivery_mode: '',
    transporter: '',
    expected_delivery_date: '',
    internal_remarks: '',
    shipping_address: {
      line1: '',
      line2: '',
      city: '',
      district: '',
      state: '',
      state_code: 0,
      pincode: '',
      country: 'India'
    },
    billing_address: {
      line1: '',
      line2: '',
      city: '',
      district: '',
      state: '',
      state_code: 0,
      pincode: '',
      country: 'India'
    },
    terms_conditions: []
  });
  
  // Items are read-only - display only
  const [soItems, setSoItems] = useState([]);
  const [calculatedTotals, setCalculatedTotals] = useState({
    sub_total: 0,
    discount_total: 0,
    taxable_total: 0,
    gst_total: 0,
    grand_total: 0
  });
  
  const fetchCustomers = useCallback(async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/customers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setCustomers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);
  
  const handleCustomerAdded = (newCustomer) => {
    setCustomers(prev => [...prev, newCustomer]);
  };
  
  useEffect(() => {
    if (open && so) {
      const loadData = async () => {
        await fetchCustomers();
        initializeFormData();
      };
      loadData();
    }
  }, [open, so]);
  
  const initializeFormData = () => {
    if (!so) return;
    
    const customerName = so.customer_id?.customer_name || 
                         customers.find(c => c._id === so.customer_id)?.customer_name || 
                         so.customer_name || '-';
    
    setReadOnlyData({
      so_number: so.so_number || '-',
      customer_name: customerName,
      customer_id: so.customer_id?._id || so.customer_id || '',
      currency: so.currency || 'INR',
      so_date: so.so_date ? new Date(so.so_date).toISOString().split('T')[0] : '',
      status: so.status || 'Draft'
    });
    
    setFormData({
      customer_po_number: so.customer_po_number || '',
      customer_po_date: so.customer_po_date ? new Date(so.customer_po_date).toISOString().split('T')[0] : '',
      payment_terms: so.payment_terms || '',
      delivery_terms: so.delivery_terms || '',
      delivery_mode: so.delivery_mode || '',
      transporter: so.transporter || '',
      expected_delivery_date: so.expected_delivery_date ? new Date(so.expected_delivery_date).toISOString().split('T')[0] : '',
      internal_remarks: so.internal_remarks || '',
      shipping_address: so.shipping_address || {
        line1: '',
        line2: '',
        city: '',
        district: '',
        state: '',
        state_code: 0,
        pincode: '',
        country: 'India'
      },
      billing_address: so.billing_address || {
        line1: '',
        line2: '',
        city: '',
        district: '',
        state: '',
        state_code: 0,
        pincode: '',
        country: 'India'
      },
      terms_conditions: so.terms_conditions || []
    });
    
    // Items are read-only - just for display
    const mappedItems = (so.items || []).map(item => {
      let fullItem = null;
      
      if (item.item_id && typeof item.item_id === 'object') {
        fullItem = item.item_id;
      }
      
      const partNo = fullItem?.part_no || item.part_no || '';
      const partName = fullItem?.part_description || fullItem?.part_name || item.part_name || '';
      const unit = fullItem?.unit || item.unit || 'Nos';
      
      return {
        item_id: item.item_id?._id || item.item_id || '',
        part_no: partNo,
        part_name: partName,
        unit: unit,
        ordered_qty: item.ordered_qty || 1,
        unit_price: item.unit_price || 0,
        discount_percent: item.discount_percent || 0,
        required_date: item.required_date ? new Date(item.required_date).toISOString().split('T')[0] : '',
        committed_date: item.committed_date ? new Date(item.committed_date).toISOString().split('T')[0] : '',
        remarks: item.remarks || ''
      };
    });
    
    setSoItems(mappedItems);
    
    if (mappedItems.length > 0) {
      calculateTotals(mappedItems);
    }
    
    setActiveStep(0);
    setError('');
    setFieldErrors({});
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleAddressChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };
  
  const calculateTotals = (items) => {
    let sub_total = 0;
    let discount_total = 0;
    
    items.forEach(item => {
      const qty = Number(item.ordered_qty) || 0;
      const price = Number(item.unit_price) || 0;
      const discount = Number(item.discount_percent) || 0;
      
      const item_total = qty * price;
      const item_discount = (item_total * discount) / 100;
      
      sub_total += item_total;
      discount_total += item_discount;
    });
    
    const taxable_total = sub_total - discount_total;
    const gst_total = (taxable_total * 18) / 100;
    const grand_total = taxable_total + gst_total;
    
    setCalculatedTotals({
      sub_total: sub_total,
      discount_total: discount_total,
      taxable_total: taxable_total,
      gst_total: gst_total,
      grand_total: grand_total
    });
  };
  
  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    
    switch (step) {
      case 0:
        if (!formData.expected_delivery_date) {
          errors.expected_delivery_date = 'Expected delivery date is required';
          isValid = false;
        }
        break;
      default:
        return true;
    }
    
    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
    } else {
      setError('');
    }
    return isValid;
  };
  
  const validateAllFields = () => {
    const errors = {};
    let isValid = true;
    
    if (!formData.expected_delivery_date) {
      errors.expected_delivery_date = 'Expected delivery date is required';
      isValid = false;
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
    if (!validateAllFields()) {
      return;
    }
    
    // Check if order is Cancelled or Closed
    if (readOnlyData.status === 'Cancelled' || readOnlyData.status === 'Closed') {
      setError(`Cannot update ${readOnlyData.status} Sales Order`);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Only send updatable fields
      const submitData = {
        expected_delivery_date: formData.expected_delivery_date,
        payment_terms: formData.payment_terms || undefined,
        delivery_terms: formData.delivery_terms || undefined,
        delivery_mode: formData.delivery_mode || undefined,
        transporter: formData.transporter || undefined,
        internal_remarks: formData.internal_remarks || undefined,
        customer_po_number: formData.customer_po_number || undefined,
        customer_po_date: formData.customer_po_date || undefined,
        shipping_address: formData.shipping_address,
        billing_address: formData.billing_address,
        terms_conditions: formData.terms_conditions
      };
      
      // Remove undefined values
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === undefined) {
          delete submitData[key];
        }
      });
      
      console.log('Submitting edit data:', submitData);
      
      const response = await axios.put(`${BASE_URL}/api/sales-orders/${so._id}`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        if (onUpdate) {
          onUpdate(response.data.data);
        }
        onClose();
      } else {
        setError(response.data.message || 'Failed to update Sales Order');
      }
    } catch (err) {
      console.error('Error updating Sales Order:', err);
      setError(err.response?.data?.message || 'Failed to update Sales Order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: readOnlyData.currency || 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const Label = ({ children, required }) => (
    <Typography sx={{ 
      fontSize: '0.7rem', 
      fontWeight: 600, 
      color: COLORS.text.secondary, 
      letterSpacing: '0.5px' 
    }}>
      {children} {required && <span style={{ color: '#EF4444' }}>*</span>}
    </Typography>
  );
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>SO NUMBER</Label>
                    <Typography sx={{ 
                      fontSize: '0.8rem', fontWeight: 500, color: COLORS.text.primary,
                      py: 1, px: 1.5, bgcolor: COLORS.background.light,
                      borderRadius: 1.5, border: `1px solid ${COLORS.border}`
                    }}>
                      {readOnlyData.so_number}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>SO DATE</Label>
                    <Typography sx={{ 
                      fontSize: '0.8rem', fontWeight: 500, color: COLORS.text.primary,
                      py: 1, px: 1.5, bgcolor: COLORS.background.light,
                      borderRadius: 1.5, border: `1px solid ${COLORS.border}`
                    }}>
                      {readOnlyData.so_date}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label required>CUSTOMER</Label>
                    <Typography sx={{ 
                      fontSize: '0.8rem', fontWeight: 500, color: COLORS.text.primary,
                      py: 1, px: 1.5, bgcolor: COLORS.background.light,
                      borderRadius: 1.5, border: `1px solid ${COLORS.border}`
                    }}>
                      {readOnlyData.customer_name}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>STATUS</Label>
                    <Typography sx={{ 
                      fontSize: '0.8rem', fontWeight: 500,
                      py: 1, px: 1.5, bgcolor: COLORS.background.light,
                      borderRadius: 1.5, border: `1px solid ${COLORS.border}`,
                      color: readOnlyData.status === 'Cancelled' ? '#DC2626' : 
                             readOnlyData.status === 'Closed' ? '#059669' : COLORS.text.primary
                    }}>
                      {readOnlyData.status}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>CURRENCY</Label>
                    <Typography sx={{ 
                      fontSize: '0.8rem', fontWeight: 500, color: COLORS.text.primary,
                      py: 1, px: 1.5, bgcolor: COLORS.background.light,
                      borderRadius: 1.5, border: `1px solid ${COLORS.border}`
                    }}>
                      {readOnlyData.currency}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>CUSTOMER PO NUMBER</Label>
                    <TextField
                      fullWidth
                      size="small"
                      name="customer_po_number"
                      value={formData.customer_po_number}
                      onChange={handleChange}
                      placeholder="e.g., PO-2025-001"
                      disabled={readOnlyData.status === 'Cancelled' || readOnlyData.status === 'Closed'}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>CUSTOMER PO DATE</Label>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      name="customer_po_date"
                      value={formData.customer_po_date}
                      onChange={handleChange}
                      disabled={readOnlyData.status === 'Cancelled' || readOnlyData.status === 'Closed'}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>PAYMENT TERMS</Label>
                    <TextField
                      fullWidth
                      size="small"
                      name="payment_terms"
                      value={formData.payment_terms}
                      onChange={handleChange}
                      placeholder="e.g., Net 30, 50% Advance"
                      disabled={readOnlyData.status === 'Cancelled' || readOnlyData.status === 'Closed'}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
        
      case 1:
        const isDisabled = readOnlyData.status === 'Cancelled' || readOnlyData.status === 'Closed';
        
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <LocalShippingIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Delivery Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>DELIVERY TERMS</Label>
                    <FormControl fullWidth size="small" disabled={isDisabled}>
                      <Select
                        name="delivery_terms"
                        value={formData.delivery_terms}
                        onChange={handleChange}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                      >
                        {DELIVERY_TERMS_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option || 'None'}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>DELIVERY MODE</Label>
                    <FormControl fullWidth size="small" disabled={isDisabled}>
                      <Select
                        name="delivery_mode"
                        value={formData.delivery_mode}
                        onChange={handleChange}
                        sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                      >
                        {DELIVERY_MODE_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option || 'None'}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label>TRANSPORTER</Label>
                    <TextField
                      fullWidth
                      size="small"
                      name="transporter"
                      value={formData.transporter}
                      onChange={handleChange}
                      placeholder="e.g., XYZ Transport"
                      disabled={isDisabled}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Label required>EXPECTED DELIVERY DATE</Label>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      name="expected_delivery_date"
                      value={formData.expected_delivery_date}
                      onChange={handleChange}
                      error={!!fieldErrors.expected_delivery_date}
                      helperText={fieldErrors.expected_delivery_date}
                      disabled={isDisabled}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Shipping Address Section */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <LocalShippingIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Shipping Address
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Address Line 1"
                    value={formData.shipping_address.line1}
                    onChange={(e) => handleAddressChange('shipping_address', 'line1', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Address Line 2"
                    value={formData.shipping_address.line2}
                    onChange={(e) => handleAddressChange('shipping_address', 'line2', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="City"
                    value={formData.shipping_address.city}
                    onChange={(e) => handleAddressChange('shipping_address', 'city', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="District"
                    value={formData.shipping_address.district}
                    onChange={(e) => handleAddressChange('shipping_address', 'district', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="State"
                    value={formData.shipping_address.state}
                    onChange={(e) => handleAddressChange('shipping_address', 'state', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    label="State Code"
                    value={formData.shipping_address.state_code}
                    onChange={(e) => handleAddressChange('shipping_address', 'state_code', Number(e.target.value))}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Pincode"
                    value={formData.shipping_address.pincode}
                    onChange={(e) => handleAddressChange('shipping_address', 'pincode', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Country"
                    value={formData.shipping_address.country}
                    onChange={(e) => handleAddressChange('shipping_address', 'country', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
              </Grid>
            </Paper>
            
            {/* Billing Address Section */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Billing Address
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Address Line 1"
                    value={formData.billing_address.line1}
                    onChange={(e) => handleAddressChange('billing_address', 'line1', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Address Line 2"
                    value={formData.billing_address.line2}
                    onChange={(e) => handleAddressChange('billing_address', 'line2', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="City"
                    value={formData.billing_address.city}
                    onChange={(e) => handleAddressChange('billing_address', 'city', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="District"
                    value={formData.billing_address.district}
                    onChange={(e) => handleAddressChange('billing_address', 'district', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="State"
                    value={formData.billing_address.state}
                    onChange={(e) => handleAddressChange('billing_address', 'state', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    label="State Code"
                    value={formData.billing_address.state_code}
                    onChange={(e) => handleAddressChange('billing_address', 'state_code', Number(e.target.value))}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Pincode"
                    value={formData.billing_address.pincode}
                    onChange={(e) => handleAddressChange('billing_address', 'pincode', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Country"
                    value={formData.billing_address.country}
                    onChange={(e) => handleAddressChange('billing_address', 'country', e.target.value)}
                    disabled={isDisabled}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Additional Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Label>INTERNAL REMARKS</Label>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  name="internal_remarks"
                  value={formData.internal_remarks}
                  onChange={handleChange}
                  placeholder="Any internal notes or special instructions..."
                  disabled={isDisabled}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                />
              </Box>
            </Paper>
            
            {/* Terms & Conditions Section */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Terms & Conditions
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                size="small"
                value={Array.isArray(formData.terms_conditions) ? formData.terms_conditions.join('\n') : ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  terms_conditions: e.target.value.split('\n').filter(line => line.trim())
                }))}
                placeholder="Enter terms and conditions (one per line)..."
                disabled={isDisabled}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
              />
            </Paper>
          </Stack>
        );
        
      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Order Items (Read-Only)
              </Typography>
              
              {soItems.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Item</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Part No</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Qty</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Unit</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }} align="right">Unit Price</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }} align="right">Discount</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }} align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {soItems.map((item, index) => {
                        const total = (item.ordered_qty * item.unit_price) * (1 - (item.discount_percent / 100));
                        return (
                          <TableRow key={index} hover>
                            <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_name || '-'}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no || '-'}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }}>{item.ordered_qty}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }}>{item.unit}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(item.unit_price)}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }} align="right">{item.discount_percent}%</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(total)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              <Box sx={{ mt: 2, p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 1 }}>
                  Note: To modify quantities or prices, please use the Revise Order feature.
                </Typography>
              </Box>
            </Paper>
          </Stack>
        );
        
      case 3:
        const totalSetup = soItems.reduce((sum, op) => sum + (Number(op.planned_setup_min) || 0), 0);
        const totalRun = soItems.reduce((sum, op) => sum + (Number(op.planned_run_min) || 0), 0);
        
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Review & Submit
              </Typography>
              
              <Stack spacing={2}>
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Order Information
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>SO Number:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{readOnlyData.so_number}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{readOnlyData.customer_name}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>PO Number:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.customer_po_number || '-'}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Expected Delivery:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.expected_delivery_date}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Currency:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{readOnlyData.currency}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status:</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: readOnlyData.status === 'Cancelled' ? '#DC2626' : readOnlyData.status === 'Closed' ? '#059669' : COLORS.text.primary }}>
                      {readOnlyData.status}
                    </Typography></Grid>
                  </Grid>
                </Paper>
                
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Order Summary
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Item</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Qty</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Unit</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Price</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {soItems.map((item, idx) => {
                          const total = (item.ordered_qty * item.unit_price) * (1 - (item.discount_percent / 100));
                          return (
                            <TableRow key={idx}>
                              <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_name || item.part_no || '-'}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }}>{item.ordered_qty}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }}>{item.unit}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(item.unit_price)}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(total)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Sub Total:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formatCurrency(calculatedTotals.sub_total)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Discount:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formatCurrency(calculatedTotals.discount_total)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Taxable Amount:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formatCurrency(calculatedTotals.taxable_total)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>GST (18%):</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formatCurrency(calculatedTotals.gst_total)}</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>Grand Total:</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
                        {formatCurrency(calculatedTotals.grand_total)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </Stack>
            </Paper>
          </Stack>
        );
        
      default:
        return null;
    }
  };
  
  const isDisabled = readOnlyData.status === 'Cancelled' || readOnlyData.status === 'Closed';
  
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${COLORS.border}`, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          py: 1.5, px: 2.5,
          bgcolor: COLORS.background.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Edit Sales Order
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        
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
          {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>{error}</Alert>}
        </DialogContent>
        
        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white, justifyContent: 'space-between' }}>
          <Button onClick={handleBack} disabled={activeStep === 0 || loading} size="small" startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}>
            Back
          </Button>
          <Box>
            <Button onClick={onClose} disabled={loading} size="small" sx={{ mr: 1 }}>Cancel</Button>
            {activeStep === steps.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={handleSubmit} 
                disabled={loading || isDisabled} 
                size="small" 
                startIcon={<SaveIcon sx={{ fontSize: '1rem' }} />}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleNext} 
                disabled={loading} 
                size="small" 
                endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              >
                Next
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
      
      <AddCustomer open={addCustomerOpen} onClose={() => setAddCustomerOpen(false)} onAdd={handleCustomerAdded} />
    </>
  );
};

export default EditSaleOrder;