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
} from '@mui/material';
import {
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  NoteAdd as CreditNoteIcon,
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

// Reason options
const REASON_OPTIONS = ['Sales Return', 'Price Difference', 'Discount Adjustment', 'Quality Issue', 'Wrong Item Shipped', 'Other'];

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

const steps = ['Select Invoice & Reason', 'Add Items'];

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const AddCreditNote = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Data fetching states
  const [invoices, setInvoices] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  
  // Selected values
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    invoice_id: '',
    reason: '',
    reason_remarks: '',
    items: []
  });

  // Fetch Invoices - No conditions, fetch all invoices
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
      setError('Failed to load invoices');
    } finally {
      setLoadingInvoices(false);
    }
  }, []);

  // Fetch Items
  const fetchItems = useCallback(async () => {
    try {
      setLoadingItems(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/items?limit=200`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setItems(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoadingItems(false);
    }
  }, []);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchInvoices();
      fetchItems();
    }
  }, [open, fetchInvoices, fetchItems]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleInvoiceChange = (event, newValue) => {
    setSelectedInvoice(newValue);
    setFormData(prev => ({ ...prev, invoice_id: newValue?._id || '' }));
    setFieldErrors(prev => ({ ...prev, invoice_id: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        part_no: '', 
        part_name: '', 
        hsn_code: '', 
        unit: '', 
        quantity: '', 
        unit_price: '', 
        gst_percentage: 18 
      }]
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    // If part_no is selected, auto-fill item details
    if (field === 'part_no') {
      const selectedItem = items.find(item => item.part_no === value);
      if (selectedItem) {
        updatedItems[index].part_name = selectedItem.part_name || '';
        updatedItems[index].hsn_code = selectedItem.hsn_code || '';
        updatedItems[index].unit = selectedItem.unit || '';
        updatedItems[index].gst_percentage = selectedItem.gst_percentage || 18;
      }
    }
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const calculateItemTotal = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unit_price) || 0;
    const amount = quantity * unitPrice;
    const gstPercentage = parseFloat(item.gst_percentage) || 0;
    const gstAmount = amount * (gstPercentage / 100);
    return amount + gstAmount;
  };

  const calculateGrandTotal = () => {
    return formData.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!formData.invoice_id) {
          errors.invoice_id = 'Please select an invoice';
          isValid = false;
        }
        if (!formData.reason) {
          errors.reason = 'Please select a reason';
          isValid = false;
        }
        break;
      
      case 1:
        if (formData.items.length === 0) {
          errors.items = 'Please add at least one item';
          isValid = false;
        }
        formData.items.forEach((item, idx) => {
          if (!item.part_no) errors[`item_part_${idx}`] = 'Part no required';
          if (!item.quantity || parseFloat(item.quantity) <= 0) errors[`item_qty_${idx}`] = 'Valid quantity required';
          if (!item.unit_price || parseFloat(item.unit_price) <= 0) errors[`item_price_${idx}`] = 'Valid price required';
        });
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
      const payload = {
        invoice_id: formData.invoice_id,
        reason: formData.reason,
        reason_remarks: formData.reason_remarks || undefined,
        items: formData.items.map(item => ({
          part_no: item.part_no,
          part_name: item.part_name,
          hsn_code: item.hsn_code,
          unit: item.unit,
          quantity: parseFloat(item.quantity),
          unit_price: parseFloat(item.unit_price),
          gst_percentage: parseFloat(item.gst_percentage)
        }))
      };
      
      const response = await axios.post(`${BASE_URL}/api/invoices/credit-notes`, payload, {
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
        setError(response.data.message || 'Failed to create credit note');
      }
    } catch (err) {
      console.error('Error creating credit note:', err);
      setError(err.response?.data?.message || 'Failed to create credit note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setSelectedInvoice(null);
    setFormData({
      invoice_id: '',
      reason: '',
      reason_remarks: '',
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
                <CreditNoteIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Credit Note Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Select Invoice <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={invoices}
                      getOptionLabel={(option) => `${option.invoice_no} - ${option.customer_name} (₹${formatCurrency(option.grand_total)})`}
                      value={selectedInvoice}
                      onChange={handleInvoiceChange}
                      loading={loadingInvoices}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Search and select invoice"
                          error={!!fieldErrors.invoice_id}
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
                    {fieldErrors.invoice_id && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.invoice_id}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Reason <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.reason}>
                      <Select
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': { py: 1, px: 1.5 }
                        }}
                      >
                        <MenuItem value="" disabled>Select reason</MenuItem>
                        {REASON_OPTIONS.map(option => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {fieldErrors.reason && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                        {fieldErrors.reason}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      Reason Remarks
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="reason_remarks"
                      value={formData.reason_remarks}
                      onChange={handleChange}
                      placeholder="Additional remarks..."
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

            {selectedInvoice && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  Invoice Details
                </Typography>
                <Stack spacing={0.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Invoice No:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{selectedInvoice.invoice_no}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Customer:</Typography>
                    <Typography sx={{ fontSize: '0.7rem' }}>{selectedInvoice.customer_name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Invoice Date:</Typography>
                    <Typography sx={{ fontSize: '0.7rem' }}>{new Date(selectedInvoice.invoice_date).toLocaleDateString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Grand Total:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }}>
                      ₹{formatCurrency(selectedInvoice.grand_total)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem' }}>Balance Due:</Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: selectedInvoice.balance_due > 0 ? '#EF4444' : COLORS.primary }}>
                      ₹{formatCurrency(selectedInvoice.balance_due)}
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
                  Items to Credit
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                  onClick={handleAddItem}
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
                  Add Item
                </Button>
              </Stack>

              {formData.items.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ReceiptIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                    No items added. Click "Add Item" to add items for credit note.
                  </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.primaryLight }}>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part No</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Part Name</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>HSN</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Quantity</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Unit Price</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>GST %</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Amount</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, width: 40 }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.items.map((item, index) => {
                          const amount = calculateItemTotal(item);
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <Autocomplete
                                  options={items}
                                  getOptionLabel={(option) => `${option.part_no} - ${option.part_name || ''}`}
                                  value={items.find(i => i.part_no === item.part_no) || null}
                                  onChange={(e, newValue) => handleItemChange(index, 'part_no', newValue?.part_no || '')}
                                  size="small"
                                  sx={{ width: 130 }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      placeholder="Part No"
                                      error={!!fieldErrors[`item_part_${index}`]}
                                      sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.7rem' } }}
                                    />
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={item.part_name}
                                  onChange={(e) => handleItemChange(index, 'part_name', e.target.value)}
                                  placeholder="Part Name"
                                  sx={{ width: 120, '& .MuiOutlinedInput-root': { fontSize: '0.7rem' } }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={item.hsn_code}
                                  onChange={(e) => handleItemChange(index, 'hsn_code', e.target.value)}
                                  placeholder="HSN"
                                  sx={{ width: 80, '& .MuiOutlinedInput-root': { fontSize: '0.7rem' } }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={item.unit}
                                  onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                  placeholder="Unit"
                                  sx={{ width: 60, '& .MuiOutlinedInput-root': { fontSize: '0.7rem' } }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  size="small"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                  placeholder="Qty"
                                  error={!!fieldErrors[`item_qty_${index}`]}
                                  sx={{ width: 80, '& .MuiOutlinedInput-root': { fontSize: '0.7rem' } }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  size="small"
                                  value={item.unit_price}
                                  onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                  placeholder="Price"
                                  error={!!fieldErrors[`item_price_${index}`]}
                                  InputProps={{ startAdornment: <Typography sx={{ fontSize: '0.7rem' }}>₹</Typography> }}
                                  sx={{ width: 100, '& .MuiOutlinedInput-root': { fontSize: '0.7rem' } }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  size="small"
                                  value={item.gst_percentage}
                                  onChange={(e) => handleItemChange(index, 'gst_percentage', e.target.value)}
                                  placeholder="GST%"
                                  sx={{ width: 70, '& .MuiOutlinedInput-root': { fontSize: '0.7rem' } }}
                                  InputProps={{ endAdornment: <Typography sx={{ fontSize: '0.7rem' }}>%</Typography> }}
                                />
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600, color: COLORS.primary }}>
                                ₹{formatCurrency(amount)}
                              </TableCell>
                              <TableCell>
                                <IconButton size="small" onClick={() => handleRemoveItem(index)} sx={{ color: '#EF4444' }}>
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
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary }}>
                          Total Credit Amount:
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary }}>
                          ₹{formatCurrency(calculateGrandTotal())}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Box>
                </>
              )}
              {fieldErrors.items && (
                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 1 }}>
                  {fieldErrors.items}
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
          Create Credit Note
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
              disabled={loading || formData.items.length === 0}
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
              {loading ? 'Creating...' : 'Create Credit Note'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || !formData.invoice_id || !formData.reason}
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

export default AddCreditNote;