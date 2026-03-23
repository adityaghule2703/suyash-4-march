// import React, { useState, useEffect } from "react";
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
//   Typography,
//   Snackbar,
//   TablePagination,
//   Stack,
//   Alert,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Chip,
//   Checkbox,
//   FormControl,
//   Select,
//   alpha,
// } from "@mui/material";

// import {
//   Search as SearchIcon,
//   Visibility as ViewIcon,
//   CheckCircle as ApproveIcon,
//   Feedback as FeedbackIcon,
//   MoreVert as MoreVertIcon,
//   Add as AddIcon,
// } from "@mui/icons-material";

// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// import AddTermination from "./AddTermination";
// import ViewTermination from "./ViewTermination";
// import ApproveTermination from "./ApproveTermination";
// import SubmitTermination from "./SubmitTermination";
// import DeleteTermination from "./DeleteTermination";
// import { Delete as DeleteIcon } from "@mui/icons-material";

// /* ==== STYLE ==== */
// const HEADER_GRADIENT =
//   "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
// const STRIPE_ODD = "#FFFFFF";
// const STRIPE_EVEN = "#f8fafc";
// const HOVER_COLOR = "#f1f5f9";
// const PRIMARY_BLUE = "#00B4D8";
// const TEXT_MAIN = "#0f172a";

// const TerminationMaster = () => {
//   const [terminations, setTerminations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const [statusFilter, setStatusFilter] = useState("");
//   const [typeFilter, setTypeFilter] = useState("termination");
//   const [search, setSearch] = useState("");

//   const [selected, setSelected] = useState([]);
//   const [selectedTermination, setSelectedTermination] = useState(null);

//   const [openAdd, setOpenAdd] = useState(false);
//   const [openView, setOpenView] = useState(false);
//   const [openApprove, setOpenApprove] = useState(false);
//   const [openFeedback, setOpenFeedback] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);

//   const [anchorEl, setAnchorEl] = useState(null);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     fetchTerminations();
//   }, [page, rowsPerPage, statusFilter, typeFilter]);

//   const fetchTerminations = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const response = await axios.get(`${BASE_URL}/api/terminations`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {
//           page: page + 1,
//           limit: rowsPerPage,
//           status: statusFilter || undefined,
//           type: typeFilter || undefined,
//         },
//       });

//       if (response.data.success) {
//         setTerminations(response.data.data);
//         setTotalRecords(response.data.count);
//       }
//     } catch {
//       showNotification("Failed to load terminations", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   /* ================= CHECKBOX ================= */
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelected(terminations.map((t) => t._id));
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

//   /* ================= MENU ================= */
//   const handleMenuOpen = (event, termination) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedTermination(termination);
//   };

//   const handleMenuClose = () => setAnchorEl(null);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved":
//         return "success";
//       case "rejected":
//         return "error";
//       default:
//         return "warning";
//     }
//   };

//   const filteredData = terminations.filter((t) =>
//     `${t.employeeId?.FirstName} ${t.employeeId?.LastName}`
//       .toLowerCase()
//       .includes(search.toLowerCase()),
//   );

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* ===== HEADER ===== */}
//       <Typography
//         variant="h5"
//         fontWeight={600}
//         sx={{
//           background: HEADER_GRADIENT,
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           mb: 2,
//         }}
//       >
//         Termination Master
//       </Typography>

//       {/* ===== ACTION BAR ===== */}
//       <Paper sx={{ p: 2, mb: 3 }}>
//         <Stack direction="row" justifyContent="space-between">
//           <Stack direction="row" spacing={2}>
//             <TextField
//               size="small"
//               placeholder="Search employee..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               sx={{ width: 250 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <FormControl size="small">
//               <Select
//                 displayEmpty
//                 value={statusFilter}
//                 onChange={(e) => {
//                   setStatusFilter(e.target.value);
//                   setPage(0);
//                 }}
//               >
//                 <MenuItem value="">All Status</MenuItem>
//                 <MenuItem value="pending">Pending</MenuItem>
//                 <MenuItem value="approved">Approved</MenuItem>
//                 <MenuItem value="rejected">Rejected</MenuItem>
//               </Select>
//             </FormControl>
//           </Stack>

//           <Stack direction="row" spacing={2}>
//             {selected.length > 0 && (
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<DeleteIcon />}
//                 onClick={() => {
//                   if (selected.length === 1) {
//                     const termination = terminations.find(
//                       (t) => t._id === selected[0],
//                     );
//                     setSelectedTermination(termination);
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
//                 background: HEADER_GRADIENT,
//                 "&:hover": { opacity: 0.9 },
//               }}
//             >
//               Add Termination
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>

//       {/* ===== TABLE ===== */}
//       <Paper>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow
//                 sx={{
//                   background: HEADER_GRADIENT,
//                   "& .MuiTableCell-root": {
//                     color: "#fff",
//                     fontWeight: 600,
//                   },
//                 }}
//               >
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     sx={{
//                       color: "#fff",
//                       "&.Mui-checked": { color: "#fff" },
//                     }}
//                     checked={
//                       terminations.length > 0 &&
//                       selected.length === terminations.length
//                     }
//                     indeterminate={
//                       selected.length > 0 &&
//                       selected.length < terminations.length
//                     }
//                     onChange={handleSelectAll}
//                   />
//                 </TableCell>
//                 <TableCell>Termination ID</TableCell>
//                 <TableCell>Employee</TableCell>
//                 <TableCell>Type</TableCell>
//                 <TableCell>Last Working Day</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : filteredData.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     No records found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredData.map((t, index) => (
//                   <TableRow
//                     key={t._id}
//                     hover
//                     sx={{
//                       bgcolor: index % 2 === 0 ? STRIPE_ODD : STRIPE_EVEN,
//                       "&:hover": { bgcolor: HOVER_COLOR },
//                     }}
//                   >
//                     <TableCell padding="checkbox">
//                       <Checkbox
//                         checked={isSelected(t._id)}
//                         onChange={() => handleSelectOne(t._id)}
//                       />
//                     </TableCell>

//                     <TableCell>{t.terminationId}</TableCell>
//                     <TableCell>
//                       {t.employeeId?.FirstName} {t.employeeId?.LastName}
//                     </TableCell>
//                     <TableCell>{t.terminationType}</TableCell>
//                     <TableCell>
//                       {new Date(t.lastWorkingDay).toLocaleDateString("en-IN")}
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={t.status}
//                         color={getStatusColor(t.status)}
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <IconButton onClick={(e) => handleMenuOpen(e, t)}>
//                         <MoreVertIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           component="div"
//           count={totalRecords}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value,10));
//             setPage(0);
//           }}
//         />
//         {/* ===== ACTION MENU ===== */}
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem
//             onClick={() => {
//               setOpenView(true);
//               handleMenuClose();
//             }}
//           >
//             <ListItemIcon>
//               <ViewIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>View</ListItemText>
//           </MenuItem>

//           {selectedTermination?.status === "pending" && (
//             <MenuItem
//               onClick={() => {
//                 setOpenApprove(true);
//                 handleMenuClose();
//               }}
//             >
//               <ListItemIcon>
//                 <ApproveIcon fontSize="small" />
//               </ListItemIcon>
//               <ListItemText>Approve</ListItemText>
//             </MenuItem>
//           )}

//           {selectedTermination?.status === "approved" &&
//             !selectedTermination.feedback?.submitted && (
//               <MenuItem
//                 onClick={() => {
//                   setOpenFeedback(true);
//                   handleMenuClose();
//                 }}
//               >
//                 <ListItemIcon>
//                   <FeedbackIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>Submit Feedback</ListItemText>
//               </MenuItem>
//             )}
//           <MenuItem
//             onClick={() => {
//               setOpenDelete(true);
//               handleMenuClose();
//             }}
//           >
//             <ListItemIcon>
//               <DeleteIcon fontSize="small" />
//             </ListItemIcon>
//             Delete
//           </MenuItem>
//         </Menu>
//       </Paper>

//       {/* ===== MODALS ===== */}
//       <AddTermination
//         open={openAdd}
//         onClose={() => setOpenAdd(false)}
//         onAdd={() => {
//           fetchTerminations();
//           showNotification("Termination added", "success");
//         }}
//       />

//       {selectedTermination && (
//         <>
//           <ViewTermination
//             open={openView}
//             onClose={() => setOpenView(false)}
//             termination={selectedTermination}
//           />

//           <ApproveTermination
//             open={openApprove}
//             onClose={() => setOpenApprove(false)}
//             termination={selectedTermination}
//             onApprove={(updated) => {
//               setTerminations((prev) =>
//                 prev.map((t) => (t._id === updated._id ? updated : t)),
//               );
//               showNotification("Termination approved", "success");
//             }}
//           />

//           <SubmitTermination
//             open={openFeedback}
//             onClose={() => setOpenFeedback(false)}
//             termination={selectedTermination}
//             onSubmitFeedback={(updated) => {
//               setTerminations((prev) =>
//                 prev.map((t) => (t._id === updated._id ? updated : t)),
//               );
//               showNotification("Feedback submitted", "success");
//             }}
//           />
//           <DeleteTermination
//             open={openDelete}
//             onClose={() => setOpenDelete(false)}
//             termination={selectedTermination}
//             onDelete={(deletedId) => {
//               setTerminations((prev) =>
//                 prev.filter((t) => t.terminationId !== deletedId),
//               );

//               setSelected([]);
//               setSelectedTermination(null);
//               setOpenDelete(false);

//               showNotification("Termination deleted successfully", "success");
//             }}
//           />
//         </>
//       )}

//       {/* ===== SNACKBAR ===== */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "right",
//         }}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default TerminationMaster;
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
  Select
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Feedback as FeedbackIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Import modal components
import AddTermination from './AddTermination';
import ViewTermination from './ViewTermination';
import ApproveTermination from './ApproveTermination';
import SubmitTermination from './SubmitTermination';
import DeleteTermination from './DeleteTermination';

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

// Action Menu Component
const ActionMenu = ({ item, onView, onApprove, onFeedback, onDelete, anchorEl, onClose, onOpen }) => {
  const isPending = item?.status === 'pending';
  const isApproved = item?.status === 'approved';
  const hasFeedback = item?.feedback?.submitted;

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
        
        {isPending && (
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
                Approve
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {isApproved && !hasFeedback && (
          <MenuItem 
            onClick={() => {
              onFeedback(item);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <FeedbackIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Submit Feedback
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

const TerminationMaster = () => {
  // State for data
  const [terminations, setTerminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedTerminationForAction, setSelectedTerminationForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Selected termination
  const [selectedTermination, setSelectedTermination] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch terminations from API with pagination
  // Fetch terminations from API with pagination
const fetchTerminations = useCallback(async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    const params = new URLSearchParams({
      page: page + 1,
      limit: rowsPerPage
    });
    
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    if (statusFilter) {
      params.append('status', statusFilter);
    }
    
    if (typeFilter) {
      params.append('type', typeFilter);
    }
    
    const response = await axios.get(`${BASE_URL}/api/terminations?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.success) {
      // Check different possible response structures
      let terminationsData = [];
      let total = 0;
      
      if (response.data.data && Array.isArray(response.data.data)) {
        terminationsData = response.data.data;
        total = response.data.count || response.data.total || terminationsData.length;
      } else if (response.data.terminations && Array.isArray(response.data.terminations)) {
        terminationsData = response.data.terminations;
        total = response.data.totalCount || response.data.count || terminationsData.length;
      } else if (Array.isArray(response.data)) {
        terminationsData = response.data;
        total = terminationsData.length;
      }
      
      setTerminations(terminationsData || []);
      setTotalItems(total);
      setTotalPages(Math.ceil(total / rowsPerPage));
    } else {
      showNotification(response.data.message || 'Failed to load terminations', 'error');
    }
  } catch (err) {
    console.error('Error fetching terminations:', err);
    showNotification(err.response?.data?.message || 'Failed to load terminations. Please try again.', 'error');
  } finally {
    setLoading(false);
  }
}, [page, rowsPerPage, searchTerm, statusFilter, typeFilter]);

  // Fetch terminations when dependencies change
  useEffect(() => {
    fetchTerminations();
  }, [fetchTerminations]);

  // Handle refresh
  const handleRefresh = () => {
    fetchTerminations();
    showNotification('Data refreshed', 'success');
  };
  
  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(terminations.map(term => term._id));
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
    showNotification('Bulk delete requires API implementation', 'warning');
  };
  
  // Handle add termination
  const handleAddTermination = () => {
    fetchTerminations();
    showNotification('Termination added successfully!', 'success');
  };
  
  // Handle approve termination
  const handleApproveTermination = () => {
    fetchTerminations();
    showNotification('Termination approved successfully!', 'success');
  };
  
  // Handle feedback submission
  const handleFeedbackSubmission = () => {
    fetchTerminations();
    showNotification('Feedback submitted successfully!', 'success');
  };
  
  // Handle delete termination
  const handleDeleteTermination = () => {
    fetchTerminations();
    setSelected([]);
    showNotification('Termination deleted successfully!', 'success');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, termination) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedTerminationForAction(termination);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedTerminationForAction(null);
  };

  // Open view modal
  const openViewTerminationModal = (termination) => {
    setSelectedTermination(termination);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open approve modal
  const openApproveTerminationModal = (termination) => {
    setSelectedTermination(termination);
    setOpenApproveModal(true);
    handleActionMenuClose();
  };
  
  // Open feedback modal
  const openFeedbackTerminationModal = (termination) => {
    setSelectedTermination(termination);
    setOpenFeedbackModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteTerminationDialog = (termination) => {
    setSelectedTermination(termination);
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
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          bg: COLORS.status.success,
          text: COLORS.primaryDark,
          border: '#86efac'
        };
      case 'rejected':
        return {
          bg: COLORS.status.error,
          text: '#991b1b',
          border: '#fecaca'
        };
      default:
        return {
          bg: COLORS.status.warning,
          text: '#854d0e',
          border: '#fed7aa'
        };
    }
  };
  
  // Get status text
  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
  };
  
  // Get avatar initials
  const getAvatarInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'EM';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };
  
  // Get avatar color
  const getAvatarColor = (firstName) => {
    if (!firstName) return COLORS.primary;
    
    const colors = [
      COLORS.primary,
      COLORS.primaryDark,
      '#074346',
      '#0D696C',
      '#128C7E'
    ];
    
    const charCode = firstName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Status filter options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Type filter options
  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'termination', label: 'Termination' },
    { value: 'resignation', label: 'Resignation' },
    { value: 'retirement', label: 'Retirement' }
  ];

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
          Termination Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage employee terminations, approvals, and exit feedback
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
              placeholder="Search by employee name or ID..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 260 },
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
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                displayEmpty
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                sx={{
                  height: 36,
                  fontSize: '0.75rem',
                  borderRadius: 1.5,
                  bgcolor: COLORS.background.light,
                  '& .MuiSelect-select': {
                    py: '6px 12px',
                    fontSize: '0.75rem'
                  }
                }}
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select
                displayEmpty
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(0);
                }}
                sx={{
                  height: 36,
                  fontSize: '0.75rem',
                  borderRadius: 1.5,
                  bgcolor: COLORS.background.light,
                  '& .MuiSelect-select': {
                    py: '6px 12px',
                    fontSize: '0.75rem'
                  }
                }}
              >
                {typeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              Add Termination
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Terminations Table */}
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
                    indeterminate={selected.length > 0 && selected.length < terminations.length}
                    checked={terminations.length > 0 && selected.length === terminations.length}
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
                    disabled={loading || terminations.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Termination ID
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
                  Type
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Last Working Day
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
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading terminations...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : terminations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No terminations found' : 'No terminations available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first termination to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                terminations.map((termination) => {
                  const isSelected = selected.includes(termination._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedTerminationForAction?._id === termination._id;
                  const employee = termination.employeeId || {};
                  const avatarColor = getAvatarColor(employee.FirstName);
                  const statusStyles = getStatusStyles(termination.status);

                  return (
                    <TableRow
                      key={termination._id}
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
                          onChange={() => handleSelect(termination._id)}
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
                            <WorkIcon sx={{ fontSize: '0.9rem' }} />
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {termination.terminationId || 'N/A'}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              ID: {termination._id?.slice(-6)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 28, 
                              height: 28, 
                              bgcolor: avatarColor,
                              fontSize: '0.65rem',
                              fontWeight: 500
                            }}
                          >
                            {getAvatarInitials(employee.FirstName, employee.LastName)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                              {employee.FirstName} {employee.LastName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {employee.Email || 'No email'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<WorkIcon sx={{ fontSize: '0.7rem' }} />}
                          label={termination.terminationType || 'Termination'}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            bgcolor: COLORS.background.light,
                            color: COLORS.text.secondary,
                            '& .MuiChip-icon': {
                              fontSize: '0.7rem',
                              ml: 0.5
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <CalendarIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {formatDate(termination.lastWorkingDay)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(termination.status)}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
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
                          item={termination}
                          onView={openViewTerminationModal}
                          onApprove={openApproveTerminationModal}
                          onFeedback={openFeedbackTerminationModal}
                          onDelete={openDeleteTerminationDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, termination)}
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
      <AddTermination 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddTermination}
      />

      {selectedTermination && (
        <>
          <ViewTermination 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedTermination(null);
            }}
            termination={selectedTermination}
          />

          <ApproveTermination 
            open={openApproveModal}
            onClose={() => {
              setOpenApproveModal(false);
              setSelectedTermination(null);
            }}
            termination={selectedTermination}
            onApprove={handleApproveTermination}
          />

          <SubmitTermination 
            open={openFeedbackModal}
            onClose={() => {
              setOpenFeedbackModal(false);
              setSelectedTermination(null);
            }}
            termination={selectedTermination}
            onSubmitFeedback={handleFeedbackSubmission}
          />

          <DeleteTermination 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedTermination(null);
            }}
            termination={selectedTermination}
            onDelete={handleDeleteTermination}
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

export default TerminationMaster;