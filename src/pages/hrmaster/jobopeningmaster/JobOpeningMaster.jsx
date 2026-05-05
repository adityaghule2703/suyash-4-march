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
  alpha,
  Alert,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Publish as PublishIcon,
  Close as CloseIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// Import modal components
import AddJobOpening from './AddJobOpening';
import EditJobOpening from './EditJobOpening';
import ViewJobOpening from './ViewJobOpening';
import DeleteJobOpening from './DeleteJobOpening';
import PublishJob from './PublishJob';
import CloseJobOpening from './CloseJobOpening';

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
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

// Status color mapping
const STATUS_COLORS = {
  published: { bg: COLORS.status.success, color: COLORS.primaryDark, label: 'Published' },
  open: { bg: COLORS.status.info, color: COLORS.primaryDark, label: 'Open' },
  closed: { bg: COLORS.status.error, color: '#991B1B', label: 'Closed' },
  pending: { bg: COLORS.status.warning, color: '#92400E', label: 'Pending' },
  draft: { bg: COLORS.chips.inactive, color: COLORS.text.secondary, label: 'Draft' }
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
const ActionMenu = ({ 
  job, 
  onView, 
  onEdit, 
  onDelete, 
  onPublish, 
  onClose, 
  anchorEl, 
  onMenuClose,
  onOpen,
  permissions,
  isSuperAdmin
}) => {
  // Check permissions
  const canView = hasPermission(permissions, MODULES.JOB_OPENING_MASTER, PAGES.CAREER_OPPORTUNITIES, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.JOB_OPENING_MASTER, PAGES.CAREER_OPPORTUNITIES, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.JOB_OPENING_MASTER, PAGES.CAREER_OPPORTUNITIES, ACTIONS.DELETE);
  const canExport = hasPermission(permissions, MODULES.JOB_OPENING_MASTER, PAGES.CAREER_OPPORTUNITIES, ACTIONS.EXPORT);
  const canPrint = hasPermission(permissions, MODULES.JOB_OPENING_MASTER, PAGES.CAREER_OPPORTUNITIES, ACTIONS.PRINT);

  // Superadmin has all permissions
  const hasFullAccess = isSuperAdmin;

  const isPublished = job?.status === 'published';
  const isClosed = job?.status === 'closed';
  const isOpen = job?.status === 'open' || job?.status === 'draft';

  // Determine which actions to show based on permissions
  const showView = hasFullAccess || canView;
  const showEdit = (hasFullAccess || canUpdate) && !isPublished && !isClosed;
  const showPublish = (hasFullAccess || canUpdate) && !isPublished && !isClosed;
  const showClose = (hasFullAccess || canUpdate) && !isClosed;
  const showDelete = (hasFullAccess || canDelete);

  // If no actions available, don't render the menu
  if (!showView && !showEdit && !showPublish && !showClose && !showDelete) {
    return null;
  }

  // If only view action is available, show just the view button
  if (showView && !showEdit && !showPublish && !showClose && !showDelete) {
    return (
      <Tooltip title="View Details">
        <IconButton
          size="small"
          onClick={() => onView(job)}
          sx={{
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: `${COLORS.primary}20`
            }
          }}
        >
          <ViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={(e) => onOpen(e, job)}
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
        onClose={onMenuClose}
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
        {showView && (
          <MenuItem onClick={() => { onView(job); onMenuClose(); }} sx={{ py: 1.5 }}>
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
        
        {showEdit && (
          <MenuItem onClick={() => { onEdit(job); onMenuClose(); }} sx={{ py: 1.5 }}>
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
        
        {showPublish && (
          <MenuItem onClick={() => { onPublish(job); onMenuClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
              <PublishIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Publish
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {showClose && (
          <MenuItem onClick={() => { onClose(job); onMenuClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
              <CloseIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Close Job
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {(showView || showEdit || showPublish || showClose) && showDelete && (
          <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        )}
        
        {showDelete && (
          <MenuItem onClick={() => { onDelete(job); onMenuClose(); }} sx={{ py: 1.5 }}>
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

const JobOpeningMaster = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedJobForAction, setSelectedJobForAction] = useState(null);
  
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);
  const [selectedJobForView, setSelectedJobForView] = useState(null);
  const [selectedJobForPublish, setSelectedJobForPublish] = useState(null);
  const [selectedJobForClose, setSelectedJobForClose] = useState(null);
  const [selectedJobForDelete, setSelectedJobForDelete] = useState(null);
  
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
      MODULES.JOB_OPENING_MASTER,
      PAGES.CAREER_OPPORTUNITIES,
      action
    );
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);
  const canExport = checkPermission(ACTIONS.EXPORT);
  const canPrint = checkPermission(ACTIONS.PRINT);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);



 const fetchJobs = useCallback(async (showLoader = true) => {
  if (!canViewPage && !isSuperAdmin) return;

  try {
    if (showLoader) setLoading(true);

    const token = localStorage.getItem('token');

    const params = new URLSearchParams();
    params.append('page', page + 1);
    params.append('limit', rowsPerPage);

    if (searchTerm) params.append('search', searchTerm);

    const response = await axios.get(
      `${BASE_URL}/api/jobs?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.success) {
      const data = response.data.data || [];

      setJobs(data);
      setFilteredJobs(data); // ✅ server-side data
    } else {
      showNotification('Failed to load job openings', 'error');
    }

  } catch (err) {
    console.error('Error fetching jobs:', err);
    showNotification('Failed to load job openings. Please try again.', 'error');
  } finally {
    if (showLoader) setLoading(false);
  }
}, [page, rowsPerPage, searchTerm, canViewPage, isSuperAdmin]);

  useEffect(() => {
  if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
    fetchJobs();
  }
}, [permissionsLoaded, canViewPage, isSuperAdmin, page, rowsPerPage, searchTerm]);

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (!canDelete && !isSuperAdmin) return;
    
    if (event.target.checked) {
      setSelected(paginatedJobs.map(job => job._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    if (!canDelete && !isSuperAdmin) return;
    
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
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddJob = async () => {
    await fetchJobs();
    showNotification('Job opening created successfully!', 'success');
  };

  const handleEditJob = async () => {
    await fetchJobs();
    showNotification('Job opening updated successfully!', 'success');
  };

  const handleDeleteJob = async () => {
    await fetchJobs();
    showNotification('Job opening deleted successfully!', 'success');
  };

  const handlePublishJob = async () => {
    await fetchJobs();
    showNotification('Job published successfully!', 'success');
  };

  const handleCloseJob = async () => {
    await fetchJobs();
    showNotification('Job closed successfully!', 'success');
  };

  const handleRefresh = () => {
    fetchJobs();
    showNotification('Data refreshed', 'success');
  };

  const handleBulkDelete = () => {
    if (!canDelete && !isSuperAdmin) {
      showNotification('You do not have permission to delete job openings', 'error');
      return;
    }
    showNotification('Bulk delete requires API implementation', 'warning');
  };

  const handleActionMenuOpen = (event, job) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedJobForAction(job);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedJobForAction(null);
  };

  const openViewJobModal = (job) => {
    if (!canViewPage && !isSuperAdmin) {
      showNotification('You do not have permission to view job openings', 'error');
      return;
    }
    setSelectedJobForView(job);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openEditJobModal = (job) => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification('You do not have permission to edit job openings', 'error');
      return;
    }
    setSelectedJobForEdit(job);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openPublishJobModal = (job) => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification('You do not have permission to publish jobs', 'error');
      return;
    }
    setSelectedJobForPublish(job);
    setOpenPublishModal(true);
    handleActionMenuClose();
  };

  const openCloseJobDialog = (job) => {
    if (!canUpdate && !isSuperAdmin) {
      showNotification('You do not have permission to close jobs', 'error');
      return;
    }
    setSelectedJobForClose(job);
    setOpenCloseDialog(true);
    handleActionMenuClose();
  };

  const openDeleteJobDialog = (job) => {
    if (!canDelete && !isSuperAdmin) {
      showNotification('You do not have permission to delete job openings', 'error');
      return;
    }
    setSelectedJobForDelete(job);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusStyle = (status) => {
    return STATUS_COLORS[status?.toLowerCase()] || { bg: COLORS.chips.inactive, color: COLORS.text.secondary, label: status || 'Unknown' };
  };

  const getAvatarInitials = (title) => {
    if (!title) return 'JB';
    const words = title.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return title.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (title) => {
    if (!title) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = title.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const paginatedJobs = filteredJobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isFilterActive = searchTerm;

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
          Career Opportunities
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and track all job openings, publish to job boards, and monitor applications
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
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by Job ID, Title, Department, Location..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 320 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': { borderColor: COLORS.primary },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch} edge="end">
                      <CloseIcon fontSize="small" sx={{ color: COLORS.text.tertiary }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { 
                  height: 36,
                  bgcolor: COLORS.background.light,
                  '& input': {
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: COLORS.text.primary
                  }
                }
              }}
              disabled={false}
            />

            {isFilterActive && (
              <Button
                variant="text"
                startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleClearSearch}
                sx={{ 
                  height: 36,
                  borderRadius: 1.5,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  color: COLORS.text.secondary
                }}
              >
                Clear Filters
              </Button>
            )}
          </Stack>

          <Stack direction="row" spacing={1.5}>
            {/* Bulk Delete Button - Only show if user has delete permission */}
            {(canDelete || isSuperAdmin) && selected.length > 0 && (
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
                  '&:hover': { borderColor: '#fecaca', bgcolor: '#fee2e2' }
                }}
                disabled={loading}
              >
                Delete ({selected.length})
              </Button>
            )}

            {/* Add Job Button - Only show if user has create permission */}
            {(canCreate || isSuperAdmin) && (
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
                  '&:hover': { bgcolor: COLORS.primaryDark }
                }}
                disabled={loading}
              >
                Add Job Opening
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Jobs Table */}
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
                {(canDelete || isSuperAdmin) && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < paginatedJobs.length}
                      checked={paginatedJobs.length > 0 && selected.length === paginatedJobs.length}
                      onChange={handleSelectAll}
                      sx={{
                        color: COLORS.text.light,
                        '&.Mui-checked': { color: COLORS.text.light },
                        '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
                        '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                      }}
                      disabled={loading || paginatedJobs.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Job Details
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Job ID
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Department
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Location
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }} align="center">
                  Applications
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={(canDelete || isSuperAdmin) ? 8 : 7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading job openings...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(canDelete || isSuperAdmin) ? 8 : 7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <WorkIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {isFilterActive ? 'No job openings match your filters' : 'No job openings available'}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {isFilterActive ? 'Try adjusting your search terms' : 'Add your first job opening to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedJobs.map((job, index) => {
                  const isSelected = selected.includes(job._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedJobForAction?._id === job._id;
                  const avatarColor = getAvatarColor(job.title);
                  const statusStyle = getStatusStyle(job.status);

                  return (
                    <TableRow
                      key={job._id}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': { bgcolor: COLORS.background.hover },
                        '&.Mui-selected': {
                          bgcolor: `${COLORS.primary}10`,
                          '&:hover': { bgcolor: `${COLORS.primary}20` }
                        },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      {/* Checkbox Column - Only show if user has delete permission */}
                      {(canDelete || isSuperAdmin) && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(job._id)}
                            sx={{
                              color: COLORS.primary,
                              '&.Mui-checked': { color: COLORS.primary },
                              '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 40, height: 40, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getAvatarInitials(job.title)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {job.title}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                Req: {job.requisitionNumber || 'N/A'}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>•</Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                {job.employmentType || 'N/A'}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                          {job.jobId}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Created: {formatDate(job.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={job.department || 'N/A'}
                          size="small"
                          sx={{
                            bgcolor: COLORS.primaryLight,
                            color: COLORS.primaryDark,
                            fontWeight: 500,
                            fontSize: '0.65rem',
                            height: 24
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <LocationIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {job.location || 'N/A'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Chip
                            label={statusStyle.label}
                            size="small"
                            sx={{
                              bgcolor: statusStyle.bg,
                              color: statusStyle.color,
                              fontWeight: 500,
                              fontSize: '0.65rem',
                              height: 24
                            }}
                          />
                          {job.publishTo && job.publishTo.length > 0 && (
                            <Stack direction="row" spacing={0.5}>
                              {job.publishTo.slice(0, 2).map((platform, idx) => (
                                <Tooltip key={idx} title={`${platform.platform}: ${platform.status}`}>
                                  <Chip
                                    size="small"
                                    label={platform.platform === 'careerPage' ? 'Web' : 
                                          platform.platform === 'linkedin' ? 'LI' : 
                                          platform.platform === 'naukri' ? 'NK' : platform.platform.charAt(0).toUpperCase()}
                                    sx={{
                                      height: 20,
                                      fontSize: '0.6rem',
                                      bgcolor: platform.status === 'published' ? COLORS.status.success :
                                               platform.status === 'pending' ? COLORS.status.warning :
                                               platform.status === 'failed' ? COLORS.status.error : COLORS.chips.inactive,
                                      color: platform.status === 'published' ? COLORS.primaryDark :
                                             platform.status === 'pending' ? '#92400E' :
                                             platform.status === 'failed' ? '#991B1B' : COLORS.text.secondary,
                                    }}
                                  />
                                </Tooltip>
                              ))}
                              {job.publishTo.length > 2 && (
                                <Tooltip title={`${job.publishTo.length - 2} more platforms`}>
                                  <Chip
                                    size="small"
                                    label={`+${job.publishTo.length - 2}`}
                                    sx={{ height: 20, fontSize: '0.6rem' }}
                                  />
                                </Tooltip>
                              )}
                            </Stack>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Badge badgeContent={job.applicationCount || 0} sx={{ '& .MuiBadge-badge': { bgcolor: COLORS.primary } }}>
                          <PeopleIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                        </Badge>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          job={job}
                          onView={openViewJobModal}
                          onEdit={openEditJobModal}
                          onDelete={openDeleteJobDialog}
                          onPublish={openPublishJobModal}
                          onClose={openCloseJobDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onMenuClose={handleActionMenuClose}
                          onOpen={handleActionMenuOpen}
                          permissions={userPermissions}
                          isSuperAdmin={isSuperAdmin}
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
          count={filteredJobs.length}
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
            '& .MuiTablePagination-select': { fontSize: '0.7rem' },
            '& .MuiTablePagination-actions button': { color: COLORS.primary }
          }}
        />
      </Paper>

      {/* Modal Components - Only render if user has appropriate permissions */}
      {(canCreate || isSuperAdmin) && (
        <AddJobOpening 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddJob}
        />
      )}

      {selectedJobForEdit && (canUpdate || isSuperAdmin) && (
        <EditJobOpening
          open={openEditModal}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedJobForEdit(null);
          }}
          job={selectedJobForEdit}
          onUpdate={handleEditJob}
        />
      )}

      {selectedJobForView && (canViewPage || isSuperAdmin) && (
        <ViewJobOpening
          open={openViewModal}
          onClose={() => {
            setOpenViewModal(false);
            setSelectedJobForView(null);
          }}
          jobId={selectedJobForView?._id}
          onEdit={() => {
            setOpenViewModal(false);
            setSelectedJobForEdit(selectedJobForView);
            setOpenEditModal(true);
          }}
        />
      )}

      {selectedJobForPublish && (canUpdate || isSuperAdmin) && (
        <PublishJob
          open={openPublishModal}
          onClose={() => {
            setOpenPublishModal(false);
            setSelectedJobForPublish(null);
          }}
          job={selectedJobForPublish}
          onPublish={handlePublishJob}
        />
      )}

      {selectedJobForClose && (canUpdate || isSuperAdmin) && (
        <CloseJobOpening 
          open={openCloseDialog}
          onClose={() => {
            setOpenCloseDialog(false);
            setSelectedJobForClose(null);
          }}
          jobId={selectedJobForClose._id}
          onCloseJob={handleCloseJob}  
        />
      )}

      {selectedJobForDelete && (canDelete || isSuperAdmin) && (
        <DeleteJobOpening 
          open={openDeleteDialog}
          onClose={() => {
            setOpenDeleteDialog(false);
            setSelectedJobForDelete(null);
          }}
          job={selectedJobForDelete}
          onDelete={handleDeleteJob}
        />
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
            '& .MuiAlert-icon': { fontSize: '1.25rem' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JobOpeningMaster;