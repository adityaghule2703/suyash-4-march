import React, { useState } from 'react';
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
  Checkbox
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
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

// All pages/modules from your permission catalog - Complete with all modules
const ALL_PAGES = [
  // Dashboard
  { module: 'DASHBOARD', page: 'Dashboard', category: 'Dashboard' },
  
  // Administration
  { module: 'USERS', page: 'Users', category: 'Administration' },
  { module: 'ROLES', page: 'Roles', category: 'Administration' },
  
  // Quotation Master
  { module: 'COMPANY_MASTER', page: 'Organization / Company', category: 'Quotation Master' },
  { module: 'CUSTOMER_MASTER', page: 'Customer Master', category: 'Quotation Master' },
  { module: 'LEAD_MASTER', page: 'Lead Master', category: 'Quotation Master' },
  { module: 'SUPPLIER_MASTER', page: 'Supplier', category: 'Quotation Master' },
  { module: 'TAX_MASTER', page: 'Tax Configuration / Tax Rule', category: 'Quotation Master' },
  { module: 'TERMS_CONDITIONS_MASTER', page: 'Terms And Conditions', category: 'Quotation Master' },
  { module: 'ITEM_MASTER', page: 'Product / Item Catalog', category: 'Quotation Master' },
  { module: 'PROCESS_MASTER', page: 'Manufacturing Process', category: 'Quotation Master' },
  { module: 'DIMENSION_MASTER', page: 'Product Specifications', category: 'Quotation Master' },
  { module: 'MATERIAL_MASTER', page: 'Material Catalog', category: 'Quotation Master' },
  { module: 'RAW_MATERIAL_MASTER', page: 'Raw Material', category: 'Quotation Master' },
  { module: 'QUOTATION_MASTER', page: 'Quotation', category: 'Quotation Master' },
  { module: 'COSTING_MASTER', page: 'Costing Master', category: 'Quotation Master' },
  { module: 'OPERATION_MASTER', page: 'Operation Master', category: 'Quotation Master' },
  { module: 'PROCESS_DETAILS_MASTER', page: 'Process Details Master', category: 'Quotation Master' },
  { module: 'COMPANY_FINANCIAL_MASTER', page: 'Company Financial Master', category: 'Quotation Master' },
  
  // Procurement Master
  { module: 'GRN_MASTER', page: 'GRN Master', category: 'Procurement Master' },
  { module: 'PURCHASE_ORDER_MASTER', page: 'Purchase Order Master', category: 'Procurement Master' },
  { module: 'PURCHASE_REQUISITION_MASTER', page: 'Purchase Requisition Master', category: 'Procurement Master' },
  { module: 'RFQ_MASTER', page: 'RFQ Master', category: 'Procurement Master' },
  { module: 'PURCHASE_INVOICE_MASTER', page: 'Purchase Invoice Master', category: 'Procurement Master' },
  { module: 'VENDOR_PAYMENTS', page: 'Vendor Payments', category: 'Procurement Master' },
  
  // HR Master
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
  { module: 'TRAINING_RECORD_MASTER', page: 'Training Record Master', category: 'HR Master' },
  { module: 'LEAVE_APPROVAL', page: 'Leave Approval', category: 'HR Master' },
  
  // BOM Master - All BOM pages
  { module: 'BOM_MASTER', page: 'BOM Master', category: 'BOM Master' },
  { module: 'BOM_MASTER', page: 'MRP Master', category: 'BOM Master' },
  { module: 'BOM_MASTER', page: 'Routing Master', category: 'BOM Master' },
  { module: 'BOM_MASTER', page: 'Machine Master', category: 'BOM Master' },
  { module: 'BOM_MASTER', page: 'OEE Master', category: 'BOM Master' },
  
  // Sales Order Master - All Sales Order Pages
  { module: 'SALES_ORDER_MASTER', page: 'Sales Order Master', category: 'Sales Order Master' },
  { module: 'ORDER_BOOK', page: 'Order Book', category: 'Sales Order Master' },
  { module: 'SO_REVISION', page: 'SO Revision', category: 'Sales Order Master' },
  { module: 'SO_SUMMARY', page: 'SO Summary', category: 'Sales Order Master' },
  { module: 'SO_PENDING_DELIVERY', page: 'SO Pending Delivery', category: 'Sales Order Master' },
  
  // Production Master
  { module: 'WORK_ORDERS', page: 'Work Orders Master', category: 'Production Master' },
  { module: 'ASSEMBLY_LINES', page: 'Assembly Lines', category: 'Production Master' },
  { module: 'PRODUCTION_SCHEDULE', page: 'Production Schedule', category: 'Production Master' },
  { module: 'PRODUCTION_CONFLICT', page: 'Production Conflict', category: 'Production Master' },
  { module: 'TOOL_MASTER', page: 'Tool Master', category: 'Production Master' },
  
  // Inventory Management - All Inventory pages
  { module: 'INVENTORY_MANAGEMENT', page: 'Warehouse Master', category: 'Inventory Management' },
  { module: 'INVENTORY_MANAGEMENT', page: 'Stock Ledger', category: 'Inventory Management' },
  { module: 'INVENTORY_MANAGEMENT', page: 'MIV Master (Material Issue Voucher)', category: 'Inventory Management' },
  { module: 'INVENTORY_MANAGEMENT', page: 'MRV Master (Material Receipt Voucher)', category: 'Inventory Management' },
  { module: 'INVENTORY_MANAGEMENT', page: 'PSV Master (Physical Stock Verification)', category: 'Inventory Management' },
  
  // Dispatch Master
  { module: 'DISPATCH_MASTER', page: 'Delivery Challan', category: 'Dispatch Master' },
  { module: 'DELIVERY_SCHEDULE', page: 'Delivery Schedule', category: 'Dispatch Master' },
  { module: 'CUSTOMER_RETURNS', page: 'Customer Returns', category: 'Dispatch Master' },
  
  // Inspection Master
  { module: 'GAUGE_MASTER', page: 'Gauge Master', category: 'Inspection Master' },
  { module: 'INSPECTION_PLAN_MASTER', page: 'Inspection Plan', category: 'Inspection Master' },
  { module: 'INSPECTION_RECORD_MASTER', page: 'Inspection Record', category: 'Inspection Master' },
  { module: 'DEFECT_CODE_MASTER', page: 'Defect Code Master', category: 'Inspection Master' },
  { module: 'NCR_MASTER', page: 'NCR (Non-Conformance Report)', category: 'Inspection Master' },
  { module: 'NCR_TREND_ANALYSIS', page: 'NCR Trend Analysis', category: 'Inspection Master' },
  { module: 'CAPA_MASTER', page: 'CAPA (Corrective Action Preventive Action)', category: 'Inspection Master' },
  { module: 'QUALITY_CERTIFICATE_MASTER', page: 'Quality Certificate', category: 'Inspection Master' },
  
  // Reports Master
  { module: 'INVOICE_REPORT', page: 'Invoice Report', category: 'Reports Master' },
  { module: 'PAYMENT_RECEIPT', page: 'Payment Receipt', category: 'Reports Master' },
  { module: 'CUSTOMER_ADVANCE', page: 'Customer Advance', category: 'Reports Master' },
  { module: 'AR_AGING', page: 'AR Aging', category: 'Reports Master' },
  { module: 'TDS_RECONCILIATION', page: 'TDS Reconciliation', category: 'Reports Master' },
  { module: 'CREDIT_NOTE', page: 'Credit Note', category: 'Reports Master' },
  { module: 'GSTR1_DATA', page: 'GSTR-1 Data', category: 'Reports Master' },
  { module: 'GSTR3B_DATA', page: 'GSTR-3B Data', category: 'Reports Master' },
  { module: 'MONTHLY_REVENUE_REPORT', page: 'Monthly Revenue Report', category: 'Reports Master' },
  
  // Legacy Reports
  { module: 'REPORTS', page: 'Recruitment Report', category: 'Reports' },
  { module: 'REPORTS', page: 'Employee Report', category: 'Reports' },
  { module: 'REPORTS', page: 'Interview Report', category: 'Reports' }
];

const AddRoles = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    RoleName: '',
    Description: '',
    IsActive: true,
    isSuperAdmin: false
  });
  
  // Permissions state
  const [permissions, setPermissions] = useState({});

  // Helper function to generate unique permission key
  const getPermissionKey = (module, page) => {
    return `${module}_${page}`;
  };

  // Initialize permissions map - FIXED: Use page-specific keys
  React.useEffect(() => {
    const initialPermissions = {};
    ALL_PAGES.forEach(page => {
      ALL_ACTIONS.forEach(action => {
        const key = `${getPermissionKey(page.module, page.page)}_${action}`;
        initialPermissions[key] = false;
      });
    });
    setPermissions(initialPermissions);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // FIXED: Now includes page parameter
  const handlePermissionChange = (module, page, action, checked) => {
    const key = `${getPermissionKey(module, page)}_${action}`;
    setPermissions(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  // FIXED: Select all actions for a specific page only
  const handleSelectAllForPage = (module, page, checked) => {
    const newPermissions = { ...permissions };
    ALL_ACTIONS.forEach(action => {
      const key = `${getPermissionKey(module, page)}_${action}`;
      newPermissions[key] = checked;
    });
    setPermissions(newPermissions);
  };

  // FIXED: Get count for specific page
  const getPageSelectedCount = (module, page) => {
    let count = 0;
    ALL_ACTIONS.forEach(action => {
      const key = `${getPermissionKey(module, page)}_${action}`;
      if (permissions[key]) count++;
    });
    return count;
  };

  // Transform permissions to the format expected by the API - FIXED: Include page information
  const transformPermissionsToAPIFormat = () => {
    const moduleAccess = {};
    const pageAccess = {};

    // Group permissions by module and page
    ALL_PAGES.forEach(page => {
      const selectedActions = [];
      
      ALL_ACTIONS.forEach(action => {
        const key = `${getPermissionKey(page.module, page.page)}_${action}`;
        if (permissions[key]) {
          selectedActions.push(action);
        }
      });

      // Set moduleAccess (true if any permission exists for any page in this module)
      if (selectedActions.length > 0) {
        moduleAccess[page.module] = true;
      } else if (moduleAccess[page.module] !== true) {
        moduleAccess[page.module] = false;
      }
      
      // Set pageAccess with specific page permissions
      if (selectedActions.length > 0) {
        if (!pageAccess[page.module]) {
          pageAccess[page.module] = {};
        }
        pageAccess[page.module][page.page] = selectedActions;
      }
    });

    return { moduleAccess, pageAccess };
  };

  const prepareRequestData = () => {
    const { moduleAccess, pageAccess } = transformPermissionsToAPIFormat();
    
    return {
      RoleName: formData.RoleName.trim(),
      Description: formData.Description.trim(),
      IsActive: formData.IsActive,
      isSuperAdmin: formData.isSuperAdmin,
      moduleAccess: moduleAccess,
      pageAccess: pageAccess
    };
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.RoleName.trim()) {
      setError('Role name is required');
      return;
    }

    if (formData.RoleName.trim().length < 2) {
      setError('Role name must be at least 2 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const requestData = prepareRequestData();
      
      console.log('Sending data to API:', requestData); // For debugging

      const response = await axios.post(`${BASE_URL}/api/roles`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccess('Role created successfully!');
        setTimeout(() => {
          navigate('/roles');
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to create role');
      }
    } catch (err) {
      console.error('Error creating role:', err);
      setError(err.response?.data?.message || 'Failed to create role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Group pages by category
  const groupedPages = ALL_PAGES.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {});

  // Define category order for consistent display
  const categoryOrder = [
    'Dashboard',
    'Administration',
    'Quotation Master',
    'Procurement Master',
    'HR Master',
    'BOM Master',
    'Sales Order Master',
    'Production Master',
    'Inventory Management',
    'Dispatch Master',
    'Inspection Master',
    'Reports Master',
    'Reports'
  ];

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Page Header with Breadcrumbs */}
      <Box sx={{ mb: 2.5 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link 
            underline="hover" 
            color="inherit" 
            href="/roles"
            sx={{ fontSize: '0.75rem', cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault();
              navigate('/roles');
            }}
          >
            Roles
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
            Add New Role
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
              Add New Role
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Create a new role with specific permissions
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon sx={{ fontSize: '1rem' }} />}
            onClick={() => navigate('/roles')}
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
            Back to Roles
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
                  ROLE NAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="RoleName"
                  value={formData.RoleName}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="e.g., HR Manager, Admin, Employee"
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
                  Minimum 2 characters, unique role name
                </Typography>
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  STATUS
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', height: 40 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.IsActive}
                        onChange={handleInputChange}
                        name="IsActive"
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
                        label={formData.IsActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{ 
                          fontSize: '0.65rem',
                          height: 22,
                          bgcolor: formData.IsActive ? COLORS.chips.active : COLORS.chips.inactive,
                          color: formData.IsActive ? COLORS.primaryDark : COLORS.text.secondary
                        }}
                      />
                    }
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isSuperAdmin}
                        onChange={handleInputChange}
                        name="isSuperAdmin"
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
                        label="Super Admin"
                        size="small"
                        sx={{ 
                          fontSize: '0.65rem',
                          height: 22,
                          bgcolor: formData.isSuperAdmin ? COLORS.chips.active : COLORS.chips.inactive,
                          color: formData.isSuperAdmin ? COLORS.primaryDark : COLORS.text.secondary
                        }}
                      />
                    }
                  />
                </Box>
              </Box>
            </Box>
            
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                DESCRIPTION
              </Typography>
              <TextField
                fullWidth
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                multiline
                rows={3}
                disabled={loading}
                placeholder="Enter role description and responsibilities..."
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
          </Stack>
        </Box>
      </Paper>

      {/* Permissions Section */}
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
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
            Module Permissions
          </Typography>
          <Chip
            label="Select permissions for this role"
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
                {categoryOrder.map((category) => {
                  const pages = groupedPages[category];
                  if (!pages || pages.length === 0) return null;
                  
                  return (
                    <React.Fragment key={category}>
                      {/* Category Header Row */}
                      <TableRow sx={{ bgcolor: `${COLORS.primary}10` }}>
                        <TableCell 
                          colSpan={ALL_ACTIONS.length + 1}
                          sx={{ 
                            fontWeight: 600, 
                            fontSize: '0.7rem', 
                            color: COLORS.primary,
                            py: 1
                          }}
                        >
                          {category}
                        </TableCell>
                      </TableRow>
                      
                      {/* Pages Rows */}
                      {pages.map((page) => {
                        const selectedCount = getPageSelectedCount(page.module, page.page);
                        const allSelected = selectedCount === ALL_ACTIONS.length;
                        const someSelected = selectedCount > 0 && selectedCount < ALL_ACTIONS.length;
                        
                        return (
                          <TableRow key={`${page.module}_${page.page}`} hover>
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
                                  onChange={(e) => handleSelectAllForPage(page.module, page.page, e.target.checked)}
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
                              const key = `${page.module}_${page.page}_${action}`;
                              const isChecked = permissions[key] || false;
                              return (
                                <TableCell key={action} align="center" sx={{ p: 1 }}>
                                  <Checkbox
                                    checked={isChecked}
                                    onChange={(e) => handlePermissionChange(page.module, page.page, action, e.target.checked)}
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

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
          onClick={() => navigate('/roles')}
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
          disabled={loading || !formData.RoleName.trim()}
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
          {loading ? 'Creating...' : 'Create Role'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddRoles;