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
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddGRN from './AddGRN';
import ViewGRN from './ViewGRN';
import QcResultModal from './QcResultModal';

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
    Created: { bg: '#E0F2FE', text: '#0C4A6E', border: '#BAE6FD' },
    'QC Passed': { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' },
    'QC Failed': { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
    'Partially Accepted': { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    Accepted: { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' },
    Rejected: { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
    Closed: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' }
  };
  return styles[status] || styles.Created;
};

const getQCStatusStyles = (status) => {
  const styles = {
    Pending: { bg: '#E0F2FE', text: '#0C4A6E', border: '#BAE6FD' },
    'In Progress': { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    Completed: { bg: '#D1FAE5', text: '#065F46', border: '#86EFAC' }
  };
  return styles[status] || styles.Pending;
};

const ActionMenu = ({ item, onView, onQcResult, onClose, anchorEl, onOpen }) => {
  // Show QC Result button only for GRNs with status 'Created' and qc_status 'Pending'
  const canDoQC = item.status === 'Created' && item.qc_status === 'Pending';
  
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
        {canDoQC && (
          <MenuItem onClick={() => { onQcResult(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.success, minWidth: 36 }}>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.success, fontSize: '0.75rem' }}>QC Result</Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const GRNMaster = () => {
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedGrnForAction, setSelectedGrnForAction] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openQcModal, setOpenQcModal] = useState(false);
  const [selectedGrn, setSelectedGrn] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchGRNs = useCallback(async () => {
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
      
      const response = await axios.get(`${BASE_URL}/api/grns?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 10000
      });

      if (response.data.success) {
        setGrns(response.data.data || []);
        setTotalItems(response.data.pagination?.total || 0);
      } else {
        showNotification(response.data.message || 'Failed to load GRNs', 'error');
      }
    } catch (err) {
      console.error('Error fetching GRNs:', err);
      if (err.code === 'ECONNABORTED') {
        showNotification('Request timeout - Server not responding', 'error');
      } else if (err.response?.status === 401) {
        showNotification('Session expired. Please login again.', 'error');
      } else {
        showNotification('Failed to load GRNs. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchGRNs();
  }, [fetchGRNs]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(grns.map(grn => grn._id));
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

  const handleAddGRN = () => setOpenAddModal(true);
  const handleGRNAdded = () => {
    fetchGRNs();
    showNotification('GRN created successfully!', 'success');
  };

  const handleQcComplete = (data) => {
    fetchGRNs();
    showNotification(`QC results submitted for ${data.grn_number}`, 'success');
  };

  const handleActionMenuOpen = (event, grn) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedGrnForAction(grn);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedGrnForAction(null);
  };

  const openViewGRNModal = (grn) => {
    setSelectedGrn(grn);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openQcResultModal = (grn) => {
    setSelectedGrn(grn);
    setOpenQcModal(true);
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

  const getAvatarInitials = (grnNumber) => {
    if (!grnNumber) return 'GR';
    return grnNumber.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (grnNumber) => {
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = grnNumber?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Goods Receipt Notes (GRN)
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Create and manage goods receipt notes for incoming materials
        </Typography>
      </Box>

      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by GRN number, PO number, vendor..."
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
            onClick={handleAddGRN}
            sx={{ height: 36, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', fontWeight: 500, textTransform: 'none' }}
            disabled={loading}
          >
            Create GRN
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
                    indeterminate={selected.length > 0 && selected.length < grns.length}
                    checked={grns.length > 0 && selected.length === grns.length}
                    onChange={handleSelectAll}
                    sx={{ color: COLORS.text.light }}
                    disabled={loading || grns.length === 0}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>GRN Number</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>PO Number</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Vendor</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Received Qty</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>GRN Date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>QC Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60, color: COLORS.text.light }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading GRNs...</Typography>
                  </TableCell>
                </TableRow>
              ) : grns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                      {searchTerm ? 'No GRNs found' : 'No GRNs available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                grns.map((grn) => {
                  const isSelected = selected.includes(grn._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedGrnForAction?._id === grn._id;
                  const avatarColor = getAvatarColor(grn.grn_number);
                  const statusStyles = getStatusStyles(grn.status);
                  const qcStatusStyles = getQCStatusStyles(grn.qc_status);

                  return (
                    <TableRow key={grn._id} hover selected={isSelected} sx={{ bgcolor: COLORS.background.white, '&:hover': { bgcolor: COLORS.background.hover } }}>
                      <TableCell padding="checkbox" sx={{ width: 40 }}>
                        <Checkbox checked={isSelected} onChange={() => handleSelect(grn._id)} sx={{ color: COLORS.primary }} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getAvatarInitials(grn.grn_number)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>{grn.grn_number}</Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Created: {formatDate(grn.createdAt)}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {grn.po_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {grn.vendor_name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Code: {grn.vendor_id?.vendor_code || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {grn.total_received_qty || 0} units
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDate(grn.grn_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={grn.status} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 20, bgcolor: statusStyles.bg, color: statusStyles.text, border: `1px solid ${statusStyles.border}` }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={grn.qc_status || 'Pending'} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 20, bgcolor: qcStatusStyles.bg, color: qcStatusStyles.text, border: `1px solid ${qcStatusStyles.border}` }} />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu
                          item={grn}
                          onView={openViewGRNModal}
                          onQcResult={openQcResultModal}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, grn)}
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

      <AddGRN open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handleGRNAdded} />
      
      {selectedGrn && (
        <>
          <ViewGRN open={openViewModal} onClose={() => { setOpenViewModal(false); setSelectedGrn(null); }} grn={selectedGrn} />
          <QcResultModal
            open={openQcModal}
            onClose={() => {
              setOpenQcModal(false);
              setSelectedGrn(null);
            }}
            grn={selectedGrn}
            onQcComplete={handleQcComplete}
          />
        </>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default GRNMaster;