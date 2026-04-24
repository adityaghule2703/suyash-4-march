// DownloadQualityCert.jsx
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
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  LocalShipping as LocalShippingIcon,
  Visibility as VisibilityIcon,
  QrCode as QrCodeIcon,
  Refresh as RefreshIcon
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
  'Download & Review',
  'Complete'
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

const DownloadQualityCert = ({ open, onClose, certId, certNumber, onDownloadComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [regenerating, setRegenerating] = useState(false);
  
  const [certificate, setCertificate] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [referenceDetails, setReferenceDetails] = useState({
    so_number: null,
    wo_number: null,
    dc_number: null
  });

  useEffect(() => {
    if (open && certId) {
      fetchCertificateDetails();
    }
  }, [open, certId]);

  const fetchCertificateDetails = async () => {
    setFetching(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/quality-certificates/${certId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCertificate(response.data.data);
        await fetchReferenceDetails(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching certificate details:', err);
      setError('Failed to load certificate details');
    } finally {
      setFetching(false);
    }
  };

  const fetchReferenceDetails = async (cert) => {
    const token = localStorage.getItem('token');
    const details = { so_number: null, wo_number: null, dc_number: null };

    // Fetch SO details
    if (cert.so_id && typeof cert.so_id === 'string' && cert.so_id.length === 24) {
      try {
        const response = await axios.get(`${BASE_URL}/api/sales-orders/${cert.so_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          details.so_number = response.data.data.so_number;
        }
      } catch (err) {
        console.error('Error fetching SO details:', err);
      }
    } else if (cert.so_id && cert.so_id.so_number) {
      details.so_number = cert.so_id.so_number;
    }

    // Fetch WO details
    if (cert.wo_id && typeof cert.wo_id === 'string' && cert.wo_id.length === 24) {
      try {
        const response = await axios.get(`${BASE_URL}/api/work-orders/${cert.wo_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          details.wo_number = response.data.data.wo_number;
        }
      } catch (err) {
        console.error('Error fetching WO details:', err);
      }
    } else if (cert.wo_id && cert.wo_id.wo_number) {
      details.wo_number = cert.wo_id.wo_number;
    }

    // Fetch DC details
    if (cert.dc_id && typeof cert.dc_id === 'string' && cert.dc_id.length === 24) {
      try {
        const response = await axios.get(`${BASE_URL}/api/delivery-challans/${cert.dc_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          details.dc_number = response.data.data.dc_number;
        }
      } catch (err) {
        console.error('Error fetching DC details:', err);
      }
    } else if (cert.dc_id && cert.dc_id.dc_number) {
      details.dc_number = cert.dc_id.dc_number;
    }

    setReferenceDetails(details);
  };

  const handleRetry = () => {
    setError('');
    fetchCertificateDetails();
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      // Call API to regenerate certificate
      const response = await axios.post(
        `${BASE_URL}/api/quality-certificates/${certId}/regenerate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        // Refresh certificate details
        await fetchCertificateDetails();
        setSuccess('Certificate regenerated successfully! You can now download it.');
      } else {
        setError(response.data.message || 'Failed to regenerate certificate');
      }
    } catch (err) {
      console.error('Error regenerating certificate:', err);
      setError(err.response?.data?.message || 'Failed to regenerate certificate');
    } finally {
      setRegenerating(false);
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

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadProgress(0);
    setError('');
    
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${BASE_URL}/api/quality-certificates/${certId}/download`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/pdf'
          },
          responseType: 'blob'
        }
      );
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      
      // Check if response is actually a PDF (not an error HTML)
      if (response.data.type === 'application/json' || 
          (response.data.size < 100 && response.data.type !== 'application/pdf')) {
        // Try to parse as JSON to get error message
        const text = await response.data.text();
        try {
          const errorJson = JSON.parse(text);
          throw new Error(errorJson.message || 'File not found');
        } catch {
          throw new Error('Certificate file not found');
        }
      }
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificate?.cert_id || 'certificate'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess('Certificate downloaded successfully!');
      if (onDownloadComplete) {
        onDownloadComplete({ cert_id: certificate?.cert_id, downloaded_at: new Date().toISOString() });
      }
      
      setTimeout(() => {
        setActiveStep(2);
      }, 1000);
      
    } catch (err) {
      console.error('Error downloading certificate:', err);
      const errorMessage = err.message || 'Failed to download certificate';
      setError(errorMessage);
      clearInterval(progressInterval);
      setDownloadProgress(0);
    } finally {
      setDownloading(false);
    }
  };

  const handleView = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    } else if (certificate?.certificate_path) {
      window.open(`${BASE_URL}${certificate.certificate_path}`, '_blank');
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setError('');
    setSuccess('');
    setDownloadProgress(0);
    setDownloadUrl(null);
    setCertificate(null);
    setReferenceDetails({ so_number: null, wo_number: null, dc_number: null });
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFileSize = () => {
    return '~250 KB';
  };

  const renderStepContent = (step) => {
    if (!certificate && step !== 2 && !error) {
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
                <DownloadIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Download Quality Certificate
              </Typography>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary 
              }}>
                Download the quality certificate as a PDF document. The certificate contains all 
                inspection results and conformance statements.
              </Typography>
            </Paper>

            {error && (
              <Alert 
                severity="error" 
                sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
                action={
                  <Stack direction="row" spacing={1}>
                    <Button color="inherit" size="small" onClick={handleRetry} startIcon={<RefreshIcon />}>
                      Retry
                    </Button>
                    <Button color="inherit" size="small" onClick={handleRegenerate} disabled={regenerating}>
                      {regenerating ? 'Regenerating...' : 'Regenerate'}
                    </Button>
                  </Stack>
                }
              >
                <Typography sx={{ fontSize: '0.7rem' }}>{error}</Typography>
              </Alert>
            )}

            {!error && certificate && (
              <>
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
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Issue Date</Typography>
                        <Typography sx={{ fontSize: '0.75rem' }}>{formatDate(certificate.issue_date)}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>File Size</Typography>
                        <Typography sx={{ fontSize: '0.75rem' }}>{getFileSize()}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Part Number</Typography>
                        <Typography sx={{ fontSize: '0.75rem' }}>{certificate.part_no || '-'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Lot/Batch Number</Typography>
                        <Typography sx={{ fontSize: '0.75rem' }}>{certificate.lot_no || '-'}</Typography>
                      </Grid>
                    </Grid>

                    {/* Reference Documents */}
                    {(referenceDetails.so_number || referenceDetails.wo_number || referenceDetails.dc_number || certificate.customer_po_number) && (
                      <>
                        <Divider sx={{ my: 1.5 }} />
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {referenceDetails.so_number && (
                            <Box>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                <BusinessIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Sales Order
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem' }}>
                                {referenceDetails.so_number}
                              </Typography>
                            </Box>
                          )}
                          {referenceDetails.wo_number && (
                            <Box>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                <QrCodeIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Work Order
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem' }}>
                                {referenceDetails.wo_number}
                              </Typography>
                            </Box>
                          )}
                          {referenceDetails.dc_number && (
                            <Box>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                <LocalShippingIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Delivery Challan
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem' }}>
                                {referenceDetails.dc_number}
                              </Typography>
                            </Box>
                          )}
                          {certificate.customer_po_number && (
                            <Box>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                <DescriptionIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle' }} />
                                Customer PO
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem' }}>
                                {certificate.customer_po_number}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Document Info */}
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
                    Document Information
                  </Typography>
                  
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                        <DescriptionIcon sx={{ fontSize: '1.2rem', color: COLORS.primary, mb: 0.5 }} />
                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Format</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>PDF Document</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                        <CheckCircleIcon sx={{ fontSize: '1.2rem', color: COLORS.success, mb: 0.5 }} />
                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Signed</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>Digitally Signed</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 1, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                        <PersonIcon sx={{ fontSize: '1.2rem', color: COLORS.info, mb: 0.5 }} />
                        <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>Generated By</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {certificate.created_by?.Username || certificate.created_by?.name || 'System'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}>
                  <Typography sx={{ fontSize: '0.7rem' }}>
                    The certificate is generated in PDF format and can be saved or printed for records.
                  </Typography>
                </Alert>
              </>
            )}
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ 
              p: 2.5, 
              bgcolor: COLORS.background.light, 
              borderRadius: 2, 
              border: `1px solid ${COLORS.border}`,
              textAlign: 'center'
            }}>
              <PdfIcon sx={{ fontSize: '3rem', color: COLORS.error, mb: 1 }} />
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary, mb: 0.5 }}>
                {certificate?.cert_id}.pdf
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 2 }}>
                Quality Certificate Document
              </Typography>
              
              {downloading && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={downloadProgress} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: COLORS.background.white,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: COLORS.primary
                      }
                    }} 
                  />
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                    Downloading... {downloadProgress}%
                  </Typography>
                </Box>
              )}
              
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
                  onClick={handleDownload}
                  disabled={downloading}
                  sx={{
                    height: 36,
                    px: 3,
                    borderRadius: 1.5,
                    bgcolor: COLORS.primary,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    '&:hover': { bgcolor: COLORS.primaryDark }
                  }}
                >
                  {downloading ? 'Downloading...' : 'Download PDF'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={handleView}
                  disabled={!downloadUrl && !certificate?.certificate_path}
                  sx={{
                    height: 36,
                    px: 3,
                    borderRadius: 1.5,
                    borderColor: COLORS.border,
                    color: COLORS.text.secondary,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: COLORS.primary,
                      bgcolor: `${COLORS.primary}10`
                    }
                  }}
                >
                  View PDF
                </Button>
              </Stack>
            </Paper>

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
                <InfoIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                Download Information
              </Typography>
              
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: '0.8rem', color: COLORS.success }} />
                  <Typography sx={{ fontSize: '0.7rem' }}>Securely generated PDF document</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: '0.8rem', color: COLORS.success }} />
                  <Typography sx={{ fontSize: '0.7rem' }}>Digitally signed for authenticity</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: '0.8rem', color: COLORS.success }} />
                  <Typography sx={{ fontSize: '0.7rem' }}>Ready for customer submission</Typography>
                </Box>
              </Stack>
            </Paper>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}>
                {success}
              </Alert>
            )}
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
                Download Complete!
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 2 }}>
                The certificate has been downloaded successfully.
              </Typography>
              
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={handleView}
                  sx={{
                    height: 36,
                    px: 2,
                    borderRadius: 1.5,
                    borderColor: COLORS.primary,
                    color: COLORS.primary,
                    fontSize: '0.7rem',
                    textTransform: 'none'
                  }}
                >
                  View Downloaded PDF
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  sx={{
                    height: 36,
                    px: 2,
                    borderRadius: 1.5,
                    borderColor: COLORS.primary,
                    color: COLORS.primary,
                    fontSize: '0.7rem',
                    textTransform: 'none'
                  }}
                >
                  Download Again
                </Button>
              </Stack>
            </Paper>

            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}>
              <Typography sx={{ fontSize: '0.7rem' }}>
                The PDF has been saved to your downloads folder. You can also view it directly in the browser.
              </Typography>
            </Alert>
          </Stack>
        );

      default:
        return null;
    }
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
          <DownloadIcon sx={{ fontSize: '1.1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Download Certificate
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
          disabled={downloading}
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
          renderStepContent(activeStep)
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
              disabled={activeStep === 0 || downloading}
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
                disabled={downloading}
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
                  onClick={handleDownload}
                  disabled={downloading || !!error}
                  startIcon={downloading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <DownloadIcon sx={{ fontSize: '1rem' }} />}
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
                  {downloading ? 'Downloading...' : 'Download'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={fetching || !!error}
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
            fullWidth
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

export default DownloadQualityCert;