import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Button,
  TablePagination,
  Chip,
  MenuItem,
  Select,
  FormControl,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Menu,
  ListItemIcon,
  ListItemText,
  Checkbox,
  alpha
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Sort as SortIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Event as EventIcon,
  Refresh as RefreshIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  CloseSharp,
  ArrowUpward as ArrowUpwardIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";

// Color constants
const HEADER_GRADIENT = "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
const STRIPE_COLOR_ODD = '#FFFFFF';
const STRIPE_COLOR_EVEN = '#f8fafc';
const HOVER_COLOR = '#f1f5f9';
const PRIMARY_BLUE = '#00B4D8';
const TEXT_COLOR_HEADER = '#FFFFFF';
const TEXT_COLOR_MAIN = '#0f172a';

const AdminLeaveApproval = () => {
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId") || "admin";

  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Checkbox selection state
  const [selected, setSelected] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("AppliedOn");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [processing, setProcessing] = useState(false);

  const [actionAnchor, setActionAnchor] = useState(null);

  // View details dialog
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch pending leaves on component mount
  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, sortOrder, sortBy, leaves]);

  const fetchPendingLeaves = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/leaves/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Pending leaves response:", response.data);
      
      // Extract data from the response structure
      const leavesData = response.data.data || [];
      setLeaves(leavesData);
      setSelected([]); // Clear selections when data changes
      
      // Update stats
      setStats({
        pending: leavesData.length,
        approved: 0,
        rejected: 0
      });
      
    } catch (error) {
      console.error("Error fetching pending leaves:", error);
      showSnackbar("Failed to load pending leave applications", "error");
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...leaves];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (leave) =>
          leave.EmployeeID?.FirstName?.toLowerCase().includes(term) ||
          leave.EmployeeID?.LastName?.toLowerCase().includes(term) ||
          leave.EmployeeID?.FullName?.toLowerCase().includes(term) ||
          leave.EmployeeID?.EmployeeID?.toLowerCase().includes(term) ||
          leave.LeaveTypeID?.Name?.toLowerCase().includes(term) ||
          leave.Reason?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      data = data.filter((leave) => 
        leave.Status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sort
    data.sort((a, b) => {
      let valueA, valueB;
      
      switch(sortBy) {
        case 'AppliedOn':
          valueA = new Date(a.AppliedOn || a.CreatedAt);
          valueB = new Date(b.AppliedOn || b.CreatedAt);
          break;
        case 'StartDate':
          valueA = new Date(a.StartDate);
          valueB = new Date(b.StartDate);
          break;
        case 'NumberOfDays':
          valueA = a.NumberOfDays || 0;
          valueB = b.NumberOfDays || 0;
          break;
        case 'EmployeeName':
          valueA = (a.EmployeeID?.FullName || `${a.EmployeeID?.FirstName} ${a.EmployeeID?.LastName}`).toLowerCase();
          valueB = (b.EmployeeID?.FullName || `${b.EmployeeID?.FirstName} ${b.EmployeeID?.LastName}`).toLowerCase();
          break;
        default:
          valueA = new Date(a.AppliedOn || a.CreatedAt);
          valueB = new Date(b.AppliedOn || b.CreatedAt);
      }
      
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredLeaves(data);
    setSelected([]); // Clear selections on filter
  };

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(paginatedData.map(leave => leave._id));
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

  // Handle bulk action
  const handleBulkAction = (action) => {
    if (selected.length === 0) return;
    
    if (action === 'approve') {
      // Handle bulk approve
      showSnackbar(`Bulk approve for ${selected.length} items - API implementation required`, 'warning');
    } else if (action === 'reject') {
      // Handle bulk reject
      showSnackbar(`Bulk reject for ${selected.length} items - API implementation required`, 'warning');
    }
  };

  const handleProcessClick = (leave, action) => {
    setSelectedLeave(leave);
    setActionType(action);
    setRemarks("");
    setOpenDialog(true);
  };

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setOpenViewDialog(true);
  };

  const handleActionOpen = (event, leave) => {
    setActionAnchor(event.currentTarget);
    setSelectedLeave(leave);
  };

  const handleActionClose = () => {
    setActionAnchor(null);
  };

  const handleProcessConfirm = async () => {
    if (!selectedLeave || !actionType) return;

    try {
      setProcessing(true);
      
      const payload = {
        status: actionType,
        remarks: remarks || `${actionType} by admin`,
        approvedBy: currentUserId
      };

      console.log(`Processing leave ${selectedLeave._id} with status: ${actionType}`);
      console.log("Payload:", payload);

      const response = await axios.put(
        `${BASE_URL}/api/leaves/${selectedLeave._id}/process`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Process response:", response.data);

      showSnackbar(`Leave ${actionType.toLowerCase()} successfully`, "success");
      
      // Close dialog
      setOpenDialog(false);
      
      // Refresh the pending leaves list
      await fetchPendingLeaves();
      
    } catch (error) {
      console.error("Error processing leave:", error);
      const errorMessage = error.response?.data?.message || "Error processing leave application";
      showSnackbar(errorMessage, "error");
    } finally {
      setProcessing(false);
      setSelectedLeave(null);
      setActionType(null);
      setRemarks("");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLeave(null);
    setActionType(null);
    setRemarks("");
  };

  const exportCSV = () => {
    try {
      const headers = [
        "Employee ID",
        "Employee Name",
        "Department",
        "Designation",
        "Leave Type",
        "From Date",
        "To Date",
        "Days",
        "Reason",
        "Contact Number",
        "Address",
        "Status",
        "Applied On"
      ];
      
      const csvData = filteredLeaves.map((l) => [
        l.EmployeeID?.EmployeeID || 'N/A',
        l.EmployeeID?.FullName || `${l.EmployeeID?.FirstName || ''} ${l.EmployeeID?.LastName || ''}`.trim() || 'N/A',
        l.EmployeeID?.DepartmentID?.DepartmentName || 'N/A',
        l.EmployeeID?.DesignationID?.DesignationName || 'N/A',
        l.LeaveTypeID?.Name || 'N/A',
        new Date(l.StartDate).toLocaleDateString(),
        new Date(l.EndDate).toLocaleDateString(),
        l.NumberOfDays || '1',
        l.Reason || 'N/A',
        l.ContactNumber || 'N/A',
        l.AddressDuringLeave || 'N/A',
        l.Status || 'N/A',
        new Date(l.AppliedOn || l.CreatedAt).toLocaleDateString()
      ]);

      const csv = [headers, ...csvData].map(row => row.join(",")).join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `pending_leaves_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      showSnackbar("Export successful", "success");
    } catch (error) {
      console.error("Export error:", error);
      showSnackbar("Failed to export data", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelected([]);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getEmployeeName = (leave) => {
    if (leave.EmployeeID?.FullName) return leave.EmployeeID.FullName;
    if (leave.EmployeeID?.FirstName || leave.EmployeeID?.LastName) {
      return `${leave.EmployeeID.FirstName || ''} ${leave.EmployeeID.LastName || ''}`.trim();
    }
    return 'Unknown Employee';
  };

  const getAvatarInitials = (leave) => {
    const name = getEmployeeName(leave);
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase() || 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Including both start and end dates
  };

  const paginatedData = filteredLeaves.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isFilterActive = searchTerm || statusFilter !== 'All';

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          component="h1"
          fontWeight="600"
          sx={{
            background: HEADER_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: 'inline-block'
          }}
        >
          Admin Leave Approval
        </Typography>
        <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
          Review and process employee leave applications
        </Typography>
      </Box>

      {/* Stats Cards */}
      {/* <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#fff3e0' }}>
            <Typography variant="body2" color="#64748B">Pending Approvals</Typography>
            <Typography variant="h4" fontWeight={600} sx={{ color: '#ed6c02', mt: 1 }}>
              {stats.pending}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#e8f5e9' }}>
            <Typography variant="body2" color="#64748B">Approved Today</Typography>
            <Typography variant="h4" fontWeight={600} sx={{ color: '#2e7d32', mt: 1 }}>
              {stats.approved}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#ffebee' }}>
            <Typography variant="body2" color="#64748B">Rejected Today</Typography>
            <Typography variant="h4" fontWeight={600} sx={{ color: '#d32f2f', mt: 1 }}>
              {stats.rejected}
            </Typography>
          </Paper>
        </Grid>
      </Grid> */}

      {/* Action Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search employee, leave type..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelected([]);
              }}
              sx={{ 
                width: { xs: '100%', sm: 400 },
                '& .MuiOutlinedInput-root': { borderRadius: 1.5 }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748B' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch} edge="end">
                      <ClearIcon fontSize="small" sx={{ color: '#64748B' }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { height: 40, bgcolor: '#f8fafc' }
              }}
            />

            {/* <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setSelected([]);
                }}
                sx={{ borderRadius: 1.5, height: 40 }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl> */}

            {/* <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setSelected([]);
                }}
                sx={{ borderRadius: 1.5, height: 40 }}
              >
                <MenuItem value="AppliedOn">Sort by Applied Date</MenuItem>
                <MenuItem value="StartDate">Sort by Start Date</MenuItem>
                <MenuItem value="NumberOfDays">Sort by Days</MenuItem>
                <MenuItem value="EmployeeName">Sort by Employee Name</MenuItem>
              </Select>
            </FormControl> */}

            {/* <Button
              variant="outlined"
              startIcon={<SortIcon />}
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              sx={{ height: 40, borderRadius: 1.5, borderColor: '#cbd5e1', color: '#475569', textTransform: 'none' }}
            >
              {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
            </Button> */}

            {isFilterActive && (
              <Button
                variant="text"
                startIcon={<ClearIcon />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setSelected([]);
                }}
                sx={{ height: 40, borderRadius: 1.5 }}
              >
                Clear Filters
              </Button>
            )}
          </Stack>

          <Stack direction="row" spacing={2}>
            {selected.length > 0 && (
              <>
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<ApproveIcon />}
                  onClick={() => handleBulkAction('approve')}
                  sx={{ height: 40, borderRadius: 1.5 }}
                >
                  Approve ({selected.length})
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<RejectIcon />}
                  onClick={() => handleBulkAction('reject')}
                  sx={{ height: 40, borderRadius: 1.5 }}
                >
                  Reject ({selected.length})
                </Button>
              </>
            )}

            {/* <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportCSV}
              disabled={filteredLeaves.length === 0}
              sx={{ height: 40, borderRadius: 1.5 }}
            >
              Export
            </Button> */}
            
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchPendingLeaves}
              disabled={loading}
              sx={{
                height: 40,
                borderRadius: 1.5,
                background: HEADER_GRADIENT,
                textTransform: 'none',
                '&:hover': { opacity: 0.9, background: HEADER_GRADIENT }
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: 2, border: '1px solid #e2e8f0', overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: HEADER_GRADIENT }}>
                <TableCell padding="checkbox" sx={{ width: 60 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedData.length}
                    checked={paginatedData.length > 0 && selected.length === paginatedData.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: TEXT_COLOR_HEADER,
                      '&.Mui-checked': { color: TEXT_COLOR_HEADER },
                      '&.MuiCheckbox-indeterminate': { color: TEXT_COLOR_HEADER }
                    }}
                    disabled={loading || paginatedData.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Employee</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Leave Type</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Duration</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Days</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Applied On</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      Loading leave applications...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((leave, index) => {
                  const isSelected = selected.includes(leave._id);
                  const isOddRow = index % 2 === 0;

                  return (
                    <TableRow 
                      key={leave._id} 
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: isOddRow ? STRIPE_COLOR_ODD : STRIPE_COLOR_EVEN,
                        '&:hover': { bgcolor: HOVER_COLOR },
                        '&.Mui-selected': {
                          bgcolor: alpha(PRIMARY_BLUE, 0.08),
                          '&:hover': { bgcolor: alpha(PRIMARY_BLUE, 0.12) }
                        }
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(leave._id)}
                          sx={{
                            color: PRIMARY_BLUE,
                            '&.Mui-checked': { color: PRIMARY_BLUE }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 36, 
                              height: 36, 
                              bgcolor: PRIMARY_BLUE,
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}
                          >
                            {getAvatarInitials(leave)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500} color={TEXT_COLOR_MAIN}>
                              {getEmployeeName(leave)}
                            </Typography>
                            <Typography variant="caption" color="#64748B">
                              {leave.EmployeeID?.EmployeeID} • {leave.EmployeeID?.DepartmentID?.DepartmentName || 'No Dept'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={leave.LeaveTypeID?.Name || 'Unknown Type'}
                          size="small"
                          sx={{ 
                            bgcolor: '#e0f2fe',
                            color: '#0369a1',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="caption" color="#64748B">
                            From: {formatDate(leave.StartDate)}
                          </Typography>
                          <Typography variant="caption" color="#64748B">
                            To: {formatDate(leave.EndDate)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={leave.NumberOfDays || calculateDaysDifference(leave.StartDate, leave.EndDate)}
                          size="small"
                          sx={{ 
                            bgcolor: '#f1f5f9',
                            color: TEXT_COLOR_MAIN,
                            fontWeight: 600,
                            minWidth: 40
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="#64748B">
                          {formatDateTime(leave.AppliedOn || leave.CreatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={leave.Status || 'Pending'}
                          color={getStatusColor(leave.Status)}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          onClick={(e) => handleActionOpen(e, leave)}
                          sx={{
                            color: '#64748b',
                            '&:hover': { bgcolor: alpha(PRIMARY_BLUE, 0.1) }
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <EventIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
                    <Typography variant="body1" color="#64748B" fontWeight={500} gutterBottom>
                      No Pending Leave Applications
                    </Typography>
                    <Typography variant="body2" color="#94A3B8">
                      {searchTerm || statusFilter !== 'All' 
                        ? 'Try adjusting your filters' 
                        : 'All leave requests have been processed'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={actionAnchor}
          open={Boolean(actionAnchor)}
          onClose={handleActionClose}
          PaperProps={{
            elevation: 3,
            sx: { mt: 1, minWidth: 180, borderRadius: 2, border: '1px solid #e2e8f0' }
          }}
        >
          <MenuItem
            onClick={() => {
              handleViewDetails(selectedLeave);
              handleActionClose();
            }}
            sx={{ py: 1 }}
          >
            <ListItemIcon sx={{ color: PRIMARY_BLUE, minWidth: 36 }}>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500}>View Details</Typography>
            </ListItemText>
          </MenuItem>

          {selectedLeave?.Status === "Pending" && (
            <>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                onClick={() => {
                  handleProcessClick(selectedLeave, "Approved");
                  handleActionClose();
                }}
                sx={{ py: 1 }}
              >
                <ListItemIcon sx={{ color: '#2e7d32', minWidth: 36 }}>
                  <ApproveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2" fontWeight={500} color="#2e7d32">
                    Approve
                  </Typography>
                </ListItemText>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleProcessClick(selectedLeave, "Rejected");
                  handleActionClose();
                }}
                sx={{ py: 1 }}
              >
                <ListItemIcon sx={{ color: '#d32f2f', minWidth: 36 }}>
                  <RejectIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2" fontWeight={500} color="#d32f2f">
                    Reject
                  </Typography>
                </ListItemText>
              </MenuItem>
            </>
          )}
        </Menu>

        {filteredLeaves.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredLeaves.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => {
              setPage(newPage);
              setSelected([]);
            }}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
              setSelected([]);
            }}
            sx={{
              borderTop: '1px solid #e2e8f0',
              '& .MuiTablePagination-actions button': { color: PRIMARY_BLUE }
            }}
          />
        )}
      </Paper>

      {/* Process Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ 
          background: actionType === 'Approved' ? '#2e7d32' : '#d32f2f',
          color: 'white',
          fontWeight: 600,
          py: 2
        }}>
          {actionType === 'Approved' ? 'Approve Leave Application' : 'Reject Leave Application'}
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {selectedLeave && (
            <Card variant="outlined" sx={{ mb: 3, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom color={PRIMARY_BLUE} fontWeight={600}>
                  Leave Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="#64748B">Employee</Typography>
                    <Typography variant="body2" fontWeight={500} color={TEXT_COLOR_MAIN}>
                      {getEmployeeName(selectedLeave)}
                    </Typography>
                    <Typography variant="caption" color="#64748B">
                      ID: {selectedLeave.EmployeeID?.EmployeeID}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="#64748B">Leave Type</Typography>
                    <Typography variant="body2" fontWeight={500} color={TEXT_COLOR_MAIN}>
                      {selectedLeave.LeaveTypeID?.Name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="#64748B">Duration</Typography>
                    <Typography variant="body2" color={TEXT_COLOR_MAIN}>
                      {formatDate(selectedLeave.StartDate)} to {formatDate(selectedLeave.EndDate)}
                      {' '}({selectedLeave.NumberOfDays || calculateDaysDifference(selectedLeave.StartDate, selectedLeave.EndDate)} days)
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="#64748B">Reason</Typography>
                    <Typography variant="body2" color={TEXT_COLOR_MAIN}>
                      {selectedLeave.Reason || 'No reason provided'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          
          <TextField
            label="Remarks"
            multiline
            rows={3}
            fullWidth
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={`Add remarks for ${actionType?.toLowerCase()} request...`}
            variant="outlined"
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleCloseDialog} 
            disabled={processing}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={actionType === 'Approved' ? 'success' : 'error'}
            onClick={handleProcessConfirm}
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : null}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            {processing ? 'Processing...' : `Confirm ${actionType}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid #E0E0E0",
            py: 1.5,
            backgroundColor: "#F8FAFC",
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography fontSize={18} fontWeight={600} color={TEXT_COLOR_MAIN}>
            Leave Application Details
          </Typography>
          <IconButton onClick={() => setOpenViewDialog(false)} size="small">
            <CloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, pb: 1 }}>
          {selectedLeave && (
            <Stack spacing={2}>
              {/* Employee Info */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: PRIMARY_BLUE,
                    fontSize: "1.2rem",
                  }}
                >
                  {getAvatarInitials(selectedLeave)}
                </Avatar>
                <Box>
                  <Typography fontWeight={600} color={TEXT_COLOR_MAIN}>
                    {getEmployeeName(selectedLeave)}
                  </Typography>
                  <Typography variant="caption" color="#64748B">
                    ID: {selectedLeave.EmployeeID?.EmployeeID}
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              {/* Leave Details */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" color="#64748B">Leave Type</Typography>
                  <Typography fontWeight={600} color={TEXT_COLOR_MAIN}>
                    {selectedLeave.LeaveTypeID?.Name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" color="#64748B">Status</Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={selectedLeave.Status}
                      size="small"
                      color={getStatusColor(selectedLeave.Status)}
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" color="#64748B">Duration</Typography>
                  <Typography variant="body2" color={TEXT_COLOR_MAIN}>
                    {formatDate(selectedLeave.StartDate)} - {formatDate(selectedLeave.EndDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" color="#64748B">Days</Typography>
                  <Chip
                    label={`${selectedLeave.NumberOfDays || calculateDaysDifference(selectedLeave.StartDate, selectedLeave.EndDate)} days`}
                    size="small"
                    sx={{ fontWeight: 500, bgcolor: '#e0f2fe', color: '#0c4a6e', border: '1px solid #bae6fd', mt: 0.5 }}
                  />
                </Grid>
              </Grid>

              <Divider />

              {/* Contact Info */}
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  Contact Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="#64748B">Contact Number</Typography>
                    <Typography variant="body2" fontWeight={500} color={TEXT_COLOR_MAIN}>
                      {selectedLeave.ContactNumber || "Not provided"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="caption" color="#64748B">Address During Leave</Typography>
                    <Typography variant="body2" color={TEXT_COLOR_MAIN}>
                      {selectedLeave.AddressDuringLeave || "Not specified"}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>

              <Divider />

              {/* Reason */}
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  Reason
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    backgroundColor: "#F8FAFC",
                    p: 1.5,
                    borderRadius: 1,
                    minHeight: 60,
                    lineHeight: 1.5,
                    border: '1px solid #E0E0E0',
                    color: TEXT_COLOR_MAIN
                  }}
                >
                  {selectedLeave.Reason || "No reason provided"}
                </Typography>
              </Stack>

              <Divider />

              {/* System Info */}
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600} color={TEXT_COLOR_MAIN}>
                  System Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="#64748B">Applied On</Typography>
                    <Typography variant="body2" fontWeight={500} color={TEXT_COLOR_MAIN}>
                      {formatDateTime(selectedLeave.AppliedOn)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="#64748B">Last Updated</Typography>
                    <Typography variant="body2" color={TEXT_COLOR_MAIN}>
                      {formatDateTime(selectedLeave.UpdatedAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: "1px solid #E0E0E0" }}>
          <Button
            variant="contained"
            onClick={() => setOpenViewDialog(false)}
            startIcon={<CloseSharp />}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              background: HEADER_GRADIENT,
              '&:hover': { opacity: 0.9, background: HEADER_GRADIENT }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled" 
          sx={{ width: '100%', borderRadius: 1.5 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLeaveApproval;