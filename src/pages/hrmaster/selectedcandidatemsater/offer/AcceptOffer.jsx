import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  TextField,
  Divider,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Snackbar,
  Avatar,
  Checkbox
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Verified as VerifiedIcon,
  Assignment as AssignmentIcon,
  Check as AcceptIcon,
  ThumbUp as ThumbUpIcon,
  Info as InfoIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

// Modern Stepper Connector with Gradient
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

// Custom Step Icon
const StepIcon = ({ active, completed, icon }) => {
  const getIcon = () => {
    if (icon === 1) return <AssignmentIcon fontSize="small" />;
    if (icon === 2) return <ThumbUpIcon fontSize="small" />;
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

const steps = ['Accept Offer', 'Confirmation'];

const AcceptOffer = ({ open, onClose, onComplete, candidate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchingOffer, setFetchingOffer] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [acceptResult, setAcceptResult] = useState(null);
  
  // Form state
  const [signature, setSignature] = useState('');
  const [signatureType, setSignatureType] = useState('text');
  const [signatureFile, setSignatureFile] = useState(null);
  const [signatureFileName, setSignatureFileName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Offer data state
  const [offerDetails, setOfferDetails] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [offerFound, setOfferFound] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  };

  // Reset state when dialog opens with new candidate
  useEffect(() => {
    if (open && candidate) {
      console.log('🔵 AcceptOffer opened for candidate:', candidate);
      resetState();
      
      // Set candidate info from props
      setCandidateInfo(candidate);
      
      // Fetch the latest offer for this specific candidate
      fetchLatestOfferForCandidate(candidate);
    }
  }, [open, candidate]);

  const resetState = () => {
    setActiveStep(0);
    setError(null);
    setSuccess(false);
    setAcceptResult(null);
    setSignature('');
    setSignatureType('text');
    setSignatureFile(null);
    setSignatureFileName('');
    setTermsAccepted(false);
    setOfferDetails(null);
    setSelectedOffer(null);
    setOfferFound(false);
    setFetchingOffer(false);
    setAccepting(false);
  };

  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Fetch the latest offer for the candidate
  const fetchLatestOfferForCandidate = async (candidateData) => {
    if (!candidateData) {
      setError('No candidate data provided');
      showSnackbar('No candidate data provided', 'error');
      return;
    }

    setFetchingOffer(true);
    setError(null);

    try {
      const token = getAuthToken();
      const candidateId = candidateData.id || candidateData._id || candidateData.candidateId;
      
      console.log('🔵 Fetching offer for candidate ID:', candidateId);
      console.log('🔵 Candidate data:', candidateData);

      if (!candidateId) {
        throw new Error('Invalid candidate ID');
      }

      // Fetch offers specifically for this candidate
      console.log('🔵 Fetching offers for candidate ID:', candidateId);
      
      let offersArray = [];
      
      // Get offers with candidateId filter
      try {
        const offersResponse = await axios.get(`${BASE_URL}/api/offers?candidateId=${candidateId}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('🔵 Offers API Response:', offersResponse.data);
        
        if (offersResponse.data.success) {
          if (offersResponse.data.data?.offers) {
            offersArray = offersResponse.data.data.offers;
          } else if (Array.isArray(offersResponse.data.data)) {
            offersArray = offersResponse.data.data;
          }
        }
      } catch (err) {
        console.log('🔵 Failed to fetch offers:', err.message);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
          showSnackbar('Authentication failed. Please log in again.', 'error');
          setFetchingOffer(false);
          return;
        }
      }
      
      console.log('🔵 All offers for candidate:', offersArray);
      
      if (offersArray.length === 0) {
        setError(`No offers found for candidate ${candidateData.name || candidateId}`);
        showSnackbar(`No offers found for candidate ${candidateData.name || candidateId}`, 'warning');
        setFetchingOffer(false);
        return;
      }
      
      // Filter for offers that are sent (ready for acceptance)
      const sentOffers = offersArray.filter(offer => {
        if (!offer) return false;
        
        const status = (offer.status || '').toLowerCase();
        const offerStatus = (offer.offerStatus || '').toLowerCase();
        const appStatus = (offer.applicationStatus || '').toLowerCase();
        
        return status === 'sent' || 
               offerStatus === 'sent' || 
               appStatus === 'sent';
      });
      
      console.log('🔵 Sent offers:', sentOffers);
      
      if (sentOffers.length === 0) {
        setError(`No sent offers found for ${candidateData.name || 'this candidate'}. Please send the offer first.`);
        showSnackbar(`No sent offers found. Please send the offer first.`, 'warning');
        setFetchingOffer(false);
        return;
      }
      
      // Sort by creation date (newest first)
      const sortedOffers = sentOffers.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.createdDate || a.offerDate || a.updatedAt || 0);
        const dateB = new Date(b.createdAt || b.createdDate || b.offerDate || b.updatedAt || 0);
        return dateB - dateA;
      });
      
      // Set the latest offer
      const latestOffer = sortedOffers[0];
      console.log('🔵 Latest offer selected:', latestOffer);
      
      setSelectedOffer(latestOffer);
      setOfferDetails(latestOffer);
      setOfferFound(true);
      
    } catch (err) {
      console.error('🔴 Error fetching offer:', err);
      setError(`Error fetching offer details: ${err.message}`);
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setFetchingOffer(false);
    }
  };

  // Handle signature file upload
  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSignatureFileName(file.name);
      setSignatureFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setSignature(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear signature
  const clearSignature = () => {
    setSignature('');
    setSignatureFile(null);
    setSignatureFileName('');
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setError(null);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError(null);
  };

  // Validate current step
  const validateStep = (step) => {
    if (step === 0) {
      if (!offerFound || !selectedOffer) {
        setError('Please verify the offer first');
        return false;
      }
      if (signatureType === 'text' && !signature.trim()) {
        setError('Please enter your full name as signature');
        return false;
      }
      if (signatureType === 'upload' && !signatureFile) {
        setError('Please upload your signature image');
        return false;
      }
      return true;
    }
    
    if (step === 1) {
      if (!termsAccepted) {
        setError('Please accept the terms and conditions');
        return false;
      }
      return true;
    }
    
    return true;
  };

  // Handle accept offer
  const handleAcceptOffer = async () => {
    if (!selectedOffer?._id && !selectedOffer?.id) {
      showSnackbar('No offer ID found', 'error');
      return;
    }

    if (!validateStep(0)) {
      return;
    }

    setAccepting(true);
    setError(null);

    try {
      const token = getAuthToken();
      const offerId = selectedOffer._id || selectedOffer.id;
      
      console.log(`🔵 Accepting offer for ID: ${offerId}`);
      console.log(`🔵 Signature: ${signatureType === 'text' ? signature : '[Image uploaded]'}`);
      console.log(`🔵 Signature type: ${signatureType}`);
      
      showSnackbar('Accepting offer...', 'info');
      
      // Prepare request body based on signature type
      const requestBody = {
        signature: signatureType === 'text' ? signature : signature,
        signatureType: signatureType
      };
      
      console.log('🔵 Request body:', requestBody);
      
      const response = await axios.post(
        `${BASE_URL}/api/offers/${offerId}/accept`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('🔵 Accept offer response:', response.data);

      if (response.data.success) {
        setAcceptResult({
          offerId: response.data.data.offerId || offerId,
          candidateName: response.data.data.candidateName || candidateInfo?.name || candidate?.name || 'Candidate',
          position: response.data.data.position || candidateInfo?.position || candidate?.position || 'Position',
          joiningDate: response.data.data.joiningDate || new Date().toISOString(),
          status: response.data.data.status || 'accepted'
        });
        
        setSuccess(true);
        showSnackbar('✅ Offer accepted successfully!', 'success');
        
        // Move to confirmation step (Step 1)
        setActiveStep(1);
      } else {
        throw new Error(response.data.message || 'Failed to accept offer');
      }
    } catch (err) {
      console.error('🔴 Error accepting offer:', err);
      
      let errorMessage = 'Failed to accept offer';
      
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Invalid request';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (err.response.status === 404) {
          errorMessage = 'Offer not found';
        } else if (err.response.data) {
          errorMessage = err.response.data.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showSnackbar(`❌ ${errorMessage}`, 'error');
    } finally {
      setAccepting(false);
    }
  };

  // Handle completion
  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        id: candidate?.id || candidateInfo?.id,
        candidateId: candidate?.candidateId || candidateInfo?.candidateId,
        offerId: acceptResult?.offerId || selectedOffer?.offerId || candidate?.offerId,
        status: 'accepted',
        applicationStatus: 'accepted',
        acceptedDate: new Date().toISOString(),
        joiningDate: acceptResult?.joiningDate || candidate?.joiningDate,
        candidateName: acceptResult?.candidateName || candidate?.name
      });
    }
    
    showSnackbar('Offer acceptance recorded successfully!', 'success');
    
    setTimeout(() => {
      resetState();
      onClose();
    }, 500);
  };

  // Handle close
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Format date
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

  const isLoading = fetchingOffer || accepting;
  
  // Get candidate name and details
  const candidateName = candidateInfo?.name || candidate?.name || 'Unknown';
  const candidateEmail = candidateInfo?.email || candidate?.email || '';
  const candidatePhone = candidateInfo?.phone || candidate?.phone || '';
  const candidatePosition = candidateInfo?.position || candidate?.position || 'N/A';
  const offerId = selectedOffer?.offerId || candidate?.offerId;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1.5,
            maxHeight: '90vh',
            minHeight: '600px'
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AcceptIcon sx={{ color: '#4CAF50' }} />
            <Typography variant="subtitle1" fontWeight={600}>
              Candidate Accept Offer
            </Typography>
            {candidateName && (
              <Chip 
                label={candidateName}
                size="small"
                color="success"
                variant="outlined"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          <IconButton onClick={handleClose} size="small" disabled={accepting}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* Stepper - Only 2 steps */}
        {!success && activeStep < 1 && (
          <Box sx={{ px: 2, pt: 2, backgroundColor: '#F8FAFC' }}>
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel 
              connector={<ColorConnector />} 
              sx={{ mb: 1 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={StepIcon}>
                    <Typography fontSize="0.8rem">{label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        <DialogContent sx={{ 
          p: 2, 
          bgcolor: '#F5F7FA', 
          overflow: 'auto',
          minHeight: '400px'
        }}>
          {fetchingOffer ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 4, minHeight: '300px' }}>
              <CircularProgress size={40} />
              <Typography sx={{ mt: 2 }}>Fetching offer for {candidateName}...</Typography>
            </Box>
          ) : !selectedOffer ? (
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1 }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                No sent offer found for {candidateName}. Please send the offer first.
              </Alert>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => candidate && fetchLatestOfferForCandidate(candidate)}
                  startIcon={<RefreshIcon />}
                >
                  Retry
                </Button>
              </Box>
            </Paper>
          ) : (
            <>
              {/* Step 0: Accept Offer - Combined Verify + Signature */}
              {activeStep === 0 && (
                <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                  <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                    Accept Offer
                  </Typography>

                  {/* Candidate Info Card */}
                  <Box sx={{ 
                    p: 2, 
                    mb: 2, 
                    bgcolor: '#F0F7FF', 
                    borderRadius: 1,
                    border: '1px solid #1976D2',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Avatar sx={{ bgcolor: '#1976D2', width: 48, height: 48 }}>
                      {candidate?.firstName?.charAt(0) || <PersonIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {candidateName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {candidateEmail} | {candidatePhone}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Offer Summary */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        Offer Summary
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Offer ID
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {offerId || selectedOffer?._id || 'N/A'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Position
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {candidatePosition}
                      </Typography>
                    </Grid>
                    
                    {selectedOffer?.createdAt && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Offer Date
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(selectedOffer.createdAt)}
                        </Typography>
                      </Grid>
                    )}
                    
                    {selectedOffer?.expiryDate && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Expiry Date
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(selectedOffer.expiryDate)}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {/* Signature Type Selection */}
                  <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <FormLabel component="legend" sx={{ fontSize: '0.85rem', mb: 1 }}>
                      Signature Type *
                    </FormLabel>
                    <RadioGroup
                      row
                      value={signatureType}
                      onChange={(e) => setSignatureType(e.target.value)}
                    >
                      <FormControlLabel 
                        value="text" 
                        control={<Radio size="small" />} 
                        label="Text Signature" 
                      />
                      <FormControlLabel 
                        value="upload" 
                        control={<Radio size="small" />} 
                        label="Upload Signature" 
                      />
                    </RadioGroup>
                  </FormControl>

                  {/* Signature Input */}
                  {signatureType === 'text' ? (
                    <TextField
                      fullWidth
                      label="Your Full Name *"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Enter your full name as signature"
                      size="small"
                      sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                      helperText="This will be used as your digital signature"
                    />
                  ) : (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                        Upload Signature Image *
                      </Typography>
                      
                      {!signatureFile ? (
                        <Box
                          sx={{
                            border: '2px dashed #E0E0E0',
                            borderRadius: 1,
                            p: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            bgcolor: '#F9F9F9',
                            '&:hover': {
                              bgcolor: '#F0F0F0'
                            }
                          }}
                          component="label"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSignatureUpload}
                            style={{ display: 'none' }}
                            disabled={accepting}
                          />
                          <EditIcon sx={{ color: '#1976D2', mb: 1, fontSize: 28 }} />
                          <Typography variant="body2">Click to upload signature image</Typography>
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
                            <Typography variant="body2">{signatureFileName}</Typography>
                          </Box>
                          <Button
                            size="small"
                            color="error"
                            onClick={clearSignature}
                            disabled={accepting}
                          >
                            Remove
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Preview Section */}
                  <Paper sx={{ p: 1.5, bgcolor: '#F0F7FF', borderRadius: 1 }}>
                    <Typography variant="caption" color="#1976D2" display="block" gutterBottom>
                      Preview
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary">Candidate</Typography>
                        <Typography variant="body2">{candidateName}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary">Position</Typography>
                        <Typography variant="body2">{candidatePosition}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">Signature</Typography>
                        <Typography variant="body2" sx={{ fontFamily: signatureType === 'text' ? 'cursive' : 'inherit' }}>
                          {signatureType === 'text' ? signature || '[Not provided]' : '[Signature uploaded]'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Paper>
              )}

              {/* Step 1: Confirmation with Terms */}
              {activeStep === 1 && acceptResult && (
                <Paper sx={{ 
                  p: 3, 
                  bgcolor: '#FFFFFF', 
                  borderRadius: 1, 
                  border: '1px solid #4CAF50',
                  maxHeight: '500px',
                  overflow: 'auto'
                }}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ fontSize: 50, color: '#4CAF50', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>Offer Accepted Successfully!</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Please review and accept the terms and conditions below to complete the process.
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />
                  
                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Offer ID
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {acceptResult.offerId}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Candidate
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {acceptResult.candidateName}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Position
                      </Typography>
                      <Typography variant="body2">
                        {acceptResult.position}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Joining Date
                      </Typography>
                      <Typography variant="body2" fontWeight={500} color="success.main">
                        {formatDate(acceptResult.joiningDate)}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Terms and Conditions */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.9rem', color: '#1976D2', fontWeight: 600 }}>
                      Terms and Conditions *
                    </Typography>
                    <Paper sx={{ 
                      p: 1.5, 
                      bgcolor: '#F8FAFC', 
                      maxHeight: 180, 
                      overflow: 'auto', 
                      mb: 1.5,
                      border: '1px solid #E0E0E0'
                    }}>
                      <Typography variant="body2" component="div" sx={{ color: '#666', lineHeight: 1.6 }}>
                        <strong>1.</strong> I confirm that all information provided is true and correct.<br/>
                        <strong>2.</strong> I accept the terms and conditions of employment as outlined in the offer letter.<br/>
                        <strong>3.</strong> I understand that this offer is contingent upon background verification.<br/>
                        <strong>4.</strong> I agree to join on the specified joining date or will provide prior notice.<br/>
                        <strong>5.</strong> I acknowledge that this is a legally binding acceptance of the offer.
                      </Typography>
                    </Paper>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Checkbox
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        size="small"
                        sx={{ p: 0.5 }}
                      />
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                        I have read and agree to the terms and conditions
                      </Typography>
                    </Box>
                    
                    {error && activeStep === 1 && (
                      <Alert severity="error" sx={{ mt: 1, mb: 1 }} onClose={() => setError(null)}>
                        {error}
                      </Alert>
                    )}
                  </Box>

                  
                </Paper>
              )}
            </>
          )}

          {/* Error Display */}
          {error && activeStep !== 1 && (
            <Alert 
              severity="error" 
              sx={{ mt: 2, borderRadius: 1 }}
              onClose={() => setError(null)}
            >
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
          {activeStep === 1 ? (
            <>
              <Button 
                onClick={handleClose} 
                size="small"
                sx={{ color: '#666' }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={handleComplete}
                disabled={!termsAccepted}
                size="small"
                startIcon={<CheckCircleIcon />}
                sx={{
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
              >
                Finalize Acceptance
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || accepting || !selectedOffer}
                size="small"
                sx={{ color: '#666' }}
              >
                Back
              </Button>
              <Box>
                <Button 
                  onClick={handleClose} 
                  disabled={accepting}
                  size="small"
                  sx={{ mr: 1, color: '#666' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAcceptOffer}
                  disabled={accepting || (signatureType === 'text' && !signature) || (signatureType === 'upload' && !signatureFile)}
                  size="small"
                  startIcon={accepting ? <CircularProgress size={16} color="inherit" /> : <AcceptIcon />}
                  sx={{
                    backgroundColor: '#4CAF50',
                    '&:hover': { backgroundColor: '#45a049' },
                    minWidth: 100
                  }}
                >
                  {accepting ? 'Accepting...' : 'Accept Offer'}
                </Button>
              </Box>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            boxShadow: 3,
            borderRadius: 1
          }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
            error: <ErrorIcon fontSize="inherit" />,
            info: <InfoIcon fontSize="inherit" />
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AcceptOffer;