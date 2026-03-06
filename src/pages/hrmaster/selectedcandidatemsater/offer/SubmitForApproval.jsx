// src/components/OfferManagement/SubmitForApproval.jsx
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

  // Feedback components
  CircularProgress,
  Snackbar,

  // Buttons and actions
  Button,
  IconButton,

  // Surfaces
  styled,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
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
    if (icon === 1) return <PersonIcon fontSize="small" />;
    if (icon === 2) return <AttachMoneyIcon fontSize="small" />;
    if (icon === 3) return <DescriptionIcon fontSize="small" />;
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

const SubmitForApproval = ({ open, onClose, onComplete, candidateData = null }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [candidateOffers, setCandidateOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [stepErrors, setStepErrors] = useState({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Steps definition
  const steps = ['Select Offer', 'CTC Breakdown', 'Terms & Confirmation'];

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  };

  // Show snackbar helper
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  // Reset all state when dialog closes
  const resetState = () => {
    setActiveStep(0);
    setRemarks('');
    setConfirmSubmit(false);
    setSelectedOffer(null);
    setCandidateInfo(null);
    setCandidateOffers([]);
    setError('');
    setSuccess('');
    setResponseData(null);
    setStepErrors({});
    setLoading(false);
    setFetchingData(false);
  };

  // Fetch candidate details and offers when component opens
  useEffect(() => {
    if (open && candidateData) {
      console.log('Dialog opened with candidate data:', candidateData);

      // Reset state first
      resetState();

      // Set candidate info from the passed data
      setCandidateInfo(candidateData);

      // Fetch offers for this candidate
      fetchCandidateOffers(candidateData._id || candidateData.id);
    }
  }, [open, candidateData]);

  // Fetch candidate offers using the correct API endpoint
  const fetchCandidateOffers = async (candidateId) => {
    setFetchingData(true);
    setError('');

    try {
      const token = getAuthToken();

      // First, fetch candidate details to get candidate info
      const candidateApiUrl = `${BASE_URL}/api/candidates?_id=${candidateId}`;
      console.log('Fetching candidate details from:', candidateApiUrl);

      const candidateResponse = await axios.get(candidateApiUrl, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      console.log('Candidate details response:', candidateResponse.data);

      if (candidateResponse.data && candidateResponse.data.length > 0) {
        const candidateDetails = candidateResponse.data[0];
        setCandidateInfo(candidateDetails);
      }

      // Now fetch all offers and filter by candidateId
      // Try different API endpoints to find offers for this candidate
      let offersArray = [];

      // Try 1: Fetch all offers and filter
      try {
        const offersApiUrl = `${BASE_URL}/api/offers?candidateId=${candidateId}`;
        console.log('Fetching offers from:', offersApiUrl);

        const offersResponse = await axios.get(offersApiUrl, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });

        console.log('Offers response:', offersResponse.data);

        if (offersResponse.data.success && offersResponse.data.data) {
          if (Array.isArray(offersResponse.data.data)) {
            offersArray = offersResponse.data.data;
          } else if (offersResponse.data.data.offers) {
            offersArray = offersResponse.data.data.offers;
          }
        }
      } catch (offerErr) {
        console.log('Error fetching from offers endpoint, trying alternative...', offerErr);

        // Try 2: Alternative endpoint
        try {
          const altOffersUrl = `${BASE_URL}/api/offers/candidate/${candidateId}`;
          console.log('Trying alternative offers endpoint:', altOffersUrl);

          const altResponse = await axios.get(altOffersUrl, {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json'
            }
          });

          console.log('Alternative offers response:', altResponse.data);

          if (altResponse.data.success && altResponse.data.data) {
            if (Array.isArray(altResponse.data.data)) {
              offersArray = altResponse.data.data;
            } else if (altResponse.data.data.offers) {
              offersArray = altResponse.data.data.offers;
            }
          }
        } catch (altErr) {
          console.log('Alternative endpoint also failed', altErr);
        }
      }

      console.log('Final offers array:', offersArray);

      // Filter for initiated offers
      const initiatedOffers = offersArray.filter(offer => {
        if (!offer) return false;
        const status = (offer.status || '').toLowerCase();
       
        const offerStatus = offer.offerStatus?.toLowerCase() || '';
        const applicationStatus = offer.applicationStatus?.toLowerCase() || '';
        const workflowStatus = offer.workflowStatus?.toLowerCase() || '';

          // Check if any of the status fields indicate initiated/draft
  const isInitiated = 
    status === 'initiated' || 
    status === 'draft' ||
    offerStatus === 'initiated' || 
    offerStatus === 'draft' ||
    applicationStatus === 'initiated' || 
    applicationStatus === 'draft' ||
    workflowStatus === 'initiated' || 
    workflowStatus === 'draft';

     // Log for debugging
  if (offer.offerId || offer._id) {
    console.log(`Offer ${offer.offerId || offer._id} status check:`, {
      status,
      offerStatus,
      applicationStatus,
      workflowStatus,
      isInitiated
    });
  }
  
  return isInitiated;
});

console.log('Initiated offers found:', initiatedOffers);


      if (initiatedOffers.length > 0) {
        // Sort by creation date (newest first)
        const sortedOffers = [...initiatedOffers].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.createdDate || a.updatedAt || 0);
          const dateB = new Date(b.createdAt || b.createdDate || b.updatedAt || 0);
          return dateB - dateA;
        });

        setCandidateOffers(sortedOffers);
        setSelectedOffer(sortedOffers[0]);
        showSnackbar(`Found ${sortedOffers.length} initiated offer(s) for this candidate`, 'success');
      } else {
        setCandidateOffers([]);
        setSelectedOffer(null);
        showSnackbar('No initiated offers found for this candidate', 'warning');

        // Log the full offers array for debugging
        console.log('All offers found:', offersArray);
      }
    } catch (err) {
      console.error('Error in fetchCandidateOffers:', err);
      setError('Failed to fetch offers for this candidate');
      showSnackbar('Error fetching offers: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setFetchingData(false);
    }
  };
  const handleOfferSelect = (offerId) => {
    const offer = candidateOffers.find(o => o._id === offerId || o.id === offerId);
    if (offer) {
      console.log('Selected offer:', offer);
      setSelectedOffer(offer);
      showSnackbar(`Offer selected: ${offer.offerId || offer._id}`, 'success');
    }
  };

  const handleOfferChange = (e) => {
    handleOfferSelect(e.target.value);
  };

  // Validate current step
  const validateStep = (step) => {
    const errors = {};

    if (step === 0) {
      if (!selectedOffer) {
        errors.offer = 'Please select an offer';
        showSnackbar('Please select an offer to continue', 'warning');
      }
    } else if (step === 2) {
      if (!confirmSubmit) {
        errors.confirmSubmit = 'Please confirm before submitting';
        showSnackbar('Please confirm before submitting', 'warning');
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
      setError('');
      showSnackbar(`Moving to step ${activeStep + 2}: ${steps[activeStep + 1]}`, 'info');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
    showSnackbar(`Moving back to step ${activeStep}: ${steps[activeStep - 1]}`, 'info');
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // In SubmitForApproval.jsx, update the handleSubmitForApproval function:

  const handleSubmitForApproval = async () => {
    if (!validateStep(2)) {
      setError('Please confirm before submitting');
      return;
    }

    const offerId = selectedOffer?._id || selectedOffer?.id;
    if (!offerId) {
      setError('Offer ID is missing');
      showSnackbar('Offer ID is missing', 'error');
      return;
    }

    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      const token = getAuthToken();

      // Construct the API URL: POST {{base_url}}/api/offers/{{offer_id}}/submit-approval
      const apiUrl = `${BASE_URL}/api/offers/${offerId}/submit-approval`;
      console.log('Submitting for approval to:', apiUrl);
      console.log('Request body:', { remarks });

      const response = await axios.post(
        apiUrl,
        { remarks },
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Submit approval response:', response.data);

      if (response.data.success) {
        setResponseData(response.data);
        setSuccess(response.data.message || 'Offer submitted for approval successfully!');
        showSnackbar(response.data.message || 'Offer submitted for approval successfully!', 'success');

        // Prepare updated data for parent component with the new status
        const updatedData = {
          _id: offerId,  // Use _id for consistency
          id: offerId,
          offerId: response.data.data?.offerId || selectedOffer.offerId,
          status: 'pending_approval', // Force the status to pending_approval
          approvalFlowId: response.data.data?.approvalFlowId,
          candidateId: candidateInfo?._id || candidateInfo?.id,
          candidateName: candidateInfo?.name || `${candidateInfo?.firstName || ''} ${candidateInfo?.lastName || ''}`.trim(),
          updatedAt: new Date().toISOString()
        };

        console.log('Sending updated data to parent:', updatedData);

        // Call onComplete with the updated data
        if (onComplete) {
          onComplete(updatedData);
        }

        // Wait a moment to show success message before closing
        setTimeout(() => {
          resetState();
          onClose();
        }, 2000);
      } else {
        showSnackbar('Submission failed: ' + (response.data.message || 'Unknown error'), 'error');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error submitting for approval:', err);

      let errorMessage = 'Failed to submit for approval';
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
        console.error('Error response data:', err.response.data);
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your network connection.';
      } else {
        errorMessage = err.message || 'Failed to submit for approval';
      }

      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
      setLoading(false);
    }
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
      case 'pending_approval': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'generated': return 'secondary';
      case 'sent': return 'primary';
      case 'accepted': return 'success';
      default: return 'default';
    }
  };

  // Get CTC details from selected offer
  const getCtcDetails = () => {
    if (!selectedOffer) return null;

    // Check different possible paths for CTC details
    if (selectedOffer.ctcDetails) {
      return selectedOffer.ctcDetails;
    } else if (selectedOffer.ctc) {
      return selectedOffer.ctc;
    } else if (selectedOffer.compensation) {
      return selectedOffer.compensation;
    }

    return null;
  };

  // Get position from selected offer
  const getPosition = () => {
    if (!selectedOffer) return 'Not Specified';

    if (selectedOffer.position) return selectedOffer.position;
    if (selectedOffer.jobTitle) return selectedOffer.jobTitle;
    if (selectedOffer.designation) return selectedOffer.designation;
    if (selectedOffer.job?.title) return selectedOffer.job.title;

    return 'Not Specified';
  };

  // Get joining date from selected offer
  const getJoiningDate = () => {
    if (!selectedOffer) return null;

    return selectedOffer.joiningDate ||
      selectedOffer.offerDetails?.joiningDate ||
      selectedOffer.expectedJoiningDate;
  };

  // Render success response data
  const renderResponseData = () => {
    if (!responseData) return null;

    const { data, message } = responseData;

    return (
      <Paper sx={{
        p: 2,
        mt: 2,
        bgcolor: '#F0F7FF',
        border: '1px solid #1976D2',
        borderRadius: 1
      }}>
        <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600 }}>
          ✅ Submission Successful
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Offer ID
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {data.offerId}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Status
            </Typography>
            <Chip
              label={data.status}
              color={getStatusColor(data.status)}
              size="small"
              sx={{ fontWeight: 500, mt: 0.5 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="caption" color="textSecondary" display="block">
              Approval Flow ID
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>
              {data.approvalFlowId}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      // Updated Step 0 component for SubmitForApproval.jsx

      // Replace the case 0 in renderStepContent with this:

      case 0:
        return (
          <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
            <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
              Select Offer for Approval
            </Typography>

            {fetchingData ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                {/* Candidate Info in one line */}
                {candidateInfo && (
                  <Box sx={{
                    mb: 2,
                    p: 1.5,
                    bgcolor: '#F0F7FF',
                    borderRadius: 1,
                    border: '1px solid #1976D2',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2
                  }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonIcon fontSize="small" sx={{ color: '#1976D2' }} />
                      <strong>{candidateInfo.name || `${candidateInfo.firstName || ''} ${candidateInfo.lastName || ''}`.trim()}</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#666' }}>|</Typography>

                    <Typography variant="body2" sx={{ color: '#1976D2' }}>
                      {candidateInfo.email}
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#666' }}>|</Typography>

                    <Typography variant="body2">
                      <strong>Position:</strong> {candidateInfo.position || candidateInfo.jobTitle || 'Office Assistant'}
                    </Typography>
                  </Box>
                )}

                {/* Hidden select field - but we'll show a read-only view instead */}
                {candidateOffers.length > 0 ? (
                  <>
                    {/* Hidden select for form value (not visible to user) */}
                    <select
                      style={{ display: 'none' }}
                      value={selectedOffer?._id || selectedOffer?.id || ''}
                      onChange={handleOfferChange}
                    >
                      {candidateOffers.map((offer) => (
                        <option key={offer._id || offer.id} value={offer._id || offer.id}>
                          {offer.offerId || offer._id}
                        </option>
                      ))}
                    </select>

                    {/* Read-only offer selection info */}
                    {/* <Box sx={{ 
                mb: 2, 
                p: 1.5, 
                bgcolor: '#F5F5F5', 
                borderRadius: 1,
                border: '1px solid #E0E0E0'
              }}>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <InfoIcon fontSize="small" sx={{ fontSize: 16 }} />
                  Latest offer automatically selected (read-only)
                </Typography>
                
                <FormControl fullWidth size="small" disabled>
                  <InputLabel>Selected Offer</InputLabel>
                  <Select
                    value={selectedOffer?._id || selectedOffer?.id || ''}
                    label="Selected Offer"
                    disabled
                  >
                    {candidateOffers.map((offer) => (
                      <MenuItem key={offer._id || offer.id} value={offer._id || offer.id}>
                        {offer.offerId || offer._id} (Created: {formatDate(offer.createdAt)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box> */}
                  </>
                ) : (
                  !fetchingData && (
                    <Alert severity="info" sx={{ borderRadius: 1, mb: 2 }}>
                      No initiated offers found for this candidate.
                    </Alert>
                  )
                )}

                {/* Selected Offer Preview - Read Only */}
                {selectedOffer && (
                  <Box sx={{
                    p: 2,
                    bgcolor: '#F8FAFC',
                    borderRadius: 1,
                    border: '1px solid #1976D2',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600 }}>
                      Offer Details
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Offer ID
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedOffer.offerId || selectedOffer._id}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Status
                        </Typography>
                        <Chip
                          label={selectedOffer.status || 'Initiated'}
                          color={getStatusColor(selectedOffer.status)}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            height: 24,
                            '& .MuiChip-label': { px: 1 }
                          }}
                        />
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Total CTC
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="#1976D2">
                          {getCtcDetails() ? formatCurrency(getCtcDetails().totalCtc) : 'N/A'}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Created Date
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(selectedOffer.createdAt || selectedOffer.createdDate)}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Position
                        </Typography>
                        <Typography variant="body2">
                          {getPosition()}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Joining Date
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(getJoiningDate())}
                        </Typography>
                      </Grid>

                      {/* {selectedOffer.applicationId && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Application ID
                    </Typography>
                    <Typography variant="body2">
                      {selectedOffer.applicationId}
                    </Typography>
                  </Grid>
                )} */}
                    </Grid>

                    {/* Show if there are multiple offers */}
                    {candidateOffers.length > 1 && (
                      <Box sx={{ mt: 2, pt: 1, borderTop: '1px dashed #E0E0E0' }}>
                        <Typography variant="caption" color="textSecondary">
                          {candidateOffers.length} offer(s) available. Latest offer selected automatically.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Hidden field to maintain form data */}
                <input
                  type="hidden"
                  name="offerId"
                  value={selectedOffer?._id || selectedOffer?.id || ''}
                />
              </>
            )}
          </Paper>
        );

      case 1:
        const ctcDetails = getCtcDetails();

        return (
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1, fontWeight: 600, fontSize: '0.9rem' }}>
                Annual CTC Breakdown
              </Typography>

              {ctcDetails ? (
                <>
                  {/* Monthly Components Section */}
                  <Typography variant="caption" sx={{ color: '#1976D2', fontWeight: 600, mb: 1, display: 'block' }}>
                    Monthly Components
                  </Typography>
                  <Grid container spacing={4} sx={{ mb: 2 }}>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Basic + DA
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(ctcDetails.basic)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        HRA
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(ctcDetails.hra)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Conveyance
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(ctcDetails.conveyanceAllowance)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Medical
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(ctcDetails.medicalAllowance)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Special
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(ctcDetails.specialAllowance)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                        <Typography variant="body2" fontWeight={600} color="#1976D2">
                          Monthly Gross: {formatCurrency(ctcDetails.gross)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 1 }} />

                  {/* Annual Components Section */}
                  <Typography variant="caption" sx={{ color: '#1976D2', fontWeight: 600, display: 'block' }}>
                    Annual Components
                  </Typography>
                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Bonus
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(ctcDetails.bonus)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Employer PF
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(ctcDetails.employerPf)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Employer ESI
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(ctcDetails.employerEsi || 0)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Gratuity
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(ctcDetails.gratuity)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider />

                  {/* Total CTC Section */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" color="#1976D2">
                      Total CTC (Annual)
                    </Typography>
                    <Typography variant="h6" color="#1976D2" fontWeight={700}>
                      {formatCurrency(ctcDetails.totalCtc)}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Alert severity="info" sx={{ borderRadius: 1 }}>
                  CTC details not available for this offer
                </Alert>
              )}
            </Paper>
          </Stack>
        );

      case 2:
        const ctcDetailsForPreview = getCtcDetails();
        return (
          <Stack spacing={2}>
            {/* Preview Section */}
            {selectedOffer && (
              <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1, border: '1px solid #1976D2' }}>
                <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
                  Submission Preview
                </Typography>

                <Grid container spacing={6}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ fontSize: '0.7rem' }}>
                      Candidate Name
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.9rem' }}>
                      {candidateInfo?.name || `${candidateInfo?.firstName || ''} ${candidateInfo?.lastName || ''}`.trim()}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ fontSize: '0.7rem' }}>
                      Offer ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                      {selectedOffer?.offerId || selectedOffer?._id}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ fontSize: '0.7rem' }}>
                      Total CTC
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="#1976D2" sx={{ fontSize: '0.95rem' }}>
                      {ctcDetailsForPreview ? formatCurrency(ctcDetailsForPreview.totalCtc) : 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ fontSize: '0.7rem' }}>
                      Joining Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                      {formatDate(getJoiningDate())}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ fontSize: '0.7rem' }}>
                      Position
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                      {getPosition()}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ fontSize: '0.7rem' }}>
                      Status
                    </Typography>
                    <Chip
                      label={selectedOffer.status || 'Initiated'}
                      color={getStatusColor(selectedOffer.status)}
                      size="small"
                      sx={{ fontWeight: 500, height: 22, fontSize: '0.75rem' }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Terms & Conditions Card */}
            <Paper sx={{ p: 2.5, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
              {/* Remarks Section */}
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="subtitle2" sx={{ color: '#1976D2', fontWeight: 600, fontSize: '0.9rem' }}>
                  Additional Remarks
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Enter any additional remarks or comments..."
                  value={remarks}
                  onChange={handleRemarksChange}
                  size="small"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      fontSize: '0.85rem',
                      backgroundColor: '#FAFAFA'
                    }
                  }}
                />
              </Box>

              {/* Warning Message */}
              <Box sx={{
                p: 1.5,
                bgcolor: '#FFF8E7',
                borderRadius: 1,
                border: '1px solid #FFB74D',
                mb: 2.5
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <WarningIcon sx={{ color: '#F57C00', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ color: '#F57C00', fontSize: '0.85rem', fontWeight: 600 }}>
                    Important Notice
                  </Typography>
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', ml: 3.5 }}>
                  Once submitted, this offer will be sent to the approver and cannot be modified until reviewed.
                  Please ensure all details are accurate before proceeding.
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 2, fontWeight: 600, fontSize: '0.9rem' }}>
                Terms & Conditions
              </Typography>

              {/* Confirmation List */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" paragraph sx={{ fontSize: '0.85rem', color: '#424242', mb: 1.5 }}>
                  By submitting this offer for approval, you confirm that:
                </Typography>

                <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                  {[
                    'All the CTC components have been calculated correctly as per company policy',
                    'The candidate has been properly interviewed and selected for the position',
                    'The offer details have been verified with HR',
                    'Any special approvals required for this CTC range have been obtained',
                    'The joining date has been confirmed with the candidate and is feasible'
                  ].map((item, index) => (
                    <Typography
                      component="li"
                      variant="body2"
                      key={index}
                      sx={{
                        mb: 0.75,
                        fontSize: '0.8rem',
                        color: '#555',
                        lineHeight: 1.4
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Divider />

              {/* Confirmation Checkbox */}
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                p: 1.5,
                bgcolor: confirmSubmit ? '#F0F7FF' : 'transparent',
                borderRadius: 1,
                transition: 'background-color 0.2s'
              }}>
                <input
                  type="checkbox"
                  id="confirmSubmit"
                  checked={confirmSubmit}
                  onChange={(e) => setConfirmSubmit(e.target.checked)}
                  style={{
                    width: 18,
                    height: 18,
                    cursor: 'pointer',
                    marginTop: 2
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>
                    I confirm that all the above information is accurate
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                    I understand that this action cannot be undone
                  </Typography>
                </Box>
              </Box>
              {stepErrors.confirmSubmit && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 3.5, display: 'block' }}>
                  {stepErrors.confirmSubmit}
                </Typography>
              )}
            </Paper>
          </Stack>
        );
      default:
        return null;
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
            borderRadius: 1.5,
            maxHeight: '95vh'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: '1px solid #E0E0E0',
          py: 0.5,
          px: 2,
          backgroundColor: '#F8FAFC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ color: '#101010' }}
            component="span"
          >
            Submit Offer for Approval
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* Modern Stepper with Gradient Connector */}
        {!responseData && (
          <Box sx={{ px: 2, pt: 1, backgroundColor: '#F8FAFC' }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={<ColorConnector />}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={StepIcon}>
                    <Typography fontWeight={500} fontSize="0.8rem">{label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        <DialogContent sx={{ p: 2, overflow: 'auto', backgroundColor: '#F5F7FA' }}>
          {!responseData ? (
            renderStepContent(activeStep)
          ) : (
            <Box sx={{ py: 1 }}>
              {renderResponseData()}
            </Box>
          )}

          {/* Error Messages */}
          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{
          px: 2,
          py: 1.5,
          borderTop: '1px solid #E0E0E0',
          backgroundColor: '#F8FAFC',
          justifyContent: 'space-between'
        }}>
          {!responseData ? (
            <>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                size="small"
                startIcon={<NavigateBeforeIcon />}
                sx={{ color: '#666' }}
              >
                Back
              </Button>

              <Box>
                <Button
                  onClick={handleClose}
                  disabled={loading}
                  size="small"
                  sx={{ mr: 1, color: '#666' }}
                >
                  Cancel
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmitForApproval}
                    disabled={loading || !confirmSubmit || !selectedOffer}
                    size="small"
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                    sx={{
                      backgroundColor: '#1976D2',
                      '&:hover': { backgroundColor: '#1565C0' },
                      minWidth: 160
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit for Approval'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={loading || (activeStep === 0 && !selectedOffer)}
                    size="small"
                    endIcon={<NavigateNextIcon />}
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
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <Button
                variant="contained"
                onClick={handleClose}
                size="small"
                sx={{
                  backgroundColor: '#1976D2',
                  '&:hover': { backgroundColor: '#1565C0' }
                }}
              >
                Close
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            borderRadius: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SubmitForApproval;