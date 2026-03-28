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
  Tabs,
  Tab,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Receipt as ReceiptIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Inventory as InventoryIcon,
  History as HistoryIcon,
  Print as PrintIcon,
  FileDownload as ExportIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// Professional Color Scheme
const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  primaryLight: '#E8F0F1',
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

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return { bg: '#D1FAE5', color: '#059669', label: 'Confirmed' };
      case 'pending':
        return { bg: '#FEF3C7', color: '#D97706', label: 'Pending' };
      case 'draft':
        return { bg: '#F1F5F9', color: '#475569', label: 'Draft' };
      case 'cancelled':
        return { bg: '#FEE2E2', color: '#DC2626', label: 'Cancelled' };
      default:
        return { bg: '#F1F5F9', color: '#475569', label: status || 'Unknown' };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontSize: '0.65rem',
        fontWeight: 600,
        height: 24,
        borderRadius: '6px'
      }}
    />
  );
};

// Action Menu Component with permission checks
const ActionMenu = ({ order, anchorEl, onOpen, onClose, onView, onEdit, onDelete, permissions, isSuperAdmin }) => {
  // Check permissions for Order Book module
  const canView = isSuperAdmin || hasPermission(permissions, MODULES.ORDER_BOOK, PAGES.ORDER_BOOK, ACTIONS.VIEW);
  const canUpdate = isSuperAdmin || hasPermission(permissions, MODULES.ORDER_BOOK, PAGES.ORDER_BOOK, ACTIONS.UPDATE);
  const canDelete = isSuperAdmin || hasPermission(permissions, MODULES.ORDER_BOOK, PAGES.ORDER_BOOK, ACTIONS.DELETE);
  const canExport = isSuperAdmin || hasPermission(permissions, MODULES.ORDER_BOOK, PAGES.ORDER_BOOK, ACTIONS.EXPORT);
  const canPrint = isSuperAdmin || hasPermission(permissions, MODULES.ORDER_BOOK, PAGES.ORDER_BOOK, ACTIONS.PRINT);

  // Count how many actions are available
  const hasAnyActions = canView || canUpdate || canDelete || canExport || canPrint;
  
  if (!hasAnyActions) {
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
              onView(order);
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
        
        {canUpdate && (
          <MenuItem 
            onClick={() => {
              onEdit(order);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
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
        
        {canExport && (
          <MenuItem 
            onClick={() => {
              // Handle export
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
              <ExportIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
                Export
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canPrint && (
          <MenuItem 
            onClick={() => {
              // Handle print
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#06B6D4', minWidth: 36 }}>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#06B6D4', fontSize: '0.75rem' }}>
                Print
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canDelete && (
          <>
            {(canView || canUpdate || canExport || canPrint) && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
            <MenuItem 
              onClick={() => {
                onDelete(order);
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
          </>
        )}
      </Menu>
    </>
  );
};

// View Order Modal
const ViewOrderModal = ({ open, onClose, order }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!order) return null;

  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statusColors = {
    confirmed: { bg: '#D1FAE5', color: '#059669' },
    draft: { bg: '#F1F5F9', color: '#475569' },
    cancelled: { bg: '#FEE2E2', color: '#DC2626' }
  }[order.status?.toLowerCase()] || { bg: '#F1F5F9', color: '#475569' };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '85vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.tableHeader,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <ReceiptIcon sx={{ color: COLORS.text.light }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: COLORS.text.light }}>
              Order Details
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>
              {order.so_number} • {order.customer_name}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.text.light }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          px: 2,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            minHeight: 44
          },
          '& .MuiTabs-indicator': {
            backgroundColor: COLORS.primary
          }
        }}
      >
        <Tab label="Order Details" icon={<DescriptionIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" />
        <Tab label="Items" icon={<InventoryIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" />
        <Tab label="History" icon={<HistoryIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" />
      </Tabs>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light }}>
        {/* Order Details Tab */}
        {activeTab === 0 && (
          <Stack spacing={2.5}>
            {/* Basic Info */}
            <Paper sx={{ p: 2, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, textTransform: 'uppercase' }}>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>SO Number</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mt: 0.5 }}>{order.so_number}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>SO Date</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{formatDate(order.so_date)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={order.status}
                      size="small"
                      sx={{ bgcolor: statusColors.bg, color: statusColors.color, fontSize: '0.7rem' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Currency</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{order.currency}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Customer Info */}
            <Paper sx={{ p: 2, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, textTransform: 'uppercase' }}>
                Customer Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{order.customer_name}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 0.5 }}>
                    GSTIN: {order.customer_gstin || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, mb: 0.5 }}>Billing Address</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    {order.billing_address?.line1 && `${order.billing_address.line1}, `}
                    {order.billing_address?.city && `${order.billing_address.city}, `}
                    {order.billing_address?.state && `${order.billing_address.state} - `}
                    {order.billing_address?.pincode}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Order Details */}
            <Paper sx={{ p: 2, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, textTransform: 'uppercase' }}>
                Order Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Quotation No.</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{order.quotation_no || '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>PO Number</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{order.customer_po_number || '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>PO Date</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{formatDate(order.customer_po_date)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>GST Type</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{order.gst_type || '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Delivery Terms</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{order.delivery_terms || '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Delivery Mode</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{order.delivery_mode || '-'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Expected Delivery</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{formatDate(order.expected_delivery_date)}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Payment Terms</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{order.payment_terms || '-'}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Financial Summary */}
            <Paper sx={{ p: 2, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, textTransform: 'uppercase' }}>
                Financial Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Sub Total</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>{formatCurrency(order.sub_total, order.currency)}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Discount</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{formatCurrency(order.discount_total, order.currency)}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>GST Total</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{formatCurrency(order.gst_total, order.currency)}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Grand Total</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.primary, mt: 0.5 }}>{formatCurrency(order.grand_total, order.currency)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        )}

        {/* Items Tab */}
        {activeTab === 1 && (
          <Paper sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.text.light }}>Part No.</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.text.light }}>Part Name</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.text.light }} align="right">Qty</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.text.light }} align="right">Unit Price</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.text.light }} align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items?.map((item, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_no}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{item.part_name}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }} align="right">{item.ordered_qty} {item.unit}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(item.unit_price, order.currency)}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600 }} align="right">{formatCurrency(item.total_amount, order.currency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* History Tab */}
        {activeTab === 2 && (
          <Paper sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.text.light }}>Date & Time</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.text.light }}>Action</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.text.light }}>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.audit_log?.map((log, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontSize: '0.65rem' }}>{formatDate(log.changed_at)}</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem' }}>
                        <Chip 
                          label={log.action} 
                          size="small" 
                          sx={{ fontSize: '0.6rem', height: 22 }} 
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.65rem' }}>{log.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
        <Button onClick={onClose} sx={{ fontSize: '0.7rem', textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const OrderBook = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedOrderForMenu, setSelectedOrderForMenu] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
  const checkPermission = (action) => {
    // Super admin has all permissions
    if (isSuperAdmin) return true;
    
    return hasPermission(
      userPermissions,
      MODULES.ORDER_BOOK,
      PAGES.ORDER_BOOK,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canExport = checkPermission(ACTIONS.EXPORT);
  const canPrint = checkPermission(ACTIONS.PRINT);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch orders from API - only if user has permission
  const fetchOrders = useCallback(async () => {
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
      
      const response = await axios.get(`${BASE_URL}/api/sales-orders/order-book?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrders(response.data.data || []);
        setTotalItems(response.data.pagination?.total || 0);
      } else {
        showNotification('Failed to load orders', 'error');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      showNotification('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchOrders();
    }
  }, [fetchOrders, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleRefresh = () => {
    fetchOrders();
    showNotification('Data refreshed', 'success');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(orders.map(order => order._id));
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

  const handleActionMenuOpen = (event, order) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedOrderForMenu(order);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedOrderForMenu(null);
  };

  const openViewOrderModal = (order) => {
    setSelectedOrder(order);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openEditOrderModal = (order) => {
    if (!canUpdate) return;
    setSelectedOrder(order);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteOrderDialog = (order) => {
    if (!canDelete) return;
    setSelectedOrder(order);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const getOrderInitials = (order) => {
    if (!order.so_number) return 'SO';
    return order.so_number.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (order) => {
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = order.so_number?.charCodeAt(0) || 0;
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
          Order Book
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          View and manage all sales orders
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
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by SO number, customer, quotation, PO number..."
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
                    color: COLORS.text.primary
                  }
                }
              }}
              disabled={loading}
            />
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Delete Button - Only show if user has DELETE permission AND items are selected */}
            {selected.length > 0 && canDelete && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                sx={{ 
                  height: 36,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}
                disabled={loading}
                onClick={() => {
                  // Handle bulk delete
                  showNotification('Bulk delete feature coming soon', 'info');
                }}
              >
                Delete ({selected.length})
              </Button>
            )}
            
            {/* Export Button - Only show if user has EXPORT permission */}
            {canExport && (
              <Tooltip title="Export">
                <IconButton
                  onClick={() => {
                    showNotification('Export feature coming soon', 'info');
                  }}
                  disabled={loading || orders.length === 0}
                  sx={{
                    color: COLORS.primary,
                    '&:hover': {
                      bgcolor: `${COLORS.primary}10`
                    }
                  }}
                >
                  <ExportIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Tooltip>
            )}
            
            {/* Print Button - Only show if user has PRINT permission */}
            {canPrint && (
              <Tooltip title="Print">
                <IconButton
                  onClick={() => {
                    showNotification('Print feature coming soon', 'info');
                  }}
                  disabled={loading || orders.length === 0}
                  sx={{
                    color: COLORS.primary,
                    '&:hover': {
                      bgcolor: `${COLORS.primary}10`
                    }
                  }}
                >
                  <PrintIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Tooltip>
            )}
            
            {/* Refresh Button - Always show for users with view permission */}
            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: COLORS.primary,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}10`
                  }
                }}
              >
                <RefreshIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>

      {/* Orders Table */}
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
                {/* Checkbox Column - Only show if user has DELETE permission */}
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < orders.length}
                      checked={orders.length > 0 && selected.length === orders.length}
                      onChange={handleSelectAll}
                      sx={{
                        color: COLORS.text.light,
                        '&.Mui-checked': { color: COLORS.text.light },
                        '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
                        '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                      }}
                      disabled={loading || orders.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  SO No / Customer
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  PO / Quotation
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
                      Loading orders...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 8 : 7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ReceiptIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No orders found' : 'No orders available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'No sales orders have been created yet'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const isSelected = selected.includes(order._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedOrderForMenu?._id === order._id;
                  const avatarColor = getAvatarColor(order);

                  return (
                    <TableRow
                      key={order._id}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': { bgcolor: COLORS.background.hover },
                        '&.Mui-selected': {
                          bgcolor: `${COLORS.primary}10`,
                          '&:hover': { bgcolor: `${COLORS.primary}20` }
                        },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      {/* Checkbox Column - Only show if user has DELETE permission */}
                      {canDelete && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(order._id)}
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
                            {getOrderInitials(order)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {order.so_number}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {order.customer_name}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          PO: {order.customer_po_number || '-'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          QT: {order.quotation_no || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {formatDate(order.so_date)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Items: {order.items?.length || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary }}>
                          {formatCurrency(order.grand_total, order.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={order.status} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.7rem' }}>
                          {order.delivery_mode || '-'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          EDD: {formatDate(order.expected_delivery_date)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu
                          order={order}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onOpen={(e) => handleActionMenuOpen(e, order)}
                          onClose={handleActionMenuClose}
                          onView={openViewOrderModal}
                          onEdit={openEditOrderModal}
                          onDelete={openDeleteOrderDialog}
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

      {/* View Order Modal */}
      <ViewOrderModal
        open={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

      {/* Edit Order Modal - Placeholder */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          <Typography>Edit functionality coming soon...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog - Placeholder */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            setOpenDeleteDialog(false);
            showNotification('Order deleted successfully!', 'success');
          }} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

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

export default OrderBook;