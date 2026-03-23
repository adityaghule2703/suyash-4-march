// import React, { useEffect, useState, useMemo } from "react";
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
//   Typography,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Chip,
//   Snackbar,
//   Alert,
//   TextField,
//   TablePagination,
//   Grid,
//   Checkbox,
//   Stack,
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Visibility as ViewIcon,
//   Delete as DeleteIcon,
//   MoreVert as MoreVertIcon,
//   Search as SearchIcon,
//   CheckCircle as ApproveIcon,
// } from "@mui/icons-material";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// import AddRegularization from "./AddRegularization";
// import ViewRegularization from "./ViewRegularization";
// import ApproveRegularization from "./ApproveRegularization";
// import DeleteRegularization from "./DeleteRegularization";

// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";

// const RegularizationMaster = () => {
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const [selected, setSelected] = useState([]);

//   const [openAdd, setOpenAdd] = useState(false);
//   const [openView, setOpenView] = useState(false);
//   const [openApprove, setOpenApprove] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);

//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   useEffect(() => {
//     fetchRecords();
//   }, []);

//   const fetchRecords = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(`${BASE_URL}/api/regularization`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         setRecords(response.data.data || []);
//       }
//     } catch {
//       showNotification("Failed to load requests", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   /* ================= FILTER ================= */
//   const filteredRecords = useMemo(() => {
//     return records.filter((rec) => {
//       const employeeName = rec.EmployeeID
//         ? `${rec.EmployeeID.FirstName} ${rec.EmployeeID.LastName}`
//         : "";

//       const matchesSearch =
//         rec.RequestType?.toLowerCase().includes(search.toLowerCase()) ||
//         employeeName.toLowerCase().includes(search.toLowerCase());

//       const matchesStatus = statusFilter ? rec.Status === statusFilter : true;

//       return matchesSearch && matchesStatus;
//     });
//   }, [records, search, statusFilter]);

//   /* ================= CHECKBOX ================= */
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(filteredRecords.map((r) => r._id));
//     } else {
//       setSelected([]);
//     }
//   };

//   const handleSelectOne = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );
//   };

//   const isSelected = (id) => selected.includes(id);

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography
//         variant="h5"
//         fontWeight={600}
//         sx={{
//           background: HEADER_GRADIENT,
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           mb: 3,
//         }}
//       >
//         Regularization Requests
//       </Typography>

//       {/* FILTER BAR */}
//       <Paper sx={{ p: 2, mb: 3 }}>
//         <Stack direction="row" justifyContent="space-between">
//           <Stack direction="row" spacing={2}>
//             <TextField
//               size="small"
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               sx={{ width: 300 }}
//               InputProps={{
//                 startAdornment: <SearchIcon sx={{ mr: 1 }} />,
//               }}
//             />

//             <TextField
//               select
//               size="small"
//               label="Status"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               sx={{ width: 150 }}
//             >
//               <MenuItem value="">All</MenuItem>
//               <MenuItem value="Pending">Pending</MenuItem>
//               <MenuItem value="Approved">Approved</MenuItem>
//               <MenuItem value="Rejected">Rejected</MenuItem>
//             </TextField>
//           </Stack>

//           <Stack direction="row" spacing={2}>
//             {selected.length > 0 && (
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<DeleteIcon />}
//                 onClick={() => {
//                   if (selected.length === 1) {
//                     const record = records.find((r) => r._id === selected[0]);
//                     setSelectedRecord(record);
//                     setOpenDelete(true);
//                   }
//                 }}
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}

//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => setOpenAdd(true)}
//               sx={{
//                 background: "linear-gradient(135deg, #164e63, #00B4D8)",
//                 px: 4,
//               }}
//             >
//               Add Request
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* TABLE */}
//       <Paper>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ background: HEADER_GRADIENT }}>
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     sx={{ color: "#fff" }}
//                     checked={
//                       filteredRecords.length > 0 &&
//                       selected.length === filteredRecords.length
//                     }
//                     indeterminate={
//                       selected.length > 0 &&
//                       selected.length < filteredRecords.length
//                     }
//                     onChange={handleSelectAll}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff" }}>Employee</TableCell>
//                 <TableCell sx={{ color: "#fff" }}>Date</TableCell>
//                 <TableCell sx={{ color: "#fff" }}>Request Type</TableCell>
//                 <TableCell sx={{ color: "#fff" }}>Status</TableCell>
//                 <TableCell sx={{ color: "#fff" }} align="center">
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : filteredRecords.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center">
//                     No requests found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredRecords
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((record) => (
//                     <TableRow key={record._id} hover>
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={isSelected(record._id)}
//                           onChange={() => handleSelectOne(record._id)}
//                         />
//                       </TableCell>

//                       <TableCell>
//                         {record.EmployeeID?.FirstName
//                           ? `${record.EmployeeID.FirstName} ${record.EmployeeID.LastName}`
//                           : "—"}
//                       </TableCell>

//                       <TableCell>
//                         {new Date(record.Date).toLocaleDateString()}
//                       </TableCell>

//                       <TableCell>{record.RequestType}</TableCell>

//                       <TableCell>
//                         <Chip
//                           label={record.Status}
//                           color={
//                             record.Status === "Approved"
//                               ? "success"
//                               : record.Status === "Rejected"
//                                 ? "error"
//                                 : "warning"
//                           }
//                           size="small"
//                         />
//                       </TableCell>

//                       <TableCell align="center">
//                         <IconButton
//                           onClick={(e) => {
//                             setAnchorEl(e.currentTarget);
//                             setSelectedRecord(record);
//                           }}
//                         >
//                           <MoreVertIcon />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           component="div"
//           count={filteredRecords.length}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//         />
//       </Paper>

//       {/* ACTION MENU */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={() => setAnchorEl(null)}
//       >
//         <MenuItem
//           onClick={() => {
//             setOpenView(true);
//             setAnchorEl(null);
//           }}
//         >
//           <ListItemIcon>
//             <ViewIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>View</ListItemText>
//         </MenuItem>

//         {selectedRecord?.Status === "Pending" && (
//           <MenuItem
//             onClick={() => {
//               setOpenApprove(true);
//               setAnchorEl(null);
//             }}
//           >
//             <ListItemIcon>
//               <ApproveIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>Approve / Reject</ListItemText>
//           </MenuItem>
//         )}

//         <MenuItem
//           onClick={() => {
//             setOpenDelete(true);
//             setAnchorEl(null);
//           }}
//         >
//           <ListItemIcon>
//             <DeleteIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Delete</ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* MODALS */}
//       <AddRegularization
//         open={openAdd}
//         onClose={() => setOpenAdd(false)}
//         onAdd={(newRecord) => {
//           fetchRecords(); // auto refresh data
//           showNotification("Request Submitted", "success");
//         }}
//       />

//       {selectedRecord && (
//         <>
//           <ViewRegularization
//             open={openView}
//             onClose={() => setOpenView(false)}
//             record={selectedRecord}
//           />

//           <ApproveRegularization
//             open={openApprove}
//             onClose={() => setOpenApprove(false)}
//             record={selectedRecord}
//             onUpdate={(updatedRecord) => {
//               setRecords((prev) =>
//                 prev.map((r) =>
//                   r._id === updatedRecord._id ? updatedRecord : r,
//                 ),
//               );
//               showNotification(
//                 updatedRecord.Status === "Approved"
//                   ? "Request Approved"
//                   : "Request Rejected",
//                 "success",
//               );
//             }}
//           />

//           <DeleteRegularization
//             open={openDelete}
//             onClose={() => setOpenDelete(false)}
//             record={selectedRecord}
//             onDelete={(id) => {
//               setRecords((prev) => prev.filter((r) => r._id !== id));
//               setSelected([]);
//               showNotification("Request Deleted", "success");
//             }}
//           />
//         </>
//       )}

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default RegularizationMaster;

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
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Import modal components
import AddRegularization from './AddRegularization';
import ViewRegularization from './ViewRegularization';
import ApproveRegularization from './ApproveRegularization';
import DeleteRegularization from './DeleteRegularization';

// Color constants - Single color #063C3F throughout
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
    pending: '#FEF3C7',
    approved: '#9FE2BF',
    rejected: '#FEE2E2'
  }
};

// Action Menu Component with proper approve functionality
const ActionMenu = ({ item, onView, onApprove, onDelete, anchorEl, onClose, onOpen }) => {
  // Case-insensitive status check for Pending
  const canApprove = item?.Status?.toLowerCase() === 'pending';
  
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
            onView(item);
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
        
        {/* Approve button - Only show for Pending requests */}
        {canApprove && (
          <MenuItem 
            onClick={() => {
              onApprove(item);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <ApproveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Approve / Reject
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        <MenuItem 
          onClick={() => {
            onDelete(item);
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
      </Menu>
    </>
  );
};

const RegularizationMaster = () => {
  // State for data
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRecordForAction, setSelectedRecordForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Selected record
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch records from API
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      
      const queryString = params.toString();
      const url = `${BASE_URL}/api/regularization${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const allRecords = response.data.data || [];
        setRecords(allRecords);
        setTotalItems(allRecords.length);
      } else {
        showNotification('Failed to load requests', 'error');
      }
    } catch (err) {
      console.error('Error fetching records:', err);
      showNotification('Failed to load requests. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // Fetch records when dependencies change
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Handle refresh
  const handleRefresh = () => {
    fetchRecords();
    showNotification('Data refreshed', 'success');
  };
  
  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const currentPageRecords = records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
      setSelected(currentPageRecords.map(record => record._id));
    } else {
      setSelected([]);
    }
  };
  
  // Handle single selection
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
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setSelected([]);
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selected.length === 1) {
      const record = records.find(r => r._id === selected[0]);
      setSelectedRecord(record);
      setOpenDeleteDialog(true);
    } else {
      showNotification('Please select a single record to delete', 'warning');
    }
  };
  
  // Handle add record
  const handleAddRecord = () => {
    fetchRecords();
    showNotification('Request submitted successfully!', 'success');
  };
  
  // Handle approve/reject record
  const handleApproveRecord = (updatedRecord) => {
    fetchRecords();
    setSelected([]);
    showNotification(
      updatedRecord?.Status === 'Approved' 
        ? 'Request approved successfully!' 
        : 'Request rejected successfully!',
      'success'
    );
  };
  
  // Handle delete record
  const handleDeleteRecord = () => {
    fetchRecords();
    setSelected([]);
    showNotification('Request deleted successfully!', 'success');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, record) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRecordForAction(record);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRecordForAction(null);
  };

  // Open view modal
  const openViewModalHandler = (record) => {
    setSelectedRecord(record);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open approve modal
  const openApproveModalHandler = (record) => {
    setSelectedRecord(record);
    setOpenApproveModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteDialogHandler = (record) => {
    setSelectedRecord(record);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };
  
  // Show notification
  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status styles
  const getStatusStyles = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'approved':
        return {
          bg: COLORS.chips.approved,
          text: COLORS.primaryDark,
          border: '#86efac'
        };
      case 'rejected':
        return {
          bg: COLORS.chips.rejected,
          text: '#991b1b',
          border: '#fecaca'
        };
      default:
        return {
          bg: COLORS.chips.pending,
          text: '#92400e',
          border: '#fed7aa'
        };
    }
  };
  
  // Get status text
  const getStatusText = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };
  
  // Get avatar initials
  const getAvatarInitials = (employee) => {
    if (!employee) return 'RE';
    const firstName = employee.FirstName || '';
    const lastName = employee.LastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  // Get avatar color
  const getAvatarColor = (employee) => {
    if (!employee) return COLORS.primary;
    
    const colors = [
      COLORS.primary,
      COLORS.primaryDark,
      '#074346',
      '#0D696C',
      '#128C7E'
    ];
    
    const nameString = `${employee.FirstName || ''}${employee.LastName || ''}`;
    const charCode = nameString.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  // Get request type badge color
  const getRequestTypeColor = (requestType) => {
    switch(requestType?.toLowerCase()) {
      case 'late':
        return 'warning';
      case 'early':
        return 'info';
      case 'absent':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get current page records
  const currentPageRecords = records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
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
          Regularization Requests
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage employee attendance regularization requests
        </Typography>
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
          {/* Search and Filters */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by employee name or request type..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 280 },
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
            {/* <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              sx={{ 
                width: 130,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  height: 36
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.7rem'
                }
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      borderRadius: 1.5,
                      '& .MuiMenuItem-root': {
                        fontSize: '0.75rem'
                      }
                    }
                  }
                }
              }}
              disabled={loading}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
           */}
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
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
              Add Request
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Records Table */}
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
                    indeterminate={selected.length > 0 && selected.length < currentPageRecords.length}
                    checked={currentPageRecords.length > 0 && selected.length === currentPageRecords.length}
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
                    disabled={loading || currentPageRecords.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Employee
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Request Date
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Request Type
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
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading requests...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : currentPageRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm || statusFilter ? 'No requests found' : 'No requests available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm || statusFilter ? 'Try adjusting your search or filter terms' : 'Add your first request to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                currentPageRecords.map((record) => {
                  const isSelected = selected.includes(record._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedRecordForAction?._id === record._id;
                  const employee = record.EmployeeID;
                  const employeeName = employee 
                    ? `${employee.FirstName || ''} ${employee.LastName || ''}`.trim()
                    : '—';
                  const avatarColor = getAvatarColor(employee);
                  const statusStyles = getStatusStyles(record.Status);

                  return (
                    <TableRow
                      key={record._id}
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
                          onChange={() => handleSelect(record._id)}
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
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: avatarColor,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            {getAvatarInitials(employee)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {employeeName}
                            </Typography>
                            {employee?.EmployeeCode && (
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                ID: {employee.EmployeeCode}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <EventNoteIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {formatDate(record.Date)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={record.RequestType || '—'}
                          size="small"
                          color={getRequestTypeColor(record.RequestType)}
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(record.Status)}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 20,
                            bgcolor: statusStyles.bg,
                            color: statusStyles.text,
                            border: `1px solid ${statusStyles.border}`,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={record}
                          onView={openViewModalHandler}
                          onApprove={openApproveModalHandler}
                          onDelete={openDeleteDialogHandler}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, record)}
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

      {/* Modal Components */}
      <AddRegularization 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddRecord}
      />

      {selectedRecord && (
        <>
          <ViewRegularization 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedRecord(null);
            }}
            record={selectedRecord}
          />

          <ApproveRegularization 
            open={openApproveModal}
            onClose={() => {
              setOpenApproveModal(false);
              setSelectedRecord(null);
            }}
            record={selectedRecord}
            onUpdate={handleApproveRecord}
          />

          <DeleteRegularization 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedRecord(null);
            }}
            record={selectedRecord}
            onDelete={handleDeleteRecord}
          />
        </>
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
            '& .MuiAlert-icon': {
              fontSize: '1.25rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegularizationMaster;