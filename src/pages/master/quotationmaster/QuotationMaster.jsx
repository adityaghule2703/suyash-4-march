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
  Grid,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  Clear as ClearIcon,
  DateRange as DateIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Autorenew as ReviseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// Import modal components
import AddQuotation from './AddQuotation';
import EditQuotation from './EditQuotation';
import ViewQuotation from './ViewQuotation';
import DeleteQuotation from './DeleteQuotation';
import PrintQuotation from './PrintQuotation';

// Color constants
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
  border: '#E3E8EF'
};

// Status colors
const STATUS_COLORS = {
  'Draft': { bg: '#FEF3C7', text: '#92400E', border: '#FBBF24' },
  'Sent': { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  'Approved': { bg: '#D1FAE5', text: '#065F46', border: '#34D399' },
  'Rejected': { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' }
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

// Action Dialog Component for Confirmations
const ActionDialog = ({ open, onClose, title, message, onConfirm, loading, inputLabel, inputValue, onInputChange, placeholder }) => {
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
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 2 }}>
          {message}
        </Typography>
        {inputLabel && (
          <TextField
            fullWidth
            size="small"
            label={inputLabel}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            multiline
            rows={3}
            placeholder={placeholder}
            sx={{
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
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.75rem',
                color: COLORS.text.secondary
              }
            }}
          />
        )}
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
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading || (inputLabel && !inputValue)}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              bgcolor: COLORS.primaryDark
            }
          }}
        >
          {loading ? 'Processing...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Export Template Selection Dialog Component
const ExportTemplateDialog = ({ open, onClose, quotation, templates, onExport, loading }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleExport = () => {
    if (selectedTemplate && quotation) {
      onExport(quotation._id, selectedTemplate._id);
    }
  };

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
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>
          Select Template for Excel Export
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 0.5 }}>
          Choose a template to export quotation #{quotation?.QuotationNo} to Excel
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px', mb: 1 }}>
            SELECT TEMPLATE <span style={{ color: '#EF4444' }}>*</span>
          </Typography>
          <Autocomplete
            fullWidth
            options={templates}
            value={selectedTemplate}
            onChange={(event, newValue) => setSelectedTemplate(newValue)}
            getOptionLabel={(option) => option.template_name || ''}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select a template"
                required
                sx={{
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
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{option.template_name}</Typography>
                  {option.description && (
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      {option.description}
                    </Typography>
                  )}
                </Box>
              </li>
            )}
          />
        </Box>
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
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={!selectedTemplate || loading}
          startIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              bgcolor: COLORS.primaryDark
            }
          }}
        >
          {loading ? 'Exporting...' : 'Export to Excel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Action Menu Component with all actions
const ActionMenu = ({ 
  item, 
  onView, 
  onEdit, 
  onDelete, 
  onPrint, 
  onExport,
  onSend, 
  onApprove, 
  onReject, 
  onRevise,
  anchorEl, 
  onClose, 
  onOpen, 
  permissions 
}) => {
  const canView = hasPermission(permissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, ACTIONS.DELETE);
  const canPrint = hasPermission(permissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, ACTIONS.PRINT);
  const canExport = hasPermission(permissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, ACTIONS.EXPORT);
  const canApprove = hasPermission(permissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, ACTIONS.APPROVE);
  const canReject = hasPermission(permissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, ACTIONS.REJECT);
  const canSend = hasPermission(permissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, ACTIONS.SEND);

  // Status-based button visibility
  const status = item.Status;
  const showSend = canSend && status === 'Draft';
  const showApprove = canApprove && status === 'Sent';
  const showReject = canReject && (status === 'Draft' || status === 'Sent');
  const showRevise = canUpdate && (status === 'Rejected' || status === 'Sent');

  const hasAnyAction = canView || canUpdate || canDelete || canPrint || canExport || showSend || showApprove || showReject || showRevise;
  
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
            minWidth: 200,
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
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                View Details
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canPrint && (
          <MenuItem onClick={() => { onPrint(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#6B7280', minWidth: 36 }}>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                Generate PDF
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canExport && (
          <MenuItem onClick={() => { onExport(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#059669', minWidth: 36 }}>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                Export to Excel
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {showSend && (
          <MenuItem onClick={() => { onSend(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#3B82F6', minWidth: 36 }}>
              <SendIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                Send to Customer
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {showApprove && (
          <MenuItem onClick={() => { onApprove(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <ApproveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                Approve
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {showReject && (
          <MenuItem onClick={() => { onReject(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
              <RejectIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                Reject
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {showRevise && (
          <MenuItem onClick={() => { onRevise(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <ReviseIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                Revise Quotation
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {(canView || canPrint || canExport || showSend || showApprove || showReject || showRevise) && canDelete && <Divider sx={{ my: 0.5 }} />}
        
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

const QuotationMaster = () => {
  // State for data
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search and filter state
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    quotationType: '',
    customerName: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Menu state
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedQuotationForAction, setSelectedQuotationForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Action dialogs state
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openReviseDialog, setOpenReviseDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviseReason, setReviseReason] = useState('');

  // Selected quotation
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  
  // Templates for export
  const [templates, setTemplates] = useState([]);
  
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
  const [customers, setCustomers] = useState([]);

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
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.success) {
          const userData = response.data.data;
          setIsSuperAdmin(userData.isSuperAdmin || false);
          setUserPermissions(userData.permissions || []);
        }
      } catch (err) {
        console.error('Error fetching user permissions:', err);
      } finally {
        setPermissionsLoaded(true);
      }
    };
    fetchUserPermissions();
  }, []);

  // Check permission helper
  const checkPermission = useCallback((action) => {
    if (isSuperAdmin) return true;
    return hasPermission(userPermissions, MODULES.QUOTATION_MASTER, PAGES.QUOTATION, action);
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
  const canSend = checkPermission(ACTIONS.SEND);

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

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/templates/dropdown`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setTemplates(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  }, []);

  // Fetch quotations
  const fetchQuotations = useCallback(async () => {
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
      if (filters.status) params.append('status', filters.status);
      if (filters.quotationType) params.append('quotationType', filters.quotationType);
      if (filters.customerName) params.append('customerName', filters.customerName);
      
      const response = await axios.get(`${BASE_URL}/api/quotations?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const { data, pagination, statistics } = response.data;
        setQuotations(data || []);
        setTotalItems(pagination.totalItems || pagination.total || 0);
        setStatistics(statistics || {});
        setSelected([]);
      }
    } catch (err) {
      console.error('Error fetching quotations:', err);
      showNotification('Failed to load quotations', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm, filters, canViewPage, isSuperAdmin]);

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/customers?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        setCustomers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchQuotations();
      fetchCustomers();
      if (canExport) fetchTemplates();
    }
  }, [fetchQuotations, fetchCustomers, fetchTemplates, canViewPage, canExport, isSuperAdmin, permissionsLoaded]);

  // Handle actions
  const handleRefresh = () => {
    fetchQuotations();
    showNotification('Data refreshed', 'success');
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setPage(0);
    fetchQuotations();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ status: '', quotationType: '', customerName: '' });
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
    setPage(0);
    setTimeout(() => fetchQuotations(), 0);
  };

  const hasActiveFilters = () => {
    return searchTerm !== '' || filters.status !== '' || 
           filters.quotationType !== '' || filters.customerName !== '';
  };

  const handleSelectAll = (event) => {
    if (!canDelete) return;
    if (event.target.checked) {
      setSelected(quotations.map(q => q._id));
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
    setCurrentPage(newPage + 1);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setCurrentPage(1);
    setSelected([]);
  };

  const handleBulkDelete = async () => {
    if (!canDelete) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/quotations/bulk-delete`, 
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setSelected([]);
      
      if (quotations.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      } else {
        fetchQuotations();
      }
      
      showNotification(`${selected.length} quotations deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete quotations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuotation = () => {
    fetchQuotations();
    showNotification('Quotation added successfully!', 'success');
  };

  const handleEditQuotation = () => {
    fetchQuotations();
    showNotification('Quotation updated successfully!', 'success');
  };

  const handleDeleteQuotation = () => {
    fetchQuotations();
    setSelected([]);
    showNotification('Quotation deleted successfully!', 'success');
  };

  // Handle export with template
  const handleExportWithTemplate = async (quotationId, templateId) => {
    if (!canExport) return;
    setExportLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/quotations/${quotationId}/download?template_id=${templateId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = `quotation_${quotationId}.xlsx`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
          if (!filename.endsWith('.xlsx') && !filename.endsWith('.xls')) {
            filename += '.xlsx';
          }
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showNotification('Quotation exported to Excel successfully!', 'success');
    } catch (err) {
      console.error('Error exporting:', err);
      showNotification('Failed to export quotation', 'error');
    } finally {
      setExportLoading(false);
      setOpenExportDialog(false);
      setSelectedQuotation(null);
    }
  };

  // Handle send quotation
  const handleSendQuotation = async () => {
    if (!selectedQuotation) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/quotations/${selectedQuotation._id}/send`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.data.success) {
        showNotification('Quotation sent to customer successfully!', 'success');
        fetchQuotations();
      }
    } catch (err) {
      console.error('Error sending:', err);
      showNotification('Failed to send quotation', 'error');
    } finally {
      setActionLoading(false);
      setOpenSendDialog(false);
      setSelectedQuotation(null);
    }
  };

  // Handle approve quotation
  const handleApproveQuotation = async () => {
    if (!selectedQuotation) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/quotations/${selectedQuotation._id}/approve`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.data.success) {
        showNotification('Quotation approved successfully!', 'success');
        fetchQuotations();
      }
    } catch (err) {
      console.error('Error approving:', err);
      showNotification('Failed to approve quotation', 'error');
    } finally {
      setActionLoading(false);
      setOpenApproveDialog(false);
      setSelectedQuotation(null);
    }
  };

  // Handle reject quotation
  const handleRejectQuotation = async () => {
    if (!selectedQuotation || !rejectionReason) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/quotations/${selectedQuotation._id}/reject`,
        { rejection_reason: rejectionReason },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.data.success) {
        showNotification('Quotation rejected successfully!', 'success');
        fetchQuotations();
      }
    } catch (err) {
      console.error('Error rejecting:', err);
      showNotification('Failed to reject quotation', 'error');
    } finally {
      setActionLoading(false);
      setOpenRejectDialog(false);
      setSelectedQuotation(null);
      setRejectionReason('');
    }
  };

  // Handle revise quotation
  const handleReviseQuotation = async () => {
    if (!selectedQuotation || !reviseReason) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/quotations/${selectedQuotation._id}/revise`,
        { reason: reviseReason },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.data.success) {
        showNotification('Quotation revision requested successfully!', 'success');
        fetchQuotations();
      }
    } catch (err) {
      console.error('Error revising:', err);
      showNotification('Failed to revise quotation', 'error');
    } finally {
      setActionLoading(false);
      setOpenReviseDialog(false);
      setSelectedQuotation(null);
      setReviseReason('');
    }
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

  const openEditQuotationModal = (quotation) => {
    if (!canUpdate) return;
    setSelectedQuotation(quotation);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openViewQuotationModal = (quotation) => {
    if (!canViewPage) return;
    setSelectedQuotation(quotation);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openDeleteQuotationDialog = (quotation) => {
    if (!canDelete) return;
    setSelectedQuotation(quotation);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const openPrintQuotation = (quotation) => {
    if (!canPrint) return;
    setSelectedQuotation(quotation);
    setOpenPrintModal(true);
    handleActionMenuClose();
  };

  const openExportQuotationDialog = (quotation) => {
    if (!canExport) return;
    setSelectedQuotation(quotation);
    setOpenExportDialog(true);
    handleActionMenuClose();
  };

  const openSendDialogHandler = (quotation) => {
    setSelectedQuotation(quotation);
    setOpenSendDialog(true);
    handleActionMenuClose();
  };

  const openApproveDialogHandler = (quotation) => {
    setSelectedQuotation(quotation);
    setOpenApproveDialog(true);
    handleActionMenuClose();
  };

  const openRejectDialogHandler = (quotation) => {
    setSelectedQuotation(quotation);
    setOpenRejectDialog(true);
    handleActionMenuClose();
  };

  const openReviseDialogHandler = (quotation) => {
    setSelectedQuotation(quotation);
    setOpenReviseDialog(true);
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 2
    }).format(amount);
  };

  const getQuotationInitials = (quotationNo) => {
    if (!quotationNo) return 'QT';
    return quotationNo.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (quotationNo) => {
    if (!quotationNo) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = quotationNo.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

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

  if (!permissionsLoaded) return <LoadingState />;
  if (!canViewPage && !isSuperAdmin) return <AccessDenied />;

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Quotation Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and track customer quotations and purchase requests
        </Typography>
      </Box>

      {/* Action Bar */}
      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by quotation no, customer, or company..."
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
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { height: 36, bgcolor: COLORS.background.light }
              }}
            />
            {hasActiveFilters() && (
              <Button variant="text" size="small" onClick={clearFilters} sx={{ height: 36, fontSize: '0.7rem' }}>
                Clear All
              </Button>
            )}
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            
            
            {canDelete && selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleBulkDelete}
                sx={{ height: 36, borderRadius: 1.5, fontSize: '0.75rem' }}
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
                sx={{ height: 36, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem' }}
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
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                    <MenuItem value="Sent">Sent</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
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
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Detailed">Detailed</MenuItem>
                    <MenuItem value="Summary">Summary</MenuItem>
                    <MenuItem value="CostBreakup">Cost Breakup</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Customer</InputLabel>
                  <Select
                    value={filters.customerName}
                    label="Customer"
                    onChange={(e) => handleFilterChange('customerName', e.target.value)}
                    sx={{ fontSize: '0.75rem', height: 36 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {customers.map(customer => (
                      <MenuItem key={customer._id} value={customer.customer_name}>
                        {customer.customer_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" onClick={applyFilters} fullWidth sx={{ height: 36, bgcolor: COLORS.primary }}>
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Quotations Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                {canDelete && <TableCell padding="checkbox" sx={{ width: 40 }} />}
                <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }}>Quotation No</TableCell>
                <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }}>Customer Details</TableCell>
                <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }}>Dates</TableCell>
                <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }} align="right">Amount</TableCell>
                <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }} align="center">Status</TableCell>
                {canExport && (
                  <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }} align="center">Export</TableCell>
                )}
                <TableCell sx={{ color: COLORS.text.light, fontSize: '0.7rem', fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canDelete && canExport ? 9 : (canDelete || canExport ? 8 : 7)} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                  </TableCell>
                </TableRow>
              ) : quotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete && canExport ? 9 : (canDelete || canExport ? 8 : 7)} align="center" sx={{ py: 6 }}>
                    <Typography>No quotations found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                quotations.map((quotation) => {
                  const isSelected = selected.includes(quotation._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedQuotationForAction?._id === quotation._id;
                  const avatarColor = getAvatarColor(quotation.QuotationNo);

                  return (
                    <TableRow key={quotation._id} hover selected={isSelected}>
                      {canDelete && (
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} onChange={() => handleSelect(quotation._id)} />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem' }}>
                            {getQuotationInitials(quotation.QuotationNo)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{quotation.QuotationNo}</Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Items: {quotation.Items?.length || 0}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{quotation.CustomerName || 'N/A'}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>{quotation.CustomerGSTIN || 'N/A'}</Typography>
                        {quotation.CustomerEmail && (
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>{quotation.CustomerEmail}</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>{quotation.CompanyName}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>{quotation.CompanyGSTIN}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="column" spacing={0.5}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <DateIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem' }}>Q: {formatDate(quotation.QuotationDate)}</Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <DateIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem' }}>V: {formatDate(quotation.ValidTill)}</Typography>
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
                      <TableCell align="center">{getStatusChip(quotation.Status)}</TableCell>
                      {canExport && (
                        <TableCell align="center">
                          <Tooltip title="Export to Excel">
                            <IconButton
                              size="small"
                              onClick={() => openExportQuotationDialog(quotation)}
                              sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20`, color: COLORS.primary } }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <ActionMenu
                          item={quotation}
                          onView={openViewQuotationModal}
                          onEdit={openEditQuotationModal}
                          onDelete={openDeleteQuotationDialog}
                          onPrint={openPrintQuotation}
                          onExport={openExportQuotationDialog}
                          onSend={openSendDialogHandler}
                          onApprove={openApproveDialogHandler}
                          onReject={openRejectDialogHandler}
                          onRevise={openReviseDialogHandler}
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

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Modals */}
      {canCreate && <AddQuotation open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handleAddQuotation} />}
      {selectedQuotation && canUpdate && (
        <EditQuotation open={openEditModal} onClose={() => { setOpenEditModal(false); setSelectedQuotation(null); }} quotation={selectedQuotation} onUpdate={handleEditQuotation} />
      )}
      {selectedQuotation && canViewPage && (
        <ViewQuotation open={openViewModal} onClose={() => { setOpenViewModal(false); setSelectedQuotation(null); }} quotation={selectedQuotation} />
      )}
      {selectedQuotation && canDelete && (
        <DeleteQuotation open={openDeleteDialog} onClose={() => { setOpenDeleteDialog(false); setSelectedQuotation(null); }} quotation={selectedQuotation} onDelete={handleDeleteQuotation} />
      )}
      {selectedQuotation && canPrint && (
        <PrintQuotation open={openPrintModal} onClose={() => { setOpenPrintModal(false); setSelectedQuotation(null); }} quotation={selectedQuotation} />
      )}
      {selectedQuotation && canExport && (
        <ExportTemplateDialog open={openExportDialog} onClose={() => { setOpenExportDialog(false); setSelectedQuotation(null); }} quotation={selectedQuotation} templates={templates} onExport={handleExportWithTemplate} loading={exportLoading} />
      )}
      {selectedQuotation && (
        <>
          <ActionDialog open={openSendDialog} onClose={() => { setOpenSendDialog(false); setSelectedQuotation(null); }} title="Send Quotation" message={`Send quotation to ${selectedQuotation.CustomerName}?`} onConfirm={handleSendQuotation} loading={actionLoading} />
          <ActionDialog open={openApproveDialog} onClose={() => { setOpenApproveDialog(false); setSelectedQuotation(null); }} title="Approve Quotation" message="Approve this quotation?" onConfirm={handleApproveQuotation} loading={actionLoading} />
          <ActionDialog open={openRejectDialog} onClose={() => { setOpenRejectDialog(false); setSelectedQuotation(null); setRejectionReason(''); }} title="Reject Quotation" message="Provide rejection reason:" onConfirm={handleRejectQuotation} loading={actionLoading} inputLabel="Rejection Reason" inputValue={rejectionReason} onInputChange={setRejectionReason} placeholder="Enter reason..." />
          <ActionDialog open={openReviseDialog} onClose={() => { setOpenReviseDialog(false); setSelectedQuotation(null); setReviseReason(''); }} title="Revise Quotation" message="Provide revision reason:" onConfirm={handleReviseQuotation} loading={actionLoading} inputLabel="Revision Reason" inputValue={reviseReason} onInputChange={setReviseReason} placeholder="Enter reason..." />
        </>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1.5 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default QuotationMaster;