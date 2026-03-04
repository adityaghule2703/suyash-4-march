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
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Verified as VerifiedIcon,
  VerifiedUser as VerifiedUserIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const VerifyDocument = ({ open, onClose, onComplete, document, candidate }) => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [apiErrorDetails, setApiErrorDetails] = useState(null);

  // Simple form state
  const [verificationStatus, setVerificationStatus] = useState('verified');
  const [comments, setComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const getAuthToken = () => {
    return localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken') ||
      '';
  };

  useEffect(() => {
    if (open && document) {
      resetForm();
      fetchDocumentDetails(document.id || document._id);
    }
  }, [open, document]);

  const resetForm = () => {
    setError(null);
    setApiErrorDetails(null);
    setVerificationStatus('verified');
    setComments('');
    setRejectionReason('');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Fetch document details
  const fetchDocumentDetails = async (documentId) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');

      console.log('Fetching document details for ID:', documentId);
      
      const response = await axios.get(
        `${BASE_URL}/api/documents/${documentId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      console.log('Document details response:', response.data);

      if (response.data.success) {
        setDocumentData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch document details');
      }
    } catch (err) {
      console.error('Error fetching document details:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch document details');
    } finally {
      setLoading(false);
    }
  };

  // Try different request formats
  const tryRequestFormats = async (documentId, token) => {
    const formats = [
      // Format 1: Just status
      { status: verificationStatus },
      
      // Format 2: Status and message
      { 
        status: verificationStatus, 
        message: verificationStatus === 'verified' ? comments : rejectionReason 
      },
      
      // Format 3: Status and comments
      { 
        status: verificationStatus, 
        comments: verificationStatus === 'verified' ? comments : rejectionReason 
      },
      
      // Format 4: Status and reason
      { 
        status: verificationStatus, 
        reason: verificationStatus === 'verified' ? comments : rejectionReason 
      },
      
      // Format 5: isVerified boolean
      { 
        isVerified: verificationStatus === 'verified',
        comments: verificationStatus === 'verified' ? comments : rejectionReason
      },
      
      // Format 6: verified (boolean) and remarks
      { 
        verified: verificationStatus === 'verified',
        remarks: verificationStatus === 'verified' ? comments : rejectionReason
      },
      
      // Format 7: action and note
      { 
        action: verificationStatus,
        note: verificationStatus === 'verified' ? comments : rejectionReason
      }
    ];

    for (let i = 0; i < formats.length; i++) {
      try {
        console.log(`Trying format ${i + 1}:`, formats[i]);
        
        const response = await axios.put(
          `${BASE_URL}/api/documents/${documentId}/verify`,
          formats[i],
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        
        console.log(`Format ${i + 1} succeeded:`, response.data);
        return { success: true, data: response.data, format: i + 1 };
      } catch (err) {
        console.log(`Format ${i + 1} failed:`, err.response?.data || err.message);
        // Continue to next format
      }
    }
    
    return { success: false, error: 'All formats failed' };
  };

  // Handle verify document
  const handleVerifyDocument = async () => {
    const documentId = document?.id || document?._id;
    
    if (!documentId) {
      showSnackbar('Missing document ID', 'error');
      return;
    }

    // Basic validation
    if (verificationStatus === 'rejected' && !rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    if (verificationStatus === 'verified' && !comments.trim()) {
      setError('Please add verification comments');
      return;
    }

    setVerifying(true);
    setError(null);
    setApiErrorDetails(null);

    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');

      // Try different request formats
      const result = await tryRequestFormats(documentId, token);

      if (result.success) {
        showSnackbar(`Document ${verificationStatus} successfully!`, 'success');
        
        console.log(`Success using format ${result.format}`);

        if (onComplete) {
          onComplete({
            id: documentId,
            documentId: document?.documentId || result.data.data?.documentId,
            status: verificationStatus,
            comments: verificationStatus === 'verified' ? comments : rejectionReason
          });
        }

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error('Failed to verify document with any format');
      }
    } catch (err) {
      console.error('Error verifying document:', err);
      
      let errorMessage = 'Failed to verify document';
      
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error status:', err.response.status);
        
        // Store the error details from API
        setApiErrorDetails({
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
        
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Error ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setVerifying(false);
    }
  };

  // Get document display name
  const getDocumentDisplayName = () => {
    if (document?.documentId) return document.documentId;
    if (document?._id) return document._id.substring(0, 8) + '...';
    return 'Unknown';
  };

  // Get candidate display name
  const getCandidateDisplayName = () => {
    if (candidate?.name) return candidate.name;
    if (documentData?.candidateName) return documentData.candidateName;
    if (document?.candidateName) return document.candidateName;
    return 'Unknown';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 1.5 } }}
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
          <VerifiedUserIcon sx={{ color: '#1976D2' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Verify Document
          </Typography>
          {document && (
            <Chip
              label={getDocumentDisplayName()}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small" disabled={verifying}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2, bgcolor: '#F5F7FA' }}>
        {/* Document Info Summary */}
        {documentData && !loading && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#E3F2FD', borderRadius: 1, border: '1px solid #90CAF9' }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon fontSize="small" color="primary" />
                  <Typography variant="body2">
                    <strong>Document ID:</strong> {documentData?.documentId || document?._id?.substring(0, 8) || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" color="primary" />
                  <Typography variant="body2">
                    <strong>Candidate:</strong> {getCandidateDisplayName()}
                  </Typography>
                </Box>
              </Grid>
              {documentData?.type && (
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Type:</strong> {documentData.type}
                  </Typography>
                </Grid>
              )}
              {documentData?.status && (
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Current Status:</strong>{' '}
                    <Chip
                      label={documentData.status}
                      size="small"
                      color={documentData.status === 'pending' ? 'warning' : 'default'}
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        ) : (
          <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1 }}>
            {/* Verification Status Selection */}
            <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
              <FormLabel component="legend" sx={{ fontWeight: 500, mb: 1 }}>
                Verification Decision *
              </FormLabel>
              <RadioGroup
                row
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
              >
                <FormControlLabel 
                  value="verified" 
                  control={<Radio color="success" />} 
                  label="Verify" 
                />
                <FormControlLabel 
                  value="rejected" 
                  control={<Radio color="error" />} 
                  label="Reject" 
                />
              </RadioGroup>
            </FormControl>

            {verificationStatus === 'verified' && (
              <TextField
                fullWidth
                label="Verification Comments *"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                multiline
                rows={3}
                size="small"
                placeholder="Add your verification notes here..."
                sx={{ mb: 2 }}
              />
            )}

            {verificationStatus === 'rejected' && (
              <TextField
                fullWidth
                label="Rejection Reason *"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                multiline
                rows={3}
                size="small"
                placeholder="Please provide detailed reason for rejection..."
                sx={{ mb: 2 }}
              />
            )}

            {verificationStatus === 'rejected' && (
              <Box sx={{
                p: 1.5,
                bgcolor: '#FFEBEE',
                borderRadius: 1,
                border: '1px solid #FFCDD2',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2
              }}>
                <WarningIcon sx={{ color: '#f44336' }} />
                <Typography variant="caption" color="error">
                  Rejecting this document will notify the candidate and may require them to re-upload.
                </Typography>
              </Box>
            )}

            {/* Show API error details if available */}
            {apiErrorDetails && (
              <Paper sx={{ p: 1, mt: 2, bgcolor: '#FFEBEE', borderRadius: 1 }}>
                <Typography variant="caption" color="error" component="div">
                  <strong>API Error Details:</strong><br/>
                  Status: {apiErrorDetails.status}<br/>
                  Response: {JSON.stringify(apiErrorDetails.data)}
                </Typography>
              </Paper>
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
        <Button onClick={onClose} disabled={verifying} variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleVerifyDocument}
          disabled={verifying || loading || !documentData}
          startIcon={verifying ? <CircularProgress size={20} /> : (verificationStatus === 'verified' ? <ThumbUpIcon /> : <ThumbDownIcon />)}
          sx={{
            backgroundColor: verificationStatus === 'verified' ? '#4CAF50' : '#f44336',
            '&:hover': {
              backgroundColor: verificationStatus === 'verified' ? '#45a049' : '#d32f2f'
            },
            minWidth: 150
          }}
        >
          {verifying ? 'Processing...' : (verificationStatus === 'verified' ? 'Verify Document' : 'Reject Document')}
        </Button>
      </DialogActions>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default VerifyDocument;