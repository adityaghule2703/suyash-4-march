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
  Snackbar
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  PictureAsPdf as PdfIcon,
  Description as HtmlIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const GenerateOfferLetter = ({ open, onClose, onComplete, candidate }) => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [offerHtml, setOfferHtml] = useState(null);
  const [offerDetails, setOfferDetails] = useState(null);
  
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
      setOfferHtml(null);
      setOfferDetails(null);
      
      // If candidate has offerId, fetch the offer letter
      if (candidate.offerId) {
        fetchOfferLetter(candidate.offerId);
      } else {
        setError('No offer ID found for this candidate');
        showSnackbar('No offer ID found for this candidate', 'error');
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

  // Fetch the offer letter HTML
  const fetchOfferLetter = async (offerId) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      console.log(`Fetching offer letter for offer ID: ${offerId}`);
      
      showSnackbar('Generating offer letter...', 'info');
      
      const response = await axios.get(
        `${BASE_URL}/api/offers/${offerId}/generate-letter`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/html, application/json'
          },
          responseType: 'text' // Important: Get response as text for HTML
        }
      );

      console.log('Offer letter response received');
      
      // Check if response is HTML or JSON
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        // It's HTML content
        setOfferHtml(response.data);
        showSnackbar('Offer letter generated successfully!', 'success');
        
        // Try to extract basic offer details from HTML for display
        extractOfferDetailsFromHtml(response.data);
      } else if (response.data.success && response.data.data) {
        // Handle if API returns JSON with HTML inside
        const htmlContent = response.data.data.html || response.data.data;
        if (htmlContent && typeof htmlContent === 'string' && htmlContent.includes('<!DOCTYPE html>')) {
          setOfferHtml(htmlContent);
          showSnackbar('Offer letter generated successfully!', 'success');
          extractOfferDetailsFromHtml(htmlContent);
        } else {
          setError('Invalid response format from server');
          showSnackbar('Invalid response format from server', 'error');
        }
      } else {
        setError('Failed to generate offer letter');
        showSnackbar('Failed to generate offer letter', 'error');
      }
    } catch (err) {
      console.error('Error fetching offer letter:', err);
      
      let errorMessage = 'Failed to generate offer letter';
      
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Offer not found';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (err.response.data) {
          // Try to extract error message from response
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Extract basic offer details from HTML (optional - for display purposes)
  const extractOfferDetailsFromHtml = (html) => {
    try {
      // Create a temporary DOM element to parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Try to extract candidate name
      const nameElement = doc.querySelector('p:contains("Dear") strong') || 
                         doc.querySelector('strong:contains("Dear")');
      
      // Try to extract position
      const positionElement = Array.from(doc.querySelectorAll('td')).find(
        td => td.textContent.includes('Position') || td.textContent.includes('position')
      );
      
      // Try to extract offer ID
      const offerIdElement = Array.from(doc.querySelectorAll('p')).find(
        p => p.textContent.includes('Offer ID:')
      );
      
      // Try to extract CTC
      const ctcElement = Array.from(doc.querySelectorAll('.total td, .total th')).find(
        el => el.textContent.includes('₹')
      );
      
      setOfferDetails({
        candidateName: nameElement?.nextSibling?.textContent || candidate?.name || 'Unknown',
        position: positionElement?.nextElementSibling?.textContent || candidate?.position || 'Unknown',
        offerId: offerIdElement?.textContent?.replace('Offer ID:', '').trim() || candidate?.offerId,
        totalCtc: ctcElement?.textContent?.match(/₹[\d,]+/)?.[0] || 'Not specified',
        generatedDate: new Date().toLocaleDateString()
      });
    } catch (e) {
      console.log('Could not extract details from HTML:', e);
      setOfferDetails({
        candidateName: candidate?.name || 'Unknown',
        position: candidate?.position || 'Unknown',
        offerId: candidate?.offerId,
        totalCtc: 'Not specified',
        generatedDate: new Date().toLocaleDateString()
      });
    }
  };

  // Handle regenerate offer letter
  const handleRegenerate = () => {
    if (candidate?.offerId) {
      fetchOfferLetter(candidate.offerId);
    }
  };

  // Handle download as HTML file
  const handleDownloadHtml = () => {
    if (!offerHtml) return;

    try {
      const blob = new Blob([offerHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `offer_letter_${candidate?.name || 'candidate'}_${candidate?.offerId || ''}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSnackbar('Offer letter downloaded successfully!', 'success');
    } catch (error) {
      showSnackbar('Failed to download offer letter', 'error');
    }
  };

  // Handle print
  const handlePrint = () => {
    if (!offerHtml) return;

    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(offerHtml);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        showSnackbar('Print dialog opened successfully', 'success');
      } else {
        showSnackbar('Please allow pop-ups to print the offer letter', 'warning');
      }
    } catch (error) {
      showSnackbar('Failed to open print dialog', 'error');
    }
  };

  // Handle mark as generated and close
  const handleMarkGenerated = () => {
    if (onComplete) {
      onComplete({
        id: candidate?.id,
        candidateId: candidate?.candidateId,
        offerId: candidate?.offerId,
        status: 'generated',
        applicationStatus: 'generated'
      });
      
      showSnackbar('Offer marked as generated successfully!', 'success');
      
      // Close dialog after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      onClose();
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
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
            <HtmlIcon sx={{ color: '#1976D2' }} />
            <Typography variant="subtitle1" fontWeight={600}>
              Generate Offer Letter
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
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, bgcolor: '#F5F7FA', overflow: 'auto', flex: 1 }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              gap: 2
            }}>
              <CircularProgress />
              <Typography color="textSecondary">Generating offer letter...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ p: 3 }}>
              <Alert 
                severity="error"
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={() => candidate?.offerId && fetchOfferLetter(candidate.offerId)}
                  >
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
              
              {candidate?.offerId && (
                <Paper sx={{ mt: 2, p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Debug Information:</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Candidate: {candidate.name}<br />
                    Offer ID: {candidate.offerId}<br />
                    API Endpoint: {`${BASE_URL}/api/offers/${candidate.offerId}/generate-letter`}
                  </Typography>
                </Paper>
              )}
            </Box>
          ) : offerHtml ? (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Preview toolbar */}
              <Box sx={{ 
                p: 1, 
                bgcolor: '#FFFFFF', 
                borderBottom: '1px solid #E0E0E0',
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadHtml}
                >
                  Download
                </Button>
                {/* <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                >
                  Print
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={handleRegenerate}
                >
                  Regenerate
                </Button> */}
                
                <Box sx={{ flex: 1 }} />
                
                {offerDetails && (
                  <Typography variant="caption" color="textSecondary">
                    Generated: {offerDetails.generatedDate}
                  </Typography>
                )}
              </Box>
              
              {/* HTML Preview */}
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto',
                bgcolor: '#FFFFFF',
                '& iframe': {
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }
              }}>
                <iframe
                  srcDoc={offerHtml}
                  title="Offer Letter Preview"
                  sandbox="allow-same-origin"
                />
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                No offer letter available. Click "Generate" to create one.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          p: 2, 
          borderTop: '1px solid #E0E0E0', 
          bgcolor: '#F8FAFC', 
          justifyContent: 'space-between' 
        }}>
          <Button 
            onClick={onClose} 
            size="small"
            sx={{ color: '#666' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleMarkGenerated}
            disabled={!offerHtml || loading}
            size="small"
            startIcon={<HtmlIcon />}
            sx={{
              backgroundColor: '#1976D2',
              '&:hover': { backgroundColor: '#1565C0' }
            }}
          >
            Mark as Generated
          </Button>
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
            success: <SuccessIcon fontSize="inherit" />,
            error: <ErrorIcon fontSize="inherit" />,
            info: <RefreshIcon fontSize="inherit" />,
            warning: <ErrorIcon fontSize="inherit" />
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GenerateOfferLetter;