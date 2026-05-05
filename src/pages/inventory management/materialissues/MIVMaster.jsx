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
//   Chip,
//   Alert,
//   CircularProgress,
//   Tabs,
//   Tab,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Avatar
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Print as PrintIcon,
//   PostAdd as PostAddIcon,
//   MoreVert as MoreVertIcon,
//   Assessment as AssessmentIcon,
//   Inventory as InventoryIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
// import AddMIV from './AddMIV';
// import ViewMIV from './ViewMIV';
// import EditMIV from './EditMIV';
// import DeleteMIV from './DeleteMIV';
// import PostMIV from './PostMIV';
// import PrintMIV from './PrintMIV';
// import MIVSummary from './MIVSummary';

// // ==================== COLORS ====================
// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: {
//     primary: '#151C26',
//     secondary: '#4B5568',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF',
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FFFC',
//     hover: '#F0FDF9',
//     tableHeader: '#063C3F',
//   },
//   border: '#E3E8EF',
//   chips: {
//     draft: '#FEF3C7',
//     issued: '#D1FAE5',
//     partiallyReturned: '#FEF3C7',
//     fullyReturned: '#E0E7FF',
//     closed: '#F1F5F9',
//     cancelled: '#FEE2E2',
//   }
// };

// // MIV Status constants matching backend
// const MIV_STATUS = {
//   DRAFT: 'Draft',
//   ISSUED: 'Issued',
//   PARTIALLY_RETURNED: 'Partially Returned',
//   FULLY_RETURNED: 'Fully Returned',
//   CLOSED: 'Closed',
//   CANCELLED: 'Cancelled'
// };

// // Status colors for chips
// const getStatusColor = (status) => {
//   const colors = {
//     [MIV_STATUS.DRAFT]: { bg: '#FEF3C7', color: '#D97706' },
//     [MIV_STATUS.ISSUED]: { bg: '#D1FAE5', color: '#059669' },
//     [MIV_STATUS.PARTIALLY_RETURNED]: { bg: '#FEF3C7', color: '#D97706' },
//     [MIV_STATUS.FULLY_RETURNED]: { bg: '#E0E7FF', color: '#4F46E5' },
//     [MIV_STATUS.CLOSED]: { bg: '#F1F5F9', color: '#475569' },
//     [MIV_STATUS.CANCELLED]: { bg: '#FEE2E2', color: '#DC2626' }
//   };
//   return colors[status] || { bg: '#F1F5F9', color: '#475569' };
// };

// // Loading state component
// const LoadingState = () => (
//   <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//     <CircularProgress size={40} sx={{ color: COLORS.primary }} />
//   </Box>
// );

// // Access Denied component
// const AccessDenied = () => (
//   <Box sx={{ p: 4, textAlign: 'center' }}>
//     <Typography variant="h6" color="error" sx={{ mb: 2 }}>
//       Access Denied
//     </Typography>
//     <Typography variant="body2" color="text.secondary">
//       You don't have permission to view this page. Please contact your administrator.
//     </Typography>
//   </Box>
// );

// // ==================== ACTION MENU COMPONENT ====================
// const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onPost, onPrint, permissions }) => {
//   const isDraft = item.status === MIV_STATUS.DRAFT;
//   const isIssued = item.status === MIV_STATUS.ISSUED;
  
//   const canView = hasPermission(permissions, MODULES.MATERIAL_ISSUE_VOUCHER, PAGES.MATERIAL_ISSUE_VOUCHER, ACTIONS.VIEW);
//   const canUpdate = hasPermission(permissions, MODULES.MATERIAL_ISSUE_VOUCHER, PAGES.MATERIAL_ISSUE_VOUCHER, ACTIONS.UPDATE);
//   const canDelete = hasPermission(permissions, MODULES.MATERIAL_ISSUE_VOUCHER, PAGES.MATERIAL_ISSUE_VOUCHER, ACTIONS.DELETE);
//   const canPost = hasPermission(permissions, MODULES.MATERIAL_ISSUE_VOUCHER, PAGES.MATERIAL_ISSUE_VOUCHER, ACTIONS.POST);
//   const canPrint = hasPermission(permissions, MODULES.MATERIAL_ISSUE_VOUCHER, PAGES.MATERIAL_ISSUE_VOUCHER, ACTIONS.PRINT);

//   if (!canView && !canUpdate && !canDelete && !canPost && !canPrint) {
//     return null;
//   }

//   return (
//     <>
//       <Tooltip title="Actions">
//         <IconButton
//           size="small"
//           onClick={onOpen}
//           sx={{
//             color: COLORS.text.secondary,
//             '&:hover': {
//               bgcolor: `${COLORS.primary}20`
//             }
//           }}
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
//             mt: 1,
//             minWidth: 180,
//             borderRadius: 2,
//             border: `1px solid ${COLORS.border}`,
//           }
//         }}
//       >
//         {canView && (
//           <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
//             <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
//               <ViewIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                 View Details
//               </Typography>
//             </ListItemText>
//           </MenuItem>
//         )}
        
//         {canUpdate && isDraft && (
//           <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
//             <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
//               <EditIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
//                 Edit
//               </Typography>
//             </ListItemText>
//           </MenuItem>
//         )}
        
//         {canPost && isDraft && (
//           <MenuItem onClick={() => { onPost(item); onClose(); }} sx={{ py: 1.5 }}>
//             <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
//               <PostAddIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#10B981' }}>
//                 Post & Issue
//               </Typography>
//             </ListItemText>
//           </MenuItem>
//         )}
        
//         {canPrint && (isDraft || isIssued) && (
//           <MenuItem onClick={() => { onPrint(item); onClose(); }} sx={{ py: 1.5 }}>
//             <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
//               <PrintIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#F59E0B' }}>
//                 Print MIV
//               </Typography>
//             </ListItemText>
//           </MenuItem>
//         )}
        
//         {canDelete && isDraft && (
//           <>
//             <Divider sx={{ my: 0.5 }} />
//             <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
//               <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
//                 <DeleteIcon fontSize="small" />
//               </ListItemIcon>
//               <ListItemText>
//                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
//                   Cancel MIV
//                 </Typography>
//               </ListItemText>
//             </MenuItem>
//           </>
//         )}
//       </Menu>
//     </>
//   );
// };

// // ==================== MAIN COMPONENT ====================
// const MIVMaster = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchInput, setSearchInput] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [totalItems, setTotalItems] = useState(0);
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [selected, setSelected] = useState([]);
//   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedItemForAction, setSelectedItemForAction] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
//   const [openSummaryModal, setOpenSummaryModal] = useState(false);
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [openViewModal, setOpenViewModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [openPostDialog, setOpenPostDialog] = useState(false);
//   const [openPrintModal, setOpenPrintModal] = useState(false);

//   // User permissions state
//   const [userPermissions, setUserPermissions] = useState([]);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//   const [permissionsLoaded, setPermissionsLoaded] = useState(false);

//   // Fetch user permissions
//   useEffect(() => {
//     const fetchUserPermissions = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/api/auth/me`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (response.data.success) {
//           const userData = response.data.data;
//           setIsSuperAdmin(userData.isSuperAdmin || false);

//           if (userData.permissions && Array.isArray(userData.permissions)) {
//             setUserPermissions(userData.permissions);
//           } else {
//             setUserPermissions([]);
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching user permissions:', err);
//         setUserPermissions([]);
//       } finally {
//         setPermissionsLoaded(true);
//       }
//     };

//     fetchUserPermissions();
//   }, []);

//   // Check permission helper
//   const checkPermission = (action) => {
//     if (isSuperAdmin) return true;
//     return hasPermission(
//       userPermissions,
//       MODULES.MATERIAL_ISSUE_VOUCHER,
//       PAGES.MATERIAL_ISSUE_VOUCHER,
//       action
//     );
//   };

//   // Permission checks
//   const canViewPage = checkPermission(ACTIONS.VIEW);
//   const canCreate = checkPermission(ACTIONS.CREATE);
//   const canUpdate = checkPermission(ACTIONS.UPDATE);
//   const canDelete = checkPermission(ACTIONS.DELETE);
//   const canPost = checkPermission(ACTIONS.POST);
//   const canPrint = checkPermission(ACTIONS.PRINT);

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchTerm(searchInput);
//       setPage(0);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   const fetchMIVs = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       const params = new URLSearchParams({
//         page: page + 1,
//         limit: rowsPerPage
//       });
      
//       if (searchTerm) params.append('search', searchTerm);
//       if (statusFilter !== 'all') params.append('status', statusFilter);
      
//       const response = await axios.get(`${BASE_URL}/api/miv?${params.toString()}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setData(response.data.data || []);
//         setTotalItems(response.data.pagination?.total || response.data.data?.length || 0);
//       } else {
//         showNotification('Failed to load MIVs', 'error');
//       }
//     } catch (err) {
//       console.error('Error fetching MIVs:', err);
//       showNotification(err.response?.data?.message || 'Failed to load MIVs', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [page, rowsPerPage, searchTerm, statusFilter]);

//   useEffect(() => {
//     if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
//       fetchMIVs();
//     }
//   }, [fetchMIVs, permissionsLoaded, canViewPage, isSuperAdmin]);

//   // Handle select all - only if user has delete permission
//   const handleSelectAll = (event) => {
//     if (!canDelete) return;
//     if (event.target.checked) {
//       setSelected(data.map(item => item._id));
//     } else {
//       setSelected([]);
//     }
//   };

//   // Handle single selection - only if user has delete permission
//   const handleSelect = (id) => {
//     if (!canDelete) return;
//     const selectedIndex = selected.indexOf(id);
//     let newSelected = [];
//     if (selectedIndex === -1) {
//       newSelected = [...selected, id];
//     } else {
//       newSelected = selected.filter(item => item !== id);
//     }
//     setSelected(newSelected);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//     setSelected([]);
//   };
  
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//     setSelected([]);
//   };
  
//   const handleStatusFilterChange = (event, newValue) => {
//     if (newValue !== null) {
//       setStatusFilter(newValue);
//       setPage(0);
//       setSelected([]);
//     }
//   };
  
//   const handleAddMIV = () => {
//     fetchMIVs();
//     showNotification('MIV created successfully!', 'success');
//   };
  
//   const handleEditMIV = () => {
//     fetchMIVs();
//     showNotification('MIV updated successfully!', 'success');
//   };
  
//   const handleDeleteMIV = () => {
//     fetchMIVs();
//     setSelected([]);
//     showNotification('MIV cancelled successfully!', 'success');
//   };
  
//   const handlePostMIV = () => {
//     fetchMIVs();
//     showNotification('MIV posted and materials issued successfully!', 'success');
//   };
  
//   // Handle bulk delete
//   const handleBulkDelete = () => {
//     if (!canDelete) return;
//     showNotification('Bulk delete requires API implementation', 'warning');
//   };
  
//   const handleActionMenuOpen = (event, item) => {
//     setActionMenuAnchor(event.currentTarget);
//     setSelectedItemForAction(item);
//   };

//   const handleActionMenuClose = () => {
//     setActionMenuAnchor(null);
//     setSelectedItemForAction(null);
//   };

//   const openViewModalHandler = (item) => {
//     setSelectedItem(item);
//     setOpenViewModal(true);
//     handleActionMenuClose();
//   };
  
//   const openEditModalHandler = (item) => {
//     setSelectedItem(item);
//     setOpenEditModal(true);
//     handleActionMenuClose();
//   };
  
//   const openDeleteDialogHandler = (item) => {
//     setSelectedItem(item);
//     setOpenDeleteDialog(true);
//     handleActionMenuClose();
//   };
  
//   const openPostDialogHandler = (item) => {
//     setSelectedItem(item);
//     setOpenPostDialog(true);
//     handleActionMenuClose();
//   };
  
//   const openPrintModalHandler = (item) => {
//     setSelectedItem(item);
//     setOpenPrintModal(true);
//     handleActionMenuClose();
//   };
  
//   const showNotification = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };
  
//   const getMIVInitials = (miv) => {
//     if (!miv.miv_number) return 'MIV';
//     return miv.miv_number.substring(0, 2).toUpperCase();
//   };
  
//   const getAvatarColor = (miv) => {
//     if (!miv.miv_number) return COLORS.primary;
//     const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
//     const charCode = miv.miv_number.charCodeAt(0) || 0;
//     return colors[charCode % colors.length];
//   };
  
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return '-';
//     }
//   };

//   const getDisplayValue = (obj, field) => {
//     if (!obj) return '-';
//     if (typeof obj === 'object') {
//       return obj[field] || obj[field.toLowerCase()] || '-';
//     }
//     return obj;
//   };

//   const getPersonName = (person) => {
//     if (!person) return '-';
//     if (typeof person === 'object') {
//       if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
//       if (person.FirstName) return person.FirstName;
//       if (person.Username) return person.Username;
//       if (person.Email) return person.Email;
//       if (person.name) return person.name;
//       return person._id?.slice(-6) || '-';
//     }
//     return person;
//   };

//   // Show loading state while permissions are being fetched
//   if (!permissionsLoaded) {
//     return <LoadingState />;
//   }

//   // If user doesn't have view permission, show access denied
//   if (!canViewPage && !isSuperAdmin) {
//     return <AccessDenied />;
//   }

//   return (
//     <Box sx={{ p: 2.5 }}>
//       {/* Page Header */}
//       <Box sx={{ mb: 2.5 }}>
//         <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
//           Material Issue Voucher
//         </Typography>
//         <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
//           Manage material issue vouchers and track raw material issuance to production
//         </Typography>
//       </Box>

//       {/* Status Filter Tabs */}
//       <Paper sx={{ 
//         mb: 2.5, 
//         borderRadius: 2, 
//         border: `1px solid ${COLORS.border}`, 
//         overflow: 'hidden' 
//       }}>
//         <Tabs
//           value={statusFilter}
//           onChange={handleStatusFilterChange}
//           sx={{
//             minHeight: 40,
//             '& .MuiTab-root': {
//               textTransform: 'none',
//               fontSize: '0.75rem',
//               fontWeight: 500,
//               minHeight: 40,
//               px: 3,
//               color: COLORS.text.secondary,
//               '&.Mui-selected': { color: COLORS.primary }
//             },
//             '& .MuiTabs-indicator': {
//               backgroundColor: COLORS.primary,
//               height: 2
//             }
//           }}
//         >
//           <Tab label="All" value="all" />
//           <Tab label="Draft" value={MIV_STATUS.DRAFT} />
//           <Tab label="Issued" value={MIV_STATUS.ISSUED} />
//           <Tab label="Partially Returned" value={MIV_STATUS.PARTIALLY_RETURNED} />
//           <Tab label="Fully Returned" value={MIV_STATUS.FULLY_RETURNED} />
//           <Tab label="Closed" value={MIV_STATUS.CLOSED} />
//           <Tab label="Cancelled" value={MIV_STATUS.CANCELLED} />
//         </Tabs>
//       </Paper>

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
//           <TextField
//             placeholder="Search by MIV Number, Work Order, or Remarks..."
//             size="small"
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//             sx={{
//               width: { xs: '100%', sm: 450 },
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 1.5,
//                 fontSize: '0.75rem',
//                 '&:hover fieldset': {
//                   borderColor: COLORS.primary,
//                 },
//               }
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
//                 </InputAdornment>
//               ),
//               sx: {
//                 height: 36,
//                 bgcolor: COLORS.background.light,
//                 '& input': {
//                   padding: '6px 12px',
//                   fontSize: '0.75rem',
//                   color: COLORS.text.primary,
//                   '&::placeholder': {
//                     color: COLORS.text.tertiary,
//                     fontSize: '0.75rem'
//                   }
//                 }
//               }
//             }}
//             disabled={loading}
//           />

//           <Stack direction="row" spacing={1.5}>
//             {/* Bulk Delete Button - Only show if user has delete permission */}
//             {canDelete && selected.length > 0 && (
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={handleBulkDelete}
//                 sx={{
//                   height: 36,
//                   borderRadius: 1.5,
//                   textTransform: 'none',
//                   fontSize: '0.75rem',
//                   fontWeight: 500,
//                   borderColor: '#fee2e2',
//                   color: '#991b1b',
//                   '&:hover': {
//                     borderColor: '#fecaca',
//                     bgcolor: '#fee2e2'
//                   }
//                 }}
//                 disabled={loading}
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}
            
//             {/* Summary Report Button - Only show if user has view permission */}
//             {canViewPage && (
//               <Button
//                 variant="outlined"
//                 startIcon={<AssessmentIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={() => setOpenSummaryModal(true)}
//                 sx={{
//                   height: 36,
//                   borderRadius: 1.5,
//                   textTransform: 'none',
//                   fontSize: '0.75rem',
//                   fontWeight: 500,
//                   borderColor: COLORS.primary,
//                   color: COLORS.primary,
//                   '&:hover': {
//                     borderColor: COLORS.primaryDark,
//                     bgcolor: COLORS.primaryLight
//                   }
//                 }}
//               >
//                 Summary Report
//               </Button>
//             )}
            
//             {/* Add MIV Button - Only show if user has create permission */}
//             {canCreate && (
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={() => setOpenAddModal(true)}
//                 sx={{
//                   height: 36,
//                   borderRadius: 1.5,
//                   bgcolor: COLORS.primary,
//                   fontSize: '0.75rem',
//                   fontWeight: 500,
//                   textTransform: 'none',
//                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                   '&:hover': {
//                     bgcolor: COLORS.primaryDark,
//                   }
//                 }}
//                 disabled={loading}
//               >
//                 New MIV
//               </Button>
//             )}
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* Table */}
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
//                   py: 1.5,
//                 }
//               }}>
//                 {/* Checkbox Column - Only show if user has delete permission */}
//                 {canDelete && (
//                   <TableCell padding="checkbox" sx={{ width: 40 }}>
//                     <Checkbox
//                       indeterminate={selected.length > 0 && selected.length < data.length}
//                       checked={data.length > 0 && selected.length === data.length}
//                       onChange={handleSelectAll}
//                       sx={{
//                         color: COLORS.text.light,
//                         '&.Mui-checked': {
//                           color: COLORS.text.light,
//                         },
//                         '&.MuiCheckbox-indeterminate': {
//                           color: COLORS.text.light,
//                         },
//                         '& .MuiSvgIcon-root': {
//                           fontSize: '1.25rem'
//                         }
//                       }}
//                       disabled={loading || data.length === 0}
//                     />
//                   </TableCell>
//                 )}
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   MIV No.
//                 </TableCell>
               
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   Work Order
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   Department
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   Issued By
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   Items
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   Total Cost
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                   Status
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
//                     <CircularProgress size={32} sx={{ color: COLORS.primary }} />
//                     <Typography sx={{ fontSize: '0.75rem', mt: 1, color: COLORS.text.secondary }}>
//                       Loading MIVs...
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : data.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
//                     <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
//                     <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
//                       {searchTerm ? 'No MIVs found matching your search' : 'No MIVs available'}
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 data.map((item) => {
//                   const isSelected = selected.includes(item._id);
//                   const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedItemForAction?._id === item._id;
//                   const statusColors = getStatusColor(item.status);
                  
//                   return (
//                     <TableRow
//                       key={item._id}
//                       hover
//                       selected={isSelected}
//                       sx={{
//                         '&:hover': { bgcolor: COLORS.background.hover },
//                         '&.Mui-selected': {
//                           bgcolor: `${COLORS.primary}10`,
//                           '&:hover': {
//                             bgcolor: `${COLORS.primary}20`
//                           }
//                         }
//                       }}
//                     >
//                       {/* Checkbox Column - Only show if user has delete permission */}
//                       {canDelete && (
//                         <TableCell padding="checkbox">
//                           <Checkbox
//                             checked={isSelected}
//                             onChange={() => handleSelect(item._id)}
//                             sx={{
//                               color: COLORS.primary,
//                               '&.Mui-checked': {
//                                 color: COLORS.primary,
//                               },
//                               '& .MuiSvgIcon-root': {
//                                 fontSize: '1.25rem'
//                               }
//                             }}
//                           />
//                         </TableCell>
//                       )}
//                       <TableCell>
//                         <Stack direction="row" spacing={1.5} alignItems="center">
//                           <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(item), fontSize: '0.7rem', fontWeight: 600 }}>
//                             {getMIVInitials(item)}
//                           </Avatar>
//                           <Box>
//                             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
//                               {item.miv_number || item._id?.slice(-8)}
//                             </Typography>
//                             <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                               ID: {item._id?.slice(-8)}
//                             </Typography>
//                           </Box>
//                         </Stack>
//                       </TableCell>
               
                     
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                           {item.wo_number || getDisplayValue(item.wo_id, 'wo_number') || '-'}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem' }}>
//                           {item.department_name || getDisplayValue(item.department, 'DepartmentName') || '-'}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem' }}>
//                           {getPersonName(item.issued_by)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                           {item.items_count || item.items?.length || 0}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
//                           ₹ {(item.total_issue_cost || 0).toLocaleString()}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={item.status}
//                           size="small"
//                           sx={{
//                             fontSize: '0.65rem',
//                             height: 24,
//                             bgcolor: statusColors.bg,
//                             color: statusColors.color,
//                             fontWeight: 500
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell align="center">
//                         <ActionMenu
//                           item={item}
//                           anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
//                           onOpen={(e) => handleActionMenuOpen(e, item)}
//                           onClose={handleActionMenuClose}
//                           onView={openViewModalHandler}
//                           onEdit={openEditModalHandler}
//                           onDelete={openDeleteDialogHandler}
//                           onPost={openPostDialogHandler}
//                           onPrint={openPrintModalHandler}
//                           permissions={userPermissions}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
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
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           sx={{
//             borderTop: `1px solid ${COLORS.border}`,
//             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
//               fontSize: '0.7rem',
//               color: COLORS.text.secondary
//             }
//           }}
//         />
//       </Paper>

//       {/* Modals - Only render if user has appropriate permissions */}
//       {canCreate && (
//         <AddMIV
//           open={openAddModal}
//           onClose={() => setOpenAddModal(false)}
//           onAdd={handleAddMIV}
//         />
//       )}
      
//       {selectedItem && (
//         <>
//           {canViewPage && (
//             <ViewMIV
//               open={openViewModal}
//               onClose={() => {
//                 setOpenViewModal(false);
//                 setSelectedItem(null);
//               }}
//               data={selectedItem}
//             />
//           )}
          
//           {canUpdate && (
//             <EditMIV
//               open={openEditModal}
//               onClose={() => {
//                 setOpenEditModal(false);
//                 setSelectedItem(null);
//               }}
//               data={selectedItem}
//               onUpdate={handleEditMIV}
//             />
//           )}
          
//           {canDelete && (
//             <DeleteMIV
//               open={openDeleteDialog}
//               onClose={() => {
//                 setOpenDeleteDialog(false);
//                 setSelectedItem(null);
//               }}
//               mivData={selectedItem}
//               onDelete={handleDeleteMIV}
//             />
//           )}
          
//           {canPost && (
//             <PostMIV
//               open={openPostDialog}
//               onClose={() => {
//                 setOpenPostDialog(false);
//                 setSelectedItem(null);
//               }}
//               data={selectedItem}
//               onPost={handlePostMIV}
//             />
//           )}
          
//           {canPrint && (
//             <PrintMIV
//               open={openPrintModal}
//               onClose={() => {
//                 setOpenPrintModal(false);
//                 setSelectedItem(null);
//               }}
//               data={selectedItem}
//             />
//           )}
//         </>
//       )}
      
//       {canViewPage && (
//         <MIVSummary
//           open={openSummaryModal}
//           onClose={() => setOpenSummaryModal(false)}
//         />
//       )}
      
//       {/* Snackbar */}
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
//           sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default MIVMaster;





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
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  PostAdd as PostAddIcon,
  MoreVert as MoreVertIcon,
  Assessment as AssessmentIcon,
  Inventory as InventoryIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddMIV from './AddMIV';
import ViewMIV from './ViewMIV';
import EditMIV from './EditMIV';
import DeleteMIV from './DeleteMIV';
import PostMIV from './PostMIV';
import PrintMIV from './PrintMIV';
import MIVSummary from './MIVSummary';

// ==================== COLORS ====================
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F',
  },
  border: '#E3E8EF',
  chips: {
    draft: '#FEF3C7',
    issued: '#D1FAE5',
    partiallyReturned: '#FEF3C7',
    fullyReturned: '#E0E7FF',
    closed: '#F1F5F9',
    cancelled: '#FEE2E2',
  }
};

// MIV Status constants matching backend
const MIV_STATUS = {
  DRAFT: 'Draft',
  ISSUED: 'Issued',
  PARTIALLY_RETURNED: 'Partially Returned',
  FULLY_RETURNED: 'Fully Returned',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled'
};

// Status colors for chips
const getStatusColor = (status) => {
  const colors = {
    [MIV_STATUS.DRAFT]: { bg: '#FEF3C7', color: '#D97706' },
    [MIV_STATUS.ISSUED]: { bg: '#D1FAE5', color: '#059669' },
    [MIV_STATUS.PARTIALLY_RETURNED]: { bg: '#FEF3C7', color: '#D97706' },
    [MIV_STATUS.FULLY_RETURNED]: { bg: '#E0E7FF', color: '#4F46E5' },
    [MIV_STATUS.CLOSED]: { bg: '#F1F5F9', color: '#475569' },
    [MIV_STATUS.CANCELLED]: { bg: '#FEE2E2', color: '#DC2626' }
  };
  return colors[status] || { bg: '#F1F5F9', color: '#475569' };
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
    <Typography variant="h6" color="error" sx={{ mb: 2 }}>
      Access Denied
    </Typography>
    <Typography variant="body2" color="text.secondary">
      You don't have permission to view this page. Please contact your administrator.
    </Typography>
  </Box>
);

// ==================== ACTION MENU COMPONENT - WITH CORRECT PERMISSIONS ====================
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onPost, onPrint, permissions, isSuperAdmin }) => {
  const isDraft = item.status === MIV_STATUS.DRAFT;
  const isIssued = item.status === MIV_STATUS.ISSUED;
  
  // Permission checks - USING CORRECT MODULE AND PAGE
  const canView = isSuperAdmin || hasPermission(permissions, MODULES.INVENTORY_MANAGEMENT, PAGES.MIV_MASTER, ACTIONS.VIEW);
  const canUpdate = isSuperAdmin || hasPermission(permissions, MODULES.INVENTORY_MANAGEMENT, PAGES.MIV_MASTER, ACTIONS.UPDATE);
  const canDelete = isSuperAdmin || hasPermission(permissions, MODULES.INVENTORY_MANAGEMENT, PAGES.MIV_MASTER, ACTIONS.DELETE);
  const canCreate = isSuperAdmin || hasPermission(permissions, MODULES.INVENTORY_MANAGEMENT, PAGES.MIV_MASTER, ACTIONS.CREATE);
  const canPrint = isSuperAdmin || hasPermission(permissions, MODULES.INVENTORY_MANAGEMENT, PAGES.MIV_MASTER, ACTIONS.PRINT);

  if (!canView && !canUpdate && !canDelete && !canCreate && !canPrint) {
    return null;
  }

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={onOpen}
          sx={{
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: `${COLORS.primary}20`
            }
          }}
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
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
          }
        }}
      >
        {/* View Details - VIEW permission */}
        {canView && (
          <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                View Details
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {/* Edit - UPDATE permission, only for Draft */}
        {canUpdate && isDraft && (
          <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                Edit
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {/* Post & Issue - CREATE permission, only for Draft */}
        {canCreate && isDraft && (
          <MenuItem onClick={() => { onPost(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <PostAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#10B981' }}>
                Post & Issue
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {/* Print MIV - PRINT permission, only for Draft or Issued */}
        {canPrint && (isDraft || isIssued) && (
          <MenuItem onClick={() => { onPrint(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#F59E0B' }}>
                Print MIV
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {/* Cancel/Delete - DELETE permission, only for Draft */}
        {canDelete && isDraft && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
                  Cancel MIV
                </Typography>
              </ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

// ==================== MAIN COMPONENT ====================
const MIVMaster = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemForAction, setSelectedItemForAction] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [openPrintModal, setOpenPrintModal] = useState(false);

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Ref for search debouncing
  const isSearchingRef = React.useRef(false);
  const searchTimeoutRef = React.useRef(null);

  // Fetch user permissions
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const userData = response.data.data;
          setIsSuperAdmin(userData.isSuperAdmin || false);

          if (userData.permissions && Array.isArray(userData.permissions)) {
            setUserPermissions(userData.permissions);
          } else {
            setUserPermissions([]);
          }
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

  // Check permission helper - USING CORRECT MODULE AND PAGE
  const checkPermission = (action) => {
    if (isSuperAdmin) return true;
    return hasPermission(
      userPermissions,
      MODULES.INVENTORY_MANAGEMENT,
      PAGES.MIV_MASTER,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canPrint = checkPermission(ACTIONS.PRINT);

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    isSearchingRef.current = true;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
      setPage(0);
      isSearchingRef.current = false;
    }, 500);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setPage(0);
    isSearchingRef.current = false;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const fetchMIVs = useCallback(async () => {
    if (!canViewPage && !isSuperAdmin) return;

    if (!isSearchingRef.current) {
      setLoading(true);
    }

    try {
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const response = await axios.get(`${BASE_URL}/api/miv?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setData(response.data.data || []);
        setTotalItems(response.data.pagination?.total || response.data.data?.length || 0);
      } else {
        showNotification('Failed to load MIVs', 'error');
      }
    } catch (err) {
      console.error('Error fetching MIVs:', err);
      showNotification(err.response?.data?.message || 'Failed to load MIVs', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchMIVs();
    }
  }, [fetchMIVs, permissionsLoaded, canViewPage, isSuperAdmin]);

  // Handle refresh
  const handleRefresh = () => {
    fetchMIVs();
    showNotification('Data refreshed', 'success');
  };

  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    if (event.target.checked) {
      setSelected(data.map(item => item._id));
    } else {
      setSelected([]);
    }
  };

  // Handle single selection - only if user has delete permission
  const handleSelect = (id) => {
    if (!canDelete) return;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(item => item !== id);
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };
  
  const handleStatusFilterChange = (event, newValue) => {
    if (newValue !== null) {
      setStatusFilter(newValue);
      setPage(0);
      setSelected([]);
    }
  };
  
  const handleAddMIV = () => {
    fetchMIVs();
    showNotification('MIV created successfully!', 'success');
  };
  
  const handleEditMIV = () => {
    fetchMIVs();
    showNotification('MIV updated successfully!', 'success');
  };
  
  const handleDeleteMIV = () => {
    fetchMIVs();
    setSelected([]);
    showNotification('MIV cancelled successfully!', 'success');
  };
  
  const handlePostMIV = () => {
    fetchMIVs();
    showNotification('MIV posted and materials issued successfully!', 'success');
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (!canDelete) return;
    showNotification('Bulk delete requires API implementation', 'warning');
  };
  
  const handleActionMenuOpen = (event, item) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedItemForAction(item);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedItemForAction(null);
  };

  const openViewModalHandler = (item) => {
    setSelectedItem(item);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openEditModalHandler = (item) => {
    if (!canUpdate) {
      showNotification('You don\'t have permission to edit MIVs', 'error');
      return;
    }
    setSelectedItem(item);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteDialogHandler = (item) => {
    if (!canDelete) {
      showNotification('You don\'t have permission to cancel MIVs', 'error');
      return;
    }
    setSelectedItem(item);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };
  
  const openPostDialogHandler = (item) => {
    if (!canCreate) {
      showNotification('You don\'t have permission to post MIVs', 'error');
      return;
    }
    setSelectedItem(item);
    setOpenPostDialog(true);
    handleActionMenuClose();
  };
  
  const openPrintModalHandler = (item) => {
    if (!canPrint) {
      showNotification('You don\'t have permission to print MIVs', 'error');
      return;
    }
    setSelectedItem(item);
    setOpenPrintModal(true);
    handleActionMenuClose();
  };
  
  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  
  const getMIVInitials = (miv) => {
    if (!miv.miv_number) return 'MIV';
    return miv.miv_number.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (miv) => {
    if (!miv.miv_number) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = miv.miv_number.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const getDisplayValue = (obj, field) => {
    if (!obj) return '-';
    if (typeof obj === 'object') {
      return obj[field] || obj[field.toLowerCase()] || '-';
    }
    return obj;
  };

  const getPersonName = (person) => {
    if (!person) return '-';
    if (typeof person === 'object') {
      if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
      if (person.FirstName) return person.FirstName;
      if (person.Username) return person.Username;
      if (person.Email) return person.Email;
      if (person.name) return person.name;
      return person._id?.slice(-6) || '-';
    }
    return person;
  };

  // Show loading state while permissions are being fetched
  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  // If user doesn't have view permission, show access denied
  if (!canViewPage && !isSuperAdmin) {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Material Issue Voucher
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage material issue vouchers and track raw material issuance to production
        </Typography>
      </Box>

      {/* Status Filter Tabs */}
      <Paper sx={{ 
        mb: 2.5, 
        borderRadius: 2, 
        border: `1px solid ${COLORS.border}`, 
        overflow: 'hidden' 
      }}>
        <Tabs
          value={statusFilter}
          onChange={handleStatusFilterChange}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              minHeight: 40,
              px: 3,
              color: COLORS.text.secondary,
              '&.Mui-selected': { color: COLORS.primary }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: COLORS.primary,
              height: 2
            }
          }}
        >
          <Tab label="All" value="all" />
          <Tab label="Draft" value={MIV_STATUS.DRAFT} />
          <Tab label="Issued" value={MIV_STATUS.ISSUED} />
          <Tab label="Partially Returned" value={MIV_STATUS.PARTIALLY_RETURNED} />
          <Tab label="Fully Returned" value={MIV_STATUS.FULLY_RETURNED} />
          <Tab label="Closed" value={MIV_STATUS.CLOSED} />
          <Tab label="Cancelled" value={MIV_STATUS.CANCELLED} />
        </Tabs>
      </Paper>

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
          <TextField
            placeholder="Search by MIV Number, Work Order, or Remarks..."
            size="small"
            value={searchInput}
            onChange={handleSearchChange}
            autoComplete="off"
            sx={{
              width: { xs: '100%', sm: 450 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                fontSize: '0.75rem',
                '&:hover fieldset': {
                  borderColor: COLORS.primary,
                },
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
                  <IconButton size="small" onClick={handleClearSearch}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                height: 36,
                bgcolor: COLORS.background.light,
                '& input': {
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  color: COLORS.text.primary,
                  '&::placeholder': {
                    color: COLORS.text.tertiary,
                    fontSize: '0.75rem'
                  }
                }
              }
            }}
            disabled={loading}
          />

          <Stack direction="row" spacing={1.5}>
            {/* Refresh Button */}
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: COLORS.text.secondary,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}20`
                  }
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Bulk Delete Button - Only show if user has delete permission */}
            {canDelete && selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleBulkDelete}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderColor: '#fee2e2',
                  color: '#991b1b',
                  '&:hover': {
                    borderColor: '#fecaca',
                    bgcolor: '#fee2e2'
                  }
                }}
                disabled={loading}
              >
                Delete ({selected.length})
              </Button>
            )}
            
            {/* Summary Report Button - Only show if user has view permission */}
            {canViewPage && (
              <Button
                variant="outlined"
                startIcon={<AssessmentIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenSummaryModal(true)}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderColor: COLORS.primary,
                  color: COLORS.primary,
                  '&:hover': {
                    borderColor: COLORS.primaryDark,
                    bgcolor: COLORS.primaryLight
                  }
                }}
              >
                Summary Report
              </Button>
            )}
            
            {/* Add MIV Button - Only show if user has create permission */}
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenAddModal(true)}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: COLORS.primary,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: COLORS.primaryDark,
                  }
                }}
                disabled={loading}
              >
                New MIV
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Table */}
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
                  py: 1.5,
                }
              }}>
                {/* Checkbox Column - Only show if user has delete permission */}
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < data.length}
                      checked={data.length > 0 && selected.length === data.length}
                      onChange={handleSelectAll}
                      sx={{
                        color: COLORS.text.light,
                        '&.Mui-checked': {
                          color: COLORS.text.light,
                        },
                        '&.MuiCheckbox-indeterminate': {
                          color: COLORS.text.light,
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.25rem'
                        }
                      }}
                      disabled={loading || data.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  MIV No.
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Work Order
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Department
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Issued By
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Items
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Total Cost
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', mt: 1, color: COLORS.text.secondary }}>
                      Loading MIVs...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                    <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
                      {searchTerm ? 'No MIVs found matching your search' : 'No MIVs available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => {
                  const isSelected = selected.includes(item._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedItemForAction?._id === item._id;
                  const statusColors = getStatusColor(item.status);
                  
                  return (
                    <TableRow
                      key={item._id}
                      hover
                      selected={isSelected}
                      sx={{
                        '&:hover': { bgcolor: COLORS.background.hover },
                        '&.Mui-selected': {
                          bgcolor: `${COLORS.primary}10`,
                          '&:hover': {
                            bgcolor: `${COLORS.primary}20`
                          }
                        }
                      }}
                    >
                      {/* Checkbox Column - Only show if user has delete permission */}
                      {canDelete && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(item._id)}
                            sx={{
                              color: COLORS.primary,
                              '&.Mui-checked': {
                                color: COLORS.primary,
                              },
                              '& .MuiSvgIcon-root': {
                                fontSize: '1.25rem'
                              }
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(item), fontSize: '0.7rem', fontWeight: 600 }}>
                            {getMIVInitials(item)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                              {item.miv_number || item._id?.slice(-8)}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              ID: {item._id?.slice(-8)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {item.wo_number || getDisplayValue(item.wo_id, 'wo_number') || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {item.department_name || getDisplayValue(item.department, 'DepartmentName') || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {getPersonName(item.issued_by)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {item.items_count || item.items?.length || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                          ₹ {(item.total_issue_cost || 0).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            height: 24,
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <ActionMenu
                          item={item}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onOpen={(e) => handleActionMenuOpen(e, item)}
                          onClose={handleActionMenuClose}
                          onView={openViewModalHandler}
                          onEdit={openEditModalHandler}
                          onDelete={openDeleteDialogHandler}
                          onPost={openPostDialogHandler}
                          onPrint={openPrintModalHandler}
                          permissions={userPermissions}
                          isSuperAdmin={isSuperAdmin}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
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
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.7rem',
              color: COLORS.text.secondary
            }
          }}
        />
      </Paper>

      {/* Modals - Only render if user has appropriate permissions */}
      {canCreate && (
        <AddMIV
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddMIV}
        />
      )}
      
      {selectedItem && (
        <>
          {canViewPage && (
            <ViewMIV
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedItem(null);
              }}
              data={selectedItem}
            />
          )}
          
          {canUpdate && (
            <EditMIV
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedItem(null);
              }}
              data={selectedItem}
              onUpdate={handleEditMIV}
            />
          )}
          
          {canDelete && (
            <DeleteMIV
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedItem(null);
              }}
              mivData={selectedItem}
              onDelete={handleDeleteMIV}
            />
          )}
          
          {canCreate && (
            <PostMIV
              open={openPostDialog}
              onClose={() => {
                setOpenPostDialog(false);
                setSelectedItem(null);
              }}
              data={selectedItem}
              onPost={handlePostMIV}
            />
          )}
          
          {canPrint && (
            <PrintMIV
              open={openPrintModal}
              onClose={() => {
                setOpenPrintModal(false);
                setSelectedItem(null);
              }}
              data={selectedItem}
            />
          )}
        </>
      )}
      
      {canViewPage && (
        <MIVSummary
          open={openSummaryModal}
          onClose={() => setOpenSummaryModal(false)}
        />
      )}
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MIVMaster;