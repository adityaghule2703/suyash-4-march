import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Stack,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Rating,
  Card,
  CardContent,
  Button,
  Checkbox,
  TextField,
  InputAdornment,
  alpha,
  Grid
} from "@mui/material";

import {
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Lock,
  AttachFile,
  Add,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  ArrowUpward as ArrowUpwardIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";

import axios from "axios";
import BASE_URL from "../../../config/Config";

// ✅ IMPORT MODALS
import AddEmployeeBehavior from "./AddEmployeeBehavior";
import ViewEmployeeBehavior from "./ViewEmployeeBehavior";
import EditEmployeeBehavior from "./EditEmployeeBehavior";
import DeleteEmployeeBehavior from "./DeleteEmployeeBehavior";

// Color constants
const HEADER_GRADIENT = "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
const STRIPE_COLOR_ODD = '#FFFFFF';
const STRIPE_COLOR_EVEN = '#f8fafc';
const HOVER_COLOR = '#f1f5f9';
const PRIMARY_BLUE = "#00B4D8";
const TEXT_COLOR_HEADER = '#FFFFFF';
const TEXT_COLOR_MAIN = "#0f172a";

const EmployeeBehaviorMaster = () => {
  const [behaviors, setBehaviors] = useState([]);
  const [filteredBehaviors, setFilteredBehaviors] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Checkbox selection state
  const [selected, setSelected] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Sort state
  const [sortConfig, setSortConfig] = useState({
    field: 'createdAt',
    direction: 'desc'
  });

  // Filter state
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // ✅ MODAL STATES
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Snackbar state (if needed)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // ================= FETCH =================
  const fetchBehaviors = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/employee-behavior/all?page=${page + 1}&limit=${rowsPerPage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const behaviorsData = res.data.data.behaviors || [];
        setBehaviors(behaviorsData);
        setFilteredBehaviors(behaviorsData);
        setStatistics(res.data.data.statistics);
        setPagination(res.data.data.pagination);
        setSelected([]); // Clear selections when data changes
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchBehaviors();
  }, [fetchBehaviors]);

  // Apply filters and search
  useEffect(() => {
    applyFilters();
  }, [behaviors, searchTerm, typeFilter, statusFilter, sortConfig]);

  const applyFilters = () => {
    let filtered = [...behaviors];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.employeeId?.FirstName?.toLowerCase().includes(term) ||
          item.employeeId?.LastName?.toLowerCase().includes(term) ||
          item.employeeId?.EmployeeID?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term) ||
          item.type?.toLowerCase().includes(term) ||
          item.status?.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Apply sorting
    if (sortConfig.field) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.field];
        let bValue = b[sortConfig.field];

        // Handle nested fields
        if (sortConfig.field === 'employeeName') {
          aValue = `${a.employeeId?.FirstName} ${a.employeeId?.LastName}`;
          bValue = `${b.employeeId?.FirstName} ${b.employeeId?.LastName}`;
        }

        if (sortConfig.field === 'createdAt' || sortConfig.field === 'reviewDate') {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        }

        if (sortConfig.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    setFilteredBehaviors(filtered);
    setSelected([]); // Clear selections on filter
  };

  // Handle sort
  const handleSort = (field) => {
    const direction = sortConfig.field === field && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ field, direction });
  };

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(paginatedData.map(item => item._id));
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

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    // Show confirmation or implement bulk delete API
    console.log(`Bulk delete for ${selected.length} items`);
    // You can add a confirmation dialog here
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter('all');
    setStatusFilter('all');
    setSortConfig({ field: 'createdAt', direction: 'desc' });
    setSelected([]);
  };

  // ================= HELPERS =================
  const getStatusStyle = status => {
    switch (status) {
      case "Resolved":
        return { bg: "#dcfce7", color: "#166534", border: "#86efac" };
      case "Escalated":
        return { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" };
      case "Open":
        return { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" };
      default:
        return { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
    }
  };

  const getTypeStyle = type => {
    switch (type) {
      case "Positive":
        return { bg: "#dcfce7", color: "#166534" };
      case "Negative":
        return { bg: "#fee2e2", color: "#991b1b" };
      default:
        return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  const formatDate = date =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
      : "-";

  const getInitials = (f, l) =>
    `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

  // ================= ACTION HANDLERS =================
  const handleActionClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const showNotification = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Paginated data
  const paginatedData = filteredBehaviors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Check if filters are active
  const isFilterActive = searchTerm || typeFilter !== 'all' || statusFilter !== 'all';

  // ================= UI =================
  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
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
          Employee Behavior Master
        </Typography>
        <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
          Manage and track employee behavior records
        </Typography>
      </Box>

      {/* SUMMARY CARDS */}
      {/* <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Total Records", value: statistics?.totalRecords, color: '#164e63', bg: '#f1f5f9' },
          { label: "Positive", value: statistics?.positiveCount, color: '#166534', bg: '#dcfce7' },
          { label: "Negative", value: statistics?.negativeCount, color: '#991b1b', bg: '#fee2e2' },
          { label: "Resolved", value: statistics?.resolvedCount, color: '#166534', bg: '#dcfce7' },
          { label: "Escalated", value: statistics?.escalatedCount, color: '#991b1b', bg: '#fee2e2' }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: item.bg }}>
              <Typography variant="caption" color="#64748B">{item.label}</Typography>
              <Typography variant="h4" fontWeight={600} sx={{ color: item.color, mt: 0.5 }}>
                {item.value || 0}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid> */}

      {/* ACTION BAR */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          {/* Search and Filters */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search employee, category..."
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelected([]);
              }}
              sx={{ 
                width: { xs: '100%', sm: 300 },
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

            {/* <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ height: 40, borderRadius: 1.5, borderColor: '#cbd5e1', color: '#475569', textTransform: 'none' }}
            >
              Filters
            </Button> */}

            {isFilterActive && (
              <Button
                variant="text"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                sx={{ height: 40, borderRadius: 1.5 }}
              >
                Clear Filters
              </Button>
            )}
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleBulkDelete}
                sx={{ height: 40, borderRadius: 1.5 }}
              >
                Delete ({selected.length})
              </Button>
            )}
{/* 
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchBehaviors}
              disabled={loading}
              sx={{ height: 40, borderRadius: 1.5 }}
            >
              Refresh
            </Button> */}

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAdd(true)}
              sx={{
                height: 40,
                borderRadius: 1.5,
                background: HEADER_GRADIENT,
                textTransform: 'none',
                '&:hover': { opacity: 0.9, background: HEADER_GRADIENT }
              }}
            >
              Add Behavior
            </Button>
          </Stack>
        </Stack>

        {/* Filter Panel */}
        {showFilters && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Type"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setSelected([]);
                  }}
                  size="small"
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Positive">Positive</MenuItem>
                  <MenuItem value="Negative">Negative</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setSelected([]);
                  }}
                  size="small"
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                  <MenuItem value="Escalated">Escalated</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Sort By"
                  value={sortConfig.field}
                  onChange={(e) => handleSort(e.target.value)}
                  size="small"
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                >
                  <MenuItem value="createdAt">Created Date</MenuItem>
                  <MenuItem value="reviewDate">Review Date</MenuItem>
                  <MenuItem value="employeeName">Employee Name</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* TABLE */}
      <Paper sx={{ borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
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
                <TableCell 
                  sx={{ color: "#fff", fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => handleSort('employeeName')}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Employee
                    <ArrowUpwardIcon 
                      sx={{ 
                        fontSize: 14, 
                        color: TEXT_COLOR_HEADER, 
                        opacity: sortConfig.field === 'employeeName' ? 1 : 0.5,
                        transform: sortConfig.direction === "desc" && sortConfig.field === 'employeeName' ? 'rotate(180deg)' : 'none'
                      }} 
                    />
                  </Stack>
                </TableCell>
                <TableCell 
                  sx={{ color: "#fff", fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => handleSort('category')}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Category
                    <ArrowUpwardIcon 
                      sx={{ 
                        fontSize: 14, 
                        color: TEXT_COLOR_HEADER, 
                        opacity: sortConfig.field === 'category' ? 1 : 0.5,
                        transform: sortConfig.direction === "desc" && sortConfig.field === 'category' ? 'rotate(180deg)' : 'none'
                      }} 
                    />
                  </Stack>
                </TableCell>
                <TableCell 
                  sx={{ color: "#fff", fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => handleSort('rating')}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Rating
                    <ArrowUpwardIcon 
                      sx={{ 
                        fontSize: 14, 
                        color: TEXT_COLOR_HEADER, 
                        opacity: sortConfig.field === 'rating' ? 1 : 0.5,
                        transform: sortConfig.direction === "desc" && sortConfig.field === 'rating' ? 'rotate(180deg)' : 'none'
                      }} 
                    />
                  </Stack>
                </TableCell>
                <TableCell 
                  sx={{ color: "#fff", fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => handleSort('type')}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Type
                    <ArrowUpwardIcon 
                      sx={{ 
                        fontSize: 14, 
                        color: TEXT_COLOR_HEADER, 
                        opacity: sortConfig.field === 'type' ? 1 : 0.5,
                        transform: sortConfig.direction === "desc" && sortConfig.field === 'type' ? 'rotate(180deg)' : 'none'
                      }} 
                    />
                  </Stack>
                </TableCell>
                <TableCell 
                  sx={{ color: "#fff", fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => handleSort('status')}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Status
                    <ArrowUpwardIcon 
                      sx={{ 
                        fontSize: 14, 
                        color: TEXT_COLOR_HEADER, 
                        opacity: sortConfig.field === 'status' ? 1 : 0.5,
                        transform: sortConfig.direction === "desc" && sortConfig.field === 'status' ? 'rotate(180deg)' : 'none'
                      }} 
                    />
                  </Stack>
                </TableCell>
                <TableCell 
                  sx={{ color: "#fff", fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => handleSort('reviewDate')}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Review Date
                    <ArrowUpwardIcon 
                      sx={{ 
                        fontSize: 14, 
                        color: TEXT_COLOR_HEADER, 
                        opacity: sortConfig.field === 'reviewDate' ? 1 : 0.5,
                        transform: sortConfig.direction === "desc" && sortConfig.field === 'reviewDate' ? 'rotate(180deg)' : 'none'
                      }} 
                    />
                  </Stack>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Attachments</TableCell>
                <TableCell 
                  sx={{ color: "#fff", fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => handleSort('createdAt')}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Created
                    <ArrowUpwardIcon 
                      sx={{ 
                        fontSize: 14, 
                        color: TEXT_COLOR_HEADER, 
                        opacity: sortConfig.field === 'createdAt' ? 1 : 0.5,
                        transform: sortConfig.direction === "desc" && sortConfig.field === 'createdAt' ? 'rotate(180deg)' : 'none'
                      }} 
                    />
                  </Stack>
                </TableCell>
                <TableCell align="center" sx={{ color: "#fff", fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, index) => {
                  const isSelected = selected.includes(row._id);
                  const isOddRow = index % 2 === 0;
                  const statusStyle = getStatusStyle(row.status);
                  const typeStyle = getTypeStyle(row.type);

                  return (
                    <TableRow 
                      key={row._id} 
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
                          onChange={() => handleSelect(row._id)}
                          sx={{
                            color: PRIMARY_BLUE,
                            '&.Mui-checked': { color: PRIMARY_BLUE }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: PRIMARY_BLUE, width: 40, height: 40 }}>
                            {getInitials(
                              row.employeeId?.FirstName,
                              row.employeeId?.LastName
                            )}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600} color={TEXT_COLOR_MAIN}>
                              {row.employeeId?.FirstName}{" "}
                              {row.employeeId?.LastName}
                            </Typography>
                            <Typography variant="caption" color="#64748B">
                              {row.employeeId?.EmployeeID}
                            </Typography>
                          </Box>
                          {row.isConfidential && (
                            <Lock fontSize="small" color="error" />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography color={TEXT_COLOR_MAIN}>{row.category}</Typography>
                      </TableCell>
                      <TableCell>
                        <Rating value={row.rating} readOnly size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.type}
                          size="small"
                          sx={{
                            backgroundColor: typeStyle.bg,
                            color: typeStyle.color,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography color={TEXT_COLOR_MAIN}>
                          {formatDate(row.reviewDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.attachments?.length || 0}
                          size="small"
                          sx={{ bgcolor: '#f1f5f9', color: TEXT_COLOR_MAIN }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography color="#64748B" variant="caption">
                          {formatDate(row.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={e => handleActionClick(e, row)}
                          sx={{
                            color: '#64748b',
                            '&:hover': { bgcolor: alpha(PRIMARY_BLUE, 0.1) }
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="#64748B" fontWeight={500}>
                      No behavior records found
                    </Typography>
                    <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
                      {isFilterActive ? 'Try adjusting your filters' : 'Add your first behavior record to get started'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination?.totalItems || 0}
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
      </Paper>

      {/* ACTION MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1, minWidth: 180, borderRadius: 2, border: '1px solid #e2e8f0' }
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenView(true);
            handleCloseMenu();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: PRIMARY_BLUE, minWidth: 36 }}>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>View Details</Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenEdit(true);
            handleCloseMenu();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>Edit</Typography>
          </ListItemText>
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            setOpenDelete(true);
            handleCloseMenu();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} color="#EF4444">
              Delete
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* MODALS */}
      <AddEmployeeBehavior
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={fetchBehaviors}
      />

      <ViewEmployeeBehavior
        open={openView}
        onClose={() => setOpenView(false)}
        behaviorId={selectedRow?._id}
      />

      <EditEmployeeBehavior
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        behaviorId={selectedRow?._id}
        onSuccess={fetchBehaviors}
      />

      <DeleteEmployeeBehavior
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        behaviorId={selectedRow?._id}
        onSuccess={fetchBehaviors}
      />
    </Box>
  );
};

export default EmployeeBehaviorMaster;