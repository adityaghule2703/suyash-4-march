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
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  ReportProblem as ConflictIcon,
  Factory as MachineIcon,
  Assignment as WOIcon,
  DateRange as DateIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { hasPermission, ACTIONS, MODULES, PAGES } from '../../../utils/modulePermissions';

// Professional Color Scheme (matching OrderBook)
const COLORS = {
  primary: '#063C3F',
  primaryDark: '#05292B',
  primaryLight: '#E8F0F1',
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
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  info: '#0288D1'
};

const SHIFT_OPTIONS = ['All', 'General', 'Morning', 'Evening', 'Night'];

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

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { bg: '#D1FAE5', color: '#059669', label: 'Completed' };
      case 'in progress':
        return { bg: '#E0F2FE', color: '#0284C7', label: 'In Progress' };
      case 'planned':
        return { bg: '#FEF3C7', color: '#D97706', label: 'Planned' };
      default:
        return { bg: '#F1F5F9', color: '#475569', label: status || 'Unknown' };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontSize: '0.65rem',
        fontWeight: 600,
        height: 24,
        borderRadius: '6px'
      }}
    />
  );
};

// Shift Chip Component
const ShiftChip = ({ shift }) => {
  const getShiftConfig = () => {
    switch (shift?.toLowerCase()) {
      case 'general':
        return { bg: '#E0E7FF', color: '#4338CA', label: 'General' };
      case 'morning':
        return { bg: '#FEF3C7', color: '#D97706', label: 'Morning' };
      case 'evening':
        return { bg: '#FCE7F3', color: '#BE185D', label: 'Evening' };
      case 'night':
        return { bg: '#E0E7FF', color: '#3730A3', label: 'Night' };
      default:
        return { bg: '#F1F5F9', color: '#475569', label: shift || 'Unknown' };
    }
  };

  const config = getShiftConfig();

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontSize: '0.6rem',
        fontWeight: 500,
        height: 20,
        borderRadius: '4px'
      }}
    />
  );
};

// View Conflict Details Dialog
const ViewConflictDialog = ({ open, onClose, schedule }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!schedule) return null;

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getMachineName = () => {
    if (typeof schedule.machine_id === 'object') {
      return schedule.machine_id?.machine_name || schedule.machine_id?.machine_code || '-';
    }
    return schedule.machine_id || '-';
  };

  const getMachineCode = () => {
    if (typeof schedule.machine_id === 'object') {
      return schedule.machine_id?.machine_code || '-';
    }
    return '-';
  };

  const getWONumber = () => {
    if (typeof schedule.wo_id === 'object') {
      return schedule.wo_id?.wo_number || '-';
    }
    return schedule.wo_id || '-';
  };

  const getPartNo = () => {
    if (typeof schedule.wo_id === 'object') {
      return schedule.wo_id?.part_no || schedule.part_no || '-';
    }
    return schedule.part_no || '-';
  };

  const getPartName = () => {
    if (typeof schedule.wo_id === 'object') {
      return schedule.wo_id?.part_name || '-';
    }
    return '-';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '85vh',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.tableHeader,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <ConflictIcon sx={{ color: COLORS.text.light }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: COLORS.text.light }}>
              Schedule Conflict Details
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>
              {schedule.schedule_id} • {getMachineName()}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.text.light }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          px: 2,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            minHeight: 44
          },
          '& .MuiTabs-indicator': {
            backgroundColor: COLORS.primary
          }
        }}
      >
        <Tab label="Schedule Info" icon={<ScheduleIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" />
        <Tab label="Work Order" icon={<WOIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" />
        <Tab label="Machine Details" icon={<MachineIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" />
      </Tabs>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light }}>
        {/* Schedule Info Tab */}
        {activeTab === 0 && (
          <Stack spacing={2.5}>
            <Alert severity="warning" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                Schedule Conflict Detected
              </Typography>
              <Typography sx={{ fontSize: '0.7rem' }}>
                This schedule overlaps with another production schedule on the same machine.
              </Typography>
            </Alert>

            <Paper sx={{ p: 2, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, textTransform: 'uppercase' }}>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Schedule ID</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'monospace', mt: 0.5 }}>
                    {schedule.schedule_id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <StatusChip status={schedule.status} />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, textTransform: 'uppercase' }}>
                Schedule Timeline
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Scheduled Date</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>{formatDate(schedule.scheduled_date)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Shift</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <ShiftChip shift={schedule.shift} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Planned Hours</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>{schedule.planned_hours} hours</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Start Time</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>{schedule.start_time}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>End Time</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>{schedule.end_time}</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, textTransform: 'uppercase' }}>
                Audit Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Created At</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{formatDateTime(schedule.createdAt)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Last Updated</Typography>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>{formatDateTime(schedule.updatedAt)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        )}

        {/* Work Order Tab */}
        {activeTab === 1 && (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 2, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, textTransform: 'uppercase' }}>
                Work Order Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>WO Number</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mt: 0.5 }}>{getWONumber()}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Operation Sequence</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>Operation {schedule.operation_seq}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Part Number</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>{getPartNo()}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Part Name</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>{getPartName()}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Planned Quantity</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>{schedule.planned_qty} units</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        )}

        {/* Machine Details Tab */}
        {activeTab === 2 && (
          <Stack spacing={2.5}>
            <Paper sx={{ p: 2, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.primary, mb: 1.5, textTransform: 'uppercase' }}>
                Machine Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Machine Name</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mt: 0.5 }}>{getMachineName()}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.secondary }}>Machine Code</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>{getMachineCode()}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
        <Button onClick={onClose} sx={{ fontSize: '0.7rem', textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main ProductionConflict Component
const ProductionConflict = () => {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [shiftFilter, setShiftFilter] = useState('All');
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
      MODULES.PRODUCTION_MASTER,
      PAGES.PRODUCTION_CONFLICT_MASTER,
      action
    );
  };

  const canViewPage = checkPermission(ACTIONS.VIEW);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch conflicts
  const fetchConflicts = useCallback(async () => {
    if (!canViewPage && !isSuperAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });

      if (searchTerm) params.append('search', searchTerm);
      if (shiftFilter && shiftFilter !== 'All') params.append('shift', shiftFilter);

      const response = await axios.get(`${BASE_URL}/api/production-schedule/conflicts?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setConflicts(response.data.data || []);
        setTotalItems(response.data.count || response.data.data.length);
      } else {
        showNotification('Failed to load conflicts', 'error');
      }
    } catch (err) {
      console.error('Error fetching conflicts:', err);
      showNotification('Failed to load conflicts', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, shiftFilter, canViewPage, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canViewPage || isSuperAdmin)) {
      fetchConflicts();
    } else if (permissionsLoaded && !canViewPage && !isSuperAdmin) {
      setLoading(false);
    }
  }, [fetchConflicts, permissionsLoaded, canViewPage, isSuperAdmin]);

  const handleRefresh = () => {
    fetchConflicts();
    showNotification('Data refreshed', 'success');
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setShiftFilter('All');
    setPage(0);
  };

  const handleViewConflict = (conflict) => {
    setSelectedConflict(conflict);
    setOpenViewDialog(true);
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMachineName = (schedule) => {
    if (typeof schedule.machine_id === 'object') {
      return schedule.machine_id?.machine_name || schedule.machine_id?.machine_code || '-';
    }
    return schedule.machine_id || '-';
  };

  const getWONumber = (schedule) => {
    if (typeof schedule.wo_id === 'object') {
      return schedule.wo_id?.wo_number || '-';
    }
    return schedule.wo_id || '-';
  };

  const getPartNo = (schedule) => {
    if (typeof schedule.wo_id === 'object') {
      return schedule.wo_id?.part_no || schedule.part_no || '-';
    }
    return schedule.part_no || '-';
  };

  const getConflictInitials = (conflict) => {
    if (!conflict.schedule_id) return 'SC';
    return conflict.schedule_id.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (conflict) => {
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = conflict.schedule_id?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
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
          Production Schedule Conflicts
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          View and manage schedule conflicts across all production machines
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Conflicts</Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.error }}>{totalItems}</Typography>
                </Box>
                <ConflictIcon sx={{ fontSize: 32, color: COLORS.error, opacity: 0.7 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Affected Machines</Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.primary }}>
                    {new Set(conflicts.map(c => typeof c.machine_id === 'object' ? c.machine_id?._id : c.machine_id)).size}
                  </Typography>
                </Box>
                <MachineIcon sx={{ fontSize: 32, color: COLORS.primary, opacity: 0.7 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 2, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Pending Resolution</Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.warning }}>
                    {conflicts.filter(c => c.status !== 'Completed').length}
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 32, color: COLORS.warning, opacity: 0.7 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters Bar */}
      <Paper sx={{ 
        p: 1.5, 
        mb: 2.5, 
        borderRadius: 2,
        bgcolor: COLORS.background.white,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by schedule ID, WO number..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 300 },
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
                    color: COLORS.text.primary
                  }
                }
              }}
              disabled={loading}
            />

            <TextField
              select
              size="small"
              label="Shift"
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              sx={{ 
                minWidth: 120,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  height: 36
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.7rem',
                  transform: 'translate(14px, 10px) scale(1)'
                },
                '& .MuiInputLabel-shrink': {
                  transform: 'translate(14px, -6px) scale(0.75)'
                }
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      borderRadius: 1.5,
                      '& .MuiMenuItem-root': {
                        fontSize: '0.75rem'
                      }
                    }
                  }
                }
              }}
            >
              {SHIFT_OPTIONS.map(shift => (
                <MenuItem key={shift} value={shift}>{shift}</MenuItem>
              ))}
            </TextField>

            <Button 
              size="small" 
              onClick={clearFilters} 
              sx={{ 
                height: 36, 
                textTransform: 'none', 
                fontSize: '0.7rem',
                color: COLORS.text.secondary,
                '&:hover': {
                  bgcolor: COLORS.background.hover
                }
              }}
            >
              Clear Filters
            </Button>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Refresh">
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
                <RefreshIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>

      {/* Conflicts Table */}
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
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Schedule ID / Machine
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Work Order / Part
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Schedule Details
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Shift / Time
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', width: 60 }} align="center">
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
                      Loading conflicts...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : conflicts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckCircleIcon sx={{ fontSize: 48, color: COLORS.success, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm || shiftFilter !== 'All' ? 'No conflicts found' : 'No Schedule Conflicts'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm || shiftFilter !== 'All' 
                          ? 'Try adjusting your search or filter criteria' 
                          : 'All production schedules are properly arranged'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                conflicts.map((conflict) => {
                  const avatarColor = getAvatarColor(conflict);
                  
                  return (
                    <TableRow
                      key={conflict._id}
                      hover
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': { bgcolor: COLORS.background.hover },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getConflictInitials(conflict)}
                          </Avatar>
                          <Box>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <WarningIcon sx={{ fontSize: '0.7rem', color: COLORS.warning }} />
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, fontFamily: 'monospace' }}>
                                {conflict.schedule_id}
                              </Typography>
                            </Stack>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {getMachineName(conflict)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {getWONumber(conflict)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {getPartNo(conflict)} • Op {conflict.operation_seq}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem' }}>
                          {formatDate(conflict.scheduled_date)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Qty: {conflict.planned_qty} units • {conflict.planned_hours}h
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <ShiftChip shift={conflict.shift} />
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                          {conflict.start_time} - {conflict.end_time}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={conflict.status} />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewConflict(conflict)}
                            sx={{ 
                              color: COLORS.primary,
                              '&:hover': {
                                bgcolor: `${COLORS.primary}10`
                              }
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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

      {/* View Conflict Dialog */}
      <ViewConflictDialog
        open={openViewDialog}
        onClose={() => { 
          setOpenViewDialog(false); 
          setSelectedConflict(null); 
        }}
        schedule={selectedConflict}
      />

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
  );
};

export default ProductionConflict;