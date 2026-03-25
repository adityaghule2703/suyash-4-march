// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Typography,
//   MenuItem,
//   Grid,
//   Box,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   Chip,
//   Alert,
//   CircularProgress,
//   IconButton,
//   Avatar,
//   Stepper,
//   Step,
//   StepLabel,
//   Divider,
//   Card,
//   CardContent,
//   CardActions,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Tooltip,
//   TextField,
//   Collapse
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   CheckCircle as CheckCircleIcon,
//   Warning as WarningIcon,
//   Info as InfoIcon,
//   Visibility as ViewIcon,
//   Print as PrintIcon,
//   Download as DownloadIcon,
//   Send as SendIcon,
//   Email as EmailIcon,
//   Description as DescriptionIcon,
//   Person as PersonIcon,
//   Error as ErrorIcon,
//   Refresh as RefreshIcon
// } from '@mui/icons-material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import axios from 'axios';
// import BASE_URL from '../../../../config/Config';

// // Color constants
// const PRIMARY_BLUE = '#00B4D8';

// const GenerateAppointmentLetter = ({ open, onClose, onSubmit }) => {
//   const [step, setStep] = useState(0);
//   const [submitting, setSubmitting] = useState(false);
//   const [previewHtml, setPreviewHtml] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [downloading, setDownloading] = useState(false);
//   const [sendingEmail, setSendingEmail] = useState(false);
//   const [showEmailDialog, setShowEmailDialog] = useState(false);
//   const [emailAddress, setEmailAddress] = useState('');
//   const [emailSent, setEmailSent] = useState(false);
//   const [emailError, setEmailError] = useState('');
//   const [emailSuccess, setEmailSuccess] = useState('');

//   // Data states
//   const [candidates, setCandidates] = useState([]);
//   const [selectedCandidateDetails, setSelectedCandidateDetails] = useState(null);
//   const [selectedOfferDetails, setSelectedOfferDetails] = useState(null);
//   const [fetchingCandidates, setFetchingCandidates] = useState(false);
//   const [fetchingCandidateDetails, setFetchingCandidateDetails] = useState(false);

//   // Form state
//   const [selectedCandidate, setSelectedCandidate] = useState('');
//   const [selectedOffer, setSelectedOffer] = useState('');

//   // Generated letter state
//   const [generatedLetter, setGeneratedLetter] = useState(null);

//   // Error/Success state
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [apiErrorDetails, setApiErrorDetails] = useState('');
//   const [showErrorDetails, setShowErrorDetails] = useState(false);

//   // Validation state
//   const [validationErrors, setValidationErrors] = useState({});

//   const steps = ['Select Candidate', 'Review Offer', 'Generate'];

//   // Get candidate details safely
//   const getCandidateDetails = () => {
//     return candidates.find(c => c._id === selectedCandidate);
//   };

//   // Get offer from selected candidate's latestOffer
//   const getSelectedOffer = () => {
//     if (!selectedCandidateDetails || !selectedCandidateDetails.latestOffer) return null;
//     return selectedCandidateDetails.latestOffer;
//   };

//   const candidateDetails = selectedCandidate ? getCandidateDetails() : null;
//   const offerDetails = selectedOfferDetails || (selectedCandidateDetails?.latestOffer) || null;

//   // Fetch candidates on open
//   useEffect(() => {
//     if (open) {
//       fetchCandidates();
//       resetState();
//     }
//   }, [open]);

//   // Fetch candidate details when candidate is selected
//   useEffect(() => {
//     if (selectedCandidate) {
//       fetchCandidateDetails(selectedCandidate);
//     } else {
//       setSelectedCandidateDetails(null);
//       setSelectedOfferDetails(null);
//       setSelectedOffer('');
//     }
//   }, [selectedCandidate]);

//   // Set email from candidate details when available
//   useEffect(() => {
//     if (candidateDetails?.email) {
//       setEmailAddress(candidateDetails.email);
//     }
//   }, [candidateDetails]);

//   const resetState = () => {
//     setStep(0);
//     setSelectedCandidate('');
//     setSelectedOffer('');
//     setGeneratedLetter(null);
//     setError('');
//     setSuccess('');
//     setApiErrorDetails('');
//     setShowErrorDetails(false);
//     setSelectedCandidateDetails(null);
//     setSelectedOfferDetails(null);
//     setValidationErrors({});
//     setPreviewHtml(null);
//     setShowPreview(false);
//     setShowEmailDialog(false);
//     setEmailSent(false);
//     setEmailError('');
//     setEmailSuccess('');
//   };

//   // Fetch candidates (only those with accepted offers)
//   const fetchCandidates = async () => {
//     setFetchingCandidates(true);
//     setError('');
//     setApiErrorDetails('');

//     try {
//       const token = localStorage.getItem('token');
//       // Fetch all candidates with status 'selected'
//       const response = await axios.get(`${BASE_URL}/api/candidates?status=selected`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         // Filter candidates that have accepted offers
//         const candidatesWithAcceptedOffers = response.data.data.filter(candidate => 
//           candidate.latestOffer && candidate.latestOffer.status === 'accepted'
//         );
//         setCandidates(candidatesWithAcceptedOffers);
        
//         if (candidatesWithAcceptedOffers.length === 0) {
//           setError('No candidates with accepted offers found');
//         }
//       } else {
//         setError('Failed to fetch candidates');
//         setApiErrorDetails(response.data.message || 'Unknown error');
//       }
//     } catch (err) {
//       console.error('Error fetching candidates:', err);
//       handleApiError(err, 'Failed to fetch candidates');
//     } finally {
//       setFetchingCandidates(false);
//     }
//   };

//   // Fetch candidate details by ID
//   const fetchCandidateDetails = async (candidateId) => {
//     setFetchingCandidateDetails(true);
//     setError('');
//     setApiErrorDetails('');

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/candidates?_id=${candidateId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success && response.data.data.length > 0) {
//         const candidate = response.data.data[0];
//         setSelectedCandidateDetails(candidate);
        
//         // If candidate has an accepted offer, auto-select it
//         if (candidate.latestOffer && candidate.latestOffer.status === 'accepted') {
//           setSelectedOfferDetails(candidate.latestOffer);
//           setSelectedOffer(candidate.latestOffer._id);
//         } else {
//           setError('This candidate does not have an accepted offer');
//         }
//       } else {
//         setError('Candidate details not found');
//         setApiErrorDetails('The requested candidate could not be found');
//       }
//     } catch (err) {
//       console.error('Error fetching candidate details:', err);
//       handleApiError(err, 'Failed to fetch candidate details');
//     } finally {
//       setFetchingCandidateDetails(false);
//     }
//   };

//   // Handle API errors with user-friendly messages
//   const handleApiError = (err, defaultMessage) => {
//     let userMessage = defaultMessage;
//     let technicalDetails = '';

//     if (err.response) {
//       // The request was made and the server responded with a status code outside 2xx
//       technicalDetails = `Status: ${err.response.status}\nData: ${JSON.stringify(err.response.data, null, 2)}`;
      
//       // User-friendly messages based on status code
//       switch (err.response.status) {
//         case 400:
//           userMessage = 'Invalid request. Please check the selected candidate and offer.';
//           break;
//         case 401:
//           userMessage = 'Your session has expired. Please log in again.';
//           break;
//         case 403:
//           userMessage = 'You do not have permission to perform this action.';
//           break;
//         case 404:
//           userMessage = 'The requested resource was not found.';
//           break;
//         case 500:
//           userMessage = 'Server error. Please try again later or contact support.';
//           break;
//         default:
//           userMessage = err.response.data?.message || defaultMessage;
//       }
//     } else if (err.request) {
//       // The request was made but no response was received
//       technicalDetails = 'No response received from server';
//       userMessage = 'Network error. Please check your internet connection.';
//     } else {
//       // Something happened in setting up the request
//       technicalDetails = err.message;
//       userMessage = 'An unexpected error occurred. Please try again.';
//     }

//     setError(userMessage);
//     setApiErrorDetails(technicalDetails);
//     setShowErrorDetails(true);
//   };

//   // Handle candidate change
//   const handleCandidateChange = (e) => {
//     setSelectedCandidate(e.target.value);
//     setSelectedOffer('');
//     setSelectedOfferDetails(null);
//     setError('');
//     setApiErrorDetails('');
//     setShowErrorDetails(false);
//     setValidationErrors({});
//   };

//   // Handle next step
//   const handleNext = () => {
//     if (step === 0 && !selectedCandidate) {
//       setError('Please select a candidate');
//       return;
//     }
//     if (step === 1 && !offerDetails) {
//       setError('No accepted offer found for this candidate');
//       return;
//     }
//     setError('');
//     setStep(prev => prev + 1);
//   };

//   // Handle back step
//   const handleBack = () => {
//     setStep(prev => prev - 1);
//     setError('');
//   };

//   // Handle close
//   const handleClose = () => {
//     resetState();
//     onClose();
//   };

//   // Handle preview
//   const handlePreview = () => {
//     if (previewHtml) {
//       setShowPreview(true);
//     }
//   };

//   // Handle download letter as HTML file
//   const handleDownloadLetter = () => {
//     if (!previewHtml) return;
    
//     setDownloading(true);
    
//     try {
//       const blob = new Blob([previewHtml], { type: 'text/html' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
      
//       const candidateName = candidateDetails ? 
//         `${candidateDetails.firstName}_${candidateDetails.lastName}`.replace(/\s+/g, '_') : 
//         'appointment_letter';
//       const date = new Date().toISOString().split('T')[0];
//       link.download = `${candidateName}_appointment_letter_${date}.html`;
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//       window.URL.revokeObjectURL(url);
      
//       setSuccess('Letter downloaded successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       console.error('Error downloading letter:', err);
//       setError('Failed to download letter');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   // Handle send email
//   const handleSendEmail = async () => {
//     if (!emailAddress) {
//       setEmailError('Please enter an email address');
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(emailAddress)) {
//       setEmailError('Please enter a valid email address');
//       return;
//     }

//     if (!generatedLetter?.documentId) {
//       setEmailError('Document ID not found');
//       return;
//     }

//     setSendingEmail(true);
//     setEmailError('');
//     setEmailSuccess('');

//     try {
//       const token = localStorage.getItem('token');
      
//       const response = await axios.post(
//         `${BASE_URL}/api/appointment-letter/send/${generatedLetter.documentId}`,
//         {
//           email: emailAddress
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         setEmailSent(true);
//         setEmailSuccess(response.data.message || 'Email sent successfully!');
        
//         setTimeout(() => {
//           setShowEmailDialog(false);
//           setEmailSent(false);
//           setEmailAddress('');
//           setEmailSuccess('');
//         }, 2000);
//       } else {
//         throw new Error(response.data.message || 'Failed to send email');
//       }
//     } catch (err) {
//       console.error('Error sending email:', err);
      
//       let errorMsg = 'Failed to send email';
//       if (err.response) {
//         if (err.response.status === 404) {
//           errorMsg = 'Document not found. Please generate the letter again.';
//         } else if (err.response.status === 400) {
//           errorMsg = err.response.data?.message || 'Invalid email address or document ID';
//         } else {
//           errorMsg = err.response.data?.message || 'Server error';
//         }
//       } else if (err.request) {
//         errorMsg = 'Network error. Please check your connection.';
//       }
      
//       setEmailError(errorMsg);
//     } finally {
//       setSendingEmail(false);
//     }
//   };

//   // Extract document ID from HTML response
//   const extractDocumentIdFromHtml = (html) => {
//     const match = html.match(/data-document-id=["']([^"']+)["']/);
//     return match ? match[1] : null;
//   };

//   // Generate the letter and then show preview
//   const handleGenerateAndPreview = async () => {
//     setSubmitting(true);
//     setError('');
//     setApiErrorDetails('');
//     setShowErrorDetails(false);

//     try {
//       const token = localStorage.getItem('token');
      
//       // Get joining date from offer details
//       let joiningDate = offerDetails?.offerDetails?.joiningDate;
      
//       if (!joiningDate) {
//         throw new Error('Joining date not found in offer details');
//       }

//       // Format joining date to YYYY-MM-DD
//       const formattedDate = new Date(joiningDate).toISOString().split('T')[0];

//       console.log('Generating letter with:', {
//         candidateId: selectedCandidate,
//         offerId: offerDetails._id,
//         joiningDate: formattedDate
//       });

//       const response = await axios.post(
//         `${BASE_URL}/api/appointment-letter/generate`,
//         {
//           candidateId: selectedCandidate,
//           offerId: offerDetails._id,
//           joiningDate: formattedDate
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Accept': 'text/html,application/json'
//           },
//           timeout: 30000,
//           responseType: 'text'
//         }
//       );

//       const htmlContent = response.data;
      
//       if (typeof htmlContent === 'string' && htmlContent.includes('<!DOCTYPE html>')) {
        
//         setPreviewHtml(htmlContent);
        
//         const docId = extractDocumentIdFromHtml(htmlContent);
        
//         if (!docId) {
//           console.warn('Document ID not found in HTML response');
//         }
        
//         const letterData = {
//           documentId: docId || `TEMP-${Date.now()}`,
//           candidateId: selectedCandidate,
//           candidateName: candidateDetails ? `${candidateDetails.firstName} ${candidateDetails.lastName}` : 'Candidate',
//           candidateEmail: candidateDetails?.email || '',
//           offerId: offerDetails._id,
//           offerDesignation: offerDetails.offerDetails?.designation || 'Not Specified',
//           status: 'generated',
//           generatedAt: new Date().toISOString(),
//           joiningDate: formattedDate,
//           html: htmlContent,
//           nextSteps: [
//             "Preview the appointment letter",
//             "Print the letter using the print option",
//             "Download the letter as HTML",
//             "Send to candidate via email"
//           ]
//         };

//         setGeneratedLetter(letterData);
//         setSuccess('Appointment letter generated successfully!');
        
//         setShowPreview(true);

//         if (onSubmit) {
//           onSubmit(letterData);
//         }
//       } else {
//         throw new Error('Invalid response format: Expected HTML');
//       }
//     } catch (err) {
//       console.error('Error generating appointment letter:', err);
//       handleApiError(err, 'Failed to generate appointment letter');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Handle print letter from preview
//   const handlePrintLetter = () => {
//     if (previewHtml) {
//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(`
//         <!DOCTYPE html>
//         <html>
//           <head>
//             <title>Appointment Letter</title>
//             <style>
//               @media print {
//                 body { 
//                   margin: 0; 
//                   padding: 20px; 
//                   font-family: Arial, sans-serif;
//                 }
//                 * { 
//                   -webkit-print-color-adjust: exact; 
//                   print-color-adjust: exact; 
//                 }
//               }
//             </style>
//           </head>
//           <body>${previewHtml}</body>
//         </html>
//       `);
//       printWindow.document.close();
//       printWindow.focus();
      
//       setTimeout(() => {
//         printWindow.print();
//       }, 500);
//     }
//   };

//   // Handle close preview
//   const handleClosePreview = () => {
//     setShowPreview(false);
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     if (!amount && amount !== 0) return 'N/A';
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   // Format date for display
//   const formatDisplayDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   // Render error alert with details
//   const renderErrorAlert = () => {
//     if (!error) return null;
    
//     return (
//       <Alert 
//         severity="error" 
//         sx={{ mb: 3, borderRadius: 2 }}
//         action={
//           apiErrorDetails && (
//             <Button 
//               color="inherit" 
//               size="small"
//               onClick={() => setShowErrorDetails(!showErrorDetails)}
//               startIcon={<ErrorIcon />}
//             >
//               {showErrorDetails ? 'Hide Details' : 'Show Details'}
//             </Button>
//           )
//         }
//         onClose={() => setError('')}
//       >
//         <Typography variant="body2" fontWeight={500}>
//           {error}
//         </Typography>
        
//         {apiErrorDetails && (
//           <Collapse in={showErrorDetails}>
//             <Paper
//               variant="outlined"
//               sx={{
//                 mt: 2,
//                 p: 1.5,
//                 bgcolor: '#fef2f2',
//                 borderColor: '#fecaca',
//                 maxHeight: '200px',
//                 overflow: 'auto'
//               }}
//             >
//               <Typography
//                 variant="caption"
//                 component="pre"
//                 sx={{
//                   whiteSpace: 'pre-wrap',
//                   wordBreak: 'break-all',
//                   fontSize: '0.7rem',
//                   color: '#991b1b'
//                 }}
//               >
//                 {apiErrorDetails}
//               </Typography>
//             </Paper>
//           </Collapse>
//         )}
//       </Alert>
//     );
//   };

//   // Render step content for Step 0 - Select Candidate
//   const renderStep0 = () => (
//     <Stack spacing={3}>
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1976D2">
//           Select Candidate
//         </Typography>

//         {fetchingCandidates ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//             <CircularProgress size={32} />
//           </Box>
//         ) : (
//           <FormControl fullWidth size="small" error={!!error && !selectedCandidate}>
//             <InputLabel>Select Candidate with Accepted Offer</InputLabel>
//             <Select
//               value={selectedCandidate}
//               onChange={handleCandidateChange}
//               label="Select Candidate with Accepted Offer"
//             >
//               <MenuItem value="">Choose a candidate</MenuItem>
//               {candidates.map((cand) => (
//                 <MenuItem key={cand._id} value={cand._id}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <Avatar sx={{ width: 24, height: 24, bgcolor: PRIMARY_BLUE, fontSize: '0.75rem' }}>
//                       {cand.firstName?.[0]}{cand.lastName?.[0]}
//                     </Avatar>
//                     <Box>
//                       <Typography variant="body2">
//                         {cand.firstName} {cand.lastName}
//                       </Typography>
//                       <Typography variant="caption" color="textSecondary">
//                         {cand.candidateId} - {cand.email}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </MenuItem>
//               ))}
//             </Select>
//             {!selectedCandidate && error && (
//               <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
//                 {error}
//               </Typography>
//             )}
//           </FormControl>
//         )}

//         {candidates.length === 0 && !fetchingCandidates && !error && (
//           <Alert severity="info" sx={{ mt: 2 }}>
//             No candidates with accepted offers found.
//           </Alert>
//         )}

//         {candidates.length > 0 && (
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="caption" color="textSecondary">
//               Showing {candidates.length} candidate(s) with accepted offers
//             </Typography>
//           </Box>
//         )}
//       </Paper>

//       <Alert severity="info" icon={<InfoIcon />} sx={{ borderRadius: 2 }}>
//         <Typography variant="body2">
//           Select a candidate who has accepted an offer to generate an appointment letter.
//         </Typography>
//       </Alert>
//     </Stack>
//   );

//   // Render step content for Step 1 - Review Offer
//   const renderStep1 = () => (
//     <Stack spacing={3}>
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1976D2">
//           Review Offer Details
//         </Typography>

//         {fetchingCandidateDetails ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//             <CircularProgress size={32} />
//           </Box>
//         ) : !selectedCandidateDetails ? (
//           <Alert severity="warning">Please select a candidate first</Alert>
//         ) : !offerDetails ? (
//           <Alert 
//             severity="warning"
//             action={
//               <Button 
//                 color="inherit" 
//                 size="small"
//                 onClick={() => fetchCandidateDetails(selectedCandidate)}
//                 startIcon={<RefreshIcon />}
//               >
//                 Retry
//               </Button>
//             }
//           >
//             No accepted offer found for this candidate
//           </Alert>
//         ) : (
//           <Box>
//             {/* Candidate Summary */}
//             <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, mb: 3 }}>
//               <Typography variant="subtitle2" gutterBottom fontWeight={600} sx={{ color: '#1976D2' }}>
//                 Candidate Information
//               </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="caption" color="textSecondary">Full Name</Typography>
//                   <Typography variant="body2" fontWeight={500}>
//                     {selectedCandidateDetails.firstName} {selectedCandidateDetails.lastName}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="caption" color="textSecondary">Candidate ID</Typography>
//                   <Typography variant="body2">{selectedCandidateDetails.candidateId}</Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="caption" color="textSecondary">Email</Typography>
//                   <Typography variant="body2">{selectedCandidateDetails.email}</Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="caption" color="textSecondary">Phone</Typography>
//                   <Typography variant="body2">{selectedCandidateDetails.phone}</Typography>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Offer Details */}
//             <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
//               <Typography variant="subtitle2" gutterBottom fontWeight={600} sx={{ color: '#1976D2', mb: 2 }}>
//                 Offer Details
//               </Typography>

//               {/* Offer Information */}
//               <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 1 }}>
//                 <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
//                   OFFER INFORMATION
//                 </Typography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={4}>
//                     <Typography variant="caption" color="textSecondary">Offer ID</Typography>
//                     <Typography variant="body2" fontWeight={600}>{offerDetails.offerId || 'N/A'}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={4}>
//                     <Typography variant="caption" color="textSecondary">Status</Typography>
//                     <Box sx={{ mt: 0.5 }}>
//                       <Chip
//                         label={offerDetails.status}
//                         size="small"
//                         sx={{
//                           bgcolor: '#d1fae5',
//                           color: '#065f46',
//                           height: 24,
//                           fontSize: '12px',
//                           fontWeight: 500
//                         }}
//                       />
//                     </Box>
//                   </Grid>
//                   <Grid item xs={12} sm={4}>
//                     <Typography variant="caption" color="textSecondary">Employment Type</Typography>
//                     <Typography variant="body2">{offerDetails.offerDetails?.employmentType || 'Permanent'}</Typography>
//                   </Grid>
//                 </Grid>
//               </Paper>

//               {/* Position Details */}
//               <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 1 }}>
//                 <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
//                   POSITION DETAILS
//                 </Typography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={4}>
//                     <Typography variant="caption" color="textSecondary">Designation</Typography>
//                     <Typography variant="body2" fontWeight={500}>
//                       {offerDetails.offerDetails?.designation || 'N/A'}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={4}>
//                     <Typography variant="caption" color="textSecondary">Department</Typography>
//                     <Typography variant="body2">{offerDetails.offerDetails?.department || 'N/A'}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={4}>
//                     <Typography variant="caption" color="textSecondary">Location</Typography>
//                     <Typography variant="body2">{offerDetails.offerDetails?.location || 'N/A'}</Typography>
//                   </Grid>
//                 </Grid>
//               </Paper>

//               {/* Joining Date */}
//               <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 1 }}>
//                 <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
//                   JOINING DETAILS
//                 </Typography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="caption" color="textSecondary">Joining Date</Typography>
//                     <Typography variant="body2" fontWeight={500} sx={{ color: '#1976D2' }}>
//                       {offerDetails.offerDetails?.joiningDate ? formatDisplayDate(offerDetails.offerDetails.joiningDate) : 'Not specified'}
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               </Paper>

//               {/* Compensation Details */}
//               {offerDetails.ctcDetails && (
//                 <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 1 }}>
//                   <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
//                     COMPENSATION DETAILS
//                   </Typography>
//                   <Grid container spacing={2}>
//                     <Grid item xs={6} sm={3}>
//                       <Typography variant="caption" color="textSecondary">Basic Salary</Typography>
//                       <Typography variant="body2" fontWeight={500}>{formatCurrency(offerDetails.ctcDetails.basic)}</Typography>
//                     </Grid>
//                     <Grid item xs={6} sm={3}>
//                       <Typography variant="caption" color="textSecondary">HRA</Typography>
//                       <Typography variant="body2">{formatCurrency(offerDetails.ctcDetails.hra)}</Typography>
//                     </Grid>
//                     <Grid item xs={6} sm={3}>
//                       <Typography variant="caption" color="textSecondary">Conveyance</Typography>
//                       <Typography variant="body2">{formatCurrency(offerDetails.ctcDetails.conveyanceAllowance) || 'N/A'}</Typography>
//                     </Grid>
//                     <Grid item xs={6} sm={3}>
//                       <Typography variant="caption" color="textSecondary">Medical</Typography>
//                       <Typography variant="body2">{formatCurrency(offerDetails.ctcDetails.medicalAllowance) || 'N/A'}</Typography>
//                     </Grid>
//                   </Grid>

//                   <Divider sx={{ my: 2 }} />

//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Typography variant="subtitle2">Total CTC (Annual)</Typography>
//                     <Typography variant="h6" color="success.main" fontWeight={600}>
//                       {formatCurrency(offerDetails.ctcDetails.totalCtc)}
//                     </Typography>
//                   </Box>
//                 </Paper>
//               )}
//             </Paper>
//           </Box>
//         )}
//       </Paper>

//       <Alert severity="info" icon={<InfoIcon />} sx={{ borderRadius: 2 }}>
//         <Typography variant="body2">
//           Review the offer details. The joining date will be used for the appointment letter.
//         </Typography>
//       </Alert>
//     </Stack>
//   );

//   // Render step content for Step 2 - Generate
//   const renderStep2 = () => (
//     <Stack spacing={3}>
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1976D2">
//           Generate Appointment Letter
//         </Typography>

//         {/* Summary Card */}
//         <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, mb: 3 }}>
//           <Typography variant="subtitle2" gutterBottom fontWeight={600}>
//             Summary
//           </Typography>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography variant="caption" color="textSecondary">Candidate</Typography>
//               <Typography variant="body1" fontWeight={500}>
//                 {candidateDetails?.firstName} {candidateDetails?.lastName}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="caption" color="textSecondary">Candidate ID</Typography>
//               <Typography variant="body2">{candidateDetails?.candidateId}</Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="caption" color="textSecondary">Offer ID</Typography>
//               <Typography variant="body2">{offerDetails?.offerId || 'N/A'}</Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="caption" color="textSecondary">Designation</Typography>
//               <Typography variant="body2">{offerDetails?.offerDetails?.designation || 'N/A'}</Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="caption" color="textSecondary">Total CTC</Typography>
//               <Typography variant="body2" fontWeight={600} color="success.main">
//                 {formatCurrency(offerDetails?.ctcDetails?.totalCtc)}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="caption" color="textSecondary">Joining Date</Typography>
//               <Typography variant="body2" fontWeight={500}>
//                 {offerDetails?.offerDetails?.joiningDate ? formatDisplayDate(offerDetails.offerDetails.joiningDate) : 'N/A'}
//               </Typography>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* Validation warnings before generation */}
//         {Object.keys(validationErrors).length > 0 && !generatedLetter && (
//           <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               The following issues may affect the appointment letter format:
//             </Typography>
//             <List dense>
//               {Object.values(validationErrors).map((error, index) => (
//                 <ListItem key={index}>
//                   <ListItemIcon sx={{ minWidth: 30 }}>
//                     <WarningIcon color="warning" fontSize="small" />
//                   </ListItemIcon>
//                   <ListItemText primary={error} />
//                 </ListItem>
//               ))}
//             </List>
//           </Alert>
//         )}

//         {/* Generated Letter Card */}
//         {generatedLetter ? (
//           <Card sx={{ mb: 3, border: '1px solid', borderColor: 'success.main' }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
//                 <Avatar sx={{ bgcolor: '#2E7D32' }}>
//                   <CheckCircleIcon />
//                 </Avatar>
//                 <Box>
//                   <Typography variant="h6" color="success.main">
//                     Letter Generated Successfully!
//                   </Typography>
//                   <Typography variant="body2" color="textSecondary">
//                     You can now preview, print, download, or email the letter
//                   </Typography>
//                 </Box>
//               </Box>

//               <Divider sx={{ my: 2 }} />

//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="caption" color="textSecondary">Document ID</Typography>
//                   <Typography variant="body2">{generatedLetter.documentId}</Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="caption" color="textSecondary">Generated At</Typography>
//                   <Typography variant="body2">
//                     {new Date(generatedLetter.generatedAt).toLocaleString()}
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </CardContent>
//             <CardActions sx={{ p: 2, pt: 0, gap: 1, flexWrap: 'wrap' }}>
//               <Button
//                 variant="contained"
//                 startIcon={<PrintIcon />}
//                 onClick={handlePrintLetter}
//                 sx={{
//                   background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                   '&:hover': {
//                     background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
//                   },
//                   flex: { xs: '1 1 calc(50% - 4px)', sm: '1 1 auto' }
//                 }}
//               >
//                 Print
//               </Button>
//               <Button
//                 variant="outlined"
//                 startIcon={<VisibilityIcon />}
//                 onClick={handlePreview}
//                 sx={{
//                   borderColor: PRIMARY_BLUE,
//                   color: PRIMARY_BLUE,
//                   '&:hover': {
//                     borderColor: '#0096b4',
//                     bgcolor: 'rgba(0, 180, 216, 0.04)'
//                   },
//                   flex: { xs: '1 1 calc(50% - 4px)', sm: '1 1 auto' }
//                 }}
//               >
//                 Preview
//               </Button>
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 startIcon={downloading ? <CircularProgress size={20} /> : <DownloadIcon />}
//                 onClick={handleDownloadLetter}
//                 disabled={downloading || !previewHtml}
//                 sx={{
//                   background: 'linear-gradient(135deg, #2E7D32, #4CAF50)',
//                   '&:hover': {
//                     background: 'linear-gradient(135deg, #1B5E20, #388E3C)'
//                   },
//                   flex: { xs: '1 1 calc(50% - 4px)', sm: '1 1 auto' }
//                 }}
//               >
//                 {downloading ? 'Downloading...' : 'Download'}
//               </Button>
//               <Button
//                 variant="contained"
//                 startIcon={<SendIcon />}
//                 onClick={() => {
//                   setEmailAddress(candidateDetails?.email || '');
//                   setShowEmailDialog(true);
//                 }}
//                 sx={{
//                   background: 'linear-gradient(135deg, #1976D2, #2196F3)',
//                   '&:hover': {
//                     background: 'linear-gradient(135deg, #1565C0, #1976D2)'
//                   },
//                   flex: { xs: '1 1 100%', sm: '1 1 auto' },
//                   mt: { xs: 1, sm: 0 }
//                 }}
//               >
//                 Send Email
//               </Button>
//             </CardActions>
//           </Card>
//         ) : (
//           <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
//             <Button
//               fullWidth
//               variant="contained"
//               onClick={handleGenerateAndPreview}
//               disabled={submitting || !offerDetails?.offerDetails?.joiningDate}
//               startIcon={submitting ? <CircularProgress size={20} /> : <ViewIcon />}
//               sx={{
//                 background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
//                 },
//                 '&.Mui-disabled': {
//                   background: '#e0e0e0'
//                 }
//               }}
//             >
//               {submitting ? 'Generating...' : 'Generate & Preview Letter'}
//             </Button>
//           </Box>
//         )}
//       </Paper>
//     </Stack>
//   );

//   // Main render function for step content
//   const renderStepContent = () => {
//     switch (step) {
//       case 0:
//         return renderStep0();
//       case 1:
//         return renderStep1();
//       case 2:
//         return renderStep2();
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       {/* Main Dialog */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: { borderRadius: 2, maxHeight: '90vh' }
//         }}
//       >
//         <DialogTitle sx={{
//           borderBottom: 1,
//           borderColor: '#E0E0E0',
//           bgcolor: '#F8FAFC',
//           px: 3,
//           py: 2,
//           position: 'sticky',
//           top: 0,
//           zIndex: 2
//         }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Box>
//               <Typography variant="h6" fontWeight={600}>
//                 Generate Appointment Letter
//               </Typography>
//               <Typography variant="caption" color="textSecondary">
//                 Create appointment letter for selected candidate
//               </Typography>
//             </Box>
//             <IconButton onClick={handleClose} size="small">
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </DialogTitle>

//         <DialogContent sx={{ pt: 3, px: 3, overflowY: 'auto' }}>
//           {/* Error/Success Messages */}
//           {renderErrorAlert()}
          
//           {success && !generatedLetter && (
//             <Alert 
//               severity="success" 
//               onClose={() => setSuccess('')} 
//               sx={{ mb: 3, borderRadius: 2 }}
//             >
//               {success}
//             </Alert>
//           )}

//           {/* Stepper */}
//           <Stepper activeStep={step} sx={{ mb: 4, mt: 2 }}>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>

//           {/* Step Content */}
//           <Box sx={{ minHeight: 400 }}>
//             {renderStepContent()}
//           </Box>
//         </DialogContent>

//         <DialogActions sx={{
//           px: 3,
//           py: 2,
//           borderTop: 1,
//           borderColor: '#E0E0E0',
//           bgcolor: '#F8FAFC',
//           justifyContent: 'space-between',
//           position: 'sticky',
//           bottom: 0,
//           zIndex: 2
//         }}>
//           <Button onClick={handleClose}>
//             Cancel
//           </Button>
//           <Box>
//             <Button
//               disabled={step === 0}
//               onClick={handleBack}
//               sx={{ mr: 1 }}
//             >
//               Back
//             </Button>
//             {step === steps.length - 1 ? (
//               <Button
//                 variant="contained"
//                 onClick={handleGenerateAndPreview}
//                 disabled={submitting || generatedLetter || !offerDetails?.offerDetails?.joiningDate}
//                 startIcon={submitting ? <CircularProgress size={20} /> : <ViewIcon />}
//                 sx={{
//                   background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                   minWidth: 200,
//                   '&:hover': {
//                     background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
//                   },
//                   '&.Mui-disabled': {
//                     background: '#e0e0e0'
//                   }
//                 }}
//               >
//                 {submitting ? 'Generating...' : 'Generate'}
//               </Button>
//             ) : (
//               <Button
//                 variant="contained"
//                 onClick={handleNext}
//                 disabled={step === 1 && !offerDetails}
//                 sx={{
//                   background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                   '&:hover': {
//                     background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
//                   }
//                 }}
//               >
//                 Next
//               </Button>
//             )}
//           </Box>
//         </DialogActions>
//       </Dialog>

//       {/* Preview Dialog */}
//       <Dialog
//         open={showPreview}
//         onClose={handleClosePreview}
//         maxWidth="lg"
//         fullWidth
//         PaperProps={{
//           sx: { 
//             borderRadius: 2, 
//             height: '90vh',
//             maxHeight: '90vh'
//           }
//         }}
//       >
//         <DialogTitle sx={{
//           borderBottom: 1,
//           borderColor: '#E0E0E0',
//           bgcolor: '#F8FAFC',
//           px: 3,
//           py: 2,
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography variant="h6">Appointment Letter Preview</Typography>
//           <Box>
//             <Button
//               variant="contained"
//               onClick={handlePrintLetter}
//               startIcon={<PrintIcon />}
//               sx={{
//                 mr: 1,
//                 background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
//                 }
//               }}
//             >
//               Print
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleDownloadLetter}
//               startIcon={downloading ? <CircularProgress size={20} /> : <DownloadIcon />}
//               disabled={downloading}
//               sx={{
//                 mr: 1,
//                 background: 'linear-gradient(135deg, #2E7D32, #4CAF50)',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #1B5E20, #388E3C)'
//                 }
//               }}
//             >
//               {downloading ? 'Downloading...' : 'Download'}
//             </Button>
//             <Button
//               variant="contained"
//               startIcon={<SendIcon />}
//               onClick={() => {
//                 setShowPreview(false);
//                 setEmailAddress(candidateDetails?.email || '');
//                 setShowEmailDialog(true);
//               }}
//               sx={{
//                 mr: 1,
//                 background: 'linear-gradient(135deg, #1976D2, #2196F3)',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #1565C0, #1976D2)'
//                 }
//               }}
//             >
//               Send Email
//             </Button>
//             <IconButton onClick={handleClosePreview} edge="end">
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent dividers sx={{ p: 0, bgcolor: '#f5f5f5' }}>
//           {previewHtml ? (
//             <iframe
//               srcDoc={previewHtml}
//               title="Appointment Letter Preview"
//               style={{ 
//                 width: '100%', 
//                 height: '100%', 
//                 border: 'none',
//                 backgroundColor: 'white'
//               }}
//               sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
//             />
//           ) : (
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'center', 
//               alignItems: 'center', 
//               height: '100%' 
//             }}>
//               <CircularProgress />
//             </Box>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Email Dialog */}
//       <Dialog
//         open={showEmailDialog}
//         onClose={() => !sendingEmail && setShowEmailDialog(false)}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: { borderRadius: 2 }
//         }}
//       >
//         <DialogTitle sx={{
//           borderBottom: 1,
//           borderColor: '#E0E0E0',
//           bgcolor: '#F8FAFC',
//           px: 3,
//           py: 2,
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Box>
//             <Typography variant="h6" fontWeight={600}>
//               {emailSent ? 'Email Sent' : 'Send Appointment Letter'}
//             </Typography>
//             <Typography variant="caption" color="textSecondary">
//               {emailSent ? 'Email delivery confirmation' : 'Send letter to candidate via email'}
//             </Typography>
//           </Box>
//           <IconButton onClick={() => !sendingEmail && setShowEmailDialog(false)} size="small" disabled={sendingEmail}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent sx={{ pt: 3, px: 3 }}>
//           {!emailSent ? (
//             <>
//               {/* Candidate Info */}
//               {candidateDetails && (
//                 <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 3 }}>
//                   <Stack direction="row" spacing={2} alignItems="center">
//                     <Avatar sx={{ bgcolor: '#00B4D8' }}>
//                       <PersonIcon />
//                     </Avatar>
//                     <Box sx={{ flex: 1 }}>
//                       <Typography variant="subtitle2" fontWeight={600}>
//                         {candidateDetails.firstName} {candidateDetails.lastName}
//                       </Typography>
//                       <Typography variant="caption" color="textSecondary">
//                         ID: {candidateDetails.candidateId}
//                       </Typography>
//                     </Box>
//                   </Stack>
//                 </Paper>
//               )}

//               {/* Document Info */}
//               <Alert 
//                 severity="info" 
//                 sx={{ mb: 3 }}
//                 icon={<DescriptionIcon />}
//               >
//                 <Box>
//                   <Typography variant="body2">
//                     Document ID: <strong>{generatedLetter?.documentId}</strong>
//                   </Typography>
//                   <Typography variant="caption" color="textSecondary">
//                     Ready to send to candidate
//                   </Typography>
//                 </Box>
//               </Alert>
              
//               {/* Email Input */}
//               <Box sx={{ mb: 2 }}>
//                 <TextField
//                   fullWidth
//                   required
//                   label="Recipient Email"
//                   type="email"
//                   value={emailAddress}
//                   onChange={(e) => setEmailAddress(e.target.value)}
//                   variant="outlined"
//                   size="medium"
//                   placeholder="candidate@example.com"
//                   error={!!emailError}
//                   helperText={emailError}
//                   disabled={sendingEmail}
//                   InputProps={{
//                     startAdornment: (
//                       <EmailIcon sx={{ color: '#64748B', mr: 1, fontSize: 20 }} />
//                     ),
//                   }}
//                 />
//                 <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
//                   The appointment letter will be sent to this email address
//                 </Typography>
//               </Box>

//               {emailSuccess && (
//                 <Alert severity="success" sx={{ mt: 2, mb: 1 }}>
//                   {emailSuccess}
//                 </Alert>
//               )}

//               <Alert severity="info" sx={{ mt: 2 }}>
//                 <Typography variant="body2">
//                   The email will contain the appointment letter as an attachment.
//                   Make sure the email address is correct.
//                 </Typography>
//               </Alert>
//             </>
//           ) : (
//             <Box sx={{ textAlign: 'center', py: 3 }}>
//               <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
//               <Typography variant="h5" gutterBottom>
//                 Email Sent Successfully!
//               </Typography>
//               <Typography variant="body1" color="textSecondary" paragraph>
//                 The appointment letter has been sent to {emailAddress}
//               </Typography>
//             </Box>
//           )}
//         </DialogContent>

//         <DialogActions sx={{
//           px: 3,
//           py: 2,
//           borderTop: 1,
//           borderColor: '#E0E0E0',
//           bgcolor: '#F8FAFC',
//           justifyContent: 'space-between'
//         }}>
//           <Button 
//             onClick={() => setShowEmailDialog(false)} 
//             disabled={sendingEmail}
//           >
//             {emailSent ? 'CLOSE' : 'CANCEL'}
//           </Button>
          
//           {!emailSent ? (
//             <Button
//               variant="contained"
//               onClick={handleSendEmail}
//               disabled={sendingEmail || !emailAddress}
//               startIcon={sendingEmail ? <CircularProgress size={20} /> : <SendIcon />}
//               sx={{
//                 background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                 minWidth: 120,
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
//                 },
//                 '&.Mui-disabled': {
//                   background: '#e0e0e0'
//                 }
//               }}
//             >
//               {sendingEmail ? 'SENDING...' : 'SEND EMAIL'}
//             </Button>
//           ) : null}
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default GenerateAppointmentLetter;

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
  TextField,
  Collapse,
  InputAdornment,
  FormHelperText
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
  Description as DescriptionIcon,
  Person as PersonIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

// Color constants matching other components
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

const steps = ['Select Candidate', 'Review Offer', 'Generate'];

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
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState(null);
  const [selectedOfferDetails, setSelectedOfferDetails] = useState(null);
  const [fetchingCandidates, setFetchingCandidates] = useState(false);
  const [fetchingCandidateDetails, setFetchingCandidateDetails] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [apiErrorDetails, setApiErrorDetails] = useState('');
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  // Get candidate details - moved before renderStepContent
  const candidateDetails = selectedCandidate ? candidates.find(c => c._id === selectedCandidate) : null;
  const offerDetails = selectedOfferDetails;

  useEffect(() => {
    if (open) {
      fetchCandidates();
      resetState();
    }
  }, [open]);

  useEffect(() => {
    if (selectedCandidate) {
      fetchCandidateDetails(selectedCandidate);
    } else {
      setSelectedCandidateDetails(null);
      setSelectedOfferDetails(null);
    }
  }, [selectedCandidate]);

  useEffect(() => {
    if (candidateDetails?.email) {
      setEmailAddress(candidateDetails.email);
    }
  }, [candidateDetails]);

  const resetState = () => {
    setStep(0);
    setSelectedCandidate('');
    setGeneratedLetter(null);
    setError('');
    setSuccess('');
    setApiErrorDetails('');
    setShowErrorDetails(false);
    setSelectedCandidateDetails(null);
    setSelectedOfferDetails(null);
    setPreviewHtml(null);
    setShowPreview(false);
    setShowEmailDialog(false);
    setEmailSent(false);
    setEmailError('');
    setEmailSuccess('');
    setFieldErrors({});
    setTouched({});
  };

  const fetchCandidates = async () => {
    setFetchingCandidates(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/candidates?status=selected`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const candidatesWithAcceptedOffers = response.data.data.filter(candidate => 
          candidate.latestOffer && candidate.latestOffer.status === 'accepted'
        );
        setCandidates(candidatesWithAcceptedOffers);
        
        if (candidatesWithAcceptedOffers.length === 0) {
          setError('No candidates with accepted offers found');
        }
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

  const fetchCandidateDetails = async (candidateId) => {
    setFetchingCandidateDetails(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/candidates?_id=${candidateId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success && response.data.data.length > 0) {
        const candidate = response.data.data[0];
        setSelectedCandidateDetails(candidate);
        
        if (candidate.latestOffer && candidate.latestOffer.status === 'accepted') {
          setSelectedOfferDetails(candidate.latestOffer);
        } else {
          setError('This candidate does not have an accepted offer');
        }
      } else {
        setError('Candidate details not found');
      }
    } catch (err) {
      console.error('Error fetching candidate details:', err);
      setError(err.response?.data?.message || 'Failed to fetch candidate details');
    } finally {
      setFetchingCandidateDetails(false);
    }
  };

  const handleCandidateChange = (e) => {
    setSelectedCandidate(e.target.value);
    setError('');
    setApiErrorDetails('');
    setShowErrorDetails(false);
    if (fieldErrors.candidate) setFieldErrors(prev => ({ ...prev, candidate: '' }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleNext = () => {
    if (step === 0 && !selectedCandidate) {
      setError('Please select a candidate');
      setFieldErrors(prev => ({ ...prev, candidate: 'Please select a candidate' }));
      return;
    }
    if (step === 1 && !selectedOfferDetails) {
      setError('No accepted offer found for this candidate');
      return;
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handlePreview = () => {
    if (previewHtml) {
      setShowPreview(true);
    }
  };

  const handleDownloadLetter = () => {
    if (!previewHtml) return;
    
    setDownloading(true);
    
    try {
      const blob = new Blob([previewHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const candidateName = candidateDetails ? 
        `${candidateDetails.firstName}_${candidateDetails.lastName}`.replace(/\s+/g, '_') : 
        'appointment_letter';
      const date = new Date().toISOString().split('T')[0];
      link.download = `${candidateName}_appointment_letter_${date}.html`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess('Letter downloaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error downloading letter:', err);
      setError('Failed to download letter');
    } finally {
      setDownloading(false);
    }
  };

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
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>${previewHtml}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const handleSendEmail = async () => {
    if (!emailAddress) {
      setEmailError('Please enter an email address');
      return;
    }

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
      
      const response = await axios.post(
        `${BASE_URL}/api/appointment-letter/send/${generatedLetter.documentId}`,
        { email: emailAddress },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setEmailSent(true);
        setEmailSuccess(response.data.message || 'Email sent successfully!');
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
      setEmailError(err.response?.data?.message || 'Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const extractDocumentIdFromHtml = (html) => {
    const match = html.match(/data-document-id=["']([^"']+)["']/);
    return match ? match[1] : null;
  };

  const handleGenerateAndPreview = async () => {
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      let joiningDate = selectedOfferDetails?.offerDetails?.joiningDate;
      
      if (!joiningDate) {
        throw new Error('Joining date not found in offer details');
      }

      const formattedDate = new Date(joiningDate).toISOString().split('T')[0];

      const response = await axios.post(
        `${BASE_URL}/api/appointment-letter/generate`,
        {
          candidateId: selectedCandidate,
          offerId: selectedOfferDetails._id,
          joiningDate: formattedDate
        },
        {
          headers: { 'Authorization': `Bearer ${token}` },
          timeout: 30000,
          responseType: 'text'
        }
      );

      const htmlContent = response.data;
      
      if (typeof htmlContent === 'string' && htmlContent.includes('<!DOCTYPE html>')) {
        setPreviewHtml(htmlContent);
        const docId = extractDocumentIdFromHtml(htmlContent);
        
        const letterData = {
          documentId: docId || `TEMP-${Date.now()}`,
          candidateId: selectedCandidate,
          candidateName: candidateDetails ? `${candidateDetails.firstName} ${candidateDetails.lastName}` : 'Candidate',
          candidateEmail: candidateDetails?.email || '',
          offerId: selectedOfferDetails._id,
          offerDesignation: selectedOfferDetails.offerDetails?.designation || 'Not Specified',
          status: 'generated',
          generatedAt: new Date().toISOString(),
          joiningDate: formattedDate,
          html: htmlContent
        };

        setGeneratedLetter(letterData);
        setSuccess('Appointment letter generated successfully!');
        setShowPreview(true);

        if (onSubmit) onSubmit(letterData);
      } else {
        throw new Error('Invalid response format: Expected HTML');
      }
    } catch (err) {
      console.error('Error generating appointment letter:', err);
      setError(err.response?.data?.message || 'Failed to generate appointment letter');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
      '&.Mui-error fieldset': { borderColor: '#EF4444' }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary,
      '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  const getErrorProps = (field) => {
    const hasError = touched[field] && fieldErrors[field];
    return { error: !!hasError, helperText: hasError || '' };
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Select Candidate
                </Typography>
              </Box>

              {fetchingCandidates ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                </Box>
              ) : (
                <FormControl fullWidth size="small" error={touched.candidate && !!fieldErrors.candidate}>
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Select Candidate with Accepted Offer *</InputLabel>
                  <Select
                    value={selectedCandidate}
                    onChange={handleCandidateChange}
                    onBlur={() => handleBlur('candidate')}
                    label="Select Candidate with Accepted Offer *"
                    sx={inputStyle}
                    MenuProps={{
                      PaperProps: { sx: { maxHeight: 200, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' } }
                    }}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Choose a candidate</MenuItem>
                    {candidates.map((cand) => (
                      <MenuItem key={cand._id} value={cand._id} sx={{ fontSize: '0.75rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: COLORS.primary, fontSize: '0.7rem' }}>
                            {cand.firstName?.[0]}{cand.lastName?.[0]}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem' }}>
                              {cand.firstName} {cand.lastName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {cand.candidateId} - {cand.email}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.candidate && fieldErrors.candidate && (
                    <FormHelperText sx={{ fontSize: '0.65rem' }}>{fieldErrors.candidate}</FormHelperText>
                  )}
                </FormControl>
              )}

              {candidates.length === 0 && !fetchingCandidates && !error && (
                <Alert severity="info" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
                  No candidates with accepted offers found.
                </Alert>
              )}
            </Paper>

            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              Select a candidate who has accepted an offer to generate an appointment letter.
            </Alert>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AssignmentIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Review Offer Details
                </Typography>
              </Box>

              {fetchingCandidateDetails ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                </Box>
              ) : !candidateDetails ? (
                <Alert severity="warning" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                  Please select a candidate first
                </Alert>
              ) : !offerDetails ? (
                <Alert severity="warning" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                  No accepted offer found for this candidate
                </Alert>
              ) : (
                <Box>
                  <Paper sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}`, mb: 2 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                      Candidate Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={labelStyle}>Full Name</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {candidateDetails.firstName} {candidateDetails.lastName}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={labelStyle}>Candidate ID</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {candidateDetails.candidateId}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={labelStyle}>Email</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {candidateDetails.email}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={labelStyle}>Phone</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {candidateDetails.phone}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                      Offer Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={labelStyle}>Offer ID</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                          {offerDetails.offerId || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={labelStyle}>Designation</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {offerDetails.offerDetails?.designation || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={labelStyle}>Employment Type</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {offerDetails.offerDetails?.employmentType || 'Permanent'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={labelStyle}>Joining Date</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.primary }}>
                          {offerDetails.offerDetails?.joiningDate ? formatDisplayDate(offerDetails.offerDetails.joiningDate) : 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={labelStyle}>Total CTC</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#2E7D32' }}>
                          {formatCurrency(offerDetails.ctcDetails?.totalCtc)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              )}
            </Paper>

            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              Review the offer details. The joining date will be used for the appointment letter.
            </Alert>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <DescriptionIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Generate Appointment Letter
                </Typography>
              </Box>

              <Paper sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}`, mb: 3 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={labelStyle}>Candidate</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {candidateDetails?.firstName} {candidateDetails?.lastName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelStyle}>Candidate ID</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {candidateDetails?.candidateId}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelStyle}>Designation</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {offerDetails?.offerDetails?.designation || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelStyle}>Joining Date</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.primary }}>
                      {offerDetails?.offerDetails?.joiningDate ? formatDisplayDate(offerDetails.offerDetails.joiningDate) : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={labelStyle}>Total CTC</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#2E7D32' }}>
                      {formatCurrency(offerDetails?.ctcDetails?.totalCtc)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {generatedLetter ? (
                <Card sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.status.success}`, boxShadow: 'none' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#2E7D32', width: 40, height: 40 }}>
                        <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#2E7D32' }}>
                          Letter Generated Successfully!
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          You can now preview, print, download, or email the letter
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ borderColor: COLORS.border, my: 1.5 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={labelStyle}>Document ID</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace', color: COLORS.text.primary }}>
                          {generatedLetter.documentId}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={labelStyle}>Generated At</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {new Date(generatedLetter.generatedAt).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<PrintIcon sx={{ fontSize: '0.9rem' }} />}
                      onClick={handlePrintLetter}
                      sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', textTransform: 'none' }}
                    >
                      Print
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ViewIcon sx={{ fontSize: '0.9rem' }} />}
                      onClick={handlePreview}
                      sx={{ height: 32, px: 2, borderRadius: 1.5, borderColor: COLORS.border, color: COLORS.text.secondary, fontSize: '0.7rem', textTransform: 'none' }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={downloading ? <CircularProgress size={20} /> : <DownloadIcon sx={{ fontSize: '0.9rem' }} />}
                      onClick={handleDownloadLetter}
                      disabled={downloading || !previewHtml}
                      sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#2E7D32', fontSize: '0.7rem', textTransform: 'none' }}
                    >
                      {downloading ? 'Downloading...' : 'Download'}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SendIcon sx={{ fontSize: '0.9rem' }} />}
                      onClick={() => {
                        setEmailAddress(candidateDetails?.email || '');
                        setShowEmailDialog(true);
                      }}
                      sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#1976D2', fontSize: '0.7rem', textTransform: 'none' }}
                    >
                      Send Email
                    </Button>
                  </CardActions>
                </Card>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleGenerateAndPreview}
                  disabled={submitting || !offerDetails?.offerDetails?.joiningDate}
                  startIcon={submitting ? <CircularProgress size={20} /> : <DescriptionIcon sx={{ fontSize: '1rem' }} />}
                  sx={{ height: 36, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', textTransform: 'none' }}
                >
                  {submitting ? 'Generating...' : 'Generate & Preview Letter'}
                </Button>
              )}
            </Paper>
          </Stack>
        );

      default: return null;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            border: `1px solid ${COLORS.border}`,
            overflow: 'hidden',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          py: 1.5,
          px: 2.5,
          bgcolor: COLORS.background.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
              Generate Appointment Letter
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
          </IconButton>
        </DialogTitle>

        <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
          <Stepper activeStep={step} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5, fontSize: '0.75rem' }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && !generatedLetter && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 1.5, fontSize: '0.75rem' }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}
          {renderStepContent()}
        </DialogContent>

        <DialogActions sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          justifyContent: 'space-between'
        }}>
          <Button onClick={handleClose} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', textTransform: 'none' }}>
            Cancel
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button disabled={step === 0} onClick={handleBack} startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', textTransform: 'none' }}>
              Back
            </Button>
            {step === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleGenerateAndPreview}
                disabled={submitting || generatedLetter || !offerDetails?.offerDetails?.joiningDate}
                startIcon={submitting ? <CircularProgress size={20} /> : <DescriptionIcon sx={{ fontSize: '1rem' }} />}
                sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', textTransform: 'none', minWidth: 120 }}
              >
                {submitting ? 'Generating...' : 'Generate'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={step === 1 && !offerDetails}
                endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
                sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', textTransform: 'none' }}
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
          sx: { borderRadius: 5, border: `1px solid ${COLORS.border}`, overflow: 'hidden', height: '85vh', maxHeight: '85vh' }
        }}
      >
        <DialogTitle sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          py: 1.5,
          px: 2.5,
          bgcolor: COLORS.background.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
            Appointment Letter Preview
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handlePrintLetter} startIcon={<PrintIcon sx={{ fontSize: '0.9rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', textTransform: 'none' }}>
              Print
            </Button>
            <Button variant="contained" onClick={handleDownloadLetter} startIcon={downloading ? <CircularProgress size={20} /> : <DownloadIcon sx={{ fontSize: '0.9rem' }} />} disabled={downloading} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#2E7D32', fontSize: '0.7rem', textTransform: 'none' }}>
              {downloading ? 'Downloading...' : 'Download'}
            </Button>
            <Button variant="contained" startIcon={<SendIcon sx={{ fontSize: '0.9rem' }} />} onClick={() => { setShowPreview(false); setEmailAddress(candidateDetails?.email || ''); setShowEmailDialog(true); }} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#1976D2', fontSize: '0.7rem', textTransform: 'none' }}>
              Send Email
            </Button>
            <IconButton onClick={handleClosePreview} size="small">
              <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, bgcolor: COLORS.background.light }}>
          {previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              title="Appointment Letter Preview"
              style={{ width: '100%', height: '100%', border: 'none', backgroundColor: 'white' }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress size={40} sx={{ color: COLORS.primary }} />
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
          sx: { borderRadius: 5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          py: 1.5,
          px: 2.5,
          bgcolor: COLORS.background.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>
              {emailSent ? 'Email Sent' : 'Send Appointment Letter'}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              {emailSent ? 'Email delivery confirmation' : 'Send letter to candidate via email'}
            </Typography>
          </Box>
          <IconButton onClick={() => !sendingEmail && setShowEmailDialog(false)} size="small" disabled={sendingEmail}>
            <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5 }}>
          {!emailSent ? (
            <>
              {candidateDetails && (
                <Paper sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}`, mb: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: COLORS.primary, width: 40, height: 40 }}>
                      <PersonIcon sx={{ fontSize: '1rem' }} />
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                        {candidateDetails.firstName} {candidateDetails.lastName}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
                        ID: {candidateDetails.candidateId}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              )}

              <Alert severity="info" sx={{ mb: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem' }}>Document ID: <strong>{generatedLetter?.documentId}</strong></Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Ready to send to candidate</Typography>
                </Box>
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Typography sx={labelStyle}>Recipient Email *</Typography>
                <TextField
                  fullWidth
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="candidate@example.com"
                  error={!!emailError}
                  helperText={emailError}
                  disabled={sendingEmail}
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} /></InputAdornment>,
                  }}
                />
              </Box>

              {emailSuccess && (
                <Alert severity="success" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
                  {emailSuccess}
                </Alert>
              )}

              <Alert severity="info" sx={{ mt: 2, borderRadius: 1.5, fontSize: '0.75rem' }}>
                The email will contain the appointment letter as an attachment. Make sure the email address is correct.
              </Alert>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 48, color: '#2E7D32', mb: 2 }} />
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary, mb: 1 }}>
                Email Sent Successfully!
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                The appointment letter has been sent to {emailAddress}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          justifyContent: 'space-between'
        }}>
          <Button onClick={() => setShowEmailDialog(false)} disabled={sendingEmail} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', textTransform: 'none' }}>
            {emailSent ? 'Close' : 'Cancel'}
          </Button>
          {!emailSent && (
            <Button
              variant="contained"
              onClick={handleSendEmail}
              disabled={sendingEmail || !emailAddress}
              startIcon={sendingEmail ? <CircularProgress size={20} /> : <SendIcon sx={{ fontSize: '1rem' }} />}
              sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', textTransform: 'none', minWidth: 100 }}
            >
              {sendingEmail ? 'Sending...' : 'Send Email'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GenerateAppointmentLetter;