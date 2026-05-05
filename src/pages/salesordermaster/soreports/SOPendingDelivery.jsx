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
  Collapse,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  LocalShipping as ShippingIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Close as CloseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

const COLORS = {
  primary: '#074346',
  primaryDark: '#05292B',
  primaryLight: '#E8F0F1',
  warning: '#F59E0B',
  error: '#EF4444',
  success: '#10B981',
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
    tableHeader: '#074346'
  },
  border: '#E3E8EF'
};

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { bg: '#FEF3C7', color: '#F59E0B', label: 'Pending' };
      case 'in production':
        return { bg: '#DBEAFE', color: '#1E40AF', label: 'In Production' };
      case 'ready':
        return { bg: '#D1FAE5', color: '#059669', label: 'Ready' };
      case 'confirmed':
        return { bg: '#DBEAFE', color: '#1E40AF', label: 'Confirmed' };
      case 'ready for dispatch':
        return { bg: '#D1FAE5', color: '#059669', label: 'Ready for Dispatch' };
      default:
        return { bg: '#F1F5F9', color: '#6B7280', label: status || 'Unknown' };
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
        fontWeight: 500,
        height: 24,
        borderRadius: '6px'
      }}
    />
  );
};

// Expandable Row Component
const ExpandableRow = ({ order, customerName }) => {
  const [open, setOpen] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell padding="checkbox" sx={{ width: 40 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
            {order.so_number}
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
            {customerName}
          </Typography>
        </TableCell>
        <TableCell>
          <StatusChip status={order.status} />
        </TableCell>
        <TableCell align="right">
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
            {order.pending_lines?.length || 0}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.warning }}>
            {formatCurrency(order.pending_value)}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
            {formatCurrency(order.so_value)}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
                Pending Items
              </Typography>
              <Table size="small" sx={{ bgcolor: COLORS.background.light, borderRadius: 1 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Part No.</TableCell>
                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Part Name</TableCell>
                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }} align="right">Ordered Qty</TableCell>
                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }} align="right">Delivered Qty</TableCell>
                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }} align="right">Pending Qty</TableCell>
                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }} align="right">Unit Price</TableCell>
                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }} align="right">Pending Value</TableCell>
                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.light }}>Committed Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.pending_lines?.map((line, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{line.part_no}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{line.part_name}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }} align="right">{line.ordered_qty}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }} align="right">{line.delivered_qty || 0}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.warning }} align="right">
                        {line.pending_qty}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }} align="right">{formatCurrency(line.unit_price)}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary }} align="right">
                        {formatCurrency(line.pending_qty * line.unit_price)}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <CalendarIcon sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary }} />
                          {formatDate(line.committed_date)}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const SOPendingDelivery = () => {
  const [pendingData, setPendingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Ref for search timeout - CRITICAL for preventing focus loss
  const searchTimeoutRef = useRef(null);

  // Handle search input change - NO loading state changes here
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounce
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
      setPage(0); // Reset to first page when search changes
      setSelected([]);
    }, 500);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setPage(0);
    setSelected([]);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Fetch pending deliveries
  const fetchPendingDelivery = useCallback(async () => {
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
      
      const response = await axios.get(
        `${BASE_URL}/api/sales-orders/reports/pending-delivery?${params.toString()}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPendingData(response.data);
        setTotalItems(response.data.pagination?.total || response.data.count || 0);
      } else {
        showNotification('Failed to load pending deliveries', 'error');
      }
    } catch (err) {
      console.error('Error fetching pending deliveries:', err);
      showNotification('Failed to load pending deliveries', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  // Fetch data when searchTerm, page, or rowsPerPage changes
  useEffect(() => {
    fetchPendingDelivery();
  }, [fetchPendingDelivery]);

  const handleRefresh = () => {
    fetchPendingDelivery();
    showNotification('Data refreshed', 'success');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked && pendingData?.data) {
      const allOrders = [];
      pendingData.data.forEach(customer => {
        customer.orders.forEach(order => {
          allOrders.push(order.so_number);
        });
      });
      setSelected(allOrders);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (soNumber) => {
    const selectedIndex = selected.indexOf(soNumber);
    let newSelected = [];
    
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, soNumber);
    } else {
      newSelected = selected.filter(item => item !== soNumber);
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

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // Get paginated orders from current page data
  const getPaginatedOrders = () => {
    if (!pendingData?.data) return [];
    const orders = [];
    pendingData.data.forEach(customer => {
      customer.orders.forEach(order => {
        orders.push({
          ...order,
          customer_name: customer.customer_name
        });
      });
    });
    return orders;
  };

  const paginatedOrders = getPaginatedOrders();

  // Calculate total summary from API response
  const getTotalSummary = () => {
    if (!pendingData?.data) return { totalPendingValue: 0, totalOrders: 0, totalCustomers: 0 };
    
    let totalPendingValue = 0;
    let totalOrders = 0;
    
    pendingData.data.forEach(customer => {
      totalPendingValue += customer.total_pending_value || 0;
      totalOrders += customer.orders?.length || 0;
    });
    
    return {
      totalPendingValue,
      totalOrders,
      totalCustomers: pendingData.data.length
    };
  };

  const summary = getTotalSummary();

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
          Pending Deliveries
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Track orders pending delivery and monitor outstanding items
        </Typography>
      </Box>

      {/* Stats Cards */}
      {!loading && pendingData && (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, textTransform: 'uppercase' }}>
                    Total Pending Value
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.warning, mt: 0.5 }}>
                    {formatCurrency(summary.totalPendingValue)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#FEF3C7', width: 40, height: 40 }}>
                  <MoneyIcon sx={{ color: COLORS.warning }} />
                </Avatar>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, textTransform: 'uppercase' }}>
                    Pending Orders
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.primary, mt: 0.5 }}>
                    {summary.totalOrders}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: COLORS.primaryLight, width: 40, height: 40 }}>
                  <ShippingIcon sx={{ color: COLORS.primary }} />
                </Avatar>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, textTransform: 'uppercase' }}>
                    Customers Affected
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.success, mt: 0.5 }}>
                    {summary.totalCustomers}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#D1FAE5', width: 40, height: 40 }}>
                  <BusinessIcon sx={{ color: COLORS.success }} />
                </Avatar>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

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
              placeholder="Search by SO number or customer..."
              size="small"
              value={searchInput}
              onChange={handleSearchChange}
              autoComplete="off"
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
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch} edge="end">
                      <CloseIcon sx={{ fontSize: '0.875rem' }} />
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
            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
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

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
              Showing {paginatedOrders.length} of {totalItems} orders
            </Typography>
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
                <TableCell padding="checkbox" sx={{ width: 40 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedOrders.length}
                    checked={paginatedOrders.length > 0 && selected.length === paginatedOrders.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: COLORS.text.light,
                      '&.Mui-checked': { color: COLORS.text.light },
                      '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
                      '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                    }}
                    disabled={loading || paginatedOrders.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  SO Number / Customer
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }} align="right">
                  Pending Items
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }} align="right">
                  Pending Value
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }} align="right">
                  Total Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading pending deliveries...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ShippingIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No pending orders found' : 'No pending deliveries'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'All orders have been delivered'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order, idx) => (
                  <ExpandableRow
                    key={order.so_number + idx}
                    order={order}
                    customerName={order.customer_name}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {!loading && totalItems > 0 && (
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
        )}
      </Paper>

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
  );
};

export default SOPendingDelivery;