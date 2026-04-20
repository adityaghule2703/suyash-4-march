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
  Grid
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
  Close as CloseIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddRouting from './AddRouting';
import ViewRouting from './ViewRouting';
import EditRouting from './EditRouting';
import ApproveRouting from './ApproveRouting';
import DeleteRouting from './DeleteRouting';
import { hasPermission, MODULES, PAGES, ACTIONS } from '../../../utils/modulePermissions';
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
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF'
  },
  background: {
    light: '#F9FAFB',
    white: '#FFFFFF',
    hover: '#F3F4F6',
    tableHeader: '#F9FAFB'
  }
};

const ROUTING_TYPE_OPTIONS = ['All', 'Stamping', 'Busbar', 'Gasket', 'Assembly', 'Toolroom', 'General'];
const STATUS_OPTIONS = ['All', 'Planned', 'In Progress', 'Completed', 'Postponed', 'Cancelled' ];

// Action Menu Component
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onApprove, onActivate, onReject, permissions, isSuperAdmin }) => {
  const canView = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.ROUTING_MASTER, ACTIONS.VIEW);
  const canUpdate = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.ROUTING_MASTER, ACTIONS.UPDATE);
  const canDelete = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.ROUTING_MASTER, ACTIONS.DELETE);
  const canApprove = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.ROUTING_MASTER, ACTIONS.APPROVE);
  
  // Show Activate only for Draft status (not approved, not active)
  const canActivate = item?.status === 'Draft'|| item.status === 'Rejected'
  // Show Reject only for Active/Approved status that needs rejection
  const canReject = item?.status === 'Active' || item?.status === 'Approved';

  const hasAnyActions = canView || canUpdate || canDelete || canApprove || canActivate || canReject;

  if (!hasAnyActions) return null;

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

        {canUpdate && !item.approved && (
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

        {/* Activate - Only for Draft status */}
        {canActivate && (
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

        {/* Approve - Only for Active and not approved */}
        {canApprove && item.is_active && !item.approved && (
          <MenuItem onClick={() => { onApprove(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <VerifiedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Approve
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Reject - For Active or Approved status */}
        {canReject && (
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

        <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Routing Name</Typography>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{routing?.routing_name}</Typography>

          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 1 }}>Routing ID</Typography>
          <Typography sx={{ fontSize: '0.8rem' }}>{routing?.routing_id}</Typography>
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

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

  // Fetch Routings from API
  const fetchRoutings = useCallback(async () => {
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
  }, [page, rowsPerPage, searchTerm, routingTypeFilter, statusFilter]);

  useEffect(() => {
    fetchRoutings();
  }, [fetchRoutings]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(routings.map(routing => routing._id));
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
    setSelectedRouting(routing);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditRoutingModal = (routing) => {
    setSelectedRouting(routing);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openApproveRoutingModal = (routing) => {
    setSelectedRouting(routing);
    setOpenApproveModal(true);
    handleActionMenuClose();
  };

  const openDeleteRoutingDialog = (routing) => {
    setSelectedRouting(routing);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  // Add these with other handler functions (around line 280)
const openActivateRoutingModal = (routing) => {
  setSelectedRouting(routing);
  setOpenActivateModal(true);
  handleActionMenuClose();
};

const openRejectRoutingModal = (routing) => {
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
        // Show error message from backend
        let errorMessage = response.data.message || 'Failed to delete routing';

        // Check if there's work order information in the error
        if (response.data.work_order) {
          errorMessage = `${response.data.message}\nWork Order: ${response.data.work_order.wo_number} (${response.data.work_order.status})`;
        }

        showNotification(errorMessage, 'error');
      }
    } catch (err) {
      console.error('Error deleting routing:', err);

      // Extract detailed error message from response
      let errorMessage = 'Failed to delete routing';

      if (err.response?.data) {
        errorMessage = err.response.data.message || errorMessage;

        // If there's work order details in the error, include them
        if (err.response.data.work_order) {
          errorMessage = `${err.response.data.message}\nWork Order: ${err.response.data.work_order.wo_number} (${err.response.data.work_order.status})`;
        }
      }

      showNotification(errorMessage, 'error');
    } finally {
      setDeleteLoading(false);
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
      return { bg: '#D1FAE5', color: '#059669' };
    case 'Draft':
      return { bg: '#FEF3C7', color: '#D97706' };
    default:
      return { bg: '#F1F5F9', color: '#475569' };
  }
};

  const clearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setRoutingTypeFilter('All');
    setStatusFilter('All');
    setPage(0);
  };

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
          {/* Filters Row */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by routing name, type..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 250 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
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
                }
              }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ fontSize: '0.75rem' }}>Routing Type</InputLabel>
              <Select
                value={routingTypeFilter}
                onChange={(e) => setRoutingTypeFilter(e.target.value)}
                label="Routing Type"
                sx={{ height: 36, fontSize: '0.75rem' }}
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
                sx={{ height: 36, fontSize: '0.75rem' }}
              >
                {STATUS_OPTIONS.map(status => (
                  <MenuItem key={status} value={status} sx={{ fontSize: '0.75rem' }}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              size="small"
              onClick={clearFilters}
              sx={{ height: 36, textTransform: 'none', fontSize: '0.7rem' }}
            >
              Clear Filters
            </Button>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {selected.length > 0 && (
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
                bgcolor: COLORS.primaryDark,
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Add Routing
            </Button>
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
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading routings...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : routings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <RouteIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No routings found' : 'No routings available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first routing to get started'}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenAddModal(true)}
                        sx={{ mt: 2 }}
                      >
                        Add Routing
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                routings.map((routing) => {
                  const isSelected = selected.includes(routing._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedRoutingForAction?._id === routing._id;
                  const avatarColor = getAvatarColor(routing);
                  const typeColors = getRoutingTypeColor(routing.routing_type);
                  const totalOps = routing.operations?.length || 0;

                  return (
                    <TableRow
                      key={routing._id}
                      hover
                      selected={isSelected}
                      sx={{
                        bgcolor: COLORS.background.white,
                        '&:hover': { bgcolor: COLORS.background.hover },
                        '&.Mui-selected': { bgcolor: `${COLORS.primary}10` },
                        '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border }
                      }}
                    >
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
  icon={routing.status === 'Approved' ? <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> : <PendingIcon sx={{ fontSize: '0.7rem' }} />}
  label={routing.status || 'Draft'}
  size="small"
  sx={{
    fontSize: '0.65rem',
    fontWeight: 500,
    height: 24,
    bgcolor: routing.status === 'Approved' ? '#D1FAE5' : '#FEF3C7',
    color: routing.status === 'Approved' ? '#059669' : '#D97706'
  }}
/>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.7rem' }}>
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

      {/* Modal Components */}
      <AddRouting
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddSuccess}
      />

      {selectedRouting && (
        <>
          <ViewRouting
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedRouting(null);
            }}
            routing={selectedRouting}
          />

          <EditRouting
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedRouting(null);
            }}
            routing={selectedRouting}
            onUpdate={handleEditSuccess}
          />

          <ApproveRouting
            open={openApproveModal}
            onClose={() => {
              setOpenApproveModal(false);
              setSelectedRouting(null);
            }}
            routing={selectedRouting}
            onApprove={handleApproveSuccess}
          />

              <ActivateRouting
      open={openActivateModal}
      onClose={() => {
        setOpenActivateModal(false);
        setSelectedRouting(null);
      }}
      routing={selectedRouting}
      onActivate={handleActivateSuccess}
    />

    {/* New Reject Modal */}
    <RejectRouting
      open={openRejectModal}
      onClose={() => {
        setOpenRejectModal(false);
        setSelectedRouting(null);
      }}
      routing={selectedRouting}
      onReject={handleRejectSuccess}
    />

          <DeleteRouting
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedRouting(null);
            }}
            routing={selectedRouting}
            onDelete={(deletedRouting) => {
              handleDeleteSuccess();
              setOpenDeleteDialog(false);
              setSelectedRouting(null);
            }}
          />
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