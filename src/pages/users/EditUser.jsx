import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Typography,
  Box,
  Chip,
  FormControlLabel,
  Switch,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Autocomplete
} from '@mui/material';
import {
  Edit as EditIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

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
    active: '#9FE2BF',
    inactive: '#F1F5F9'
  }
};

// All available actions from your permission catalog
const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'IMPORT', 'PRINT', 'APPROVE', 'REJECT'];

// All pages/modules from your permission catalog - Updated with correct categorization and added Purchase Invoice Master
const ALL_PAGES = [
  // Dashboard
  { module: 'DASHBOARD', page: 'Dashboard', category: 'Dashboard' },
  
  // Administration
  { module: 'USERS', page: 'Users', category: 'Administration' },
  { module: 'ROLES', page: 'Roles', category: 'Administration' },
  
  // Quotation Master - Updated (Removed Supplier)
  { module: 'COMPANY_MASTER', page: 'Organization / Company', category: 'Quotation Master' },
  { module: 'CUSTOMER_MASTER', page: 'Customer Master', category: 'Quotation Master' },
  { module: 'LEAD_MASTER', page: 'Lead Master', category: 'Quotation Master' },
  { module: 'TAX_MASTER', page: 'Tax Configuration / Tax Rule', category: 'Quotation Master' },
  { module: 'TERMS_CONDITIONS_MASTER', page: 'Terms And Conditions', category: 'Quotation Master' },
  { module: 'ITEM_MASTER', page: 'Product / Item Catalog', category: 'Quotation Master' },
  { module: 'PROCESS_MASTER', page: 'Manufacturing Process', category: 'Quotation Master' },
  { module: 'PROCESS_DETAILS_MASTER', page: 'Process Details Master', category: 'Quotation Master' },
  { module: 'DIMENSION_MASTER', page: 'Product Specifications', category: 'Quotation Master' },
  { module: 'MATERIAL_MASTER', page: 'Material Catalog', category: 'Quotation Master' },
  { module: 'RAW_MATERIAL_MASTER', page: 'Raw Material', category: 'Quotation Master' },
  { module: 'COSTING_MASTER', page: 'Costing Master', category: 'Quotation Master' },
  { module: 'OPERATION_MASTER', page: 'Operation Master', category: 'Quotation Master' },
  { module: 'COMPANY_FINANCIAL_MASTER', page: 'Company Financial Master', category: 'Quotation Master' },
  { module: 'QUOTATION_MASTER', page: 'Quotation', category: 'Quotation Master' },
  
  // Procurement Master - Updated with correct sequence and added Purchase Invoice Master
  { module: 'SUPPLIER_MASTER', page: 'Supplier', category: 'Procurement Master' },
  { module: 'PURCHASE_REQUISITION_MASTER', page: 'Purchase Requisition Master', category: 'Procurement Master' },
  { module: 'RFQ_MASTER', page: 'RFQ Master', category: 'Procurement Master' },
  { module: 'PURCHASE_ORDER_MASTER', page: 'Purchase Order Master', category: 'Procurement Master' },
  { module: 'GRN_MASTER', page: 'GRN Master', category: 'Procurement Master' },
  { module: 'PURCHASE_INVOICE_MASTER', page: 'Purchase Invoice Master', category: 'Procurement Master' },
  
  // HR Master - Updated with new modules
  { module: 'DEPARTMENT_MASTER', page: 'Department Master', category: 'HR Master' },
  { module: 'DESIGNATION_MASTER', page: 'Designation Master', category: 'HR Master' },
  { module: 'EMPLOYEE_MASTER', page: 'Employee Registry', category: 'HR Master' },
  { module: 'LEAVE_TYPE_MASTER', page: 'Leave Policies', category: 'HR Master' },
  { module: 'SHIFT_MASTER', page: 'Shift Master', category: 'HR Master' },
  { module: 'ACCIDENT_MASTER', page: 'Accident Reporting', category: 'HR Master' },
  { module: 'REQUISITION_MASTER', page: 'Hiring Requests', category: 'HR Master' },
  { module: 'JOB_OPENING_MASTER', page: 'Career Opportunities', category: 'HR Master' },
  { module: 'CANDIDATE_MASTER', page: 'Candidate Master', category: 'HR Master' },
  { module: 'INTERVIEW_MASTER', page: 'Interview Scheduling', category: 'HR Master' },
  { module: 'SELECTED_CANDIDATES_MASTER', page: 'Selected Candidate', category: 'HR Master' },
  { module: 'SALARY_MASTER', page: 'Salary Master', category: 'HR Master' },
  { module: 'PIECE_RATE_MASTER', page: 'Piece Rate Master', category: 'HR Master' },
  { module: 'REGULARIZATION_MASTER', page: 'Attendance Regularization', category: 'HR Master' },
  { module: 'EMPLOYEE_LEAVE_MASTER', page: 'Employee Leave Records', category: 'HR Master' },
  { module: 'ADMIN_LEAVE_MASTER', page: 'Leave Administration', category: 'HR Master' },
  { module: 'PRODUCTION_MASTER', page: 'Production Master', category: 'HR Master' },
  { module: 'TERMINATION_MASTER', page: 'Termination Master', category: 'HR Master' },
  { module: 'EMPLOYEE_BEHAVIOR_MASTER', page: 'Behavior Monitoring', category: 'HR Master' },
  { module: 'MEDICLAIM_MASTER', page: 'Mediclaim Master', category: 'HR Master' },
  { module: 'LEAVE_APPROVAL', page: 'Leave Approval', category: 'HR Master' }
];

// Group pages by category
const groupedPages = ALL_PAGES.reduce((acc, page) => {
  if (!acc[page.category]) {
    acc[page.category] = [];
  }
  acc[page.category].push(page);
  return acc;
}, {});

const EditUser = ({ open, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Status: 'active'
  });
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Fetch roles
  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setRoles(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  // Initialize data from user when opened
  useEffect(() => {
    if (user && open) {
      // Set form data
      setFormData({
        Username: user.Username || '',
        Email: user.Email || '',
        Status: user.Status || 'active'
      });

      // Set selected role
      if (user.RoleID) {
        setSelectedRole(user.RoleID);
      }

      // Initialize permissions map from user's permissions
      const initialPermissions = {};
      ALL_PAGES.forEach(page => {
        ALL_ACTIONS.forEach(action => {
          const key = `${page.module}_${action}`;
          initialPermissions[key] = false;
        });
      });

      // Fill in existing permissions from user's permissions array
      if (user.permissions && user.permissions.length > 0) {
        user.permissions.forEach(perm => {
          const module = perm.permission?.module || perm.module;
          const action = perm.permission?.action || perm.action;
          if (module && action) {
            const key = `${module}_${action}`;
            initialPermissions[key] = true;
          }
        });
      }

      setPermissions(initialPermissions);
      
      // Expand all categories initially
      const expanded = {};
      Object.keys(groupedPages).forEach(category => {
        expanded[category] = true;
      });
      setExpandedCategories(expanded);
    }
  }, [user, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      Status: checked ? 'active' : 'inactive'
    }));
  };

  const handleRoleChange = (event, newValue) => {
    setSelectedRole(newValue);
  };

  const handlePermissionChange = (module, action, checked) => {
    const key = `${module}_${action}`;
    setPermissions(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleSelectAllForPage = (module, checked) => {
    const newPermissions = { ...permissions };
    ALL_ACTIONS.forEach(action => {
      const key = `${module}_${action}`;
      newPermissions[key] = checked;
    });
    setPermissions(newPermissions);
  };

  const getPageSelectedCount = (module) => {
    let count = 0;
    ALL_ACTIONS.forEach(action => {
      const key = `${module}_${action}`;
      if (permissions[key]) count++;
    });
    return count;
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Transform permissions to the format expected by the API
  const transformPermissionsToAPIFormat = () => {
    const moduleAccess = {};
    const pageAccess = {};

    ALL_PAGES.forEach(page => {
      const selectedActions = [];
      
      ALL_ACTIONS.forEach(action => {
        const key = `${page.module}_${action}`;
        if (permissions[key]) {
          selectedActions.push(action);
        }
      });

      moduleAccess[page.module] = selectedActions.length > 0;
      
      if (selectedActions.length > 0) {
        pageAccess[page.module] = {
          [page.page]: selectedActions
        };
      }
    });

    return { moduleAccess, pageAccess };
  };

  const prepareRequestData = () => {
    const { moduleAccess, pageAccess } = transformPermissionsToAPIFormat();
    
    return {
      Username: formData.Username.trim(),
      Email: formData.Email.trim(),
      RoleID: selectedRole?._id || '',
      Status: formData.Status,
      moduleAccess: moduleAccess,
      pageAccess: pageAccess
    };
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.Username.trim()) {
      setError('Username is required');
      return;
    }

    if (formData.Username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!formData.Email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const requestData = prepareRequestData();
      
      console.log('Updating user with data:', requestData);

      const response = await axios.patch(`${BASE_URL}/api/users/${user._id}`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.border}`, 
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 700,
              color: COLORS.text.primary
            }}
          >
            Edit User
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
            Modify user details and permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {user?._id && (
            <Chip
              label={`ID: ${user._id.slice(-6)}`}
              size="small"
              sx={{ 
                fontSize: '0.65rem',
                fontWeight: 500,
                height: 20,
                bgcolor: COLORS.background.light,
                color: COLORS.text.secondary
              }}
            />
          )}
          <IconButton onClick={onClose} size="small" disabled={loading}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2, borderRadius: 1.5 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Basic Information Section */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: COLORS.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 2
              }}
            >
              Basic Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  USERNAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="Username"
                  value={formData.Username}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="john_doe"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      bgcolor: COLORS.background.light,
                      fontSize: '0.75rem'
                    }
                  }}
                />
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                  Minimum 3 characters
                </Typography>
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  EMAIL <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="john@example.com"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      bgcolor: COLORS.background.light,
                      fontSize: '0.75rem'
                    }
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  ROLE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  options={roles}
                  loading={loadingRoles}
                  value={selectedRole}
                  onChange={handleRoleChange}
                  getOptionLabel={(option) => option.RoleName || ''}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select a role"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          bgcolor: COLORS.background.light,
                          fontSize: '0.75rem'
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingRoles ? <CircularProgress color="inherit" size={16} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {option.RoleName}
                        </Typography>
                        {option.Description && (
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            {option.Description}
                          </Typography>
                        )}
                      </Box>
                    </li>
                  )}
                />
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  STATUS
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.Status === 'active'}
                        onChange={handleStatusChange}
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
                    label={
                      <Chip
                        label={formData.Status === 'active' ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{ 
                          fontSize: '0.65rem',
                          height: 22,
                          bgcolor: formData.Status === 'active' ? COLORS.chips.active : COLORS.chips.inactive,
                          color: formData.Status === 'active' ? COLORS.primaryDark : COLORS.text.secondary
                        }}
                      />
                    }
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Permissions Section */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: COLORS.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 2
              }}
            >
              User Permissions
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 2, display: 'block' }}>
              Based on role: {selectedRole?.RoleName || 'None selected'} - You can customize permissions below
            </Typography>
            
            <Box sx={{ overflowX: 'auto' }}>
              <TableContainer>
                <Table size="small" sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: '0.7rem',
                          letterSpacing: '0.5px',
                          color: COLORS.text.light,
                          position: 'sticky',
                          left: 0,
                          bgcolor: COLORS.background.tableHeader,
                          zIndex: 1,
                          minWidth: 200
                        }}
                      >
                        Pages / Modules
                      </TableCell>
                      {ALL_ACTIONS.map((action) => (
                        <TableCell 
                          key={action} 
                          align="center"
                          sx={{ 
                            fontWeight: 600, 
                            fontSize: '0.7rem',
                            letterSpacing: '0.5px',
                            color: COLORS.text.light,
                            minWidth: 70
                          }}
                        >
                          {action}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(groupedPages).map(([category, pages]) => (
                      <React.Fragment key={category}>
                        {/* Category Header Row */}
                        <TableRow sx={{ bgcolor: `${COLORS.primary}10` }}>
                          <TableCell 
                            colSpan={ALL_ACTIONS.length + 1}
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: '0.7rem', 
                              color: COLORS.primary,
                              py: 1,
                              cursor: 'pointer'
                            }}
                            onClick={() => toggleCategory(category)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton size="small" sx={{ p: 0 }}>
                                {expandedCategories[category] ? 
                                  <KeyboardArrowDownIcon fontSize="small" /> : 
                                  <KeyboardArrowRightIcon fontSize="small" />
                                }
                              </IconButton>
                              {category}
                            </Box>
                          </TableCell>
                        </TableRow>
                        
                        {/* Pages Rows - Only show if category is expanded */}
                        {expandedCategories[category] && pages.map((page) => {
                          const selectedCount = getPageSelectedCount(page.module);
                          const allSelected = selectedCount === ALL_ACTIONS.length;
                          const someSelected = selectedCount > 0 && selectedCount < ALL_ACTIONS.length;
                          
                          return (
                            <TableRow key={page.module} hover>
                              <TableCell 
                                sx={{ 
                                  fontSize: '0.75rem', 
                                  color: COLORS.text.primary,
                                  position: 'sticky',
                                  left: 0,
                                  bgcolor: COLORS.background.white,
                                  zIndex: 1,
                                  borderRight: `1px solid ${COLORS.border}`,
                                  py: 1.5
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Box>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                      {page.page}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                      {page.module}
                                    </Typography>
                                  </Box>
                                  <Checkbox
                                    size="small"
                                    checked={allSelected}
                                    indeterminate={someSelected}
                                    onChange={(e) => handleSelectAllForPage(page.module, e.target.checked)}
                                    sx={{
                                      color: COLORS.primary,
                                      '&.Mui-checked': {
                                        color: COLORS.primary,
                                      },
                                      '&.MuiCheckbox-indeterminate': {
                                        color: COLORS.primary,
                                      }
                                    }}
                                  />
                                </Box>
                              </TableCell>
                              {ALL_ACTIONS.map((action) => {
                                const isChecked = permissions[`${page.module}_${action}`] || false;
                                return (
                                  <TableCell key={action} align="center" sx={{ p: 1 }}>
                                    <Checkbox
                                      checked={isChecked}
                                      onChange={(e) => handlePermissionChange(page.module, action, e.target.checked)}
                                      size="small"
                                      sx={{
                                        color: COLORS.primary,
                                        '&.Mui-checked': {
                                          color: COLORS.primary,
                                        },
                                        '& .MuiSvgIcon-root': {
                                          fontSize: '1rem'
                                        }
                                      }}
                                    />
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 2.5, 
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`, 
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{
            height: 36,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.75rem',
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
          disabled={loading || !formData.Username.trim() || !formData.Email.trim() || !selectedRole}
          startIcon={loading ? <CircularProgress size={16} /> : <EditIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 36,
            px: 2,
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
        >
          {loading ? 'Updating...' : 'Update User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUser;