// // // import React, { useState, useEffect, useCallback } from 'react';
// // // import {
// // //   Box,
// // //   Paper,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   IconButton,
// // //   Button,
// // //   TextField,
// // //   InputAdornment,
// // //   Tooltip,
// // //   Typography,
// // //   Snackbar,
// // //   TablePagination,
// // //   Stack,
// // //   Chip,
// // //   Alert,
// // //   CircularProgress,
// // //   Tabs,
// // //   Tab,
// // //   Menu,
// // //   MenuItem,
// // //   ListItemIcon,
// // //   ListItemText,
// // //   Divider,
// // //   Avatar
// // // } from '@mui/material';
// // // import {
// // //   Search as SearchIcon,
// // //   Add as AddIcon,
// // //   Visibility as ViewIcon,
// // //   Edit as EditIcon,
// // //   Delete as DeleteIcon,
// // //   Print as PrintIcon,
// // //   PostAdd as PostAddIcon,
// // //   MoreVert as MoreVertIcon,
// // //   Assessment as AssessmentIcon,
// // //   Inventory as InventoryIcon,
// // //   Cancel as CancelIcon,
// // //   Warehouse as WarehouseIcon
// // // } from '@mui/icons-material';
// // // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // // import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // // import axios from 'axios';
// // // import BASE_URL from '../../../config/Config';
// // // import AddMRV from './AddMRV';
// // // // import ViewMRV from './ViewMRV';
// // // // import EditMRV from './EditMRV';
// // // // import CancelMRV from './CancelMRV';
// // // // import PostMRV from './PostMRV';
// // // // import PrintMRV from './PrintMRV';

// // // // ==================== COLORS ====================
// // // const COLORS = {
// // //   primary: '#063C3F',
// // //   primaryLight: '#E8F0F1',
// // //   primaryDark: '#05292B',
// // //   text: {
// // //     primary: '#151C26',
// // //     secondary: '#4B5568',
// // //     tertiary: '#94A3B8',
// // //     light: '#FFFFFF',
// // //   },
// // //   background: {
// // //     white: '#FFFFFF',
// // //     light: '#F8FFFC',
// // //     hover: '#F0FDF9',
// // //     tableHeader: '#063C3F',
// // //   },
// // //   border: '#E3E8EF',
// // //   chips: {
// // //     draft: '#FEF3C7',
// // //     posted: '#D1FAE5',
// // //     cancelled: '#FEE2E2',
// // //     partiallyReturned: '#FEF3C7'
// // //   }
// // // };

// // // // MRV Status constants
// // // const MRV_STATUS = {
// // //   DRAFT: 'Draft',
// // //   POSTED: 'Posted',
// // //   CANCELLED: 'Cancelled',
// // //   PARTIALLY_RETURNED: 'Partially Returned'
// // // };

// // // // Condition colors
// // // const getConditionColor = (condition) => {
// // //   const colors = {
// // //     Good: { bg: '#D1FAE5', color: '#059669' },
// // //     Damaged: { bg: '#FEE2E2', color: '#DC2626' },
// // //     Scrap: { bg: '#FEF3C7', color: '#D97706' },
// // //     Rejected: { bg: '#FEE2E2', color: '#DC2626' },
// // //     Expired: { bg: '#F1F5F9', color: '#475569' }
// // //   };
// // //   return colors[condition] || { bg: '#F1F5F9', color: '#475569' };
// // // };

// // // // Status colors for chips
// // // const getStatusColor = (status) => {
// // //   const colors = {
// // //     [MRV_STATUS.DRAFT]: { bg: '#FEF3C7', color: '#D97706' },
// // //     [MRV_STATUS.POSTED]: { bg: '#D1FAE5', color: '#059669' },
// // //     [MRV_STATUS.CANCELLED]: { bg: '#FEE2E2', color: '#DC2626' },
// // //     [MRV_STATUS.PARTIALLY_RETURNED]: { bg: '#FEF3C7', color: '#D97706' }
// // //   };
// // //   return colors[status] || { bg: '#F1F5F9', color: '#475569' };
// // // };

// // // // ==================== ACTION MENU COMPONENT ====================
// // // const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onPost, onPrint }) => {
// // //   const isDraft = item.status === MRV_STATUS.DRAFT;
// // //   const isPosted = item.status === MRV_STATUS.POSTED;

// // //   return (
// // //     <>
// // //       <Tooltip title="Actions">
// // //         <IconButton
// // //           size="small"
// // //           onClick={onOpen}
// // //           sx={{
// // //             color: COLORS.text.secondary,
// // //             '&:hover': {
// // //               bgcolor: `${COLORS.primary}20`
// // //             }
// // //           }}
// // //         >
// // //           <MoreVertIcon fontSize="small" />
// // //         </IconButton>
// // //       </Tooltip>
// // //       <Menu
// // //         anchorEl={anchorEl}
// // //         open={Boolean(anchorEl)}
// // //         onClose={onClose}
// // //         PaperProps={{
// // //           elevation: 3,
// // //           sx: {
// // //             mt: 1,
// // //             minWidth: 180,
// // //             borderRadius: 2,
// // //             border: `1px solid ${COLORS.border}`,
// // //           }
// // //         }}
// // //       >
// // //         <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
// // //           <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
// // //             <ViewIcon fontSize="small" />
// // //           </ListItemIcon>
// // //           <ListItemText>
// // //             <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
// // //               View Details
// // //             </Typography>
// // //           </ListItemText>
// // //         </MenuItem>

// // //         {isDraft && (
// // //           <>
// // //             <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
// // //               <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
// // //                 <EditIcon fontSize="small" />
// // //               </ListItemIcon>
// // //               <ListItemText>
// // //                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
// // //                   Edit
// // //                 </Typography>
// // //               </ListItemText>
// // //             </MenuItem>

// // //             <MenuItem onClick={() => { onPost(item); onClose(); }} sx={{ py: 1.5 }}>
// // //               <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
// // //                 <PostAddIcon fontSize="small" />
// // //               </ListItemIcon>
// // //               <ListItemText>
// // //                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#10B981' }}>
// // //                   Post & Return
// // //                 </Typography>
// // //               </ListItemText>
// // //             </MenuItem>
// // //           </>
// // //         )}

// // //         {(isDraft || isPosted) && (
// // //           <MenuItem onClick={() => { onPrint(item); onClose(); }} sx={{ py: 1.5 }}>
// // //             <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
// // //               <PrintIcon fontSize="small" />
// // //             </ListItemIcon>
// // //             <ListItemText>
// // //               <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#F59E0B' }}>
// // //                 Print MRV
// // //               </Typography>
// // //             </ListItemText>
// // //           </MenuItem>
// // //         )}

// // //         {isDraft && (
// // //           <>
// // //             <Divider sx={{ my: 0.5 }} />
// // //             <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
// // //               <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
// // //                 <CancelIcon fontSize="small" />
// // //               </ListItemIcon>
// // //               <ListItemText>
// // //                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
// // //                   Cancel MRV
// // //                 </Typography>
// // //               </ListItemText>
// // //             </MenuItem>
// // //           </>
// // //         )}
// // //       </Menu>
// // //     </>
// // //   );
// // // };

// // // // ==================== MAIN COMPONENT ====================
// // // const MRVMaster = () => {
// // //   const [data, setData] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [searchInput, setSearchInput] = useState('');
// // //   const [page, setPage] = useState(0);
// // //   const [rowsPerPage, setRowsPerPage] = useState(10);
// // //   const [totalItems, setTotalItems] = useState(0);
// // //   const [statusFilter, setStatusFilter] = useState('all');
// // //   const [conditionFilter, setConditionFilter] = useState('');
// // //   const [fromDate, setFromDate] = useState(null);
// // //   const [toDate, setToDate] = useState(null);
// // //   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
// // //   const [selectedItem, setSelectedItem] = useState(null);
// // //   const [selectedItemForAction, setSelectedItemForAction] = useState(null);
// // //   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

// // //   // Modal states
// // //   const [openAddModal, setOpenAddModal] = useState(false);
// // //   const [openViewModal, setOpenViewModal] = useState(false);
// // //   const [openEditModal, setOpenEditModal] = useState(false);
// // //   const [openCancelDialog, setOpenCancelDialog] = useState(false);
// // //   const [openPostDialog, setOpenPostDialog] = useState(false);
// // //   const [openPrintModal, setOpenPrintModal] = useState(false);

// // //   // Filter drawer state
// // //   const [showFilters, setShowFilters] = useState(false);

// // //   // Debounce search
// // //   useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       setSearchTerm(searchInput);
// // //       setPage(0);
// // //     }, 500);
// // //     return () => clearTimeout(timer);
// // //   }, [searchInput]);

// // //   const fetchMRVs = useCallback(async () => {
// // //     try {
// // //       setLoading(true);
// // //       const token = localStorage.getItem('token');

// // //       const params = new URLSearchParams({
// // //         page: page + 1,
// // //         limit: rowsPerPage
// // //       });

// // //       if (searchTerm) params.append('search', searchTerm);
// // //       if (statusFilter !== 'all') params.append('status', statusFilter);
// // //       if (conditionFilter) params.append('condition', conditionFilter);
// // //       if (fromDate) params.append('from_date', fromDate.toISOString().split('T')[0]);
// // //       if (toDate) params.append('to_date', toDate.toISOString().split('T')[0]);

// // //       const response = await axios.get(`${BASE_URL}/api/mrv?${params.toString()}`, {
// // //         headers: { 'Authorization': `Bearer ${token}` }
// // //       });

// // //       if (response.data.success) {
// // //         setData(response.data.data || []);
// // //         setTotalItems(response.data.pagination?.total || response.data.data?.length || 0);
// // //       } else {
// // //         showNotification('Failed to load MRVs', 'error');
// // //       }
// // //     } catch (err) {
// // //       console.error('Error fetching MRVs:', err);
// // //       showNotification(err.response?.data?.message || 'Failed to load MRVs', 'error');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [page, rowsPerPage, searchTerm, statusFilter, conditionFilter, fromDate, toDate]);

// // //   useEffect(() => {
// // //     fetchMRVs();
// // //   }, [fetchMRVs]);

// // //   const handleChangePage = (event, newPage) => {
// // //     setPage(newPage);
// // //   };

// // //   const handleChangeRowsPerPage = (event) => {
// // //     setRowsPerPage(parseInt(event.target.value, 10));
// // //     setPage(0);
// // //   };

// // //   const handleStatusFilterChange = (event, newValue) => {
// // //     if (newValue !== null) {
// // //       setStatusFilter(newValue);
// // //       setPage(0);
// // //     }
// // //   };

// // //   const handleConditionFilterChange = (event) => {
// // //     setConditionFilter(event.target.value);
// // //     setPage(0);
// // //   };

// // //   const handleClearFilters = () => {
// // //     setStatusFilter('all');
// // //     setConditionFilter('');
// // //     setFromDate(null);
// // //     setToDate(null);
// // //     setSearchInput('');
// // //     setPage(0);
// // //   };

// // //   const handleAddMRV = () => {
// // //     fetchMRVs();
// // //     showNotification('MRV created successfully!', 'success');
// // //   };

// // //   const handleEditMRV = () => {
// // //     fetchMRVs();
// // //     showNotification('MRV updated successfully!', 'success');
// // //   };

// // //   const handleCancelMRV = () => {
// // //     fetchMRVs();
// // //     showNotification('MRV cancelled successfully!', 'success');
// // //   };

// // //   const handlePostMRV = () => {
// // //     fetchMRVs();
// // //     showNotification('MRV posted and materials returned successfully!', 'success');
// // //   };

// // //   const handleActionMenuOpen = (event, item) => {
// // //     setActionMenuAnchor(event.currentTarget);
// // //     setSelectedItemForAction(item);
// // //   };

// // //   const handleActionMenuClose = () => {
// // //     setActionMenuAnchor(null);
// // //     setSelectedItemForAction(null);
// // //   };

// // //   const openViewModalHandler = (item) => {
// // //     setSelectedItem(item);
// // //     setOpenViewModal(true);
// // //     handleActionMenuClose();
// // //   };

// // //   const openEditModalHandler = (item) => {
// // //     setSelectedItem(item);
// // //     setOpenEditModal(true);
// // //     handleActionMenuClose();
// // //   };

// // //   const openCancelDialogHandler = (item) => {
// // //     setSelectedItem(item);
// // //     setOpenCancelDialog(true);
// // //     handleActionMenuClose();
// // //   };

// // //   const openPostDialogHandler = (item) => {
// // //     setSelectedItem(item);
// // //     setOpenPostDialog(true);
// // //     handleActionMenuClose();
// // //   };

// // //   const openPrintModalHandler = (item) => {
// // //     setSelectedItem(item);
// // //     setOpenPrintModal(true);
// // //     handleActionMenuClose();
// // //   };

// // //   const showNotification = (message, severity) => {
// // //     setSnackbar({ open: true, message, severity });
// // //   };

// // //   const getMRVInitials = (mrv) => {
// // //     if (!mrv.mrv_number) return 'MRV';
// // //     return mrv.mrv_number.substring(0, 2).toUpperCase();
// // //   };

// // //   const getAvatarColor = (mrv) => {
// // //     if (!mrv.mrv_number) return COLORS.primary;
// // //     const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
// // //     const charCode = mrv.mrv_number.charCodeAt(0) || 0;
// // //     return colors[charCode % colors.length];
// // //   };

// // //   const formatDate = (dateString) => {
// // //     if (!dateString) return '-';
// // //     try {
// // //       return new Date(dateString).toLocaleDateString('en-US', {
// // //         year: 'numeric',
// // //         month: 'short',
// // //         day: 'numeric'
// // //       });
// // //     } catch {
// // //       return '-';
// // //     }
// // //   };

// // //   const getDisplayValue = (obj, field) => {
// // //     if (!obj) return '-';
// // //     if (typeof obj === 'object') {
// // //       return obj[field] || obj[field.toLowerCase()] || '-';
// // //     }
// // //     return obj;
// // //   };

// // //   const getPersonName = (person) => {
// // //     if (!person) return '-';
// // //     if (typeof person === 'object') {
// // //       if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
// // //       if (person.FirstName) return person.FirstName;
// // //       if (person.Username) return person.Username;
// // //       if (person.Email) return person.Email;
// // //       if (person.name) return person.name;
// // //       return person._id?.slice(-6) || '-';
// // //     }
// // //     return person;
// // //   };

// // //   return (
// // //     <LocalizationProvider dateAdapter={AdapterDateFns}>
// // //       <Box sx={{ p: 2.5 }}>
// // //         {/* Page Header */}
// // //         <Box sx={{ mb: 2.5 }}>
// // //           <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
// // //             Material Return Voucher
// // //           </Typography>
// // //           <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
// // //             Manage material return vouchers and track returned materials to store
// // //           </Typography>
// // //         </Box>

// // //         {/* Status Filter Tabs */}
// // //         <Paper sx={{ 
// // //           mb: 2.5, 
// // //           borderRadius: 2, 
// // //           border: `1px solid ${COLORS.border}`, 
// // //           overflow: 'hidden' 
// // //         }}>
// // //           <Tabs
// // //             value={statusFilter}
// // //             onChange={handleStatusFilterChange}
// // //             sx={{
// // //               minHeight: 40,
// // //               '& .MuiTab-root': {
// // //                 textTransform: 'none',
// // //                 fontSize: '0.75rem',
// // //                 fontWeight: 500,
// // //                 minHeight: 40,
// // //                 px: 3,
// // //                 color: COLORS.text.secondary,
// // //                 '&.Mui-selected': { color: COLORS.primary }
// // //               },
// // //               '& .MuiTabs-indicator': {
// // //                 backgroundColor: COLORS.primary,
// // //                 height: 2
// // //               }
// // //             }}
// // //           >
// // //             <Tab label="All" value="all" />
// // //             <Tab label="Draft" value={MRV_STATUS.DRAFT} />
// // //             <Tab label="Posted" value={MRV_STATUS.POSTED} />
// // //             <Tab label="Cancelled" value={MRV_STATUS.CANCELLED} />
// // //           </Tabs>
// // //         </Paper>

// // //         {/* Action Bar */}
// // //         <Paper sx={{
// // //           p: 1.5,
// // //           mb: 2.5,
// // //           borderRadius: 2,
// // //           bgcolor: COLORS.background.white,
// // //           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
// // //           border: `1px solid ${COLORS.border}`
// // //         }}>
// // //           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
// // //             <TextField
// // //               placeholder="Search by MRV Number, MIV Number, or Remarks..."
// // //               size="small"
// // //               value={searchInput}
// // //               onChange={(e) => setSearchInput(e.target.value)}
// // //               sx={{
// // //                 width: { xs: '100%', sm: 350 },
// // //                 '& .MuiOutlinedInput-root': {
// // //                   borderRadius: 1.5,
// // //                   fontSize: '0.75rem',
// // //                   '&:hover fieldset': {
// // //                     borderColor: COLORS.primary,
// // //                   },
// // //                 }
// // //               }}
// // //               InputProps={{
// // //                 startAdornment: (
// // //                   <InputAdornment position="start">
// // //                     <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
// // //                   </InputAdornment>
// // //                 ),
// // //                 sx: {
// // //                   height: 36,
// // //                   bgcolor: COLORS.background.light,
// // //                   '& input': {
// // //                     padding: '6px 12px',
// // //                     fontSize: '0.75rem',
// // //                     color: COLORS.text.primary,
// // //                     '&::placeholder': {
// // //                       color: COLORS.text.tertiary,
// // //                       fontSize: '0.75rem'
// // //                     }
// // //                   }
// // //                 }
// // //               }}
// // //               disabled={loading}
// // //             />

// // //             <Stack direction="row" spacing={1.5}>
// // //               {/* Filter Button */}
// // //               <Button
// // //                 variant="outlined"
// // //                 startIcon={<AssessmentIcon sx={{ fontSize: '1rem' }} />}
// // //                 onClick={() => setShowFilters(!showFilters)}
// // //                 sx={{
// // //                   height: 36,
// // //                   borderRadius: 1.5,
// // //                   textTransform: 'none',
// // //                   fontSize: '0.75rem',
// // //                   fontWeight: 500,
// // //                   borderColor: COLORS.border,
// // //                   color: COLORS.text.secondary,
// // //                   '&:hover': {
// // //                     borderColor: COLORS.primary,
// // //                     color: COLORS.primary
// // //                   }
// // //                 }}
// // //               >
// // //                 {showFilters ? 'Hide Filters' : 'Show Filters'}
// // //               </Button>

// // //               <Button
// // //                 variant="contained"
// // //                 startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
// // //                 onClick={() => setOpenAddModal(true)}
// // //                 sx={{
// // //                   height: 36,
// // //                   borderRadius: 1.5,
// // //                   bgcolor: COLORS.primary,
// // //                   fontSize: '0.75rem',
// // //                   fontWeight: 500,
// // //                   textTransform: 'none',
// // //                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
// // //                   '&:hover': {
// // //                     bgcolor: COLORS.primaryDark,
// // //                   }
// // //                 }}
// // //                 disabled={loading}
// // //               >
// // //                 New MRV
// // //               </Button>
// // //             </Stack>
// // //           </Stack>
// // //         </Paper>

// // //         {/* Advanced Filters */}
// // //         {showFilters && (
// // //           <Paper sx={{
// // //             p: 2,
// // //             mb: 2.5,
// // //             borderRadius: 2,
// // //             bgcolor: COLORS.background.white,
// // //             border: `1px solid ${COLORS.border}`
// // //           }}>
// // //             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
// // //               ADVANCED FILTERS
// // //             </Typography>
// // //             <Grid container spacing={2}>
// // //               <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// // //                 <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
// // //                   CONDITION
// // //                 </Typography>
// // //                 <TextField
// // //                   select
// // //                   fullWidth
// // //                   size="small"
// // //                   value={conditionFilter}
// // //                   onChange={handleConditionFilterChange}
// // //                   sx={inputStyle}
// // //                 >
// // //                   <MenuItem value="">All</MenuItem>
// // //                   <MenuItem value="Good">Good</MenuItem>
// // //                   <MenuItem value="Damaged">Damaged</MenuItem>
// // //                   <MenuItem value="Scrap">Scrap</MenuItem>
// // //                   <MenuItem value="Rejected">Rejected</MenuItem>
// // //                   <MenuItem value="Expired">Expired</MenuItem>
// // //                 </TextField>
// // //               </Grid>
// // //               <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// // //                 <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
// // //                   FROM DATE
// // //                 </Typography>
// // //                 <DatePicker
// // //                   value={fromDate}
// // //                   onChange={setFromDate}
// // //                   slotProps={{
// // //                     textField: {
// // //                       size: 'small',
// // //                       fullWidth: true,
// // //                       sx: inputStyle
// // //                     }
// // //                   }}
// // //                 />
// // //               </Grid>
// // //               <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// // //                 <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
// // //                   TO DATE
// // //                 </Typography>
// // //                 <DatePicker
// // //                   value={toDate}
// // //                   onChange={setToDate}
// // //                   slotProps={{
// // //                     textField: {
// // //                       size: 'small',
// // //                       fullWidth: true,
// // //                       sx: inputStyle
// // //                     }
// // //                   }}
// // //                 />
// // //               </Grid>
// // //               <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
// // //                 <Button
// // //                   variant="outlined"
// // //                   onClick={handleClearFilters}
// // //                   sx={{
// // //                     height: 36,
// // //                     borderRadius: 1.5,
// // //                     textTransform: 'none',
// // //                     fontSize: '0.7rem'
// // //                   }}
// // //                 >
// // //                   Clear Filters
// // //                 </Button>
// // //               </Grid>
// // //             </Grid>
// // //           </Paper>
// // //         )}

// // //         {/* Table */}
// // //         <Paper sx={{
// // //           width: '100%',
// // //           borderRadius: 2,
// // //           overflow: 'hidden',
// // //           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
// // //           border: `1px solid ${COLORS.border}`
// // //         }}>
// // //           <TableContainer>
// // //             <Table size="small">
// // //               <TableHead>
// // //                 <TableRow sx={{
// // //                   bgcolor: COLORS.background.tableHeader,
// // //                   '& .MuiTableCell-root': {
// // //                     borderBottom: 'none',
// // //                     color: COLORS.text.light,
// // //                     py: 1.5,
// // //                   }
// // //                 }}>
// // //                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// // //                     MRV No.
// // //                   </TableCell>
// // //                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// // //                     Date
// // //                   </TableCell>
// // //                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// // //                     MIV No.
// // //                   </TableCell>
// // //                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// // //                     Returned By
// // //                   </TableCell>
// // //                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// // //                     Received By
// // //                   </TableCell>
// // //                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// // //                     Condition
// // //                   </TableCell>
// // //                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// // //                     Items
// // //                   </TableCell>
// // //                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// // //                     Status
// // //                   </TableCell>
// // //                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
// // //                     Actions
// // //                   </TableCell>
// // //                 </TableRow>
// // //               </TableHead>
// // //               <TableBody>
// // //                 {loading ? (
// // //                   <TableRow>
// // //                     <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
// // //                       <CircularProgress size={32} sx={{ color: COLORS.primary }} />
// // //                       <Typography sx={{ fontSize: '0.75rem', mt: 1, color: COLORS.text.secondary }}>
// // //                         Loading MRVs...
// // //                       </Typography>
// // //                     </TableCell>
// // //                   </TableRow>
// // //                 ) : data.length === 0 ? (
// // //                   <TableRow>
// // //                     <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
// // //                       <WarehouseIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
// // //                       <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
// // //                         {searchTerm ? 'No MRVs found matching your search' : 'No MRVs available'}
// // //                       </Typography>
// // //                     </TableCell>
// // //                   </TableRow>
// // //                 ) : (
// // //                   data.map((item) => {
// // //                     const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedItemForAction?._id === item._id;
// // //                     const statusColors = getStatusColor(item.status);
// // //                     const conditionColors = getConditionColor(item.condition);

// // //                     return (
// // //                       <TableRow
// // //                         key={item._id}
// // //                         hover
// // //                         sx={{
// // //                           '&:hover': { bgcolor: COLORS.background.hover }
// // //                         }}
// // //                       >
// // //                         <TableCell>
// // //                           <Stack direction="row" spacing={1.5} alignItems="center">
// // //                             <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(item), fontSize: '0.7rem', fontWeight: 600 }}>
// // //                               {getMRVInitials(item)}
// // //                             </Avatar>
// // //                             <Box>
// // //                               <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
// // //                                 {item.mrv_number || item._id?.slice(-8)}
// // //                               </Typography>
// // //                               <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
// // //                                 ID: {item._id?.slice(-8)}
// // //                               </Typography>
// // //                             </Box>
// // //                           </Stack>
// // //                         </TableCell>
// // //                         <TableCell>
// // //                           <Typography sx={{ fontSize: '0.75rem' }}>
// // //                             {formatDate(item.mrv_date || item.createdAt)}
// // //                           </Typography>
// // //                         </TableCell>
// // //                         <TableCell>
// // //                           <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
// // //                             {item.miv_id?.miv_number || getDisplayValue(item.miv_id, 'miv_number') || '-'}
// // //                           </Typography>
// // //                         </TableCell>
// // //                         <TableCell>
// // //                           <Typography sx={{ fontSize: '0.75rem' }}>
// // //                             {getPersonName(item.returned_by)}
// // //                           </Typography>
// // //                         </TableCell>
// // //                         <TableCell>
// // //                           <Typography sx={{ fontSize: '0.75rem' }}>
// // //                             {getPersonName(item.received_by)}
// // //                           </Typography>
// // //                         </TableCell>
// // //                         <TableCell>
// // //                           <Chip
// // //                             label={item.condition || '-'}
// // //                             size="small"
// // //                             sx={{
// // //                               fontSize: '0.65rem',
// // //                               height: 24,
// // //                               bgcolor: conditionColors.bg,
// // //                               color: conditionColors.color,
// // //                               fontWeight: 500
// // //                             }}
// // //                           />
// // //                         </TableCell>
// // //                         <TableCell>
// // //                           <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
// // //                             {item.items_count || item.items?.length || 0}
// // //                           </Typography>
// // //                         </TableCell>
// // //                         <TableCell>
// // //                           <Chip
// // //                             label={item.status}
// // //                             size="small"
// // //                             sx={{
// // //                               fontSize: '0.65rem',
// // //                               height: 24,
// // //                               bgcolor: statusColors.bg,
// // //                               color: statusColors.color,
// // //                               fontWeight: 500
// // //                             }}
// // //                           />
// // //                         </TableCell>
// // //                         <TableCell align="center">
// // //                           <ActionMenu
// // //                             item={item}
// // //                             anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
// // //                             onOpen={(e) => handleActionMenuOpen(e, item)}
// // //                             onClose={handleActionMenuClose}
// // //                             onView={openViewModalHandler}
// // //                             onEdit={openEditModalHandler}
// // //                             onDelete={openCancelDialogHandler}
// // //                             onPost={openPostDialogHandler}
// // //                             onPrint={openPrintModalHandler}
// // //                           />
// // //                         </TableCell>
// // //                       </TableRow>
// // //                     );
// // //                   })
// // //                 )}
// // //               </TableBody>
// // //             </Table>
// // //           </TableContainer>

// // //           <TablePagination
// // //             rowsPerPageOptions={[5, 10, 25, 50]}
// // //             component="div"
// // //             count={totalItems}
// // //             rowsPerPage={rowsPerPage}
// // //             page={page}
// // //             onPageChange={handleChangePage}
// // //             onRowsPerPageChange={handleChangeRowsPerPage}
// // //             sx={{
// // //               borderTop: `1px solid ${COLORS.border}`,
// // //               '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
// // //                 fontSize: '0.7rem',
// // //                 color: COLORS.text.secondary
// // //               }
// // //             }}
// // //           />
// // //         </Paper>

// // //         {/* Modals */}
// // //         <AddMRV
// // //           open={openAddModal}
// // //           onClose={() => setOpenAddModal(false)}
// // //           onAdd={handleAddMRV}
// // //         />

// // //         {selectedItem && (
// // //           <>
// // //             <ViewMRV
// // //               open={openViewModal}
// // //               onClose={() => {
// // //                 setOpenViewModal(false);
// // //                 setSelectedItem(null);
// // //               }}
// // //               data={selectedItem}
// // //             />

// // //             <EditMRV
// // //               open={openEditModal}
// // //               onClose={() => {
// // //                 setOpenEditModal(false);
// // //                 setSelectedItem(null);
// // //               }}
// // //               data={selectedItem}
// // //               onUpdate={handleEditMRV}
// // //             />

// // //             <CancelMRV
// // //               open={openCancelDialog}
// // //               onClose={() => {
// // //                 setOpenCancelDialog(false);
// // //                 setSelectedItem(null);
// // //               }}
// // //               mrvData={selectedItem}
// // //               onCancel={handleCancelMRV}
// // //             />

// // //             <PostMRV
// // //               open={openPostDialog}
// // //               onClose={() => {
// // //                 setOpenPostDialog(false);
// // //                 setSelectedItem(null);
// // //               }}
// // //               data={selectedItem}
// // //               onPost={handlePostMRV}
// // //             />

// // //             <PrintMRV
// // //               open={openPrintModal}
// // //               onClose={() => {
// // //                 setOpenPrintModal(false);
// // //                 setSelectedItem(null);
// // //               }}
// // //               data={selectedItem}
// // //             />
// // //           </>
// // //         )}

// // //         {/* Snackbar */}
// // //         <Snackbar
// // //           open={snackbar.open}
// // //           autoHideDuration={3000}
// // //           onClose={() => setSnackbar({ ...snackbar, open: false })}
// // //           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// // //         >
// // //           <Alert
// // //             onClose={() => setSnackbar({ ...snackbar, open: false })}
// // //             severity={snackbar.severity}
// // //             variant="filled"
// // //             sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
// // //           >
// // //             {snackbar.message}
// // //           </Alert>
// // //         </Snackbar>
// // //       </Box>
// // //     </LocalizationProvider>
// // //   );
// // // };

// // // // Input style for filters
// // // const inputStyle = {
// // //   '& .MuiOutlinedInput-root': {
// // //     borderRadius: 1.5,
// // //     fontSize: '0.75rem',
// // //     '&:hover fieldset': { borderColor: COLORS.primary },
// // //     '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
// // //   },
// // //   '& .MuiInputBase-input': {
// // //     py: 1,
// // //     px: 1.5,
// // //     fontSize: '0.75rem',
// // //     color: COLORS.text.primary
// // //   }
// // // };

// // // export default MRVMaster;


// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //     Box,
// //     Paper,
// //     Table,
// //     TableBody,
// //     TableCell,
// //     TableContainer,
// //     TableHead,
// //     TableRow,
// //     IconButton,
// //     Button,
// //     TextField,
// //     InputAdornment,
// //     Tooltip,
// //     Typography,
// //     Snackbar,
// //     TablePagination,
// //     Stack,
// //     Chip,
// //     Alert,
// //     CircularProgress,
// //     Tabs,
// //     Tab,
// //     Menu,
// //     MenuItem,
// //     ListItemIcon,
// //     ListItemText,
// //     Divider,
// //     Avatar,
// //     Grid
// // } from '@mui/material';
// // import {
// //     Search as SearchIcon,
// //     Add as AddIcon,
// //     Visibility as ViewIcon,
// //     Edit as EditIcon,
// //     Delete as DeleteIcon,
// //     Print as PrintIcon,
// //     PostAdd as PostAddIcon,
// //     MoreVert as MoreVertIcon,
// //     Assessment as AssessmentIcon,
// //     Inventory as InventoryIcon,
// //     Cancel as CancelIcon,
// //     Warehouse as WarehouseIcon
// // } from '@mui/icons-material';
// // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // import axios from 'axios';
// // import BASE_URL from '../../../config/Config';
// // import AddMRV from './AddMRV';
// // import ViewMRV from './ViewMRV';
// // import EditMRV from './EditMRV';
// // import CancelMRV from './CancelMRV';
// // import DeleteMRV from './DeleteMRV';
// // import PostMRV from './PostMRV';
// // import PrintMRV from './PrintMRV';

// // // ==================== COLORS ====================
// // const COLORS = {
// //     primary: '#063C3F',
// //     primaryLight: '#E8F0F1',
// //     primaryDark: '#05292B',
// //     text: {
// //         primary: '#151C26',
// //         secondary: '#4B5568',
// //         tertiary: '#94A3B8',
// //         light: '#FFFFFF',
// //     },
// //     background: {
// //         white: '#FFFFFF',
// //         light: '#F8FFFC',
// //         hover: '#F0FDF9',
// //         tableHeader: '#063C3F',
// //     },
// //     border: '#E3E8EF',
// //     chips: {
// //         draft: '#FEF3C7',
// //         posted: '#D1FAE5',
// //         cancelled: '#FEE2E2',
// //         partiallyReturned: '#FEF3C7'
// //     }
// // };

// // // MRV Status constants
// // const MRV_STATUS = {
// //     DRAFT: 'Draft',
// //     POSTED: 'Posted',
// //     CANCELLED: 'Cancelled',
// //     PARTIALLY_RETURNED: 'Partially Returned'
// // };

// // // Condition colors
// // const getConditionColor = (condition) => {
// //     const colors = {
// //         Good: { bg: '#D1FAE5', color: '#059669' },
// //         Damaged: { bg: '#FEE2E2', color: '#DC2626' },
// //         Scrap: { bg: '#FEF3C7', color: '#D97706' },
// //         Rejected: { bg: '#FEE2E2', color: '#DC2626' },
// //         Expired: { bg: '#F1F5F9', color: '#475569' }
// //     };
// //     return colors[condition] || { bg: '#F1F5F9', color: '#475569' };
// // };

// // // Status colors for chips
// // const getStatusColor = (status) => {
// //     const colors = {
// //         [MRV_STATUS.DRAFT]: { bg: '#FEF3C7', color: '#D97706' },
// //         [MRV_STATUS.POSTED]: { bg: '#D1FAE5', color: '#059669' },
// //         [MRV_STATUS.CANCELLED]: { bg: '#FEE2E2', color: '#DC2626' },
// //         [MRV_STATUS.PARTIALLY_RETURNED]: { bg: '#FEF3C7', color: '#D97706' }
// //     };
// //     return colors[status] || { bg: '#F1F5F9', color: '#475569' };
// // };

// // // ==================== ACTION MENU COMPONENT ====================
// // const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onCancel, onPost, onPrint }) => {
// //     const isDraft = item.status === MRV_STATUS.DRAFT;
// //     const isPosted = item.status === MRV_STATUS.POSTED;

// //     return (
// //         <>
// //             <Tooltip title="Actions">
// //                 <IconButton
// //                     size="small"
// //                     onClick={onOpen}
// //                     sx={{
// //                         color: COLORS.text.secondary,
// //                         '&:hover': {
// //                             bgcolor: `${COLORS.primary}20`
// //                         }
// //                     }}
// //                 >
// //                     <MoreVertIcon fontSize="small" />
// //                 </IconButton>
// //             </Tooltip>
// //             <Menu
// //                 anchorEl={anchorEl}
// //                 open={Boolean(anchorEl)}
// //                 onClose={onClose}
// //                 PaperProps={{
// //                     elevation: 3,
// //                     sx: {
// //                         mt: 1,
// //                         minWidth: 180,
// //                         borderRadius: 2,
// //                         border: `1px solid ${COLORS.border}`,
// //                     }
// //                 }}
// //             >
// //                 <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
// //                     <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
// //                         <ViewIcon fontSize="small" />
// //                     </ListItemIcon>
// //                     <ListItemText>
// //                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
// //                             View Details
// //                         </Typography>
// //                     </ListItemText>
// //                 </MenuItem>

// //                 {isDraft && (
// //                     <>
// //                         <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
// //                             <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
// //                                 <EditIcon fontSize="small" />
// //                             </ListItemIcon>
// //                             <ListItemText>
// //                                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
// //                                     Edit
// //                                 </Typography>
// //                             </ListItemText>
// //                         </MenuItem>

// //                         <MenuItem onClick={() => { onPost(item); onClose(); }} sx={{ py: 1.5 }}>
// //                             <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
// //                                 <PostAddIcon fontSize="small" />
// //                             </ListItemIcon>
// //                             <ListItemText>
// //                                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#10B981' }}>
// //                                     Post & Return
// //                                 </Typography>
// //                             </ListItemText>
// //                         </MenuItem>
// //                     </>
// //                 )}

// //                 {(isDraft || isPosted) && (
// //                     <MenuItem onClick={() => { onPrint(item); onClose(); }} sx={{ py: 1.5 }}>
// //                         <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
// //                             <PrintIcon fontSize="small" />
// //                         </ListItemIcon>
// //                         <ListItemText>
// //                             <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#F59E0B' }}>
// //                                 Print MRV
// //                             </Typography>
// //                         </ListItemText>
// //                     </MenuItem>
// //                 )}

// //                 {isDraft && (
// //                     <>
// //                         <Divider sx={{ my: 0.5 }} />
// //                         <MenuItem onClick={() => { onCancel(item); onClose(); }} sx={{ py: 1.5 }}>
// //                             <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
// //                                 <CancelIcon fontSize="small" />
// //                             </ListItemIcon>
// //                             <ListItemText>
// //                                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
// //                                     Cancel MRV
// //                                 </Typography>
// //                             </ListItemText>
// //                         </MenuItem>
// //                         <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
// //                             <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
// //                                 <DeleteIcon fontSize="small" />
// //                             </ListItemIcon>
// //                             <ListItemText>
// //                                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
// //                                     Delete MRV
// //                                 </Typography>
// //                             </ListItemText>
// //                         </MenuItem>
// //                     </>
// //                 )}
// //             </Menu>
// //         </>
// //     );
// // };

// // // ==================== MAIN COMPONENT ====================
// // const MRVMaster = () => {
// //     const [data, setData] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [searchInput, setSearchInput] = useState('');
// //     const [page, setPage] = useState(0);
// //     const [rowsPerPage, setRowsPerPage] = useState(10);
// //     const [totalItems, setTotalItems] = useState(0);
// //     const [statusFilter, setStatusFilter] = useState('all');
// //     const [conditionFilter, setConditionFilter] = useState('');
// //     const [fromDate, setFromDate] = useState(null);
// //     const [toDate, setToDate] = useState(null);
// //     const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
// //     const [selectedItem, setSelectedItem] = useState(null);
// //     const [selectedItemForAction, setSelectedItemForAction] = useState(null);
// //     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

// //     // Modal states
// //     const [openAddModal, setOpenAddModal] = useState(false);
// //     const [openViewModal, setOpenViewModal] = useState(false);
// //     const [openEditModal, setOpenEditModal] = useState(false);
// //     const [openCancelDialog, setOpenCancelDialog] = useState(false);
// //     const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
// //     const [openPostDialog, setOpenPostDialog] = useState(false);
// //     const [openPrintModal, setOpenPrintModal] = useState(false);

// //     // Filter drawer state
// //     const [showFilters, setShowFilters] = useState(false);

// //     // Debounce search
// //     useEffect(() => {
// //         const timer = setTimeout(() => {
// //             setSearchTerm(searchInput);
// //             setPage(0);
// //         }, 500);
// //         return () => clearTimeout(timer);
// //     }, [searchInput]);

// //     const fetchMRVs = useCallback(async () => {
// //         try {
// //             setLoading(true);
// //             const token = localStorage.getItem('token');

// //             const params = new URLSearchParams({
// //                 page: page + 1,
// //                 limit: rowsPerPage
// //             });

// //             if (searchTerm) params.append('search', searchTerm);
// //             if (statusFilter !== 'all') params.append('status', statusFilter);
// //             if (conditionFilter) params.append('condition', conditionFilter);
// //             if (fromDate) params.append('from_date', fromDate.toISOString().split('T')[0]);
// //             if (toDate) params.append('to_date', toDate.toISOString().split('T')[0]);

// //             const response = await axios.get(`${BASE_URL}/api/mrv?${params.toString()}`, {
// //                 headers: { 'Authorization': `Bearer ${token}` }
// //             });

// //             if (response.data.success) {
// //                 setData(response.data.data || []);
// //                 setTotalItems(response.data.pagination?.total || response.data.data?.length || 0);
// //             } else {
// //                 showNotification('Failed to load MRVs', 'error');
// //             }
// //         } catch (err) {
// //             console.error('Error fetching MRVs:', err);
// //             showNotification(err.response?.data?.message || 'Failed to load MRVs', 'error');
// //         } finally {
// //             setLoading(false);
// //         }
// //     }, [page, rowsPerPage, searchTerm, statusFilter, conditionFilter, fromDate, toDate]);

// //     useEffect(() => {
// //         fetchMRVs();
// //     }, [fetchMRVs]);

// //     const handleChangePage = (event, newPage) => {
// //         setPage(newPage);
// //     };

// //     const handleChangeRowsPerPage = (event) => {
// //         setRowsPerPage(parseInt(event.target.value, 10));
// //         setPage(0);
// //     };

// //     const handleStatusFilterChange = (event, newValue) => {
// //         if (newValue !== null) {
// //             setStatusFilter(newValue);
// //             setPage(0);
// //         }
// //     };

// //     const handleConditionFilterChange = (event) => {
// //         setConditionFilter(event.target.value);
// //         setPage(0);
// //     };

// //     const handleClearFilters = () => {
// //         setStatusFilter('all');
// //         setConditionFilter('');
// //         setFromDate(null);
// //         setToDate(null);
// //         setSearchInput('');
// //         setPage(0);
// //     };

// //     const handleAddMRV = () => {
// //         fetchMRVs();
// //         showNotification('MRV created successfully!', 'success');
// //     };

// //     const handleEditMRV = () => {
// //         fetchMRVs();
// //         showNotification('MRV updated successfully!', 'success');
// //     };

// //     const handleCancelMRV = () => {
// //         fetchMRVs();
// //         showNotification('MRV cancelled successfully!', 'success');
// //     };

// //     const handleDeleteMRV = () => {
// //         fetchMRVs();
// //         showNotification('MRV deleted successfully!', 'success');
// //     };

// //     const handlePostMRV = () => {
// //         fetchMRVs();
// //         showNotification('MRV posted and materials returned successfully!', 'success');
// //     };

// //     const handleActionMenuOpen = (event, item) => {
// //         setActionMenuAnchor(event.currentTarget);
// //         setSelectedItemForAction(item);
// //     };

// //     const handleActionMenuClose = () => {
// //         setActionMenuAnchor(null);
// //         setSelectedItemForAction(null);
// //     };

// //     const openViewModalHandler = (item) => {
// //         setSelectedItem(item);
// //         setOpenViewModal(true);
// //         handleActionMenuClose();
// //     };

// //     const openEditModalHandler = (item) => {
// //         setSelectedItem(item);
// //         setOpenEditModal(true);
// //         handleActionMenuClose();
// //     };

// //     const openCancelDialogHandler = (item) => {
// //         setSelectedItem(item);
// //         setOpenCancelDialog(true);
// //         handleActionMenuClose();
// //     };

// //     const openDeleteDialogHandler = (item) => {
// //         setSelectedItem(item);
// //         setOpenDeleteDialog(true);
// //         handleActionMenuClose();
// //     };

// //     const openPostDialogHandler = (item) => {
// //         setSelectedItem(item);
// //         setOpenPostDialog(true);
// //         handleActionMenuClose();
// //     };

// //     const openPrintModalHandler = (item) => {
// //         setSelectedItem(item);
// //         setOpenPrintModal(true);
// //         handleActionMenuClose();
// //     };

// //     const showNotification = (message, severity) => {
// //         setSnackbar({ open: true, message, severity });
// //     };

// //     const getMRVInitials = (mrv) => {
// //         if (!mrv.mrv_number) return 'MRV';
// //         return mrv.mrv_number.substring(0, 2).toUpperCase();
// //     };

// //     const getAvatarColor = (mrv) => {
// //         if (!mrv.mrv_number) return COLORS.primary;
// //         const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
// //         const charCode = mrv.mrv_number.charCodeAt(0) || 0;
// //         return colors[charCode % colors.length];
// //     };

// //     const formatDate = (dateString) => {
// //         if (!dateString) return '-';
// //         try {
// //             return new Date(dateString).toLocaleDateString('en-US', {
// //                 year: 'numeric',
// //                 month: 'short',
// //                 day: 'numeric'
// //             });
// //         } catch {
// //             return '-';
// //         }
// //     };

// //     const getDisplayValue = (obj, field) => {
// //         if (!obj) return '-';
// //         if (typeof obj === 'object') {
// //             return obj[field] || obj[field.toLowerCase()] || '-';
// //         }
// //         return obj;
// //     };

// //     const getPersonName = (person) => {
// //         if (!person) return '-';
// //         if (typeof person === 'object') {
// //             if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
// //             if (person.FirstName) return person.FirstName;
// //             if (person.Username) return person.Username;
// //             if (person.Email) return person.Email;
// //             if (person.name) return person.name;
// //             return person._id?.slice(-6) || '-';
// //         }
// //         return person;
// //     };

// //     return (
// //         <LocalizationProvider dateAdapter={AdapterDateFns}>
// //             <Box sx={{ p: 2.5 }}>
// //                 {/* Page Header */}
// //                 <Box sx={{ mb: 2.5 }}>
// //                     <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
// //                         Material Return Voucher
// //                     </Typography>
// //                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
// //                         Manage material return vouchers and track returned materials to store
// //                     </Typography>
// //                 </Box>

// //                 {/* Status Filter Tabs */}
// //                 <Paper sx={{
// //                     mb: 2.5,
// //                     borderRadius: 2,
// //                     border: `1px solid ${COLORS.border}`,
// //                     overflow: 'hidden'
// //                 }}>
// //                     <Tabs
// //                         value={statusFilter}
// //                         onChange={handleStatusFilterChange}
// //                         sx={{
// //                             minHeight: 40,
// //                             '& .MuiTab-root': {
// //                                 textTransform: 'none',
// //                                 fontSize: '0.75rem',
// //                                 fontWeight: 500,
// //                                 minHeight: 40,
// //                                 px: 3,
// //                                 color: COLORS.text.secondary,
// //                                 '&.Mui-selected': { color: COLORS.primary }
// //                             },
// //                             '& .MuiTabs-indicator': {
// //                                 backgroundColor: COLORS.primary,
// //                                 height: 2
// //                             }
// //                         }}
// //                     >
// //                         <Tab label="All" value="all" />
// //                         <Tab label="Draft" value={MRV_STATUS.DRAFT} />
// //                         <Tab label="Posted" value={MRV_STATUS.POSTED} />
// //                         <Tab label="Cancelled" value={MRV_STATUS.CANCELLED} />
// //                     </Tabs>
// //                 </Paper>

// //                 {/* Action Bar */}
// //                 <Paper sx={{
// //                     p: 1.5,
// //                     mb: 2.5,
// //                     borderRadius: 2,
// //                     bgcolor: COLORS.background.white,
// //                     boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
// //                     border: `1px solid ${COLORS.border}`
// //                 }}>
// //                     <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
// //                         <TextField
// //                             placeholder="Search by MRV Number, MIV Number, or Remarks..."
// //                             size="small"
// //                             value={searchInput}
// //                             onChange={(e) => setSearchInput(e.target.value)}
// //                             sx={{
// //                                 width: { xs: '100%', sm: 350 },
// //                                 '& .MuiOutlinedInput-root': {
// //                                     borderRadius: 1.5,
// //                                     fontSize: '0.75rem',
// //                                     '&:hover fieldset': {
// //                                         borderColor: COLORS.primary,
// //                                     },
// //                                 }
// //                             }}
// //                             InputProps={{
// //                                 startAdornment: (
// //                                     <InputAdornment position="start">
// //                                         <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
// //                                     </InputAdornment>
// //                                 ),
// //                                 sx: {
// //                                     height: 36,
// //                                     bgcolor: COLORS.background.light,
// //                                     '& input': {
// //                                         padding: '6px 12px',
// //                                         fontSize: '0.75rem',
// //                                         color: COLORS.text.primary,
// //                                         '&::placeholder': {
// //                                             color: COLORS.text.tertiary,
// //                                             fontSize: '0.75rem'
// //                                         }
// //                                     }
// //                                 }
// //                             }}
// //                             disabled={loading}
// //                         />

// //                         <Stack direction="row" spacing={1.5}>
// //                             {/* Filter Button */}
                            

// //                             <Button
// //                                 variant="contained"
// //                                 startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
// //                                 onClick={() => setOpenAddModal(true)}
// //                                 sx={{
// //                                     height: 36,
// //                                     borderRadius: 1.5,
// //                                     bgcolor: COLORS.primary,
// //                                     fontSize: '0.75rem',
// //                                     fontWeight: 500,
// //                                     textTransform: 'none',
// //                                     boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
// //                                     '&:hover': {
// //                                         bgcolor: COLORS.primaryDark,
// //                                     }
// //                                 }}
// //                                 disabled={loading}
// //                             >
// //                                 New MRV
// //                             </Button>
// //                         </Stack>
// //                     </Stack>
// //                 </Paper>

// //                 {/* Advanced Filters */}
// //                 {showFilters && (
// //                     <Paper sx={{
// //                         p: 2,
// //                         mb: 2.5,
// //                         borderRadius: 2,
// //                         bgcolor: COLORS.background.white,
// //                         border: `1px solid ${COLORS.border}`
// //                     }}>
// //                         <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
// //                             ADVANCED FILTERS
// //                         </Typography>
// //                         <Grid container spacing={2}>
// //                             <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// //                                 <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
// //                                     CONDITION
// //                                 </Typography>
// //                                 <TextField
// //                                     select
// //                                     fullWidth
// //                                     size="small"
// //                                     value={conditionFilter}
// //                                     onChange={handleConditionFilterChange}
// //                                     sx={inputStyle}
// //                                 >
// //                                     <MenuItem value="">All</MenuItem>
// //                                     <MenuItem value="Good">Good</MenuItem>
// //                                     <MenuItem value="Damaged">Damaged</MenuItem>
// //                                     <MenuItem value="Scrap">Scrap</MenuItem>
// //                                     <MenuItem value="Rejected">Rejected</MenuItem>
// //                                     <MenuItem value="Expired">Expired</MenuItem>
// //                                 </TextField>
// //                             </Grid>
// //                             <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// //                                 <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
// //                                     FROM DATE
// //                                 </Typography>
// //                                 <DatePicker
// //                                     value={fromDate}
// //                                     onChange={setFromDate}
// //                                     slotProps={{
// //                                         textField: {
// //                                             size: 'small',
// //                                             fullWidth: true,
// //                                             sx: inputStyle
// //                                         }
// //                                     }}
// //                                 />
// //                             </Grid>
// //                             <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// //                                 <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
// //                                     TO DATE
// //                                 </Typography>
// //                                 <DatePicker
// //                                     value={toDate}
// //                                     onChange={setToDate}
// //                                     slotProps={{
// //                                         textField: {
// //                                             size: 'small',
// //                                             fullWidth: true,
// //                                             sx: inputStyle
// //                                         }
// //                                     }}
// //                                 />
// //                             </Grid>
// //                             <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
// //                                 <Button
// //                                     variant="outlined"
// //                                     onClick={handleClearFilters}
// //                                     sx={{
// //                                         height: 36,
// //                                         borderRadius: 1.5,
// //                                         textTransform: 'none',
// //                                         fontSize: '0.7rem'
// //                                     }}
// //                                 >
// //                                     Clear Filters
// //                                 </Button>
// //                             </Grid>
// //                         </Grid>
// //                     </Paper>
// //                 )}

// //                 {/* Table */}
// //                 <Paper sx={{
// //                     width: '100%',
// //                     borderRadius: 2,
// //                     overflow: 'hidden',
// //                     boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
// //                     border: `1px solid ${COLORS.border}`
// //                 }}>
// //                     <TableContainer>
// //                         <Table size="small">
// //                             <TableHead>
// //                                 <TableRow sx={{
// //                                     bgcolor: COLORS.background.tableHeader,
// //                                     '& .MuiTableCell-root': {
// //                                         borderBottom: 'none',
// //                                         color: COLORS.text.light,
// //                                         py: 1.5,
// //                                     }
// //                                 }}>
// //                                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                                         MRV No.
// //                                     </TableCell>
// //                                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                                         Date
// //                                     </TableCell>
// //                                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                                         MIV No.
// //                                     </TableCell>
// //                                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                                         Returned By
// //                                     </TableCell>
// //                                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                                         Received By
// //                                     </TableCell>
// //                                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                                         Condition
// //                                     </TableCell>
// //                                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                                         Items
// //                                     </TableCell>
// //                                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
// //                                         Status
// //                                     </TableCell>
// //                                     <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
// //                                         Actions
// //                                     </TableCell>
// //                                 </TableRow>
// //                             </TableHead>
// //                             <TableBody>
// //                                 {loading ? (
// //                                     <TableRow>
// //                                         <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
// //                                             <CircularProgress size={32} sx={{ color: COLORS.primary }} />
// //                                             <Typography sx={{ fontSize: '0.75rem', mt: 1, color: COLORS.text.secondary }}>
// //                                                 Loading MRVs...
// //                                             </Typography>
// //                                         </TableCell>
// //                                     </TableRow>
// //                                 ) : data.length === 0 ? (
// //                                     <TableRow>
// //                                         <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
// //                                             <WarehouseIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
// //                                             <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
// //                                                 {searchTerm ? 'No MRVs found matching your search' : 'No MRVs available'}
// //                                             </Typography>
// //                                         </TableCell>
// //                                     </TableRow>
// //                                 ) : (
// //                                     data.map((item) => {
// //                                         const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedItemForAction?._id === item._id;
// //                                         const statusColors = getStatusColor(item.status);
// //                                         const conditionColors = getConditionColor(item.condition);

// //                                         return (
// //                                             <TableRow
// //                                                 key={item._id}
// //                                                 hover
// //                                                 sx={{
// //                                                     '&:hover': { bgcolor: COLORS.background.hover }
// //                                                 }}
// //                                             >
// //                                                 <TableCell>
// //                                                     <Stack direction="row" spacing={1.5} alignItems="center">
// //                                                         <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(item), fontSize: '0.7rem', fontWeight: 600 }}>
// //                                                             {getMRVInitials(item)}
// //                                                         </Avatar>
// //                                                         <Box>
// //                                                             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
// //                                                                 {item.mrv_number || item._id?.slice(-8)}
// //                                                             </Typography>
// //                                                             <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
// //                                                                 ID: {item._id?.slice(-8)}
// //                                                             </Typography>
// //                                                         </Box>
// //                                                     </Stack>
// //                                                 </TableCell>
// //                                                 <TableCell>
// //                                                     <Typography sx={{ fontSize: '0.75rem' }}>
// //                                                         {formatDate(item.mrv_date || item.createdAt)}
// //                                                     </Typography>
// //                                                 </TableCell>
// //                                                 <TableCell>
// //                                                     <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
// //                                                         {item.miv_id?.miv_number || getDisplayValue(item.miv_id, 'miv_number') || '-'}
// //                                                     </Typography>
// //                                                 </TableCell>
// //                                                 <TableCell>
// //                                                     <Typography sx={{ fontSize: '0.75rem' }}>
// //                                                         {getPersonName(item.returned_by)}
// //                                                     </Typography>
// //                                                 </TableCell>
// //                                                 <TableCell>
// //                                                     <Typography sx={{ fontSize: '0.75rem' }}>
// //                                                         {getPersonName(item.received_by)}
// //                                                     </Typography>
// //                                                 </TableCell>
// //                                                 <TableCell>
// //                                                     <Chip
// //                                                         label={item.condition || '-'}
// //                                                         size="small"
// //                                                         sx={{
// //                                                             fontSize: '0.65rem',
// //                                                             height: 24,
// //                                                             bgcolor: conditionColors.bg,
// //                                                             color: conditionColors.color,
// //                                                             fontWeight: 500
// //                                                         }}
// //                                                     />
// //                                                 </TableCell>
// //                                                 <TableCell>
// //                                                     <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
// //                                                         {item.items_count || item.items?.length || 0}
// //                                                     </Typography>
// //                                                 </TableCell>
// //                                                 <TableCell>
// //                                                     <Chip
// //                                                         label={item.status}
// //                                                         size="small"
// //                                                         sx={{
// //                                                             fontSize: '0.65rem',
// //                                                             height: 24,
// //                                                             bgcolor: statusColors.bg,
// //                                                             color: statusColors.color,
// //                                                             fontWeight: 500
// //                                                         }}
// //                                                     />
// //                                                 </TableCell>
// //                                                 <TableCell align="center">
// //                                                     <ActionMenu
// //                                                         item={item}
// //                                                         anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
// //                                                         onOpen={(e) => handleActionMenuOpen(e, item)}
// //                                                         onClose={handleActionMenuClose}
// //                                                         onView={openViewModalHandler}
// //                                                         onEdit={openEditModalHandler}
// //                                                         onDelete={openDeleteDialogHandler}
// //                                                         onCancel={openCancelDialogHandler}
// //                                                         onPost={openPostDialogHandler}
// //                                                         onPrint={openPrintModalHandler}
// //                                                     />
// //                                                 </TableCell>
// //                                             </TableRow>
// //                                         );
// //                                     })
// //                                 )}
// //                             </TableBody>
// //                         </Table>
// //                     </TableContainer>

// //                     <TablePagination
// //                         rowsPerPageOptions={[5, 10, 25, 50]}
// //                         component="div"
// //                         count={totalItems}
// //                         rowsPerPage={rowsPerPage}
// //                         page={page}
// //                         onPageChange={handleChangePage}
// //                         onRowsPerPageChange={handleChangeRowsPerPage}
// //                         sx={{
// //                             borderTop: `1px solid ${COLORS.border}`,
// //                             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
// //                                 fontSize: '0.7rem',
// //                                 color: COLORS.text.secondary
// //                             }
// //                         }}
// //                     />
// //                 </Paper>

// //                 {/* Modals */}
// //                 <AddMRV
// //                     open={openAddModal}
// //                     onClose={() => setOpenAddModal(false)}
// //                     onAdd={handleAddMRV}
// //                 />

// //                 {selectedItem && (
// //                     <>
// //                         <ViewMRV
// //                             open={openViewModal}
// //                             onClose={() => {
// //                                 setOpenViewModal(false);
// //                                 setSelectedItem(null);
// //                             }}
// //                             mrvId={selectedItem?._id}
// //                         />

// //                         <EditMRV
// //                             open={openEditModal}
// //                             onClose={() => {
// //                                 setOpenEditModal(false);
// //                                 setSelectedItem(null);
// //                             }}
// //                             data={selectedItem}
// //                             onUpdate={handleEditMRV}
// //                         />

// //                         <CancelMRV
// //                             open={openCancelDialog}
// //                             onClose={() => {
// //                                 setOpenCancelDialog(false);
// //                                 setSelectedItem(null);
// //                             }}
// //                             mrvData={selectedItem}
// //                             onCancel={handleCancelMRV}
// //                         />

// //                         <DeleteMRV
// //                             open={openDeleteDialog}
// //                             onClose={() => {
// //                                 setOpenDeleteDialog(false);
// //                                 setSelectedItem(null);
// //                             }}
// //                             mrvData={selectedItem}
// //                             onDelete={handleDeleteMRV}
// //                         />

// //                         <PostMRV
// //                             open={openPostDialog}
// //                             onClose={() => {
// //                                 setOpenPostDialog(false);
// //                                 setSelectedItem(null);
// //                             }}
// //                             data={selectedItem}
// //                             onPost={handlePostMRV}
// //                         />

// //                         <PrintMRV
// //                             open={openPrintModal}
// //                             onClose={() => {
// //                                 setOpenPrintModal(false);
// //                                 setSelectedItem(null);
// //                             }}
// //                             data={selectedItem}
// //                         />
// //                     </>
// //                 )}

// //                 {/* Snackbar */}
// //                 <Snackbar
// //                     open={snackbar.open}
// //                     autoHideDuration={3000}
// //                     onClose={() => setSnackbar({ ...snackbar, open: false })}
// //                     anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// //                 >
// //                     <Alert
// //                         onClose={() => setSnackbar({ ...snackbar, open: false })}
// //                         severity={snackbar.severity}
// //                         variant="filled"
// //                         sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
// //                     >
// //                         {snackbar.message}
// //                     </Alert>
// //                 </Snackbar>
// //             </Box>
// //         </LocalizationProvider>
// //     );
// // };

// // // Input style for filters
// // const inputStyle = {
// //     '& .MuiOutlinedInput-root': {
// //         borderRadius: 1.5,
// //         fontSize: '0.75rem',
// //         '&:hover fieldset': { borderColor: COLORS.primary },
// //         '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
// //     },
// //     '& .MuiInputBase-input': {
// //         py: 1,
// //         px: 1.5,
// //         fontSize: '0.75rem',
// //         color: COLORS.text.primary
// //     }
// // };

// // export default MRVMaster;


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
//   Avatar,
//   Grid
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
//   Inventory as InventoryIcon,
//   Cancel as CancelIcon,
//   Warehouse as WarehouseIcon
// } from '@mui/icons-material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
// import AddMRV from './AddMRV';
// import ViewMRV from './ViewMRV';
// import EditMRV from './EditMRV';
// import CancelMRV from './CancelMRV';
// import DeleteMRV from './DeleteMRV';
// import PostMRV from './PostMRV';
// import PrintMRV from './PrintMRV';

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
//     posted: '#D1FAE5',
//     cancelled: '#FEE2E2',
//     partiallyReturned: '#FEF3C7'
//   }
// };

// // MRV Status constants
// const MRV_STATUS = {
//   DRAFT: 'Draft',
//   POSTED: 'Posted',
//   CANCELLED: 'Cancelled',
//   PARTIALLY_RETURNED: 'Partially Returned'
// };

// // Condition colors
// const getConditionColor = (condition) => {
//   const colors = {
//     Good: { bg: '#D1FAE5', color: '#059669' },
//     Damaged: { bg: '#FEE2E2', color: '#DC2626' },
//     Scrap: { bg: '#FEF3C7', color: '#D97706' },
//     Rejected: { bg: '#FEE2E2', color: '#DC2626' },
//     Expired: { bg: '#F1F5F9', color: '#475569' }
//   };
//   return colors[condition] || { bg: '#F1F5F9', color: '#475569' };
// };

// // Status colors for chips
// const getStatusColor = (status) => {
//   const colors = {
//     [MRV_STATUS.DRAFT]: { bg: '#FEF3C7', color: '#D97706' },
//     [MRV_STATUS.POSTED]: { bg: '#D1FAE5', color: '#059669' },
//     [MRV_STATUS.CANCELLED]: { bg: '#FEE2E2', color: '#DC2626' },
//     [MRV_STATUS.PARTIALLY_RETURNED]: { bg: '#FEF3C7', color: '#D97706' }
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
// const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onCancel, onPost, onPrint, permissions }) => {
//   const isDraft = item.status === MRV_STATUS.DRAFT;
//   const isPosted = item.status === MRV_STATUS.POSTED;
  
//   // Permission checks
//   const canView = hasPermission(permissions, MODULES.MATERIAL_RETURN_VOUCHER, PAGES.MATERIAL_RETURN_VOUCHER, ACTIONS.VIEW);
//   const canUpdate = hasPermission(permissions, MODULES.MATERIAL_RETURN_VOUCHER, PAGES.MATERIAL_RETURN_VOUCHER, ACTIONS.UPDATE);
//   const canDelete = hasPermission(permissions, MODULES.MATERIAL_RETURN_VOUCHER, PAGES.MATERIAL_RETURN_VOUCHER, ACTIONS.DELETE);
//   const canPost = hasPermission(permissions, MODULES.MATERIAL_RETURN_VOUCHER, PAGES.MATERIAL_RETURN_VOUCHER, ACTIONS.POST);
//   const canPrint = hasPermission(permissions, MODULES.MATERIAL_RETURN_VOUCHER, PAGES.MATERIAL_RETURN_VOUCHER, ACTIONS.PRINT);

//   // If no actions available, don't render the menu
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
//                 Post & Return
//               </Typography>
//             </ListItemText>
//           </MenuItem>
//         )}

//         {canPrint && (isDraft || isPosted) && (
//           <MenuItem onClick={() => { onPrint(item); onClose(); }} sx={{ py: 1.5 }}>
//             <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
//               <PrintIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#F59E0B' }}>
//                 Print MRV
//               </Typography>
//             </ListItemText>
//           </MenuItem>
//         )}

//         {canDelete && isDraft && (
//           <>
//             <Divider sx={{ my: 0.5 }} />
//             <MenuItem onClick={() => { onCancel(item); onClose(); }} sx={{ py: 1.5 }}>
//               <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
//                 <CancelIcon fontSize="small" />
//               </ListItemIcon>
//               <ListItemText>
//                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
//                   Cancel MRV
//                 </Typography>
//               </ListItemText>
//             </MenuItem>
//             <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
//               <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
//                 <DeleteIcon fontSize="small" />
//               </ListItemIcon>
//               <ListItemText>
//                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
//                   Delete MRV
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
// const MRVMaster = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchInput, setSearchInput] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalItems, setTotalItems] = useState(0);
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [conditionFilter, setConditionFilter] = useState('');
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedItemForAction, setSelectedItemForAction] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   // Modal states
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [openViewModal, setOpenViewModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [openCancelDialog, setOpenCancelDialog] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [openPostDialog, setOpenPostDialog] = useState(false);
//   const [openPrintModal, setOpenPrintModal] = useState(false);

//   // Filter drawer state
//   const [showFilters, setShowFilters] = useState(false);

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
//       MODULES.MATERIAL_RETURN_VOUCHER,
//       PAGES.MATERIAL_RETURN_VOUCHER,
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

//   const fetchMRVs = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       const params = new URLSearchParams({
//         page: page + 1,
//         limit: rowsPerPage
//       });

//       if (searchTerm) params.append('search', searchTerm);
//       if (statusFilter !== 'all') params.append('status', statusFilter);
//       if (conditionFilter) params.append('condition', conditionFilter);
//       if (fromDate) params.append('from_date', fromDate.toISOString().split('T')[0]);
//       if (toDate) params.append('to_date', toDate.toISOString().split('T')[0]);

//       const response = await axios.get(`${BASE_URL}/api/mrv?${params.toString()}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setData(response.data.data || []);
//         setTotalItems(response.data.pagination?.total || response.data.data?.length || 0);
//       } else {
//         showNotification('Failed to load MRVs', 'error');
//       }
//     } catch (err) {
//       console.error('Error fetching MRVs:', err);
//       showNotification(err.response?.data?.message || 'Failed to load MRVs', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [page, rowsPerPage, searchTerm, statusFilter, conditionFilter, fromDate, toDate]);

//   useEffect(() => {
//     if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
//       fetchMRVs();
//     }
//   }, [fetchMRVs, permissionsLoaded, canViewPage, isSuperAdmin]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleStatusFilterChange = (event, newValue) => {
//     if (newValue !== null) {
//       setStatusFilter(newValue);
//       setPage(0);
//     }
//   };

//   const handleConditionFilterChange = (event) => {
//     setConditionFilter(event.target.value);
//     setPage(0);
//   };

//   const handleClearFilters = () => {
//     setStatusFilter('all');
//     setConditionFilter('');
//     setFromDate(null);
//     setToDate(null);
//     setSearchInput('');
//     setPage(0);
//   };

//   const handleAddMRV = () => {
//     fetchMRVs();
//     showNotification('MRV created successfully!', 'success');
//   };

//   const handleEditMRV = () => {
//     fetchMRVs();
//     showNotification('MRV updated successfully!', 'success');
//   };

//   const handleCancelMRV = () => {
//     fetchMRVs();
//     showNotification('MRV cancelled successfully!', 'success');
//   };

//   const handleDeleteMRV = () => {
//     fetchMRVs();
//     showNotification('MRV deleted successfully!', 'success');
//   };

//   const handlePostMRV = () => {
//     fetchMRVs();
//     showNotification('MRV posted and materials returned successfully!', 'success');
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

//   const openCancelDialogHandler = (item) => {
//     setSelectedItem(item);
//     setOpenCancelDialog(true);
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

//   const getMRVInitials = (mrv) => {
//     if (!mrv.mrv_number) return 'MRV';
//     return mrv.mrv_number.substring(0, 2).toUpperCase();
//   };

//   const getAvatarColor = (mrv) => {
//     if (!mrv.mrv_number) return COLORS.primary;
//     const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
//     const charCode = mrv.mrv_number.charCodeAt(0) || 0;
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
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box sx={{ p: 2.5 }}>
//         {/* Page Header */}
//         <Box sx={{ mb: 2.5 }}>
//           <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
//             Material Return Voucher
//           </Typography>
//           <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
//             Manage material return vouchers and track returned materials to store
//           </Typography>
//         </Box>

//         {/* Status Filter Tabs */}
//         <Paper sx={{
//           mb: 2.5,
//           borderRadius: 2,
//           border: `1px solid ${COLORS.border}`,
//           overflow: 'hidden'
//         }}>
//           <Tabs
//             value={statusFilter}
//             onChange={handleStatusFilterChange}
//             sx={{
//               minHeight: 40,
//               '& .MuiTab-root': {
//                 textTransform: 'none',
//                 fontSize: '0.75rem',
//                 fontWeight: 500,
//                 minHeight: 40,
//                 px: 3,
//                 color: COLORS.text.secondary,
//                 '&.Mui-selected': { color: COLORS.primary }
//               },
//               '& .MuiTabs-indicator': {
//                 backgroundColor: COLORS.primary,
//                 height: 2
//               }
//             }}
//           >
//             <Tab label="All" value="all" />
//             <Tab label="Draft" value={MRV_STATUS.DRAFT} />
//             <Tab label="Posted" value={MRV_STATUS.POSTED} />
//             <Tab label="Cancelled" value={MRV_STATUS.CANCELLED} />
//           </Tabs>
//         </Paper>

//         {/* Action Bar */}
//         <Paper sx={{
//           p: 1.5,
//           mb: 2.5,
//           borderRadius: 2,
//           bgcolor: COLORS.background.white,
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//           border: `1px solid ${COLORS.border}`
//         }}>
//           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
//             <TextField
//               placeholder="Search by MRV Number, MIV Number, or Remarks..."
//               size="small"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               sx={{
//                 width: { xs: '100%', sm: 350 },
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 1.5,
//                   fontSize: '0.75rem',
//                   '&:hover fieldset': {
//                     borderColor: COLORS.primary,
//                   },
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
//                   </InputAdornment>
//                 ),
//                 sx: {
//                   height: 36,
//                   bgcolor: COLORS.background.light,
//                   '& input': {
//                     padding: '6px 12px',
//                     fontSize: '0.75rem',
//                     color: COLORS.text.primary,
//                     '&::placeholder': {
//                       color: COLORS.text.tertiary,
//                       fontSize: '0.75rem'
//                     }
//                   }
//                 }
//               }}
//               disabled={loading}
//             />

//             <Stack direction="row" spacing={1.5}>
             

//               {canCreate && (
//                 <Button
//                   variant="contained"
//                   startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//                   onClick={() => setOpenAddModal(true)}
//                   sx={{
//                     height: 36,
//                     borderRadius: 1.5,
//                     bgcolor: COLORS.primary,
//                     fontSize: '0.75rem',
//                     fontWeight: 500,
//                     textTransform: 'none',
//                     boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                     '&:hover': {
//                       bgcolor: COLORS.primaryDark,
//                     }
//                   }}
//                   disabled={loading}
//                 >
//                   New MRV
//                 </Button>
//               )}
//             </Stack>
//           </Stack>
//         </Paper>

//         {/* Advanced Filters */}
//         {showFilters && (
//           <Paper sx={{
//             p: 2,
//             mb: 2.5,
//             borderRadius: 2,
//             bgcolor: COLORS.background.white,
//             border: `1px solid ${COLORS.border}`
//           }}>
//             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
//               ADVANCED FILTERS
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                 <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
//                   CONDITION
//                 </Typography>
//                 <TextField
//                   select
//                   fullWidth
//                   size="small"
//                   value={conditionFilter}
//                   onChange={handleConditionFilterChange}
//                   sx={inputStyle}
//                 >
//                   <MenuItem value="">All</MenuItem>
//                   <MenuItem value="Good">Good</MenuItem>
//                   <MenuItem value="Damaged">Damaged</MenuItem>
//                   <MenuItem value="Scrap">Scrap</MenuItem>
//                   <MenuItem value="Rejected">Rejected</MenuItem>
//                   <MenuItem value="Expired">Expired</MenuItem>
//                 </TextField>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                 <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
//                   FROM DATE
//                 </Typography>
//                 <DatePicker
//                   value={fromDate}
//                   onChange={setFromDate}
//                   slotProps={{
//                     textField: {
//                       size: 'small',
//                       fullWidth: true,
//                       sx: inputStyle
//                     }
//                   }}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                 <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
//                   TO DATE
//                 </Typography>
//                 <DatePicker
//                   value={toDate}
//                   onChange={setToDate}
//                   slotProps={{
//                     textField: {
//                       size: 'small',
//                       fullWidth: true,
//                       sx: inputStyle
//                     }
//                   }}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
//                 <Button
//                   variant="outlined"
//                   onClick={handleClearFilters}
//                   sx={{
//                     height: 36,
//                     borderRadius: 1.5,
//                     textTransform: 'none',
//                     fontSize: '0.7rem'
//                   }}
//                 >
//                   Clear Filters
//                 </Button>
//               </Grid>
//             </Grid>
//           </Paper>
//         )}

//         {/* Table */}
//         <Paper sx={{
//           width: '100%',
//           borderRadius: 2,
//           overflow: 'hidden',
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//           border: `1px solid ${COLORS.border}`
//         }}>
//           <TableContainer>
//             <Table size="small">
//               <TableHead>
//                 <TableRow sx={{
//                   bgcolor: COLORS.background.tableHeader,
//                   '& .MuiTableCell-root': {
//                     borderBottom: 'none',
//                     color: COLORS.text.light,
//                     py: 1.5,
//                   }
//                 }}>
//                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                     MRV No.
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                     Date
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                     MIV No.
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                     Returned By
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                     Received By
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                     Condition
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                     Items
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
//                     Status
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
//                     Actions
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
//                       <CircularProgress size={32} sx={{ color: COLORS.primary }} />
//                       <Typography sx={{ fontSize: '0.75rem', mt: 1, color: COLORS.text.secondary }}>
//                         Loading MRVs...
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 ) : data.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
//                       <WarehouseIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
//                       <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
//                         {searchTerm ? 'No MRVs found matching your search' : 'No MRVs available'}
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   data.map((item) => {
//                     const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedItemForAction?._id === item._id;
//                     const statusColors = getStatusColor(item.status);
//                     const conditionColors = getConditionColor(item.condition);

//                     return (
//                       <TableRow
//                         key={item._id}
//                         hover
//                         sx={{
//                           '&:hover': { bgcolor: COLORS.background.hover }
//                         }}
//                       >
//                         <TableCell>
//                           <Stack direction="row" spacing={1.5} alignItems="center">
//                             <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(item), fontSize: '0.7rem', fontWeight: 600 }}>
//                               {getMRVInitials(item)}
//                             </Avatar>
//                             <Box>
//                               <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
//                                 {item.mrv_number || item._id?.slice(-8)}
//                               </Typography>
//                               <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                                 ID: {item._id?.slice(-8)}
//                               </Typography>
//                             </Box>
//                           </Stack>
//                         </TableCell>
//                         <TableCell>
//                           <Typography sx={{ fontSize: '0.75rem' }}>
//                             {formatDate(item.mrv_date || item.createdAt)}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                             {item.miv_id?.miv_number || getDisplayValue(item.miv_id, 'miv_number') || '-'}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Typography sx={{ fontSize: '0.75rem' }}>
//                             {getPersonName(item.returned_by)}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Typography sx={{ fontSize: '0.75rem' }}>
//                             {getPersonName(item.received_by)}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={item.condition || '-'}
//                             size="small"
//                             sx={{
//                               fontSize: '0.65rem',
//                               height: 24,
//                               bgcolor: conditionColors.bg,
//                               color: conditionColors.color,
//                               fontWeight: 500
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                             {item.items_count || item.items?.length || 0}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={item.status}
//                             size="small"
//                             sx={{
//                               fontSize: '0.65rem',
//                               height: 24,
//                               bgcolor: statusColors.bg,
//                               color: statusColors.color,
//                               fontWeight: 500
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell align="center">
//                           <ActionMenu
//                             item={item}
//                             anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
//                             onOpen={(e) => handleActionMenuOpen(e, item)}
//                             onClose={handleActionMenuClose}
//                             onView={openViewModalHandler}
//                             onEdit={openEditModalHandler}
//                             onDelete={openDeleteDialogHandler}
//                             onCancel={openCancelDialogHandler}
//                             onPost={openPostDialogHandler}
//                             onPrint={openPrintModalHandler}
//                             permissions={userPermissions}
//                           />
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25, 50]}
//             component="div"
//             count={totalItems}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             sx={{
//               borderTop: `1px solid ${COLORS.border}`,
//               '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
//                 fontSize: '0.7rem',
//                 color: COLORS.text.secondary
//               }
//             }}
//           />
//         </Paper>

//         {/* Modals - Only render if user has appropriate permissions */}
//         {canCreate && (
//           <AddMRV
//             open={openAddModal}
//             onClose={() => setOpenAddModal(false)}
//             onAdd={handleAddMRV}
//           />
//         )}

//         {selectedItem && (
//           <>
//             {canViewPage && (
//               <ViewMRV
//                 open={openViewModal}
//                 onClose={() => {
//                   setOpenViewModal(false);
//                   setSelectedItem(null);
//                 }}
//                 mrvId={selectedItem?._id}
//               />
//             )}

//             {canUpdate && (
//               <EditMRV
//                 open={openEditModal}
//                 onClose={() => {
//                   setOpenEditModal(false);
//                   setSelectedItem(null);
//                 }}
//                 data={selectedItem}
//                 onUpdate={handleEditMRV}
//               />
//             )}

//             {canDelete && (
//               <>
//                 <CancelMRV
//                   open={openCancelDialog}
//                   onClose={() => {
//                     setOpenCancelDialog(false);
//                     setSelectedItem(null);
//                   }}
//                   mrvData={selectedItem}
//                   onCancel={handleCancelMRV}
//                 />

//                 <DeleteMRV
//                   open={openDeleteDialog}
//                   onClose={() => {
//                     setOpenDeleteDialog(false);
//                     setSelectedItem(null);
//                   }}
//                   mrvData={selectedItem}
//                   onDelete={handleDeleteMRV}
//                 />
//               </>
//             )}

//             {canPost && (
//               <PostMRV
//                 open={openPostDialog}
//                 onClose={() => {
//                   setOpenPostDialog(false);
//                   setSelectedItem(null);
//                 }}
//                 data={selectedItem}
//                 onPost={handlePostMRV}
//               />
//             )}

//             {canPrint && (
//               <PrintMRV
//                 open={openPrintModal}
//                 onClose={() => {
//                   setOpenPrintModal(false);
//                   setSelectedItem(null);
//                 }}
//                 data={selectedItem}
//               />
//             )}
//           </>
//         )}

//         {/* Snackbar */}
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={3000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         >
//           <Alert
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             severity={snackbar.severity}
//             variant="filled"
//             sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// // Input style for filters
// const inputStyle = {
//   '& .MuiOutlinedInput-root': {
//     borderRadius: 1.5,
//     fontSize: '0.75rem',
//     '&:hover fieldset': { borderColor: COLORS.primary },
//     '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//   },
//   '& .MuiInputBase-input': {
//     py: 1,
//     px: 1.5,
//     fontSize: '0.75rem',
//     color: COLORS.text.primary
//   }
// };

// export default MRVMaster;


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
  Avatar,
  Grid
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
  Cancel as CancelIcon,
  Warehouse as WarehouseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddMRV from './AddMRV';
import ViewMRV from './ViewMRV';
import EditMRV from './EditMRV';
import CancelMRV from './CancelMRV';
import DeleteMRV from './DeleteMRV';
import PostMRV from './PostMRV';
import PrintMRV from './PrintMRV';

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
    posted: '#D1FAE5',
    cancelled: '#FEE2E2',
    partiallyReturned: '#FEF3C7'
  }
};

// MRV Status constants
const MRV_STATUS = {
  DRAFT: 'Draft',
  POSTED: 'Posted',
  CANCELLED: 'Cancelled',
  PARTIALLY_RETURNED: 'Partially Returned'
};

// Condition colors
const getConditionColor = (condition) => {
  const colors = {
    Good: { bg: '#D1FAE5', color: '#059669' },
    Damaged: { bg: '#FEE2E2', color: '#DC2626' },
    Scrap: { bg: '#FEF3C7', color: '#D97706' },
    Rejected: { bg: '#FEE2E2', color: '#DC2626' },
    Expired: { bg: '#F1F5F9', color: '#475569' }
  };
  return colors[condition] || { bg: '#F1F5F9', color: '#475569' };
};

// Status colors for chips
const getStatusColor = (status) => {
  const colors = {
    [MRV_STATUS.DRAFT]: { bg: '#FEF3C7', color: '#D97706' },
    [MRV_STATUS.POSTED]: { bg: '#D1FAE5', color: '#059669' },
    [MRV_STATUS.CANCELLED]: { bg: '#FEE2E2', color: '#DC2626' },
    [MRV_STATUS.PARTIALLY_RETURNED]: { bg: '#FEF3C7', color: '#D97706' }
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

// ==================== ACTION MENU COMPONENT ====================
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onCancel, onPost, onPrint, permissions }) => {
  const isDraft = item.status === MRV_STATUS.DRAFT;
  const isPosted = item.status === MRV_STATUS.POSTED;
  
  const canView = hasPermission(permissions, MODULES.MATERIAL_RETURN_VOUCHER, PAGES.MATERIAL_RETURN_VOUCHER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.MATERIAL_RETURN_VOUCHER, PAGES.MATERIAL_RETURN_VOUCHER, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.MATERIAL_RETURN_VOUCHER, PAGES.MATERIAL_RETURN_VOUCHER, ACTIONS.DELETE);
  const canPost = hasPermission(permissions, MODULES.MATERIAL_RETURN_VOUCHER, PAGES.MATERIAL_RETURN_VOUCHER, ACTIONS.POST);
  const canPrint = hasPermission(permissions, MODULES.MATERIAL_RETURN_VOUCHER, PAGES.MATERIAL_RETURN_VOUCHER, ACTIONS.PRINT);

  if (!canView && !canUpdate && !canDelete && !canPost && !canPrint) {
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

        {canPost && isDraft && (
          <MenuItem onClick={() => { onPost(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <PostAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#10B981' }}>
                Post & Return
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {canPrint && (isDraft || isPosted) && (
          <MenuItem onClick={() => { onPrint(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#F59E0B' }}>
                Print MRV
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {canDelete && isDraft && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={() => { onCancel(item); onClose(); }} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
                <CancelIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
                  Cancel MRV
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
                  Delete MRV
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
const MRVMaster = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemForAction, setSelectedItemForAction] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [openPrintModal, setOpenPrintModal] = useState(false);

  // Filter drawer state
  const [showFilters, setShowFilters] = useState(false);

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

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

  // Check permission helper
  const checkPermission = (action) => {
    if (isSuperAdmin) return true;
    return hasPermission(
      userPermissions,
      MODULES.MATERIAL_RETURN_VOUCHER,
      PAGES.MATERIAL_RETURN_VOUCHER,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canPost = checkPermission(ACTIONS.POST);
  const canPrint = checkPermission(ACTIONS.PRINT);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchMRVs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (conditionFilter) params.append('condition', conditionFilter);
      if (fromDate) params.append('from_date', fromDate.toISOString().split('T')[0]);
      if (toDate) params.append('to_date', toDate.toISOString().split('T')[0]);

      const response = await axios.get(`${BASE_URL}/api/mrv?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setData(response.data.data || []);
        setTotalItems(response.data.pagination?.total || response.data.data?.length || 0);
      } else {
        showNotification('Failed to load MRVs', 'error');
      }
    } catch (err) {
      console.error('Error fetching MRVs:', err);
      showNotification(err.response?.data?.message || 'Failed to load MRVs', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, conditionFilter, fromDate, toDate]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchMRVs();
    }
  }, [fetchMRVs, permissionsLoaded, canViewPage, isSuperAdmin]);

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

  const handleConditionFilterChange = (event) => {
    setConditionFilter(event.target.value);
    setPage(0);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setConditionFilter('');
    setFromDate(null);
    setToDate(null);
    setSearchInput('');
    setPage(0);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (!canDelete) return;
    showNotification('Bulk delete requires API implementation', 'warning');
  };

  const handleAddMRV = () => {
    fetchMRVs();
    showNotification('MRV created successfully!', 'success');
  };

  const handleEditMRV = () => {
    fetchMRVs();
    showNotification('MRV updated successfully!', 'success');
  };

  const handleCancelMRV = () => {
    fetchMRVs();
    showNotification('MRV cancelled successfully!', 'success');
  };

  const handleDeleteMRV = () => {
    fetchMRVs();
    setSelected([]);
    showNotification('MRV deleted successfully!', 'success');
  };

  const handlePostMRV = () => {
    fetchMRVs();
    showNotification('MRV posted and materials returned successfully!', 'success');
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
    setSelectedItem(item);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openCancelDialogHandler = (item) => {
    setSelectedItem(item);
    setOpenCancelDialog(true);
    handleActionMenuClose();
  };

  const openDeleteDialogHandler = (item) => {
    setSelectedItem(item);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const openPostDialogHandler = (item) => {
    setSelectedItem(item);
    setOpenPostDialog(true);
    handleActionMenuClose();
  };

  const openPrintModalHandler = (item) => {
    setSelectedItem(item);
    setOpenPrintModal(true);
    handleActionMenuClose();
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getMRVInitials = (mrv) => {
    if (!mrv.mrv_number) return 'MRV';
    return mrv.mrv_number.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (mrv) => {
    if (!mrv.mrv_number) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = mrv.mrv_number.charCodeAt(0) || 0;
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2.5 }}>
        {/* Page Header */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
            Material Return Voucher
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
            Manage material return vouchers and track returned materials to store
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
            <Tab label="Draft" value={MRV_STATUS.DRAFT} />
            <Tab label="Posted" value={MRV_STATUS.POSTED} />
            <Tab label="Cancelled" value={MRV_STATUS.CANCELLED} />
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
              placeholder="Search by MRV Number, MIV Number, or Remarks..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 350 },
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

              {/* Filter Button - Only show if user has view permission */}
              {canViewPage && (
                <Button
                  variant="outlined"
                  startIcon={<AssessmentIcon sx={{ fontSize: '1rem' }} />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    height: 36,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    borderColor: COLORS.border,
                    color: COLORS.text.secondary,
                    '&:hover': {
                      borderColor: COLORS.primary,
                      color: COLORS.primary
                    }
                  }}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              )}

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
                  New MRV
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>

        {/* Advanced Filters */}
        {showFilters && (
          <Paper sx={{
            p: 2,
            mb: 2.5,
            borderRadius: 2,
            bgcolor: COLORS.background.white,
            border: `1px solid ${COLORS.border}`
          }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
              ADVANCED FILTERS
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  CONDITION
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={conditionFilter}
                  onChange={handleConditionFilterChange}
                  sx={inputStyle}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Damaged">Damaged</MenuItem>
                  <MenuItem value="Scrap">Scrap</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  FROM DATE
                </Typography>
                <DatePicker
                  value={fromDate}
                  onChange={setFromDate}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: inputStyle
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  TO DATE
                </Typography>
                <DatePicker
                  value={toDate}
                  onChange={setToDate}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: inputStyle
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  sx={{
                    height: 36,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.7rem'
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}

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
                    MRV No.
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    MIV No.
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    Returned By
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    Received By
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    Condition
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    Items
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
                    <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                      <Typography sx={{ fontSize: '0.75rem', mt: 1, color: COLORS.text.secondary }}>
                        Loading MRVs...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                      <WarehouseIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
                        {searchTerm ? 'No MRVs found matching your search' : 'No MRVs available'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => {
                    const isSelected = selected.includes(item._id);
                    const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedItemForAction?._id === item._id;
                    const statusColors = getStatusColor(item.status);
                    const conditionColors = getConditionColor(item.condition);

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
                              {getMRVInitials(item)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                {item.mrv_number || item._id?.slice(-8)}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                ID: {item._id?.slice(-8)}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem' }}>
                            {formatDate(item.mrv_date || item.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {item.miv_id?.miv_number || getDisplayValue(item.miv_id, 'miv_number') || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem' }}>
                            {getPersonName(item.returned_by)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem' }}>
                            {getPersonName(item.received_by)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.condition || '-'}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: 24,
                              bgcolor: conditionColors.bg,
                              color: conditionColors.color,
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {item.items_count || item.items?.length || 0}
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
                            onCancel={openCancelDialogHandler}
                            onPost={openPostDialogHandler}
                            onPrint={openPrintModalHandler}
                            permissions={userPermissions}
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
          <AddMRV
            open={openAddModal}
            onClose={() => setOpenAddModal(false)}
            onAdd={handleAddMRV}
          />
        )}

        {selectedItem && (
          <>
            {canViewPage && (
              <ViewMRV
                open={openViewModal}
                onClose={() => {
                  setOpenViewModal(false);
                  setSelectedItem(null);
                }}
                mrvId={selectedItem?._id}
              />
            )}

            {canUpdate && (
              <EditMRV
                open={openEditModal}
                onClose={() => {
                  setOpenEditModal(false);
                  setSelectedItem(null);
                }}
                data={selectedItem}
                onUpdate={handleEditMRV}
              />
            )}

            {canDelete && (
              <>
                <CancelMRV
                  open={openCancelDialog}
                  onClose={() => {
                    setOpenCancelDialog(false);
                    setSelectedItem(null);
                  }}
                  mrvData={selectedItem}
                  onCancel={handleCancelMRV}
                />

                <DeleteMRV
                  open={openDeleteDialog}
                  onClose={() => {
                    setOpenDeleteDialog(false);
                    setSelectedItem(null);
                  }}
                  mrvData={selectedItem}
                  onDelete={handleDeleteMRV}
                />
              </>
            )}

            {canPost && (
              <PostMRV
                open={openPostDialog}
                onClose={() => {
                  setOpenPostDialog(false);
                  setSelectedItem(null);
                }}
                data={selectedItem}
                onPost={handlePostMRV}
              />
            )}

            {canPrint && (
              <PrintMRV
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
    </LocalizationProvider>
  );
};

// Input style for filters
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
    color: COLORS.text.primary
  }
};

export default MRVMaster;