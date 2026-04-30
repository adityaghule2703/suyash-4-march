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
  Receipt as ReceiptIcon,
  NoteAdd as CreditNoteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddCreditNote from './AddCreditNote';

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
  creditNoteStatus: {
    Issued: { bg: '#D1FAE5', color: '#065F46', icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> },
    Draft: { bg: '#FEF3C7', color: '#B45309', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} /> },
    Cancelled: { bg: '#FEE2E2', color: '#991B1B', icon: <CancelIcon sx={{ fontSize: '0.7rem' }} /> }
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

// Action Menu Component
const ActionMenu = ({ record, anchorEl, onClose, onOpen }) => {
  return (
    <>
      <Tooltip title="Actions">
        <IconButton size="small" onClick={onOpen} sx={{ color: COLORS.text.secondary, '&:hover': { bgcolor: `${COLORS.primary}20` } }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose} PaperProps={{ elevation: 3, sx: { mt: 1, minWidth: 180, borderRadius: 2, border: `1px solid ${COLORS.border}` } }}>
        <MenuItem onClick={onClose} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Typography sx={{ fontSize: '0.75rem' }}>View Details</Typography></ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

// Credit Note Status Chip Component
const CreditNoteStatusChip = ({ status }) => {
  const colors = COLORS.creditNoteStatus[status] || { bg: '#F1F5F9', color: '#475569', icon: null };
  return <Chip icon={colors.icon} label={status} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 24, bgcolor: colors.bg, color: colors.color }} />;
};

const CreditNoteMaster = () => {
  // State for data
  const [creditNotes, setCreditNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  
  // Server-side pagination states
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRecordForAction, setSelectedRecordForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Ref to track if we're currently searching
  const isSearchingRef = useRef(false);
  const searchTimeoutRef = useRef(null);

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

  // Fetch credit notes from API with server-side pagination and search
  const fetchCreditNotes = useCallback(async () => {
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
      
      const response = await axios.get(`${BASE_URL}/api/invoices/credit-notes`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: params
      });
      
      if (response.data.success) {
        setCreditNotes(response.data.data || []);
        setTotalCount(response.data.pagination?.total || 0);
      } else {
        showNotification('Failed to load credit notes', 'error');
        setCreditNotes([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching credit notes:', err);
      showNotification(err.response?.data?.message || 'Failed to load credit notes. Please try again.', 'error');
      setCreditNotes([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchCreditNotes();
  }, [fetchCreditNotes]);

  const handleRefresh = () => { 
    fetchCreditNotes(); 
    showNotification('Data refreshed', 'success'); 
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) setSelected(creditNotes.map(cn => cn._id));
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
  
  const handleAddSuccess = () => { 
    setOpenAddModal(false); 
    fetchCreditNotes(); 
    showNotification('Credit note created successfully!', 'success'); 
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/invoices/credit-notes/bulk-delete`, 
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setSelected([]);
      
      if (creditNotes.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      } else {
        fetchCreditNotes();
      }
      
      showNotification(`${selected.length} credit note(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete some credit notes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity) => { 
    setSnackbar({ open: true, message, severity }); 
  };

  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>Credit Note Master</Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>Manage credit notes, track returns, and monitor adjustments</Typography>
      </Box>

      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField 
              placeholder="Search by CN no, customer, invoice..." 
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
              Create Credit Note
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
                    indeterminate={selected.length > 0 && selected.length < creditNotes.length} 
                    checked={creditNotes.length > 0 && selected.length === creditNotes.length} 
                    onChange={handleSelectAll} 
                    sx={{ color: COLORS.text.light, '&.Mui-checked': { color: COLORS.text.light } }} 
                    disabled={loading || creditNotes.length === 0} 
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>CN No</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Invoice No</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Grand Total</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', width: 60 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', mt: 1 }}>Loading credit notes...</Typography>
                  </TableCell>
                </TableRow>
              ) : creditNotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CreditNoteIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                    <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
                      {searchTerm ? 'No credit notes found' : 'No credit notes available'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                      {searchTerm ? 'Try adjusting your search terms' : 'Create your first credit note'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                creditNotes.map((cn, index) => {
                  const isSelected = selected.includes(cn._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedRecordForAction?._id === cn._id;
                  return (
                    <TableRow 
                      key={cn._id || index} 
                      hover 
                      selected={isSelected} 
                      sx={{ bgcolor: COLORS.background.white, '&:hover': { bgcolor: COLORS.background.hover }, '&.Mui-selected': { bgcolor: `${COLORS.primary}10` } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} onChange={() => handleSelect(cn._id)} sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary } }} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
                            <CreditNoteIcon sx={{ fontSize: '0.8rem' }} />
                          </Avatar>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                            {cn.cn_no}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {formatDate(cn.cn_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>{cn.customer_name || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>{cn.invoice_no || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={cn.reason} size="small" sx={{ fontSize: '0.65rem', height: 24, bgcolor: COLORS.primaryLight, color: COLORS.primary }} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary }}>
                          ₹{formatCurrency(cn.grand_total)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <CreditNoteStatusChip status={cn.status || 'Issued'} />
                      </TableCell>
                      <TableCell align="center">
                        <ActionMenu 
                          record={cn} 
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null} 
                          onClose={handleActionMenuClose} 
                          onOpen={(e) => handleActionMenuOpen(e, cn)} 
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

      <AddCreditNote open={openAddModal} onClose={() => setOpenAddModal(false)} onSuccess={handleAddSuccess} />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 1.5, fontSize: '0.75rem' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreditNoteMaster;