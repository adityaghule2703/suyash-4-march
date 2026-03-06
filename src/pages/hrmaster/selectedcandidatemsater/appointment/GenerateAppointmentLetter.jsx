import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  MenuItem,
  Grid,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  TextField
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  Email as EmailIcon,
   Description as DescriptionIcon, // Add this missing import
  Person as PersonIcon // Also add this if not already imported
} from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

// Color constants
const PRIMARY_BLUE = '#00B4D8';

const GenerateAppointmentLetter = ({ open, onClose, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  // Data states
  const [candidates, setCandidates] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedOfferDetails, setSelectedOfferDetails] = useState(null);
  const [fetchingCandidates, setFetchingCandidates] = useState(false);
  const [fetchingOffers, setFetchingOffers] = useState(false);
  const [fetchingOfferDetails, setFetchingOfferDetails] = useState(false);

  // Form state
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedOffer, setSelectedOffer] = useState('');

  // Generated letter state
  const [generatedLetter, setGeneratedLetter] = useState(null);

  // Error/Success state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});

  const steps = ['Select Candidate', 'Select Offer', 'Generate'];

  // Get candidate details safely
  const getCandidateDetails = () => {
    return candidates.find(c => c._id === selectedCandidate);
  };

  // Get offer display details safely
  const getOfferDisplayDetails = () => {
    return offers.find(o => o._id === selectedOffer);
  };

  // These will be defined after state initialization
  const candidateDetails = selectedCandidate ? getCandidateDetails() : null;
  const offerDisplayDetails = selectedOffer ? getOfferDisplayDetails() : null;
  const offerDetails = selectedOfferDetails || offerDisplayDetails;

  // Fetch candidates on open
  useEffect(() => {
    if (open) {
      fetchCandidates();
      resetState();
    }
  }, [open]);

  // Fetch offers when candidate is selected
  useEffect(() => {
    if (selectedCandidate) {
      fetchAcceptedOffersForCandidate(selectedCandidate);
    } else {
      setOffers([]);
      setSelectedOffer('');
      setSelectedOfferDetails(null);
    }
  }, [selectedCandidate]);

  // Fetch offer details when offer is selected
  useEffect(() => {
    if (selectedOffer) {
      fetchOfferDetails(selectedOffer);
    } else {
      setSelectedOfferDetails(null);
    }
  }, [selectedOffer]);

  // Set email from candidate details when available
  useEffect(() => {
    if (candidateDetails?.email) {
      setEmailAddress(candidateDetails.email);
    }
  }, [candidateDetails]);

  const resetState = () => {
    setStep(0);
    setSelectedCandidate('');
    setSelectedOffer('');
    setGeneratedLetter(null);
    setError('');
    setSuccess('');
    setOffers([]);
    setSelectedOfferDetails(null);
    setValidationErrors({});
    setPreviewHtml(null);
    setShowPreview(false);
    setShowEmailDialog(false);
    setEmailSent(false);
    setEmailError('');
    setEmailSuccess('');
  };

  // Fetch candidates
  const fetchCandidates = async () => {
    setFetchingCandidates(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/candidates?status=selected`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setCandidates(response.data.data || []);
      } else {
        setError('Failed to fetch candidates');
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError(err.response?.data?.message || 'Failed to fetch candidates');
    } finally {
      setFetchingCandidates(false);
    }
  };

  // Fetch accepted offers for selected candidate
  const fetchAcceptedOffersForCandidate = async (candidateId) => {
    setFetchingOffers(true);
    setError('');
    setOffers([]);
    setSelectedOffer('');
    setSelectedOfferDetails(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/offers?status=accepted`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const allOffers = response.data.data?.offers || [];
        const candidateOffers = allOffers.filter(offer => {
          const offerCandidateId = offer.candidate?._id || offer.candidateId?._id || offer.candidateId;
          return offerCandidateId === candidateId && offer.status?.toLowerCase() === 'accepted';
        });

        setOffers(candidateOffers);

        if (candidateOffers.length === 0) {
          setError('No accepted offers found for this candidate');
        } else if (candidateOffers.length === 1) {
          setSelectedOffer(candidateOffers[0]._id);
        }
      } else {
        setError('Failed to fetch offers');
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err.response?.data?.message || 'Failed to fetch offers for this candidate');
    } finally {
      setFetchingOffers(false);
    }
  };

  // Fetch complete offer details by ID
  const fetchOfferDetails = async (offerId) => {
    setFetchingOfferDetails(true);
    setValidationErrors({});

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/offers/${offerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setSelectedOfferDetails(response.data.data);
        
        // Validate required fields for HTML generation
        validateOfferForHtmlGeneration(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching offer details:', err);
      setError('Could not fetch offer details. Please check if the offer exists.');
    } finally {
      setFetchingOfferDetails(false);
    }
  };

  // Validate if offer has all required fields for HTML generation
  const validateOfferForHtmlGeneration = (offer) => {
    const errors = {};
    
    if (!offer.offerDetails?.joiningDate) {
      errors.joiningDate = 'Joining date is required';
    }
    
    if (!offer.candidate?.firstName || !offer.candidate?.lastName) {
      errors.candidateName = 'Candidate name is incomplete';
    }
    
    if (!offer.offerDetails?.designation && !offer.job?.title) {
      errors.designation = 'Designation is required';
    }
    
    if (!offer.ctcDetails?.totalCtc) {
      errors.ctc = 'CTC details are required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle candidate change
  const handleCandidateChange = (e) => {
    setSelectedCandidate(e.target.value);
    setSelectedOffer('');
    setSelectedOfferDetails(null);
    setError('');
    setValidationErrors({});
  };

  // Handle offer change
  const handleOfferChange = (e) => {
    setSelectedOffer(e.target.value);
    setError('');
    setValidationErrors({});
  };

  // Handle next step
  const handleNext = () => {
    if (step === 0 && !selectedCandidate) {
      setError('Please select a candidate');
      return;
    }
    if (step === 1 && !selectedOffer) {
      setError('Please select an offer');
      return;
    }
    setError('');
    setStep(prev => prev + 1);
  };

  // Handle back step
  const handleBack = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  // Handle close
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Handle preview
  const handlePreview = () => {
    if (previewHtml) {
      setShowPreview(true);
    }
  };

  // Handle download letter as HTML file
  const handleDownloadLetter = () => {
    if (!previewHtml) return;
    
    setDownloading(true);
    
    try {
      // Create a blob from the HTML content
      const blob = new Blob([previewHtml], { type: 'text/html' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with candidate name and date
      const candidateName = candidateDetails ? 
        `${candidateDetails.firstName}_${candidateDetails.lastName}`.replace(/\s+/g, '_') : 
        'appointment_letter';
      const date = new Date().toISOString().split('T')[0];
      link.download = `${candidateName}_appointment_letter_${date}.html`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      setSuccess('Letter downloaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error downloading letter:', err);
      setError('Failed to download letter');
    } finally {
      setDownloading(false);
    }
  };

  // Handle send email
  const handleSendEmail = async () => {
    if (!emailAddress) {
      setEmailError('Please enter an email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!generatedLetter?.documentId) {
      setEmailError('Document ID not found');
      return;
    }

    setSendingEmail(true);
    setEmailError('');
    setEmailSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      console.log('Sending email to:', `${BASE_URL}/api/appointment-letter/send/${generatedLetter.documentId}`);
      console.log('Email address:', emailAddress);

      const response = await axios.post(
        `${BASE_URL}/api/appointment-letter/send/${generatedLetter.documentId}`,
        {
          email: emailAddress
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
        setEmailSent(true);
        setEmailSuccess(response.data.message || 'Email sent successfully!');
        
        // Show success message and close dialog after 2 seconds
        setTimeout(() => {
          setShowEmailDialog(false);
          setEmailSent(false);
          setEmailAddress('');
          setEmailSuccess('');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to send email');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setEmailError(err.response?.data?.message || err.message || 'Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  // Extract document ID from HTML response
  const extractDocumentIdFromHtml = (html) => {
    const match = html.match(/data-document-id=["']([^"']+)["']/);
    return match ? match[1] : null;
  };

  // Generate the letter and then show preview
  const handleGenerateAndPreview = async () => {
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const offerDetailsLocal = selectedOfferDetails || offerDisplayDetails;
      
      const joiningDate = offerDetailsLocal?.offerDetails?.joiningDate;
      
      if (!joiningDate) {
        throw new Error('Joining date not found in offer details');
      }

      const formattedDate = new Date(joiningDate).toISOString().split('T')[0];

      console.log('Generating letter with:', {
        candidateId: selectedCandidate,
        offerId: selectedOffer,
        joiningDate: formattedDate
      });

      // Make API call to get HTML
      const response = await axios.post(
        `${BASE_URL}/api/appointment-letter/generate`,
        {
          candidateId: selectedCandidate,
          offerId: selectedOffer,
          joiningDate: formattedDate
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'text/html,application/json'
          },
          timeout: 30000,
          responseType: 'text'
        }
      );

      const responseData = typeof response.data === 'string' ? response.data : response.data;
      
      if (typeof responseData === 'string' && responseData.includes('<!DOCTYPE html>')) {
        
        // Store HTML for preview
        setPreviewHtml(responseData);
        
        // Extract document ID from HTML
        const docId = extractDocumentIdFromHtml(responseData) || 
                     Date.now().toString(36) + Math.random().toString(36).substr(2);
        
        // Create response data
        const letterData = {
          documentId: docId,
          candidateId: selectedCandidate,
          candidateName: candidateDetails ? `${candidateDetails.firstName} ${candidateDetails.lastName}` : 'Candidate',
          candidateEmail: candidateDetails?.email || '',
          offerId: selectedOffer,
          offerDesignation: offerDetailsLocal?.job?.title || offerDetailsLocal?.offerDetails?.designation || 'Not Specified',
          status: 'generated',
          generatedAt: new Date().toISOString(),
          joiningDate: formattedDate,
          nextSteps: [
            "Preview the appointment letter",
            "Print the letter using the print option",
            "Download the letter as HTML",
            "Send to candidate via email"
          ]
        };

        setGeneratedLetter(letterData);
        setSuccess('Appointment letter generated successfully!');
        
        // Open preview dialog AFTER generation is complete
        setTimeout(() => {
          setShowPreview(true);
        }, 100);

        if (onSubmit) {
          onSubmit(letterData);
        }
      } else if (responseData.success) {
        const letterData = responseData.data;
        setGeneratedLetter(letterData);
        setSuccess(responseData.message || 'Appointment letter generated successfully!');
        
        // If response contains HTML, store it
        if (letterData?.html) {
          setPreviewHtml(letterData.html);
          setTimeout(() => {
            setShowPreview(true);
          }, 100);
        }

        if (onSubmit) {
          onSubmit(letterData);
        }
      } else {
        throw new Error(responseData.message || 'Failed to generate appointment letter');
      }
    } catch (err) {
      console.error('Error generating appointment letter:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate appointment letter');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle print letter from preview
  const handlePrintLetter = () => {
    if (previewHtml) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Appointment Letter</title>
            <style>
              @media print {
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: Arial, sans-serif;
                }
                * { 
                  -webkit-print-color-adjust: exact; 
                  print-color-adjust: exact; 
                }
              }
            </style>
          </head>
          <body>${previewHtml}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  // Handle close preview
  const handleClosePreview = () => {
    setShowPreview(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Render step content (truncated for brevity - keep your existing renderStepContent function)
  // ... (keep your existing renderStepContent function here)

  return (
    <>
      {/* Main Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, maxHeight: '90vh' }
        }}
      >
        <DialogTitle sx={{
          borderBottom: 1,
          borderColor: '#E0E0E0',
          bgcolor: '#F8FAFC',
          px: 3,
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 2
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Generate Appointment Letter
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Create appointment letter for selected candidate
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, px: 3, overflowY: 'auto' }}>
          {/* Error/Success Messages */}
          {error && (
            <Alert 
              severity="error" 
              onClose={() => setError('')} 
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}
          {success && !generatedLetter && (
            <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 3, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          {/* Stepper */}
          <Stepper activeStep={step} sx={{ mb: 4, mt: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content - You need to keep your existing renderStepContent output here */}
          <Box sx={{ minHeight: 400 }}>
            {/* Your existing step content JSX */}
          </Box>
        </DialogContent>

        <DialogActions sx={{
          px: 3,
          py: 2,
          borderTop: 1,
          borderColor: '#E0E0E0',
          bgcolor: '#F8FAFC',
          justifyContent: 'space-between',
          position: 'sticky',
          bottom: 0,
          zIndex: 2
        }}>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Box>
            <Button
              disabled={step === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            {step === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleGenerateAndPreview}
                disabled={submitting || generatedLetter || !offerDetails?.offerDetails?.joiningDate}
                startIcon={submitting ? <CircularProgress size={20} /> : <ViewIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #164e63, #00B4D8)',
                  minWidth: 200,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
                  },
                  '&.Mui-disabled': {
                    background: '#e0e0e0'
                  }
                }}
              >
                {submitting ? 'Generating...' : 'Generate'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={step === 1 && offers.length === 0}
                sx={{
                  background: 'linear-gradient(135deg, #164e63, #00B4D8)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
                  }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2, 
            height: '90vh',
            maxHeight: '90vh'
          }
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
          <Typography variant="h6">Appointment Letter Preview</Typography>
          <Box>
            <Button
              variant="contained"
              onClick={handlePrintLetter}
              startIcon={<PrintIcon />}
              sx={{
                mr: 1,
                background: 'linear-gradient(135deg, #164e63, #00B4D8)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
                }
              }}
            >
              Print
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadLetter}
              startIcon={downloading ? <CircularProgress size={20} /> : <DownloadIcon />}
              disabled={downloading}
              sx={{
                mr: 1,
                background: 'linear-gradient(135deg, #2E7D32, #4CAF50)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1B5E20, #388E3C)'
                }
              }}
            >
              {downloading ? 'Downloading...' : 'Download'}
            </Button>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={() => {
                setShowPreview(false);
                setShowEmailDialog(true);
              }}
              sx={{
                mr: 1,
                background: 'linear-gradient(135deg, #1976D2, #2196F3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565C0, #1976D2)'
                }
              }}
            >
              Send Email
            </Button>
            <IconButton onClick={handleClosePreview} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, bgcolor: '#f5f5f5' }}>
          {previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              title="Appointment Letter Preview"
              style={{ 
                width: '100%', 
                height: '100%', 
                border: 'none',
                backgroundColor: 'white'
              }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog
        open={showEmailDialog}
        onClose={() => !sendingEmail && setShowEmailDialog(false)}
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
              {emailSent ? 'Email Sent' : 'Send Appointment Letter'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {emailSent ? 'Email delivery confirmation' : 'Send letter to candidate via email'}
            </Typography>
          </Box>
          <IconButton onClick={() => !sendingEmail && setShowEmailDialog(false)} size="small" disabled={sendingEmail}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, px: 3 }}>
          {!emailSent ? (
            <>
              {/* Candidate Info */}
              {candidateDetails && (
                <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#00B4D8' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {candidateDetails.firstName} {candidateDetails.lastName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {candidateDetails.candidateId}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              )}

              {/* Document Info */}
              <Alert 
                severity="info" 
                sx={{ mb: 3 }}
                icon={<DescriptionIcon />}
              >
                <Box>
                  <Typography variant="body2">
                    Document ID: <strong>{generatedLetter?.documentId}</strong>
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Ready to send to candidate
                  </Typography>
                </Box>
              </Alert>
              
              {/* Email Input */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  required
                  label="Recipient Email"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  variant="outlined"
                  size="medium"
                  placeholder="candidate@example.com"
                  error={!!emailError}
                  helperText={emailError}
                  disabled={sendingEmail}
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

              {emailSuccess && (
                <Alert severity="success" sx={{ mt: 2, mb: 1 }}>
                  {emailSuccess}
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
                The appointment letter has been sent to {emailAddress}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{
          px: 3,
          py: 2,
          borderTop: 1,
          borderColor: '#E0E0E0',
          bgcolor: '#F8FAFC',
          justifyContent: 'space-between'
        }}>
          <Button 
            onClick={() => setShowEmailDialog(false)} 
            disabled={sendingEmail}
          >
            {emailSent ? 'CLOSE' : 'CANCEL'}
          </Button>
          
          {!emailSent ? (
            <Button
              variant="contained"
              onClick={handleSendEmail}
              disabled={sendingEmail || !emailAddress}
              startIcon={sendingEmail ? <CircularProgress size={20} /> : <SendIcon />}
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
              {sendingEmail ? 'SENDING...' : 'SEND EMAIL'}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GenerateAppointmentLetter;