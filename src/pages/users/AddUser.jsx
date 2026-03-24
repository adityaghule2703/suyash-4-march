import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
  Chip,
  Breadcrumbs,
  Link,
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
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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

const AddUser = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    RoleID: '',
    Status: 'active'
  });
  
  // Roles data
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Permissions state
  const [permissions, setPermissions] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

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
      setError('Failed to load roles. Please refresh the page.');
    } finally {
      setLoadingRoles(false);
    }
  };

  // Initialize permissions when role is selected
  const initializePermissionsFromRole = (role) => {
    const initialPermissions = {};
    ALL_PAGES.forEach(page => {
      ALL_ACTIONS.forEach(action => {
        const key = `${page.module}_${action}`;
        initialPermissions[key] = false;
      });
    });

    // Fill in permissions from the selected role's pageAccess
    if (role && role.pageAccess) {
      Object.keys(role.pageAccess).forEach(module => {
        const pageData = role.pageAccess[module];
        const pageName = Object.keys(pageData)[0];
        const actions = pageData[pageName] || [];
        
        actions.forEach(action => {
          const key = `${module}_${action}`;
          initialPermissions[key] = true;
        });
      });
    }

    setPermissions(initialPermissions);
    
    // Expand all categories by default
    const expanded = {};
    Object.keys(groupedPages).forEach(category => {
      expanded[category] = true;
    });
    setExpandedCategories(expanded);
  };

  const handleRoleChange = (event, newValue) => {
    setSelectedRole(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        RoleID: newValue._id
      }));
      // Initialize permissions from the selected role
      initializePermissionsFromRole(newValue);
    } else {
      setFormData(prev => ({
        ...prev,
        RoleID: ''
      }));
      // Reset permissions
      const emptyPermissions = {};
      ALL_PAGES.forEach(page => {
        ALL_ACTIONS.forEach(action => {
          const key = `${page.module}_${action}`;
          emptyPermissions[key] = false;
        });
      });
      setPermissions(emptyPermissions);
    }
  };

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

    // Group permissions by module
    ALL_PAGES.forEach(page => {
      const selectedActions = [];
      
      ALL_ACTIONS.forEach(action => {
        const key = `${page.module}_${action}`;
        if (permissions[key]) {
          selectedActions.push(action);
        }
      });

      // Set moduleAccess (true if any permission exists for this module)
      moduleAccess[page.module] = selectedActions.length > 0;
      
      // Set pageAccess (only if there are selected actions)
      if (selectedActions.length > 0) {
        pageAccess[page.module] = {
          [page.page]: selectedActions
        };
      }
    });

    return { moduleAccess, pageAccess };
  };

  const validateForm = () => {
    if (!formData.Username.trim()) {
      setError('Username is required');
      return false;
    }

    if (formData.Username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    if (!formData.Email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.Password) {
      setError('Password is required');
      return false;
    }

    if (formData.Password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(formData.Password)) {
      setError('Password must contain at least one letter, one number, and one special character');
      return false;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.RoleID) {
      setError('Please select a role');
      return false;
    }

    return true;
  };

  const prepareRequestData = () => {
    const { moduleAccess, pageAccess } = transformPermissionsToAPIFormat();
    
    return {
      Username: formData.Username.trim(),
      Email: formData.Email.trim(),
      Password: formData.Password,
      RoleID: formData.RoleID,
      Status: formData.Status,
      moduleAccess: moduleAccess,
      pageAccess: pageAccess
    };
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const requestData = prepareRequestData();
      
      console.log('Sending user data:', requestData);

      const response = await axios.post(`${BASE_URL}/api/auth/register`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccess('User created successfully!');
        setTimeout(() => {
          navigate('/users');
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Page Header with Breadcrumbs */}
      <Box sx={{ mb: 2.5 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link 
            underline="hover" 
            color="inherit" 
            href="/users"
            sx={{ fontSize: '0.75rem', cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault();
              navigate('/users');
            }}
          >
            Users
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
            Add New User
          </Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
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
              Add New User
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Create a new user with specific permissions
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon sx={{ fontSize: '1rem' }} />}
            onClick={() => navigate('/users')}
            sx={{
              height: 36,
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderColor: COLORS.border,
              color: COLORS.text.secondary,
              '&:hover': {
                borderColor: COLORS.primary,
                bgcolor: `${COLORS.primary}10`
              }
            }}
          >
            Back to Users
          </Button>
        </Box>
      </Box>

      {/* Error/Success Alerts */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2, borderRadius: 1.5 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 2, borderRadius: 1.5 }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

      {/* Basic Information Section */}
      <Paper sx={{ 
        mb: 2.5, 
        borderRadius: 2,
        border: `1px solid ${COLORS.border}`,
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.light
        }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
            Basic Information
          </Typography>
        </Box>
        
        <Box sx={{ p: 2.5 }}>
          <Stack spacing={2}>
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

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  PASSWORD <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="Password"
                  type="password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="••••••••"
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
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  CONFIRM PASSWORD <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="ConfirmPassword"
                  type="password"
                  value={formData.ConfirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="••••••••"
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

            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
              Password must be at least 6 characters with letter, number & special character
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                          {option.RoleName}
                        </Typography>
                        {option.Description && (
                          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                            {option.Description}
                          </Typography>
                        )}
                      </Box>
                    </li>
                  )}
                />
                {!loadingRoles && roles.length === 0 && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5 }}>
                    No roles available. Please add roles first.
                  </Typography>
                )}
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  STATUS
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 40 }}>
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
          </Stack>
        </Box>
      </Paper>

      {/* Permissions Section - Only show if a role is selected */}
      {selectedRole && (
        <Paper sx={{ 
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            p: 2, 
            borderBottom: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.background.light,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                User Permissions
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                Based on role: {selectedRole.RoleName} - You can customize permissions below
              </Typography>
            </Box>
            <Chip
              label="Customize permissions for this user"
              size="small"
              sx={{ fontSize: '0.65rem', bgcolor: COLORS.primaryLight, color: COLORS.primary }}
            />
          </Box>
          
          <Box sx={{ p: 2.5, overflowX: 'auto' }}>
            <TableContainer>
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      fontSize: '0.7rem',
                      letterSpacing: '0.5px',
                      color: COLORS.text.light,
                      position: 'sticky',
                      left: 0,
                      bgcolor: COLORS.background.tableHeader,
                      zIndex: 1,
                      minWidth: 200
                    }}>
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
        </Paper>
      )}

      {/* Action Buttons */}
      <Box sx={{ 
        mt: 2.5, 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: 1.5,
        position: 'sticky',
        bottom: 0,
        bgcolor: COLORS.background.white,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        zIndex: 10
      }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/users')}
          disabled={loading}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 500,
            borderColor: COLORS.border,
            color: COLORS.text.secondary,
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
          disabled={loading || !formData.RoleID || !formData.Username.trim() || !formData.Email.trim() || !formData.Password}
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 36,
            px: 3,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            }
          }}
        >
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddUser;