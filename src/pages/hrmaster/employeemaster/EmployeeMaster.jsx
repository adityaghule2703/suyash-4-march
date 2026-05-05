import React, { useState, useEffect } from 'react';
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
  alpha,
  Alert,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmployeeIncrementSummary from './EmployeeIncrementSummary';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, getAllowedActions, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// Import modal components
import AddEmployees from './AddEmployees';
import EditEmployees from './EditEmployees';
import ViewEmployees from './ViewEmployees';
import DeleteEmployees from './DeleteEmployees';

// Color constants - Matching CompanyMaster exactly
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

// Action Menu Component with permission checks
const ActionMenu = ({ employee, onView, onEdit, onDelete, anchorEl, onClose, onOpen, permissions }) => {
  const canView = hasPermission(permissions, MODULES.EMPLOYEE_MASTER, PAGES.EMPLOYEE_REGISTRY, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.EMPLOYEE_MASTER, PAGES.EMPLOYEE_REGISTRY, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.EMPLOYEE_MASTER, PAGES.EMPLOYEE_REGISTRY, ACTIONS.DELETE);

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
              onView(employee);
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
              onEdit(employee);
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
              onDelete(employee);
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

const EmployeeMaster = () => {
  // State for data
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);

  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedEmployeeForAction, setSelectedEmployeeForAction] = useState(null);

  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openIncrementSummaryModal, setOpenIncrementSummaryModal] = useState(false);

  // Selected employee
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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
      MODULES.EMPLOYEE_MASTER,
      PAGES.EMPLOYEE_REGISTRY,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canExport = checkPermission(ACTIONS.EXPORT);
  const canImport = checkPermission(ACTIONS.IMPORT);
  const canPrint = checkPermission(ACTIONS.PRINT);

  // Fetch employees from API
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchEmployees();
    }
  }, [permissionsLoaded, canViewPage, isSuperAdmin]);

 const fetchEmployees = async (showLoader = true) => {
  try {
    if (showLoader) setLoading(true);

    const token = localStorage.getItem('token');

    // ✅ Query Params
    const params = new URLSearchParams();

    params.append('page', page + 1);
    params.append('limit', rowsPerPage);

    if (searchTerm) params.append('search', searchTerm);

    const response = await axios.get(
      `${BASE_URL}/api/employees?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.success) {
      const data = response.data.data || [];

      setEmployees(data);
      setFilteredEmployees(data); // ✅ server-side filtering

    } else {
      showNotification('Failed to load employees', 'error');
    }

  } catch (err) {
    console.error('Error fetching employees:', err);
    showNotification('Failed to load employees. Please try again.', 'error');
  } finally {
    if (showLoader) setLoading(false);
  }
};

  // Handle refresh
  const handleRefresh = () => {
    fetchEmployees();
    showNotification('Data refreshed', 'success');
  };

  // Handle search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = employees.filter(employee =>
      (employee.FirstName && employee.FirstName.toLowerCase().includes(value)) ||
      (employee.LastName && employee.LastName.toLowerCase().includes(value)) ||
      (employee.Email && employee.Email.toLowerCase().includes(value)) ||
      (employee.EmployeeID && employee.EmployeeID.toLowerCase().includes(value)) ||
      (employee.DepartmentID?.DepartmentName && employee.DepartmentID.DepartmentName.toLowerCase().includes(value)) ||
      (employee.DesignationID?.DesignationName && employee.DesignationID.DesignationName.toLowerCase().includes(value))
    );

    setFilteredEmployees(filtered);
    setPage(0);
  };

  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;

    if (event.target.checked) {
      setSelected(filteredEmployees.map(employee => employee._id));
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

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };

  // Handle add employee
  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
    setFilteredEmployees([...filteredEmployees, newEmployee]);
    showNotification('Employee added successfully!', 'success');
  };

  // Handle edit employee
  const handleEditEmployee = (updatedEmployee) => {
    const updatedEmployees = employees.map(employee =>
      employee._id === updatedEmployee._id ? updatedEmployee : employee
    );

    setEmployees(updatedEmployees);
    setFilteredEmployees(updatedEmployees);
    showNotification('Employee updated successfully!', 'success');
  };

  // Handle delete employee
  const handleDeleteEmployee = (employeeId) => {
    const updatedEmployees = employees.filter(employee => employee._id !== employeeId);
    setEmployees(updatedEmployees);
    setFilteredEmployees(updatedEmployees);
    setSelected(selected.filter(id => id !== employeeId));
    showNotification('Employee deleted successfully!', 'success');
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!canDelete) return;

    try {
      const token = localStorage.getItem('token');
      // Assuming you have a bulk delete API endpoint
      const response = await axios.delete(`${BASE_URL}/api/employees/bulk`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data: { employeeIds: selected }
      });

      if (response.data.success) {
        showNotification(`${selected.length} employees deleted successfully!`, 'success');
        fetchEmployees(); // Refresh the list
        setSelected([]); // Clear selection
      } else {
        showNotification('Failed to delete employees', 'error');
      }
    } catch (err) {
      console.error('Error bulk deleting employees:', err);
      showNotification('Failed to delete employees. Please try again.', 'error');
    }
  };


  // Action menu handlers
  const handleActionMenuOpen = (event, employee) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedEmployeeForAction(employee);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedEmployeeForAction(null);
  };

  // Open edit modal
  const openEditEmployeeModal = (employee) => {
    if (!canUpdate) return;
    setSelectedEmployee(employee);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  // Open view modal
  const openViewEmployeeModal = (employee) => {
    if (!canViewPage) return;
    setSelectedEmployee(employee);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  // Open delete confirmation
  const openDeleteEmployeeDialog = (employee) => {
    if (!canDelete) return;
    setSelectedEmployee(employee);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  // Show notification
  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Updated status handling based on schema
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'resigned': return 'default';
      case 'terminated': return 'error';
      case 'retired': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'resigned': return 'Resigned';
      case 'terminated': return 'Terminated';
      case 'retired': return 'Retired';
      default: return status;
    }
  };

  // Get employment type text
  const getEmploymentTypeText = (type) => {
    switch (type) {
      case 'Monthly': return 'Monthly';
      case 'Hourly': return 'Hourly';
      case 'PieceRate': return 'Piece Rate';
      default: return type;
    }
  };

  // Get gender icon
  const getGenderIcon = (gender) => {
    if (gender === 'M') return '👨';
    if (gender === 'F') return '👩';
    return '👤';
  };

  // Get gender text
  const getGenderText = (gender) => {
    if (gender === 'M') return 'Male';
    if (gender === 'F') return 'Female';
    return 'Other';
  };

  // Get avatar initials
  const getAvatarInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  // Get avatar color based on name
  const getAvatarColor = (firstName) => {
    if (!firstName) return COLORS.primary;

    const colors = [
      COLORS.primary,
      COLORS.primaryDark,
      '#074346',
      '#0D696C',
      '#128C7E'
    ];

    const charCode = firstName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Paginated employees
  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          Employee Registery
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize employee information and details
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
              placeholder="Search by name, ID, email or department..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                width: { xs: '100%', sm: 360 },
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

          {/* Action Buttons - Conditionally rendered based on permissions */}
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

            {/* Increment Summary Button - Only show if user has view permission */}
            {canViewPage && (
              <Button
                variant="outlined"
                startIcon={<AssessmentIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenIncrementSummaryModal(true)}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  borderColor: COLORS.border,
                  color: COLORS.text.secondary,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: COLORS.primary,
                    bgcolor: `${COLORS.primary}10`
                  }
                }}
                disabled={loading}
              >
                Increment Summary
              </Button>
            )}

            {/* Add Employee Button - Only show if user has create permission */}
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
                Add Employee
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Employees Table */}
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
                      indeterminate={selected.length > 0 && selected.length < filteredEmployees.length}
                      checked={filteredEmployees.length > 0 && selected.length === filteredEmployees.length}
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
                      disabled={loading || filteredEmployees.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Employee
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Employee ID
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Contact
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Department
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Designation
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Employment Type
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
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading employees...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No employees found' : 'No employees available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first employee to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEmployees.map((employee, index) => {
                  const isSelected = selected.includes(employee._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) &&
                    selectedEmployeeForAction?._id === employee._id;
                  const avatarColor = getAvatarColor(employee.FirstName);

                  return (
                    <TableRow
                      key={employee._id}
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
                            onChange={() => handleSelect(employee._id)}
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
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: avatarColor,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            {getAvatarInitials(employee.FirstName, employee.LastName)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {employee.FirstName} {employee.LastName}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                {getGenderIcon(employee.Gender)} {getGenderText(employee.Gender)}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                • DOB: {formatDate(employee.DateOfBirth)}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                          {employee.EmployeeID}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Joined: {formatDate(employee.DateOfJoining)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {employee.Email}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {employee.Phone || 'No phone'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={employee.DepartmentID?.DepartmentName || 'No Dept'}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            backgroundColor: COLORS.primaryLight,
                            color: COLORS.primary,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {employee.DesignationID?.DesignationName || 'No Designation'}
                        </Typography>
                        {employee.DesignationID?.Level && (
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            Level {employee.DesignationID.Level}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getEmploymentTypeText(employee.EmploymentType)}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu
                          employee={employee}
                          onView={openViewEmployeeModal}
                          onEdit={openEditEmployeeModal}
                          onDelete={openDeleteEmployeeDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, employee)}
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

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredEmployees.length}
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

      {/* Separate Modal Components - Only render if user has appropriate permissions */}
      {canCreate && (
        <AddEmployees
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddEmployee}
        />
      )}

     {selectedEmployee && (
  <>
    {canUpdate && (
      <EditEmployees
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onUpdate={(updatedEmployee) => {  // ✅ CORRECT: updatedEmployee is the parameter
          handleEditEmployee(updatedEmployee);  // ✅ CORRECT: passing the updated employee
          fetchEmployees();
        }}
      />
    )}

    {canViewPage && (
      <ViewEmployees
        open={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onEdit={() => {
          if (canUpdate) {
            setOpenViewModal(false);
            setOpenEditModal(true);
          }
        }}
      />
    )}

    {canDelete && (
      <DeleteEmployees
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onDelete={(employeeId) => {
          handleDeleteEmployee(employeeId);
          fetchEmployees();
        }}
      />
    )}
  </>
)}

      {/* Employee Increment Summary Modal - Only show if user has view permission */}
      {canViewPage && (
        <EmployeeIncrementSummary
          open={openIncrementSummaryModal}
          onClose={() => setOpenIncrementSummaryModal(false)}
        />
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default EmployeeMaster;