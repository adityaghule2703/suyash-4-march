// AddVendorPayment.jsx
import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Autocomplete,
  Chip,
  styled,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
  },
  border: '#E3E8EF',
  status: {
    success: '#D1FAE5',
    warning: '#FEF3C7',
    error: '#FEE2E2',
  }
};

const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const steps = ['Select Invoices', 'Payment Details', 'TDS & Bank', 'Review & Submit'];

// Validation helper functions
const validateBankAccount = (accountNo) => {
  if (!accountNo) return true;
  const cleanAccount = accountNo.replace(/\s/g, '');
  if (cleanAccount.length < 9 || cleanAccount.length > 18) {
    return 'Account number should be between 9 and 18 digits';
  }
  if (!/^\d+$/.test(cleanAccount)) {
    return 'Account number should contain only digits';
  }
  return '';
};

const validateIFSC = (ifsc) => {
  if (!ifsc) return true;
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!ifscRegex.test(ifsc.toUpperCase())) {
    return 'Please enter a valid IFSC code (e.g., HDFC0001234)';
  }
  return '';
};

const validateBankName = (bankName) => {
  if (!bankName) return true;
  if (bankName.trim().length < 2) {
    return 'Bank name must be at least 2 characters';
  }
  if (bankName.trim().length > 100) {
    return 'Bank name must not exceed 100 characters';
  }
  return '';
};

const AddVendorPayment = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Data states
  const [vendors, setVendors] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    payment_date: new Date().toISOString().split('T')[0],
    payment_mode: 'NEFT',
    reference_no: '',
    from_bank_account: {
      bank_name: '',
      account_no: '',
      ifsc: '',
    },
    tds_applicable: false,
    tds_section: '',
    tds_rate: 0,
    remarks: '',
  });
  
  const [allocations, setAllocations] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [tdsAmount, setTdsAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  // Payment mode options
  const paymentModes = ['NEFT', 'RTGS', 'IMPS', 'Cheque', 'DD', 'Cash', 'UPI', 'MSME Portal', 'LC', 'Bank Transfer'];
  
  // TDS sections
  const tdsSections = [
    { value: '194C', label: '194C - Contractors' },
    { value: '194Q', label: '194Q - Purchase of Goods' },
    { value: '194J', label: '194J - Professional Services' },
    { value: '194I', label: '194I - Rent' },
    { value: '194H', label: '194H - Commission/Brokerage' },
  ];

  // Fetch vendors
  useEffect(() => {
    if (open) {
      fetchVendors();
      fetchInvoices();
    }
  }, [open]);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/vendors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setVendors(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/purchase-invoices?page=1&limit=100&status=Approved`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setInvoices(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    }
  };

  // Handle vendor selection and auto-fetch invoice details
  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
    setSelectedInvoices([]);
    setAllocations([]);
    setTotalAmount(0);
    setTdsAmount(0);
    setNetAmount(0);
  };

  // Handle invoice selection with allocation
  const handleInvoiceSelect = (invoice) => {
    const isSelected = selectedInvoices.find(i => i._id === invoice._id);
    if (isSelected) {
      // Remove invoice
      const newSelected = selectedInvoices.filter(i => i._id !== invoice._id);
      setSelectedInvoices(newSelected);
      const newAllocations = allocations.filter(a => a.purchase_invoice_id !== invoice._id);
      setAllocations(newAllocations);
      updateTotals(newAllocations);
    } else {
      // Add invoice with full amount allocation
      const allocation = {
        purchase_invoice_id: invoice._id,
        invoice_number: invoice.purchase_invoice_number,
        invoice_date: invoice.invoice_date,
        invoice_amount: invoice.grand_total,
        allocated_amount: invoice.grand_total,
        balance_due: invoice.balance_due || invoice.grand_total,
      };
      setSelectedInvoices([...selectedInvoices, invoice]);
      setAllocations([...allocations, allocation]);
      updateTotals([...allocations, allocation]);
    }
  };

  // Handle allocation amount change
  const handleAllocationChange = (invoiceId, allocatedAmount) => {
    const invoice = selectedInvoices.find(i => i._id === invoiceId);
    if (!invoice) return;
    
    const maxAmount = Math.min(invoice.grand_total, invoice.balance_due || invoice.grand_total);
    const newAmount = Math.min(allocatedAmount, maxAmount);
    
    const updatedAllocations = allocations.map(a => {
      if (a.purchase_invoice_id === invoiceId) {
        return { ...a, allocated_amount: newAmount };
      }
      return a;
    });
    
    setAllocations(updatedAllocations);
    updateTotals(updatedAllocations);
  };

  // Update totals based on allocations
  const updateTotals = (allocs) => {
    const total = allocs.reduce((sum, a) => sum + (a.allocated_amount || 0), 0);
    setTotalAmount(total);
    
    // Calculate TDS
    if (formData.tds_applicable && formData.tds_rate > 0) {
      const tds = (total * formData.tds_rate) / 100;
      setTdsAmount(tds);
      setNetAmount(total - tds);
    } else {
      setTdsAmount(0);
      setNetAmount(total);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      if (!checked) {
        setFormData(prev => ({ ...prev, tds_section: '', tds_rate: 0 }));
        setTdsAmount(0);
        setNetAmount(totalAmount);
      } else if (formData.tds_rate > 0) {
        const tds = (totalAmount * formData.tds_rate) / 100;
        setTdsAmount(tds);
        setNetAmount(totalAmount - tds);
      }
      return;
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      let processedValue = value;
      
      // Special handling for account number - only allow digits
      if (parent === 'from_bank_account' && child === 'account_no') {
        processedValue = value.replace(/\D/g, '');
      }
      
      // Special handling for IFSC - convert to uppercase
      if (parent === 'from_bank_account' && child === 'ifsc') {
        processedValue = value.toUpperCase();
      }
      
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: processedValue }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Update TDS calculations
      if (name === 'tds_rate' && formData.tds_applicable) {
        const tds = (totalAmount * parseFloat(value)) / 100;
        setTdsAmount(tds || 0);
        setNetAmount(totalAmount - (tds || 0));
      }
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate bank details fields
  const validateBankDetails = () => {
    const errors = {};
    let isValid = true;
    
    const { from_bank_account } = formData;
    
    // If any bank field is filled, validate all required fields
    const hasAnyBankField = from_bank_account.bank_name || 
                            from_bank_account.account_no || 
                            from_bank_account.ifsc;
    
    if (hasAnyBankField) {
      // Validate bank name
      const bankNameError = validateBankName(from_bank_account.bank_name);
      if (bankNameError) {
        errors['from_bank_account.bank_name'] = bankNameError;
        isValid = false;
      }
      
      // Validate account number
      const accountError = validateBankAccount(from_bank_account.account_no);
      if (accountError) {
        errors['from_bank_account.account_no'] = accountError;
        isValid = false;
      } else if (!from_bank_account.account_no) {
        errors['from_bank_account.account_no'] = 'Account number is required when bank name is provided';
        isValid = false;
      }
      
      // Validate IFSC code
      const ifscError = validateIFSC(from_bank_account.ifsc);
      if (ifscError) {
        errors['from_bank_account.ifsc'] = ifscError;
        isValid = false;
      } else if (!from_bank_account.ifsc) {
        errors['from_bank_account.ifsc'] = 'IFSC code is required when bank name is provided';
        isValid = false;
      }
    }
    
    setFieldErrors(prev => ({ ...prev, ...errors }));
    return isValid;
  };

  // Validation functions
  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Select Invoices
        if (!selectedVendor) {
          errors.vendor = 'Please select a vendor';
          isValid = false;
        }
        if (selectedInvoices.length === 0) {
          errors.invoices = 'Please select at least one invoice';
          isValid = false;
        }
        if (totalAmount <= 0) {
          errors.amount = 'Total payment amount must be greater than 0';
          isValid = false;
        }
        break;
      
      case 1: // Payment Details
        if (!formData.payment_date) {
          errors.payment_date = 'Payment date is required';
          isValid = false;
        }
        if (!formData.payment_mode) {
          errors.payment_mode = 'Payment mode is required';
          isValid = false;
        }
        if (!formData.reference_no) {
          errors.reference_no = 'Reference number is required';
          isValid = false;
        }
        if (formData.reference_no && formData.reference_no.trim().length < 3) {
          errors.reference_no = 'Reference number must be at least 3 characters';
          isValid = false;
        }
        break;
      
      case 2: // TDS & Bank
        if (formData.tds_applicable) {
          if (!formData.tds_section) {
            errors.tds_section = 'TDS section is required';
            isValid = false;
          }
          if (formData.tds_rate <= 0) {
            errors.tds_rate = 'TDS rate must be greater than 0';
            isValid = false;
          }
          if (formData.tds_rate > 100) {
            errors.tds_rate = 'TDS rate cannot exceed 100%';
            isValid = false;
          }
        }
        
        // Validate bank details
        const bankIsValid = validateBankDetails();
        if (!bankIsValid) {
          isValid = false;
        }
        break;
      
      default:
        break;
    }

    setFieldErrors(prev => ({ ...prev, ...errors }));
    if (!isValid) setError('Please fix the errors in this section');
    return isValid;
  };

  const validateAll = () => {
    const errors = {};
    let isValid = true;
    
    if (!selectedVendor) {
      errors.vendor = 'Please select a vendor';
      isValid = false;
    }
    if (selectedInvoices.length === 0) {
      errors.invoices = 'Please select at least one invoice';
      isValid = false;
    }
    if (totalAmount <= 0) {
      errors.amount = 'Total payment amount must be greater than 0';
      isValid = false;
    }
    if (!formData.payment_date) {
      errors.payment_date = 'Payment date is required';
      isValid = false;
    }
    if (!formData.payment_mode) {
      errors.payment_mode = 'Payment mode is required';
      isValid = false;
    }
    if (!formData.reference_no) {
      errors.reference_no = 'Reference number is required';
      isValid = false;
    }
    if (formData.reference_no && formData.reference_no.trim().length < 3) {
      errors.reference_no = 'Reference number must be at least 3 characters';
      isValid = false;
    }
    if (formData.tds_applicable) {
      if (!formData.tds_section) {
        errors.tds_section = 'TDS section is required';
        isValid = false;
      }
      if (formData.tds_rate <= 0) {
        errors.tds_rate = 'TDS rate must be greater than 0';
        isValid = false;
      }
      if (formData.tds_rate > 100) {
        errors.tds_rate = 'TDS rate cannot exceed 100%';
        isValid = false;
      }
    }
    
    // Validate bank details
    const bankIsValid = validateBankDetails();
    if (!bankIsValid) {
      isValid = false;
    }
    
    setFieldErrors(errors);
    if (!isValid) setError('Please fix all validation errors');
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setError('');
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;
    
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const submissionData = {
        vendor_id: selectedVendor._id,
        payment_date: formData.payment_date,
        amount: totalAmount,
        payment_mode: formData.payment_mode,
        reference_no: formData.reference_no.trim(),
        from_bank_account: formData.from_bank_account.bank_name ? {
          bank_name: formData.from_bank_account.bank_name.trim(),
          account_no: formData.from_bank_account.account_no.trim(),
          ifsc: formData.from_bank_account.ifsc.trim().toUpperCase(),
        } : undefined,
        tds_applicable: formData.tds_applicable,
        tds_section: formData.tds_applicable ? formData.tds_section : undefined,
        tds_rate: formData.tds_applicable ? formData.tds_rate : 0,
        purchase_invoice_ids: selectedInvoices.map(i => i._id),
        allocations: allocations.map(a => ({
          purchase_invoice_id: a.purchase_invoice_id,
          allocated_amount: a.allocated_amount,
        })),
        remarks: formData.remarks,
        created_by: user._id,
      };

      const response = await axios.post(`${BASE_URL}/api/vendor-payments`, submissionData, {
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
        setError(response.data.message || 'Failed to create payment');
      }
    } catch (err) {
      console.error('Error creating payment:', err);
      setError(err.response?.data?.message || 'Failed to create payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setSelectedVendor(null);
    setSelectedInvoices([]);
    setAllocations([]);
    setTotalAmount(0);
    setTdsAmount(0);
    setNetAmount(0);
    setFormData({
      payment_date: new Date().toISOString().split('T')[0],
      payment_mode: 'NEFT',
      reference_no: '',
      from_bank_account: { bank_name: '', account_no: '', ifsc: '' },
      tds_applicable: false,
      tds_section: '',
      tds_rate: 0,
      remarks: '',
    });
    setFieldErrors({});
    setError('');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Select Invoices
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600 }}>
                Select Vendor
              </Typography>
              
              <Autocomplete
                fullWidth
                options={vendors}
                value={selectedVendor}
                onChange={(e, newValue) => handleVendorSelect(newValue)}
                getOptionLabel={(option) => `${option.vendor_code} - ${option.vendor_name}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Search vendor..."
                    error={!!fieldErrors.vendor}
                    helperText={fieldErrors.vendor}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                  />
                )}
              />
            </Paper>

            {selectedVendor && (
              <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600 }}>
                  Select Invoices to Pay
                </Typography>
                
                <Typography variant="caption" sx={{ color: COLORS.text.tertiary, display: 'block', mb: 1.5 }}>
                  Only unpaid and partially paid invoices for this vendor are shown
                </Typography>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Invoice No.</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Invoice Amount</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Balance Due</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="center">Select</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoices
                        .filter(inv => inv.vendor_id?._id === selectedVendor._id && inv.payment_status !== 'Paid')
                        .map((invoice) => (
                          <TableRow key={invoice._id} hover>
                            <TableCell sx={{ fontSize: '0.75rem' }}>
                              {invoice.purchase_invoice_number}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }}>
                              {new Date(invoice.invoice_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                              ₹{invoice.grand_total.toLocaleString()}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                              ₹{(invoice.balance_due || invoice.grand_total).toLocaleString()}
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant={selectedInvoices.find(i => i._id === invoice._id) ? 'contained' : 'outlined'}
                                onClick={() => handleInvoiceSelect(invoice)}
                                sx={{
                                  minWidth: 60,
                                  height: 28,
                                  borderRadius: 1.5,
                                  fontSize: '0.7rem',
                                  textTransform: 'none',
                                  bgcolor: selectedInvoices.find(i => i._id === invoice._id) ? COLORS.primary : 'transparent',
                                  '&:hover': {
                                    bgcolor: selectedInvoices.find(i => i._id === invoice._id) ? COLORS.primaryDark : COLORS.primaryLight,
                                  }
                                }}
                              >
                                {selectedInvoices.find(i => i._id === invoice._id) ? 'Selected' : 'Select'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {invoices.filter(inv => inv.vendor_id?._id === selectedVendor._id && inv.payment_status !== 'Paid').length === 0 && (
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
                    No unpaid invoices found for this vendor
                  </Alert>
                )}
              </Paper>
            )}

            {selectedInvoices.length > 0 && (
              <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600 }}>
                  Invoice Allocations
                </Typography>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.light }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Invoice No.</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Invoice Amount</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Balance Due</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Allocated Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allocations.map((alloc) => (
                        <TableRow key={alloc.purchase_invoice_id}>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {alloc.invoice_number}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                            ₹{alloc.invoice_amount.toLocaleString()}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                            ₹{alloc.balance_due.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              size="small"
                              value={alloc.allocated_amount}
                              onChange={(e) => handleAllocationChange(alloc.purchase_invoice_id, parseFloat(e.target.value) || 0)}
                              inputProps={{ 
                                min: 0, 
                                max: Math.min(alloc.invoice_amount, alloc.balance_due),
                                step: 1
                              }}
                              sx={{
                                width: 120,
                                '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Divider sx={{ my: 2 }} />
                
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Box textAlign="right">
                    <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>Total Payment</Typography>
                    <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: 600 }}>
                      ₹{totalAmount.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}
          </Stack>
        );
      
      case 1: // Payment Details
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600 }}>
                Payment Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Payment Date"
                    type="date"
                    name="payment_date"
                    value={formData.payment_date}
                    onChange={handleChange}
                    size="small"
                    error={!!fieldErrors.payment_date}
                    helperText={fieldErrors.payment_date}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth size="small" error={!!fieldErrors.payment_mode}>
                    <InputLabel>Payment Mode</InputLabel>
                    <Select
                      name="payment_mode"
                      value={formData.payment_mode}
                      onChange={handleSelectChange}
                      label="Payment Mode"
                      sx={{ borderRadius: 1.5 }}
                    >
                      {paymentModes.map(mode => (
                        <MenuItem key={mode} value={mode} sx={{ fontSize: '0.75rem' }}>{mode}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Reference Number"
                    name="reference_no"
                    value={formData.reference_no}
                    onChange={handleChange}
                    size="small"
                    placeholder="UTR / Cheque No. / Transaction ID"
                    error={!!fieldErrors.reference_no}
                    helperText={fieldErrors.reference_no}
                    inputProps={{ maxLength: 50 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                  />
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5, display: 'block' }}>
                    Enter UTR number for NEFT/RTGS, Cheque number, or transaction ID
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    size="small"
                    placeholder="Additional remarks (optional)"
                    inputProps={{ maxLength: 500 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 2: // TDS & Bank
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600 }}>
                TDS Details
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.tds_applicable}
                    onChange={handleChange}
                    name="tds_applicable"
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.primary } }}
                  />
                }
                label="TDS Applicable"
              />
              
              {formData.tds_applicable && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth size="small" error={!!fieldErrors.tds_section}>
                      <InputLabel>TDS Section</InputLabel>
                      <Select
                        name="tds_section"
                        value={formData.tds_section}
                        onChange={handleSelectChange}
                        label="TDS Section"
                        sx={{ borderRadius: 1.5 }}
                      >
                        {tdsSections.map(section => (
                          <MenuItem key={section.value} value={section.value} sx={{ fontSize: '0.75rem' }}>
                            {section.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="TDS Rate (%)"
                      type="number"
                      name="tds_rate"
                      value={formData.tds_rate}
                      onChange={handleChange}
                      size="small"
                      error={!!fieldErrors.tds_rate}
                      helperText={fieldErrors.tds_rate}
                      InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    />
                  </Grid>
                </Grid>
              )}
            </Paper>
            
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600 }}>
                Bank Account (Optional)
              </Typography>
              
              <Typography variant="caption" sx={{ color: COLORS.text.tertiary, display: 'block', mb: 1.5 }}>
                Company bank account from which payment is being made. If you fill any bank field, all bank details become required.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    name="from_bank_account.bank_name"
                    value={formData.from_bank_account.bank_name}
                    onChange={handleChange}
                    size="small"
                    error={!!fieldErrors['from_bank_account.bank_name']}
                    helperText={fieldErrors['from_bank_account.bank_name']}
                    inputProps={{ maxLength: 100 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    name="from_bank_account.account_no"
                    value={formData.from_bank_account.account_no}
                    onChange={handleChange}
                    size="small"
                    error={!!fieldErrors['from_bank_account.account_no']}
                    helperText={fieldErrors['from_bank_account.account_no']}
                    inputProps={{ maxLength: 18 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                  />
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5, display: 'block' }}>
                    9-18 digits, numbers only
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="IFSC Code"
                    name="from_bank_account.ifsc"
                    value={formData.from_bank_account.ifsc}
                    onChange={handleChange}
                    size="small"
                    error={!!fieldErrors['from_bank_account.ifsc']}
                    helperText={fieldErrors['from_bank_account.ifsc']}
                    inputProps={{ maxLength: 11, style: { textTransform: 'uppercase' } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                  />
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5, display: 'block' }}>
                    Format: First 4 letters, then 0, then 6 alphanumeric (e.g., HDFC0001234)
                  </Typography>
                </Grid>
              </Grid>
              
              {(formData.from_bank_account.bank_name || formData.from_bank_account.account_no || formData.from_bank_account.ifsc) && (
                <Alert severity="info" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.7rem' }}>
                  <strong>Note:</strong> All bank details (Bank Name, Account Number, and IFSC Code) are required when providing bank information.
                </Alert>
              )}
            </Paper>
          </Stack>
        );
      
      case 3: // Review & Submit
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600 }}>
                Payment Summary
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>Vendor</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: COLORS.text.primary }}>
                      {selectedVendor?.vendor_name} ({selectedVendor?.vendor_code})
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>Payment Date</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: COLORS.text.primary }}>
                      {new Date(formData.payment_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>Payment Mode</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.payment_mode}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>Reference No.</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.reference_no}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600 }}>
                Amount Breakdown
              </Typography>
              
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>Total Payment Amount:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>₹{totalAmount.toLocaleString()}</Typography>
                </Stack>
                {formData.tds_applicable && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                      TDS ({formData.tds_rate}% - {formData.tds_section}):
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#F59E0B', fontWeight: 500 }}>
                      -₹{tdsAmount.toLocaleString()}
                    </Typography>
                  </Stack>
                )}
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Net Amount to Pay:</Typography>
                  <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: 600 }}>
                    ₹{netAmount.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
            
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600 }}>
                Invoices Being Paid
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Invoice No.</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Invoice Amount</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">Amount Paid</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allocations.map((alloc) => (
                      <TableRow key={alloc.purchase_invoice_id}>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{alloc.invoice_number}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                          ₹{alloc.invoice_amount.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }} align="right">
                          ₹{alloc.allocated_amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            
            {formData.from_bank_account.bank_name && (
              <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600 }}>
                  Bank Account Details
                </Typography>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>Bank Name</Typography>
                    <Typography variant="body2">{formData.from_bank_account.bank_name}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>Account Number</Typography>
                    <Typography variant="body2">{formData.from_bank_account.account_no}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>IFSC Code</Typography>
                    <Typography variant="body2">{formData.from_bank_account.ifsc}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            {formData.remarks && (
              <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1, fontWeight: 600 }}>
                  Remarks
                </Typography>
                <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                  {formData.remarks}
                </Typography>
              </Paper>
            )}
            
            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {formData.tds_applicable 
                ? `TDS of ₹${tdsAmount.toLocaleString()} will be deducted. Net amount ₹${netAmount.toLocaleString()} will be paid to vendor.`
                : `No TDS applicable. Full amount ₹${totalAmount.toLocaleString()} will be paid to vendor.`}
            </Alert>
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
      }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Create Vendor Payment
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />} sx={{ mt: 1.5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, overflow: 'auto' }}>
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
        display: 'flex',
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
            textTransform: 'none',
          }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={loading}
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
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? null : <AddIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              {loading ? 'Creating...' : 'Create Payment'}
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
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
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

export default AddVendorPayment;