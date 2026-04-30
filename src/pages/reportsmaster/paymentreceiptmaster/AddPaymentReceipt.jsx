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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  CircularProgress,
  Chip,
  Autocomplete,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  AccountBalance as BankIcon,
  Receipt as ReceiptIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants
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
    light: '#F8FFFC'
  },
  border: '#E3E8EF'
};

// Payment mode options
const PAYMENT_MODES = ['NEFT', 'RTGS', 'IMPS', 'Cheque', 'DD', 'Cash', 'UPI', 'Credit Card', 'Bank Transfer'];

// TDS Sections
const TDS_SECTIONS = ['194C', '194H', '194J', '194I', '194D', '194M', '194Q'];

// Format currency helper
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

const steps = ['Select Customer & Payment Details', 'Allocate to Invoices'];

const AddPaymentReceipt = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Data fetching states
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  
  // Selected values
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [availableInvoices, setAvailableInvoices] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    customer_id: '',
    receipt_date: new Date().toISOString().split('T')[0],
    payment_mode: '',
    total_amount: '',
    instrument_no: '',
    instrument_date: new Date().toISOString().split('T')[0],
    bank_name: '',
    tds_applicable: false,
    tds_section: '194C',
    tds_rate: '',
    allocations: [],
    remarks: ''
  });

  // Fetch Customers
  const fetchCustomers = useCallback(async () => {
    try {
      setLoadingCustomers(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/customers?limit=200`, {
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
  }, []);

  // Fetch Invoices
  const fetchInvoices = useCallback(async () => {
    try {
      setLoadingInvoices(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/invoices?limit=200`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setInvoices(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoadingInvoices(false);
    }
  }, []);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchCustomers();
      fetchInvoices();
    }
  }, [open, fetchCustomers, fetchInvoices]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Update available invoices when customer changes
  useEffect(() => {
    if (selectedCustomer && invoices.length > 0) {
      // Filter invoices for selected customer that have balance due > 0
      const customerInvoices = invoices.filter(invoice => 
        invoice.customer_id === selectedCustomer._id && 
        (invoice.balance_due || invoice.grand_total) > 0
      );
      setAvailableInvoices(customerInvoices);
    } else {
      setAvailableInvoices([]);
    }
  }, [selectedCustomer, invoices]);

  const handleCustomerChange = (event, newValue) => {
    setSelectedCustomer(newValue);
    setFormData(prev => ({ ...prev, customer_id: newValue?._id || '' }));
    setFieldErrors(prev => ({ ...prev, customer_id: '' }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleTDSChange = (e) => {
    const checked = e.target.checked;
    setFormData(prev => ({ 
      ...prev, 
      tds_applicable: checked,
      tds_section: checked ? (prev.tds_section || '194C') : '',
      tds_rate: checked ? (prev.tds_rate || '') : ''
    }));
  };

  const handleAddAllocation = () => {
    setFormData(prev => ({
      ...prev,
      allocations: [...prev.allocations, { invoice_id: '', allocated_amount: '' }]
    }));
  };

  const handleAllocationChange = (index, field, value) => {
    const updatedAllocations = [...formData.allocations];
    updatedAllocations[index][field] = value;
    
    // If invoice is selected, auto-fill max amount as balance due
    if (field === 'invoice_id') {
      const selectedInvoice = availableInvoices.find(inv => inv._id === value);
      if (selectedInvoice) {
        const balanceDue = selectedInvoice.balance_due || selectedInvoice.grand_total;
        updatedAllocations[index].allocated_amount = balanceDue;
      }
    }
    
    setFormData(prev => ({ ...prev, allocations: updatedAllocations }));
  };

  const handleRemoveAllocation = (index) => {
    const updatedAllocations = formData.allocations.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, allocations: updatedAllocations }));
  };

  const calculateTotalAllocated = () => {
    return formData.allocations.reduce((sum, alloc) => sum + (parseFloat(alloc.allocated_amount) || 0), 0);
  };

  const calculateTDSAmount = () => {
    if (!formData.tds_applicable || !formData.tds_rate || !formData.total_amount) return 0;
    return (parseFloat(formData.total_amount) * parseFloat(formData.tds_rate)) / 100;
  };

  const calculateNetReceived = () => {
    const total = parseFloat(formData.total_amount) || 0;
    const tdsAmount = calculateTDSAmount();
    return total - tdsAmount;
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!formData.customer_id) {
          errors.customer_id = 'Please select a customer';
          isValid = false;
        }
        if (!formData.receipt_date) {
          errors.receipt_date = 'Please select receipt date';
          isValid = false;
        }
        if (!formData.payment_mode) {
          errors.payment_mode = 'Please select payment mode';
          isValid = false;
        }
        if (!formData.total_amount || parseFloat(formData.total_amount) <= 0) {
          errors.total_amount = 'Please enter a valid amount';
          isValid = false;
        }
        if (formData.payment_mode !== 'Cash' && !formData.instrument_no) {
          errors.instrument_no = 'Instrument number is required';
          isValid = false;
        }
        if (formData.payment_mode !== 'Cash' && !formData.instrument_date) {
          errors.instrument_date = 'Instrument date is required';
          isValid = false;
        }
        break;
      
      case 1:
        if (formData.allocations.length === 0) {
          errors.allocations = 'Please add at least one invoice allocation';
          isValid = false;
        }
        const totalAllocated = calculateTotalAllocated();
        const totalAmount = parseFloat(formData.total_amount) || 0;
        if (Math.abs(totalAllocated - totalAmount) > 0.01) {
          errors.allocations = `Total allocated amount (₹${totalAllocated.toFixed(2)}) does not match total amount (₹${totalAmount.toFixed(2)})`;
          isValid = false;
        }
        break;
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
    if (!validateStep(1)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const tdsAmount = calculateTDSAmount();
      const netReceived = calculateNetReceived();
      
      const payload = {
        customer_id: formData.customer_id,
        receipt_date: formData.receipt_date,
        payment_mode: formData.payment_mode,
        total_amount: parseFloat(formData.total_amount),
        instrument_no: formData.payment_mode !== 'Cash' ? formData.instrument_no : undefined,
        instrument_date: formData.payment_mode !== 'Cash' ? formData.instrument_date : undefined,
        bank_name: formData.bank_name || undefined,
        tds_applicable: formData.tds_applicable,
        tds_section: formData.tds_applicable ? formData.tds_section : undefined,
        tds_rate: formData.tds_applicable ? parseFloat(formData.tds_rate) : undefined,
        allocations: formData.allocations.map(alloc => ({
          invoice_id: alloc.invoice_id,
          allocated_amount: parseFloat(alloc.allocated_amount)
        })),
        remarks: formData.remarks || undefined
      };
      
      const response = await axios.post(`${BASE_URL}/api/invoices/payment-receipts`, payload, {
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
        setError(response.data.message || 'Failed to create payment receipt');
      }
    } catch (err) {
      console.error('Error creating payment receipt:', err);
      setError(err.response?.data?.message || 'Failed to create payment receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setSelectedCustomer(null);
    setAvailableInvoices([]);
    setFormData({
      customer_id: '',
      receipt_date: new Date().toISOString().split('T')[0],
      payment_mode: '',
      total_amount: '',
      instrument_no: '',
      instrument_date: new Date().toISOString().split('T')[0],
      bank_name: '',
      tds_applicable: false,
      tds_section: '194C',
      tds_rate: '',
      allocations: [],
      remarks: ''
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
                <PaymentIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Payment Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Customer <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={customers}
                      getOptionLabel={(option) => `${option.customer_name} (${option.customer_code || option.customer_id})`}
                      value={selectedCustomer}
                      onChange={handleCustomerChange}
                      loading={loadingCustomers}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Search and select customer"
                          error={!!fieldErrors.customer_id}
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
                    {fieldErrors.customer_id && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.customer_id}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Receipt Date <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      name="receipt_date"
                      value={formData.receipt_date}
                      onChange={handleChange}
                      error={!!fieldErrors.receipt_date}
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
                    {fieldErrors.receipt_date && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.receipt_date}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Payment Mode <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.payment_mode}>
                      <Select
                        name="payment_mode"
                        value={formData.payment_mode}
                        onChange={handleChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        <MenuItem value="" disabled>Select payment mode</MenuItem>
                        {PAYMENT_MODES.map(mode => (
                          <MenuItem key={mode} value={mode} sx={{ fontSize: '0.75rem' }}>
                            {mode}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {fieldErrors.payment_mode && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.payment_mode}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Total Amount <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      name="total_amount"
                      value={formData.total_amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      error={!!fieldErrors.total_amount}
                      InputProps={{ startAdornment: <Typography sx={{ fontSize: '0.7rem', mr: 0.5 }}>₹</Typography> }}
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
                    {fieldErrors.total_amount && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.total_amount}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {formData.payment_mode !== 'Cash' && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Instrument No <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          name="instrument_no"
                          value={formData.instrument_no}
                          onChange={handleChange}
                          placeholder="Cheque/DD/Ref No"
                          error={!!fieldErrors.instrument_no}
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
                        {fieldErrors.instrument_no && (
                          <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                            {fieldErrors.instrument_no}
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Instrument Date <span style={{ color: '#EF4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          type="date"
                          size="small"
                          name="instrument_date"
                          value={formData.instrument_date}
                          onChange={handleChange}
                          error={!!fieldErrors.instrument_date}
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
                        {fieldErrors.instrument_date && (
                          <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                            {fieldErrors.instrument_date}
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Bank Name
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          name="bank_name"
                          value={formData.bank_name}
                          onChange={handleChange}
                          placeholder="Bank name"
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
                  </>
                )}

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.tds_applicable}
                          onChange={handleTDSChange}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: COLORS.primary,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: COLORS.primary,
                            },
                          }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>TDS Applicable</Typography>}
                    />
                  </Box>
                </Grid>

                {formData.tds_applicable && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          TDS Section
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            name="tds_section"
                            value={formData.tds_section}
                            onChange={handleChange}
                            sx={{
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '& .MuiSelect-select': { py: 1, px: 1.5 }
                            }}
                          >
                            {TDS_SECTIONS.map(section => (
                              <MenuItem key={section} value={section} sx={{ fontSize: '0.75rem' }}>
                                {section}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          TDS Rate (%)
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          name="tds_rate"
                          value={formData.tds_rate}
                          onChange={handleChange}
                          placeholder="10"
                          InputProps={{ endAdornment: <Typography sx={{ fontSize: '0.7rem' }}>%</Typography> }}
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
                  </>
                )}

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Remarks
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      placeholder="Any remarks about this payment..."
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

            {formData.total_amount && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  Payment Summary
                </Typography>
                <Stack spacing={0.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Total Amount:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                      ₹{formatCurrency(parseFloat(formData.total_amount) || 0)}
                    </Typography>
                  </Box>
                  {formData.tds_applicable && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.7rem' }}>TDS Amount ({formData.tds_rate || 0}%):</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#EF4444' }}>
                        -₹{formatCurrency(calculateTDSAmount())}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 0.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Net Received:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.primary }}>
                      ₹{formatCurrency(calculateNetReceived())}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary }}>
                  <ReceiptIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Invoice Allocations
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                  onClick={handleAddAllocation}
                  disabled={availableInvoices.length === 0}
                  sx={{
                    height: 28,
                    px: 1.5,
                    borderRadius: 1.5,
                    borderColor: COLORS.primary,
                    color: COLORS.primary,
                    fontSize: '0.65rem',
                    textTransform: 'none'
                  }}
                >
                  Add Invoice
                </Button>
              </Stack>

              {formData.allocations.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ReceiptIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                    No invoices allocated. Click "Add Invoice" to allocate payment.
                  </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.primaryLight }}>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Invoice No</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Invoice Date</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Total Amount</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Balance Due</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Allocated Amount</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, width: 40 }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.allocations.map((allocation, index) => {
                          const selectedInvoice = availableInvoices.find(inv => inv._id === allocation.invoice_id);
                          return (
                            <TableRow key={index}>
                              <TableCell sx={{ fontSize: '0.7rem' }}>
                                <Autocomplete
                                  options={availableInvoices}
                                  getOptionLabel={(option) => `${option.invoice_no} (${option.so_number})`}
                                  value={selectedInvoice || null}
                                  onChange={(e, newValue) => handleAllocationChange(index, 'invoice_id', newValue?._id || '')}
                                  sx={{ width: 200 }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      placeholder="Select invoice"
                                      sx={{
                                        '& .MuiOutlinedInput-root': { fontSize: '0.7rem', borderRadius: 1 },
                                        '& .MuiInputBase-input': { py: 0.5, fontSize: '0.7rem' }
                                      }}
                                    />
                                  )}
                                />
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }}>
                                {selectedInvoice ? formatDate(selectedInvoice.invoice_date) : '-'}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }}>
                                {selectedInvoice ? `₹${formatCurrency(selectedInvoice.grand_total)}` : '-'}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }}>
                                {selectedInvoice ? `₹${formatCurrency(selectedInvoice.balance_due || selectedInvoice.grand_total)}` : '-'}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.7rem' }}>
                                <TextField
                                  type="number"
                                  size="small"
                                  value={allocation.allocated_amount}
                                  onChange={(e) => handleAllocationChange(index, 'allocated_amount', e.target.value)}
                                  disabled={!allocation.invoice_id}
                                  sx={{ width: 120 }}
                                  InputProps={{
                                    startAdornment: <Typography sx={{ fontSize: '0.7rem', mr: 0.5 }}>₹</Typography>
                                  }}
                                  inputProps={{ step: 0.01, min: 0 }}
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton size="small" onClick={() => handleRemoveAllocation(index)} sx={{ color: '#EF4444' }}>
                                  <DeleteIcon sx={{ fontSize: '0.8rem' }} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Paper sx={{ p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5, minWidth: 250 }}>
                      <Stack spacing={0.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                            Total Allocated:
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                            ₹{formatCurrency(calculateTotalAllocated())}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                            Payment Amount:
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                            ₹{formatCurrency(parseFloat(formData.total_amount) || 0)}
                          </Typography>
                        </Box>
                        {Math.abs(calculateTotalAllocated() - (parseFloat(formData.total_amount) || 0)) > 0.01 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                              Difference:
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', fontWeight: 600 }}>
                              ₹{formatCurrency(Math.abs(calculateTotalAllocated() - (parseFloat(formData.total_amount) || 0)))}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Paper>
                  </Box>
                </>
              )}
              {fieldErrors.allocations && (
                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 1 }}>
                  {fieldErrors.allocations}
                </Typography>
              )}
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
      maxWidth="lg"
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
          Add Payment Receipt
        </Typography>
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
              disabled={loading || formData.allocations.length === 0}
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
              {loading ? 'Creating...' : 'Create Receipt'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || !formData.customer_id || !formData.payment_mode || !formData.total_amount}
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

export default AddPaymentReceipt;