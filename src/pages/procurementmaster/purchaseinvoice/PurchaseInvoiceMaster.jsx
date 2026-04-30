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
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Approval as ApprovalIcon,
  CompareArrows as CompareArrowsIcon,
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddPurchaseInvoice from './AddPurchaseInvoice';
import ViewPurchaseInvoice from './ViewPurchaseInvoice';
import ThreeWayMatchModal from './ThreeWayMatchModal';
import ApproveInvoiceModal from './ApproveInvoiceModal';
import PrintPurchaseInvoice from './PrintPurchaseInvoice';

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
  info: '#3B82F6'
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
    Pending: { bg: '#E0F2FE', text: '#0C4A6E', border: '#BAE6FD' },
    Approved: { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' },
    Rejected: { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
    Paid: { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' },
    Cancelled: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' }
  };
  return styles[status] || styles.Pending;
};

const getMatchingStatusStyles = (status) => {
  const styles = {
    'Not Started': { bg: '#E0F2FE', text: '#0C4A6E', border: '#BAE6FD' },
    '2-way Matched': { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' },
    '3-way Matched': { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' },
    'Matched': { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' },
    'Exception': { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    'Hold': { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    'Pending': { bg: '#E0F2FE', text: '#0C4A6E', border: '#BAE6FD' }
  };
  return styles[status] || styles.Pending;
};

const getPaymentStatusStyles = (status) => {
  const styles = {
    Paid: { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' },
    'Partially Paid': { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    Unpaid: { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' }
  };
  return styles[status] || styles.Unpaid;
};

const ActionMenu = ({ item, onView, onThreeWayMatch, onApprove, onDownloadPDF, onClose, anchorEl, onOpen, permissions }) => {
  const canView = hasPermission(permissions, MODULES.PURCHASE_INVOICE_MASTER, PAGES.PURCHASE_INVOICE_MASTER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.PURCHASE_INVOICE_MASTER, PAGES.PURCHASE_INVOICE_MASTER, ACTIONS.UPDATE);
  const canPrint = hasPermission(permissions, MODULES.PURCHASE_INVOICE_MASTER, PAGES.PURCHASE_INVOICE_MASTER, ACTIONS.PRINT);
  const canApprove = hasPermission(permissions, MODULES.PURCHASE_INVOICE_MASTER, PAGES.PURCHASE_INVOICE_MASTER, ACTIONS.APPROVE);
  
  // Helper function to check if invoice has been matched
  const isMatched = (matchingStatus) => {
    const matchedStatuses = ['2-way Matched', '3-way Matched', 'Matched'];
    return matchedStatuses.includes(matchingStatus);
  };
  
  // Can perform 3-way match if:
  // 1. Status is 'Pending'
  // 2. Not already matched (not 2-way or 3-way matched)
  // 3. Has items to match
  // 4. User has update permission
  const canThreeWayMatch = item.status === 'Pending' && 
    !isMatched(item.matching_status) && 
    item.items?.length > 0 &&
    canUpdate;
  
  // Can approve if:
  // 1. Status is 'Pending'
  // 2. Has matching status (either 3-way Matched or Exception)
  // 3. User has approve permission
  const canApproveAction = item.status === 'Pending' && 
    (item.matching_status === '3-way Matched' || 
     item.matching_status === 'Exception' ||
     item.matching_status === '2-way Matched') &&
    canApprove;
  
  // Can download PDF if user has print permission
  const canDownloadPDF = canPrint;
  
  // Check if any actions are available
  const hasAnyAction = canView || canDownloadPDF || canThreeWayMatch || canApproveAction;
  
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
        
        {canDownloadPDF && (
          <MenuItem onClick={() => { onDownloadPDF(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.info, minWidth: 36 }}>
              <PdfIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.info, fontSize: '0.75rem' }}>
                Generate PDF
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canThreeWayMatch && (
          <MenuItem onClick={() => { onThreeWayMatch(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.info, minWidth: 36 }}>
              <CompareArrowsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.info, fontSize: '0.75rem' }}>
                3-Way Match
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canApproveAction && (
          <MenuItem onClick={() => { onApprove(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.success, minWidth: 36 }}>
              <ApprovalIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.success, fontSize: '0.75rem' }}>
                Approve
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const PurchaseInvoiceMaster = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statistics, setStatistics] = useState(null);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedInvoiceForAction, setSelectedInvoiceForAction] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openThreeWayMatchModal, setOpenThreeWayMatchModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
            
            // Debug: Log permissions for PURCHASE_INVOICE_MASTER
            const invoicePermissions = userData.permissions.filter(p => p.module === 'PURCHASE_INVOICE_MASTER');
            console.log('Purchase Invoice Master Permissions from API:', invoicePermissions);
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
      MODULES.PURCHASE_INVOICE_MASTER,
      PAGES.PURCHASE_INVOICE_MASTER,
      action
    );
    
    console.log(`Purchase Invoice Master - Permission check for ${action}: ${hasPerm}`);
    return hasPerm;
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canPrint = checkPermission(ACTIONS.PRINT);
  const canApprove = checkPermission(ACTIONS.APPROVE);
  const canExport = checkPermission(ACTIONS.EXPORT);
  const canImport = checkPermission(ACTIONS.IMPORT);

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

  const fetchInvoices = useCallback(async () => {
    if (!canViewPage && !isSuperAdmin) return;
    
    // Don't show loading indicator while typing search
    if (!isSearchingRef.current) {
      setLoading(true);
    }
    
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: rowsPerPage
      });
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`${BASE_URL}/api/purchase-invoices?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 10000
      });

      if (response.data.success) {
        setInvoices(response.data.data || []);
        setTotalItems(response.data.pagination?.total || 0);
        setStatistics(response.data.statistics || null);
      } else {
        showNotification(response.data.message || 'Failed to load invoices', 'error');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      showNotification('Failed to load invoices. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchInvoices();
    }
  }, [fetchInvoices, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleRefresh = () => {
    fetchInvoices();
    showNotification('Data refreshed', 'success');
  };

  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(invoices.map(inv => inv._id));
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

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/purchase-invoices/bulk-delete`, 
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setSelected([]);
      
      if (invoices.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      } else {
        fetchInvoices();
      }
      
      showNotification(`${selected.length} invoice(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete invoices', 'error');
    } finally {
      setLoading(false);
    }
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

  const handleAddInvoice = () => {
    if (!canCreate) return;
    setOpenAddModal(true);
  };
  
  const handleInvoiceAdded = () => {
    fetchInvoices();
    showNotification('Purchase Invoice created successfully!', 'success');
  };

  const handleThreeWayMatchComplete = () => {
    fetchInvoices();
    showNotification('3-Way Match completed!', 'success');
  };

  const handleApproveComplete = () => {
    fetchInvoices();
    showNotification('Invoice approved successfully!', 'success');
  };

  const handleActionMenuOpen = (event, invoice) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedInvoiceForAction(invoice);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedInvoiceForAction(null);
  };

  const openViewModalHandler = (invoice) => {
    if (!canViewPage) return;
    setSelectedInvoice(invoice);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openThreeWayMatchModalHandler = (invoice) => {
    if (!canUpdate) return;
    setSelectedInvoice(invoice);
    setOpenThreeWayMatchModal(true);
    handleActionMenuClose();
  };

  const openApproveModalHandler = (invoice) => {
    if (!canApprove) return;
    setSelectedInvoice(invoice);
    setOpenApproveModal(true);
    handleActionMenuClose();
  };

  const openPrintModalHandler = (invoice) => {
    if (!canPrint) return;
    setSelectedInvoice(invoice);
    setOpenPrintModal(true);
    handleActionMenuClose();
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

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(amount);
  };

  const getAvatarInitials = (invoiceNumber) => {
    if (!invoiceNumber) return 'PI';
    return invoiceNumber.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (invoiceNumber) => {
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = invoiceNumber?.charCodeAt(0) || 0;
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
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Purchase Invoices
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Create and manage purchase invoices for procurement
        </Typography>
      </Box>

      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by invoice number, PO number, vendor..."
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
            
            {/* Create Invoice Button - Only show if user has create permission */}
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleAddInvoice}
                sx={{ height: 36, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', fontWeight: 500, textTransform: 'none' }}
                disabled={loading}
              >
                Create Invoice
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
                      indeterminate={selected.length > 0 && selected.length < invoices.length}
                      checked={invoices.length > 0 && selected.length === invoices.length}
                      onChange={handleSelectAll}
                      sx={{ color: COLORS.text.light }}
                      disabled={loading || invoices.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Invoice Number</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Vendor Invoice No</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Vendor</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>PO Number</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Grand Total</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Matching Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60, color: COLORS.text.light }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading invoices...</Typography>
                  </TableCell>
                </TableRow>
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                      {searchTerm ? 'No invoices found' : 'No invoices available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => {
                  const isSelected = selected.includes(invoice._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedInvoiceForAction?._id === invoice._id;
                  const avatarColor = getAvatarColor(invoice.purchase_invoice_number);
                  const statusStyles = getStatusStyles(invoice.status);
                  const matchingStatusStyles = getMatchingStatusStyles(invoice.matching_status);

                  return (
                    <TableRow key={invoice._id} hover selected={isSelected} sx={{ bgcolor: COLORS.background.white, '&:hover': { bgcolor: COLORS.background.hover } }}>
                      {/* Checkbox Column - Only show if user has delete permission */}
                      {canDelete && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox checked={isSelected} onChange={() => handleSelect(invoice._id)} sx={{ color: COLORS.primary }} />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getAvatarInitials(invoice.purchase_invoice_number)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {invoice.purchase_invoice_number}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Date: {formatDate(invoice.invoice_date)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {invoice.vendor_invoice_no}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {formatDate(invoice.vendor_invoice_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {invoice.vendor_name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Code: {invoice.vendor_id?.vendor_code || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {invoice.po_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                          {formatCurrency(invoice.grand_total)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Net: {formatCurrency(invoice.net_payable)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={invoice.matching_status} 
                          size="small" 
                          sx={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 500, 
                            height: 20, 
                            bgcolor: matchingStatusStyles.bg, 
                            color: matchingStatusStyles.text, 
                            border: `1px solid ${matchingStatusStyles.border}` 
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={invoice.status} 
                          size="small" 
                          sx={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 500, 
                            height: 20, 
                            bgcolor: statusStyles.bg, 
                            color: statusStyles.text, 
                            border: `1px solid ${statusStyles.border}` 
                          }} 
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu
                          item={invoice}
                          onView={openViewModalHandler}
                          onThreeWayMatch={openThreeWayMatchModalHandler}
                          onApprove={openApproveModalHandler}
                          onDownloadPDF={openPrintModalHandler}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, invoice)}
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

      {/* Modal Components - Only render if user has appropriate permissions */}
      {canCreate && (
        <AddPurchaseInvoice open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handleInvoiceAdded} />
      )}
      
      {selectedInvoice && (
        <>
          {canViewPage && (
            <ViewPurchaseInvoice open={openViewModal} onClose={() => { setOpenViewModal(false); setSelectedInvoice(null); }} invoice={selectedInvoice} />
          )}
          
          {canUpdate && (
            <ThreeWayMatchModal
              open={openThreeWayMatchModal}
              onClose={() => { setOpenThreeWayMatchModal(false); setSelectedInvoice(null); }}
              invoice={selectedInvoice}
              onMatchComplete={handleThreeWayMatchComplete}
            />
          )}
          
          {canApprove && (
            <ApproveInvoiceModal
              open={openApproveModal}
              onClose={() => { setOpenApproveModal(false); setSelectedInvoice(null); }}
              invoice={selectedInvoice}
              onApproveComplete={handleApproveComplete}
            />
          )}
          
          {canPrint && (
            <PrintPurchaseInvoice
              open={openPrintModal}
              onClose={() => { setOpenPrintModal(false); setSelectedInvoice(null); }}
              invoice={selectedInvoice}
            />
          )}
        </>
      )}

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PurchaseInvoiceMaster;