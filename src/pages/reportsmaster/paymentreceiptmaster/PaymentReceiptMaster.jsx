// import React, { useState, useEffect, useCallback, useRef } from 'react';
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
//   Avatar,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Alert,
//   CircularProgress,
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Visibility as VisibilityIcon,
//   MoreVert as MoreVertIcon,
//   Refresh as RefreshIcon,
//   CheckCircle as CheckCircleIcon,
//   Cancel as CancelIcon,
//   Pending as PendingIcon,
//   Warning as WarningIcon,
//   Receipt as ReceiptIcon,
//   Payment as PaymentIcon,
//   AccountBalance as AdvanceIcon,
//   MoneyOff as BounceIcon,
//   Phone as PhoneIcon,
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import AddPaymentReceipt from './AddPaymentReceipt';
// import ApplyAdvanceDialog from './ApplyAdvanceDialog';
// import BounceDialog from './BounceDialog';
// import FollowUpDialog from './FollowUpDialog';

// // Color constants
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
//     tableHeader: '#063C3F'
//   },
//   border: '#E3E8EF',
//   receiptStatus: {
//     Active: { bg: '#D1FAE5', color: '#065F46', icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> },
//     Pending: { bg: '#FEF3C7', color: '#B45309', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> },
//     Bounced: { bg: '#FEE2E2', color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} /> },
//     Overdue: { bg: '#FFE4E6', color: '#BE123C', icon: <WarningIcon sx={{ fontSize: '0.7rem' }} /> }
//   }
// };

// // Helper Functions
// const formatCurrency = (amount) => {
//   if (!amount && amount !== 0) return '0.00';
//   return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// };

// const formatDate = (dateString) => {
//   if (!dateString) return '-';
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-IN', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric'
//   });
// };

// // Action Menu Component
// const ActionMenu = ({ record, onApplyAdvance, onBounce, onFollowUp, anchorEl, onClose, onOpen }) => {
//   const canBounce = record.status === 'Active' && record.payment_mode !== 'Cash';
  
//   return (
//     <>
//       <Tooltip title="Actions">
//         <IconButton size="small" onClick={onOpen} sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}>
//           <MoreVertIcon fontSize="small" />
//         </IconButton>
//       </Tooltip>
//       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose} PaperProps={{ elevation: 3, sx: { mt: 1, minWidth: 180, borderRadius: 2, border: `1px solid ${COLORS.border}` } }}>
//         <MenuItem onClick={onClose} sx={{ py: 1.5 }}>
//           <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}><VisibilityIcon fontSize="small" /></ListItemIcon>
//           <ListItemText><Typography sx={{ fontSize: '0.75rem' }}>View Details</Typography></ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => { onApplyAdvance(record); onClose(); }} sx={{ py: 1.5 }}>
//           <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}><AdvanceIcon fontSize="small" /></ListItemIcon>
//           <ListItemText><Typography sx={{ fontSize: '0.75rem' }}>Apply Advance</Typography></ListItemText>
//         </MenuItem>
//         <MenuItem onClick={() => { onFollowUp(record); onClose(); }} sx={{ py: 1.5 }}>
//           <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}><PhoneIcon fontSize="small" /></ListItemIcon>
//           <ListItemText><Typography sx={{ fontSize: '0.75rem' }}>Follow Up</Typography></ListItemText>
//         </MenuItem>
//         {canBounce && (
//           <MenuItem onClick={() => { onBounce(record); onClose(); }} sx={{ py: 1.5 }}>
//             <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}><BounceIcon fontSize="small" /></ListItemIcon>
//             <ListItemText><Typography sx={{ fontSize: '0.75rem', color: '#EF4444' }}>Bounce</Typography></ListItemText>
//           </MenuItem>
//         )}
//       </Menu>
//     </>
//   );
// };

// // Receipt Status Chip Component
// const ReceiptStatusChip = ({ status }) => {
//   const colors = COLORS.receiptStatus[status] || { bg: '#F1F5F9', color: '#475569', icon: null };
//   return <Chip icon={colors.icon} label={status} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: colors.bg, color: colors.color }} />;
// };

// const PaymentReceiptMaster = () => {
//   // State for data
//   const [receipts, setReceipts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchInput, setSearchInput] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Table state
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selected, setSelected] = useState([]);
  
//   // Server-side pagination states
//   const [totalCount, setTotalCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
  
//   // Menu state for action buttons
//   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
//   const [selectedRecordForAction, setSelectedRecordForAction] = useState(null);
  
//   // Modal state
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [openApplyAdvanceDialog, setOpenApplyAdvanceDialog] = useState(false);
//   const [openBounceDialog, setOpenBounceDialog] = useState(false);
//   const [openFollowUpDialog, setOpenFollowUpDialog] = useState(false);
//   const [selectedReceipt, setSelectedReceipt] = useState(null);
  
//   // Notification state
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   // Ref to track if we're currently searching
//   const isSearchingRef = useRef(false);
//   const searchTimeoutRef = useRef(null);

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchInput(value);
//     isSearchingRef.current = true;
    
//     // Clear previous timeout
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }
    
//     // Set new timeout for debounce
//     searchTimeoutRef.current = setTimeout(() => {
//       setSearchTerm(value);
//       setCurrentPage(1);
//       setPage(0);
//       setSelected([]);
//       isSearchingRef.current = false;
//     }, 500);
//   };

//   // Cleanup timeout on unmount
//   useEffect(() => {
//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Fetch payment receipts from API with server-side pagination and search
//   const fetchReceipts = useCallback(async () => {
//     // Don't show loading indicator while typing search
//     if (!isSearchingRef.current) {
//       setLoading(true);
//     }
    
//     try {
//       const token = localStorage.getItem('token');
//       const params = {
//         page: currentPage,
//         limit: rowsPerPage
//       };
      
//       if (searchTerm) {
//         params.search = searchTerm;
//       }
      
//       const response = await axios.get(`${BASE_URL}/api/invoices/payment-receipts`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//         params: params
//       });
      
//       if (response.data.success) {
//         setReceipts(response.data.data || []);
//         setTotalCount(response.data.pagination?.total || response.data.total || 0);
//       } else {
//         showNotification('Failed to load payment receipts', 'error');
//         setReceipts([]);
//         setTotalCount(0);
//       }
//     } catch (err) {
//       console.error('Error fetching payment receipts:', err);
//       showNotification(err.response?.data?.message || 'Failed to load payment receipts. Please try again.', 'error');
//       setReceipts([]);
//       setTotalCount(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, rowsPerPage, searchTerm]);

//   // Fetch data when dependencies change
//   useEffect(() => {
//     fetchReceipts();
//   }, [fetchReceipts]);

//   const handleRefresh = () => { 
//     fetchReceipts(); 
//     showNotification('Data refreshed', 'success'); 
//   };

//   const handleSelectAll = (event) => {
//     if (event.target.checked) setSelected(receipts.map(receipt => receipt._id));
//     else setSelected([]);
//   };

//   const handleSelect = (id) => {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected = [];
//     if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
//     else newSelected = selected.filter(item => item !== id);
//     setSelected(newSelected);
//   };

//   const handleChangePage = (event, newPage) => { 
//     setPage(newPage); 
//     setCurrentPage(newPage + 1);
//     setSelected([]); 
//   };
  
//   const handleChangeRowsPerPage = (event) => { 
//     const newRowsPerPage = parseInt(event.target.value, 10);
//     setRowsPerPage(newRowsPerPage);
//     setPage(0); 
//     setCurrentPage(1);
//     setSelected([]); 
//   };
  
//   const handleActionMenuOpen = (event, record) => { 
//     setActionMenuAnchor(event.currentTarget); 
//     setSelectedRecordForAction(record); 
//   };
  
//   const handleActionMenuClose = () => { 
//     setActionMenuAnchor(null); 
//     setSelectedRecordForAction(null); 
//   };
  
//   const handleAddSuccess = () => { 
//     setOpenAddModal(false); 
//     fetchReceipts(); 
//     showNotification('Payment receipt created successfully!', 'success'); 
//   };
  
//   const handleApplyAdvance = (receipt) => {
//     setSelectedReceipt(receipt);
//     setOpenApplyAdvanceDialog(true);
//     handleActionMenuClose();
//   };

//   const handleBounce = (receipt) => {
//     setSelectedReceipt(receipt);
//     setOpenBounceDialog(true);
//     handleActionMenuClose();
//   };

//   const handleFollowUp = (receipt) => {
//     setSelectedReceipt(receipt);
//     setOpenFollowUpDialog(true);
//     handleActionMenuClose();
//   };

//   const handleApplyAdvanceSuccess = () => {
//     setOpenApplyAdvanceDialog(false);
//     setSelectedReceipt(null);
//     fetchReceipts();
//     showNotification('Advance applied successfully!', 'success');
//   };

//   const handleBounceSuccess = () => {
//     setOpenBounceDialog(false);
//     setSelectedReceipt(null);
//     fetchReceipts();
//     showNotification('Payment receipt marked as bounced!', 'success');
//   };

//   const handleFollowUpSuccess = () => {
//     setOpenFollowUpDialog(false);
//     setSelectedReceipt(null);
//     fetchReceipts();
//     showNotification('Follow-up added successfully!', 'success');
//   };

//   const handleBulkDelete = async () => {
//     if (selected.length === 0) return;
    
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`${BASE_URL}/api/invoices/payment-receipts/bulk-delete`, 
//         { ids: selected },
//         { headers: { 'Authorization': `Bearer ${token}` } }
//       );
      
//       setSelected([]);
      
//       if (receipts.length === selected.length && currentPage > 1) {
//         setCurrentPage(prev => prev - 1);
//         setPage(prev => prev - 1);
//       } else {
//         fetchReceipts();
//       }
      
//       showNotification(`${selected.length} receipt(s) deleted successfully!`, 'success');
//     } catch (err) {
//       console.error('Bulk delete error:', err);
//       showNotification('Failed to delete some receipts', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, severity) => { 
//     setSnackbar({ open: true, message, severity }); 
//   };

//   return (
//     <Box sx={{ p: 2.5 }}>
//       <Box sx={{ mb: 2.5 }}>
//         <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>Payment Receipt Master</Typography>
//         <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>Manage payment receipts, track payments, and monitor collection history</Typography>
//       </Box>

//       <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
//           <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
//             <TextField 
//               placeholder="Search by receipt no, customer, payment mode..." 
//               size="small" 
//               value={searchInput} 
//               onChange={handleSearchChange} 
//               autoComplete="off"
//               sx={{ width: { xs: '100%', sm: 320 } }} 
//               InputProps={{ 
//                 startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} /></InputAdornment>, 
//                 sx: { height: 36, bgcolor: COLORS.background.light } 
//               }} 
//             />
//           </Stack>
          
//           <Stack direction="row" spacing={1.5} alignItems="center">
//             <Tooltip title="Refresh">
//               <IconButton size="small" onClick={handleRefresh} disabled={loading} sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}>
//                 <RefreshIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
            
//             {selected.length > 0 && (
//               <Button 
//                 variant="outlined" 
//                 color="error" 
//                 startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />} 
//                 onClick={handleBulkDelete} 
//                 sx={{ height: 36, borderRadius: 1.5, textTransform: 'none', fontSize: '0.75rem' }} 
//                 disabled={loading}
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}
            
//             <Button 
//               variant="contained" 
//               startIcon={<AddIcon sx={{ fontSize: '1rem' }} />} 
//               onClick={() => setOpenAddModal(true)} 
//               sx={{ height: 36, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', textTransform: 'none' }} 
//               disabled={loading}
//             >
//               Add Payment Receipt
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>

//       <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
//         <TableContainer>
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ bgcolor: COLORS.background.tableHeader, '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.light, py: 1.5 } }}>
//                 <TableCell padding="checkbox" sx={{ width: 40 }}>
//                   <Checkbox 
//                     indeterminate={selected.length > 0 && selected.length < receipts.length} 
//                     checked={receipts.length > 0 && selected.length === receipts.length} 
//                     onChange={handleSelectAll} 
//                     sx={{ color: COLORS.text.light, '&.Mui-checked': { color: COLORS.text.light } }} 
//                     disabled={loading || receipts.length === 0} 
//                   />
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Receipt No</TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Date</TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Customer</TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Payment Mode</TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Total Amount</TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Net Received</TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', width: 60 }} align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
//                     <CircularProgress size={32} sx={{ color: COLORS.primary }} />
//                     <Typography sx={{ fontSize: '0.75rem', mt: 1 }}>Loading payment receipts...</Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : receipts.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
//                     <PaymentIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
//                     <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
//                       {searchTerm ? 'No payment receipts found' : 'No payment receipts available'}
//                     </Typography>
//                     <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
//                       {searchTerm ? 'Try adjusting your search terms' : 'Add your first payment receipt'}
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 receipts.map((receipt, index) => {
//                   const isSelected = selected.includes(receipt._id);
//                   const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedRecordForAction?._id === receipt._id;
//                   const customerName = receipt.customer_name || receipt.allocations?.[0]?.customer_name || '-';
//                   return (
//                     <TableRow 
//                       key={receipt._id || index} 
//                       hover 
//                       selected={isSelected} 
//                       sx={{ bgcolor: COLORS.background.white, '&:hover': { bgcolor: COLORS.background.hover }, '&.Mui-selected': { bgcolor: `${COLORS.primary}10` } }}
//                     >
//                       <TableCell padding="checkbox">
//                         <Checkbox checked={isSelected} onChange={() => handleSelect(receipt._id)} sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary } }} />
//                       </TableCell>
//                       <TableCell>
//                         <Stack direction="row" alignItems="center" spacing={1}>
//                           <Avatar sx={{ width: 28, height: 28, bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
//                             <ReceiptIcon sx={{ fontSize: '0.8rem' }} />
//                           </Avatar>
//                           <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
//                             {receipt.receipt_no}
//                           </Typography>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
//                           {formatDate(receipt.receipt_date)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem' }}>{customerName}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip label={receipt.payment_mode} size="small" sx={{ fontSize: '0.65rem', height: 24, bgcolor: COLORS.primaryLight, color: COLORS.primary }} />
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
//                           ₹{formatCurrency(receipt.total_amount)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem' }}>₹{formatCurrency(receipt.net_received)}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <ReceiptStatusChip status={receipt.status || 'Pending'} />
//                       </TableCell>
//                       <TableCell align="center">
//                         <ActionMenu 
//                           record={receipt} 
//                           onApplyAdvance={handleApplyAdvance}
//                           onBounce={handleBounce}
//                           onFollowUp={handleFollowUp}
//                           anchorEl={isActionMenuOpen ? actionMenuAnchor : null} 
//                           onClose={handleActionMenuClose} 
//                           onOpen={(e) => handleActionMenuOpen(e, receipt)} 
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
//           count={totalCount} 
//           rowsPerPage={rowsPerPage} 
//           page={page} 
//           onPageChange={handleChangePage} 
//           onRowsPerPageChange={handleChangeRowsPerPage} 
//           sx={{ borderTop: `1px solid ${COLORS.border}` }} 
//         />
//       </Paper>

//       <AddPaymentReceipt open={openAddModal} onClose={() => setOpenAddModal(false)} onSuccess={handleAddSuccess} />

//       <ApplyAdvanceDialog
//         open={openApplyAdvanceDialog}
//         onClose={() => {
//           setOpenApplyAdvanceDialog(false);
//           setSelectedReceipt(null);
//         }}
//         receipt={selectedReceipt}
//         onSuccess={handleApplyAdvanceSuccess}
//       />

//       <BounceDialog
//         open={openBounceDialog}
//         onClose={() => {
//           setOpenBounceDialog(false);
//           setSelectedReceipt(null);
//         }}
//         receipt={selectedReceipt}
//         onSuccess={handleBounceSuccess}
//       />

//       <FollowUpDialog
//         open={openFollowUpDialog}
//         onClose={() => {
//           setOpenFollowUpDialog(false);
//           setSelectedReceipt(null);
//         }}
//         receipt={selectedReceipt}
//         onSuccess={handleFollowUpSuccess}
//       />

//       <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
//         <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 1.5, fontSize: '0.75rem' }}>{snackbar.message}</Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default PaymentReceiptMaster;






import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
 
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  AccountBalance as AdvanceIcon,
  MoneyOff as BounceIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddPaymentReceipt from './AddPaymentReceipt';
import ApplyAdvanceDialog from './ApplyAdvanceDialog';
import BounceDialog from './BounceDialog';
import FollowUpDialog from './FollowUpDialog';

// Color constants
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
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  receiptStatus: {
    Active: { bg: '#D1FAE5', color: '#065F46', icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> },
    Pending: { bg: '#FEF3C7', color: '#B45309', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> },
    Bounced: { bg: '#FEE2E2', color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} /> },
    Overdue: { bg: '#FFE4E6', color: '#BE123C', icon: <WarningIcon sx={{ fontSize: '0.7rem' }} /> }
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
    <Typography variant="h6" color="error" sx={{ mb: 2 }}>
      Access Denied
    </Typography>
    <Typography variant="body2" color="text.secondary">
      You don't have permission to view this page. Please contact your administrator.
    </Typography>
  </Box>
);

// Helper Functions
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Action Menu Component - WITH PERMISSION CHECKS
const ActionMenu = ({ record, onApplyAdvance, onBounce, onFollowUp, anchorEl, onClose, onOpen, permissions, isSuperAdmin }) => {
  const canView = isSuperAdmin || hasPermission(permissions, MODULES.PAYMENT_RECEIPT, PAGES.PAYMENT_RECEIPT, ACTIONS.VIEW);
  const canCreate = isSuperAdmin || hasPermission(permissions, MODULES.PAYMENT_RECEIPT, PAGES.PAYMENT_RECEIPT, ACTIONS.CREATE);
  const canUpdate = isSuperAdmin || hasPermission(permissions, MODULES.PAYMENT_RECEIPT, PAGES.PAYMENT_RECEIPT, ACTIONS.UPDATE);
  
  const canBounce = record.status === 'Active' && record.payment_mode !== 'Cash';
  
  return (
    <>
      <Tooltip title="Actions">
        <IconButton size="small" onClick={onOpen} sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose} PaperProps={{ elevation: 3, sx: { mt: 1, minWidth: 180, borderRadius: 2, border: `1px solid ${COLORS.border}` } }}>
        {/* View Details - VIEW permission */}
        {canView && (
          <MenuItem onClick={onClose} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}><VisibilityIcon fontSize="small" /></ListItemIcon>
            <ListItemText><Typography sx={{ fontSize: '0.75rem' }}>View Details</Typography></ListItemText>
          </MenuItem>
        )}
        
        {/* Apply Advance - CREATE permission */}
        {canCreate && (
          <MenuItem onClick={() => { onApplyAdvance(record); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}><AdvanceIcon fontSize="small" /></ListItemIcon>
            <ListItemText><Typography sx={{ fontSize: '0.75rem' }}>Apply Advance</Typography></ListItemText>
          </MenuItem>
        )}
        
        {/* Follow Up - CREATE permission */}
        {canCreate && (
          <MenuItem onClick={() => { onFollowUp(record); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}><PhoneIcon fontSize="small" /></ListItemIcon>
            <ListItemText><Typography sx={{ fontSize: '0.75rem' }}>Follow Up</Typography></ListItemText>
          </MenuItem>
        )}
        
        {/* Bounce - UPDATE permission */}
        {canBounce && canUpdate && (
          <MenuItem onClick={() => { onBounce(record); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}><BounceIcon fontSize="small" /></ListItemIcon>
            <ListItemText><Typography sx={{ fontSize: '0.75rem', color: '#EF4444' }}>Bounce</Typography></ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

// Receipt Status Chip Component
const ReceiptStatusChip = ({ status }) => {
  const colors = COLORS.receiptStatus[status] || { bg: '#F1F5F9', color: '#475569', icon: null };
  return <Chip icon={colors.icon} label={status} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: colors.bg, color: colors.color }} />;
};

const PaymentReceiptMaster = () => {
  // State for data
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  
  // Server-side pagination states
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRecordForAction, setSelectedRecordForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openApplyAdvanceDialog, setOpenApplyAdvanceDialog] = useState(false);
  const [openBounceDialog, setOpenBounceDialog] = useState(false);
  const [openFollowUpDialog, setOpenFollowUpDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Ref to track if we're currently searching
  const isSearchingRef = useRef(false);
  const searchTimeoutRef = useRef(null);

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

  // Check permission helper - USING CORRECT MODULE AND PAGE
  const checkPermission = (action) => {
    if (isSuperAdmin) return true;
    return hasPermission(
      userPermissions,
      MODULES.PAYMENT_RECEIPT,
      PAGES.PAYMENT_RECEIPT,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    isSearchingRef.current = true;
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1);
      setPage(0);
      setSelected([]);
      isSearchingRef.current = false;
    }, 500);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
    setPage(0);
    setSelected([]);
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

  // Fetch payment receipts from API with server-side pagination and search
  const fetchReceipts = useCallback(async () => {
    if (!canViewPage && !isSuperAdmin) return;

    if (!isSearchingRef.current) {
      setLoading(true);
    }
    
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: currentPage,
        limit: rowsPerPage
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await axios.get(`${BASE_URL}/api/invoices/payment-receipts`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: params
      });
      
      if (response.data.success) {
        setReceipts(response.data.data || []);
        setTotalCount(response.data.pagination?.total || response.data.total || 0);
      } else {
        showNotification('Failed to load payment receipts', 'error');
        setReceipts([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching payment receipts:', err);
      showNotification(err.response?.data?.message || 'Failed to load payment receipts. Please try again.', 'error');
      setReceipts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm, canViewPage, isSuperAdmin]);

  // Fetch data when dependencies change
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchReceipts();
    }
  }, [fetchReceipts, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleRefresh = () => { 
    fetchReceipts(); 
    showNotification('Data refreshed', 'success'); 
  };

  // Handle selection - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    if (event.target.checked) setSelected(receipts.map(receipt => receipt._id));
    else setSelected([]);
  };

  const handleSelect = (id) => {
    if (!canDelete) return;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else newSelected = selected.filter(item => item !== id);
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => { 
    setPage(newPage); 
    setCurrentPage(newPage + 1);
    setSelected([]); 
  };
  
  const handleChangeRowsPerPage = (event) => { 
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); 
    setCurrentPage(1);
    setSelected([]); 
  };
  
  const handleActionMenuOpen = (event, record) => { 
    setActionMenuAnchor(event.currentTarget); 
    setSelectedRecordForAction(record); 
  };
  
  const handleActionMenuClose = () => { 
    setActionMenuAnchor(null); 
    setSelectedRecordForAction(null); 
  };
  
  const handleAddSuccess = () => { 
    setOpenAddModal(false); 
    fetchReceipts(); 
    showNotification('Payment receipt created successfully!', 'success'); 
  };
  
  const handleApplyAdvance = (receipt) => {
    if (!canCreate) {
      showNotification('You don\'t have permission to apply advance', 'error');
      return;
    }
    setSelectedReceipt(receipt);
    setOpenApplyAdvanceDialog(true);
    handleActionMenuClose();
  };

  const handleBounce = (receipt) => {
    if (!canUpdate) {
      showNotification('You don\'t have permission to mark as bounced', 'error');
      return;
    }
    setSelectedReceipt(receipt);
    setOpenBounceDialog(true);
    handleActionMenuClose();
  };

  const handleFollowUp = (receipt) => {
    if (!canCreate) {
      showNotification('You don\'t have permission to add follow-up', 'error');
      return;
    }
    setSelectedReceipt(receipt);
    setOpenFollowUpDialog(true);
    handleActionMenuClose();
  };

  const handleApplyAdvanceSuccess = () => {
    setOpenApplyAdvanceDialog(false);
    setSelectedReceipt(null);
    fetchReceipts();
    showNotification('Advance applied successfully!', 'success');
  };

  const handleBounceSuccess = () => {
    setOpenBounceDialog(false);
    setSelectedReceipt(null);
    fetchReceipts();
    showNotification('Payment receipt marked as bounced!', 'success');
  };

  const handleFollowUpSuccess = () => {
    setOpenFollowUpDialog(false);
    setSelectedReceipt(null);
    fetchReceipts();
    showNotification('Follow-up added successfully!', 'success');
  };

  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/invoices/payment-receipts/bulk-delete`, 
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setSelected([]);
      
      if (receipts.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      } else {
        fetchReceipts();
      }
      
      showNotification(`${selected.length} receipt(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete some receipts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity) => { 
    setSnackbar({ open: true, message, severity }); 
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
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>Payment Receipt Master</Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>Manage payment receipts, track payments, and monitor collection history</Typography>
      </Box>

      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField 
              placeholder="Search by receipt no, customer, payment mode..." 
              size="small" 
              value={searchInput} 
              onChange={handleSearchChange} 
              autoComplete="off"
              sx={{ width: { xs: '100%', sm: 320 } }} 
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} /></InputAdornment>,
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { height: 36, bgcolor: COLORS.background.light } 
              }} 
            />
          </Stack>
          
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={handleRefresh} disabled={loading} sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {/* Bulk Delete Button - DELETE permission */}
            {canDelete && selected.length > 0 && (
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />} 
                onClick={handleBulkDelete} 
                sx={{ height: 36, borderRadius: 1.5, textTransform: 'none', fontSize: '0.75rem' }} 
                disabled={loading}
              >
                Delete ({selected.length})
              </Button>
            )}
            
            {/* Add Payment Receipt Button - CREATE permission */}
            {canCreate && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />} 
                onClick={() => setOpenAddModal(true)} 
                sx={{ height: 36, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', textTransform: 'none' }} 
                disabled={loading}
              >
                Add Payment Receipt
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.background.tableHeader, '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.light, py: 1.5 } }}>
                {/* Checkbox Column - DELETE permission */}
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox 
                      indeterminate={selected.length > 0 && selected.length < receipts.length} 
                      checked={receipts.length > 0 && selected.length === receipts.length} 
                      onChange={handleSelectAll} 
                      sx={{ color: COLORS.text.light, '&.Mui-checked': { color: COLORS.text.light } }} 
                      disabled={loading || receipts.length === 0} 
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Receipt No</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Payment Mode</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Net Received</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', width: 60 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', mt: 1 }}>Loading payment receipts...</Typography>
                  </TableCell>
                </TableRow>
              ) : receipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <PaymentIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                    <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
                      {searchTerm ? 'No payment receipts found' : 'No payment receipts available'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                      {searchTerm ? 'Try adjusting your search terms' : 'Add your first payment receipt'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                receipts.map((receipt, index) => {
                  const isSelected = selected.includes(receipt._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedRecordForAction?._id === receipt._id;
                  const customerName = receipt.customer_name || receipt.allocations?.[0]?.customer_name || '-';
                  return (
                    <TableRow 
                      key={receipt._id || index} 
                      hover 
                      selected={isSelected} 
                      sx={{ bgcolor: COLORS.background.white, '&:hover': { bgcolor: COLORS.background.hover }, '&.Mui-selected': { bgcolor: `${COLORS.primary}10` } }}
                    >
                      {canDelete && (
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} onChange={() => handleSelect(receipt._id)} sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary } }} />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
                            <ReceiptIcon sx={{ fontSize: '0.8rem' }} />
                          </Avatar>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                            {receipt.receipt_no}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {formatDate(receipt.receipt_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>{customerName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={receipt.payment_mode} size="small" sx={{ fontSize: '0.65rem', height: 24, bgcolor: COLORS.primaryLight, color: COLORS.primary }} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          ₹{formatCurrency(receipt.total_amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>₹{formatCurrency(receipt.net_received)}</Typography>
                      </TableCell>
                      <TableCell>
                        <ReceiptStatusChip status={receipt.status || 'Pending'} />
                      </TableCell>
                      <TableCell align="center">
                        <ActionMenu 
                          record={receipt} 
                          onApplyAdvance={handleApplyAdvance}
                          onBounce={handleBounce}
                          onFollowUp={handleFollowUp}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null} 
                          onClose={handleActionMenuClose} 
                          onOpen={(e) => handleActionMenuOpen(e, receipt)} 
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
          count={totalCount} 
          rowsPerPage={rowsPerPage} 
          page={page} 
          onPageChange={handleChangePage} 
          onRowsPerPageChange={handleChangeRowsPerPage} 
          sx={{ borderTop: `1px solid ${COLORS.border}` }} 
        />
      </Paper>

      {/* Add Payment Receipt Modal - CREATE permission */}
      {canCreate && (
        <AddPaymentReceipt open={openAddModal} onClose={() => setOpenAddModal(false)} onSuccess={handleAddSuccess} />
      )}

      {/* Apply Advance Dialog - CREATE permission */}
      {canCreate && (
        <ApplyAdvanceDialog
          open={openApplyAdvanceDialog}
          onClose={() => {
            setOpenApplyAdvanceDialog(false);
            setSelectedReceipt(null);
          }}
          receipt={selectedReceipt}
          onSuccess={handleApplyAdvanceSuccess}
        />
      )}

      {/* Bounce Dialog - UPDATE permission */}
      {canUpdate && (
        <BounceDialog
          open={openBounceDialog}
          onClose={() => {
            setOpenBounceDialog(false);
            setSelectedReceipt(null);
          }}
          receipt={selectedReceipt}
          onSuccess={handleBounceSuccess}
        />
      )}

      {/* Follow Up Dialog - CREATE permission */}
      {canCreate && (
        <FollowUpDialog
          open={openFollowUpDialog}
          onClose={() => {
            setOpenFollowUpDialog(false);
            setSelectedReceipt(null);
          }}
          receipt={selectedReceipt}
          onSuccess={handleFollowUpSuccess}
        />
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 1.5, fontSize: '0.75rem' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentReceiptMaster;