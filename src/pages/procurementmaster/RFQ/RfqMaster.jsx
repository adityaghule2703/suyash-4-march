import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Backdrop
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  Compare as CompareIcon,
  Close as CloseIcon,
  Lock as LockIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddRFQ from './AddRFQ';
import ViewRFQ from './ViewRFQ';
import SubmitQuote from './SubmitQuote';
import ViewRFQComparison from './ViewRFQComparison';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  chips: {
    draft: '#E0F2FE',
    sent: '#FEF3C7',
    partially_responded: '#FEF3C7',
    fully_responded: '#9FE2BF',
    compared: '#9FE2BF',
    closed: '#F1F5F9'
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

const getStatusStyles = (status) => {
  const styles = {
    Draft: { bg: '#E0F2FE', text: '#0C4A6E', border: '#BAE6FD' },
    Sent: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    'Partially Responded': { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    'Fully Responded': { bg: '#9FE2BF', text: '#166534', border: '#86EFAC' },
    Compared: { bg: '#9FE2BF', text: '#166534', border: '#86EFAC' },
    Closed: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' }
  };
  return styles[status] || styles.Draft;
};

const ActionMenu = ({ item, onView, onSend, onSubmitQuote, onCompare, onCloseRfq, onClose, anchorEl, onOpen, sendingRfqId, permissions }) => {
  const canView = hasPermission(permissions, MODULES.RFQ_MASTER, PAGES.RFQ_MASTER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.RFQ_MASTER, PAGES.RFQ_MASTER, ACTIONS.UPDATE);
  const canReject = hasPermission(permissions, MODULES.RFQ_MASTER, PAGES.RFQ_MASTER, ACTIONS.REJECT);
  
  // Status-based action availability with permission checks
  const canSend = item.status === 'Draft' && canUpdate;
  const canSubmitQuote = (item.status === 'Sent' || item.status === 'Partially Responded') && canUpdate;
  const canCompare = (item.status === 'Fully Responded' || item.status === 'Partially Responded') && canView;
  const canClose = item.status === 'Compared' && canReject;
  const isSending = sendingRfqId === item._id;
  
  // Check if any actions are available
  const hasAnyAction = canView || canSend || canSubmitQuote || canCompare || canClose;
  
  if (!hasAnyAction) {
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
            '&:hover': { bgcolor: `${COLORS.primary}20` }
          }}
          disabled={isSending}
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
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>View Details</Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canSend && (
          <MenuItem 
            onClick={() => { onSend(item); onClose(); }} 
            sx={{ py: 1.5 }}
            disabled={isSending}
          >
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              {isSending ? (
                <CircularProgress size={16} sx={{ color: '#F59E0B' }} />
              ) : (
                <SendIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>
                {isSending ? 'Sending...' : 'Send to Vendors'}
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canSubmitQuote && (
          <MenuItem onClick={() => { onSubmitQuote(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.success, minWidth: 36 }}>
              <SendIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.success, fontSize: '0.75rem' }}>Submit Quote</Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canCompare && (
          <MenuItem onClick={() => { onCompare(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <CompareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>View Comparison</Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canClose && (
          <>
            <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
            <MenuItem onClick={() => { onCloseRfq(item); onClose(); }} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ color: COLORS.warning, minWidth: 36 }}>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.warning, fontSize: '0.75rem' }}>
                  Close RFQ
                </Typography>
              </ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

const RFQMaster = () => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRfqForAction, setSelectedRfqForAction] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openSubmitQuoteModal, setOpenSubmitQuoteModal] = useState(false);
  const [openComparisonModal, setOpenComparisonModal] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [comparisonRfqId, setComparisonRfqId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [closingRfq, setClosingRfq] = useState(false);
  const [sendingRfqId, setSendingRfqId] = useState(null);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });
  const [showSendProgress, setShowSendProgress] = useState(false);

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Ref to track if we're currently searching (typing)
  const isSearchingRef = useRef(false);
  const searchTimeoutRef = useRef(null);

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
            
            // Debug: Log permissions for RFQ_MASTER
            const rfqPermissions = userData.permissions.filter(p => p.module === 'RFQ_MASTER');
            console.log('RFQ Master Permissions from API:', rfqPermissions);
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
    
    const hasPerm = hasPermission(
      userPermissions,
      MODULES.RFQ_MASTER,
      PAGES.RFQ_MASTER,
      action
    );
    
    console.log(`RFQ Master - Permission check for ${action}: ${hasPerm}`);
    return hasPerm;
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canReject = checkPermission(ACTIONS.REJECT);
  const canExport = checkPermission(ACTIONS.EXPORT);
  const canPrint = checkPermission(ACTIONS.PRINT);

  // Handle search input change with proper debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    isSearchingRef.current = true;
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounce
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1);
      setPage(0);
      setSelected([]);
      isSearchingRef.current = false;
    }, 500);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
    setPage(0);
    setSelected([]);
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

  const fetchRFQs = useCallback(async () => {
    if (!canViewPage && !isSuperAdmin) return;
    
    // Don't show loading indicator while typing search
    if (!isSearchingRef.current) {
      setLoading(true);
    }
    
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: rowsPerPage,
        sort_by: 'createdAt',
        sort_order: 'desc'
      });
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`${BASE_URL}/api/rfqs?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setRfqs(response.data.data || []);
        setTotalItems(response.data.pagination?.total || 0);
      } else {
        showNotification('Failed to load RFQs', 'error');
      }
    } catch (err) {
      console.error('Error fetching RFQs:', err);
      showNotification('Failed to load RFQs', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchRFQs();
    }
  }, [fetchRFQs, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleRefresh = () => {
    fetchRFQs();
    showNotification('Data refreshed', 'success');
  };

  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(rfqs.map(rfq => rfq._id));
    } else {
      setSelected([]);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/rfqs/bulk-delete`, 
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setSelected([]);
      
      if (rfqs.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      } else {
        fetchRFQs();
      }
      
      showNotification(`${selected.length} RFQ(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete RFQs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSelected = (data) => {
    fetchRFQs();
    showNotification(`Vendor ${data.selected_vendor} selected successfully!`, 'success');
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
    setCurrentPage(newPage + 1);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setCurrentPage(1);
    setSelected([]);
  };

  const handleAddRFQ = () => {
    if (!canCreate) return;
    setOpenAddModal(true);
  };
  
  const handleRFQAdded = () => {
    fetchRFQs();
    showNotification('RFQ created successfully!', 'success');
  };

  const handleActionMenuOpen = (event, rfq) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRfqForAction(rfq);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRfqForAction(null);
  };

  const openViewRFQModal = (rfq) => {
    if (!canViewPage) return;
    setSelectedRfq(rfq);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const handleSendRFQ = async (rfq) => {
    if (!canUpdate) return;
    
    setSendingRfqId(rfq._id);
    setShowSendProgress(true);
    setSendProgress({ current: 0, total: rfq.vendors?.length || 0 });
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${BASE_URL}/api/rfqs/${rfq._id}/send`, 
        { send_email: true },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
          },
          timeout: 300000
        }
      );
      
      if (response.data.success) {
        setSendProgress({ 
          current: rfq.vendors?.length || 0, 
          total: rfq.vendors?.length || 0 
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        fetchRFQs();
        showNotification(
          response.data.message || 'RFQ sent successfully to all vendors!', 
          'success'
        );
      } else {
        showNotification(response.data.message || 'Failed to send RFQ', 'error');
      }
    } catch (err) {
      console.error('Error sending RFQ:', err);
      
      let errorMessage = 'Failed to send RFQ';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (!err.response) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setSendingRfqId(null);
      setTimeout(() => {
        setShowSendProgress(false);
        setSendProgress({ current: 0, total: 0 });
      }, 1000);
    }
  };

  const handleSubmitQuote = (rfq) => {
    if (!canUpdate) return;
    setSelectedRfq(rfq);
    setSelectedVendor(null);
    setOpenSubmitQuoteModal(true);
    handleActionMenuClose();
  };

  const handleQuoteSubmitted = () => {
    fetchRFQs();
    showNotification('Quotation submitted successfully!', 'success');
  };

  const handleOpenComparisonModal = (rfq) => {
    if (!canViewPage) return;
    setComparisonRfqId(rfq._id);
    setOpenComparisonModal(true);
    handleActionMenuClose();
  };

  const handleOpenCloseDialog = (rfq) => {
    if (!canReject) return;
    setSelectedRfq(rfq);
    setOpenCloseDialog(true);
    handleActionMenuClose();
  };

  const handleCloseRFQ = async () => {
    if (!selectedRfq?._id) return;
    
    setClosingRfq(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/rfqs/${selectedRfq._id}/close`, {}, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      
      if (response.data.success) {
        fetchRFQs();
        showNotification(`RFQ ${selectedRfq.rfq_number} closed successfully!`, 'success');
        setOpenCloseDialog(false);
        setSelectedRfq(null);
      } else {
        showNotification(response.data.message || 'Failed to close RFQ', 'error');
      }
    } catch (err) {
      console.error('Error closing RFQ:', err);
      showNotification(err.response?.data?.message || 'Failed to close RFQ', 'error');
    } finally {
      setClosingRfq(false);
    }
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getAvatarInitials = (rfqNumber) => {
    if (!rfqNumber) return 'RF';
    return rfqNumber.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (rfqNumber) => {
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = rfqNumber?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate progress percentage
  const progressPercentage = sendProgress.total > 0 
    ? (sendProgress.current / sendProgress.total) * 100 
    : 0;

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
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Request for Quotations (RFQ)
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Create and manage RFQs for procurement
        </Typography>
      </Box>

      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by RFQ number..."
              size="small"
              value={searchInput}
              onChange={handleSearchChange}
              autoComplete="off"
              sx={{ width: { xs: '100%', sm: 320 } }}
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
                sx: { height: 36, bgcolor: COLORS.background.light }
              }}
            />
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
            
            {/* Create RFQ Button - Only show if user has create permission */}
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleAddRFQ}
                sx={{ height: 36, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', fontWeight: 500, textTransform: 'none' }}
                disabled={loading}
              >
                Create RFQ
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.background.tableHeader, '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.light, py: 1.5 } }}>
                {/* Checkbox Column - Only show if user has delete permission */}
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < rfqs.length}
                      checked={rfqs.length > 0 && selected.length === rfqs.length}
                      onChange={handleSelectAll}
                      sx={{ color: COLORS.text.light, '&.Mui-checked': { color: COLORS.text.light } }}
                      disabled={loading || rfqs.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>RFQ Number</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>PR Number</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Vendors</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Valid Till</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60, color: COLORS.text.light }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading RFQs...</Typography>
                  </TableCell>
                </TableRow>
              ) : rfqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                      {searchTerm ? 'No RFQs found' : 'No RFQs available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rfqs.map((rfq) => {
                  const isSelected = selected.includes(rfq._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedRfqForAction?._id === rfq._id;
                  const avatarColor = getAvatarColor(rfq.rfq_number);
                  const statusStyles = getStatusStyles(rfq.status);
                  const responseStats = rfq.response_stats || { total_vendors: rfq.vendors?.length || 0, responded_vendors: 0 };
                  const isSending = sendingRfqId === rfq._id;

                  return (
                    <TableRow 
                      key={rfq._id} 
                      hover 
                      selected={isSelected} 
                      sx={{ 
                        bgcolor: COLORS.background.white, 
                        '&:hover': { bgcolor: COLORS.background.hover },
                        opacity: isSending ? 0.7 : 1,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      {/* Checkbox Column - Only show if user has delete permission */}
                      {canDelete && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox 
                            checked={isSelected} 
                            onChange={() => handleSelect(rfq._id)} 
                            sx={{ color: COLORS.primary }} 
                            disabled={isSending}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getAvatarInitials(rfq.rfq_number)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {rfq.rfq_number}
                              {isSending && (
                                <CircularProgress size={12} sx={{ ml: 1, color: COLORS.primary }} />
                              )}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Created: {formatDate(rfq.createdAt)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {rfq.pr_id?.pr_number || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {rfq.items?.length || 0} item(s)
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {rfq.vendors?.length || 0} vendor(s)
                          {responseStats.responded_vendors > 0 && (
                            <Typography component="span" sx={{ fontSize: '0.65rem', color: COLORS.success, display: 'block' }}>
                              {responseStats.responded_vendors} responded
                            </Typography>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDate(rfq.valid_till)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={rfq.status} 
                          size="small" 
                          sx={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 500, 
                            height: 20, 
                            bgcolor: statusStyles.bg, 
                            color: statusStyles.text, 
                            border: `1px solid ${statusStyles.border}`,
                            opacity: isSending ? 0.7 : 1
                          }} 
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu
                          item={rfq}
                          onView={openViewRFQModal}
                          onSend={handleSendRFQ}
                          onSubmitQuote={handleSubmitQuote}
                          onCompare={handleOpenComparisonModal}
                          onCloseRfq={handleOpenCloseDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, rfq)}
                          sendingRfqId={sendingRfqId}
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
          sx={{ borderTop: `1px solid ${COLORS.border}` }}
        />
      </Paper>

      {/* Sending Progress Dialog */}
      <Dialog
        open={showSendProgress}
        onClose={() => {}}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2, 
            overflow: 'hidden',
            bgcolor: COLORS.background.white
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${COLORS.border}`,
          py: 1.5,
          px: 2.5,
          bgcolor: COLORS.background.white,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <SendIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Sending RFQ to Vendors
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: COLORS.background.light }}>
          <Stack spacing={2.5}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, mb: 1 }}>
                Please wait while we send the RFQ to all vendors...
              </Typography>
              <Typography variant="h6" sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                {sendProgress.current} / {sendProgress.total}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                Emails Sent
              </Typography>
            </Box>
            
            {/* Progress Bar */}
            <Box sx={{ width: '100%' }}>
              <Box sx={{ 
                width: '100%', 
                height: 8, 
                bgcolor: COLORS.border, 
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  width: `${progressPercentage}%`, 
                  height: '100%', 
                  bgcolor: COLORS.success,
                  transition: 'width 0.3s ease-in-out'
                }} />
              </Box>
            </Box>
            
            {/* Animated dots or spinner */}
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <CircularProgress size={20} sx={{ color: COLORS.primary }} />
              <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                {progressPercentage === 100 ? 'Finalizing...' : 'Sending emails...'}
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Modal Components - Only render if user has appropriate permissions */}
      {canCreate && (
        <AddRFQ open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handleRFQAdded} />
      )}
      
      {selectedRfq && (
        <>
          {canViewPage && (
            <ViewRFQ open={openViewModal} onClose={() => { setOpenViewModal(false); setSelectedRfq(null); }} rfq={selectedRfq} />
          )}
          
          {canUpdate && (
            <SubmitQuote
              open={openSubmitQuoteModal}
              onClose={() => { setOpenSubmitQuoteModal(false); setSelectedRfq(null); setSelectedVendor(null); }}
              rfq={selectedRfq}
              vendor={selectedVendor}
              onQuoteSubmitted={handleQuoteSubmitted}
            />
          )}
        </>
      )}
      
      {canViewPage && (
        <ViewRFQComparison
          open={openComparisonModal}
          onClose={() => {
            setOpenComparisonModal(false);
            setComparisonRfqId(null);
          }}
          rfqId={comparisonRfqId}
          onVendorSelected={handleVendorSelected}
        />
      )}

      {/* Close RFQ Confirmation Dialog */}
      <Dialog
        open={openCloseDialog}
        onClose={() => setOpenCloseDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${COLORS.border}`,
          py: 1.5,
          px: 2.5,
          bgcolor: COLORS.background.white,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <LockIcon sx={{ color: COLORS.warning, fontSize: 20 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Close RFQ
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5, backgroundColor: COLORS.background.light }}>
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
              Are you sure you want to close this RFQ?
            </Typography>
            
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.tertiary, mb: 0.5 }}>
                    RFQ NUMBER
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {selectedRfq?.rfq_number}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.tertiary, mb: 0.5 }}>
                    CURRENT STATUS
                  </Typography>
                  <Chip 
                    label={selectedRfq?.status} 
                    size="small" 
                    sx={{ 
                      fontSize: '0.7rem', 
                      height: 22,
                      bgcolor: getStatusStyles(selectedRfq?.status).bg,
                      color: getStatusStyles(selectedRfq?.status).text
                    }} 
                  />
                </Box>
              </Stack>
            </Paper>
            
            <Box sx={{ p: 1.5, bgcolor: '#FEF3C7', borderRadius: 1.5, border: '1px solid #FDE68A' }}>
              <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#92400E' }}>
                ⚠️ Closing this RFQ will mark it as completed and no further actions can be performed on it.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          px: 2.5, 
          py: 1.5, 
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          gap: 1
        }}>
          <Button 
            onClick={() => setOpenCloseDialog(false)} 
            disabled={closingRfq}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.secondary,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCloseRFQ}
            disabled={closingRfq}
            startIcon={closingRfq ? null : <LockIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.warning,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#D97706' }
            }}
          >
            {closingRfq ? 'Closing...' : 'Close RFQ'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default RFQMaster;