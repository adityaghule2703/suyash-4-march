// VendorPayments.jsx - Complete with Payment Receipt
import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Lazy load modals
const AddVendorPayment = lazy(() => import('./AddVendorPayment'));
const ViewVendorPayment = lazy(() => import('./ViewVendorPayment'));
const ApproveVendorPayment = lazy(() => import('./ApproveVendorPayment'));
const PaymentReceipt = lazy(() => import('./PaymentReceipt'));

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
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  status: {
    pending: '#FEF3C7',
    paid: '#D1FAE5',
    bounced: '#FEE2E2',
    cancelled: '#F1F5F9',
    initiated: '#E0F2FE',
    failed: '#FEE2E2'
  }
};

const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

const StatusChip = React.memo(({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Pending':
        return { bg: COLORS.status.pending, text: '#92400E', label: 'Pending' };
      case 'Initiated':
        return { bg: COLORS.status.initiated, text: '#0369A1', label: 'Initiated' };
      case 'Paid':
        return { bg: COLORS.status.paid, text: '#065F46', label: 'Paid' };
      case 'Bounced':
        return { bg: COLORS.status.bounced, text: '#991B1B', label: 'Bounced' };
      case 'Cancelled':
        return { bg: COLORS.status.cancelled, text: '#475569', label: 'Cancelled' };
      case 'Failed':
        return { bg: COLORS.status.failed, text: '#991B1B', label: 'Failed' };
      default:
        return { bg: COLORS.status.pending, text: '#92400E', label: status };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        fontSize: '0.65rem',
        fontWeight: 500,
        height: 24,
        bgcolor: config.bg,
        color: config.text,
        '& .MuiChip-label': { px: 1 }
      }}
    />
  );
});

StatusChip.displayName = 'StatusChip';

const ActionMenu = React.memo(({ item, onView, onApprove, onPrint, anchorEl, onClose, onOpen }) => {
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
          }
        }}
      >
        <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>View Details</Typography>
          </ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => { onPrint(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Print Receipt</Typography>
          </ListItemText>
        </MenuItem>
        
        {item.status === 'Pending' && (
          <MenuItem onClick={() => { onApprove(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Approve Payment</Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
});

ActionMenu.displayName = 'ActionMenu';

const VendorPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  // Modal states
  const [modalState, setModalState] = useState({
    add: false,
    view: false,
    approve: false,
    receipt: false
  });

  // Separate data for receipt to avoid conflicts
  const [receiptPaymentData, setReceiptPaymentData] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch payments
  const fetchPayments = useCallback(async () => {
    const abortController = new AbortController();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const response = await axios.get(`${BASE_URL}/api/vendor-payments?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: abortController.signal
      });

      if (response.data.success) {
        setPayments(response.data.data || []);
        setTotalItems(response.data.pagination?.total || 0);
      }
    } catch (err) {
      if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
        console.error('Error fetching payments:', err);
        showNotification('Failed to load payments', 'error');
      }
    } finally {
      setLoading(false);
    }
    
    return () => abortController.abort();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Selection handlers
  const handleSelectAll = useCallback((event) => {
    if (event.target.checked) {
      setSelected(payments.map(p => p._id));
    } else {
      setSelected([]);
    }
  }, [payments]);

  const handleSelect = useCallback((id) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  }, []);

  // Pagination handlers
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
    setSelected([]);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  }, []);

  // Bulk delete handler
  const handleBulkDelete = useCallback(async () => {
    if (selected.length === 0) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/vendor-payments/bulk`, {
        headers: { 'Authorization': `Bearer ${token}` },
        data: { ids: selected }
      });
      
      fetchPayments();
      setSelected([]);
      showNotification(`${selected.length} payments deleted successfully`, 'success');
    } catch (err) {
      console.error('Error bulk deleting payments:', err);
      showNotification('Failed to delete payments', 'error');
    }
  }, [selected, fetchPayments]);

  // Action menu handlers
  const handleActionMenuOpen = useCallback((event, payment) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedPayment(payment);
  }, []);

  const handleActionMenuClose = useCallback(() => {
    setActionMenuAnchor(null);
  }, []);

  // Modal handlers
  const openViewModal = useCallback((payment) => {
    setSelectedPayment(payment);
    setModalState(prev => ({ ...prev, view: true }));
    handleActionMenuClose();
  }, [handleActionMenuClose]);

  const openApproveModal = useCallback((payment) => {
    setSelectedPayment(payment);
    setModalState(prev => ({ ...prev, approve: true }));
    handleActionMenuClose();
  }, [handleActionMenuClose]);

  const openReceiptModal = useCallback((payment) => {
    setReceiptPaymentData(payment);
    setModalState(prev => ({ ...prev, receipt: true }));
    handleActionMenuClose();
  }, [handleActionMenuClose]);

  const closeViewModal = useCallback(() => {
    setModalState(prev => ({ ...prev, view: false }));
    setTimeout(() => {
      setSelectedPayment(null);
    }, 300);
  }, []);

  const closeApproveModal = useCallback(() => {
    setModalState(prev => ({ ...prev, approve: false }));
    setTimeout(() => {
      setSelectedPayment(null);
    }, 300);
  }, []);

  const closeReceiptModal = useCallback(() => {
    setModalState(prev => ({ ...prev, receipt: false }));
    setTimeout(() => {
      setReceiptPaymentData(null);
    }, 300);
  }, []);

  const closeAddModal = useCallback(() => {
    setModalState(prev => ({ ...prev, add: false }));
  }, []);

  // Callback handlers
  const handlePaymentAdded = useCallback(() => {
    fetchPayments();
    showNotification('Payment created successfully', 'success');
    closeAddModal();
  }, [fetchPayments, closeAddModal]);

  const handlePaymentApproved = useCallback(() => {
    fetchPayments();
    showNotification('Payment approved successfully', 'success');
    closeApproveModal();
  }, [fetchPayments, closeApproveModal]);

  const showNotification = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Formatters
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Memoized table rows
  const tableRows = useMemo(() => {
    return payments.map((payment) => {
      const isSelected = selected.includes(payment._id);
      const isActionMenuOpen = actionMenuAnchor && selectedPayment?._id === payment._id;

      return (
        <TableRow key={payment._id} hover selected={isSelected} sx={{ '&:hover': { bgcolor: COLORS.background.hover } }}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={isSelected}
              onChange={() => handleSelect(payment._id)}
              sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary } }}
            />
          </TableCell>
          <TableCell>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
              {payment.vendor_payment_number}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
              {formatDate(payment.payment_date)}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
              {payment.vendor_name}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
              {formatCurrency(payment.amount)}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
              {formatCurrency(payment.net_paid)}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              {payment.tds_amount > 0 ? formatCurrency(payment.tds_amount) : '-'}
            </Typography>
          </TableCell>
          <TableCell>
            <Chip
              label={payment.payment_mode}
              size="small"
              sx={{
                fontSize: '0.65rem',
                height: 22,
                bgcolor: COLORS.primaryLight,
                color: COLORS.primary
              }}
            />
          </TableCell>
          <TableCell>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              {payment.reference_no}
            </Typography>
          </TableCell>
          <TableCell>
            <StatusChip status={payment.status} />
          </TableCell>
          <TableCell align="center">
            <ActionMenu
              item={payment}
              onView={openViewModal}
              onApprove={openApproveModal}
              onPrint={openReceiptModal}
              anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
              onClose={handleActionMenuClose}
              onOpen={(e) => handleActionMenuOpen(e, payment)}
            />
          </TableCell>
        </TableRow>
      );
    });
  }, [payments, selected, actionMenuAnchor, selectedPayment, formatDate, formatCurrency, handleSelect, openViewModal, openApproveModal, openReceiptModal, handleActionMenuClose, handleActionMenuOpen]);

  if (loading && payments.length === 0) return <LoadingState />;

  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Vendor Payments
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and track vendor payments
        </Typography>
      </Box>
      
      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by payment number, vendor, reference..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ width: { xs: '100%', sm: 320 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
                sx: { height: 36, bgcolor: COLORS.background.light }
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ fontSize: '0.75rem' }}>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                sx={{ fontSize: '0.75rem', height: 36 }}
              >
                <MenuItem value="all" sx={{ fontSize: '0.75rem' }}>All</MenuItem>
                <MenuItem value="Pending" sx={{ fontSize: '0.75rem' }}>Pending</MenuItem>
                <MenuItem value="Initiated" sx={{ fontSize: '0.75rem' }}>Initiated</MenuItem>
                <MenuItem value="Paid" sx={{ fontSize: '0.75rem' }}>Paid</MenuItem>
                <MenuItem value="Bounced" sx={{ fontSize: '0.75rem' }}>Bounced</MenuItem>
                <MenuItem value="Cancelled" sx={{ fontSize: '0.75rem' }}>Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={1.5}>
            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleBulkDelete}
                sx={{ height: 36, borderRadius: 1.5, textTransform: 'none', fontSize: '0.75rem' }}
              >
                Delete ({selected.length})
              </Button>
            )}
            
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
              onClick={() => setModalState(prev => ({ ...prev, add: true }))}
              sx={{
                height: 36,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.75rem',
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryDark }
              }}
            >
              Create Payment
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                <TableCell padding="checkbox" sx={{ width: 40 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < payments.length}
                    checked={payments.length > 0 && selected.length === payments.length}
                    onChange={handleSelectAll}
                    sx={{ color: COLORS.text.light, '&.Mui-checked': { color: COLORS.text.light } }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>
                  Payment No.
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>
                  Vendor
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>
                  Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>
                  Net Paid
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>
                  TDS
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>
                  Mode
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>
                  Reference
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light, width: 60 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', mt: 1 }}>Loading payments...</Typography>
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
                      {searchTerm || statusFilter !== 'all' ? 'No payments found' : 'No payments available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tableRows
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.7rem'
            }
          }}
        />
      </Paper>

      {/* Modals - Always rendered but conditionally opened */}
      <Suspense fallback={null}>
        <AddVendorPayment
          open={modalState.add}
          onClose={closeAddModal}
          onAdd={handlePaymentAdded}
        />

        {selectedPayment && (
          <>
            <ViewVendorPayment
              open={modalState.view}
              onClose={closeViewModal}
              payment={selectedPayment}
            />

            {selectedPayment.status === 'Pending' && (
              <ApproveVendorPayment
                open={modalState.approve}
                onClose={closeApproveModal}
                payment={selectedPayment}
                onApprove={handlePaymentApproved}
              />
            )}
          </>
        )}

        {receiptPaymentData && (
          <PaymentReceipt
            open={modalState.receipt}
            onClose={closeReceiptModal}
            payment={receiptPaymentData}
          />
        )}
      </Suspense>

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

export default VendorPayments;