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
  Stack,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Collapse,
  Checkbox
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../config/Config';
import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../utils/modulePermissions';

// Import the separate modal components (keeping for edit/view/delete)
import EditRoles from './EditRoles';
import ViewRoles from './ViewRoles';
import DeleteRoles from './DeleteRoles';

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
    lightMuted: 'rgba(255, 255, 255, 0.9)'
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

// All available actions from your permission catalog
const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'IMPORT', 'PRINT', 'APPROVE', 'REJECT'];

// All pages/modules from your permission catalog - Updated with all Sales Order pages
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
  
  // Procurement Master
  { module: 'SUPPLIER_MASTER', page: 'Supplier', category: 'Procurement Master' },
  { module: 'PURCHASE_REQUISITION_MASTER', page: 'Purchase Requisition Master', category: 'Procurement Master' },
  { module: 'RFQ_MASTER', page: 'RFQ Master', category: 'Procurement Master' },
  { module: 'PURCHASE_ORDER_MASTER', page: 'Purchase Order Master', category: 'Procurement Master' },
  { module: 'GRN_MASTER', page: 'GRN Master', category: 'Procurement Master' },
  { module: 'PURCHASE_INVOICE_MASTER', page: 'Purchase Invoice Master', category: 'Procurement Master' },
  
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
  
  // BOM Master
  { module: 'BOM_MASTER', page: 'BOM Master', category: 'BOM Master' },
  
  // Sales Order Master - All Sales Order Pages
  { module: 'SALES_ORDER_MASTER', page: 'Sales Order Master', category: 'Sales Order Master' },
  { module: 'ORDER_BOOK', page: 'Order Book', category: 'Sales Order Master' },
  { module: 'SO_REVISION', page: 'SO Revision', category: 'Sales Order Master' },
  { module: 'SO_SUMMARY', page: 'SO Summary', category: 'Sales Order Master' },
  { module: 'SO_PENDING_DELIVERY', page: 'SO Pending Delivery', category: 'Sales Order Master' },
  
  // Reports
  { module: 'REPORTS', page: 'Recruitment Report', category: 'Reports' },
  { module: 'REPORTS', page: 'Employee Report', category: 'Reports' },
  { module: 'REPORTS', page: 'Interview Report', category: 'Reports' }
];

// Permissions Matrix Component - Displayed in expanded row
const PermissionsMatrix = ({ permissions = [] }) => {
  // Create a map for quick lookup of permissions
  const permissionMap = React.useMemo(() => {
    const map = {};
    permissions.forEach(perm => {
      const module = perm.permission?.module || perm.module;
      const action = perm.permission?.action || perm.action;
      const key = `${module}_${action}`;
      map[key] = true;
    });
    return map;
  }, [permissions]);

  const isPermissionChecked = (module, action) => {
    const key = `${module}_${action}`;
    return !!permissionMap[key];
  };

  // Group pages by category
  const groupedPages = ALL_PAGES.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {});

  return (
    <Box sx={{ overflowX: 'auto' }}>
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
                    borderBottom: `1px solid ${COLORS.border}`
                  }}
                >
                  {category}
                </TableCell>
              </TableRow>
              
              {/* Pages Rows */}
              {pages.map((page) => (
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
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        {page.page}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        {page.module}
                      </Typography>
                    </Box>
                  </TableCell>
                  {ALL_ACTIONS.map((action) => {
                    const isChecked = isPermissionChecked(page.module, action);
                    return (
                      <TableCell key={action} align="center" sx={{ p: 1 }}>
                        <Checkbox
                          checked={isChecked}
                          disabled
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
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

// Action Menu Component with permission checks
const ActionMenu = ({ role, onView, onEdit, onDelete, anchorEl, onClose, onOpen, permissions }) => {
  const canView = hasPermission(permissions, MODULES.ROLES, PAGES.ROLES, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.ROLES, PAGES.ROLES, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.ROLES, PAGES.ROLES, ACTIONS.DELETE);

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
              onView(role);
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
              onEdit(role);
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
        
        {(canView || canUpdate) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
        
        {canDelete && (
          <MenuItem 
            onClick={() => {
              onDelete(role);
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

const Roles = () => {
  const navigate = useNavigate();
  
  // State for data
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredRoles, setFilteredRoles] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRoleForAction, setSelectedRoleForAction] = useState(null);
  
  // Modal state (only for edit/view/delete)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Selected role
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Notification state
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
      MODULES.ROLES,
      PAGES.ROLES,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filter roles based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRoles(roles);
    } else {
      const filtered = roles.filter(role => 
        role.RoleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.Description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoles(filtered);
    }
    setPage(0);
  }, [roles, searchTerm]);

  // Fetch roles from API - only if user has permission
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/api/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const rolesData = response.data.data || response.data.roles || [];
        setRoles(rolesData);
        setFilteredRoles(rolesData);
      } else {
        showNotification('Failed to load roles', 'error');
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
      showNotification('Failed to load roles. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchRoles();
    }
  }, [fetchRoles, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleRefresh = () => {
    fetchRoles();
    showNotification('Data refreshed', 'success');
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setExpandedRow(null);
  };
  
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setExpandedRow(null);
  };
  
  const handleAddRole = () => {
    if (!canCreate) return;
    // Navigate to add role page instead of opening modal
    navigate('/roles/add');
  };
  
  const handleEditRole = (updatedRole) => {
    fetchRoles();
    showNotification('Role updated successfully!', 'success');
  };
  
  const handleDeleteRole = (roleId) => {
    fetchRoles();
    showNotification('Role deleted successfully!', 'success');
  };
  
  const handleActionMenuOpen = (event, role) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRoleForAction(role);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRoleForAction(null);
  };

  const openEditRoleModal = (role) => {
    if (!canUpdate) return;
    setSelectedRole(role);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  const openViewRoleModal = (role) => {
    if (!canViewPage) return;
    setSelectedRole(role);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteRoleDialog = (role) => {
    if (!canDelete) return;
    setSelectedRole(role);
    setOpenDeleteDialog(true);
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
  
  const getStatusChip = (isActive) => {
    if (isActive) {
      return {
        label: 'Active',
        bg: COLORS.chips.active,
        text: COLORS.primaryDark,
        icon: <CheckCircleIcon sx={{ fontSize: '0.75rem', color: COLORS.primaryDark }} />
      };
    }
    return {
      label: 'Inactive',
      bg: COLORS.chips.inactive,
      text: COLORS.text.secondary,
      icon: <CancelIcon sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }} />
    };
  };

  const getPaginatedData = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredRoles.slice(startIndex, endIndex);
  };

  const paginatedRoles = getPaginatedData();

  const handleExpandRow = (roleId) => {
    setExpandedRow(expandedRow === roleId ? null : roleId);
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
          Roles Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize user roles and permissions
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
          {/* Search */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by role name or description..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 320 },
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

          {/* Action Buttons - Only show Add Role button if user has create permission */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Refresh">
              <IconButton 
                onClick={handleRefresh} 
                disabled={loading}
                sx={{
                  color: COLORS.text.secondary,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}20`
                  }
                }}
              >
                <RefreshIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleAddRole}
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
                Add Role
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Roles Table */}
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
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px'
                }
              }}>
                <TableCell sx={{ width: 40 }}></TableCell>
                <TableCell>Role Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Permissions Count</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell align="center" sx={{ width: 60 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading roles...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No roles found' : 'No roles available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first role to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRoles.map((role) => {
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedRoleForAction?._id === role._id;
                  const statusChip = getStatusChip(role.IsActive);
                  const isExpanded = expandedRow === role._id;

                  return (
                    <React.Fragment key={role._id}>
                      <TableRow
                        hover
                        sx={{ 
                          bgcolor: COLORS.background.white,
                          '&:hover': {
                            bgcolor: COLORS.background.hover
                          },
                          '& .MuiTableCell-root': {
                            py: 1.5,
                            fontSize: '0.75rem',
                            borderColor: COLORS.border
                          }
                        }}
                      >
                        <TableCell sx={{ width: 40 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleExpandRow(role._id)}
                            sx={{
                              color: COLORS.text.secondary,
                              '&:hover': {
                                bgcolor: `${COLORS.primary}20`
                              }
                            }}
                          >
                            {isExpanded ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                            {role.RoleName}
                          </Typography>
                          {role.isSuperAdmin && (
                            <Chip
                              label="Super Admin"
                              size="small"
                              sx={{
                                fontSize: '0.6rem',
                                height: 18,
                                mt: 0.5,
                                bgcolor: COLORS.chips.active,
                                color: COLORS.primaryDark
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {role.Description || 'No description provided'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={role.permissionsCount || role.permissions?.length || 0}
                            size="small"
                            sx={{ 
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              height: 22,
                              minWidth: 32,
                              bgcolor: COLORS.primaryLight,
                              color: COLORS.primary
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={statusChip.icon}
                            label={statusChip.label}
                            size="small"
                            sx={{ 
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              height: 22,
                              bgcolor: statusChip.bg,
                              color: statusChip.text,
                              '& .MuiChip-icon': {
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {formatDate(role.CreatedAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: 60 }}>
                          <ActionMenu 
                            role={role}
                            onView={openViewRoleModal}
                            onEdit={openEditRoleModal}
                            onDelete={openDeleteRoleDialog}
                            anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                            onClose={handleActionMenuClose}
                            onOpen={(e) => handleActionMenuOpen(e, role)}
                            permissions={userPermissions}
                          />
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row with Permissions Matrix */}
                      <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0 }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, bgcolor: COLORS.background.light, borderTop: `1px solid ${COLORS.border}` }}>
                              <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>
                                Permissions Matrix
                              </Typography>
                              <PermissionsMatrix permissions={role.permissions || []} />
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredRoles.length}
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

      {/* Modal Components - Only for Edit, View, Delete - Only render if user has appropriate permissions */}
      {selectedRole && (
        <>
          {canUpdate && (
            <EditRoles 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedRole(null);
              }}
              role={selectedRole}
              onUpdate={handleEditRole}
            />
          )}

          {canViewPage && (
            <ViewRoles 
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedRole(null);
              }}
              role={selectedRole}
              onEdit={() => {
                if (canUpdate) {
                  setOpenViewModal(false);
                  setOpenEditModal(true);
                }
              }}
            />
          )}

          {canDelete && (
            <DeleteRoles 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedRole(null);
              }}
              role={selectedRole}
              onDelete={handleDeleteRole}
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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '& .MuiAlert-icon': {
              fontSize: '1.25rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Roles;