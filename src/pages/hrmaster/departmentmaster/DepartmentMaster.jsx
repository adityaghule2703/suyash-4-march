import React, { useState, useEffect } from "react";
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
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import { hasPermission, ACTIONS, MODULES, PAGES } from "../../../utils/modulePermissions";

// Import modal components
import AddDepartments from "./AddDepartments";
import EditDepartments from "./EditDepartments";
import ViewDepartments from "./ViewDepartments";
import DeleteDepartments from "./DeleteDepartments";

// Color constants - Single color #063C3F throughout
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
const ActionMenu = ({ department, onView, onEdit, onDelete, anchorEl, onClose, onOpen, permissions }) => {
  const canView = hasPermission(permissions, MODULES.DEPARTMENT_MASTER, PAGES.DEPARTMENT_MASTER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.DEPARTMENT_MASTER, PAGES.DEPARTMENT_MASTER, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.DEPARTMENT_MASTER, PAGES.DEPARTMENT_MASTER, ACTIONS.DELETE);

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
              onView(department);
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
              onEdit(department);
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
              onDelete(department);
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

const DepartmentMaster = () => {
  // State for data
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedDepartmentForAction, setSelectedDepartmentForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Selected department
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
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
      MODULES.DEPARTMENT_MASTER,
      PAGES.DEPARTMENT_MASTER,
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

  // Fetch departments from API - only if user has permission
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchDepartments();
    }
  }, [permissionsLoaded, canViewPage, isSuperAdmin]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/departments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Ensure each department has all required fields with consistent naming
        const formattedData = (response.data.data || []).map(dept => ({
          _id: dept._id || dept.id,
          DepartmentName: dept.DepartmentName || dept.departmentName || dept.name || '',
          Description: dept.Description || dept.description || '',
          CreatedAt: dept.CreatedAt || dept.createdAt || dept.created_at || new Date().toISOString(),
          UpdatedAt: dept.UpdatedAt || dept.updatedAt || dept.updated_at || new Date().toISOString()
        }));
        
        setDepartments(formattedData);
        setFilteredDepartments(formattedData);
      } else {
        showNotification('Failed to load departments', 'error');
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      showNotification('Failed to load departments. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search (client-side filtering)
  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredDepartments(departments);
      return;
    }
    
    const value = searchTerm.toLowerCase();
    const filtered = departments.filter(department =>
      department.DepartmentName?.toLowerCase().includes(value) ||
      (department.Description && department.Description.toLowerCase().includes(value))
    );
    
    setFilteredDepartments(filtered);
  };

  // Apply search when searchTerm changes
  useEffect(() => {
    handleSearch();
  }, [searchTerm, departments]);
  
  // Handle select all - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(filteredDepartments.map(department => department._id));
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
  
  // Handle add department
  const handleAddDepartment = (newDepartment) => {
    console.log("NEW:", newDepartment);

    let departmentData = newDepartment;

    // Normalize API response
    if (newDepartment.data) departmentData = newDepartment.data;
    if (newDepartment.success && newDepartment.department) {
      departmentData = newDepartment.department;
    }

    const formattedDepartment = {
      _id: departmentData._id || Date.now().toString(),
      DepartmentName:
        departmentData.DepartmentName ||
        departmentData.departmentName ||
        departmentData.name ||
        "",
      Description:
        departmentData.Description ||
        departmentData.description ||
        "",
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };

    // Use functional update
    setDepartments((prev) => {
      const updated = [formattedDepartment, ...prev];
      setFilteredDepartments(updated);
      return updated;
    });

    // Reset search properly
    setSearchInput("");
    setSearchTerm("");

    // Go to first page
    setPage(0);

    showNotification("Department added successfully!", "success");
  };
  
  // Handle edit department
  const handleEditDepartment = (updatedDepartment) => {
    const updatedDepartments = departments.map(department =>
      department._id === updatedDepartment._id ? updatedDepartment : department
    );
    
    setDepartments(updatedDepartments);
    setFilteredDepartments(updatedDepartments);
    showNotification('Department updated successfully!', 'success');
  };
  
  // Handle delete department
  const handleDeleteDepartment = (departmentId) => {
    const updatedDepartments = departments.filter(department => department._id !== departmentId);
    setDepartments(updatedDepartments);
    setFilteredDepartments(updatedDepartments);
    setSelected(selected.filter(id => id !== departmentId));
    showNotification('Department deleted successfully!', 'success');
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (!canDelete) return;
    showNotification('Bulk delete requires API implementation', 'warning');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, department) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedDepartmentForAction(department);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedDepartmentForAction(null);
  };
  
  // Open edit modal
  const openEditDepartmentModal = (department) => {
    if (!canUpdate) return;
    setSelectedDepartment(department);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  // Open view modal
  const openViewDepartmentModal = (department) => {
    if (!canViewPage) return;
    setSelectedDepartment(department);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteDepartmentDialog = (department) => {
    if (!canDelete) return;
    setSelectedDepartment(department);
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
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return '-';
    }
  };
  
  // Get department initials for avatar
  const getDepartmentInitials = (departmentName) => {
    if (!departmentName) return 'D';
    
    const words = departmentName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return departmentName.substring(0, 2).toUpperCase();
  };
  
  // Get avatar color based on department name
  const getAvatarColor = (departmentName) => {
    if (!departmentName) return COLORS.primary;
    
    const colors = [
      COLORS.primary,
      COLORS.primaryDark,
      '#074346',
      '#0D696C',
      '#128C7E'
    ];
    
    const charCode = departmentName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  
  // Paginated departments
  const paginatedDepartments = filteredDepartments.slice(
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
          Department Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize department information and details
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
              placeholder="Search by department name or description..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
            
            {/* Add Department Button - Only show if user has create permission */}
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
                Add Department
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Departments Table */}
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
                      indeterminate={selected.length > 0 && selected.length < filteredDepartments.length}
                      checked={filteredDepartments.length > 0 && selected.length === filteredDepartments.length}
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
                      disabled={loading || filteredDepartments.length === 0}
                    />
                  </TableCell>
                )}
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
                  Description
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Created At
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Last Updated
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
                  <TableCell colSpan={canDelete ? 7 : 6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading departments...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 7 : 6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No departments found' : 'No departments available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first department to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDepartments.map((department, index) => {
                  const isSelected = selected.includes(department._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedDepartmentForAction?._id === department._id;
                  const avatarColor = getAvatarColor(department.DepartmentName);

                  return (
                    <TableRow
                      key={department._id || index}
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
                            onChange={() => handleSelect(department._id)}
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
                            {getDepartmentInitials(department.DepartmentName)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {department.DepartmentName}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          sx={{ 
                            fontSize: '0.75rem', 
                            color: COLORS.text.secondary,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            maxWidth: 300
                          }}
                        >
                          {department.Description || 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDate(department.CreatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDate(department.UpdatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          department={department}
                          onView={openViewDepartmentModal}
                          onEdit={openEditDepartmentModal}
                          onDelete={openDeleteDepartmentDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, department)}
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
          count={filteredDepartments.length}
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

      {/* Modal Components - Only render modals if user has appropriate permissions */}
      {canCreate && (
        <AddDepartments 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddDepartment}
        />
      )}

      {selectedDepartment && (
        <>
          {canUpdate && (
            <EditDepartments 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedDepartment(null);
              }}
              department={selectedDepartment}
              onUpdate={handleEditDepartment}
            />
          )}

          {canViewPage && (
            <ViewDepartments 
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedDepartment(null);
              }}
              department={selectedDepartment}
              onEdit={() => {
                if (canUpdate) {
                  setOpenViewModal(false);
                  setOpenEditModal(true);
                }
              }}
            />
          )}

          {canDelete && (
            <DeleteDepartments 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedDepartment(null);
              }}
              department={selectedDepartment}
              onDelete={handleDeleteDepartment}
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

export default DepartmentMaster;