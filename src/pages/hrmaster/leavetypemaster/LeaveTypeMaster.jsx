import React, { useState, useEffect } from 'react';
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
  ToggleButton,
  ToggleButtonGroup
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
  BeachAccess as BeachAccessIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// Import modal components
import AddLeaveTypes from './AddLeaveTypes';
import EditLeaveTypes from './EditLeaveTypes';
import ViewLeaveTypes from './ViewLeaveTypes';
import DeleteLeaveTypes from './DeleteLeaveTypes';
import AddHoliday from './AddHoliday';
import EditHoliday from './EditHoliday';
import ViewHoliday from './ViewHoliday';
import DeleteHoliday from './DeleteHoliday';

// Color constants - Single color #063C3F throughout (matching CompanyMaster)
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

// Action Menu Component with permission checks
const ActionMenu = ({ item, onView, onEdit, onDelete, anchorEl, onClose, onOpen, permissions, mode }) => {
  const moduleKey = mode === 'leave' ? MODULES.LEAVE_TYPE_MASTER : MODULES.LEAVE_TYPE_MASTER;
  const pageKey = mode === 'leave' ? PAGES.LEAVE_POLICIES : PAGES.LEAVE_POLICIES;
  
  const canView = hasPermission(permissions, moduleKey, pageKey, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, moduleKey, pageKey, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, moduleKey, pageKey, ACTIONS.DELETE);

  // If no actions available, don't render the menu
  if (!canView && !canUpdate && !canDelete) {
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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {canView && (
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
        )}
        
        {canUpdate && (
          <MenuItem 
            onClick={() => {
              onEdit(item);
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
        
        {(canView || canUpdate) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
        
        {canDelete && (
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
        )}
      </Menu>
    </>
  );
};

const LeaveTypeMaster = () => {
  // Mode state (Leave Types or Holidays)
  const [mode, setMode] = useState('leave'); // 'leave' or 'holiday'
  
  // State for data
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedItemForAction, setSelectedItemForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Selected item
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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
          
          // Set permissions array
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
    // Super admin has all permissions
    if (isSuperAdmin) return true;
    
    return hasPermission(
      userPermissions,
      MODULES.LEAVE_TYPE_MASTER,
      PAGES.LEAVE_POLICIES,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
useEffect(() => {
  handleSearch();
}, [searchTerm, data]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch data when mode changes - only if user has permission
  useEffect(() => {
  if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
    fetchData();   // ✅ only once
  }
}, [permissionsLoaded, canViewPage, isSuperAdmin, mode]);

 const fetchData = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');

    const params = new URLSearchParams();
    params.append('page', page + 1);
    params.append('limit', rowsPerPage);

    if (searchTerm) params.append('search', searchTerm);

    const endpoint =
      mode === 'leave'
        ? `${BASE_URL}/api/leavetypes`
        : `${BASE_URL}/api/holidays`;

    const response = await axios.get(
      `${endpoint}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.success) {
      const formattedData = (response.data.data || []).map(item => ({
        ...item,
        name: item.name || item.Name || item.title || '',
        description: item.description || item.Description || '',
        max_days: item.max_days || item.MaxDaysPerYear || 0,
        date: item.date || item.Date || '',
        is_active: item.is_active ?? true
      }));

      setData(formattedData);
      setFilteredData(formattedData); // ✅ server-side filtering

    } else {
      showNotification('Failed to load data', 'error');
    }

  } catch (err) {
    console.error('Error fetching data:', err);
    showNotification('Failed to load data. Please try again.', 'error');
  } finally {
    setLoading(false);
  }
};

const handleSearch = () => {
  if (!searchTerm) {
    setFilteredData(data);
    return;
  }

  const value = searchTerm.toLowerCase();

  const filtered = data.filter(item =>
    item.name?.toLowerCase().includes(value) ||
    item.description?.toLowerCase().includes(value)
  );

  setFilteredData(filtered);
};
  
  // Handle refresh
  const handleRefresh = () => {
    fetchData();
    showNotification('Data refreshed', 'success');
  };
  
  // Handle mode change
  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  
  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(filteredData.map(item => item._id));
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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };
  
  // Handle add item - INSTANT UPDATE
  const handleAddItem = (newItemFromBackend) => {
    const formattedItem = {
      ...newItemFromBackend,
      _id: newItemFromBackend._id,
      name: newItemFromBackend.name || newItemFromBackend.Name || newItemFromBackend.title || '',
      description: newItemFromBackend.description || newItemFromBackend.Description || '',
      max_days: newItemFromBackend.max_days || newItemFromBackend.MaxDaysPerYear || 0,
      date: newItemFromBackend.date || newItemFromBackend.Date || '',
      is_active: newItemFromBackend.is_active ?? true
    };

    // Add instantly to table (top position)
    setData((prev) => [formattedItem, ...prev]);
    setFilteredData((prev) => [formattedItem, ...prev]);
    setPage(0);

    showNotification(
      `${mode === 'leave' ? 'Leave Type' : 'Holiday'} added successfully!`,
      'success'
    );
  };
  
  // Handle edit item - INSTANT UPDATE
  const handleEditItem = (updatedItemFromBackend) => {
    const formattedItem = {
      ...updatedItemFromBackend,
      _id: updatedItemFromBackend._id,
      name: updatedItemFromBackend.name || updatedItemFromBackend.Name || updatedItemFromBackend.title || '',
      description: updatedItemFromBackend.description || updatedItemFromBackend.Description || '',
      max_days: updatedItemFromBackend.max_days || updatedItemFromBackend.MaxDaysPerYear || 0,
      date: updatedItemFromBackend.date || updatedItemFromBackend.Date || '',
      is_active: updatedItemFromBackend.is_active ?? true
    };

    // Update main data
    setData((prev) =>
      prev.map((item) =>
        item._id === formattedItem._id ? formattedItem : item
      )
    );

    // Update filtered data
    setFilteredData((prev) =>
      prev.map((item) =>
        item._id === formattedItem._id ? formattedItem : item
      )
    );

    showNotification(
      `${mode === 'leave' ? 'Leave Type' : 'Holiday'} updated successfully!`,
      'success'
    );
  };
  
  // Handle delete item - INSTANT UPDATE
  const handleDeleteItem = (itemId) => {
    // Remove from data array
    const updatedData = data.filter(item => item._id !== itemId);
    setData(updatedData);
    
    // Remove from selected if present
    setSelected(selected.filter(id => id !== itemId));
    
    showNotification(`${mode === 'leave' ? 'Leave Type' : 'Holiday'} deleted successfully!`, 'success');
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (!canDelete) return;
    showNotification('Bulk delete requires API implementation', 'warning');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, item) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedItemForAction(item);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedItemForAction(null);
  };
  
  // Open edit modal
  const openEditModalHandler = (item) => {
    if (!canUpdate) return;
    setSelectedItem(item);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  // Open view modal
  const openViewModalHandler = (item) => {
    if (!canViewPage) return;
    setSelectedItem(item);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteDialogHandler = (item) => {
    if (!canDelete) return;
    setSelectedItem(item);
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
  
  // Get item initials for avatar
  const getItemInitials = (itemName) => {
    if (!itemName) return mode === 'leave' ? 'L' : 'H';
    
    const words = itemName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return itemName.substring(0, 2).toUpperCase();
  };
  
  // Get avatar color based on item name
  const getAvatarColor = (itemName) => {
    if (!itemName) return COLORS.primary;
    
    const colors = [
      COLORS.primary,
      COLORS.primaryDark,
      '#074346',
      '#0D696C',
      '#128C7E'
    ];
    
    const charCode = itemName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  // Paginated data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
      {/* Mode Toggle */}
      <Box sx={{ mb: 2.5 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          sx={{
            '& .MuiToggleButton-root': {
              height: 36,
              px: 3,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.75rem',
              borderColor: COLORS.border,
              color: COLORS.text.secondary,
              '&.Mui-selected': {
                bgcolor: COLORS.primary,
                color: COLORS.text.light,
                '&:hover': {
                  bgcolor: COLORS.primaryDark,
                }
              }
            }
          }}
        >
          <ToggleButton value="leave">
            <BeachAccessIcon sx={{ fontSize: '1rem', mr: 1 }} />
            Leave Types
          </ToggleButton>
          <ToggleButton value="holiday">
            <EventIcon sx={{ fontSize: '1rem', mr: 1 }} />
            Holidays
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

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
          {mode === 'leave' ? 'Leave Type Master' : 'Holiday Master'}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          {mode === 'leave' 
            ? 'Manage and organize leave types and their configurations' 
            : 'Manage and organize holiday schedules and observances'}
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
          {/* Search */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder={`Search ${mode === 'leave' ? 'leave types' : 'holidays'}...`}
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 360 },
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
          </Stack>

          {/* Action Buttons - Conditionally rendered based on permissions */}
          <Stack direction="row" spacing={1.5} alignItems="center">
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
            
            {/* Add Button - Only show if user has create permission */}
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
                Add {mode === 'leave' ? 'Leave Type' : 'Holiday'}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Data Table */}
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
                {/* Checkbox Column - Only show if user has delete permission */}
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < filteredData.length}
                      checked={filteredData.length > 0 && selected.length === filteredData.length}
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
                      disabled={loading || filteredData.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  {mode === 'leave' ? 'Leave Type' : 'Holiday'}
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Description
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  {mode === 'leave' ? 'Max Days' : 'Date'}
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
                  <TableCell colSpan={canDelete ? 7 : 6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading {mode === 'leave' ? 'leave types' : 'holidays'}...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 7 : 6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No items found' : `No ${mode === 'leave' ? 'leave types' : 'holidays'} available`}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : `Add your first ${mode === 'leave' ? 'leave type' : 'holiday'} to get started`}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => {
                  const isSelected = selected.includes(item._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedItemForAction?._id === item._id;
                  const avatarColor = getAvatarColor(item.name);

                  return (
                    <TableRow
                      key={item._id || index}
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
                      {/* Checkbox Column - Only show if user has delete permission */}
                      {canDelete && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
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
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: avatarColor,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            {getItemInitials(item.name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {item.name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              ID: {item._id?.slice(-6) || 'N/A'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {item.description || 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {mode === 'leave' ? (
                          <Chip
                            label={`${item.max_days || 0} days`}
                            size="small"
                            sx={{ 
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              bgcolor: COLORS.primaryLight,
                              color: COLORS.primary,
                              height: 20
                            }}
                          />
                        ) : (
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {item.date ? formatDate(item.date) : '-'}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.is_active ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            bgcolor: item.is_active ? COLORS.chips.active : COLORS.chips.inactive,
                            color: item.is_active ? COLORS.primary : COLORS.text.secondary,
                            height: 20
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={item}
                          onView={openViewModalHandler}
                          onEdit={openEditModalHandler}
                          onDelete={openDeleteDialogHandler}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, item)}
                          permissions={userPermissions}
                          mode={mode}
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
          count={filteredData.length}
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

      {/* Modal Components - Leave Types - Only render if user has appropriate permissions */}
      {mode === 'leave' && (
        <>
          {canCreate && (
            <AddLeaveTypes 
              open={openAddModal}
              onClose={() => setOpenAddModal(false)}
              onAdd={handleAddItem}
            />
          )}

          {selectedItem && (
            <>
              {canUpdate && (
                <EditLeaveTypes 
                  open={openEditModal}
                  onClose={() => {
                    setOpenEditModal(false);
                    setSelectedItem(null);
                  }}
                  leaveType={selectedItem}
                  onUpdate={handleEditItem}
                />
              )}

              {canViewPage && (
                <ViewLeaveTypes 
                  open={openViewModal}
                  onClose={() => {
                    setOpenViewModal(false);
                    setSelectedItem(null);
                  }}
                  leaveType={selectedItem}
                  onEdit={() => {
                    if (canUpdate) {
                      setOpenViewModal(false);
                      setOpenEditModal(true);
                    }
                  }}
                />
              )}

              {canDelete && (
                <DeleteLeaveTypes 
                  open={openDeleteDialog}
                  onClose={() => {
                    setOpenDeleteDialog(false);
                    setSelectedItem(null);
                  }}
                  leaveType={selectedItem}
                  onDelete={handleDeleteItem}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Modal Components - Holidays - Only render if user has appropriate permissions */}
      {mode === 'holiday' && (
        <>
          {canCreate && (
            <AddHoliday 
              open={openAddModal}
              onClose={() => setOpenAddModal(false)}
              onAdd={handleAddItem}
            />
          )}

          {selectedItem && (
            <>
              {canUpdate && (
                <EditHoliday 
                  open={openEditModal}
                  onClose={() => {
                    setOpenEditModal(false);
                    setSelectedItem(null);
                  }}
                  holiday={selectedItem}
                  onUpdate={handleEditItem}
                />
              )}

              {canViewPage && (
                <ViewHoliday 
                  open={openViewModal}
                  onClose={() => {
                    setOpenViewModal(false);
                    setSelectedItem(null);
                  }}
                  holiday={selectedItem}
                  onEdit={() => {
                    if (canUpdate) {
                      setOpenViewModal(false);
                      setOpenEditModal(true);
                    }
                  }}
                />
              )}

              {canDelete && (
                <DeleteHoliday 
                  open={openDeleteDialog}
                  onClose={() => {
                    setOpenDeleteDialog(false);
                    setSelectedItem(null);
                  }}
                  holiday={selectedItem}
                  onDelete={handleDeleteItem}
                />
              )}
            </>
          )}
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
export default LeaveTypeMaster;