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
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Clear as ClearIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  DateRange as DateIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// Import modal components
import AddQuotation from './AddQuotation';
import EditQuotation from './EditQuotation';
import ViewQuotation from './ViewQuotation';
import DeleteQuotation from './DeleteQuotation';
import PrintQuotation from './PrintQuotation';
import { FilterIcon } from 'lucide-react';

// Color constants - Single color #063C3F throughout
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

// Status colors
const STATUS_COLORS = {
  'Draft': { bg: '#FEF3C7', text: '#92400E', border: '#FBBF24' },
  'Sent': { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  'Approved': { bg: '#D1FAE5', text: '#065F46', border: '#34D399' },
  'Rejected': { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' }
};

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
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
const ActionMenu = ({ item, onView, onEdit, onDelete, onPrint, anchorEl, onClose, onOpen, permissions }) => {
  const canView = hasPermission(permissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, ACTIONS.DELETE);
  const canPrint = hasPermission(permissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, ACTIONS.PRINT);

  // Check if any actions are available
  const hasAnyAction = canView || canUpdate || canDelete || canPrint;
  
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
        
        {canPrint && (
          <MenuItem 
            onClick={() => {
              onPrint(item);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#6B7280', minWidth: 36 }}>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Generate PDF
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {(canView || canPrint) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
        
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

const QuotationMaster = () => {
  // State for data
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    quotationType: '',
    vendorName: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedQuotationForAction, setSelectedQuotationForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPrintModal, setOpenPrintModal] = useState(false);

  // Selected quotation
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Statistics state
  const [statistics, setStatistics] = useState({
    totalQuotations: 0,
    totalAmount: 0,
    avgAmount: 0,
    draftCount: 0,
    sentCount: 0,
    approvedCount: 0
  });

  // Filter options
  const [vendors, setVendors] = useState([]);

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
  const checkPermission = useCallback((action) => {
    // Super admin has all permissions
    if (isSuperAdmin) return true;
    
    return hasPermission(
      userPermissions,
      MODULES.QUOTATION_MASTER,
      PAGES.QUOTATION,
      action
    );
  }, [userPermissions, isSuperAdmin]);

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canPrint = checkPermission(ACTIONS.PRINT);
  const canExport = checkPermission(ACTIONS.EXPORT);
  const canApprove = checkPermission(ACTIONS.APPROVE);
  const canReject = checkPermission(ACTIONS.REJECT);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch quotations with pagination and filters
  const fetchQuotations = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });
      
      // Add search term if present
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // Add filters if present
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.quotationType) {
        params.append('quotationType', filters.quotationType);
      }
      if (filters.vendorName) {
        params.append('vendorName', filters.vendorName);
      }
      
      const response = await axios.get(`${BASE_URL}/api/quotations?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const { data: quotationsData, pagination, statistics } = response.data;
        setQuotations(quotationsData || []);
        setTotalItems(pagination.totalItems);
        setTotalPages(pagination.totalPages);
        setStatistics(statistics || {
          totalQuotations: 0,
          totalAmount: 0,
          avgAmount: 0,
          draftCount: 0,
          sentCount: 0,
          approvedCount: 0
        });
        
        // Clear selected items when data changes
        setSelected([]);
      } else {
        showNotification('Failed to load quotations', 'error');
      }
    } catch (err) {
      console.error('Error fetching quotations:', err);
      showNotification('Failed to load quotations. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, filters]);

  // Fetch vendors for filter dropdown
  const fetchVendors = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/vendors?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setVendors(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
  }, []);

  // Initial load - only if user has permission
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchQuotations();
      fetchVendors();
    }
  }, [fetchQuotations, fetchVendors, canViewPage, isSuperAdmin, permissionsLoaded]);

  // Handle refresh
  const handleRefresh = () => {
    fetchQuotations();
    showNotification('Data refreshed', 'success');
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    setPage(0);
    fetchQuotations();
    setShowFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: '',
      quotationType: '',
      vendorName: ''
    });
    setSearchInput('');
    setSearchTerm('');
    setPage(0);
    setTimeout(() => fetchQuotations(), 0);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return searchTerm !== '' || filters.status !== '' || 
           filters.quotationType !== '' || filters.vendorName !== '';
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (filters.status) count++;
    if (filters.quotationType) count++;
    if (filters.vendorName) count++;
    return count;
  };
  
  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(quotations.map(quotation => quotation._id));
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
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setSelected([]);
  };
  
  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!canDelete) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await Promise.all(selected.map(id => 
        axios.delete(`${BASE_URL}/api/quotations/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ));
      
      showNotification(`${selected.length} quotations deleted successfully!`, 'success');
      setSelected([]);
      fetchQuotations();
    } catch (err) {
      console.error('Error deleting quotations:', err);
      showNotification('Failed to delete quotations', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle add quotation
  const handleAddQuotation = () => {
    fetchQuotations();
    showNotification('Quotation added successfully!', 'success');
  };
  
  // Handle edit quotation
  const handleEditQuotation = () => {
    fetchQuotations();
    showNotification('Quotation updated successfully!', 'success');
  };
  
  // Handle delete quotation
  const handleDeleteQuotation = () => {
    fetchQuotations();
    setSelected([]);
    showNotification('Quotation deleted successfully!', 'success');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, quotation) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedQuotationForAction(quotation);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedQuotationForAction(null);
  };

  // Open edit modal
  const openEditQuotationModal = (quotation) => {
    if (!canUpdate) return;
    setSelectedQuotation(quotation);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  // Open view modal
  const openViewQuotationModal = (quotation) => {
    if (!canViewPage) return;
    setSelectedQuotation(quotation);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteQuotationDialog = (quotation) => {
    if (!canDelete) return;
    setSelectedQuotation(quotation);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  // Open print modal
  const openPrintQuotation = (quotation) => {
    if (!canPrint) return;
    setSelectedQuotation(quotation);
    setOpenPrintModal(true);
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
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Get quotation initials for avatar
  const getQuotationInitials = (quotationNo) => {
    if (!quotationNo) return 'QT';
    return quotationNo.substring(0, 2).toUpperCase();
  };
  
  // Get avatar color based on quotation number
  const getAvatarColor = (quotationNo) => {
    if (!quotationNo) return COLORS.primary;
    
    const colors = [
      COLORS.primary,
      COLORS.primaryDark,
      '#074346',
      '#0D696C',
      '#128C7E'
    ];
    
    const charCode = quotationNo.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  // Status chip
  const getStatusChip = (status) => {
    const colors = STATUS_COLORS[status] || STATUS_COLORS.Draft;
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          bgcolor: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          fontWeight: 600,
          fontSize: '0.65rem',
          height: 20
        }}
      />
    );
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
          Quotation Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and track vendor quotations and purchase requests
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
          {/* Search and Filters */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by quotation no, vendor, or company..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 320 },
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
                    <IconButton size="small" onClick={() => {
                      setSearchInput('');
                      setSearchTerm('');
                    }}>
                      <ClearIcon fontSize="small" />
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
         
            {hasActiveFilters() && (
              <Button
                variant="text"
                size="small"
                onClick={clearFilters}
                sx={{ 
                  height: 36,
                  color: COLORS.text.secondary,
                  fontSize: '0.7rem',
                  textTransform: 'none'
                }}
              >
                Clear All
              </Button>
            )}
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
            
            {/* Add Quotation Button - Only show if user has create permission */}
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
                Add Quotation
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Filter Panel */}
        {showFilters && (
          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${COLORS.border}` }}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    sx={{ fontSize: '0.75rem', height: 36 }}
                  >
                    <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All</MenuItem>
                    <MenuItem value="Draft" sx={{ fontSize: '0.75rem' }}>Draft</MenuItem>
                    <MenuItem value="Sent" sx={{ fontSize: '0.75rem' }}>Sent</MenuItem>
                    <MenuItem value="Approved" sx={{ fontSize: '0.75rem' }}>Approved</MenuItem>
                    <MenuItem value="Rejected" sx={{ fontSize: '0.75rem' }}>Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Quotation Type</InputLabel>
                  <Select
                    value={filters.quotationType}
                    label="Quotation Type"
                    onChange={(e) => handleFilterChange('quotationType', e.target.value)}
                    sx={{ fontSize: '0.75rem', height: 36 }}
                  >
                    <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All</MenuItem>
                    <MenuItem value="Detailed" sx={{ fontSize: '0.75rem' }}>Detailed</MenuItem>
                    <MenuItem value="Summary" sx={{ fontSize: '0.75rem' }}>Summary</MenuItem>
                    <MenuItem value="CostBreakup" sx={{ fontSize: '0.75rem' }}>Cost Breakup</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Vendor</InputLabel>
                  <Select
                    value={filters.vendorName}
                    label="Vendor"
                    onChange={(e) => handleFilterChange('vendorName', e.target.value)}
                    sx={{ fontSize: '0.75rem', height: 36 }}
                  >
                    <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All</MenuItem>
                    {vendors.map(vendor => (
                      <MenuItem key={vendor._id} value={vendor.VendorName} sx={{ fontSize: '0.75rem' }}>
                        {vendor.VendorName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  onClick={applyFilters}
                  fullWidth
                  sx={{
                    height: 36,
                    borderRadius: 1.5,
                    bgcolor: COLORS.primary,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: COLORS.primaryDark
                    }
                  }}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Quotations Table */}
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
                      indeterminate={selected.length > 0 && selected.length < quotations.length}
                      checked={quotations.length > 0 && selected.length === quotations.length}
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
                      disabled={loading || quotations.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Quotation No
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Vendor Details
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Company
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Dates
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }} align="right">
                  Amount
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
                  <TableCell colSpan={canDelete ? 8 : 7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading quotations...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : quotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 8 : 7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {hasActiveFilters() ? 'No quotations found matching your filters' : 'No quotations available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {hasActiveFilters() ? 'Try adjusting your filters' : 'Add your first quotation to get started'}
                      </Typography>
                      {hasActiveFilters() && (
                        <Button
                          variant="text"
                          onClick={clearFilters}
                          sx={{ mt: 2, fontSize: '0.75rem', color: COLORS.primary }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                quotations.map((quotation) => {
                  const isSelected = selected.includes(quotation._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedQuotationForAction?._id === quotation._id;
                  const avatarColor = getAvatarColor(quotation.QuotationNo);

                  return (
                    <TableRow
                      key={quotation._id}
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
                            onChange={() => handleSelect(quotation._id)}
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
                            {getQuotationInitials(quotation.QuotationNo)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {quotation.QuotationNo}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Items: {quotation.Items?.length || 0}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {quotation.VendorName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {quotation.VendorGSTIN}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {quotation.CompanyName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {quotation.CompanyGSTIN}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="column" spacing={0.5}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <DateIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                              Q: {formatDate(quotation.QuotationDate)}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <DateIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                              V: {formatDate(quotation.ValidTill)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                          {formatCurrency(quotation.GrandTotal)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          GST: {quotation.GSTPercentage}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={quotation}
                          onView={openViewQuotationModal}
                          onEdit={openEditQuotationModal}
                          onDelete={openDeleteQuotationDialog}
                          onPrint={openPrintQuotation}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, quotation)}
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
            '& .MuiTablePagination-select': {
              fontSize: '0.7rem'
            },
            '& .MuiTablePagination-actions button': {
              color: COLORS.primary,
            }
          }}
        />
      </Paper>

      {/* Modal Components - Only render modals if user has appropriate permissions */}
      {canCreate && (
        <AddQuotation 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddQuotation}
        />
      )}

      {selectedQuotation && (
        <>
          {canUpdate && (
            <EditQuotation 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedQuotation(null);
              }}
              quotation={selectedQuotation}
              onUpdate={handleEditQuotation}
            />
          )}

          {canViewPage && (
            <ViewQuotation 
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedQuotation(null);
              }}
              quotation={selectedQuotation}
              onEdit={() => {
                if (canUpdate) {
                  setOpenViewModal(false);
                  setOpenEditModal(true);
                }
              }}
            />
          )}

          {canPrint && (
            <PrintQuotation
              open={openPrintModal}
              onClose={() => {
                setOpenPrintModal(false);
                setSelectedQuotation(null);
              }}
              quotation={selectedQuotation}
            />
          )}

          {canDelete && (
            <DeleteQuotation 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedQuotation(null);
              }}
              quotation={selectedQuotation}
              onDelete={handleDeleteQuotation}
            />
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

export default QuotationMaster;