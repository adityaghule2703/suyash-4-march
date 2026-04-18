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
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Inventory as InventoryIcon,
  Warehouse as WarehouseIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  BatchPrediction as BatchIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import ItemStockDetails from './ItemStockDetails';
import FIFOSelector from './FIFOSelector';

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
    tableHeader: '#063C3F',  // Dark teal for table header
  },
  border: '#E3E8EF'
};

// Stock status levels
const STOCK_STATUS = {
  CRITICAL: 'critical',
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high'
};

// Get stock status based on available quantity
const getStockStatus = (availableQty) => {
  if (availableQty <= 0) return STOCK_STATUS.CRITICAL;
  if (availableQty <= 50) return STOCK_STATUS.LOW;
  if (availableQty > 500) return STOCK_STATUS.HIGH;
  return STOCK_STATUS.NORMAL;
};

// Get status color
const getStatusColor = (status) => {
  const colors = {
    [STOCK_STATUS.CRITICAL]: { bg: '#FEE2E2', color: '#DC2626', label: 'Critical' },
    [STOCK_STATUS.LOW]: { bg: '#FEF3C7', color: '#D97706', label: 'Low Stock' },
    [STOCK_STATUS.NORMAL]: { bg: '#D1FAE5', color: '#059669', label: 'Normal' },
    [STOCK_STATUS.HIGH]: { bg: '#DBEAFE', color: '#2563EB', label: 'High Stock' }
  };
  return colors[status] || { bg: '#F1F5F9', color: '#475569', label: '-' };
};

// Helper function to safely get warehouse name
const getWarehouseName = (warehouse) => {
  if (!warehouse) return '-';
  if (typeof warehouse === 'string') return warehouse;
  if (typeof warehouse === 'object') {
    return warehouse.warehouse_name || warehouse.name || warehouse.warehouse_id || '-';
  }
  return '-';
};

// Helper function to safely get item name/description - FIXED
const getItemName = (item) => {
  if (!item) return '';
  if (typeof item === 'object') {
    // Try multiple possible field names
    return item.item_name || item.name || item.description || item.item_type || '';
  }
  return '';
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

// ==================== ACTION MENU COMPONENT ====================
const ActionMenu = ({ item, anchorEl, onOpen, onClose, onViewDetails, onTestFIFO, permissions }) => {
  const canView = hasPermission(permissions, MODULES.STOCK_LEDGER, PAGES.STOCK_LEDGER, ACTIONS.VIEW);

  if (!canView) return null;

  return (
    <>
      <Tooltip title="Actions">
        <IconButton size="small" onClick={onOpen} sx={{ color: COLORS.text.secondary }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1, minWidth: 200, borderRadius: 2, border: `1px solid ${COLORS.border}` }
        }}
      >
        <MenuItem onClick={() => { onViewDetails(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
              View Stock Details
            </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onTestFIFO(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
            <BatchIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
              Test FIFO Selection
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

// Visibility icon component (since it wasn't imported)
const VisibilityIcon = () => <ViewIcon />;

// ==================== MAIN COMPONENT ====================
const StockLedgerMaster = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [summary, setSummary] = useState({
    total_quantity: 0,
    total_reserved: 0,
    total_value: 0,
    unique_items_count: 0
  });
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [openStockDetailsModal, setOpenStockDetailsModal] = useState(false);
  const [openFIFOModal, setOpenFIFOModal] = useState(false);
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
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.success) {
          const userData = response.data.data;
          setIsSuperAdmin(userData.isSuperAdmin || false);
          if (userData.permissions && Array.isArray(userData.permissions)) {
            setUserPermissions(userData.permissions);
          }
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
  const checkPermission = (action) => {
    if (isSuperAdmin) return true;
    return hasPermission(userPermissions, MODULES.STOCK_LEDGER, PAGES.STOCK_LEDGER, action);
  };

  const canViewPage = checkPermission(ACTIONS.VIEW);
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

  const fetchStockLedger = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        sort_by: 'createdAt',
        sort_order: 'desc'
      });

      if (searchTerm) params.append('search', searchTerm);

      const response = await axios.get(`${BASE_URL}/api/stock-ledger?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setData(response.data.data || []);
        setTotalItems(response.data.pagination?.total || 0);
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
      } else {
        showNotification('Failed to load stock ledger', 'error');
      }
    } catch (err) {
      console.error('Error fetching stock ledger:', err);
      showNotification(err.response?.data?.message || 'Failed to load stock ledger', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchStockLedger();
    }
  }, [fetchStockLedger, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    fetchStockLedger();
    showNotification('Stock ledger refreshed!', 'success');
  };

  const handleExport = () => {
    showNotification('Export functionality coming soon', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleActionMenuOpen = (event, stock) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedStock(stock);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedStock(null);
  };

  const handleViewDetails = (stock) => {
    console.log(' View Details called for stock:', stock);

    // First, close the action menu
    handleActionMenuClose();

    // Extract item ID
    let itemId = null;
    let partNo = null;
    let itemName = '';
    let itemType = '';

    if (stock.item_id) {
      if (typeof stock.item_id === 'object') {
        itemId = stock.item_id.id || stock.item_id._id;
        partNo = stock.item_id.part_no || stock.part_no;
        itemName = stock.item_id.item_name || '';
        itemType = stock.item_id.item_type || '';
        console.log(' Found item in stock.item_id object, ID:', itemId);
      } else if (typeof stock.item_id === 'string') {
        itemId = stock.item_id;
        partNo = stock.part_no;
        console.log(' Found item_id as string:', itemId);
      }
    }

    if (!itemId && stock._id) {
      itemId = stock._id;
      partNo = stock.part_no;
      console.log(' Using stock._id:', itemId);
    }

    if (!itemId) {
      console.error(' No item ID found!');
      showNotification('Unable to identify item', 'error');
      return;
    }

    console.log(' FINAL PASSING ID:', itemId);

    // Create item object
    const itemForModal = {
      _id: itemId,
      id: itemId,
      part_no: partNo || stock.part_no,
      item_name: itemName,
      item_type: itemType,
      unit: stock.unit || 'Nos'
    };

    // Use setTimeout to ensure state update happens after menu close
    setTimeout(() => {
      console.log(' Setting selectedStock:', itemForModal);
      setSelectedStock(itemForModal);
      setOpenStockDetailsModal(true);
    }, 50);
  };

  const handleTestFIFO = (stock) => {
    setSelectedStock(stock);
    setOpenFIFOModal(true);
    handleActionMenuClose();
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const getStockInitials = (stock) => {
    const code = stock.part_no || stock.item_code || 'ST';
    return code.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (stock) => {
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = (stock.part_no || stock.item_code || 'ST').charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Show loading state while permissions are being fetched
  if (!permissionsLoaded) return <LoadingState />;
  if (!canViewPage && !isSuperAdmin) return <AccessDenied />;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2.5 }}>
        {/* Page Header */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
            Stock Ledger
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
            Real-time inventory stock management - current balances across all warehouses
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
            <TextField
              placeholder="Search by Part No, Item Name, or Batch..."
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
                  bgcolor: COLORS.background.light
                }
              }}
              disabled={loading}
            />

            <Stack direction="row" spacing={1.5}>



              {/* {canPrint && (
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon sx={{ fontSize: '1rem' }} />}
                  onClick={handlePrint}
                  sx={{
                    height: 36,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    borderColor: COLORS.border,
                    color: COLORS.text.secondary
                  }}
                >
                  Print
                </Button>
              )} */}
            </Stack>
          </Stack>
        </Paper>

        {/* Table with DARK HEADER BACKGROUND */}
        <Paper sx={{
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`
        }}>
          <TableContainer>
            <Table size="small" stickyHeader>
              {/* ✅ DARK TABLE HEADER - Matching Stock Ledger style */}
              <TableHead>
                <TableRow sx={{ bgcolor: '#063C3F' }}>  {/* Dark teal background */}
                  <TableCell sx={{
                    bgcolor: '#063C3F',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    py: 1.5,
                    px: 1.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }}>
                    S.No
                  </TableCell>
                  <TableCell sx={{
                    bgcolor: '#063C3F',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    py: 1.5,
                    px: 1.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }}>
                    Part No / Item
                  </TableCell>
                  <TableCell sx={{
                    bgcolor: '#063C3F',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    py: 1.5,
                    px: 1.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }} align="right">
                    Quantity
                  </TableCell>
                  <TableCell sx={{
                    bgcolor: '#063C3F',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    py: 1.5,
                    px: 1.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }} align="right">
                    Reserved
                  </TableCell>
                  <TableCell sx={{
                    bgcolor: '#063C3F',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    py: 1.5,
                    px: 1.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }} align="right">
                    Available
                  </TableCell>
                  <TableCell sx={{
                    bgcolor: '#063C3F',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    py: 1.5,
                    px: 1.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }}>
                    Unit
                  </TableCell>
                  <TableCell sx={{
                    bgcolor: '#063C3F',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    py: 1.5,
                    px: 1.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }} align="right">
                    Unit Cost
                  </TableCell>
                  <TableCell sx={{
                    bgcolor: '#063C3F',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    py: 1.5,
                    px: 1.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }} align="right">
                    Total Value
                  </TableCell>
                  <TableCell sx={{
                    bgcolor: '#063C3F',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    py: 1.5,
                    px: 1.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }}>
                    Warehouse
                  </TableCell>
                  <TableCell sx={{
                    bgcolor: '#063C3F',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    py: 1.5,
                    px: 1.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }}>
                    Batch No
                  </TableCell>
                  <TableCell sx={{
                    bgcolor: '#063C3F',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    py: 1.5,
                    px: 1.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }}>
                    Status
                  </TableCell>
                  <TableCell sx={{
                    bgcolor: '#063C3F',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    py: 1.5,
                    px: 1.5,
                    borderBottom: 'none',
                    whiteSpace: 'nowrap'
                  }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                      <Typography sx={{ fontSize: '0.75rem', mt: 1, color: COLORS.text.secondary }}>
                        Loading stock ledger...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
                      <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
                        {searchTerm ? 'No stock found matching your search' : 'No stock data available'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item, index) => {
                    const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedStock?.stock_id === item.stock_id;
                    const quantity = item.quantity || 0;
                    const reservedQty = item.reserved_qty || 0;
                    const availableQty = item.available_qty !== undefined ? item.available_qty : (quantity - reservedQty);
                    const stockStatus = getStockStatus(availableQty);
                    const statusColors = getStatusColor(stockStatus);
                    const warehouseDisplay = getWarehouseName(item.warehouse_id);
                    const totalValue = item.total_value || (quantity * (item.unit_cost || 0));

                    return (
                      <TableRow
                        key={item.stock_id || item._id || index}
                        hover
                        sx={{ '&:hover': { bgcolor: COLORS.background.hover } }}
                      >
                        <TableCell sx={{ fontSize: '0.7rem', py: 1 }}>
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(item), fontSize: '0.7rem', fontWeight: 600 }}>
                              {getStockInitials(item)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace' }}>
                                {item.part_no || item.item_code || '-'}
                              </Typography>
                              {/* Only show item name if it exists and is not empty */}
                              {(() => {
                                const itemName = getItemName(item.item_id);
                                return itemName && itemName !== '-' && itemName !== '' ? (
                                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                    {itemName}
                                  </Typography>
                                ) : null;
                              })()}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                          {formatNumber(quantity)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', color: '#D97706' }}>
                          {formatNumber(reservedQty)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          {formatNumber(availableQty)}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>
                          {item.unit || 'Nos'}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                          {formatCurrency(item.unit_cost)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                          {formatCurrency(totalValue)}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <WarehouseIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem' }}>
                              {warehouseDisplay}
                            </Typography>
                          </Stack>
                          {item.bin_id && (
                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                              <LocationIcon sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }} />
                              <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }}>
                                Bin: {item.bin_id}
                              </Typography>
                            </Stack>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.batch_no ? (
                            <Chip
                              icon={<BatchIcon sx={{ fontSize: '0.6rem' }} />}
                              label={item.batch_no}
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 22 }}
                            />
                          ) : (
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>-</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statusColors.label}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: 24,
                              bgcolor: statusColors.bg,
                              color: statusColors.color,
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <ActionMenu
                            item={item}
                            anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                            onOpen={(e) => handleActionMenuOpen(e, item)}
                            onClose={handleActionMenuClose}
                            onViewDetails={handleViewDetails}
                            onTestFIFO={handleTestFIFO}
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
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
        {/* Modals - Add key to force re-render */}
        <ItemStockDetails
          key={openStockDetailsModal ? 'open' : 'closed'}
          open={openStockDetailsModal}
          onClose={() => {
            setOpenStockDetailsModal(false);
            // Clear selectedStock after modal closes with delay
            setTimeout(() => {
              setSelectedStock(null);
            }, 200);
          }}
          item={selectedStock}
        />

        <FIFOSelector
          open={openFIFOModal}
          onClose={() => {
            setOpenFIFOModal(false);
            setSelectedStock(null);
          }}
          item={selectedStock}
        />

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

export default StockLedgerMaster;