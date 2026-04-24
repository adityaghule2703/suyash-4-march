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
  Grid,
  FormControl,
  InputLabel,
  Select,
  Autocomplete
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  LocalShipping as LocalShippingIcon,
  PictureAsPdf as PdfIcon,
  PendingActions as PendingActionsIcon,
  QrCode as QrCodeIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Cancel as CancelIcon,
  LocalActivity as LocalActivityIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// Import modal components
import AddDeliveryChallan from './AddDeliveryChallan';
import ViewDeliveryChallan from './ViewDeliveryChallan';
import DeleteDeliveryChallan from './DeleteDeliveryChallan';
import PendingDispatchDialog from './PendingDispatchDialog';
import GenerateEWBDialog from './GenerateEWBDialog';
import PODDialog from './PODDialog';
import RejectDeliveryDialog from './RejectDeliveryDialog';
import PackingListDialog from './PackingListDialog';
import EditPackingListDialog from './EditPackingListDialog';
import DispatchDialog from './DispatchDialog';

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
    Planned: { bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' },
    Packed: { bg: '#E0E7FF', color: '#3730A3', border: '#C7D2FE' },
    'EWB Generated': { bg: '#EDE9FE', color: '#6D28D9', border: '#DDD6FE' },
    Dispatched: { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
    Delivered: { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
    'Rejected by Customer': { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' }
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
const ActionMenu = ({ deliveryChallan, onView, onDelete, onPrint, onGenerateEWB, onPOD, onRejectDelivery, onPackingList, onEditPackingList, onDispatch, anchorEl, onClose, onOpen, permissions }) => {
  const canView = hasPermission(permissions, MODULES.DELIVERY_CHALLAN, PAGES.DELIVERY_CHALLAN, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.DELIVERY_CHALLAN, PAGES.DELIVERY_CHALLAN, ACTIONS.UPDATE);

  // Show buttons based on status
  const showGenerateEWB = deliveryChallan.status === 'Packed';
  const showPackingList = deliveryChallan.status === 'Planned';
  const showEditPackingList = deliveryChallan.status === 'Packed';
  const showDispatch = deliveryChallan.status === 'EWB Generated';
  const showPOD = deliveryChallan.status === 'Dispatched';
  const showRejectDelivery = deliveryChallan.status === 'Dispatched';

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
        {/* View Details - Always visible for users with view permission */}
        {canView && (
          <MenuItem 
            onClick={() => {
              onView(deliveryChallan);
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

        {/* Packing List - Only for Planned status */}
        {showPackingList && (
          <MenuItem 
            onClick={() => {
              onPackingList(deliveryChallan);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#0D696C', minWidth: 36 }}>
              <LocalShippingIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#0D696C', fontSize: '0.75rem' }}>
                Packing List
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Edit Packing List - Only for Packed status */}
        {showEditPackingList && onEditPackingList && (
          <MenuItem 
            onClick={() => {
              onEditPackingList(deliveryChallan);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#0D696C', minWidth: 36 }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#0D696C', fontSize: '0.75rem' }}>
                Edit Packing List
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Generate EWB - Only for Packed status */}
        {showGenerateEWB && canUpdate && (
          <MenuItem 
            onClick={() => {
              onGenerateEWB(deliveryChallan);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
              <QrCodeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
                Generate EWB
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Dispatch - Only for EWB Generated status */}
        {showDispatch && (
          <MenuItem 
            onClick={() => {
              onDispatch(deliveryChallan);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#0D696C', minWidth: 36 }}>
              <LocalActivityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#0D696C', fontSize: '0.75rem' }}>
                Dispatch
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* POD - Only for Dispatched status */}
        {showPOD && (
          <MenuItem 
            onClick={() => {
              onPOD(deliveryChallan);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <AssignmentTurnedInIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                POD
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Reject Delivery - Only for Dispatched status */}
        {showRejectDelivery && (
          <MenuItem 
            onClick={() => {
              onRejectDelivery(deliveryChallan);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
              <CancelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#EF4444', fontSize: '0.75rem' }}>
                Reject Delivery
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const DeliveryChallanMaster = () => {
  // State for data
  const [deliveryChallans, setDeliveryChallans] = useState([]);
  const [filteredChallans, setFilteredChallans] = useState([]);
  const [pendingDispatchDCs, setPendingDispatchDCs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedDCForAction, setSelectedDCForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPendingDispatchDialog, setOpenPendingDispatchDialog] = useState(false);
  const [openGenerateEWBDialog, setOpenGenerateEWBDialog] = useState(false);
  const [openPODDialog, setOpenPODDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openPackingListDialog, setOpenPackingListDialog] = useState(false);
  const [openEditPackingListDialog, setOpenEditPackingListDialog] = useState(false);
  const [openDispatchDialog, setOpenDispatchDialog] = useState(false);
  
  // Selected delivery challan
  const [selectedDC, setSelectedDC] = useState(null);
  
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
      MODULES.DELIVERY_CHALLAN,
      PAGES.DELIVERY_CHALLAN,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canPrint = checkPermission(ACTIONS.PRINT);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch delivery challans from API
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchDeliveryChallans();
    }
  }, [permissionsLoaded, canViewPage, isSuperAdmin]);

  const fetchDeliveryChallans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/delivery-challans?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setDeliveryChallans(response.data.data || []);
        setFilteredChallans(response.data.data || []);
      } else {
        showNotification('Failed to load delivery challans', 'error');
      }
    } catch (err) {
      console.error('Error fetching delivery challans:', err);
      showNotification('Failed to load delivery challans. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch pending dispatch delivery challans
  const fetchPendingDispatchDCs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/delivery-challans/pending-dispatch`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPendingDispatchDCs(response.data.data || []);
        setOpenPendingDispatchDialog(true);
      } else {
        showNotification('Failed to load pending dispatch DCs', 'error');
      }
    } catch (err) {
      console.error('Error fetching pending dispatch DCs:', err);
      showNotification('Failed to load pending dispatch DCs', 'error');
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    fetchDeliveryChallans();
    showNotification('Data refreshed', 'success');
  };
  
  // Handle search and filters (client-side filtering)
  const handleSearchAndFilter = () => {
    let filtered = [...deliveryChallans];
    
    if (searchTerm) {
      const value = searchTerm.toLowerCase();
      filtered = filtered.filter(dc =>
        dc.dc_number?.toLowerCase().includes(value) ||
        dc.so_number?.toLowerCase().includes(value) ||
        dc.customer_name?.toLowerCase().includes(value) ||
        dc.dc_type?.toLowerCase().includes(value)
      );
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(dc => dc.status === statusFilter);
    }
    
    if (typeFilter !== 'All') {
      filtered = filtered.filter(dc => dc.dc_type === typeFilter);
    }
    
    setFilteredChallans(filtered);
  };

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, statusFilter, typeFilter, deliveryChallans]);
  
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(filteredChallans.map(dc => dc._id));
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
  
  const handleActionMenuOpen = (event, dc) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedDCForAction(dc);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedDCForAction(null);
  };
  
  const openViewModalHandler = (dc) => {
    setSelectedDC(dc);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteDialogHandler = (dc) => {
    if (!canDelete) return;
    setSelectedDC(dc);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };
  
  const handlePendingDispatch = () => {
    fetchPendingDispatchDCs();
  };
  
  const handleGenerateEWB = (dc) => {
    setSelectedDC(dc);
    setOpenGenerateEWBDialog(true);
    handleActionMenuClose();
  };
  
  const handlePOD = (dc) => {
    setSelectedDC(dc);
    setOpenPODDialog(true);
    handleActionMenuClose();
  };

  const handleRejectDelivery = (dc) => {
    setSelectedDC(dc);
    setOpenRejectDialog(true);
    handleActionMenuClose();
  };

  const handlePackingList = (dc) => {
    setSelectedDC(dc);
    setOpenPackingListDialog(true);
    handleActionMenuClose();
  };

  const handleEditPackingList = (dc) => {
    setSelectedDC(dc);
    setOpenEditPackingListDialog(true);
    handleActionMenuClose();
  };

  const handleDispatch = (dc) => {
    setSelectedDC(dc);
    setOpenDispatchDialog(true);
    handleActionMenuClose();
  };
  
  const handlePrint = (dc) => {
    window.open(`${BASE_URL}/api/delivery-challans/${dc._id}/print`, '_blank');
  };
  
  const handleAddSuccess = () => {
    setOpenAddModal(false);
    fetchDeliveryChallans();
    showNotification('Delivery Challan created successfully!', 'success');
  };
  
  const handleDeleteSuccess = () => {
    setOpenDeleteDialog(false);
    setSelectedDC(null);
    fetchDeliveryChallans();
    showNotification('Delivery Challan deleted successfully!', 'success');
  };
  
  const handleEWBSuccess = () => {
    fetchDeliveryChallans();
    showNotification('Operation completed successfully!', 'success');
  };
  
  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/delivery-challans/bulk-delete`, 
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setSelected([]);
      fetchDeliveryChallans();
      showNotification(`${selected.length} delivery challan(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete delivery challans', 'error');
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
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
  
  const getCompanyInitials = (companyName) => {
    if (!companyName) return 'C';
    const words = companyName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return companyName.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (companyName) => {
    if (!companyName) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = companyName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  const paginatedChallans = filteredChallans.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (!permissionsLoaded) {
    return <LoadingState />;
  }

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
          Delivery Challan Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage delivery challans, track shipments, and monitor dispatch status
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
              placeholder="Search by DC number, SO number, customer..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
                width: 140,
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
              <MenuItem value="Planned">Planned</MenuItem>
              <MenuItem value="Packed">Packed</MenuItem>
              <MenuItem value="EWB Generated">EWB Generated</MenuItem>
              <MenuItem value="Dispatched">Dispatched</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Rejected by Customer">Rejected</MenuItem>
            </TextField>
            
            <TextField
              select
              size="small"
              label="DC Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
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
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Supply of Goods">Supply of Goods</MenuItem>
              <MenuItem value="Delivery for Approval">Delivery for Approval</MenuItem>
              <MenuItem value="Job Work Outward">Job Work Outward</MenuItem>
              <MenuItem value="Sales Return">Sales Return</MenuItem>
              <MenuItem value="Exhibition">Exhibition</MenuItem>
              <MenuItem value="Export">Export</MenuItem>
            </TextField>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* <Tooltip title="Refresh">
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
            </Tooltip> */}
            
            {/* <Button
              variant="outlined"
              startIcon={<PendingActionsIcon sx={{ fontSize: '1rem' }} />}
              onClick={handlePendingDispatch}
              sx={{ 
                height: 36,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                borderColor: COLORS.border,
                color: '#F59E0B',
                '&:hover': {
                  borderColor: '#F59E0B',
                  bgcolor: '#FEF3C7'
                }
              }}
              disabled={loading}
            >
              Pending Dispatch
            </Button> */}
            
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
                Create DC
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Delivery Challans Table */}
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
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < filteredChallans.length}
                      checked={filteredChallans.length > 0 && selected.length === filteredChallans.length}
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
                      disabled={loading || filteredChallans.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  DC Number
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  DC Date
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  SO Number
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Customer
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  DC Type
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
                  Items
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
                      Loading delivery challans...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedChallans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <LocalShippingIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm || statusFilter !== 'All' || typeFilter !== 'All' ? 'No delivery challans found' : 'No delivery challans available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm || statusFilter !== 'All' || typeFilter !== 'All' ? 'Try adjusting your search terms' : 'Create your first delivery challan'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedChallans.map((dc, index) => {
                  const isSelected = selected.includes(dc._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedDCForAction?._id === dc._id;
                  const avatarColor = getAvatarColor(dc.customer_name);

                  return (
                    <TableRow
                      key={dc._id || index}
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
                            onChange={() => handleSelect(dc._id)}
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
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          {dc.dc_number}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {formatDate(dc.dc_date)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {dc.so_number}
                        </Typography>
                      </TableCell>
                      
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
                            {getCompanyInitials(dc.customer_name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                              {dc.customer_name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              GST: {dc.customer_gstin || 'NA'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={dc.dc_type}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
                            bgcolor: COLORS.primaryLight,
                            color: COLORS.primary
                          }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        {getStatusChip(dc.status)}
                      </TableCell>
                      
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {dc.items?.length || 0} item(s)
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          deliveryChallan={dc}
                          onView={openViewModalHandler}
                          onDelete={openDeleteDialogHandler}
                          onPrint={handlePrint}
                          onGenerateEWB={handleGenerateEWB}
                          onPOD={handlePOD}
                          onRejectDelivery={handleRejectDelivery}
                          onPackingList={handlePackingList}
                          onEditPackingList={handleEditPackingList}
                          onDispatch={handleDispatch}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, dc)}
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
          count={filteredChallans.length}
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

      {/* Modal Components */}
      {canCreate && (
        <AddDeliveryChallan 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {selectedDC && canViewPage && (
        <ViewDeliveryChallan 
          open={openViewModal}
          onClose={() => {
            setOpenViewModal(false);
            setSelectedDC(null);
          }}
          deliveryChallan={selectedDC}
        />
      )}

      {selectedDC && canDelete && (
        <DeleteDeliveryChallan 
          open={openDeleteDialog}
          onClose={() => {
            setOpenDeleteDialog(false);
            setSelectedDC(null);
          }}
          deliveryChallan={selectedDC}
          onDelete={handleDeleteSuccess}
        />
      )}

      <PendingDispatchDialog
        open={openPendingDispatchDialog}
        onClose={() => setOpenPendingDispatchDialog(false)}
        pendingDCs={pendingDispatchDCs}
      />

      <GenerateEWBDialog
        open={openGenerateEWBDialog}
        onClose={() => {
          setOpenGenerateEWBDialog(false);
          setSelectedDC(null);
        }}
        deliveryChallan={selectedDC}
        onSuccess={handleEWBSuccess}
      />

      <PODDialog
        open={openPODDialog}
        onClose={() => {
          setOpenPODDialog(false);
          setSelectedDC(null);
        }}
        deliveryChallan={selectedDC}
        onSuccess={handleEWBSuccess}
      />

      <RejectDeliveryDialog
        open={openRejectDialog}
        onClose={() => {
          setOpenRejectDialog(false);
          setSelectedDC(null);
        }}
        deliveryChallan={selectedDC}
        onSuccess={handleEWBSuccess}
      />

      <PackingListDialog
        open={openPackingListDialog}
        onClose={() => {
          setOpenPackingListDialog(false);
          setSelectedDC(null);
        }}
        deliveryChallan={selectedDC}
        onSuccess={handleEWBSuccess}
      />

      <EditPackingListDialog
        open={openEditPackingListDialog}
        onClose={() => {
          setOpenEditPackingListDialog(false);
          setSelectedDC(null);
        }}
        deliveryChallan={selectedDC}
        onSuccess={handleEWBSuccess}
      />

      <DispatchDialog
        open={openDispatchDialog}
        onClose={() => {
          setOpenDispatchDialog(false);
          setSelectedDC(null);
        }}
        deliveryChallan={selectedDC}
        onSuccess={handleEWBSuccess}
      />

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

export default DeliveryChallanMaster;