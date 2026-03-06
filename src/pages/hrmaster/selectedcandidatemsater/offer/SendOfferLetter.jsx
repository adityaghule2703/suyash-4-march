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
  Snackbar,
  Tooltip,
  Avatar,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Send as SendIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const SendOfferLetter = ({ open, onClose, onComplete, candidate }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingOffer, setFetchingOffer] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);
  
  // Email form state
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    message: '',
    sendCopy: true,
    includeViewLink: true,
    includeAcceptLink: true
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    vertical: 'bottom',
    horizontal: 'right'
  });

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  };

  // Reset state when dialog opens with new candidate
  useEffect(() => {
    if (open && candidate) {
      console.log('🔵 SendOfferLetter opened for candidate:', candidate);
      resetState();
      
      // Set candidate info immediately from props
      setCandidateInfo(candidate);
      
      // Pre-fill email with candidate data
      setEmailData({
        to: candidate.email || '',
        cc: '',
        bcc: '',
        subject: `Offer Letter - ${candidate.name || 'Candidate'}`,
        message: `Dear ${candidate.name || 'Candidate'},\n\nWe are pleased to offer you the position of ${candidate.position || 'the position'} at our company. Please find attached your offer letter.\n\nYou can view and accept your offer using the secure links below.\n\nBest regards,\nHR Team`,
        sendCopy: true,
        includeViewLink: true,
        includeAcceptLink: true
      });
      
      // Fetch the latest offer for this specific candidate
      fetchLatestOfferForCandidate(candidate);
    }
  }, [open, candidate]);

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setSendResult(null);
    setSelectedOffer(null);
    setFetchingOffer(false);
    setSending(false);
  };

  // Fetch the latest offer for the candidate (any status that can be sent)
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
      
      // Filter for offers that can be sent (approved, generated, or sent)
      const sendableOffers = offersArray.filter(offer => {
        if (!offer) return false;
        
        const status = (offer.status || '').toLowerCase();
        const offerStatus = (offer.offerStatus || '').toLowerCase();
        const appStatus = (offer.applicationStatus || '').toLowerCase();
        
        return status === 'approved' || 
               status === 'generated' || 
               status === 'sent' ||
               offerStatus === 'approved' || 
               offerStatus === 'generated' || 
               offerStatus === 'sent' ||
               appStatus === 'approved' || 
               appStatus === 'generated' || 
               appStatus === 'sent';
      });
      
      console.log('🔵 Sendable offers (approved/generated/sent):', sendableOffers);
      
      if (sendableOffers.length === 0) {
        setError(`No approved or generated offers found for ${candidateData.name || 'this candidate'}. Please approve the offer first.`);
        showSnackbar(`No approved offers found. Please approve the offer first.`, 'warning');
        setFetchingOffer(false);
        return;
      }
      
      // Sort by creation date (newest first)
      const sortedOffers = sendableOffers.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.createdDate || a.offerDate || a.updatedAt || 0);
        const dateB = new Date(b.createdAt || b.createdDate || b.offerDate || b.updatedAt || 0);
        return dateB - dateA;
      });
      
      // Set the latest offer
      const latestOffer = sortedOffers[0];
      console.log('🔵 Latest offer selected:', latestOffer);
      
      setSelectedOffer(latestOffer);
      
    } catch (err) {
      console.error('🔴 Error fetching offer:', err);
      setError(`Error fetching offer details: ${err.message}`);
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setFetchingOffer(false);
    }
  };

  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
      vertical: 'bottom',
      horizontal: 'right'
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Save token to localStorage
  const saveTokenToLocalStorage = (offerId, tokenData) => {
    try {
      localStorage.setItem(`offer_token_${offerId}`, JSON.stringify({
        token: tokenData.token,
        tokenExpiry: tokenData.tokenExpiry,
        viewUrl: tokenData.viewUrl,
        acceptUrl: tokenData.acceptUrl,
        sentAt: new Date().toISOString()
      }));
      console.log(`Token saved for offer ${offerId}:`, tokenData);
    } catch (error) {
      console.error('Error saving token to localStorage:', error);
    }
  };

  // Handle view offer
  const handleViewOffer = () => {
    if (!sendResult?.viewUrl) {
      showSnackbar('View URL not available', 'error');
      return;
    }
    
    console.log('Opening view URL:', sendResult.viewUrl);
    
    const newWindow = window.open(sendResult.viewUrl, '_blank');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      showSnackbar('Popup was blocked. Please allow popups for this site.', 'warning');
    } else {
      showSnackbar('Opening view link in new tab...', 'info');
    }
  };

  // Handle accept offer
  const handleAcceptOffer = () => {
    if (!sendResult?.acceptUrl) {
      showSnackbar('Accept URL not available', 'error');
      return;
    }
    
    console.log('Opening accept URL:', sendResult.acceptUrl);
    
    const newWindow = window.open(sendResult.acceptUrl, '_blank');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      showSnackbar('Popup was blocked. Please allow popups for this site.', 'warning');
    } else {
      showSnackbar('Opening accept link in new tab...', 'info');
    }
  };

  // Send offer letter via email
  const handleSendEmail = async () => {
    if (!selectedOffer?._id && !selectedOffer?.id) {
      showSnackbar('No offer ID found', 'error');
      return;
    }

    if (!emailData.to) {
      showSnackbar('Recipient email is required', 'error');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const token = getAuthToken();
      const offerId = selectedOffer._id || selectedOffer.id;
      
      console.log(`Sending offer letter for offer ID: ${offerId}`);
      console.log(`Sending to: ${emailData.to}`);
      
      showSnackbar('Sending offer letter...', 'info');
      
      const response = await axios.post(
        `${BASE_URL}/api/offers/${offerId}/send`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Send email response:', response.data);

      if (response.data.success) {
        if (response.data.data && response.data.data.token) {
          saveTokenToLocalStorage(offerId, response.data.data);
        }
        
        setSuccess(true);
        setSendResult(response.data.data);
        showSnackbar('✅ Offer letter sent successfully! Token saved.', 'success');
      } else {
        throw new Error(response.data.message || 'Failed to send email');
      }
    } catch (err) {
      console.error('Error sending offer letter:', err);
      
      let errorMessage = 'Failed to send offer letter';
      
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Offer not found';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (err.response.data) {
          errorMessage = err.response.data.message || err.response.data.error || errorMessage;
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showSnackbar(`❌ ${errorMessage}`, 'error');
    } finally {
      setSending(false);
    }
  };

  // Copy text to clipboard
  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(
      () => {
        showSnackbar(`${label} copied to clipboard!`, 'success');
      },
      () => {
        showSnackbar('Failed to copy to clipboard', 'error');
      }
    );
  };

  // Handle mark as sent and close
  const handleMarkSent = () => {
    if (onComplete) {
      onComplete({
        id: candidate?.id || candidateInfo?.id,
        candidateId: candidate?.candidateId || candidateInfo?.candidateId,
        offerId: selectedOffer?.offerId || candidate?.offerId,
        status: 'sent',
        applicationStatus: 'sent',
        emailSent: true,
        sentDate: new Date().toISOString(),
        tokenData: sendResult
      });
      
      showSnackbar('Offer marked as sent successfully!', 'success');
      
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      onClose();
    }
  };

  // Reset and try again
  const handleReset = () => {
    setError(null);
    setSuccess(false);
    setSendResult(null);
    setSending(false);
  };

  // Format expiry date
  const formatExpiryDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  // Get candidate initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const isLoading = fetchingOffer || sending;
  
  const displayCandidate = candidateInfo || candidate;
  const candidateName = displayCandidate?.name || 'Unknown';
  const candidateEmail = displayCandidate?.email || '';
  const candidatePhone = displayCandidate?.phone || '';
  const candidatePosition = displayCandidate?.position || 'N/A';
  const offerId = selectedOffer?.offerId || displayCandidate?.offerId;

  const getStatusDisplay = () => {
    if (!selectedOffer) return 'N/A';
    const status = selectedOffer.status || 'approved';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
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
            <EmailIcon sx={{ color: '#1976D2' }} />
            <Typography variant="subtitle1" fontWeight={600}>
              Send Offer Letter
            </Typography>
            {candidateName && (
              <Chip 
                label={candidateName}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="small" disabled={isLoading}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2, bgcolor: '#F5F7FA', overflow: 'auto' }}>
          {fetchingOffer ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={40} />
              <Typography sx={{ ml: 2 }}>Fetching latest offer for {candidateName}...</Typography>
            </Box>
          ) : error && !success ? (
            <Alert 
              severity="error" 
              sx={{ mb: 2, borderRadius: 1 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          ) : !selectedOffer ? (
            <Alert severity="warning" sx={{ borderRadius: 1 }}>
              No approved or generated offers found for {candidateName}. Please approve the offer first.
            </Alert>
          ) : !success ? (
            <>
              {/* Offer Info Card - Read Only */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: '#F0F7FF', borderRadius: 1, border: '1px solid #1976D2' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LockIcon fontSize="small" sx={{ color: '#1976D2' }} />
                  <Typography variant="subtitle2" sx={{ color: '#1976D2', fontWeight: 600, fontSize: '0.9rem' }}>
                    Offer Details (Read Only) - {candidateName}
                  </Typography>
                </Box>

                {/* Candidate Info */}
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  p: 1.5,
                  bgcolor: '#FFFFFF',
                  borderRadius: 1,
                  border: '1px solid #E0E0E0'
                }}>
                  <Avatar sx={{ bgcolor: '#1976D2', width: 48, height: 48 }}>
                    {getInitials(displayCandidate?.firstName, displayCandidate?.lastName) || <PersonIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {candidateName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {candidateEmail} {candidatePhone && ` | ${candidatePhone}`}
                    </Typography>
                  </Box>
                </Box>

                {/* Offer Information */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Offer ID</Typography>
                    <Typography variant="body2" fontWeight={500}>{offerId || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Position</Typography>
                    <Typography variant="body2">{candidatePosition}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Status</Typography>
                    <Chip 
                      label={getStatusDisplay()} 
                      size="small" 
                      color={selectedOffer?.status === 'approved' ? 'success' : 'secondary'}
                      sx={{ fontWeight: 500 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Recipient Email</Typography>
                    <Typography variant="body2">{candidateEmail || 'Not provided'}</Typography>
                  </Grid>
                  {selectedOffer?.offerDate && (
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">Offer Date</Typography>
                      <Typography variant="body2">{new Date(selectedOffer.offerDate).toLocaleDateString()}</Typography>
                    </Grid>
                  )}
                  {selectedOffer?.expiryDate && (
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">Expiry Date</Typography>
                      <Typography variant="body2">{new Date(selectedOffer.expiryDate).toLocaleDateString()}</Typography>
                    </Grid>
                  )}
                </Grid>

                {/* CTC Summary if available */}
                {selectedOffer?.ctcDetails && (
                  <Box sx={{ mt: 2, p: 1.5, bgcolor: '#FFFFFF', borderRadius: 1 }}>
                    <Typography variant="caption" color="#1976D2" fontWeight={600} display="block" gutterBottom>
                      CTC Summary
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary" display="block">Monthly Gross</Typography>
                        <Typography variant="body2">
                          ₹{selectedOffer.ctcDetails.gross?.toLocaleString() || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary" display="block">Annual CTC</Typography>
                        <Typography variant="body2" fontWeight={600} color="#1976D2">
                          ₹{selectedOffer.ctcDetails.totalCtc?.toLocaleString() || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>

              {/* Email Form */}
              <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                  Email Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="To *"
                      name="to"
                      value={emailData.to}
                      onChange={handleInputChange}
                      size="small"
                      placeholder="candidate@example.com"
                      required
                      error={!emailData.to}
                      helperText={!emailData.to ? 'Recipient email is required' : ''}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject *"
                      name="subject"
                      value={emailData.subject}
                      onChange={handleInputChange}
                      size="small"
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={emailData.message}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      size="small"
                      placeholder="Enter your message here..."
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </>
          ) : (
            /* Success View */
            <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #4CAF50' }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Offer Letter Sent Successfully!</Typography>
                <Typography variant="body2" color="textSecondary">
                  The offer letter has been sent to {emailData.to}
                </Typography>
              </Box>

              {sendResult && (
                <>
                  {/* <Divider sx={{ my: 2 }} /> */}
                  
                  {/* <Typography variant="subtitle2" gutterBottom sx={{ color: '#1976D2', mb: 2 }}>
                    Secure Actions (Valid until {formatExpiryDate(sendResult.tokenExpiry)})
                  </Typography>
                  
                  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                    {sendResult.viewUrl && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ViewIcon />}
                        onClick={handleViewOffer}
                        sx={{ 
                          minWidth: 140,
                          py: 1.5,
                          backgroundColor: '#1976D2',
                          '&:hover': { backgroundColor: '#1565C0' }
                        }}
                      >
                        View Offer
                      </Button>
                    )}
                    
                    {sendResult.acceptUrl && (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleAcceptOffer}
                        sx={{ 
                          minWidth: 140,
                          py: 1.5,
                          backgroundColor: '#4CAF50',
                          '&:hover': { backgroundColor: '#45a049' }
                        }}
                      >
                        Accept Offer
                      </Button>
                    )}
                  </Stack> */}

                  {/* <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="Copy View URL">
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopyToClipboard(sendResult.viewUrl, 'View URL')}
                        sx={{ color: '#1976D2' }}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy Accept URL">
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopyToClipboard(sendResult.acceptUrl, 'Accept URL')}
                        sx={{ color: '#4CAF50' }}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box> */}
                </>
              )}
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          p: 2, 
          borderTop: '1px solid #E0E0E0', 
          bgcolor: '#F8FAFC', 
          justifyContent: 'space-between' 
        }}>
          {!success ? (
            <>
              <Button 
                onClick={onClose} 
                disabled={sending}
                size="small"
                sx={{ color: '#666' }}
              >
                Cancel
              </Button>
              <Box>
                <Button
                  variant="contained"
                  onClick={handleSendEmail}
                  disabled={!emailData.to || !selectedOffer || sending}
                  size="small"
                  startIcon={sending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                  sx={{
                    backgroundColor: '#1976D2',
                    '&:hover': { backgroundColor: '#1565C0' },
                    minWidth: 120
                  }}
                >
                  {sending ? 'Sending...' : 'Send Email'}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Button 
                onClick={handleReset}
                size="small"
                startIcon={<RefreshIcon />}
                sx={{ color: '#666' }}
              >
                Send Another
              </Button>
              <Button
                variant="contained"
                onClick={handleMarkSent}
                size="small"
                startIcon={<CheckCircleIcon />}
                sx={{
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
              >
                Mark as Sent
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        anchorOrigin={{ 
          vertical: snackbar.vertical, 
          horizontal: snackbar.horizontal 
        }}
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
            borderRadius: 1,
            '& .MuiAlert-icon': {
              fontSize: 20
            }
          }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
            error: <ErrorIcon fontSize="inherit" />,
            info: <EmailIcon fontSize="inherit" />,
            warning: <ErrorIcon fontSize="inherit" />
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SendOfferLetter;