// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   TextField,
//   InputAdornment,
//   Typography,
//   Snackbar,
//   TablePagination,
//   Stack,
//   Alert,
//   Chip,
//   IconButton,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Grid,
//   LinearProgress,
//   FormControl,
//   InputLabel,
//   Select,
//   Avatar,
//   FormHelperText,
//   Card,
//   CardContent,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Checkbox,
//   alpha
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   FilterList as FilterIcon,
//   Add as AddIcon,
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   MoreVert as MoreVertIcon,
//   Event as EventIcon,
//   Celebration as CelebrationIcon,
//   Person as PersonIcon,
//   Cancel as CancelIcon,
//   CheckCircle as CheckCircleIcon,
//   Pending as PendingIcon,
//   Refresh as RefreshIcon,
//   Close as CloseIcon,
//   ArrowUpward as ArrowUpwardIcon,
//   Download as DownloadIcon,
//   Clear as ClearIcon
// } from '@mui/icons-material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Import components
// import ApplyLeave from './ApplyLeave';
// import ViewHoliday from './ViewHoliday';
// import EditLeave from './EditLeave';
// import DeleteLeave from './DeleteLeave';

// // Color constants - EXACT SAME as Employee Master
// const HEADER_GRADIENT = 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)';
// const STRIPE_COLOR_ODD = '#FFFFFF';
// const STRIPE_COLOR_EVEN = '#f8fafc';
// const HOVER_COLOR = '#f1f5f9';
// const PRIMARY_BLUE = '#00B4D8';
// const TEXT_COLOR_HEADER = '#FFFFFF';
// const TEXT_COLOR_MAIN = '#0f172a';

// // ==================== DATE FORMATTING UTILITIES ====================
// const formatDisplayDate = (dateString) => {
//   if (!dateString) return 'N/A';
  
//   try {
//     if (dateString.includes('T')) {
//       const datePart = dateString.split('T')[0];
//       const [year, month, day] = datePart.split('-').map(Number);
//       const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       return `${day.toString().padStart(2, '0')} ${months[month - 1]} ${year}`;
//     }
    
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = date.toLocaleString('default', { month: 'short' });
//     const year = date.getFullYear();
//     return `${day} ${month} ${year}`;
//   } catch (error) {
//     return dateString;
//   }
// };

// const formatDateTime = (dateString) => {
//   if (!dateString) return 'N/A';
  
//   try {
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   } catch (error) {
//     return dateString;
//   }
// };

// // ==================== STYLED COMPONENTS ====================

// // Action Menu Component
// const ActionMenu = ({ leave, onView, onEdit, onDelete, anchorEl, onClose, onOpen }) => {
//   return (
//     <>
//       <Tooltip title="Actions">
//         <IconButton
//           size="small"
//           onClick={onOpen}
//           sx={{
//             color: '#64748b',
//             '&:hover': {
//               bgcolor: alpha(PRIMARY_BLUE, 0.1)
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
//             border: '1px solid #e2e8f0'
//           }
//         }}
//       >
//         <MenuItem 
//           onClick={() => {
//             onView(leave);
//             onClose();
//           }}
//           sx={{ py: 1 }}
//         >
//           <ListItemIcon sx={{ color: PRIMARY_BLUE, minWidth: 36 }}>
//             <ViewIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             <Typography variant="body2" fontWeight={500}>View Details</Typography>
//           </ListItemText>
//         </MenuItem>
        
//         {leave?.Status === 'Pending' && (
//           <MenuItem 
//             onClick={() => {
//               onEdit(leave);
//               onClose();
//             }}
//             sx={{ py: 1 }}
//           >
//             <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
//               <EditIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography variant="body2" fontWeight={500}>Edit</Typography>
//             </ListItemText>
//           </MenuItem>
//         )}

//         {leave?.Status === 'Pending' && (
//           <>
//             <Divider sx={{ my: 0.5 }} />
//             <MenuItem 
//               onClick={() => {
//                 onDelete(leave);
//                 onClose();
//               }}
//               sx={{ py: 1 }}
//             >
//               <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
//                 <DeleteIcon fontSize="small" />
//               </ListItemIcon>
//               <ListItemText>
//                 <Typography variant="body2" fontWeight={500} color="#EF4444">
//                   Delete
//                 </Typography>
//               </ListItemText>
//             </MenuItem>
//           </>
//         )}
//       </Menu>
//     </>
//   );
// };

// // Styled Status Chip
// const StatusChip = ({ status }) => {
//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'approved':
//         return { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' };
//       case 'rejected':
//         return { bg: '#ffebee', color: '#c62828', border: '#ef9a9a' };
//       case 'pending':
//         return { bg: '#fff3e0', color: '#ed6c02', border: '#ffb74d' };
//       default:
//         return { bg: '#f5f5f5', color: '#757575', border: '#bdbdbd' };
//     }
//   };

//   const colors = getStatusColor(status);

//   return (
//     <Chip
//       label={status}
//       size="small"
//       icon={
//         status?.toLowerCase() === 'approved' ? <CheckCircleIcon /> :
//           status?.toLowerCase() === 'rejected' ? <CancelIcon /> :
//             <PendingIcon />
//       }
//       sx={{
//         backgroundColor: colors.bg,
//         color: colors.color,
//         borderColor: colors.border,
//         fontWeight: 500,
//         '& .MuiChip-icon': {
//           color: colors.color,
//         },
//       }}
//       variant="outlined"
//     />
//   );
// };

// // ==================== VIEW LEAVE DETAILS MODAL ====================
// const ViewLeaveDetails = ({ open, onClose, leave }) => {
//   if (!leave) return null;

//   const getAvatarInitials = (leaveData) => {
//     if (!leaveData?.EmployeeID) return 'U';
//     const firstName = leaveData.EmployeeID.FirstName || '';
//     const lastName = leaveData.EmployeeID.LastName || '';
//     return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
//   };

//   const getEmployeeName = (leaveData) => {
//     if (!leaveData?.EmployeeID) return 'Unknown';
//     const firstName = leaveData.EmployeeID.FirstName || '';
//     const lastName = leaveData.EmployeeID.LastName || '';
//     return `${firstName} ${lastName}`.trim() || 'Unknown';
//   };

//   const calculateDaysDifference = (startDate, endDate) => {
//     if (!startDate || !endDate) return 0;
    
//     const startDatePart = startDate.split('T')[0];
//     const endDatePart = endDate.split('T')[0];
    
//     const [startYear, startMonth, startDay] = startDatePart.split('-').map(Number);
//     const [endYear, endMonth, endDay] = endDatePart.split('-').map(Number);
    
//     const start = new Date(Date.UTC(startYear, startMonth - 1, startDay, 12, 0, 0));
//     const end = new Date(Date.UTC(endYear, endMonth - 1, endDay, 12, 0, 0));
    
//     const diffTime = Math.abs(end - start);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
//     return diffDays;
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{ sx: { borderRadius: 2 } }}
//     >
//       <DialogTitle
//         sx={{
//           borderBottom: "1px solid #E0E0E0",
//           py: 1.5,
//           backgroundColor: "#F8FAFC",
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}
//       >
//         <Typography fontSize={18} fontWeight={600} color={TEXT_COLOR_MAIN}>
//           Leave Application Details
//         </Typography>
//         <IconButton onClick={onClose} size="small">
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ pt: 2, pb: 1 }}>
//         <Stack spacing={2}>
//           <Stack direction="row" spacing={2} alignItems="center">
//             {/* <Avatar
//               sx={{
//                 width: 48,
//                 height: 48,
//                 bgcolor: PRIMARY_BLUE,
//                 fontSize: "1.2rem",
//               }}
//             >
//               {getAvatarInitials(leave)}
//             </Avatar> */}
//             <Box>
//               <Typography fontWeight={600} color={TEXT_COLOR_MAIN}>
//                 {getEmployeeName(leave)}
//               </Typography>
//               <Typography variant="caption" color="#64748B">
//                 ID: {leave.EmployeeID?.EmployeeID}
//               </Typography>
//             </Box>
//           </Stack>

//           <Divider />

//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6} md={3}>
//               <Typography variant="caption" color="#64748B">Leave Type</Typography>
//               <Typography fontWeight={600} color={TEXT_COLOR_MAIN}>
//                 {leave.LeaveTypeID?.Name || 'N/A'}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Typography variant="caption" color="#64748B">Status</Typography>
//               <Box mt={0.5}>
//                 <StatusChip status={leave.Status} />
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Typography variant="caption" color="#64748B">Duration</Typography>
//               <Typography variant="body2" color={TEXT_COLOR_MAIN}>
//                 {formatDisplayDate(leave.StartDate)} - {formatDisplayDate(leave.EndDate)}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Typography variant="caption" color="#64748B">Days</Typography>
//               <Chip
//                 label={`${leave.NumberOfDays || calculateDaysDifference(leave.StartDate, leave.EndDate)} days`}
//                 size="small"
//                 sx={{ fontWeight: 500, backgroundColor: '#e0f2fe', color: '#0c4a6e', border: '1px solid #bae6fd', mt: 0.5 }}
//               />
//             </Grid>
//           </Grid>

//           <Divider />

//           <Typography variant="subtitle2" fontWeight={600} color={TEXT_COLOR_MAIN}>
//             Reason for Leave
//           </Typography>
//           <Typography
//             variant="body2"
//             sx={{
//               backgroundColor: "#F8FAFC",
//               p: 1.5,
//               borderRadius: 1,
//               border: '1px solid #E0E0E0',
//               color: TEXT_COLOR_MAIN
//             }}
//           >
//             {leave.Reason || "No reason provided"}
//           </Typography>
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{ p: 2, borderTop: "1px solid #E0E0E0" }}>
//         <Button
//           variant="contained"
//           onClick={onClose}
//           startIcon={<CloseIcon />}
//           sx={{
//             borderRadius: 1.5,
//             textTransform: "none",
//             background: HEADER_GRADIENT,
//             '&:hover': { opacity: 0.9, background: HEADER_GRADIENT }
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// // ==================== MAIN COMPONENT ====================
// const EmployeeLeaveMaster = () => {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState('');
//   const [employeeDetails, setEmployeeDetails] = useState(null);

//   const [leaves, setLeaves] = useState([]);
//   const [filteredLeaves, setFilteredLeaves] = useState([]);
//   const [leaveBalance, setLeaveBalance] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingEmployees, setLoadingEmployees] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
  
//   // Checkbox selection state
//   const [selected, setSelected] = useState([]);

//   const [openApplyLeave, setOpenApplyLeave] = useState(false);
//   const [openViewHoliday, setOpenViewHoliday] = useState(false);
//   const [openViewLeave, setOpenViewLeave] = useState(false);
//   const [openEditLeave, setOpenEditLeave] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

//   const [actionAnchor, setActionAnchor] = useState(null);
//   const [selectedLeave, setSelectedLeave] = useState(null);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   const [statusFilter, setStatusFilter] = useState('all');
//   const [dateRangeFilter, setDateRangeFilter] = useState({ start: null, end: null });
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortConfig, setSortConfig] = useState({ field: 'AppliedOn', direction: 'desc' });

//   const [defaultEmployee, setDefaultEmployee] = useState(null);

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   useEffect(() => {
//     if (selectedEmployee) {
//       fetchEmployeeLeaves(selectedEmployee);
//     } else {
//       clearEmployeeData();
//     }
//   }, [selectedEmployee]);

//   useEffect(() => {
//     applyFilters();
//   }, [leaves, statusFilter, searchTerm, dateRangeFilter.start, dateRangeFilter.end]);

//   const fetchEmployees = async () => {
//     try {
//       setLoadingEmployees(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         const employeesData = response.data.data || [];
//         setEmployees(employeesData);
        
//         // Set default employee after employees are loaded
//         setDefaultEmployeeIfAvailable(employeesData);
//       }
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//       showNotification('Failed to load employees', 'error');
//     } finally {
//       setLoadingEmployees(false);
//     }
//   };

//   const setDefaultEmployeeIfAvailable = (employeesList) => {
//     const savedEmployeeId = localStorage.getItem('defaultSelectedEmployee');
    
//     if (savedEmployeeId && employeesList.some(emp => emp._id === savedEmployeeId)) {
//       setSelectedEmployee(savedEmployeeId);
//       setDefaultEmployee(savedEmployeeId);
//     } else if (employeesList.length > 0) {
//       // Select the first employee by default
//       setSelectedEmployee(employeesList[0]._id);
//       setDefaultEmployee(employeesList[0]._id);
//       localStorage.setItem('defaultSelectedEmployee', employeesList[0]._id);
//     }
//   };

//   const fetchEmployeeLeaves = async (employeeId) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       const employee = employees.find(emp => emp._id === employeeId);
//       setEmployeeDetails(employee);

//       const response = await axios.get(`${BASE_URL}/api/leaves/employee/${employeeId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         const leavesData = response.data.data || [];
//         const summaryData = response.data.summary || null;
//         const balanceData = response.data.leaveBalance || [];

//         setLeaves(leavesData);
//         setFilteredLeaves(leavesData);
//         setSummary(summaryData);
//         setLeaveBalance(balanceData);
//         setSelected([]);

//         return response.data;
//       }
//     } catch (error) {
//       console.error('Error fetching leaves:', error);
//       showNotification('Failed to load leave applications', 'error');
//       clearEmployeeData();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearEmployeeData = () => {
//     setLeaves([]);
//     setFilteredLeaves([]);
//     setLeaveBalance([]);
//     setSummary(null);
//     setEmployeeDetails(null);
//     setSearchTerm('');
//     setStatusFilter('all');
//     setDateRangeFilter({ start: null, end: null });
//     setSelected([]);
//   };

//   // Handle select all
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(paginatedLeaves.map(leave => leave._id));
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

//   // Handle bulk delete
//   const handleBulkDelete = () => {
//     if (selected.length === 0) return;
//     showNotification(`Bulk delete for ${selected.length} items - API implementation required`, 'warning');
//   };

//   const applyFilters = () => {
//     let filtered = [...leaves];

//     if (searchTerm) {
//       filtered = filtered.filter(leave =>
//         leave.LeaveTypeID?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         leave.Reason?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(leave => leave.Status === statusFilter);
//     }

//     if (dateRangeFilter.start || dateRangeFilter.end) {
//       filtered = filtered.filter(leave => {
//         const leaveStartPart = leave.StartDate.split('T')[0];
//         const leaveEndPart = leave.EndDate.split('T')[0];
        
//         const [startYear, startMonth, startDay] = leaveStartPart.split('-').map(Number);
//         const [endYear, endMonth, endDay] = leaveEndPart.split('-').map(Number);
        
//         const leaveStart = new Date(Date.UTC(startYear, startMonth - 1, startDay, 12, 0, 0));
//         const leaveEnd = new Date(Date.UTC(endYear, endMonth - 1, endDay, 12, 0, 0));

//         if (dateRangeFilter.start && dateRangeFilter.end) {
//           const filterStartDate = new Date(dateRangeFilter.start);
//           const filterEndDate = new Date(dateRangeFilter.end);
          
//           const filterStart = new Date(Date.UTC(
//             filterStartDate.getFullYear(),
//             filterStartDate.getMonth(),
//             filterStartDate.getDate(),
//             12, 0, 0
//           ));
//           const filterEnd = new Date(Date.UTC(
//             filterEndDate.getFullYear(),
//             filterEndDate.getMonth(),
//             filterEndDate.getDate(),
//             12, 0, 0
//           ));

//           return leaveStart <= filterEnd && leaveEnd >= filterStart;
//         }
//         else if (dateRangeFilter.start) {
//           const filterStartDate = new Date(dateRangeFilter.start);
//           const filterStart = new Date(Date.UTC(
//             filterStartDate.getFullYear(),
//             filterStartDate.getMonth(),
//             filterStartDate.getDate(),
//             12, 0, 0
//           ));
//           return leaveEnd >= filterStart;
//         }
//         else if (dateRangeFilter.end) {
//           const filterEndDate = new Date(dateRangeFilter.end);
//           const filterEnd = new Date(Date.UTC(
//             filterEndDate.getFullYear(),
//             filterEndDate.getMonth(),
//             filterEndDate.getDate(),
//             12, 0, 0
//           ));
//           return leaveStart <= filterEnd;
//         }

//         return true;
//       });
//     }

//     setFilteredLeaves(filtered);
//     setPage(0);
//     setSelected([]);
//   };

//   const handleSort = (field) => {
//     const direction = sortConfig.field === field && sortConfig.direction === "asc" ? "desc" : "asc";
//     setSortConfig({ field, direction });
    
//     const sorted = [...filteredLeaves].sort((a, b) => {
//       let aValue = a[field];
//       let bValue = b[field];

//       if (field === 'LeaveTypeID') {
//         aValue = a.LeaveTypeID?.Name || '';
//         bValue = b.LeaveTypeID?.Name || '';
//       }

//       if (field === 'StartDate' || field === 'EndDate' || field === 'AppliedOn' || field === 'CreatedAt') {
//         aValue = aValue ? new Date(aValue).getTime() : 0;
//         bValue = bValue ? new Date(bValue).getTime() : 0;
//       }

//       if (direction === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//     setFilteredLeaves(sorted);
//   };

//   const showNotification = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setSelected([]);
//   };

//   const handleClearSearch = () => {
//     setSearchTerm('');
//     setSelected([]);
//   };

//   const handleActionOpen = (e, leave) => {
//     setActionAnchor(e.currentTarget);
//     setSelectedLeave(leave);
//   };

//   const handleActionClose = () => {
//     setActionAnchor(null);
//   };

//   const handleViewLeave = () => {
//     setOpenViewLeave(true);
//     handleActionClose();
//   };

//   const handleEditLeave = () => {
//     setOpenEditLeave(true);
//     handleActionClose();
//   };

//   const handleDeleteClick = () => {
//     setOpenDeleteDialog(true);
//     handleActionClose();
//   };

//   const handleApplyLeaveClose = (success = false) => {
//     setOpenApplyLeave(false);
//     if (success && selectedEmployee) {
//       setLoading(true);
//       fetchEmployeeLeaves(selectedEmployee)
//         .then(() => showNotification('Leave applied successfully'))
//         .finally(() => setLoading(false));
//     }
//   };

//   const handleEditLeaveClose = (success = false) => {
//     setOpenEditLeave(false);
//     setSelectedLeave(null);
//     if (success && selectedEmployee) {
//       setLoading(true);
//       fetchEmployeeLeaves(selectedEmployee)
//         .then(() => showNotification('Leave updated successfully'))
//         .finally(() => setLoading(false));
//     }
//   };

//   const handleDeleteLeaveClose = (deleted = false) => {
//     setOpenDeleteDialog(false);
//     setSelectedLeave(null);
//     if (deleted && selectedEmployee) {
//       setLoading(true);
//       fetchEmployeeLeaves(selectedEmployee)
//         .then(() => showNotification('Leave deleted successfully'))
//         .finally(() => setLoading(false));
//     }
//   };

//   const handleViewLeaveClose = () => {
//     setOpenViewLeave(false);
//     setSelectedLeave(null);
//   };

//   const handleRefresh = () => {
//     if (selectedEmployee) {
//       setLoading(true);
//       fetchEmployeeLeaves(selectedEmployee)
//         .then(() => showNotification('Data refreshed successfully'))
//         .catch(() => showNotification('Failed to refresh data', 'error'));
//     }
//   };

//   const handleClearFilters = () => {
//     setSearchTerm('');
//     setStatusFilter('all');
//     setDateRangeFilter({ start: null, end: null });
//     setSelected([]);
//   };

//   const handleEmployeeChange = (event) => {
//     const employeeId = event.target.value;
//     setSelectedEmployee(employeeId);
//     setPage(0);
//     handleClearFilters();
    
//     if (employeeId) {
//       localStorage.setItem('defaultSelectedEmployee', employeeId);
//     } else {
//       localStorage.removeItem('defaultSelectedEmployee');
//     }
//   };

//   const getEmployeeName = (employee) => {
//     if (!employee) return '';
//     return `${employee.FirstName || ''} ${employee.LastName || ''}`.trim();
//   };

//   const getAvatarInitials = (employee) => {
//     if (!employee) return 'U';
//     const first = employee.FirstName ? employee.FirstName.charAt(0) : '';
//     const last = employee.LastName ? employee.LastName.charAt(0) : '';
//     return `${first}${last}`.toUpperCase() || 'U';
//   };

//   const paginatedLeaves = filteredLeaves.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const isFilterActive = searchTerm || statusFilter !== 'all' || dateRangeFilter.start || dateRangeFilter.end;

//   const pendingCount = summary?.Pending?.count || leaves.filter(l => l.Status === 'Pending').length;
//   const pendingDays = summary?.Pending?.totalDays || 0;
//   const approvedCount = summary?.Approved?.count || leaves.filter(l => l.Status === 'Approved').length;
//   const approvedDays = summary?.Approved?.totalDays || 0;
//   const rejectedCount = summary?.Rejected?.count || leaves.filter(l => l.Status === 'Rejected').length;
//   const rejectedDays = summary?.Rejected?.totalDays || 0;
//   const totalLeaves = leaves.length;

//   const stats = [
//     {
//       label: 'Total Leaves',
//       value: totalLeaves,
//       color: '#164e63',
//       bg: '#f1f5f9',
//       icon: <EventIcon sx={{ fontSize: 24 }} />
//     },
//     {
//       label: 'Pending',
//       value: pendingCount,
//       subValue: `${pendingDays} days`,
//       color: '#ed6c02',
//       bg: '#fff3e0',
//       icon: <PendingIcon sx={{ fontSize: 24 }} />
//     },
//     {
//       label: 'Approved',
//       value: approvedCount,
//       subValue: `${approvedDays} days`,
//       color: '#2e7d32',
//       bg: '#e8f5e9',
//       icon: <CheckCircleIcon sx={{ fontSize: 24 }} />
//     },
//     {
//       label: 'Rejected',
//       value: rejectedCount,
//       subValue: `${rejectedDays} days`,
//       color: '#d32f2f',
//       bg: '#ffebee',
//       icon: <CancelIcon sx={{ fontSize: 24 }} />
//     }
//   ];

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box sx={{ p: 3 }}>
//         {/* Header */}
//         <Box sx={{ mb: 3 }}>
//           <Typography
//             variant="h5"
//             component="h1"
//             fontWeight="600"
//             sx={{
//               background: HEADER_GRADIENT,
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               display: 'inline-block'
//             }}
//           >
//             Employee Leave Management
//           </Typography>
//           <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
//             View and manage leave applications for employees
//           </Typography>
//         </Box>

//         {/* Employee Selection Card */}
//         <Paper sx={{
//           p: 2,
//           mb: 3,
//           borderRadius: 2,
//           border: '1px solid #e2e8f0',
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
//         }}>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <FormControl fullWidth variant="outlined" size="small">
//                 <InputLabel>Select Employee</InputLabel>
//                 <Select
//                   value={selectedEmployee}
//                   onChange={handleEmployeeChange}
//                   label="Select Employee"
//                   disabled={loadingEmployees}
//                   sx={{
//                     borderRadius: 1.5,
//                     width: 250,
//                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                       borderColor: PRIMARY_BLUE,
//                     }
//                   }}
//                 >
//                   <MenuItem value="">
//                     <em>Select an employee</em>
//                   </MenuItem>
//                   {employees.map((emp) => (
//                     <MenuItem key={emp._id} value={emp._id}>
//                       <Stack direction="row" spacing={1.5} alignItems="center">
//                         {/* <Avatar sx={{ width: 32, height: 32, bgcolor: PRIMARY_BLUE, fontSize: '0.875rem' }}>
//                           {getAvatarInitials(emp)}
//                         </Avatar> */}
//                         <Box>
//                           <Typography variant="body2" fontWeight={500} color={TEXT_COLOR_MAIN}>
//                             {getEmployeeName(emp)}
//                           </Typography>
//                           {/* <Typography variant="caption" color="#64748B">
//                             {emp.EmployeeID} • {emp.DepartmentID?.DepartmentName || 'No Dept'}
//                           </Typography> */}
//                         </Box>
//                       </Stack>
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             {employeeDetails && (
//               <Grid item xs={12} md={6}>
//                 <Stack direction="row" spacing={2} alignItems="center">
//                   <Avatar sx={{ width: 48, height: 48, bgcolor: PRIMARY_BLUE, fontSize: '1.2rem' }}>
//                     {getAvatarInitials(employeeDetails)}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="subtitle1" fontWeight={600} color={TEXT_COLOR_MAIN}>
//                       {getEmployeeName(employeeDetails)}
//                     </Typography>
//                     <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
//                       <Typography variant="caption" color="#64748B">
//                         ID: {employeeDetails.EmployeeID}
//                       </Typography>
//                       <Typography variant="caption" color="#64748B">
//                         {employeeDetails.DepartmentID?.DepartmentName || 'No Dept'}
//                       </Typography>
//                     </Stack>
//                   </Box>
//                 </Stack>
//               </Grid>
//             )}
//           </Grid>
//         </Paper>

//         {selectedEmployee && (
//           <>
//             {/* Statistics Cards */}
//             {/* <Grid container spacing={2} sx={{ mb: 3 }}>
//               {stats.map((stat, index) => (
//                 <Grid item xs={12} sm={6} md={3} key={index}>
//                   <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0', transition: 'all 0.2s', '&:hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transform: 'translateY(-2px)' } }}>
//                     <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
//                       <Box>
//                         <Typography variant="caption" color="#64748B">{stat.label}</Typography>
//                         <Typography variant="h4" fontWeight={600} color={TEXT_COLOR_MAIN} sx={{ lineHeight: 1.2, mt: 0.5 }}>
//                           {stat.value}
//                         </Typography>
//                         {stat.subValue && (
//                           <Typography variant="caption" fontWeight={500} color={stat.color} sx={{ mt: 0.5, display: 'block' }}>
//                             {stat.subValue}
//                           </Typography>
//                         )}
//                       </Box>
//                       <Avatar sx={{ bgcolor: stat.bg, color: stat.color, width: 48, height: 48 }}>
//                         {stat.icon}
//                       </Avatar>
//                     </Stack>
//                   </Paper>
//                 </Grid>
//               ))}
//             </Grid> */}

//             {/* Action Bar */}
//             <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
//               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
//                 <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
//                   <TextField
//                     placeholder="Search leaves..."
//                     size="small"
//                     value={searchTerm}
//                     onChange={handleSearch}
//                     sx={{ width: { xs: '100%', sm: 300 }, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
//                     InputProps={{
//                       startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#64748B' }} /></InputAdornment>,
//                       endAdornment: searchTerm && (
//                         <InputAdornment position="end">
//                           <IconButton size="small" onClick={handleClearSearch} edge="end">
//                             <ClearIcon fontSize="small" sx={{ color: '#64748B' }} />
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                       sx: { height: 40, bgcolor: '#f8fafc' }
//                     }}
//                   />
                  
//                   {/* <Button
//                     variant="outlined"
//                     startIcon={<FilterIcon />}
//                     onClick={() => setShowFilters(!showFilters)}
//                     sx={{ height: 40, borderRadius: 1.5, borderColor: '#cbd5e1', color: '#475569', textTransform: 'none' }}
//                   >
//                     Filters
//                   </Button> */}

//                   {isFilterActive && (
//                     <Button variant="text" startIcon={<CloseIcon />} onClick={handleClearFilters} sx={{ height: 40, borderRadius: 1.5 }}>
//                       Clear Filters
//                     </Button>
//                   )}
//                 </Stack>

//                 <Stack direction="row" spacing={2}>
//                   {selected.length > 0 && (
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       startIcon={<DeleteIcon />}
//                       onClick={handleBulkDelete}
//                       sx={{ height: 40, borderRadius: 1.5, borderColor: '#EF4444', color: '#EF4444' }}
//                     >
//                       Delete ({selected.length})
//                     </Button>
//                   )}
                  
//                   {/* <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh} sx={{ height: 40, borderRadius: 1.5 }}>
//                     Refresh
//                   </Button> */}

//                   <Button
//                     variant="contained"
//                     startIcon={<CelebrationIcon />}
//                     onClick={() => setOpenViewHoliday(true)}
//                     sx={{ height: 40, borderRadius: 1.5, background: HEADER_GRADIENT, textTransform: 'none' }}
//                   >
//                     Holidays
//                   </Button>

//                   <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={() => setOpenApplyLeave(true)}
//                     sx={{ height: 40, borderRadius: 1.5, background: HEADER_GRADIENT, textTransform: 'none' }}
//                   >
//                     Apply Leave
//                   </Button>
//                 </Stack>
//               </Stack>

//               {/* Filter Panel */}
//               {showFilters && (
//                 <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={4}>
//                       <FormControl fullWidth size="small">
//                         <InputLabel>Status</InputLabel>
//                         <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status" sx={{ borderRadius: 1.5 }}>
//                           <MenuItem value="all">All Status</MenuItem>
//                           <MenuItem value="Pending">Pending</MenuItem>
//                           <MenuItem value="Approved">Approved</MenuItem>
//                           <MenuItem value="Rejected">Rejected</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                     <Grid item xs={12} sm={4}>
//                       <DatePicker
//                         label="From Date"
//                         value={dateRangeFilter.start}
//                         onChange={(date) => setDateRangeFilter({ ...dateRangeFilter, start: date })}
//                         slotProps={{ textField: { size: 'small', fullWidth: true, sx: { borderRadius: 1.5 } } }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={4}>
//                       <DatePicker
//                         label="To Date"
//                         value={dateRangeFilter.end}
//                         onChange={(date) => setDateRangeFilter({ ...dateRangeFilter, end: date })}
//                         slotProps={{ textField: { size: 'small', fullWidth: true, sx: { borderRadius: 1.5 } } }}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Box>
//               )}
//             </Paper>

//             {/* Leave Applications Table */}
//             <Paper sx={{ borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ background: HEADER_GRADIENT }}>
//                       <TableCell padding="checkbox" sx={{ width: 60 }}>
//                         <Checkbox
//                           indeterminate={selected.length > 0 && selected.length < paginatedLeaves.length}
//                           checked={paginatedLeaves.length > 0 && selected.length === paginatedLeaves.length}
//                           onChange={handleSelectAll}
//                           sx={{ color: TEXT_COLOR_HEADER, '&.Mui-checked': { color: TEXT_COLOR_HEADER } }}
//                           disabled={loading || paginatedLeaves.length === 0}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ color: 'white', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('LeaveTypeID')}>
//                         <Stack direction="row" alignItems="center" spacing={0.5}>
//                           Leave Type
//                           <ArrowUpwardIcon sx={{ fontSize: 14, color: 'white', opacity: sortConfig.field === 'LeaveTypeID' ? 1 : 0.5 }} />
//                         </Stack>
//                       </TableCell>
//                       <TableCell sx={{ color: 'white', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('StartDate')}>
//                         <Stack direction="row" alignItems="center" spacing={0.5}>
//                           From Date
//                           <ArrowUpwardIcon sx={{ fontSize: 14, color: 'white', opacity: sortConfig.field === 'StartDate' ? 1 : 0.5 }} />
//                         </Stack>
//                       </TableCell>
//                       <TableCell sx={{ color: 'white', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('EndDate')}>
//                         <Stack direction="row" alignItems="center" spacing={0.5}>
//                           To Date
//                           <ArrowUpwardIcon sx={{ fontSize: 14, color: 'white', opacity: sortConfig.field === 'EndDate' ? 1 : 0.5 }} />
//                         </Stack>
//                       </TableCell>
//                       <TableCell sx={{ color: 'white', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('NumberOfDays')}>
//                         <Stack direction="row" alignItems="center" spacing={0.5}>
//                           Days
//                           <ArrowUpwardIcon sx={{ fontSize: 14, color: 'white', opacity: sortConfig.field === 'NumberOfDays' ? 1 : 0.5 }} />
//                         </Stack>
//                       </TableCell>
//                       <TableCell sx={{ color: 'white', fontWeight: 600 }}>Reason</TableCell>
//                       <TableCell sx={{ color: 'white', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('Status')}>
//                         <Stack direction="row" alignItems="center" spacing={0.5}>
//                           Status
//                           <ArrowUpwardIcon sx={{ fontSize: 14, color: 'white', opacity: sortConfig.field === 'Status' ? 1 : 0.5 }} />
//                         </Stack>
//                       </TableCell>
//                       <TableCell sx={{ color: 'white', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('AppliedOn')}>
//                         <Stack direction="row" alignItems="center" spacing={0.5}>
//                           Applied On
//                           <ArrowUpwardIcon sx={{ fontSize: 14, color: 'white', opacity: sortConfig.field === 'AppliedOn' ? 1 : 0.5 }} />
//                         </Stack>
//                       </TableCell>
//                       <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {loading ? (
//                       <TableRow>
//                         <TableCell colSpan={9} sx={{ p: 0 }}>
//                           <LinearProgress sx={{ height: 2, bgcolor: alpha(PRIMARY_BLUE, 0.2), '& .MuiLinearProgress-bar': { bgcolor: PRIMARY_BLUE } }} />
//                         </TableCell>
//                       </TableRow>
//                     ) : paginatedLeaves.length > 0 ? (
//                       paginatedLeaves.map((leave, index) => {
//                         const isSelected = selected.includes(leave._id);
//                         const isOddRow = index % 2 === 0;
//                         const isActionMenuOpen = Boolean(actionAnchor) && selectedLeave?._id === leave._id;

//                         return (
//                           <TableRow
//                             key={leave._id}
//                             hover
//                             selected={isSelected}
//                             sx={{ 
//                               bgcolor: isOddRow ? STRIPE_COLOR_ODD : STRIPE_COLOR_EVEN,
//                               '&:hover': { bgcolor: HOVER_COLOR },
//                               '&.Mui-selected': { bgcolor: alpha(PRIMARY_BLUE, 0.08) }
//                             }}
//                           >
//                             <TableCell padding="checkbox">
//                               <Checkbox
//                                 checked={isSelected}
//                                 onChange={() => handleSelect(leave._id)}
//                                 sx={{ color: PRIMARY_BLUE, '&.Mui-checked': { color: PRIMARY_BLUE } }}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <Typography fontWeight={500} color={TEXT_COLOR_MAIN}>
//                                 {leave.LeaveTypeID?.Name || 'N/A'}
//                               </Typography>
//                             </TableCell>
//                             <TableCell>
//                               <Typography color={TEXT_COLOR_MAIN}>{formatDisplayDate(leave.StartDate)}</Typography>
//                             </TableCell>
//                             <TableCell>
//                               <Typography color={TEXT_COLOR_MAIN}>{formatDisplayDate(leave.EndDate)}</Typography>
//                             </TableCell>
//                             <TableCell>
//                               <Chip
//                                 label={leave.NumberOfDays}
//                                 size="small"
//                                 sx={{ bgcolor: '#e0f2fe', color: '#0c4a6e', fontWeight: 500, minWidth: 40, border: '1px solid #bae6fd' }}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <Tooltip title={leave.Reason || ''}>
//                                 <Typography noWrap sx={{ maxWidth: 200, color: TEXT_COLOR_MAIN }}>
//                                   {leave.Reason || 'No reason provided'}
//                                 </Typography>
//                               </Tooltip>
//                             </TableCell>
//                             <TableCell>
//                               <StatusChip status={leave.Status} />
//                             </TableCell>
//                             <TableCell>
//                               <Typography color={TEXT_COLOR_MAIN}>{formatDateTime(leave.AppliedOn || leave.CreatedAt)}</Typography>
//                             </TableCell>
//                             <TableCell align="center">
//                               <ActionMenu 
//                                 leave={leave}
//                                 onView={handleViewLeave}
//                                 onEdit={handleEditLeave}
//                                 onDelete={handleDeleteClick}
//                                 anchorEl={isActionMenuOpen ? actionAnchor : null}
//                                 onClose={handleActionClose}
//                                 onOpen={(e) => handleActionOpen(e, leave)}
//                               />
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
//                           <EventIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
//                           <Typography variant="body1" color="#64748B" fontWeight={500}>
//                             No Leave Applications Found
//                           </Typography>
//                           <Typography variant="body2" color="#94A3B8">
//                             {isFilterActive ? 'Try adjusting your filters' : 'This employee hasn\'t applied for any leave yet'}
//                           </Typography>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {filteredLeaves.length > 0 && (
//                 <TablePagination
//                   rowsPerPageOptions={[5, 10, 25, 50]}
//                   component="div"
//                   count={filteredLeaves.length}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   onPageChange={(e, newPage) => { setPage(newPage); setSelected([]); }}
//                   onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); setSelected([]); }}
//                   sx={{ borderTop: '1px solid #e2e8f0', '& .MuiTablePagination-actions button': { color: PRIMARY_BLUE } }}
//                 />
//               )}
//             </Paper>
//           </>
//         )}

//         {!selectedEmployee && (
//           <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2, border: '1px solid #e2e8f0' }}>
//             <PersonIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
//             <Typography variant="h6" color="#64748B" fontWeight={500} gutterBottom>
//               No Employee Selected
//             </Typography>
//             <Typography variant="body2" color="#94A3B8">
//               Please select an employee from the dropdown above to view their leave information
//             </Typography>
//           </Paper>
//         )}

//         {/* Action Menu */}
//         <Menu anchorEl={actionAnchor} open={Boolean(actionAnchor)} onClose={handleActionClose}>
//           <MenuItem onClick={handleViewLeave}>
//             <ListItemIcon><ViewIcon fontSize="small" sx={{ color: PRIMARY_BLUE }} /></ListItemIcon>
//             <ListItemText>View Details</ListItemText>
//           </MenuItem>
//           {selectedLeave?.Status === 'Pending' && (
//             <>
//               <MenuItem onClick={handleEditLeave}>
//                 <ListItemIcon><EditIcon fontSize="small" sx={{ color: '#10B981' }} /></ListItemIcon>
//                 <ListItemText>Edit Leave</ListItemText>
//               </MenuItem>
//               <Divider />
//               <MenuItem onClick={handleDeleteClick}>
//                 <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
//                 <ListItemText primary="Delete Leave" sx={{ color: '#d32f2f' }} />
//               </MenuItem>
//             </>
//           )}
//         </Menu>

//         {/* Modals */}
//         {selectedEmployee && (
//           <>
//             <ApplyLeave open={openApplyLeave} handleClose={handleApplyLeaveClose} onSuccess={handleApplyLeaveClose} employeeId={selectedEmployee} employeeDetails={employeeDetails} />
//             <EditLeave open={openEditLeave} onClose={handleEditLeaveClose} leaveData={selectedLeave} onUpdate={handleEditLeaveClose} />
//             <DeleteLeave open={openDeleteDialog} onClose={handleDeleteLeaveClose} leaveData={selectedLeave} onDelete={handleDeleteLeaveClose} />
//           </>
//         )}

//         <ViewHoliday open={openViewHoliday} onClose={() => setOpenViewHoliday(false)} />
//         <ViewLeaveDetails open={openViewLeave} onClose={handleViewLeaveClose} leave={selectedLeave} />

//         {/* Snackbar */}
//         <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
//           <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ borderRadius: 1.5 }}>
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default EmployeeLeaveMaster;

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
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Event as EventIcon,
  Celebration as CelebrationIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Close as CloseIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Import components
import ApplyLeave from './ApplyLeave';
import ViewHoliday from './ViewHoliday';
import EditLeave from './EditLeave';
import DeleteLeave from './DeleteLeave';
import ViewLeave from './ViewLeave';

// Color constants matching ProcessMaster.jsx
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
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  },
  status: {
    approved: '#9FE2BF',
    pending: '#FEF3C7',
    rejected: '#FEE2E2'
  }
};

// Action Menu Component (matching ProcessMaster)
const ActionMenu = ({ leave, onView, onEdit, onDelete, anchorEl, onClose, onOpen }) => {
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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            onView(leave);
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              View Details
            </Typography>
          </ListItemText>
        </MenuItem>
        
        {leave?.Status === 'Pending' && (
          <MenuItem 
            onClick={() => {
              onEdit(leave);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Edit
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {leave?.Status === 'Pending' && (
          <>
            <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
            <MenuItem 
              onClick={() => {
                onDelete(leave);
                onClose();
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
                  Delete
                </Typography>
              </ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { bg: COLORS.status.approved, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> };
      case 'rejected':
        return { bg: COLORS.status.rejected, color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} /> };
      case 'pending':
        return { bg: COLORS.status.pending, color: '#92400E', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> };
      default:
        return { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: null };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={status}
      size="small"
      icon={config.icon}
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontWeight: 500,
        fontSize: '0.65rem',
        height: 24,
        '& .MuiChip-icon': {
          color: config.color,
          fontSize: '0.7rem'
        },
        '& .MuiChip-label': {
          px: 1,
          fontSize: '0.65rem'
        }
      }}
    />
  );
};

// Format date function
const formatDisplayDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return 'Invalid Date';
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid Date';
  }
};

// Main Component
const EmployeeLeaveMaster = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Menu state
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedLeaveForAction, setSelectedLeaveForAction] = useState(null);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: null, end: null });
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal state
  const [openApplyLeave, setOpenApplyLeave] = useState(false);
  const [openViewHoliday, setOpenViewHoliday] = useState(false);
  const [openViewLeave, setOpenViewLeave] = useState(false);
  const [openEditLeave, setOpenEditLeave] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch leaves when employee is selected
  useEffect(() => {
    if (selectedEmployee) {
      fetchEmployeeLeaves();
    } else {
      clearEmployeeData();
    }
  }, [selectedEmployee]);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [leaves, statusFilter, searchTerm, dateRangeFilter.start, dateRangeFilter.end]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const employeesData = response.data.data || [];
        setEmployees(employeesData);
        
        // Set default employee if available
        const savedEmployeeId = localStorage.getItem('defaultSelectedEmployee');
        if (savedEmployeeId && employeesData.some(emp => emp._id === savedEmployeeId)) {
          setSelectedEmployee(savedEmployeeId);
        } else if (employeesData.length > 0) {
          setSelectedEmployee(employeesData[0]._id);
          localStorage.setItem('defaultSelectedEmployee', employeesData[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      showNotification('Failed to load employees', 'error');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchEmployeeLeaves = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const employee = employees.find(emp => emp._id === selectedEmployee);
      setEmployeeDetails(employee);

      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateRangeFilter.start) params.append('startDate', dateRangeFilter.start.toISOString().split('T')[0]);
      if (dateRangeFilter.end) params.append('endDate', dateRangeFilter.end.toISOString().split('T')[0]);

      const response = await axios.get(
        `${BASE_URL}/api/leaves/employee/${selectedEmployee}?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const leavesData = response.data.data || [];
        setLeaves(leavesData);
        setFilteredLeaves(leavesData);
        setTotalItems(response.data.pagination?.totalItems || leavesData.length);
        setSelected([]);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      showNotification('Failed to load leave applications', 'error');
      clearEmployeeData();
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leaves];
    
    if (searchTerm) {
      filtered = filtered.filter(leave =>
        leave.LeaveTypeID?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.Reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(leave => leave.Status === statusFilter);
    }
    
    if (dateRangeFilter.start || dateRangeFilter.end) {
      filtered = filtered.filter(leave => {
        const leaveStart = new Date(leave.StartDate);
        const leaveEnd = new Date(leave.EndDate);
        
        if (dateRangeFilter.start && dateRangeFilter.end) {
          return leaveStart <= dateRangeFilter.end && leaveEnd >= dateRangeFilter.start;
        } else if (dateRangeFilter.start) {
          return leaveEnd >= dateRangeFilter.start;
        } else if (dateRangeFilter.end) {
          return leaveStart <= dateRangeFilter.end;
        }
        return true;
      });
    }
    
    setFilteredLeaves(filtered);
    setPage(0);
  };

  const clearEmployeeData = () => {
    setLeaves([]);
    setFilteredLeaves([]);
    setEmployeeDetails(null);
    setSearchTerm('');
    setSearchInput('');
    setStatusFilter('all');
    setDateRangeFilter({ start: null, end: null });
    setSelected([]);
  };

  const handleRefresh = () => {
    if (selectedEmployee) {
      fetchEmployeeLeaves();
      showNotification('Data refreshed', 'success');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSearchInput('');
    setStatusFilter('all');
    setDateRangeFilter({ start: null, end: null });
    setSelected([]);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(paginatedLeaves.map(leave => leave._id));
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

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    showNotification(`Bulk delete for ${selected.length} items - API implementation required`, 'warning');
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

  const handleEmployeeChange = (event) => {
    const employeeId = event.target.value;
    setSelectedEmployee(employeeId);
    setPage(0);
    handleClearFilters();
    
    if (employeeId) {
      localStorage.setItem('defaultSelectedEmployee', employeeId);
    } else {
      localStorage.removeItem('defaultSelectedEmployee');
    }
  };

  // Action menu handlers
  const handleActionMenuOpen = (event, leave) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedLeaveForAction(leave);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedLeaveForAction(null);
  };

  const openViewLeaveModal = (leave) => {
    setSelectedLeave(leave);
    setOpenViewLeave(true);
    handleActionMenuClose();
  };

  const openEditLeaveModal = (leave) => {
    setSelectedLeave(leave);
    setOpenEditLeave(true);
    handleActionMenuClose();
  };

  const openDeleteLeaveDialog = (leave) => {
    setSelectedLeave(leave);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const handleApplyLeaveClose = (success = false) => {
    setOpenApplyLeave(false);
    if (success && selectedEmployee) {
      fetchEmployeeLeaves();
      showNotification('Leave applied successfully');
    }
  };

  const handleEditLeaveClose = (success = false) => {
    setOpenEditLeave(false);
    setSelectedLeave(null);
    if (success && selectedEmployee) {
      fetchEmployeeLeaves();
      showNotification('Leave updated successfully');
    }
  };

  const handleDeleteLeaveClose = (deleted = false) => {
    setOpenDeleteDialog(false);
    setSelectedLeave(null);
    if (deleted && selectedEmployee) {
      fetchEmployeeLeaves();
      showNotification('Leave deleted successfully');
    }
  };

  const handleViewLeaveClose = () => {
    setOpenViewLeave(false);
    setSelectedLeave(null);
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const getEmployeeName = (employee) => {
    if (!employee) return '';
    return `${employee.FirstName || ''} ${employee.LastName || ''}`.trim();
  };

  const getEmployeeInitials = (employee) => {
    if (!employee) return 'U';
    const first = employee.FirstName ? employee.FirstName.charAt(0) : '';
    const last = employee.LastName ? employee.LastName.charAt(0) : '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  const paginatedLeaves = filteredLeaves.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isFilterActive = searchTerm || statusFilter !== 'all' || dateRangeFilter.start || dateRangeFilter.end;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2.5 }}>
        {/* Page Header */}
        <Box sx={{ mb: 2.5 }}>
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              fontSize: '1.25rem',
              fontWeight: 700,
              color: COLORS.text.primary,
              mb: 0.5
            }}
          >
            Employee Leave Management
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
            View and manage leave applications for employees
          </Typography>
        </Box>

        {/* Employee Selection Card */}
        <Paper sx={{ 
          p: 1.5, 
          mb: 2.5, 
          borderRadius: 2,
          bgcolor: COLORS.background.white,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: '0.75rem' }}>Select Employee</InputLabel>
                <Select
                  value={selectedEmployee}
                  onChange={handleEmployeeChange}
                  label="Select Employee"
                  disabled={loadingEmployees}
                  sx={{
                    borderRadius: 1.5,
                    '& .MuiSelect-select': {
                      fontSize: '0.75rem',
                      py: 1,
                      px: 1.5
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem'
                    }
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: '0.75rem' }}>
                    <em>Select an employee</em>
                  </MenuItem>
                  {employees.map((emp) => (
                    <MenuItem key={emp._id} value={emp._id} sx={{ fontSize: '0.75rem' }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 28, height: 28, bgcolor: COLORS.primary, fontSize: '0.7rem' }}>
                          {getEmployeeInitials(emp)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                            {getEmployeeName(emp)}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {emp.EmployeeID}
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {employeeDetails && (
              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 40, height: 40, bgcolor: COLORS.primary, fontSize: '0.875rem' }}>
                    {getEmployeeInitials(employeeDetails)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {getEmployeeName(employeeDetails)}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      ID: {employeeDetails.EmployeeID} • {employeeDetails.DepartmentID?.DepartmentName || 'No Dept'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Paper>

        {selectedEmployee && (
          <>
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
                    placeholder="Search leaves by type or reason..."
                    size="small"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    sx={{ 
                      width: { xs: '100%', sm: 300 },
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
                          <IconButton size="small" onClick={() => setSearchInput('')} edge="end">
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

                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ fontSize: '0.75rem' }}>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      label="Status"
                      sx={{
                        borderRadius: 1.5,
                        height: 36,
                        '& .MuiSelect-select': {
                          fontSize: '0.75rem',
                          py: 1,
                          px: 1.5
                        }
                      }}
                    >
                      <MenuItem value="all" sx={{ fontSize: '0.75rem' }}>All Status</MenuItem>
                      <MenuItem value="Pending" sx={{ fontSize: '0.75rem' }}>Pending</MenuItem>
                      <MenuItem value="Approved" sx={{ fontSize: '0.75rem' }}>Approved</MenuItem>
                      <MenuItem value="Rejected" sx={{ fontSize: '0.75rem' }}>Rejected</MenuItem>
                    </Select>
                  </FormControl>

                  <DatePicker
                    label="From Date"
                    value={dateRangeFilter.start}
                    onChange={(date) => setDateRangeFilter({ ...dateRangeFilter, start: date })}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: {
                          width: 140,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            height: 36,
                            fontSize: '0.75rem'
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.75rem'
                          }
                        }
                      }
                    }}
                  />

                  <DatePicker
                    label="To Date"
                    value={dateRangeFilter.end}
                    onChange={(date) => setDateRangeFilter({ ...dateRangeFilter, end: date })}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: {
                          width: 140,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            height: 36,
                            fontSize: '0.75rem'
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.75rem'
                          }
                        }
                      }
                    }}
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
                  {selected.length > 0 && (
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
                  
                  <Button
                    variant="contained"
                    startIcon={<CelebrationIcon sx={{ fontSize: '1rem' }} />}
                    onClick={() => setOpenViewHoliday(true)}
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
                  >
                    Holidays
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                    onClick={() => setOpenApplyLeave(true)}
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
                  >
                    Apply Leave
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            {/* Leave Applications Table */}
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
                          indeterminate={selected.length > 0 && selected.length < paginatedLeaves.length}
                          checked={paginatedLeaves.length > 0 && selected.length === paginatedLeaves.length}
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
                          disabled={loading || paginatedLeaves.length === 0}
                        />
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                        color: COLORS.text.light
                      }}>
                        Leave Type
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                        color: COLORS.text.light
                      }}>
                        From Date
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                        color: COLORS.text.light
                      }}>
                        To Date
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                        color: COLORS.text.light
                      }}>
                        Days
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                        color: COLORS.text.light
                      }}>
                        Reason
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                        color: COLORS.text.light
                      }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                        color: COLORS.text.light
                      }}>
                        Applied On
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                        width: 60,
                        color: COLORS.text.light
                      }} align="center">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                          <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                            Loading leave applications...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : paginatedLeaves.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <EventIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
                            <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                              {isFilterActive ? 'No leave applications found' : 'No leave applications available'}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                              {isFilterActive ? 'Try adjusting your search or filters' : 'Apply for leave to get started'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedLeaves.map((leave, index) => {
                        const isSelected = selected.includes(leave._id);
                        const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                          selectedLeaveForAction?._id === leave._id;
                        const calculateDays = () => {
                          if (leave.StartDate && leave.EndDate) {
                            const from = new Date(leave.StartDate);
                            const to = new Date(leave.EndDate);
                            const diffTime = Math.abs(to - from);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                            return diffDays;
                          }
                          return leave.NumberOfDays || 0;
                        };

                        return (
                          <TableRow
                            key={leave._id}
                            hover
                            selected={isSelected}
                            sx={{ 
                              bgcolor: COLORS.background.white,
                              '&:hover': {
                                bgcolor: COLORS.background.hover
                              },
                              '&.Mui-selected': {
                                bgcolor: `${COLORS.primary}10`,
                                '&:hover': {
                                  bgcolor: `${COLORS.primary}20`
                                }
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
                                onChange={() => handleSelect(leave._id)}
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
                            <TableCell>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                                {leave.LeaveTypeID?.Name || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                                {formatDisplayDate(leave.StartDate)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                                {formatDisplayDate(leave.EndDate)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={`${calculateDays()} day(s)`}
                                size="small"
                                sx={{
                                  bgcolor: COLORS.primaryLight,
                                  color: COLORS.primaryDark,
                                  fontWeight: 500,
                                  fontSize: '0.65rem',
                                  height: 24,
                                  '& .MuiChip-label': {
                                    px: 1,
                                    fontSize: '0.65rem'
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title={leave.Reason || ''}>
                                <Typography 
                                  noWrap 
                                  sx={{ 
                                    maxWidth: 200, 
                                    fontSize: '0.75rem', 
                                    color: COLORS.text.primary 
                                  }}
                                >
                                  {leave.Reason || 'No reason provided'}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <StatusChip status={leave.Status} />
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                                {formatDateTime(leave.AppliedOn || leave.CreatedAt)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ width: 60 }}>
                              <ActionMenu 
                                leave={leave}
                                onView={openViewLeaveModal}
                                onEdit={openEditLeaveModal}
                                onDelete={openDeleteLeaveDialog}
                                anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                                onClose={handleActionMenuClose}
                                onOpen={(e) => handleActionMenuOpen(e, leave)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredLeaves.length}
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
                  '& .MuiTablePagination-select': {
                    fontSize: '0.7rem'
                  },
                  '& .MuiTablePagination-actions button': {
                    color: COLORS.primary,
                  }
                }}
              />
            </Paper>
          </>
        )}

        {!selectedEmployee && (
          <Paper sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
          }}>
            <PersonIcon sx={{ fontSize: 64, color: COLORS.text.tertiary, mb: 2 }} />
            <Typography variant="h6" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500, mb: 1 }}>
              No Employee Selected
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
              Please select an employee from the dropdown above to view their leave information
            </Typography>
          </Paper>
        )}

        {/* Modals */}
        {selectedEmployee && (
          <>
            <ApplyLeave 
              open={openApplyLeave} 
              handleClose={handleApplyLeaveClose} 
              onSuccess={handleApplyLeaveClose} 
              employeeId={selectedEmployee} 
              employeeDetails={employeeDetails} 
            />
            <EditLeave 
              open={openEditLeave} 
              onClose={handleEditLeaveClose} 
              leaveData={selectedLeave} 
              onUpdate={handleEditLeaveClose} 
            />
            <DeleteLeave 
              open={openDeleteDialog} 
              onClose={handleDeleteLeaveClose} 
              leaveData={selectedLeave} 
              onDelete={handleDeleteLeaveClose} 
            />
            <ViewLeave 
              open={openViewLeave} 
              onClose={handleViewLeaveClose} 
              leave={selectedLeave} 
            />
          </>
        )}

        <ViewHoliday open={openViewHoliday} onClose={() => setOpenViewHoliday(false)} />

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
              '& .MuiAlert-icon': {
                fontSize: '1.25rem'
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default EmployeeLeaveMaster;