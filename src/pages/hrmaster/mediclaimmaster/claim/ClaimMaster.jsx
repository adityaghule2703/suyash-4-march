// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   TablePagination,
//   TextField,
//   InputAdornment,
//   Stack,
//   Chip,
//   IconButton,
//   CircularProgress,
//   Menu,
//   MenuItem,
//   Button,
//   Checkbox,
//   Snackbar,   // ✅ ADD THIS
//   Alert 
// } from "@mui/material";

// import {
//   Search as SearchIcon,
//   MoreVert as MoreVertIcon,
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
// } from "@mui/icons-material";

// import axios from "axios";
// import BASE_URL from "../../../../config/Config";
// import AddClaim from "./AddClaim";
// import ViewClaim from "./ViewClaim";
// import EditClaim from "./EditClaim";

// const HEADER_GRADIENT = "linear-gradient(90deg, #0f4c5c 0%, #00B4D8 100%)";

// const ClaimMaster = () => {
//   const [claims, setClaims] = useState([]);
//   const [filteredClaims, setFilteredClaims] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const [selectedRows, setSelectedRows] = useState([]);

//   const [selectedClaim, setSelectedClaim] = useState(null);
//   const [openView, setOpenView] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openAdd, setOpenAdd] = useState(false);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const [anchorEl, setAnchorEl] = useState(null);
//   const openMenu = Boolean(anchorEl);

//   useEffect(() => {
//     fetchClaims();
//   }, []);

//   const fetchClaims = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.get(`${BASE_URL}/api/mediclaim/claims`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         setClaims(res.data.data);
//         setFilteredClaims(res.data.data);
//       }
//     } catch (err) {
//       console.error("Fetch failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearch(value);

//     const filtered = claims.filter(
//       (claim) =>
//         claim.claimId?.toLowerCase().includes(value) ||
//         claim.patientDetails?.name?.toLowerCase().includes(value) ||
//         claim.hospitalName?.toLowerCase().includes(value),
//     );

//     setFilteredClaims(filtered);
//     setPage(0);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved":
//         return "success";
//       case "rejected":
//         return "error";
//       case "under_review":
//         return "warning";
//       default:
//         return "default";
//     }
//   };

//   const showNotification = (message, severity = "success") => {
//     setSnackbar({
//       open: true,
//       message,
//       severity,
//     });
//   };

//   /* ---------- CHECKBOX ---------- */

//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       const newSelected = paginatedClaims.map((c) => c._id);
//       setSelectedRows(newSelected);
//     } else {
//       setSelectedRows([]);
//     }
//   };

//   const handleSelectRow = (id) => {
//     if (selectedRows.includes(id)) {
//       setSelectedRows(selectedRows.filter((i) => i !== id));
//     } else {
//       setSelectedRows([...selectedRows, id]);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (!selectedRows.length) return;

//     try {
//       const token = localStorage.getItem("token");

//       await axios.delete(`${BASE_URL}/api/mediclaim/claims/bulk-delete`, {
//         data: { ids: selectedRows },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setSelectedRows([]);
//       fetchClaims();

//       showNotification("Claims deleted successfully", "success");
//     } catch (error) {
//       showNotification("Failed to delete claims", "error");
//     }
//   };
//   const paginatedClaims = filteredClaims.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage,
//   );

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography
//               variant="h5"
//               fontWeight={600}
//               sx={{
//                 background: HEADER_GRADIENT,
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 mb: 3,
//               }}
//             >
//               Claim Master
//             </Typography>

//       {/* SEARCH + ACTION BAR */}
//       <Paper
//         elevation={2}
//         sx={{
//           p: 1,
//           mb: 2,
//           borderRadius: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: 2,
//         }}
//       >
//         {/* LEFT SIDE SEARCH */}
//         <TextField
//           placeholder="Search Claim ID..."
//           value={search}
//           onChange={handleSearch}
//           size="medium"
//           sx={{
//             flex: 1,
//             maxWidth: 300,
//             "& .MuiOutlinedInput-root": {
//               borderRadius: 2,
//             },
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />

//         {/* RIGHT SIDE BUTTONS */}
//         <Stack direction="row" spacing={2}>
//           {selectedRows.length > 0 && (
//             <Button
//               variant="contained"
//               startIcon={<DeleteIcon />}
//               onClick={handleBulkDelete}
//               sx={{
//                 backgroundColor: "#d32f2f",
//                 px: 3,
//                 py: 1.2,
//                 borderRadius: 2,
//                 fontWeight: 600,
//                 textTransform: "none",
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                 "&:hover": {
//                   backgroundColor: "#b71c1c",
//                 },
//               }}
//             >
//               DELETE ({selectedRows.length})
//             </Button>
//           )}

//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => setOpenAdd(true)}
//             sx={{
//               background: "linear-gradient(135deg, #0f4c5c, #00B4D8)",
//               px: 3,
//               py: 1.2,
//               borderRadius: 2,
//               fontWeight: 600,
//               textTransform: "none",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//               "&:hover": {
//                 opacity: 0.9,
//               },
//             }}
//           >
//             Add Claim
//           </Button>
//         </Stack>
//       </Paper>

//       {/* TABLE */}
//       <Paper sx={{ borderRadius: 3 }}>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ background: HEADER_GRADIENT }}>
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     checked={
//                       paginatedClaims.length > 0 &&
//                       selectedRows.length === paginatedClaims.length
//                     }
//                     onChange={handleSelectAll}
//                     sx={{ color: "#fff" }}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff" }}>Claim ID</TableCell>
//                 <TableCell sx={{ color: "#fff" }}>Patient</TableCell>
//                 <TableCell sx={{ color: "#fff" }}>Hospital</TableCell>
//                 <TableCell sx={{ color: "#fff" }}>Claimed</TableCell>
//                 <TableCell sx={{ color: "#fff" }}>Approved</TableCell>
//                 <TableCell sx={{ color: "#fff" }}>Status</TableCell>
//                 <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={8} align="center">
//                     <CircularProgress />
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedClaims.map((claim) => (
//                   <TableRow key={claim._id} hover>
//                     <TableCell padding="checkbox">
//                       <Checkbox
//                         checked={selectedRows.includes(claim._id)}
//                         onChange={() => handleSelectRow(claim._id)}
//                       />
//                     </TableCell>
//                     <TableCell>{claim.claimId}</TableCell>
//                     <TableCell>{claim.patientDetails?.name}</TableCell>
//                     <TableCell>{claim.hospitalName}</TableCell>
//                     <TableCell>₹{claim.claimedAmount}</TableCell>
//                     <TableCell>₹{claim.approvedAmount || 0}</TableCell>
//                     <TableCell>
//                       <Chip
//                         label={claim.status}
//                         color={getStatusColor(claim.status)}
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <IconButton
//                         onClick={(e) => {
//                           setSelectedClaim(claim);
//                           setAnchorEl(e.currentTarget);
//                         }}
//                       >
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
//           count={filteredClaims.length}
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
//         open={openMenu}
//         onClose={() => setAnchorEl(null)}
//       >
//         <MenuItem
//           onClick={() => {
//             setOpenView(true);
//             setAnchorEl(null);
//           }}
//         >
//           <ViewIcon fontSize="small" sx={{ mr: 1 }} />
//           View
//         </MenuItem>
//         <MenuItem
//           onClick={() => {
//             setOpenEdit(true);
//             setAnchorEl(null);
//           }}
//         >
//           <EditIcon fontSize="small" sx={{ mr: 1 }} />
//           Update Status
//         </MenuItem>
//       </Menu>

//       {/* MODALS */}
//       <AddClaim
//         open={openAdd}
//         onClose={() => setOpenAdd(false)}
//         onSuccess={() => {
//           fetchClaims();
//           showNotification("Claim added successfully", "success");
//         }}
//       />
//       {selectedClaim && (
//         <>
//           <ViewClaim
//             open={openView}
//             onClose={() => setOpenView(false)}
//             claimId={selectedClaim._id}
//           />
//           <EditClaim
//             open={openEdit}
//             onClose={() => setOpenEdit(false)}
//             claimData={selectedClaim}
//             onSuccess={() => {
//               fetchClaims();
//               showNotification("Claim updated successfully", "success");
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
//         <Alert
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ borderRadius: 2 }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ClaimMaster;



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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  AttachMoney as AttachMoneyIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  MedicalServices as MedicalIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../../config/Config';
import AddClaim from './AddClaim';
import ViewClaim from './ViewClaim';
import EditClaim from './EditClaim';

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
const STATUS_COLORS = {
  approved: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Approved' },
  rejected: { bg: COLORS.status.error, color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} />, label: 'Rejected' },
  under_review: { bg: COLORS.status.warning, color: '#92400E', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />, label: 'Under Review' },
  pending: { bg: COLORS.status.warning, color: '#92400E', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />, label: 'Pending' }
};

// Action Menu Component
const ActionMenu = ({ claim, onView, onEdit, anchorEl, onClose, onOpen }) => {
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
        <MenuItem onClick={() => { onView(claim); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              View Details
            </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onEdit(claim); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              Update Status
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const ClaimMaster = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedClaimForAction, setSelectedClaimForAction] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/mediclaim/claims`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setClaims(response.data.data || []);
        setFilteredClaims(response.data.data || []);
      } else {
        showNotification('Failed to load claims', 'error');
      }
    } catch (err) {
      console.error('Error fetching claims:', err);
      showNotification('Failed to load claims. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  // Filter claims when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = claims.filter(claim =>
        claim.claimId?.toLowerCase().includes(searchTerm) ||
        claim.patientDetails?.name?.toLowerCase().includes(searchTerm) ||
        claim.hospitalName?.toLowerCase().includes(searchTerm) ||
        claim.status?.toLowerCase().includes(searchTerm)
      );
      setFilteredClaims(filtered);
    } else {
      setFilteredClaims(claims);
    }
  }, [searchTerm, claims]);

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(paginatedClaims.map(claim => claim._id));
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
    fetchClaims();
    showNotification('Data refreshed', 'success');
  };

  const handleAddSuccess = () => {
    fetchClaims();
    showNotification('Claim added successfully!', 'success');
  };

  const handleEditSuccess = () => {
    fetchClaims();
    showNotification('Claim updated successfully!', 'success');
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/mediclaim/claims/bulk-delete`, {
        data: { ids: selected },
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelected([]);
      fetchClaims();
      showNotification('Claims deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete claims', 'error');
    }
  };

  const handleActionMenuOpen = (event, claim) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedClaimForAction(claim);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedClaimForAction(null);
  };

  const openViewClaimModal = (claim) => {
    setSelectedClaim(claim);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditClaimModal = (claim) => {
    setSelectedClaim(claim);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusStyle = (status) => {
    return STATUS_COLORS[status?.toLowerCase()] || { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />, label: status || 'Unknown' };
  };

  const paginatedClaims = filteredClaims.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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
    <Box sx={{ p: -1 }}>
      {/* Page Header */}
      {/* <Box sx={{ mb: 2.5 }}>
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
          Claim Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and track medical insurance claims
        </Typography>
      </Box> */}

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
              placeholder="Search by Claim ID, Patient, Hospital..."
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
                onClick={handleClearSearch}
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
                onClick={handleBulkDelete}
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
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Add Claim
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Claims Table */}
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
                    indeterminate={selected.length > 0 && selected.length < paginatedClaims.length}
                    checked={paginatedClaims.length > 0 && selected.length === paginatedClaims.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: COLORS.text.light,
                      '&.Mui-checked': { color: COLORS.text.light },
                      '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
                      '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                    }}
                    disabled={loading || paginatedClaims.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Claim ID
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Patient
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Hospital
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }} align="right">
                  Claimed
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }} align="right">
                  Approved
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
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading claims...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedClaims.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <MedicalIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {isFilterActive ? 'No claims match your filters' : 'No claims available'}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {isFilterActive ? 'Try adjusting your search terms' : 'Add your first claim to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedClaims.map((claim, index) => {
                  const isSelected = selected.includes(claim._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedClaimForAction?._id === claim._id;
                  const statusStyle = getStatusStyle(claim.status);

                  return (
                    <TableRow
                      key={claim._id}
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
                          onChange={() => handleSelect(claim._id)}
                          sx={{
                            color: COLORS.primary,
                            '&.Mui-checked': { color: COLORS.primary },
                            '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                          {claim.claimId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <PersonIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {claim.patientDetails?.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <LocationIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {claim.hospitalName}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {formatCurrency(claim.claimedAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatCurrency(claim.approvedAmount || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={statusStyle.icon}
                          label={statusStyle.label}
                          size="small"
                          sx={{
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 500,
                            fontSize: '0.65rem',
                            height: 24,
                            '& .MuiChip-icon': { fontSize: '0.7rem', color: statusStyle.color },
                            '& .MuiChip-label': { px: 1, fontSize: '0.65rem' }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          claim={claim}
                          onView={openViewClaimModal}
                          onEdit={openEditClaimModal}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, claim)}
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredClaims.length}
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

      {/* Modals */}
      <AddClaim
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedClaim && (
        <>
          <ViewClaim
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedClaim(null);
            }}
            claimId={selectedClaim._id}
          />
          <EditClaim
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedClaim(null);
            }}
            claimData={selectedClaim}
            onSuccess={handleEditSuccess}
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
            '& .MuiAlert-icon': { fontSize: '1.25rem' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClaimMaster;