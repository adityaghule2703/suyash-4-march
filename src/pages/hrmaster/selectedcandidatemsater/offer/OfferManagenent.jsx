import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
  CircularProgress,
  Alert,
  Avatar,
  Button
} from '@mui/material';
import {
  Assignment as InitiateIcon,
  Send as SendIcon,
  CheckCircle as ApproveIcon,
  Description as GenerateIcon,
  Email as EmailIcon,
  Visibility as ViewIcon,
  Check as AcceptIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Import all offer management components
import InitiateOffer from './InitiateOffer';
import SubmitForApproval from './SubmitForApproval';
import ApproveOffer from './ApproveOffer';
import GenerateOfferLetter from './GenerateOfferLetter';
import SendOfferLetter from './SendOfferLetter';
import ViewOffer from './ViewOffer';
import AcceptOffer from './AcceptOffer';
import BASE_URL from '../../../../config/Config';

const OfferManagement = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiDetails, setApiDetails] = useState({
    endpoint: `${BASE_URL}/api/candidates?status=selected`,
    lastAttempt: null
  });

  // State for dialog visibility
  const [dialogState, setDialogState] = useState({
    initiateOffer: { open: false, candidate: null },
    submitForApproval: { open: false, candidate: null },
    approveOffer: { open: false, candidate: null },
    generateOffer: { open: false, candidate: null },
    sendOffer: { open: false, candidate: null },
    // viewOffer: { open: false, candidate: null },
    acceptOffer: { open: false, candidate: null }
  });

  // Get auth token from localStorage or your auth context
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  };

  // Fetch selected candidates on component mount
  useEffect(() => {
    fetchSelectedCandidates();
  }, []);

  const fetchSelectedCandidates = async () => {
    setLoading(true);
    setError(null);
    setApiDetails(prev => ({
      ...prev,
      lastAttempt: new Date().toLocaleString()
    }));

    try {
      const token = getAuthToken();
      const apiUrl = `${BASE_URL}/api/candidates?status=selected`;
      console.log('Fetching from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'omit'
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error('Response not OK. Status:', response.status, 'Body:', text);

        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Invalid content type. Expected JSON but got:', contentType);
        console.error('Response body (first 200 chars):', text.substring(0, 200));
        throw new Error('Server returned non-JSON response. Please check API endpoint.');
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        // Transform the data to include required fields for offer management
        const transformedData = result.data.map(candidate => ({
          id: candidate._id,
          candidateId: candidate.candidateId,
          name: `${candidate.firstName} ${candidate.lastName}`,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          phone: candidate.phone,
          position: candidate.latestApplication?.jobId?.title || 'Not Assigned',
          jobId: candidate.latestApplication?.jobId || null,
          department: 'To be assigned',
          experience: formatExperience(candidate.experience),
          status: getOfferStatus(candidate.latestApplication?.status),
          applicationId: candidate.latestApplication?._id,
          applicationStatus: candidate.latestApplication?.status,
          education: candidate.education,
          skills: candidate.skills || [],
          address: candidate.address,
          dateOfBirth: candidate.dateOfBirth,
          gender: candidate.gender,
          offerId: candidate.latestApplication?.offerId, // Add this to track offer ID
          offerDetails: {
            salary: null,
            joiningDate: null,
            offerLetter: null
          }
        }));
        setSelectedCandidates(transformedData);
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch candidates');
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format experience
  const formatExperience = (experience) => {
    if (!experience || experience.length === 0) return 'Fresher';

    const totalExperience = experience.reduce((total, exp) => {
      if (exp.current) {
        const startDate = new Date(exp.fromDate);
        const currentDate = new Date();
        const years = currentDate.getFullYear() - startDate.getFullYear();
        return total + years;
      } else if (exp.toDate) {
        const startDate = new Date(exp.fromDate);
        const endDate = new Date(exp.toDate);
        const years = endDate.getFullYear() - startDate.getFullYear();
        return total + years;
      }
      return total;
    }, 0);

    return `${totalExperience} ${totalExperience === 1 ? 'year' : 'years'}`;
  };

  

  // Color constants
  const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
  const TEXT_COLOR_MAIN = '#0f172a';

  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      'Initiated': 'info',
      'Submitted': 'warning',
      'Approved': 'success',
      'Generated': 'primary',
      'Sent': 'secondary',
      'Viewed': 'default',
      'Accepted': 'success',
      'Rejected': 'error',
      'Pending': 'default'
    };
    return colors[status] || 'default';
  };

  // Action handlers
  const handleOpenDialog = (action, candidate) => {
    setDialogState(prev => ({
      ...prev,
      [action]: { open: true, candidate }
    }));
  };

  const handleCloseDialog = (action) => {
    setDialogState(prev => ({
      ...prev,
      [action]: { open: false, candidate: null }
    }));
  };

// // Update the handleActionComplete function
// const handleActionComplete = async (action, updatedData) => {
//   console.log('Action completed:', action, updatedData);
  
//   // Update candidate status based on action
//   setSelectedCandidates(prevCandidates =>
//     prevCandidates.map(candidate => {
//       if (candidate.id === updatedData.id || candidate.id === updatedData.candidateId) {
//         // Determine new status based on action
//         let newStatus = candidate.status;
//         let newApplicationStatus = candidate.applicationStatus;
        
//         switch (action) {
//           case 'initiateOffer':
//             newStatus = 'Initiated';
//             newApplicationStatus = 'initiated';
//             break;
//           case 'submitForApproval':
//             newStatus = 'Submitted';
//             newApplicationStatus = 'pending_approval'; // Change from 'submitted' to 'pending_approval'
//             break;
//           case 'approveOffer':
//             newStatus = 'Approved';
//             newApplicationStatus = 'approved'; // Make sure this is set correctly
//             break;
//           case 'rejectOffer': // If you have a reject action
//             newStatus = 'Rejected';
//             newApplicationStatus = 'rejected';
//             break;
//           case 'generateOffer':
//             newStatus = 'Generated';
//             newApplicationStatus = 'generated';
//             break;
//           case 'sendOffer':
//             newStatus = 'Sent';
//             newApplicationStatus = 'sent';
//             break;
//           case 'acceptOffer':
//             newStatus = 'Accepted';
//             newApplicationStatus = 'accepted';
//             break;
//           default:
//             break;
//         }
        
//         console.log(`Updating candidate ${candidate.id} status from ${candidate.applicationStatus} to ${newApplicationStatus}`);
        
//         return { 
//           ...candidate, 
//           status: newStatus,
//           applicationStatus: newApplicationStatus,
//           offerId: updatedData.offerId || candidate.offerId // Store offer ID if returned
//         };
//       }
//       return candidate;
//     })
//   );

//   handleCloseDialog(action);
  
//   // Optionally refresh the data from server to ensure consistency
//    fetchSelectedCandidates();
// };

// // Update the status mapping to include 'approved'
// const getOfferStatus = (applicationStatus) => {
//   const statusMap = {
//     'selected': 'Initiated',
//     'initiated': 'Initiated',
//     'pending_approval': 'Submitted', // Changed from 'Submitted' to map correctly
//     'submitted': 'Submitted', // Keep for backward compatibility
//     'accepted': 'Approved',
//     'approved': 'Approved',
//     'rejected': 'Rejected',
//     'generated': 'Generated',
//     'sent': 'Sent',
//     'accepted': 'Accepted',
//     'declined': 'Declined',
//     'expired': 'Expired',
//     'pending': 'Pending'
//   };
  
//   // Log the mapping for debugging
//   console.log(`Mapping status: ${applicationStatus} -> ${statusMap[applicationStatus] || 'Pending'}`);
  
//   return statusMap[applicationStatus] || 'Pending';
// };
// // Update the action status map in isActionEnabled
// const isActionEnabled = (action, candidate) => {
//   const status = candidate.status;
//   const applicationStatus = candidate.applicationStatus;
  
//   // Define allowed statuses for each action using the exact enum values
//   const actionStatusMap = {
//     initiateOffer: ['Pending', 'Rejected', 'selected', null, undefined],
//     submitForApproval: ['Initiated', 'initiated'],
//     approveOffer: ['Submitted', 'pending_approval', 'submitted'], // Add all possible pending states
//     generateOffer: ['Approved', 'approved'],
//     sendOffer: ['Generated', 'generated'],
//     viewOffer: ['Sent', 'Viewed', 'Accepted', 'Generated', 'Approved', 'Submitted', 'Initiated', 
//                 'sent', 'viewed', 'accepted', 'generated', 'approved', 'submitted', 'initiated'],
//     acceptOffer: ['Sent', 'Viewed', 'sent', 'viewed']
//   };

//   // Check if candidate's status matches any allowed status for the action
//   const statusCheck = actionStatusMap[action]?.some(s => 
//     status === s || applicationStatus === s
//   ) || false;

//   // Log for debugging
//   console.log(`Action ${action} for candidate ${candidate.id}:`, {
//     status,
//     applicationStatus,
//     allowed: actionStatusMap[action],
//     enabled: statusCheck
//   });

//   // Additional checks for specific actions
//   if (action === 'generateOffer') {
//     // Generate offer requires the candidate to have an offerId
//     return statusCheck && !!candidate.offerId;
//   }

//   return statusCheck;
// };


// Update the getOfferStatus function to handle all possible status values
const getOfferStatus = (applicationStatus) => {
  const statusMap = {
    'selected': 'Initiated',
    'initiated': 'Initiated',
    'pending_approval': 'Submitted', // Changed from 'Submitted' to 'pending_approval' mapping
    'submitted': 'Submitted', // Keep for backward compatibility
    'accepted': 'Approved', // API returns 'accepted' for approved offers
    'approved': 'Approved',
    'rejected': 'Rejected',
    'generated': 'Generated',
    'sent': 'Sent',
    'accepted_by_candidate': 'Accepted', // If this is used for candidate acceptance
    'accepted': 'Accepted', // If same status used for candidate acceptance
    'declined': 'Declined',
    'expired': 'Expired',
    'pending': 'Pending'
  };
  
  // Log the mapping for debugging
  console.log(`Mapping status: ${applicationStatus} -> ${statusMap[applicationStatus] || 'Pending'}`);
  
  return statusMap[applicationStatus] || 'Pending';
};

// Update the handleActionComplete function
const handleActionComplete = async (action, updatedData) => {
  console.log('Action completed:', action, updatedData);
  
  // Update candidate status based on action
  setSelectedCandidates(prevCandidates =>
    prevCandidates.map(candidate => {
      if (candidate.id === updatedData.id || candidate.id === updatedData.candidateId) {
        // Determine new status based on action and the actual API response
        let newStatus = candidate.status;
        let newApplicationStatus = candidate.applicationStatus;
        
        // Use the actual status from the API if available in updatedData
        if (updatedData.status) {
          newApplicationStatus = updatedData.status;
        } else if (updatedData.applicationStatus) {
          newApplicationStatus = updatedData.applicationStatus;
        } else {
          // Fallback to action-based mapping if no status provided
          switch (action) {
            case 'initiateOffer':
              newApplicationStatus = 'initiated';
              break;
            case 'submitForApproval':
              newApplicationStatus = 'pending_approval'; // Changed from 'submitted' to 'pending_approval'
              break;
            case 'approveOffer':
              newApplicationStatus = updatedData.approvalStatus === 'completed' ? 'accepted' : 'pending_approval';
              break;
            case 'rejectOffer':
              newApplicationStatus = 'rejected';
              break;
            case 'generateOffer':
              newApplicationStatus = 'generated';
              break;
            case 'sendOffer':
              newApplicationStatus = 'sent';
              break;
            case 'acceptOffer':
              newApplicationStatus = 'accepted_by_candidate';
              break;
            default:
              break;
          }
        }
        
        // Map the application status to display status
        newStatus = getOfferStatus(newApplicationStatus);
        
        console.log(`Updating candidate ${candidate.id} status from ${candidate.applicationStatus} to ${newApplicationStatus} (display: ${newStatus})`);
        
        return { 
          ...candidate, 
          status: newStatus,
          applicationStatus: newApplicationStatus,
          offerId: updatedData.offerId || candidate.offerId,
          approvalStatus: updatedData.approvalStatus // Store approval status if needed
        };
      }
      return candidate;
    })
  );

  handleCloseDialog(action);
};

// Update the isActionEnabled function to handle the correct statuses
const isActionEnabled = (action, candidate) => {
  const status = candidate.status;
  const applicationStatus = candidate.applicationStatus;
  
  // Define allowed statuses for each action using the exact enum values from the API
  const actionStatusMap = {
    initiateOffer: ['Pending', 'Rejected', 'selected', null, undefined],
    submitForApproval: ['Initiated', 'initiated'],
    approveOffer: ['Submitted', 'pending_approval', 'submitted'], // Add 'pending_approval'
    generateOffer: ['Approved', 'approved', 'accepted'], // Add 'accepted' since API returns that
    sendOffer: ['Generated', 'generated'],
    viewOffer: ['Sent', 'Viewed', 'Accepted', 'Generated', 'Approved', 'Submitted', 'Initiated', 
                'sent', 'viewed', 'accepted', 'generated', 'approved', 'submitted', 'initiated'],
    acceptOffer: ['Sent', 'Viewed', 'sent', 'viewed']
  };

  // Check if candidate's status matches any allowed status for the action
  const statusCheck = actionStatusMap[action]?.some(s => 
    status === s || applicationStatus === s
  ) || false;

  // Log for debugging
  console.log(`Action ${action} for candidate ${candidate.id}:`, {
    status,
    applicationStatus,
    allowed: actionStatusMap[action],
    enabled: statusCheck
  });

  return statusCheck;
};

  // Get candidate initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, mt: -8}}>
      <Box>
        <Typography
          variant="h5"
          component="h1"
          fontWeight="600"
          sx={{
            color: TEXT_COLOR_MAIN,
            background: HEADER_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block',
          }}
        >
          Offer Management
        </Typography>
        <Typography variant="body2" color="#64748B" sx={{ mt: 0.5, mb: 2 }}>
          View and manage offers for candidates
        </Typography>
        {/* <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchSelectedCandidates}
          sx={{ mb: 2 }}
        >
          Refresh
        </Button> */}
      </Box>

      {error ? (
        <Box sx={{ mb: 3 }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={fetchSelectedCandidates}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      ) : selectedCandidates.length === 0 ? (
        <Alert severity="info">No selected candidates found</Alert>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="offer management table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Candidate</strong></TableCell>
                <TableCell><strong>Contact</strong></TableCell>
                <TableCell><strong>Position</strong></TableCell>
                <TableCell><strong>Experience</strong></TableCell>
                <TableCell><strong>Skills</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedCandidates.map((candidate) => (
                <TableRow key={candidate.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {getInitials(candidate.firstName, candidate.lastName) || <PersonIcon />}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {candidate.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {candidate.candidateId}
                        </Typography>
                        {candidate.offerId && (
                          <Typography variant="caption" color="primary" display="block">
                            Offer: {candidate.offerId}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{candidate.email}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {candidate.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{candidate.position}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{candidate.experience}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {candidate.skills?.slice(0, 3).map((skill, index) => (
                        <Chip key={index} label={skill} size="small" variant="outlined" />
                      ))}
                      {candidate.skills?.length > 3 && (
                        <Chip label={`+${candidate.skills.length - 3}`} size="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={candidate.status}
                      color={getStatusColor(candidate.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      {/* Initiate Offer */}
                      <Tooltip title="Initiate Offer">
                        <span>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog('initiateOffer', candidate)}
                            disabled={!isActionEnabled('initiateOffer', candidate)}
                          >
                            <InitiateIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      {/* Submit for Approval */}
                      <Tooltip title="Submit for Approval">
                        <span>
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleOpenDialog('submitForApproval', candidate)}
                            disabled={!isActionEnabled('submitForApproval', candidate)}
                          >
                            <SendIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      {/* Approve Offer */}
                      <Tooltip title="Approve Offer">
                        <span>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleOpenDialog('approveOffer', candidate)}
                            disabled={!isActionEnabled('approveOffer', candidate)}
                          >
                            <ApproveIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      {/* Generate Offer Letter */}
                      <Tooltip title="Generate Offer Letter">
                        <span>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleOpenDialog('generateOffer', candidate)}
                            disabled={!isActionEnabled('generateOffer', candidate)}
                            sx={{
                              opacity: isActionEnabled('generateOffer', candidate) ? 1 : 0.5,
                              '&:hover': {
                                backgroundColor: isActionEnabled('generateOffer', candidate) ? 'rgba(156, 39, 176, 0.04)' : 'transparent'
                              }
                            }}
                          >
                            <GenerateIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      {/* Send to Candidate */}
                      <Tooltip title="Send to Candidate">
                        <span>
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenDialog('sendOffer', candidate)}
                            disabled={!isActionEnabled('sendOffer', candidate)}
                          >
                            <EmailIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      {/* View Offer */}
                      {/* <Tooltip title="View Offer">
                        <span>
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => handleOpenDialog('viewOffer', candidate)}
                            disabled={!isActionEnabled('viewOffer', candidate)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip> */}

                      {/* Accept Offer */}
                      <Tooltip title="Accept Offer">
                        <span>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleOpenDialog('acceptOffer', candidate)}
                            disabled={!isActionEnabled('acceptOffer', candidate)}
                          >
                            <AcceptIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Action Dialogs */}
      <InitiateOffer
        open={dialogState.initiateOffer.open}
        onClose={() => handleCloseDialog('initiateOffer')}
        candidate={dialogState.initiateOffer.candidate}
        onComplete={(updatedData) => handleActionComplete('initiateOffer', updatedData)}
      />

      <SubmitForApproval
        open={dialogState.submitForApproval.open}
        onClose={() => handleCloseDialog('submitForApproval')}
        candidate={dialogState.submitForApproval.candidate}
        onComplete={(updatedData) => handleActionComplete('submitForApproval', updatedData)}
      />

      <ApproveOffer
        open={dialogState.approveOffer.open}
        onClose={() => handleCloseDialog('approveOffer')}
        candidate={dialogState.approveOffer.candidate}
        onComplete={(updatedData) => handleActionComplete('approveOffer', updatedData)}
      />

      <GenerateOfferLetter
        open={dialogState.generateOffer.open}
        onClose={() => handleCloseDialog('generateOffer')}
        candidate={dialogState.generateOffer.candidate}
        onComplete={(updatedData) => handleActionComplete('generateOffer', updatedData)}
      />

      <SendOfferLetter
        open={dialogState.sendOffer.open}
        onClose={() => handleCloseDialog('sendOffer')}
        candidate={dialogState.sendOffer.candidate}
        onComplete={(updatedData) => handleActionComplete('sendOffer', updatedData)}
      />

      {/* <ViewOffer
        open={dialogState.viewOffer.open}
        onClose={() => handleCloseDialog('viewOffer')}
        candidate={dialogState.viewOffer.candidate}
      /> */}

      <AcceptOffer
        open={dialogState.acceptOffer.open}
        onClose={() => handleCloseDialog('acceptOffer')}
        candidate={dialogState.acceptOffer.candidate}
        onComplete={(updatedData) => handleActionComplete('acceptOffer', updatedData)}
      />
    </Box>
  );
};

export default OfferManagement;