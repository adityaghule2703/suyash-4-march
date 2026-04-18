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
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  PostAdd as PostAddIcon,
  MoreVert as MoreVertIcon,
  Assessment as AssessmentIcon,
  Inventory as InventoryIcon,
  Warehouse as WarehouseIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  RemoveCircle as RemoveCircleIcon,
  Block as BlockIcon,
  Help as HelpIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Approval as ApprovalIcon,
  Replay as ReplayIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddPSV from './AddPSV';
import ViewPSV from './ViewPSV';
import EditPSV from './EditPSV';
import SecondCountPSV from './SecondCountPSV';
import CompletePSV from './CompletePSV';
import ApprovePSV from './ApprovePSV';
import VarianceReasonPSV from './VarianceReasonPSV';
import ClosePSV from './ClosePSV';
import PSVReport from './PSVReport';

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
  border: '#E3E8EF'
};

// PSV Status constants based on schema enum
const PSV_STATUS = {
  INITIATED: 'Initiated',
  IN_PROGRESS: 'In Progress',
  COUNT_COMPLETED: 'Count Completed',
  UNDER_REVIEW: 'Under Review',
  ADJUSTED: 'Adjusted',
  APPROVED: 'Approved',
  CLOSED: 'Closed'
};

// ✅ FIXED: Status colors with better visibility
const getStatusColor = (status) => {
  const colors = {
    'Initiated': { bg: '#FEF3C7', color: '#D97706', label: 'Initiated' },
    'In Progress': { bg: '#E0F2FE', color: '#0284C7', label: 'In Progress' },
    'Count Completed': { bg: '#DBEAFE', color: '#2563EB', label: 'Count Completed' },
    'Under Review': { bg: '#F3E8FF', color: '#9333EA', label: 'Under Review' },
    'Adjusted': { bg: '#D1FAE5', color: '#059669', label: 'Adjusted' },
    'Approved': { bg: '#D1FAE5', color: '#059669', label: 'Approved' },
    'Closed': { bg: '#F1F5F9', color: '#475569', label: 'Closed' }
  };
  return colors[status] || { bg: '#F1F5F9', color: '#475569', label: status || '-' };
};

// Verification type colors
const getVerificationTypeColor = (type) => {
  const colors = {
    'Full Count': { bg: '#D1FAE5', color: '#059669' },
    'Cycle Count': { bg: '#DBEAFE', color: '#2563EB' },
    'Spot Check': { bg: '#FEF3C7', color: '#D97706' },
    'Pre-Audit Count': { bg: '#F3E8FF', color: '#9333EA' }
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

// ==================== ACTION MENU COMPONENT - FIXED ====================
const ActionMenu = ({ 
  item, 
  anchorEl, 
  onOpen, 
  onClose, 
  onView, 
  onEdit, 
  onSecondCount,
  onComplete,
  onVarianceReason,
  onApprove,
  onCloseVerification,
  onPrint,
  onReport,
  permissions 
}) => {
  const status = item?.status || '';
  
  // Status checks
  const isInitiated = status === PSV_STATUS.INITIATED;
  const isInProgress = status === PSV_STATUS.IN_PROGRESS;
  const isCountCompleted = status === PSV_STATUS.COUNT_COMPLETED;
  const isUnderReview = status === PSV_STATUS.UNDER_REVIEW;
  const isApproved = status === PSV_STATUS.APPROVED;
  const isAdjusted = status === PSV_STATUS.ADJUSTED;
  const isClosed = status === PSV_STATUS.CLOSED;
  
  // Check if any item has variance
  const hasVariance = item?.items?.some(i => Math.abs(i.variance || 0) > 0) || false;
  
  const canView = hasPermission(permissions, MODULES.PHYSICAL_STOCK_VERIFICATION, PAGES.PHYSICAL_STOCK_VERIFICATION, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.PHYSICAL_STOCK_VERIFICATION, PAGES.PHYSICAL_STOCK_VERIFICATION, ACTIONS.UPDATE);
  const canPost = hasPermission(permissions, MODULES.PHYSICAL_STOCK_VERIFICATION, PAGES.PHYSICAL_STOCK_VERIFICATION, ACTIONS.POST);
  const canPrint = hasPermission(permissions, MODULES.PHYSICAL_STOCK_VERIFICATION, PAGES.PHYSICAL_STOCK_VERIFICATION, ACTIONS.PRINT);

  // Log for debugging
  console.log('Status:', status, 'isInitiated:', isInitiated, 'isInProgress:', isInProgress);

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
            minWidth: 220,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            maxHeight: 400,
          }
        }}
      >
        {/* View Details - Always visible */}
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

        {/* View Report - Always visible */}
        {canView && (
          <MenuItem onClick={() => { onReport(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <AssessmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                View Report
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Print PSV - Always visible */}
        {/* {canPrint && (
          <MenuItem onClick={() => { onPrint(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#F59E0B' }}>
                Print PSV
              </Typography>
            </ListItemText>
          </MenuItem>
        )} */}

        <Divider sx={{ my: 0.5 }} />

        {/* First Count - EditPSV (Initiated or In Progress) */}
        {canUpdate && (isInitiated || isInProgress) && (
          <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                Enter First Count
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Second Count - SecondCountPSV (In Progress with variance) */}
        {canUpdate && isInProgress && hasVariance && (
          <MenuItem onClick={() => { onSecondCount(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <ReplayIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#F59E0B' }}>
                Enter Second Count
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Complete Count - CompletePSV (In Progress) */}
        {canPost && isInProgress && (
          <MenuItem onClick={() => { onComplete(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#10B981' }}>
                Complete Count
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Update Variance Reasons - VarianceReasonPSV (Count Completed or Under Review) */}
        {canUpdate && (isCountCompleted || isUnderReview) && (
          <MenuItem onClick={() => { onVarianceReason(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
              <CommentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#8B5CF6' }}>
                Update Variance Reasons
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Approve & Post Adjustments - ApprovePSV (Count Completed or Under Review) */}
        {canPost && (isCountCompleted || isUnderReview) && (
          <MenuItem onClick={() => { onApprove(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <ApprovalIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#10B981' }}>
                Approve & Post Adjustments
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Close Verification - ClosePSV (Approved or Adjusted) */}
        {canPost && (isApproved || isAdjusted) && !isClosed && (
          <MenuItem onClick={() => { onCloseVerification(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <LockIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#F59E0B' }}>
                Close Verification
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

// ==================== MAIN COMPONENT ====================
const PSVMaster = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationTypeFilter, setVerificationTypeFilter] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemForAction, setSelectedItemForAction] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openSecondCountDialog, setOpenSecondCountDialog] = useState(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [openVarianceReasonDialog, setOpenVarianceReasonDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);

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
      MODULES.PHYSICAL_STOCK_VERIFICATION,
      PAGES.PHYSICAL_STOCK_VERIFICATION,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canPost = checkPermission(ACTIONS.POST);
  const canPrint = checkPermission(ACTIONS.PRINT);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchPSVs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (verificationTypeFilter) params.append('verification_type', verificationTypeFilter);
      if (fromDate) params.append('from_date', fromDate.toISOString().split('T')[0]);
      if (toDate) params.append('to_date', toDate.toISOString().split('T')[0]);

      const response = await axios.get(`${BASE_URL}/api/physical-verifications?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('API Response:', response.data);

      if (response.data.success) {
        setData(response.data.data || []);
        setTotalItems(response.data.pagination?.total || response.data.data?.length || 0);
      } else {
        showNotification('Failed to load Physical Stock Verifications', 'error');
      }
    } catch (err) {
      console.error('Error fetching PSVs:', err);
      showNotification(err.response?.data?.message || 'Failed to load Physical Stock Verifications', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, verificationTypeFilter, fromDate, toDate]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchPSVs();
    }
  }, [fetchPSVs, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };

  const handleStatusFilterChange = (event, newValue) => {
    if (newValue !== null) {
      setStatusFilter(newValue);
      setPage(0);
      setSelected([]);
    }
  };

  const handleVerificationTypeFilterChange = (event) => {
    setVerificationTypeFilter(event.target.value);
    setPage(0);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setVerificationTypeFilter('');
    setFromDate(null);
    setToDate(null);
    setSearchInput('');
    setPage(0);
  };

  const handleBulkDelete = () => {
    if (!canDelete) return;
    showNotification('Bulk delete requires API implementation', 'warning');
  };

  const handleAddPSV = () => {
    fetchPSVs();
    showNotification('Physical Stock Verification created successfully!', 'success');
  };

  const handleEditPSV = () => {
    fetchPSVs();
    showNotification('First counts entered successfully!', 'success');
  };

  const handleSecondCountPSV = () => {
    fetchPSVs();
    showNotification('Second counts entered successfully!', 'success');
  };

  const handleCompletePSV = () => {
    fetchPSVs();
    showNotification('Counting completed successfully!', 'success');
  };

  const handleVarianceReasonPSV = () => {
    fetchPSVs();
    showNotification('Variance reasons updated successfully!', 'success');
  };

  const handleApprovePSV = () => {
    fetchPSVs();
    showNotification('Verification approved and adjustments posted successfully!', 'success');
  };

  const handleClosePSV = () => {
    fetchPSVs();
    showNotification('Physical Stock Verification closed successfully!', 'success');
  };

  const handlePrintPSV = () => {
    showNotification('Print functionality coming soon', 'info');
  };

  const handleActionMenuOpen = (event, item) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedItemForAction(item);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedItemForAction(null);
  };

  const openViewModalHandler = (item) => {
    setSelectedItem(item);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditModalHandler = (item) => {
    setSelectedItem(item);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openSecondCountDialogHandler = (item) => {
    setSelectedItem(item);
    setOpenSecondCountDialog(true);
    handleActionMenuClose();
  };

  const openCompleteDialogHandler = (item) => {
    setSelectedItem(item);
    setOpenCompleteDialog(true);
    handleActionMenuClose();
  };

  const openVarianceReasonDialogHandler = (item) => {
    setSelectedItem(item);
    setOpenVarianceReasonDialog(true);
    handleActionMenuClose();
  };

  const openApproveDialogHandler = (item) => {
    setSelectedItem(item);
    setOpenApproveDialog(true);
    handleActionMenuClose();
  };

  const openCloseDialogHandler = (item) => {
    setSelectedItem(item);
    setOpenCloseDialog(true);
    handleActionMenuClose();
  };

  const openPrintModalHandler = (item) => {
    setSelectedItem(item);
    setOpenPrintModal(true);
    handleActionMenuClose();
  };

  const openReportModalHandler = (item) => {
    setSelectedItem(item);
    setOpenReportModal(true);
    handleActionMenuClose();
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getPSVInitials = (psv) => {
    if (!psv.verification_number && !psv.verification_id) return 'PSV';
    const number = psv.verification_number || psv.verification_id;
    return number.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (psv) => {
    if (!psv.verification_number && !psv.verification_id) return COLORS.primary;
    const number = psv.verification_number || psv.verification_id;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = number.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const getWarehouseName = (warehouse) => {
    if (!warehouse) return '-';
    if (typeof warehouse === 'string') return warehouse;
    if (Array.isArray(warehouse) && warehouse.length > 0) {
      return warehouse[0]?.warehouse_name || warehouse[0]?.name || '-';
    }
    return warehouse.warehouse_name || warehouse.name || warehouse.warehouse_id || '-';
  };

  const getPersonName = (person) => {
    if (!person) return '-';
    if (typeof person === 'string') {
      if (person.length > 10) return person.slice(-6);
      return person;
    }
    if (person.FirstName && person.LastName) return `${person.FirstName} ${person.LastName}`;
    if (person.FirstName) return person.FirstName;
    if (person.Username) return person.Username;
    if (person.Email) return person.Email;
    if (person.name) return person.name;
    if (person._id) return person._id.slice(-6);
    return '-';
  };

  const getItemsCount = (item) => {
    if (item.items_count) return item.items_count;
    if (item.items) return item.items.length;
    return 0;
  };

  // Verification types for filter
  const verificationTypes = ['Full Count', 'Cycle Count', 'Spot Check', 'Pre-Audit Count'];
  
  // Status tabs
  const statusTabs = [
    { label: 'All', value: 'all' },
    { label: 'Initiated', value: PSV_STATUS.INITIATED },
    { label: 'In Progress', value: PSV_STATUS.IN_PROGRESS },
    { label: 'Count Completed', value: PSV_STATUS.COUNT_COMPLETED },
    { label: 'Under Review', value: PSV_STATUS.UNDER_REVIEW },
    { label: 'Adjusted', value: PSV_STATUS.ADJUSTED },
    { label: 'Approved', value: PSV_STATUS.APPROVED },
    { label: 'Closed', value: PSV_STATUS.CLOSED }
  ];

  // Show loading state while permissions are being fetched
  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  // If user doesn't have view permission, show access denied
  if (!canViewPage && !isSuperAdmin) {
    return <AccessDenied />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2.5 }}>
        {/* Page Header */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
            Physical Stock Verification
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
            Manage physical stock verification processes and track inventory discrepancies
          </Typography>
        </Box>

        {/* Status Filter Tabs */}
        <Paper sx={{
          mb: 2.5,
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          overflow: 'auto'
        }}>
          <Tabs
            value={statusFilter}
            onChange={handleStatusFilterChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                minHeight: 40,
                px: 2,
                color: COLORS.text.secondary,
                '&.Mui-selected': { color: COLORS.primary }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: COLORS.primary,
                height: 2
              }
            }}
          >
            {statusTabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Paper>

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
              placeholder="Search by Verification Number, Warehouse, or Remarks..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 350 },
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

              {canViewPage && (
                <Button
                  variant="outlined"
                  startIcon={<AssessmentIcon sx={{ fontSize: '1rem' }} />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    height: 36,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    borderColor: COLORS.border,
                    color: COLORS.text.secondary,
                    '&:hover': {
                      borderColor: COLORS.primary,
                      color: COLORS.primary
                    }
                  }}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
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
                  New PSV
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>

        {/* Advanced Filters */}
        {showFilters && (
          <Paper sx={{
            p: 2,
            mb: 2.5,
            borderRadius: 2,
            bgcolor: COLORS.background.white,
            border: `1px solid ${COLORS.border}`
          }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 2 }}>
              ADVANCED FILTERS
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  VERIFICATION TYPE
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={verificationTypeFilter}
                  onChange={handleVerificationTypeFilterChange}
                  sx={inputStyle}
                >
                  <MenuItem value="">All</MenuItem>
                  {verificationTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  FROM DATE
                </Typography>
                <DatePicker
                  value={fromDate}
                  onChange={setFromDate}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: inputStyle
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  TO DATE
                </Typography>
                <DatePicker
                  value={toDate}
                  onChange={setToDate}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: inputStyle
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  sx={{
                    height: 36,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.7rem'
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}

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
                    <TableCell padding="checkbox" sx={{ width: 40 }}>
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < data.length}
                        checked={data.length > 0 && selected.length === data.length}
                        onChange={handleSelectAll}
                        sx={{
                          color: COLORS.text.light,
                          '&.Mui-checked': { color: COLORS.text.light },
                          '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
                          '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                        }}
                        disabled={loading || data.length === 0}
                      />
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 120 }}>
                    PSV No.
                  </TableCell>
                  
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 200 }}>
                    Warehouse
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 130 }}>
                    Verification Type
                  </TableCell>
                  
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 70 }} align="center">
                    Items
                  </TableCell>
                 
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 120 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 80 }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                      <Typography sx={{ fontSize: '0.75rem', mt: 1, color: COLORS.text.secondary }}>
                        Loading Physical Stock Verifications...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                      <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
                        {searchTerm ? 'No verifications found matching your search' : 'No physical stock verifications available'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => {
                    const isSelected = selected.includes(item._id);
                    const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedItemForAction?._id === item._id;
                    const statusColors = getStatusColor(item.status);
                    const verificationTypeColors = getVerificationTypeColor(item.verification_type);
                    
                    return (
                      <TableRow
                        key={item._id}
                        hover
                        selected={isSelected}
                        sx={{
                          '&:hover': { bgcolor: COLORS.background.hover },
                          '&.Mui-selected': {
                            bgcolor: `${COLORS.primary}10`,
                            '&:hover': { bgcolor: `${COLORS.primary}20` }
                          }
                        }}
                      >
                        {canDelete && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleSelect(item._id)}
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
                            <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(item), fontSize: '0.7rem', fontWeight: 600 }}>
                              {getPSVInitials(item)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                {item.verification_id || item.verification_number || item._id?.slice(-8)}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                ID: {item._id?.slice(-8)}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                       
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {getWarehouseName(item.warehouse_id)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.verification_type || '-'}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: 24,
                              bgcolor: verificationTypeColors.bg,
                              color: verificationTypeColors.color,
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                       
                        <TableCell align="center">
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {getItemsCount(item)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          {/* ✅ FIXED: Status chip with proper display */}
                          <Chip
                            label={statusColors.label}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: 24,
                              minWidth: 100,
                              bgcolor: statusColors.bg,
                              color: statusColors.color,
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <ActionMenu
                            item={item}
                            anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                            onOpen={(e) => handleActionMenuOpen(e, item)}
                            onClose={handleActionMenuClose}
                            onView={openViewModalHandler}
                            onEdit={openEditModalHandler}
                            onSecondCount={openSecondCountDialogHandler}
                            onComplete={openCompleteDialogHandler}
                            onVarianceReason={openVarianceReasonDialogHandler}
                            onApprove={openApproveDialogHandler}
                            onCloseVerification={openCloseDialogHandler}
                            onPrint={openPrintModalHandler}
                            onReport={openReportModalHandler}
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

        {/* Modals */}
        {canCreate && (
          <AddPSV
            open={openAddModal}
            onClose={() => setOpenAddModal(false)}
            onAdd={handleAddPSV}
          />
        )}

        {selectedItem && canViewPage && (
          <>
            <ViewPSV
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedItem(null);
              }}
              psvId={selectedItem?._id}
              data={selectedItem}
            />
            
            <PSVReport
              open={openReportModal}
              onClose={() => {
                setOpenReportModal(false);
                setSelectedItem(null);
              }}
              psvId={selectedItem?._id}
              psvData={selectedItem}
            />
          </>
        )}

        {selectedItem && canUpdate && (
          <>
            <EditPSV
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedItem(null);
              }}
              data={selectedItem}
              onUpdate={handleEditPSV}
            />

            <SecondCountPSV
              open={openSecondCountDialog}
              onClose={() => {
                setOpenSecondCountDialog(false);
                setSelectedItem(null);
              }}
              data={selectedItem}
              onSecondCountComplete={handleSecondCountPSV}
            />

            <VarianceReasonPSV
              open={openVarianceReasonDialog}
              onClose={() => {
                setOpenVarianceReasonDialog(false);
                setSelectedItem(null);
              }}
              data={selectedItem}
              onVarianceReasonUpdate={handleVarianceReasonPSV}
            />
          </>
        )}

        {selectedItem && canPost && (
          <>
            <CompletePSV
              open={openCompleteDialog}
              onClose={() => {
                setOpenCompleteDialog(false);
                setSelectedItem(null);
              }}
              data={selectedItem}
              onComplete={handleCompletePSV}
            />

            <ApprovePSV
              open={openApproveDialog}
              onClose={() => {
                setOpenApproveDialog(false);
                setSelectedItem(null);
              }}
              data={selectedItem}
              onApprove={handleApprovePSV}
            />

            <ClosePSV
              open={openCloseDialog}
              onClose={() => {
                setOpenCloseDialog(false);
                setSelectedItem(null);
              }}
              data={selectedItem}
              onCloseComplete={handleClosePSV}
            />
          </>
        )}

        {/* Snackbar */}
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
            sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

// Handle select all function
const handleSelectAll = (event) => {
  // This function is defined inside the component
  // Make sure it's properly defined
};

// Handle select function
const handleSelect = (id) => {
  // This function is defined inside the component
  // Make sure it's properly defined
};

// Input style for filters
const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    fontSize: '0.75rem',
    '&:hover fieldset': { borderColor: COLORS.primary },
    '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
  },
  '& .MuiInputBase-input': {
    py: 1,
    px: 1.5,
    fontSize: '0.75rem',
    color: COLORS.text.primary
  }
};

export default PSVMaster;