// NcrMaster.jsx
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Science as ScienceIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  AssignmentLate as AssignmentLateIcon,
  CheckCircleOutline as ClosedIcon,
  Pending as PendingIcon,
  Link as LinkIcon,
  Assignment as AssignmentIcon,
  SwapHoriz as SwapHorizIcon,
  AttachMoney as AttachMoneyIcon,
  BugReport as BugReportIcon,
  LockOpen as LockOpenIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import axios from "axios";
import BASE_URL from "../../../config/Config";
import { hasPermission, ACTIONS, MODULES, PAGES } from "../../../utils/modulePermissions";

// Import all NCR components
import AddNCR from "./AddNcr";
import ViewNcr from "./ViewNcr";
// import EditNcr from "./EditNcr";
// import DeleteNcr from "./DeleteNcr";
import SetDisposition from "./SetDisposition";
import RecordRootCause from "./RecordRootCause";
import LinkCapa from "./LinkCapa";
import CloseNcr from "./CloseNcr";
import NcrFinancialDetails from "./NcrFinancialDetails";
import AddAction from "./AddAction";

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
  },
  severity: {
    Critical: '#EF4444',
    Major: '#F59E0B',
    Minor: '#10B981',
    Cosmetic: '#8B5CF6'
  },
  status: {
    Open: '#F59E0B',
    'Under Investigation': '#3B82F6',
    'Disposition Given': '#8B5CF6',
    'CAPA Initiated': '#8B5CF6',
    'Pending Verification': '#06B6D4',
    'Closed': '#10B981',
    'Escalated': '#EF4444'
  },
  ncrType: {
    Incoming: '#3B82F6',
    'In-Process': '#8B5CF6',
    'Final Inspection': '#10B981',
    'Customer Return': '#F59E0B'
  }
};

// Filter options
const NCR_TYPE_OPTIONS = ['All', 'Incoming', 'In-Process', 'Final Inspection', 'Customer Return'];
const SEVERITY_OPTIONS = ['All', 'Critical', 'Major', 'Minor'];
const STATUS_OPTIONS = ['All', 'Open', 'Under Investigation', 'Disposition Given', 'CAPA Initiated', 'Pending Verification', 'Closed', 'Escalated'];
const DISPOSITION_OPTIONS = ['All', 'Use As Is', 'Rework', 'Return to Vendor', 'Scrap', 'Concession', 'Sort', 'MRB Review', 'Customer Concession', 'Pending Decision'];

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

// Helper function to check if action is allowed
const isActionAllowed = (ncr, action) => {
  const isClosed = ncr.status === 'Closed';
  
  switch(action) {
    case 'view':
      return true;
    case 'edit':
      return !isClosed;
    case 'delete':
      return !isClosed;
    case 'disposition':
      return !isClosed && !ncr.disposition;
    case 'rootCause':
      return !isClosed && !ncr.root_cause;
    case 'addAction':
      return !isClosed;
    case 'financial':
      return !isClosed;
    case 'linkCapa':
      const requiresCAPA = (ncr.severity === 'Critical' || ncr.severity === 'Major') && ncr.systemic_failure === true;
      return !isClosed && !ncr.capa_id && requiresCAPA;
    case 'close':
      if (isClosed) return false;
      const requiresCAPAForClose = (ncr.severity === 'Critical' || ncr.severity === 'Major') && ncr.systemic_failure === true;
      if (requiresCAPAForClose && !ncr.capa_id) return false;
      if (!ncr.disposition) return false;
      return true;
    default:
      return false;
  }
};

// Get action tooltip text
const getActionTooltip = (ncr, action) => {
  const isClosed = ncr.status === 'Closed';
  
  switch(action) {
    case 'edit':
      return isClosed ? 'Cannot edit closed NCR' : 'Edit NCR';
    case 'delete':
      return isClosed ? 'Cannot delete closed NCR' : 'Delete NCR';
    case 'disposition':
      if (isClosed) return 'Cannot set disposition on closed NCR';
      if (ncr.disposition) return `Disposition already set to "${ncr.disposition}"`;
      return 'Set material disposition';
    case 'rootCause':
      if (isClosed) return 'Cannot record root cause on closed NCR';
      if (ncr.root_cause) return 'Root cause already recorded';
      return 'Record root cause analysis';
    case 'addAction':
      return isClosed ? 'Cannot add actions to closed NCR' : 'Add corrective/preventive action';
    case 'financial':
      return isClosed ? 'Cannot update financials on closed NCR' : 'Update financial details';
    case 'linkCapa':
      if (isClosed) return 'Cannot link CAPA to closed NCR';
      if (ncr.capa_id) return 'CAPA already linked';
      if ((ncr.severity === 'Critical' || ncr.severity === 'Major') && ncr.systemic_failure === true) {
        return 'Link CAPA to this NCR';
      }
      return 'CAPA not required for this NCR';
    case 'close':
      if (isClosed) return 'NCR already closed';
      const requiresCAPAForClose = (ncr.severity === 'Critical' || ncr.severity === 'Major') && ncr.systemic_failure === true;
      if (requiresCAPAForClose && !ncr.capa_id) return 'CAPA must be linked before closing';
      if (!ncr.disposition) return 'Disposition must be set before closing';
      return 'Close NCR';
    default:
      return '';
  }
};

// Action Menu Component
const ActionMenu = ({ ncr, onAction, anchorEl, onClose, onOpen, permissions }) => {
  const canView = hasPermission(permissions, MODULES.NCR_MASTER, PAGES.NCR_MASTER, ACTIONS.VIEW);
  const canUpdate = hasPermission(permissions, MODULES.NCR_MASTER, PAGES.NCR_MASTER, ACTIONS.UPDATE);
  const canDelete = hasPermission(permissions, MODULES.NCR_MASTER, PAGES.NCR_MASTER, ACTIONS.DELETE);

  if (!canView && !canUpdate && !canDelete) {
    return null;
  }

  const menuItems = [
    { 
      label: 'View Details', 
      icon: <ViewIcon fontSize="small" />, 
      action: 'view', 
      show: canView,
      allowed: true,
      // tooltip: 'View NCR details'
    },
    { 
      label: 'Set Disposition', 
      icon: <SwapHorizIcon fontSize="small" />, 
      action: 'disposition', 
      show: canUpdate,
      allowed: isActionAllowed(ncr, 'disposition'),
      // tooltip: getActionTooltip(ncr, 'disposition'),
      completed: ncr.disposition ? true : false
    },
    { 
      label: 'Record Root Cause', 
      icon: <BugReportIcon fontSize="small" />, 
      action: 'rootCause', 
      show: canUpdate,
      allowed: isActionAllowed(ncr, 'rootCause'),
      // tooltip: getActionTooltip(ncr, 'rootCause'),
      completed: ncr.root_cause ? true : false
    },
    { 
      label: 'Add Action', 
      icon: <AssignmentIcon fontSize="small" />, 
      action: 'addAction', 
      show: canUpdate,
      allowed: isActionAllowed(ncr, 'addAction'),
      // tooltip: getActionTooltip(ncr, 'addAction')
    },
    { 
      label: 'Financial Details', 
      icon: <AttachMoneyIcon fontSize="small" />, 
      action: 'financial', 
      show: canUpdate,
      allowed: isActionAllowed(ncr, 'financial'),
      // tooltip: getActionTooltip(ncr, 'financial')
    },
    { 
      label: 'Link CAPA', 
      icon: <LinkIcon fontSize="small" />, 
      action: 'linkCapa', 
      show: canUpdate && ((ncr.severity === 'Critical' || ncr.severity === 'Major') && ncr.systemic_failure === true),
      allowed: isActionAllowed(ncr, 'linkCapa'),
      // tooltip: getActionTooltip(ncr, 'linkCapa'),
      completed: ncr.capa_id ? true : false
    },
    { 
      label: 'Close NCR', 
      icon: <LockOpenIcon fontSize="small" />, 
      action: 'close', 
      show: canUpdate && ncr.status !== 'Closed',
      allowed: isActionAllowed(ncr, 'close'),
      // tooltip: getActionTooltip(ncr, 'close')
    },
    { divider: true, show: canDelete && ncr.status !== 'Closed' },
  ];

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
            minWidth: 200,
            maxHeight: 450,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {menuItems.map((item, idx) => 
          item.divider ? (
            <Divider key={idx} sx={{ my: 0.5, borderColor: COLORS.border }} />
          ) : item.show ? (
            <Tooltip key={idx} title={item.tooltip} placement="left" arrow>
              <span>
                <MenuItem 
                  onClick={() => {
                    if (item.allowed) {
                      onAction(item.action, ncr);
                      onClose();
                    }
                  }}
                  disabled={!item.allowed}
                  sx={{ 
                    py: 1.5,
                    opacity: item.allowed ? 1 : 0.5,
                    '&.Mui-disabled': {
                      opacity: 0.5
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: item.color || COLORS.primary, minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" fontWeight={500} sx={{ color: item.color || COLORS.text.primary, fontSize: '0.75rem' }}>
                        {item.label}
                      </Typography>
                      {item.completed && (
                        <CheckCircleIcon sx={{ fontSize: '0.7rem', color: COLORS.success }} />
                      )}
                    </Stack>
                  </ListItemText>
                </MenuItem>
              </span>
            </Tooltip>
          ) : null
        )}
      </Menu>
    </>
  );
};

const NcrMaster = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // State for data
  const [ncrs, setNcrs] = useState([]);
  const [filteredNcrs, setFilteredNcrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statistics, setStatistics] = useState(null);
  
  // Filter states
  const [ncrTypeFilter, setNcrTypeFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dispositionFilter, setDispositionFilter] = useState('All');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [selected, setSelected] = useState([]);
  
  // Menu state for action buttons
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedNcrForAction, setSelectedNcrForAction] = useState(null);
  
  // Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDispositionModal, setOpenDispositionModal] = useState(false);
  const [openRootCauseModal, setOpenRootCauseModal] = useState(false);
  const [openAddActionModal, setOpenAddActionModal] = useState(false);
  const [openFinancialModal, setOpenFinancialModal] = useState(false);
  const [openLinkCapaModal, setOpenLinkCapaModal] = useState(false);
  const [openCloseModal, setOpenCloseModal] = useState(false);
  
  // Selected NCR
  const [selectedNcr, setSelectedNcr] = useState(null);
  
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
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.success) {
          const userData = response.data.data;
          setIsSuperAdmin(userData.isSuperAdmin || false);
          setUserPermissions(userData.permissions || []);
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
      MODULES.NCR_MASTER,
      PAGES.NCR_MASTER,
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

  // Fetch NCRs from API
  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchNcrs();
    }
  }, [permissionsLoaded, canViewPage, isSuperAdmin]);

  const fetchNcrs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/ncrs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const formattedData = (response.data.data || []).map(ncr => ({
          _id: ncr._id,
          ncr_number: ncr.ncr_number || '',
          ncr_date: ncr.ncr_date,
          ncr_type: ncr.ncr_type || '',
          severity: ncr.severity || '',
          part_no: ncr.part_no || '',
          part_name: ncr.item_id?.part_name || '',
          drawing_no: ncr.drawing_no || '',
          drawing_revision: ncr.drawing_revision || '',
          quantity: ncr.quantity || 0,
          quantity_unit: ncr.quantity_unit || '',
          lot_no: ncr.lot_no || '',
          defect_codes: ncr.defect_codes || [],
          defect_description: ncr.defect_description || '',
          status: ncr.status || 'Open',
          disposition: ncr.disposition || '',
          root_cause: ncr.root_cause || '',
          systemic_failure: ncr.systemic_failure || false,
          capa_id: ncr.capa_id,
          estimated_loss: ncr.estimated_loss || 0,
          actual_loss: ncr.actual_loss || 0,
          recovery_amount: ncr.recovery_amount || 0,
          actions: ncr.actions || [],
          createdAt: ncr.createdAt || new Date().toISOString(),
          closed_at: ncr.closed_at || null
        }));
        
        setNcrs(formattedData);
        setFilteredNcrs(formattedData);
        
        if (response.data.statistics) {
          setStatistics(response.data.statistics);
        }
      }
    } catch (err) {
      console.error('Error fetching NCRs:', err);
      showNotification('Failed to load NCRs. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters
  useEffect(() => {
    let filtered = [...ncrs];
    
    if (searchTerm) {
      const value = searchTerm.toLowerCase();
      filtered = filtered.filter(ncr =>
        ncr.ncr_number?.toLowerCase().includes(value) ||
        ncr.part_no?.toLowerCase().includes(value) ||
        ncr.part_name?.toLowerCase().includes(value)
      );
    }
    
    if (ncrTypeFilter !== 'All') {
      filtered = filtered.filter(ncr => ncr.ncr_type === ncrTypeFilter);
    }
    
    if (severityFilter !== 'All') {
      filtered = filtered.filter(ncr => ncr.severity === severityFilter);
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(ncr => ncr.status === statusFilter);
    }
    
    if (dispositionFilter !== 'All') {
      filtered = filtered.filter(ncr => ncr.disposition === dispositionFilter);
    }
    
    setFilteredNcrs(filtered);
  }, [searchTerm, ncrTypeFilter, severityFilter, statusFilter, dispositionFilter, ncrs]);
  
  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (ncrTypeFilter !== 'All') count++;
    if (severityFilter !== 'All') count++;
    if (statusFilter !== 'All') count++;
    if (dispositionFilter !== 'All') count++;
    return count;
  };

  const clearFilters = () => {
    setNcrTypeFilter('All');
    setSeverityFilter('All');
    setStatusFilter('All');
    setDispositionFilter('All');
    setSearchInput('');
    setSearchTerm('');
    if (isMobile) setFilterDrawerOpen(false);
  };
  
  // Handle selection
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    if (event.target.checked) {
      setSelected(filteredNcrs.map(ncr => ncr._id));
    } else {
      setSelected([]);
    }
  };
  
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
  
  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };
  
  // Action handlers with validation
  const handleAction = (action, ncr) => {
    if (!isActionAllowed(ncr, action)) {
      showNotification(getActionTooltip(ncr, action), 'warning');
      return;
    }
    
    setSelectedNcr(ncr);
    
    switch(action) {
      case 'view':
        setOpenViewModal(true);
        break;
      case 'edit':
        setOpenEditModal(true);
        break;
      case 'delete':
        setOpenDeleteDialog(true);
        break;
      case 'disposition':
        setOpenDispositionModal(true);
        break;
      case 'rootCause':
        setOpenRootCauseModal(true);
        break;
      case 'addAction':
        setOpenAddActionModal(true);
        break;
      case 'financial':
        setOpenFinancialModal(true);
        break;
      case 'linkCapa':
        setOpenLinkCapaModal(true);
        break;
      case 'close':
        setOpenCloseModal(true);
        break;
      default:
        break;
    }
  };

  const handleActionMenuOpen = (event, ncr) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedNcrForAction(ncr);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedNcrForAction(null);
  };
  
  // CRUD Handlers
  const handleAddNcr = (newNcr) => {
    let ncrData = newNcr;
    if (newNcr && newNcr.data) ncrData = newNcr.data;
    if (newNcr && newNcr.success && newNcr.data) ncrData = newNcr.data;
    
    const formattedNcr = {
      _id: ncrData._id || Date.now().toString(),
      ncr_number: ncrData.ncr_number || '',
      ncr_date: ncrData.ncr_date || new Date().toISOString(),
      ncr_type: ncrData.ncr_type || '',
      severity: ncrData.severity || '',
      part_no: ncrData.part_no || '',
      status: ncrData.status || 'Open',
      disposition: ncrData.disposition || '',
      root_cause: ncrData.root_cause || '',
      systemic_failure: ncrData.systemic_failure || false,
      capa_id: ncrData.capa_id || null,
      estimated_loss: ncrData.estimated_loss || 0,
      createdAt: ncrData.createdAt || new Date().toISOString()
    };
    
    setNcrs(prev => [formattedNcr, ...prev]);
    setPage(0);
    showNotification("NCR added successfully!", "success");
  };
  
  const handleEditNcr = (updatedNcr) => {
    const updatedNcrs = ncrs.map(ncr =>
      ncr._id === updatedNcr._id ? { ...ncr, ...updatedNcr } : ncr
    );
    setNcrs(updatedNcrs);
    showNotification('NCR updated successfully!', 'success');
    setOpenEditModal(false);
    setSelectedNcr(null);
  };
  
  const handleDeleteNcr = async (ncrId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/ncrs/${ncrId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedNcrs = ncrs.filter(ncr => ncr._id !== ncrId);
      setNcrs(updatedNcrs);
      setSelected(selected.filter(id => id !== ncrId));
      showNotification('NCR deleted successfully!', 'success');
    } catch (err) {
      showNotification('Failed to delete NCR', 'error');
    }
    setOpenDeleteDialog(false);
    setSelectedNcr(null);
  };
  
  const handleBulkDelete = () => {
    showNotification('Bulk delete feature coming soon', 'warning');
  };
  
  const handleDispositionSet = (data) => {
    const updatedNcrs = ncrs.map(ncr =>
      ncr._id === selectedNcr?._id 
        ? { ...ncr, disposition: data.disposition, status: data.status } 
        : ncr
    );
    setNcrs(updatedNcrs);
    showNotification(`Disposition set to "${data.disposition}"`, 'success');
    setOpenDispositionModal(false);
    setSelectedNcr(null);
  };
  
  const handleRootCauseRecorded = (data) => {
    const updatedNcrs = ncrs.map(ncr =>
      ncr._id === selectedNcr?._id 
        ? { ...ncr, root_cause: selectedNcr?.root_cause || 'Recorded', systemic_failure: data.systemic_failure } 
        : ncr
    );
    setNcrs(updatedNcrs);
    showNotification('Root cause recorded successfully', 'success');
    setOpenRootCauseModal(false);
    setSelectedNcr(null);
  };
  
  const handleActionAdded = (action) => {
    const updatedNcrs = ncrs.map(ncr =>
      ncr._id === selectedNcr?._id 
        ? { ...ncr, actions: [...(ncr.actions || []), action] } 
        : ncr
    );
    setNcrs(updatedNcrs);
    showNotification('Action added successfully', 'success');
    setOpenAddActionModal(false);
    setSelectedNcr(null);
  };
  
  const handleFinancialUpdated = (data) => {
    const updatedNcrs = ncrs.map(ncr =>
      ncr._id === selectedNcr?._id 
        ? { ...ncr, actual_loss: data.actual_loss, recovery_amount: data.recovery_amount, net_loss: data.net_loss } 
        : ncr
    );
    setNcrs(updatedNcrs);
    showNotification('Financial details updated', 'success');
    setOpenFinancialModal(false);
    setSelectedNcr(null);
  };
  
  const handleCapaLinked = (data) => {
    const updatedNcrs = ncrs.map(ncr =>
      ncr._id === selectedNcr?._id 
        ? { ...ncr, capa_id: data.capa_id, status: 'CAPA Initiated' } 
        : ncr
    );
    setNcrs(updatedNcrs);
    showNotification(`CAPA ${data.capa_id} linked successfully`, 'success');
    setOpenLinkCapaModal(false);
    setSelectedNcr(null);
  };
  
  const handleNcrClosed = (data) => {
    const updatedNcrs = ncrs.map(ncr =>
      ncr._id === selectedNcr?._id 
        ? { ...ncr, status: 'Closed', closed_at: data.closed_at } 
        : ncr
    );
    setNcrs(updatedNcrs);
    showNotification(`NCR ${data.ncr_number} closed successfully`, 'success');
    setOpenCloseModal(false);
    setSelectedNcr(null);
  };
  
  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch {
      return '-';
    }
  };
  
  const getSeverityColor = (severity) => COLORS.severity[severity] || COLORS.text.secondary;
  const getStatusColor = (status) => COLORS.status[status] || COLORS.text.secondary;
  const getNcrTypeColor = (type) => COLORS.ncrType[type] || COLORS.primary;
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Open': return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
      case 'Under Investigation': return <ScienceIcon sx={{ fontSize: '0.7rem' }} />;
      case 'Disposition Given': return <AssignmentLateIcon sx={{ fontSize: '0.7rem' }} />;
      case 'CAPA Initiated': return <LinkIcon sx={{ fontSize: '0.7rem' }} />;
      case 'Closed': return <ClosedIcon sx={{ fontSize: '0.7rem' }} />;
      default: return <WarningIcon sx={{ fontSize: '0.7rem' }} />;
    }
  };
  
  const getDefectCodeSummary = (defectCodes) => {
    if (!defectCodes || defectCodes.length === 0) return '-';
    if (defectCodes.length === 1) return defectCodes[0].code;
    return `${defectCodes[0].code} +${defectCodes.length - 1}`;
  };
  
  const paginatedNcrs = filteredNcrs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              NCR TYPE
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={ncrTypeFilter}
              onChange={(e) => setNcrTypeFilter(e.target.value)}
              sx={inputStyle}
            >
              {NCR_TYPE_OPTIONS.map(option => (
                <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
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
              <ToggleButton value="Open">Open</ToggleButton>
              <ToggleButton value="Closed">Closed</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
              DISPOSITION
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={dispositionFilter}
              onChange={(e) => setDispositionFilter(e.target.value)}
              sx={inputStyle}
            >
              {DISPOSITION_OPTIONS.map(option => (
                <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
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

  if (!permissionsLoaded) return <LoadingState />;
  if (!canViewPage && !isSuperAdmin) return <AccessDenied />;

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5 } }}>
      {/* Page Header */}
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
          Non-Conformance Report (NCR) Master
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, color: COLORS.text.secondary }}>
          Manage non-conformance reports for quality tracking and corrective actions
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
          {/* Search */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' }, flex: 2 }}>
            <TextField
              placeholder={isMobile ? "Search..." : "Search by NCR number, part no..."}
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

          {/* Desktop Filters */}
          {!isMobile && (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <TextField
                select
                size="small"
                label="NCR Type"
                value={ncrTypeFilter}
                onChange={(e) => setNcrTypeFilter(e.target.value)}
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
                {NCR_TYPE_OPTIONS.map(option => (
                  <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                select
                size="small"
                label="Severity"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                sx={{ 
                  width: 110,
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
                <ToggleButton value="Open">Open</ToggleButton>
                <ToggleButton value="Closed">Closed</ToggleButton>
              </ToggleButtonGroup>
              
              <TextField
                select
                size="small"
                label="Disposition"
                value={dispositionFilter}
                onChange={(e) => setDispositionFilter(e.target.value)}
                sx={{ 
                  width: 140,
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
                {DISPOSITION_OPTIONS.map(option => (
                  <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          )}

          {/* Action Buttons */}
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
                {isMobile ? 'Add' : 'Create NCR'}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Filter Drawer for Mobile */}
      <FilterDrawer />

      {/* NCRs Table */}
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
                      indeterminate={selected.length > 0 && selected.length < filteredNcrs.length}
                      checked={filteredNcrs.length > 0 && selected.length === filteredNcrs.length}
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
                      disabled={loading || filteredNcrs.length === 0}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  NCR Number
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Date
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Type
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Part Details
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Defect Codes
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
                  Disposition
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
                  <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading NCRs...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedNcrs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 10 : 9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm || ncrTypeFilter !== 'All' || severityFilter !== 'All' || statusFilter !== 'All' || dispositionFilter !== 'All'
                          ? 'No NCRs found' 
                          : 'No NCRs available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {(searchTerm || ncrTypeFilter !== 'All' || severityFilter !== 'All' || statusFilter !== 'All' || dispositionFilter !== 'All')
                          ? 'Try adjusting your filter criteria'
                          : 'Create your first NCR to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedNcrs.map((ncr, index) => {
                  const isSelected = selected.includes(ncr._id);
                  const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedNcrForAction?._id === ncr._id;
                  const severityColor = getSeverityColor(ncr.severity);
                  const statusColor = getStatusColor(ncr.status);
                  const ncrTypeColor = getNcrTypeColor(ncr.ncr_type);
                  const defectCodeSummary = getDefectCodeSummary(ncr.defect_codes);

                  return (
                    <TableRow
                      key={ncr._id || index}
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
                            onChange={() => handleSelect(ncr._id)}
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
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                          {ncr.ncr_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {formatDate(ncr.ncr_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ncr.ncr_type}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            height: 22,
                            bgcolor: `${ncrTypeColor}20`,
                            color: ncrTypeColor,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                            {ncr.part_no}
                          </Typography>
                          {ncr.lot_no && (
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Lot: {ncr.lot_no}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={ncr.defect_codes?.map(dc => `${dc.code} - ${dc.name}`).join(', ') || 'No defect codes'}>
                          <Chip
                            label={defectCodeSummary}
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
                          label={ncr.severity}
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
                        {ncr.disposition ? (
                          <Chip
                            label={ncr.disposition}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: 22,
                              bgcolor: COLORS.primaryLight,
                              color: COLORS.primary,
                              fontWeight: 500
                            }}
                          />
                        ) : (
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                            Pending
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(ncr.status)}
                          label={ncr.status}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            height: 22,
                            bgcolor: `${statusColor}20`,
                            color: statusColor,
                            fontWeight: 500,
                            '& .MuiChip-icon': {
                              fontSize: '0.7rem',
                              color: statusColor
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          ncr={ncr}
                          onAction={handleAction}
                          anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                          onClose={handleActionMenuClose}
                          onOpen={(e) => handleActionMenuOpen(e, ncr)}
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

        <TablePagination
          rowsPerPageOptions={isMobile ? [5, 10, 25] : [5, 10, 25, 50]}
          component="div"
          count={filteredNcrs.length}
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

      {/* Modals */}
      <AddNCR open={openAddModal} onClose={() => setOpenAddModal(false)} onNcrAdded={handleAddNcr} />
      
      {selectedNcr && (
        <>
          <ViewNcr open={openViewModal} onClose={() => { setOpenViewModal(false); setSelectedNcr(null); }} ncrId={selectedNcr._id} />
          {/* <EditNcr open={openEditModal} onClose={() => { setOpenEditModal(false); setSelectedNcr(null); }} ncrId={selectedNcr._id} onUpdate={handleEditNcr} /> */}
          <SetDisposition open={openDispositionModal} onClose={() => { setOpenDispositionModal(false); setSelectedNcr(null); }} ncrId={selectedNcr._id} ncrNumber={selectedNcr.ncr_number} onDispositionSet={handleDispositionSet} />
          <RecordRootCause open={openRootCauseModal} onClose={() => { setOpenRootCauseModal(false); setSelectedNcr(null); }} ncrId={selectedNcr._id} ncrNumber={selectedNcr.ncr_number} severity={selectedNcr.severity} onRootCauseRecorded={handleRootCauseRecorded} />
          <AddAction open={openAddActionModal} onClose={() => { setOpenAddActionModal(false); setSelectedNcr(null); }} ncrId={selectedNcr._id} ncrNumber={selectedNcr.ncr_number} severity={selectedNcr.severity} onActionAdded={handleActionAdded} />
          <NcrFinancialDetails open={openFinancialModal} onClose={() => { setOpenFinancialModal(false); setSelectedNcr(null); }} ncrId={selectedNcr._id} ncrNumber={selectedNcr.ncr_number} onFinancialUpdated={handleFinancialUpdated} />
          <LinkCapa open={openLinkCapaModal} onClose={() => { setOpenLinkCapaModal(false); setSelectedNcr(null); }} ncrId={selectedNcr._id} ncrNumber={selectedNcr.ncr_number} severity={selectedNcr.severity} systemicFailure={selectedNcr.systemic_failure} onCapaLinked={handleCapaLinked} />
          <CloseNcr open={openCloseModal} onClose={() => { setOpenCloseModal(false); setSelectedNcr(null); }} ncrId={selectedNcr._id} ncrNumber={selectedNcr.ncr_number} onNcrClosed={handleNcrClosed} />
          
          <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
            <DialogTitle>Delete NCR</DialogTitle>
            <DialogContent><DialogContentText>Are you sure you want to delete NCR {selectedNcr.ncr_number}?</DialogContentText></DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
              <Button onClick={() => handleDeleteNcr(selectedNcr._id)} color="error">Delete</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1.5 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NcrMaster;