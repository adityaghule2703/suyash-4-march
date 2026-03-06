import React, { useState, useEffect } from 'react';
import {
  // Layout components
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Paper,
  Stack,
  Typography,
  Grid,
  Box,
  Divider,
  Alert,
  // Form components
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  ButtonGroup,
  // Feedback components
  CircularProgress,
  Snackbar,
  // Buttons and actions
  Button,
  IconButton,
  // Surfaces
  styled,
  FormHelperText,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

// 🔥 Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom Step Icon with better styling
const StepIcon = ({ active, completed, icon }) => {
  const getIcon = () => {
    if (icon === 1) return <AssignmentIcon fontSize="small" />;
    if (icon === 2) return <DescriptionIcon fontSize="small" />;
    if (icon === 3) return <AttachMoneyIcon fontSize="small" />;
    if (icon === 4) return <ThumbUpIcon fontSize="small" />;
    return icon;
  };

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: completed || active ? '#1976D2' : '#E0E0E0',
        color: completed || active ? 'white' : '#9E9E9E',
        transition: 'all 0.2s ease',
        boxShadow: active ? '0 0 0 3px rgba(25, 118, 210, 0.2)' : 'none',
        '& svg': {
          fontSize: 18
        }
      }}
    >
      {completed ? <CheckCircleIcon fontSize="small" /> : getIcon()}
    </Box>
  );
};

const steps = ['Offer Details', 'Summary', 'CTC', 'Decision'];

const ApproveOffer = ({ open, onClose, onComplete, candidate = null }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [comments, setComments] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [signature, setSignature] = useState(null);
  const [signatureName, setSignatureName] = useState('');
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [action, setAction] = useState(null);
  
  // Separate loading states
  const [isFetchingOffer, setIsFetchingOffer] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stepErrors, setStepErrors] = useState({});

  const getAuthToken = () => localStorage.getItem('token') || sessionStorage.getItem('token') || '';

  // Fetch the latest offer for the candidate when dialog opens
  useEffect(() => {
    if (open && candidate) {
      console.log('ApproveOffer opened for candidate:', candidate);
      resetState();
      fetchLatestOffer(candidate);
    }
  }, [open, candidate]);

  const resetState = () => {
    setActiveStep(0);
    setComments('');
    setRejectReason('');
    setSignature(null);
    setSignatureName('');
    setConfirmApprove(false);
    setSelectedOffer(null);
    setAction(null);
    setError('');
    setStepErrors({});
  };

  const fetchLatestOffer = async (candidateData) => {
    setIsFetchingOffer(true);
    setError('');
    
    try {
      const token = getAuthToken();
      const candidateId = candidateData.id || candidateData._id || candidateData.candidateId;
      
      console.log('Fetching latest offer for candidate:', candidateId);
      
      // First, get candidate details
      const candidateResponse = await axios.get(`${BASE_URL}/api/candidates?_id=${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (candidateResponse.data.success && candidateResponse.data.data.length > 0) {
        const candidateDetails = candidateResponse.data.data[0];
        setCandidateInfo(candidateDetails);
        console.log('Candidate details:', candidateDetails);
      }
      
      // Fetch all offers for this candidate
      const offersResponse = await axios.get(`${BASE_URL}/api/offers?candidateId=${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Offers response:', offersResponse.data);
      
      if (offersResponse.data.success) {
        let offersArray = [];
        
        // Extract offers array based on response structure
        if (offersResponse.data.data?.offers) {
          offersArray = offersResponse.data.data.offers;
        } else if (Array.isArray(offersResponse.data.data)) {
          offersArray = offersResponse.data.data;
        }
        
        console.log('All offers:', offersArray);
        
        // Filter for offers that are pending approval
        const pendingOffers = offersArray.filter(offer => {
          const status = (offer.status || '').toLowerCase();
          return status === 'pending_approval' || status === 'submitted';
        });
        
        console.log('Pending offers:', pendingOffers);
        
        if (pendingOffers.length > 0) {
          // Sort by creation date (newest first)
          const sortedOffers = pendingOffers.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.createdDate || 0);
            const dateB = new Date(b.createdAt || b.createdDate || 0);
            return dateB - dateA;
          });
          
          // Set the latest offer
          setSelectedOffer(sortedOffers[0]);
          console.log('Latest offer selected:', sortedOffers[0]);
        } else {
          setError('No pending offers found for this candidate');
        }
      } else {
        setError('Failed to fetch offers');
      }
    } catch (err) {
      console.error('Error fetching offer:', err);
      setError('Error fetching offer details');
    } finally {
      setIsFetchingOffer(false);
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setError('');
    } else {
      setError('Please complete all required fields');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const handleClose = () => {
    resetState();
    setIsApproving(false);
    setIsRejecting(false);
    setSnackbar({ ...snackbar, open: false });
    onClose();
  };

  // Handle signature upload
  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSignatureName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setSignature(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    setSignature(null);
    setSignatureName('');
  };

  // Validate current step
  const validateStep = (step) => {
    const errors = {};

    if (step === 0) {
      if (!selectedOffer) {
        errors.offer = 'No offer available';
      }
    } else if (step === 3) {
      if (action === 'approve') {
        if (!comments.trim()) {
          errors.comments = 'Please add approval comments';
        }
        if (!signature) {
          errors.signature = 'Please upload your signature';
        }
        if (!confirmApprove) {
          errors.confirmApprove = 'Please confirm before approving';
        }
      } else if (action === 'reject') {
        if (!rejectReason.trim()) {
          errors.rejectReason = 'Please provide a rejection reason';
        }
      } else {
        errors.action = 'Please select Approve or Reject';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApprove = async () => {
    if (!selectedOffer) return;
    
    if (!validateStep(3)) {
      setError('Please complete all required fields');
      return;
    }

    setIsApproving(true);
    setError('');

    try {
      const token = getAuthToken();
      const offerId = selectedOffer._id || selectedOffer.id;
      
      const response = await axios.post(
        `${BASE_URL}/api/offers/${offerId}/approve`,
        {
          comments: comments.trim(),
          signature: `data:image/png;base64,${signature}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        console.log('Approve API Response:', response.data);
        
        setSnackbar({ 
          open: true, 
          message: response.data.message || '✅ Offer approved successfully!', 
          severity: 'success' 
        });
        
        // Prepare updated data for parent component
        const updatedData = {
          id: candidate?.id || candidate?._id || selectedOffer.candidateId,
          candidateId: candidate?.id || candidate?._id || selectedOffer.candidateId,
          offerId: selectedOffer.offerId || offerId,
          status: response.data.data?.status || 'approved',
          applicationStatus: response.data.data?.status || 'approved',
          approvalStatus: response.data.data?.approvalStatus,
          action: 'approved'
        };

        console.log('Sending to parent:', updatedData);

        setTimeout(() => {
          setIsApproving(false);
          if (onComplete) onComplete(updatedData);
          handleClose();
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Failed to approve');
      }
    } catch (err) {
      setIsApproving(false);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to approve offer';
      setError(errorMsg);
      setSnackbar({ open: true, message: `${errorMsg}`, severity: 'error' });
    }
  };
  
  const handleReject = async () => {
    if (!selectedOffer) return;
    
    if (!validateStep(3)) {
      setError('Please complete all required fields');
      return;
    }

    setIsRejecting(true);
    setError('');

    try {
      const token = getAuthToken();
      const offerId = selectedOffer._id || selectedOffer.id;
      
      const response = await axios.post(
        `${BASE_URL}/api/offers/${offerId}/reject`,
        { reason: rejectReason.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        console.log('Reject API Response:', response.data);
        
        setSnackbar({ 
          open: true, 
          message: response.data.message || '✅ Offer rejected successfully!', 
          severity: 'success' 
        });
        
        const updatedData = {
          id: candidate?.id || candidate?._id || selectedOffer.candidateId,
          candidateId: candidate?.id || candidate?._id || selectedOffer.candidateId,
          offerId: selectedOffer.offerId || offerId,
          status: 'rejected',
          applicationStatus: 'rejected',
          action: 'rejected'
        };

        setTimeout(() => {
          setIsRejecting(false);
          if (onComplete) onComplete(updatedData);
          handleClose();
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Failed to reject');
      }
    } catch (err) {
      setIsRejecting(false);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to reject offer';
      setError(errorMsg);
      setSnackbar({ open: true, message: `${errorMsg}`, severity: 'error' });
    }
  };

  const getCandidateName = () => {
    if (candidateInfo?.name) return candidateInfo.name;
    if (candidateInfo?.firstName) {
      return `${candidateInfo.firstName} ${candidateInfo.lastName || ''}`.trim();
    }
    if (selectedOffer?.candidate?.name) return selectedOffer.candidate.name;
    if (selectedOffer?.candidate?.firstName) {
      return `${selectedOffer.candidate.firstName} ${selectedOffer.candidate.lastName || ''}`.trim();
    }
    return candidate?.name || 'Unknown';
  };

  const getCandidateEmail = () => {
    if (candidateInfo?.email) return candidateInfo.email;
    if (selectedOffer?.candidate?.email) return selectedOffer.candidate.email;
    return candidate?.email || '';
  };

  const getCandidatePhone = () => {
    if (candidateInfo?.phone) return candidateInfo.phone;
    if (candidateInfo?.mobile) return candidateInfo.mobile;
    if (selectedOffer?.candidate?.phone) return selectedOffer.candidate.phone;
    return candidate?.phone || '';
  };

  const getPosition = () => {
    if (!selectedOffer) return 'N/A';
    return selectedOffer.job?.title || 
           selectedOffer.offerDetails?.designation || 
           selectedOffer.position || 
           'N/A';
  };

  const getJoiningDate = () => {
    if (!selectedOffer) return null;
    return selectedOffer.offerDetails?.joiningDate || 
           selectedOffer.joiningDate || 
           null;
  };

  const getReportingTo = () => {
    if (!selectedOffer) return 'Not Specified';
    return selectedOffer.offerDetails?.reportingTo || 
           selectedOffer.reportingTo || 
           'Not Specified';
  };

  const getProbationPeriod = () => {
    if (!selectedOffer) return 6;
    return selectedOffer.offerDetails?.probationPeriod || 
           selectedOffer.probationPeriod || 
           6;
  };

  const getCtcDetails = () => {
    if (!selectedOffer) return null;
    return selectedOffer.ctcDetails || null;
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const isLoading = isApproving || isRejecting || isFetchingOffer;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1.5,
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #E0E0E0', 
        py: 1.5, 
        px: 2, 
        bgcolor: '#F8FAFC',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="subtitle1" fontWeight={600}>Approve/Reject Offer</Typography>
        <IconButton onClick={handleClose} size="small" disabled={isLoading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 2, pt: 1, backgroundColor: '#F8FAFC' }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel 
          connector={<ColorConnector />} 
          sx={{ mb: 1 }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={StepIcon}>
                <Typography fontSize="0.8rem">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2, bgcolor: '#F5F7FA', overflow: 'auto' }}>
        {isFetchingOffer ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={40} />
          </Box>
        ) : !selectedOffer ? (
          <Alert severity="warning" sx={{ borderRadius: 1 }}>
            No pending offers found for this candidate
          </Alert>
        ) : (
          <>
            {/* Step 0: Offer Details - Read Only */}
            {activeStep === 0 && (
              <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LockIcon fontSize="small" sx={{ color: '#1976D2' }} />
                  <Typography variant="subtitle2" sx={{ color: '#1976D2', fontWeight: 600, fontSize: '0.9rem' }}>
                    Offer Details (Read Only)
                  </Typography>
                </Box>
                
                {/* Candidate Info */}
                <Box sx={{ 
                  mb: 2, 
                  p: 1.5, 
                  bgcolor: '#F0F7FF', 
                  borderRadius: 1,
                  border: '1px solid #1976D2'
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" fontWeight={600}>
                        {getCandidateName()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {getCandidateEmail()} {getCandidatePhone() && ` | ${getCandidatePhone()}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Offer Information */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Offer ID</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedOffer.offerId || selectedOffer._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Status</Typography>
                    <Chip 
                      label={selectedOffer.status || 'Pending Approval'} 
                      size="small" 
                      color="warning"
                      sx={{ fontWeight: 500 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Position</Typography>
                    <Typography variant="body2">{getPosition()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Department</Typography>
                    <Typography variant="body2">{selectedOffer.job?.department || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Joining Date</Typography>
                    <Typography variant="body2">{formatDate(getJoiningDate())}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Reporting To</Typography>
                    <Typography variant="body2">{getReportingTo()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Probation Period</Typography>
                    <Typography variant="body2">{getProbationPeriod()} months</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Location</Typography>
                    <Typography variant="body2">{selectedOffer.job?.location || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Step 1: Summary */}
            {activeStep === 1 && selectedOffer && (
              <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                  Offer Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" fontWeight={600}>{getCandidateName()}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {getCandidateEmail() || 'No email'} | {getCandidatePhone() || 'No phone'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Position</Typography>
                    <Typography variant="body2">{getPosition()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Department</Typography>
                    <Typography variant="body2">{selectedOffer.job?.department || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Joining Date</Typography>
                    <Typography variant="body2">{formatDate(getJoiningDate())}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Reporting To</Typography>
                    <Typography variant="body2">{getReportingTo()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Probation Period</Typography>
                    <Typography variant="body2">{getProbationPeriod()} months</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Location</Typography>
                    <Typography variant="body2">{selectedOffer.job?.location || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Step 2: CTC */}
            {activeStep === 2 && selectedOffer && (
              <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                  Annual CTC Breakdown
                </Typography>
                
                {selectedOffer.ctcDetails ? (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="textSecondary" display="block">Basic + DA</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatCurrency(selectedOffer.ctcDetails.basic * 12)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="textSecondary" display="block">HRA</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.hra * 12)}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="textSecondary" display="block">Conveyance</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.conveyanceAllowance * 12)}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="textSecondary" display="block">Medical</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.medicalAllowance * 12)}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="textSecondary" display="block">Special Allowance</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.specialAllowance * 12)}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="textSecondary" display="block">Bonus</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.bonus)}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" color="#1976D2">Total CTC (Annual)</Typography>
                          <Typography variant="h6" color="#1976D2" fontWeight={700}>
                            {formatCurrency(selectedOffer.ctcDetails.totalCtc)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 1 }}>CTC details not available</Alert>
                )}
              </Paper>
            )}

            {/* Step 3: Decision */}
            {activeStep === 3 && (
              <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                  Make Decision
                </Typography>

                <ButtonGroup fullWidth sx={{ mb: 3 }}>
                  <Button
                    variant={action === 'approve' ? 'contained' : 'outlined'}
                    color="success"
                    onClick={() => {
                      setAction('approve');
                      setError('');
                      setStepErrors({});
                    }}
                    startIcon={<ThumbUpIcon />}
                    disabled={isLoading}
                  >
                    Approve
                  </Button>
                  <Button
                    variant={action === 'reject' ? 'contained' : 'outlined'}
                    color="error"
                    onClick={() => {
                      setAction('reject');
                      setError('');
                      setStepErrors({});
                    }}
                    startIcon={<ThumbDownIcon />}
                    disabled={isLoading}
                  >
                    Reject
                  </Button>
                </ButtonGroup>

                {action === 'approve' && (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem', mb: 1 }}>
                      Approval Comments *
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Add your approval comments (e.g., Salary is within budget, All documents verified, etc.)"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      size="small"
                      error={!!stepErrors.comments}
                      helperText={stepErrors.comments}
                      disabled={isLoading}
                      sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1, fontSize: '0.85rem' } }}
                    />

                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem', mb: 1 }}>
                      Digital Signature *
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      {!signature ? (
                        <Box
                          sx={{
                            textAlign: 'center',
                            cursor: isLoading ? 'default' : 'pointer',
                          }}
                          component="label"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSignatureUpload}
                            style={{ display: 'none' }}
                            disabled={isLoading}
                          />
                          <Typography variant="body2" color="textSecondary">
                            Click to upload signature image
                          </Typography>
                          <Typography variant="caption" color="textSecondary" display="block">
                            Supported formats: PNG, JPG, JPEG
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{
                          p: 1.5,
                          bgcolor: '#F0F7FF',
                          borderRadius: 1,
                          border: '1px solid #1976D2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                            <Typography variant="body2">{signatureName}</Typography>
                          </Box>
                          <Button
                            size="small"
                            color="error"
                            onClick={clearSignature}
                            disabled={isLoading}
                            sx={{ textTransform: 'none' }}
                          >
                            Remove
                          </Button>
                        </Box>
                      )}
                      {stepErrors.signature && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                          {stepErrors.signature}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{
                      p: 1.5,
                      bgcolor: '#FFF4E5',
                      borderRadius: 1,
                      border: '1px solid #FFB74D',
                      mb: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <WarningIcon sx={{ color: '#F57C00', fontSize: 18 }} />
                        <Typography variant="subtitle2" sx={{ color: '#F57C00', fontSize: '0.85rem' }}>
                          Approval Notice
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        By approving this offer, you are authorizing the release of this offer letter to the candidate.
                        This action will trigger the offer generation process and cannot be undone.
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <input
                        type="checkbox"
                        id="confirmApprove"
                        checked={confirmApprove}
                        onChange={(e) => setConfirmApprove(e.target.checked)}
                        disabled={isLoading}
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                      />
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        I confirm that I have reviewed all details and approve this offer.
                      </Typography>
                    </Box>
                    {stepErrors.confirmApprove && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {stepErrors.confirmApprove}
                      </Typography>
                    )}
                  </>
                )}

                {action === 'reject' && (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem', mb: 1 }}>
                      Rejection Reason *
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Please provide reason for rejection"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      size="small"
                      error={!!stepErrors.rejectReason}
                      helperText={stepErrors.rejectReason}
                      disabled={isLoading}
                      sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </>
                )}

                {action === null && (
                  <Alert severity="info" sx={{ borderRadius: 1 }}>
                    Please select Approve or Reject to continue
                  </Alert>
                )}

                {/* Preview Section for Approve */}
                {action === 'approve' && selectedOffer && (
                  <Paper sx={{ p: 2, mt: 2, bgcolor: '#F8FAFC', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                    <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                      Approval Preview
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary" display="block">Candidate</Typography>
                        <Typography variant="body2" fontWeight={500}>{getCandidateName()}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary" display="block">Offer ID</Typography>
                        <Typography variant="body2">{selectedOffer?.offerId || selectedOffer?._id}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary" display="block">Total CTC</Typography>
                        <Typography variant="body2" fontWeight={600} color="#1976D2">
                          {selectedOffer.ctcDetails ? formatCurrency(selectedOffer.ctcDetails.totalCtc) : 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary" display="block">Comments</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {comments || 'No comments added'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                )}
              </Paper>
            )}
          </>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 2, 
        borderTop: '1px solid #E0E0E0', 
        bgcolor: '#F8FAFC', 
        justifyContent: 'space-between' 
      }}>
        {selectedOffer && !isFetchingOffer ? (
          <>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || isLoading}
              startIcon={<NavigateBeforeIcon />}
              size="small"
              sx={{ color: '#666' }}
            >
              Back
            </Button>
            <Box>
              <Button 
                onClick={handleClose} 
                disabled={isLoading} 
                size="small"
                sx={{ mr: 1, color: '#666' }}
              >
                Cancel
              </Button>
              {activeStep === steps.length - 1 ? (
                <>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleReject}
                    disabled={!action || action !== 'reject' || !rejectReason.trim() || isLoading}
                    size="small"
                    startIcon={isRejecting ? <CircularProgress size={16} color="inherit" /> : <ThumbDownIcon />}
                    sx={{ mr: 1, minWidth: 100 }}
                  >
                    {isRejecting ? 'Rejecting...' : 'Reject'}
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleApprove}
                    disabled={!action || action !== 'approve' || !comments.trim() || !signature || !confirmApprove || isLoading}
                    size="small"
                    startIcon={isApproving ? <CircularProgress size={16} color="inherit" /> : <ThumbUpIcon />}
                    sx={{ 
                      minWidth: 100,
                      backgroundColor: '#4CAF50',
                      '&:hover': { backgroundColor: '#45a049' }
                    }}
                  >
                    {isApproving ? 'Approving...' : 'Approve'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selectedOffer || isLoading}
                  endIcon={<NavigateNextIcon />}
                  size="small"
                  sx={{
                    backgroundColor: '#1976D2',
                    '&:hover': { backgroundColor: '#1565C0' }
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button 
              onClick={handleClose} 
              size="small"
              sx={{ color: '#666' }}
            >
              Close
            </Button>
          </Box>
        )}
      </DialogActions>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ 
            borderRadius: 1,
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ApproveOffer;