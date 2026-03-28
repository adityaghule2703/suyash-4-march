// AddSaleOrder.jsx
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
  Autocomplete,
  styled,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

// Color constants matching other components
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

// Modern Stepper Connector with Primary Color
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
const CURRENCY_OPTIONS = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
const DELIVERY_TERMS_OPTIONS = ['Ex-Works', 'FOR Destination', 'CIF', 'FOB', ''];
const DELIVERY_MODE_OPTIONS = ['Road', 'Rail', 'Air', 'Sea', 'Hand Delivery', ''];
const UNIT_OPTIONS = ['Nos', 'Kg', 'Meter', 'Set', 'Piece'];

const steps = ['Basic Information', 'Delivery & Financial', 'Items', 'Review & Submit'];

const AddSaleOrder = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Quotation conflict dialog
  const [quotationConflict, setQuotationConflict] = useState(false);
  const [pendingQuotation, setPendingQuotation] = useState(null);
  
  // Data from APIs
  const [customers, setCustomers] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    customer_id: '',
    quotation_id: '',
    quotation_no: '',
    customer_po_number: '',
    customer_po_date: new Date().toISOString().split('T')[0],
    payment_terms: '',
    delivery_terms: '',
    delivery_mode: '',
    expected_delivery_date: new Date().toISOString().split('T')[0],
    internal_remarks: '',
    currency: 'INR'
  });
  
  const [soItems, setSoItems] = useState([
    {
      item_id: '',
      part_no: '',
      part_name: '',
      hsn_code: '',
      unit: 'Nos',
      ordered_qty: 1,
      unit_price: 0,
      discount_percent: 0,
      required_date: new Date().toISOString().split('T')[0],
      committed_date: new Date().toISOString().split('T')[0],
      remarks: ''
    }
  ]);
  
  const [calculatedTotals, setCalculatedTotals] = useState({
    sub_total: 0,
    discount_total: 0,
    taxable_total: 0,
    gst_total: 0,
    grand_total: 0
  });
  
  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/customers?limit=100`, {
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
  
  // Fetch quotations
  const fetchQuotations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/quotations?limit=100&status=Approved`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setQuotations(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching quotations:', err);
    }
  }, []);
  
  // Fetch items
  const fetchItems = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setItems(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  }, []);
  
  useEffect(() => {
    if (open) {
      fetchCustomers();
      fetchQuotations();
      fetchItems();
    }
  }, [open, fetchCustomers, fetchQuotations, fetchItems]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const applyQuotation = (quotation, keepCustomer = false) => {
    if (!quotation) return;
    
    const quotationCustomerId = quotation.CustomerId?._id || quotation.CustomerId;
    const currentCustomerId = formData.customer_id;
    
    setFormData(prev => ({
      ...prev,
      quotation_id: quotation._id,
      quotation_no: quotation.QuotationNo,
      customer_id: keepCustomer ? currentCustomerId : quotationCustomerId,
      payment_terms: quotation.PaymentTerms || '',
      currency: quotation.Currency || 'INR'
    }));
    
    // Populate items from quotation
    if (quotation.Items && quotation.Items.length > 0) {
      const newItems = quotation.Items.map((item) => ({
        item_id: item.ItemId?._id || item.ItemId || '',
        part_no: item.PartNo || '',
        part_name: item.PartName || '',
        hsn_code: item.HSNCode || '',
        unit: item.Unit || 'Nos',
        ordered_qty: item.Quantity || 1,
        unit_price: item.UnitPrice || 0,
        discount_percent: item.DiscountPercent || 0,
        required_date: formData.expected_delivery_date || new Date().toISOString().split('T')[0],
        committed_date: formData.expected_delivery_date || new Date().toISOString().split('T')[0],
        remarks: item.Remarks || ''
      }));
      setSoItems(newItems);
      calculateTotals(newItems);
    }
    
    setQuotationConflict(false);
    setPendingQuotation(null);
  };
  
  const handleQuotationSelect = (quotation) => {
    if (!quotation) return;
    
    const quotationCustomerId = quotation.CustomerId?._id || quotation.CustomerId;
    
    // If a customer is already selected and it's different from quotation's customer
    if (formData.customer_id && formData.customer_id !== quotationCustomerId) {
      // Show conflict dialog
      setPendingQuotation(quotation);
      setQuotationConflict(true);
      return;
    }
    
    // Proceed with updating customer
    applyQuotation(quotation, false);
  };
  
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...soItems];
    updatedItems[index][field] = value;
    
    // Auto-fill item details when item_id is selected
    if (field === 'item_id' && value) {
      const selectedItem = items.find(item => item._id === value);
      if (selectedItem) {
        updatedItems[index].part_no = selectedItem.part_no || '';
        updatedItems[index].part_name = selectedItem.part_description || '';
        updatedItems[index].hsn_code = selectedItem.hsn_code || '';
        updatedItems[index].unit = selectedItem.unit || 'Nos';
      }
    }
    
    setSoItems(updatedItems);
    setFieldErrors(prev => ({ ...prev, [`item_${index}_${field}`]: '' }));
    calculateTotals(updatedItems);
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
    const gst_total = (taxable_total * 18) / 100; // Assuming 18% GST
    const grand_total = taxable_total + gst_total;
    
    setCalculatedTotals({
      sub_total,
      discount_total,
      taxable_total,
      gst_total,
      grand_total
    });
  };
  
  const addItem = () => {
    setSoItems([
      ...soItems,
      {
        item_id: '',
        part_no: '',
        part_name: '',
        hsn_code: '',
        unit: 'Nos',
        ordered_qty: 1,
        unit_price: 0,
        discount_percent: 0,
        required_date: new Date().toISOString().split('T')[0],
        committed_date: new Date().toISOString().split('T')[0],
        remarks: ''
      }
    ]);
  };
  
  const removeItem = (index) => {
    if (soItems.length > 1) {
      const updatedItems = soItems.filter((_, i) => i !== index);
      setSoItems(updatedItems);
      calculateTotals(updatedItems);
    }
  };
  
  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    
    switch (step) {
      case 0: // Basic Information
        if (!formData.customer_id) {
          errors.customer_id = 'Customer is required';
          isValid = false;
        }
        if (!formData.expected_delivery_date) {
          errors.expected_delivery_date = 'Expected delivery date is required';
          isValid = false;
        }
        break;
        
      case 2: // Items
        soItems.forEach((item, index) => {
          if (!item.item_id) {
            errors[`item_${index}_item_id`] = `Item ${index + 1}: Item is required`;
            isValid = false;
          }
          if (!item.ordered_qty || item.ordered_qty <= 0) {
            errors[`item_${index}_ordered_qty`] = `Item ${index + 1}: Valid quantity is required`;
            isValid = false;
          }
          if (!item.unit_price || item.unit_price <= 0) {
            errors[`item_${index}_unit_price`] = `Item ${index + 1}: Valid unit price is required`;
            isValid = false;
          }
        });
        break;
        
      default:
        return true;
    }
    
    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors in this section');
    }
    return isValid;
  };
  
  const validateAllFields = () => {
    const errors = {};
    let isValid = true;
    
    if (!formData.customer_id) {
      errors.customer_id = 'Customer is required';
      isValid = false;
    }
    
    if (!formData.expected_delivery_date) {
      errors.expected_delivery_date = 'Expected delivery date is required';
      isValid = false;
    }
    
    soItems.forEach((item, index) => {
      if (!item.item_id) {
        errors[`item_${index}_item_id`] = `Item ${index + 1}: Item is required`;
        isValid = false;
      }
      if (!item.ordered_qty || item.ordered_qty <= 0) {
        errors[`item_${index}_ordered_qty`] = `Item ${index + 1}: Valid quantity is required`;
        isValid = false;
      }
      if (!item.unit_price || item.unit_price <= 0) {
        errors[`item_${index}_unit_price`] = `Item ${index + 1}: Valid unit price is required`;
        isValid = false;
      }
    });
    
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
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const submitData = {
        ...formData,
        items: soItems.map(item => ({
          item_id: item.item_id,
          ordered_qty: Number(item.ordered_qty),
          unit_price: Number(item.unit_price),
          discount_percent: Number(item.discount_percent),
          required_date: item.required_date,
          committed_date: item.committed_date,
          remarks: item.remarks
        }))
      };
      
      const response = await axios.post(`${BASE_URL}/api/sales-orders`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add Sales Order');
      }
    } catch (err) {
      console.error('Error adding Sales Order:', err);
      setError(err.response?.data?.message || 'Failed to add Sales Order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      customer_id: '',
      quotation_id: '',
      quotation_no: '',
      customer_po_number: '',
      customer_po_date: new Date().toISOString().split('T')[0],
      payment_terms: '',
      delivery_terms: '',
      delivery_mode: '',
      expected_delivery_date: new Date().toISOString().split('T')[0],
      internal_remarks: '',
      currency: 'INR'
    });
    setSoItems([
      {
        item_id: '',
        part_no: '',
        part_name: '',
        hsn_code: '',
        unit: 'Nos',
        ordered_qty: 1,
        unit_price: 0,
        discount_percent: 0,
        required_date: new Date().toISOString().split('T')[0],
        committed_date: new Date().toISOString().split('T')[0],
        remarks: ''
      }
    ]);
    setCalculatedTotals({
      sub_total: 0,
      discount_total: 0,
      taxable_total: 0,
      gst_total: 0,
      grand_total: 0
    });
    setFieldErrors({});
    setError('');
    setQuotationConflict(false);
    setPendingQuotation(null);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: formData.currency || 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            {/* Basic Information Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Order Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CUSTOMER <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={customers}
                      getOptionLabel={(option) => `${option.customer_name} - ${option.customer_code}`}
                      value={customers.find(c => c._id === formData.customer_id) || null}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, customer_id: newValue?._id || '' }));
                        setFieldErrors(prev => ({ ...prev, customer_id: '' }));
                      }}
                      loading={loadingData}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          error={!!fieldErrors.customer_id}
                          helperText={fieldErrors.customer_id}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                              '&.Mui-error fieldset': { borderColor: '#EF4444' }
                            },
                            '& .MuiInputBase-input': {
                              py: 1,
                              px: 1.5,
                              fontSize: '0.75rem',
                              color: COLORS.text.primary
                            }
                          }}
                        />
                      )}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      REFERENCE QUOTATION
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={quotations}
                      getOptionLabel={(option) => `${option.QuotationNo} - ${option.CustomerName}`}
                      value={quotations.find(q => q._id === formData.quotation_id) || null}
                      onChange={(event, newValue) => handleQuotationSelect(newValue)}
                      loading={loadingData}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Optional"
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
                              fontSize: '0.75rem',
                              color: COLORS.text.primary
                            }
                          }}
                        />
                      )}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CUSTOMER PO NUMBER
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="customer_po_number"
                      value={formData.customer_po_number}
                      onChange={handleChange}
                      placeholder="e.g., PO-2025-001"
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
                          fontSize: '0.75rem',
                          color: COLORS.text.primary,
                          '&::placeholder': {
                            color: COLORS.text.tertiary,
                            fontSize: '0.75rem'
                          }
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CUSTOMER PO DATE
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      name="customer_po_date"
                      value={formData.customer_po_date}
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
                          fontSize: '0.75rem',
                          color: COLORS.text.primary
                        }
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Additional Information Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Additional Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  INTERNAL REMARKS
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  name="internal_remarks"
                  value={formData.internal_remarks}
                  onChange={handleChange}
                  placeholder="Any internal notes or special instructions..."
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
                      fontSize: '0.75rem',
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.tertiary,
                        fontSize: '0.75rem'
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Stack>
        );
        
      case 1:
        return (
          <Stack spacing={2}>
            {/* Delivery Information Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <ShippingIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Delivery Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      EXPECTED DELIVERY DATE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      name="expected_delivery_date"
                      value={formData.expected_delivery_date}
                      onChange={handleChange}
                      error={!!fieldErrors.expected_delivery_date}
                      helperText={fieldErrors.expected_delivery_date}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
                        },
                        '& .MuiInputBase-input': {
                          py: 1,
                          px: 1.5,
                          fontSize: '0.75rem',
                          color: COLORS.text.primary
                        }
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      PAYMENT TERMS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="payment_terms"
                      value={formData.payment_terms}
                      onChange={handleChange}
                      placeholder="e.g., Net 30, 50% Advance"
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
                          fontSize: '0.75rem',
                          color: COLORS.text.primary,
                          '&::placeholder': {
                            color: COLORS.text.tertiary,
                            fontSize: '0.75rem'
                          }
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DELIVERY TERMS
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="delivery_terms"
                        value={formData.delivery_terms}
                        onChange={handleChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': {
                            py: 1,
                            px: 1.5
                          }
                        }}
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
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DELIVERY MODE
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="delivery_mode"
                        value={formData.delivery_mode}
                        onChange={handleChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': {
                            py: 1,
                            px: 1.5
                          }
                        }}
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
              </Grid>
            </Paper>
            
            {/* Financial Information Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <MoneyIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Financial Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      CURRENCY
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': {
                            py: 1,
                            px: 1.5
                          }
                        }}
                      >
                        {CURRENCY_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
        
      case 2:
        return (
          <Stack spacing={2}>
            {/* Order Items Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Order Items <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              {soItems.map((item, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: COLORS.background.light,
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.border}`
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Item {index + 1}
                    </Typography>
                    {soItems.length > 1 && (
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
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          ITEM <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <Autocomplete
                          fullWidth
                          options={items}
                          getOptionLabel={(option) => `${option.part_no} - ${option.part_description}`}
                          value={items.find(i => i._id === item.item_id) || null}
                          onChange={(event, newValue) => handleItemChange(index, 'item_id', newValue?._id || '')}
                          loading={loadingData}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              error={!!fieldErrors[`item_${index}_item_id`]}
                              helperText={fieldErrors[`item_${index}_item_id`]}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 1.5,
                                  fontSize: '0.75rem',
                                  '&:hover fieldset': { borderColor: COLORS.primary },
                                  '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                                  '&.Mui-error fieldset': { borderColor: '#EF4444' }
                                },
                                '& .MuiInputBase-input': {
                                  py: 1,
                                  px: 1.5,
                                  fontSize: '0.75rem',
                                  color: COLORS.text.primary
                                }
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          PART NO
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.part_no}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              backgroundColor: COLORS.background.light
                            },
                            '& .MuiInputBase-input': {
                              py: 1,
                              px: 1.5,
                              fontSize: '0.75rem',
                              color: COLORS.text.secondary
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          HSN CODE
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.hsn_code}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              backgroundColor: COLORS.background.light
                            },
                            '& .MuiInputBase-input': {
                              py: 1,
                              px: 1.5,
                              fontSize: '0.75rem',
                              color: COLORS.text.secondary
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          UNIT
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            sx={{
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '& .MuiSelect-select': {
                                py: 1,
                                px: 1.5
                              }
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
                    
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          QUANTITY <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={item.ordered_qty}
                          onChange={(e) => handleItemChange(index, 'ordered_qty', e.target.value)}
                          error={!!fieldErrors[`item_${index}_ordered_qty`]}
                          helperText={fieldErrors[`item_${index}_ordered_qty`]}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                              '&.Mui-error fieldset': { borderColor: '#EF4444' }
                            },
                            '& .MuiInputBase-input': {
                              py: 1,
                              px: 1.5,
                              fontSize: '0.75rem',
                              color: COLORS.text.primary
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          UNIT PRICE <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                          error={!!fieldErrors[`item_${index}_unit_price`]}
                          helperText={fieldErrors[`item_${index}_unit_price`]}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                              '&.Mui-error fieldset': { borderColor: '#EF4444' }
                            },
                            '& .MuiInputBase-input': {
                              py: 1,
                              px: 1.5,
                              fontSize: '0.75rem',
                              color: COLORS.text.primary
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          DISCOUNT %
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          value={item.discount_percent}
                          onChange={(e) => handleItemChange(index, 'discount_percent', e.target.value)}
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
                              fontSize: '0.75rem',
                              color: COLORS.text.primary
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          REQUIRED DATE
                        </Typography>
                        <TextField
                          fullWidth
                          type="date"
                          size="small"
                          value={item.required_date}
                          onChange={(e) => handleItemChange(index, 'required_date', e.target.value)}
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
                              fontSize: '0.75rem',
                              color: COLORS.text.primary
                            }
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          COMMITTED DATE
                        </Typography>
                        <TextField
                          fullWidth
                          type="date"
                          size="small"
                          value={item.committed_date}
                          onChange={(e) => handleItemChange(index, 'committed_date', e.target.value)}
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
                              fontSize: '0.75rem',
                              color: COLORS.text.primary
                            }
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                          REMARKS
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.remarks}
                          onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                          placeholder="Additional notes..."
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
                              fontSize: '0.75rem',
                              color: COLORS.text.primary,
                              '&::placeholder': {
                                color: COLORS.text.tertiary,
                                fontSize: '0.75rem'
                              }
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
        
      case 3:
        return (
          <Stack spacing={2}>
            {/* Review Section */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Review & Submit
              </Typography>
              
              <Stack spacing={2}>
                {/* Customer Info Summary */}
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Customer Information
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Customer:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                        {customers.find(c => c._id === formData.customer_id)?.customer_name || '-'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>PO Number:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.customer_po_number || '-'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Expected Delivery:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.expected_delivery_date}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Currency:</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{formData.currency}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
                
                {/* Items Summary */}
                <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    Order Summary
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }}>Item</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }}>Qty</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }}>Unit</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }} align="right">Price</TableCell>
                          <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary }} align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {soItems.map((item, idx) => {
                          const total = (item.ordered_qty * item.unit_price) * (1 - (item.discount_percent / 100));
                          return (
                            <TableRow key={idx}>
                              <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no || '-'}</TableCell>
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
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>{formatCurrency(calculatedTotals.grand_total)}</Typography>
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
  
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
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
          bgcolor: COLORS.background.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Add New Sales Order
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        
        {/* Modern Stepper with Primary Color */}
        <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<ColorConnector />}
          >
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
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2, 
                borderRadius: 1.5,
                fontSize: '0.75rem',
                py: 0.5,
                '& .MuiAlert-icon': { fontSize: '1.25rem' }
              }}
            >
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
            size="small"
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
              size="small"
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
                disabled={loading}
                size="small"
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
                {loading ? 'Creating...' : 'Create Sales Order'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                size="small"
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
      
      {/* Quotation Conflict Dialog */}
      <Dialog
        open={quotationConflict}
        onClose={() => setQuotationConflict(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          py: 1.5, 
          px: 2.5, 
          mb: 2,
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>
            Customer Conflict
          </Typography>
          <IconButton onClick={() => setQuotationConflict(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.secondary, mb: 1 }}>
            This quotation belongs to a different customer:
          </Typography>
          <Paper sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, mb: 2 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.primary }}>
              {pendingQuotation?.CustomerName || 'Unknown Customer'}
            </Typography>
          </Paper>
          <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.secondary }}>
            What would you like to do?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          px: 2.5, 
          py: 1.5, 
          borderTop: `1px solid ${COLORS.border}`, 
          gap: 1 
        }}>
          <Button
            onClick={() => applyQuotation(pendingQuotation, true)}
            size="small"
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
            Keep Current Customer
          </Button>
          <Button
            variant="contained"
            onClick={() => applyQuotation(pendingQuotation, false)}
            size="small"
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.primary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: COLORS.primaryDark }
            }}
          >
            Switch to Quotation's Customer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddSaleOrder;