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
  LocalShipping as ShippingIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import ViewCustomer from './ViewCustomer';
import DeleteCustomer from './DeleteCustomer';
import { COLORS, CUSTOMER_TYPE_COLORS, PRIORITY_COLORS } from './constants';

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

// Add this new component for Shipping Address Dialog - following the same styling as AddCustomer
const ShippingAddressDialog = ({ open, onClose, customer, onSuccess }) => {
  const [formData, setFormData] = useState({
    label: '',
    line1: '',
    line2: '',
    city: '',
    district: '',
    state: '',
    state_code: '',
    pincode: '',
    is_default: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
    setError('');
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.label.trim()) {
      errors.label = 'Address label is required';
      isValid = false;
    }
    if (!formData.line1.trim()) {
      errors.line1 = 'Address line 1 is required';
      isValid = false;
    }
    if (!formData.city.trim()) {
      errors.city = 'City is required';
      isValid = false;
    }
    if (!formData.state.trim()) {
      errors.state = 'State is required';
      isValid = false;
    }
    if (!formData.state_code) {
      errors.state_code = 'State code is required';
      isValid = false;
    }
    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
      isValid = false;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Invalid pincode format (6 digits required)';
      isValid = false;
    }
    
    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix all validation errors');
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/customers/${customer._id}/shipping-addresses`,
        {
          action: 'add',
          address: {
            label: formData.label,
            line1: formData.line1,
            line2: formData.line2 || undefined,
            city: formData.city,
            district: formData.district || undefined,
            state: formData.state,
            state_code: parseInt(formData.state_code),
            pincode: formData.pincode,
            is_default: formData.is_default
          }
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        onSuccess && onSuccess();
        handleClose();
      } else {
        setError(response.data.message || 'Failed to add shipping address');
      }
    } catch (err) {
      console.error('Error adding shipping address:', err);
      setError(err.response?.data?.message || 'Failed to add shipping address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        label: '',
        line1: '',
        line2: '',
        city: '',
        district: '',
        state: '',
        state_code: '',
        pincode: '',
        is_default: false
      });
      setFieldErrors({});
      setError('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <ShippingIcon sx={{ fontSize: '1.2rem', color: COLORS.primary }} />
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Add Shipping Address
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, ml: 'auto' }}>
          For: {customer?.customer_name}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* Address Label Section */}
          <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
              <LocationIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
              Address Information
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Address Label <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    placeholder="e.g., Head Office, Warehouse, Factory"
                    error={!!fieldErrors.label}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  {fieldErrors.label && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.label}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Address Line 1 <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="line1"
                    value={formData.line1}
                    onChange={handleChange}
                    placeholder="Street address, P.O. Box, company name"
                    error={!!fieldErrors.line1}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  {fieldErrors.line1 && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.line1}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Address Line 2
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="line2"
                    value={formData.line2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, unit, building, floor"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    City <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai"
                    error={!!fieldErrors.city}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  {fieldErrors.city && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.city}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    District
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g., Thane"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    State <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g., Maharashtra"
                    error={!!fieldErrors.state}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  {fieldErrors.state && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.state}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    State Code <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="state_code"
                    value={formData.state_code}
                    onChange={handleChange}
                    type="number"
                    placeholder="e.g., 27"
                    error={!!fieldErrors.state_code}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  {fieldErrors.state_code && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.state_code}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary }}>
                    Pincode <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6 digits"
                    error={!!fieldErrors.pincode}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 1,
                        px: 1.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  {fieldErrors.pincode && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                      {fieldErrors.pincode}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="is_default"
                      checked={formData.is_default}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: COLORS.primary,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: COLORS.primary,
                        },
                      }}
                    />
                  }
                  label={<Typography sx={{ fontSize: '0.75rem' }}>Set as default shipping address</Typography>}
                />
              </Grid>
            </Grid>
          </Paper>
          
          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, gap: 1 }}>
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
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            }
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Add Address'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Action Menu Component with permission checks
const ActionMenu = ({ item, onView, onEdit, onDelete, onShippingAddress, anchorEl, onClose, onOpen, permissions }) => {
  // Use CUSTOMER_MASTER module
  const canView = hasPermission(permissions, MODULES.CUSTOMER_MASTER, PAGES.CUSTOMER_MASTER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.CUSTOMER_MASTER, PAGES.CUSTOMER_MASTER, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.CUSTOMER_MASTER, PAGES.CUSTOMER_MASTER, ACTIONS.DELETE);

  // If no actions available, don't render the menu
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

        {/* Shipping Address Option - Only show if user has update permission */}
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
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
            
            // Debug: Log permissions for CUSTOMER_MASTER
            const customerPermissions = userData.permissions.filter(p => p.module === 'CUSTOMER_MASTER');
            console.log('Customer Master Permissions:', customerPermissions);
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
    
    const hasPerm = hasPermission(
      userPermissions,
      MODULES.CUSTOMER_MASTER,
      PAGES.CUSTOMER_MASTER,
      action
    );
    
    return hasPerm;
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canExport = checkPermission(ACTIONS.EXPORT);
  const canImport = checkPermission(ACTIONS.IMPORT);
  const canPrint = checkPermission(ACTIONS.PRINT);

  // Debug: Log permission values
  useEffect(() => {
    if (permissionsLoaded) {
      console.log('Customer Master Permission Values:', {
        canViewPage,
        canCreate,
        canUpdate,
        canDelete,
        canExport,
        canImport,
        canPrint,
        isSuperAdmin
      });
    }
  }, [permissionsLoaded, canViewPage, canCreate, canUpdate, canDelete, canExport, canImport, canPrint, isSuperAdmin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchCustomers = useCallback(async () => {
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
      
      const response = await axios.get(`${BASE_URL}/api/customers?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setCustomers(response.data.data || []);
        setTotalItems(response.data.pagination.total);
      } else {
        showNotification('Failed to load customers', 'error');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      showNotification('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchCustomers();
    }
  }, [fetchCustomers, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleRefresh = () => {
    fetchCustomers();
    showNotification('Data refreshed', 'success');
  };
  
  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(customers.map(customer => customer._id));
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
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (!canDelete) return;
    showNotification('Bulk delete requires API implementation', 'warning');
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
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
              onChange={(e) => setSearchInput(e.target.value)}
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
            
            {/* Add Customer Button - Only show if user has create permission */}
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
                {/* Checkbox Column - Only show if user has delete permission */}
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
                      {/* Checkbox Column - Only show if user has delete permission */}
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

      {/* Modal Components - Only render if user has appropriate permissions */}
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

          {/* Shipping Address Dialog */}
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