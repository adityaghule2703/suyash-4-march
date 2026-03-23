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
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  Compare as CompareIcon,
  Close as CloseIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddRFQ from './AddRFQ';
import ViewRFQ from './ViewRFQ';
import SubmitQuote from './SubmitQuote';
import ViewRFQComparison from './ViewRFQComparison';

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
  chips: {
    draft: '#E0F2FE',
    sent: '#FEF3C7',
    partially_responded: '#FEF3C7',
    fully_responded: '#9FE2BF',
    compared: '#9FE2BF',
    closed: '#F1F5F9'
  }
};

const getStatusStyles = (status) => {
  const styles = {
    Draft: { bg: '#E0F2FE', text: '#0C4A6E', border: '#BAE6FD' },
    Sent: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    'Partially Responded': { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    'Fully Responded': { bg: '#9FE2BF', text: '#166534', border: '#86EFAC' },
    Compared: { bg: '#9FE2BF', text: '#166534', border: '#86EFAC' },
    Closed: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' }
  };
  return styles[status] || styles.Draft;
};

const ActionMenu = ({ item, onView, onSend, onSubmitQuote, onCompare, onCloseRfq, onClose, anchorEl, onOpen }) => {
  const canSend = item.status === 'Draft';
  const canSubmitQuote = item.status === 'Sent' || item.status === 'Partially Responded';
  const canCompare = item.status === 'Fully Responded' || item.status === 'Partially Responded';
  const canClose = item.status === 'Compared';
  
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
        <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>View Details</Typography>
          </ListItemText>
        </MenuItem>
        {canSend && (
          <MenuItem onClick={() => { onSend(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <SendIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>Send to Vendors</Typography>
            </ListItemText>
          </MenuItem>
        )}
        {canSubmitQuote && (
          <MenuItem onClick={() => { onSubmitQuote(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.success, minWidth: 36 }}>
              <SendIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.success, fontSize: '0.75rem' }}>Submit Quote</Typography>
            </ListItemText>
          </MenuItem>
        )}
        {canCompare && (
          <MenuItem onClick={() => { onCompare(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <CompareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>View Comparison</Typography>
            </ListItemText>
          </MenuItem>
        )}
        {canClose && (
          <>
            <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
            <MenuItem onClick={() => { onCloseRfq(item); onClose(); }} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ color: COLORS.warning, minWidth: 36 }}>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.warning, fontSize: '0.75rem' }}>
                  Close RFQ
                </Typography>
              </ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

const RFQMaster = () => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRfqForAction, setSelectedRfqForAction] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openSubmitQuoteModal, setOpenSubmitQuoteModal] = useState(false);
  const [openComparisonModal, setOpenComparisonModal] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [comparisonRfqId, setComparisonRfqId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [closingRfq, setClosingRfq] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchRFQs = useCallback(async () => {
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
      
      const response = await axios.get(`${BASE_URL}/api/rfqs?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setRfqs(response.data.data || []);
        setTotalItems(response.data.pagination.total);
      } else {
        showNotification('Failed to load RFQs', 'error');
      }
    } catch (err) {
      console.error('Error fetching RFQs:', err);
      showNotification('Failed to load RFQs', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchRFQs();
  }, [fetchRFQs]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(rfqs.map(rfq => rfq._id));
    } else {
      setSelected([]);
    }
  };

  const handleVendorSelected = (data) => {
    fetchRFQs();
    showNotification(`Vendor ${data.selected_vendor} selected successfully!`, 'success');
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

  const handleAddRFQ = () => setOpenAddModal(true);
  const handleRFQAdded = () => {
    fetchRFQs();
    showNotification('RFQ created successfully!', 'success');
  };

  const handleActionMenuOpen = (event, rfq) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRfqForAction(rfq);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRfqForAction(null);
  };

  const openViewRFQModal = (rfq) => {
    setSelectedRfq(rfq);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const handleSendRFQ = async (rfq) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/rfqs/${rfq._id}/send`, 
        { send_email: true },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        fetchRFQs();
        showNotification('RFQ sent successfully!', 'success');
      }
    } catch (err) {
      console.error('Error sending RFQ:', err);
      showNotification(err.response?.data?.message || 'Failed to send RFQ', 'error');
    }
  };

  const handleSubmitQuote = (rfq) => {
    setSelectedRfq(rfq);
    setSelectedVendor(null);
    setOpenSubmitQuoteModal(true);
    handleActionMenuClose();
  };

  const handleQuoteSubmitted = () => {
    fetchRFQs();
    showNotification('Quotation submitted successfully!', 'success');
  };

  const handleOpenComparisonModal = (rfq) => {
    setComparisonRfqId(rfq._id);
    setOpenComparisonModal(true);
    handleActionMenuClose();
  };

  const handleOpenCloseDialog = (rfq) => {
    setSelectedRfq(rfq);
    setOpenCloseDialog(true);
    handleActionMenuClose();
  };

  const handleCloseRFQ = async () => {
    if (!selectedRfq?._id) return;
    
    setClosingRfq(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/api/rfqs/${selectedRfq._id}/close`, {}, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      
      if (response.data.success) {
        fetchRFQs();
        showNotification(`RFQ ${selectedRfq.rfq_number} closed successfully!`, 'success');
        setOpenCloseDialog(false);
        setSelectedRfq(null);
      } else {
        showNotification(response.data.message || 'Failed to close RFQ', 'error');
      }
    } catch (err) {
      console.error('Error closing RFQ:', err);
      showNotification(err.response?.data?.message || 'Failed to close RFQ', 'error');
    } finally {
      setClosingRfq(false);
    }
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

  const getAvatarInitials = (rfqNumber) => {
    if (!rfqNumber) return 'RF';
    return rfqNumber.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (rfqNumber) => {
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = rfqNumber?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Request for Quotations (RFQ)
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Create and manage RFQs for procurement
        </Typography>
      </Box>

      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by RFQ number..."
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
              disabled={loading}
            />
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
            onClick={handleAddRFQ}
            sx={{ height: 36, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', fontWeight: 500, textTransform: 'none' }}
            disabled={loading}
          >
            Create RFQ
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.background.tableHeader, '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.light, py: 1.5 } }}>
                <TableCell padding="checkbox" sx={{ width: 40 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < rfqs.length}
                    checked={rfqs.length > 0 && selected.length === rfqs.length}
                    onChange={handleSelectAll}
                    sx={{ color: COLORS.text.light, '&.Mui-checked': { color: COLORS.text.light } }}
                    disabled={loading || rfqs.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>RFQ Number</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>PR Number</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Vendors</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Valid Till</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60, color: COLORS.text.light }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading RFQs...</Typography>
                  </TableCell>
                </TableRow>
              ) : rfqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                      {searchTerm ? 'No RFQs found' : 'No RFQs available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rfqs.map((rfq) => {
                  const isSelected = selected.includes(rfq._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedRfqForAction?._id === rfq._id;
                  const avatarColor = getAvatarColor(rfq.rfq_number);
                  const statusStyles = getStatusStyles(rfq.status);
                  const responseStats = rfq.response_stats || { total_vendors: rfq.vendors?.length || 0, responded_vendors: 0 };

                  return (
                    <TableRow key={rfq._id} hover selected={isSelected} sx={{ bgcolor: COLORS.background.white, '&:hover': { bgcolor: COLORS.background.hover } }}>
                      <TableCell padding="checkbox" sx={{ width: 40 }}>
                        <Checkbox checked={isSelected} onChange={() => handleSelect(rfq._id)} sx={{ color: COLORS.primary }} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getAvatarInitials(rfq.rfq_number)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>{rfq.rfq_number}</Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Created: {formatDate(rfq.createdAt)}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {rfq.pr_id?.pr_number || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {rfq.items?.length || 0} item(s)
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {rfq.vendors?.length || 0} vendor(s)
                          {responseStats.responded_vendors > 0 && (
                            <Typography component="span" sx={{ fontSize: '0.65rem', color: COLORS.success, display: 'block' }}>
                              {responseStats.responded_vendors} responded
                            </Typography>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDate(rfq.valid_till)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={rfq.status} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 20, bgcolor: statusStyles.bg, color: statusStyles.text, border: `1px solid ${statusStyles.border}` }} />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu
                          item={rfq}
                          onView={openViewRFQModal}
                          onSend={handleSendRFQ}
                          onSubmitQuote={handleSubmitQuote}
                          onCompare={handleOpenComparisonModal}
                          onCloseRfq={handleOpenCloseDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, rfq)}
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

      {/* Modal Components */}
      <AddRFQ open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handleRFQAdded} />
      
      {selectedRfq && (
        <>
          <ViewRFQ open={openViewModal} onClose={() => { setOpenViewModal(false); setSelectedRfq(null); }} rfq={selectedRfq} />
          <SubmitQuote
            open={openSubmitQuoteModal}
            onClose={() => { setOpenSubmitQuoteModal(false); setSelectedRfq(null); setSelectedVendor(null); }}
            rfq={selectedRfq}
            vendor={selectedVendor}
            onQuoteSubmitted={handleQuoteSubmitted}
          />
        </>
      )}
      
      <ViewRFQComparison
        open={openComparisonModal}
        onClose={() => {
          setOpenComparisonModal(false);
          setComparisonRfqId(null);
        }}
        rfqId={comparisonRfqId}
        onVendorSelected={handleVendorSelected}
      />

      {/* Close RFQ Confirmation Dialog */}
      <Dialog
        open={openCloseDialog}
        onClose={() => setOpenCloseDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${COLORS.border}`,
          py: 1.5,
          px: 2.5,
          bgcolor: COLORS.background.white,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <LockIcon sx={{ color: COLORS.warning, fontSize: 20 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Close RFQ
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5, backgroundColor: COLORS.background.light }}>
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
              Are you sure you want to close this RFQ?
            </Typography>
            
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.tertiary, mb: 0.5 }}>
                    RFQ NUMBER
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {selectedRfq?.rfq_number}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.tertiary, mb: 0.5 }}>
                    CURRENT STATUS
                  </Typography>
                  <Chip 
                    label={selectedRfq?.status} 
                    size="small" 
                    sx={{ 
                      fontSize: '0.7rem', 
                      height: 22,
                      bgcolor: getStatusStyles(selectedRfq?.status).bg,
                      color: getStatusStyles(selectedRfq?.status).text
                    }} 
                  />
                </Box>
              </Stack>
            </Paper>
            
            <Box sx={{ p: 1.5, bgcolor: '#FEF3C7', borderRadius: 1.5, border: '1px solid #FDE68A' }}>
              <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#92400E' }}>
                ⚠️ Closing this RFQ will mark it as completed and no further actions can be performed on it.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          px: 2.5, 
          py: 1.5, 
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          gap: 1
        }}>
          <Button 
            onClick={() => setOpenCloseDialog(false)} 
            disabled={closingRfq}
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
            onClick={handleCloseRFQ}
            disabled={closingRfq}
            startIcon={closingRfq ? null : <LockIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              height: 32,
              px: 2,
              borderRadius: 1.5,
              bgcolor: COLORS.warning,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: '#D97706' }
            }}
          >
            {closingRfq ? 'Closing...' : 'Close RFQ'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default RFQMaster;