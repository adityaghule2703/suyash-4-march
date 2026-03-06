import React, { useState, useEffect } from "react";
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
  Typography,
  Snackbar,
  TablePagination,
  Stack,
  Alert,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  alpha
} from "@mui/material";

import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
  ArrowUpward as ArrowUpwardIcon
} from "@mui/icons-material";

import axios from "axios";
import BASE_URL from "../../../config/Config";

/* COMPONENTS */
import AddLeaveTypes from "./AddLeaveTypes";
import EditLeaveTypes from "./EditLeaveTypes";
import ViewLeaveTypes from "./ViewLeaveTypes";
import DeleteLeaveTypes from "./DeleteLeaveTypes";

import AddHoliday from "./AddHoliday";
import EditHoliday from "./EditHoliday";
import ViewHoliday from "./ViewHoliday";
import DeleteHoliday from "./DeleteHoliday";

// Color constants - EXACT SAME as Employee Master
const HEADER_GRADIENT = "linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)";
const STRIPE_COLOR_ODD = '#FFFFFF';
const STRIPE_COLOR_EVEN = '#f8fafc'; // slate-50
const HOVER_COLOR = '#f1f5f9'; // slate-100
const PRIMARY_BLUE = '#00B4D8';
const TEXT_COLOR_HEADER = '#FFFFFF';
const TEXT_COLOR_MAIN = '#0f172a'; // slate-900

// Action Menu Component (same style as Employee Master)
const ActionMenu = ({ item, onView, onEdit, onDelete, anchorEl, onClose, onOpen }) => {
  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={onOpen}
          sx={{
            color: '#64748b', // slate-500
            '&:hover': {
              bgcolor: alpha(PRIMARY_BLUE, 0.1)
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
            border: '1px solid #e2e8f0'
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            onView(item);
            onClose();
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
        <MenuItem 
          onClick={() => {
            onEdit(item);
            onClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>Edit</Typography>
          </ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem 
          onClick={() => {
            onDelete(item);
            onClose();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} color="#EF4444">
              Delete
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

// Tooltip wrapper to avoid undefined error
const Tooltip = ({ children, title }) => {
  return (
    <Box component="span" sx={{ display: 'inline-block' }}>
      {title ? (
        <span title={title}>{children}</span>
      ) : (
        children
      )}
    </Box>
  );
};

const LeaveTypeMaster = () => {
  const [mode, setMode] = useState("leave");
  const [dataList, setDataList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Checkbox selection state
  const [selected, setSelected] = useState([]);

  // Action menu state
  const [actionAnchor, setActionAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Modal state
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Sort state
  const [sortConfig, setSortConfig] = useState({
    field: mode === "leave" ? "Name" : "Title",
    direction: "asc"
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    fetchData();
  }, [mode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const endpoint =
        mode === "leave"
          ? `${BASE_URL}/api/leavetypes`
          : `${BASE_URL}/api/holidays`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setDataList(response.data.data || []);
        setFilteredList(response.data.data || []);
        setSelected([]); // Clear selections when data changes
      } else {
        showNotification("Failed to load data", "error");
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      showNotification("Failed to load data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
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
    
    // Show confirmation or directly implement bulk delete API
    showNotification(`Bulk delete for ${selected.length} items - API implementation required`, 'warning');
    // You can implement actual bulk delete API call here
    // setSelected([]); // Clear selections after successful delete
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = dataList.filter((item) =>
      mode === "leave"
        ? item.Name?.toLowerCase().includes(value)
        : (item.Title || item.Name)?.toLowerCase().includes(value)
    );

    setFilteredList(filtered);
    setPage(0);
    setSelected([]); // Clear selections on search
  };

  // Handle sort
  const handleSort = (field) => {
    const direction = sortConfig.field === field && sortConfig.direction === "asc" ? "desc" : "asc";
    
    const sorted = [...filteredList].sort((a, b) => {
      let aValue = field === "Title" ? (a.Title || a.Name || "") : (a[field] || "");
      let bValue = field === "Title" ? (b.Title || b.Name || "") : (b[field] || "");
      
      if (field === "Date" || field === "CreatedAt" || field === "UpdatedAt") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      if (direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredList(sorted);
    setSortConfig({ field, direction });
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredList(dataList);
    setPage(0);
    setSelected([]); // Clear selections on filter reset
  };

  // Filter active only
  const handleFilterActive = () => {
    const filtered = dataList.filter((item) => item.IsActive);
    setFilteredList(filtered);
    setPage(0);
    setSelected([]); // Clear selections on filter
    showNotification(`Showing ${filtered.length} active ${mode === "leave" ? "leave types" : "holidays"}`, "info");
  };

  // Reset all filters
  const handleResetFilter = () => {
    setFilteredList(dataList);
    setSearchTerm("");
    setPage(0);
    setSelected([]); // Clear selections on filter reset
    setSortConfig({ field: mode === "leave" ? "Name" : "Title", direction: "asc" });
    showNotification("Filters cleared", "info");
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]); // Clear selections on page change
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]); // Clear selections on rows per page change
  };

  // Action menu handlers
  const handleActionOpen = (event, item) => {
    setActionAnchor(event.currentTarget);
    setSelectedItem(item);
  };

  const handleActionClose = () => {
    setActionAnchor(null);
  };

  // Modal handlers
  const openViewModal = (item) => {
    setSelectedItem(item);
    setOpenView(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setOpenEdit(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setOpenDelete(true);
  };

  const handleAddClose = (success) => {
    setOpenAdd(false);
    if (success) {
      fetchData();
      showNotification(
        `${mode === "leave" ? "Leave Type" : "Holiday"} added successfully`,
        "success"
      );
    }
  };

  const handleEditClose = (success) => {
    setOpenEdit(false);
    if (success) {
      fetchData();
      showNotification(
        `${mode === "leave" ? "Leave Type" : "Holiday"} updated successfully`,
        "success"
      );
    }
    setSelectedItem(null);
  };

  const handleDeleteClose = (success) => {
    setOpenDelete(false);
    if (success) {
      fetchData();
      showNotification(
        `${mode === "leave" ? "Leave Type" : "Holiday"} deleted successfully`,
        "success"
      );
    }
    setSelectedItem(null);
  };

  const handleViewClose = () => {
    setOpenView(false);
    setSelectedItem(null);
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

  // Paginated data
  const paginatedData = filteredList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Check if filters are active
  const isFilterActive = searchTerm || filteredList.length !== dataList.length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Mode Toggle */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, val) => val && setMode(val)}
          sx={{
            '& .MuiToggleButton-root': {
              height: 40,
              px: 3,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              borderColor: '#cbd5e1',
              color: '#475569',
              '&.Mui-selected': {
                background: HEADER_GRADIENT,
                color: '#fff',
                '&:hover': {
                  background: HEADER_GRADIENT,
                  opacity: 0.9
                }
              }
            }
          }}
        >
          <ToggleButton value="leave">
            Leave Types
          </ToggleButton>
          <ToggleButton value="holiday">
            Holidays
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          fontWeight="600" 
          sx={{ 
            color: TEXT_COLOR_MAIN,
            background: HEADER_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block'
          }}
        >
          {mode === "leave" ? "Leave Type Master" : "Holiday Master"}
        </Typography>
        <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
          {mode === "leave" 
            ? "Manage leave types and their configurations" 
            : "Manage holiday schedules and observances"}
        </Typography>
      </Box>

      {/* Action Bar */}
      <Paper sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 2,
        bgcolor: '#FFFFFF',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          {/* Search and Filters */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField
              placeholder={`Search ${mode === "leave" ? "leave types" : "holidays"}...`}
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ 
                width: { xs: '100%', sm: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&:hover fieldset': {
                    borderColor: PRIMARY_BLUE,
                  },
                }
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
                sx: { 
                  height: 40,
                  bgcolor: '#f8fafc',
                  '& input': {
                    padding: '8px 12px',
                    fontSize: '0.875rem'
                  }
                }
              }}
              disabled={loading}
            />
            
            {/* <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleFilterActive}
              sx={{ 
                height: 40,
                borderRadius: 1.5,
                borderColor: '#cbd5e1',
                color: '#475569',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  borderColor: PRIMARY_BLUE,
                  bgcolor: alpha(PRIMARY_BLUE, 0.04)
                }
              }}
              disabled={loading}
            >
              Active Only
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<SortIcon />}
              onClick={() => handleSort(mode === "leave" ? "Name" : "Title")}
              sx={{ 
                height: 40,
                borderRadius: 1.5,
                borderColor: '#cbd5e1',
                color: '#475569',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  borderColor: PRIMARY_BLUE,
                  bgcolor: alpha(PRIMARY_BLUE, 0.04)
                }
              }}
              disabled={loading}
            >
              Sort {sortConfig.direction === "asc" ? "A-Z" : "Z-A"}
            </Button> */}

            {isFilterActive && (
              <Button
                variant="text"
                onClick={handleResetFilter}
                sx={{ 
                  height: 40,
                  borderRadius: 1.5,
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: alpha(PRIMARY_BLUE, 0.04)
                  }
                }}
                disabled={loading}
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
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                sx={{ 
                  height: 40,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderColor: '#EF4444',
                  color: '#EF4444',
                  '&:hover': {
                    borderColor: '#DC2626',
                    bgcolor: alpha('#EF4444', 0.04)
                  }
                }}
                disabled={loading}
              >
                Delete ({selected.length})
              </Button>
            )}
            
            {/* <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ 
                height: 40,
                borderRadius: 1.5,
                borderColor: '#cbd5e1',
                color: '#475569',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  borderColor: PRIMARY_BLUE,
                  bgcolor: alpha(PRIMARY_BLUE, 0.04)
                }
              }}
              disabled={loading}
            >
              Export
            </Button> */}
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAdd(true)}
              sx={{
                height: 40,
                borderRadius: 1.5,
                background: HEADER_GRADIENT,
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  opacity: 0.9,
                  background: HEADER_GRADIENT,
                }
              }}
              disabled={loading}
            >
              Add {mode === "leave" ? "Leave Type" : "Holiday"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Table */}
      <Paper sx={{ 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: HEADER_GRADIENT,
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                  color: TEXT_COLOR_HEADER,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  py: 2
                }
              }}>
                {/* Checkbox column */}
                <TableCell padding="checkbox" sx={{ width: 60 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedData.length}
                    checked={paginatedData.length > 0 && selected.length === paginatedData.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: TEXT_COLOR_HEADER,
                      '&.Mui-checked': {
                        color: TEXT_COLOR_HEADER,
                      },
                      '&.MuiCheckbox-indeterminate': {
                        color: TEXT_COLOR_HEADER,
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 20
                      }
                    }}
                    disabled={loading || paginatedData.length === 0}
                  />
                </TableCell>
                
                <TableCell>
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={0.5}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleSort(mode === "leave" ? "Name" : "Title")}
                  >
                    {mode === "leave" ? "Leave Name" : "Holiday Title"}
                    <ArrowUpwardIcon 
                      sx={{ 
                        fontSize: 14, 
                        color: TEXT_COLOR_HEADER, 
                        opacity: sortConfig.field === (mode === "leave" ? "Name" : "Title") ? 1 : 0.5,
                        transform: sortConfig.direction === "desc" && sortConfig.field === (mode === "leave" ? "Name" : "Title") ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s'
                      }} 
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={0.5}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleSort(mode === "leave" ? "MaxDaysPerYear" : "Date")}
                  >
                    {mode === "leave" ? "Max Days" : "Date"}
                    <ArrowUpwardIcon 
                      sx={{ 
                        fontSize: 14, 
                        color: TEXT_COLOR_HEADER, 
                        opacity: sortConfig.field === (mode === "leave" ? "MaxDaysPerYear" : "Date") ? 1 : 0.5,
                        transform: sortConfig.direction === "desc" && sortConfig.field === (mode === "leave" ? "MaxDaysPerYear" : "Date") ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s'
                      }} 
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={0.5}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleSort("CreatedAt")}
                  >
                    Created At
                    <ArrowUpwardIcon 
                      sx={{ 
                        fontSize: 14, 
                        color: TEXT_COLOR_HEADER, 
                        opacity: sortConfig.field === "CreatedAt" ? 1 : 0.5,
                        transform: sortConfig.direction === "desc" && sortConfig.field === "CreatedAt" ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s'
                      }} 
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={0.5}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleSort("UpdatedAt")}
                  >
                    Updated At
                    <ArrowUpwardIcon 
                      sx={{ 
                        fontSize: 14, 
                        color: TEXT_COLOR_HEADER, 
                        opacity: sortConfig.field === "UpdatedAt" ? 1 : 0.5,
                        transform: sortConfig.direction === "desc" && sortConfig.field === "UpdatedAt" ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s'
                      }} 
                    />
                  </Stack>
                </TableCell>
                <TableCell align="center" sx={{ width: 100 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                      Loading {mode === "leave" ? "leave types" : "holidays"}...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => {
                  const isSelected = selected.includes(item._id);
                  const isOddRow = index % 2 === 0;
                  const isActionMenuOpen = Boolean(actionAnchor) && 
                    selectedItem?._id === item._id;

                  return (
                    <TableRow
                      key={item._id}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: isOddRow ? STRIPE_COLOR_ODD : STRIPE_COLOR_EVEN,
                        '&:hover': {
                          bgcolor: HOVER_COLOR
                        },
                        '&.Mui-selected': {
                          bgcolor: alpha(PRIMARY_BLUE, 0.08),
                          '&:hover': {
                            bgcolor: alpha(PRIMARY_BLUE, 0.12)
                          }
                        }
                      }}
                    >
                      {/* Checkbox */}
                      <TableCell padding="checkbox" sx={{ width: 60 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(item._id)}
                          sx={{
                            color: PRIMARY_BLUE,
                            '&.Mui-checked': {
                              color: PRIMARY_BLUE,
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={500} color={TEXT_COLOR_MAIN}>
                          {mode === "leave" ? item.Name : (item.Title || item.Name)}
                        </Typography>
                        {item.Description && (
                          <Typography variant="caption" color="#64748B" display="block">
                            {item.Description}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        {mode === "leave" ? (
                          <Chip
                            label={`${item.MaxDaysPerYear || 0} days`}
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              backgroundColor: '#e0f2fe',
                              color: '#0c4a6e',
                              border: '1px solid #bae6fd'
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color={TEXT_COLOR_MAIN}>
                            {item.Date ? formatDate(item.Date) : '-'}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color={TEXT_COLOR_MAIN}>
                          {item.CreatedAt ? formatDate(item.CreatedAt) : '-'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color={TEXT_COLOR_MAIN}>
                          {item.UpdatedAt ? formatDate(item.UpdatedAt) : '-'}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <ActionMenu 
                          item={item}
                          onView={openViewModal}
                          onEdit={openEditModal}
                          onDelete={openDeleteModal}
                          anchorEl={isActionMenuOpen ? actionAnchor : null}
                          onClose={handleActionClose}
                          onOpen={(e) => handleActionOpen(e, item)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" color="#64748B" fontWeight={500}>
                        {searchTerm ? `No ${mode === "leave" ? "leave types" : "holidays"} found` : `No ${mode === "leave" ? "leave types" : "holidays"} available`}
                      </Typography>
                      <Typography variant="body2" color="#94A3B8" sx={{ mt: 1 }}>
                        {searchTerm ? 'Try adjusting your search terms' : `Add your first ${mode === "leave" ? "leave type" : "holiday"} to get started`}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid #e2e8f0',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
              color: '#64748B'
            },
            '& .MuiTablePagination-actions button': {
              color: PRIMARY_BLUE,
            }
          }}
        />
      </Paper>

      {/* Modals */}
      {mode === "leave" && (
        <>
          <AddLeaveTypes open={openAdd} onClose={handleAddClose} />
          <EditLeaveTypes 
            open={openEdit} 
            leaveType={selectedItem} 
            onClose={handleEditClose} 
          />
          <ViewLeaveTypes 
            open={openView} 
            leaveType={selectedItem} 
            onClose={handleViewClose}
            onEdit={() => {
              handleViewClose();
              setOpenEdit(true);
            }}
          />
          <DeleteLeaveTypes 
            open={openDelete} 
            leaveType={selectedItem} 
            onClose={handleDeleteClose} 
          />
        </>
      )}

      {mode === "holiday" && (
        <>
          <AddHoliday open={openAdd} onClose={handleAddClose} />
          <EditHoliday 
            open={openEdit} 
            holiday={selectedItem} 
            onClose={handleEditClose} 
          />
          <ViewHoliday 
            open={openView} 
            holiday={selectedItem} 
            onClose={handleViewClose}
            onEdit={() => {
              handleViewClose();
              setOpenEdit(true);
            }}
          />
          <DeleteHoliday 
            open={openDelete} 
            holiday={selectedItem} 
            onClose={handleDeleteClose} 
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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeaveTypeMaster;