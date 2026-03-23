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
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  Approval as ApprovalIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddPurchaseOrder from './AddPurchaseOrder';
import ViewPurchaseOrder from './ViewPurchaseOrder';

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
  info: '#3B82F6'
};

const getStatusStyles = (status) => {
  const styles = {
    Draft: { bg: '#E0F2FE', text: '#0C4A6E', border: '#BAE6FD' },
    Approved: { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' },
    Sent: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    Acknowledged: { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' },
    'Partially Received': { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    'Fully Received': { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' },
    Invoiced: { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' },
    Closed: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
    Cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' }
  };
  return styles[status] || styles.Draft;
};

const ActionMenu = ({ item, onView, onApprove, onSend, onAcknowledge, onRemind, onClose, anchorEl, onOpen }) => {
  const canApprove = item.status === 'Draft';
  const canSend = item.status === 'Approved';
  const canAcknowledge = item.status === 'Sent';
  const canRemind = item.status === 'Sent';
  
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
        {canApprove && (
          <MenuItem onClick={() => { onApprove(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.success, minWidth: 36 }}>
              <ApprovalIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.success, fontSize: '0.75rem' }}>Approve</Typography>
            </ListItemText>
          </MenuItem>
        )}
        {canSend && (
          <MenuItem onClick={() => { onSend(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <SendIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>Send to Vendor</Typography>
            </ListItemText>
          </MenuItem>
        )}
        {canAcknowledge && (
          <MenuItem onClick={() => { onAcknowledge(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.info, minWidth: 36 }}>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.info, fontSize: '0.75rem' }}>Acknowledge</Typography>
            </ListItemText>
          </MenuItem>
        )}
        {canRemind && (
          <MenuItem onClick={() => { onRemind(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <NotificationsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>Send Reminder</Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const PurchaseOrderMaster = () => {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedPoForAction, setSelectedPoForAction] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [selectedPo, setSelectedPo] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchPOs = useCallback(async () => {
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
      
      const response = await axios.get(`${BASE_URL}/api/purchase-orders?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setPos(response.data.data || []);
        setTotalItems(response.data.pagination.total);
      } else {
        showNotification('Failed to load Purchase Orders', 'error');
      }
    } catch (err) {
      console.error('Error fetching POs:', err);
      showNotification('Failed to load Purchase Orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchPOs();
  }, [fetchPOs]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(pos.map(po => po._id));
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

  const handleAddPO = () => setOpenAddModal(true);
  const handlePOAdded = () => {
    fetchPOs();
    showNotification('Purchase Order created successfully!', 'success');
  };

  const handleActionMenuOpen = (event, po) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedPoForAction(po);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedPoForAction(null);
  };

  const openViewPOModal = (po) => {
    setSelectedPo(po);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const handleApprovePO = (po) => {
    setSelectedPo(po);
    setApprovalNotes('');
    setOpenApproveDialog(true);
    handleActionMenuClose();
  };

  const handleSubmitApproval = async () => {
    if (!selectedPo?._id) return;
    
    setLoadingAction(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/purchase-orders/${selectedPo._id}/approve`,
        { approval_notes: approvalNotes || 'Approved' },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      
      if (response.data.success) {
        fetchPOs();
        showNotification(`PO ${selectedPo.po_number} approved successfully!`, 'success');
        setOpenApproveDialog(false);
        setSelectedPo(null);
        setApprovalNotes('');
      } else {
        showNotification(response.data.message || 'Failed to approve PO', 'error');
      }
    } catch (err) {
      console.error('Error approving PO:', err);
      showNotification(err.response?.data?.message || 'Failed to approve PO', 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSendPO = async (po) => {
    if (!po?._id) return;
    
    setLoadingAction(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/purchase-orders/${po._id}/send`,
        { send_email: true },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      
      if (response.data.success) {
        fetchPOs();
        showNotification(`PO ${po.po_number} sent successfully!`, 'success');
      } else {
        showNotification(response.data.message || 'Failed to send PO', 'error');
      }
    } catch (err) {
      console.error('Error sending PO:', err);
      showNotification(err.response?.data?.message || 'Failed to send PO', 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAcknowledgePO = async (po) => {
    if (!po?._id) return;
    
    setLoadingAction(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/purchase-orders/${po._id}/acknowledge`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        fetchPOs();
        showNotification(`PO ${po.po_number} acknowledged successfully!`, 'success');
      } else {
        showNotification(response.data.message || 'Failed to acknowledge PO', 'error');
      }
    } catch (err) {
      console.error('Error acknowledging PO:', err);
      showNotification(err.response?.data?.message || 'Failed to acknowledge PO', 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRemindPO = async (po) => {
    if (!po?._id) return;
    
    setLoadingAction(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/purchase-orders/${po._id}/remind`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        showNotification(`Reminder sent to vendor for PO ${po.po_number}`, 'success');
      } else {
        showNotification(response.data.message || 'Failed to send reminder', 'error');
      }
    } catch (err) {
      console.error('Error sending reminder:', err);
      showNotification(err.response?.data?.message || 'Failed to send reminder', 'error');
    } finally {
      setLoadingAction(false);
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

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(amount);
  };

  const getAvatarInitials = (poNumber) => {
    if (!poNumber) return 'PO';
    return poNumber.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (poNumber) => {
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = poNumber?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Purchase Orders
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Create and manage purchase orders for procurement
        </Typography>
      </Box>

      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by PO number, vendor..."
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
            onClick={handleAddPO}
            sx={{ height: 36, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', fontWeight: 500, textTransform: 'none' }}
            disabled={loading}
          >
            Create Purchase Order
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
                    indeterminate={selected.length > 0 && selected.length < pos.length}
                    checked={pos.length > 0 && selected.length === pos.length}
                    onChange={handleSelectAll}
                    sx={{ color: COLORS.text.light }}
                    disabled={loading || pos.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>PO Number</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Vendor</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Grand Total</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Delivery Date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60, color: COLORS.text.light }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading Purchase Orders...</Typography>
                  </TableCell>
                </TableRow>
              ) : pos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                      {searchTerm ? 'No Purchase Orders found' : 'No Purchase Orders available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pos.map((po) => {
                  const isSelected = selected.includes(po._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedPoForAction?._id === po._id;
                  const avatarColor = getAvatarColor(po.po_number);
                  const statusStyles = getStatusStyles(po.status);

                  return (
                    <TableRow key={po._id} hover selected={isSelected} sx={{ bgcolor: COLORS.background.white, '&:hover': { bgcolor: COLORS.background.hover } }}>
                      <TableCell padding="checkbox" sx={{ width: 40 }}>
                        <Checkbox checked={isSelected} onChange={() => handleSelect(po._id)} sx={{ color: COLORS.primary }} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getAvatarInitials(po.po_number)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>{po.po_number}</Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Created: {formatDate(po.createdAt)}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {po.vendor_name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Code: {po.vendor_id?.vendor_code || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {po.items?.length || 0} item(s)
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                          {formatCurrency(po.grand_total)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDate(po.delivery_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={po.status} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 20, bgcolor: statusStyles.bg, color: statusStyles.text, border: `1px solid ${statusStyles.border}` }} />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu
                          item={po}
                          onView={openViewPOModal}
                          onApprove={handleApprovePO}
                          onSend={handleSendPO}
                          onAcknowledge={handleAcknowledgePO}
                          onRemind={handleRemindPO}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, po)}
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
      <AddPurchaseOrder open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handlePOAdded} />
      
      {selectedPo && (
        <ViewPurchaseOrder open={openViewModal} onClose={() => { setOpenViewModal(false); setSelectedPo(null); }} po={selectedPo} />
      )}

      {/* Approve Dialog */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ApprovalIcon sx={{ color: COLORS.success, fontSize: 20 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>Approve Purchase Order</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
              Please add approval notes for PO <strong>{selectedPo?.po_number}</strong>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Approval Notes"
              placeholder="Enter approval notes..."
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, gap: 1 }}>
          <Button onClick={() => setOpenApproveDialog(false)} disabled={loadingAction} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.75rem' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmitApproval} disabled={loadingAction} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.success, fontSize: '0.75rem' }}>
            {loadingAction ? 'Approving...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PurchaseOrderMaster;