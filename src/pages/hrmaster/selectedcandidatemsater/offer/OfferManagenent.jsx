// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Chip,
//   Box,
//   Typography,
//   Tooltip,
//   CircularProgress,
//   Alert,
//   Avatar,
//   Button,
//   Stack,
//   TextField,
//   InputAdornment,
//   TablePagination,
//   Snackbar,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Checkbox,
//   alpha
// } from '@mui/material';
// import {
//   Assignment as InitiateIcon,
//   Send as SendIcon,
//   CheckCircle as ApproveIcon,
//   Description as GenerateIcon,
//   Email as EmailIcon,
//   Visibility as ViewIcon,
//   Check as AcceptIcon,
//   Person as PersonIcon,
//   Refresh as RefreshIcon,
//   Search as SearchIcon,
//   FilterList as FilterIcon,
//   Clear as ClearIcon,
//   ArrowUpward as ArrowUpwardIcon,
//   MoreVert as MoreVertIcon,
//   Delete as DeleteIcon
// } from '@mui/icons-material';

// // Import all offer management components
// import InitiateOffer from './InitiateOffer';
// import SubmitForApproval from './SubmitForApproval';
// import ApproveOffer from './ApproveOffer';
// import GenerateOfferLetter from './GenerateOfferLetter';
// import SendOfferLetter from './SendOfferLetter';
// import ViewOffer from './ViewOffer';
// import AcceptOffer from './AcceptOffer';
// import BASE_URL from '../../../../config/Config';

// // Color constants
// const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
// const STRIPE_COLOR_ODD = '#FFFFFF';
// const STRIPE_COLOR_EVEN = '#f8fafc';
// const HOVER_COLOR = '#f1f5f9';
// const PRIMARY_BLUE = '#00B4D8';
// const TEXT_COLOR_HEADER = '#FFFFFF';
// const TEXT_COLOR_MAIN = '#0f172a';

// // Status color mapping
// const getStatusColor = (status) => {
//   const colors = {
//     'Initiated': 'info',
//     'Submitted': 'warning',
//     'Approved': 'success',
//     'Generated': 'secondary',
//     'Sent': 'primary',
//     'Viewed': 'default',
//     'Accepted': 'success',
//     'Rejected': 'error',
//     'Pending': 'default'
//   };
//   return colors[status] || 'default';
// };

// // Status chip styling
// const getStatusStyle = (status) => {
//   const styles = {
//     'Initiated': { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
//     'Submitted': { bg: '#fff3e0', color: '#ed6c02', border: '#ffb74d' },
//     'Approved': { bg: '#dcfce7', color: '#166534', border: '#86efac' },
//     'Generated': { bg: '#f3e8ff', color: '#7e22ce', border: '#d8b4fe' },
//     'Sent': { bg: '#e0f2fe', color: '#0284c7', border: '#bae6fd' },
//     'Viewed': { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
//     'Accepted': { bg: '#dcfce7', color: '#166534', border: '#86efac' },
//     'Rejected': { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
//     'Pending': { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' }
//   };
//   return styles[status] || styles['Pending'];
// };

// // Status mapping function - maps API status to display status
// const getOfferStatus = (applicationStatus) => {
//   const statusMap = {
//     // Selected candidates (initial state)
//     'selected': 'Initiated',

//     // Initiate Offer
//     'initiated': 'Initiated',

//     // Submit for Approval
//     'pending_approval': 'Submitted',
//     'submitted': 'Submitted',

//     // Approve Offer
//     'accepted': 'Approved',
//     'approved': 'Approved',

//     // Reject Offer
//     'rejected': 'Rejected',

//     // Generate Offer Letter
//     'generated': 'Generated',

//     // Send Offer Letter
//     'sent': 'Sent',

//     // Candidate Acceptance
//     'accepted_by_candidate': 'Accepted',

//     // Default
//     'pending': 'Pending',
//     '': 'Pending',
//     null: 'Pending',
//     undefined: 'Pending'
//   };

//   const mappedStatus = statusMap[applicationStatus] || 'Pending';
//   console.log(` Mapping status: ${applicationStatus} -> ${mappedStatus}`);
//   return mappedStatus;
// };

// const OfferManagement = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [filteredCandidates, setFilteredCandidates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // Selection state
//   const [selected, setSelected] = useState([]);

//   // Sort state
//   const [sortConfig, setSortConfig] = useState({
//     field: 'name',
//     direction: 'asc'
//   });

//   // Filter state
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [showFilters, setShowFilters] = useState(false);

//   // Action menu state
//   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
//   const [selectedCandidateForAction, setSelectedCandidateForAction] = useState(null);

//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [actionInProgress, setActionInProgress] = useState(false);

//   // Track completed actions in frontend (no backend update needed)
//   const [completedActions, setCompletedActions] = useState({});

//   // State for dialog visibility
//   const [dialogState, setDialogState] = useState({
//     initiateOffer: { open: false, candidate: null },
//     submitForApproval: { open: false, candidate: null },
//     approveOffer: { open: false, candidate: null },
//     generateOffer: { open: false, candidate: null },
//     sendOffer: { open: false, candidate: null },
//     viewOffer: { open: false, candidate: null },
//     acceptOffer: { open: false, candidate: null }
//   });

//   // Snackbar state
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   // Check if action is enabled based on current status OR completed actions
//   const isActionEnabled = (action, candidate) => {
//     if (!candidate) return false;

//     const status = candidate.status;
//     const applicationStatus = candidate.applicationStatus;

//     // Check if this action was already completed in the current session
//     const actionCompleted = completedActions[`${candidate.id}_${action}`];

//     console.log(`🔍 Checking action ${action} for ${candidate.name}:`, {
//       status,
//       applicationStatus,
//       actionCompleted
//     });

//     // Define allowed statuses for each action
//     const actionStatusMap = {
//       initiateOffer: ['Pending', 'Rejected', 'selected', null, undefined],
//       submitForApproval: ['Initiated', 'initiated'],
//       approveOffer: ['Submitted', 'pending_approval', 'submitted'],
//       generateOffer: ['Approved', 'approved', 'accepted'],
//       sendOffer: ['Generated', 'generated'],
//       viewOffer: ['Sent', 'Viewed', 'Accepted', 'Generated', 'Approved', 'Submitted', 'Initiated',
//         'sent', 'viewed', 'accepted', 'generated', 'approved', 'submitted', 'initiated'],
//       acceptOffer: ['Sent', 'Viewed', 'sent', 'viewed']
//     };

//     // For sendOffer action, also check if generateOffer was completed in frontend
//     if (action === 'sendOffer') {
//       const generateCompleted = completedActions[`${candidate.id}_generateOffer`];
//       if (generateCompleted) {
//         console.log(`🔍 Generate was completed in frontend, enabling sendOffer`);
//         return true;
//       }
//       // Also enable if status is Generated
//       if (status === 'Generated' || applicationStatus === 'generated') {
//         return true;
//       }
//     }

//     // For acceptOffer action, also check if sendOffer was completed in frontend
//     if (action === 'acceptOffer') {
//       const sendCompleted = completedActions[`${candidate.id}_sendOffer`];
//       if (sendCompleted) {
//         console.log(`🔍 Send was completed in frontend, enabling acceptOffer`);
//         return true;
//       }
//       // Also enable if status is Sent
//       if (status === 'Sent' || applicationStatus === 'sent') {
//         return true;
//       }
//     }

//     // Check if candidate's status matches any allowed status for the action
//     const statusCheck = actionStatusMap[action]?.some(s =>
//       status === s || applicationStatus === s
//     ) || false;

//     console.log(`🔍 Action ${action} is ${statusCheck ? 'enabled' : 'disabled'}`);

//     return statusCheck;
//   };

//   // Get auth token
//   const getAuthToken = () => {
//     return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
//   };

//   // Fetch selected candidates
//   const fetchSelectedCandidates = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = getAuthToken();
//       const apiUrl = `${BASE_URL}/api/candidates?status=selected`;
//       console.log('Fetching from:', apiUrl);

//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': token ? `Bearer ${token}` : '',
//         },
//         credentials: 'omit'
//       });

//       console.log('Response status:', response.status);

//       if (!response.ok) {
//         const text = await response.text();
//         console.error('Response not OK. Status:', response.status, 'Body:', text);

//         if (response.status === 401) {
//           throw new Error('Authentication failed. Please log in again.');
//         } else {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//       }

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error('Invalid content type. Expected JSON but got:', contentType);
//         console.error('Response body (first 200 chars):', text.substring(0, 200));
//         throw new Error('Server returned non-JSON response. Please check API endpoint.');
//       }

//       const result = await response.json();
//       console.log('API Response:', result);

//       if (result.success) {
//         // Transform the data to include required fields for offer management
//         const transformedData = await Promise.all(result.data.map(async (candidate) => {
//           // Fetch all offers for this candidate to find the latest one
//           let latestOffer = null;
//           let offerStatus = 'selected';
//           let offerId = null;

//           try {
//             // Fetch offers for this specific candidate
//             const offersUrl = `${BASE_URL}/api/offers?candidateId=${candidate._id}`;
//             const offersResponse = await fetch(offersUrl, {
//               headers: {
//                 'Authorization': token ? `Bearer ${token}` : '',
//                 'Content-Type': 'application/json'
//               }
//             });

//             if (offersResponse.ok) {
//               const offersData = await offersResponse.json();
//               console.log(`Offers for candidate ${candidate.firstName}:`, offersData);

//               if (offersData.success && offersData.data) {
//                 let offers = [];

//                 // Extract offers array based on response structure
//                 if (offersData.data.offers) {
//                   offers = offersData.data.offers;
//                 } else if (Array.isArray(offersData.data)) {
//                   offers = offersData.data;
//                 }

//                 // If there are offers, find the latest one
//                 if (offers.length > 0) {
//                   // Sort by creation date (newest first)
//                   const sortedOffers = offers.sort((a, b) => {
//                     const dateA = new Date(a.createdAt || a.createdDate || 0);
//                     const dateB = new Date(b.createdAt || b.createdDate || 0);
//                     return dateB - dateA;
//                   });

//                   // Get the latest offer
//                   latestOffer = sortedOffers[0];
//                   console.log(`Latest offer for ${candidate.firstName}:`, latestOffer);

//                   // Determine status from latest offer
//                   if (latestOffer.status) {
//                     offerStatus = latestOffer.status;
//                   } else if (latestOffer.offerStatus) {
//                     offerStatus = latestOffer.offerStatus;
//                   } else if (latestOffer.applicationStatus) {
//                     offerStatus = latestOffer.applicationStatus;
//                   }

//                   offerId = latestOffer.offerId || latestOffer._id;
//                 }
//               }
//             }
//           } catch (offerError) {
//             console.error('Error fetching offers for candidate:', candidate._id, offerError);
//             // Continue with default status if offers fetch fails
//           }

//           // Return transformed candidate data with latest offer info
//           return {
//             id: candidate._id,
//             candidateId: candidate.candidateId,
//             name: `${candidate.firstName} ${candidate.lastName}`,
//             firstName: candidate.firstName,
//             lastName: candidate.lastName,
//             email: candidate.email,
//             phone: candidate.phone,
//             position: candidate.latestApplication?.jobId?.title || 'Not Assigned',
//             jobId: candidate.latestApplication?.jobId || null,
//             department: 'To be assigned',
//             experience: formatExperience(candidate.experience),
//             status: getOfferStatus(offerStatus), // Display status from latest offer
//             applicationStatus: offerStatus, // Raw API status from latest offer
//             applicationId: candidate.latestApplication?._id,
//             education: candidate.education,
//             skills: candidate.skills || [],
//             address: candidate.address,
//             dateOfBirth: candidate.dateOfBirth,
//             gender: candidate.gender,
//             offerId: offerId,
//             offerDetails: latestOffer ? {
//               salary: latestOffer.ctcDetails?.totalCtc || null,
//               joiningDate: latestOffer.joiningDate || null,
//               offerLetter: latestOffer.offerLetter || null,
//               ctcDetails: latestOffer.ctcDetails || null
//             } : {
//               salary: null,
//               joiningDate: null,
//               offerLetter: null
//             },
//             latestOffer: latestOffer // Store the complete latest offer data
//           };
//         }));

//         console.log('Transformed data with latest offers:', transformedData);
//         setCandidates(transformedData);
//         setFilteredCandidates(transformedData);
//         setSelected([]);
//         setError(null);
//       } else {
//         setError(result.message || 'Failed to fetch candidates');
//       }
//     } catch (err) {
//       console.error('Error fetching candidates:', err);
//       setError(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Add this temporarily to debug status changes
//   useEffect(() => {
//     console.log('📊 Current candidates state:', candidates.map(c => ({
//       name: c.name,
//       status: c.status,
//       appStatus: c.applicationStatus
//     })));
//   }, [candidates]);

//   useEffect(() => {
//     return () => {
//       // Cleanup any pending requests if needed
//       setCandidates([]);
//       setFilteredCandidates([]);
//     };
//   }, []);

//   // Initial fetch
//   useEffect(() => {
//     fetchSelectedCandidates();
//   }, [fetchSelectedCandidates]);

//   // Apply filters when dependencies change
//   useEffect(() => {
//     applyFilters();
//   }, [candidates, searchTerm, statusFilter, sortConfig]);

//   const applyFilters = () => {
//     let filtered = [...candidates];

//     // Apply search
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(candidate =>
//         candidate.name.toLowerCase().includes(term) ||
//         candidate.email.toLowerCase().includes(term) ||
//         candidate.candidateId.toLowerCase().includes(term) ||
//         candidate.position.toLowerCase().includes(term)
//       );
//     }

//     // Apply status filter
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(candidate => candidate.status === statusFilter);
//     }

//     // Apply sorting
//     if (sortConfig.field) {
//       filtered.sort((a, b) => {
//         let aValue = a[sortConfig.field];
//         let bValue = b[sortConfig.field];

//         if (sortConfig.field === 'name') {
//           aValue = a.name;
//           bValue = b.name;
//         }

//         if (sortConfig.direction === 'asc') {
//           return aValue > bValue ? 1 : -1;
//         } else {
//           return aValue < bValue ? 1 : -1;
//         }
//       });
//     }

//     setFilteredCandidates(filtered);
//     setPage(0);
//     setSelected([]);
//   };

//   // Helper function to format experience
//   const formatExperience = (experience) => {
//     if (!experience || experience.length === 0) return 'Fresher';

//     const totalExperience = experience.reduce((total, exp) => {
//       if (exp.current) {
//         const startDate = new Date(exp.fromDate);
//         const currentDate = new Date();
//         const years = currentDate.getFullYear() - startDate.getFullYear();
//         return total + years;
//       } else if (exp.toDate) {
//         const startDate = new Date(exp.fromDate);
//         const endDate = new Date(exp.toDate);
//         const years = endDate.getFullYear() - startDate.getFullYear();
//         return total + years;
//       }
//       return total;
//     }, 0);

//     return `${totalExperience} ${totalExperience === 1 ? 'year' : 'years'}`;
//   };

//   // Handle search
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setSelected([]);
//   };

//   const handleClearSearch = () => {
//     setSearchTerm('');
//     setSelected([]);
//   };

//   // Handle sort
//   const handleSort = (field) => {
//     const direction = sortConfig.field === field && sortConfig.direction === "asc" ? "desc" : "asc";
//     setSortConfig({ field, direction });
//   };

//   // Handle select all
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(paginatedCandidates.map(c => c.id));
//     } else {
//       setSelected([]);
//     }
//   };

//   // Handle single selection
//   const handleSelect = (id) => {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, id);
//     } else {
//       newSelected = selected.filter(item => item !== id);
//     }

//     setSelected(newSelected);
//   };

//   // Handle bulk delete (if needed)
//   const handleBulkDelete = () => {
//     if (selected.length === 0) return;
//     showNotification(`Bulk action for ${selected.length} items - API implementation required`, 'warning');
//   };

//   // Handle action menu
//   const handleActionMenuOpen = (event, candidate) => {
//     setActionMenuAnchor(event.currentTarget);
//     setSelectedCandidateForAction(candidate);
//   };

//   const handleActionMenuClose = () => {
//     setActionMenuAnchor(null);
//     setSelectedCandidateForAction(null);
//   };

//   // Dialog handlers
//   const handleOpenDialog = (action, candidate) => {
//     setDialogState(prev => ({
//       ...prev,
//       [action]: { open: true, candidate }
//     }));
//     handleActionMenuClose();
//   };

//   const handleCloseDialog = (action) => {
//     setDialogState(prev => ({
//       ...prev,
//       [action]: { open: false, candidate: null }
//     }));
//   };

//   // Show notification
//   const showNotification = (message, severity = 'success') => {
//     setSnackbar({
//       open: true,
//       message,
//       severity
//     });
//   };

//   // Handle action completion - UPDATE STATUS AND TRACK COMPLETED ACTIONS
//   const handleActionComplete = async (action, updatedData) => {
//     try {
//       console.log(`🟢 Action ${action} completed with data:`, updatedData);

//       setActionInProgress(true);

//       // Show success message
//       const actionName = action.replace(/([A-Z])/g, ' $1').toLowerCase();
//       showNotification(`Offer ${actionName} completed successfully`, 'success');

//       // Close the dialog
//       handleCloseDialog(action);

//       // Find the candidate ID to update
//       const candidateIdToUpdate = updatedData?.candidateId ||
//         updatedData?.id ||
//         (selectedCandidateForAction?.id);

//       // Determine the new status based on the action
//       let newDisplayStatus = '';
//       let newAppStatus = '';

//       switch (action) {
//         case 'initiateOffer':
//           newDisplayStatus = 'Initiated';
//           newAppStatus = 'initiated';
//           break;
//         case 'submitForApproval':
//           newDisplayStatus = 'Submitted';
//           newAppStatus = 'pending_approval';
//           break;
//         case 'approveOffer':
//           newDisplayStatus = 'Approved';
//           newAppStatus = 'approved';
//           break;
//         case 'generateOffer':
//           newDisplayStatus = 'Generated';
//           newAppStatus = 'generated';
//           break;
//         case 'sendOffer':
//           newDisplayStatus = 'Sent';
//           newAppStatus = 'sent';
//           break;
//         case 'acceptOffer':
//           newDisplayStatus = 'Accepted';
//           newAppStatus = 'accepted_by_candidate';
//           break;
//         default:
//           newDisplayStatus = updatedData?.status || 'Pending';
//           newAppStatus = updatedData?.applicationStatus || 'pending';
//       }

//       console.log('🔄 Updating candidate ID:', candidateIdToUpdate, 'to status:', newDisplayStatus);

//       // Update candidates state with the new status
//       setCandidates(prevCandidates => {
//         const updated = prevCandidates.map(candidate => {
//           const matches = candidate.id === candidateIdToUpdate ||
//             candidate.candidateId === candidateIdToUpdate ||
//             candidate._id === candidateIdToUpdate;

//           if (matches) {
//             console.log(`🔄 Updating candidate ${candidate.name} from ${candidate.status} to ${newDisplayStatus}`);

//             return {
//               ...candidate,
//               status: newDisplayStatus,
//               applicationStatus: newAppStatus,
//               offerId: updatedData?.offerId || candidate.offerId,
//               approvalFlowId: updatedData?.approvalFlowId,
//               updatedAt: new Date().toISOString(),
//               offerDetails: {
//                 ...candidate.offerDetails,
//                 ...(updatedData?.offerDetails || {})
//               }
//             };
//           }
//           return candidate;
//         });

//         return updated;
//       });

//       // Also update filtered candidates
//       setFilteredCandidates(prev => {
//         const updated = prev.map(candidate => {
//           const matches = candidate.id === candidateIdToUpdate ||
//             candidate.candidateId === candidateIdToUpdate ||
//             candidate._id === candidateIdToUpdate;

//           if (matches) {
//             return {
//               ...candidate,
//               status: newDisplayStatus,
//               applicationStatus: newAppStatus,
//               offerId: updatedData?.offerId || candidate.offerId,
//               approvalFlowId: updatedData?.approvalFlowId,
//               updatedAt: new Date().toISOString(),
//               offerDetails: {
//                 ...candidate.offerDetails,
//                 ...(updatedData?.offerDetails || {})
//               }
//             };
//           }
//           return candidate;
//         });

//         return updated;
//       });

//       // TRACK COMPLETED ACTIONS IN FRONTEND (no backend update needed)
//       if (candidateIdToUpdate) {
//         setCompletedActions(prev => ({
//           ...prev,
//           [`${candidateIdToUpdate}_${action}`]: true,
//           [`${candidateIdToUpdate}_lastAction`]: action,
//           [`${candidateIdToUpdate}_lastUpdate`]: new Date().toISOString()
//         }));
//       }

//       // Force a re-render
//       setRefreshTrigger(prev => prev + 1);

//       setActionInProgress(false);

//     } catch (error) {
//       console.error('🔴 Error in handleActionComplete:', error);
//       showNotification('Action completed but failed to refresh data', 'warning');
//       setActionInProgress(false);
//     }
//   };

//   // Handle refresh
//   const handleRefresh = () => {
//     fetchSelectedCandidates();
//     showNotification('Data refreshed', 'info');
//   };

//   // Handle clear filters
//   const handleClearFilters = () => {
//     setSearchTerm('');
//     setStatusFilter('all');
//     setSortConfig({ field: 'name', direction: 'asc' });
//     setSelected([]);
//   };

//   // Get candidate initials for avatar
//   const getInitials = (firstName, lastName) => {
//     return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
//   };

//   // Paginated candidates
//   const paginatedCandidates = filteredCandidates.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   // Check if filters are active
//   const isFilterActive = searchTerm || statusFilter !== 'all';

//   if (loading && candidates.length === 0) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3, mt: -8 }}>
//       {/* Header */}


//       {/* Action Bar */}
//       <Paper sx={{
//         p: 2,
//         borderRadius: 2,
//         bgcolor: '#FFFFFF',
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//         border: '1px solid #e2e8f0',
//         borderBottomLeftRadius: 0,
//         borderBottomRightRadius: 0,
//         borderBottom: 'none',
//         mb: 0
//       }}>
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
//           {/* Search */}
//           <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
//             <TextField
//               placeholder="Search by name, email, or ID..."
//               size="small"
//               value={searchTerm}
//               onChange={handleSearch}
//               sx={{
//                 width: { xs: '100%', sm: 320 },
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 1.5,
//                   '&:hover fieldset': {
//                     borderColor: PRIMARY_BLUE,
//                   },
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ color: '#64748B' }} />
//                   </InputAdornment>
//                 ),
//                 endAdornment: searchTerm && (
//                   <InputAdornment position="end">
//                     <IconButton size="small" onClick={handleClearSearch} edge="end">
//                       <ClearIcon fontSize="small" sx={{ color: '#64748B' }} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//                 sx: {
//                   height: 40,
//                   bgcolor: '#f8fafc',
//                   '& input': {
//                     padding: '8px 12px',
//                     fontSize: '0.875rem'
//                   }
//                 }
//               }}
//               disabled={loading}
//             />
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* Error Alert */}
//       {error && (
//         <Box sx={{ mb: 3 }}>
//           <Alert
//             severity="error"
//             action={
//               <Button color="inherit" size="small" onClick={fetchSelectedCandidates}>
//                 Retry
//               </Button>
//             }
//             sx={{ borderRadius: 2 }}
//           >
//             {error}
//           </Alert>
//         </Box>
//       )}

//       {/* Table */}
//       {filteredCandidates.length === 0 && !loading ? (
//         <Alert severity="info" sx={{ borderRadius: 2 }}>
//           No candidates found
//         </Alert>
//       ) : (
//         <Paper sx={{
//           width: '100%',
//           borderRadius: 2,
//           overflow: 'hidden',
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//           border: '1px solid #e2e8f0'
//         }}>
//           <TableContainer component={Paper} key={refreshTrigger}>
//             <Table sx={{ minWidth: 650 }} aria-label="offer management table">
//               <TableHead>
//                 <TableRow sx={{
//                   background: HEADER_GRADIENT,
//                   '& .MuiTableCell-root': {
//                     borderBottom: 'none',
//                     color: TEXT_COLOR_HEADER,
//                     fontWeight: 700,
//                     fontSize: '0.875rem',
//                     py: 2
//                   }
//                 }}>
//                   <TableCell padding="checkbox" sx={{ width: 60 }}>
//                     <Checkbox
//                       indeterminate={selected.length > 0 && selected.length < paginatedCandidates.length}
//                       checked={paginatedCandidates.length > 0 && selected.length === paginatedCandidates.length}
//                       onChange={handleSelectAll}
//                       sx={{
//                         color: TEXT_COLOR_HEADER,
//                         '&.Mui-checked': { color: TEXT_COLOR_HEADER },
//                         '&.MuiCheckbox-indeterminate': { color: TEXT_COLOR_HEADER }
//                       }}
//                       disabled={loading || paginatedCandidates.length === 0}
//                     />
//                   </TableCell>
//                   <TableCell
//                     sx={{ cursor: 'pointer' }}
//                     onClick={() => handleSort('name')}
//                   >
//                     <Stack direction="row" alignItems="center" spacing={0.5}>
//                       Candidate
//                       <ArrowUpwardIcon
//                         sx={{
//                           fontSize: 14,
//                           color: TEXT_COLOR_HEADER,
//                           opacity: sortConfig.field === 'name' ? 1 : 0.5,
//                           transform: sortConfig.direction === "desc" && sortConfig.field === 'name' ? 'rotate(180deg)' : 'none'
//                         }}
//                       />
//                     </Stack>
//                   </TableCell>
//                   <TableCell>Contact</TableCell>
//                   <TableCell
//                     sx={{ cursor: 'pointer' }}
//                     onClick={() => handleSort('position')}
//                   >
//                     <Stack direction="row" alignItems="center" spacing={0.5}>
//                       Position
//                       <ArrowUpwardIcon
//                         sx={{
//                           fontSize: 14,
//                           color: TEXT_COLOR_HEADER,
//                           opacity: sortConfig.field === 'position' ? 1 : 0.5,
//                           transform: sortConfig.direction === "desc" && sortConfig.field === 'position' ? 'rotate(180deg)' : 'none'
//                         }}
//                       />
//                     </Stack>
//                   </TableCell>
//                   <TableCell>Experience</TableCell>
//                   <TableCell>Skills</TableCell>
//                   <TableCell
//                     sx={{ cursor: 'pointer' }}
//                     onClick={() => handleSort('status')}
//                   >
//                     <Stack direction="row" alignItems="center" spacing={0.5}>
//                       Status
//                       <ArrowUpwardIcon
//                         sx={{
//                           fontSize: 14,
//                           color: TEXT_COLOR_HEADER,
//                           opacity: sortConfig.field === 'status' ? 1 : 0.5,
//                           transform: sortConfig.direction === "desc" && sortConfig.field === 'status' ? 'rotate(180deg)' : 'none'
//                         }}
//                       />
//                     </Stack>
//                   </TableCell>
//                   <TableCell align="center">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {loading && (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
//                       <CircularProgress size={40} />
//                       <Typography variant="body2" color="#64748B" sx={{ mt: 2 }}>
//                         Loading candidates...
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 {!loading && paginatedCandidates.map((candidate, index) => {
//                   const isSelected = selected.includes(candidate.id);
//                   const isOddRow = index % 2 === 0;
//                   const statusStyle = getStatusStyle(candidate.status);
//                   const isActionMenuOpen = Boolean(actionMenuAnchor) &&
//                     selectedCandidateForAction?.id === candidate.id;

//                   return (
//                     <TableRow
//                       key={candidate.id}
//                       hover
//                       selected={isSelected}
//                       sx={{
//                         bgcolor: isOddRow ? STRIPE_COLOR_ODD : STRIPE_COLOR_EVEN,
//                         '&:hover': {
//                           bgcolor: HOVER_COLOR
//                         },
//                         '&.Mui-selected': {
//                           bgcolor: alpha(PRIMARY_BLUE, 0.08),
//                           '&:hover': {
//                             bgcolor: alpha(PRIMARY_BLUE, 0.12)
//                           }
//                         }
//                       }}
//                     >
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={isSelected}
//                           onChange={() => handleSelect(candidate.id)}
//                           sx={{
//                             color: PRIMARY_BLUE,
//                             '&.Mui-checked': { color: PRIMARY_BLUE }
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <Avatar sx={{ mr: 2, bgcolor: PRIMARY_BLUE, width: 40, height: 40 }}>
//                             {getInitials(candidate.firstName, candidate.lastName) || <PersonIcon />}
//                           </Avatar>
//                           <Box>
//                             <Typography variant="body2" fontWeight="bold" color={TEXT_COLOR_MAIN}>
//                               {candidate.name}
//                             </Typography>
//                             <Typography variant="caption" color="#64748B">
//                               ID: {candidate.candidateId}
//                             </Typography>
//                             {candidate.offerId && (
//                               <Typography variant="caption" color={PRIMARY_BLUE} display="block">
//                                 Offer: {candidate.offerId}
//                               </Typography>
//                             )}
//                           </Box>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" color={TEXT_COLOR_MAIN}>{candidate.email}</Typography>
//                         <Typography variant="caption" color="#64748B">
//                           {candidate.phone}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" color={TEXT_COLOR_MAIN}>{candidate.position}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" color={TEXT_COLOR_MAIN}>{candidate.experience}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                           {candidate.skills?.slice(0, 3).map((skill, index) => (
//                             <Chip key={index} label={skill} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
//                           ))}
//                           {candidate.skills?.length > 3 && (
//                             <Chip label={`+${candidate.skills.length - 3}`} size="small" sx={{ fontSize: '0.7rem' }} />
//                           )}
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={candidate.applicationStatus}
//                           size="small"
//                           sx={{
//                             backgroundColor: statusStyle.bg,
//                             color: statusStyle.color,
//                             border: `1px solid ${statusStyle.border}`,
//                             fontWeight: 500
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell align="center">
//                         <IconButton
//                           onClick={(e) => handleActionMenuOpen(e, candidate)}
//                           sx={{
//                             color: '#64748b',
//                             '&:hover': {
//                               bgcolor: alpha(PRIMARY_BLUE, 0.1)
//                             }
//                           }}
//                         >
//                           <MoreVertIcon />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Pagination */}
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25, 50]}
//             component="div"
//             count={filteredCandidates.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={(e, newPage) => {
//               setPage(newPage);
//               setSelected([]);
//             }}
//             onRowsPerPageChange={(e) => {
//               setRowsPerPage(parseInt(e.target.value, 10));
//               setPage(0);
//               setSelected([]);
//             }}
//             sx={{
//               borderTop: '1px solid #e2e8f0',
//               '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
//                 fontSize: '0.875rem',
//                 color: '#64748B'
//               },
//               '& .MuiTablePagination-actions button': {
//                 color: PRIMARY_BLUE,
//               }
//             }}
//           />
//         </Paper>
//       )}

//       {/* Action Menu */}
//       <Menu
//         anchorEl={actionMenuAnchor}
//         open={Boolean(actionMenuAnchor)}
//         onClose={handleActionMenuClose}
//         PaperProps={{
//           elevation: 3,
//           sx: {
//             mt: 1,
//             minWidth: 200,
//             borderRadius: 2,
//             border: '1px solid #e2e8f0'
//           }
//         }}
//       >
//         {/* Initiate Offer */}
//         <MenuItem
//           onClick={() => selectedCandidateForAction && handleOpenDialog('initiateOffer', selectedCandidateForAction)}
//           disabled={!isActionEnabled('initiateOffer', selectedCandidateForAction)}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: PRIMARY_BLUE, minWidth: 36 }}>
//             <InitiateIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Initiate Offer</Typography>
//           </ListItemText>
//         </MenuItem>

//         {/* Submit for Approval */}
//         <MenuItem
//           onClick={() => selectedCandidateForAction && handleOpenDialog('submitForApproval', selectedCandidateForAction)}
//           disabled={!isActionEnabled('submitForApproval', selectedCandidateForAction)}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: '#ed6c02', minWidth: 36 }}>
//             <SendIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Submit for Approval</Typography>
//           </ListItemText>
//         </MenuItem>

//         {/* Approve Offer */}
//         <MenuItem
//           onClick={() => selectedCandidateForAction && handleOpenDialog('approveOffer', selectedCandidateForAction)}
//           disabled={!isActionEnabled('approveOffer', selectedCandidateForAction)}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: '#2e7d32', minWidth: 36 }}>
//             <ApproveIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Approve Offer</Typography>
//           </ListItemText>
//         </MenuItem>

//         <Divider sx={{ my: 0.5 }} />

//         {/* Generate Offer Letter */}
//         <MenuItem
//           onClick={() => selectedCandidateForAction && handleOpenDialog('generateOffer', selectedCandidateForAction)}
//           disabled={!isActionEnabled('generateOffer', selectedCandidateForAction)}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: '#7e22ce', minWidth: 36 }}>
//             <GenerateIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Generate Offer Letter</Typography>
//           </ListItemText>
//         </MenuItem>

//         {/* Send to Candidate */}
//         <MenuItem
//           onClick={() => selectedCandidateForAction && handleOpenDialog('sendOffer', selectedCandidateForAction)}
//           disabled={!isActionEnabled('sendOffer', selectedCandidateForAction)}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: '#0284c7', minWidth: 36 }}>
//             <EmailIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Send to Candidate</Typography>
//           </ListItemText>
//         </MenuItem>

//         {/* Accept Offer */}
//         <MenuItem
//           onClick={() => selectedCandidateForAction && handleOpenDialog('acceptOffer', selectedCandidateForAction)}
//           disabled={!isActionEnabled('acceptOffer', selectedCandidateForAction)}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: '#2e7d32', minWidth: 36 }}>
//             <AcceptIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>Accept Offer</Typography>
//           </ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* Action Dialogs */}
//       <InitiateOffer
//         open={dialogState.initiateOffer.open}
//         onClose={() => handleCloseDialog('initiateOffer')}
//         candidate={dialogState.initiateOffer.candidate}
//         onComplete={(updatedData) => handleActionComplete('initiateOffer', updatedData)}
//       />

//       <SubmitForApproval
//         open={dialogState.submitForApproval.open}
//         onClose={() => handleCloseDialog('submitForApproval')}
//         candidateData={dialogState.submitForApproval.candidate}
//         onComplete={(updatedData) => handleActionComplete('submitForApproval', updatedData)}
//         selectedCandidateForAction={selectedCandidateForAction}
//       />

//       <ApproveOffer
//         open={dialogState.approveOffer.open}
//         onClose={() => handleCloseDialog('approveOffer')}
//         candidate={dialogState.approveOffer.candidate}
//         onComplete={(updatedData) => handleActionComplete('approveOffer', updatedData)}
//       />

//       <GenerateOfferLetter
//         open={dialogState.generateOffer.open}
//         onClose={() => handleCloseDialog('generateOffer')}
//         candidate={dialogState.generateOffer.candidate}
//         onComplete={(updatedData) => handleActionComplete('generateOffer', updatedData)}
//       />

//       <SendOfferLetter
//         open={dialogState.sendOffer.open}
//         onClose={() => handleCloseDialog('sendOffer')}
//         candidate={dialogState.sendOffer.candidate}
//         onComplete={(updatedData) => handleActionComplete('sendOffer', updatedData)}
//       />

//       <AcceptOffer
//         open={dialogState.acceptOffer.open}
//         onClose={() => handleCloseDialog('acceptOffer')}
//         candidate={dialogState.acceptOffer.candidate}
//         onComplete={(updatedData) => handleActionComplete('acceptOffer', updatedData)}
//       />

//       {/* Snackbar Notification */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{
//             width: '100%',
//             borderRadius: 1.5,
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default OfferManagement;

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Typography,
  Snackbar,
  TablePagination,
  Checkbox,
  Stack,
  alpha,
  Alert,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  TableSortLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Description as GenerateIcon,
  Email as EmailIcon,
  Check as AcceptIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';

// Import all offer management components
import InitiateOffer from './InitiateOffer';
import SubmitForApproval from './SubmitForApproval';
import ApproveOffer from './ApproveOffer';
import GenerateOfferLetter from './GenerateOfferLetter';
import SendOfferLetter from './SendOfferLetter';
import ViewOffer from './ViewOffer';
import AcceptOffer from './AcceptOffer';

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

// Status color mapping
const STATUS_STYLES = {
  'Initiated': { bg: COLORS.status.info, color: COLORS.primaryDark, icon: <AssignmentIcon sx={{ fontSize: '0.7rem' }} /> },
  'Submitted': { bg: COLORS.status.warning, color: '#92400E', icon: <SendIcon sx={{ fontSize: '0.7rem' }} /> },
  'Approved': { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> },
  'Generated': { bg: '#F3E8FF', color: '#7E22CE', icon: <GenerateIcon sx={{ fontSize: '0.7rem' }} /> },
  'Sent': { bg: COLORS.status.info, color: '#0369A1', icon: <EmailIcon sx={{ fontSize: '0.7rem' }} /> },
  'Viewed': { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <VisibilityIcon sx={{ fontSize: '0.7rem' }} /> },
  'Accepted': { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <AcceptIcon sx={{ fontSize: '0.7rem' }} /> },
  'Rejected': { bg: COLORS.status.error, color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} /> },
  'Pending': { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> }
};

const getStatusStyle = (status) => {
  return STATUS_STYLES[status] || STATUS_STYLES['Pending'];
};

const getOfferStatus = (applicationStatus) => {
  const statusMap = {
    'selected': 'Initiated',
    'initiated': 'Initiated',
    'pending_approval': 'Submitted',
    'submitted': 'Submitted',
    'accepted': 'Approved',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'generated': 'Generated',
    'sent': 'Sent',
    'viewed': 'Viewed',
    'accepted_by_candidate': 'Accepted',
    'pending': 'Pending',
    '': 'Pending',
    null: 'Pending',
    undefined: 'Pending'
  };
  return statusMap[applicationStatus] || 'Pending';
};

const OfferManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedCandidateForAction, setSelectedCandidateForAction] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [completedActions, setCompletedActions] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [dialogState, setDialogState] = useState({
    initiateOffer: { open: false, candidate: null },
    submitForApproval: { open: false, candidate: null },
    approveOffer: { open: false, candidate: null },
    generateOffer: { open: false, candidate: null },
    sendOffer: { open: false, candidate: null },
    viewOffer: { open: false, candidate: null },
    acceptOffer: { open: false, candidate: null }
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchSelectedCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/api/candidates?status=selected`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const candidatesData = response.data.data || [];
        
        const transformedData = await Promise.all(candidatesData.map(async (candidate) => {
          let latestOffer = null;
          let offerStatus = 'selected';
          let offerId = null;

          try {
            const offersResponse = await axios.get(`${BASE_URL}/api/offers?candidateId=${candidate._id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });

            if (offersResponse.data.success && offersResponse.data.data) {
              let offers = [];
              if (offersResponse.data.data.offers) {
                offers = offersResponse.data.data.offers;
              } else if (Array.isArray(offersResponse.data.data)) {
                offers = offersResponse.data.data;
              }

              if (offers.length > 0) {
                const sortedOffers = offers.sort((a, b) => {
                  const dateA = new Date(a.createdAt || a.createdDate || 0);
                  const dateB = new Date(b.createdAt || b.createdDate || 0);
                  return dateB - dateA;
                });
                latestOffer = sortedOffers[0];
                offerStatus = latestOffer.status || latestOffer.offerStatus || latestOffer.applicationStatus || 'selected';
                offerId = latestOffer.offerId || latestOffer._id;
              }
            }
          } catch (offerError) {
            console.error('Error fetching offers:', offerError);
          }

          return {
            id: candidate._id,
            candidateId: candidate.candidateId,
            name: `${candidate.firstName} ${candidate.lastName}`,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone,
            position: candidate.latestApplication?.jobId?.title || 'Not Assigned',
            jobId: candidate.latestApplication?.jobId || null,
            experience: candidate.experience?.length || 0,
            skills: candidate.skills || [],
            status: getOfferStatus(offerStatus),
            applicationStatus: offerStatus,
            applicationId: candidate.latestApplication?._id,
            offerId: offerId,
            offerDetails: latestOffer ? {
              salary: latestOffer.ctcDetails?.totalCtc || null,
              joiningDate: latestOffer.joiningDate || null,
              ctcDetails: latestOffer.ctcDetails || null
            } : {}
          };
        }));

        setCandidates(transformedData);
        setFilteredCandidates(transformedData);
        setSelected([]);
      } else {
        setError(response.data.message || 'Failed to fetch candidates');
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError(err.response?.data?.message || 'Failed to fetch candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSelectedCandidates();
  }, [fetchSelectedCandidates]);

  useEffect(() => {
    let filtered = [...candidates];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(term) ||
        candidate.email.toLowerCase().includes(term) ||
        candidate.candidateId.toLowerCase().includes(term) ||
        candidate.position.toLowerCase().includes(term)
      );
    }
    
    if (orderBy) {
      filtered.sort((a, b) => {
        let aValue = a[orderBy];
        let bValue = b[orderBy];
        if (orderBy === 'name') {
          aValue = a.name;
          bValue = b.name;
        }
        if (order === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    
    setFilteredCandidates(filtered);
    setPage(0);
  }, [candidates, searchTerm, orderBy, order]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(paginatedCandidates.map(c => c.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter(item => item !== id);
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    fetchSelectedCandidates();
    showNotification('Data refreshed', 'info');
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setOrderBy('name');
    setOrder('asc');
    setSelected([]);
  };

  const handleActionMenuOpen = (event, candidate) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedCandidateForAction(candidate);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedCandidateForAction(null);
  };

  const handleOpenDialog = (action, candidate) => {
    setDialogState(prev => ({
      ...prev,
      [action]: { open: true, candidate }
    }));
    handleActionMenuClose();
  };

  const handleCloseDialog = (action) => {
    setDialogState(prev => ({
      ...prev,
      [action]: { open: false, candidate: null }
    }));
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleActionComplete = async (action, updatedData) => {
    try {
      const actionName = action.replace(/([A-Z])/g, ' $1').toLowerCase();
      showNotification(`Offer ${actionName} completed successfully`, 'success');
      handleCloseDialog(action);

      const candidateIdToUpdate = updatedData?.candidateId || updatedData?.id || selectedCandidateForAction?.id;
      
      let newDisplayStatus = '';
      let newAppStatus = '';

      switch (action) {
        case 'initiateOffer':
          newDisplayStatus = 'Initiated';
          newAppStatus = 'initiated';
          break;
        case 'submitForApproval':
          newDisplayStatus = 'Submitted';
          newAppStatus = 'pending_approval';
          break;
        case 'approveOffer':
          newDisplayStatus = 'Approved';
          newAppStatus = 'approved';
          break;
        case 'generateOffer':
          newDisplayStatus = 'Generated';
          newAppStatus = 'generated';
          break;
        case 'sendOffer':
          newDisplayStatus = 'Sent';
          newAppStatus = 'sent';
          break;
        case 'acceptOffer':
          newDisplayStatus = 'Accepted';
          newAppStatus = 'accepted_by_candidate';
          break;
        default:
          newDisplayStatus = updatedData?.status || 'Pending';
          newAppStatus = updatedData?.applicationStatus || 'pending';
      }

      setCandidates(prev => prev.map(candidate => {
        if (candidate.id === candidateIdToUpdate) {
          return {
            ...candidate,
            status: newDisplayStatus,
            applicationStatus: newAppStatus,
            offerId: updatedData?.offerId || candidate.offerId,
            offerDetails: { ...candidate.offerDetails, ...(updatedData?.offerDetails || {}) }
          };
        }
        return candidate;
      }));

      setCompletedActions(prev => ({
        ...prev,
        [`${candidateIdToUpdate}_${action}`]: true
      }));
      
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error in handleActionComplete:', error);
      showNotification('Action completed but failed to refresh data', 'warning');
    }
  };

  const isActionEnabled = (action, candidate) => {
    if (!candidate) return false;
    const status = candidate.status;
    const appStatus = candidate.applicationStatus;
    const actionCompleted = completedActions[`${candidate.id}_${action}`];

    const actionStatusMap = {
      initiateOffer: ['Pending', 'selected', null],
      submitForApproval: ['Initiated'],
      approveOffer: ['Submitted'],
      generateOffer: ['Approved'],
      sendOffer: ['Generated'],
      viewOffer: ['Sent', 'Viewed', 'Accepted', 'Generated', 'Approved', 'Submitted', 'Initiated'],
      acceptOffer: ['Sent', 'Viewed']
    };

    if (action === 'sendOffer') {
      const generateCompleted = completedActions[`${candidate.id}_generateOffer`];
      if (generateCompleted) return true;
      if (status === 'Generated' || appStatus === 'generated') return true;
    }

    if (action === 'acceptOffer') {
      const sendCompleted = completedActions[`${candidate.id}_sendOffer`];
      if (sendCompleted) return true;
      if (status === 'Sent' || appStatus === 'sent') return true;
    }

    return actionStatusMap[action]?.some(s => status === s || appStatus === s) || false;
  };

  const getAvatarInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'C';
  };

  const paginatedCandidates = filteredCandidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isFilterActive = searchTerm;

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary,
      '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
    }
  };

  return (
    <Box sx={{ p: -3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2 }}>
        {/* <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontSize: '1.25rem',
            fontWeight: 700,
            color: COLORS.text.primary,
            mb: 0.5
          }}
        >
          Offer Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and track offer letters for selected candidates
        </Typography> */}
      </Box>

      {/* Action Bar */}
      <Paper sx={{ 
        p: 1.5, 
        mb: 2.5, 
        borderRadius: 2,
        bgcolor: COLORS.background.white,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by name, email, or ID..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 280 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch} edge="end">
                      <CloseIcon fontSize="small" sx={{ color: COLORS.text.tertiary }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { 
                  height: 36,
                  bgcolor: COLORS.background.light,
                  '& input': {
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: COLORS.text.primary
                  }
                }
              }}
              disabled={loading}
            />

            {isFilterActive && (
              <Button
                variant="text"
                startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleClearFilters}
                sx={{ 
                  height: 36,
                  borderRadius: 1.5,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  color: COLORS.text.secondary
                }}
              >
                Clear Filters
              </Button>
            )}

            {/* <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: COLORS.text.secondary,
                  '&:hover': { bgcolor: `${COLORS.primary}20` }
                }}
              >
                <RefreshIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip> */}
          </Stack>

          <Stack direction="row" spacing={1.5}>
            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => showNotification('Bulk action requires API implementation', 'warning')}
                sx={{ 
                  height: 36,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderColor: '#fee2e2',
                  color: '#991b1b',
                  '&:hover': { borderColor: '#fecaca', bgcolor: '#fee2e2' }
                }}
              >
                Delete ({selected.length})
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2.5, borderRadius: 1.5, fontSize: '0.75rem' }}
          action={
            <Button color="inherit" size="small" onClick={fetchSelectedCandidates}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Candidates Table */}
      <Paper sx={{ 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ 
                bgcolor: COLORS.background.tableHeader,
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                  color: COLORS.text.light,
                  py: 1.5
                }
              }}>
                <TableCell padding="checkbox" sx={{ width: 40 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedCandidates.length}
                    checked={paginatedCandidates.length > 0 && selected.length === paginatedCandidates.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: COLORS.text.light,
                      '&.Mui-checked': { color: COLORS.text.light },
                      '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
                      '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                    }}
                    disabled={loading || paginatedCandidates.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                    sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
                  >
                    Candidate
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Contact
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  <TableSortLabel
                    active={orderBy === 'position'}
                    direction={orderBy === 'position' ? order : 'asc'}
                    onClick={() => handleRequestSort('position')}
                    sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
                  >
                    Position
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Skills
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                    sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading candidates...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PersonIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {isFilterActive ? 'No candidates match your filters' : 'No candidates available'}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {isFilterActive ? 'Try adjusting your search terms' : 'No selected candidates found'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCandidates.map((candidate, index) => {
                  const isSelected = selected.includes(candidate.id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedCandidateForAction?.id === candidate.id;
                  const statusStyle = getStatusStyle(candidate.status);
                  const avatarColor = COLORS.primary;

                  return (
                    <TableRow
                      key={candidate.id}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': { bgcolor: COLORS.background.hover },
                        '&.Mui-selected': {
                          bgcolor: `${COLORS.primary}10`,
                          '&:hover': { bgcolor: `${COLORS.primary}20` }
                        },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ width: 40 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(candidate.id)}
                          sx={{
                            color: COLORS.primary,
                            '&.Mui-checked': { color: COLORS.primary },
                            '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 40, height: 40, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getAvatarInitials(candidate.firstName, candidate.lastName)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {candidate.name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              ID: {candidate.candidateId}
                            </Typography>
                            {candidate.offerId && (
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.primary }}>
                                Offer: {candidate.offerId}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {candidate.email}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {candidate.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {candidate.position}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {candidate.skills?.slice(0, 2).map((skill, idx) => (
                            <Chip
                              key={idx}
                              label={skill}
                              size="small"
                              sx={{
                                bgcolor: COLORS.primaryLight,
                                color: COLORS.primaryDark,
                                fontSize: '0.6rem',
                                height: 20
                              }}
                            />
                          ))}
                          {candidate.skills?.length > 2 && (
                            <Chip
                              label={`+${candidate.skills.length - 2}`}
                              size="small"
                              sx={{
                                bgcolor: COLORS.chips.inactive,
                                color: COLORS.text.secondary,
                                fontSize: '0.6rem',
                                height: 20
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={statusStyle.icon}
                          label={candidate.status}
                          size="small"
                          sx={{
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 500,
                            fontSize: '0.65rem',
                            height: 24,
                            '& .MuiChip-icon': { fontSize: '0.7rem', color: statusStyle.color }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionMenuOpen(e, candidate)}
                          sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}
                        >
                          <MoreVertIcon sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCandidates.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.7rem',
              color: COLORS.text.secondary
            },
            '& .MuiTablePagination-select': { fontSize: '0.7rem' },
            '& .MuiTablePagination-actions button': { color: COLORS.primary }
          }}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <MenuItem onClick={() => selectedCandidateForAction && handleOpenDialog('initiateOffer', selectedCandidateForAction)} disabled={!isActionEnabled('initiateOffer', selectedCandidateForAction)} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}><AssignmentIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Initiate Offer</Typography></ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedCandidateForAction && handleOpenDialog('submitForApproval', selectedCandidateForAction)} disabled={!isActionEnabled('submitForApproval', selectedCandidateForAction)} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#ed6c02', minWidth: 36 }}><SendIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Submit for Approval</Typography></ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedCandidateForAction && handleOpenDialog('approveOffer', selectedCandidateForAction)} disabled={!isActionEnabled('approveOffer', selectedCandidateForAction)} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#2e7d32', minWidth: 36 }}><CheckCircleIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Approve Offer</Typography></ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        <MenuItem onClick={() => selectedCandidateForAction && handleOpenDialog('generateOffer', selectedCandidateForAction)} disabled={!isActionEnabled('generateOffer', selectedCandidateForAction)} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#7e22ce', minWidth: 36 }}><GenerateIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Generate Offer Letter</Typography></ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedCandidateForAction && handleOpenDialog('sendOffer', selectedCandidateForAction)} disabled={!isActionEnabled('sendOffer', selectedCandidateForAction)} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#0284c7', minWidth: 36 }}><EmailIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Send to Candidate</Typography></ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedCandidateForAction && handleOpenDialog('acceptOffer', selectedCandidateForAction)} disabled={!isActionEnabled('acceptOffer', selectedCandidateForAction)} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#2e7d32', minWidth: 36 }}><AcceptIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Accept Offer</Typography></ListItemText>
        </MenuItem>
      </Menu>

      {/* Action Dialogs */}
      <InitiateOffer open={dialogState.initiateOffer.open} onClose={() => handleCloseDialog('initiateOffer')} candidate={dialogState.initiateOffer.candidate} onComplete={(data) => handleActionComplete('initiateOffer', data)} />
      <SubmitForApproval open={dialogState.submitForApproval.open} onClose={() => handleCloseDialog('submitForApproval')} candidateData={dialogState.submitForApproval.candidate} onComplete={(data) => handleActionComplete('submitForApproval', data)} />
      <ApproveOffer open={dialogState.approveOffer.open} onClose={() => handleCloseDialog('approveOffer')} candidate={dialogState.approveOffer.candidate} onComplete={(data) => handleActionComplete('approveOffer', data)} />
      <GenerateOfferLetter open={dialogState.generateOffer.open} onClose={() => handleCloseDialog('generateOffer')} candidate={dialogState.generateOffer.candidate} onComplete={(data) => handleActionComplete('generateOffer', data)} />
      <SendOfferLetter open={dialogState.sendOffer.open} onClose={() => handleCloseDialog('sendOffer')} candidate={dialogState.sendOffer.candidate} onComplete={(data) => handleActionComplete('sendOffer', data)} />
      <AcceptOffer open={dialogState.acceptOffer.open} onClose={() => handleCloseDialog('acceptOffer')} candidate={dialogState.acceptOffer.candidate} onComplete={(data) => handleActionComplete('acceptOffer', data)} />

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 1.5,
            fontSize: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '& .MuiAlert-icon': { fontSize: '1.25rem' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OfferManagement;