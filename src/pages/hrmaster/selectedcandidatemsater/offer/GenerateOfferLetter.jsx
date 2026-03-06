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
  Description as HtmlIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

const GenerateOfferLetter = ({ open, onClose, onComplete, candidate }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingOffer, setFetchingOffer] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [offerHtml, setOfferHtml] = useState(null);
  const [offerDetails, setOfferDetails] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);
  
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

  // Function to clean HTML content - remove the note and optimize for one page
  const cleanHtmlContent = (html) => {
    if (!html) return html;
    
    try {
      // Create a temporary DOM element to parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Remove the note div (the one with the warning message)
      const noteDivs = doc.querySelectorAll('.note, div:contains("PDF generation is currently unavailable")');
      noteDivs.forEach(div => div.remove());
      
      // Also look for any div with warning text
      const allDivs = doc.querySelectorAll('div');
      allDivs.forEach(div => {
        if (div.textContent && div.textContent.includes('PDF generation is currently unavailable')) {
          div.remove();
        }
      });
      
      // Optimize styles for one-page printing
      const style = doc.createElement('style');
      style.textContent = `
        @media print {
          body { margin: 0; padding: 15px; font-size: 11pt; }
          .container { max-width: 100%; margin: 0; padding: 10px; }
          table { font-size: 10pt; }
          td, th { padding: 6px 8px; }
          .header { margin-bottom: 15px; padding-bottom: 10px; }
          .section { margin: 15px 0; }
          .footer { margin-top: 15px; padding-top: 10px; }
        }
        body { font-family: Arial, sans-serif; margin: 15px; line-height: 1.4; }
        .container { max-width: 100%; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #003366; padding-bottom: 10px; }
        .company-name { font-size: 22px; font-weight: bold; color: #003366; }
        .section { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; font-size: 11pt; }
        td, th { padding: 8px; border: 1px solid #ddd; }
        th { background: #003366; color: white; font-size: 11pt; }
        .total { font-weight: bold; background: #f0f0f0; }
        .footer { margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 10pt; }
      `;
      
      doc.head.appendChild(style);
      
      // Return the modified HTML
      return doc.documentElement.outerHTML;
    } catch (e) {
      console.error('Error cleaning HTML:', e);
      
      // Fallback: simple string replacement
      let cleanedHtml = html
        .replace(/<div class="note">.*?PDF generation is currently unavailable.*?<\/div>/gs, '')
        .replace(/<div>.*?PDF generation is currently unavailable.*?<\/div>/gs, '')
        .replace(/Note: PDF generation is currently unavailable.*?(?=<)/g, '');
      
      return cleanedHtml;
    }
  };

  // Reset state when dialog opens with new candidate
  useEffect(() => {
    if (open && candidate) {
      console.log('🔵 GenerateOfferLetter opened for candidate:', candidate);
      resetState();
      fetchLatestApprovedOffer(candidate);
    }
  }, [open, candidate]);

  const resetState = () => {
    setError(null);
    setOfferHtml(null);
    setOfferDetails(null);
    setSelectedOffer(null);
    setCandidateInfo(null);
    setFetchingOffer(false);
    setGenerating(false);
  };

  // Fetch the latest approved offer for the candidate
  const fetchLatestApprovedOffer = async (candidateData) => {
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
      
      console.log('🔵 Fetching approved offer for candidate ID:', candidateId);

      if (!candidateId) {
        throw new Error('Invalid candidate ID');
      }

      // Set candidate info from passed data
      setCandidateInfo(candidateData);
      
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
      
      // Filter for offers that are approved (ready for generation)
      const approvedOffers = offersArray.filter(offer => {
        if (!offer) return false;
        
        const status = (offer.status || '').toLowerCase();
        const offerStatus = (offer.offerStatus || '').toLowerCase();
        const appStatus = (offer.applicationStatus || '').toLowerCase();
        
        return status === 'approved' || 
               status === 'accepted' ||
               offerStatus === 'approved' || 
               offerStatus === 'accepted' ||
               appStatus === 'generated' || 
               appStatus === 'accepted';
      });
      
      console.log('🔵 Approved offers:', approvedOffers);
      
      if (approvedOffers.length === 0) {
        setError(`No approved offers found for ${candidateData.name || 'this candidate'}. Please approve the offer first.`);
        showSnackbar(`No approved offers found. Please approve the offer first.`, 'warning');
        setFetchingOffer(false);
        return;
      }
      
      // Sort by creation date (newest first)
      const sortedOffers = approvedOffers.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.createdDate || a.updatedAt || 0);
        const dateB = new Date(b.createdAt || b.createdDate || b.updatedAt || 0);
        return dateB - dateA;
      });
      
      // Set the latest approved offer
      const latestOffer = sortedOffers[0];
      console.log('🔵 Latest approved offer selected:', latestOffer);
      
      setSelectedOffer(latestOffer);
      
      // Automatically fetch the offer letter for this offer
      if (latestOffer._id || latestOffer.id) {
        const offerId = latestOffer._id || latestOffer.id;
        fetchOfferLetter(offerId);
      } else {
        setError('Selected offer has no valid ID');
        showSnackbar('Selected offer has no valid ID', 'error');
      }
      
    } catch (err) {
      console.error('🔴 Error fetching approved offer:', err);
      setError(`Error fetching offer details: ${err.message}`);
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setFetchingOffer(false);
    }
  };

  // Fetch the offer letter HTML
  const fetchOfferLetter = async (offerId) => {
    setGenerating(true);
    setError(null);

    try {
      const token = getAuthToken();
      console.log(`🔵 Fetching offer letter for offer ID: ${offerId}`);
      
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

      console.log('🔵 Offer letter response received, status:', response.status);
      
      // Check if response is HTML or JSON
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        // Clean the HTML content (remove note and optimize)
        const cleanedHtml = cleanHtmlContent(response.data);
        setOfferHtml(cleanedHtml);
        showSnackbar('Offer letter generated successfully!', 'success');
        
        // Try to extract basic offer details from HTML for display
        extractOfferDetailsFromHtml(cleanedHtml);
      } else if (response.data.success && response.data.data) {
        // Handle if API returns JSON with HTML inside
        const htmlContent = response.data.data.html || response.data.data;
        if (htmlContent && typeof htmlContent === 'string' && htmlContent.includes('<!DOCTYPE html>')) {
          const cleanedHtml = cleanHtmlContent(htmlContent);
          setOfferHtml(cleanedHtml);
          showSnackbar('Offer letter generated successfully!', 'success');
          extractOfferDetailsFromHtml(cleanedHtml);
        } else {
          setError('Invalid response format from server');
          showSnackbar('Invalid response format from server', 'error');
        }
      } else {
        setError('Failed to generate offer letter');
        showSnackbar('Failed to generate offer letter', 'error');
      }
    } catch (err) {
      console.error('🔴 Error fetching offer letter:', err);
      
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
      setGenerating(false);
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
        candidateName: nameElement?.nextSibling?.textContent || candidateInfo?.name || candidate?.name || 'Unknown',
        position: positionElement?.nextElementSibling?.textContent || candidateInfo?.position || candidate?.position || 'Unknown',
        offerId: offerIdElement?.textContent?.replace('Offer ID:', '').trim() || selectedOffer?.offerId || candidate?.offerId,
        totalCtc: ctcElement?.textContent?.match(/₹[\d,]+/)?.[0] || 'Not specified',
        generatedDate: new Date().toLocaleDateString()
      });
    } catch (e) {
      console.log('Could not extract details from HTML:', e);
      setOfferDetails({
        candidateName: candidateInfo?.name || candidate?.name || 'Unknown',
        position: candidateInfo?.position || candidate?.position || 'Unknown',
        offerId: selectedOffer?.offerId || candidate?.offerId,
        totalCtc: 'Not specified',
        generatedDate: new Date().toLocaleDateString()
      });
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

  // Handle regenerate offer letter
  const handleRegenerate = () => {
    if (selectedOffer?._id || selectedOffer?.id) {
      const offerId = selectedOffer._id || selectedOffer.id;
      fetchOfferLetter(offerId);
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
      link.download = `offer_letter_${candidateInfo?.name || candidate?.name || 'candidate'}_${selectedOffer?.offerId || candidate?.offerId || ''}.html`;
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
        id: candidate?.id || candidateInfo?.id,
        candidateId: candidate?.candidateId || candidateInfo?.candidateId,
        offerId: selectedOffer?.offerId || candidate?.offerId,
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

  const isLoading = fetchingOffer || generating;
  const candidateName = candidateInfo?.name || candidate?.name || 'Unknown';
  const offerId = selectedOffer?.offerId || candidate?.offerId;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <HtmlIcon sx={{ color: '#1976D2' }} />
            <Typography variant="subtitle1" fontWeight={600}>
              Generate Offer Letter
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
            {offerId && (
              <Chip 
                label={`ID: ${offerId}`}
                size="small"
                color="secondary"
                variant="outlined"
                sx={{ ml: 1 }}
              />
            )}
            {selectedOffer && (
              <Chip 
                label="Approved"
                size="small"
                color="success"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="small" disabled={isLoading}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, bgcolor: '#F5F7FA', overflow: 'auto', flex: 1 }}>
          {fetchingOffer ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              gap: 2
            }}>
              <CircularProgress />
              <Typography color="textSecondary">Fetching latest approved offer for {candidateName}...</Typography>
            </Box>
          ) : generating ? (
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
                    onClick={() => candidate && fetchLatestApprovedOffer(candidate)}
                  >
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
              
              {candidate && (
                <Paper sx={{ mt: 2, p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Debug Information:</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Candidate: {candidateName}<br />
                    Candidate ID: {candidate?.id || candidate?._id || candidate?.candidateId}<br />
                    {selectedOffer && `Offer ID: ${selectedOffer.offerId || selectedOffer._id}`}
                  </Typography>
                </Paper>
              )}
            </Box>
          ) : !selectedOffer ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                No approved offer found for {candidateName}. Please approve the offer first.
              </Typography>
            </Box>
          ) : !offerHtml ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                No offer letter available. Click "Regenerate" to create one.
              </Typography>
            </Box>
          ) : (
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
                </Button> */}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={handleRegenerate}
                  disabled={generating}
                >
                  Regenerate
                </Button>
                
                <Box sx={{ flex: 1 }} />
                
                {offerDetails && (
                  <Typography variant="caption" color="textSecondary">
                    Generated: {offerDetails.generatedDate}
                  </Typography>
                )}
              </Box>
              
              {/* HTML Preview - with zoom to fit */}
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto',
                bgcolor: '#FFFFFF',
                p: 2,
                '& iframe': {
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  transform: 'scale(0.9)',
                  transformOrigin: 'top left'
                }
              }}>
                <iframe
                  srcDoc={offerHtml}
                  title="Offer Letter Preview"
                  sandbox="allow-same-origin"
                />
              </Box>
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
            disabled={isLoading}
            sx={{ color: '#666' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleMarkGenerated}
            disabled={!offerHtml || isLoading}
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