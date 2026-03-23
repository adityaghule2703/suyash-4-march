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
  Avatar,
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
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../utils/modulePermissions';

// Import modal components (only for Edit, View and Delete)
import EditUser from './EditUser';
import ViewUser from './ViewUser';
import DeleteUser from './DeleteUser';

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
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
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

// All available actions
const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'IMPORT', 'PRINT', 'APPROVE', 'REJECT'];

// All pages/modules - Updated with all new modules
const ALL_PAGES = [
  // Dashboard
  { module: 'DASHBOARD', page: 'Dashboard', category: 'Dashboard' },
  
  // Administration
  { module: 'USERS', page: 'Users', category: 'Administration' },
  { module: 'ROLES', page: 'Roles', category: 'Administration' },
  
  // Quotation Master - Updated with new modules
  { module: 'COMPANY_MASTER', page: 'Organization / Company', category: 'Quotation Master' },
  { module: 'CUSTOMER_MASTER', page: 'Customer Master', category: 'Quotation Master' },
  { module: 'LEAD_MASTER', page: 'Lead Master', category: 'Quotation Master' },
  { module: 'SUPPLIER_MASTER', page: 'Supplier', category: 'Quotation Master' },
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
  
  // Procurement Master - New Category
  { module: 'GRN_MASTER', page: 'GRN Master', category: 'Procurement Master' },
  { module: 'PURCHASE_ORDER_MASTER', page: 'Purchase Order Master', category: 'Procurement Master' },
  { module: 'PURCHASE_REQUISITION_MASTER', page: 'Purchase Requisition Master', category: 'Procurement Master' },
  { module: 'RFQ_MASTER', page: 'RFQ Master', category: 'Procurement Master' },
  
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

// Permissions Matrix Component
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
const ActionMenu = ({ user, onView, onEdit, onDelete, anchorEl, onClose, onOpen, currentUserPermissions }) => {
  // Check if the current logged-in user has permissions for USERS module
  const canView = hasPermission(currentUserPermissions, MODULES.USERS, PAGES.USERS, ACTIONS.VIEW);
  const canUpdate = hasPermission(currentUserPermissions, MODULES.USERS, PAGES.USERS, ACTIONS.UPDATE);
  const canDelete = hasPermission(currentUserPermissions, MODULES.USERS, PAGES.USERS, ACTIONS.DELETE);

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
              onView(user);
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
              onEdit(user);
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
              onDelete(user);
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

const Users = () => {
  const navigate = useNavigate();
  
  // State for data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedUserForAction, setSelectedUserForAction] = useState(null);
  
  // Modal state
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Selected user
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // User permissions state (current logged-in user's permissions)
  const [currentUserPermissions, setCurrentUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Fetch current user permissions
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
            setCurrentUserPermissions(userData.permissions);
          } else {
            setCurrentUserPermissions([]);
          }
        }
      } catch (err) {
        console.error('Error fetching user permissions:', err);
        setCurrentUserPermissions([]);
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
      currentUserPermissions,
      MODULES.USERS,
      PAGES.USERS,
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

  // Fetch users from API - only if user has permission
  const fetchUsers = useCallback(async () => {
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
      
      const response = await axios.get(`${BASE_URL}/api/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const usersData = response.data.data || [];
        setUsers(usersData);
        setTotalItems(response.data.pagination?.totalItems || usersData.length);
      } else {
        showNotification('Failed to load users', 'error');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      showNotification('Failed to load users. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchUsers();
    }
  }, [fetchUsers, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleRefresh = () => {
    fetchUsers();
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
  
  const handleAddUser = () => {
    if (!canCreate) return;
    navigate('/users/adduser');
  };
  
  const handleEditUser = (updatedUser) => {
    fetchUsers();
    showNotification('User updated successfully!', 'success');
    setOpenEditModal(false);
    setSelectedUser(null);
  };
  
  const handleDeleteUser = (userId) => {
    fetchUsers();
    showNotification('User deleted successfully!', 'success');
  };
  
  const handleActionMenuOpen = (event, user) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedUserForAction(user);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedUserForAction(null);
  };

  const openEditUserModal = (user) => {
    if (!canUpdate) return;
    setSelectedUser(user);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  const openViewUserModal = (user) => {
    if (!canViewPage) return;
    setSelectedUser(user);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  const openDeleteUserDialog = (user) => {
    if (!canDelete) return;
    setSelectedUser(user);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getRoleStyles = (roleName) => {
    const styles = {
      SuperAdmin: {
        bg: '#fee2e2',
        text: '#991b1b',
        border: '#fecaca'
      },
      Admin: {
        bg: '#fef3c7',
        text: '#92400e',
        border: '#fde68a'
      },
      HR: {
        bg: '#fef3c7',
        text: '#92400e',
        border: '#fde68a'
      },
      Employee: {
        bg: '#e0f2fe',
        text: '#0c4a6e',
        border: '#bae6fd'
      },
      default: {
        bg: COLORS.chips.inactive,
        text: COLORS.text.secondary,
        border: COLORS.border
      }
    };
    return styles[roleName] || styles.default;
  };
  
  const getAvatarInitials = (username, employee) => {
    if (employee?.FirstName && employee?.LastName) {
      return `${employee.FirstName.charAt(0)}${employee.LastName.charAt(0)}`.toUpperCase();
    }
    return username ? username.charAt(0).toUpperCase() : 'U';
  };
  
  const getAvatarColor = (username) => {
    if (!username) return COLORS.primary;
    
    const colors = [
      COLORS.primary,
      COLORS.primaryDark,
      '#074346',
      '#0D696C',
      '#128C7E'
    ];
    
    const charCode = username.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  const getEmployeeName = (employee) => {
    if (!employee) return 'No Employee';
    return `${employee.FirstName || ''} ${employee.LastName || ''}`.trim() || 'No Name';
  };
  
  const getEmployeeID = (employee) => {
    if (!employee) return '-';
    return employee.EmployeeID || '-';
  };

  const handleExpandRow = (userId) => {
    setExpandedRow(expandedRow === userId ? null : userId);
  };

  const paginatedUsers = users;

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
          User Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage system users, roles, and access permissions
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
              placeholder="Search users..."
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

          {/* Action Buttons - Only show Add User button if user has create permission */}
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
                onClick={handleAddUser}
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
                Add User
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Users Table */}
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
                <TableCell sx={{ width: 40 }}></TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  User
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Username
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Email
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Role
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Last Login
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  width: 60,
                  color: COLORS.text.light
                }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No users found' : 'No users available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first user to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => {
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedUserForAction?._id === user._id;
                  const avatarColor = getAvatarColor(user.Username);
                  const roleName = user.RoleID?.RoleName || 'Unknown';
                  const roleStyles = getRoleStyles(roleName);
                  const isExpanded = expandedRow === user._id;
                  const userPermissions = user.permissions || [];

                  return (
                    <React.Fragment key={user._id}>
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
                            onClick={() => handleExpandRow(user._id)}
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
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar 
                              sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: avatarColor,
                                fontSize: '0.7rem',
                                fontWeight: 600
                              }}
                            >
                              {getAvatarInitials(user.Username, user.EmployeeID)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                {user.EmployeeID ? getEmployeeName(user.EmployeeID) : user.Username}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                ID: {user._id.slice(-6)}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                            {user.Username}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            Created: {formatDate(user.CreatedAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {user.Email}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            {user.EmployeeID?.Email || 'No employee email'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={roleName}
                            size="small"
                            sx={{ 
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              height: 20,
                              bgcolor: roleStyles.bg,
                              color: roleStyles.text,
                              border: `1px solid ${roleStyles.border}`,
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                          {user.RoleID?.isSuperAdmin && (
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
                            {formatDate(user.LastLogin)}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            Attempts: {user.LoginAttempts || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: 60 }}>
                          <ActionMenu 
                            user={user}
                            onView={openViewUserModal}
                            onEdit={openEditUserModal}
                            onDelete={openDeleteUserDialog}
                            anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                            onClose={handleActionMenuClose}
                            onOpen={(e) => handleActionMenuOpen(e, user)}
                            currentUserPermissions={currentUserPermissions}
                          />
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row with Permissions Matrix */}
                      <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0 }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, bgcolor: COLORS.background.light, borderTop: `1px solid ${COLORS.border}` }}>
                              <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>
                                User Permissions Matrix
                              </Typography>
                              <PermissionsMatrix permissions={userPermissions} />
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
      {selectedUser && (
        <>
          {canUpdate && (
            <EditUser 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedUser(null);
              }}
              user={selectedUser}
              onUpdate={handleEditUser}
            />
          )}

          {canViewPage && (
            <ViewUser 
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedUser(null);
              }}
              user={selectedUser}
              onEdit={() => {
                if (canUpdate) {
                  setOpenViewModal(false);
                  setOpenEditModal(true);
                }
              }}
            />
          )}

          {canDelete && (
            <DeleteUser 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedUser(null);
              }}
              user={selectedUser}
              onDelete={handleDeleteUser}
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

export default Users;