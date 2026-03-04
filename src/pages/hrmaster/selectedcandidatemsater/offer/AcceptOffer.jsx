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
  Avatar
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
  Work as WorkIcon,
  AttachMoney as AttachMoneyIcon,
  Check as AcceptIcon,
  ThumbUp as ThumbUpIcon,
  Info as InfoIcon
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
    if (icon === 2) return <PersonIcon fontSize="small" />;
    if (icon === 3) return <ThumbUpIcon fontSize="small" />;
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

const steps = ['Verify Offer', 'Acceptance', 'Confirmation'];

const AcceptOffer = ({ open, onClose, onComplete, candidate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
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
  const [offerDetails, setOfferDetails] = useState(null);
  const [offerToken, setOfferToken] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  
  // Token validation state
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const [fetchingToken, setFetchingToken] = useState(false);

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
      resetState();
      
      // If candidate has offerId, check for token in localStorage
      if (candidate.offerId) {
        checkForOfferToken(candidate.offerId);
      } else {
        setTokenError('No offer ID found for this candidate');
        showSnackbar('No offer ID found for this candidate', 'error');
      }
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
    setOfferToken(null);
    setTokenExpiry(null);
    setTokenValid(false);
    setTokenError(null);
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

  // Check for offer token in localStorage (saved from send offer response)
  const checkForOfferToken = (offerId) => {
    setFetchingToken(true);
    setTokenError(null);

    try {
      console.log(`Checking for token for offer ID: ${offerId}`);
      
      // Check if token exists in localStorage (saved from send offer)
      const savedTokenData = localStorage.getItem(`offer_token_${offerId}`);
      
      if (savedTokenData) {
        try {
          const tokenData = JSON.parse(savedTokenData);
          console.log('Found token data:', tokenData);
          
          setOfferToken(tokenData.token);
          setTokenExpiry(tokenData.tokenExpiry);
          
          // Check if token is expired
          if (tokenData.tokenExpiry) {
            const expiryDate = new Date(tokenData.tokenExpiry);
            const now = new Date();
            
            if (expiryDate < now) {
              setTokenError('Offer token has expired. Please send the offer again.');
              showSnackbar('Offer token has expired', 'error');
              setTokenValid(false);
            } else {
              setTokenValid(true);
              // Also fetch offer details
              fetchOfferDetails(offerId);
            }
          } else {
            setTokenValid(true);
            fetchOfferDetails(offerId);
          }
        } catch (e) {
          console.error('Error parsing token data:', e);
          setTokenError('Invalid token data stored');
          showSnackbar('Invalid token data', 'error');
        }
      } else {
        setTokenError('No offer token found. Please ensure the offer has been sent to the candidate.');
        showSnackbar('No offer token found', 'error');
      }
    } catch (err) {
      console.error('Error checking token:', err);
      setTokenError('Failed to check offer token');
      showSnackbar('Failed to check offer token', 'error');
    } finally {
      setFetchingToken(false);
    }
  };

  // Fetch offer details
  const fetchOfferDetails = async (offerId) => {
    try {
      const token = getAuthToken();
      console.log(`Fetching offer details for ID: ${offerId}`);
      
      const response = await axios.get(
        `${BASE_URL}/api/offers/${offerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Offer details response:', response.data);

      if (response.data.success) {
        const offerData = response.data.data;
        setOfferDetails(offerData);
        showSnackbar('Offer details loaded successfully!', 'success');
      } else {
        throw new Error(response.data.message || 'Failed to fetch offer details');
      }
    } catch (err) {
      console.error('Error fetching offer details:', err);
      
      // For development, create mock offer details
      const mockOfferDetails = {
        _id: offerId,
        offerId: offerId,
        candidateId: candidate?.candidateId,
        candidate: {
          name: candidate?.name,
          email: candidate?.email
        },
        job: {
          title: candidate?.position || 'Software Developer'
        },
        offerDetails: {
          joiningDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        ctcDetails: {
          totalCtc: 1200000
        }
      };
      
      setOfferDetails(mockOfferDetails);
      showSnackbar('Offer details loaded (demo mode)', 'info');
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
      if (!tokenValid) {
        setError('Please verify the offer first');
        return false;
      }
      return true;
    }
    
    if (step === 1) {
      if (signatureType === 'text' && !signature.trim()) {
        setError('Please enter your full name as signature');
        return false;
      }
      if (signatureType === 'upload' && !signatureFile) {
        setError('Please upload your signature image');
        return false;
      }
      if (!termsAccepted) {
        setError('Please accept the terms and conditions');
        return false;
      }
      return true;
    }
    
    return true;
  };

  // Handle accept offer - UPDATED to use correct endpoint
  const handleAcceptOffer = async () => {
    if (!candidate?.offerId || !offerToken) {
      showSnackbar('Missing offer ID or token', 'error');
      return;
    }

    if (!validateStep(1)) {
      return;
    }

    setAccepting(true);
    setError(null);

    try {
      const token = getAuthToken();
      console.log(`Accepting offer for ID: ${candidate.offerId}`);
      console.log(`Using token: ${offerToken}`);
      
      showSnackbar('Accepting offer...', 'info');
      
      // CORRECTED: Using accept-offer endpoint with token as query parameter
      const response = await axios.post(
        `${BASE_URL}/api/offers/${candidate.offerId}/accept-offer?token=${offerToken}`,
        {
          signature: signatureType === 'text' ? signature : signature,
          signatureType: signatureType
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Accept offer response:', response.data);

      if (response.data.success) {
        setSuccess(true);
        setAcceptResult(response.data.data);
        
        // Clear stored token after successful acceptance
        localStorage.removeItem(`offer_token_${candidate.offerId}`);
        
        showSnackbar('✅ Offer accepted successfully!', 'success');
        
        // Move to confirmation step
        setActiveStep(2);
      } else {
        throw new Error(response.data.message || 'Failed to accept offer');
      }
    } catch (err) {
      console.error('Error accepting offer:', err);
      
      let errorMessage = 'Failed to accept offer';
      
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Invalid token or request';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (err.response.status === 404) {
          errorMessage = 'Offer not found or accept endpoint not found';
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
        id: candidate?.id,
        candidateId: candidate?.candidateId,
        offerId: candidate?.offerId || acceptResult?.offerId,
        status: 'accepted',
        applicationStatus: 'accepted_by_candidate',
        acceptedDate: new Date().toISOString(),
        joiningDate: acceptResult?.joiningDate,
        candidateName: acceptResult?.candidateName
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

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  // Check if token is expired
  const isTokenExpired = () => {
    if (!tokenExpiry) return false;
    return new Date(tokenExpiry) < new Date();
  };

  const isLoading = loading || fetchingToken;

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AcceptIcon sx={{ color: '#4CAF50' }} />
            <Typography variant="subtitle1" fontWeight={600}>
              Candidate Accept Offer
            </Typography>
            {candidate && (
              <Chip 
                label={candidate.name}
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

        {/* Stepper */}
        {!success && activeStep < 2 && (
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

        <DialogContent sx={{ p: 2, bgcolor: '#F5F7FA', overflow: 'auto' }}>
          {/* Step 0: Verify Offer */}
          {activeStep === 0 && (
            <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                Verify Offer Details
              </Typography>

              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : tokenError ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {tokenError}
                  <Box sx={{ mt: 1 }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => candidate?.offerId && checkForOfferToken(candidate.offerId)}
                      startIcon={<RefreshIcon />}
                    >
                      Retry
                    </Button>
                  </Box>
                </Alert>
              ) : tokenValid ? (
                <>
                  {/* Token Info */}
                  {tokenExpiry && (
                    <Box sx={{ 
                      mb: 2, 
                      p: 1.5, 
                      bgcolor: isTokenExpired() ? '#FFEBEE' : '#E8F5E9', 
                      borderRadius: 1,
                      border: `1px solid ${isTokenExpired() ? '#EF5350' : '#81C784'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      {isTokenExpired() ? (
                        <ErrorIcon sx={{ color: '#EF5350' }} />
                      ) : (
                        <VerifiedIcon sx={{ color: '#4CAF50' }} />
                      )}
                      <Typography variant="body2">
                        {isTokenExpired() 
                          ? 'Offer token has expired. Please send the offer again.' 
                          : `Token valid until: ${formatDate(tokenExpiry)}`}
                      </Typography>
                    </Box>
                  )}

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
                        {candidate?.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {candidate?.email} | {candidate?.phone}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Offer Summary */}
                  <Grid container spacing={2}>
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
                        {candidate?.offerId}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Position
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {candidate?.position}
                      </Typography>
                    </Grid>
                    
                    {offerDetails && (
                      <>
                        {offerDetails.offerDetails?.joiningDate && (
                          <Grid item xs={6}>
                            <Typography variant="caption" color="textSecondary" display="block">
                              Joining Date
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(offerDetails.offerDetails.joiningDate)}
                            </Typography>
                          </Grid>
                        )}
                        
                        {offerDetails.ctcDetails?.totalCtc && (
                          <Grid item xs={6}>
                            <Typography variant="caption" color="textSecondary" display="block">
                              Total CTC
                            </Typography>
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              {formatCurrency(offerDetails.ctcDetails.totalCtc)}
                            </Typography>
                          </Grid>
                        )}
                      </>
                    )}
                  </Grid>

                  <Box sx={{ 
                    mt: 2, 
                    p: 1.5, 
                    bgcolor: '#E8F5E9', 
                    borderRadius: 1,
                    border: '1px solid #81C784',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <VerifiedIcon sx={{ color: '#4CAF50' }} />
                    <Typography variant="body2">
                      Offer has been verified and is valid for acceptance
                    </Typography>
                  </Box>
                </>
              ) : (
                <Alert severity="info">
                  No offer token found. Please ensure the offer has been sent to the candidate.
                </Alert>
              )}
            </Paper>
          )}

          {/* Step 1: Acceptance */}
          {activeStep === 1 && (
            <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                Accept Offer
              </Typography>

              {/* Signature Type Selection */}
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.85rem', mb: 1 }}>
                  Signature Type
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
                        // border: '2px dashed #E0E0E0',
                        // borderRadius: 1,
                        // p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        // bgcolor: '#F9F9F9',
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
                      {/* <EditIcon sx={{ color: '#1976D2', mb: 1, fontSize: 28 }} /> */}
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

              {/* Terms and Conditions */}
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem' }}>
                  Terms and Conditions
                </Typography>
                <Paper sx={{ p: 1.5, bgcolor: '#F8FAFC', maxHeight: 150, overflow: 'auto' }}>
                  <Typography variant="caption" component="div" sx={{ color: '#666' }}>
                    <strong>1.</strong> I confirm that all information provided is true and correct.<br/>
                    <strong>2.</strong> I accept the terms and conditions of employment as outlined in the offer letter.<br/>
                    <strong>3.</strong> I understand that this offer is contingent upon background verification.<br/>
                    <strong>4.</strong> I agree to join on the specified joining date or will provide prior notice.<br/>
                    <strong>5.</strong> I acknowledge that this is a legally binding acceptance of the offer.
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <input
                  type="checkbox"
                  id="termsAccepted"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={accepting}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                  I have read and agree to the terms and conditions
                </Typography>
              </Box>

              {/* Preview Section */}
              <Paper sx={{ p: 1.5, bgcolor: '#F0F7FF', borderRadius: 1 }}>
                <Typography variant="caption" color="#1976D2" display="block" gutterBottom>
                  Acceptance Preview
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Candidate</Typography>
                    <Typography variant="body2">{candidate?.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Position</Typography>
                    <Typography variant="body2">{candidate?.position}</Typography>
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

          {/* Step 2: Confirmation */}
          {activeStep === 2 && acceptResult && (
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #4CAF50' }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Offer Accepted Successfully!</Typography>
                <Typography variant="body2" color="textSecondary">
                  Thank you for accepting the offer. We look forward to welcoming you to the team!
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
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
                
                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Status
                  </Typography>
                  <Chip 
                    label={acceptResult.status || 'Accepted'} 
                    color="success"
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ 
                mt: 2, 
                p: 1.5, 
                bgcolor: '#E8F5E9', 
                borderRadius: 1,
                border: '1px solid #81C784',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                <Typography variant="body2" color="textSecondary">
                  A confirmation email has been sent to your registered email address.
                </Typography>
              </Box>
            </Paper>
          )}

          {/* Error Display */}
          {error && activeStep !== 2 && (
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
          {activeStep === 2 ? (
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
                size="small"
                startIcon={<CheckCircleIcon />}
                sx={{
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
              >
                Done
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || accepting}
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
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleAcceptOffer}
                    disabled={accepting || !termsAccepted || (signatureType === 'text' && !signature) || (signatureType === 'upload' && !signatureFile) || isTokenExpired()}
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
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={activeStep === 0 && (!tokenValid || isLoading)}
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