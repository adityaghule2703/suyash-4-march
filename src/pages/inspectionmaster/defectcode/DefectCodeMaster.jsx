// DefectCodeMaster.jsx
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
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
  Drawer,
  Badge,
  Fab
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Science as ScienceIcon,
  Build as BuildIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  FilterList as FilterIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import { hasPermission, ACTIONS, MODULES, PAGES } from "../../../utils/modulePermissions";

// Import modal components
import AddDefectCode from "./AddDefectCode";
import EditDefectCode from "./EditDefectCode";
import ViewDefectCode from "./ViewDefectCode";
import DeleteDefectCode from "./DeleteDefectCode";

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
  },
  severity: {
    Critical: '#EF4444',
    Major: '#F59E0B',
    Minor: '#10B981',
    Cosmetic: '#8B5CF6'
  }
};

// Severity options for filtering
const SEVERITY_OPTIONS = ['All', 'Critical', 'Major', 'Minor', 'Cosmetic'];
const CATEGORY_OPTIONS = [
  'All',
  'Dimensional',
  'Visual/Surface',
  'Material',
  'Functional',
  'Process',
  'Quantity',
  'Documentation'
];

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
const ActionMenu = ({ defectCode, onView, onEdit, onDelete, anchorEl, onClose, onOpen, permissions }) => {
  const canView = hasPermission(permissions, MODULES.DEFECT_CODE_MASTER, PAGES.DEFECT_CODE_MASTER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.DEFECT_CODE_MASTER, PAGES.DEFECT_CODE_MASTER, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.DEFECT_CODE_MASTER, PAGES.DEFECT_CODE_MASTER, ACTIONS.DELETE);

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
              onView(defectCode);
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
              onEdit(defectCode);
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
        
        {(canView || canUpdate) && canDelete &&  defectCode?.is_active && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
        
        {canDelete && defectCode?.is_active && (
          <MenuItem 
            onClick={() => {
              onDelete(defectCode);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
                Mark Inactive
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const DefectCodeMaster = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // State for data
  const [defectCodes, setDefectCodes] = useState([]);
  const [filteredDefectCodes, setFilteredDefectCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Filter states
  const [severityFilter, setSeverityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedDefectCodeForAction, setSelectedDefectCodeForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Selected defect code
  const [selectedDefectCode, setSelectedDefectCode] = useState(null);
  
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

  // Update rows per page based on screen size
  useEffect(() => {
    setRowsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

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
    if (isSuperAdmin) return true;
    
    return hasPermission(
      userPermissions,
      MODULES.DEFECT_CODE_MASTER,
      PAGES.DEFECT_CODE_MASTER,
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

  // Fetch defect codes from API
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchDefectCodes();
    }
  }, [permissionsLoaded, canViewPage, isSuperAdmin]);

  const fetchDefectCodes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/defect-codes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const formattedData = (response.data.data || []).map(dc => ({
          _id: dc._id,
          defect_code: dc.defect_code || '',
          defect_name: dc.defect_name || '',
          defect_category: dc.defect_category || '',
          defect_description: dc.defect_description || '',
          applicable_processes: dc.applicable_processes || [],
          severity_default: dc.severity_default || 'Major',
          photo_reference: dc.photo_reference || '',
          is_active: dc.is_active !== undefined ? dc.is_active : true,
          created_by: dc.created_by || null,
          updated_by: dc.updated_by || null,
          createdAt: dc.createdAt || new Date().toISOString(),
          updatedAt: dc.updatedAt || new Date().toISOString()
        }));
        
        setDefectCodes(formattedData);
        setFilteredDefectCodes(formattedData);
      } else {
        showNotification('Failed to load defect codes', 'error');
      }
    } catch (err) {
      console.error('Error fetching defect codes:', err);
      showNotification('Failed to load defect codes. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters
  useEffect(() => {
    let filtered = [...defectCodes];
    
    // Search filter
    if (searchTerm) {
      const value = searchTerm.toLowerCase();
      filtered = filtered.filter(dc =>
        dc.defect_code?.toLowerCase().includes(value) ||
        dc.defect_name?.toLowerCase().includes(value) ||
        dc.defect_category?.toLowerCase().includes(value)
      );
    }
    
    // Severity filter
    if (severityFilter !== 'All') {
      filtered = filtered.filter(dc => dc.severity_default === severityFilter);
    }
    
    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(dc => dc.defect_category === categoryFilter);
    }
    
    // Status filter
    if (statusFilter !== 'All') {
      const isActive = statusFilter === 'Active';
      filtered = filtered.filter(dc => dc.is_active === isActive);
    }
    
    setFilteredDefectCodes(filtered);
  }, [searchTerm, severityFilter, categoryFilter, statusFilter, defectCodes]);
  
  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (severityFilter !== 'All') count++;
    if (categoryFilter !== 'All') count++;
    if (statusFilter !== 'All') count++;
    return count;
  };

  // Clear all filters
  const clearFilters = () => {
    setSeverityFilter('All');
    setCategoryFilter('All');
    setStatusFilter('All');
    setSearchInput('');
    setSearchTerm('');
    if (isMobile) {
      setFilterDrawerOpen(false);
    }
  };
  
  // Handle select all
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(filteredDefectCodes.map(dc => dc._id));
    } else {
      setSelected([]);
    }
  };
  
  // Handle single selection
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
  
  // Handle add defect code
  const handleAddDefectCode = (newDefectCode) => {
    let defectCodeData = newDefectCode;
    
    if (newDefectCode.data) defectCodeData = newDefectCode.data;
    if (newDefectCode.success && newDefectCode.defectCode) {
      defectCodeData = newDefectCode.defectCode;
    }
    
    const formattedDefectCode = {
      _id: defectCodeData._id || Date.now().toString(),
      defect_code: defectCodeData.defect_code || '',
      defect_name: defectCodeData.defect_name || '',
      defect_category: defectCodeData.defect_category || '',
      defect_description: defectCodeData.defect_description || '',
      applicable_processes: defectCodeData.applicable_processes || [],
      severity_default: defectCodeData.severity_default || 'Major',
      photo_reference: defectCodeData.photo_reference || '',
      is_active: defectCodeData.is_active !== undefined ? defectCodeData.is_active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setDefectCodes(prev => [formattedDefectCode, ...prev]);
    setSearchInput("");
    setSearchTerm("");
    setPage(0);
    
    showNotification("Defect code added successfully!", "success");
  };
  
  // Handle edit defect code
  const handleEditDefectCode = (updatedDefectCode) => {
    const updatedDefectCodes = defectCodes.map(dc =>
      dc._id === updatedDefectCode._id ? updatedDefectCode : dc
    );
    
    setDefectCodes(updatedDefectCodes);
    showNotification('Defect code updated successfully!', 'success');
  };
  
  // Handle delete defect code
  const handleDeleteDefectCode = (defectCodeId) => {
    const updatedDefectCodes = defectCodes.filter(dc => dc._id !== defectCodeId);
    setDefectCodes(updatedDefectCodes);
    setSelected(selected.filter(id => id !== defectCodeId));
    showNotification('Defect code deleted successfully!', 'success');
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (!canDelete) return;
    showNotification('Bulk delete requires API implementation', 'warning');
  };
  
  // Action menu handlers
  const handleActionMenuOpen = (event, defectCode) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedDefectCodeForAction(defectCode);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedDefectCodeForAction(null);
  };
  
  // Open edit modal
  const openEditDefectCodeModal = (defectCode) => {
    if (!canUpdate) return;
    setSelectedDefectCode(defectCode);
    setOpenEditModal(true);
    handleActionMenuClose();
  };
  
  // Open view modal
  const openViewDefectCodeModal = (defectCode) => {
    if (!canViewPage) return;
    setSelectedDefectCode(defectCode);
    setOpenViewModal(true);
    handleActionMenuClose();
  };
  
  // Open delete confirmation
  const openDeleteDefectCodeDialog = (defectCode) => {
    if (!canDelete) return;
    setSelectedDefectCode(defectCode);
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
  
  // Get severity color
  const getSeverityColor = (severity) => {
    return COLORS.severity[severity] || COLORS.text.secondary;
  };
  
  // Get defect code initials for avatar
  const getDefectCodeInitials = (defectName) => {
    if (!defectName) return 'DC';
    
    const words = defectName.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    
    return defectName.substring(0, 2).toUpperCase();
  };
  
  // Get avatar color based on category
  const getAvatarColor = (category) => {
    const colors = {
      Dimensional: COLORS.primary,
      'Visual/Surface': '#0D696C',
      Material: '#074346',
      Functional: '#0D4D45',
      Process: '#0A3D36',
      Quantity: '#072E28',
      Documentation: '#0B5E54',
      Assembly: '#128C7E',
      Welding: '#0F7B6E',
      Painting: '#1A9B8C',
      Electrical: '#0B5E54',
      Packaging: '#0A3D36',
      Other: COLORS.primaryDark
    };
    
    return colors[category] || COLORS.primary;
  };
  
  // Get process count
  const getProcessCount = (processes) => {
    return processes?.length || 0;
  };
  
  // Paginated defect codes
  const paginatedDefectCodes = filteredDefectCodes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Filter Drawer Component for Mobile
  const FilterDrawer = () => (
    <Drawer
      anchor="bottom"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '80vh'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>
            Filters
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
        
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
              SEVERITY
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              sx={inputStyle}
            >
              {SEVERITY_OPTIONS.map(option => (
                <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
              CATEGORY
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={inputStyle}
            >
              {CATEGORY_OPTIONS.map(option => (
                <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
              STATUS
            </Typography>
            <ToggleButtonGroup
              fullWidth
              size="small"
              value={statusFilter}
              exclusive
              onChange={(e, value) => value && setStatusFilter(value)}
              sx={{
                '& .MuiToggleButton-root': {
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  borderColor: COLORS.border,
                  '&.Mui-selected': {
                    bgcolor: COLORS.primaryLight,
                    color: COLORS.primary,
                  }
                }
              }}
            >
              <ToggleButton value="All">All</ToggleButton>
              <ToggleButton value="Active">Active</ToggleButton>
              <ToggleButton value="Inactive">Inactive</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={clearFilters}
            sx={{
              mt: 1,
              height: 36,
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.75rem',
              borderColor: COLORS.border,
              color: COLORS.text.secondary
            }}
          >
            Clear All Filters
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary
    }
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
    <Box sx={{ p: { xs: 1.5, sm: 2.5 } }}>
      {/* Page Header - Responsive */}
      <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: 700,
            color: COLORS.text.primary,
            mb: 0.5
          }}
        >
          Defect Code Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, color: COLORS.text.secondary }}>
          Manage defect codes for quality tracking and non-conformance reporting
        </Typography>
      </Box>

      {/* Filter Bar - Responsive */}
      <Paper sx={{ 
        p: { xs: 1, sm: 1.5 }, 
        mb: { xs: 2, sm: 2.5 }, 
        borderRadius: 2,
        bgcolor: COLORS.background.white,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          {/* Search - Full width on mobile */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' }, flex: 2 }}>
            <TextField
              placeholder={isMobile ? "Search..." : "Search by defect code, name or category..."}
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              fullWidth={isMobile}
              sx={{ 
                flex: 1,
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
            
            {/* Filter Button for Mobile */}
            {isMobile && (
              <Badge badgeContent={getActiveFilterCount()} color="primary">
                <Button
                  variant="outlined"
                  onClick={() => setFilterDrawerOpen(true)}
                  startIcon={<FilterIcon />}
                  sx={{
                    minWidth: 'auto',
                    height: 36,
                    px: 1.5,
                    borderRadius: 1.5,
                    borderColor: COLORS.border,
                    color: COLORS.text.secondary
                  }}
                >
                  Filters
                </Button>
              </Badge>
            )}
          </Stack>

          {/* Desktop Filters - Hidden on mobile */}
          {!isMobile && (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <TextField
                select
                size="small"
                label="Severity"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                sx={{ 
                  width: 120,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.7rem',
                  }
                }}
                SelectProps={{
                  sx: { fontSize: '0.75rem', py: 0.5 }
                }}
              >
                {SEVERITY_OPTIONS.map(option => (
                  <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                select
                size="small"
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ 
                  width: 130,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.7rem',
                  }
                }}
                SelectProps={{
                  sx: { fontSize: '0.75rem', py: 0.5 }
                }}
              >
                {CATEGORY_OPTIONS.map(option => (
                  <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              
              <ToggleButtonGroup
                size="small"
                value={statusFilter}
                exclusive
                onChange={(e, value) => value && setStatusFilter(value)}
                sx={{
                  height: 36,
                  '& .MuiToggleButton-root': {
                    fontSize: '0.7rem',
                    px: 1.5,
                    textTransform: 'none',
                    borderColor: COLORS.border,
                    '&.Mui-selected': {
                      bgcolor: COLORS.primaryLight,
                      color: COLORS.primary,
                    }
                  }
                }}
              >
                <ToggleButton value="All">All</ToggleButton>
                <ToggleButton value="Active">Active</ToggleButton>
                <ToggleButton value="Inactive">Inactive</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          )}

          {/* Action Buttons - Responsive */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
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
                {isMobile ? `${selected.length}` : `Delete (${selected.length})`}
              </Button>
            )}
            
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenAddModal(true)}
                fullWidth={isMobile && !selected.length}
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
                {isMobile ? 'Add' : 'Add Defect Code'}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Filter Drawer for Mobile */}
      <FilterDrawer />

      {/* Defect Codes Table - Horizontal scroll on mobile */}
      <Paper sx={{ 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'auto',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <TableContainer sx={{ minWidth: isMobile ? 800 : 'auto' }}>
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
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < filteredDefectCodes.length}
                      checked={filteredDefectCodes.length > 0 && selected.length === filteredDefectCodes.length}
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
                      disabled={loading || filteredDefectCodes.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Defect Code
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Defect Name
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Category
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Severity
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Processes
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Status
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light,
                  width: 60
                }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 8 : 7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading defect codes...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedDefectCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 8 : 7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm || severityFilter !== 'All' || categoryFilter !== 'All' || statusFilter !== 'All' 
                          ? 'No defect codes found' 
                          : 'No defect codes available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {(searchTerm || severityFilter !== 'All' || categoryFilter !== 'All' || statusFilter !== 'All')
                          ? 'Try adjusting your filter criteria'
                          : 'Add your first defect code to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDefectCodes.map((defectCode, index) => {
                  const isSelected = selected.includes(defectCode._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && 
                    selectedDefectCodeForAction?._id === defectCode._id;
                  const avatarColor = getAvatarColor(defectCode.defect_category);
                  const severityColor = getSeverityColor(defectCode.severity_default);
                  const processCount = getProcessCount(defectCode.applicable_processes);

                  return (
                    <TableRow
                      key={defectCode._id || index}
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
                      {canDelete && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(defectCode._id)}
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
                            {getDefectCodeInitials(defectCode.defect_name)}
                          </Avatar>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                            {defectCode.defect_code}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {defectCode.defect_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={defectCode.defect_category}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            height: 22,
                            bgcolor: `${avatarColor}15`,
                            color: avatarColor,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={defectCode.severity_default}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            height: 22,
                            bgcolor: `${severityColor}20`,
                            color: severityColor,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={defectCode.applicable_processes?.map(p => p.process_name || p).join(', ') || 'No processes'}>
                          <Chip
                            label={`${processCount} process${processCount !== 1 ? 'es' : ''}`}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.65rem',
                              height: 22,
                              borderColor: COLORS.border,
                              cursor: 'pointer'
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={defectCode.is_active ? <ActiveIcon sx={{ fontSize: '0.7rem' }} /> : <InactiveIcon sx={{ fontSize: '0.7rem' }} />}
                          label={defectCode.is_active ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            height: 22,
                            bgcolor: defectCode.is_active ? COLORS.chips.active : COLORS.chips.inactive,
                            color: defectCode.is_active ? '#065f46' : '#6b7280',
                            fontWeight: 500,
                            '& .MuiChip-icon': {
                              fontSize: '0.7rem',
                              color: defectCode.is_active ? '#065f46' : '#6b7280'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          defectCode={defectCode}
                          onView={openViewDefectCodeModal}
                          onEdit={openEditDefectCodeModal}
                          onDelete={openDeleteDefectCodeDialog}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, defectCode)}
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

        {/* Pagination - Responsive */}
        <TablePagination
          rowsPerPageOptions={isMobile ? [5, 10, 25] : [5, 10, 25, 50]}
          component="div"
          count={filteredDefectCodes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) => isMobile ? `${from}-${to} of ${count}` : undefined}
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
      {canCreate && (
        <AddDefectCode 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onDefectCodeAdded={handleAddDefectCode}
        />
      )}

      {selectedDefectCode && (
        <>
          {canUpdate && (
            <EditDefectCode 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedDefectCode(null);
              }}
              defectCode={selectedDefectCode}
              onUpdate={handleEditDefectCode}
            />
          )}

          {canViewPage && (
            <ViewDefectCode 
              open={openViewModal}
              onClose={() => {
                setOpenViewModal(false);
                setSelectedDefectCode(null);
              }}
              defectCode={selectedDefectCode}
              onEdit={() => {
                if (canUpdate) {
                  setOpenViewModal(false);
                  setOpenEditModal(true);
                }
              }}
            />
          )}

          {canDelete && (
            <DeleteDefectCode 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedDefectCode(null);
              }}
              defectCode={selectedDefectCode}
              onDelete={handleDeleteDefectCode}
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
  sx={{
    '& .MuiSnackbar-root': {
      position: 'fixed'
    }
  }}
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

export default DefectCodeMaster;