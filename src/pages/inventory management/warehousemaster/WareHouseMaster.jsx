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
  FormControl,
  InputLabel,
  Select,
  Grid,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Warehouse as WarehouseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddWareHouse from './AddWareHouse';
import ViewWareHouse from './ViewWareHouse';
import EditWareHouse from './EditWareHouse';
import DeleteWareHouse from './DeleteWareHouse';
import WareHouseReport from './WareHouseReport';

// ==================== COLORS ====================
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F',
  },
  border: '#E3E8EF',
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
  }
};

// Status options
const WAREHOUSE_STATUS_OPTIONS = ['Active', 'Inactive'];

// Warehouse Type Colors
const getWarehouseTypeColor = (type) => {
  const colors = {
    'Raw Material': { bg: '#FEF3C7', color: '#D97706' },
    'Finished Goods': { bg: '#D1FAE5', color: '#059669' },
    'WIP': { bg: '#E0E7FF', color: '#4F46E5' },
    'Consumable': { bg: '#FCE7F3', color: '#DB2777' },
    'Subcontract': { bg: '#FEE2E2', color: '#DC2626' },
    'Tool': { bg: '#E9F5E9', color: '#2E7D32' },
    'Scrap': { bg: '#F1F5F9', color: '#475569' },
    'Quarantine': { bg: '#FEE2E2', color: '#DC2626' }
  };
  return colors[type] || { bg: '#F1F5F9', color: '#475569' };
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

// ==================== ACTION MENU COMPONENT ====================
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onStatusUpdate, permissions }) => {
  const canView = hasPermission(permissions, MODULES.WAREHOUSE_MASTER, PAGES.WAREHOUSE_MASTER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.WAREHOUSE_MASTER, PAGES.WAREHOUSE_MASTER, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.WAREHOUSE_MASTER, PAGES.WAREHOUSE_MASTER, ACTIONS.DELETE);
  const canUpdateStatus = hasPermission(permissions, MODULES.WAREHOUSE_MASTER, PAGES.WAREHOUSE_MASTER, ACTIONS.UPDATE);

  // If no actions available, don't render the menu
  if (!canView && !canUpdate && !canDelete && !canUpdateStatus) {
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
          }
        }}
      >
        {canView && (
          <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                View Details
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canUpdate && (
          <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                Edit
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canUpdateStatus && (
          <MenuItem onClick={() => { onStatusUpdate(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#F59E0B' }}>
                Update Status
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {(canView || canUpdate || canUpdateStatus) && canDelete && <Divider sx={{ my: 0.5 }} />}
        
        {canDelete && (
          <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#EF4444' }}>
                Delete
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

// ==================== STATUS UPDATE MODAL ====================
const StatusUpdateModal = ({ open, onClose, warehouse, onStatusUpdate, loading }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (open && warehouse) {
      setSelectedStatus(warehouse.is_active ? 'Active' : 'Inactive');
      setError('');
    }
  }, [open, warehouse]);
  
  const handleSubmit = () => {
    if (!selectedStatus) {
      setError('Please select a status');
      return;
    }
    onStatusUpdate(selectedStatus);
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
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Update Warehouse Status
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" sx={{ color: COLORS.text.tertiary }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5 }}>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 2 }}>
          Warehouse: <strong>{warehouse?.warehouse_name} ({warehouse?.warehouse_id})</strong>
        </Typography>
        
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
          Current Status: 
          <Chip
            label={warehouse?.is_active ? 'Active' : 'Inactive'}
            size="small"
            sx={{ 
              ml: 1, 
              fontSize: '0.65rem', 
              height: 22,
              bgcolor: warehouse?.is_active ? COLORS.chips.active : COLORS.chips.inactive,
              color: warehouse?.is_active ? COLORS.primary : COLORS.text.secondary
            }}
          />
        </Typography>
        
        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel sx={{ fontSize: '0.75rem' }}>New Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setError(''); }}
            label="New Status"
            error={!!error}
            sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
          >
            <MenuItem value="Active" sx={{ fontSize: '0.75rem' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#059669' }} />
                <span>Active</span>
              </Stack>
            </MenuItem>
            <MenuItem value="Inactive" sx={{ fontSize: '0.75rem' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#DC2626' }} />
                <span>Inactive</span>
              </Stack>
            </MenuItem>
          </Select>
          {error && (
            <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
              {error}
            </Typography>
          )}
        </FormControl>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 2.5, 
        py: 1.5, 
        borderTop: `1px solid ${COLORS.border}`, 
        gap: 1 
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading} 
          sx={{ 
            height: 32, 
            px: 2, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedStatus || loading}
          sx={{ 
            height: 32, 
            px: 2, 
            borderRadius: 1.5, 
            bgcolor: COLORS.primary, 
            fontSize: '0.7rem',
            textTransform: 'none',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ==================== MAIN COMPONENT ====================
const WareHouseMaster = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedWarehouseForAction, setSelectedWarehouseForAction] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [openStatusUpdateModal, setOpenStatusUpdateModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

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
      MODULES.WAREHOUSE_MASTER,
      PAGES.WAREHOUSE_MASTER,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Warehouses
  const fetchWarehouses = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });
      
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`${BASE_URL}/api/warehouses?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setWarehouses(response.data.data || []);
        setTotalItems(response.data.pagination.total);
      } else {
        showNotification('Failed to load warehouses', 'error');
      }
    } catch (err) {
      console.error('Error:', err);
      showNotification('Failed to load warehouses', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchWarehouses();
    }
  }, [fetchWarehouses, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleSelectAll = (event) => {
    if (!canDelete) return;
    if (event.target.checked) {
      setSelected(warehouses.map(w => w._id));
    } else {
      setSelected([]);
    }
  };
  
  const handleSelect = (id) => {
    if (!canDelete) return;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selected, id];
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
  
  const handleAddWarehouse = () => {
    fetchWarehouses();
    showNotification('Warehouse added successfully!', 'success');
  };
  
  const handleEditWarehouse = () => {
    fetchWarehouses();
    showNotification('Warehouse updated successfully!', 'success');
  };
  
  const handleDeleteWarehouse = () => {
    fetchWarehouses();
    setSelected([]);
    showNotification('Warehouse deleted successfully!', 'success');
  };
  
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedWarehouse) return;
    
    setStatusLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const updatePayload = {
        warehouse_name: selectedWarehouse.warehouse_name,
        location: selectedWarehouse.location,
        warehouse_type: selectedWarehouse.warehouse_type,
        manager_id: selectedWarehouse.manager_id?._id || selectedWarehouse.manager_id || null,
        is_active: newStatus === 'Active'
      };
      
      const response = await axios.put(
        `${BASE_URL}/api/warehouses/${selectedWarehouse._id}`,
        updatePayload,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        showNotification(`Status updated to ${newStatus}!`, 'success');
        fetchWarehouses();
        setOpenStatusUpdateModal(false);
        setSelectedWarehouse(null);
      } else {
        showNotification(response.data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showNotification(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setStatusLoading(false);
    }
  };
  
  const handleActionMenuOpen = (event, warehouse) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedWarehouseForAction(warehouse);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedWarehouseForAction(null);
  };

  const openViewWarehouseModal = (warehouse) => {
    if (!canViewPage) return;
    setSelectedWarehouse(warehouse);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openEditWarehouseModal = (warehouse) => {
    if (!canUpdate) return;
    setSelectedWarehouse(warehouse);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteWarehouseDialog = (warehouse) => {
    if (!canDelete) return;
    setSelectedWarehouse(warehouse);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };
  
  const openReportModalFunc = () => {
    setOpenReportModal(true);
  };
  
  const openStatusUpdateModalFunc = (warehouse) => {
    if (!canUpdate) return;
    setSelectedWarehouse(warehouse);
    setOpenStatusUpdateModal(true);
    handleActionMenuClose();
  };
  
  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  
  const getWarehouseInitials = (warehouse) => {
    if (!warehouse.warehouse_name) return 'WH';
    return warehouse.warehouse_name.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (warehouse) => {
    if (!warehouse.warehouse_name) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = warehouse.warehouse_name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

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
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Warehouse Master
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage warehouses, track inventory, and monitor bin utilization
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
            placeholder="Search by Warehouse Name, ID, or Location..."
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ 
              width: { xs: '100%', sm: 450 },
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

          <Stack direction="row" spacing={1.5}>
            {canDelete && selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
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
              >
                Delete ({selected.length})
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<AssessmentIcon sx={{ fontSize: '1rem' }} />}
              onClick={openReportModalFunc}
              sx={{
                height: 36,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                borderColor: COLORS.primary,
                color: COLORS.primary,
                '&:hover': {
                  borderColor: COLORS.primaryDark,
                  bgcolor: COLORS.primaryLight
                }
              }}
            >
              Capacity Report
            </Button>
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
                Add Warehouse
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Table */}
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
                  py: 1.5,
                }
              }}>
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40, p:20 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < warehouses.length}
                      checked={warehouses.length > 0 && selected.length === warehouses.length}
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
                      disabled={loading || warehouses.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Warehouse Name / ID
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Location
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Bins
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Stock Qty
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Stock Value
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 8 : 7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', mt: 1 }}>Loading warehouses...</Typography>
                  </TableCell>
                </TableRow>
              ) : warehouses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 8 : 7} align="center" sx={{ py: 6 }}>
                    <WarehouseIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                    <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
                      {searchTerm ? 'No warehouses found' : 'No warehouses available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                warehouses.map((warehouse) => {
                  const isSelected = selected.includes(warehouse._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedWarehouseForAction?._id === warehouse._id;
                  const typeColors = getWarehouseTypeColor(warehouse.warehouse_type);
                  const utilization = warehouse.total_bins ? ((warehouse.active_bins || 0) / warehouse.total_bins) * 100 : 0;
                  
                  return (
                    <TableRow 
                      key={warehouse._id} 
                      hover 
                      selected={isSelected}
                      sx={{ 
                        '&:hover': { bgcolor: COLORS.background.hover },
                        '&.Mui-selected': {
                          bgcolor: `${COLORS.primary}10`,
                        }
                      }}
                    >
                      {canDelete && (
                        <TableCell padding="checkbox">
                          <Checkbox 
                            checked={isSelected} 
                            onChange={() => handleSelect(warehouse._id)}
                            sx={{ color: COLORS.primary }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(warehouse), fontSize: '0.7rem', fontWeight: 600 }}>
                            {getWarehouseInitials(warehouse)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{warehouse.warehouse_name}</Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>ID: {warehouse.warehouse_id}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={warehouse.warehouse_type || 'Standard'} 
                          size="small" 
                          sx={{ fontSize: '0.65rem', height: 24, bgcolor: typeColors.bg, color: typeColors.color }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>{warehouse.location || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{warehouse.active_bins || 0} / {warehouse.total_bins || 0}</Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(utilization, 100)} 
                          sx={{ width: 80, height: 3, mt: 0.5, borderRadius: 2, bgcolor: COLORS.border,
                            '& .MuiLinearProgress-bar': { bgcolor: COLORS.primary }
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{warehouse.total_stock_quantity?.toLocaleString() || 0}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#059669' }}>₹ {(warehouse.total_stock_value || 0).toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <ActionMenu
                          item={warehouse}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onOpen={(e) => handleActionMenuOpen(e, warehouse)}
                          onClose={handleActionMenuClose}
                          onView={openViewWarehouseModal}
                          onEdit={openEditWarehouseModal}
                          onDelete={openDeleteWarehouseDialog}
                          onStatusUpdate={openStatusUpdateModalFunc}
                          permissions={userPermissions}
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
            }
          }}
        />
      </Paper>

      {/* Modals - Conditionally render based on permissions */}
      {canCreate && (
        <AddWareHouse open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handleAddWarehouse} />
      )}
      
      {selectedWarehouse && (
        <>
          {canViewPage && (
            <ViewWareHouse open={openViewModal} onClose={() => { setOpenViewModal(false); setSelectedWarehouse(null); }} data={selectedWarehouse} />
          )}
          {canUpdate && (
            <>
              <EditWareHouse open={openEditModal} onClose={() => { setOpenEditModal(false); setSelectedWarehouse(null); }} data={selectedWarehouse} onUpdate={handleEditWarehouse} />
              <StatusUpdateModal open={openStatusUpdateModal} onClose={() => { setOpenStatusUpdateModal(false); setSelectedWarehouse(null); }} warehouse={selectedWarehouse} onStatusUpdate={handleStatusUpdate} loading={statusLoading} />
            </>
          )}
          {canDelete && (
            <DeleteWareHouse open={openDeleteDialog} onClose={() => { setOpenDeleteDialog(false); setSelectedWarehouse(null); }} data={selectedWarehouse} onDelete={handleDeleteWarehouse} />
          )}
        </>
      )}

      {/* Warehouse Report Modal */}
      <WareHouseReport open={openReportModal} onClose={() => setOpenReportModal(false)} />

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WareHouseMaster;