// SendQualityCert.jsx
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
  Alert,
  CircularProgress,
  Chip,
  Box,
  IconButton,
  Divider,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
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

const STEPS = [
  'Certificate Details',
  'Review & Send',
  'Confirmation'
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

const SendQualityCert = ({ open, onClose, certId, certNumber, onCertificateSent }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(false);
  
  const [certificate, setCertificate] = useState(null);
  const [email, setEmail] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');
  const [sentData, setSentData] = useState(null);

  useEffect(() => {
    if (open && certId) {
      fetchCertificateDetails();
    }
  }, [open, certId]);

  const fetchCertificateDetails = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/quality-certificates/${certId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCertificate(response.data.data);
        // Pre-fill email from customer if available
        if (response.data.data.customer_email) {
          setEmail(response.data.data.customer_email);
        }
      }
    } catch (err) {
      console.error('Error fetching certificate details:', err);
      setError('Failed to load certificate details');
    } finally {
      setFetching(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !certificate) {
      setError('Certificate details not loaded');
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleSend = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/quality-certificates/${certId}/mark-sent`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setSentData(response.data.data);
        setSuccess(`Certificate ${response.data.data.cert_id} marked as sent successfully!`);
        if (onCertificateSent) {
          onCertificateSent(response.data.data);
        }
        // Move to confirmation step
        setActiveStep(2);
      } else {
        setError(response.data.message || 'Failed to mark certificate as sent');
      }
    } catch (err) {
      console.error('Error marking certificate as sent:', err);
      setError(err.response?.data?.message || 'Failed to mark certificate as sent');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setError('');
    setSuccess('');
    setEmail('');
    setAdditionalNote('');
    setSentData(null);
    setCertificate(null);
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCustomerName = () => {
    if (!certificate) return '';
    // Try to get customer name from various possible sources
    if (certificate.customer_name) return certificate.customer_name;
    if (certificate.so_id?.customer_name) return certificate.so_id.customer_name;
    if (certificate.dc_id?.customer_name) return certificate.dc_id.customer_name;
    return 'Customer';
  };

  const renderStepContent = (step) => {
    if (!certificate && step !== 2) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} sx={{ color: COLORS.primary }} />
        </Box>
      );
    }

    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
                        {/* Certificate Summary */}
            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                  Certificate Summary
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Certificate Number</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                      {certificate.cert_id}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Certificate Type</Typography>
                    <Chip 
                      label={certificate.cert_type} 
                      size="small" 
                      sx={{ fontSize: '0.65rem', height: 22 }} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Part Number</Typography>
                    <Typography sx={{ fontSize: '0.75rem' }}>{certificate.part_no || '-'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Lot/Batch Number</Typography>
                    <Typography sx={{ fontSize: '0.75rem' }}>{certificate.lot_no || '-'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Issue Date</Typography>
                    <Typography sx={{ fontSize: '0.75rem' }}>{formatDateOnly(certificate.issue_date)}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Quantity</Typography>
                    <Typography sx={{ fontSize: '0.75rem' }}>{certificate.quantity || 0} units</Typography>
                  </Grid>
                </Grid>

                {(certificate.so_id || certificate.dc_id) && (
                  <>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {certificate.so_id && (
                        <Box>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            <BusinessIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                            Sales Order
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem' }}>
                            {typeof certificate.so_id === 'object' ? certificate.so_id.so_number : certificate.so_id}
                          </Typography>
                        </Box>
                      )}
                      {certificate.dc_id && (
                        <Box>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            <LocalShippingIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                            Delivery Challan
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem' }}>
                            {typeof certificate.dc_id === 'object' ? certificate.dc_id.dc_number : certificate.dc_id}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Customer Details */}
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
                <PersonIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Customer Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Customer Name</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={getCustomerName()}
                    disabled
                    sx={inputStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Email Address</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    sx={inputStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    Enter customer email to record communication (optional)
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={labelStyle}>Additional Note (Optional)</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                    placeholder="Any additional notes about the communication..."
                    sx={inputStyle}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Note */}
            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}>
              <Typography sx={{ fontSize: '0.7rem' }}>
                Marking this certificate as sent will record the timestamp and update the certificate status.
                This action can be performed once per certificate.
              </Typography>
            </Alert>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
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
                Ready to Send?
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                Please review the information before marking the certificate as sent.
              </Typography>
            </Paper>

            <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1.5, color: COLORS.primary }}>
                  Send Confirmation
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Certificate</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace' }}>
                        {certificate.cert_id}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Customer</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        {getCustomerName()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Email</Typography>
                      <Typography sx={{ fontSize: '0.8rem' }}>
                        {email || 'Not provided'}
                      </Typography>
                    </Box>
                  </Grid>
                  {additionalNote && (
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ mb: 1.5 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Additional Note</Typography>
                        <Paper sx={{ p: 1, mt: 0.5, bgcolor: COLORS.background.light, borderRadius: 1 }}>
                          <Typography sx={{ fontSize: '0.75rem' }}>{additionalNote}</Typography>
                        </Paper>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                <Divider sx={{ my: 1.5 }} />
                
                <Alert severity="warning" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                    Confirm Action
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem' }}>
                    Once confirmed, the certificate will be marked as sent. This action cannot be undone.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2.5, 
              bgcolor: COLORS.success + '10', 
              borderRadius: 2, 
              border: `1px solid ${COLORS.success}`,
              textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: '3rem', color: COLORS.success, mb: 1 }} />
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.success, mb: 1 }}>
                Certificate Sent!
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 2 }}>
                The certificate has been marked as sent to the customer.
              </Typography>
              {sentData && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: COLORS.background.white, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    Sent At
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {formatDate(sentData.sent_at)}
                  </Typography>
                </Box>
              )}
            </Paper>

            {email && (
              <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}>
                <Typography sx={{ fontSize: '0.7rem' }}>
                  A notification has been recorded for {email}.
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
          <SendIcon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Mark Certificate as Sent
          </Typography>
          {certNumber && (
            <Chip 
              label={certNumber} 
              size="small" 
              sx={{ 
                fontSize: '0.65rem', 
                height: 22, 
                bgcolor: COLORS.primaryLight, 
                color: COLORS.primary,
                ml: 1,
                fontFamily: 'monospace'
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
              Loading certificate details...
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

            {success && activeStep !== 2 && (
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
        {activeStep !== 2 ? (
          <>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || loading || fetching}
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

              {activeStep === STEPS.length - 2 ? (
                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={loading || fetching}
                  startIcon={loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <SendIcon sx={{ fontSize: '1rem' }} />}
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
                  {loading ? 'Processing...' : 'Mark as Sent'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading || fetching}
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
          </>
        ) : (
          <Button
            variant="contained"
            onClick={handleClose}
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
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SendQualityCert;