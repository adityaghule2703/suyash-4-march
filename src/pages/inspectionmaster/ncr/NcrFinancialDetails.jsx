// NcrFinancialDetails.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Box,
  IconButton,
  Divider,
  Card,
  CardContent,
  Tooltip,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Calculate as CalculateIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  primaryLight: '#E6F4F1',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC'
  },
  border: '#E3E8EF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

const STEPS = [
  'Financial Information',
  'Review & Submit'
];

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

const NcrFinancialDetails = ({ open, onClose, ncrId, ncrNumber, onFinancialUpdated }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(false);
  
  const [ncrDetails, setNcrDetails] = useState(null);
  const [formData, setFormData] = useState({
    actual_loss: '',
    recovery_amount: '',
    debit_note_id: ''
  });
  
  const [touched, setTouched] = useState({
    actual_loss: false,
    recovery_amount: false
  });

  const [netLoss, setNetLoss] = useState(0);

  useEffect(() => {
    if (open && ncrId) {
      fetchNcrDetails();
    }
  }, [open, ncrId]);

  useEffect(() => {
    // Calculate net loss whenever actual_loss or recovery_amount changes
    const actual = parseFloat(formData.actual_loss) || 0;
    const recovery = parseFloat(formData.recovery_amount) || 0;
    setNetLoss(actual - recovery);
  }, [formData.actual_loss, formData.recovery_amount]);

  const fetchNcrDetails = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/ncrs/${ncrId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNcrDetails(response.data.data);
        // Pre-fill existing financial data if any
        setFormData({
          actual_loss: response.data.data.actual_loss || '',
          recovery_amount: response.data.data.recovery_amount || '',
          debit_note_id: response.data.data.debit_note_id || ''
        });
      }
    } catch (err) {
      console.error('Error fetching NCR details:', err);
      setError('Failed to load NCR details');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setTouched(prev => ({ ...prev, [field]: false }));
    }
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const actual = parseFloat(formData.actual_loss);
    const recovery = parseFloat(formData.recovery_amount);
    
    if (actual && actual < 0) {
      setError('Actual loss cannot be negative');
      return false;
    }
    
    if (recovery && recovery < 0) {
      setError('Recovery amount cannot be negative');
      return false;
    }
    
    if (actual && recovery && recovery > actual) {
      setError('Recovery amount cannot exceed actual loss');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      setActiveStep(1);
      setError('');
    }
  };

  const handleBack = () => {
    setActiveStep(0);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const payload = {
        actual_loss: parseFloat(formData.actual_loss) || 0,
        recovery_amount: parseFloat(formData.recovery_amount) || 0,
        debit_note_id: formData.debit_note_id || ''
      };
      
      const response = await axios.put(
        `${BASE_URL}/api/ncrs/${ncrId}/financial`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setSuccess(`Financial details updated successfully for ${response.data.data.ncr_number}`);
        if (onFinancialUpdated) {
          onFinancialUpdated(response.data.data);
        }
        // Close after 2 seconds
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to update financial details');
      }
    } catch (err) {
      console.error('Error updating financial details:', err);
      setError(err.response?.data?.message || 'Failed to update financial details');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      actual_loss: '',
      recovery_amount: '',
      debit_note_id: ''
    });
    setTouched({
      actual_loss: false,
      recovery_amount: false
    });
    setError('');
    setSuccess('');
    setActiveStep(0);
    setNcrDetails(null);
    onClose();
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Critical': COLORS.error,
      'Major': COLORS.warning,
      'Minor': COLORS.success
    };
    return colors[severity] || COLORS.text.secondary;
  };

  const renderStepContent = (step) => {
    if (!ncrDetails) return null;

    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            {/* Info Banner */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1 
              }}>
                <CalculateIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Financial Impact Tracking
              </Typography>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary 
              }}>
                Record the actual financial impact of this non-conformance, including recovery amounts 
                and debit note information. Net loss is calculated automatically.
              </Typography>
            </Paper>

            {/* NCR Summary Card */}
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
                  NCR Summary
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>NCR Number</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                      {ncrDetails.ncr_number}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Severity</Typography>
                    <Chip 
                      label={ncrDetails.severity} 
                      size="small" 
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 24,
                        bgcolor: `${getSeverityColor(ncrDetails.severity)}20`,
                        color: getSeverityColor(ncrDetails.severity)
                      }} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>NCR Type</Typography>
                    <Chip 
                      label={ncrDetails.ncr_type} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 24 }} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Status</Typography>
                    <Chip 
                      label={ncrDetails.status} 
                      size="small" 
                      sx={{ fontSize: '0.7rem', height: 24 }} 
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Financial Information Form */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 2 
              }}>
                <CurrencyRupeeIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Financial Details
              </Typography>
              
              <Grid container spacing={2}>
                {/* Estimated Loss (Display Only) */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>
                    Estimated Loss (Original)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formatCurrency(ncrDetails.estimated_loss)}
                    disabled
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    sx={inputStyle}
                  />
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    Initial estimated loss when NCR was created
                  </Typography>
                </Grid>

                {/* Actual Loss */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>
                    Actual Loss <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={formData.actual_loss}
                    onChange={(e) => handleChange('actual_loss', e.target.value)}
                    onBlur={() => handleBlur('actual_loss')}
                    placeholder="Enter actual financial loss"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    error={touched.actual_loss && parseFloat(formData.actual_loss) < 0}
                    helperText={touched.actual_loss && parseFloat(formData.actual_loss) < 0 ? 'Loss cannot be negative' : ''}
                    sx={inputStyle}
                  />
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    Actual loss incurred (scrap, rework, downtime, etc.)
                  </Typography>
                </Grid>

                {/* Recovery Amount */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>
                    Recovery Amount
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={formData.recovery_amount}
                    onChange={(e) => handleChange('recovery_amount', e.target.value)}
                    onBlur={() => handleBlur('recovery_amount')}
                    placeholder="Enter recovery amount"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    error={touched.recovery_amount && parseFloat(formData.recovery_amount) < 0}
                    helperText={
                      touched.recovery_amount && parseFloat(formData.recovery_amount) < 0 
                        ? 'Recovery cannot be negative' 
                        : (formData.recovery_amount && formData.actual_loss && parseFloat(formData.recovery_amount) > parseFloat(formData.actual_loss)
                          ? 'Recovery cannot exceed actual loss'
                          : '')
                    }
                    sx={inputStyle}
                  />
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    Amount recovered from vendor/insurance
                  </Typography>
                </Grid>

                {/* Debit Note ID */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={labelStyle}>
                    Debit Note Number
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.debit_note_id}
                    onChange={(e) => handleChange('debit_note_id', e.target.value)}
                    placeholder="e.g., DN-202504-001"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><ReceiptIcon sx={{ fontSize: '0.8rem' }} /></InputAdornment>,
                    }}
                    sx={inputStyle}
                  />
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    Debit note issued to vendor (if applicable)
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Net Loss Calculator */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 2 
              }}>
                <CalculateIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Net Loss Calculation
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.white, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Actual Loss</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.error }}>
                      {formatCurrency(formData.actual_loss || 0)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.white, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Recovery Amount</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.success }}>
                      {formatCurrency(formData.recovery_amount || 0)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.primaryLight, borderRadius: 1.5 }}>
                    <Typography sx={{ fontSize: '0.6rem', color: COLORS.primary }}>Net Loss</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: netLoss > 0 ? COLORS.error : netLoss < 0 ? COLORS.success : COLORS.text.primary }}>
                      {formatCurrency(netLoss)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              {netLoss < 0 && (
                <Alert severity="info" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.7rem' }}>
                  Recovery amount exceeds actual loss. Net gain of {formatCurrency(Math.abs(netLoss))}.
                </Alert>
              )}
              
              {netLoss > 0 && (
                <Alert severity="warning" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.7rem' }}>
                  Net loss of {formatCurrency(netLoss)} needs to be accounted for.
                </Alert>
              )}
            </Paper>

            {/* Form Validation Warnings */}
            {formData.actual_loss && ncrDetails.estimated_loss && parseFloat(formData.actual_loss) !== ncrDetails.estimated_loss && (
              <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}>
                <Typography sx={{ fontSize: '0.7rem' }}>
                  Actual loss ({formatCurrency(formData.actual_loss)}) differs from estimated loss ({formatCurrency(ncrDetails.estimated_loss)}).
                  {parseFloat(formData.actual_loss) > ncrDetails.estimated_loss 
                    ? ' Actual loss is higher than estimated.'
                    : ' Actual loss is lower than estimated.'}
                </Typography>
              </Alert>
            )}
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            {/* Review Summary */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1 
              }}>
                <CheckCircleIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Review Financial Details
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                Please review the financial information before saving.
              </Typography>
            </Paper>

            {/* Financial Summary Card */}
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 2, color: COLORS.primary }}>
                  Financial Summary
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>NCR Number</Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                        {ncrDetails.ncr_number}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Part Number</Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {ncrDetails.part_no || '-'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, mb: 1.5 }}>
                  Financial Breakdown
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Estimated Loss (Original)</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    {formatCurrency(ncrDetails.estimated_loss)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Actual Loss</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.error }}>
                    {formatCurrency(formData.actual_loss || 0)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Recovery Amount</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.success }}>
                    {formatCurrency(formData.recovery_amount || 0)}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Net Loss</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: netLoss > 0 ? COLORS.error : netLoss < 0 ? COLORS.success : COLORS.text.primary }}>
                    {formatCurrency(netLoss)}
                  </Typography>
                </Box>
                
                {formData.debit_note_id && (
                  <>
                    <Divider sx={{ my: 1.5 }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Debit Note Number</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                        {formData.debit_note_id}
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Impact Assessment */}
            {(netLoss > 100000 || netLoss < -100000) && (
              <Alert 
                severity={netLoss > 0 ? "error" : "success"} 
                sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                  {netLoss > 0 
                    ? `High financial impact detected. Net loss of ${formatCurrency(netLoss)} requires management attention.`
                    : `Significant recovery achieved. Net gain of ${formatCurrency(Math.abs(netLoss))} from this NCR.`}
                </Typography>
              </Alert>
            )}
          </Stack>
        );

      default:
        return null;
    }
  };

  const inputStyle = {
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
    '& .MuiInputLabel-root': {
      fontSize: '0.7rem',
      color: COLORS.text.secondary
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: COLORS.primary,
      fontSize: '0.7rem'
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  if (!open) return null;

  return (
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
          overflow: 'hidden',
          maxHeight: '90vh'
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CurrencyRupeeIcon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Financial Details
          </Typography>
          {ncrNumber && (
            <Chip 
              label={ncrNumber} 
              size="small" 
              sx={{ 
                fontSize: '0.65rem', 
                height: 22, 
                bgcolor: COLORS.primaryLight, 
                color: COLORS.primary,
                ml: 1
              }} 
            />
          )}
        </Box>
        <IconButton
          size="small"
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: COLORS.text.tertiary,
            '&:hover': { color: COLORS.text.secondary }
          }}
        >
          <CloseIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Loading NCR details...
            </Typography>
          </Box>
        ) : (
          <>
            {renderStepContent(activeStep)}
            
            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 1.5,
                  mt: 2,
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{
                  borderRadius: 1.5,
                  mt: 2,
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {success}
              </Alert>
            )}
          </>
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
          startIcon={<span>←</span>}
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

          {activeStep === STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <SaveIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark },
                '&:disabled': { bgcolor: COLORS.border, color: COLORS.text.tertiary }
              }}
            >
              {loading ? 'Saving...' : 'Save Financial Details'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={<span>→</span>}
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
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default NcrFinancialDetails;