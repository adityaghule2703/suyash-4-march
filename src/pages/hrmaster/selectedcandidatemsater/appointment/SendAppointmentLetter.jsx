import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
  Stack,
  Paper,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const SendAppointmentLetter = ({ 
  open, 
  onClose, 
  onSend, 
  selectedItem 
}) => {
  // State management
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sentData, setSentData] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [documentExists, setDocumentExists] = useState(false);
  
  // Alert state
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  // Check if document exists on server when dialog opens
  useEffect(() => {
    if (open && selectedItem) {
      setEmail(selectedItem.email || '');
      setSent(false);
      setSentData(null);
      setAlertMessage('');
      
      console.log('Selected Item:', selectedItem);
      
      // Get the MongoDB _id from selected item
      if (selectedItem._id) {
        setDocumentId(selectedItem._id);
        console.log('Using Document ID for API:', selectedItem._id);
        // Check if document exists on server
        checkDocumentExists(selectedItem._id);
      } else {
        setAlertMessage('No document ID found. Please generate the appointment letter first.');
        setAlertSeverity('warning');
      }
    }
  }, [open, selectedItem]);

  // Check if the document exists on server
  const checkDocumentExists = async (id) => {
    setCheckingStatus(true);
    try {
      const token = localStorage.getItem('token');
      
      // Try to fetch the document status
      const response = await axios.get(
        `${BASE_URL}/api/appointment-letter/${id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setDocumentExists(true);
        setAlertMessage('Document ready to send');
        setAlertSeverity('success');
        setTimeout(() => setAlertMessage(''), 3000);
      } else {
        setDocumentExists(false);
        setAlertMessage('Document not found on server. Please generate the letter again.');
        setAlertSeverity('warning');
      }
    } catch (error) {
      console.error('Error checking document:', error);
      setDocumentExists(false);
      if (error.response?.status === 404) {
        setAlertMessage('Document not found on server. Please generate the letter again.');
      } else {
        setAlertMessage('Could not verify document status.');
      }
      setAlertSeverity('warning');
    } finally {
      setCheckingStatus(false);
    }
  };

  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (alertSeverity === 'error') {
      setAlertMessage('');
    }
  };

  // Validate email
  const validateEmail = () => {
    if (!email) {
      setAlertMessage('Please enter recipient email address');
      setAlertSeverity('error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlertMessage('Please enter a valid email address');
      setAlertSeverity('error');
      return false;
    }

    return true;
  };

  // Send appointment email
  const handleSendEmail = async () => {
    setAlertMessage('');

    if (!validateEmail()) {
      return;
    }

    if (!documentId) {
      setAlertMessage('No document ID found. Please generate the appointment letter first.');
      setAlertSeverity('error');
      return;
    }

    if (!documentExists) {
      setAlertMessage('Document not found on server. Please generate the letter again.');
      setAlertSeverity('error');
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      
      console.log('Sending to:', `${BASE_URL}/api/appointment-letter/send/${documentId}`);
      console.log('With email:', email);
      
      const response = await axios.post(
        `${BASE_URL}/api/appointment-letter/send/${documentId}`,
        { 
          email: email 
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
        setSentData(response.data.data);
        setSent(true);
        setAlertMessage(response.data.message || 'Email sent successfully!');
        setAlertSeverity('success');

        if (onSend) {
          onSend(response.data.data || response.data);
        }
      } else {
        throw new Error(response.data.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      
      if (error.response?.status === 404) {
        setAlertMessage('Document not found. Please generate the appointment letter first.');
        setDocumentExists(false);
      } else if (error.response?.status === 500) {
        setAlertMessage('Server error. Please try again.');
      } else {
        setAlertMessage(error.response?.data?.message || error.message || 'Failed to send email');
      }
      setAlertSeverity('error');
    } finally {
      setSending(false);
    }
  };

  // Handle close
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Reset state
  const resetState = () => {
    setSending(false);
    setSent(false);
    setSentData(null);
    setDocumentId(null);
    setCheckingStatus(false);
    setDocumentExists(false);
    setAlertMessage('');
    setAlertSeverity('info');
  };

  // Handle send another
  const handleSendAnother = () => {
    setSent(false);
    setSentData(null);
    setAlertMessage('');
    if (selectedItem?._id) {
      checkDocumentExists(selectedItem._id);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  // Get display name
  const getDisplayName = () => {
    if (!selectedItem) return 'Candidate';
    return selectedItem.fullName || 
           `${selectedItem.firstName || ''} ${selectedItem.lastName || ''}`.trim() || 
           selectedItem.candidateName ||
           'Candidate';
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
            {sent ? 'Email Sent' : 'Send Appointment Letter'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {sent ? 'Email delivery confirmation' : 'Send letter to candidate via email'}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, px: 3 }}>
        {!sent ? (
          <>
            {/* Status Check Indicator */}
            {checkingStatus && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, alignItems: 'center' }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Verifying document...
                </Typography>
              </Box>
            )}

            {/* Sending Indicator */}
            {sending && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, alignItems: 'center' }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Sending email...
                </Typography>
              </Box>
            )}

            {/* Candidate Info */}
            {selectedItem && (
              <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#00B4D8' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {getDisplayName()}
                    </Typography>
                    <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                      <Typography variant="caption" color="textSecondary">
                        ID: {selectedItem.candidateId || selectedItem._id || 'N/A'}
                      </Typography>
                      {selectedItem.offerDesignation && (
                        <Typography variant="caption" color="textSecondary">
                          {selectedItem.offerDesignation}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            )}

            {/* Document Status */}
            {selectedItem?.documentId && (
              <Alert 
                severity={documentExists ? "success" : "warning"} 
                sx={{ mb: 3 }}
                icon={documentExists ? <CheckCircleIcon /> : <ErrorIcon />}
              >
                <Box>
                  <Typography variant="body2">
                    Document ID: <strong>{selectedItem.documentId}</strong>
                  </Typography>
                  <Typography variant="body2">
                    MongoDB ID: <strong>{documentId}</strong>
                  </Typography>
                  <Typography variant="caption" color={documentExists ? "success.main" : "error.main"}>
                    {documentExists 
                      ? '✓ Document verified on server' 
                      : '⚠️ Document not found on server - Please generate the letter first'}
                  </Typography>
                </Box>
              </Alert>
            )}
            
            {/* Email Input */}
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                required
                label="Recipient Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                variant="outlined"
                size="medium"
                placeholder="candidate@example.com"
                error={alertSeverity === 'error' && alertMessage.includes('email')}
                disabled={sending || checkingStatus}
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ color: '#64748B', mr: 1, fontSize: 20 }} />
                  ),
                }}
              />
              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                The appointment letter will be sent to this email address
              </Typography>
            </Box>

            {/* Inline Alert Message */}
            {alertMessage && (
              <Alert 
                severity={alertSeverity} 
                sx={{ mt: 2, mb: 1 }}
                onClose={alertSeverity !== 'success' ? () => setAlertMessage('') : undefined}
              >
                {alertMessage}
              </Alert>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                The email will contain the appointment letter as an attachment.
                Make sure the email address is correct.
              </Typography>
            </Alert>
          </>
        ) : (
          /* Success Screen */
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Email Sent Successfully!
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              The appointment letter has been sent to {email}
            </Typography>
            
            {sentData && (
              <Paper sx={{ 
                p: 2, 
                bgcolor: '#f8fafc', 
                borderRadius: 2,
                maxWidth: 400,
                mx: 'auto',
                mb: 3,
                textAlign: 'left'
              }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#1976D2' }}>
                  Delivery Details
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="textSecondary">Document ID:</Typography>
                    <Typography variant="caption" fontWeight={500}>{sentData.documentId || selectedItem?.documentId}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="textSecondary">Sent To:</Typography>
                    <Typography variant="caption" fontWeight={500}>{sentData.sentTo || email}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="textSecondary">Sent At:</Typography>
                    <Typography variant="caption" fontWeight={500}>{formatDate(sentData.sentAt)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="textSecondary">Status:</Typography>
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        bgcolor: '#d1fae5',
                        color: '#065f46'
                      }}
                    >
                      {sentData.status}
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            )}
          </Box>
        )}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: 1,
        borderColor: '#E0E0E0',
        bgcolor: '#F8FAFC',
        justifyContent: 'space-between'
      }}>
        <Button onClick={handleClose}>
          {sent ? 'CLOSE' : 'CANCEL'}
        </Button>
        
        {!sent ? (
          <Button
            variant="contained"
            onClick={handleSendEmail}
            disabled={sending || checkingStatus || !email || !documentId || !documentExists}
            startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              background: 'linear-gradient(135deg, #164e63, #00B4D8)',
              minWidth: 120,
              '&:hover': {
                background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
              },
              '&.Mui-disabled': {
                background: '#e0e0e0'
              }
            }}
          >
            {sending ? 'SENDING...' : 'SEND EMAIL'}
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={handleSendAnother}
            sx={{
              borderColor: '#00B4D8',
              color: '#00B4D8',
              '&:hover': {
                borderColor: '#0096b4',
                bgcolor: 'rgba(0, 180, 216, 0.04)'
              }
            }}
          >
            SEND ANOTHER
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SendAppointmentLetter;