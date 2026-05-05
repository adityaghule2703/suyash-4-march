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
 
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Route as RouteIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Verified as VerifiedIcon,
  PlayArrow as PlayArrowIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddRouting from './AddRouting';
import ViewRouting from './ViewRouting';
import EditRouting from './EditRouting';
import ApproveRouting from './ApproveRouting';
import DeleteRouting from './DeleteRouting';
import RejectRouting from './RejectRouting';
import ActivateRouting from './ActivateRouting';

const COLORS = {
  primary: '#1976D2',
  primaryDark: '#05292B',
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  border: '#E5E7EB',
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
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
};

const ROUTING_TYPE_OPTIONS = ['All', 'Stamping', 'Busbar', 'Gasket', 'Assembly', 'Toolroom', 'General'];
const STATUS_OPTIONS = ['All', 'Planned', 'In Progress', 'Completed', 'Postponed', 'Cancelled'];

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

// Action Menu Component - WITH CORRECT PERMISSIONS
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onApprove, onActivate, onReject, permissions, isSuperAdmin }) => {
  const canView = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.ROUTING_MASTER, ACTIONS.VIEW);
  const canUpdate = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.ROUTING_MASTER, ACTIONS.UPDATE);
  const canCreate = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.ROUTING_MASTER, ACTIONS.CREATE);
  const canDelete = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.ROUTING_MASTER, ACTIONS.DELETE);
  const canApprovePermission = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.ROUTING_MASTER, ACTIONS.APPROVE);
  const canRejectPermission = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.ROUTING_MASTER, ACTIONS.REJECT);

  const status = item?.status;

  const showActivate = (status === 'Draft' || status === 'Rejected') && canCreate;
  const showApprove = status === 'Active' && canApprovePermission;
  const showReject = (status === 'Active' || status === 'Approved') && canRejectPermission;

  // No actions for Inactive
  if (status === 'Inactive') return null;

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
          <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
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

        {/* Edit - UPDATE permission (only for Draft) */}
        {canUpdate && status === 'Draft' && (
          <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
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

        {/* Activate - CREATE permission */}
        {showActivate && (
          <MenuItem onClick={() => { onActivate(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <PlayArrowIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Activate
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Approve - APPROVE permission */}
        {showApprove && (
          <MenuItem onClick={() => { onApprove(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#059669', minWidth: 36 }}>
              <VerifiedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#059669', fontSize: '0.75rem' }}>
                Approve
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Reject - REJECT permission */}
        {showReject && (
          <MenuItem onClick={() => { onReject(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
              <CancelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#EF4444', fontSize: '0.75rem' }}>
                Reject
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />

        {/* Delete - DELETE permission */}
        {canDelete && (
          <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
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

// Delete Confirmation Dialog
const DeleteRoutingDialog = ({ open, onClose, routing, onConfirm, loading }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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
          Delete Routing
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Alert severity="warning" sx={{ borderRadius: 1.5, fontSize: '0.75rem', mb: 2 }}>
          This action cannot be undone.
        </Alert>

        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 1 }}>
          Are you sure you want to delete this routing?
        </Typography>

        <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing Name</Typography>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>{routing?.routing_name}</Typography>

          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 1 }}>Routing ID</Typography>
          <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.secondary }}>{routing?.routing_id}</Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
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
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.error,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: '#B71C1C' }
          }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RoutingMaster = () => {
  const [routings, setRoutings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRoutingForAction, setSelectedRoutingForAction] = useState(null);
  const [selectedRouting, setSelectedRouting] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Filter states
  const [routingTypeFilter, setRoutingTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openActivateModal, setOpenActivateModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

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

  // Check permission helper - USING CORRECT MODULE AND PAGE
  const checkPermission = (action) => {
    if (isSuperAdmin) return true;
    return hasPermission(
      userPermissions,
      MODULES.BOM_MASTER,
      PAGES.ROUTING_MASTER,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canApprove = checkPermission(ACTIONS.APPROVE);
  const canReject = checkPermission(ACTIONS.REJECT);

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

  // Fetch Routings from API
  const fetchRoutings = useCallback(async () => {
    if (!canViewPage && !isSuperAdmin) return;

    if (!isSearchingRef.current) {
      setLoading(true);
    }

    try {
      const token = localStorage.getItem('token');

      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (routingTypeFilter && routingTypeFilter !== 'All') {
        params.append('routing_type', routingTypeFilter);
      }

      if (statusFilter && statusFilter !== 'All') {
        params.append('status', statusFilter);
      }

      const response = await axios.get(`${BASE_URL}/api/routings?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setRoutings(response.data.data || []);
        setTotalItems(response.data.pagination?.total || response.data.data.length);
      } else {
        showNotification('Failed to load routings', 'error');
      }
    } catch (err) {
      console.error('Error fetching routings:', err);
      showNotification('Failed to load routings', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, routingTypeFilter, statusFilter, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchRoutings();
    }
  }, [fetchRoutings, permissionsLoaded, canViewPage, isSuperAdmin]);

  // Handle refresh
  const handleRefresh = () => {
    fetchRoutings();
    showNotification('Data refreshed', 'success');
  };

  // Handle selection - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    if (event.target.checked) {
      setSelected(routings.map(routing => routing._id));
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

  const handleAddSuccess = () => {
    fetchRoutings();
    showNotification('Routing added successfully!', 'success');
  };

  const handleEditSuccess = () => {
    fetchRoutings();
    showNotification('Routing updated successfully!', 'success');
  };

  const handleDeleteSuccess = () => {
    fetchRoutings();
    setSelected([]);
    showNotification('Routing deleted successfully!', 'success');
  };

  const handleApproveSuccess = () => {
    fetchRoutings();
    showNotification('Routing approved successfully!', 'success');
  };

  const handleActionMenuOpen = (event, routing) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRoutingForAction(routing);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRoutingForAction(null);
  };

  const openViewRoutingModal = (routing) => {
    if (!canViewPage) {
      showNotification('You don\'t have permission to view routing details', 'error');
      return;
    }
    setSelectedRouting(routing);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditRoutingModal = (routing) => {
    if (!canUpdate) {
      showNotification('You don\'t have permission to edit routings', 'error');
      return;
    }
    setSelectedRouting(routing);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openApproveRoutingModal = (routing) => {
    if (!canApprove) {
      showNotification('You don\'t have permission to approve routings', 'error');
      return;
    }
    setSelectedRouting(routing);
    setOpenApproveModal(true);
    handleActionMenuClose();
  };

  const openDeleteRoutingDialog = (routing) => {
    if (!canDelete) {
      showNotification('You don\'t have permission to delete routings', 'error');
      return;
    }
    setSelectedRouting(routing);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const openActivateRoutingModal = (routing) => {
    if (!canCreate) {
      showNotification('You don\'t have permission to activate routings', 'error');
      return;
    }
    setSelectedRouting(routing);
    setOpenActivateModal(true);
    handleActionMenuClose();
  };

  const openRejectRoutingModal = (routing) => {
    if (!canReject) {
      showNotification('You don\'t have permission to reject routings', 'error');
      return;
    }
    setSelectedRouting(routing);
    setOpenRejectModal(true);
    handleActionMenuClose();
  };

  const handleActivateSuccess = () => {
    fetchRoutings();
    showNotification('Routing activated successfully!', 'success');
  };

  const handleRejectSuccess = () => {
    fetchRoutings();
    showNotification('Routing rejected successfully!', 'success');
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/api/routings/${selectedRouting._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        handleDeleteSuccess();
        setOpenDeleteDialog(false);
        setSelectedRouting(null);
      } else {
        let errorMessage = response.data.message || 'Failed to delete routing';

        if (response.data.work_order) {
          errorMessage = `${response.data.message}\nWork Order: ${response.data.work_order.wo_number} (${response.data.work_order.status})`;
        }

        showNotification(errorMessage, 'error');
      }
    } catch (err) {
      console.error('Error deleting routing:', err);

      let errorMessage = 'Failed to delete routing';

      if (err.response?.data) {
        errorMessage = err.response.data.message || errorMessage;

        if (err.response.data.work_order) {
          errorMessage = `${err.response.data.message}\nWork Order: ${err.response.data.work_order.wo_number} (${err.response.data.work_order.status})`;
        }
      }

      showNotification(errorMessage, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/routings/bulk-delete`,
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setSelected([]);

      if (routings.length === selected.length && page > 0) {
        setPage(prev => prev - 1);
      }
      fetchRoutings();
      showNotification(`${selected.length} routing(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete routings', 'error');
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoutingInitials = (routing) => {
    if (!routing.routing_name) return 'RT';
    return routing.routing_name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (routing) => {
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = (routing.routing_id?.charCodeAt(0) || 0);
    return colors[charCode % colors.length];
  };

  const getRoutingTypeColor = (type) => {
    const colors = {
      Stamping: { bg: '#FEF3C7', color: '#D97706' },
      Busbar: { bg: '#DBEAFE', color: '#1E40AF' },
      Gasket: { bg: '#E0E7FF', color: '#4F46E5' },
      Assembly: { bg: '#D1FAE5', color: '#059669' },
      Toolroom: { bg: '#FEE2E2', color: '#DC2626' },
      General: { bg: '#F1F5F9', color: '#475569' }
    };
    return colors[type] || { bg: '#F1F5F9', color: '#475569' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' };
      case 'Draft':
        return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' };
      case 'Active':
        return { bg: '#DBEAFE', color: '#1E40AF', border: '#BFDBFE' };
      case 'Rejected':
        return { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' };
      case 'Inactive':
        return { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
      default:
        return { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircleIcon sx={{ fontSize: '0.8rem', color: '#059669' }} />;
      case 'Draft':
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#D97706' }} />;
      case 'Active':
        return <PlayArrowIcon sx={{ fontSize: '0.8rem', color: '#1E40AF' }} />;
      case 'Rejected':
        return <CancelIcon sx={{ fontSize: '0.8rem', color: '#DC2626' }} />;
      case 'Inactive':
        return <BlockIcon sx={{ fontSize: '0.8rem', color: '#475569' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#4F46E5' }} />;
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setRoutingTypeFilter('All');
    setStatusFilter('All');
    setPage(0);
    isSearchingRef.current = false;
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
          Routing Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage production routings, operations sequences, and process flows
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
          {/* Search and Filters Row */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by routing name, type..."
              size="small"
              value={searchInput}
              onChange={handleSearchChange}
              autoComplete="off"
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

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ fontSize: '0.75rem' }}>Routing Type</InputLabel>
              <Select
                value={routingTypeFilter}
                onChange={(e) => setRoutingTypeFilter(e.target.value)}
                label="Routing Type"
                sx={{ height: 36, fontSize: '0.75rem', borderRadius: 1.5 }}
              >
                {ROUTING_TYPE_OPTIONS.map(type => (
                  <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ fontSize: '0.75rem' }}>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                sx={{ height: 36, fontSize: '0.75rem', borderRadius: 1.5 }}
              >
                {STATUS_OPTIONS.map(status => (
                  <MenuItem key={status} value={status} sx={{ fontSize: '0.75rem' }}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              size="small"
              onClick={clearFilters}
              disabled={loading}
              sx={{
                height: 36,
                textTransform: 'none',
                fontSize: '0.7rem',
                borderRadius: 1.5,
                color: COLORS.text.secondary,
                '&:hover': {
                  bgcolor: COLORS.background.hover
                }
              }}
            >
              Clear Filters
            </Button>
          </Stack>

          {/* Action Buttons */}
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

            {/* Add Routing Button - CREATE permission */}
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenAddModal(true)}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: COLORS.primaryDark,
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
                Add Routing
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Routings Table */}
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
                      indeterminate={selected.length > 0 && selected.length < routings.length}
                      checked={routings.length > 0 && selected.length === routings.length}
                      onChange={handleSelectAll}
                      sx={{
                        color: COLORS.text.light,
                        '&.Mui-checked': { color: COLORS.text.light },
                        '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
                        '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                      }}
                      disabled={loading || routings.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Routing ID / Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Operations
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Cycle Time
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Version
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Created
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
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
                      Loading routings...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : routings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <RouteIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No routings found' : 'No routings available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first routing to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                routings.map((routing) => {
                  const isSelected = selected.includes(routing._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedRoutingForAction?._id === routing._id;
                  const avatarColor = getAvatarColor(routing);
                  const typeColors = getRoutingTypeColor(routing.routing_type);
                  const statusColors = getStatusColor(routing.status);
                  const totalOps = routing.operations?.length || 0;

                  return (
                    <TableRow
                      key={routing._id}
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
                            onChange={() => handleSelect(routing._id)}
                            sx={{
                              color: COLORS.primary,
                              '&.Mui-checked': { color: COLORS.primary },
                              '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getRoutingInitials(routing)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {routing.routing_id}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {routing.routing_name}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={routing.routing_type}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
                            bgcolor: typeColors.bg,
                            color: typeColors.color
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {totalOps} {totalOps === 1 ? 'operation' : 'operations'}
                        </Typography>
                        {totalOps > 0 && (
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {routing.operations?.map(op => op.op_sequence).join(', ')}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {routing.total_cycle_time_min || totalOps * 5} min
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`v${routing.version || '1.0'}`}
                          size="small"
                          sx={{ fontSize: '0.6rem', height: 20, bgcolor: COLORS.background.light }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(routing.status)}
                          label={routing.status || 'Draft'}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            border: `1px solid ${statusColors.border}`,
                            '& .MuiChip-icon': {
                              fontSize: '0.8rem'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          {formatDate(routing.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu
                          item={routing}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onOpen={(e) => handleActionMenuOpen(e, routing)}
                          onClose={handleActionMenuClose}
                          onView={openViewRoutingModal}
                          onEdit={openEditRoutingModal}
                          onApprove={openApproveRoutingModal}
                          onActivate={openActivateRoutingModal}
                          onReject={openRejectRoutingModal}
                          onDelete={openDeleteRoutingDialog}
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
            '& .MuiTablePagination-select': { fontSize: '0.7rem' },
            '& .MuiTablePagination-actions button': { color: COLORS.primary }
          }}
        />
      </Paper>

      {/* Modal Components - Only render if user has appropriate permissions */}
      {canCreate && (
        <AddRouting
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddSuccess}
        />
      )}

      {selectedRouting && (
        <>
          {canViewPage && (
            <ViewRouting
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedRouting(null);
              }}
              routing={selectedRouting}
            />
          )}

          {canUpdate && (
            <EditRouting
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedRouting(null);
              }}
              routing={selectedRouting}
              onUpdate={handleEditSuccess}
            />
          )}

          {canApprove && (
            <ApproveRouting
              open={openApproveModal}
              onClose={() => {
                setOpenApproveModal(false);
                setSelectedRouting(null);
              }}
              routing={selectedRouting}
              onApprove={handleApproveSuccess}
            />
          )}

          {canCreate && (
            <ActivateRouting
              open={openActivateModal}
              onClose={() => {
                setOpenActivateModal(false);
                setSelectedRouting(null);
              }}
              routing={selectedRouting}
              onActivate={handleActivateSuccess}
            />
          )}

          {canReject && (
            <RejectRouting
              open={openRejectModal}
              onClose={() => {
                setOpenRejectModal(false);
                setSelectedRouting(null);
              }}
              routing={selectedRouting}
              onReject={handleRejectSuccess}
            />
          )}

          {canDelete && (
            <DeleteRoutingDialog
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedRouting(null);
              }}
              routing={selectedRouting}
              onConfirm={handleDeleteConfirm}
              loading={deleteLoading}
            />
          )}
        </>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 1.5,
            fontSize: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoutingMaster;