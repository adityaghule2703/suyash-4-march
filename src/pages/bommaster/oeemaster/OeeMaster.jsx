// OeeMaster.jsx - UPDATED WITH PERMISSION CHECKS
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  TableSortLabel,
 
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Factory as FactoryIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';
import AddOee from './AddOee';
import EditOee from './EditOee';
import MachineLoading from './MachineLoading';
import MachineOEETrend from './MachineOEETrend';
import AddDowntime from './AddDowntime';
import DeleteOee from './DeleteOee';

const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  border: '#E3E8EF',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
};

const SHIFT_OPTIONS = ['All', 'General', 'Morning', 'Afternoon', 'Night'];

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

// Action Menu Component - WITH PERMISSION CHECKS
const ActionMenu = ({
  item,
  anchorEl,
  onOpen,
  onClose,
  onView,
  onEdit,
  onDelete,
  onLoadingAnalysis,
  onTrendAnalysis,
  onAddDowntime,
  permissions,
  isSuperAdmin
}) => {
  const canView = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.OEE_MASTER, ACTIONS.VIEW);
  const canUpdate = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.OEE_MASTER, ACTIONS.UPDATE);
  const canDelete = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.OEE_MASTER, ACTIONS.DELETE);
  const canCreate = isSuperAdmin || hasPermission(permissions, MODULES.BOM_MASTER, PAGES.OEE_MASTER, ACTIONS.CREATE);

  const hasAnyActions = canView || canUpdate || canDelete || canCreate;

  if (!hasAnyActions) return null;

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
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {/* Edit Record - UPDATE permission */}
        {canUpdate && (
          <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Edit Record
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Loading Analysis - VIEW permission */}
        {canView && (
          <MenuItem onClick={() => { onLoadingAnalysis(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <BarChartIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Loading Analysis
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* OEE Trend Analysis - VIEW permission */}
        {canView && (
          <MenuItem onClick={() => { onTrendAnalysis(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
              <TimelineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
                OEE Trend Analysis
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Log Downtime - CREATE permission */}
        {canCreate && (
          <MenuItem onClick={() => {
            onAddDowntime(item);
            onClose();
          }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
              <ScheduleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
                Log Downtime
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />

        {/* Delete Record - DELETE permission */}
        {canDelete && (
          <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
                Delete Record
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const OeeMaster = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRecordForAction, setSelectedRecordForAction] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [machines, setMachines] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null
  });
  const [machineFilter, setMachineFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('All');

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLoadingDialog, setOpenLoadingDialog] = useState(false);
  const [openTrendDialog, setOpenTrendDialog] = useState(false);
  const [openDowntimeModal, setOpenDowntimeModal] = useState(false);
  const [selectedRecordForDowntime, setSelectedRecordForDowntime] = useState(null);

  // Summary stats
  const [summary, setSummary] = useState({
    totalRecords: 0,
    avgOEE: 0,
    avgAvailability: 0,
    avgPerformance: 0,
    avgQuality: 0,
    totalDowntime: 0,
    excellentCount: 0,
    goodCount: 0,
    fairCount: 0,
    poorCount: 0
  });

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Ref for search debouncing
  const isSearchingRef = React.useRef(false);
  const searchTimeoutRef = React.useRef(null);

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

  // Check permission helper - USING CORRECT MODULE AND PAGE
  const checkPermission = (action) => {
    if (isSuperAdmin) return true;
    return hasPermission(userPermissions, MODULES.BOM_MASTER, PAGES.OEE_MASTER, action);
  };

  // Permission checks
  const canViewPage = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    isSearchingRef.current = true;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
      setPage(0);
      isSearchingRef.current = false;
    }, 500);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setPage(0);
    isSearchingRef.current = false;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Fetch machines on component mount
  const fetchMachines = useCallback(async () => {
    if (!canViewPage && !isSuperAdmin) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/machines`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setMachines(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching machines:', err);
      showNotification('Failed to load machines', 'error');
    }
  }, [canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchMachines();
    }
  }, [permissionsLoaded, canViewPage, isSuperAdmin, fetchMachines]);

  // Fetch records when dependencies change
  const fetchRecords = useCallback(async () => {
    if (!canViewPage && !isSuperAdmin) return;

    if (!isSearchingRef.current) {
      setLoading(true);
    }

    try {
      const token = localStorage.getItem('token');

      const params = new URLSearchParams();
      if (machineFilter && machineFilter !== 'all') {
        params.append('machine_id', machineFilter);
      }
      if (shiftFilter && shiftFilter !== 'All') params.append('shift', shiftFilter);
      if (dateRange.from) params.append('from', dateRange.from.toISOString().split('T')[0]);
      if (dateRange.to) params.append('to', dateRange.to.toISOString().split('T')[0]);
      if (searchTerm) params.append('search', searchTerm);
      params.append('page', page + 1);
      params.append('limit', rowsPerPage);

      const response = await axios.get(`${BASE_URL}/api/oee-records?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setRecords(response.data.data || []);
        setTotalItems(response.data.total || response.data.data.length);
        calculateSummary(response.data.data || []);
      } else {
        showNotification('Failed to load OEE records', 'error');
      }
    } catch (err) {
      console.error('Error fetching records:', err);
      showNotification('Failed to load OEE records', 'error');
    } finally {
      setLoading(false);
    }
  }, [machineFilter, page, rowsPerPage, searchTerm, dateRange.from, dateRange.to, shiftFilter, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchRecords();
    }
  }, [fetchRecords, permissionsLoaded, canViewPage, isSuperAdmin]);

  const calculateSummary = (data) => {
    if (!data || data.length === 0) {
      setSummary({
        totalRecords: 0,
        avgOEE: 0,
        avgAvailability: 0,
        avgPerformance: 0,
        avgQuality: 0,
        totalDowntime: 0,
        excellentCount: 0,
        goodCount: 0,
        fairCount: 0,
        poorCount: 0
      });
      return;
    }

    const totalRecords = data.length;
    const totalOEE = data.reduce((sum, record) => sum + (record.oee || 0), 0);
    const totalAvailability = data.reduce((sum, record) => sum + (record.availability || 0), 0);
    const totalPerformance = data.reduce((sum, record) => sum + (record.performance || 0), 0);
    const totalQuality = data.reduce((sum, record) => sum + (record.quality || 0), 0);
    const totalDowntime = data.reduce((sum, record) => sum + (record.total_downtime_min || 0), 0);

    let excellentCount = 0, goodCount = 0, fairCount = 0, poorCount = 0;
    data.forEach(record => {
      const oee = record.oee || 0;
      if (oee >= 85) excellentCount++;
      else if (oee >= 60) goodCount++;
      else if (oee >= 40) fairCount++;
      else poorCount++;
    });

    setSummary({
      totalRecords,
      avgOEE: Math.round((totalOEE / totalRecords) * 10) / 10,
      avgAvailability: Math.round((totalAvailability / totalRecords) * 10) / 10,
      avgPerformance: Math.round((totalPerformance / totalRecords) * 10) / 10,
      avgQuality: Math.round((totalQuality / totalRecords) * 10) / 10,
      totalDowntime,
      excellentCount,
      goodCount,
      fairCount,
      poorCount
    });
  };

  // Handle selection - only if user has delete permission
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    if (event.target.checked) {
      setSelected(records.map(record => record._id));
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };

  const handleAddRecord = () => {
    if (!canCreate) {
      showNotification('You don\'t have permission to add OEE records', 'error');
      return;
    }
    setOpenAddModal(true);
  };

  const handleAddSuccess = () => {
    fetchRecords();
    showNotification('OEE record added successfully!', 'success');
  };

  const handleEditSuccess = () => {
    fetchRecords();
    showNotification('OEE record updated successfully!', 'success');
  };

  const handleDeleteSuccess = () => {
    fetchRecords();
    setSelected([]);
    showNotification('OEE record deleted successfully!', 'success');
  };

  const handleActionMenuOpen = (event, record) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRecordForAction(record);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRecordForAction(null);
  };

  const openViewRecordModal = (record) => {
    if (!canViewPage) {
      showNotification('You don\'t have permission to view OEE record details', 'error');
      return;
    }
    setSelectedRecord(record);
    setOpenViewModal(true);
    handleActionMenuClose();
  };

  const openDeleteRecordDialog = (record) => {
    if (!canDelete) {
      showNotification('You don\'t have permission to delete OEE records', 'error');
      return;
    }
    setSelectedRecord(record);
    setOpenDeleteDialog(true);
    handleActionMenuClose();
  };

  const openEditRecordModal = (record) => {
    if (!canUpdate) {
      showNotification('You don\'t have permission to edit OEE records', 'error');
      return;
    }
    setSelectedRecord(record);
    setOpenEditModal(true);
    handleActionMenuClose();
  };

  const openLoadingAnalysis = (record) => {
    if (!canViewPage) {
      showNotification('You don\'t have permission to view loading analysis', 'error');
      return;
    }
    const normalizedRecord = {
      ...record,
      machine_id: record.machine_id?._id || record.machine_id
    };
    setSelectedRecord(normalizedRecord);
    setOpenLoadingDialog(true);
    handleActionMenuClose();
  };

  const openTrendAnalysis = (record) => {
    if (!canViewPage) {
      showNotification('You don\'t have permission to view trend analysis', 'error');
      return;
    }
    const normalizedRecord = {
      ...record,
      machine_id: record.machine_id?._id || record.machine_id
    };
    setSelectedRecord(normalizedRecord);
    setOpenTrendDialog(true);
    handleActionMenuClose();
  };

  const openDowntimeModalFunc = (record) => {
    if (!canCreate) {
      showNotification('You don\'t have permission to log downtime', 'error');
      return;
    }
    setSelectedRecordForDowntime(record);
    setOpenDowntimeModal(true);
    handleActionMenuClose();
  };

  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/oee-records/bulk-delete`,
        { ids: selected },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setSelected([]);

      if (records.length === selected.length && page > 0) {
        setPage(prev => prev - 1);
      }
      fetchRecords();
      showNotification(`${selected.length} OEE record(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Bulk delete error:', err);
      showNotification('Failed to delete OEE records', 'error');
    } finally {
      setLoading(false);
    }
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

  const getOEEStatus = (oee) => {
    if (oee >= 85) return { label: 'Excellent', color: COLORS.success, icon: CheckCircleIcon };
    if (oee >= 60) return { label: 'Good', color: COLORS.primary, icon: SpeedIcon };
    if (oee >= 40) return { label: 'Fair', color: COLORS.warning, icon: WarningIcon };
    return { label: 'Poor', color: COLORS.error, icon: WarningIcon };
  };

  const getMachineName = (machineId) => {
    const id = machineId?._id || machineId;
    if (!id) return 'N/A';
    const machine = machines.find(m => m._id === id);
    return machine ? `${machine.machine_name} (${machine.machine_code})` : 'N/A';
  };

  const getRecordInitials = (record) => {
    const id = record.machine_id?._id || record.machine_id;
    if (!id) return 'OE';
    const machine = machines.find(m => m._id === id);
    if (machine) {
      return machine.machine_name.substring(0, 2).toUpperCase();
    }
    return 'OE';
  };

  const getAvatarColor = (record) => {
    const colors = [COLORS.primary, '#074346', '#0D696C', '#128C7E', '#1A9E8F'];
    const id = record.machine_id?._id || record.machine_id;
    if (!id) return COLORS.primary;
    const machine = machines.find(m => m._id === id);
    if (machine) {
      const charCode = machine.machine_name?.charCodeAt(0) || 0;
      return colors[charCode % colors.length];
    }
    return COLORS.primary;
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setShiftFilter('All');
    setMachineFilter('all');
    setDateRange({
      from: null,
      to: null
    });
    setPage(0);
    isSearchingRef.current = false;
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            OEE Records
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
            Track and analyze Overall Equipment Effectiveness for all machines
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
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {/* Filters Row */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <TextField
                placeholder="Search..."
                size="small"
                value={searchInput}
                onChange={handleSearchChange}
                autoComplete="off"
                sx={{ width: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchInput && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearSearch}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { height: 32, bgcolor: COLORS.background.light, fontSize: '0.7rem' }
                }}
              />
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel sx={{ fontSize: '0.7rem' }}>Machine</InputLabel>
                <Select
                  value={machineFilter}
                  onChange={(e) => setMachineFilter(e.target.value)}
                  label="Machine"
                  sx={{ height: 32, fontSize: '0.7rem' }}
                >
                  <MenuItem value="all" sx={{ fontSize: '0.7rem' }}>All Machines</MenuItem>
                  {machines.map((machine) => (
                    <MenuItem key={machine._id} value={machine._id} sx={{ fontSize: '0.7rem' }}>
                      {machine.machine_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 85 }}>
                <InputLabel sx={{ fontSize: '0.7rem' }}>Shift</InputLabel>
                <Select
                  value={shiftFilter}
                  onChange={(e) => setShiftFilter(e.target.value)}
                  label="Shift"
                  sx={{ height: 32, fontSize: '0.7rem' }}
                >
                  {SHIFT_OPTIONS.map(shift => (
                    <MenuItem key={shift} value={shift} sx={{ fontSize: '0.7rem' }}>{shift}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                type="date"
                size="small"
                value={dateRange.from ? dateRange.from.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value ? new Date(e.target.value) : null }))}
                sx={{
                  width: 120,
                  '& .MuiInputBase-root': { height: 32 },
                  '& .MuiInputBase-input': { fontSize: '0.7rem', py: 0.5 }
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start" sx={{ mr: 0.5 }}><CalendarIcon sx={{ fontSize: '0.8rem' }} /></InputAdornment>
                }}
                inputProps={{ placeholder: 'From Date' }}
              />

              <TextField
                type="date"
                size="small"
                value={dateRange.to ? dateRange.to.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value ? new Date(e.target.value) : null }))}
                sx={{
                  width: 120,
                  '& .MuiInputBase-root': { height: 32 },
                  '& .MuiInputBase-input': { fontSize: '0.7rem', py: 0.5 }
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start" sx={{ mr: 0.5 }}><CalendarIcon sx={{ fontSize: '0.8rem' }} /></InputAdornment>
                }}
                inputProps={{ placeholder: 'To Date' }}
              />

              <Button
                size="small"
                onClick={handleClearFilters}
                sx={{ height: 32, textTransform: 'none', fontSize: '0.7rem', whiteSpace: 'nowrap', px: 1.5, minWidth: 'auto' }}
              >
                Clear
              </Button>
            </Stack>

            {/* Action Buttons */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<RefreshIcon sx={{ fontSize: '0.8rem' }} />}
                onClick={fetchRecords}
                sx={{ height: 32, borderRadius: 1.5, textTransform: 'none', fontSize: '0.7rem', whiteSpace: 'nowrap', px: 1.5 }}
                disabled={loading}
              >
                Refresh
              </Button>

              {/* Bulk Delete Button - DELETE permission */}
              {canDelete && selected.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon sx={{ fontSize: '0.8rem' }} />}
                  onClick={handleBulkDelete}
                  sx={{ height: 32, borderRadius: 1.5, textTransform: 'none', fontSize: '0.7rem', whiteSpace: 'nowrap', px: 1.5 }}
                  disabled={loading}
                >
                  Delete ({selected.length})
                </Button>
              )}

              {/* Add OEE Button - CREATE permission */}
              {canCreate && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon sx={{ fontSize: '0.8rem' }} />}
                  onClick={handleAddRecord}
                  sx={{ height: 32, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', whiteSpace: 'nowrap', px: 1.5 }}
                >
                  Add OEE
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>

        {/* Records Table */}
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
                  {/* Checkbox Column - DELETE permission */}
                  {canDelete && (
                    <TableCell padding="checkbox" sx={{ width: 40 }}>
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < records.length}
                        checked={records.length > 0 && selected.length === records.length}
                        onChange={handleSelectAll}
                        sx={{
                          color: COLORS.text.light,
                          '&.Mui-checked': { color: COLORS.text.light },
                          '&.MuiCheckbox-indeterminate': { color: COLORS.text.light },
                          '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                        }}
                        disabled={loading || records.length === 0}
                      />
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    OEE Record ID / Machine
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    OEE Metrics
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    Production
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 80 }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                        Loading OEE records...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <AssessmentIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                        <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                          {searchTerm ? 'No OEE records found' : 'No OEE records available'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                          {searchTerm ? 'Try adjusting your search terms' : 'Add your first OEE record to get started'}
                        </Typography>
                        {canCreate && (
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddRecord}
                            sx={{ mt: 2 }}
                          >
                            Add OEE Record
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => {
                    const isSelected = selected.includes(record._id);
                    const isActionMenuOpen = Boolean(actionMenuAnchor) && selectedRecordForAction?._id === record._id;
                    const recordStatus = getOEEStatus(record.oee);
                    const RecordStatusIcon = recordStatus.icon;
                    const avatarColor = getAvatarColor(record);
                    const machineInitials = getRecordInitials(record);

                    return (
                      <TableRow
                        key={record._id}
                        hover
                        selected={isSelected}
                        sx={{
                          bgcolor: COLORS.background.white,
                          '&:hover': { bgcolor: COLORS.background.hover },
                          '&.Mui-selected': { bgcolor: `${COLORS.primary}10` },
                          '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border }
                        }}
                      >
                        {canDelete && (
                          <TableCell padding="checkbox" sx={{ width: 40 }}>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleSelect(record._id)}
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
                            <Avatar sx={{ width: 36, height: 36, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                              {machineInitials}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                {getMachineName(record.machine_id)}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                {record.shift} Shift • {formatDate(record.date)}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography sx={{ fontWeight: 600, color: recordStatus.color }}>
                              {record.oee}%
                            </Typography>
                            <RecordStatusIcon sx={{ fontSize: '0.9rem', color: recordStatus.color }} />
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <Chip label={`A:${record.availability}%`} size="small" sx={{ fontSize: '0.6rem', height: 20 }} />
                            <Chip label={`P:${record.performance}%`} size="small" sx={{ fontSize: '0.6rem', height: 20 }} />
                            <Chip label={`Q:${record.quality}%`} size="small" sx={{ fontSize: '0.6rem', height: 20 }} />
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem' }}>
                            Good: {record.good_qty}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            Total: {record.total_qty} • Downtime: {record.total_downtime_min}min
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={recordStatus.label}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: 24,
                              bgcolor: `${recordStatus.color}15`,
                              color: recordStatus.color,
                              border: `1px solid ${recordStatus.color}30`
                            }}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ width: 80 }}>
                          <ActionMenu
                            item={record}
                            anchorEl={isActionMenuOpen ? actionMenuAnchor : null}
                            onOpen={(e) => handleActionMenuOpen(e, record)}
                            onClose={handleActionMenuClose}
                            onView={openViewRecordModal}
                            onEdit={openEditRecordModal}
                            onDelete={openDeleteRecordDialog}
                            onLoadingAnalysis={openLoadingAnalysis}
                            onTrendAnalysis={openTrendAnalysis}
                            onAddDowntime={openDowntimeModalFunc}
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
              '& .MuiTablePagination-select': { fontSize: '0.7rem' },
              '& .MuiTablePagination-actions button': { color: COLORS.primary }
            }}
          />
        </Paper>

        {/* Modal Components - Only render if user has appropriate permissions */}
        {canCreate && (
          <AddOee
            open={openAddModal}
            onClose={() => setOpenAddModal(false)}
            onAdd={handleAddSuccess}
          />
        )}

        {/* View Record Dialog - VIEW permission */}
        {canViewPage && selectedRecord && (
          <Dialog
            open={openViewModal}
            onClose={() => setOpenViewModal(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: { borderRadius: 2, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }
            }}
          >
            <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.light }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 600 }}>OEE Record Details</Typography>
                <IconButton onClick={() => setOpenViewModal(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: COLORS.primary }}>
                      Basic Information
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Machine</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{getMachineName(selectedRecord.machine_id)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Date</Typography>
                        <Typography variant="body2">{formatDate(selectedRecord.date)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Shift</Typography>
                        <Chip label={selectedRecord.shift} size="small" sx={{ mt: 0.5 }} />
                      </Box>
                      {selectedRecord.notes && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Notes</Typography>
                          <Typography variant="body2">{selectedRecord.notes}</Typography>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: COLORS.primary }}>
                      Production Data
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Planned Time:</Typography>
                        <Typography variant="body2">{selectedRecord.planned_production_time} min</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Actual Run Time:</Typography>
                        <Typography variant="body2">{selectedRecord.actual_run_time} min</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Theoretical Capacity:</Typography>
                        <Typography variant="body2">{selectedRecord.theoretical_capacity} units</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Total Quantity:</Typography>
                        <Typography variant="body2">{selectedRecord.total_qty} units</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Good Quantity:</Typography>
                        <Typography variant="body2">{selectedRecord.good_qty} units</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: COLORS.primary }}>
                      OEE Metrics
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Availability</Typography>
                          <Typography variant="h6" sx={{ color: COLORS.primary }}>{selectedRecord.availability}%</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Performance</Typography>
                          <Typography variant="h6" sx={{ color: COLORS.primary }}>{selectedRecord.performance}%</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Quality</Typography>
                          <Typography variant="h6" sx={{ color: COLORS.primary }}>{selectedRecord.quality}%</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Overall OEE</Typography>
                          <Typography variant="h6" sx={{ color: getOEEStatus(selectedRecord.oee).color }}>
                            {selectedRecord.oee}%
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ borderTop: `1px solid ${COLORS.border}`, p: 1.5 }}>
              <Button onClick={() => setOpenViewModal(false)} size="small">Close</Button>
              {canUpdate && (
                <Button variant="contained" onClick={() => {
                  setOpenViewModal(false);
                  openEditRecordModal(selectedRecord);
                }} size="small">Edit Record</Button>
              )}
            </DialogActions>
          </Dialog>
        )}

        {/* Edit OEE Dialog - UPDATE permission */}
        {canUpdate && selectedRecord && (
          <EditOee
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            onUpdate={handleEditSuccess}
            recordData={selectedRecord}
          />
        )}

        {/* Delete OEE Dialog - DELETE permission */}
        {canDelete && selectedRecord && (
          <DeleteOee
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedRecord(null);
            }}
            onDelete={handleDeleteSuccess}
            recordData={selectedRecord}
          />
        )}

        {/* Machine Loading Analysis Dialog - VIEW permission */}
        {canViewPage && (
          <MachineLoading
            open={openLoadingDialog}
            onClose={() => setOpenLoadingDialog(false)}
            machineId={selectedRecord?.machine_id}
            machineName={getMachineName(selectedRecord?.machine_id)}
          />
        )}

        {/* OEE Trend Analysis Dialog - VIEW permission */}
        {canViewPage && (
          <MachineOEETrend
            open={openTrendDialog}
            onClose={() => setOpenTrendDialog(false)}
            machineId={selectedRecord?.machine_id}
          />
        )}

        {/* Add Downtime Dialog - CREATE permission */}
        {canCreate && (
          <AddDowntime
            open={openDowntimeModal}
            onClose={() => {
              setOpenDowntimeModal(false);
              setSelectedRecordForDowntime(null);
            }}
            onAdd={(data) => {
              fetchRecords();
            }}
            oeeRecordId={selectedRecordForDowntime?._id}
            machineName={getMachineName(selectedRecordForDowntime?.machine_id)}
            recordDate={selectedRecordForDowntime?.date}
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
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default OeeMaster;