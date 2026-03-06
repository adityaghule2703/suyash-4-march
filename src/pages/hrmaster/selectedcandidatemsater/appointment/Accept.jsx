import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Grid,
  Box,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Verified as VerifiedIcon,
  Pending as PendingIcon,
  ThumbUp as ThumbUpIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import { useParams, useNavigate } from 'react-router-dom';

// Color constants
const PRIMARY_BLUE = '#00B4D8';
const SUCCESS_COLOR = '#2E7D32';
const WARNING_COLOR = '#ED6C02';
const INFO_COLOR = '#0288D1';

const AcceptAppointmentLetter = ({ open, onClose, documentId: propDocumentId, onAccept }) => {
  const { documentId: paramDocumentId } = useParams();
  const navigate = useNavigate();
  
  // Use documentId from props or URL params
  const documentId = propDocumentId || paramDocumentId;
  
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [letterData, setLetterData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch appointment letter details on mount
  useEffect(() => {
    if (documentId && (open || paramDocumentId)) {
      fetchAppointmentLetter();
    }
  }, [documentId, open, paramDocumentId]);

  // Fetch appointment letter details
  const fetchAppointmentLetter = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${BASE_URL}/api/appointment-letter/${documentId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      console.log('Appointment letter response:', response.data);

      if (response.data.success) {
        setLetterData(response.data.data);
        
        // Set active step based on status
        if (response.data.data.status === 'accepted') {
          setActiveStep(2);
        } else if (response.data.data.status === 'rejected') {
          setActiveStep(3);
        } else {
          setActiveStep(1);
        }
      } else {
        setError('Failed to fetch appointment letter details');
      }
    } catch (err) {
      console.error('Error fetching appointment letter:', err);
      setError(err.response?.data?.message || 'Failed to fetch appointment letter details');
    } finally {
      setLoading(false);
    }
  };

  // Handle accept appointment letter
  const handleAccept = async () => {
    setAccepting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${BASE_URL}/api/appointment-letter/accept/${documentId}`,
        {},
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Accept response:', response.data);

      if (response.data.success) {
        setLetterData(response.data.data);
        setSuccess(response.data.message || 'Appointment letter accepted successfully!');
        setActiveStep(2);
        
        if (onAccept) {
          onAccept(response.data.data);
        }

        // If this is a modal, don't navigate
        if (!propDocumentId && paramDocumentId) {
          // Update URL state without navigation
          navigate(`/appointment-letter/accept/${documentId}`, { 
            state: { accepted: true },
            replace: true 
          });
        }
      } else {
        throw new Error(response.data.message || 'Failed to accept appointment letter');
      }
    } catch (err) {
      console.error('Error accepting appointment letter:', err);
      setError(err.response?.data?.message || err.message || 'Failed to accept appointment letter');
    } finally {
      setAccepting(false);
    }
  };

  // Handle reject appointment letter
  const handleReject = async () => {
    // You can implement rejection logic here if needed
    setActiveStep(3);
  };

  // Handle download letter
  const handleDownload = () => {
    if (letterData?.fileUrl) {
      const fileUrl = letterData.fileUrl.startsWith('http')
        ? letterData.fileUrl
        : `${BASE_URL}${letterData.fileUrl}`;
      window.open(fileUrl, '_blank');
    }
  };

  // Handle preview
  const handlePreview = () => {
    setShowPreview(true);
  };

  // Handle close
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      case 'generated':
        return 'info';
      default:
        return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return <CheckCircleIcon />;
      case 'rejected':
        return <CancelIcon />;
      case 'pending':
        return <PendingIcon />;
      case 'generated':
        return <InfoIcon />;
      default:
        return <InfoIcon />;
    }
  };

  // Steps for the acceptance process
  const steps = [
    {
      label: 'Appointment Letter Generated',
      description: 'The appointment letter has been generated and is ready for your review.'
    },
    {
      label: 'Review & Accept',
      description: 'Please review the appointment letter carefully before accepting.'
    },
    {
      label: 'Acceptance Confirmed',
      description: 'You have successfully accepted the appointment letter.'
    },
    {
      label: 'Acceptance Rejected',
      description: 'You have rejected the appointment letter.'
    }
  ];

  // Render loading state
  if (loading) {
    return (
      <Dialog
        open={open !== undefined ? open : true}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={48} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading Appointment Letter...
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  // Main content
  const content = (
    <Box>
      {/* Header Section */}
      <Box sx={{ 
        bgcolor: '#F8FAFC', 
        p: 3, 
        borderBottom: '1px solid',
        borderColor: '#E0E0E0'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Appointment Letter Acceptance
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Document ID: {documentId}
            </Typography>
          </Box>
          {letterData?.status && (
            <Chip
              icon={getStatusIcon(letterData.status)}
              label={letterData.status.toUpperCase()}
              color={getStatusColor(letterData.status)}
              sx={{ 
                fontWeight: 600,
                px: 1,
                '& .MuiChip-icon': { fontSize: 18 }
              }}
            />
          )}
        </Box>
      </Box>

      {/* Stepper Section */}
      <Box sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === 2 && letterData?.acceptedAt ? (
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(letterData.acceptedAt)}
                    </Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="textSecondary">
                  {step.description}
                </Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Error/Success Messages */}
      {error && (
        <Box sx={{ px: 3, pb: 2 }}>
          <Alert 
            severity="error" 
            onClose={() => setError('')}
            sx={{ borderRadius: 2 }}
          >
            {error}
          </Alert>
        </Box>
      )}
      
      {success && (
        <Box sx={{ px: 3, pb: 2 }}>
          <Alert 
            severity="success" 
            onClose={() => setSuccess('')}
            sx={{ borderRadius: 2 }}
          >
            {success}
          </Alert>
        </Box>
      )}

      {/* Document Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Appointment Letter Preview</Typography>
            <IconButton onClick={() => setShowPreview(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ height: '70vh', p: 0 }}>
          {letterData?.fileUrl && (
            <iframe
              src={letterData.fileUrl.startsWith('http') 
                ? letterData.fileUrl 
                : `${BASE_URL}${letterData.fileUrl}`
              }
              title="Appointment Letter Preview"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
            sx={{
              background: 'linear-gradient(135deg, #164e63, #00B4D8)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
              }
            }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Details */}
      {letterData && (
        <Box sx={{ p: 3 }}>
          {/* Candidate Information Card */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color={PRIMARY_BLUE}>
              <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Candidate Information
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Full Name</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {letterData.candidateName || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Candidate ID</Typography>
                <Typography variant="body1">{letterData.candidateId || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Email Address</Typography>
                <Typography variant="body1">{letterData.candidateEmail || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Designation</Typography>
                <Typography variant="body1">{letterData.offerDesignation || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Document Information Card */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color={PRIMARY_BLUE}>
              <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Document Information
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Document ID</Typography>
                <Typography variant="body1">{letterData.documentId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">File Name</Typography>
                <Typography variant="body1">{letterData.fileName || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Generated At</Typography>
                <Typography variant="body1">{formatDate(letterData.generatedAt)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Joining Date</Typography>
                <Typography variant="body1" fontWeight={500} color={PRIMARY_BLUE}>
                  {letterData.joiningDate ? new Date(letterData.joiningDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </Typography>
              </Grid>
              {letterData.acceptedAt && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">Accepted At</Typography>
                  <Typography variant="body1">{formatDate(letterData.acceptedAt)}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Next Steps Card */}
          {letterData.nextStep && (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#E3F2FD' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: INFO_COLOR }}>
                  <InfoIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Next Step
                  </Typography>
                  <Typography variant="body2">
                    {letterData.nextStep}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Action Buttons */}
          {letterData.status === 'generated' && (
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handlePreview}
                startIcon={<VisibilityIcon />}
                sx={{
                  borderColor: PRIMARY_BLUE,
                  color: PRIMARY_BLUE,
                  '&:hover': {
                    borderColor: '#0096b4',
                    bgcolor: 'rgba(0, 180, 216, 0.04)'
                  }
                }}
              >
                Preview Document
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleDownload}
                startIcon={<DownloadIcon />}
                sx={{
                  borderColor: PRIMARY_BLUE,
                  color: PRIMARY_BLUE,
                  '&:hover': {
                    borderColor: '#0096b4',
                    bgcolor: 'rgba(0, 180, 216, 0.04)'
                  }
                }}
              >
                Download
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAccept}
                disabled={accepting}
                startIcon={accepting ? <CircularProgress size={20} /> : <ThumbUpIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #164e63, #00B4D8)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
                  },
                  '&.Mui-disabled': {
                    background: '#e0e0e0'
                  }
                }}
              >
                {accepting ? 'Accepting...' : 'Accept Appointment Letter'}
              </Button>
              {/* Uncomment if rejection is needed */}
              {/* <Button
                fullWidth
                variant="outlined"
                onClick={handleReject}
                color="error"
                startIcon={<CancelIcon />}
              >
                Reject
              </Button> */}
            </Box>
          )}

          {letterData.status === 'accepted' && (
            <Card sx={{ bgcolor: '#d1fae5', border: '1px solid', borderColor: 'success.main' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: SUCCESS_COLOR }}>
                    <CheckCircleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      Appointment Letter Accepted!
                    </Typography>
                    <Typography variant="body2">
                      You have successfully accepted the appointment letter on{' '}
                      {formatDate(letterData.acceptedAt)}.
                    </Typography>
                    {letterData.nextStep && (
                      <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                        {letterData.nextStep}
                      </Alert>
                    )}
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleDownload}
                  startIcon={<DownloadIcon />}
                  sx={{
                    borderColor: SUCCESS_COLOR,
                    color: SUCCESS_COLOR,
                    '&:hover': {
                      borderColor: '#1b5e20',
                      bgcolor: 'rgba(46, 125, 50, 0.04)'
                    }
                  }}
                >
                  Download Copy
                </Button>
              </CardActions>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );

  // If used as a modal
  if (open !== undefined) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            maxHeight: '90vh',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: 1,
          borderColor: '#E0E0E0',
          bgcolor: '#F8FAFC',
          px: 3,
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" fontWeight={600}>
            Accept Appointment Letter
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // If used as a page
  return (
    <Box sx={{ 
      maxWidth: 'md', 
      mx: 'auto', 
      my: 4, 
      bgcolor: 'white',
      borderRadius: 2,
      boxShadow: 3,
      overflow: 'hidden'
    }}>
      {content}
    </Box>
  );
};

export default AcceptAppointmentLetter;