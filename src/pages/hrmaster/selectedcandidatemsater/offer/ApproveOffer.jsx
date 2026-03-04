// import React, { useState, useEffect } from 'react';
// import {
//   // Layout components
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   stepConnectorClasses,
//   Paper,
//   Stack,
//   Typography,
//   Grid,
//   Box,
//   Divider,
//   Alert,
//   // Form components
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   ButtonGroup,
//   // Feedback components
//   CircularProgress,
//   Snackbar,
//   // Buttons and actions
//   Button,
//   IconButton,
//   // Surfaces
//   styled,
//   FormHelperText,
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   CheckCircle as CheckCircleIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon,
//   Person as PersonIcon,
//   AttachMoney as AttachMoneyIcon,
//   Description as DescriptionIcon,
//   Info as InfoIcon,
//   Warning as WarningIcon,
//   ThumbUp as ThumbUpIcon,
//   ThumbDown as ThumbDownIcon,
//   Edit as EditIcon,
//   Assignment as AssignmentIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../../config/Config';

// // 🔥 Modern Stepper Connector with Gradient
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 3,
//     border: 0,
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// // Custom Step Icon with better styling
// const StepIcon = ({ active, completed, icon }) => {
//   const getIcon = () => {
//     if (icon === 1) return <AssignmentIcon fontSize="small" />;
//     if (icon === 2) return <DescriptionIcon fontSize="small" />;
//     if (icon === 3) return <AttachMoneyIcon fontSize="small" />;
//     if (icon === 4) return <ThumbUpIcon fontSize="small" />;
//     return icon;
//   };

//   return (
//     <Box
//       sx={{
//         width: 32,
//         height: 32,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: '50%',
//         backgroundColor: completed || active ? '#1976D2' : '#E0E0E0',
//         color: completed || active ? 'white' : '#9E9E9E',
//         transition: 'all 0.2s ease',
//         boxShadow: active ? '0 0 0 3px rgba(25, 118, 210, 0.2)' : 'none',
//         '& svg': {
//           fontSize: 18
//         }
//       }}
//     >
//       {completed ? <CheckCircleIcon fontSize="small" /> : getIcon()}
//     </Box>
//   );
// };

// const steps = ['Select Offer', 'Summary', 'CTC', 'Decision'];

// const ApproveOffer = ({ open, onClose, onComplete, offerData = null }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [offers, setOffers] = useState([]);
//   const [selectedOffer, setSelectedOffer] = useState(null);
//   const [comments, setComments] = useState('');
//   const [rejectReason, setRejectReason] = useState('');
//   const [signature, setSignature] = useState(null);
//   const [signatureName, setSignatureName] = useState('');
//   const [confirmApprove, setConfirmApprove] = useState(false);
//   const [action, setAction] = useState(null);
  
//   // Separate loading states
//   const [isFetchingOffers, setIsFetchingOffers] = useState(false);
//   const [isApproving, setIsApproving] = useState(false);
//   const [isRejecting, setIsRejecting] = useState(false);
  
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [stepErrors, setStepErrors] = useState({});

//   const getAuthToken = () => localStorage.getItem('token') || sessionStorage.getItem('token') || '';

//   // Reset state when dialog opens
//   useEffect(() => {
//     if (open) {
//       setActiveStep(0);
//       setComments('');
//       setRejectReason('');
//       setSignature(null);
//       setSignatureName('');
//       setConfirmApprove(false);
//       setSelectedOffer(null);
//       setAction(null);
//       setError('');
//       setSuccessMessage('');
//       setStepErrors({});
//       fetchPendingOffers();
//     }
//   }, [open]);

//   const fetchSelectedCandidates = async () => {
//   // ... existing code ...

//   const result = await response.json();
//   console.log('API Response:', result);

//   if (result.success) {
//     // Log the first candidate to see its structure
//     if (result.data.length > 0) {
//       console.log('First candidate raw data:', result.data[0]);
//       console.log('First candidate latestApplication:', result.data[0].latestApplication);
//     }
    
//     // Transform the data to include required fields for offer management
//     const transformedData = result.data.map(candidate => ({
//       // ... existing transformation ...
//     }));
    
//     console.log('Transformed candidates:', transformedData.map(c => ({
//       id: c.id,
//       candidateId: c.candidateId,
//       name: c.name,
//       applicationStatus: c.applicationStatus
//     })));
    
//     setSelectedCandidates(transformedData);
//     setError(null);
//   }

// };

//   const fetchPendingOffers = async () => {
//     setIsFetchingOffers(true);
//     try {
//       const token = getAuthToken();
//       const response = await axios.get(`${BASE_URL}/api/offers?status=pending_approval`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         let offersArray = [];
//         if (response.data.data?.offers) offersArray = response.data.data.offers;
//         else if (Array.isArray(response.data.data)) offersArray = response.data.data;
//         else if (response.data.offers) offersArray = response.data.offers;
        
//         setOffers(offersArray);

//         if (offerData) {
//           const targetId = offerData.offerId || offerData._id || offerData.id;
//           const match = offersArray.find(o => o._id === targetId || o.offerId === targetId);
//           if (match) setSelectedOffer(match);
//         }
//       }
//     } catch (err) {
//       setError('Failed to fetch offers');
//     } finally {
//       setIsFetchingOffers(false);
//     }
//   };

//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       setActiveStep(prev => prev + 1);
//       setError('');
//     } else {
//       setError('Please complete all required fields');
//     }
//   };

//   const handleBack = () => {
//     setActiveStep(prev => prev - 1);
//     setError('');
//   };

//   const handleClose = () => {
//     setActiveStep(0);
//     setComments('');
//     setRejectReason('');
//     setSignature(null);
//     setSignatureName('');
//     setConfirmApprove(false);
//     setSelectedOffer(null);
//     setAction(null);
//     setError('');
//     setSuccessMessage('');
//     setIsApproving(false);
//     setIsRejecting(false);
//     onClose();
//   };

//   // Handle signature upload
//   const handleSignatureUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSignatureName(file.name);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result.split(',')[1];
//         setSignature(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const clearSignature = () => {
//     setSignature(null);
//     setSignatureName('');
//   };

//   // Validate current step
//   const validateStep = (step) => {
//     const errors = {};

//     if (step === 0) {
//       if (!selectedOffer) {
//         errors.offer = 'Please select an offer';
//       }
//     } else if (step === 3) {
//       if (action === 'approve') {
//         if (!comments.trim()) {
//           errors.comments = 'Please add approval comments';
//         }
//         if (!signature) {
//           errors.signature = 'Please upload your signature';
//         }
//         if (!confirmApprove) {
//           errors.confirmApprove = 'Please confirm before approving';
//         }
//       } else if (action === 'reject') {
//         if (!rejectReason.trim()) {
//           errors.rejectReason = 'Please provide a rejection reason';
//         }
//       } else {
//         errors.action = 'Please select Approve or Reject';
//       }
//     }

//     setStepErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // const handleApprove = async () => {
//   //   if (!selectedOffer) return;
    
//   //   if (!validateStep(3)) {
//   //     setError('Please complete all required fields');
//   //     return;
//   //   }

//   //   setIsApproving(true);
//   //   setError('');

//   //   try {
//   //     const token = getAuthToken();
//   //     const response = await axios.post(
//   //       `${BASE_URL}/api/offers/${selectedOffer._id || selectedOffer.id}/approve`,
//   //       {
//   //         comments: comments.trim(),
//   //         signature: `data:image/png;base64,${signature}`
//   //       },
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );

//   //     if (response.data.success) {
//   //       setSuccessMessage('Offer approved successfully!');
//   //       setSnackbar({ open: true, message: '✅ Offer approved successfully!', severity: 'success' });
        
//   //       const updatedData = {
//   //         id: selectedOffer._id || selectedOffer.id,
//   //         status: 'approved',
//   //         action: 'approved'
//   //       };

//   //       setTimeout(() => {
//   //         setIsApproving(false);
//   //         if (onComplete) onComplete(updatedData);
//   //         handleClose();
//   //       }, 1500);
//   //     } else {
//   //       throw new Error(response.data.message || 'Failed to approve');
//   //     }
//   //   } catch (err) {
//   //     setIsApproving(false);
//   //     const errorMsg = err.response?.data?.message || err.message || 'Failed to approve offer';
//   //     setError(errorMsg);
//   //     setSnackbar({ open: true, message: `❌ ${errorMsg}`, severity: 'error' });
//   //   }
//   // };

//   const handleApprove = async () => {
//   if (!selectedOffer) return;
  
//   if (!validateStep(3)) {
//     setError('Please complete all required fields');
//     return;
//   }

//   setIsApproving(true);
//   setError('');

//   try {
//     const token = getAuthToken();
//     const response = await axios.post(
//       `${BASE_URL}/api/offers/${selectedOffer._id || selectedOffer.id}/approve`,
//       {
//         comments: comments.trim(),
//         signature: `data:image/png;base64,${signature}`
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     if (response.data.success) {
//       setSuccessMessage('Offer approved successfully!');
//       setSnackbar({ open: true, message: '✅ Offer approved successfully!', severity: 'success' });
      
//       // Log the selectedOffer structure to see where candidate ID is
//       console.log('========== APPROVE OFFER DEBUG ==========');
//       console.log('Selected Offer:', selectedOffer);
//       console.log('Candidate object:', selectedOffer.candidate);
//       console.log('Candidate ID possibilities:', {
//         _id: selectedOffer.candidate?._id,
//         id: selectedOffer.candidate?.id,
//         candidateId: selectedOffer.candidate?.candidateId,
//         raw: selectedOffer.candidate
//       });
      
//       // Try to get the candidate ID from various places
//       const candidateId = selectedOffer.candidate?._id || 
//                           selectedOffer.candidate?.id || 
//                           selectedOffer.candidateId ||
//                           selectedOffer.candidate;
      
//       console.log('Extracted candidateId:', candidateId);
      
//       const updatedData = {
//         id: candidateId, // This should be the CANDIDATE ID
//         _id: candidateId,
//         candidateId: candidateId,
//         offerId: selectedOffer._id || selectedOffer.id,
//         status: 'approved',
//         applicationStatus: 'approved',
//         action: 'approved'
//       };
      
//       console.log('Sending to parent:', updatedData);
//       console.log('========== END DEBUG ==========');

//       setTimeout(() => {
//         setIsApproving(false);
//         if (onComplete) onComplete(updatedData);
//         handleClose();
//       }, 1500);
//     } else {
//       throw new Error(response.data.message || 'Failed to approve');
//     }
//   } catch (err) {
//     setIsApproving(false);
//     const errorMsg = err.response?.data?.message || err.message || 'Failed to approve offer';
//     setError(errorMsg);
//     setSnackbar({ open: true, message: `❌ ${errorMsg}`, severity: 'error' });
//   }
// };
  
//   const handleReject = async () => {
//     if (!selectedOffer) return;
    
//     if (!validateStep(3)) {
//       setError('Please complete all required fields');
//       return;
//     }

//     setIsRejecting(true);
//     setError('');

//     try {
//       const token = getAuthToken();
//       const response = await axios.post(
//         `${BASE_URL}/api/offers/${selectedOffer._id || selectedOffer.id}/reject`,
//         { reason: rejectReason.trim() },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.success) {
//         setSuccessMessage('Offer rejected successfully!');
//         setSnackbar({ open: true, message: '✅ Offer rejected successfully!', severity: 'success' });
        
//         const updatedData = {
//           id: selectedOffer._id || selectedOffer.id,
//           status: 'rejected',
//           action: 'rejected'
//         };

//         setTimeout(() => {
//           setIsRejecting(false);
//           if (onComplete) onComplete(updatedData);
//           handleClose();
//         }, 1500);
//       } else {
//         throw new Error(response.data.message || 'Failed to reject');
//       }
//     } catch (err) {
//       setIsRejecting(false);
//       const errorMsg = err.response?.data?.message || err.message || 'Failed to reject offer';
//       setError(errorMsg);
//       setSnackbar({ open: true, message: `❌ ${errorMsg}`, severity: 'error' });
//     }
//   };

//   const getCandidateName = () => {
//     if (!selectedOffer) return 'Unknown';
//     if (selectedOffer.candidate?.name) return selectedOffer.candidate.name;
//     if (selectedOffer.candidate?.firstName) {
//       return `${selectedOffer.candidate.firstName} ${selectedOffer.candidate.lastName || ''}`.trim();
//     }
//     return 'Unknown Candidate';
//   };

//   const getCandidateEmail = () => {
//     if (!selectedOffer) return '';
//     return selectedOffer.candidate?.email || '';
//   };

//   const getCandidatePhone = () => {
//     if (!selectedOffer) return '';
//     return selectedOffer.candidate?.phone || selectedOffer.candidate?.mobile || '';
//   };

//   const getPosition = () => {
//     if (!selectedOffer) return 'N/A';
//     return selectedOffer.job?.title || selectedOffer.offerDetails?.designation || 'N/A';
//   };

//   const getJoiningDate = () => {
//     if (!selectedOffer) return null;
//     return selectedOffer.offerDetails?.joiningDate || null;
//   };

//   const getReportingTo = () => {
//     if (!selectedOffer) return 'Not Specified';
//     return selectedOffer.offerDetails?.reportingTo || 'Not Specified';
//   };

//   const getProbationPeriod = () => {
//     if (!selectedOffer) return 6;
//     return selectedOffer.offerDetails?.probationPeriod || 6;
//   };

//   const getCtcDetails = () => {
//     if (!selectedOffer) return null;
//     return selectedOffer.ctcDetails || null;
//   };

//   const formatCurrency = (amount) => {
//     if (!amount && amount !== 0) return '₹0';
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not Set';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'draft': return 'default';
//       case 'initiated': return 'info';
//       case 'pending':
//       case 'pending_approval': return 'warning';
//       case 'submitted': return 'info';
//       case 'approved': return 'success';
//       case 'rejected': return 'error';
//       default: return 'default';
//     }
//   };

//   const isLoading = isApproving || isRejecting;

//   return (
//     <Dialog 
//       open={open} 
//       onClose={handleClose} 
//       maxWidth="md" 
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 1.5,
//           maxHeight: '95vh'
//         }
//       }}
//     >
//       <DialogTitle sx={{ 
//         borderBottom: '1px solid #E0E0E0', 
//         py: 1.5, 
//         px: 2, 
//         bgcolor: '#F8FAFC',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <Typography variant="subtitle1" fontWeight={600}>Approve/Reject Offer</Typography>
//         <IconButton onClick={handleClose} size="small" disabled={isLoading}>
//           <CloseIcon fontSize="small" />
//         </IconButton>
//       </DialogTitle>

//       {!successMessage && (
//         <Box sx={{ px: 2, pt: 1, backgroundColor: '#F8FAFC' }}>
//           <Stepper 
//             activeStep={activeStep} 
//             alternativeLabel 
//             connector={<ColorConnector />} 
//             sx={{ mb: 1 }}
//           >
//             {steps.map((label, index) => (
//               <Step key={label}>
//                 <StepLabel StepIconComponent={StepIcon}>
//                   <Typography fontSize="0.8rem">{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Box>
//       )}

//       <DialogContent sx={{ p: 2, bgcolor: '#F5F7FA', overflow: 'auto' }}>
//         {!successMessage ? (
//           <>
//             {/* Step 0: Select Offer */}
//             {activeStep === 0 && (
//               <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//                 <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
//                   Select Offer for Approval
//                 </Typography>
                
//                 {isFetchingOffers ? (
//                   <Box sx={{ display: 'flex', justifyContent: 'center'}}>
//                     <CircularProgress size={32} />
//                   </Box>
//                 ) : offers.length === 0 ? (
//                   <Alert severity="info" sx={{ borderRadius: 1 }}>No pending offers found for approval</Alert>
//                 ) : (
//                   <FormControl fullWidth size="small" sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}>
//                     <InputLabel>Select Offer *</InputLabel>
//                     <Select
//                       value={selectedOffer?._id || ''}
//                       onChange={(e) => {
//                         const offer = offers.find(o => o._id === e.target.value);
//                         setSelectedOffer(offer);
//                         setError('');
//                       }}
//                       label="Select Offer *"
//                       error={!!stepErrors.offer}
//                       MenuProps={{
//                         PaperProps: {
//                           sx: { maxHeight: 250, overflow: 'auto' }
//                         }
//                       }}
//                       renderValue={(selected) => {
//                         const offer = offers.find(o => o._id === selected);
//                         if (!offer) return <em>Select an offer</em>;
//                         return (
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <Typography variant="body2">
//                               {getCandidateName()} - {offer.offerId || offer._id}
//                             </Typography>
//                             <Chip
//                               label={offer.status || 'pending_approval'}
//                               size="small"
//                               sx={{
//                                 height: 20,
//                                 fontSize: '0.7rem',
//                                 bgcolor: '#FFF3E0',
//                                 color: '#ED6C02'
//                               }}
//                             />
//                           </Box>
//                         );
//                       }}
//                     >
//                       {offers.map(offer => (
//                         <MenuItem key={offer._id} value={offer._id} sx={{ py: 1 }}>
//                           <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//                               <Typography variant="body2" fontWeight={500}>
//                                 {offer.candidate?.name || 'Unknown'}
//                               </Typography>
//                               <Chip
//                                 label={offer.status || 'pending_approval'}
//                                 size="small"
//                                 sx={{
//                                   height: 20,
//                                   fontSize: '0.7rem',
//                                   bgcolor: '#FFF3E0',
//                                   color: '#ED6C02'
//                                 }}
//                               />
//                             </Box>
//                             <Typography variant="caption" color="textSecondary">
//                               {offer.offerId || offer._id}
//                             </Typography>
//                           </Box>
//                         </MenuItem>
//                       ))}
//                     </Select>
//                     {stepErrors.offer && (
//                       <FormHelperText error>{stepErrors.offer}</FormHelperText>
//                     )}
//                   </FormControl>
//                 )}

//                 {selectedOffer && (
//                   <Box sx={{ mt: 2, p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1 }}>
//                     <Grid container spacing={2}>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="textSecondary" display="block">Candidate</Typography>
//                         <Typography variant="body2" fontWeight={500}>{getCandidateName()}</Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="textSecondary" display="block">Offer ID</Typography>
//                         <Typography variant="body2">{selectedOffer.offerId || selectedOffer._id}</Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="textSecondary" display="block">Position</Typography>
//                         <Typography variant="body2">{selectedOffer.job?.title || 'N/A'}</Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="textSecondary" display="block">Status</Typography>
//                         <Chip 
//                           label={selectedOffer.status || 'Pending'} 
//                           size="small" 
//                           color="warning"
//                           sx={{ fontWeight: 500 }}
//                         />
//                       </Grid>
//                     </Grid>
//                   </Box>
//                 )}
//               </Paper>
//             )}

//             {/* Step 1: Summary */}
//             {activeStep === 1 && selectedOffer && (
//               <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//                 <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
//                   Offer Summary
//                 </Typography>
//                 <Grid container spacing={6}>
//                   <Grid item xs={12}>
//                     <Typography variant="body2" fontWeight={600}>{getCandidateName()}</Typography>
//                     <Typography variant="caption" color="textSecondary">
//                       {getCandidateEmail() || 'No email'} | {getCandidatePhone() || 'No phone'}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="caption" color="textSecondary" display="block">Position</Typography>
//                     <Typography variant="body2">{getPosition()}</Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="caption" color="textSecondary" display="block">Department</Typography>
//                     <Typography variant="body2">{selectedOffer.job?.department || 'N/A'}</Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="caption" color="textSecondary" display="block">Joining Date</Typography>
//                     <Typography variant="body2">{formatDate(getJoiningDate())}</Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="caption" color="textSecondary" display="block">Reporting To</Typography>
//                     <Typography variant="body2">{getReportingTo()}</Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="caption" color="textSecondary" display="block">Probation Period</Typography>
//                     <Typography variant="body2">{getProbationPeriod()} months</Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="caption" color="textSecondary" display="block">Location</Typography>
//                     <Typography variant="body2">{selectedOffer.job?.location || 'N/A'}</Typography>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             )}

//             {/* Step 2: CTC */}
//             {activeStep === 2 && selectedOffer && (
//               <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//                 <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
//                   Annual CTC Breakdown
//                 </Typography>
                
//                 {selectedOffer.ctcDetails ? (
//                   <>
//                     <Grid container spacing={4}>
//                       <Grid item xs={6} sm={4}>
//                         <Typography variant="caption" color="textSecondary" display="block">Basic + DA</Typography>
//                         <Typography variant="body2" fontWeight={500}>
//                           {formatCurrency(selectedOffer.ctcDetails.basic * 12)}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6} sm={4}>
//                         <Typography variant="caption" color="textSecondary" display="block">HRA</Typography>
//                         <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.hra * 12)}</Typography>
//                       </Grid>
//                       <Grid item xs={6} sm={4}>
//                         <Typography variant="caption" color="textSecondary" display="block">Conveyance</Typography>
//                         <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.conveyanceAllowance * 12)}</Typography>
//                       </Grid>
//                       <Grid item xs={6} sm={4}>
//                         <Typography variant="caption" color="textSecondary" display="block">Medical</Typography>
//                         <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.medicalAllowance * 12)}</Typography>
//                       </Grid>
//                       <Grid item xs={6} sm={4}>
//                         <Typography variant="caption" color="textSecondary" display="block">Special Allowance</Typography>
//                         <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.specialAllowance * 12)}</Typography>
//                       </Grid>
//                       <Grid item xs={6} sm={4}>
//                         <Typography variant="caption" color="textSecondary" display="block">Bonus</Typography>
//                         <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.bonus)}</Typography>
//                       </Grid>
//                       <Grid item xs={12}>
//                         <Divider sx={{ my: 1 }} />
//                       </Grid>
//                       <Grid item xs={12}>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                           <Typography variant="subtitle2" color="#1976D2">Total CTC</Typography>
//                           <Typography variant="h6" color="#1976D2" fontWeight={700} paddingLeft={5}>
//                             {formatCurrency(selectedOffer.ctcDetails.totalCtc)}
//                           </Typography>
//                         </Box>
//                       </Grid>
//                     </Grid>
//                   </>
//                 ) : (
//                   <Alert severity="info" sx={{ borderRadius: 1 }}>CTC details not available</Alert>
//                 )}
//               </Paper>
//             )}

//             {/* Step 3: Decision */}
//             {activeStep === 3 && (
//               <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//                 <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
//                   Make Decision
//                 </Typography>

//                 <ButtonGroup fullWidth sx={{ mb: 3 }}>
//                   <Button
//                     variant={action === 'approve' ? 'contained' : 'outlined'}
//                     color="success"
//                     onClick={() => {
//                       setAction('approve');
//                       setError('');
//                       setStepErrors({});
//                     }}
//                     startIcon={<ThumbUpIcon />}
//                     disabled={isLoading}
//                   >
//                     Approve
//                   </Button>
//                   <Button
//                     variant={action === 'reject' ? 'contained' : 'outlined'}
//                     color="error"
//                     onClick={() => {
//                       setAction('reject');
//                       setError('');
//                       setStepErrors({});
//                     }}
//                     startIcon={<ThumbDownIcon />}
//                     disabled={isLoading}
//                   >
//                     Reject
//                   </Button>
//                 </ButtonGroup>

//                 {action === 'approve' && (
//                   <>
//                     <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem', mb: 1 }}>
//                       Approval Comments *
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       multiline
//                       rows={3}
//                       placeholder="Add your approval comments (e.g., Salary is within budget, All documents verified, etc.)"
//                       value={comments}
//                       onChange={(e) => setComments(e.target.value)}
//                       size="small"
//                       error={!!stepErrors.comments}
//                       helperText={stepErrors.comments}
//                       disabled={isLoading}
//                       sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1, fontSize: '0.85rem' } }}
//                     />

//                     <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem', mb: 1 }}>
//                       Digital Signature *
//                     </Typography>

//                     <Box >
//                       {!signature ? (
//                         <Box
//                           sx={{
//                             textAlign: 'center',
//                             cursor: isLoading ? 'default' : 'pointer',
                            
//                           }}
//                           component="label"
//                         >
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleSignatureUpload}
//                             style={{ display: 'none' }}
//                             disabled={isLoading}
//                           />
                         
//                           <Typography variant="body2" color="textSecondary">
//                             Click to upload signature image
//                           </Typography>
//                           <Typography variant="caption" color="textSecondary" display="block">
//                             Supported formats: PNG, JPG, JPEG
//                           </Typography>
//                         </Box>
//                       ) : (
//                         <Box sx={{
//                           p: 1.5,
//                           bgcolor: '#F0F7FF',
//                           borderRadius: 1,
//                           border: '1px solid #1976D2',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'space-between'
//                         }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
//                             <Typography variant="body2">{signatureName}</Typography>
//                           </Box>
//                           <Button
//                             size="small"
//                             color="error"
//                             onClick={clearSignature}
//                             disabled={isLoading}
//                             sx={{ textTransform: 'none' }}
//                           >
//                             Remove
//                           </Button>
//                         </Box>
//                       )}
//                       {stepErrors.signature && (
//                         <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
//                           {stepErrors.signature}
//                         </Typography>
//                       )}
//                     </Box>

//                     <Box sx={{
//                       p: 1.5,
//                       bgcolor: '#FFF4E5',
//                       borderRadius: 1,
//                       border: '1px solid #FFB74D',
//                       mb: 2
//                     }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//                         <WarningIcon sx={{ color: '#F57C00', fontSize: 18 }} />
//                         <Typography variant="subtitle2" sx={{ color: '#F57C00', fontSize: '0.85rem' }}>
//                           Approval Notice
//                         </Typography>
//                       </Box>
//                       <Typography variant="caption" color="textSecondary">
//                         By approving this offer, you are authorizing the release of this offer letter to the candidate.
//                         This action will trigger the offer generation process and cannot be undone.
//                       </Typography>
//                     </Box>

//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                       <input
//                         type="checkbox"
//                         id="confirmApprove"
//                         checked={confirmApprove}
//                         onChange={(e) => setConfirmApprove(e.target.checked)}
//                         disabled={isLoading}
//                         style={{ width: 16, height: 16, cursor: 'pointer' }}
//                       />
//                       <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
//                         I confirm that I have reviewed all details and approve this offer.
//                       </Typography>
//                     </Box>
//                     {stepErrors.confirmApprove && (
//                       <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
//                         {stepErrors.confirmApprove}
//                       </Typography>
//                     )}
//                   </>
//                 )}

//                 {action === 'reject' && (
//                   <>
//                     <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem', mb: 1 }}>
//                       Rejection Reason *
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       multiline
//                       rows={3}
//                       placeholder="Please provide reason for rejection"
//                       value={rejectReason}
//                       onChange={(e) => setRejectReason(e.target.value)}
//                       size="small"
//                       error={!!stepErrors.rejectReason}
//                       helperText={stepErrors.rejectReason}
//                       disabled={isLoading}
//                       sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                     />
//                   </>
//                 )}

//                 {action === null && (
//                   <Alert severity="info" sx={{ borderRadius: 1 }}>
//                     Please select Approve or Reject to continue
//                   </Alert>
//                 )}

//                 {/* Preview Section for Approve */}
//                 {action === 'approve' && selectedOffer && (
//                   <Paper sx={{ p: 2, mt: 2, bgcolor: '#F8FAFC', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//                     <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                       Approval Preview
//                     </Typography>
//                     <Grid container spacing={2}>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="textSecondary" display="block">Candidate</Typography>
//                         <Typography variant="body2" fontWeight={500}>{getCandidateName()}</Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="textSecondary" display="block">Offer ID</Typography>
//                         <Typography variant="body2">{selectedOffer?.offerId || selectedOffer?._id}</Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="textSecondary" display="block">Total CTC</Typography>
//                         <Typography variant="body2" fontWeight={600} color="#1976D2">
//                           {selectedOffer.ctcDetails ? formatCurrency(selectedOffer.ctcDetails.totalCtc) : 'N/A'}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="textSecondary" display="block">Comments</Typography>
//                         <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
//                           {comments || 'No comments added'}
//                         </Typography>
//                       </Grid>
//                     </Grid>
//                   </Paper>
//                 )}
//               </Paper>
//             )}

//             {error && (
//               <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }} onClose={() => setError('')}>
//                 {error}
//               </Alert>
//             )}
//           </>
//         ) : (
//           <Box sx={{ textAlign: 'center', py: 4 }}>
//             <CheckCircleIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
//             <Typography variant="h6" gutterBottom>{successMessage}</Typography>
//             <Typography variant="body2" color="textSecondary">Closing dialog...</Typography>
//           </Box>
//         )}
//       </DialogContent>

//       <DialogActions sx={{ 
//         p: 2, 
//         borderTop: '1px solid #E0E0E0', 
//         bgcolor: '#F8FAFC', 
//         justifyContent: 'space-between' 
//       }}>
//         {!successMessage ? (
//           <>
//             <Button
//               onClick={handleBack}
//               disabled={activeStep === 0 || isLoading}
//               startIcon={<NavigateBeforeIcon />}
//               size="small"
//               sx={{ color: '#666' }}
//             >
//               Back
//             </Button>
//             <Box>
//               <Button 
//                 onClick={handleClose} 
//                 disabled={isLoading} 
//                 size="small"
//                 sx={{ mr: 1, color: '#666' }}
//               >
//                 Cancel
//               </Button>
//               {activeStep === steps.length - 1 ? (
//                 <>
//                   <Button
//                     variant="contained"
//                     color="error"
//                     onClick={handleReject}
//                     disabled={!action || action !== 'reject' || !rejectReason.trim() || isLoading}
//                     size="small"
//                     startIcon={isRejecting ? <CircularProgress size={16} color="inherit" /> : <ThumbDownIcon />}
//                     sx={{ mr: 1, minWidth: 100 }}
//                   >
//                     {isRejecting ? 'Rejecting...' : 'Reject'}
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="success"
//                     onClick={handleApprove}
//                     disabled={!action || action !== 'approve' || !comments.trim() || !signature || !confirmApprove || isLoading}
//                     size="small"
//                     startIcon={isApproving ? <CircularProgress size={16} color="inherit" /> : <ThumbUpIcon />}
//                     sx={{ 
//                       minWidth: 100,
//                       backgroundColor: '#4CAF50',
//                       '&:hover': { backgroundColor: '#45a049' },
//                       '&.Mui-disabled': { backgroundColor: '#A5D6A7' }
//                     }}
//                   >
//                     {isApproving ? 'Approving...' : 'Approve'}
//                   </Button>
//                 </>
//               ) : (
//                 <Button
//                   variant="contained"
//                   onClick={handleNext}
//                   disabled={!selectedOffer || isLoading}
//                   endIcon={<NavigateNextIcon />}
//                   size="small"
//                   sx={{
//                     backgroundColor: '#1976D2',
//                     '&:hover': { backgroundColor: '#1565C0' }
//                   }}
//                 >
//                   Next
//                 </Button>
//               )}
//             </Box>
//           </>
//         ) : (
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
//             <Button
//               variant="contained"
//               onClick={handleClose}
//               size="small"
//               sx={{
//                 backgroundColor: '#1976D2',
//                 '&:hover': { backgroundColor: '#1565C0' }
//               }}
//             >
//               Close
//             </Button>
//           </Box>
//         )}
//       </DialogActions>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ borderRadius: 1 }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Dialog>
//   );
// };

// export default ApproveOffer;


import React, { useState, useEffect } from 'react';
import {
  // Layout components
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Paper,
  Stack,
  Typography,
  Grid,
  Box,
  Divider,
  Alert,
  // Form components
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  ButtonGroup,
  // Feedback components
  CircularProgress,
  Snackbar,
  // Buttons and actions
  Button,
  IconButton,
  // Surfaces
  styled,
  FormHelperText,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

// 🔥 Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom Step Icon with better styling
const StepIcon = ({ active, completed, icon }) => {
  const getIcon = () => {
    if (icon === 1) return <AssignmentIcon fontSize="small" />;
    if (icon === 2) return <DescriptionIcon fontSize="small" />;
    if (icon === 3) return <AttachMoneyIcon fontSize="small" />;
    if (icon === 4) return <ThumbUpIcon fontSize="small" />;
    return icon;
  };

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: completed || active ? '#1976D2' : '#E0E0E0',
        color: completed || active ? 'white' : '#9E9E9E',
        transition: 'all 0.2s ease',
        boxShadow: active ? '0 0 0 3px rgba(25, 118, 210, 0.2)' : 'none',
        '& svg': {
          fontSize: 18
        }
      }}
    >
      {completed ? <CheckCircleIcon fontSize="small" /> : getIcon()}
    </Box>
  );
};

const steps = ['Select Offer', 'Summary', 'CTC', 'Decision'];

const ApproveOffer = ({ open, onClose, onComplete, offerData = null }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [comments, setComments] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [signature, setSignature] = useState(null);
  const [signatureName, setSignatureName] = useState('');
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [action, setAction] = useState(null);
  
  // Separate loading states
  const [isFetchingOffers, setIsFetchingOffers] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stepErrors, setStepErrors] = useState({});

  const getAuthToken = () => localStorage.getItem('token') || sessionStorage.getItem('token') || '';

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setComments('');
      setRejectReason('');
      setSignature(null);
      setSignatureName('');
      setConfirmApprove(false);
      setSelectedOffer(null);
      setAction(null);
      setError('');
      setStepErrors({});
      fetchPendingOffers();
    }
  }, [open]);

  const fetchPendingOffers = async () => {
    setIsFetchingOffers(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(`${BASE_URL}/api/offers?status=pending_approval`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        let offersArray = [];
        if (response.data.data?.offers) offersArray = response.data.data.offers;
        else if (Array.isArray(response.data.data)) offersArray = response.data.data;
        else if (response.data.offers) offersArray = response.data.offers;
        
        setOffers(offersArray);

        if (offerData) {
          const targetId = offerData.offerId || offerData._id || offerData.id;
          const match = offersArray.find(o => o._id === targetId || o.offerId === targetId);
          if (match) setSelectedOffer(match);
        }
      }
    } catch (err) {
      setError('Failed to fetch offers');
    } finally {
      setIsFetchingOffers(false);
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setError('');
    } else {
      setError('Please complete all required fields');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const handleClose = () => {
    setActiveStep(0);
    setComments('');
    setRejectReason('');
    setSignature(null);
    setSignatureName('');
    setConfirmApprove(false);
    setSelectedOffer(null);
    setAction(null);
    setError('');
    setIsApproving(false);
    setIsRejecting(false);
    setSnackbar({ ...snackbar, open: false });
    onClose();
  };

  // Handle signature upload
  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSignatureName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setSignature(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    setSignature(null);
    setSignatureName('');
  };

  // Validate current step
  const validateStep = (step) => {
    const errors = {};

    if (step === 0) {
      if (!selectedOffer) {
        errors.offer = 'Please select an offer';
      }
    } else if (step === 3) {
      if (action === 'approve') {
        if (!comments.trim()) {
          errors.comments = 'Please add approval comments';
        }
        if (!signature) {
          errors.signature = 'Please upload your signature';
        }
        if (!confirmApprove) {
          errors.confirmApprove = 'Please confirm before approving';
        }
      } else if (action === 'reject') {
        if (!rejectReason.trim()) {
          errors.rejectReason = 'Please provide a rejection reason';
        }
      } else {
        errors.action = 'Please select Approve or Reject';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // const handleApprove = async () => {
  //   if (!selectedOffer) return;
    
  //   if (!validateStep(3)) {
  //     setError('Please complete all required fields');
  //     return;
  //   }

  //   setIsApproving(true);
  //   setError('');

  //   try {
  //     const token = getAuthToken();
  //     const response = await axios.post(
  //       `${BASE_URL}/api/offers/${selectedOffer._id || selectedOffer.id}/approve`,
  //       {
  //         comments: comments.trim(),
  //         signature: `data:image/png;base64,${signature}`
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.data.success) {
  //       setSnackbar({ open: true, message: '✅ Offer approved successfully!', severity: 'success' });
        
  //       const updatedData = {
  //         id: selectedOffer._id || selectedOffer.id,
  //         status: 'approved',
  //         action: 'approved'
  //       };

  //       setTimeout(() => {
  //         setIsApproving(false);
  //         if (onComplete) onComplete(updatedData);
  //         handleClose();
  //       }, 1500);
  //     } else {
  //       throw new Error(response.data.message || 'Failed to approve');
  //     }
  //   } catch (err) {
  //     setIsApproving(false);
  //     const errorMsg = err.response?.data?.message || err.message || 'Failed to approve offer';
  //     setError(errorMsg);
  //     setSnackbar({ open: true, message: `❌ ${errorMsg}`, severity: 'error' });
  //   }
  // };

const handleApprove = async () => {
  if (!selectedOffer) return;
  
  if (!validateStep(3)) {
    setError('Please complete all required fields');
    return;
  }

  setIsApproving(true);
  setError('');

  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${BASE_URL}/api/offers/${selectedOffer._id || selectedOffer.id}/approve`,
      {
        comments: comments.trim(),
        signature: `data:image/png;base64,${signature}`
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      console.log('API Response:', response.data);
      
      setSnackbar({ 
        open: true, 
        message: response.data.message || '✅ Offer approved successfully!', 
        severity: 'success' 
      });
      
      // IMPORTANT: Pass the actual status from the API response
      const updatedData = {
        id: selectedOffer.candidate?._id || selectedOffer.candidate?.id || selectedOffer.candidateId,
        candidateId: selectedOffer.candidate?._id || selectedOffer.candidate?.id || selectedOffer.candidateId,
        offerId: selectedOffer._id || selectedOffer.id,
        status: response.data.data?.status, // This will be 'pending_approval' or 'accepted'
        applicationStatus: response.data.data?.status, // Use the same status
        approvalStatus: response.data.data?.approvalStatus,
        action: 'approved'
      };

      console.log('Sending to parent:', updatedData);

      setTimeout(() => {
        setIsApproving(false);
        if (onComplete) onComplete(updatedData);
        handleClose();
      }, 1500);
    } else {
      throw new Error(response.data.message || 'Failed to approve');
    }
  } catch (err) {
    setIsApproving(false);
    const errorMsg = err.response?.data?.message || err.message || 'Failed to approve offer';
    setError(errorMsg);
    setSnackbar({ open: true, message: `${errorMsg}`, severity: 'error' });
  }
};
  
  const handleReject = async () => {
    if (!selectedOffer) return;
    
    if (!validateStep(3)) {
      setError('Please complete all required fields');
      return;
    }

    setIsRejecting(true);
    setError('');

    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${BASE_URL}/api/offers/${selectedOffer._id || selectedOffer.id}/reject`,
        { reason: rejectReason.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSnackbar({ open: true, message: '✅ Offer rejected successfully!', severity: 'success' });
        
        const updatedData = {
          id: selectedOffer._id || selectedOffer.id,
          status: 'rejected',
          action: 'rejected'
        };

        setTimeout(() => {
          setIsRejecting(false);
          if (onComplete) onComplete(updatedData);
          handleClose();
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Failed to reject');
      }
    } catch (err) {
      setIsRejecting(false);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to reject offer';
      setError(errorMsg);
      setSnackbar({ open: true, message: `❌ ${errorMsg}`, severity: 'error' });
    }
  };

  const getCandidateName = () => {
    if (!selectedOffer) return 'Unknown';
    if (selectedOffer.candidate?.name) return selectedOffer.candidate.name;
    if (selectedOffer.candidate?.firstName) {
      return `${selectedOffer.candidate.firstName} ${selectedOffer.candidate.lastName || ''}`.trim();
    }
    return 'Unknown Candidate';
  };

  const getCandidateEmail = () => {
    if (!selectedOffer) return '';
    return selectedOffer.candidate?.email || '';
  };

  const getCandidatePhone = () => {
    if (!selectedOffer) return '';
    return selectedOffer.candidate?.phone || selectedOffer.candidate?.mobile || '';
  };

  const getPosition = () => {
    if (!selectedOffer) return 'N/A';
    return selectedOffer.job?.title || selectedOffer.offerDetails?.designation || 'N/A';
  };

  const getJoiningDate = () => {
    if (!selectedOffer) return null;
    return selectedOffer.offerDetails?.joiningDate || null;
  };

  const getReportingTo = () => {
    if (!selectedOffer) return 'Not Specified';
    return selectedOffer.offerDetails?.reportingTo || 'Not Specified';
  };

  const getProbationPeriod = () => {
    if (!selectedOffer) return 6;
    return selectedOffer.offerDetails?.probationPeriod || 6;
  };

  const getCtcDetails = () => {
    if (!selectedOffer) return null;
    return selectedOffer.ctcDetails || null;
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'default';
      case 'initiated': return 'info';
      case 'pending':
      case 'pending_approval': return 'warning';
      case 'submitted': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const isLoading = isApproving || isRejecting;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
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
        <Typography variant="subtitle1" fontWeight={600}>Approve/Reject Offer</Typography>
        <IconButton onClick={handleClose} size="small" disabled={isLoading}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 2, pt: 1, backgroundColor: '#F8FAFC' }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel 
          connector={<ColorConnector />} 
          sx={{ mb: 1 }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={StepIcon}>
                <Typography fontSize="0.8rem">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2, bgcolor: '#F5F7FA', overflow: 'auto' }}>
        <>
          {/* Step 0: Select Offer */}
          {activeStep === 0 && (
            <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                Select Offer for Approval
              </Typography>
              
              {isFetchingOffers ? (
                <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                  <CircularProgress size={32} />
                </Box>
              ) : offers.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 1 }}>No pending offers found for approval</Alert>
              ) : (
                <FormControl fullWidth size="small" sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}>
                  <InputLabel>Select Offer *</InputLabel>
                  <Select
                    value={selectedOffer?._id || ''}
                    onChange={(e) => {
                      const offer = offers.find(o => o._id === e.target.value);
                      setSelectedOffer(offer);
                      setError('');
                    }}
                    label="Select Offer *"
                    error={!!stepErrors.offer}
                    MenuProps={{
                      PaperProps: {
                        sx: { maxHeight: 250, overflow: 'auto' }
                      }
                    }}
                    renderValue={(selected) => {
                      const offer = offers.find(o => o._id === selected);
                      if (!offer) return <em>Select an offer</em>;
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {getCandidateName()} - {offer.offerId || offer._id}
                          </Typography>
                          <Chip
                            label={offer.status || 'pending_approval'}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              bgcolor: '#FFF3E0',
                              color: '#ED6C02'
                            }}
                          />
                        </Box>
                      );
                    }}
                  >
                    {offers.map(offer => (
                      <MenuItem key={offer._id} value={offer._id} sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" fontWeight={500}>
                              {offer.candidate?.name || 'Unknown'}
                            </Typography>
                            <Chip
                              label={offer.status || 'pending_approval'}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                bgcolor: '#FFF3E0',
                                color: '#ED6C02'
                              }}
                            />
                          </Box>
                          <Typography variant="caption" color="textSecondary">
                            {offer.offerId || offer._id}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {stepErrors.offer && (
                    <FormHelperText error>{stepErrors.offer}</FormHelperText>
                  )}
                </FormControl>
              )}

              {selectedOffer && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">Candidate</Typography>
                      <Typography variant="body2" fontWeight={500}>{getCandidateName()}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">Offer ID</Typography>
                      <Typography variant="body2">{selectedOffer.offerId || selectedOffer._id}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">Position</Typography>
                      <Typography variant="body2">{selectedOffer.job?.title || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">Status</Typography>
                      <Chip 
                        label={selectedOffer.status || 'Pending'} 
                        size="small" 
                        color="warning"
                        sx={{ fontWeight: 500 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          )}

          {/* Step 1: Summary */}
          {activeStep === 1 && selectedOffer && (
            <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                Offer Summary
              </Typography>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Typography variant="body2" fontWeight={600}>{getCandidateName()}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {getCandidateEmail() || 'No email'} | {getCandidatePhone() || 'No phone'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Position</Typography>
                  <Typography variant="body2">{getPosition()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Department</Typography>
                  <Typography variant="body2">{selectedOffer.job?.department || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Joining Date</Typography>
                  <Typography variant="body2">{formatDate(getJoiningDate())}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Reporting To</Typography>
                  <Typography variant="body2">{getReportingTo()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Probation Period</Typography>
                  <Typography variant="body2">{getProbationPeriod()} months</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Location</Typography>
                  <Typography variant="body2">{selectedOffer.job?.location || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Step 2: CTC */}
          {activeStep === 2 && selectedOffer && (
            <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                Annual CTC Breakdown
              </Typography>
              
              {selectedOffer.ctcDetails ? (
                <>
                  <Grid container spacing={4}>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">Basic + DA</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(selectedOffer.ctcDetails.basic * 12)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">HRA</Typography>
                      <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.hra * 12)}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">Conveyance</Typography>
                      <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.conveyanceAllowance * 12)}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">Medical</Typography>
                      <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.medicalAllowance * 12)}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">Special Allowance</Typography>
                      <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.specialAllowance * 12)}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">Bonus</Typography>
                      <Typography variant="body2">{formatCurrency(selectedOffer.ctcDetails.bonus)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" color="#1976D2">Total CTC</Typography>
                        <Typography variant="h6" color="#1976D2" fontWeight={700} paddingLeft={5}>
                          {formatCurrency(selectedOffer.ctcDetails.totalCtc)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <Alert severity="info" sx={{ borderRadius: 1 }}>CTC details not available</Alert>
              )}
            </Paper>
          )}

          {/* Step 3: Decision */}
          {activeStep === 3 && (
            <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                Make Decision
              </Typography>

              <ButtonGroup fullWidth sx={{ mb: 3 }}>
                <Button
                  variant={action === 'approve' ? 'contained' : 'outlined'}
                  color="success"
                  onClick={() => {
                    setAction('approve');
                    setError('');
                    setStepErrors({});
                  }}
                  startIcon={<ThumbUpIcon />}
                  disabled={isLoading}
                >
                  Approve
                </Button>
                <Button
                  variant={action === 'reject' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => {
                    setAction('reject');
                    setError('');
                    setStepErrors({});
                  }}
                  startIcon={<ThumbDownIcon />}
                  disabled={isLoading}
                >
                  Reject
                </Button>
              </ButtonGroup>

              {action === 'approve' && (
                <>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem', mb: 1 }}>
                    Approval Comments *
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Add your approval comments (e.g., Salary is within budget, All documents verified, etc.)"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    size="small"
                    error={!!stepErrors.comments}
                    helperText={stepErrors.comments}
                    disabled={isLoading}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1, fontSize: '0.85rem' } }}
                  />

                  <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem', mb: 1 }}>
                    Digital Signature *
                  </Typography>

                  <Box>
                    {!signature ? (
                      <Box
                        sx={{
                          textAlign: 'center',
                          cursor: isLoading ? 'default' : 'pointer',
                        }}
                        component="label"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSignatureUpload}
                          style={{ display: 'none' }}
                          disabled={isLoading}
                        />
                        <Typography variant="body2" color="textSecondary">
                          Click to upload signature image
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Supported formats: PNG, JPG, JPEG
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{
                        p: 1.5,
                        bgcolor: '#F0F7FF',
                        borderRadius: 1,
                        border: '1px solid #1976D2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                          <Typography variant="body2">{signatureName}</Typography>
                        </Box>
                        <Button
                          size="small"
                          color="error"
                          onClick={clearSignature}
                          disabled={isLoading}
                          sx={{ textTransform: 'none' }}
                        >
                          Remove
                        </Button>
                      </Box>
                    )}
                    {stepErrors.signature && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {stepErrors.signature}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{
                    p: 1.5,
                    bgcolor: '#FFF4E5',
                    borderRadius: 1,
                    border: '1px solid #FFB74D',
                    mb: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <WarningIcon sx={{ color: '#F57C00', fontSize: 18 }} />
                      <Typography variant="subtitle2" sx={{ color: '#F57C00', fontSize: '0.85rem' }}>
                        Approval Notice
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      By approving this offer, you are authorizing the release of this offer letter to the candidate.
                      This action will trigger the offer generation process and cannot be undone.
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <input
                      type="checkbox"
                      id="confirmApprove"
                      checked={confirmApprove}
                      onChange={(e) => setConfirmApprove(e.target.checked)}
                      disabled={isLoading}
                      style={{ width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      I confirm that I have reviewed all details and approve this offer.
                    </Typography>
                  </Box>
                  {stepErrors.confirmApprove && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {stepErrors.confirmApprove}
                    </Typography>
                  )}
                </>
              )}

              {action === 'reject' && (
                <>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem', mb: 1 }}>
                    Rejection Reason *
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Please provide reason for rejection"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    size="small"
                    error={!!stepErrors.rejectReason}
                    helperText={stepErrors.rejectReason}
                    disabled={isLoading}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </>
              )}

              {action === null && (
                <Alert severity="info" sx={{ borderRadius: 1 }}>
                  Please select Approve or Reject to continue
                </Alert>
              )}

              {/* Preview Section for Approve */}
              {action === 'approve' && selectedOffer && (
                <Paper sx={{ p: 2, mt: 2, bgcolor: '#F8FAFC', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                  <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                    Approval Preview
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">Candidate</Typography>
                      <Typography variant="body2" fontWeight={500}>{getCandidateName()}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">Offer ID</Typography>
                      <Typography variant="body2">{selectedOffer?.offerId || selectedOffer?._id}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">Total CTC</Typography>
                      <Typography variant="body2" fontWeight={600} color="#1976D2">
                        {selectedOffer.ctcDetails ? formatCurrency(selectedOffer.ctcDetails.totalCtc) : 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary" display="block">Comments</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {comments || 'No comments added'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}
            </Paper>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
        </>
      </DialogContent>

      <DialogActions sx={{ 
        p: 2, 
        borderTop: '1px solid #E0E0E0', 
        bgcolor: '#F8FAFC', 
        justifyContent: 'space-between' 
      }}>
        <>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || isLoading}
            startIcon={<NavigateBeforeIcon />}
            size="small"
            sx={{ color: '#666' }}
          >
            Back
          </Button>
          <Box>
            <Button 
              onClick={handleClose} 
              disabled={isLoading} 
              size="small"
              sx={{ mr: 1, color: '#666' }}
            >
              Cancel
            </Button>
            {activeStep === steps.length - 1 ? (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleReject}
                  disabled={!action || action !== 'reject' || !rejectReason.trim() || isLoading}
                  size="small"
                  startIcon={isRejecting ? <CircularProgress size={16} color="inherit" /> : <ThumbDownIcon />}
                  sx={{ mr: 1, minWidth: 100 }}
                >
                  {isRejecting ? 'Rejecting...' : 'Reject'}
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                  disabled={!action || action !== 'approve' || !comments.trim() || !signature || !confirmApprove || isLoading}
                  size="small"
                  startIcon={isApproving ? <CircularProgress size={16} color="inherit" /> : <ThumbUpIcon />}
                  sx={{ 
                    minWidth: 100,
                    backgroundColor: '#4CAF50',
                    '&:hover': { backgroundColor: '#45a049' },
                    '&.Mui-disabled': { backgroundColor: '#A5D6A7' }
                  }}
                >
                  {isApproving ? 'Approving...' : 'Approve'}
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!selectedOffer || isLoading}
                endIcon={<NavigateNextIcon />}
                size="small"
                sx={{
                  backgroundColor: '#1976D2',
                  '&:hover': { backgroundColor: '#1565C0' }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </>
      </DialogActions>

      {/* Snackbar for notifications - positioned at bottom right */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ 
            borderRadius: 1,
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ApproveOffer;