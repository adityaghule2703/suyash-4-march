// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   Box,
// //   Paper,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   IconButton,
// //   Button,
// //   TextField,
// //   InputAdornment,
// //   Tooltip,
// //   Typography,
// //   Snackbar,
// //   TablePagination,
// //   Checkbox,
// //   Stack,
// //   Chip,
// //   Avatar,
// //   Menu,
// //   MenuItem,
// //   ListItemIcon,
// //   ListItemText,
// //   Divider,
// //   Alert,
// //   CircularProgress
// // } from '@mui/material';
// // import {
// //   Search as SearchIcon,
// //   Add as AddIcon,
// //   Delete as DeleteIcon,
// //   Visibility as ViewIcon,
// //   Edit as EditIcon,
// //   MoreVert as MoreVertIcon,
// //   Business as BusinessIcon,
// //   Update as UpdateIcon,
// //   Message as MessageIcon,
// //   Image as ImageIcon,
// //   Science as ScienceIcon,
// //   Assessment as AssessmentIcon
// // } from '@mui/icons-material';
// // import axios from 'axios';
// // import BASE_URL from '../../../config/Config';
// // import AddLead from './AddLead';
// // import EditLead from './EditLead';
// // import ViewLead from './ViewLead';
// // import DeleteLead from './DeleteLead';
// // import StatusUpdatePopup from './StatusUpdatePopup';
// // import ConvertLeadPopup from './ConvertLeadPopup';
// // import FollowupPopup from './FollowupPopup';
// // import DrawingsPopup from './DrawingsPopup';
// // import FeasibilityPopup from './FeasibilityPopup';
// // import FeasibilityCheckPopup from './FeasibilityCheckPopup';
// // import { COLORS, STATUS_COLORS, PRIORITY_COLORS, STATUS_TRANSITIONS } from './constants';

// // // Action Menu Component with all options
// // const ActionMenu = ({ item, onView, onEdit, onDelete, onStatusUpdate, onConvert, onFollowup, onDrawings, onFeasibility, onFeasibilityCheck, anchorEl, onClose, onOpen }) => {
// //   const currentStatus = item?.status || 'New';
// //   const hasAvailableTransitions = STATUS_TRANSITIONS[currentStatus]?.length > 0;
// //   const isWon = currentStatus === 'Won';

// //   return (
// //     <>
// //       <Tooltip title="Actions">
// //         <IconButton
// //           size="small"
// //           onClick={onOpen}
// //           sx={{
// //             color: COLORS.text.secondary,
// //             '&:hover': {
// //               bgcolor: `${COLORS.primary}20`
// //             }
// //           }}
// //         >
// //           <MoreVertIcon fontSize="small" />
// //         </IconButton>
// //       </Tooltip>
// //       <Menu
// //         anchorEl={anchorEl}
// //         open={Boolean(anchorEl)}
// //         onClose={onClose}
// //         PaperProps={{
// //           elevation: 3,
// //           sx: {
// //             mt: 1,
// //             minWidth: 180,
// //             borderRadius: 2,
// //             border: `1px solid ${COLORS.border}`,
// //             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
// //           }
// //         }}
// //       >
// //         <MenuItem 
// //           onClick={() => {
// //             onView(item);
// //             onClose();
// //           }}
// //           sx={{ py: 1.5 }}
// //         >
// //           <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
// //             <ViewIcon fontSize="small" />
// //           </ListItemIcon>
// //           <ListItemText>
// //             <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
// //               View Details
// //             </Typography>
// //           </ListItemText>
// //         </MenuItem>
        
// //         <MenuItem 
// //           onClick={() => {
// //             onEdit(item);
// //             onClose();
// //           }}
// //           sx={{ py: 1.5 }}
// //         >
// //           <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
// //             <EditIcon fontSize="small" />
// //           </ListItemIcon>
// //           <ListItemText>
// //             <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
// //               Edit
// //             </Typography>
// //           </ListItemText>
// //         </MenuItem>
        
// //         {/* Feasibility Check Button - Show for all statuses */}
// //         <MenuItem 
// //           onClick={() => {
// //             onFeasibilityCheck(item);
// //             onClose();
// //           }}
// //           sx={{ py: 1.5 }}
// //         >
// //           <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
// //             <AssessmentIcon fontSize="small" />
// //           </ListItemIcon>
// //           <ListItemText>
// //             <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
// //               Feasibility Check
// //             </Typography>
// //           </ListItemText>
// //         </MenuItem>
        
// //         {/* Feasibility Button - Show for all statuses */}
// //         <MenuItem 
// //           onClick={() => {
// //             onFeasibility(item);
// //             onClose();
// //           }}
// //           sx={{ py: 1.5 }}
// //         >
// //           <ListItemIcon sx={{ color: '#06B6D4', minWidth: 36 }}>
// //             <ScienceIcon fontSize="small" />
// //           </ListItemIcon>
// //           <ListItemText>
// //             <Typography variant="body2" fontWeight={500} sx={{ color: '#06B6D4', fontSize: '0.75rem' }}>
// //               Feasibility
// //             </Typography>
// //           </ListItemText>
// //         </MenuItem>
        
// //         {/* Drawings Button - Show for all statuses */}
// //         <MenuItem 
// //           onClick={() => {
// //             onDrawings(item);
// //             onClose();
// //           }}
// //           sx={{ py: 1.5 }}
// //         >
// //           <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
// //             <ImageIcon fontSize="small" />
// //           </ListItemIcon>
// //           <ListItemText>
// //             <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
// //               Drawings
// //             </Typography>
// //           </ListItemText>
// //         </MenuItem>
        
// //         {/* Follow-up Button - Show for all statuses */}
// //         <MenuItem 
// //           onClick={() => {
// //             onFollowup(item);
// //             onClose();
// //           }}
// //           sx={{ py: 1.5 }}
// //         >
// //           <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
// //             <MessageIcon fontSize="small" />
// //           </ListItemIcon>
// //           <ListItemText>
// //             <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
// //               Add Follow-up
// //             </Typography>
// //           </ListItemText>
// //         </MenuItem>
        
// //         {hasAvailableTransitions && (
// //           <MenuItem 
// //             onClick={() => {
// //               onStatusUpdate(item);
// //               onClose();
// //             }}
// //             sx={{ py: 1.5 }}
// //           >
// //             <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
// //               <UpdateIcon fontSize="small" />
// //             </ListItemIcon>
// //             <ListItemText>
// //               <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
// //                 Update Status
// //               </Typography>
// //             </ListItemText>
// //           </MenuItem>
// //         )}
        
// //         {isWon && (
// //           <MenuItem 
// //             onClick={() => {
// //               onConvert(item);
// //               onClose();
// //             }}
// //             sx={{ py: 1.5 }}
// //           >
// //             <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
// //               <BusinessIcon fontSize="small" />
// //             </ListItemIcon>
// //             <ListItemText>
// //               <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
// //                 Convert to Customer
// //               </Typography>
// //             </ListItemText>
// //           </MenuItem>
// //         )}
        
// //         <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        
// //         <MenuItem 
// //           onClick={() => {
// //             onDelete(item);
// //             onClose();
// //           }}
// //           sx={{ py: 1.5 }}
// //         >
// //           <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
// //             <DeleteIcon fontSize="small" />
// //           </ListItemIcon>
// //           <ListItemText>
// //             <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
// //               Delete
// //             </Typography>
// //           </ListItemText>
// //         </MenuItem>
// //       </Menu>
// //     </>
// //   );
// // };

// // const LeadsMaster = () => {
// //   // State for data
// //   const [leads, setLeads] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [searchInput, setSearchInput] = useState('');
  
// //   // Pagination state
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(10);
// //   const [totalItems, setTotalItems] = useState(0);
  
// //   // Selection state
// //   const [selected, setSelected] = useState([]);
  
// //   // Menu state
// //   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
// //   const [selectedLeadForAction, setSelectedLeadForAction] = useState(null);
  
// //   // Modal state
// //   const [openAddModal, setOpenAddModal] = useState(false);
// //   const [openEditModal, setOpenEditModal] = useState(false);
// //   const [openViewModal, setOpenViewModal] = useState(false);
// //   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
// //   const [openStatusPopup, setOpenStatusPopup] = useState(false);
// //   const [openConvertPopup, setOpenConvertPopup] = useState(false);
// //   const [openFollowupPopup, setOpenFollowupPopup] = useState(false);
// //   const [openDrawingsPopup, setOpenDrawingsPopup] = useState(false);
// //   const [openFeasibilityPopup, setOpenFeasibilityPopup] = useState(false);
// //   const [openFeasibilityCheckPopup, setOpenFeasibilityCheckPopup] = useState(false);
// //   const [selectedLead, setSelectedLead] = useState(null);
  
// //   // Notification state
// //   const [snackbar, setSnackbar] = useState({
// //     open: false,
// //     message: '',
// //     severity: 'success'
// //   });

// //   // Debounce search
// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       setSearchTerm(searchInput);
// //       setPage(0);
// //     }, 500);
// //     return () => clearTimeout(timer);
// //   }, [searchInput]);

// //   // Fetch leads from API
// //   const fetchLeads = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('token');
      
// //       const params = new URLSearchParams({
// //         page: page + 1,
// //         limit: rowsPerPage
// //       });
      
// //       if (searchTerm) {
// //         params.append('search', searchTerm);
// //       }
      
// //       const response = await axios.get(`${BASE_URL}/api/leads?${params.toString()}`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       });

// //       if (response.data.success) {
// //         setLeads(response.data.data || []);
// //         setTotalItems(response.data.pagination.total);
// //       } else {
// //         showNotification('Failed to load leads', 'error');
// //       }
// //     } catch (err) {
// //       console.error('Error fetching leads:', err);
// //       showNotification('Failed to load leads', 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [page, rowsPerPage, searchTerm]);

// //   useEffect(() => {
// //     fetchLeads();
// //   }, [fetchLeads]);

// //   const handleRefresh = () => {
// //     fetchLeads();
// //     showNotification('Data refreshed', 'success');
// //   };
  
// //   const handleSelectAll = (event) => {
// //     if (event.target.checked) {
// //       setSelected(leads.map(lead => lead._id));
// //     } else {
// //       setSelected([]);
// //     }
// //   };
  
// //   const handleSelect = (id) => {
// //     const selectedIndex = selected.indexOf(id);
// //     let newSelected = [];
    
// //     if (selectedIndex === -1) {
// //       newSelected = newSelected.concat(selected, id);
// //     } else {
// //       newSelected = selected.filter(item => item !== id);
// //     }
    
// //     setSelected(newSelected);
// //   };
  
// //   const handleChangePage = (event, newPage) => {
// //     setPage(newPage);
// //     setSelected([]);
// //   };
  
// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(parseInt(event.target.value, 10));
// //     setPage(0);
// //     setSelected([]);
// //   };
  
// //   const handleAddLead = () => {
// //     fetchLeads();
// //     showNotification('Lead added successfully!', 'success');
// //   };
  
// //   const handleEditLead = () => {
// //     fetchLeads();
// //     showNotification('Lead updated successfully!', 'success');
// //   };
  
// //   const handleDeleteLead = () => {
// //     fetchLeads();
// //     setSelected([]);
// //     showNotification('Lead deleted successfully!', 'success');
// //   };
  
// //   const handleStatusUpdate = () => {
// //     fetchLeads();
// //     showNotification('Status updated successfully!', 'success');
// //   };
  
// //   const handleConvertLead = () => {
// //     fetchLeads();
// //     showNotification('Lead converted to customer successfully!', 'success');
// //   };
  
// //   const handleFollowup = () => {
// //     fetchLeads();
// //     showNotification('Follow-up added successfully!', 'success');
// //   };
  
// //   const handleDrawingUpload = () => {
// //     fetchLeads();
// //     showNotification('Drawing uploaded successfully!', 'success');
// //   };
  
// //   const handleFeasibilityUpdate = () => {
// //     fetchLeads();
// //     showNotification('Feasibility updated successfully!', 'success');
// //   };
  
// //   const handleActionMenuOpen = (event, lead) => {
// //     setActionMenuAnchor(event.currentTarget);
// //     setSelectedLeadForAction(lead);
// //   };

// //   const handleActionMenuClose = () => {
// //     setActionMenuAnchor(null);
// //     setSelectedLeadForAction(null);
// //   };

// //   const openEditLeadModal = (lead) => {
// //     setSelectedLead(lead);
// //     setOpenEditModal(true);
// //     handleActionMenuClose();
// //   };
  
// //   const openViewLeadModal = (lead) => {
// //     setSelectedLead(lead);
// //     setOpenViewModal(true);
// //     handleActionMenuClose();
// //   };
  
// //   const openDeleteLeadDialog = (lead) => {
// //     setSelectedLead(lead);
// //     setOpenDeleteDialog(true);
// //     handleActionMenuClose();
// //   };
  
// //   const openStatusUpdatePopup = (lead) => {
// //     setSelectedLead(lead);
// //     setOpenStatusPopup(true);
// //     handleActionMenuClose();
// //   };
  
// //   const openConvertPopupModal = (lead) => {
// //     setSelectedLead(lead);
// //     setOpenConvertPopup(true);
// //     handleActionMenuClose();
// //   };
  
// //   const openFollowupPopupModal = (lead) => {
// //     setSelectedLead(lead);
// //     setOpenFollowupPopup(true);
// //     handleActionMenuClose();
// //   };
  
// //   const openDrawingsPopupModal = (lead) => {
// //     setSelectedLead(lead);
// //     setOpenDrawingsPopup(true);
// //     handleActionMenuClose();
// //   };
  
// //   const openFeasibilityPopupModal = (lead) => {
// //     setSelectedLead(lead);
// //     setOpenFeasibilityPopup(true);
// //     handleActionMenuClose();
// //   };
  
// //   const openFeasibilityCheckPopupModal = (lead) => {
// //     setSelectedLead(lead);
// //     setOpenFeasibilityCheckPopup(true);
// //     handleActionMenuClose();
// //   };
  
// //   const showNotification = (message, severity) => {
// //     setSnackbar({
// //       open: true,
// //       message,
// //       severity
// //     });
// //   };
  
// //   const formatDate = (dateString) => {
// //     if (!dateString) return '-';
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric'
// //     });
// //   };
  
// //   const getLeadInitials = (lead) => {
// //     if (!lead.company_name) return 'LD';
// //     return lead.company_name.substring(0, 2).toUpperCase();
// //   };
  
// //   const getAvatarColor = (lead) => {
// //     if (!lead.company_name) return COLORS.primary;
// //     const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
// //     const charCode = lead.company_name.charCodeAt(0) || 0;
// //     return colors[charCode % colors.length];
// //   };

// //   return (
// //     <Box sx={{ p: 2.5 }}>
// //       {/* Page Header */}
// //       <Box sx={{ mb: 2.5 }}>
// //         <Typography 
// //           variant="h5" 
// //           component="h1" 
// //           sx={{ 
// //             fontSize: '1.25rem',
// //             fontWeight: 700,
// //             color: COLORS.text.primary,
// //             mb: 0.5
// //           }}
// //         >
// //           Leads Master
// //         </Typography>
// //         <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
// //           Manage leads, track status, and follow up with potential customers
// //         </Typography>
// //       </Box>

// //       {/* Action Bar */}
// //       <Paper sx={{ 
// //         p: 1.5, 
// //         mb: 2.5, 
// //         borderRadius: 2,
// //         bgcolor: COLORS.background.white,
// //         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
// //         border: `1px solid ${COLORS.border}`
// //       }}>
// //         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
// //           {/* Search */}
// //           <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
// //             <TextField
// //               placeholder="Search by Lead ID, Company, Contact, or Subject..."
// //               size="small"
// //               value={searchInput}
// //               onChange={(e) => setSearchInput(e.target.value)}
// //               sx={{ 
// //                 width: { xs: '100%', sm: 450 },
// //                 '& .MuiOutlinedInput-root': {
// //                   borderRadius: 1.5,
// //                   fontSize: '0.75rem',
// //                   '&:hover fieldset': {
// //                     borderColor: COLORS.primary,
// //                   },
// //                 }
// //               }}
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
// //                   </InputAdornment>
// //                 ),
// //                 sx: { 
// //                   height: 36,
// //                   bgcolor: COLORS.background.light,
// //                   '& input': {
// //                     padding: '6px 12px',
// //                     fontSize: '0.75rem',
// //                     color: COLORS.text.primary,
// //                     '&::placeholder': {
// //                       color: COLORS.text.tertiary,
// //                       fontSize: '0.75rem'
// //                     }
// //                   }
// //                 }
// //               }}
// //               disabled={loading}
// //             />
// //           </Stack>

// //           {/* Action Buttons */}
// //           <Stack direction="row" spacing={1.5} alignItems="center">
// //             {selected.length > 0 && (
// //               <Button
// //                 variant="outlined"
// //                 color="error"
// //                 startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
// //                 sx={{ 
// //                   height: 36,
// //                   borderRadius: 1.5,
// //                   textTransform: 'none',
// //                   fontSize: '0.75rem',
// //                   fontWeight: 500,
// //                   borderColor: '#fee2e2',
// //                   color: '#991b1b',
// //                   '&:hover': {
// //                     borderColor: '#fecaca',
// //                     bgcolor: '#fee2e2'
// //                   }
// //                 }}
// //                 disabled={loading}
// //               >
// //                 Delete ({selected.length})
// //               </Button>
// //             )}
// //             <Button
// //               variant="contained"
// //               startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
// //               onClick={() => setOpenAddModal(true)}
// //               sx={{
// //                 height: 36,
// //                 borderRadius: 1.5,
// //                 bgcolor: COLORS.primary,
// //                 fontSize: '0.75rem',
// //                 fontWeight: 500,
// //                 textTransform: 'none',
// //                 boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
// //                 '&:hover': {
// //                   bgcolor: COLORS.primaryDark,
// //                 }
// //               }}
// //               disabled={loading}
// //             >
// //               Add Lead
// //             </Button>
// //           </Stack>
// //         </Stack>
// //       </Paper>

// //       {/* Leads Table */}
// //       <Paper sx={{ 
// //         width: '100%', 
// //         borderRadius: 2, 
// //         overflow: 'hidden',
// //         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
// //         border: `1px solid ${COLORS.border}`
// //       }}>
// //         <TableContainer>
// //           <Table size="small">
// //             <TableHead>
// //               <TableRow sx={{ 
// //                 bgcolor: COLORS.background.tableHeader,
// //                 '& .MuiTableCell-root': {
// //                   borderBottom: 'none',
// //                   color: COLORS.text.light,
// //                   py: 1.5
// //                 }
// //               }}>
// //                 <TableCell padding="checkbox" sx={{ width: 40 }}>
// //                   <Checkbox
// //                     indeterminate={selected.length > 0 && selected.length < leads.length}
// //                     checked={leads.length > 0 && selected.length === leads.length}
// //                     onChange={handleSelectAll}
// //                     sx={{
// //                       color: COLORS.text.light,
// //                       '&.Mui-checked': {
// //                         color: COLORS.text.light,
// //                       },
// //                       '&.MuiCheckbox-indeterminate': {
// //                         color: COLORS.text.light,
// //                       },
// //                       '& .MuiSvgIcon-root': {
// //                         fontSize: '1.25rem'
// //                       }
// //                     }}
// //                     disabled={loading || leads.length === 0}
// //                   />
// //                 </TableCell>
// //                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                   Lead ID / Company
// //                 </TableCell>
// //                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                   Subject
// //                 </TableCell>
// //                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                   Contact
// //                 </TableCell>
// //                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                   Status
// //                 </TableCell>
// //                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                   Priority
// //                 </TableCell>
// //                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                   Est. Value
// //                 </TableCell>
// //                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                   Created Date
// //                 </TableCell>
// //                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
// //                   Actions
// //                 </TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {loading ? (
// //                 <TableRow>
// //                   <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
// //                     <CircularProgress size={32} sx={{ color: COLORS.primary }} />
// //                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
// //                       Loading leads...
// //                     </Typography>
// //                   </TableCell>
// //                 </TableRow>
// //               ) : leads.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
// //                     <Box sx={{ textAlign: 'center' }}>
// //                       <BusinessIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
// //                       <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
// //                         {searchTerm ? 'No leads found' : 'No leads available'}
// //                       </Typography>
// //                       <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
// //                         {searchTerm ? 'Try adjusting your search terms' : 'Add your first lead to get started'}
// //                       </Typography>
// //                     </Box>
// //                   </TableCell>
// //                 </TableRow>
// //               ) : (
// //                 leads.map((lead) => {
// //                   const isSelected = selected.includes(lead._id);
// //                   const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedLeadForAction?._id === lead._id;
// //                   const avatarColor = getAvatarColor(lead);
// //                   const statusColors = STATUS_COLORS[lead.status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
// //                   const priorityColors = PRIORITY_COLORS[lead.priority] || { bg: '#F1F5F9', color: '#475569' };

// //                   return (
// //                     <TableRow
// //                       key={lead._id}
// //                       hover
// //                       selected={isSelected}
// //                       sx={{ 
// //                         bgcolor: COLORS.background.white,
// //                         '&:hover': {
// //                           bgcolor: COLORS.background.hover
// //                         },
// //                         '&.Mui-selected': {
// //                           bgcolor: `${COLORS.primary}10`,
// //                           '&:hover': {
// //                             bgcolor: `${COLORS.primary}20`
// //                           }
// //                         },
// //                         '& .MuiTableCell-root': {
// //                           py: 1.5,
// //                           fontSize: '0.75rem',
// //                           borderColor: COLORS.border
// //                         }
// //                       }}
// //                     >
// //                       <TableCell padding="checkbox" sx={{ width: 40 }}>
// //                         <Checkbox
// //                           checked={isSelected}
// //                           onChange={() => handleSelect(lead._id)}
// //                           sx={{
// //                             color: COLORS.primary,
// //                             '&.Mui-checked': {
// //                               color: COLORS.primary,
// //                             },
// //                             '& .MuiSvgIcon-root': {
// //                               fontSize: '1.25rem'
// //                             }
// //                           }}
// //                         />
// //                       </TableCell>
// //                       <TableCell>
// //                         <Stack direction="row" spacing={1.5} alignItems="center">
// //                           <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
// //                             {getLeadInitials(lead)}
// //                           </Avatar>
// //                           <Box>
// //                             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
// //                               {lead.company_name}
// //                             </Typography>
// //                             <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
// //                               ID: {lead.lead_id}
// //                             </Typography>
// //                           </Box>
// //                         </Stack>
// //                       </TableCell>
// //                       <TableCell>
// //                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
// //                           {lead.subject}
// //                         </Typography>
// //                         {lead.lead_source && (
// //                           <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
// //                             {lead.lead_source} {lead.lead_source_detail && `(${lead.lead_source_detail})`}
// //                           </Typography>
// //                         )}
// //                       </TableCell>
// //                       <TableCell>
// //                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
// //                           {lead.contact_name}
// //                         </Typography>
// //                         {lead.contact_mobile && (
// //                           <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
// //                             {lead.contact_mobile}
// //                           </Typography>
// //                         )}
// //                       </TableCell>
// //                       <TableCell>
// //                         <Chip
// //                           label={lead.status || 'New'}
// //                           size="small"
// //                           sx={{ 
// //                             fontSize: '0.65rem',
// //                             fontWeight: 500,
// //                             height: 24,
// //                             bgcolor: statusColors.bg,
// //                             color: statusColors.color,
// //                             border: `1px solid ${statusColors.border}`
// //                           }}
// //                         />
// //                       </TableCell>
// //                       <TableCell>
// //                         <Chip
// //                           label={lead.priority || 'Medium'}
// //                           size="small"
// //                           sx={{ 
// //                             fontSize: '0.65rem',
// //                             fontWeight: 500,
// //                             height: 24,
// //                             bgcolor: priorityColors.bg,
// //                             color: priorityColors.color
// //                           }}
// //                         />
// //                       </TableCell>
// //                       <TableCell>
// //                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
// //                           {lead.estimated_value ? `₹${lead.estimated_value.toLocaleString()}` : '-'}
// //                         </Typography>
// //                       </TableCell>
// //                       <TableCell>
// //                         <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
// //                           {formatDate(lead.createdAt)}
// //                         </Typography>
// //                       </TableCell>
// //                       <TableCell align="center" sx={{ width: 60 }}>
// //                         <ActionMenu 
// //                           item={lead}
// //                           onView={openViewLeadModal}
// //                           onEdit={openEditLeadModal}
// //                           onDelete={openDeleteLeadDialog}
// //                           onStatusUpdate={openStatusUpdatePopup}
// //                           onConvert={openConvertPopupModal}
// //                           onFollowup={openFollowupPopupModal}
// //                           onDrawings={openDrawingsPopupModal}
// //                           onFeasibility={openFeasibilityPopupModal}
// //                           onFeasibilityCheck={openFeasibilityCheckPopupModal}
// //                           anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
// //                           onClose={handleActionMenuClose}
// //                           onOpen={(e) => handleActionMenuOpen(e, lead)}
// //                         />
// //                       </TableCell>
// //                     </TableRow>
// //                   );
// //                 })
// //               )}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>

// //         {/* Pagination */}
// //         <TablePagination
// //           rowsPerPageOptions={[5, 10, 25, 50]}
// //           component="div"
// //           count={totalItems}
// //           rowsPerPage={rowsPerPage}
// //           page={page}
// //           onPageChange={handleChangePage}
// //           onRowsPerPageChange={handleChangeRowsPerPage}
// //           sx={{
// //             borderTop: `1px solid ${COLORS.border}`,
// //             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
// //               fontSize: '0.7rem',
// //               color: COLORS.text.secondary
// //             },
// //             '& .MuiTablePagination-select': {
// //               fontSize: '0.7rem'
// //             },
// //             '& .MuiTablePagination-actions button': {
// //               color: COLORS.primary,
// //             }
// //           }}
// //         />
// //       </Paper>

// //       {/* Modal Components */}
// //       <AddLead 
// //         open={openAddModal}
// //         onClose={() => setOpenAddModal(false)}
// //         onAdd={handleAddLead}
// //       />

// //       {selectedLead && (
// //         <>
// //           <EditLead 
// //             open={openEditModal}
// //             onClose={() => {
// //               setOpenEditModal(false);
// //               setSelectedLead(null);
// //             }}
// //             lead={selectedLead}
// //             onUpdate={handleEditLead}
// //           />

// //           <ViewLead 
// //             open={openViewModal}
// //             onClose={() => {
// //               setOpenViewModal(false);
// //               setSelectedLead(null);
// //             }}
// //             lead={selectedLead}
// //             onEdit={() => {
// //               setOpenViewModal(false);
// //               setOpenEditModal(true);
// //             }}
// //           />

// //           <DeleteLead 
// //             open={openDeleteDialog}
// //             onClose={() => {
// //               setOpenDeleteDialog(false);
// //               setSelectedLead(null);
// //             }}
// //             lead={selectedLead}
// //             onDelete={handleDeleteLead}
// //           />

// //           <StatusUpdatePopup
// //             open={openStatusPopup}
// //             onClose={() => {
// //               setOpenStatusPopup(false);
// //               setSelectedLead(null);
// //             }}
// //             lead={selectedLead}
// //             onStatusUpdate={handleStatusUpdate}
// //           />

// //           <ConvertLeadPopup
// //             open={openConvertPopup}
// //             onClose={() => {
// //               setOpenConvertPopup(false);
// //               setSelectedLead(null);
// //             }}
// //             lead={selectedLead}
// //             onConvert={handleConvertLead}
// //           />

// //           <FollowupPopup
// //             open={openFollowupPopup}
// //             onClose={() => {
// //               setOpenFollowupPopup(false);
// //               setSelectedLead(null);
// //             }}
// //             lead={selectedLead}
// //             onFollowup={handleFollowup}
// //           />

// //           <DrawingsPopup
// //             open={openDrawingsPopup}
// //             onClose={() => {
// //               setOpenDrawingsPopup(false);
// //               setSelectedLead(null);
// //             }}
// //             lead={selectedLead}
// //             onDrawingUpload={handleDrawingUpload}
// //           />

// //           <FeasibilityPopup
// //             open={openFeasibilityPopup}
// //             onClose={() => {
// //               setOpenFeasibilityPopup(false);
// //               setSelectedLead(null);
// //             }}
// //             lead={selectedLead}
// //             onFeasibilityUpdate={handleFeasibilityUpdate}
// //           />

// //           <FeasibilityCheckPopup
// //             open={openFeasibilityCheckPopup}
// //             onClose={() => {
// //               setOpenFeasibilityCheckPopup(false);
// //               setSelectedLead(null);
// //             }}
// //             lead={selectedLead}
// //           />
// //         </>
// //       )}

// //       {/* Snackbar Notification */}
// //       <Snackbar
// //         open={snackbar.open}
// //         autoHideDuration={3000}
// //         onClose={() => setSnackbar({...snackbar, open: false})}
// //         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// //       >
// //         <Alert 
// //           onClose={() => setSnackbar({...snackbar, open: false})} 
// //           severity={snackbar.severity}
// //           variant="filled"
// //           sx={{ 
// //             width: '100%',
// //             borderRadius: 1.5,
// //             fontSize: '0.75rem',
// //             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
// //           }}
// //         >
// //           {snackbar.message}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default LeadsMaster;









// 'use strict';
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
//   TableRow, IconButton, Button, TextField, InputAdornment, Tooltip,
//   Typography, Snackbar, TablePagination, Checkbox, Stack, Chip,
//   Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider,
//   Alert, CircularProgress
// } from '@mui/material';
// import {
//   Search as SearchIcon, Add as AddIcon, Delete as DeleteIcon,
//   Visibility as ViewIcon, Edit as EditIcon, MoreVert as MoreVertIcon,
//   Business as BusinessIcon, Update as UpdateIcon, Message as MessageIcon,
//   Image as ImageIcon, Science as ScienceIcon, Assessment as AssessmentIcon,
//   CheckCircle as CheckCircleIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import AddLead from './AddLead';
// import EditLead from './EditLead';
// import ViewLead from './ViewLead';
// import DeleteLead from './DeleteLead';
// import StatusUpdatePopup from './StatusUpdatePopup';
// import ConvertLeadPopup from './ConvertLeadPopup';
// import FollowupPopup from './FollowupPopup';
// import DrawingsPopup from './DrawingsPopup';
// import FeasibilityPopup from './FeasibilityPopup';
// import FeasibilityCheckPopup from './FeasibilityCheckPopup';
// import { COLORS, STATUS_COLORS, PRIORITY_COLORS, STATUS_TRANSITIONS } from './constants';

// // ─── terminal statuses per backend state machine ──────────────────────────────
// const TERMINAL_STATUSES = ['Won', 'Lost', 'Junk'];

// // ─── Action Menu ──────────────────────────────────────────────────────────────
// const ActionMenu = ({
//   item, anchorEl, onOpen, onClose,
//   onView, onEdit, onDelete, onStatusUpdate,
//   onConvert, onFollowup, onDrawings, onFeasibility, onFeasibilityCheck,
// }) => {
//   const currentStatus       = item?.status || 'New';
//   const isTerminal          = TERMINAL_STATUSES.includes(currentStatus);
//   const hasNextTransitions  = (STATUS_TRANSITIONS[currentStatus] || []).length > 0;
//   // FIX 1 — Convert only if Won AND not already converted
//   const canConvert          = currentStatus === 'Won' && !item?.is_converted;
//   const isConverted         = currentStatus === 'Won' && item?.is_converted;
//   // FIX 2 — Feasibility only meaningful when items exist
//   const hasEnquiredItems    = (item?.enquired_items?.length || 0) > 0;

//   const menuItem = (onClick, icon, label, color = COLORS.text.primary, disabled = false, tooltipMsg = '') => {
//     const el = (
//       <MenuItem
//         onClick={() => { if (!disabled) { onClick(); onClose(); } }}
//         sx={{
//           py: 1.5,
//           opacity: disabled ? 0.4 : 1,
//           cursor: disabled ? 'not-allowed' : 'pointer',
//           pointerEvents: disabled ? 'none' : 'auto',
//         }}
//       >
//         <ListItemIcon sx={{ color, minWidth: 36 }}>{icon}</ListItemIcon>
//         <ListItemText>
//           <Typography variant="body2" fontWeight={500} sx={{ color, fontSize: '0.75rem' }}>
//             {label}
//           </Typography>
//         </ListItemText>
//       </MenuItem>
//     );
//     return disabled && tooltipMsg
//       ? <Tooltip key={label} title={tooltipMsg} placement="left">{el}</Tooltip>
//       : <React.Fragment key={label}>{el}</React.Fragment>;
//   };

//   return (
//     <>
//       <Tooltip title="Actions">
//         <IconButton
//           size="small"
//           onClick={onOpen}
//           sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}
//         >
//           <MoreVertIcon fontSize="small" />
//         </IconButton>
//       </Tooltip>

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={onClose}
//         PaperProps={{
//           elevation: 3,
//           sx: {
//             mt: 1, minWidth: 200, borderRadius: 2,
//             border: `1px solid ${COLORS.border}`,
//             boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
//           },
//         }}
//       >
//         {menuItem(() => onView(item),  <ViewIcon fontSize="small" />, 'View details')}
//         {menuItem(
//           () => onEdit(item),
//           <EditIcon fontSize="small" />,
//           'Edit',
//           isTerminal ? COLORS.text.tertiary : COLORS.text.primary,
//           isTerminal,
//           `Lead is ${currentStatus} — editing is disabled`
//         )}

//         <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />

//         {menuItem(
//           () => onFeasibilityCheck(item),
//           <AssessmentIcon fontSize="small" />,
//           'Feasibility check',
//           hasEnquiredItems ? '#8B5CF6' : COLORS.text.tertiary,
//           !hasEnquiredItems,
//           'Add enquired items first before running feasibility check'
//         )}
//         {menuItem(
//           () => onFeasibility(item),
//           <ScienceIcon fontSize="small" />,
//           'Submit feasibility',
//           hasEnquiredItems ? '#06B6D4' : COLORS.text.tertiary,
//           !hasEnquiredItems,
//           'Add enquired items first'
//         )}
//         {menuItem(() => onDrawings(item), <ImageIcon fontSize="small" />, 'Drawings', '#8B5CF6')}
//         {menuItem(
//           () => onFollowup(item),
//           <MessageIcon fontSize="small" />,
//           'Add follow-up',
//           isTerminal ? COLORS.text.tertiary : '#10B981',
//           isTerminal,
//           `Lead is ${currentStatus} — no follow-ups on closed leads`
//         )}

//         <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />

//         {hasNextTransitions && menuItem(
//           () => onStatusUpdate(item),
//           <UpdateIcon fontSize="small" />,
//           'Update status',
//           COLORS.primary
//         )}

//         {/* FIX 1 — show Convert only if Won and NOT yet converted */}
//         {canConvert && menuItem(
//           () => onConvert(item),
//           <BusinessIcon fontSize="small" />,
//           'Convert to customer',
//           '#10B981'
//         )}

//         {/* Show "already converted" badge instead of button */}
//         {isConverted && (
//           <MenuItem disabled sx={{ py: 1.5, opacity: 0.6 }}>
//             <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
//               <CheckCircleIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
//                 Already converted
//               </Typography>
//             </ListItemText>
//           </MenuItem>
//         )}

//         <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />

//         {menuItem(() => onDelete(item), <DeleteIcon fontSize="small" />, 'Delete', '#EF4444')}
//       </Menu>
//     </>
//   );
// };

// // ─── Main component ───────────────────────────────────────────────────────────
// const LeadsMaster = () => {
//   const [leads,               setLeads]               = useState([]);
//   const [loading,             setLoading]             = useState(true);
//   // FIX — keep searchInput (typed) and searchTerm (debounced) separate
//   const [searchInput,         setSearchInput]         = useState('');
//   const [searchTerm,          setSearchTerm]          = useState('');
//   const [page,                setPage]                = useState(0);
//   const [rowsPerPage,         setRowsPerPage]         = useState(10);
//   const [totalItems,          setTotalItems]          = useState(0);
//   const [selected,            setSelected]            = useState([]);
//   const [actionMenuAnchor,    setActionMenuAnchor]    = useState(null);
//   const [selectedLeadForMenu, setSelectedLeadForMenu] = useState(null);
//   const [selectedLead,        setSelectedLead]        = useState(null);
//   const [snackbar,            setSnackbar]            = useState({ open: false, message: '', severity: 'success' });

//   // modal open states
//   const [openAdd,              setOpenAdd]              = useState(false);
//   const [openEdit,             setOpenEdit]             = useState(false);
//   const [openView,             setOpenView]             = useState(false);
//   const [openDelete,           setOpenDelete]           = useState(false);
//   const [openStatus,           setOpenStatus]           = useState(false);
//   const [openConvert,          setOpenConvert]          = useState(false);
//   const [openFollowup,         setOpenFollowup]         = useState(false);
//   const [openDrawings,         setOpenDrawings]         = useState(false);
//   const [openFeasibility,      setOpenFeasibility]      = useState(false);
//   const [openFeasibilityCheck, setOpenFeasibilityCheck] = useState(false);

//   // ── debounce search ──────────────────────────────────────────────────────
//   useEffect(() => {
//     const t = setTimeout(() => { setSearchTerm(searchInput); setPage(0); }, 500);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   // ── fetch leads ──────────────────────────────────────────────────────────
//   // FIX — backend getLeads uses `company_name` param for text search (searches
//   // company_name, contact_name, subject via $or). Changed from `search` to `company_name`.
//   const fetchLeads = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token  = localStorage.getItem('token');
//       const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
//       if (searchTerm) params.append('company_name', searchTerm); // ← correct param name

//       const res = await axios.get(`${BASE_URL}/api/leads?${params}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         setLeads(res.data.data || []);
//         setTotalItems(res.data.pagination?.total || 0);
//       } else {
//         notify('Failed to load leads', 'error');
//       }
//     } catch {
//       notify('Failed to load leads', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [page, rowsPerPage, searchTerm]);

//   useEffect(() => { fetchLeads(); }, [fetchLeads]);

//   // ── helpers ──────────────────────────────────────────────────────────────
//   const notify = (message, severity = 'success') =>
//     setSnackbar({ open: true, message, severity });

//   const openModal = (setter, lead = null) => {
//     if (lead) setSelectedLead(lead);
//     setter(true);
//     setActionMenuAnchor(null);
//     setSelectedLeadForMenu(null);
//   };

//   const closeModal = (setter) => {
//     setter(false);
//     setSelectedLead(null);
//   };

//   const afterAction = (setter, message) => () => {
//     closeModal(setter);
//     fetchLeads();
//     notify(message);
//   };

//   // ── selection ────────────────────────────────────────────────────────────
//   const handleSelectAll = (e) =>
//     setSelected(e.target.checked ? leads.map(l => l._id) : []);

//   const handleSelect = (id) =>
//     setSelected(prev =>
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     );

//   // ── pagination ───────────────────────────────────────────────────────────
//   const handleChangePage = (_, newPage) => { setPage(newPage); setSelected([]); };
//   const handleChangeRows = (e) => {
//     setRowsPerPage(parseInt(e.target.value, 10));
//     setPage(0);
//     setSelected([]);
//   };

//   // ── formatting ───────────────────────────────────────────────────────────
//   const formatDate = (d) =>
//     d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

//   const getInitials = (lead) =>
//     lead.company_name ? lead.company_name.substring(0, 2).toUpperCase() : 'LD';

//   const getAvatarColor = (lead) => {
//     const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
//     return colors[(lead.company_name?.charCodeAt(0) || 0) % colors.length];
//   };

//   // ── render ───────────────────────────────────────────────────────────────
//   return (
//     <Box sx={{ p: 2.5 }}>
//       {/* Header */}
//       <Box sx={{ mb: 2.5 }}>
//         <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
//           Leads Master
//         </Typography>
//         <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
//           Manage leads, track status, and follow up with potential customers
//         </Typography>
//       </Box>

//       {/* Action bar */}
//       <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, border: `1px solid ${COLORS.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
//           <TextField
//             placeholder="Search by company, contact, subject, lead ID..."
//             size="small"
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//             disabled={loading}
//             sx={{
//               width: { xs: '100%', sm: 450 },
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 1.5, fontSize: '0.75rem',
//                 '&:hover fieldset': { borderColor: COLORS.primary },
//               },
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
//                 </InputAdornment>
//               ),
//               sx: {
//                 height: 36, bgcolor: COLORS.background.light,
//                 '& input': { padding: '6px 12px', fontSize: '0.75rem', color: COLORS.text.primary },
//               },
//             }}
//           />
//           <Stack direction="row" spacing={1.5} alignItems="center">
//             {selected.length > 0 && (
//               <Button
//                 variant="outlined" color="error"
//                 startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
//                 sx={{ height: 36, borderRadius: 1.5, textTransform: 'none', fontSize: '0.75rem', fontWeight: 500 }}
//                 disabled={loading}
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}
//             <Button
//               variant="contained"
//               startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//               onClick={() => setOpenAdd(true)}
//               sx={{
//                 height: 36, borderRadius: 1.5, bgcolor: COLORS.primary,
//                 fontSize: '0.75rem', fontWeight: 500, textTransform: 'none',
//                 '&:hover': { bgcolor: COLORS.primaryDark },
//               }}
//               disabled={loading}
//             >
//               Add Lead
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* Table */}
//       <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
//         <TableContainer>
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ bgcolor: COLORS.background.tableHeader, '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.light, py: 1.5 } }}>
//                 <TableCell padding="checkbox" sx={{ width: 40 }}>
//                   <Checkbox
//                     indeterminate={selected.length > 0 && selected.length < leads.length}
//                     checked={leads.length > 0 && selected.length === leads.length}
//                     onChange={handleSelectAll}
//                     disabled={loading || leads.length === 0}
//                     sx={{ color: COLORS.text.light, '&.Mui-checked': { color: COLORS.text.light }, '&.MuiCheckbox-indeterminate': { color: COLORS.text.light }, '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }}
//                   />
//                 </TableCell>
//                 {['Lead ID / Company', 'Subject', 'Contact', 'Status', 'Priority', 'Est. Value', 'Created', 'Actions'].map(h => (
//                   <TableCell key={h} align={h === 'Actions' ? 'center' : 'left'} sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: h === 'Actions' ? 60 : 'auto' }}>
//                     {h}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
//                     <CircularProgress size={32} sx={{ color: COLORS.primary }} />
//                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading leads...</Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : leads.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
//                     <BusinessIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
//                     <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
//                       {searchTerm ? 'No leads found' : 'No leads available'}
//                     </Typography>
//                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
//                       {searchTerm ? 'Try adjusting your search terms' : 'Add your first lead to get started'}
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : leads.map((lead) => {
//                 const isSelected     = selected.includes(lead._id);
//                 const menuOpen       = Boolean(actionMenuAnchor) && selectedLeadForMenu?._id === lead._id;
//                 const statusColors   = STATUS_COLORS[lead.status]   || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
//                 const priorityColors = PRIORITY_COLORS[lead.priority] || { bg: '#F1F5F9', color: '#475569' };
//                 const isTerminal     = TERMINAL_STATUSES.includes(lead.status);

//                 return (
//                   <TableRow
//                     key={lead._id}
//                     hover
//                     selected={isSelected}
//                     sx={{
//                       bgcolor: COLORS.background.white,
//                       opacity: isTerminal ? 0.85 : 1,
//                       '&:hover': { bgcolor: COLORS.background.hover },
//                       '&.Mui-selected': { bgcolor: `${COLORS.primary}10`, '&:hover': { bgcolor: `${COLORS.primary}20` } },
//                       '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border },
//                     }}
//                   >
//                     <TableCell padding="checkbox" sx={{ width: 40 }}>
//                       <Checkbox
//                         checked={isSelected}
//                         onChange={() => handleSelect(lead._id)}
//                         sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary }, '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }}
//                       />
//                     </TableCell>

//                     <TableCell>
//                       <Stack direction="row" spacing={1.5} alignItems="center">
//                         <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(lead), fontSize: '0.7rem', fontWeight: 600 }}>
//                           {getInitials(lead)}
//                         </Avatar>
//                         <Box>
//                           <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
//                             {lead.company_name}
//                           </Typography>
//                           <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                             {lead.lead_id}
//                             {lead.is_converted && (
//                               <Chip label="Converted" size="small" sx={{ ml: 0.5, height: 14, fontSize: '0.55rem', bgcolor: '#E1F5EE', color: '#085041', border: '1px solid #9FE1CB' }} />
//                             )}
//                           </Typography>
//                         </Box>
//                       </Stack>
//                     </TableCell>

//                     <TableCell>
//                       <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{lead.subject}</Typography>
//                       {lead.lead_source && (
//                         <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                           {lead.lead_source}{lead.lead_source_detail ? ` (${lead.lead_source_detail})` : ''}
//                         </Typography>
//                       )}
//                     </TableCell>

//                     <TableCell>
//                       <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{lead.contact_name}</Typography>
//                       {lead.contact_mobile && (
//                         <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>{lead.contact_mobile}</Typography>
//                       )}
//                     </TableCell>

//                     <TableCell>
//                       <Chip
//                         label={lead.status || 'New'}
//                         size="small"
//                         sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: statusColors.bg, color: statusColors.color, border: `1px solid ${statusColors.border}` }}
//                       />
//                     </TableCell>

//                     <TableCell>
//                       <Chip
//                         label={lead.priority || 'Medium'}
//                         size="small"
//                         sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: priorityColors.bg, color: priorityColors.color }}
//                       />
//                     </TableCell>

//                     <TableCell>
//                       <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                         {lead.estimated_value ? `₹${lead.estimated_value.toLocaleString('en-IN')}` : '—'}
//                       </Typography>
//                     </TableCell>

//                     <TableCell>
//                       <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
//                         {formatDate(lead.createdAt)}
//                       </Typography>
//                     </TableCell>

//                     <TableCell align="center" sx={{ width: 60 }}>
//                       <ActionMenu
//                         item={lead}
//                         anchorEl={menuOpen ? actionMenuAnchor : null}
//                         onOpen={(e) => { setActionMenuAnchor(e.currentTarget); setSelectedLeadForMenu(lead); }}
//                         onClose={() => { setActionMenuAnchor(null); setSelectedLeadForMenu(null); }}
//                         onView={(l)             => openModal(setOpenView,             l)}
//                         onEdit={(l)             => openModal(setOpenEdit,             l)}
//                         onDelete={(l)           => openModal(setOpenDelete,           l)}
//                         onStatusUpdate={(l)     => openModal(setOpenStatus,           l)}
//                         onConvert={(l)          => openModal(setOpenConvert,          l)}
//                         onFollowup={(l)         => openModal(setOpenFollowup,         l)}
//                         onDrawings={(l)         => openModal(setOpenDrawings,         l)}
//                         onFeasibility={(l)      => openModal(setOpenFeasibility,      l)}
//                         onFeasibilityCheck={(l) => openModal(setOpenFeasibilityCheck, l)}
//                       />
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25, 50]}
//           component="div"
//           count={totalItems}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRows}
//           sx={{
//             borderTop: `1px solid ${COLORS.border}`,
//             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.7rem', color: COLORS.text.secondary },
//             '& .MuiTablePagination-select': { fontSize: '0.7rem' },
//             '& .MuiTablePagination-actions button': { color: COLORS.primary },
//           }}
//         />
//       </Paper>

//       {/* ── Modals ── */}
//       <AddLead open={openAdd} onClose={() => setOpenAdd(false)} onAdd={() => { setOpenAdd(false); fetchLeads(); notify('Lead added successfully!'); }} />

//       {selectedLead && (
//         <>
//           <EditLead
//             open={openEdit}
//             onClose={() => closeModal(setOpenEdit)}
//             lead={selectedLead}
//             onUpdate={afterAction(setOpenEdit, 'Lead updated successfully!')}
//           />
//           <ViewLead
//             open={openView}
//             onClose={() => closeModal(setOpenView)}
//             lead={selectedLead}
//             onEdit={() => { setOpenView(false); setOpenEdit(true); }}
//           />
//           <DeleteLead
//             open={openDelete}
//             onClose={() => closeModal(setOpenDelete)}
//             lead={selectedLead}
//             onDelete={afterAction(setOpenDelete, 'Lead deleted successfully!')}
//           />
//           <StatusUpdatePopup
//             open={openStatus}
//             onClose={() => closeModal(setOpenStatus)}
//             lead={selectedLead}
//             onStatusUpdate={afterAction(setOpenStatus, 'Status updated successfully!')}
//           />
//           <ConvertLeadPopup
//             open={openConvert}
//             onClose={() => closeModal(setOpenConvert)}
//             lead={selectedLead}
//             onConvert={afterAction(setOpenConvert, 'Lead converted to customer successfully!')}
//           />
//           <FollowupPopup
//             open={openFollowup}
//             onClose={() => closeModal(setOpenFollowup)}
//             lead={selectedLead}
//             onFollowup={afterAction(setOpenFollowup, 'Follow-up added successfully!')}
//           />
//           <DrawingsPopup
//             open={openDrawings}
//             onClose={() => closeModal(setOpenDrawings)}
//             lead={selectedLead}
//             onDrawingUpload={afterAction(setOpenDrawings, 'Drawing uploaded successfully!')}
//           />
//           <FeasibilityPopup
//             open={openFeasibility}
//             onClose={() => closeModal(setOpenFeasibility)}
//             lead={selectedLead}
//             onFeasibilityUpdate={afterAction(setOpenFeasibility, 'Feasibility updated successfully!')}
//           />
//           <FeasibilityCheckPopup
//             open={openFeasibilityCheck}
//             onClose={() => closeModal(setOpenFeasibilityCheck)}
//             lead={selectedLead}
//           />
//         </>
//       )}

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar(s => ({ ...s, open: false }))}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={() => setSnackbar(s => ({ ...s, open: false }))}
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ width: '100%', borderRadius: 1.5, fontSize: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default LeadsMaster;
'use strict';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Button, TextField, InputAdornment, Tooltip,
  Typography, Snackbar, TablePagination, Checkbox, Stack, Chip,
  Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Alert, CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon, Add as AddIcon, Delete as DeleteIcon,
  Visibility as ViewIcon, Edit as EditIcon, MoreVert as MoreVertIcon,
  Business as BusinessIcon, Update as UpdateIcon, Message as MessageIcon,
  Image as ImageIcon, Science as ScienceIcon, Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddLead from './AddLead';
import EditLead from './EditLead';
import ViewLead from './ViewLead';
import DeleteLead from './DeleteLead';
import StatusUpdatePopup from './StatusUpdatePopup';
import ConvertLeadPopup from './ConvertLeadPopup';
import FollowupPopup from './FollowupPopup';
import DrawingsPopup from './DrawingsPopup';
import FeasibilityPopup from './FeasibilityPopup';
import FeasibilityCheckPopup from './FeasibilityCheckPopup';
import { COLORS, STATUS_COLORS, PRIORITY_COLORS, STATUS_TRANSITIONS } from './constants';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// ─── terminal statuses per backend state machine ──────────────────────────────
const TERMINAL_STATUSES = ['Won', 'Lost', 'Junk'];

// Loading state component
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

// Access Denied component
const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="error" sx={{ mb: 2 }}>
      Access Denied
    </Typography>
    <Typography variant="body2" color="text.secondary">
      You don't have permission to view this page. Please contact your administrator.
    </Typography>
  </Box>
);

// ─── Action Menu with permission checks ─────────────────────────────────────
const ActionMenu = ({
  item, anchorEl, onOpen, onClose,
  onView, onEdit, onDelete, onStatusUpdate,
  onConvert, onFollowup, onDrawings, onFeasibility, onFeasibilityCheck,
  permissions, isSuperAdmin
}) => {
  // Permission checks for different actions
  const canView = hasPermission(permissions, MODULES.LEADS_MASTER, PAGES.LEADS_MASTER, ACTIONS.VIEW) || isSuperAdmin;
  const canUpdate = hasPermission(permissions, MODULES.LEADS_MASTER, PAGES.LEADS_MASTER, ACTIONS.UPDATE) || isSuperAdmin;
  const canDelete = hasPermission(permissions, MODULES.LEADS_MASTER, PAGES.LEADS_MASTER, ACTIONS.DELETE) || isSuperAdmin;
  const canCreate = hasPermission(permissions, MODULES.LEADS_MASTER, PAGES.LEADS_MASTER, ACTIONS.CREATE) || isSuperAdmin;
  
  // Feature-specific permissions (using same UPDATE permission for status/features)
  const canUpdateStatus = canUpdate;
  const canConvert = canUpdate && item?.status === 'Won' && !item?.is_converted;
  const canAddFollowup = canUpdate;
  const canManageDrawings = canUpdate;
  const canManageFeasibility = canUpdate;
  const canFeasibilityCheck = canUpdate;

  const currentStatus = item?.status || 'New';
  const isTerminal = TERMINAL_STATUSES.includes(currentStatus);
  const hasNextTransitions = (STATUS_TRANSITIONS[currentStatus] || []).length > 0;
  const isConverted = currentStatus === 'Won' && item?.is_converted;
  const hasEnquiredItems = (item?.enquired_items?.length || 0) > 0;

  // Check if any actions are available
  const hasAnyAction = canView || canUpdate || canDelete || canCreate;
  if (!hasAnyAction) return null;

  const menuItem = (onClick, icon, label, color = COLORS.text.primary, disabled = false, tooltipMsg = '') => {
    const el = (
      <MenuItem
        onClick={() => { if (!disabled) { onClick(); onClose(); } }}
        sx={{
          py: 1.5,
          opacity: disabled ? 0.4 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        <ListItemIcon sx={{ color, minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText>
          <Typography variant="body2" fontWeight={500} sx={{ color, fontSize: '0.75rem' }}>
            {label}
          </Typography>
        </ListItemText>
      </MenuItem>
    );
    return disabled && tooltipMsg
      ? <Tooltip key={label} title={tooltipMsg} placement="left">{el}</Tooltip>
      : <React.Fragment key={label}>{el}</React.Fragment>;
  };

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={onOpen}
          sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1, minWidth: 200, borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          },
        }}
      >
        {canView && menuItem(() => onView(item), <ViewIcon fontSize="small" />, 'View details')}
        
        {canUpdate && menuItem(
          () => onEdit(item),
          <EditIcon fontSize="small" />,
          'Edit',
          isTerminal ? COLORS.text.tertiary : COLORS.text.primary,
          isTerminal,
          `Lead is ${currentStatus} — editing is disabled`
        )}

        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />

        {canFeasibilityCheck && menuItem(
          () => onFeasibilityCheck(item),
          <AssessmentIcon fontSize="small" />,
          'Feasibility check',
          hasEnquiredItems ? '#8B5CF6' : COLORS.text.tertiary,
          !hasEnquiredItems,
          'Add enquired items first before running feasibility check'
        )}
        
        {canManageFeasibility && menuItem(
          () => onFeasibility(item),
          <ScienceIcon fontSize="small" />,
          'Submit feasibility',
          hasEnquiredItems ? '#06B6D4' : COLORS.text.tertiary,
          !hasEnquiredItems,
          'Add enquired items first'
        )}
        
        {canManageDrawings && menuItem(() => onDrawings(item), <ImageIcon fontSize="small" />, 'Drawings', '#8B5CF6')}
        
        {canAddFollowup && menuItem(
          () => onFollowup(item),
          <MessageIcon fontSize="small" />,
          'Add follow-up',
          isTerminal ? COLORS.text.tertiary : '#10B981',
          isTerminal,
          `Lead is ${currentStatus} — no follow-ups on closed leads`
        )}

        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />

        {canUpdateStatus && hasNextTransitions && menuItem(
          () => onStatusUpdate(item),
          <UpdateIcon fontSize="small" />,
          'Update status',
          COLORS.primary
        )}

        {/* Convert to customer - only if Won and NOT yet converted */}
        {canConvert && menuItem(
          () => onConvert(item),
          <BusinessIcon fontSize="small" />,
          'Convert to customer',
          '#10B981'
        )}

        {/* Show "already converted" badge instead of button */}
        {isConverted && (
          <MenuItem disabled sx={{ py: 1.5, opacity: 0.6 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Already converted
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />

        {canDelete && menuItem(() => onDelete(item), <DeleteIcon fontSize="small" />, 'Delete', '#EF4444')}
      </Menu>
    </>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const LeadsMaster = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedLeadForMenu, setSelectedLeadForMenu] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // modal open states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openConvert, setOpenConvert] = useState(false);
  const [openFollowup, setOpenFollowup] = useState(false);
  const [openDrawings, setOpenDrawings] = useState(false);
  const [openFeasibility, setOpenFeasibility] = useState(false);
  const [openFeasibilityCheck, setOpenFeasibilityCheck] = useState(false);

  // Fetch user permissions
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.success) {
          const userData = response.data.data;
          setIsSuperAdmin(userData.isSuperAdmin || false);
          setUserPermissions(userData.permissions || []);
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
    if (isSuperAdmin) return true;
    return hasPermission(userPermissions, MODULES.LEADS_MASTER, PAGES.LEADS_MASTER, action);
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canExport = checkPermission(ACTIONS.EXPORT);
  const canImport = checkPermission(ACTIONS.IMPORT);
  const canPrint = checkPermission(ACTIONS.PRINT);

  // ── debounce search ──────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => { setSearchTerm(searchInput); setPage(0); }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── fetch leads ──────────────────────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    if (!canViewPage && !isSuperAdmin) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
      if (searchTerm) params.append('company_name', searchTerm);

      const res = await axios.get(`${BASE_URL}/api/leads?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setLeads(res.data.data || []);
        setTotalItems(res.data.pagination?.total || 0);
      } else {
        notify('Failed to load leads', 'error');
      }
    } catch {
      notify('Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchLeads();
    }
  }, [fetchLeads, permissionsLoaded, canViewPage, isSuperAdmin]);

  // ── helpers ──────────────────────────────────────────────────────────────
  const notify = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const openModal = (setter, lead = null) => {
    if (lead) setSelectedLead(lead);
    setter(true);
    setActionMenuAnchor(null);
    setSelectedLeadForMenu(null);
  };

  const closeModal = (setter) => {
    setter(false);
    setSelectedLead(null);
  };

  const afterAction = (setter, message) => () => {
    closeModal(setter);
    fetchLeads();
    notify(message);
  };

  // ── selection (only if delete permission) ────────────────────────────────
  const handleSelectAll = (e) => {
    if (!canDelete) return;
    setSelected(e.target.checked ? leads.map(l => l._id) : []);
  };

  const handleSelect = (id) => {
    if (!canDelete) return;
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // ── bulk delete ──────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/leads/bulk-delete`, 
        { ids: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelected([]);
      fetchLeads();
      notify(`${selected.length} lead(s) deleted successfully!`);
    } catch (err) {
      console.error('Bulk delete error:', err);
      notify('Failed to delete leads', 'error');
    }
  };

  // ── pagination ───────────────────────────────────────────────────────────
  const handleChangePage = (_, newPage) => { setPage(newPage); setSelected([]); };
  const handleChangeRows = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
    setSelected([]);
  };

  // ── formatting ───────────────────────────────────────────────────────────
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const getInitials = (lead) =>
    lead.company_name ? lead.company_name.substring(0, 2).toUpperCase() : 'LD';

  const getAvatarColor = (lead) => {
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    return colors[(lead.company_name?.charCodeAt(0) || 0) % colors.length];
  };

  // Show loading state while permissions are being fetched
  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  // If user doesn't have view permission, show access denied
  if (!canViewPage && !isSuperAdmin) {
    return <AccessDenied />;
  }

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: 2.5 }}>
      {/* Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Leads Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage leads, track status, and follow up with potential customers
        </Typography>
      </Box>

      {/* Action bar */}
      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, border: `1px solid ${COLORS.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <TextField
            placeholder="Search by company, contact, subject, lead ID..."
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={loading}
            sx={{
              width: { xs: '100%', sm: 450 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5, fontSize: '0.75rem',
                '&:hover fieldset': { borderColor: COLORS.primary },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                </InputAdornment>
              ),
              sx: {
                height: 36, bgcolor: COLORS.background.light,
                '& input': { padding: '6px 12px', fontSize: '0.75rem', color: COLORS.text.primary },
              },
            }}
          />
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Bulk Delete Button - Only if delete permission */}
            {canDelete && selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleBulkDelete}
                sx={{
                  height: 36, borderRadius: 1.5, textTransform: 'none',
                  fontSize: '0.75rem', fontWeight: 500,
                  borderColor: '#fee2e2', color: '#991b1b',
                  '&:hover': { borderColor: '#fecaca', bgcolor: '#fee2e2' }
                }}
                disabled={loading}
              >
                Delete ({selected.length})
              </Button>
            )}
            
            {/* Add Lead Button - Only if create permission */}
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenAdd(true)}
                sx={{
                  height: 36, borderRadius: 1.5, bgcolor: COLORS.primary,
                  fontSize: '0.75rem', fontWeight: 500, textTransform: 'none',
                  '&:hover': { bgcolor: COLORS.primaryDark },
                }}
                disabled={loading}
              >
                Add Lead
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Table */}
      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.background.tableHeader, '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.light, py: 1.5 } }}>
                {/* Checkbox Column - Only if delete permission */}
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < leads.length}
                      checked={leads.length > 0 && selected.length === leads.length}
                      onChange={handleSelectAll}
                      disabled={loading || leads.length === 0}
                      sx={{ color: COLORS.text.light, '&.Mui-checked': { color: COLORS.text.light }, '&.MuiCheckbox-indeterminate': { color: COLORS.text.light }, '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }}
                    />
                  </TableCell>
                )}
                {['Lead ID / Company', 'Subject', 'Contact', 'Status', 'Priority', 'Est. Value', 'Created', 'Actions'].map(h => (
                  <TableCell key={h} align={h === 'Actions' ? 'center' : 'left'} sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: h === 'Actions' ? 60 : 'auto' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading leads...</Typography>
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <BusinessIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                    <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                      {searchTerm ? 'No leads found' : 'No leads available'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                      {searchTerm ? 'Try adjusting your search terms' : 'Add your first lead to get started'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : leads.map((lead) => {
                const isSelected = selected.includes(lead._id);
                const menuOpen = Boolean(actionMenuAnchor) && selectedLeadForMenu?._id === lead._id;
                const statusColors = STATUS_COLORS[lead.status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
                const priorityColors = PRIORITY_COLORS[lead.priority] || { bg: '#F1F5F9', color: '#475569' };
                const isTerminal = TERMINAL_STATUSES.includes(lead.status);

                return (
                  <TableRow
                    key={lead._id}
                    hover
                    selected={isSelected}
                    sx={{
                      bgcolor: COLORS.background.white,
                      opacity: isTerminal ? 0.85 : 1,
                      '&:hover': { bgcolor: COLORS.background.hover },
                      '&.Mui-selected': { bgcolor: `${COLORS.primary}10`, '&:hover': { bgcolor: `${COLORS.primary}20` } },
                      '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border },
                    }}
                  >
                    {/* Checkbox Column - Only if delete permission */}
                    {canDelete && (
                      <TableCell padding="checkbox" sx={{ width: 40 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(lead._id)}
                          sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary }, '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }}
                        />
                      </TableCell>
                    )}

                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(lead), fontSize: '0.7rem', fontWeight: 600 }}>
                          {getInitials(lead)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                            {lead.company_name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {lead.lead_id}
                            {lead.is_converted && (
                              <Chip label="Converted" size="small" sx={{ ml: 0.5, height: 14, fontSize: '0.55rem', bgcolor: '#E1F5EE', color: '#085041', border: '1px solid #9FE1CB' }} />
                            )}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{lead.subject}</Typography>
                      {lead.lead_source && (
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {lead.lead_source}{lead.lead_source_detail ? ` (${lead.lead_source_detail})` : ''}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{lead.contact_name}</Typography>
                      {lead.contact_mobile && (
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>{lead.contact_mobile}</Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={lead.status || 'New'}
                        size="small"
                        sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: statusColors.bg, color: statusColors.color, border: `1px solid ${statusColors.border}` }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={lead.priority || 'Medium'}
                        size="small"
                        sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: priorityColors.bg, color: priorityColors.color }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        {lead.estimated_value ? `₹${lead.estimated_value.toLocaleString('en-IN')}` : '—'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        {formatDate(lead.createdAt)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center" sx={{ width: 60 }}>
                      <ActionMenu
                        item={lead}
                        anchorEl={menuOpen ? actionMenuAnchor : null}
                        onOpen={(e) => { setActionMenuAnchor(e.currentTarget); setSelectedLeadForMenu(lead); }}
                        onClose={() => { setActionMenuAnchor(null); setSelectedLeadForMenu(null); }}
                        onView={(l) => openModal(setOpenView, l)}
                        onEdit={(l) => openModal(setOpenEdit, l)}
                        onDelete={(l) => openModal(setOpenDelete, l)}
                        onStatusUpdate={(l) => openModal(setOpenStatus, l)}
                        onConvert={(l) => openModal(setOpenConvert, l)}
                        onFollowup={(l) => openModal(setOpenFollowup, l)}
                        onDrawings={(l) => openModal(setOpenDrawings, l)}
                        onFeasibility={(l) => openModal(setOpenFeasibility, l)}
                        onFeasibilityCheck={(l) => openModal(setOpenFeasibilityCheck, l)}
                        permissions={userPermissions}
                        isSuperAdmin={isSuperAdmin}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRows}
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.7rem', color: COLORS.text.secondary },
            '& .MuiTablePagination-select': { fontSize: '0.7rem' },
            '& .MuiTablePagination-actions button': { color: COLORS.primary },
          }}
        />
      </Paper>

      {/* ── Modals (conditionally rendered based on permissions) ── */}
      {canCreate && (
        <AddLead 
          open={openAdd} 
          onClose={() => setOpenAdd(false)} 
          onAdd={() => { setOpenAdd(false); fetchLeads(); notify('Lead added successfully!'); }} 
        />
      )}

      {selectedLead && (
        <>
          {canUpdate && (
            <EditLead
              open={openEdit}
              onClose={() => closeModal(setOpenEdit)}
              lead={selectedLead}
              onUpdate={afterAction(setOpenEdit, 'Lead updated successfully!')}
            />
          )}

          {canViewPage && (
            <ViewLead
              open={openView}
              onClose={() => closeModal(setOpenView)}
              lead={selectedLead}
              onEdit={() => { 
                if (canUpdate) {
                  setOpenView(false); 
                  setOpenEdit(true);
                }
              }}
            />
          )}

          {canDelete && (
            <DeleteLead
              open={openDelete}
              onClose={() => closeModal(setOpenDelete)}
              lead={selectedLead}
              onDelete={afterAction(setOpenDelete, 'Lead deleted successfully!')}
            />
          )}

          {canUpdate && (
            <>
              <StatusUpdatePopup
                open={openStatus}
                onClose={() => closeModal(setOpenStatus)}
                lead={selectedLead}
                onStatusUpdate={afterAction(setOpenStatus, 'Status updated successfully!')}
              />
              <ConvertLeadPopup
                open={openConvert}
                onClose={() => closeModal(setOpenConvert)}
                lead={selectedLead}
                onConvert={afterAction(setOpenConvert, 'Lead converted to customer successfully!')}
              />
              <FollowupPopup
                open={openFollowup}
                onClose={() => closeModal(setOpenFollowup)}
                lead={selectedLead}
                onFollowup={afterAction(setOpenFollowup, 'Follow-up added successfully!')}
              />
              <DrawingsPopup
                open={openDrawings}
                onClose={() => closeModal(setOpenDrawings)}
                lead={selectedLead}
                onDrawingUpload={afterAction(setOpenDrawings, 'Drawing uploaded successfully!')}
              />
              <FeasibilityPopup
                open={openFeasibility}
                onClose={() => closeModal(setOpenFeasibility)}
                lead={selectedLead}
                onFeasibilityUpdate={afterAction(setOpenFeasibility, 'Feasibility updated successfully!')}
              />
              <FeasibilityCheckPopup
                open={openFeasibilityCheck}
                onClose={() => closeModal(setOpenFeasibilityCheck)}
                lead={selectedLead}
              />
            </>
          )}
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 1.5, fontSize: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeadsMaster;