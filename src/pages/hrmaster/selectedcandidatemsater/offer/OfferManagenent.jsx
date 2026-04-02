// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Button,
//   TextField,
//   InputAdornment,
//   Tooltip,
//   Typography,
//   Snackbar,
//   TablePagination,
//   Checkbox,
//   Stack,
//   alpha,
//   Alert,
//   Chip,
//   Avatar,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   CircularProgress,
//   TableSortLabel
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Visibility as VisibilityIcon,
//   Edit as EditIcon,
//   MoreVert as MoreVertIcon,
//   Close as CloseIcon,
//   Refresh as RefreshIcon,
//   Assignment as AssignmentIcon,
//   Person as PersonIcon,
//   Work as WorkIcon,
//   Send as SendIcon,
//   CheckCircle as CheckCircleIcon,
//   Description as GenerateIcon,
//   Email as EmailIcon,
//   Check as AcceptIcon,
//   Cancel as CancelIcon,
//   Pending as PendingIcon,
//   FilterList as FilterIcon,
//   Clear as ClearIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../../config/Config';

// // Import all offer management components
// import InitiateOffer from './InitiateOffer';
// import SubmitForApproval from './SubmitForApproval';
// import ApproveOffer from './ApproveOffer';
// import GenerateOfferLetter from './GenerateOfferLetter';
// import SendOfferLetter from './SendOfferLetter';
// import ViewOffer from './ViewOffer';
// import AcceptOffer from './AcceptOffer';

// // Color constants matching other components
// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: {
//     primary: '#151C26',
//     secondary: '#4B5568',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF',
//     lightMuted: 'rgba(255, 255, 255, 0.9)'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FFFC',
//     hover: '#F0FDF9',
//     tableHeader: '#063C3F'
//   },
//   border: '#E3E8EF',
//   status: {
//     success: '#9FE2BF',
//     warning: '#FEF3C7',
//     error: '#FEE2E2',
//     info: '#E0F2FE'
//   },
//   chips: {
//     active: '#9FE2BF',
//     inactive: '#F1F5F9',
//     suspended: '#FEF3C7',
//     locked: '#FEE2E2'
//   }
// };

// // Status color mapping
// const STATUS_STYLES = {
//   'Initiated': { bg: COLORS.status.info, color: COLORS.primaryDark, icon: <AssignmentIcon sx={{ fontSize: '0.7rem' }} /> },
//   'Submitted': { bg: COLORS.status.warning, color: '#92400E', icon: <SendIcon sx={{ fontSize: '0.7rem' }} /> },
//   'Approved': { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> },
//   'Generated': { bg: '#F3E8FF', color: '#7E22CE', icon: <GenerateIcon sx={{ fontSize: '0.7rem' }} /> },
//   'Sent': { bg: COLORS.status.info, color: '#0369A1', icon: <EmailIcon sx={{ fontSize: '0.7rem' }} /> },
//   'Viewed': { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <VisibilityIcon sx={{ fontSize: '0.7rem' }} /> },
//   'Accepted': { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <AcceptIcon sx={{ fontSize: '0.7rem' }} /> },
//   'Rejected': { bg: COLORS.status.error, color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} /> },
//   'Pending': { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> }
// };

// const getStatusStyle = (status) => {
//   return STATUS_STYLES[status] || STATUS_STYLES['Pending'];
// };

// const getOfferStatus = (applicationStatus) => {
//   const statusMap = {
//     'selected': 'Initiated',
//     'initiated': 'Initiated',
//     'pending_approval': 'Submitted',
//     'submitted': 'Submitted',
//     'approved': 'Approved',
//     'rejected': 'Rejected',
//     'generated': 'Generated',
//     'sent': 'Sent',
//     'viewed': 'Viewed',
//     'accepted_by_candidate': 'Accepted',
//     'pending': 'Pending',
//     '': 'Pending',
//     null: 'Pending',
//     undefined: 'Pending'
//   };
//   return statusMap[applicationStatus] || 'Pending';
// };

// const OfferManagement = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [filteredCandidates, setFilteredCandidates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchInput, setSearchInput] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selected, setSelected] = useState([]);
//   const [orderBy, setOrderBy] = useState('name');
//   const [order, setOrder] = useState('asc');
//   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
//   const [selectedCandidateForAction, setSelectedCandidateForAction] = useState(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [completedActions, setCompletedActions] = useState({});
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);

//   const [dialogState, setDialogState] = useState({
//     initiateOffer: { open: false, candidate: null },
//     submitForApproval: { open: false, candidate: null },
//     approveOffer: { open: false, candidate: null },
//     generateOffer: { open: false, candidate: null },
//     sendOffer: { open: false, candidate: null },
//     viewOffer: { open: false, candidate: null },
//     acceptOffer: { open: false, candidate: null }
//   });

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchTerm(searchInput);
//       setPage(0);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   const fetchSelectedCandidates = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get(`${BASE_URL}/api/candidates?status=selected`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         const candidatesData = response.data.data || [];
        
//         const transformedData = await Promise.all(candidatesData.map(async (candidate) => {
//           let latestOffer = null;
//           let offerStatus = 'selected';
//           let offerId = null;

//           try {
//             const offersResponse = await axios.get(`${BASE_URL}/api/offers?candidateId=${candidate._id}`, {
//               headers: { 'Authorization': `Bearer ${token}` }
//             });

//             if (offersResponse.data.success && offersResponse.data.data) {
//               let offers = [];
//               if (offersResponse.data.data.offers) {
//                 offers = offersResponse.data.data.offers;
//               } else if (Array.isArray(offersResponse.data.data)) {
//                 offers = offersResponse.data.data;
//               }

//               if (offers.length > 0) {
//                 const sortedOffers = offers.sort((a, b) => {
//                   const dateA = new Date(a.createdAt || a.createdDate || 0);
//                   const dateB = new Date(b.createdAt || b.createdDate || 0);
//                   return dateB - dateA;
//                 });
//                 latestOffer = sortedOffers[0];
//                 offerStatus = latestOffer.status || latestOffer.offerStatus || latestOffer.applicationStatus || 'selected';
//                 offerId = latestOffer.offerId || latestOffer._id;
//               }
//             }
//           } catch (offerError) {
//             console.error('Error fetching offers:', offerError);
//           }

//           return {
//             id: candidate._id,
//             _id: candidate._id,
//             candidateId: candidate.candidateId,
//             name: `${candidate.firstName} ${candidate.lastName}`,
//             firstName: candidate.firstName,
//             lastName: candidate.lastName,
//             email: candidate.email,
//             phone: candidate.phone,
//             position: candidate.latestApplication?.jobId?.title || 'Not Assigned',
//             jobId: candidate.latestApplication?.jobId || null,
//             experience: candidate.experience?.length || 0,
//             skills: candidate.skills || [],
//             status: getOfferStatus(offerStatus),
//             applicationStatus: offerStatus,
//             applicationId: candidate.latestApplication?._id,
//             offerId: offerId,
//             offerDetails: latestOffer ? {
//               salary: latestOffer.ctcDetails?.totalCtc || null,
//               joiningDate: latestOffer.joiningDate || null,
//               ctcDetails: latestOffer.ctcDetails || null
//             } : {}
//           };
//         }));

//         setCandidates(transformedData);
//         setFilteredCandidates(transformedData);
//         setSelected([]);
//       } else {
//         setError(response.data.message || 'Failed to fetch candidates');
//       }
//     } catch (err) {
//       console.error('Error fetching candidates:', err);
//       setError(err.response?.data?.message || 'Failed to fetch candidates. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchSelectedCandidates();
//   }, [fetchSelectedCandidates]);

//   useEffect(() => {
//     let filtered = [...candidates];
    
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(candidate =>
//         candidate.name.toLowerCase().includes(term) ||
//         candidate.email.toLowerCase().includes(term) ||
//         candidate.candidateId.toLowerCase().includes(term) ||
//         candidate.position.toLowerCase().includes(term)
//       );
//     }
    
//     if (orderBy) {
//       filtered.sort((a, b) => {
//         let aValue = a[orderBy];
//         let bValue = b[orderBy];
//         if (orderBy === 'name') {
//           aValue = a.name;
//           bValue = b.name;
//         }
//         if (order === 'asc') {
//           return aValue > bValue ? 1 : -1;
//         } else {
//           return aValue < bValue ? 1 : -1;
//         }
//       });
//     }
    
//     setFilteredCandidates(filtered);
//     setPage(0);
//   }, [candidates, searchTerm, orderBy, order]);

//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleClearSearch = () => {
//     setSearchInput('');
//     setSearchTerm('');
//     setPage(0);
//   };

//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(paginatedCandidates.map(c => c.id));
//     } else {
//       setSelected([]);
//     }
//   };

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

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleRefresh = () => {
//     fetchSelectedCandidates();
//     showNotification('Data refreshed', 'info');
//   };

//   const handleClearFilters = () => {
//     setSearchInput('');
//     setSearchTerm('');
//     setOrderBy('name');
//     setOrder('asc');
//     setSelected([]);
//   };

//   const handleActionMenuOpen = (event, candidate) => {
//     setActionMenuAnchor(event.currentTarget);
//     setSelectedCandidateForAction(candidate);
//   };

//   const handleActionMenuClose = () => {
//     setActionMenuAnchor(null);
//     setSelectedCandidateForAction(null);
//   };

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

//   const showNotification = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const updateCandidateStatus = async (candidateId, newStatus, newAppStatus, offerId = null, offerDetails = null) => {
//     setCandidates(prev => prev.map(candidate => {
//       if (candidate.id === candidateId || candidate._id === candidateId) {
//         return {
//           ...candidate,
//           status: newStatus,
//           applicationStatus: newAppStatus,
//           offerId: offerId || candidate.offerId,
//           offerDetails: offerDetails ? { ...candidate.offerDetails, ...offerDetails } : candidate.offerDetails
//         };
//       }
//       return candidate;
//     }));
    
//     setFilteredCandidates(prev => prev.map(candidate => {
//       if (candidate.id === candidateId || candidate._id === candidateId) {
//         return {
//           ...candidate,
//           status: newStatus,
//           applicationStatus: newAppStatus,
//           offerId: offerId || candidate.offerId,
//           offerDetails: offerDetails ? { ...candidate.offerDetails, ...offerDetails } : candidate.offerDetails
//         };
//       }
//       return candidate;
//     }));
//   };

// const handleActionComplete = async (action, updatedData) => {
//   try {
//     console.log(`🔵 Action completed: ${action}`, updatedData);
    
//     const actionName = action.replace(/([A-Z])/g, ' $1').toLowerCase();
//     showNotification(`Offer ${actionName} completed successfully`, 'success');
    
//     // Get the candidate ID from updatedData or selectedCandidateForAction
//     const candidateIdToUpdate = updatedData?.id || 
//                                 updatedData?._id ||
//                                 updatedData?.candidateId ||
//                                 selectedCandidateForAction?.id || 
//                                 selectedCandidateForAction?._id;

//     if (!candidateIdToUpdate) {
//       console.error('No candidate ID found in update data:', updatedData);
//       showNotification('Failed to update candidate status', 'error');
//       handleCloseDialog(action);
//       return;
//     }

//     let newDisplayStatus = '';
//     let newAppStatus = '';

//     switch (action) {
//       case 'initiateOffer':
//         newDisplayStatus = 'Initiated';
//         newAppStatus = 'initiated';
//         break;
//       case 'submitForApproval':
//         newDisplayStatus = 'Submitted';
//         newAppStatus = 'pending_approval';
//         break;
//       case 'approveOffer':
//         newDisplayStatus = 'Approved';
//         newAppStatus = 'approved';
//         break;
//       case 'generateOffer':
//         newDisplayStatus = 'Generated';
//         newAppStatus = 'generated';
//         break;
//       case 'sendOffer':
//         newDisplayStatus = 'Sent';
//         newAppStatus = 'sent';
//         break;
//       case 'acceptOffer':
//         newDisplayStatus = 'Accepted';
//         newAppStatus = 'accepted_by_candidate';
//         break;
//       default:
//         newDisplayStatus = updatedData?.status || 'Pending';
//         newAppStatus = updatedData?.applicationStatus || 'pending';
//     }

//     console.log(`🔵 Updating candidate ${candidateIdToUpdate} to status: ${newDisplayStatus}`);

//     // Update both candidates and filteredCandidates states immediately
//     const updateCandidates = (prev) => {
//       return prev.map(candidate => {
//         if (candidate.id === candidateIdToUpdate || candidate._id === candidateIdToUpdate) {
//           console.log(`🔵 Found candidate ${candidate.name}, updating status from ${candidate.status} to ${newDisplayStatus}`);
//           return {
//             ...candidate,
//             status: newDisplayStatus,
//             applicationStatus: newAppStatus,
//             offerId: updatedData?.offerId || candidate.offerId,
//             offerDetails: updatedData?.offerDetails ? { ...candidate.offerDetails, ...updatedData.offerDetails } : candidate.offerDetails
//           };
//         }
//         return candidate;
//       });
//     };

//     setCandidates(updateCandidates);
//     setFilteredCandidates(updateCandidates);

//     setCompletedActions(prev => ({
//       ...prev,
//       [`${candidateIdToUpdate}_${action}`]: true
//     }));
    
//     // Close the dialog
//     handleCloseDialog(action);
    
//     // Show success message with the new status
//     showNotification(`Offer ${newDisplayStatus} successfully!`, 'success');
    
//   } catch (error) {
//     console.error('Error in handleActionComplete:', error);
//     showNotification('Action completed but failed to refresh data', 'warning');
//     handleCloseDialog(action);
//   }
// };

//   const isActionEnabled = (action, candidate) => {
//   if (!candidate) return false;
  
//   const status = candidate.status;
//   const appStatus = candidate.applicationStatus;

//   const actionStatusMap = {
//     initiateOffer: ['Pending', 'selected', null],
//     submitForApproval: ['Initiated'],
//     approveOffer: ['Submitted'],
//     generateOffer: ['Approved', 'Generated'],  // Can generate after approved or already generated
//     sendOffer: ['Approved', 'Generated', 'Sent'],  // Can send after approved, generated, or already sent
//     viewOffer: ['Sent', 'Viewed', 'Accepted', 'Generated', 'Approved', 'Submitted', 'Initiated'],
//     acceptOffer: ['Sent', 'Viewed']
//   };

//   // Special handling for sendOffer - allow after approved
//   if (action === 'sendOffer') {
//     return status === 'Approved' || status === 'Generated' || status === 'Sent' ||
//            appStatus === 'approved' || appStatus === 'generated' || appStatus === 'sent';
//   }

//   // Special handling for generateOffer - allow after approved
//   if (action === 'generateOffer') {
//     return status === 'Approved' || status === 'Generated' ||
//            appStatus === 'approved' || appStatus === 'generated';
//   }

//   // Special handling for acceptOffer
//   if (action === 'acceptOffer') {
//     return status === 'Sent' || appStatus === 'sent';
//   }

//   return actionStatusMap[action]?.some(s => status === s || appStatus === s) || false;
// };

//   const getAvatarInitials = (firstName, lastName) => {
//     return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'C';
//   };

//   const paginatedCandidates = filteredCandidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
//   const isFilterActive = searchTerm;

//   return (
//     <Box sx={{ p: -3 }}>
//       {/* Action Bar */}
//       <Paper sx={{ 
//         p: 1.5, 
//         mb: 2.5, 
//         borderRadius: 2,
//         bgcolor: COLORS.background.white,
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//         border: `1px solid ${COLORS.border}`
//       }}>
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
//           <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
//             <TextField
//               placeholder="Search by name, email, or ID..."
//               size="small"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               sx={{ 
//                 width: { xs: '100%', sm: 280 },
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 1.5,
//                   fontSize: '0.75rem',
//                   '&:hover fieldset': { borderColor: COLORS.primary },
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
//                   </InputAdornment>
//                 ),
//                 endAdornment: searchInput && (
//                   <InputAdornment position="end">
//                     <IconButton size="small" onClick={handleClearSearch} edge="end">
//                       <CloseIcon fontSize="small" sx={{ color: COLORS.text.tertiary }} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//                 sx: { 
//                   height: 36,
//                   bgcolor: COLORS.background.light,
//                   '& input': {
//                     padding: '6px 12px',
//                     fontSize: '0.75rem',
//                     color: COLORS.text.primary
//                   }
//                 }
//               }}
//               disabled={loading}
//             />

//             {isFilterActive && (
//               <Button
//                 variant="text"
//                 startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={handleClearFilters}
//                 sx={{ 
//                   height: 36,
//                   borderRadius: 1.5,
//                   fontSize: '0.7rem',
//                   fontWeight: 500,
//                   textTransform: 'none',
//                   color: COLORS.text.secondary
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             )}
//           </Stack>

//           <Stack direction="row" spacing={1.5}>
//             {selected.length > 0 && (
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={() => showNotification('Bulk action requires API implementation', 'warning')}
//                 sx={{ 
//                   height: 36,
//                   borderRadius: 1.5,
//                   textTransform: 'none',
//                   fontSize: '0.75rem',
//                   fontWeight: 500,
//                   borderColor: '#fee2e2',
//                   color: '#991b1b',
//                   '&:hover': { borderColor: '#fecaca', bgcolor: '#fee2e2' }
//                 }}
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* Error Alert */}
//       {error && (
//         <Alert 
//           severity="error" 
//           sx={{ mb: 2.5, borderRadius: 1.5, fontSize: '0.75rem' }}
//           action={
//             <Button color="inherit" size="small" onClick={fetchSelectedCandidates}>
//               Retry
//             </Button>
//           }
//         >
//           {error}
//         </Alert>
//       )}

//       {/* Candidates Table */}
//       <Paper sx={{ 
//         width: '100%', 
//         borderRadius: 2, 
//         overflow: 'hidden',
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//         border: `1px solid ${COLORS.border}`
//       }}>
//         <TableContainer>
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ 
//                 bgcolor: COLORS.background.tableHeader,
//                 '& .MuiTableCell-root': {
//                   borderBottom: 'none',
//                   color: COLORS.text.light,
//                   py: 1.5
//                 }
//               }}>
//                 <TableCell padding="checkbox" sx={{ width: 40 }}>
//                   <Checkbox
//                     indeterminate={selected.length > 0 && selected.length < paginatedCandidates.length}
//                     checked={paginatedCandidates.length > 0 && selected.length === paginatedCandidates.length}
//                     onChange={handleSelectAll}
//                     sx={{
//                       color: COLORS.text.light,
//                       '&.Mui-checked': { color: COLORS.text.light },
//                       '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
//                       '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
//                     }}
//                     disabled={loading || paginatedCandidates.length === 0}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   <TableSortLabel
//                     active={orderBy === 'name'}
//                     direction={orderBy === 'name' ? order : 'asc'}
//                     onClick={() => handleRequestSort('name')}
//                     sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
//                   >
//                     Candidate
//                   </TableSortLabel>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   Contact
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   <TableSortLabel
//                     active={orderBy === 'position'}
//                     direction={orderBy === 'position' ? order : 'asc'}
//                     onClick={() => handleRequestSort('position')}
//                     sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
//                   >
//                     Position
//                   </TableSortLabel>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   Skills
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   <TableSortLabel
//                     active={orderBy === 'status'}
//                     direction={orderBy === 'status' ? order : 'asc'}
//                     onClick={() => handleRequestSort('status')}
//                     sx={{ color: COLORS.text.light, '& .MuiTableSortLabel-icon': { color: COLORS.text.light } }}
//                   >
//                     Status
//                   </TableSortLabel>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
//                     <CircularProgress size={32} sx={{ color: COLORS.primary }} />
//                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
//                       Loading candidates...
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : paginatedCandidates.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <PersonIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
//                       <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
//                         {isFilterActive ? 'No candidates match your filters' : 'No candidates available'}
//                       </Typography>
//                       <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
//                         {isFilterActive ? 'Try adjusting your search terms' : 'No selected candidates found'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedCandidates.map((candidate, index) => {
//                   const isSelected = selected.includes(candidate.id);
//                   const isActionMenuOpen = Boolean(actionMenuAnchor) && 
//                     selectedCandidateForAction?.id === candidate.id;
//                   const statusStyle = getStatusStyle(candidate.status);
//                   const avatarColor = COLORS.primary;

//                   return (
//                     <TableRow
//                       key={candidate.id}
//                       hover
//                       selected={isSelected}
//                       sx={{ 
//                         bgcolor: COLORS.background.white,
//                         '&:hover': { bgcolor: COLORS.background.hover },
//                         '&.Mui-selected': {
//                           bgcolor: `${COLORS.primary}10`,
//                           '&:hover': { bgcolor: `${COLORS.primary}20` }
//                         },
//                         '& .MuiTableCell-root': {
//                           py: 1.5,
//                           fontSize: '0.75rem',
//                           borderColor: COLORS.border
//                         }
//                       }}
//                     >
//                       <TableCell padding="checkbox" sx={{ width: 40 }}>
//                         <Checkbox
//                           checked={isSelected}
//                           onChange={() => handleSelect(candidate.id)}
//                           sx={{
//                             color: COLORS.primary,
//                             '&.Mui-checked': { color: COLORS.primary },
//                             '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Stack direction="row" spacing={1.5} alignItems="center">
//                           <Avatar sx={{ width: 40, height: 40, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
//                             {getAvatarInitials(candidate.firstName, candidate.lastName)}
//                           </Avatar>
//                           <Box>
//                             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
//                               {candidate.name}
//                             </Typography>
//                             <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                               ID: {candidate.candidateId}
//                             </Typography>
//                             {candidate.offerId && (
//                               <Typography sx={{ fontSize: '0.65rem', color: COLORS.primary }}>
//                                 Offer: {candidate.offerId}
//                               </Typography>
//                             )}
//                           </Box>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
//                           {candidate.email}
//                         </Typography>
//                         <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                           {candidate.phone}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
//                           {candidate.position}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                           {candidate.skills?.slice(0, 2).map((skill, idx) => (
//                             <Chip
//                               key={idx}
//                               label={skill}
//                               size="small"
//                               sx={{
//                                 bgcolor: COLORS.primaryLight,
//                                 color: COLORS.primaryDark,
//                                 fontSize: '0.6rem',
//                                 height: 20
//                               }}
//                             />
//                           ))}
//                           {candidate.skills?.length > 2 && (
//                             <Chip
//                               label={`+${candidate.skills.length - 2}`}
//                               size="small"
//                               sx={{
//                                 bgcolor: COLORS.chips.inactive,
//                                 color: COLORS.text.secondary,
//                                 fontSize: '0.6rem',
//                                 height: 20
//                               }}
//                             />
//                           )}
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           icon={statusStyle.icon}
//                           label={candidate.status}
//                           size="small"
//                           sx={{
//                             bgcolor: statusStyle.bg,
//                             color: statusStyle.color,
//                             fontWeight: 500,
//                             fontSize: '0.65rem',
//                             height: 24,
//                             '& .MuiChip-icon': { fontSize: '0.7rem', color: statusStyle.color }
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell align="center" sx={{ width: 60 }}>
//                         <IconButton
//                           size="small"
//                           onClick={(e) => handleActionMenuOpen(e, candidate)}
//                           sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}
//                         >
//                           <MoreVertIcon sx={{ fontSize: '0.9rem' }} />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={filteredCandidates.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           sx={{
//             borderTop: `1px solid ${COLORS.border}`,
//             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
//               fontSize: '0.7rem',
//               color: COLORS.text.secondary
//             },
//             '& .MuiTablePagination-select': { fontSize: '0.7rem' },
//             '& .MuiTablePagination-actions button': { color: COLORS.primary }
//           }}
//         />
//       </Paper>

//       {/* Action Menu */}
//       <Menu
//         anchorEl={actionMenuAnchor}
//         open={Boolean(actionMenuAnchor)}
//         onClose={handleActionMenuClose}
//         PaperProps={{
//           elevation: 3,
//           sx: {
//             mt: 1,
//             minWidth: 180,
//             borderRadius: 2,
//             border: `1px solid ${COLORS.border}`,
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//           }
//         }}
//       >
//         <MenuItem onClick={() => selectedCandidateForAction && handleOpenDialog('initiateOffer', selectedCandidateForAction)} disabled={!isActionEnabled('initiateOffer', selectedCandidateForAction)} sx={{ py: 1.5 }}>
//           <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}><AssignmentIcon fontSize="small" /></ListItemIcon>
//           <ListItemText><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Initiate Offer</Typography></ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => selectedCandidateForAction && handleOpenDialog('submitForApproval', selectedCandidateForAction)} disabled={!isActionEnabled('submitForApproval', selectedCandidateForAction)} sx={{ py: 1.5 }}>
//           <ListItemIcon sx={{ color: '#ed6c02', minWidth: 36 }}><SendIcon fontSize="small" /></ListItemIcon>
//           <ListItemText><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Submit for Approval</Typography></ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => selectedCandidateForAction && handleOpenDialog('approveOffer', selectedCandidateForAction)} disabled={!isActionEnabled('approveOffer', selectedCandidateForAction)} sx={{ py: 1.5 }}>
//           <ListItemIcon sx={{ color: '#2e7d32', minWidth: 36 }}><CheckCircleIcon fontSize="small" /></ListItemIcon>
//           <ListItemText><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Approve Offer</Typography></ListItemText>
//         </MenuItem>
//         <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
//         <MenuItem onClick={() => selectedCandidateForAction && handleOpenDialog('generateOffer', selectedCandidateForAction)} disabled={!isActionEnabled('generateOffer', selectedCandidateForAction)} sx={{ py: 1.5 }}>
//           <ListItemIcon sx={{ color: '#7e22ce', minWidth: 36 }}><GenerateIcon fontSize="small" /></ListItemIcon>
//           <ListItemText><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Generate Offer Letter</Typography></ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => selectedCandidateForAction && handleOpenDialog('sendOffer', selectedCandidateForAction)} disabled={!isActionEnabled('sendOffer', selectedCandidateForAction)} sx={{ py: 1.5 }}>
//           <ListItemIcon sx={{ color: '#0284c7', minWidth: 36 }}><EmailIcon fontSize="small" /></ListItemIcon>
//           <ListItemText><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Send to Candidate</Typography></ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => selectedCandidateForAction && handleOpenDialog('acceptOffer', selectedCandidateForAction)} disabled={!isActionEnabled('acceptOffer', selectedCandidateForAction)} sx={{ py: 1.5 }}>
//           <ListItemIcon sx={{ color: '#2e7d32', minWidth: 36 }}><AcceptIcon fontSize="small" /></ListItemIcon>
//           <ListItemText><Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Accept Offer</Typography></ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* Action Dialogs */}
//       <InitiateOffer open={dialogState.initiateOffer.open} onClose={() => handleCloseDialog('initiateOffer')} candidate={dialogState.initiateOffer.candidate} onComplete={(data) => handleActionComplete('initiateOffer', data)} />
//       <SubmitForApproval open={dialogState.submitForApproval.open} onClose={() => handleCloseDialog('submitForApproval')} candidateData={dialogState.submitForApproval.candidate} onComplete={(data) => handleActionComplete('submitForApproval', data)} />
//       <ApproveOffer open={dialogState.approveOffer.open} onClose={() => handleCloseDialog('approveOffer')} candidate={dialogState.approveOffer.candidate} onComplete={(data) => handleActionComplete('approveOffer', data)} />
//       <GenerateOfferLetter open={dialogState.generateOffer.open} onClose={() => handleCloseDialog('generateOffer')} candidate={dialogState.generateOffer.candidate} onComplete={(data) => handleActionComplete('generateOffer', data)} />
//       <SendOfferLetter open={dialogState.sendOffer.open} onClose={() => handleCloseDialog('sendOffer')} candidate={dialogState.sendOffer.candidate} onComplete={(data) => handleActionComplete('sendOffer', data)} />
//       <AcceptOffer open={dialogState.acceptOffer.open} onClose={() => handleCloseDialog('acceptOffer')} candidate={dialogState.acceptOffer.candidate} onComplete={(data) => handleActionComplete('acceptOffer', data)} />

//       {/* Snackbar Notification */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({...snackbar, open: false})}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert 
//           onClose={() => setSnackbar({...snackbar, open: false})} 
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ 
//             width: '100%',
//             borderRadius: 1.5,
//             fontSize: '0.75rem',
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//             '& .MuiAlert-icon': { fontSize: '1.25rem' }
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
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../../utils/modulePermissions';

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

// Loading state component
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

// Access Denied component
const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="error" sx={{ mb: 2, fontSize: '1rem' }}>
      Access Denied
    </Typography>
    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
      You don't have permission to view this page. Please contact your administrator.
    </Typography>
  </Box>
);

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
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  const [dialogState, setDialogState] = useState({
    initiateOffer: { open: false, candidate: null },
    submitForApproval: { open: false, candidate: null },
    approveOffer: { open: false, candidate: null },
    generateOffer: { open: false, candidate: null },
    sendOffer: { open: false, candidate: null },
    viewOffer: { open: false, candidate: null },
    acceptOffer: { open: false, candidate: null }
  });

  // Fetch user permissions from /api/auth/me
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setPermissionsLoaded(true);
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const userData = response.data.data;
          setIsSuperAdmin(userData.isSuperAdmin || false);
          
          // Set permissions array
          if (userData.permissions && Array.isArray(userData.permissions)) {
            setUserPermissions(userData.permissions);
          } else {
            setUserPermissions([]);
          }
        } else {
          setUserPermissions([]);
        }
      } catch (err) {
        console.error('Error fetching user permissions:', err);
        setUserPermissions([]);
      } finally {
        setPermissionsLoaded(true);
      }
    };
    
    fetchUserPermissions();
  }, []);

  // Check permission helper
  const checkPermission = (action) => {
    // Super admin has all permissions
    if (isSuperAdmin) return true;
    
    return hasPermission(
      userPermissions,
      MODULES.SELECTED_CANDIDATES_MASTER,
      PAGES.SELECTED_CANDIDATE,
      action
    );
  };

  // Permission checks for different actions
  const canView = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canApprove = checkPermission(ACTIONS.APPROVE);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchSelectedCandidates = useCallback(async () => {
    // Only fetch if user has view permission
    if (!canView && !isSuperAdmin) return;
    
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
            _id: candidate._id,
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
  }, [canView, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canView || isSuperAdmin)) {
      fetchSelectedCandidates();
    }
  }, [fetchSelectedCandidates, permissionsLoaded, canView, isSuperAdmin]);

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

  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete && !isSuperAdmin) {
      showNotification("You don't have permission to delete candidates", "error");
      return;
    }
    
    if (event.target.checked) {
      setSelected(paginatedCandidates.map(c => c.id));
    } else {
      setSelected([]);
    }
  };

  // Handle single selection - only if user has delete permission
  const handleSelect = (id) => {
    if (!canDelete && !isSuperAdmin) {
      showNotification("You don't have permission to delete candidates", "error");
      return;
    }
    
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

  const updateCandidateStatus = async (candidateId, newStatus, newAppStatus, offerId = null, offerDetails = null) => {
    setCandidates(prev => prev.map(candidate => {
      if (candidate.id === candidateId || candidate._id === candidateId) {
        return {
          ...candidate,
          status: newStatus,
          applicationStatus: newAppStatus,
          offerId: offerId || candidate.offerId,
          offerDetails: offerDetails ? { ...candidate.offerDetails, ...offerDetails } : candidate.offerDetails
        };
      }
      return candidate;
    }));
    
    setFilteredCandidates(prev => prev.map(candidate => {
      if (candidate.id === candidateId || candidate._id === candidateId) {
        return {
          ...candidate,
          status: newStatus,
          applicationStatus: newAppStatus,
          offerId: offerId || candidate.offerId,
          offerDetails: offerDetails ? { ...candidate.offerDetails, ...offerDetails } : candidate.offerDetails
        };
      }
      return candidate;
    }));
  };

  const handleActionComplete = async (action, updatedData) => {
    try {
      console.log(`🔵 Action completed: ${action}`, updatedData);
      
      const actionName = action.replace(/([A-Z])/g, ' $1').toLowerCase();
      showNotification(`Offer ${actionName} completed successfully`, 'success');
      
      const candidateIdToUpdate = updatedData?.id || 
                                  updatedData?._id ||
                                  updatedData?.candidateId ||
                                  selectedCandidateForAction?.id || 
                                  selectedCandidateForAction?._id;

      if (!candidateIdToUpdate) {
        console.error('No candidate ID found in update data:', updatedData);
        showNotification('Failed to update candidate status', 'error');
        handleCloseDialog(action);
        return;
      }

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

      console.log(`🔵 Updating candidate ${candidateIdToUpdate} to status: ${newDisplayStatus}`);

      const updateCandidates = (prev) => {
        return prev.map(candidate => {
          if (candidate.id === candidateIdToUpdate || candidate._id === candidateIdToUpdate) {
            console.log(`🔵 Found candidate ${candidate.name}, updating status from ${candidate.status} to ${newDisplayStatus}`);
            return {
              ...candidate,
              status: newDisplayStatus,
              applicationStatus: newAppStatus,
              offerId: updatedData?.offerId || candidate.offerId,
              offerDetails: updatedData?.offerDetails ? { ...candidate.offerDetails, ...updatedData.offerDetails } : candidate.offerDetails
            };
          }
          return candidate;
        });
      };

      setCandidates(updateCandidates);
      setFilteredCandidates(updateCandidates);

      setCompletedActions(prev => ({
        ...prev,
        [`${candidateIdToUpdate}_${action}`]: true
      }));
      
      handleCloseDialog(action);
      showNotification(`Offer ${newDisplayStatus} successfully!`, 'success');
      
    } catch (error) {
      console.error('Error in handleActionComplete:', error);
      showNotification('Action completed but failed to refresh data', 'warning');
      handleCloseDialog(action);
    }
  };

  // Updated isActionEnabled to check both status and permissions
  const isActionEnabled = (action, candidate) => {
    if (!candidate) return false;
    
    const status = candidate.status;
    const appStatus = candidate.applicationStatus;

    const actionStatusMap = {
      initiateOffer: ['Pending', 'selected', null],
      submitForApproval: ['Initiated'],
      approveOffer: ['Submitted'],
      generateOffer: ['Approved', 'Generated'],
      sendOffer: ['Approved', 'Generated', 'Sent'],
      viewOffer: ['Sent', 'Viewed', 'Accepted', 'Generated', 'Approved', 'Submitted', 'Initiated'],
      acceptOffer: ['Sent', 'Viewed']
    };

    // Check if status matches
    const statusMatch = actionStatusMap[action]?.some(s => status === s || appStatus === s) || false;
    
    // If status doesn't match, action is disabled
    if (!statusMatch) return false;
    
    // Check permissions based on action
    switch (action) {
      case 'initiateOffer':
        return canCreate || isSuperAdmin;
      case 'submitForApproval':
      case 'generateOffer':
      case 'sendOffer':
      case 'acceptOffer':
        return canUpdate || isSuperAdmin;
      case 'approveOffer':
        return canApprove || isSuperAdmin;
      case 'viewOffer':
        return canView || isSuperAdmin;
      default:
        return false;
    }
  };

  const getAvatarInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'C';
  };

  const paginatedCandidates = filteredCandidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isFilterActive = searchTerm;

  // Show loading state while permissions are being fetched
  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  // If user doesn't have view permission, show access denied
  if (!canView && !isSuperAdmin) {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ p: -3 }}>
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
          </Stack>

          <Stack direction="row" spacing={1.5}>
            {/* Bulk Delete Button - Only show if user has delete permission */}
            {(canDelete || isSuperAdmin) && selected.length > 0 && (
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
                {/* Checkbox Column - Only show if user has delete permission */}
                {(canDelete || isSuperAdmin) && (
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
                )}
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
                  <TableCell colSpan={(canDelete || isSuperAdmin) ? 7 : 6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading candidates...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(canDelete || isSuperAdmin) ? 7 : 6} align="center" sx={{ py: 6 }}>
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
                      {/* Checkbox Column - Only show if user has delete permission */}
                      {(canDelete || isSuperAdmin) && (
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
                      )}
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

      {/* Action Menu - Menu items now check permissions */}
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
        {/* Initiate Offer - Only show if user has CREATE permission */}
        {(canCreate || isSuperAdmin) && (
          <MenuItem 
            onClick={() => selectedCandidateForAction && handleOpenDialog('initiateOffer', selectedCandidateForAction)} 
            disabled={!isActionEnabled('initiateOffer', selectedCandidateForAction)} 
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Initiate Offer</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Submit for Approval - Only show if user has UPDATE permission */}
        {(canUpdate || isSuperAdmin) && (
          <MenuItem 
            onClick={() => selectedCandidateForAction && handleOpenDialog('submitForApproval', selectedCandidateForAction)} 
            disabled={!isActionEnabled('submitForApproval', selectedCandidateForAction)} 
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#ed6c02', minWidth: 36 }}>
              <SendIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Submit for Approval</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Approve Offer - Only show if user has APPROVE permission */}
        {(canApprove || isSuperAdmin) && (
          <MenuItem 
            onClick={() => selectedCandidateForAction && handleOpenDialog('approveOffer', selectedCandidateForAction)} 
            disabled={!isActionEnabled('approveOffer', selectedCandidateForAction)} 
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#2e7d32', minWidth: 36 }}>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Approve Offer</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Divider - Only show if there are items above and below */}
        {((canCreate || isSuperAdmin) && (canUpdate || isSuperAdmin || canApprove || isSuperAdmin)) && (
          <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        )}

        {/* Generate Offer Letter - Only show if user has UPDATE permission */}
        {(canUpdate || isSuperAdmin) && (
          <MenuItem 
            onClick={() => selectedCandidateForAction && handleOpenDialog('generateOffer', selectedCandidateForAction)} 
            disabled={!isActionEnabled('generateOffer', selectedCandidateForAction)} 
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#7e22ce', minWidth: 36 }}>
              <GenerateIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Generate Offer Letter</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Send Offer - Only show if user has UPDATE permission */}
        {(canUpdate || isSuperAdmin) && (
          <MenuItem 
            onClick={() => selectedCandidateForAction && handleOpenDialog('sendOffer', selectedCandidateForAction)} 
            disabled={!isActionEnabled('sendOffer', selectedCandidateForAction)} 
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#0284c7', minWidth: 36 }}>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Send to Candidate</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Accept Offer - Only show if user has UPDATE permission */}
        {(canUpdate || isSuperAdmin) && (
          <MenuItem 
            onClick={() => selectedCandidateForAction && handleOpenDialog('acceptOffer', selectedCandidateForAction)} 
            disabled={!isActionEnabled('acceptOffer', selectedCandidateForAction)} 
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#2e7d32', minWidth: 36 }}>
              <AcceptIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Accept Offer</Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Action Dialogs - Only render if user has appropriate permissions */}
      {(canCreate || isSuperAdmin) && (
        <InitiateOffer 
          open={dialogState.initiateOffer.open} 
          onClose={() => handleCloseDialog('initiateOffer')} 
          candidate={dialogState.initiateOffer.candidate} 
          onComplete={(data) => handleActionComplete('initiateOffer', data)} 
        />
      )}
      
      {(canUpdate || isSuperAdmin) && (
        <SubmitForApproval 
          open={dialogState.submitForApproval.open} 
          onClose={() => handleCloseDialog('submitForApproval')} 
          candidateData={dialogState.submitForApproval.candidate} 
          onComplete={(data) => handleActionComplete('submitForApproval', data)} 
        />
      )}
      
      {(canApprove || isSuperAdmin) && (
        <ApproveOffer 
          open={dialogState.approveOffer.open} 
          onClose={() => handleCloseDialog('approveOffer')} 
          candidate={dialogState.approveOffer.candidate} 
          onComplete={(data) => handleActionComplete('approveOffer', data)} 
        />
      )}
      
      {(canUpdate || isSuperAdmin) && (
        <GenerateOfferLetter 
          open={dialogState.generateOffer.open} 
          onClose={() => handleCloseDialog('generateOffer')} 
          candidate={dialogState.generateOffer.candidate} 
          onComplete={(data) => handleActionComplete('generateOffer', data)} 
        />
      )}
      
      {(canUpdate || isSuperAdmin) && (
        <SendOfferLetter 
          open={dialogState.sendOffer.open} 
          onClose={() => handleCloseDialog('sendOffer')} 
          candidate={dialogState.sendOffer.candidate} 
          onComplete={(data) => handleActionComplete('sendOffer', data)} 
        />
      )}
      
      {(canUpdate || isSuperAdmin) && (
        <AcceptOffer 
          open={dialogState.acceptOffer.open} 
          onClose={() => handleCloseDialog('acceptOffer')} 
          candidate={dialogState.acceptOffer.candidate} 
          onComplete={(data) => handleActionComplete('acceptOffer', data)} 
        />
      )}

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