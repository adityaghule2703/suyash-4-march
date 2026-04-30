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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  LocalShipping as ShippingIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import ViewCustomer from './ViewCustomer';
import DeleteCustomer from './DeleteCustomer';
import { COLORS, CUSTOMER_TYPE_COLORS, PRIORITY_COLORS } from './constants';
import ShippingAddressDialog from './ShippingAddressDialog';

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



// Action Menu Component with permission checks
const ActionMenu = ({ item, onView, onEdit, onDelete, onShippingAddress, anchorEl, onClose, onOpen, permissions }) => {
  const canView = hasPermission(permissions, MODULES.CUSTOMER_MASTER, PAGES.CUSTOMER_MASTER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.CUSTOMER_MASTER, PAGES.CUSTOMER_MASTER, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.CUSTOMER_MASTER, PAGES.CUSTOMER_MASTER, ACTIONS.DELETE);

  if (!canView && !canUpdate && !canDelete) {
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
        
        {canUpdate && (
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

        {canUpdate && (
          <MenuItem 
            onClick={() => {
              onShippingAddress(item);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <ShippingIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Add Shipping Address
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {(canView || canUpdate) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
        
        {canDelete && (
          <MenuItem 
            onClick={() => {
              onDelete(item);
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
        )}
      </Menu>
    </>
  );
};

const CustomerMaster = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedCustomerForAction, setSelectedCustomerForAction] = useState(null);
  
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openShippingAddressDialog, setOpenShippingAddressDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Ref for search timeout
  const searchTimeoutRef = useRef(null);

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
    if (isSuperAdmin) return true;
    return hasPermission(
      userPermissions,
      MODULES.CUSTOMER_MASTER,
      PAGES.CUSTOMER_MASTER,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);

  // Handle search input change with proper debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounce - but don't set loading to true
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1);
      setPage(0);
      setSelected([]);
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

  // Fetch customers - separate from search input
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: rowsPerPage
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await axios.get(`${BASE_URL}/api/customers?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setCustomers(response.data.data || []);
        setTotalItems(response.data.pagination?.total || 0);
      } else {
        showNotification('Failed to load customers', 'error');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      showNotification('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm]);

  // Fetch data when dependencies change
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchCustomers();
    }
  }, [fetchCustomers, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleRefresh = () => {
    fetchCustomers();
    showNotification('Data refreshed', 'success');
  };
  
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(customers.map(customer => customer._id));
    } else {
      setSelected([]);
    }
  };
  
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
    setCurrentPage(newPage + 1);
    setSelected([]);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setCurrentPage(1);
    setSelected([]);
  };
  
  const handleAddCustomer = () => {
    fetchCustomers();
    showNotification('Customer added successfully!', 'success');
  };
  
  const handleEditCustomer = () => {
    fetchCustomers();
    showNotification('Customer updated successfully!', 'success');
  };
  
  const handleDeleteCustomer = () => {
    fetchCustomers();
    setSelected([]);
    showNotification('Customer deleted successfully!', 'success');
  };

  const handleShippingAddressSuccess = () => {
    showNotification('Shipping address added successfully!', 'success');
    fetchCustomers();
  };
  
  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/customers/bulk-delete`, 
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setSelected([]);
      
      if (customers.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      } else {
        fetchCustomers();
      }
      
      showNotification(`${selected.length} customer(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete customers', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleActionMenuOpen = (event, customer) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedCustomerForAction(customer);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedCustomerForAction(null);
  };

  const openEditCustomerModal = (customer) => {
    if (!canUpdate) return;
    setSelectedCustomer(customer);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  const openViewCustomerModal = (customer) => {
    if (!canViewPage) return;
    setSelectedCustomer(customer);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteCustomerDialog = (customer) => {
    if (!canDelete) return;
    setSelectedCustomer(customer);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const openShippingAddressModal = (customer) => {
    if (!canUpdate) return;
    setSelectedCustomer(customer);
    setOpenShippingAddressDialog(true);
    handleActionMenuClose();
  };
  
  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  const getCustomerInitials = (customer) => {
    if (!customer.customer_name) return 'CS';
    return customer.customer_name.substring(0, 2).toUpperCase();
  };
  
  const getAvatarColor = (customer) => {
    if (!customer.customer_name) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = customer.customer_name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  if (!permissionsLoaded) {
    return <LoadingState />;
  }

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
          Customer Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage customer information, credit limits, and contact details
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
              placeholder="Search by Customer Name, Code, GSTIN, or Contact..."
              size="small"
              value={searchInput}
              onChange={handleSearchChange}
              autoComplete="off"
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
                    color: COLORS.text.primary,
                    '&::placeholder': {
                      color: COLORS.text.tertiary,
                      fontSize: '0.75rem'
                    }
                  }
                }
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
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
            
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: COLORS.text.secondary,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}20`
                  }
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenAddModal(true)}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: COLORS.primary,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: COLORS.primaryDark,
                  }
                }}
                disabled={loading}
              >
                Add Customer
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Customers Table */}
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
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < customers.length}
                      checked={customers.length > 0 && selected.length === customers.length}
                      onChange={handleSelectAll}
                      sx={{
                        color: COLORS.text.light,
                        '&.Mui-checked': {
                          color: COLORS.text.light,
                        },
                        '&.MuiCheckbox-indeterminate': {
                          color: COLORS.text.light,
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.25rem'
                        }
                      }}
                      disabled={loading || customers.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Customer ID / Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Contact
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  GSTIN
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Credit Limit
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Priority
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Location
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading customers...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <BusinessIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No customers found' : 'No customers available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first customer to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => {
                  const isSelected = selected.includes(customer._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedCustomerForAction?._id === customer._id;
                  const avatarColor = getAvatarColor(customer);
                  const customerTypeColors = CUSTOMER_TYPE_COLORS[customer.customer_type] || { bg: '#F1F5F9', color: '#475569' };
                  const priorityColors = PRIORITY_COLORS[customer.priority] || { bg: '#F1F5F9', color: '#475569' };
                  const primaryContact = customer.contacts?.find(c => c.is_primary) || customer.contacts?.[0];
                  const location = customer.billing_address?.city || customer.billing_address?.state || '-';

                  return (
                    <TableRow
                      key={customer._id}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': {
                          bgcolor: COLORS.background.hover
                        },
                        '&.Mui-selected': {
                          bgcolor: `${COLORS.primary}10`,
                          '&:hover': {
                            bgcolor: `${COLORS.primary}20`
                          }
                        },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      {canDelete && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(customer._id)}
                            sx={{
                              color: COLORS.primary,
                              '&.Mui-checked': {
                                color: COLORS.primary,
                              },
                              '& .MuiSvgIcon-root': {
                                fontSize: '1.25rem'
                              }
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getCustomerInitials(customer)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {customer.customer_name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Code: {customer.customer_code} | ID: {customer.customer_id}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.customer_type || '-'}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
                            bgcolor: customerTypeColors.bg,
                            color: customerTypeColors.color
                          }}
                        />
                        {customer.is_export && (
                          <Chip
                            label="Export"
                            size="small"
                            sx={{ 
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              height: 24,
                              ml: 0.5,
                              bgcolor: '#E0F2FE',
                              color: '#0369A1'
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {primaryContact ? (
                          <>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              {primaryContact.name}
                            </Typography>
                            {primaryContact.mobile && (
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                {primaryContact.mobile}
                              </Typography>
                            )}
                          </>
                        ) : (
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary }}>
                            No contact
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                          {customer.gstin || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {customer.credit_limit ? `₹${customer.credit_limit.toLocaleString()}` : '-'}
                        </Typography>
                        {customer.credit_days && (
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {customer.credit_days} days
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.priority || 'Regular'}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 24,
                            bgcolor: priorityColors.bg,
                            color: priorityColors.color
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <LocationIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.7rem' }}>
                            {location}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          item={customer}
                          onView={openViewCustomerModal}
                          onEdit={openEditCustomerModal}
                          onDelete={openDeleteCustomerDialog}
                          onShippingAddress={openShippingAddressModal}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, customer)}
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
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.7rem',
              color: COLORS.text.secondary
            },
            '& .MuiTablePagination-select': {
              fontSize: '0.7rem'
            },
            '& .MuiTablePagination-actions button': {
              color: COLORS.primary,
            }
          }}
        />
      </Paper>

      {/* Modal Components */}
      {canCreate && (
        <AddCustomer 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddCustomer}
        />
      )}

      {selectedCustomer && (
        <>
          {canUpdate && (
            <EditCustomer 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedCustomer(null);
              }}
              customer={selectedCustomer}
              onUpdate={handleEditCustomer}
            />
          )}

          {canViewPage && (
            <ViewCustomer 
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedCustomer(null);
              }}
              customer={selectedCustomer}
              onEdit={() => {
                if (canUpdate) {
                  setOpenViewModal(false);
                  setOpenEditModal(true);
                }
              }}
            />
          )}

          {canDelete && (
            <DeleteCustomer 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedCustomer(null);
              }}
              customer={selectedCustomer}
              onDelete={handleDeleteCustomer}
            />
          )}

          {canUpdate && (
            <ShippingAddressDialog
              open={openShippingAddressDialog}
              onClose={() => {
                setOpenShippingAddressDialog(false);
                setSelectedCustomer(null);
              }}
              customer={selectedCustomer}
              onSuccess={handleShippingAddressSuccess}
            />
          )}
        </>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
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

export default CustomerMaster;