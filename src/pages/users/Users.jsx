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
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

// Import modal components
import AddUser from './AddUser';
import EditUser from './EditUser';
import ViewUser from './ViewUser';
import DeleteUser from './DeleteUser';

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

// Action Menu Component
const ActionMenu = ({ user, onView, onEdit, onDelete, anchorEl, onClose, onOpen }) => {
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
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
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
      </Menu>
    </>
  );
};

const Users = () => {
  // State for data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to 5 rows per page
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedUserForAction, setSelectedUserForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
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

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users from API with pagination
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page + 1, // API uses 1-based pagination
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
        const { users: usersData, pagination } = response.data.data;
        setUsers(usersData || []);
        setTotalItems(pagination.totalItems);
        setTotalPages(pagination.totalPages);
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

  // Fetch users when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle refresh
  const handleRefresh = () => {
    fetchUsers();
    showNotification('Data refreshed', 'success');
  };
  
  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(users.map(user => user._id));
    } else {
      setSelected([]);
    }
  };
  
  // Handle single selection
  const handleSelect = (id) => {
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
    setSelected([]); // Clear selection when changing page
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setSelected([]); // Clear selection when changing rows per page
  };
  
  // Handle add user
  const handleAddUser = (newUser) => {
    fetchUsers(); // Refresh the list
    showNotification('User added successfully!', 'success');
  };
  
  // Handle edit user
  const handleEditUser = (updatedUser) => {
    fetchUsers(); // Refresh the list
    showNotification('User updated successfully!', 'success');
  };
  
  // Handle delete user
  const handleDeleteUser = (userId) => {
    fetchUsers(); // Refresh the list
    setSelected(selected.filter(id => id !== userId));
    showNotification('User deleted successfully!', 'success');
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    showNotification('Bulk delete requires API implementation', 'warning');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, user) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedUserForAction(user);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedUserForAction(null);
  };

  // Open edit modal
  const openEditUserModal = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  // Open view modal
  const openViewUserModal = (user) => {
    setSelectedUser(user);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteUserDialog = (user) => {
    setSelectedUser(user);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status color and styles
  const getStatusStyles = (status) => {
    const styles = {
      active: {
        bg: COLORS.chips.active,
        text: COLORS.primaryDark,
        border: '#86efac'
      },
      inactive: {
        bg: COLORS.chips.inactive,
        text: COLORS.text.secondary,
        border: COLORS.border
      },
      suspended: {
        bg: COLORS.chips.suspended,
        text: '#92400e',
        border: '#fcd34d'
      },
      locked: {
        bg: COLORS.chips.locked,
        text: '#991b1b',
        border: '#fca5a5'
      }
    };
    return styles[status?.toLowerCase()] || styles.inactive;
  };
  
  // Get status text
  const getStatusText = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  // Get role color
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
  
  // Get avatar initials
  const getAvatarInitials = (username, employee) => {
    if (employee?.FirstName && employee?.LastName) {
      return `${employee.FirstName.charAt(0)}${employee.LastName.charAt(0)}`.toUpperCase();
    }
    return username ? username.charAt(0).toUpperCase() : 'U';
  };
  
  // Get avatar color based on username
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
  
  // Get employee name
  const getEmployeeName = (employee) => {
    if (!employee) return 'No Employee';
    return `${employee.FirstName || ''} ${employee.LastName || ''}`.trim() || 'No Name';
  };
  
  // Get employee ID
  const getEmployeeID = (employee) => {
    if (!employee) return '-';
    return employee.EmployeeID || '-';
  };

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
            {/* <Tooltip title="Refresh data">
              <IconButton 
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: COLORS.primary,
                  '&:hover': {
                    bgcolor: `${COLORS.primary}10`
                  }
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip> */}
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {selected.length > 0 && (
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
              Add User
            </Button>
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
                <TableCell padding="checkbox" sx={{ width: 40 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < users.length}
                    checked={users.length > 0 && selected.length === users.length}
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
                    disabled={loading || users.length === 0}
                  />
                </TableCell>
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
                  Employee
                </TableCell>
                {/* <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Status
                </TableCell> */}
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
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
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
                users.map((user) => {
                  const isSelected = selected.includes(user._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedUserForAction?._id === user._id;
                  const avatarColor = getAvatarColor(user.Username);
                  const roleName = user.RoleID?.RoleName || 'Unknown';
                  const roleStyles = getRoleStyles(roleName);
                  const statusStyles = getStatusStyles(user.Status);

                  return (
                    <TableRow
                      key={user._id}
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
                      <TableCell padding="checkbox" sx={{ width: 40 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(user._id)}
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
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {user.EmployeeID ? getEmployeeID(user.EmployeeID) : 'No Employee'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {user.EmployeeID ? `${user.EmployeeID.FirstName || ''} ${user.EmployeeID.LastName || ''}`.trim() : '-'}
                        </Typography>
                      </TableCell>
                      {/* <TableCell>
                        <Chip
                          label={getStatusText(user.Status)}
                          size="small"
                          sx={{ 
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            height: 20,
                            bgcolor: statusStyles.bg,
                            color: statusStyles.text,
                            border: `1px solid ${statusStyles.border}`,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      </TableCell> */}
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
      <AddUser 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddUser}
      />

      {selectedUser && (
        <>
          <EditUser 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            onUpdate={handleEditUser}
          />

          <ViewUser 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          <DeleteUser 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            onDelete={handleDeleteUser}
          />
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