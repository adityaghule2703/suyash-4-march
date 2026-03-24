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
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddPurchaseRequisition from './AddPurchaseRequisition';
import EditPurchaseRequisition from './EditPurchaseRequisition';
import ViewPurchaseRequisition from './ViewPurchaseRequisition';
import ApprovePurchaseRequisition from './ApprovePurchaseRequisition';
import RejectPurchaseRequisition from './RejectPurchaseRequisition';

// Color constants
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
  chips: {
    submitted: '#FEF3C7',
    approved: '#9FE2BF',
    rejected: '#FEE2E2',
    pending: '#E0F2FE'
  }
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

// Status styles
const getStatusStyles = (status) => {
  const styles = {
    Submitted: {
      bg: '#FEF3C7',
      text: '#92400E',
      border: '#FDE68A'
    },
    Approved: {
      bg: '#9FE2BF',
      text: '#166534',
      border: '#86EFAC'
    },
    Rejected: {
      bg: '#FEE2E2',
      text: '#991B1B',
      border: '#FECACA'
    },
    Pending: {
      bg: '#E0F2FE',
      text: '#0C4A6E',
      border: '#BAE6FD'
    }
  };
  return styles[status] || styles.Pending;
};

// Action Menu Component with permission checks
const ActionMenu = ({ item, onView, onEdit, onApprove, onReject, onClose, anchorEl, onOpen, permissions }) => {
  const canView = hasPermission(permissions, MODULES.PURCHASE_REQUISITION_MASTER, PAGES.PURCHASE_REQUISITION_MASTER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.PURCHASE_REQUISITION_MASTER, PAGES.PURCHASE_REQUISITION_MASTER, ACTIONS.UPDATE);
  const canApprove = hasPermission(permissions, MODULES.PURCHASE_REQUISITION_MASTER, PAGES.PURCHASE_REQUISITION_MASTER, ACTIONS.APPROVE);
  const canReject = hasPermission(permissions, MODULES.PURCHASE_REQUISITION_MASTER, PAGES.PURCHASE_REQUISITION_MASTER, ACTIONS.REJECT);
  
  // Only show edit option for Draft or Submitted status AND if user has update permission
  const canEdit = (item.status === 'Draft' || item.status === 'Submitted') && canUpdate;
  // Only show approve/reject for Submitted status AND if user has approve/reject permissions
  const canApproveReject = item.status === 'Submitted' && (canApprove || canReject);
  
  // Check if any actions are available
  const hasAnyAction = canView || canEdit || canApproveReject;
  
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
          <MenuItem 
            onClick={() => {
              onView(item);
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
        
        {canEdit && (
          <MenuItem 
            onClick={() => {
              onEdit(item);
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
        
        {canApproveReject && (
          <>
            <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
            {canApprove && (
              <MenuItem 
                onClick={() => {
                  onApprove(item);
                  onClose();
                }}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
                  <CheckCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                    Approve
                  </Typography>
                </ListItemText>
              </MenuItem>
            )}
            {canReject && (
              <MenuItem 
                onClick={() => {
                  onReject(item);
                  onClose();
                }}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
                  <CancelIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2" fontWeight={500} sx={{ color: '#EF4444', fontSize: '0.75rem' }}>
                    Reject
                  </Typography>
                </ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

const PurchaseRequisitionMaster = () => {
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedPrForAction, setSelectedPrForAction] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [selectedPr, setSelectedPr] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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
      MODULES.PURCHASE_REQUISITION_MASTER,
      PAGES.PURCHASE_REQUISITION_MASTER,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canApprove = checkPermission(ACTIONS.APPROVE);
  const canReject = checkPermission(ACTIONS.REJECT);
  const canExport = checkPermission(ACTIONS.EXPORT);
  const canPrint = checkPermission(ACTIONS.PRINT);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchPRs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        sort_by: 'createdAt',
        sort_order: 'desc'
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await axios.get(`${BASE_URL}/api/purchase-requisitions?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setPrs(response.data.data || []);
        setTotalItems(response.data.pagination.total);
      } else {
        showNotification('Failed to load purchase requisitions', 'error');
      }
    } catch (err) {
      console.error('Error fetching PRs:', err);
      showNotification('Failed to load purchase requisitions', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchPRs();
    }
  }, [fetchPRs, permissionsLoaded, canViewPage, isSuperAdmin]);

  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(prs.map(pr => pr._id));
    } else {
      setSelected([]);
    }
  };

  // Handle single selection - only if user has delete permission
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
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };

  const handleAddPR = () => {
    if (!canCreate) return;
    setOpenAddModal(true);
  };

  const handlePRAdded = () => {
    fetchPRs();
    showNotification('Purchase requisition created successfully!', 'success');
  };

  const handlePREdited = () => {
    fetchPRs();
    showNotification('Purchase requisition updated successfully!', 'success');
  };

  const handlePRApproved = () => {
    fetchPRs();
    showNotification('Purchase requisition approved successfully!', 'success');
  };

  const handlePRRejected = () => {
    fetchPRs();
    showNotification('Purchase requisition rejected successfully!', 'success');
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!canDelete) return;
    showNotification('Bulk delete requires API implementation', 'warning');
  };

  const handleActionMenuOpen = (event, pr) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedPrForAction(pr);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedPrForAction(null);
  };

  const openViewPRModal = (pr) => {
    if (!canViewPage) return;
    setSelectedPr(pr);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditPRModal = (pr) => {
    if (!canUpdate) return;
    setSelectedPr(pr);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openApprovePRModal = (pr) => {
    if (!canApprove) return;
    setSelectedPr(pr);
    setOpenApproveModal(true);
    handleActionMenuClose();
  };

  const openRejectPRModal = (pr) => {
    if (!canReject) return;
    setSelectedPr(pr);
    setOpenRejectModal(true);
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

  const getAvatarInitials = (prNumber) => {
    if (!prNumber) return 'PR';
    return prNumber.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (prNumber) => {
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = prNumber?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Purchase Requisitions
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Create and manage purchase requisitions for procurement
        </Typography>
      </Box>

      {/* Action Bar */}
      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by PR number, department..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ width: { xs: '100%', sm: 320 }, '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.75rem' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
                sx: { height: 36, bgcolor: COLORS.background.light, '& input': { padding: '6px 12px', fontSize: '0.75rem' } }
              }}
              disabled={loading}
            />
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
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
            
            {/* Create Requisition Button - Only show if user has create permission */}
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleAddPR}
                sx={{ height: 36, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.75rem', fontWeight: 500, textTransform: 'none' }}
                disabled={loading}
              >
                Create Requisition
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* PR Table */}
      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: `1px solid ${COLORS.border}` }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.background.tableHeader, '& .MuiTableCell-root': { borderBottom: 'none', color: COLORS.text.light, py: 1.5 } }}>
                {/* Checkbox Column - Only show if user has delete permission */}
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < prs.length}
                      checked={prs.length > 0 && selected.length === prs.length}
                      onChange={handleSelectAll}
                      sx={{ color: COLORS.text.light, '&.Mui-checked': { color: COLORS.text.light } }}
                      disabled={loading || prs.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>PR Number</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Total Value</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Required By</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', color: COLORS.text.light }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60, color: COLORS.text.light }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading purchase requisitions...</Typography>
                  </TableCell>
                </TableRow>
              ) : prs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No purchase requisitions found' : 'No purchase requisitions available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Create your first purchase requisition to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                prs.map((pr) => {
                  const isSelected = selected.includes(pr._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedPrForAction?._id === pr._id;
                  const avatarColor = getAvatarColor(pr.pr_number);
                  const statusStyles = getStatusStyles(pr.status);
                  const totalValue = pr.items?.reduce((sum, item) => sum + (item.estimated_price * item.required_qty), 0) || 0;

                  return (
                    <TableRow key={pr._id} hover selected={isSelected} sx={{ bgcolor: COLORS.background.white, '&:hover': { bgcolor: COLORS.background.hover }, '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border } }}>
                      {/* Checkbox Column - Only show if user has delete permission */}
                      {canDelete && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox checked={isSelected} onChange={() => handleSelect(pr._id)} sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary } }} />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>{getAvatarInitials(pr.pr_number)}</Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>{pr.pr_number}</Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>Created: {formatDate(pr.createdAt)}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{pr.pr_type || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{pr.department || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{pr.items?.length || 0} item(s)</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{formatCurrency(totalValue)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {pr.items?.[0]?.required_date ? formatDate(pr.items[0].required_date) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={pr.status} size="small" sx={{ fontSize: '0.65rem', fontWeight: 500, height: 20, bgcolor: statusStyles.bg, color: statusStyles.text, border: `1px solid ${statusStyles.border}` }} />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={pr} 
                          onView={openViewPRModal} 
                          onEdit={openEditPRModal}
                          onApprove={openApprovePRModal}
                          onReject={openRejectPRModal}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null} 
                          onClose={handleActionMenuClose} 
                          onOpen={(e) => handleActionMenuOpen(e, pr)} 
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: `1px solid ${COLORS.border}`, '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.7rem' }, '& .MuiTablePagination-actions button': { color: COLORS.primary } }}
        />
      </Paper>

      {/* Modal Components - Only render if user has appropriate permissions */}
      {canCreate && (
        <AddPurchaseRequisition open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handlePRAdded} />
      )}
      
      {selectedPr && (
        <>
          {canViewPage && (
            <ViewPurchaseRequisition open={openViewModal} onClose={() => { setOpenViewModal(false); setSelectedPr(null); }} pr={selectedPr} />
          )}
          
          {canUpdate && (
            <EditPurchaseRequisition open={openEditModal} onClose={() => { setOpenEditModal(false); setSelectedPr(null); }} pr={selectedPr} onUpdate={handlePREdited} />
          )}
          
          {canApprove && (
            <ApprovePurchaseRequisition open={openApproveModal} onClose={() => { setOpenApproveModal(false); setSelectedPr(null); }} pr={selectedPr} onApprove={handlePRApproved} />
          )}
          
          {canReject && (
            <RejectPurchaseRequisition open={openRejectModal} onClose={() => { setOpenRejectModal(false); setSelectedPr(null); }} pr={selectedPr} onReject={handlePRRejected} />
          )}
        </>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PurchaseRequisitionMaster;