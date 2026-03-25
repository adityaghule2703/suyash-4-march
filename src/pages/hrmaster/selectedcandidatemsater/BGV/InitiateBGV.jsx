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
//   StepLabel
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   Person as PersonIcon,
//   Security as SecurityIcon,
//   Fingerprint as FingerprintIcon,
//   Home as HomeIcon,
//   School as SchoolIcon,
//   Business as BusinessIcon,
//   Gavel as GavelIcon,
//   CheckCircle as CheckCircleIcon,
//   Info as InfoIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../../config/Config';

// // Color constants
// const PRIMARY_BLUE = '#00B4D8';

// // Check types with icons and descriptions
// const CHECK_TYPES = [
//   { 
//     type: 'identity', 
//     label: 'Identity Verification', 
//     icon: <FingerprintIcon />, 
//     color: '#1976D2',
//     description: 'Verify candidate identity documents'
//   },
//   { 
//     type: 'address', 
//     label: 'Address Verification', 
//     icon: <HomeIcon />, 
//     color: '#2E7D32',
//     description: 'Verify current and permanent address'
//   },
//   { 
//     type: 'education', 
//     label: 'Education Verification', 
//     icon: <SchoolIcon />, 
//     color: '#7B1FA2',
//     description: 'Verify educational qualifications'
//   },
//   { 
//     type: 'employment', 
//     label: 'Employment Verification', 
//     icon: <BusinessIcon />, 
//     color: '#F57C00',
//     description: 'Verify previous employment history'
//   },
//   { 
//     type: 'criminal', 
//     label: 'Criminal Record Check', 
//     icon: <GavelIcon />, 
//     color: '#C62828',
//     description: 'Check for criminal records'
//   }
// ];

// const InitiateBGV = ({ open, onClose, onSubmit }) => {
//   const [step, setStep] = useState(0);
//   const [submitting, setSubmitting] = useState(false);
  
//   // Data states
//   const [candidates, setCandidates] = useState([]);
//   const [offers, setOffers] = useState([]);
//   const [fetchingCandidates, setFetchingCandidates] = useState(false);
//   const [fetchingOffers, setFetchingOffers] = useState(false);
  
//   // Form state
//   const [selectedCandidate, setSelectedCandidate] = useState('');
//   const [selectedOffer, setSelectedOffer] = useState('');
//   const [initiatedBGV, setInitiatedBGV] = useState(null);
  
//   // Error/Success state
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const steps = ['Select Candidate', 'Select Offer', 'Confirm & Initiate'];

//   // Fetch data on open
//   useEffect(() => {
//     if (open) {
//       fetchSelectedCandidates();
//     }
//   }, [open]);

//   // Fetch candidates with status 'selected'
//   const fetchSelectedCandidates = async () => {
//     setFetchingCandidates(true);
//     setError('');
    
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/candidates?status=selected`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setCandidates(response.data.data || []);
//       } else {
//         setError('Failed to fetch candidates');
//       }
//     } catch (err) {
//       console.error('Error fetching candidates:', err);
//       setError(err.response?.data?.message || 'Failed to fetch candidates');
//     } finally {
//       setFetchingCandidates(false);
//     }
//   };

//   // Fetch offers for selected candidate
//  // Fetch offers for selected candidate
// const fetchOffersForCandidate = async (candidateId) => {
//   if (!candidateId) return;
  
//   setFetchingOffers(true);
//   setError('');
  
//   try {
//     const token = localStorage.getItem('token');
    
//     let offersArray = [];
//     let response;
    
//     try {
//       // First try: get offers by candidate ID
//       response = await axios.get(`${BASE_URL}/api/offers?candidateId=${candidateId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//     } catch (err) {
//       // Second try: get all offers
//       console.log('Trying base offers endpoint...');
//       response = await axios.get(`${BASE_URL}/api/offers`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//     }

//     console.log('Offers API Response:', response.data);

//     if (response.data.success) {
//       // Handle different response structures
//       const responseData = response.data.data;
      
//       if (Array.isArray(responseData)) {
//         // If data is directly an array
//         offersArray = responseData;
//       } else if (responseData && typeof responseData === 'object') {
//         // If data is an object, check for common array properties
//         if (responseData.offers && Array.isArray(responseData.offers)) {
//           offersArray = responseData.offers;
//         } else if (responseData.results && Array.isArray(responseData.results)) {
//           offersArray = responseData.results;
//         } else if (responseData.items && Array.isArray(responseData.items)) {
//           offersArray = responseData.items;
//         } else if (responseData.data && Array.isArray(responseData.data)) {
//           offersArray = responseData.data;
//         } else {
//           // If it's an object but not containing an array, maybe it's a single offer?
//           // Check if it has _id or offerId to treat as a single offer
//           if (responseData._id || responseData.offerId) {
//             offersArray = [responseData];
//           } else {
//             // Try to extract any array property from the object
//             const possibleArrayProps = Object.values(responseData).filter(val => Array.isArray(val));
//             if (possibleArrayProps.length > 0) {
//               offersArray = possibleArrayProps[0];
//             } else {
//               offersArray = [];
//               console.warn('No array found in response data:', responseData);
//             }
//           }
//         }
//       }

//       // Filter offers for the selected candidate
//       const candidateOffers = offersArray.filter(offer => {
//         const offerCandidateId = offer.candidateId?._id || 
//                                  offer.candidateId || 
//                                  offer.candidate?._id || 
//                                  offer.candidate;
//         return offerCandidateId === candidateId;
//       });
      
//       console.log('Filtered offers for candidate:', candidateOffers);
//       setOffers(candidateOffers);
      
//       if (candidateOffers.length === 0) {
//         // Don't set error, just show empty state
//         console.log('No offers found for candidate:', candidateId);
//       }
//     } else {
//       setOffers([]);
//     }
//   } catch (err) {
//     console.error('Error fetching offers:', err);
//     setOffers([]);
//   } finally {
//     setFetchingOffers(false);
//   }
// };

//   // Handle candidate change
//   const handleCandidateChange = async (e) => {
//     const candidateId = e.target.value;
//     setSelectedCandidate(candidateId);
//     setSelectedOffer(''); // Reset offer when candidate changes
//     setError('');
//     setOffers([]); // Clear offers while loading
    
//     if (candidateId) {
//       await fetchOffersForCandidate(candidateId);
//     }
//   };

//   // Handle offer change
//   const handleOfferChange = (e) => {
//     setSelectedOffer(e.target.value);
//     setError('');
//   };

//   // Handle next step
//   const handleNext = () => {
//     if (step === 0 && !selectedCandidate) {
//       setError('Please select a candidate');
//       return;
//     }
//     if (step === 1 && !selectedOffer) {
//       setError('Please select an offer');
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

//   // Handle reset
//   const handleReset = () => {
//     setStep(0);
//     setSelectedCandidate('');
//     setSelectedOffer('');
//     setOffers([]);
//     setInitiatedBGV(null);
//     setError('');
//     setSuccess('');
//   };

//   // Handle close
//   const handleClose = () => {
//     handleReset();
//     onClose();
//   };

//   // Handle initiate BGV
//   const handleInitiateBGV = async () => {
//     setSubmitting(true);
//     setError('');
    
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${BASE_URL}/api/bgv/initiate`,
//         {
//           candidateId: selectedCandidate,
//           offerId: selectedOffer
//         },
//         {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         setInitiatedBGV(response.data.data);
//         setSuccess(response.data.message || 'Background verification initiated successfully!');
        
//         if (onSubmit) {
//           onSubmit(response.data.data);
//         }
        
//         // Auto close after success
//         setTimeout(() => {
//           handleClose();
//         }, 2000);
//       }
//     } catch (err) {
//       console.error('Error initiating BGV:', err);
//       setError(err.response?.data?.message || 'Failed to initiate background verification');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Get candidate details
//   const getCandidateDetails = () => {
//     return candidates.find(c => c._id === selectedCandidate);
//   };

//   // Get offer details
//   const getOfferDetails = () => {
//     return offers.find(o => o._id === selectedOffer);
//   };

//   const candidateDetails = getCandidateDetails();
//   const offerDetails = getOfferDetails();

//   // Render step content
//   const renderStepContent = () => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={3}>
//             <Paper sx={{ p: 3 }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1976D2">
//                 Select Candidate
//               </Typography>
              
//               {fetchingCandidates ? (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//                   <CircularProgress size={32} />
//                 </Box>
//               ) : (
//                 <FormControl fullWidth size="small">
//                   <InputLabel>Select Candidate</InputLabel>
//                   <Select
//                     value={selectedCandidate}
//                     onChange={handleCandidateChange}
//                     label="Select Candidate"
//                   >
//                     <MenuItem value="">Choose a candidate</MenuItem>
//                     {candidates.map((cand) => (
//                       <MenuItem key={cand._id} value={cand._id}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Avatar sx={{ width: 24, height: 24, bgcolor: PRIMARY_BLUE, fontSize: '0.75rem' }}>
//                             {cand.firstName?.[0]}{cand.lastName?.[0]}
//                           </Avatar>
//                           <Box>
//                             <Typography variant="body2">
//                               {cand.firstName} {cand.lastName}
//                             </Typography>
//                             <Typography variant="caption" color="textSecondary">
//                               {cand.candidateId} - {cand.email}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               )}

//               {candidateDetails && (
//                 <Box sx={{ mt: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
//                   <Typography variant="subtitle2" gutterBottom fontWeight={600}>
//                     Candidate Information
//                   </Typography>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="caption" color="textSecondary">Full Name</Typography>
//                       <Typography variant="body2" fontWeight={500}>
//                         {candidateDetails.firstName} {candidateDetails.lastName}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="caption" color="textSecondary">Candidate ID</Typography>
//                       <Typography variant="body2">{candidateDetails.candidateId}</Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="caption" color="textSecondary">Email</Typography>
//                       <Typography variant="body2">{candidateDetails.email}</Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="caption" color="textSecondary">Phone</Typography>
//                       <Typography variant="body2">{candidateDetails.phone}</Typography>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               )}
//             </Paper>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={3}>
//             <Paper sx={{ p: 3 }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1976D2">
//                 📄 Select Offer
//               </Typography>

//               {!selectedCandidate ? (
//                 <Alert severity="info" sx={{ borderRadius: 2 }}>
//                   Please select a candidate first to view available offers
//                 </Alert>
//               ) : fetchingOffers ? (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//                   <CircularProgress size={32} />
//                 </Box>
//               ) : (
//                 <FormControl fullWidth size="small">
//                   <InputLabel>Select Offer</InputLabel>
//                   <Select
//                     value={selectedOffer}
//                     onChange={handleOfferChange}
//                     label="Select Offer"
//                     disabled={offers.length === 0}
//                   >
//                     <MenuItem value="">Choose an offer</MenuItem>
//                     {offers.length > 0 ? (
//                       offers.map((offer) => (
//                         <MenuItem key={offer._id} value={offer._id}>
//                           <Box>
//                             <Typography variant="body2" fontWeight={500}>
//                               {offer.offerId || offer._id?.substring(0, 8) || 'N/A'}
//                             </Typography>
//                             <Typography variant="caption" color="textSecondary">
//                               Status: {offer.status || 'N/A'} 
//                               {offer.createdAt && ` | Created: ${new Date(offer.createdAt).toLocaleDateString()}`}
//                             </Typography>
//                           </Box>
//                         </MenuItem>
//                       ))
//                     ) : (
//                       <MenuItem disabled value="">
//                         <Typography variant="body2" color="textSecondary">
//                           No offers available for this candidate
//                         </Typography>
//                       </MenuItem>
//                     )}
//                   </Select>
//                 </FormControl>
//               )}

//               {offerDetails && (
//                 <Box sx={{ mt: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
//                   <Typography variant="subtitle2" gutterBottom fontWeight={600}>
//                     Offer Details
//                   </Typography>
//                   <Grid container spacing={8}>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="caption" color="textSecondary">Offer ID</Typography>
//                       <Typography variant="body2" fontWeight={500}>{offerDetails.offerId || 'N/A'}</Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="caption" color="textSecondary">Status</Typography>
//                       <Chip
//                         label={offerDetails.status || 'N/A'}
//                         size="small"
//                         sx={{
//                           bgcolor: offerDetails.status === 'draft' ? '#fef3c7' : 
//                                   offerDetails.status === 'sent' ? '#e3f2fd' : '#d1fae5',
//                           color: offerDetails.status === 'draft' ? '#92400e' : 
//                                  offerDetails.status === 'sent' ? '#1976d2' : '#065f46',
//                           height: 20,
//                           fontSize: '11px'
//                         }}
//                       />
//                     </Grid>
//                     {offerDetails.createdAt && (
//                       <Grid item xs={12}>
//                         <Typography variant="caption" color="textSecondary">Created At</Typography>
//                         <Typography variant="body2">
//                           {new Date(offerDetails.createdAt).toLocaleString()}
//                         </Typography>
//                       </Grid>
//                     )}
//                   </Grid>
//                 </Box>
//               )}
//             </Paper>
//           </Stack>
//         );

//       case 2:
//         return (
//           <Stack spacing={3}>
//             <Paper sx={{ p: 1 }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1976D2">
//                 Confirm & Initiate
//               </Typography>

//               {/* Summary Card */}
//               <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, mb: 3 }}>
//                 <Typography variant="subtitle2" gutterBottom fontWeight={600}>
//                   Summary
//                 </Typography>
//                 <Grid container spacing={12}>
//                   <Grid item xs={12}>
//                     <Typography variant="caption" color="textSecondary">Candidate</Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {candidateDetails?.firstName} {candidateDetails?.lastName}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="caption" color="textSecondary">Candidate ID</Typography>
//                     <Typography variant="body2">{candidateDetails?.candidateId}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="caption" color="textSecondary">Offer ID</Typography>
//                     <Typography variant="body2">{offerDetails?.offerId || 'N/A'}</Typography>
//                   </Grid>
//                 </Grid>
//               </Paper>

//               {/* BGV Checks Info */}
//               <Paper sx={{ p: 2, bgcolor: '#F0F7FF', borderRadius: 2, border: '1px solid #90CAF9', mb: 3 }}>
//                 <Typography variant="subtitle2" gutterBottom fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <SecurityIcon fontSize="small" color="primary" />
//                   Background Verification Checks
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" paragraph>
//                   The following checks will be initiated for this candidate:
//                 </Typography>
//                 <Grid container spacing={2}>
//                   {CHECK_TYPES.map((check) => (
//                     <Grid item xs={12} sm={6} key={check.type}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Box sx={{ color: check.color }}>{check.icon}</Box>
//                         <Box>
//                           <Typography variant="body2" fontWeight={500}>
//                             {check.label}
//                           </Typography>
//                           <Typography variant="caption" color="textSecondary">
//                             {check.description}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Paper>

//               {/* Initiated BGV Info */}
//               {initiatedBGV && (
//                 <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
//                   <Typography variant="body2" fontWeight={500}>
//                     BGV Initiated Successfully!
//                   </Typography>
//                   <Typography variant="caption" display="block">
//                     BGV ID: {initiatedBGV.bgvId}
//                   </Typography>
//                 </Alert>
//               )}

//               {/* Info Alert */}
//               {/* <Alert severity="info" icon={<InfoIcon />} sx={{ borderRadius: 2 }}>
//                 <Typography variant="body2">
//                   This will initiate background verification for the selected candidate.
//                   The process may take 3-5 business days to complete.
//                 </Typography>
//               </Alert> */}
//             </Paper>
//           </Stack>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog 
//       open={open} 
//       onClose={handleClose} 
//       maxWidth="md" 
//       fullWidth
//       PaperProps={{
//         sx: { borderRadius: 2 }
//       }}
//     >
//       <DialogTitle sx={{ 
//         borderBottom: 1, 
//         borderColor: '#E0E0E0', 
//         bgcolor: '#F8FAFC',
//         px: 3,
//         py: 2
//       }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Box>
//             <Typography variant="h6" fontWeight={600}>
//               Initiate Background Verification
//             </Typography>
//             <Typography variant="caption" color="textSecondary">
//               Start BGV process for selected candidate
//             </Typography>
//           </Box>
//           <IconButton onClick={handleClose} size="small">
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </DialogTitle>

//       <DialogContent sx={{ pt: 3, px: 3 }}>
//         {/* Error/Success Messages */}
//         {error && (
//           <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3, borderRadius: 2 }}>
//             {error}
//           </Alert>
//         )}
//         {success && !initiatedBGV && (
//           <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 3, borderRadius: 2 }}>
//             {success}
//           </Alert>
//         )}

//         {/* Stepper */}
//         <Stepper activeStep={step} sx={{ mb: 4, mt: 2 }}>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         {/* Step Content */}
//         <Box sx={{ minHeight: 400 }}>
//           {renderStepContent()}
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{ 
//         px: 3, 
//         py: 2, 
//         borderTop: 1, 
//         borderColor: '#E0E0E0', 
//         bgcolor: '#F8FAFC',
//         justifyContent: 'space-between'
//       }}>
//         <Button onClick={handleClose}>
//           Cancel
//         </Button>
//         <Box>
//           <Button
//             disabled={step === 0}
//             onClick={handleBack}
//             sx={{ mr: 1 }}
//           >
//             Back
//           </Button>
//           {step === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleInitiateBGV}
//               disabled={submitting || !selectedOffer}
//               startIcon={submitting ? <CircularProgress size={20} /> : <SecurityIcon />}
//               sx={{
//                 background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                 minWidth: 200,
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
//                 }
//               }}
//             >
//               {submitting ? 'Initiating...' : 'Initiate BGV'}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={step === 1 && offers.length === 0}
//               sx={{
//                 background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #0e3b4a, #0096b4)'
//                 }
//               }}
//             >
//               Next
//             </Button>
//           )}
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default InitiateBGV;

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
  FormHelperText,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Fingerprint as FingerprintIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Gavel as GavelIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Assignment as AssignmentIcon,
  VerifiedUser as VerifiedUserIcon
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

// Check types with icons and descriptions
const CHECK_TYPES = [
  { type: 'identity', label: 'Identity Verification', icon: <FingerprintIcon sx={{ fontSize: '0.8rem' }} />, color: '#1976D2', description: 'Verify candidate identity documents' },
  { type: 'address', label: 'Address Verification', icon: <HomeIcon sx={{ fontSize: '0.8rem' }} />, color: '#2E7D32', description: 'Verify current and permanent address' },
  { type: 'education', label: 'Education Verification', icon: <SchoolIcon sx={{ fontSize: '0.8rem' }} />, color: '#7B1FA2', description: 'Verify educational qualifications' },
  { type: 'employment', label: 'Employment Verification', icon: <BusinessIcon sx={{ fontSize: '0.8rem' }} />, color: '#F57C00', description: 'Verify previous employment history' },
  { type: 'criminal', label: 'Criminal Record Check', icon: <GavelIcon sx={{ fontSize: '0.8rem' }} />, color: '#C62828', description: 'Check for criminal records' }
];

const steps = ['Select Candidate', 'Select Offer', 'Confirm & Initiate'];

const InitiateBGV = ({ open, onClose, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [offers, setOffers] = useState([]);
  const [fetchingCandidates, setFetchingCandidates] = useState(false);
  const [fetchingOffers, setFetchingOffers] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedOffer, setSelectedOffer] = useState('');
  const [initiatedBGV, setInitiatedBGV] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open) {
      fetchSelectedCandidates();
    }
  }, [open]);

  const fetchSelectedCandidates = async () => {
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

  const fetchOffersForCandidate = async (candidateId) => {
    if (!candidateId) return;
    
    setFetchingOffers(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      let offersArray = [];
      
      const response = await axios.get(`${BASE_URL}/api/offers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const responseData = response.data.data;
        
        if (Array.isArray(responseData)) {
          offersArray = responseData;
        } else if (responseData && typeof responseData === 'object') {
          if (responseData.offers && Array.isArray(responseData.offers)) {
            offersArray = responseData.offers;
          } else if (responseData.data && Array.isArray(responseData.data)) {
            offersArray = responseData.data;
          } else if (responseData._id || responseData.offerId) {
            offersArray = [responseData];
          }
        }

        const candidateOffers = offersArray.filter(offer => {
          const offerCandidateId = offer.candidateId?._id || offer.candidateId || offer.candidate?._id || offer.candidate;
          return offerCandidateId === candidateId;
        });
        
        setOffers(candidateOffers);
      } else {
        setOffers([]);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      setOffers([]);
    } finally {
      setFetchingOffers(false);
    }
  };

  const handleCandidateChange = async (e) => {
    const candidateId = e.target.value;
    setSelectedCandidate(candidateId);
    setSelectedOffer('');
    setError('');
    setOffers([]);
    if (candidateId) {
      await fetchOffersForCandidate(candidateId);
    }
    if (fieldErrors.candidate) setFieldErrors(prev => ({ ...prev, candidate: '' }));
  };

  const handleOfferChange = (e) => {
    setSelectedOffer(e.target.value);
    setError('');
    if (fieldErrors.offer) setFieldErrors(prev => ({ ...prev, offer: '' }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateStep = () => {
    const errors = {};
    if (step === 0 && !selectedCandidate) {
      errors.candidate = 'Please select a candidate';
    }
    if (step === 1 && !selectedOffer) {
      errors.offer = 'Please select an offer';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError('Please fill in all required fields');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  const handleReset = () => {
    setStep(0);
    setSelectedCandidate('');
    setSelectedOffer('');
    setOffers([]);
    setInitiatedBGV(null);
    setError('');
    setSuccess('');
    setFieldErrors({});
    setTouched({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleInitiateBGV = async () => {
    if (!selectedCandidate || !selectedOffer) {
      setError('Please select both candidate and offer');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/bgv/initiate`,
        { candidateId: selectedCandidate, offerId: selectedOffer },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setInitiatedBGV(response.data.data);
        setSuccess(response.data.message || 'Background verification initiated successfully!');
        if (onSubmit) onSubmit(response.data.data);
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Error initiating BGV:', err);
      setError(err.response?.data?.message || 'Failed to initiate background verification');
    } finally {
      setSubmitting(false);
    }
  };

  const getCandidateDetails = () => candidates.find(c => c._id === selectedCandidate);
  const getOfferDetails = () => offers.find(o => o._id === selectedOffer);
  const candidateDetails = getCandidateDetails();
  const offerDetails = getOfferDetails();

  const [fieldErrors, setFieldErrors] = useState({});

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
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Select Candidate *</InputLabel>
                  <Select
                    value={selectedCandidate}
                    onChange={handleCandidateChange}
                    onBlur={() => handleBlur('candidate')}
                    label="Select Candidate *"
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

              {candidateDetails && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
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
                </Box>
              )}
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AssignmentIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Select Offer
                </Typography>
              </Box>

              {!selectedCandidate ? (
                <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                  Please select a candidate first to view available offers
                </Alert>
              ) : fetchingOffers ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                </Box>
              ) : (
                <FormControl fullWidth size="small" error={touched.offer && !!fieldErrors.offer}>
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Select Offer *</InputLabel>
                  <Select
                    value={selectedOffer}
                    onChange={handleOfferChange}
                    onBlur={() => handleBlur('offer')}
                    label="Select Offer *"
                    disabled={offers.length === 0}
                    sx={inputStyle}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Choose an offer</MenuItem>
                    {offers.length > 0 ? (
                      offers.map((offer) => (
                        <MenuItem key={offer._id} value={offer._id} sx={{ fontSize: '0.75rem' }}>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              {offer.offerId || offer._id?.slice(-6).toUpperCase()}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Status: {offer.status || 'N/A'}
                              {offer.createdAt && ` | Created: ${new Date(offer.createdAt).toLocaleDateString()}`}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                          No offers available for this candidate
                        </Typography>
                      </MenuItem>
                    )}
                  </Select>
                  {touched.offer && fieldErrors.offer && (
                    <FormHelperText sx={{ fontSize: '0.65rem' }}>{fieldErrors.offer}</FormHelperText>
                  )}
                </FormControl>
              )}

              {offerDetails && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                    Offer Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Offer ID</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {offerDetails.offerId || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Status</Typography>
                      <Chip
                        label={offerDetails.status || 'N/A'}
                        size="small"
                        sx={{
                          bgcolor: offerDetails.status === 'draft' ? COLORS.status.warning :
                                  offerDetails.status === 'sent' ? COLORS.status.info : COLORS.status.success,
                          color: offerDetails.status === 'draft' ? '#92400E' :
                                 offerDetails.status === 'sent' ? '#0369A1' : COLORS.primaryDark,
                          fontSize: '0.6rem',
                          height: 20
                        }}
                      />
                    </Grid>
                    {offerDetails.createdAt && (
                      <Grid size={{ xs: 12 }}>
                        <Typography sx={labelStyle}>Created At</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {new Date(offerDetails.createdAt).toLocaleString()}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 2.5, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SecurityIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Confirm & Initiate
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}`, mb: 3 }}>
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
                    <Typography sx={labelStyle}>Offer ID</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {offerDetails?.offerId || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ p: 2, bgcolor: COLORS.status.info, borderRadius: 1.5, border: `1px solid ${COLORS.primary}`, mb: 3 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  Background Verification Checks
                </Typography>
                <Grid container spacing={2}>
                  {CHECK_TYPES.map((check) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={check.type}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: check.color }}>{check.icon}</Box>
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                            {check.label}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {check.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {initiatedBGV && (
                <Alert severity="success" icon={<CheckCircleIcon sx={{ fontSize: '0.9rem' }} />} sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>BGV Initiated Successfully!</Typography>
                  <Typography sx={{ fontSize: '0.65rem' }}>BGV ID: {initiatedBGV.bgvId}</Typography>
                </Alert>
              )}
            </Paper>
          </Stack>
        );

      default: return null;
    }
  };

  return (
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
          <SecurityIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Initiate Background Verification
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
        {success && !initiatedBGV && (
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
        <Button onClick={handleClose} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>
          Cancel
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {step > 0 && (
            <Button onClick={handleBack} startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>
              Back
            </Button>
          )}
          {step === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleInitiateBGV}
              disabled={submitting || !selectedOffer}
              startIcon={submitting ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : <SecurityIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                minWidth: 140,
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              {submitting ? 'Initiating...' : 'Initiate BGV'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={step === 1 && offers.length === 0}
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
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

export default InitiateBGV;