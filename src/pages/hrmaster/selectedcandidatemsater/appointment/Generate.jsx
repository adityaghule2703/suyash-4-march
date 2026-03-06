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
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import html2pdf from 'html2pdf.js';

// Color constants
const PRIMARY_BLUE = '#00B4D8';
const SUCCESS_COLOR = '#2E7D32';

const GenerateAppointmentLetter = ({ open, onClose, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfGenerationStatus, setPdfGenerationStatus] = useState('');

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

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (generatedLetter?.fileUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(generatedLetter.fileUrl);
      }
    };
  }, [generatedLetter]);

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

  const resetState = () => {
    setStep(0);
    setSelectedCandidate('');
    setSelectedOffer('');
    // Clean up old blob URL
    if (generatedLetter?.fileUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(generatedLetter.fileUrl);
    }
    setGeneratedLetter(null);
    setError('');
    setSuccess('');
    setOffers([]);
    setSelectedOfferDetails(null);
    setValidationErrors({});
    setPreviewHtml(null);
    setShowPreview(false);
    setPdfGenerationStatus('');
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
        
        // Validate required fields for PDF generation
        validateOfferForPdfGeneration(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching offer details:', err);
    } finally {
      setFetchingOfferDetails(false);
    }
  };

  // Validate if offer has all required fields for PDF generation
  const validateOfferForPdfGeneration = (offer) => {
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

  // ===== FIXED: Clean HTML content with explicit visibility styles =====
  const cleanHtmlForPdf = (html) => {
    console.log('Original HTML length:', html.length);
    
    // Add meta viewport and base styles
    let cleaned = html.replace('<head>', '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">');
    
    // Add critical styles to force content visibility
    const forceVisibleStyles = `
      <style>
        * { 
          visibility: visible !important; 
          opacity: 1 !important; 
          display: block !important;
          color: #000000 !important;
          background-color: transparent !important;
        }
        body { 
          margin: 20px !important; 
          padding: 20px !important;
          background-color: #ffffff !important;
          font-family: Arial, sans-serif !important;
        }
        div, p, span, h1, h2, h3, h4, h5, h6 {
          color: #000000 !important;
        }
        table { 
          border-collapse: collapse !important;
          width: 100% !important;
        }
        td, th {
          border: 1px solid #000000 !important;
          padding: 8px !important;
        }
      </style>
    `;
    
    // Insert styles after head
    cleaned = cleaned.replace('</head>', forceVisibleStyles + '</head>');
    
    // Fix any relative paths
    cleaned = cleaned.replace(/src="\//g, `src="${BASE_URL}/`);
    cleaned = cleaned.replace(/href="\//g, `href="${BASE_URL}/`);
    
    console.log('Cleaned HTML length:', cleaned.length);
    
    return cleaned;
  };

  // ===== FIXED: Simplified PDF generation with better error handling =====
  const generatePdfFromHtml = async (htmlContent, fileName) => {
    setPdfGenerationStatus('Preparing document...');
    
    // Create a container with the HTML
    const container = document.createElement('div');
    container.innerHTML = cleanHtmlForPdf(htmlContent);
    
    // Style the container to be visible but off-screen
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.backgroundColor = '#ffffff';
    container.style.padding = '20px';
    container.style.zIndex = '-9999';
    
    document.body.appendChild(container);

    // Wait for content to settle
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ===== FIXED: Simplified options for better compatibility =====
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: fileName,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2,
        logging: true,
        backgroundColor: '#ffffff',
        allowTaint: false,
        useCORS: true
      },
      jsPDF: { 
        unit: 'in',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    try {
      setPdfGenerationStatus('Rendering document...');
      
      // Create worker and generate PDF
      const worker = html2pdf().set(opt).from(container);
      
      setPdfGenerationStatus('Generating PDF...');
      
      // Get the PDF blob
      const pdfBlob = await worker.output('blob');
      
      console.log('PDF Blob size:', pdfBlob.size);
      
      // Verify PDF has content
      if (pdfBlob.size < 2000) {
        console.warn('PDF size is very small:', pdfBlob.size);
      }
      
      // Clean up
      document.body.removeChild(container);
      
      setPdfGenerationStatus('');
      
      return {
        blob: pdfBlob,
        size: pdfBlob.size,
        fileName: fileName
      };
    } catch (error) {
      console.error('PDF generation error:', error);
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      setPdfGenerationStatus('');
      throw new Error('Failed to generate PDF: ' + error.message);
    }
  };

  // Preview HTML before generating PDF
  const handlePreviewHtml = async () => {
    if (!previewHtml) {
      await handleGenerateLetter(true);
    } else {
      setShowPreview(true);
    }
  };

  // ===== FIXED: Generate letter with better error handling =====
  const handleGenerateLetter = async (previewOnly = false) => {
    setSubmitting(true);
    setError('');
    setPdfGenerationStatus('');

    try {
      const token = localStorage.getItem('token');
      const offerDetails = selectedOfferDetails || offerDisplayDetails;
      
      const joiningDate = offerDetails?.offerDetails?.joiningDate;
      
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
        
        if (previewOnly) {
          setShowPreview(true);
          setSubmitting(false);
          return;
        }

        // Generate filename
        const candidateName = `${candidateDetails?.firstName}_${candidateDetails?.lastName}`.toLowerCase().replace(/\s+/g, '_');
        const fileName = `appointment_letter_${candidateName}_${Date.now()}.pdf`;

        // Generate PDF from HTML
        const pdfResult = await generatePdfFromHtml(responseData, fileName);

        // Create blob URL for download
        const blobUrl = URL.createObjectURL(pdfResult.blob);

        // Create response data
        const mockData = {
          documentId: Date.now().toString(36) + Math.random().toString(36).substr(2),
          fileUrl: blobUrl,
          fileBlob: pdfResult.blob,
          fileName: fileName,
          fileSize: pdfResult.size,
          candidateId: selectedCandidate,
          candidateName: `${candidateDetails?.firstName} ${candidateDetails?.lastName}`,
          candidateEmail: candidateDetails?.email,
          offerId: selectedOffer,
          offerDesignation: offerDetails?.job?.title || offerDetails?.offerDetails?.designation || 'Not Specified',
          status: 'generated',
          generatedAt: new Date().toISOString(),
          joiningDate: formattedDate,
          nextSteps: [
            "Review the generated appointment letter",
            "Send to candidate for acceptance",
            "Candidate accepts to proceed with employee creation"
          ]
        };

        setGeneratedLetter(mockData);
        setSuccess('Appointment letter generated successfully!');

        // Auto-download the PDF
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 500);

        if (onSubmit) {
          onSubmit(mockData);
        }
      } else if (responseData.success) {
        setGeneratedLetter(responseData.data);
        setSuccess(responseData.message || 'Appointment letter generated successfully!');

        if (onSubmit) {
          onSubmit(responseData.data);
        }
      } else {
        throw new Error(responseData.message || 'Failed to generate appointment letter');
      }
    } catch (err) {
      console.error('Error generating appointment letter:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate appointment letter');
    } finally {
      if (!previewOnly) {
        setSubmitting(false);
      }
      setPdfGenerationStatus('');
    }
  };

  // Handle download letter
  const handleDownloadLetter = async () => {
    if (!generatedLetter?.fileUrl) {
      setError('No file available for download');
      return;
    }

    try {
      setPdfGenerationStatus('Preparing download...');
      
      if (generatedLetter.fileUrl.startsWith('blob:')) {
        try {
          const response = await fetch(generatedLetter.fileUrl);
          if (!response.ok) {
            throw new Error('Blob content not accessible');
          }
          
          const blob = await response.blob();
          const newBlobUrl = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = newBlobUrl;
          link.download = generatedLetter.fileName || 'appointment_letter.pdf';
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(newBlobUrl);
          }, 1000);
          
          setPdfGenerationStatus('');
        } catch (blobError) {
          console.error('Blob access error:', blobError);
          
          if (generatedLetter.fileBlob) {
            const newBlobUrl = URL.createObjectURL(generatedLetter.fileBlob);
            const link = document.createElement('a');
            link.href = newBlobUrl;
            link.download = generatedLetter.fileName || 'appointment_letter.pdf';
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(newBlobUrl);
            }, 1000);
            
            setGeneratedLetter(prev => ({
              ...prev,
              fileUrl: newBlobUrl
            }));
            
            setPdfGenerationStatus('');
          } else {
            throw new Error('File data is no longer available. Please generate the letter again.');
          }
        }
      } else {
        const fileUrl = generatedLetter.fileUrl.startsWith('http')
          ? generatedLetter.fileUrl
          : `${BASE_URL}${generatedLetter.fileUrl}`;
        
        const newWindow = window.open(fileUrl, '_blank');
        if (!newWindow) {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = generatedLetter.fileName || 'appointment_letter.pdf';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setPdfGenerationStatus('');
      }
    } catch (error) {
      console.error('Download error:', error);
      setError(error.message || 'Failed to download file. Please try generating the letter again.');
      setPdfGenerationStatus('');
    }
  };

  // Handle print letter
  const handlePrintLetter = () => {
    if (previewHtml) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Appointment Letter</title>
            <style>
              @media print {
                body { margin: 0; padding: 20px; }
                * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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

  // Handle email letter
  const handleEmailLetter = () => {
    if (candidateDetails?.email) {
      const subject = `Appointment Letter - ${candidateDetails.firstName} ${candidateDetails.lastName}`;
      const body = `Dear ${candidateDetails.firstName},\n\nPlease find attached your appointment letter.\n\nRegards,\nHR Department`;
      window.location.href = `mailto:${candidateDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  // Get candidate details
  const getCandidateDetails = () => {
    return candidates.find(c => c._id === selectedCandidate);
  };

  // Get offer display details
  const getOfferDisplayDetails = () => {
    return offers.find(o => o._id === selectedOffer);
  };

  const candidateDetails = getCandidateDetails();
  const offerDisplayDetails = getOfferDisplayDetails();
  const offerDetails = selectedOfferDetails || offerDisplayDetails;

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

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // ===== YOUR EXISTING renderStepContent FUNCTION REMAINS EXACTLY THE SAME =====
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1976D2">
                Select Candidate
              </Typography>

              {fetchingCandidates ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : (
                <FormControl fullWidth size="small">
                  <InputLabel>Select Candidate</InputLabel>
                  <Select
                    value={selectedCandidate}
                    onChange={handleCandidateChange}
                    label="Select Candidate"
                  >
                    <MenuItem value="">Choose a candidate</MenuItem>
                    {candidates.map((cand) => (
                      <MenuItem key={cand._id} value={cand._id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: PRIMARY_BLUE, fontSize: '0.75rem' }}>
                            {cand.firstName?.[0]}{cand.lastName?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">
                              {cand.firstName} {cand.lastName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {cand.candidateId} - {cand.email}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {candidateDetails && (
                <Box sx={{ mt: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Candidate Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">Full Name</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {candidateDetails.firstName} {candidateDetails.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">Candidate ID</Typography>
                      <Typography variant="body2">{candidateDetails.candidateId}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">Email</Typography>
                      <Typography variant="body2">{candidateDetails.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">Phone</Typography>
                      <Typography variant="body2">{candidateDetails.phone}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>

            <Alert severity="info" icon={<InfoIcon />} sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                Select a candidate who has accepted the offer to generate an appointment letter.
              </Typography>
            </Alert>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1976D2">
                Select Offer
              </Typography>

              {!selectedCandidate ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Please select a candidate first to view available offers
                </Alert>
              ) : fetchingOffers ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : (
                <>
                  <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                    <InputLabel>Select Accepted Offer</InputLabel>
                    <Select
                      value={selectedOffer}
                      onChange={handleOfferChange}
                      label="Select Accepted Offer"
                      disabled={offers.length === 0}
                    >
                      <MenuItem value="">Choose an offer</MenuItem>
                      {offers.length > 0 ? (
                        offers.map((offer) => (
                          <MenuItem key={offer._id} value={offer._id}>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {offer.offerId} - {offer.job?.title || offer.offerDetails?.designation || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                CTC: {formatCurrency(offer.ctcDetails?.totalCtc)} |
                                Joining: {offer.offerDetails?.joiningDate ? formatDisplayDate(offer.offerDetails.joiningDate) : 'Not specified'}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled value="">
                          <Typography variant="body2" color="textSecondary">
                            No accepted offers available for this candidate
                          </Typography>
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </>
              )}

              {selectedOffer && fetchingOfferDetails && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Loading offer details...
                  </Typography>
                </Box>
              )}

              {/* Validation Errors */}
              {Object.keys(validationErrors).length > 0 && (
                <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Missing information that may affect PDF generation:
                  </Typography>
                  <List dense>
                    {Object.values(validationErrors).map((error, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <WarningIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={error} />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}

              {/* Display complete offer details */}
              {offerDetails && !fetchingOfferDetails && (
                <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600} sx={{ color: '#1976D2', mb: 2 }}>
                    Complete Offer Details
                  </Typography>

                  {/* Offer Information Card */}
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                      OFFER INFORMATION
                    </Typography>
                    <Grid container spacing={8}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="textSecondary">Offer ID</Typography>
                        <Typography variant="body2" fontWeight={600}>{offerDetails.offerId || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="textSecondary">Status</Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label={offerDetails.status}
                            size="small"
                            sx={{
                              bgcolor: offerDetails.status === 'accepted' ? '#d1fae5' : '#fef3c7',
                              color: offerDetails.status === 'accepted' ? '#065f46' : '#92400e',
                              height: 24,
                              fontSize: '12px',
                              fontWeight: 500
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="textSecondary">Employment Type</Typography>
                        <Typography variant="body2">{offerDetails.offerDetails?.employmentType || 'Permanent'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Position Details Card */}
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                      POSITION DETAILS
                    </Typography>
                    <Grid container spacing={8}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="textSecondary">Designation</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {offerDetails.job?.title || offerDetails.offerDetails?.designation || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="textSecondary">Department</Typography>
                        <Typography variant="body2">{offerDetails.job?.department || offerDetails.offerDetails?.department || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="textSecondary">Location</Typography>
                        <Typography variant="body2">{offerDetails.job?.location || offerDetails.offerDetails?.location || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Joining Date Card */}
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                      JOINING DETAILS
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary">Joining Date</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#1976D2' }}>
                          {offerDetails.offerDetails?.joiningDate ? formatDisplayDate(offerDetails.offerDetails.joiningDate) : 'Not specified'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Compensation Details Card */}
                  {offerDetails.ctcDetails && (
                    <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 1 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                        COMPENSATION DETAILS (Monthly)
                      </Typography>
                      <Grid container spacing={6}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="textSecondary">Basic Salary</Typography>
                          <Typography variant="body2" fontWeight={500}>{formatCurrency(offerDetails.ctcDetails.basic)}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="textSecondary">HRA</Typography>
                          <Typography variant="body2">{formatCurrency(offerDetails.ctcDetails.hra)}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="textSecondary">Conveyance</Typography>
                          <Typography variant="body2">{formatCurrency(offerDetails.ctcDetails.conveyanceAllowance) || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="textSecondary">Medical</Typography>
                          <Typography variant="body2">{formatCurrency(offerDetails.ctcDetails.medicalAllowance) || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="textSecondary">Special Allowance</Typography>
                          <Typography variant="body2">{formatCurrency(offerDetails.ctcDetails.specialAllowance) || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="textSecondary">Bonus (Annual)</Typography>
                          <Typography variant="body2">{formatCurrency(offerDetails.ctcDetails.bonus) || 'N/A'}</Typography>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">Total CTC (Annual)</Typography>
                        <Typography variant="h6" color="success.main" fontWeight={600}>
                          {formatCurrency(offerDetails.ctcDetails.totalCtc)}
                        </Typography>
                      </Box>
                    </Paper>
                  )}
                </Box>
              )}
            </Paper>

            <Alert severity="info" icon={<InfoIcon />} sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                Select the accepted offer to generate the appointment letter. The joining date will be taken from the offer.
              </Typography>
            </Alert>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1976D2">
                Generate Appointment Letter
              </Typography>

              {/* Summary Card */}
              <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                  Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">Candidate</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {candidateDetails?.firstName} {candidateDetails?.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">Candidate ID</Typography>
                    <Typography variant="body2">{candidateDetails?.candidateId}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">Offer ID</Typography>
                    <Typography variant="body2">{offerDetails?.offerId || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">Designation</Typography>
                    <Typography variant="body2">{offerDetails?.job?.title || offerDetails?.offerDetails?.designation || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">Total CTC</Typography>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      {formatCurrency(offerDetails?.ctcDetails?.totalCtc)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">Joining Date</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {offerDetails?.offerDetails?.joiningDate ? formatDisplayDate(offerDetails.offerDetails.joiningDate) : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Validation warnings before generation */}
              {Object.keys(validationErrors).length > 0 && !generatedLetter && (
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    The following issues may affect the PDF format:
                  </Typography>
                  <List dense>
                    {Object.values(validationErrors).map((error, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <WarningIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={error} />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}

              {/* PDF Generation Status */}
              {pdfGenerationStatus && (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2">{pdfGenerationStatus}</Typography>
                  </Box>
                </Alert>
              )}

              {/* HTML Preview Dialog */}
              <Dialog
                open={showPreview}
                onClose={() => setShowPreview(false)}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Appointment Letter Preview</Typography>
                    <IconButton onClick={() => setShowPreview(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </DialogTitle>
                <DialogContent dividers>
                  {previewHtml && (
                    <iframe
                      srcDoc={previewHtml}
                      title="Appointment Letter Preview"
                      style={{ width: '100%', height: '70vh', border: 'none' }}
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowPreview(false)}>Close</Button>
                  <Button
                    variant="contained"
                    onClick={handlePrintLetter}
                    startIcon={<PrintIcon />}
                  >
                    Print
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setShowPreview(false);
                      handleGenerateLetter(false);
                    }}
                    startIcon={<PdfIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #164e63, #00B4D8)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
                      }
                    }}
                  >
                    Generate PDF
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Generated Letter Card */}
              {generatedLetter ? (
                <Card sx={{ mb: 3, border: '1px solid', borderColor: 'success.main' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: SUCCESS_COLOR }}>
                        <CheckCircleIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" color="success.main">
                          Letter Generated Successfully!
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {generatedLetter.fileName}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary">Document ID</Typography>
                        <Typography variant="body2">{generatedLetter.documentId}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary">File Size</Typography>
                        <Typography variant="body2">
                          {formatFileSize(generatedLetter.fileSize)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary">Generated At</Typography>
                        <Typography variant="body2">
                          {new Date(generatedLetter.generatedAt).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary">Status</Typography>
                        <Chip
                          label={generatedLetter.status}
                          size="small"
                          color="success"
                          sx={{ height: 20, fontSize: '11px' }}
                        />
                      </Grid>
                    </Grid>

                    {generatedLetter.nextSteps && generatedLetter.nextSteps.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Next Steps:
                        </Typography>
                        <List dense>
                          {generatedLetter.nextSteps.map((step, index) => (
                            <ListItem key={index}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircleIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={step} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadLetter}
                      disabled={!!pdfGenerationStatus}
                      sx={{
                        background: 'linear-gradient(135deg, #164e63, #00B4D8)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
                        },
                        flex: { xs: '1 1 100%', sm: '1 1 auto' }
                      }}
                    >
                      Download PDF
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PrintIcon />}
                      onClick={handlePrintLetter}
                      sx={{
                        borderColor: PRIMARY_BLUE,
                        color: PRIMARY_BLUE,
                        '&:hover': {
                          borderColor: '#0096b4',
                          bgcolor: 'rgba(0, 180, 216, 0.04)'
                        },
                        flex: { xs: '1 1 calc(50% - 4px)', sm: '1 1 auto' }
                      }}
                    >
                      Print
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<EmailIcon />}
                      onClick={handleEmailLetter}
                      sx={{
                        borderColor: PRIMARY_BLUE,
                        color: PRIMARY_BLUE,
                        '&:hover': {
                          borderColor: '#0096b4',
                          bgcolor: 'rgba(0, 180, 216, 0.04)'
                        },
                        flex: { xs: '1 1 calc(50% - 4px)', sm: '1 1 auto' }
                      }}
                    >
                      Email
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => setShowPreview(true)}
                      sx={{
                        borderColor: PRIMARY_BLUE,
                        color: PRIMARY_BLUE,
                        '&:hover': {
                          borderColor: '#0096b4',
                          bgcolor: 'rgba(0, 180, 216, 0.04)'
                        },
                        flex: { xs: '1 1 100%', sm: '1 1 auto' }
                      }}
                    >
                      Preview
                    </Button>
                  </CardActions>
                  {error && error.includes('no longer available') && (
                    <Box sx={{ px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setError('');
                          handleGenerateLetter(false);
                        }}
                        startIcon={<PdfIcon />}
                      >
                        Generate New Letter
                      </Button>
                    </Box>
                  )}
                </Card>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handlePreviewHtml}
                    disabled={submitting || !offerDetails?.offerDetails?.joiningDate}
                    startIcon={<VisibilityIcon />}
                    sx={{
                      borderColor: PRIMARY_BLUE,
                      color: PRIMARY_BLUE,
                      '&:hover': {
                        borderColor: '#0096b4',
                        bgcolor: 'rgba(0, 180, 216, 0.04)'
                      }
                    }}
                  >
                    Preview Letter
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleGenerateLetter(false)}
                    disabled={submitting || !offerDetails?.offerDetails?.joiningDate}
                    startIcon={submitting ? <CircularProgress size={20} /> : <PdfIcon />}
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
                    {submitting ? 'Generating...' : 'Generate PDF'}
                  </Button>
                </Box>
              )}
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
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
            action={
              error.includes('PDF') && (
                <Button color="inherit" size="small" onClick={() => setError('')}>
                  Dismiss
                </Button>
              )
            }
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

        {/* Step Content */}
        <Box sx={{ minHeight: 400 }}>
          {renderStepContent()}
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
              onClick={() => handleGenerateLetter(false)}
              disabled={submitting || generatedLetter || !offerDetails?.offerDetails?.joiningDate}
              startIcon={submitting ? <CircularProgress size={20} /> : <PdfIcon />}
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
              {submitting ? 'Generating...' : 'Generate PDF'}
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
  );
};

export default GenerateAppointmentLetter;