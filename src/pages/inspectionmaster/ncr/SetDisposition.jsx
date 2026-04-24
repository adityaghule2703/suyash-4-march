// SetDisposition.jsx
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
  MenuItem,
  Box,
  Chip,
  IconButton,
  Divider,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Build as BuildIcon,
  SwapHoriz as SwapHorizIcon,
  AssignmentReturn as AssignmentReturnIcon,
  Sort as SortIcon,
  Group as GroupIcon,
  Pending as PendingIcon,
  Approval as ApprovalIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Description as DescriptionIcon,
  LocalShipping as LocalShippingIcon
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

// Disposition options with their configurations
const DISPOSITION_OPTIONS = [
  { 
    value: 'Scrap', 
    label: 'Scrap', 
    description: 'Material unusable, cannot fix',
    icon: <DeleteIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.error,
    requiresConcession: false,
    requiresReturnChallan: false
  },
  { 
    value: 'Rework', 
    label: 'Rework', 
    description: 'Can be fixed with additional operations',
    icon: <BuildIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.warning,
    requiresConcession: false,
    requiresReturnChallan: false
  },
  { 
    value: 'Use As-Is', 
    label: 'Use As-Is', 
    description: 'Minor deviation, engineering approved',
    icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.success,
    requiresConcession: false,
    requiresReturnChallan: false
  },
  { 
    value: 'Return to Vendor', 
    label: 'Return to Vendor', 
    description: 'Supplier\'s fault, send back',
    icon: <AssignmentReturnIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.info,
    requiresConcession: false,
    requiresReturnChallan: true
  },
  { 
    value: 'Sort', 
    label: 'Sort', 
    description: '100% inspect to separate good from bad',
    icon: <SortIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.warning,
    requiresConcession: false,
    requiresReturnChallan: false
  },
  { 
    value: 'MRB Review', 
    label: 'MRB Review', 
    description: 'Material Review Board decision pending',
    icon: <GroupIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.info,
    requiresConcession: false,
    requiresReturnChallan: false
  },
  { 
    value: 'Customer Concession', 
    label: 'Customer Concession', 
    description: 'Customer approval required',
    icon: <ApprovalIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.info,
    requiresConcession: true,
    requiresReturnChallan: false
  },
  { 
    value: 'Pending Decision', 
    label: 'Pending Decision', 
    description: 'Awaiting more information',
    icon: <PendingIcon sx={{ fontSize: '1rem' }} />,
    color: COLORS.text.tertiary,
    requiresConcession: false,
    requiresReturnChallan: false
  }
];

const SetDisposition = ({ open, onClose, ncrId, ncrNumber, onDispositionSet }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ncrDetails, setNcrDetails] = useState(null);
  const [fetching, setFetching] = useState(false);
  
  const [formData, setFormData] = useState({
    disposition: '',
    disposition_basis: '',
    immediate_action: '',
    concession_number: '',
    customer_concession_no: '',
    vendor_return_challan: '',
    financial_impact: ''
  });

  const [touched, setTouched] = useState({
    disposition: false,
    disposition_basis: false
  });

  useEffect(() => {
    if (open && ncrId) {
      fetchNcrDetails();
    }
  }, [open, ncrId]);

  const fetchNcrDetails = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/ncrs/${ncrId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNcrDetails(response.data.data);
        // Pre-fill existing disposition if any
        if (response.data.data.disposition) {
          setFormData(prev => ({
            ...prev,
            disposition: response.data.data.disposition,
            disposition_basis: response.data.data.disposition_basis || '',
            immediate_action: response.data.data.immediate_action || '',
            concession_number: response.data.data.concession_number || '',
            customer_concession_no: response.data.data.customer_concession_no || '',
            vendor_return_challan: response.data.data.vendor_return_challan || '',
            financial_impact: response.data.data.financial_impact || ''
          }));
        }
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

  const getSelectedDisposition = () => {
    return DISPOSITION_OPTIONS.find(opt => opt.value === formData.disposition);
  };

  const validateForm = () => {
    if (!formData.disposition) {
      setError('Please select a disposition');
      setTouched(prev => ({ ...prev, disposition: true }));
      return false;
    }
    
    if (!formData.disposition_basis?.trim()) {
      setError('Please provide a basis/reason for the disposition');
      setTouched(prev => ({ ...prev, disposition_basis: true }));
      return false;
    }
    
    const selectedDispo = getSelectedDisposition();
    if (selectedDispo?.requiresConcession) {
      if (!formData.concession_number?.trim()) {
        setError('Concession number is required for Customer Concession');
        return false;
      }
      if (!formData.customer_concession_no?.trim()) {
        setError('Customer concession number is required for Customer Concession');
        return false;
      }
    }
    
    if (selectedDispo?.requiresReturnChallan && !formData.vendor_return_challan?.trim()) {
      setError('Vendor return challan number is required for Return to Vendor');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const payload = {
        disposition: formData.disposition,
        disposition_basis: formData.disposition_basis,
        immediate_action: formData.immediate_action || '',
        concession_number: formData.concession_number || '',
        customer_concession_no: formData.customer_concession_no || '',
        vendor_return_challan: formData.vendor_return_challan || '',
        financial_impact: formData.financial_impact ? parseFloat(formData.financial_impact) : 0
      };
      
      const response = await axios.put(
        `${BASE_URL}/api/ncrs/${ncrId}/disposition`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setSuccess(`Disposition "${formData.disposition}" set successfully for ${response.data.data.ncr_number}`);
        if (onDispositionSet) {
          onDispositionSet(response.data.data);
        }
        // Close after 2 seconds
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to set disposition');
      }
    } catch (err) {
      console.error('Error setting disposition:', err);
      setError(err.response?.data?.message || 'Failed to set disposition');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      disposition: '',
      disposition_basis: '',
      immediate_action: '',
      concession_number: '',
      customer_concession_no: '',
      vendor_return_challan: '',
      financial_impact: ''
    });
    setTouched({
      disposition: false,
      disposition_basis: false
    });
    setError('');
    setSuccess('');
    setNcrDetails(null);
    onClose();
  };

  const selectedDisposition = getSelectedDisposition();
  const requiresConcession = selectedDisposition?.requiresConcession || false;
  const requiresReturnChallan = selectedDisposition?.requiresReturnChallan || false;

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SwapHorizIcon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Set Disposition
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

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography sx={{ ml: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Loading NCR details...
            </Typography>
          </Box>
        ) : (
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
                <WarningIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Disposition Decision
              </Typography>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary 
              }}>
                Select the appropriate disposition for the non-conforming material. 
                This decision determines the final action to be taken and will update the NCR status.
              </Typography>
            </Paper>

            {/* NCR Summary Card */}
            {ncrDetails && (
              <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1 }}>
                    NCR Summary
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Part Number</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{ncrDetails.part_no || '-'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Severity</Typography>
                      <Chip 
                        label={ncrDetails.severity} 
                        size="small" 
                        sx={{ fontSize: '0.65rem', height: 20 }} 
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Rejected Qty</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        {ncrDetails.rejected_qty || 0} {ncrDetails.quantity_unit || 'Nos'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Current Status</Typography>
                      <Chip 
                        label={ncrDetails.status} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.65rem', height: 20 }} 
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Disposition Selection */}
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
                Select Disposition <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              <Grid container spacing={1.5}>
                {DISPOSITION_OPTIONS.map((option) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={option.value}>
                    <Paper
                      onClick={() => handleChange('disposition', option.value)}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        borderRadius: 1.5,
                        border: `1.5px solid ${formData.disposition === option.value ? option.color : COLORS.border}`,
                        bgcolor: formData.disposition === option.value ? `${option.color}10` : COLORS.background.white,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: option.color,
                          bgcolor: `${option.color}05`
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Box sx={{ color: option.color }}>{option.icon}</Box>
                        <Typography sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          color: formData.disposition === option.value ? option.color : COLORS.text.primary 
                        }}>
                          {option.label}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, lineHeight: 1.3 }}>
                        {option.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              {touched.disposition && !formData.disposition && (
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.error, mt: 1 }}>
                  Please select a disposition
                </Typography>
              )}
            </Paper>

            {/* Disposition Basis */}
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
                <DescriptionIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Disposition Basis <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                value={formData.disposition_basis}
                onChange={(e) => handleChange('disposition_basis', e.target.value)}
                onBlur={() => handleBlur('disposition_basis')}
                placeholder="Provide the rationale for this disposition decision. Include technical justification, engineering approval, or quality assessment..."
                error={touched.disposition_basis && !formData.disposition_basis}
                helperText={touched.disposition_basis && !formData.disposition_basis ? 'Disposition basis is required' : ''}
                sx={inputStyle}
              />
            </Paper>

            {/* Immediate Action */}
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
                Immediate Action Taken
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                value={formData.immediate_action}
                onChange={(e) => handleChange('immediate_action', e.target.value)}
                placeholder="Describe the immediate action taken after disposition decision..."
                sx={inputStyle}
              />
            </Paper>

            {/* Conditional Fields */}
            {requiresConcession && (
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
                  <ApprovalIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Concession Details <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelStyle}>Concession Number</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.concession_number}
                      onChange={(e) => handleChange('concession_number', e.target.value)}
                      placeholder="Internal concession number"
                      error={requiresConcession && !formData.concession_number}
                      helperText={requiresConcession && !formData.concession_number ? 'Concession number is required' : ''}
                      sx={inputStyle}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelStyle}>Customer Concession Number</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.customer_concession_no}
                      onChange={(e) => handleChange('customer_concession_no', e.target.value)}
                      placeholder="Customer provided concession number"
                      error={requiresConcession && !formData.customer_concession_no}
                      helperText={requiresConcession && !formData.customer_concession_no ? 'Customer concession number is required' : ''}
                      sx={inputStyle}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {requiresReturnChallan && (
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
                  <LocalShippingIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                  Return to Vendor Details <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                
                <TextField
                  fullWidth
                  size="small"
                  value={formData.vendor_return_challan}
                  onChange={(e) => handleChange('vendor_return_challan', e.target.value)}
                  placeholder="Vendor return challan / GRN number"
                  error={requiresReturnChallan && !formData.vendor_return_challan}
                  helperText={requiresReturnChallan && !formData.vendor_return_challan ? 'Vendor return challan is required' : ''}
                  sx={inputStyle}
                />
              </Paper>
            )}

            {/* Financial Impact */}
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
                Financial Impact
              </Typography>
              
              <TextField
                fullWidth
                size="small"
                type="number"
                value={formData.financial_impact}
                onChange={(e) => handleChange('financial_impact', e.target.value)}
                placeholder="Estimated financial impact of this disposition"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                sx={inputStyle}
              />
            </Paper>

            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 1.5,
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
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {success}
              </Alert>
            )}
          </Stack>
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
          onClick={handleClose}
          disabled={loading}
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
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || fetching}
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
          {loading ? 'Setting...' : 'Set Disposition'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetDisposition;