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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Build as BuildIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Engineering as EngineeringIcon,
  Construction as MaintenanceIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddTool from './AddTool';
import ViewTool from './ViewTool';
import DeleteTool from './DeleteTool';
import MaintenanceDialog from './MaintenanceDialog';

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
    Active: { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
    'Under Maintenance': { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
    Scrapped: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
    'In Use': { bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' },
    Retired: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' }
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

// Action Menu Component with Maintenance button - WITH PERMISSION CHECKS
const ActionMenu = ({ tool, onView, onEdit, onDelete, onMaintenance, anchorEl, onClose, onOpen, permissions, isSuperAdmin }) => {
  // Permission checks
  const canView = isSuperAdmin || hasPermission(permissions, MODULES.TOOL_MASTER, PAGES.TOOL_MASTER, ACTIONS.VIEW);
  const canUpdate = isSuperAdmin || hasPermission(permissions, MODULES.TOOL_MASTER, PAGES.TOOL_MASTER, ACTIONS.UPDATE);
  const canCreate = isSuperAdmin || hasPermission(permissions, MODULES.TOOL_MASTER, PAGES.TOOL_MASTER, ACTIONS.CREATE);
  const canDelete = isSuperAdmin || hasPermission(permissions, MODULES.TOOL_MASTER, PAGES.TOOL_MASTER, ACTIONS.DELETE);

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
        {/* View Details - VIEW permission */}
        {canView && (
          <MenuItem 
            onClick={() => {
              onView(tool);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                View Details
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {/* Edit - UPDATE permission */}
        {canUpdate && (
          <MenuItem 
            onClick={() => {
              onEdit(tool);
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

        {/* Maintenance - CREATE permission */}
        {canCreate && (
          <MenuItem 
            onClick={() => {
              onMaintenance(tool);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <MaintenanceIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>
                Maintenance
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        
        {/* Delete - DELETE permission */}
        {canDelete && (
          <MenuItem 
            onClick={() => {
              onDelete(tool);
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

// Usage Indicator Component
const UsageIndicator = ({ currentShots, maxShots }) => {
  const percentage = maxShots > 0 ? (currentShots / maxShots) * 100 : 0;
  const getColor = () => {
    if (percentage >= 90) return '#EF4444';
    if (percentage >= 75) return '#F59E0B';
    return '#10B981';
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>
          {currentShots.toLocaleString()} / {maxShots.toLocaleString()}
        </Typography>
        <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: getColor() }}>
          {percentage.toFixed(1)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(percentage, 100)}
        sx={{
          height: 4,
          borderRadius: 2,
          bgcolor: '#E5E7EB',
          '& .MuiLinearProgress-bar': {
            bgcolor: getColor(),
            borderRadius: 2
          }
        }}
      />
    </Box>
  );
};

const ToolMaster = () => {
  // State for data
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [toolTypeFilter, setToolTypeFilter] = useState('All');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedToolForAction, setSelectedToolForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMaintenanceDialog, setOpenMaintenanceDialog] = useState(false);
  
  // Selected tool
  const [selectedTool, setSelectedTool] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  
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

  // Ref for search debouncing
  const isSearchingRef = React.useRef(false);
  const searchTimeoutRef = React.useRef(null);

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
    if (isSuperAdmin) return true;
    return hasPermission(
      userPermissions,
      MODULES.TOOL_MASTER,
      PAGES.TOOL_MASTER,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    isSearchingRef.current = true;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
      setPage(0);
      isSearchingRef.current = false;
    }, 500);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setPage(0);
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

  // Fetch tools from API
  const fetchTools = useCallback(async () => {
    if (!canViewPage && !isSuperAdmin) return;

    if (!isSearchingRef.current) {
      setLoading(true);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/tool-master?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setTools(response.data.data || []);
        setFilteredTools(response.data.data || []);
        setPagination(response.data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
      } else {
        showNotification('Failed to load tools', 'error');
      }
    } catch (err) {
      console.error('Error fetching tools:', err);
      showNotification('Failed to load tools. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchTools();
    }
  }, [fetchTools, permissionsLoaded, canViewPage, isSuperAdmin]);

  // Handle refresh
  const handleRefresh = () => {
    fetchTools();
    showNotification('Data refreshed', 'success');
  };

  // Handle search and filters
  useEffect(() => {
    let filtered = [...tools];
    
    if (searchTerm) {
      const value = searchTerm.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.tool_code?.toLowerCase().includes(value) ||
        tool.tool_name?.toLowerCase().includes(value) ||
        tool.tool_type?.toLowerCase().includes(value) ||
        tool.produces_part_no?.toLowerCase().includes(value)
      );
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(tool => tool.status === statusFilter);
    }
    
    if (toolTypeFilter !== 'All') {
      filtered = filtered.filter(tool => tool.tool_type === toolTypeFilter);
    }
    
    setFilteredTools(filtered);
  }, [searchTerm, statusFilter, toolTypeFilter, tools]);

  // Handle selection - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    if (event.target.checked) {
      setSelected(filteredTools.map(tool => tool._id));
    } else {
      setSelected([]);
    }
  };

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };

  const handleActionMenuOpen = (event, tool) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedToolForAction(tool);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedToolForAction(null);
  };

  const openViewModalHandler = (tool) => {
    if (!canViewPage) {
      showNotification('You don\'t have permission to view tool details', 'error');
      return;
    }
    setSelectedTool(tool);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditModalHandler = (tool) => {
    if (!canUpdate) {
      showNotification('You don\'t have permission to edit tools', 'error');
      return;
    }
    setSelectedTool(tool);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openDeleteDialogHandler = (tool) => {
    if (!canDelete) {
      showNotification('You don\'t have permission to delete tools', 'error');
      return;
    }
    setSelectedTool(tool);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const openMaintenanceDialogHandler = (tool) => {
    if (!canCreate) {
      showNotification('You don\'t have permission to add maintenance records', 'error');
      return;
    }
    setSelectedTool(tool);
    setOpenMaintenanceDialog(true);
    handleActionMenuClose();
  };

  const handleAddSuccess = () => {
    setOpenAddModal(false);
    fetchTools();
    showNotification('Tool created successfully!', 'success');
  };

  const handleEditSuccess = () => {
    setOpenEditModal(false);
    setSelectedTool(null);
    fetchTools();
    showNotification('Tool updated successfully!', 'success');
  };

  const handleDeleteSuccess = () => {
    setOpenDeleteDialog(false);
    setSelectedTool(null);
    fetchTools();
    showNotification('Tool deleted successfully!', 'success');
  };

  const handleMaintenanceSuccess = () => {
    setOpenMaintenanceDialog(false);
    setSelectedTool(null);
    fetchTools();
    showNotification('Maintenance record added successfully!', 'success');
  };

  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Delete each selected tool
      for (const id of selected) {
        await axios.delete(`${BASE_URL}/api/tool-master/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      setSelected([]);
      fetchTools();
      showNotification(`${selected.length} tool(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete some tools', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const getStatusChip = (status) => {
    const colors = COLORS.status[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          fontSize: '0.65rem',
          fontWeight: 500,
          height: 24,
          bgcolor: colors.bg,
          color: colors.color,
          border: `1px solid ${colors.border}`
        }}
      />
    );
  };

  const getToolTypeChip = (toolType) => {
    const colors = {
      'Progressive Die': { bg: '#E0F2FE', color: '#0369A1' },
      'Blanking Die': { bg: '#D1FAE5', color: '#065F46' },
      'Forming Die': { bg: '#FEF3C7', color: '#B45309' },
      'Piercing Punch': { bg: '#F3E8FF', color: '#7E22CE' },
      'Bending Tool': { bg: '#FFE4E6', color: '#BE123C' },
      'Drawing Die': { bg: '#FCE7F3', color: '#BE185D' }
    };
    const style = colors[toolType] || { bg: '#F1F5F9', color: '#475569' };
    return (
      <Chip
        label={toolType}
        size="small"
        sx={{
          fontSize: '0.65rem',
          fontWeight: 500,
          height: 24,
          bgcolor: style.bg,
          color: style.color
        }}
      />
    );
  };

  // Get unique tool types for filter
  const uniqueToolTypes = ['All', ...new Set(tools.map(t => t.tool_type).filter(Boolean))];

  const paginatedTools = filteredTools.slice(
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
          Tool Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage tools, dies, fixtures, and track their usage and maintenance
        </Typography>
      </Box>

      {/* Filter and Action Bar */}
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
              placeholder="Search by tool code, name, part no..."
              size="small"
              value={searchInput}
              onChange={handleSearchChange}
              autoComplete="off"
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
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
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
            
            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ 
                width: 160,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                }
              }}
              SelectProps={{
                sx: { height: 36, fontSize: '0.75rem' }
              }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
              <MenuItem value="In Use">In Use</MenuItem>
              <MenuItem value="Scrapped">Scrapped</MenuItem>
              <MenuItem value="Retired">Retired</MenuItem>
            </TextField>
            
            <TextField
              select
              size="small"
              label="Tool Type"
              value={toolTypeFilter}
              onChange={(e) => setToolTypeFilter(e.target.value)}
              sx={{ 
                width: 180,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                }
              }}
              SelectProps={{
                sx: { height: 36, fontSize: '0.75rem' }
              }}
            >
              {uniqueToolTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Refresh Button */}
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: COLORS.text.secondary,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}20`
                  }
                }}
              >
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
            
            {/* Add Tool Button - CREATE permission */}
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
                Add Tool
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Tools Table */}
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
                {/* Checkbox Column - DELETE permission */}
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < filteredTools.length}
                      checked={filteredTools.length > 0 && selected.length === filteredTools.length}
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
                      disabled={loading || filteredTools.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Tool Code
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Tool Name
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Tool Type
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Produces Part No
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Usage
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
                  Bin Location
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
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading tools...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedTools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <BuildIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm || statusFilter !== 'All' || toolTypeFilter !== 'All' ? 'No tools found' : 'No tools available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm || statusFilter !== 'All' || toolTypeFilter !== 'All' ? 'Try adjusting your search terms' : 'Add your first tool'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTools.map((tool, index) => {
                  const isSelected = selected.includes(tool._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedToolForAction?._id === tool._id;
                  const needsMaintenance = tool.current_shots >= tool.next_maintenance_due_shots;
                  const needsReplacement = tool.current_shots >= tool.max_shots;

                  return (
                    <TableRow
                      key={tool._id || index}
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
                      {canDelete && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(tool._id)}
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
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar 
                            sx={{ 
                              width: 28, 
                              height: 28, 
                              bgcolor: COLORS.primaryLight,
                              color: COLORS.primary,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            <BuildIcon sx={{ fontSize: '0.8rem' }} />
                          </Avatar>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                            {tool.tool_code}
                          </Typography>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {tool.tool_name}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        {getToolTypeChip(tool.tool_type)}
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {tool.produces_part_no || '-'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <UsageIndicator 
                          currentShots={tool.current_shots || 0} 
                          maxShots={tool.max_shots || 0} 
                        />
                        {needsMaintenance && (
                          <Chip
                            label="Maintenance Due"
                            size="small"
                            icon={<WarningIcon sx={{ fontSize: '0.7rem' }} />}
                            sx={{
                              fontSize: '0.6rem',
                              fontWeight: 500,
                              height: 20,
                              mt: 0.5,
                              bgcolor: '#FEF3C7',
                              color: '#B45309'
                            }}
                          />
                        )}
                        {needsReplacement && (
                          <Chip
                            label="Replacement Due"
                            size="small"
                            icon={<WarningIcon sx={{ fontSize: '0.7rem' }} />}
                            sx={{
                              fontSize: '0.6rem',
                              fontWeight: 500,
                              height: 20,
                              mt: 0.5,
                              bgcolor: '#FEE2E2',
                              color: '#991B1B'
                            }}
                          />
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {getStatusChip(tool.status)}
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {tool.bin_location || '-'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          tool={tool}
                          onView={openViewModalHandler}
                          onEdit={openEditModalHandler}
                          onDelete={openDeleteDialogHandler}
                          onMaintenance={openMaintenanceDialogHandler}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, tool)}
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
          count={filteredTools.length}
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

      {/* Modal Components - With Permission Checks */}
      {canCreate && (
        <AddTool 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {selectedTool && (
        <>
          {/* Edit Modal - UPDATE permission */}
          {canUpdate && (
            <AddTool 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedTool(null);
              }}
              onSuccess={handleEditSuccess}
              initialData={selectedTool}
              isEditMode={true}
            />
          )}

          {/* View Modal - VIEW permission */}
          {canViewPage && (
            <ViewTool 
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedTool(null);
              }}
              tool={selectedTool}
            />
          )}

          {/* Delete Dialog - DELETE permission */}
          {canDelete && (
            <DeleteTool 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedTool(null);
              }}
              tool={selectedTool}
              onDelete={handleDeleteSuccess}
            />
          )}

          {/* Maintenance Dialog - CREATE permission */}
          {canCreate && (
            <MaintenanceDialog
              open={openMaintenanceDialog}
              onClose={() => {
                setOpenMaintenanceDialog(false);
                setSelectedTool(null);
              }}
              tool={selectedTool}
              onSuccess={handleMaintenanceSuccess}
            />
          )}
        </>
      )}

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

export default ToolMaster;