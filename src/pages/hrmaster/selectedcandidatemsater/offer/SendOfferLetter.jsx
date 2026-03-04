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
  FormControlLabel,
  Checkbox,
  Snackbar,
  Tooltip
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
  Link as LinkIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const SendOfferLetter = ({ open, onClose, onComplete, candidate }) => {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  
  // Email form state
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: `Offer Letter - ${candidate?.name || 'Candidate'}`,
    message: `Dear ${candidate?.name || 'Candidate'},\n\nWe are pleased to offer you the position of ${candidate?.position || 'the position'} at our company. Please find attached your offer letter.\n\nYou can view and accept your offer using the secure links below.\n\nBest regards,\nHR Team`,
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
      setError(null);
      setSuccess(false);
      setSendResult(null);
      
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

      // Validate if candidate has offerId
      if (!candidate.offerId) {
        setError('No offer ID found for this candidate');
        showSnackbar('No offer ID found for this candidate', 'error');
      }

      // Validate if candidate has email
      if (!candidate.email) {
        setError('No email address found for this candidate');
        showSnackbar('No email address found for this candidate', 'error');
      }
    }
  }, [open, candidate]);

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
      // Save the complete token data
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

  // Send offer letter via email
  const handleSendEmail = async () => {
    if (!candidate?.offerId) {
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
      console.log(`Sending offer letter for offer ID: ${candidate.offerId}`);
      
      showSnackbar('Sending offer letter...', 'info');
      
      const response = await axios.post(
        `${BASE_URL}/api/offers/${candidate.offerId}/send`,
        {
          to: emailData.to,
          cc: emailData.cc ? emailData.cc.split(',').map(email => email.trim()) : [],
          bcc: emailData.bcc ? emailData.bcc.split(',').map(email => email.trim()) : [],
          subject: emailData.subject,
          message: emailData.message,
          sendCopy: emailData.sendCopy,
          includeViewLink: emailData.includeViewLink,
          includeAcceptLink: emailData.includeAcceptLink
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Send email response:', response.data);

      if (response.data.success) {
        // Save the token data to localStorage
        if (response.data.data && response.data.data.token) {
          saveTokenToLocalStorage(candidate.offerId, response.data.data);
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
        id: candidate?.id,
        candidateId: candidate?.candidateId,
        offerId: candidate?.offerId,
        status: 'sent',
        applicationStatus: 'sent',
        emailSent: true,
        sentDate: new Date().toISOString(),
        tokenData: sendResult // Include token data in the completion callback
      });
      
      showSnackbar('Offer marked as sent successfully! Token saved.', 'success');
      
      // Close dialog after a short delay
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
              Send Offer Letter via Email
            </Typography>
            {candidate && (
              <Chip 
                label={candidate.name}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="small" disabled={sending}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2, bgcolor: '#F5F7FA', overflow: 'auto' }}>
          {error && !success && (
            <Alert 
              severity="error" 
              sx={{ mb: 2, borderRadius: 1 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {!candidate?.offerId ? (
            <Alert severity="warning" sx={{ borderRadius: 1 }}>
              This candidate does not have an offer ID. Please generate an offer letter first.
            </Alert>
          ) : !success ? (
            <>
              {/* Offer Info Card */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                  Offer Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Candidate</Typography>
                    <Typography variant="body2" fontWeight={500}>{candidate?.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Offer ID</Typography>
                    <Typography variant="body2">{candidate?.offerId}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Position</Typography>
                    <Typography variant="body2">{candidate?.position}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">Email</Typography>
                    <Typography variant="body2">{candidate?.email || 'Not provided'}</Typography>
                  </Grid>
                </Grid>
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
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CC"
                      name="cc"
                      value={emailData.cc}
                      onChange={handleInputChange}
                      size="small"
                      placeholder="cc@example.com, another@example.com"
                      helperText="Separate multiple emails with commas"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="BCC"
                      name="bcc"
                      value={emailData.bcc}
                      onChange={handleInputChange}
                      size="small"
                      placeholder="bcc@example.com"
                      helperText="Separate multiple emails with commas"
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
                      rows={5}
                      size="small"
                      placeholder="Enter your message here..."
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="sendCopy"
                            checked={emailData.sendCopy}
                            onChange={handleInputChange}
                            size="small"
                          />
                        }
                        label="Send me a copy"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="includeViewLink"
                            checked={emailData.includeViewLink}
                            onChange={handleInputChange}
                            size="small"
                          />
                        }
                        label="Include secure view link in email"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="includeAcceptLink"
                            checked={emailData.includeAcceptLink}
                            onChange={handleInputChange}
                            size="small"
                          />
                        }
                        label="Include secure accept link in email"
                      />
                    </Box>
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
                {sendResult?.token && (
                  <Chip 
                    label="Token Saved Locally"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                    icon={<CheckCircleIcon />}
                  />
                )}
              </Box>

              {sendResult && (
                <>
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ color: '#1976D2' }}>
                    Secure Links (Valid until {formatExpiryDate(sendResult.tokenExpiry)})
                  </Typography>
                  
                  {sendResult.viewUrl && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                        View Offer URL:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            flex: 1, 
                            bgcolor: '#F5F5F5', 
                            p: 1, 
                            borderRadius: 1,
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            wordBreak: 'break-all'
                          }}
                        >
                          {sendResult.viewUrl}
                        </Typography>
                        <Tooltip title="Copy to clipboard">
                          <IconButton 
                            size="small" 
                            onClick={() => handleCopyToClipboard(sendResult.viewUrl, 'View URL')}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}

                  {sendResult.acceptUrl && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                        Accept Offer URL:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            flex: 1, 
                            bgcolor: '#F5F5F5', 
                            p: 1, 
                            borderRadius: 1,
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            wordBreak: 'break-all'
                          }}
                        >
                          {sendResult.acceptUrl}
                        </Typography>
                        <Tooltip title="Copy to clipboard">
                          <IconButton 
                            size="small" 
                            onClick={() => handleCopyToClipboard(sendResult.acceptUrl, 'Accept URL')}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: '#E3F2FD', 
                    borderRadius: 1, 
                    border: '1px solid #90CAF9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2
                  }}>
                    <InfoIcon sx={{ color: '#1976D2', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Token: <strong>{sendResult.token}</strong>
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        These links are unique and secure. They will expire on {formatExpiryDate(sendResult.tokenExpiry)}.
                      </Typography>
                    </Box>
                  </Box>
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
                  disabled={!emailData.to || !candidate?.offerId || sending}
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