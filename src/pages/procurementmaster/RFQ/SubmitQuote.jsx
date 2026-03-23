import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment,
  CircularProgress,
  Divider,
  Autocomplete,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import { 
  Send as SendIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Business as BusinessIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  primaryBlue: '#00B4D8',
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
  border: '#E3E8EF',
  success: '#10B981',
  successLight: '#D1FAE5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7'
};

const HEADER_GRADIENT = 'linear-gradient(135deg, #063C3F 0%, #00B4D8 50%, #05292B 100%)';
const PRIMARY_DARK = '#063C3F';
const PRIMARY_BLUE = '#00B4D8';

// Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: HEADER_GRADIENT,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom Step Icon styling
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active || ownerState.completed ? PRIMARY_BLUE : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  ...(ownerState.active && {
    backgroundColor: PRIMARY_BLUE,
    boxShadow: '0 4px 10px 0 rgba(0,180,216,0.3)',
  }),
  ...(ownerState.completed && {
    backgroundColor: PRIMARY_BLUE,
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className } = props;
  return (
    <CustomStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? '✓' : props.icon}
    </CustomStepIconRoot>
  );
}

const steps = ['Select Vendor', 'Item Quotations', 'Remarks & Submit'];

const SubmitQuote = ({ open, onClose, rfq, onQuoteSubmitted }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({
    vendor_id: '',
    response_items: [],
    overall_remarks: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [quoteItems, setQuoteItems] = useState([]);

  useEffect(() => {
    if (open && rfq) {
      fetchVendors();
    }
  }, [open, rfq]);

  useEffect(() => {
    if (rfq && rfq.items && rfq.items.length > 0) {
      const initialItems = rfq.items.map(item => ({
        item_id: item.item_id,
        part_no: item.part_no,
        description: item.description,
        required_qty: item.required_qty,
        unit: item.unit,
        quoted_rate: '',
        delivery_days: '',
        payment_terms: '',
        remarks: ''
      }));
      setQuoteItems(initialItems);
      setFormData(prev => ({
        ...prev,
        response_items: initialItems.map(item => ({
          item_id: item.item_id,
          quoted_rate: '',
          delivery_days: '',
          payment_terms: '',
          remarks: ''
        }))
      }));
    }
  }, [rfq]);

  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/vendors?page=1&limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setVendors(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleVendorChange = (event, value) => {
    setSelectedVendor(value);
    setFormData(prev => ({
      ...prev,
      vendor_id: value?._id || ''
    }));
    setFieldErrors(prev => ({ ...prev, vendor_id: '' }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...quoteItems];
    updatedItems[index][field] = value;
    setQuoteItems(updatedItems);
    
    const updatedResponseItems = [...formData.response_items];
    updatedResponseItems[index] = {
      item_id: updatedItems[index].item_id,
      quoted_rate: updatedItems[index].quoted_rate,
      delivery_days: updatedItems[index].delivery_days,
      payment_terms: updatedItems[index].payment_terms,
      remarks: updatedItems[index].remarks
    };
    setFormData(prev => ({
      ...prev,
      response_items: updatedResponseItems
    }));
    
    setFieldErrors(prev => ({
      ...prev,
      [`item_${index}_${field}`]: ''
    }));
  };

  const handleRemarksChange = (e) => {
    setFormData(prev => ({
      ...prev,
      overall_remarks: e.target.value
    }));
    setFieldErrors(prev => ({ ...prev, overall_remarks: '' }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Select Vendor
        if (!formData.vendor_id) {
          errors.vendor_id = 'Please select a vendor';
          isValid = false;
        }
        break;
      case 1: // Item Quotations
        quoteItems.forEach((item, index) => {
          if (!item.quoted_rate) {
            errors[`item_${index}_quoted_rate`] = 'Required';
            isValid = false;
          } else if (item.quoted_rate <= 0) {
            errors[`item_${index}_quoted_rate`] = 'Must be > 0';
            isValid = false;
          }
          if (!item.delivery_days) {
            errors[`item_${index}_delivery_days`] = 'Required';
            isValid = false;
          } else if (item.delivery_days <= 0) {
            errors[`item_${index}_delivery_days`] = 'Must be > 0';
            isValid = false;
          }
          if (!item.payment_terms) {
            errors[`item_${index}_payment_terms`] = 'Required';
            isValid = false;
          }
        });
        break;
      default:
        break;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fill all required fields');
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
    if (!validateStep(1)) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const submissionData = {
        vendor_id: formData.vendor_id,
        response_items: formData.response_items.map(item => ({
          item_id: item.item_id,
          quoted_rate: parseFloat(item.quoted_rate),
          delivery_days: parseInt(item.delivery_days),
          payment_terms: item.payment_terms,
          remarks: item.remarks
        })),
        overall_remarks: formData.overall_remarks || ''
      };
      
      const response = await axios.post(
        `${BASE_URL}/api/rfqs/${rfq._id}/submit-quote`,
        submissionData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onQuoteSubmitted(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to submit quotation');
      }
    } catch (err) {
      console.error('Error submitting quote:', err);
      setError(err.response?.data?.message || 'Failed to submit quotation');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      vendor_id: '',
      response_items: [],
      overall_remarks: ''
    });
    setSelectedVendor(null);
    setQuoteItems([]);
    setFieldErrors({});
    setError('');
    setActiveStep(0);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  if (!rfq) return null;
  
  const totalValue = quoteItems.reduce((sum, item) => {
    return sum + ((item.quoted_rate || 0) * item.required_qty);
  }, 0);
  
  const hasMissingItems = quoteItems.some(item => !item.quoted_rate || !item.delivery_days || !item.payment_terms);

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Select Vendor
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                RFQ Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      RFQ NUMBER
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, mt: 0.5 }}>
                      {rfq.rfq_number}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      PR NUMBER
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, mt: 0.5 }}>
                      {rfq.pr_id?.pr_number || '-'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      TOTAL ITEMS
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, mt: 0.5 }}>
                      {rfq.items?.length || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                      VALID TILL
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, mt: 0.5 }}>
                      {rfq.valid_till ? new Date(rfq.valid_till).toLocaleDateString() : '-'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                <BusinessIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                Select Vendor
              </Typography>
              
              <Autocomplete
                fullWidth
                options={vendors}
                loading={loadingVendors}
                value={selectedVendor}
                onChange={handleVendorChange}
                getOptionLabel={(option) => `${option.vendor_code} - ${option.vendor_name}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder={loadingVendors ? 'Loading vendors...' : 'Select vendor...'}
                    error={!!fieldErrors.vendor_id}
                    helperText={fieldErrors.vendor_id}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' },
                      '& .MuiFormHelperText-root': { fontSize: '0.65rem', marginLeft: 0 }
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                        {option.vendor_name}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Code: {option.vendor_code} | GST: {option.gstin || 'N/A'}
                      </Typography>
                    </Box>
                  </li>
                )}
              />
            </Paper>
          </Stack>
        );
      
      case 1: // Item Quotations
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Item Quotations
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Part No</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Qty</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Unit</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="right">Rate (₹)</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }} align="center">Delivery</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Payment</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quoteItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{item.description}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }} align="center">{item.required_qty}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }} align="center">{item.unit}</TableCell>
                        <TableCell align="right">
                          <TextField
                            size="small"
                            type="number"
                            placeholder="Rate"
                            value={item.quoted_rate}
                            onChange={(e) => handleItemChange(index, 'quoted_rate', e.target.value)}
                            error={!!fieldErrors[`item_${index}_quoted_rate`]}
                            helperText={fieldErrors[`item_${index}_quoted_rate`]}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                              inputProps: { min: 0, step: 0.01 }
                            }}
                            sx={{ width: 90, '& .MuiInputBase-input': { fontSize: '0.7rem', py: 0.75 } }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            type="number"
                            placeholder="Days"
                            value={item.delivery_days}
                            onChange={(e) => handleItemChange(index, 'delivery_days', e.target.value)}
                            error={!!fieldErrors[`item_${index}_delivery_days`]}
                            helperText={fieldErrors[`item_${index}_delivery_days`]}
                            inputProps={{ min: 0, step: 1 }}
                            sx={{ width: 70, '& .MuiInputBase-input': { fontSize: '0.7rem', py: 0.75 } }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            placeholder="e.g., Net 30"
                            value={item.payment_terms}
                            onChange={(e) => handleItemChange(index, 'payment_terms', e.target.value)}
                            error={!!fieldErrors[`item_${index}_payment_terms`]}
                            helperText={fieldErrors[`item_${index}_payment_terms`]}
                            sx={{ width: 90, '& .MuiInputBase-input': { fontSize: '0.7rem', py: 0.75 } }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            placeholder="Remarks"
                            value={item.remarks}
                            onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                            sx={{ width: 90, '& .MuiInputBase-input': { fontSize: '0.7rem', py: 0.75 } }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                  Total Quoted Value:
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.primary }}>
                  ₹{totalValue.toLocaleString()}
                </Typography>
              </Stack>
              
              {hasMissingItems && (
                <Box sx={{ mt: 1.5, p: 1, bgcolor: COLORS.warningLight, borderRadius: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WarningIcon sx={{ color: COLORS.warning, fontSize: 14 }} />
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#92400E' }}>
                      Please fill Rate, Delivery Days, and Payment Terms for each item.
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Paper>
          </Stack>
        );
      
      case 2: // Remarks & Submit
        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Overall Remarks
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                size="small"
                placeholder="Add any overall remarks or special notes about your quotation..."
                value={formData.overall_remarks}
                onChange={handleRemarksChange}
                disabled={loading}
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
            </Paper>
            
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                Quotation Summary
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Box sx={{ p: 1, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Vendor</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{selectedVendor?.vendor_name || '-'}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Box sx={{ p: 1, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Total Items</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{quoteItems.length}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 1, bgcolor: COLORS.successLight, borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: '#065F46' }}>Total Quoted Value</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46' }}>₹{totalValue.toLocaleString()}</Typography>
                  </Box>
                </Grid>
              </Grid>
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
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <SendIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
              Submit Quotation
            </Typography>
          </Stack>
          <Chip 
            label={`RFQ: ${rfq.rfq_number}`} 
            size="small" 
            sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontSize: '0.7rem' }} 
          />
        </Stack>

        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ mb: 0.5, mt: 0.5 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography fontWeight={500} fontSize="0.8rem" color={COLORS.text.secondary}>
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
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 1.5,
              fontSize: '0.75rem',
              py: 0.5
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
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
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
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !formData.vendor_id || hasMissingItems}
              startIcon={loading ? null : <SendIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              {loading ? 'Submitting...' : 'Submit Quotation'}
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

export default SubmitQuote;