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
  TextField,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
  Divider,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

// Color constants
const PRIMARY_BLUE = '#00B4D8';
const SUCCESS_COLOR = '#2E7D32';
const ERROR_COLOR = '#d32f2f';
const WARNING_COLOR = '#ed6c02';

const SendAppointmentLetterEmail = ({ 
  open, 
  onClose, 
  documentId, 
  candidateEmail: propCandidateEmail,
  candidateName: propCandidateName,
  onSend 
}) => {
  const [sending, setSending] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [email, setEmail] = useState(propCandidateEmail || '');
  const [candidateName, setCandidateName] = useState(propCandidateName || '');
  const [emailError, setEmailError] = useState('');
  const [sendHistory, setSendHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sendResult, setSendResult] = useState(null);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Validate documentId
  const isValidDocumentId = (id) => {
    return id && id !== 'undefined' && id !== 'null' && id.trim() !== '';
  };

  // Fetch document details
  const fetchDocumentDetails = async () => {
    if (!isValidDocumentId(documentId)) {
      setError('Invalid document ID. Please select a valid appointment letter.');
      return;
    }

    setFetching(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${BASE_URL}/api/appointment-letter/${documentId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setDocumentInfo(data);
        
        // Set email from document if available
        if (data.candidateEmail && !propCandidateEmail) {
          setEmail(data.candidateEmail);
        }
        
        // Set candidate name from document
        if (data.candidateName && !propCandidateName) {
          setCandidateName(data.candidateName);
        }

        // Validate document status
        if (data.status === 'accepted') {
          setValidationErrors(prev => ({
            ...prev,
            status: 'This letter has already been accepted and cannot be sent'
          }));
        } else if (data.status === 'sent') {
          setValidationErrors(prev => ({
            ...prev,
            status: 'This letter has already been sent. Do you want to send again?'
          }));
        }
        
        // Fetch send history
        fetchSendHistory();
      }
    } catch (err) {
      console.error('Error fetching document details:', err);
      
      if (err.response?.status === 404) {
        setError('Appointment letter not found. Please check the document ID.');
      } else if (err.response?.status === 400 && err.response?.data?.message?.includes('Cast to ObjectId failed')) {
        setError('Invalid document ID format. Please select a valid appointment letter.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch document details');
      }
    } finally {
      setFetching(false);
    }
  };

  // Fetch send history for this document
  const fetchSendHistory = async () => {
    if (!isValidDocumentId(documentId)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/appointment-letter/history/${documentId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSendHistory(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching send history:', err);
      // Don't show error for history fetch failure
    }
  };

  // Load data when dialog opens
  useEffect(() => {
    if (open) {
      // Validate documentId first
      if (!isValidDocumentId(documentId)) {
        setError('Invalid document ID. Please select a valid appointment letter from the list.');
        setFetching(false);
      } else {
        setError('');
        if (!propCandidateEmail) {
          fetchDocumentDetails();
        } else {
          setEmail(propCandidateEmail);
          setCandidateName(propCandidateName || '');
          fetchSendHistory();
        }
      }
    }

    // Reset state when dialog closes
    if (!open) {
      resetState();
    }
  }, [open, documentId, propCandidateEmail, propCandidateName]);

  // Reset state
  const resetState = () => {
    setEmail(propCandidateEmail || '');
    setCandidateName(propCandidateName || '');
    setEmailError('');
    setError('');
    setSuccess('');
    setSendResult(null);
    setShowHistory(false);
    setDocumentInfo(null);
    setValidationErrors({});
  };

  // Handle close
  const handleClose = () => {
    if (!sending) {
      resetState();
      onClose();
    }
  };

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Validate before sending
  const validateBeforeSend = () => {
    const errors = {};

    if (!isValidDocumentId(documentId)) {
      errors.documentId = 'Invalid document ID';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (documentInfo?.status === 'accepted') {
      errors.status = 'Cannot send an already accepted letter';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle send email
  const handleSendEmail = async () => {
    // Validate before sending
    if (!validateBeforeSend()) {
      return;
    }

    // Double-check documentId
    if (!isValidDocumentId(documentId)) {
      setError('Cannot send email: Invalid document ID');
      return;
    }

    setSending(true);
    setError('');
    setSuccess('');
    setSendResult(null);

    try {
      const token = localStorage.getItem('token');
      
      console.log('Sending email with:', {
        documentId,
        email
      });

      const response = await axios.post(
        `${BASE_URL}/api/appointment-letter/send/${documentId}`,
        { email },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Send email response:', response.data);

      if (response.data.success) {
        setSendResult(response.data.data);
        setSuccess(response.data.message || 'Appointment letter sent successfully!');
        
        // Refresh send history
        fetchSendHistory();
        
        if (onSend) {
          onSend(response.data.data);
        }

        // Auto close after 3 seconds on success
        setTimeout(() => {
          if (!sending) {
            handleClose();
          }
        }, 3000);
      } else {
        throw new Error(response.data.message || 'Failed to send email');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      
      // Handle specific error cases
      if (err.response?.status === 404) {
        setError('Appointment letter not found. It may have been deleted.');
      } else if (err.response?.status === 400) {
        if (err.response?.data?.message?.includes('Cast to ObjectId failed')) {
          setError('Invalid document ID format. Please select a valid appointment letter.');
        } else {
          setError(err.response?.data?.message || 'Invalid request');
        }
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to send email');
      }
    } finally {
      setSending(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{
        borderBottom: 1,
        borderColor: '#E0E0E0',
        bgcolor: '#F8FAFC',
        px: 3,
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Send Appointment Letter
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Email appointment letter to candidate
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={sending}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Document ID Error */}
        {!isValidDocumentId(documentId) && !fetching && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<ErrorIcon />}
          >
            <Typography variant="subtitle2" gutterBottom>
              Invalid Document ID
            </Typography>
            <Typography variant="body2">
              Please select a valid appointment letter from the list before sending.
            </Typography>
          </Alert>
        )}

        {/* Loading State */}
        {fetching && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Fetching document details...
            </Typography>
          </Box>
        )}

        {/* Error Message */}
        {error && !fetching && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError('')}
            icon={<ErrorIcon />}
          >
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {success && !fetching && (
          <Alert 
            severity="success" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setSuccess('')}
            icon={<CheckCircleIcon />}
          >
            {success}
          </Alert>
        )}

        {/* Validation Warnings */}
        {Object.keys(validationErrors).length > 0 && !fetching && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<WarningIcon />}
          >
            <Typography variant="subtitle2" gutterBottom>
              Please check the following:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {Object.values(validationErrors).map((err, idx) => (
                <li key={idx}>
                  <Typography variant="body2">{err}</Typography>
                </li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Send Result */}
        {sendResult && !fetching && (
          <Paper sx={{ p: 2, mb: 3, bgcolor: '#E8F5E9', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: SUCCESS_COLOR }}>
                <CheckCircleIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  Email Sent Successfully
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  To: {sendResult.sentTo}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Sent at: {formatDate(sendResult.sentAt)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Send History Toggle */}
        {sendHistory.length > 0 && !fetching && (
          <Box sx={{ mb: 3 }}>
            <Button
              size="small"
              startIcon={<HistoryIcon />}
              onClick={() => setShowHistory(!showHistory)}
              sx={{ color: PRIMARY_BLUE }}
            >
              {showHistory ? 'Hide' : 'Show'} Send History ({sendHistory.length})
            </Button>

            {showHistory && (
              <Paper sx={{ mt: 2, p: 2, bgcolor: '#F5F5F5', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Previous Sends
                </Typography>
                <Stack spacing={1.5}>
                  {sendHistory.map((item, index) => (
                    <Box key={index} sx={{ 
                      p: 1.5, 
                      bgcolor: 'white', 
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: '#E0E0E0'
                    }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {item.sentTo}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="textSecondary">
                            {formatDate(item.sentAt)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Chip
                            label={item.status}
                            size="small"
                            color={item.status === 'sent' ? 'success' : 'default'}
                            sx={{ height: 20, fontSize: '10px' }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}
          </Box>
        )}

        {/* Candidate Info Card */}
        {candidateName && !fetching && (
          <Paper sx={{ p: 2, mb: 3, bgcolor: '#F8FAFC', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: PRIMARY_BLUE }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {candidateName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Document ID: {documentId}
                </Typography>
                {documentInfo?.status && (
                  <Chip
                    label={`Status: ${documentInfo.status}`}
                    size="small"
                    sx={{ 
                      mt: 0.5,
                      height: 20, 
                      fontSize: '10px',
                      bgcolor: documentInfo.status === 'accepted' ? '#d1fae5' : 
                               documentInfo.status === 'sent' ? '#e3f2fd' : '#f1f5f9',
                      color: documentInfo.status === 'accepted' ? '#065f46' :
                             documentInfo.status === 'sent' ? '#1976d2' : '#475569'
                    }}
                  />
                )}
              </Box>
            </Box>
          </Paper>
        )}

        {/* Email Form */}
        {!fetching && isValidDocumentId(documentId) && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color={PRIMARY_BLUE}>
              <EmailIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Email Details
            </Typography>

            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Candidate Email"
                value={email}
                onChange={handleEmailChange}
                error={!!emailError || !!validationErrors.email}
                helperText={emailError || validationErrors.email}
                disabled={sending || fetching}
                placeholder="Enter candidate email address"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  )
                }}
              />

              <Alert severity="info" icon={<InfoIcon />} sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  The appointment letter will be sent as a PDF attachment to the candidate's email address.
                </Typography>
              </Alert>

              <Box sx={{ 
                p: 2, 
                bgcolor: '#F5F5F5', 
                borderRadius: 2,
                border: '1px dashed',
                borderColor: '#BDBDBD'
              }}>
                <Typography variant="subtitle2" gutterBottom>
                  Email Preview:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Subject:</strong> Appointment Letter from Suyash Enterprises
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Dear {candidateName || 'Candidate'},
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Please find attached your appointment letter from Suyash Enterprises. Kindly review the document and follow the instructions to accept your offer.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Regards,<br />
                  HR Department<br />
                  Suyash Enterprises
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: 1,
        borderColor: '#E0E0E0',
        bgcolor: '#F8FAFC',
        gap: 1
      }}>
        <Button
          onClick={handleClose}
          disabled={sending}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSendEmail}
          disabled={
            sending || 
            fetching || 
            !isValidDocumentId(documentId) || 
            !email || 
            !!emailError ||
            documentInfo?.status === 'accepted'
          }
          startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
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
          {sending ? 'Sending...' : 'Send Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendAppointmentLetterEmail;