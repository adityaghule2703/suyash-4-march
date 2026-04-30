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
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  Receipt as ReceiptIcon,
  PictureAsPdf as PdfIcon,
  Send as SendIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import ViewInvoiceModal from './ViewInvoiceModal';
import AddInvoice from './AddInvoice';
import { downloadInvoiceAsPDF } from './InvoicePDFGenerator';

// Color constants
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
  paymentStatus: {
    Paid: { bg: '#D1FAE5', color: '#065F46', icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> },
    Unpaid: { bg: '#FEE2E2', color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} /> },
    Partial: { bg: '#FEF3C7', color: '#B45309', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} /> },
    Overdue: { bg: '#FFE4E6', color: '#BE123C', icon: <WarningIcon sx={{ fontSize: '0.7rem' }} /> }
  },
  invoiceStatus: {
    Draft: { bg: '#F1F5F9', color: '#475569' },
    Submitted: { bg: '#E0F2FE', color: '#0369A1' },
    Approved: { bg: '#D1FAE5', color: '#065F46' },
    Cancelled: { bg: '#FEE2E2', color: '#991B1B' }
  }
};

// Helper Functions
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Send Email Dialog Component
const SendEmailDialog = ({ open, onClose, invoice, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && invoice) {
      // Pre-fill with customer email if available
      if (invoice.customer_email) {
        setEmail(invoice.customer_email);
      } else {
        setEmail('');
      }
      setError('');
    }
  }, [open, invoice]);

  const handleSend = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${BASE_URL}/api/invoices/${invoice._id}/send`,
        { email: email },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onSuccess(email);
        onClose();
        setEmail('');
      } else {
        setError(response.data.message || 'Failed to send email');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setError(err.response?.data?.message || 'Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EmailIcon sx={{ color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
            Send Invoice via Email
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Invoice will be sent as PDF attachment to the following email address:
        </Typography>
        <MuiTextField
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="customer@example.com"
          error={!!error}
          helperText={error}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              fontSize: '0.75rem',
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.75rem',
            }
          }}
        />
        <Typography variant="caption" sx={{ display: 'block', mt: 1, fontSize: '0.65rem', color: COLORS.text.tertiary }}>
          {invoice?.customer_name && `Customer: ${invoice.customer_name}`}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${COLORS.border}` }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSend} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <SendIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 3,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            textTransform: 'none',
            '&:hover': { bgcolor: COLORS.primaryDark }
          }}
        >
          {loading ? 'Sending...' : 'Send Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Action Menu Component
const ActionMenu = ({ record, onView, onExportPDF, onSendEmail, anchorEl, onClose, onOpen }) => {
  return (
    <>
      <Tooltip title="Actions">
        <IconButton size="small" onClick={onOpen} sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose} PaperProps={{ elevation: 3, sx: { mt: 1, minWidth: 180, borderRadius: 2, border: `1px solid ${COLORS.border}` } }}>
        <MenuItem onClick={() => { onView(record); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: '0.75rem' }}>View Details</Typography></ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onExportPDF(record); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}><PdfIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: '0.75rem' }}>Export PDF</Typography></ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onSendEmail(record); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}><SendIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: '0.75rem' }}>Send Email</Typography></ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

// Payment Status Chip Component
const PaymentStatusChip = ({ status }) => {
  const colors = COLORS.paymentStatus[status] || { bg: '#F1F5F9', color: '#475569', icon: null };
  return <Chip icon={colors.icon} label={status} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: colors.bg, color: colors.color }} />;
};

// Invoice Status Chip Component
const InvoiceStatusChip = ({ status }) => {
  const colors = COLORS.invoiceStatus[status] || { bg: '#F1F5F9', color: '#475569' };
  return <Chip label={status} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: colors.bg, color: colors.color }} />;
};

const InvoiceMaster = () => {
  // State for data
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRecordForAction, setSelectedRecordForAction] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [emailInvoiceRecord, setEmailInvoiceRecord] = useState(null);
  
  // Server-side pagination states
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Ref to track if we're currently searching
  const isSearchingRef = useRef(false);
  const searchTimeoutRef = useRef(null);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Handle search input change
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Fetch invoices from API with server-side pagination and search
  const fetchInvoices = useCallback(async () => {
    // Don't show loading indicator while typing search
    if (!isSearchingRef.current) {
      setLoading(true);
    }
    
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: currentPage,
        limit: rowsPerPage
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await axios.get(`${BASE_URL}/api/invoices`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: params
      });
      
      if (response.data.success) {
        setInvoices(response.data.data || []);
        setTotalCount(response.data.pagination?.total || 0);
      } else {
        showNotification('Failed to load invoices', 'error');
        setInvoices([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      showNotification(err.response?.data?.message || 'Failed to load invoices. Please try again.', 'error');
      setInvoices([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleRefresh = () => { 
    fetchInvoices(); 
    showNotification('Data refreshed', 'success'); 
  };

  const handleExportPDF = async (record) => {
    try {
      setPdfLoading(true);
      const token = localStorage.getItem('token');
      showNotification('Generating PDF...', 'info');
      
      const response = await axios.get(`${BASE_URL}/api/invoices/${record._id}/pdf-data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const fileName = `Invoice_${record.invoice_no || record._id.slice(-8)}.pdf`;
        await downloadInvoiceAsPDF(response.data, fileName);
        showNotification('PDF downloaded successfully!', 'success');
      } else {
        showNotification(response.data.message || 'Failed to generate PDF', 'error');
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      showNotification('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleSendEmail = (record) => {
    setEmailInvoiceRecord(record);
    setOpenEmailDialog(true);
  };

  const handleEmailSent = (email) => {
    showNotification(`Invoice sent successfully to ${email}!`, 'success');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) setSelected(invoices.map(invoice => invoice._id));
    else setSelected([]);
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else newSelected = selected.filter(item => item !== id);
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => { 
    setPage(newPage); 
    setCurrentPage(newPage + 1);
    setSelected([]); 
  };
  
  const handleChangeRowsPerPage = (event) => { 
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); 
    setCurrentPage(1);
    setSelected([]); 
  };
  
  const handleActionMenuOpen = (event, record) => { 
    setActionMenuAnchor(event.currentTarget); 
    setSelectedRecordForAction(record); 
  };
  
  const handleActionMenuClose = () => { 
    setActionMenuAnchor(null); 
    setSelectedRecordForAction(null); 
  };
  
  const openViewModalHandler = (record) => { 
    setSelectedRecord(record); 
    setOpenViewModal(true); 
    handleActionMenuClose(); 
  };
  
  const handleAddSuccess = () => { 
    setOpenAddModal(false); 
    fetchInvoices(); 
    showNotification('Invoice created successfully!', 'success'); 
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/invoices/bulk-delete`, 
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
      showNotification('Failed to delete some invoices', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity) => { 
    setSnackbar({ open: true, message, severity }); 
  };

  return (
    <Box sx={{ p: 2.5 }}>
      {pdfLoading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 3, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} sx={{ color: COLORS.primary }} />
            <Typography>Generating PDF...</Typography>
          </Paper>
        </Box>
      )}

      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>Invoice Master</Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>Manage invoices, track payments, and monitor invoice history</Typography>
      </Box>

      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField 
              placeholder="Search by invoice no, SO no, company..." 
              size="small" 
              value={searchInput} 
              onChange={handleSearchChange} 
              autoComplete="off"
              sx={{ width: { xs: '100%', sm: 320 } }} 
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} /></InputAdornment>, 
                sx: { height: 36, bgcolor: COLORS.background.light } 
              }} 
            />
          </Stack>
          
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={handleRefresh} disabled={loading} sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {selected.length > 0 && (
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />} 
                onClick={handleBulkDelete} 
                sx={{ height: 36, borderRadius: 1.5, textTransform: 'none', fontSize: '0.75rem' }} 
                disabled={loading}
              >
                Delete ({selected.length})
              </Button>
            )}
            
            <Button 
              variant="contained" 
              startIcon={<AddIcon sx={{ fontSize: '1rem' }} />} 
              onClick={() => setOpenAddModal(true)} 
              sx={{ height: 36, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', textTransform: 'none' }} 
              disabled={loading}
            >
              Create Invoice
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.background.tableHeader, '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.light, py: 1.5 } }}>
                <TableCell padding="checkbox" sx={{ width: 40 }}>
                  <Checkbox 
                    indeterminate={selected.length > 0 && selected.length < invoices.length} 
                    checked={invoices.length > 0 && selected.length === invoices.length} 
                    onChange={handleSelectAll} 
                    sx={{ color: COLORS.text.light, '&.Mui-checked': { color: COLORS.text.light } }} 
                    disabled={loading || invoices.length === 0} 
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Invoice No</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>SO No</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Grand Total</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Payment Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', width: 60 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', mt: 1 }}>Loading invoices...</Typography>
                  </TableCell>
                </TableRow>
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <ReceiptIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                    <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
                      {searchTerm ? 'No invoices found' : 'No invoices available'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                      {searchTerm ? 'Try adjusting your search terms' : 'Create your first invoice'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice, index) => {
                  const isSelected = selected.includes(invoice._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedRecordForAction?._id === invoice._id;
                  return (
                    <TableRow 
                      key={invoice._id || index} 
                      hover 
                      selected={isSelected} 
                      sx={{ bgcolor: COLORS.background.white, '&:hover': { bgcolor: COLORS.background.hover }, '&.Mui-selected': { bgcolor: `${COLORS.primary}10` } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} onChange={() => handleSelect(invoice._id)} sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary } }} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
                            <ReceiptIcon sx={{ fontSize: '0.8rem' }} />
                          </Avatar>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                            {invoice.invoice_no || invoice._id?.slice(-6)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{invoice.so_number || '-'}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>{formatDate(invoice.invoice_date)}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.75rem' }}>{invoice.company_name || '-'}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>₹{formatCurrency(invoice.grand_total)}</Typography></TableCell>
                      <TableCell><InvoiceStatusChip status={invoice.status || 'Draft'} /></TableCell>
                      <TableCell><PaymentStatusChip status={invoice.payment_status || 'Unpaid'} /></TableCell>
                      <TableCell align="center">
                        <ActionMenu 
                          record={invoice} 
                          onView={openViewModalHandler} 
                          onExportPDF={handleExportPDF}
                          onSendEmail={handleSendEmail}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null} 
                          onClose={handleActionMenuClose} 
                          onOpen={(e) => handleActionMenuOpen(e, invoice)} 
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
          count={totalCount} 
          rowsPerPage={rowsPerPage} 
          page={page} 
          onPageChange={handleChangePage} 
          onRowsPerPageChange={handleChangeRowsPerPage} 
          sx={{ borderTop: `1px solid ${COLORS.border}` }} 
        />
      </Paper>

      <AddInvoice open={openAddModal} onClose={() => setOpenAddModal(false)} onSuccess={handleAddSuccess} />
      {selectedRecord && <ViewInvoiceModal open={openViewModal} onClose={() => { setOpenViewModal(false); setSelectedRecord(null); }} invoice={selectedRecord} />}
      
      <SendEmailDialog 
        open={openEmailDialog}
        onClose={() => setOpenEmailDialog(false)}
        invoice={emailInvoiceRecord}
        onSuccess={handleEmailSent}
      />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 1.5, fontSize: '0.75rem' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default InvoiceMaster;