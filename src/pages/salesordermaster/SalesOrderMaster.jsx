// SalesOrderMaster.jsx
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  History as HistoryIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';
import AddSaleOrder from './AddSaleOrder';
import ViewSaleOrder from './ViewSaleOrder';
import EditSaleOrder from './EditSaleOrder';
import DeleteSaleOrder from './DeleteSaleOrder';
import { COLORS } from './constants';
import { ACTIONS, hasPermission, MODULES, PAGES } from '../../utils/modulePermissions';


// Status colors
const STATUS_COLORS = {
  'Draft': { bg: '#FEF3C7', color: '#92400E', border: '#FBBF24' },
  'Confirmed': { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' },
  'In Production': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'Ready for Dispatch': { bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' },
  'Partially Delivered': { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  'Fully Delivered': { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  'Closed': { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  'Cancelled': { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' }
};

// SO Status Transitions
const SO_STATUS_TRANSITIONS = {
  'Draft': ['Confirmed', 'Cancelled'],
  'Confirmed': ['In Production', 'Cancelled'],
  'In Production': ['Ready for Dispatch', 'Cancelled'],
  'Ready for Dispatch': ['Partially Delivered', 'Fully Delivered'],
  'Partially Delivered': ['Fully Delivered', 'Cancelled'],
  'Fully Delivered': ['Closed'],
  'Closed': [],
  'Cancelled': [],
};

const ITEM_STATUSES = ['Pending', 'In Production', 'Ready', 'Partially Delivered', 'Delivered', 'Cancelled'];
const CURRENCY_OPTIONS = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
const DELIVERY_TERMS_OPTIONS = ['Ex-Works', 'FOR Destination', 'CIF', 'FOB', ''];
const DELIVERY_MODE_OPTIONS = ['Road', 'Rail', 'Air', 'Sea', 'Hand Delivery', ''];

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
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onStatusUpdate, onHistory, permissions }) => {
  const currentStatus = item?.status || 'Draft';
  const availableTransitions = SO_STATUS_TRANSITIONS[currentStatus] || [];
  
  // Permission checks
  const canView = hasPermission(permissions, MODULES.SALES_ORDER_MASTER, PAGES.SALES_ORDER_MASTER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.SALES_ORDER_MASTER, PAGES.SALES_ORDER_MASTER, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.SALES_ORDER_MASTER, PAGES.SALES_ORDER_MASTER, ACTIONS.DELETE);
  const canApprove = hasPermission(permissions, MODULES.SALES_ORDER_MASTER, PAGES.SALES_ORDER_MASTER, ACTIONS.APPROVE);

  // Check if any action is available
  const hasAnyAction = canView || canUpdate || canDelete || canApprove;

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
        
        {canUpdate && (
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
        
        {/* Confirm Button - Requires APPROVE permission */}
        {canApprove && currentStatus === 'Draft' && (
          <MenuItem onClick={() => { onStatusUpdate(item, 'confirm'); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Confirm
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {/* Regular Status Update for other transitions - Requires UPDATE permission */}
        {canUpdate && availableTransitions.length > 0 && currentStatus !== 'Draft' && (
          <MenuItem onClick={() => { onStatusUpdate(item, 'regular'); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <SendIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>
                Update Status
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {/* History Button - Uses VIEW permission */}
        {canView && (
          <MenuItem onClick={() => { onHistory(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
              <HistoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
                View History
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {(canView || canUpdate) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
        
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

// History Modal Component (kept the same as original)
const HistoryModal = ({ open, onClose, so, historyData, loading }) => {
  const getStatusIcon = (action, status) => {
    if (action === 'created') return <AddIcon sx={{ fontSize: '1rem', color: '#10B981' }} />;
    if (status === 'Confirmed') return <CheckCircleIcon sx={{ fontSize: '1rem', color: '#3B82F6' }} />;
    if (status === 'Cancelled') return <CancelIcon sx={{ fontSize: '1rem', color: '#EF4444' }} />;
    if (status === 'Fully Delivered' || status === 'Closed') return <CheckCircleOutlineIcon sx={{ fontSize: '1rem', color: '#10B981' }} />;
    return <ScheduleIcon sx={{ fontSize: '1rem', color: '#F59E0B' }} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStepStatus = (action, status, index, historyLength, currentStatus) => {
    if (action === 'created') return 'completed';
    if (index === historyLength - 1) return 'active';
    return 'completed';
  };

  // Helper to format action label without showing email
  const getActionLabel = (log) => {
    if (log.action === 'created') {
      return 'Order Created';
    }
    if (log.action === 'status_change') {
      return `Status Changed to ${log.new_value}`;
    }
    return log.action;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '80vh'
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
        <Stack direction="row" spacing={1} alignItems="center">
          <HistoryIcon sx={{ color: COLORS.primary, fontSize: '1.25rem' }} />
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
              Order History
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              {so?.so_number} - {so?.customer_name}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, bgcolor: COLORS.background.light }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
          </Box>
        ) : !historyData || historyData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <HistoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
            <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
              No history available for this order
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 2.5 }}>
            {/* Current Status Badge */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Chip
                icon={so?.status === 'Confirmed' ? <CheckCircleIcon /> : so?.status === 'Cancelled' ? <CancelIcon /> : <PendingIcon />}
                label={`Current Status: ${so?.status || 'Draft'}`}
                sx={{
                  bgcolor: STATUS_COLORS[so?.status]?.bg || '#F1F5F9',
                  color: STATUS_COLORS[so?.status]?.color || '#475569',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
            </Box>

            {/* Stepper View */}
            <Stepper orientation="vertical" activeStep={historyData.length - 1}>
              {historyData.map((log, index) => {
                const isLast = index === historyData.length - 1;
                const actionLabel = getActionLabel(log);
                
                return (
                  <Step key={log._id || index} active={isLast} completed={!isLast}>
                    <StepLabel
                      StepIconComponent={() => getStatusIcon(log.action, log.new_value)}
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontSize: '0.875rem',
                          fontWeight: isLast ? 600 : 400,
                          color: isLast ? COLORS.primary : COLORS.text.primary
                        }
                      }}
                    >
                      {actionLabel}
                    </StepLabel>
                    <StepContent>
                      <Card sx={{ 
                        mb: 2, 
                        borderRadius: 1.5,
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: 'none',
                        bgcolor: COLORS.background.white
                      }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Grid container spacing={1}>
                            {log.notes && (
                              <Grid item xs={12}>
                                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 1 }}>
                                  {log.notes}
                                </Typography>
                              </Grid>
                            )}
                            <Grid item xs={12}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                                  Changed by: <strong>{log.changed_by?.Username || 'System'}</strong>
                                </Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                                  {formatDate(log.changed_at)}
                                </Typography>
                              </Stack>
                            </Grid>
                            {log.old_value && log.new_value && log.action === 'status_change' && (
                              <Grid item xs={12}>
                                <Stack direction="row" spacing={1}>
                                  <Chip 
                                    label={`From: ${log.old_value}`} 
                                    size="small"
                                    sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#FEE2E2', color: '#DC2626' }}
                                  />
                                  <Chip 
                                    label={`To: ${log.new_value}`} 
                                    size="small"
                                    sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#D1FAE5', color: '#059669' }}
                                  />
                                </Stack>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>

            {/* Summary Card */}
            <Card sx={{ 
              mt: 3, 
              borderRadius: 1.5,
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.background.white
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: COLORS.text.primary }}>
                  Summary
                </Typography>
                <Stack direction="row" spacing={3}>
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Total Events
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {historyData.length}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Last Updated
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {historyData.length > 0 ? formatDate(historyData[historyData.length - 1].changed_at) : '-'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
      }}>
        <Button
          onClick={onClose}
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SalesOrderMaster = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedSOForAction, setSelectedSOForAction] = useState(null);
  const [selectedSO, setSelectedSO] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
    
    return hasPermission(
      userPermissions,
      MODULES.SALES_ORDER_MASTER,
      PAGES.SALES_ORDER_MASTER,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canApprove = checkPermission(ACTIONS.APPROVE);
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

  // Fetch Sales Orders from API - only if user has permission
  const fetchSalesOrders = useCallback(async () => {
    // Don't show loading indicator while typing search and only if user has permission
    if (!canViewPage && !isSuperAdmin) return;
    
    if (!isSearchingRef.current) {
      setLoading(true);
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: rowsPerPage
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await axios.get(`${BASE_URL}/api/sales-orders?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setSalesOrders(response.data.data || []);
        setTotalItems(response.data.pagination?.total || 0);
      } else {
        showNotification('Failed to load Sales Orders', 'error');
      }
    } catch (err) {
      console.error('Error fetching Sales Orders:', err);
      showNotification('Failed to load Sales Orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchSalesOrders();
    }
  }, [fetchSalesOrders, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleRefresh = () => {
    fetchSalesOrders();
    showNotification('Data refreshed', 'success');
  };

  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(salesOrders.map(so => so._id));
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
    if (!canDelete || selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/sales-orders/bulk-delete`, 
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setSelected([]);
      
      if (salesOrders.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      } else {
        fetchSalesOrders();
      }
      
      showNotification(`${selected.length} Sales Order(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete Sales Orders', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddSO = () => {
    fetchSalesOrders();
    showNotification('Sales Order added successfully!', 'success');
  };
  
  const handleEditSO = () => {
    fetchSalesOrders();
    showNotification('Sales Order updated successfully!', 'success');
  };
  
  const handleDeleteSO = () => {
    fetchSalesOrders();
    setSelected([]);
    showNotification('Sales Order deleted successfully!', 'success');
  };
  
  // Handle Confirm API Call - Requires APPROVE permission
  const handleConfirm = async (so) => {
    if (!canApprove) {
      showNotification('You don\'t have permission to confirm orders', 'error');
      return;
    }
    
    setConfirmLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/sales-orders/${so._id}/confirm`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        showNotification('Sales Order confirmed successfully!', 'success');
        fetchSalesOrders();
      } else {
        showNotification(response.data.message || 'Failed to confirm order', 'error');
      }
    } catch (err) {
      console.error('Error confirming order:', err);
      showNotification('Failed to confirm order', 'error');
    } finally {
      setConfirmLoading(false);
    }
  };
  
  // Handle Regular Status Update - Requires UPDATE permission
  const handleStatusUpdate = async () => {
    if (!canUpdate) {
      showNotification('You don\'t have permission to update status', 'error');
      return;
    }
    
    if (!selectedSO || !selectedStatus) return;
    
    setStatusLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/sales-orders/${selectedSO._id}/status`,
        { status: selectedStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        showNotification(`Status updated to ${selectedStatus} successfully!`, 'success');
        fetchSalesOrders();
        setOpenStatusDialog(false);
        setSelectedSO(null);
        setSelectedStatus('');
      } else {
        showNotification(response.data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showNotification('Failed to update status', 'error');
    } finally {
      setStatusLoading(false);
    }
  };
  
  // Handle View History - Requires VIEW permission
  const handleViewHistory = async (so) => {
    if (!canViewPage) return;
    
    setSelectedSO(so);
    setOpenHistoryModal(true);
    setHistoryLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/sales-orders/${so._id}/history`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setHistoryData(response.data.data);
      } else {
        showNotification('Failed to load history', 'error');
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      showNotification('Failed to load history', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };
  
  const handleActionMenuOpen = (event, so) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedSOForAction(so);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedSOForAction(null);
  };

  const openViewSOModal = (so) => {
    if (!canViewPage) return;
    setSelectedSO(so);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openEditSOModal = (so) => {
    if (!canUpdate) return;
    setSelectedSO(so);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteSODialog = (so) => {
    if (!canDelete) return;
    setSelectedSO(so);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };
  
  const openStatusUpdateDialog = (so, type) => {
    if (type === 'confirm') {
      handleConfirm(so);
    } else {
      if (!canUpdate) {
        showNotification('You don\'t have permission to update status', 'error');
        return;
      }
      setSelectedSO(so);
      setSelectedStatus(so.status || 'Draft');
      setOpenStatusDialog(true);
    }
    handleActionMenuClose();
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
  
  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Fully Delivered':
      case 'Closed':
        return <CheckCircleIcon sx={{ fontSize: '0.8rem', color: '#059669' }} />;
      case 'Confirmed':
      case 'In Production':
      case 'Ready for Dispatch':
      case 'Partially Delivered':
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#D97706' }} />;
      case 'Cancelled':
        return <CancelIcon sx={{ fontSize: '0.8rem', color: '#DC2626' }} />;
      default:
        return <PendingIcon sx={{ fontSize: '0.8rem', color: '#4F46E5' }} />;
    }
  };
  
  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
  };
  
  const getSOInitials = (so) => {
    if (!so.so_number) return 'SO';
    return so.so_number.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (so) => {
    if (!so.so_number) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = so.so_number.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  const getAvailableStatuses = (currentStatus) => {
    return SO_STATUS_TRANSITIONS[currentStatus] || [];
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
          Sales Order Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and track sales orders, deliveries, and customer requirements
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
          {/* Search */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by SO Number, Customer, or PO Number..."
              size="small"
              value={searchInput}
              onChange={handleSearchChange}
              autoComplete="off"
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
            />
          </Stack>

          {/* Action Buttons - Conditionally rendered based on permissions */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Refresh Button - Available to all users with view permission */}
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
            
            {/* Add Sales Order Button - Only show if user has create permission */}
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
                Add Sales Order
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Sales Orders Table */}
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
                      indeterminate={selected.length > 0 && selected.length < salesOrders.length}
                      checked={salesOrders.length > 0 && selected.length === salesOrders.length}
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
                      disabled={loading || salesOrders.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  SO No / Customer
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  PO Details
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Order Details
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Delivery
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
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading Sales Orders...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : salesOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 8 : 7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ShippingIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No Sales Orders found' : 'No Sales Orders available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first Sales Order to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                salesOrders.map((so) => {
                  const isSelected = selected.includes(so._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedSOForAction?._id === so._id;
                  const avatarColor = getAvatarColor(so);
                  const statusColors = getStatusColor(so.status);
                  
                  return (
                    <TableRow
                      key={so._id}
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
                            onChange={() => handleSelect(so._id)}
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
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getSOInitials(so)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {so.so_number}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {so.customer_name}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {so.customer_po_number || '-'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Date: {formatDate(so.customer_po_date)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          QT: {so.quotation_no || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {so.so_date ? formatDate(so.so_date) : '-'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Items: {so.items?.length || 0}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Terms: {so.payment_terms || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                          {formatCurrency(so.grand_total)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Sub: {formatCurrency(so.sub_total)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(so.status)}
                          label={so.status || 'Draft'}
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
                        <Typography sx={{ fontSize: '0.7rem' }}>
                          <ShippingIcon sx={{ fontSize: '0.7rem', mr: 0.5, verticalAlign: 'middle', color: COLORS.text.tertiary }} />
                          {so.delivery_mode || '-'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {so.delivery_terms || '-'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          EDD: {formatDate(so.expected_delivery_date)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={so}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onOpen={(e) => handleActionMenuOpen(e, so)}
                          onClose={handleActionMenuClose}
                          onView={openViewSOModal}
                          onEdit={openEditSOModal}
                          onDelete={openDeleteSODialog}
                          onStatusUpdate={openStatusUpdateDialog}
                          onHistory={handleViewHistory}
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

      {/* Modal Components - Only render if user has appropriate permissions */}
      {canCreate && (
        <AddSaleOrder 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddSO}
        />
      )}

      {selectedSO && (
        <>
          {canViewPage && (
            <ViewSaleOrder 
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedSO(null);
              }}
              so={selectedSO}
            />
          )}

          {canUpdate && (
            <EditSaleOrder 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedSO(null);
              }}
              so={selectedSO}
              onUpdate={handleEditSO}
            />
          )}

          {canDelete && (
            <DeleteSaleOrder 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedSO(null);
              }}
              so={selectedSO}
              onDelete={handleDeleteSO}
            />
          )}

          {/* History Modal - Uses VIEW permission */}
          {canViewPage && (
            <HistoryModal
              open={openHistoryModal}
              onClose={() => {
                setOpenHistoryModal(false);
                setSelectedSO(null);
                setHistoryData(null);
              }}
              so={selectedSO}
              historyData={historyData?.audit_log || []}
              loading={historyLoading}
            />
          )}

          {/* Status Update Dialog */}
          {canUpdate && (
            <Dialog
              open={openStatusDialog}
              onClose={() => {
                setOpenStatusDialog(false);
                setSelectedSO(null);
                setSelectedStatus('');
              }}
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
                  Update Status
                </Typography>
                <IconButton onClick={() => setOpenStatusDialog(false)} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 2.5 }}>
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 2 }}>
                  Sales Order: <strong>{selectedSO?.so_number}</strong>
                </Typography>
                
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Select New Status</InputLabel>
                  <Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    label="Select New Status"
                    sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
                  >
                    {getAvailableStatuses(selectedSO?.status).map(status => (
                      <MenuItem key={status} value={status} sx={{ fontSize: '0.75rem' }}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions sx={{
                px: 2.5,
                py: 1.5,
                borderTop: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.background.white,
                gap: 1
              }}>
                <Button
                  onClick={() => setOpenStatusDialog(false)}
                  disabled={statusLoading}
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
                  onClick={handleStatusUpdate}
                  disabled={!selectedStatus || statusLoading}
                  sx={{
                    height: 32,
                    px: 2,
                    borderRadius: 1.5,
                    bgcolor: COLORS.primary,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': { bgcolor: COLORS.primaryDark }
                  }}
                >
                  {statusLoading ? 'Updating...' : 'Update Status'}
                </Button>
              </DialogActions>
            </Dialog>
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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SalesOrderMaster;