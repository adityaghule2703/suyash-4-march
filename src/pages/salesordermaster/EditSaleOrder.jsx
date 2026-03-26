// EditSaleOrder.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
  IconButton,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

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

const CURRENCY_OPTIONS = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
const DELIVERY_TERMS_OPTIONS = ['Ex-Works', 'FOR Destination', 'CIF', 'FOB', ''];
const DELIVERY_MODE_OPTIONS = ['Road', 'Rail', 'Air', 'Sea', 'Hand Delivery', ''];
const UNIT_OPTIONS = ['Nos', 'Kg', 'Meter', 'Set', 'Piece'];

const steps = ['Basic Information', 'Delivery Details', 'Items', 'Review & Submit'];

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

const EditSaleOrder = ({ open, onClose, so, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    customer_po_number: '',
    customer_po_date: '',
    payment_terms: '',
    delivery_terms: '',
    delivery_mode: '',
    expected_delivery_date: '',
    internal_remarks: '',
    currency: 'INR'
  });
  
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
    if (open && so) {
      fetchCustomers();
      fetchItems();
      
      setFormData({
        customer_id: so.customer_id?._id || so.customer_id || '',
        customer_po_number: so.customer_po_number || '',
        customer_po_date: so.customer_po_date ? new Date(so.customer_po_date).toISOString().split('T')[0] : '',
        payment_terms: so.payment_terms || '',
        delivery_terms: so.delivery_terms || '',
        delivery_mode: so.delivery_mode || '',
        expected_delivery_date: so.expected_delivery_date ? new Date(so.expected_delivery_date).toISOString().split('T')[0] : '',
        internal_remarks: so.internal_remarks || '',
        currency: so.currency || 'INR'
      });
      
      setSoItems(so.items?.map(item => ({
        item_id: item.item_id?._id || item.item_id || '',
        part_no: item.part_no || '',
        part_name: item.part_name || '',
        hsn_code: item.hsn_code || '',
        unit: item.unit || 'Nos',
        ordered_qty: item.ordered_qty || 1,
        unit_price: item.unit_price || 0,
        discount_percent: item.discount_percent || 0,
        required_date: item.required_date ? new Date(item.required_date).toISOString().split('T')[0] : '',
        committed_date: item.committed_date ? new Date(item.committed_date).toISOString().split('T')[0] : '',
        remarks: item.remarks || ''
      })) || []);
      
      calculateTotals(so.items);
      setActiveStep(0);
    }
  }, [open, so, fetchCustomers, fetchItems]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...soItems];
    updatedItems[index][field] = value;
    
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
    const gst_total = (taxable_total * 18) / 100;
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
        required_date: formData.expected_delivery_date || new Date().toISOString().split('T')[0],
        committed_date: formData.expected_delivery_date || new Date().toISOString().split('T')[0],
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
      case 0:
        if (!formData.customer_id) {
          errors.customer_id = 'Customer is required';
          isValid = false;
        }
        if (!formData.expected_delivery_date) {
          errors.expected_delivery_date = 'Expected delivery date is required';
          isValid = false;
        }
        break;
        
      case 2:
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
    if (!validateStep(2)) {
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
      
      const response = await axios.put(`${BASE_URL}/api/sales-orders/${so._id}`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        onUpdate();
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
    if (!amount) return '-';
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
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <BusinessIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      SO Number
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, py: 1 }}>
                      {so?.so_number}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
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
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                        />
                      )}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Customer PO Number"
                    size="small"
                    name="customer_po_number"
                    value={formData.customer_po_number}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Customer PO Date"
                    size="small"
                    name="customer_po_date"
                    value={formData.customer_po_date}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.75rem' }}>Currency</InputLabel>
                    <Select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      label="Currency"
                      sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                    >
                      {CURRENCY_OPTIONS.map(option => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Payment Terms"
                    size="small"
                    name="payment_terms"
                    value={formData.payment_terms}
                    onChange={handleChange}
                    placeholder="e.g., Net 30"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
        
      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <ShippingIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Delivery Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.75rem' }}>Delivery Terms</InputLabel>
                    <Select
                      name="delivery_terms"
                      value={formData.delivery_terms}
                      onChange={handleChange}
                      label="Delivery Terms"
                      sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                    >
                      {DELIVERY_TERMS_OPTIONS.map(option => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                          {option || 'None'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.75rem' }}>Delivery Mode</InputLabel>
                    <Select
                      name="delivery_mode"
                      value={formData.delivery_mode}
                      onChange={handleChange}
                      label="Delivery Mode"
                      sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                    >
                      {DELIVERY_MODE_OPTIONS.map(option => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                          {option || 'None'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Expected Delivery Date"
                    size="small"
                    name="expected_delivery_date"
                    value={formData.expected_delivery_date}
                    onChange={handleChange}
                    error={!!fieldErrors.expected_delivery_date}
                    helperText={fieldErrors.expected_delivery_date}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Additional Information
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                name="internal_remarks"
                label="Internal Remarks"
                value={formData.internal_remarks}
                onChange={handleChange}
                placeholder="Any internal notes or special instructions..."
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' }
                }}
              />
            </Paper>
          </Stack>
        );
        
      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                <InventoryIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Order Items <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              {soItems.map((item, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Item {index + 1}
                    </Typography>
                    {soItems.length > 1 && (
                      <IconButton size="small" onClick={() => removeItem(index)} sx={{ color: '#EF4444' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                  
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12 }}>
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
                            label="Select Item"
                            size="small"
                            error={!!fieldErrors[`item_${index}_item_id`]}
                            helperText={fieldErrors[`item_${index}_item_id`]}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <TextField
                        fullWidth
                        label="Part No"
                        size="small"
                        value={item.part_no}
                        disabled
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: '0.75rem' }}>Unit</InputLabel>
                        <Select
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                          label="Unit"
                          sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                        >
                          {UNIT_OPTIONS.map(option => (
                            <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        size="small"
                        value={item.ordered_qty}
                        onChange={(e) => handleItemChange(index, 'ordered_qty', e.target.value)}
                        error={!!fieldErrors[`item_${index}_ordered_qty`]}
                        helperText={fieldErrors[`item_${index}_ordered_qty`]}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Unit Price"
                        size="small"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                        error={!!fieldErrors[`item_${index}_unit_price`]}
                        helperText={fieldErrors[`item_${index}_unit_price`]}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Discount %"
                        size="small"
                        value={item.discount_percent}
                        onChange={(e) => handleItemChange(index, 'discount_percent', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Required Date"
                        size="small"
                        value={item.required_date}
                        onChange={(e) => handleItemChange(index, 'required_date', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Committed Date"
                        size="small"
                        value={item.committed_date}
                        onChange={(e) => handleItemChange(index, 'committed_date', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Remarks"
                        size="small"
                        value={item.remarks}
                        onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                        placeholder="Additional notes..."
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
                      />
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
                  textTransform: 'none'
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
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Review & Submit
              </Typography>
              
              <Paper sx={{ p: 2, mb: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
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
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
                      {formatCurrency(calculatedTotals.grand_total)}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
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
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
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
      
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button onClick={handleBack} disabled={activeStep === 0 || loading} startIcon={<NavigateBeforeIcon />} sx={{ height: 32, px: 2, borderRadius: 1.5, fontSize: '0.7rem' }}>
          Back
        </Button>
        <Box>
          <Button onClick={onClose} disabled={loading} sx={{ height: 32, px: 2, mr: 1, borderRadius: 1.5, fontSize: '0.7rem' }}>
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={<SaveIcon />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext} disabled={loading} endIcon={<NavigateNextIcon />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem' }}>
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';

export default EditSaleOrder;