// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BASE_URL from "../../../config/Config";

// function MyLeaves() {
//   const employeeId = localStorage.getItem("employeeId");

//   useEffect(() => {
//     if (employeeId) {
//       fetchLeaves();
//     }
//   }, [employeeId]);

//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchLeaves();
//   }, []);

// const fetchLeaves = async () => {
//   try {
//     const res = await axios.get(
//       `${BASE_URL}/api/leaves/employee/${employeeId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     );
//     setLeaves(res.data);
//   } catch (err) {
//     console.error(err);
//   }
// };




//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <div style={styles.header}>
//           <h2 style={styles.title}>My Leaves</h2>
//         </div>

//         {loading ? (
//           <p style={styles.loading}>Loading...</p>
//         ) : (
//           <div style={styles.tableWrapper}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th style={styles.th}>Leave Type</th>
//                   <th style={styles.th}>From</th>
//                   <th style={styles.th}>To</th>
//                   <th style={styles.th}>Status</th>
//                   <th style={styles.th}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {leaves.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" style={styles.noData}>
//                       No leave records found
//                     </td>
//                   </tr>
//                 ) : (
//                   leaves.map((leave) => (
//                     <tr key={leave._id}>
//                       <td style={styles.td}>
//                         {leave.leaveTypeId?.name}
//                       </td>
//                       <td style={styles.td}>
//                         {new Date(leave.fromDate).toLocaleDateString()}
//                       </td>
//                       <td style={styles.td}>
//                         {new Date(leave.toDate).toLocaleDateString()}
//                       </td>
//                       <td style={styles.td}>
//                         <span
//                           style={{
//                             ...styles.statusBadge,
//                             backgroundColor:
//                               leave.status === "Approved"
//                                 ? "#d4edda"
//                                 : leave.status === "Rejected"
//                                   ? "#f8d7da"
//                                   : "#fff3cd",
//                             color:
//                               leave.status === "Approved"
//                                 ? "#155724"
//                                 : leave.status === "Rejected"
//                                   ? "#721c24"
//                                   : "#856404",
//                           }}
//                         >
//                           {leave.status}
//                         </span>
//                       </td>
//                       <td style={styles.td}>
//                         {leave.status === "Pending" && (
//                           <button
//                             style={styles.cancelBtn}
//                             onClick={() => handleCancel(leave._id)}
//                           >
//                             Cancel
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default MyLeaves;

// /* ===================== STYLES ===================== */

// const styles = {
//   page: {
//     padding: "30px",
//     backgroundColor: "#f4f6f9",
//     minHeight: "100vh",
//   },
//   card: {
//     backgroundColor: "#ffffff",
//     borderRadius: "10px",
//     padding: "20px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//   },
//   header: {
//     marginBottom: "20px",
//     borderBottom: "1px solid #eee",
//     paddingBottom: "10px",
//   },
//   title: {
//     margin: 0,
//     color: "#333",
//   },
//   loading: {
//     textAlign: "center",
//     padding: "20px",
//   },
//   tableWrapper: {
//     overflowX: "auto",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   th: {
//     backgroundColor: "#f8f9fa",
//     padding: "12px",
//     textAlign: "left",
//     fontWeight: "600",
//     fontSize: "14px",
//     borderBottom: "1px solid #ddd",
//   },
//   td: {
//     padding: "12px",
//     borderBottom: "1px solid #eee",
//     fontSize: "14px",
//   },
//   noData: {
//     textAlign: "center",
//     padding: "20px",
//     color: "#999",
//   },
//   statusBadge: {
//     padding: "5px 10px",
//     borderRadius: "20px",
//     fontSize: "12px",
//     fontWeight: "600",
//   },
//   cancelBtn: {
//     padding: "6px 12px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     backgroundColor: "#dc3545",
//     color: "white",
//   },
// };


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
  Button,
  TextField,
  InputAdornment,
  Typography,
  Snackbar,
  TablePagination,
  Stack,
  Alert,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  EventNote as EventNoteIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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
    approved: '#9FE2BF',
    pending: '#FEF3C7',
    rejected: '#FEE2E2'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
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

// View Leave Details Modal
const ViewLeaveDetails = ({ open, onClose, leave }) => {
  if (!leave) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventNoteIcon sx={{ color: COLORS.primary, fontSize: '1.2rem' }} />
          <Typography
            sx={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: COLORS.text.primary
            }}
          >
            Leave Details
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Leave Details Section */}
          <Box sx={{ 
            p: 2, 
            bgcolor: COLORS.primaryLight, 
            borderRadius: 1.5,
            border: `1px solid ${COLORS.primary}`
          }}>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Leave Type:
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {leave.LeaveTypeID?.Name || leave.leaveTypeName || 'N/A'}
                </Typography>
              </Stack>
              
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  From Date:
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {formatDate(leave.StartDate || leave.fromDate)}
                </Typography>
              </Stack>
              
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  To Date:
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {formatDate(leave.EndDate || leave.toDate)}
                </Typography>
              </Stack>
              
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Total Days:
                </Typography>
                <Chip 
                  label={`${calculateDays()} day(s)`}
                  size="small"
                  sx={{ 
                    bgcolor: COLORS.primaryLight,
                    color: COLORS.primaryDark,
                    fontSize: '0.65rem',
                    height: 24,
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      px: 1.5,
                      fontSize: '0.65rem'
                    }
                  }}
                />
              </Stack>
              
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                  Status:
                </Typography>
                <StatusChip status={leave.Status || leave.status} />
              </Stack>
            </Stack>
          </Box>

          {/* Reason Section */}
          {(leave.Reason || leave.reason) && (
            <Box sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`
            }}>
              <Typography 
                sx={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 600, 
                  color: COLORS.text.secondary,
                  letterSpacing: '0.5px',
                  mb: 1
                }}
              >
                REASON FOR LEAVE
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: '0.75rem', 
                  color: COLORS.text.primary,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {leave.Reason || leave.reason}
              </Typography>
            </Box>
          )}

          {/* Contact Information Section */}
          {(leave.ContactNumber || leave.contactNumber || leave.AddressDuringLeave || leave.addressDuringLeave) && (
            <Box sx={{ 
              p: 2, 
              bgcolor: COLORS.background.light, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`
            }}>
              <Typography 
                sx={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 600, 
                  color: COLORS.text.secondary,
                  letterSpacing: '0.5px',
                  mb: 1
                }}
              >
                CONTACT INFORMATION
              </Typography>
              <Stack spacing={1}>
                {(leave.ContactNumber || leave.contactNumber) && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Contact Number:
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {leave.ContactNumber || leave.contactNumber}
                    </Typography>
                  </Stack>
                )}
                {(leave.AddressDuringLeave || leave.addressDuringLeave) && (
                  <Stack direction="column" spacing={0.5}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                      Address During Leave:
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 500, 
                        color: COLORS.text.primary,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      {leave.AddressDuringLeave || leave.addressDuringLeave}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={onClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Component
const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const employeeId = localStorage.getItem("employeeId");
  const token = localStorage.getItem("token");

  // Fetch leaves
  const fetchLeaves = useCallback(async () => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/leaves/employee/${employeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const leavesData = response.data.data || [];
        setLeaves(leavesData);
        setFilteredLeaves(leavesData);
      } else {
        showNotification('Failed to load leaves', 'error');
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
      showNotification('Failed to load leaves. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [employeeId, token]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // Apply search filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let filtered = [...leaves];
    
    if (searchTerm) {
      filtered = filtered.filter(leave =>
        leave.LeaveTypeID?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.Reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leaveTypeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredLeaves(filtered);
  }, [leaves, searchTerm]);

  // Handle cancel leave
  const handleCancel = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/leaves/${leaveId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        showNotification('Leave request cancelled successfully', 'success');
        fetchLeaves();
      } else {
        showNotification(response.data.message || 'Failed to cancel leave', 'error');
      }
    } catch (err) {
      console.error('Error cancelling leave:', err);
      showNotification('Failed to cancel leave. Please try again.', 'error');
    }
  };

  // Handle view leave
  const handleViewLeave = (leave) => {
    setSelectedLeave(leave);
    setOpenViewModal(true);
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString) => {
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedLeaves = filteredLeaves.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          My Leaves
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          View and manage your leave applications
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

          <Button
            variant="outlined"
            startIcon={<RefreshIcon sx={{ fontSize: '1rem' }} />}
            onClick={fetchLeaves}
            sx={{
              height: 36,
              borderRadius: 1.5,
              borderColor: COLORS.border,
              color: COLORS.text.secondary,
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                borderColor: COLORS.primary,
                bgcolor: `${COLORS.primary}10`
              }
            }}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>
      </Paper>

      {/* Leaves Table */}
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
                  Status
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  width: 120,
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
                      Loading leave applications...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <EventNoteIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No leave applications found' : 'No leave applications available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Apply for leave to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLeaves.map((leave) => {
                  const calculateDays = () => {
                    const startDate = leave.StartDate || leave.fromDate;
                    const endDate = leave.EndDate || leave.toDate;
                    if (startDate && endDate) {
                      const from = new Date(startDate);
                      const to = new Date(endDate);
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
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': {
                          bgcolor: COLORS.background.hover
                        },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {leave.LeaveTypeID?.Name || leave.leaveTypeName || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDate(leave.StartDate || leave.fromDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDate(leave.EndDate || leave.toDate)}
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
                        <StatusChip status={leave.Status || leave.status} />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewLeave(leave)}
                              sx={{
                                color: COLORS.primary,
                                '&:hover': {
                                  bgcolor: `${COLORS.primary}20`
                                }
                              }}
                            >
                              <ViewIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Tooltip>
                          
                          {(leave.Status === 'Pending' || leave.status === 'Pending') && (
                            <Tooltip title="Cancel Leave">
                              <IconButton
                                size="small"
                                onClick={() => handleCancel(leave._id)}
                                sx={{
                                  color: '#EF4444',
                                  '&:hover': {
                                    bgcolor: '#FEE2E2'
                                  }
                                }}
                              >
                                <CancelIcon sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {filteredLeaves.length > 0 && (
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
        )}
      </Paper>

      {/* View Leave Modal */}
      <ViewLeaveDetails 
        open={openViewModal} 
        onClose={() => setOpenViewModal(false)} 
        leave={selectedLeave} 
      />

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

export default MyLeaves;